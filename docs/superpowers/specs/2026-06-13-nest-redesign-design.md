# Nest Redesign — Design Spec

**Date:** 2026-06-13
**Zone:** `nest` (home / hub)
**Status:** Approved for planning

---

## 1. Purpose

The nest is the student's daily landing zone. Its #1 job is **resume & act** — a launchpad
that pushes the student straight back into the work (a node in `trace`, an open `dive`, a pending
`prove`) guided by *nor's* beam, while keeping their progress and identity one glance away.

This redesign reworks the nest layout, introduces a cinematic hero, a persistent nor rail, a
refreshed bento of identity cards, and a consolidated swipe panel — all rendered in a premium
frosted-glass, iOS-squircle card system over the existing polar scene.

It stays inside the established visual system: chrome-black `#141417` background, monochrome
(frost-white / coal), the falling-ice `PolarScene` behind everything, and the spring /
rolling-ball motion language. **No color is introduced.**

---

## 2. Layout

Two-column shell on `lg+`: a main area (hero + bento) and a narrow persistent right rail.
On smaller screens the rail drops below the bento and all panels stack.

```
 Good evening, Piyush ❄                                    (greeting line)
┌──────────────────────────────────────────┐ ┌─────────────┐
│  BEAM TODAY                                 │ │  nor        │
│  Build the auth flow                        │ │  ◗ ask…  →  │
│  node 7 · dive · ~40m left                  │ ├─────────────┤
│  [ Resume → ]            ·frost scene·      │ │  flock      │
└──────────────────────────────────────────┘ │  ●●● online │
┌────────────────┐ ┌────────────────┐         │ ●  aanya     │
│  NORTH ring     │ │  STREAK heatmap│         │ ●  rohan     │
└────────────────┘ └────────────────┘         ├─────────────┤
┌────────────────┐ ┌────────────────┐         │  drift      │
│  STATS radar   │ │  LEARNING      │         │  · signal   │
└────────────────┘ └────────────────┘         │  · signal   │
┌──────────────────────────────────────────┐ └─────────────┘
│ ( quests   →swipe→   perch   ·   gleams )  · ● · │   (stadium)
└──────────────────────────────────────────┘
```

- **Grid:** main area is a responsive bento (1 col on mobile → 2 cols on `md` → main+rail on `lg`).
- The hero spans the full main width. The four core cards form a 2×2 within the main area.
- The switcher panel spans the full main width below the bento.
- The rail is a fixed-width column (`~300px`) on `lg+`, stacked content otherwise.

---

## 3. Card system (premium frosted glass + squircle)

The defining visual layer. A single `Squircle` primitive backs every card; silhouette varies by role.

### 3.1 `Squircle` primitive — `src/components/nest/ui/Squircle.tsx`

- **What it does:** renders a true superellipse-cornered container with frosted-glass fill,
  a hairline border, a top-edge highlight, a diagonal sheen, and an ambient shadow.
- **How:** measures its own size with a `ResizeObserver`, generates a superellipse SVG path for
  the measured `width × height`, and uses it as a `mask-image` (data URI) on a blurred glass layer
  so corners are exact at any aspect ratio (no stretch distortion). A matching `<svg><path>`
  overlay draws the hairline border + a top highlight gradient stroke + the low-opacity diagonal
  sheen (these can't be inset box-shadows because the mask would clip them).
- **Props:**
  - `radius` (corner size) and `smoothing` (superellipse exponent; higher = squarer, iOS ≈ 0.6 feel).
  - `shape: 'squircle' | 'stadium'` — `stadium` sets radius to `height/2` for pill ends.
  - `className`, `style`, `as` (section/article/div), standard children.
- **Depends on:** the scene CSS vars (below). No external library.
- **Constraint:** keep under ~150 lines; it is one focused unit.

### 3.2 Glass-depth CSS vars (add to `globals.css`, both themes)

Extend the existing `--scene-card*` tokens:

| token | dark | light |
|---|---|---|
| `--scene-card` (exists) | `rgba(255,255,255,0.06)` | `rgba(255,255,255,0.55)` |
| `--scene-card-border` (exists) | `rgba(255,255,255,0.12)` | `rgba(0,0,0,0.08)` |
| `--scene-card-blur` (exists) | `blur(16px) saturate(140%)` | same |
| `--scene-card-highlight` (new) | `rgba(255,255,255,0.22)` | `rgba(255,255,255,0.9)` |
| `--scene-card-sheen` (new) | `rgba(255,255,255,0.05)` | `rgba(255,255,255,0.4)` |
| `--scene-card-shadow` (new) | `0 10px 34px rgba(0,0,0,0.30)` | `0 10px 30px rgba(0,0,0,0.10)` |

### 3.3 Silhouettes per role

| element | shape | radius / note |
|---|---|---|
| Mission hero | wide squircle | large radius, lower smoothing (slightly squarer, cinematic) |
| North ring / Streak / Stats / Learning | near-square squircle | medium radius, iOS smoothing |
| Switcher panel | **stadium** | pill-ended |
| Rail blocks (nor / flock / drift) | tall squircle | medium radius |

### 3.4 Motion

- Cards keep the existing stagger-in (`container`/`item` variants) and spring hover-lift (`y:-3`).
- Hover adds a **specular lift**: shadow grows + sheen brightens slightly.
- Ring / radar / streak animate their fill on first in-view.
- Hero scene drifts slowly behind the glass.
- Switcher snaps between views with a spring.

---

## 4. Components

All new nest components live under `src/components/nest/`. Existing `Card`/`CardLabel`/`Bar`
and `cards/motion.ts` are reused; `Card` is refactored to render on top of `Squircle`.

### 4.1 Mission hero — `cards/MissionHero.tsx`
Wide full-bleed frosted hero. Eyebrow `BEAM TODAY`; big title = current node/goal; meta line
`node · zone · time left`; one primary **Resume →** that deep-links into the right zone. Behind
the content, a subtle slowed slice of the ice scene + faint frost gradient (no color). Replaces
the old `HeroCard`'s role on the nest.

### 4.2 nor rail — `rail/NorRail.tsx` (+ children)
Narrow right column, three stacked frosted blocks:
- `rail/NorAsk.tsx` — compact "ask nor…" shortcut that opens the nor chat.
- `rail/FlockPresence.tsx` — online avatars + status dots (reuses huddle `Avatar`).
- `rail/DriftSignals.tsx` — 2–3 latest one-line tappable signals from the field.

### 4.3 Core bento cards
- `cards/NorthRing.tsx` — **new.** Signature circular SVG progress ring, % toward north; animates fill in-view.
- `cards/StreakCard.tsx` — **keep** (heatmap + 🔥/❄), re-skinned onto `Squircle`.
- `cards/StatsRadar.tsx` — **new.** 5 traits (depth, execution, consistency, collaboration, clarity) as a small monochrome radar.
- `cards/LearningCard.tsx` — **keep** (active nodes + mini `Bar`s), re-skinned.

### 4.4 Switcher panel — `cards/SwitcherPanel.tsx`
Full-width stadium card. Horizontal swipe/scroll with snap + dot indicators across three views:
- **quests** — 1–3 checkable daily tasks (claim/check action).
- **perch** — your leaderboard rank (opt-in), compact.
- **gleams** — recent badges + next to unlock.
Folds in the old standalone `LeaderboardCard` and `QuestCard`.

### 4.5 Shell — `NestHome.tsx` (rewrite)
Greeting line + two-column shell (main bento + `NorRail`), responsive stacking.

---

## 5. Data

Extend `src/data/gameData.ts` with mocks (existing `mockPlayer`, streak calendar, leaderboard,
courses are reused):

- `mockNorth` — current goal/node, zone, time-left, resume target (for the hero).
- `mockNorthProgress` — % toward north (for the ring).
- `mockTraits` — the 5 trait values 0–100 (for the radar).
- `mockQuests` — daily tasks `{ id, label, done }`.
- `mockGleams` — recent + next badge.
- `mockDrift` — 2–3 signal rows.
- `mockPresence` — online flock members `{ name, status }`.

All typed and shaped so a later API swap is a data-source change only, not a component change.

Player name continues to come from `onboardingStore` via the existing hydration-safe
`useSyncExternalStore` pattern.

---

## 6. File impact

**New**
- `nest/ui/Squircle.tsx`
- `nest/cards/MissionHero.tsx`, `cards/NorthRing.tsx`, `cards/StatsRadar.tsx`, `cards/SwitcherPanel.tsx`
- `nest/rail/NorRail.tsx`, `rail/NorAsk.tsx`, `rail/FlockPresence.tsx`, `rail/DriftSignals.tsx`

**Rewrite**
- `nest/NestHome.tsx` (two-column shell)
- `nest/cards/Card.tsx` (render on `Squircle`)
- `globals.css` (add glass-depth vars)
- `data/gameData.ts` (add mocks)

**Re-skin (keep logic)**
- `nest/cards/StreakCard.tsx`, `cards/LearningCard.tsx`

**Retire from nest**
- `cards/HeroCard.tsx` (role absorbed by `MissionHero`)
- standalone `cards/LeaderboardCard.tsx`, `cards/QuestCard.tsx` (folded into `SwitcherPanel`)

---

## 7. Out of scope

- Real backend/API wiring for nest data (mocks only this pass).
- nor chat itself (the rail only provides the entry shortcut).
- Realtime presence (mock presence; can graduate to Supabase Realtime later).
- Changes to the top nav, sub-pill, or other zones.

---

## 8. Success criteria

- Nest renders the hero + rail + 4 cards + switcher in the two-column shell, stacking cleanly on mobile.
- Cards show real superellipse corners with frosted-glass depth in **both** themes.
- Hero "Resume" deep-links to the correct zone; switcher swipes between quests/perch/gleams.
- Ring / radar / streak animate on view; hover specular lift works.
- `npm run lint` and `tsc` clean; no hardcoded colors; no `console.log`.
