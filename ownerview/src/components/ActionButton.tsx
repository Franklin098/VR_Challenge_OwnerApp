import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { actionColor, radius, spacing } from '@/tokens';

import { AppText } from './AppText';

type ActionVariant = 'approve' | 'deny' | 'primary';

type ActionButtonProps = {
  label: string;
  onPress: () => void;
  variant?: ActionVariant;
  disabled?: boolean;
  loading?: boolean;
};

function backgroundFor(variant: ActionVariant): string {
  if (variant === 'approve') return actionColor.approve.bg;
  if (variant === 'primary') return actionColor.primary.bg;
  return actionColor.deny.bg;
}

function foregroundFor(variant: ActionVariant): string {
  if (variant === 'approve') return actionColor.approve.text;
  if (variant === 'primary') return actionColor.primary.text;
  return actionColor.deny.text;
}

export function ActionButton({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
}: ActionButtonProps) {
  const foreground = foregroundFor(variant);
  const isDisabled = disabled || loading;
  const isOutlined = variant === 'deny';

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: backgroundFor(variant),
          borderColor: isOutlined ? actionColor.deny.border : 'transparent',
          borderWidth: isOutlined ? StyleSheet.hairlineWidth * 2 : 0,
          opacity: isDisabled ? 0.5 : pressed ? 0.85 : 1,
        },
      ]}
    >
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator color={foreground} />
        ) : (
          <AppText variant="value" color={foreground}>
            {label}
          </AppText>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: radius.button,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 24,
  },
});
