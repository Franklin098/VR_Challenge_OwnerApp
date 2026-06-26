/**
 * OwnerView — Spacing tokens
 * 4-based scale. Numbers are density-independent pixels (React Native units).
 * Comfortable padding inside cards is `lg` (16).
 */

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

/** Common semantic spacings used across the screens. */
export const layout = {
  screenPaddingH: 20, // horizontal screen gutter
  cardPadding: 16, // inside maintenance cards
  cardGap: 12, // gap between cards in the list
  safeAreaBottom: 24, // min bottom inset under sticky bars
} as const;

export type SpacingKey = keyof typeof spacing;
