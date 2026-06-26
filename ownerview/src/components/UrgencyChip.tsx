import { StyleSheet, View } from 'react-native';

import { formatCheckIn } from '@/core';
import { color, radius, spacing } from '@/tokens';

import { AppText } from './AppText';

/** Sand chip that signals a soon guest check-in, e.g. "Guest checks in Fri". */
export function UrgencyChip({ checkInISO }: { checkInISO: string }) {
  return (
    <View style={styles.chip}>
      <AppText variant="pill" color={color.accentText}>
        Guest checks in {formatCheckIn(checkInISO)}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignSelf: 'flex-start',
    backgroundColor: color.accentSoft,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
});
