# North Onboarding Redesign — Design Spec

**Date:** 2026-06-01
**Status:** Approved, building.

## Goal

Replace the 9-step onboarding (which double-asked the same data, captured personality fluff the product never used, and ended in a disliked card + roadmap) with a tight, fun flow built on **intriguing choices + hidden inference**: the student answers evocative questions; we infer the real signal (interests, work-style, goal, level) silently in backend logic. Persistence is out of scope for now — flow + logic only.

## The flow (5 steps)

1. **Welcome + name** — keep existing (typing intro + name input).
2. **College + year** — free-text college (no premade list), year pills.
3. **Find your love** — pink swipe deck, 6 cards, single card swipe (right = love it). Hand-built **pixel heart**, no emojis. → infers **interests**.
4. **The choices** — clean blue/red hard split, 4 dilemmas, pick a side. → infers **work-style, goal lean, pace** (silent).
5. **Nor** — elevated chat (no avatar, just "nor"). Nor wakes up already knowing you: a deterministic **read-back** from the inferred profile, then 1–3 chip questions to complete it (interest focus, level, timeline-if-career), then wraps and drops you into the platform as your companion. **No card, no roadmap screen.**

Removed entirely: interest bubbles, learning-style sliders, goal cards, vibe-check swipes (replaced), player-card reveal, roadmap reveal.

## Data + inference

**Love cards (6)** → each maps to skill domain(s); swipe-right adds the domains to `interests`.

**Dilemmas (4)**, each blue/red → one dimension:
- `2am` → buildStyle: blue=deep, red=ship
- `doors` → learnStyle: blue=guided, red=explore
- `future` → goalLean: blue=career, red=maker
- `evening` → pace: blue=intense, red=measured

`computeProfile(data)` derives `{ buildStyle, learnStyle, goalLean, pace, interests }`. `buildReadback(profile, name)` renders Nor's opening lines deterministically (so it is always accurate and **never hallucinates**).

## Nor conversation (deterministic, always finishes)

1. Read-back (1–2 bot bubbles) generated from profile.
2. Q interest focus (chips from top interests + "not sure yet").
3. Q level (shipped / rusty / fresh).
4. Q timeline — only if goalLean = career.
5. Wrap + CTA "enter →" → `/dashboard`.

Free-text input accepted (advances the same as a chip). No live-AI dependency for correctness; live-AI flavor can be layered later.

## Components

- `steps/FindYourLoveStep.tsx` — swipe deck (Framer drag), pink theme, `PixelHeart`.
- `steps/TheChoicesStep.tsx` — blue/red dilemmas.
- `steps/NorStep.tsx` — elevated chat, read-back + scripted finish + finale CTA.
- `steps/CollegeStep.tsx` — simplified to free-text.
- `PixelHeart.tsx` — reusable pixel-art heart (SVG).
- `lib/onboarding/profile.ts` — inference + read-back.
- `OnboardingWizard.tsx` — 5-step order, keeps the test nav.

All: responsive, `cn()`, CSS vars (pink is intentional local color in the love step), no emojis, components < 200 lines.
