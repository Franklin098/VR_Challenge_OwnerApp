import { StyleSheet, View } from 'react-native';

import { color, layout, radius, spacing } from '@/tokens';

import { Skeleton } from './Skeleton';

/** Placeholder that mirrors the CaseCard layout while the list loads. */
export function CaseCardSkeleton() {
  return (
    <View style={styles.card}>
      <Skeleton width={64} height={64} borderRadius={radius.cardSmall} />
      <View style={styles.content}>
        <Skeleton width="70%" height={16} />
        <Skeleton width="55%" height={12} />
        <Skeleton width="35%" height={14} />
      </View>
    </View>
  );
}

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
  content: {
    flex: 1,
    gap: spacing.sm,
    justifyContent: 'center',
  },
});
