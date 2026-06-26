import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/auth/AuthProvider';
import { AppText } from '@/components/AppText';
import { ActionButton } from '@/components/ActionButton';
import { color, radius, spacing } from '@/tokens';

/**
 * The lock gate shown over the app until the session is unlocked. Face ID is a
 * local lock over the stored session — not a fresh sign-in.
 */
export function LockScreen() {
  const { unlock, biometricMode } = useAuth();
  const [isUnlocking, setIsUnlocking] = useState(false);

  const handleUnlock = async () => {
    setIsUnlocking(true);
    try {
      await unlock();
    } finally {
      setIsUnlocking(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.hero}>
        <View style={styles.mark}>
          <AppText variant="screenTitle" color={color.textPrimary}>
            OV
          </AppText>
        </View>
        <AppText variant="largeTitle">OwnerView</AppText>
        <AppText variant="body" color={color.textSecondary} style={styles.subtitle}>
          Unlock to review and approve your maintenance cases.
        </AppText>
      </View>

      <View style={styles.footer}>
        <ActionButton
          label="Unlock with Face ID"
          variant="primary"
          onPress={handleUnlock}
          loading={isUnlocking}
        />
        <AppText variant="meta" color={color.textMuted} style={styles.hint}>
          {biometricMode === 'device'
            ? 'Uses Face ID or your device passcode.'
            : 'Simulated Face ID for this demo.'}
        </AppText>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.background,
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
  },
  hero: {
    alignItems: 'center',
    flex: 1,
    gap: spacing.md,
    justifyContent: 'center',
  },
  mark: {
    alignItems: 'center',
    backgroundColor: color.accent,
    borderRadius: radius.card,
    height: 72,
    justifyContent: 'center',
    marginBottom: spacing.sm,
    width: 72,
  },
  subtitle: {
    textAlign: 'center',
  },
  footer: {
    gap: spacing.md,
    paddingBottom: spacing.xl,
  },
  hint: {
    textAlign: 'center',
  },
});
