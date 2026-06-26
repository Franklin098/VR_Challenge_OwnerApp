/**
 * OwnerView — Typography tokens
 * Family: Inter. Weights 400 (body) and 500 (titles/labels — medium, never bold).
 *
 * Each style is a partial React Native TextStyle. `fontWeight` values are the
 * string literals RN expects. On Android you typically map weight -> a named
 * Inter font file (e.g. Inter-Regular / Inter-Medium); see README.
 */

export const fontFamily = {
  base: 'Inter',
} as const;

export const fontWeight = {
  regular: '400',
  medium: '500',
} as const;

export const typography = {
  /** Large list header (e.g. "Maintenance"). */
  largeTitle: { fontFamily: 'Inter', fontSize: 30, fontWeight: '500', lineHeight: 36, letterSpacing: -0.6 },
  /** Screen / detail title. */
  screenTitle: { fontFamily: 'Inter', fontSize: 22, fontWeight: '500', lineHeight: 28, letterSpacing: -0.2 },
  /** Card title (e.g. case name). */
  cardTitle: { fontFamily: 'Inter', fontSize: 16, fontWeight: '500', lineHeight: 20 },
  /** Section header. */
  sectionHeader: { fontFamily: 'Inter', fontSize: 16, fontWeight: '500', lineHeight: 22 },
  /** Body copy. */
  body: { fontFamily: 'Inter', fontSize: 14, fontWeight: '400', lineHeight: 21 },
  /** Emphasized value (cost, inline labels). */
  value: { fontFamily: 'Inter', fontSize: 15, fontWeight: '500', lineHeight: 20 },
  /** Secondary meta (property · location). */
  meta: { fontFamily: 'Inter', fontSize: 13, fontWeight: '400', lineHeight: 18 },
  /** Pills & chips. */
  pill: { fontFamily: 'Inter', fontSize: 12, fontWeight: '500', lineHeight: 16 },
  /** Overline / eyebrow label. */
  overline: { fontFamily: 'Inter', fontSize: 11, fontWeight: '500', lineHeight: 14, letterSpacing: 0.8, textTransform: 'uppercase' },
} as const;

export type TypographyKey = keyof typeof typography;
