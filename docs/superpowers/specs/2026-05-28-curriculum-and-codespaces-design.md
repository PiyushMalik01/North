# Curriculum + CodeSpaces Integration — Design Spec

**Date:** 2026-05-28
**Sub-projects covered:** #1 Modern Web Dev curriculum, #2 CodeSpaces ↔ skill integration
**Why bundled:** the two are tightly coupled — exercises live inside skills, not in a separate destination. Designing the skill flow without designing the exercise format produces an empty shell. Designing exercises without the surrounding skill produces an orphaned IDE.
**Out of scope:** Contextual Nor architecture (own spec #3), Pulse cron (own spec #4), real DB writes (mocks only — testing phase).

---

## Problem with the current state

- **Curriculum is wrong shape.** The seed has 17 nodes that lead from "How the Web Works" through HTML → CSS → JS → React → Next → Full-Stack Project. This is a 2018 bootcamp. It teaches things any motivated student can absorb from MDN in a weekend, then runs out of runway before reaching anything actually used in industry today (Server Components, AI integration, modern data fetching, edge runtime, modern auth).
- **No baseline adaptation.** Every student starts at "How the Web Works" regardless of whether they've shipped three React apps already.
- **CodeSpaces is a standalone destination.** It has its own sidebar entry, its own URL, its own "problem panel" UI. It's not connected to any skill. A student opening CodeSpaces has no idea what to practice — the IDE is just sitting there.
- **No way to prove competence.** Once you finish a topic, nothing checks that you can actually do it. Progress is self-reported. The XP/streak system rewards opening the app, not building things.

## Design thesis

A skill in North is a **learn-and-prove unit**, not a video playlist. Each skill consists of:
1. A short rationale (*why this matters now*)
2. Lessons — compressed reference material the student reads/scans (not original lecture content; we link out where the canonical doc is great)
3. **Exercises in CodeSpaces** — typed by hand (anti-copy-paste), explained in plain English (the English block), submitted for validation
4. A skip-via-proof challenge — for students who already know the material

The dashboard and skill tree present these skills. The diagnostic page bulk-runs skip challenges. CodeSpaces never appears as a destination — it appears as a *workspace within* whatever skill you're working on.

---

## Section 1 — Curriculum

### Shape

Authored once in `prisma/seed.ts` as the source of truth. The dashboard and skill tree read from it (currently via mock; later via Prisma). Content is researched separately (see the research agent output appended to this spec as `curriculum-research-2026-05-28.md` when it lands).

### Skill schema (extends existing Prisma model)

```prisma
model SkillNode {
  // existing
  id, slug, name, description, estimatedHours, difficulty, topics[], sortOrder, treeId

  // NEW
  whyNow         String?    // 1-sentence "why it matters in 2026"
  exerciseIdea   String?    // 1-sentence project description for CodeSpaces
  lessons        Lesson[]   // ordered reference material
  skipChallenge  SkipChallenge?
}

model Lesson {
  id        String @id @default(cuid())
  skillId   String
  skill     SkillNode @relation(fields: [skillId], references: [id], onDelete: Cascade)
  sortOrder Int
  title     String
  kind      LessonKind   // READ | WATCH | DOC | NOTE
  url       String?      // external (MDN, framework blog) — many lessons just link out
  body      String?      @db.Text  // internal notes when needed
  estimatedMinutes Int
}

enum LessonKind { READ WATCH DOC NOTE }

model SkipChallenge {
  id          String @id @default(cuid())
  skillId     String @unique
  skill       SkillNode @relation(fields: [skillId], references: [id], onDelete: Cascade)
  // 3-4 multiple-choice questions stored as JSON for v1
  questions   Json
  // optional: 1 code task slug for harder skip
  codeTaskSlug String?
}
```

For v1 (testing phase) all of this lives in mock data files; Prisma additions wait until backend wiring phase.

### Tree shape & branches

Will be informed by the research agent's tree organization. The decomposition I expect:
- **Core** (2-3 nodes) — compressed fundamentals; designed to be the *default* skip-via-proof for anyone with prior coding experience
- **Frontend Production** — modern React, Next.js App Router, TypeScript, modern styling, accessibility
- **Backend & Data** — APIs, databases, auth, modern Postgres/serverless data layer
- **AI Integration** — LLM tools, embeddings, streaming, AI SDK patterns (real branch — this is part of web dev in 2026)
- **Production** — deploy, observability, performance, security
- **Ship It** — capstone projects

Final branch list comes from research.

### Adaptive baseline / skip-via-proof

Every skill has a **Skip Challenge** — 3-4 MCQ + (optionally) one short code task in CodeSpaces with an English-block explanation.

**Flow:**
1. From `/diagnostic` (or from a skill detail page) the student clicks "I already know this."
2. Modal opens: 3-4 MCQs, no time limit, immediate-feedback after submit.
3. If they pass (≥ 75% on MCQs), they're shown the optional code task. They can complete it to skip, or choose "Mark as known anyway" — which marks the skill `COMPLETED` but flags it `unverified` so we can later prompt reinforcement.
4. If they fail MCQs, they're routed back to the skill's lessons (no penalty).

**`/diagnostic` page** is a curated 5-10 minute walkthrough of skip challenges across foundational skills. New users land here after onboarding. Tier 4 of the dashboard Hero (Calibrate) routes here.

---

## Section 2 — Skill Detail page (`/skills/[slug]`)

The student's primary workspace surface. Replaces the bare skill-tree-canvas-only experience.

```
┌─ Top bar (existing platform shell) ──────────────────────────────┐
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ←  Web Development / Frontend Production                        │
│                                                                  │
│  Server Components                          ┌─────────────────┐  │
│  Why now: RSC ships data + UI together —    │  Skip via proof │  │
│  the default for new React apps in 2026.    └─────────────────┘  │
│                                                                  │
│  ●●●●●○○○○○  45% · ~1.5h left   Intermediate · Next.js          │
│                                                                  │
├─────────────────────────────────────────────┬────────────────────┤
│                                             │                    │
│  LESSONS                                    │  PREREQUISITES     │
│                                             │                    │
│  ① The data + UI shift                      │  ✓ React Hooks     │
│    5 min · React blog                       │  ✓ Async JS        │
│                                             │  ✓ TypeScript      │
│  ② Server components in practice            │                    │
│    12 min · Next.js docs                    │  UNLOCKS           │
│                                             │  Streaming         │
│  ③ Server actions                           │  Server Actions    │
│    8 min · Vercel post                      │                    │
│                                             │                    │
│  ④ When to NOT use them                     │                    │
│    Internal note · 4 min                    │                    │
│                                             │                    │
├─────────────────────────────────────────────┴────────────────────┤
│                                                                  │
│  EXERCISE — Build a server-rendered post list                    │
│                                                                  │
│  Fetch a list of posts inside a Server Component, stream         │
│  loading states with Suspense, and add a Server Action that      │
│  deletes a post and revalidates.                                 │
│                                                                  │
│                          [ Open the workspace → ]                │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

**Behavior:**
- Hero shows skill name, why-now, progress bar, difficulty, category. "Skip via proof" pill is always visible in the top-right of the hero.
- Lessons list is ordered; each row is clickable (external link or internal lesson view).
- Right sidebar shows prerequisite skills (✓ done / ◯ in-progress / locked) and what this unlocks.
- Exercise block is the call to action. Clicking *Open the workspace* opens the in-skill CodeSpaces view (next section).
- When the student returns to the skill page mid-exercise, the Exercise block shows their in-progress code snippet preview + "Continue" instead of the initial "Open."

---

## Section 3 — CodeSpaces in-skill workspace

A focused 2-pane view rendered at `/skills/[slug]/exercise` (or as a route segment overlay — TBD by file routing convenience). Replaces the standalone `/codespaces` page conceptually.

```
┌─ Top bar ────────────────────────────────────────────────────────┐
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ← Server Components / Exercise                                 │
│                                                                  │
├──────────────────────────────┬───────────────────────────────────┤
│  TASK                         │                                  │
│  Build a server-rendered post │  [ Monaco code editor ]          │
│  list with a delete server    │                                  │
│  action.                      │   1  // your code here           │
│                               │   2                              │
│  Specs:                       │   3                              │
│  • Fetch posts in a Server    │   4                              │
│    Component                  │   5                              │
│  • Wrap with Suspense         │                                  │
│  • Delete action revalidates  │                                  │
│                               │  Tabs: page.tsx · actions.ts     │
│  HINTS                        │                                  │
│  Ask Nor →                    │  ── ─── ─── ─── ─── ─── ─── ─── │
│                               │                                  │
│                               │  ENGLISH BLOCK                   │
│                               │  Explain what you did and why.   │
│                               │  ┌─────────────────────────────┐ │
│                               │  │ My implementation fetches…  │ │
│                               │  │                             │ │
│                               │  │                             │ │
│                               │  └─────────────────────────────┘ │
│                               │  148 / 100 words · enough        │
│                               │                                  │
│                               │              [ Submit → ]        │
└──────────────────────────────┴───────────────────────────────────┘
```

### Anti-cheat rules

- **Paste is blocked in Monaco.** Ctrl+V / right-click paste / drag-drop are intercepted. Toast: *"Paste isn't allowed. Type it out — that's the point."*
- **Telemetry:** keystroke count, paste attempts, total typing duration are tracked client-side and submitted with the solution. Future Nor can flag suspicious patterns (e.g., 500-char functions appearing in 2 seconds via devtools).
- **English Block validates before submit.** Min 100 words. Submit button is disabled until threshold met.
- **No "Run my code" button on the dashboard's first version.** Validation is mock (always passes for v1) since we don't have a sandboxed runner yet. The submission gets stored; Nor will eventually review.
- **Right-click context menu disabled in editor area.**

### Component breakdown

```
src/components/exercise/
├── ExerciseRunner.tsx       — top-level composer (left pane + right pane)
├── TaskPanel.tsx            — left pane (specs, hints, "Ask Nor" CTA)
├── CodeEditor.tsx           — Monaco wrapper with anti-paste + telemetry
├── EnglishBlock.tsx         — textarea + word count + threshold gate
├── ExerciseSubmit.tsx       — submit button + result state
└── hooks/
    └── useAntiPaste.ts      — Monaco paste-handler hook
```

The existing `src/components/codespaces/CodeEditor.tsx` and `ProblemPanel.tsx` are kept (the standalone `/codespaces` route still works for the IDE prototype) but the new flow uses the new components — different concerns, different shape. We do not retrofit the old ones.

### Sidebar change

Remove `CodeSpaces` from the platform sidebar in `src/components/platform/Sidebar.tsx`. The `/codespaces` route remains accessible by URL (unlinked) so the prototype isn't orphaned.

---

## Section 4 — `/diagnostic` page

The skip-via-proof bulk entry point. New users see Hero Tier 4 ("Calibrate") which routes here.

```
┌──────────────────────────────────────────────────────────────────┐
│  ─  CALIBRATE                                                    │
│                                                                  │
│  Skip what you already know                                      │
│  5 minutes. We'll find your real starting point.                 │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  CORE                                                            │
│  ┌────────────────────────────────────┐                          │
│  │ JavaScript Essentials              │  [ Quick check → ]       │
│  └────────────────────────────────────┘                          │
│  ┌────────────────────────────────────┐                          │
│  │ HTML & CSS                         │  [ Quick check → ]       │
│  └────────────────────────────────────┘                          │
│                                                                  │
│  FRONTEND PRODUCTION                                             │
│  ┌────────────────────────────────────┐                          │
│  │ React Hooks                        │  [ Quick check → ]       │
│  └────────────────────────────────────┘                          │
│  ...                                                             │
│                                                                  │
│                              [ I'm new to all of this → ]        │
└──────────────────────────────────────────────────────────────────┘
```

- Each skill row = a skip challenge entry.
- Clicking *Quick check* opens a modal: 3-4 MCQs → result → on pass, optional code task → mark COMPLETED (unverified or verified).
- Bottom CTA *I'm new to all of this* skips diagnostic, lands on the first skill in Core.

---

## File layout (full)

```
src/
├── app/
│   ├── (platform)/
│   │   ├── skills/
│   │   │   ├── page.tsx                           (existing tree canvas; unchanged for now)
│   │   │   └── [slug]/
│   │   │       ├── page.tsx                       (NEW — skill detail)
│   │   │       └── exercise/
│   │   │           └── page.tsx                   (NEW — exercise workspace)
│   │   └── diagnostic/
│   │       └── page.tsx                           (NEW)
├── components/
│   ├── skill-detail/
│   │   ├── SkillHero.tsx                          (NEW)
│   │   ├── LessonList.tsx                         (NEW)
│   │   ├── PrereqRail.tsx                         (NEW)
│   │   └── ExerciseCta.tsx                        (NEW)
│   ├── exercise/
│   │   ├── ExerciseRunner.tsx                     (NEW)
│   │   ├── TaskPanel.tsx                          (NEW)
│   │   ├── CodeEditor.tsx                         (NEW — separate from old codespaces one)
│   │   ├── EnglishBlock.tsx                       (NEW)
│   │   ├── ExerciseSubmit.tsx                     (NEW)
│   │   └── hooks/useAntiPaste.ts                  (NEW)
│   ├── diagnostic/
│   │   ├── DiagnosticPage.tsx                     (NEW)
│   │   ├── SkillCheckRow.tsx                      (NEW)
│   │   └── SkipChallengeModal.tsx                 (NEW)
│   └── platform/Sidebar.tsx                       (edit — remove CodeSpaces link)
├── data/
│   ├── curriculum.ts                              (NEW — mock source for skills, lessons, exercises)
│   └── dashboardData.ts                           (update — point activeSkill at a real curriculum skill)
└── prisma/seed.ts                                 (REWRITTEN — modern curriculum from research)
```

---

## Acceptance

- `/skills/[slug]` renders for at least one modern skill end-to-end with real curriculum content.
- `/skills/[slug]/exercise` opens Monaco with anti-paste working (verified by attempting Ctrl+V → blocked).
- EnglishBlock disables submit until min 100 words; word count visible live.
- `/diagnostic` lists skills grouped by branch with quick-check buttons.
- CodeSpaces is removed from the platform sidebar; the `/codespaces` URL still resolves.
- Dashboard's `activeSkill` mock points to a real curriculum skill so the hero/secondary-row deep-links resolve.
- Both themes render correctly; mobile layout is functional.
- Typecheck clean, zero runtime errors.

---

## Deferred

- Real Prisma writes (mocks only — testing phase).
- Nor as the "Ask Nor" hint button — UI placeholder only; real chat plug-in comes with the Nor spec.
- AI-grading of the English block (rule-based for now: min word count).
- Real code execution / validation (mock pass).
- Telemetry persistence to backend.
- Skill tree canvas redesign — leaves untouched.
- Skip challenge content authoring — schema in place, questions seeded for ~5 skills only as v1; rest get a "skip challenge coming soon" state.
