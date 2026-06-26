/**
 * OwnerView — Color tokens
 * Warm, understated luxury. Off-white surfaces, near-black text, a single sand
 * accent, restrained color used only for status. Light mode only.
 *
 * Values are plain hex / rgba strings — drop straight into React Native styles.
 */

export const color = {
  // Surfaces
  background: '#FAF9F7', // app background
  surface: '#FFFFFF', // cards / sheets
  surfaceInset: '#F5F5F3', // inset fields, inputs, wells

  // Text
  textPrimary: '#1A1A1A',
  textSecondary: '#6B7280',
  textMuted: '#9B9892', // tertiary meta inside cards

  // Lines
  hairline: 'rgba(0,0,0,0.10)', // 1px borders (use with StyleSheet.hairlineWidth)

  // Brand
  accent: '#D4BDA2', // sand — chips, highlights, selected states
  accentSoft: 'rgba(212,189,162,0.30)', // sand tint — urgency chip fill
  accentText: '#6B4F2C', // text on sand tint
} as const;

/** Status pill palettes (Pending / Approved / Denied). */
export const statusColor = {
  pending: { bg: '#FAEEDA', text: '#633806' },
  approved: { bg: '#E1F5EE', text: '#085041' },
  denied: { bg: '#F7E4E1', text: '#8B2C20' },
} as const;

/** Primary / secondary action button palettes. */
export const actionColor = {
  approve: { bg: '#085041', text: '#FFFFFF' }, // solid teal
  deny: { bg: '#FFFFFF', border: '#8B2C20', text: '#8B2C20' }, // outlined
  primary: { bg: '#1A1A1A', text: '#FFFFFF' }, // neutral primary (Unlock, Submit)
} as const;

export type StatusKey = keyof typeof statusColor;
