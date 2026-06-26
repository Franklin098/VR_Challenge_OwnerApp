import { useCallback, useMemo } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { sortCasesByUrgency, type Case } from '@/core';
import { useAuth } from '@/auth/AuthProvider';
import { AppText } from '@/components/AppText';
import { CaseCard } from '@/components/CaseCard';
import { CaseCardSkeleton } from '@/components/CaseCardSkeleton';
import { useCases } from '@/data/CasesProvider';
import { color, layout, spacing } from '@/tokens';

const HERO_CASE_ID = 'case-dishwasher-shockhill';
const SKELETON_KEYS = ['s1', 's2', 's3', 's4'];

export default function CasesListScreen() {
  const router = useRouter();
  const { lock } = useAuth();
  const { cases, isLoading, isRefreshing, refresh } = useCases();

  const sortedCases = useMemo(() => sortCasesByUrgency(cases), [cases]);
  const pendingCount = useMemo(
    () => cases.filter((maintenanceCase) => maintenanceCase.status === 'pending').length,
    [cases],
  );

  const openCase = useCallback(
    (id: string) => router.push({ pathname: '/cases/[id]', params: { id } }),
    [router],
  );

  // Demo: mimic tapping a push — deep-link to the case, then drop the lock so the
  // reviewer sees the full notify → Face ID → decide flow.
  const simulatePush = useCallback(() => {
    router.push({ pathname: '/cases/[id]', params: { id: HERO_CASE_ID } });
    lock();
  }, [router, lock]);

  const renderItem = useCallback(
    ({ item }: { item: Case }) => <CaseCard maintenanceCase={item} onPress={openCase} />,
    [openCase],
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={isLoading ? [] : sortedCases}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={ListSeparator}
        ListHeaderComponent={
          <ListHeader pendingCount={pendingCount} onSimulatePush={simulatePush} />
        }
        ListEmptyComponent={isLoading ? <ListLoading /> : <ListEmpty />}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={refresh} tintColor={color.textSecondary} />
        }
      />
    </SafeAreaView>
  );
}

function ListHeader({
  pendingCount,
  onSimulatePush,
}: {
  pendingCount: number;
  onSimulatePush: () => void;
}) {
  const subtitle =
    pendingCount === 0 ? 'All caught up' : `${pendingCount} need your approval`;

  return (
    <View style={styles.header}>
      <View style={styles.headerText}>
        <AppText variant="largeTitle">Maintenance</AppText>
        <AppText variant="meta" color={color.textSecondary}>
          {subtitle}
        </AppText>
      </View>
      <Pressable onPress={onSimulatePush} hitSlop={8} style={styles.pushButton}>
        <AppText variant="pill" color={color.accentText}>
          Simulate push
        </AppText>
      </Pressable>
    </View>
  );
}

function ListSeparator() {
  return <View style={styles.separator} />;
}

function ListLoading() {
  return (
    <View style={styles.skeletonGroup}>
      {SKELETON_KEYS.map((key) => (
        <CaseCardSkeleton key={key} />
      ))}
    </View>
  );
}

function ListEmpty() {
  return (
    <View style={styles.empty}>
      <AppText variant="body" color={color.textSecondary}>
        No maintenance cases right now.
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.background,
    flex: 1,
  },
  listContent: {
    paddingBottom: spacing.xxl,
    paddingHorizontal: layout.screenPaddingH,
  },
  header: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: spacing.lg,
    paddingTop: spacing.md,
  },
  headerText: {
    gap: spacing.xs,
  },
  pushButton: {
    backgroundColor: color.accentSoft,
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  separator: {
    height: layout.cardGap,
  },
  skeletonGroup: {
    gap: layout.cardGap,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
});
