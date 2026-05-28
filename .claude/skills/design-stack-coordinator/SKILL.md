---
name: design-stack-coordinator
description: Use when starting any design work to know which skills to load and in what order. Coordinates brainstorming, moodforge, frontend-design, figma, impeccable, GSAP, and shadcn/ui so you never load all 36 skills at once.
---

# Design Stack Coordinator

You are coordinating a curated stack of Claude Code design skills. Your job is
to decide **which skill fires at which moment**, and to load only what is
needed for the current step. Loading all 36 skills at once is an anti-pattern -
it pollutes context and slows reasoning.

## Core rule

**moodforge is the spine; everything else is a muscle that attaches to
it.** Every design task flows through moodforge's 7-step workflow. The other
skills are tools you pick up *inside* each step of that workflow.

## When each skill fires

- **brainstorming** (superpowers) → **intake**. Fires at the very start of any
  creative or design task. Explores user intent, requirements, constraints, and
  success criteria before a single pixel is drawn. If the user jumps straight
  to "build me X" without context, start here.
- **moodforge** → **workflow spine**. Owns the overall ordering of the work:
  Themes → Iterate → Brand Kit → Screens → Figma → Handoff. Every other skill
  plugs into one of its steps. Read its SKILL.md for the per-step skill table.
- **frontend-design** → **HTML/CSS creation**. The muscle for producing actual
  markup, components, and pages. Fires inside the visual-design and screen
  steps of moodforge.
- **figma** (figma-use / figma-generate-library / figma-generate-design) →
  **push/export**. Fires when the user wants the finished design reflected in
  Figma - usually during moodforge Step 5.
- **impeccable steering commands** (adapt, animate, arrange, audit, bolder,
  clarify, colorize, critique, delight, distill, extract, harden, normalize,
  onboard, optimize, overdrive, polish, quieter, teach-impeccable, typeset) →
  **quality moves**. Surgical edits you apply to an existing design to take it
  from "works" to "impeccable". Fire them inside the visual-design and QA
  steps of moodforge, never at intake.
- **emil-design-eng** (emilkowalski/skill) → **animation + UI craft canon**.
  The source of truth for every motion decision in moodforge. Load it alongside
  `animate` whenever the work touches motion, transitions, drag gestures, or
  micro-interaction feel. moodforge Steps 2 / 3 / 4 / 6 require it.
- **gsap-*** (greensock/gsap-skills) → **production animation library**.
  8 skills covering GSAP core, timelines, ScrollTrigger, plugins, performance,
  React integration, frameworks, and utilities. GSAP handles complex choreography
  that CSS transitions cannot: staggered reveals, scroll-driven animations,
  timeline scrubbing, and cross-element orchestration. Load alongside
  `emil-design-eng` — emil defines the rules, GSAP provides the tooling.
  moodforge Steps 2 / 3 / 4 / 5 / 6 use it.
- **shadcn** (shadcn/ui) → **component architecture**.
  Composable UI primitives (Button, Dialog, Sheet, Toast, Tabs, Input) that map
  directly to brand-kit tokens via CSS variable overrides. The bridge between
  design tokens and production React components. Fire it in moodforge
  Steps 3 / 4 / 6 where components are defined, used, and handed off.

## Handoff order

```
brainstorming
    ↓
moodforge (opens the 7-step workflow)
    ↓
 ┌─ frontend-design        (build)
 │      ↓
 ├─ emil-design-eng        (motion governance — the rules)
 │      ↓
 ├─ gsap-*                 (motion tooling — the implementation)
 │      ↓
 ├─ shadcn                 (component architecture — the primitives)
 │      ↓
 └─ impeccable steering    (polish, per step)
    ↓
figma                     (push, optional)
    ↓
superpowers:writing-plans (capture the result so the next session can resume)
```

## Step → skills map

| moodforge step           | Load these skills                                  |
|-------------------------|----------------------------------------------------|
| 1 discovery             | brainstorming, frontend-design, bolder, delight, shape, critique |
| 2 screen preview        | frontend-design, typeset, colorize, arrange, animate, **emil-design-eng**, gsap-scrolltrigger, gsap-timeline, **shadcn** |
| 3 brand kit             | frontend-design, extract, audit, harden, clarify, **emil-design-eng**, **shadcn**, gsap-core |
| 4 animation review      | **emil-design-eng**, animate, frontend-design, gsap-core, gsap-timeline, gsap-scrolltrigger, gsap-plugins |
| 5 all screens           | frontend-design, arrange, clarify, harden, onboard, **emil-design-eng**, **shadcn**, gsap-scrolltrigger, gsap-timeline |
| 6 production            | superpowers:writing-plans, critique, **emil-design-eng**, superpowers:test-driven-development, gsap-core, gsap-react, gsap-performance, **shadcn**, polish, audit |
| figma (optional)        | figma:figma-use (FIRST), figma:figma-generate-library, figma:figma-generate-design |

Only load the skills listed for the **current step**. When the step is done,
drop those skills from active context and load the next row.

## Anti-patterns

- **Do not load all 36 skills at once.** This is the single biggest mistake.
  Context bloat makes every skill weaker.
- **Do not skip brainstorming** when the request is vague. "Build me a dashboard"
  is not a spec; it's a prompt to brainstorm first.
- **Do not apply impeccable steering commands at intake.** Polishing a design
  that hasn't been scoped is wasted work.
- **Do not push to figma before QA.** Figma becomes the source of record - only
  export after audit/harden/polish have run.
- **Do not treat moodforge as optional.** If there's no spine, the muscles have
  nothing to attach to and the work drifts.
- **Do not write motion code without emil-design-eng loaded.** Steps 2 / 3 / 4 / 6
  of moodforge all require it. Without it, the animations regress to stock CSS
  defaults and break the brand.
- **Do not use GSAP without emil-design-eng governing it.** GSAP is the tooling;
  emil-design-eng is the rules. Load both together. GSAP without motion governance
  leads to gratuitous animation.
- **Do not build components without shadcn loaded in Steps 3 / 4 / 6.** Brand-kit
  components must map to shadcn primitives so the handoff is clean. Custom
  components that duplicate shadcn functionality waste engineering time.

## Quick decision tree

1. Is intent clear? No → **brainstorming**. Yes → continue.
2. Which step of moodforge am I in?
3. Load **only** the skills for that step from the table above.
4. When the step is complete, unload and move to the next row.
5. Finish at **figma** (if applicable) and **superpowers:writing-plans**.
