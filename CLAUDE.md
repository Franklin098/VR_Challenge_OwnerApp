# CLAUDE.md

Notes for working in this repo. Keep it simple.

## Golden rules

- Write code to last: maintainable and easy to extend.
- No quick hacks or shortcuts that we'll regret later.
- If something is unclear, ask first. Don't guess.

## What this is

OwnerView — a small React Native (Expo) app for property owners to review and
approve maintenance cases from their phone. There's a shared TypeScript core so a
Next.js web app could reuse the same logic later.

## How the code is organized

- `packages/core` — shared logic: types, validation, data access, business rules,
  and the data hooks. No UI here.
- `apps/mobile` — the Expo app: screens, navigation, styling, and anything that
  touches the device (SecureStore, Face ID, haptics).

Rule of thumb: anything that isn't pixels, navigation, or a device API belongs in
`core`. Don't copy logic between platforms — share it.

## Coding practices

- TypeScript strict. Fix type errors before calling something done.
- Validate data at the edges with Zod. Derive types from the schemas, don't write
  them twice.
- Keep functions small and named for what they do. Prefer clear code over clever code.
- Never put secrets in AsyncStorage. Tokens go in SecureStore. Store the Supabase
  refresh token, not the password.
- Access control lives in the database (Supabase RLS), not the client.
- The app must run cold in under 5 minutes. Mock data is the default so it works in
  Expo Go and the web with no keys.

## Design decisions (ADRs)

Write down the why, not just the what. Each real decision gets a short ADR in
`docs/adr/`, numbered, e.g. `0001-shared-core.md`. Keep them to a few lines:
context, the decision, what else we considered, and the trade-off.

Other docs live in `docs/`:

- `docs/design.md` — system design: data flow, auth, the shared-vs-mobile line.
- `docs/roadmap.md` — what's in v1, what's next, what we left out and why.

## Skills

Every time we touch the code, run the `/vercel-react-native-skills` and `/clean-code`
skills. They keep the React Native work performant and the code clean.

## Commits

Use Conventional Commits (`feat:`, `fix:`, `docs:`) and point to the ADR when one
applies.
