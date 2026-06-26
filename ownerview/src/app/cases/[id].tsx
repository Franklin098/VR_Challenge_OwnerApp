import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  formatCheckIn,
  formatMoney,
  formatOrigin,
  type Case,
} from '@/core';
import { ActionButton } from '@/components/ActionButton';
import { AppText } from '@/components/AppText';
import { InfoRow } from '@/components/InfoRow';
import { StatusPill } from '@/components/StatusPill';
import { useCases } from '@/data/CasesProvider';
import { successHaptic } from '@/lib/haptics';
import { color, layout, radius, spacing } from '@/tokens';

const decisionDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
});

export default function CaseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getById, approve, isLoading } = useCases();
  const [isApproving, setIsApproving] = useState(false);

  const maintenanceCase = getById(id);

  if (!maintenanceCase) {
    return (
      <View style={styles.centered}>
        <AppText variant="body" color={color.textSecondary}>
          {isLoading ? 'Loading case…' : 'Case not found.'}
        </AppText>
      </View>
    );
  }

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      await approve(maintenanceCase.id);
      successHaptic();
    } catch {
      Alert.alert('Could not approve', 'Something went wrong. Please try again.');
    } finally {
      setIsApproving(false);
    }
  };

  const handleDeny = () => {
    router.push({ pathname: '/deny/[id]', params: { id: maintenanceCase.id } });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <PhotoCarousel photos={maintenanceCase.photos} />

        <View style={styles.body}>
          <View style={styles.titleRow}>
            <AppText variant="screenTitle" style={styles.title}>
              {maintenanceCase.title}
            </AppText>
            <StatusPill status={maintenanceCase.status} />
          </View>
          <AppText variant="meta" color={color.textSecondary}>
            {maintenanceCase.property.name} · {maintenanceCase.property.location}
          </AppText>

          {maintenanceCase.status === 'pending' && maintenanceCase.guestContext ? (
            <GuestCallout checkInISO={maintenanceCase.guestContext.nextCheckInISO} />
          ) : null}

          <InfoBlock maintenanceCase={maintenanceCase} />

          <View style={styles.section}>
            <AppText variant="overline" color={color.textSecondary}>
              Description
            </AppText>
            <AppText variant="body" style={styles.description}>
              {maintenanceCase.description}
            </AppText>
          </View>

          {maintenanceCase.decision ? (
            <DecisionSummary maintenanceCase={maintenanceCase} />
          ) : null}
        </View>
      </ScrollView>

      {maintenanceCase.status === 'pending' ? (
        <ActionBar onApprove={handleApprove} onDeny={handleDeny} isApproving={isApproving} />
      ) : null}
    </View>
  );
}

function PhotoCarousel({ photos }: { photos: string[] }) {
  const { width } = useWindowDimensions();

  return (
    <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
      {photos.map((uri) => (
        <Image
          key={uri}
          source={{ uri }}
          style={{ width, height: 260, backgroundColor: color.surfaceInset }}
          contentFit="cover"
          transition={200}
        />
      ))}
    </ScrollView>
  );
}

function GuestCallout({ checkInISO }: { checkInISO: string }) {
  return (
    <View style={styles.callout}>
      <AppText variant="value" color={color.accentText}>
        Guest checks in {formatCheckIn(checkInISO)}
      </AppText>
      <AppText variant="meta" color={color.accentText}>
        Approve to unblock the repair before arrival.
      </AppText>
    </View>
  );
}

function InfoBlock({ maintenanceCase }: { maintenanceCase: Case }) {
  const { estimatedCostCents, category, origin, assignee, vendor } = maintenanceCase;

  return (
    <View style={styles.infoBlock}>
      <InfoRow label="Estimated cost" value={formatMoney(estimatedCostCents)} />
      <InfoRow label="Category" value={capitalize(category)} />
      <InfoRow label="Found via" value={formatOrigin(origin)} />
      <InfoRow label="Handled by" value={`${assignee.name} · ${assignee.role}`} />
      {vendor ? <InfoRow label="External vendor" value={vendor.company} /> : null}
    </View>
  );
}

function DecisionSummary({ maintenanceCase }: { maintenanceCase: Case }) {
  const { status, decision } = maintenanceCase;
  if (!decision) return null;

  const when = decisionDateFormatter.format(new Date(decision.atISO));

  return (
    <View style={styles.section}>
      <AppText variant="overline" color={color.textSecondary}>
        Decision
      </AppText>
      <AppText variant="body">
        {status === 'approved' ? `Approved on ${when}.` : `Denied on ${when}.`}
      </AppText>
      {decision.reason ? (
        <AppText variant="body" color={color.textSecondary} style={styles.description}>
          “{decision.reason}”
        </AppText>
      ) : null}
    </View>
  );
}

function ActionBar({
  onApprove,
  onDeny,
  isApproving,
}: {
  onApprove: () => void;
  onDeny: () => void;
  isApproving: boolean;
}) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.actionBar, { paddingBottom: Math.max(insets.bottom, spacing.lg) }]}>
      <View style={styles.actionButton}>
        <ActionButton label="Deny" variant="deny" onPress={onDeny} disabled={isApproving} />
      </View>
      <View style={styles.actionButton}>
        <ActionButton label="Approve" variant="approve" onPress={onApprove} loading={isApproving} />
      </View>
    </View>
  );
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.background,
    flex: 1,
  },
  centered: {
    alignItems: 'center',
    backgroundColor: color.background,
    flex: 1,
    justifyContent: 'center',
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  body: {
    gap: spacing.md,
    paddingHorizontal: layout.screenPaddingH,
    paddingTop: spacing.lg,
  },
  titleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  title: {
    flex: 1,
  },
  callout: {
    backgroundColor: color.accentSoft,
    borderRadius: radius.cardSmall,
    gap: spacing.xs,
    padding: layout.cardPadding,
  },
  infoBlock: {
    backgroundColor: color.surface,
    borderColor: color.hairline,
    borderRadius: radius.card,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: layout.cardPadding,
    paddingVertical: spacing.xs,
  },
  section: {
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  description: {
    lineHeight: 22,
  },
  actionBar: {
    backgroundColor: color.surface,
    borderTopColor: color.hairline,
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: layout.screenPaddingH,
    paddingTop: spacing.lg,
  },
  actionButton: {
    flex: 1,
  },
});
