# OwnerView — Design Tokens

The source of truth for OwnerView's visual language: warm, understated luxury —
off-white surfaces, near-black text, one sand accent, color reserved for status.
Light mode, iOS-first.

These are **design data, not components.** They describe *what* the values are so
your React Native UI can reference them consistently. No app/layout code here.

## Files

| File | Contains |
|------|----------|
| `colors.ts` | Surfaces, text, hairline, sand accent, `statusColor`, `actionColor` |
| `spacing.ts` | 4-based `spacing` scale + semantic `layout` spacings |
| `radii.ts` | `radius` — buttons 12, cards/sheets 12–16, pills 999 |
| `typography.ts` | Inter type ramp as partial `TextStyle`s (weights 400 / 500) |
| `index.ts` | Barrel export + a combined `tokens` object (default export) |

## Usage

```ts
import { StyleSheet } from 'react-native';
import { color, spacing, radius, typography, statusColor } from './tokens';

const styles = StyleSheet.create({
  card: {
    backgroundColor: color.surface,
    borderColor: color.hairline,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radius.card,
    padding: spacing.lg,
  },
  title: typography.cardTitle,
  pendingPill: {
    backgroundColor: statusColor.pending.bg,
    borderRadius: radius.pill,
  },
  pendingPillText: { ...typography.pill, color: statusColor.pending.text },
});
```

## Notes

- **Units:** spacing and radius are plain numbers (React Native density-independent
  pixels). Colors are hex / rgba strings.
- **Fonts:** load Inter (e.g. `@expo-google-fonts/inter` or bundled `.ttf`s).
  On iOS `fontWeight` works against a single Inter family; on Android map weights
  to named files (`Inter-Regular`, `Inter-Medium`) via `fontFamily`.
- **Hairlines, not shadows.** Borders use `color.hairline` at
  `StyleSheet.hairlineWidth`. Avoid heavy material drop-shadows.
- **Status is the only place color gets loud** — Pending (sand/brown), Approved
  (teal), Denied (red). Everything else stays neutral.

## Companion reference

`../share/OwnerView-screens.html` — a standalone, offline-openable file of all the
designed screens (push, Face ID, case list + skeleton, case detail, deny sheet,
approved). Open it in a browser to read structure, spacing, and token usage in
context while building.
