/**
 * OwnerView design tokens
 * Single import surface for the whole token set.
 *
 *   import { color, spacing, radius, typography, statusColor } from './tokens';
 *   // or
 *   import tokens from './tokens';
 */

import { color, statusColor, actionColor } from './colors';
import { spacing, layout } from './spacing';
import { radius } from './radii';
import { typography, fontFamily, fontWeight } from './typography';

export { color, statusColor, actionColor } from './colors';
export { spacing, layout } from './spacing';
export { radius } from './radii';
export { typography, fontFamily, fontWeight } from './typography';

export type { StatusKey } from './colors';
export type { SpacingKey } from './spacing';
export type { RadiusKey } from './radii';
export type { TypographyKey } from './typography';

export const tokens = {
  color,
  statusColor,
  actionColor,
  spacing,
  layout,
  radius,
  typography,
  fontFamily,
  fontWeight,
} as const;

export default tokens;
