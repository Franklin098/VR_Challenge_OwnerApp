import { Text, type TextProps } from 'react-native';

import { color, typography, type TypographyKey } from '@/tokens';

/** Maps a token font-weight to the matching loaded Inter family. */
const FAMILY_BY_WEIGHT: Record<string, string> = {
  '400': 'Inter_400Regular',
  '500': 'Inter_500Medium',
};

type AppTextProps = TextProps & {
  variant?: TypographyKey;
  color?: string;
};

/**
 * The single text component. Applies a typography token and resolves the right
 * Inter font file for its weight, so every label stays on-brand and consistent.
 */
export function AppText({
  variant = 'body',
  color: textColor = color.textPrimary,
  style,
  ...rest
}: AppTextProps) {
  const variantStyle = typography[variant];
  const fontFamily = FAMILY_BY_WEIGHT[variantStyle.fontWeight] ?? variantStyle.fontFamily;

  return <Text style={[variantStyle, { fontFamily, color: textColor }, style]} {...rest} />;
}
