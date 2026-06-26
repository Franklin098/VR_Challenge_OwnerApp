import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';

import { formatMoney, type Case } from '@/core';
import { color, layout, radius, spacing } from '@/tokens';

import { AppText } from './AppText';
import { StatusPill } from './StatusPill';
import { UrgencyChip } from './UrgencyChip';

type CaseCardProps = {
  maintenanceCase: Case;
  onPress: (id: string) => void;
};

function CaseCardComponent({ maintenanceCase, onPress }: CaseCardProps) {
  const { id, title, status, property, estimatedCostCents, photos, guestContext } = maintenanceCase;
  const showUrgency = status === 'pending' && guestContext !== undefined;

  return (
    <Pressable
      onPress={() => onPress(id)}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <Image
        source={{ uri: photos[0] }}
        style={styles.thumbnail}
        contentFit="cover"
        transition={150}
      />
      <View style={styles.content}>
        <View style={styles.topRow}>
          <AppText variant="cardTitle" numberOfLines={1} style={styles.title}>
            {title}
          </AppText>
          <StatusPill status={status} />
        </View>

        <AppText variant="meta" color={color.textSecondary} numberOfLines={1}>
          {property.name} · {property.location}
        </AppText>

        <View style={styles.bottomRow}>
          <AppText variant="value">{formatMoney(estimatedCostCents)}</AppText>
          {showUrgency ? <UrgencyChip checkInISO={guestContext.nextCheckInISO} /> : null}
        </View>
      </View>
    </Pressable>
  );
}

export const CaseCard = memo(CaseCardComponent);

const styles = StyleSheet.create({
  card: {
    backgroundColor: color.surface,
    borderColor: color.hairline,
    borderRadius: radius.card,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    gap: spacing.md,
    padding: layout.cardPadding,
  },
  pressed: {
    opacity: 0.9,
  },
  thumbnail: {
    backgroundColor: color.surfaceInset,
    borderRadius: radius.cardSmall,
    height: 64,
    width: 64,
  },
  content: {
    flex: 1,
    gap: spacing.xs,
  },
  topRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  title: {
    flex: 1,
  },
  bottomRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
});
