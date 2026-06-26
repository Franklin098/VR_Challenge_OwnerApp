# Design Tokens

> Derived from LocalVR's own brand system (the tokens in their challenge brief
> `LocalVR_OwnerPortal_Challenge.html`): warm off-white surfaces, near-black text, a sand/tan
> accent, and amber/teal status pills. Kept deliberately small and flat so it's trivial to
> implement with React Native `StyleSheet` — no theming library needed.

## Palette

| Token | Hex | Use |
|---|---|---|
| `bg` | `#FAF9F7` | App background (warm off-white) |
| `surface` | `#FFFFFF` | Cards, sheets, list rows |
| `surfaceAlt` | `#F5F5F3` | Inset/secondary surface, skeletons base |
| `textPrimary` | `#1A1A1A` | Headings, body |
| `textSecondary` | `#6B7280` | Captions, metadata |
| `border` | `rgba(0,0,0,0.10)` | Hairline dividers, card borders |
| `accent` | `#D4BDA2` | Brand sand — chips, active states, highlights |
| `accentInk` | `#1A1A1A` | Text/icon on `accent` |

## Status (maps to `Case.status`)

| Status | Bg | Ink | Token name |
|---|---|---|---|
| `pending` | `#FAEEDA` | `#633806` | `status.pending` (amber) |
| `approved` | `#E1F5EE` | `#085041` | `status.approved` (teal) |
| `denied` | `#F7E4E1` | `#8B2C20` | `status.denied` (muted red — added; not in source palette but consistent with its muted tone) |

## Actions

| Action | Style |
|---|---|
| **Approve** (primary) | Solid `#085041` (brand teal) bg, `#FFFFFF` text — confident, reads as success |
| **Deny** (secondary/destructive) | `surface` bg, `1px border #8B2C20`, `#8B2C20` text — restrained, not alarming |

> Approve = teal solid carries the "success" meaning; Deny = red outline signals destructive
> without shouting. The sand `accent` stays for non-action brand moments (chips, selected row).

## Typography

- **Family: Inter** (LocalVR's brand font), with system fallback. Load locally via
  `@expo-google-fonts/inter` + `expo-font` so there's no network dependency on cold-run; if we'd
  rather skip the font step entirely, the system stack (`System` / SF / Roboto) is a clean
  fallback and keeps the 5-minute run trivial.
- Weights used: **400** (body), **500** (titles/labels — LocalVR uses medium, not bold).

| Role | Size | Weight | Token |
|---|---|---|---|
| Screen title | 22 | 500 | `type.title` |
| Section header | 16 | 500 | `type.heading` |
| Body | 14 | 400 | `type.body` |
| Label / meta | 13 | 400 | `type.meta` |
| Overline (uppercase, letterSpacing 0.8) | 11 | 500 | `type.overline` |

## Radius & spacing

- Radius: `sm 8` · `md 12` · `lg 16` · `pill 999`.
- Spacing scale (4-based): `xs 4 · sm 8 · md 12 · lg 16 · xl 24 · 2xl 32`.

## Reference theme object (for `packages/core`? No — lives app-side)

Tokens are **presentation**, so the theme constant lives in `apps/mobile` (e.g.
`apps/mobile/theme.ts`), not `packages/core`. Shape we'll implement:

```ts
export const theme = {
  color: {
    bg: '#FAF9F7', surface: '#FFFFFF', surfaceAlt: '#F5F5F3',
    textPrimary: '#1A1A1A', textSecondary: '#6B7280',
    border: 'rgba(0,0,0,0.10)', accent: '#D4BDA2', accentInk: '#1A1A1A',
    status: {
      pending:  { bg: '#FAEEDA', ink: '#633806' },
      approved: { bg: '#E1F5EE', ink: '#085041' },
      denied:   { bg: '#F7E4E1', ink: '#8B2C20' },
    },
    action: {
      approveBg: '#085041', approveInk: '#FFFFFF',
      denyInk: '#8B2C20', denyBorder: '#8B2C20',
    },
  },
  radius: { sm: 8, md: 12, lg: 16, pill: 999 },
  space:  { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 },
  font:   { regular: 'Inter_400Regular', medium: 'Inter_500Medium' },
} as const;
```

> Why app-side, not core: this is pixels, which is the platform side of our shared/native line.
> A future Next.js surface would map the *same hex values* into its own (Tailwind/CSS) theme —
> shared brand, platform-appropriate implementation.
