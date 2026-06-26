# OwnerView — Visual Design Brief

> Self-contained brief for generating a **high-fidelity visual prototype** (e.g. Claude's design
> tool). Everything the tool needs is here — screens, real content, and exact tokens. Paste this
> whole file as the prompt. Source docs: `design.md` (full spec) and `design-tokens.md`.

## What this is

A **native iOS-first mobile app** for **luxury vacation-rental property owners** (LocalVR) to
review and act on **property maintenance cases** from their phone. The owner is affluent, busy,
and rarely on-site; the app must feel **calm, premium, fast, and native — never like a wrapped
webpage.** Mobile portrait only. Light mode.

The core job: an owner gets a push that a repair needs approval, opens the case (cost, photos,
who's handling it, guest context), and **approves in one tap** or **denies with a reason**.

## Screens to design (3)

### 1. Face ID lock screen
- Calm, centered, lots of whitespace. App name/logo, a short line ("Welcome back").
- Primary affordance: a large **"Unlock with Face ID"** button (Face ID glyph). Secondary text
  link beneath: "Use password instead".
- (Design one variant where biometrics are unavailable: the button reads **"Tap to unlock"**.)

### 2. Case list
- Header: "Maintenance" title + small subtitle ("3 need your approval").
- A **vertical list of case cards**, sorted with the most urgent first. Each card shows:
  - Case title (e.g. *Repair dishwasher*) + a **status pill** (Pending / Approved / Denied).
  - Property name + location (e.g. *Shock Hill Manor · Breckenridge, CO*).
  - Estimated cost (e.g. *$145*).
  - A subtle **urgency chip** when a guest checks in soon (e.g. *Guest checks in Fri*).
  - A thumbnail photo of the issue/property.
- Design the **skeleton-loading state** of this list too (shimmer placeholders, not a spinner).
- Pull-to-refresh affordance at top.

### 3. Case detail
- Photo(s) of the issue at top (image carousel ok).
- Title + status pill. Property name + location.
- A clean **info block**: estimated cost, category, who's handling it (in-house maintenance
  lead, e.g. *Andy Dinger · Maintenance Manager*), and **how it was found** (e.g. *Flagged
  during pre-arrival inspection*). Guest context callout (*Guest checks in Fri — approve to
  unblock the repair*).
- Description paragraph.
- **Sticky bottom action bar**: a primary **Approve** button and a secondary **Deny** button.
- Design the **Deny bottom sheet**: a native-style sheet sliding up with a "Reason for denial"
  text field (required) and a Submit button. Keyboard-aware.
- Design the **approved state** (status flips to a teal "Approved" pill, action bar replaced by
  a confirmation line).

## Real content to populate (use these, not lorem ipsum)

LocalVR luxury properties (real names/locations):

| Case | Property · Location | Cost | Status | Note |
|---|---|---|---|---|
| **Repair dishwasher** ★hero | Shock Hill Manor · Breckenridge, CO | $145 | Pending | Flagged in pre-arrival inspection · **Guest checks in Fri** |
| **Furnace service before cold snap** | West Vail Retreat · Vail, CO | $320 | Pending | HVAC |
| **Master-bath leak repair** | Aerie Drive Estate · Park City, UT | $480 | Pending | Found during vacancy check |
| **Hot-tub GFCI replacement** | Adams Ranch Lodge · Telluride, CO | $210 | Approved | Electrical |
| **Deck railing fix** | South Lake Escape · Lake Tahoe, CA | $0 (quote pending) | Denied | "Owner will handle directly next visit" |

Maintenance lead names (in-house, on detail screen): *Andy Dinger · Maintenance Manager*.

## Visual tokens (use exactly)

**Mood:** warm, understated luxury. Off-white surfaces, near-black text, a single sand accent,
restrained color used only for status. Generous spacing. Thin hairline borders, not heavy
shadows.

**Colors**
- Background `#FAF9F7` · Card/surface `#FFFFFF` · Inset surface `#F5F5F3`
- Text primary `#1A1A1A` · Text secondary `#6B7280`
- Hairline border `rgba(0,0,0,0.10)`
- Brand accent (sand) `#D4BDA2` — chips, highlights, selected states
- Status — **Pending:** bg `#FAEEDA` text `#633806` · **Approved:** bg `#E1F5EE` text `#085041`
  · **Denied:** bg `#F7E4E1` text `#8B2C20`
- **Approve button:** solid `#085041`, white text · **Deny button:** white bg, `#8B2C20` border
  + text

**Typography** — **Inter**. Weights 400 (body) and 500 (titles/labels — medium, never bold).
- Screen title 22/500 · Section header 16/500 · Body 14/400 · Meta 13/400 · Overline 11/500
  uppercase, letter-spacing 0.8.

**Shape & spacing**
- Corner radius: cards/sheets 12–16, pills fully rounded, buttons 12.
- Spacing scale (4-based): 4 / 8 / 12 / 16 / 24 / 32. Comfortable padding inside cards (16).

## Do / don't
- **Do:** native iOS feel, status bar, safe-area insets, large tappable buttons, soft skeletons,
  a real bottom sheet for deny.
- **Don't:** web-style top nav bars, dense tables, drop-shadowed "material" cards, bright
  saturated colors, bold-weight type, or anything that looks like a dashboard.
