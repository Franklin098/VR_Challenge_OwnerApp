import { StyleSheet, View } from 'react-native';

import { formatStatus, type CaseStatus } from '@/core';
import { radius, spacing, statusColor } from '@/tokens';

import { AppText } from './AppText';

export function StatusPill({ status }: { status: CaseStatus }) {
  const palette = statusColor[status];

  return (
    <View style={[styles.pill, { backgroundColor: palette.bg }]}>
      <AppText variant="pill" color={palette.text}>
        {formatStatus(status)}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    alignSelf: 'flex-start',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
});
