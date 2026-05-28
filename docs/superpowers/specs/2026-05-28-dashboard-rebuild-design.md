# Dashboard Rebuild — Design Spec

**Date:** 2026-05-28
**Scope:** Complete rebuild of `/dashboard`. Delete current implementation. No backend wiring in this spec (mocks only, per project mode — "we have to test the platform first").
**Out of scope:** Curriculum content authoring, CodeSpaces ↔ skill integration, Contextual Nor architecture, Pulse cron implementation, auth wiring. Each is its own follow-up spec.

---

## Why rebuild

The current dashboard is a polished mock that looks competent in isolation but reads as AI-generated: 4-card stats grid, weekly bar chart, "Recommended for You" 3-up, big skill path card, multiple "continue learning" tiles. It commits the slop pattern — many widgets of equal weight, decoration-driven hierarchy, zero opinion about what the user should do next.

The rebuild has one job: when a student opens `/dashboard`, they see **one** thing to do and **one** signal about where the field is moving. Everything else is compressed or removed.

---

## Design language

- **Base:** editorial / quiet luxury (Things 3, Arc, Stripe Atlas) — typography-driven hierarchy, generous whitespace, restraint.
- **Game-feel:** Duolingo / Apple Fitness — but reserved for *moments*, not chrome. Permanent dashboard surfaces are quiet; XP bursts, level-ups, streak celebrations happen in overlays triggered by actions elsewhere.
- **Utility:** engineered minimalism (Linear, Vercel) on dense surfaces (stats strip, lists).
- **No-slop rules** (carried from `feedback_no-ai-slop`): no glassmorphism-everywhere, no purple-to-blue gradient fills, no cookie-cutter icon-in-rounded-box card grids, no centered 3-column "Recommended" rows, no decorative glows.

## Tech choices

- **Icons:** `lucide-react` (already installed). Do **not** add new components using `react-icons` — lucide is the project's forward direction and matches the shadcn ecosystem.
- **Primitives:** existing shadcn components in `src/components/ui/*` (Button, Card, Badge, Progress, Separator, Tooltip).
- **Motion:** `framer-motion` for restrained reveal/transitions only. **No `gsap` on dashboard** — gsap is reserved for game-feel moments (level-up modals, completion overlays) which live elsewhere.
- **Charts:** none on the dashboard (the old weekly chart is removed; the calendar heatmap lives on `/profile`).
- **No new dependencies.** Everything needed is in `package.json`.

---

## Section 1 — Layout

Four zones, top to bottom. Fits within ~1.5 desktop screens.

```
┌─────────────────────────────────────────────────────────────┐
│   HERO — "Your next move" (adaptive single card)           │
├─────────────────────────────────────────────────────────────┤
│   STATS STRIP — one line, four numbers                      │
│   Streak · XP · Rank · Skills %                             │
├─────────────────────────────────────────────────────────────┤
│   SECONDARY ROW — two cards                                 │
│   ┌ Active Quest (1) ┐  ┌ Currently Learning (1) ┐         │
├─────────────────────────────────────────────────────────────┤
│   THE PULSE — 3 editorial cards, "what's moving"            │
└─────────────────────────────────────────────────────────────┘
```

**Removed from old dashboard:** 4-card stats grid, WeeklyChart, RecommendedCard ×3, SkillPathCard, multi-card "Continue Learning" rail.

---

## Section 2 — Hero state machine

The hero is one card. Its variant is a pure function of user state:

```
heroVariant(state) → { tier, glyph, contextLine, headline, supporting, ctaLabel, ctaHref, accent }
```

Priority order (top wins):

| Tier | Trigger | Variant | Accent |
|---|---|---|---|
| 1 · Save | Streak ≥3 about to break (>20h idle) OR quest deadline <24h | Urgent, fast-win CTA | Warm (amber/red) |
| 2 · Resume | Skill `in_progress`, practiced <48h ago | Calm, resume CTA | Brand yellow |
| 3 · Onward | Skill completed <2h ago | Small celebration glyph, next unlocked | Brand yellow |
| 4 · Calibrate | No diagnostic taken yet | Adaptive entry — skip-via-proof CTA | Brand yellow |
| 5 · Pick | None of the above | Quiet fallback — pick a quest or browse | Muted |

**Tier 1 + Tier 2 collision:** Tier 1 wins, but uses Tier 2's *content* — e.g. *"10 min on Server Components keeps your 7-day streak alive."* They merge, they don't compete.

### Anatomy (same skeleton, content varies)

```
┌──────────────────────────────────────────────────────────────┐
│  ░glyph    CONTEXT LINE (tier-specific, small caps)          │
│                                                              │
│  Headline. Full line. Calm. Max ~8 words.                    │
│                                                              │
│  Supporting line — what's at stake or what to expect.        │
│                                                              │
│                                          [ Primary CTA → ]   │
└──────────────────────────────────────────────────────────────┘
```

### Component shape

```tsx
// src/components/dashboard/Hero.tsx
type HeroTier = 'save' | 'resume' | 'onward' | 'calibrate' | 'pick';

interface HeroVariant {
  tier: HeroTier;
  glyph: LucideIcon;
  contextLine: string;     // "STREAK · 7 DAYS"
  headline: string;        // "Don't lose your streak"
  supporting: string;      // "10 minutes on Server Components keeps it alive."
  ctaLabel: string;        // "Continue Server Components"
  ctaHref: string;
  accent: 'warm' | 'brand' | 'muted';
}

function pickHeroVariant(state: DashboardUserState): HeroVariant { ... }
```

### Adaptive baseline tie-in

Tier 4 (Calibrate) is the entry point for the adaptive-baseline / skip-via-proof system. For a brand-new user with no diagnostic taken, the hero says: *"Take a 5-min check. We'll skip what you already know."* → `/diagnostic` (route to be specced in the curriculum sub-project; for now, link to `/skills` as placeholder).

---

## Section 3 — Stats strip + Secondary row

### Stats strip

```
   7  day streak    ·    2,340  xp    ·    Rising Dev    ·    5 / 17  skills
   ❄ × 2                                                       29% ─────────
```

- One horizontal line. No card backgrounds. No icon-in-rounded-box.
- **Streak number** is the only colored element (brand yellow). It earns the prominence.
- Below the streak: tiny `❄ × N` freezes available (lucide `Snowflake` icon).
- Below the skills count: a 1px progress bar with `%` label (no duplicate number).
- Click streak → `/profile` (heatmap). Click skills → `/skills` (tree).
- **Mobile:** 2×2 grid, same content, no chrome.

### Streak system rules (LeetCode-style)

- **What counts as "a day":** ≥1 *checkpoint* — exercise submitted in CodeSpaces, topic finished, quest completed, or diagnostic passed. Not "opened the app." Not "read a doc." Output, not input.
- **Freezes:** earn 1 freeze per 7-day streak milestone (rolling). Max 3 stored. Auto-consumed on miss.
- **Heatmap:** GitHub-style grid on `/profile` (not dashboard).
- **Daily challenge:** explicitly out of scope for v1.
- **Streak break trigger:** drives Hero Tier 1.

### Secondary row

```
┌─ ACTIVE QUEST ────────────────────┐  ┌─ CURRENTLY LEARNING ──────────────┐
│  Build a Landing Page              │  │  Server Components                 │
│  Apply HTML, CSS & responsive      │  │  Next.js · Intermediate            │
│                                    │  │                                    │
│  +300 XP · 2 days left             │  │  ████████░░░░░░░░  45%             │
│                       Open quest → │  │                       Resume →     │
└────────────────────────────────────┘  └────────────────────────────────────┘
```

- **Just one** of each. If the user has more, a quiet `N more →` link in the card footer.
- **Empty states:** if zero quests, card collapses to a single CTA — *"Pick up a quest"* → `/quests`. Same pattern for zero in-progress skills.
- The Resume button is the *same destination* as Hero Tier 2's CTA when it fires. Redundant on purpose — different mental models reach for different elements.

---

## Section 4 — The Pulse

### Rendering

```
WHAT'S MOVING IN WEB DEV THIS WEEK                              See all →

┌─ FRAMEWORK ────────────┐  ┌─ TOOLING ──────────────┐  ┌─ LANGUAGE ─────────────┐
│  Next 16 changes        │  │  Bun 1.3 ships         │  │  TC39 advances         │
│  the cache model        │  │  native HTTP/3         │  │  Pattern Matching      │
│                         │  │                        │  │                        │
│  How `use cache` and    │  │  What it means for     │  │  Why this changes the  │
│  cacheLife replace      │  │  your local dev loop.  │  │  way you write switch. │
│  unstable_cache.        │  │                        │  │                        │
│                         │  │                        │  │                        │
│  3 min · 2d · vercel.com│  │  2 min · 5d · bun.sh   │  │  4 min · 1w · tc39     │
└─────────────────────────┘  └────────────────────────┘  └────────────────────────┘
```

- **Tag** in small caps, single color per category (Framework=blue, Tooling=amber, Language=green, Industry=purple, Pattern=muted).
- **Headline** does the work. Typographic hierarchy, no decoration.
- **Dek** is one sentence. Strict 1-line truncation on mobile.
- **Footer:** read time · age · source domain.
- Click opens source URL in new tab (v1). Internal reading view is v2.
- Hover: 1px border lift, no shadow expansion, no glow.

### Data shape (forward-looking — Prisma model not added yet)

```prisma
model PulseItem {
  id          String   @id @default(cuid())
  category    String   // Framework | Tooling | Language | Industry | Pattern
  tree        String?  // "web-development" (null = global)
  headline    String
  dek         String
  sourceUrl   String
  sourceName  String
  readMinutes Int
  publishedAt DateTime
  pulledAt    DateTime @default(now())
  weight      Float    @default(0)
  archived    Boolean  @default(false)

  @@index([tree, publishedAt])
}
```

The Prisma model is **not added in this spec** — added when the Pulse cron lands. For now, the dashboard reads from `mockPulseItems` in `src/data/dashboardData.ts` with the same shape as a future query result.

### Empty state

If no pulse items: *"The Pulse is warming up. Check back tomorrow."* Single line, muted text, no card chrome. The dashboard must not look broken when the cron hasn't run yet.

### Cron — referenced, not specced here

The cron (sources, scraper, AI summarizer, weighting, dedup) gets its own spec. Source list to start: Next.js / React / Vue / Svelte blogs, Vercel changelog, Bun, Vite, GitHub trending, TC39, Node releases, Hacker News top.

---

## Mobile

- Hero: full-width, stays prominent.
- Stats strip: 2×2 grid.
- Secondary row: stacks.
- Pulse: 1 card visible, horizontal swipe for the next two (CSS scroll-snap, no JS).
- The dashboard never shrinks past *one column* — no awkward middle breakpoints.

---

## File layout

```
src/
├── app/(platform)/dashboard/page.tsx       (rewritten — just renders <DashboardClient />)
├── components/dashboard/
│   ├── DashboardClient.tsx                 (rewritten — composes the 4 zones)
│   ├── Hero.tsx                            (NEW — state machine card)
│   ├── StatsStrip.tsx                      (NEW — one-line stats)
│   ├── ActiveQuestCard.tsx                 (NEW)
│   ├── CurrentlyLearningCard.tsx           (NEW)
│   ├── Pulse.tsx                           (NEW — 3-card editorial row)
│   ├── PulseCard.tsx                       (NEW — individual item)
│   ├── [DELETED] StatsGrid.tsx
│   ├── [DELETED] WeeklyChart.tsx
│   ├── [DELETED] QuestPanel.tsx
│   ├── [DELETED] ActiveSkillCard.tsx
│   ├── [DELETED] RecommendedCard.tsx
│   └── [DELETED] SkillPathCard.tsx
└── data/dashboardData.ts                   (rewritten — new shape)
```

### `dashboardData.ts` shape

```ts
export interface DashboardUserState {
  userName: string;
  streak: { days: number; freezes: number; lastActiveAt: Date };
  xp: number;
  rank: string;
  skills: { completed: number; total: number };

  activeSkill: { id: string; name: string; category: string; progress: number;
                 lastPracticedAt: Date } | null;
  activeQuest: { id: string; title: string; description: string; reward: number;
                 deadlineAt: Date | null } | null;
  recentlyCompletedSkill: { id: string; name: string; completedAt: Date } | null;
  nextUnlockedSkill: { id: string; name: string } | null;
  diagnosticTaken: boolean;
}

export interface PulseItemMock {
  id: string;
  category: 'Framework' | 'Tooling' | 'Language' | 'Industry' | 'Pattern';
  headline: string;
  dek: string;
  sourceUrl: string;
  sourceName: string;
  readMinutes: number;
  publishedAt: Date;
}

export const mockUserState: DashboardUserState = { /* default Tier 2: Resume */ };
export const mockPulseItems: PulseItemMock[] = [ /* 3 realistic web dev items */ ];
```

---

## Adjacent change in this spec

**Remove `CodeSpaces` link from `src/components/shared/Navbar.tsx`** (landing navbar only). The platform sidebar's CodeSpaces entry is left intact for now — it will be restructured in the CodeSpaces↔skill integration spec, but removing it now would orphan a working feature.

---

## Acceptance

- `/dashboard` renders the new layout in both light and dark themes.
- No `react-icons` imports in any new component (lucide only).
- No console errors on first load.
- Mobile viewport (375px) renders cleanly with stacked secondary row and snap-scrolling Pulse.
- All old dashboard components deleted from disk.
- Landing navbar has no CodeSpaces link.
- Verified by screenshot in both themes.

---

## Explicitly deferred

- Real Prisma queries (mocks only — backend wiring deferred until "we test the platform" phase ends).
- Pulse cron (own spec).
- Skip-via-proof / diagnostic implementation (curriculum spec).
- Contextual Nor presence on dashboard (Nor spec).
- Profile heatmap (own spec — referenced from streak click but not built here).
- Game-feel overlay system for XP burst / level-up / completion (own spec).
- Removing CodeSpaces from the platform sidebar (CodeSpaces integration spec).
