/**
 * OwnerView — Border-radius tokens
 * Cards/sheets 12–16, buttons 12, pills fully rounded.
 * Numbers are React Native units.
 */

export const radius = {
  button: 12,
  card: 16,
  cardSmall: 12, // thumbnails, small wells
  sheet: 16, // bottom-sheet top corners
  field: 12, // text inputs
  pill: 999, // status pills, chips
} as const;

export type RadiusKey = keyof typeof radius;
