# OwnerView — Design Record

> System design for the LocalVR "OwnerView" mobile prototype (Deliverable 1).
> Source of truth for _what_ we build and _how we mock it_ for the demo.
> and `docs/adr/` for the per-decision records.

---

## 1. One-line product

An owner gets a push that a maintenance case needs approval, **Face-ID-unlocks** straight into
the deep-linked case (cost, vendor, photos, guest context), and **approves in one tap** — or
**denies with a reason**. Time-to-decision drops from _days_ (owner is back at a laptop) to
_seconds_. Backed by a shared TypeScript `core` a Next.js web surface could consume unchanged.

## 2. Persona & scope

The user is the **property owner**: remote, affluent, occasional, almost never on-site. Their
pain is **latency to a decision**, not connectivity. That single fact drives every scope call.

| In v1 (built)                                                               | Cut from v1 (and why)                                                                                           |
| --------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Face ID lock over a stored session                                          | **Offline-first** — solves the _vendor's_ problem, not the owner's. Belongs in a future field app.              |
| Smart-sorted case list                                                      | **Threaded chat / comments** — most webpage-like, lowest native ROI. Deny-reason covers the "note" requirement. |
| Case detail: cost, vendor, photos, guest context                            | **PDF attachments** — no owner decision hinges on a PDF; a viewer is pure plumbing.                             |
| One-tap approve / deny-with-reason (the key write)                          | **Multi-property switcher, earnings, photo upload** — out of the decision critical-path.                        |
| Optimistic writes + haptic, skeletons, pull-to-refresh, native bottom sheet | **Live push registration (APNs/FCM)** — fiddly in Expo Go; simulated via deep link, real push is v-next.        |

## 3. Data model — what a case looks like

We're not handed a schema, so we define one. Types are **derived from Zod schemas** (`z.infer`)
in `packages/core` — one source of truth shared by mobile and a future web surface.

```
Case
  id: string
  title: string                  // "Repair dishwasher"
  status: 'pending' | 'approved' | 'denied'
  category: 'appliance' | 'plumbing' | 'hvac' | 'electrical' | 'general'
  description: string
  estimatedCostCents: number     // money as integer cents; format in core
  currency: 'USD'
  origin: 'pre_arrival_inspection' | 'post_departure_inspection'
        | 'vacancy_check' | 'guest_report'   // LocalShield triple-tier inspections
  assignee: { name: string; role: string }   // in-house team: "Andy Dinger · Maintenance Manager"
  vendor?: { name: string; company: string } // optional external specialist (e.g. appliance tech)
  property: { id: string; name: string; location: string }   // "Shock Hill Manor", "Breckenridge, CO"
  photos: string[]               // local bundled assets in mock (reliable cold-run)
  guestContext?: { nextCheckInISO: string } // drives urgency; "guest checks in Fri"
  createdAtISO: string
  decision?: { at: string; reason?: string }  // reason required on deny
```

**Derived, pure, in `core` (no UI):**

- `urgencyScore(case)` — combines category severity × guest-check-in proximity.
- `sortCases(cases)` — urgency desc, then soonest check-in. The dishwasher surfaces to the top
  _because a guest checks in Friday_. This is the product-thinking signal.
- `canApprove(case)` / `canDeny(case)` — status guards; you can't act on a decided case.
- `formatMoney`, `formatRelativeDate` — presentation helpers, still pure.

## 4. Screens & flows

Three screens. Deep links resolve to any of them.

### 4.1 Face ID lock (`/` when locked)

- Established identity once → we hold a session. This screen **unlocks** it, it does not log in.
- Primary affordance: a visible **"Unlock with Face ID"** button (`expo-local-authentication`).
- Success → navigate to the originally-requested route (the deep-linked case, or the list).
- **Fallback:** where biometrics are unavailable (Expo web, Expo Go without enrollment) the
  button reads **"Tap to unlock"** and proceeds. Keeps the 5-minute cold-run promise.
- First-ever run (no session) shows a one-time email+password sign-in (mocked, see §6).

### 4.2 Case list (`/cases`)

- **Smart-sorted** by `sortCases` — urgent + imminent-check-in cases first.
- **Skeleton loaders** while the repository resolves (not a spinner) — the "real app" tell.
- **Pull-to-refresh** re-fetches.
- Each row: title, property + location, status pill, estimated cost, guest-check-in chip when
  soon. Tap → detail.

### 4.3 Case detail (`/cases/[id]`)

- Photos (`expo-image`), vendor, description, estimated cost, guest-check-in context.
- **Approve**: one tap → **optimistic** status flip + **success haptic** (`expo-haptics`).
- **Deny**: opens a **native bottom sheet** (`@gorhom/bottom-sheet`), keyboard-aware,
  drag-to-dismiss. **Reason is required** — that captured reason _is_ the note. Submit →
  optimistic deny + haptic.
- On repository error the optimistic write **rolls back** (React Query `onError`).

### 4.4 Notify → decide (the hero)

- Production: push → tap → deep link `ownerview://cases/:id`.
- Demo: same deep link, triggered by a **"Simulate push"** dev affordance (and a real
  `npx uri-scheme` / browser URL on web). Expo Router resolves it; if locked, the Face ID
  screen gates it, then forwards to the case. Loom narrates real push as v-next.

## 5. Architecture — the shared / platform line

```
packages/core  (pure TypeScript — zero React Native imports)
  schema/      Zod schemas → types via z.infer        ← single source of truth
  domain/      urgencyScore · sortCases · canApprove · formatMoney  (pure, unit-testable)
  data/        CaseRepository (interface)
                 ├─ MockCaseRepository      (default; seeded; simulated latency)
                 └─ SupabaseCaseRepository  (wired; RLS owner_id = auth.uid())
  auth/        AuthRepository (interface) + Mock + Supabase adapters
  hooks/       useCases · useCase · useApproveCase · useDenyCase  (TanStack Query)
--------------------------------------------------- platform line
apps/mobile (Expo)
  screens · navigation (Expo Router) · styling (StyleSheet)
  native APIs: SecureStore · expo-local-authentication · expo-haptics · bottom-sheet
```

**Rule, one line:** _shared = everything from the network boundary up to the data hook;
platform = pixels, navigation, and native device APIs._

**Why the hooks live in core:** React Query hooks are framework-shared (React), not
device-specific. A Next.js web surface imports `useCases` / `useApproveCase` **unchanged** and
only re-implements the screens. That is the "genuinely shareable, not duplicated" proof the
brief asks for.

**How web reuses it:** Next.js imports the same `packages/core`, swaps `MockCaseRepository` for
`SupabaseCaseRepository` (server-side) via one env var, and renders its own components against
the identical hooks and types. No logic is copied across platforms.

## 6. Auth & identity (the headline)

- Identity is established **once** via Supabase email + password. On success we store the
  **Supabase refresh token** in **Expo SecureStore** (Keychain/Keystore) — _never_ the raw
  password, _never_ AsyncStorage. → ADR-0003.
- **Face ID is a local lock, not identity.** Each launch unlocks the stored session. To the
  owner it feels like "remember me / autofill"; they never retype. → ADR-0004.
- **Access control is server-side:** Supabase RLS `owner_id = auth.uid()`. The phone never
  decides what it may see. (Enforced by the real adapter; documented for the mock.)
- **Why token, not password:** same one-tap UX, but revocable, short-lived, rotatable — not a
  stored long-lived secret. This is the "harden non-engineer code" judgment the role wants.

## 7. How we mock everything for the demo

The app **defaults to mock** so it cold-runs in Expo Go / Expo web with **no keys**. A single
env flag (`EXPO_PUBLIC_DATA_SOURCE=mock | supabase`, default `mock`) selects adapters.

| Concern               | Real (prod)                                  | Mock (demo)                                                                                                                                                                                                    |
| --------------------- | -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Cases read/write**  | `SupabaseCaseRepository` over Postgres + RLS | `MockCaseRepository`: in-memory seeded array, **simulated ~400ms latency** so skeletons + optimistic UI are visible; mutations update the in-memory store and "confirm" the optimistic write.                  |
| **Auth / session**    | Supabase email+password → refresh token      | `MockAuthRepository`: any email+password "succeeds", returns a **fake refresh token** stored via the same SecureStore path (so the token-not-password flow is demoed for real).                                |
| **Biometrics**        | `expo-local-authentication` Face ID          | Same API. Where unavailable (web / unenrolled Expo Go) we detect and fall back to **"Tap to unlock"** — no code branch the demo can't hit.                                                                     |
| **Push notification** | APNs/FCM registration + payload              | **No real push in v1.** Deep link `ownerview://cases/:id` triggered by a **"Simulate push"** affordance (and a real URL on web). Demonstrates the _notify→deep-link→decide_ path; real registration is v-next. |
| **Photos**            | Supabase Storage URLs                        | **Bundled local assets** in `apps/mobile/assets` — no network dependency, so the cold-run never waits on an image CDN.                                                                                         |

**Seed data** (in `packages/core`, so web could reuse it) — grounded in LocalVR's real
portfolio and ops (in-house maintenance teams, LocalShield inspections). ~5–6 cases, mixed
statuses/categories, across real properties:

| Property | Location | Hero? | Example case |
|---|---|---|---|
| **Shock Hill Manor** | Breckenridge, CO | ★ | `appliance` · **$145 dishwasher repair**, flagged `pre_arrival_inspection`, **guest checks in Fri** — floats to top |
| **West Vail Retreat** | Vail, CO | | `hvac` · furnace service before cold snap |
| **Aerie Drive Estate** | Park City, UT | | `plumbing` · master-bath leak, `vacancy_check` |
| **Adams Ranch Lodge** | Telluride, CO | | `electrical` · hot-tub GFCI, already `approved` |
| **South Lake Escape** | Lake Tahoe, CA | | `general` · deck railing, `post_departure_inspection`, already `denied` (shows the note) |

Assignees use real in-house framing (e.g. *Andy Dinger · Maintenance Manager*); `vendor` only on
cases needing an external specialist. The hero ties the **pre-arrival inspection origin** to the
**guest-check-in urgency** — both straight from LocalVR's actual workflow.

**Images — note on sourcing:** the repo is public, so we **do not bundle LocalVR's own marketing
photos** (their copyright). Mock uses a few **royalty-free luxury-cabin images** (Unsplash
license) bundled in `apps/mobile/assets` for a reliable offline cold-run; in production these are
Supabase Storage URLs. Property *names and locations* are factual and fine to use.

## 8. Native craft checklist (highest signal-per-minute)

- [ ] Optimistic approve / deny + **success haptic** — the money moment.
- [ ] **Skeleton loaders** on the list.
- [ ] **Native bottom sheet** for deny reason (keyboard-aware, drag-to-dismiss).
- [ ] **Pull-to-refresh**.
- [ ] Rollback on write error.
- Deliberately skipped: shared-element transitions, animated reordering, Lottie — diminishing
  returns for the hour.

**Visual language:** LocalVR's own brand tokens (warm off-white surfaces, sand accent, amber/teal
status pills, Inter) — see `design-tokens.md`. Implemented app-side with plain `StyleSheet`.

## 9. Resolved decision

**Workspace shape — npm workspaces.** The blueprint originally locked pnpm; the scaffold shipped
on npm, so we keep **npm workspaces** with `packages/core` as a pure-TS workspace package. Same
shareability proof, no needless cold-run risk. Blueprint decision #8 updated accordingly. Detail
in `implementation-guide-iteration-1.md` §0.
