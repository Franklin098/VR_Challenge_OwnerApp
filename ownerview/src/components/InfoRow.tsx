import { StyleSheet, View } from 'react-native';

import { color, spacing } from '@/tokens';

import { AppText } from './AppText';

/** A labelled value row used in the case-detail info block. */
export function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <AppText variant="meta" color={color.textSecondary}>
        {label}
      </AppText>
      <AppText variant="value" style={styles.value}>
        {value}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.lg,
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  value: {
    flexShrink: 1,
    textAlign: 'right',
  },
});
