# Implementation Guide — Iteration 1

> Companion to `design.md`. This is the **build order for the first runnable iteration**:
> the cold-runnable **Lock → List → Detail** happy path on mock data, with the shared `core`
> in place and the key write action (approve / deny) working optimistically.
>
> No code is written yet — this is the plan we execute against.

## Goal of iteration 1

A reviewer runs `expo start`, opens Expo Go (or web), unlocks, sees a smart-sorted case list
with skeletons, opens the dishwasher case, and **approves in one tap** (optimistic + haptic) or
**denies with a reason** (bottom sheet). All on mock data, no keys, **under 5 minutes cold**.

Out of scope for iteration 1 (→ later iterations): real Supabase adapter wiring, real push
registration, multi-property switcher, web surface, tests beyond the core domain functions.

---

## 0. Decision D0 — workspace shape (resolve before step 1)

The blueprint locks a **pnpm-workspace monorepo**; the scaffold is a single **npm** Expo app
with an existing `package-lock.json`.

**Recommendation: npm workspaces, not a pnpm conversion.**
- The scaffold already resolved on npm; converting to pnpm risks the 5-minute cold-run for zero
  reviewer-visible benefit.
- npm workspaces give the **same architectural proof** — a separate `packages/core` package
  with its own `package.json` and **zero React Native imports**, imported by the app via the
  workspace. That is what "genuinely shareable" means; the package manager is incidental.

**Action:** if we accept this, update `OwnerView-Blueprint.md` decision #8 (pnpm → npm
workspaces) with a one-line reason, per the "update the blueprint, don't drift" rule. If we
keep pnpm, do the conversion as step 0 before anything else.

Target layout either way:

```
VR_Challenge/
  package.json            ← workspace root ("workspaces": ["apps/*", "packages/*"])
  apps/mobile/            ← the current ownerview app, moved here
  packages/core/          ← new pure-TS shared package
```

> Note: the app currently lives at `ownerview/`. Moving it to `apps/mobile/` is part of step 1;
> if we'd rather not move it, the workspace can point at `ownerview` directly and add
> `packages/core` beside it. Confirm the move before executing.

---

## Dependencies to add

**`packages/core`** (pure TS): `zod`, `@tanstack/react-query`. (Supabase client added later,
not iteration 1.)

**app**: `expo-secure-store`, `expo-local-authentication`, `expo-haptics`,
`@gorhom/bottom-sheet` (already has `react-native-reanimated` + `react-native-gesture-handler`,
its peers). `@tanstack/react-query` provider lives in the app, hooks live in core.

> Pin to the SDK 56 versions via `npx expo install` for native modules. Read the versioned docs
> at https://docs.expo.dev/versions/v56.0.0/ before adding native modules (per `AGENTS.md`).

---

## Build order

Each step ends **runnable**. Stop and verify before moving on.

### Step 1 — Workspace + core skeleton
- Set up the workspace per D0; move app to `apps/mobile` (or keep + point workspace at it).
- Create `packages/core` with `package.json`, `tsconfig`, and empty `schema/ domain/ data/
  auth/ hooks/` folders. Confirm the app imports a throwaway `core` export.
- **Done when:** `expo start` still boots and `import { ping } from 'core'` resolves.

### Step 2 — Core: schema + domain (pure, no UI, no RN)
- Zod `CaseSchema` per `design.md` §3; export `Case = z.infer<...>`.
- `urgencyScore`, `sortCases`, `canApprove`, `canDeny`, `formatMoney`, `formatRelativeDate`.
- Seed data (~5 cases incl. the $145 dishwasher hero) as a typed array, validated through the
  schema at module load.
- **Done when:** `tsc --noEmit` passes for core; (optional) a couple of `sortCases` assertions.

### Step 3 — Core: repository + hooks
- `CaseRepository` interface: `list()`, `getById(id)`, `approve(id)`, `deny(id, reason)`.
- `MockCaseRepository`: in-memory copy of the seed, **~400ms simulated latency**, mutations
  update the store and resolve.
- TanStack Query hooks: `useCases`, `useCase(id)`, `useApproveCase`, `useDenyCase` — with
  **optimistic update + rollback** (`onMutate` / `onError` / `onSettled`).
- A `RepositoryProvider` / factory selecting adapter from `EXPO_PUBLIC_DATA_SOURCE` (default
  `mock`).
- **Done when:** hooks compile against the mock; an ephemeral console screen lists cases.

### Step 4 — App shell + Face ID lock screen
- Wrap the app in `QueryClientProvider` + `GestureHandlerRootView` +
  `BottomSheetModalProvider` + `SafeAreaProvider`.
- `AuthRepository` (mock): fake sign-in returns a fake refresh token → **SecureStore**
  (web/Expo-Go fallback: in-memory). Never store the password.
- Lock screen: visible **"Unlock with Face ID"** via `expo-local-authentication`; detect
  unavailable → **"Tap to unlock"** fallback. On success route to the requested page or list.
- **Done when:** cold launch shows the lock screen; unlocking reveals the list route.

### Step 5 — Case list
- `/cases` using `useCases` + `sortCases`. **Skeleton loaders** while pending,
  **pull-to-refresh** on the scroll/list. Rows per `design.md` §4.2; tap → detail.
- Use a performant list (`FlatList`/`FlashList`-style) — see `/vercel-react-native-skills`.
- **Done when:** list renders sorted, skeletons flash on first load, pull refetches.

### Step 6 — Case detail + approve (the money moment)
- `/cases/[id]` via `useCase`. Photos (`expo-image`, bundled assets), vendor, cost, guest
  context.
- **Approve**: `useApproveCase` → optimistic flip + `expo-haptics` success; rollback on error.
- **Done when:** approving updates status instantly with a haptic; forced error rolls back.

### Step 7 — Deny with reason (bottom sheet)
- `@gorhom/bottom-sheet`, keyboard-aware, drag-to-dismiss. **Reason required** (validate);
  submit → `useDenyCase` optimistic + haptic. The reason *is* the note.
- **Done when:** denying requires a reason and the sheet behaves natively.

### Step 8 — Deep link (notify → decide)
- Confirm `ownerview://cases/:id` resolves via Expo Router; if locked, the lock screen gates
  then forwards. Add a **"Simulate push"** dev affordance that fires the same deep link.
- **Done when:** the deep link opens the right case (through the lock if needed).

---

## Definition of done (iteration 1)

- [ ] Cold-runs in Expo Go **and** Expo web, mock default, no keys, **< 5 min**.
- [ ] Lock (Face ID **or** tap fallback) → sorted list (skeletons + pull-to-refresh) → detail.
- [ ] Approve and deny both work **optimistically with rollback** and a success haptic.
- [ ] All shared logic lives in `packages/core` with **zero RN imports**; screens hold no
      business logic.
- [ ] `tsc --noEmit` clean (strict); `expo lint` clean.
- [ ] No secret in AsyncStorage; only a fake refresh token in SecureStore.
- [ ] `README.md` run steps verified from a clean checkout.

## Run `/vercel-react-native-skills` and `/clean-code` on every code step

Per repo convention, both skills run on each step that touches code (list perf, animation,
native modules; naming, small functions, no inlined logic).

## Next iterations (not now)
1. Real `SupabaseCaseRepository` + RLS, env flip verified.
2. Real push registration + deep-link auth resume (completes the hero).
3. Next.js web surface importing `core` unchanged (proof in the open).
