# North Student Onboarding Flow — Design Spec

## Overview

A full-screen, multi-step onboarding wizard that captures student profile, learning preferences, skill interests, and personality traits through creative, gamified interactions. Gen-Z tone throughout — casual, relatable, no corporate energy. Estimated ~90 seconds to complete.

**Route:** `/onboarding` (standalone, outside `(platform)` layout — no sidebar/topbar)
**Entry point:** After successful signup, the auth success handler calls `router.push('/onboarding')`. Future middleware can also redirect to `/onboarding` if `onboardingStore.completed === false` and the user tries to access platform routes.
**Exit point:** Animated transition into `/dashboard` after reveal screens

---

## Architecture

### Route & Layout

- `src/app/onboarding/page.tsx` — Server component wrapper
- `src/components/onboarding/OnboardingWizard.tsx` — Client component, manages step state and transitions
- Each step is its own component in `src/components/onboarding/steps/`
- No `(platform)` layout — onboarding is a clean full-screen experience
- Minimal chrome: just a dot progress indicator + back button

### State Management

**New store:** `src/store/onboardingStore.ts`

```typescript
interface OnboardingState {
  currentStep: number;
  totalSteps: 8;
  data: {
    name: string;
    college: string;
    year: string;
    interests: string[];           // skill category IDs
    learningStyle: {
      theoryVsHandsOn: number;     // 0-100 slider
      soloVsCollab: number;
      sprintVsMarathon: number;
      guidedVsExplore: number;
    };
    personalitySwipes: Record<string, boolean>;  // statement ID → right/left
    goal: 'internship' | 'placements' | 'exploring';
  };
  playerCard: {
    personalityType: string;       // computed: "The Builder", "The Explorer", etc.
    traits: UserAttributes;        // computed from swipes
    topInterests: string[];
    radarData: { axis: string; value: number }[];  // matches PlayerCard type
  };
  completed: boolean;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateData: (partial: Partial<OnboardingState['data']>) => void;
  computePlayerCard: () => void;
  markCompleted: () => void;
}
```

Persisted with Zustand `persist` middleware (key: `onboarding-storage`).

### New Types (add to `src/types/index.ts`)

```typescript
interface OnboardingData {
  name: string;
  college: string;
  year: '1st' | '2nd' | '3rd' | '4th' | 'grad';
  interests: string[];
  learningStyle: LearningStyleSliders;
  personalitySwipes: Record<string, boolean>;
  goal: 'internship' | 'placements' | 'exploring';
}

interface LearningStyleSliders {
  theoryVsHandsOn: number;
  soloVsCollab: number;
  sprintVsMarathon: number;
  guidedVsExplore: number;
}

interface PlayerCard {
  personalityType: string;
  traits: UserAttributes;
  topInterests: string[];
  radarData: { axis: string; value: number }[];
}

interface SwipeCard {
  id: string;
  statement: string;
  trait: keyof UserAttributes;
  weight: number;
}
```

### New Constants (add to `src/constants/index.ts`)

```typescript
ROUTES.ONBOARDING = '/onboarding';

PERSONALITY_TYPES = {
  builder:    { name: "The Builder",    description: "You learn by making things. Ship first, theory later." },
  explorer:   { name: "The Explorer",   description: "Curious about everything. You go wide before going deep." },
  analyst:    { name: "The Analyst",     description: "You need to understand *why* before you move on." },
  connector:  { name: "The Connector",   description: "You thrive in teams and learn best through collaboration." },
  strategist: { name: "The Strategist",  description: "You plan your moves. Consistent, focused, deliberate." },
};

// Computation: dominant trait → personality type mapping:
// execution → builder, depth → analyst, collaboration → connector,
// consistency → strategist, clarity → explorer
// Ties broken by second-highest trait.

ONBOARDING_SWIPE_CARDS: SwipeCard[];  // 10 statements defined in onboardingData.ts
```

---

## Step-by-Step Design

### Shared UI Elements

- **Progress indicator:** Row of 8 small dots at top center. Current = accent filled, completed = solid, upcoming = faint outline. Minimal, not a progress bar.
- **Back button:** Top-left, subtle arrow icon. Hidden on step 1.
- **Transitions:** Framer Motion `AnimatePresence` with mode="wait". Enter: fade + slight slide-up (opacity 0→1, y 20→0, 400ms). Exit: fade + slide-down (opacity 1→0, y 0→-10, 200ms).
- **Background:** Clean dark (`var(--background)`) with a very subtle radial gradient glow around the center content area.
- **Typography:** Oswald for step headings, Roboto Condensed for body. All text uses CSS variables.
- **Keyboard support:** Enter/Right arrow = next, Left arrow = back, number keys for option selection where applicable.

### Step 1: Welcome + Name

**Interaction:** Typing animation + single input

**Layout:** Centered vertically. Animated North logo at top (reuse `AnimatedLogo` with `shouldAnimate`). Below: heading types out character by character: *"yo, welcome to north. what should we call you?"*. Below: single text input, large font, no label, placeholder "your name". Auto-focused. Below input: animated arrow button (→) or press Enter.

**Implementation:**
- Custom typing effect with `useEffect` + `setInterval` (30ms per character)
- Input: styled with `bg-transparent border-b-2 border-[var(--border-color)]` — underline only, no box
- Continue: disabled until name.length >= 2
- Framer Motion fade-in for the input after typing completes

**Component:** `WelcomeStep.tsx` (~80 lines)

### Step 2: College & Year

**Interaction:** Searchable dropdown + pill selector

**Layout:** Centered. *"nice to meet you, {name}. where are you studying?"* — Searchable input with dropdown for college names (local static list of top Indian colleges, ~100 entries, with "Other" + custom input). Below: *"and which year?"* — Row of tappable pills: `1st Year`, `2nd Year`, `3rd Year`, `4th Year`, `Grad`. Selected pill = accent background, scale bump.

**Implementation:**
- College search: custom combobox with `useState` filter. No external lib needed.
- Year pills: `motion.button` with `whileTap={{ scale: 0.95 }}` and layout animation on selection
- Data: `src/data/onboardingData.ts` — college list, year options

**Component:** `CollegeStep.tsx` (~100 lines)

### Step 3: Interest Bubble Picker

**Interaction:** Animated floating bubbles with physics-like drift

**Layout:** Full-screen bubble field. *"what gets you hyped? tap what vibes with you."* at top. 10 bubbles floating with gentle CSS animation (translate + rotate keyframes, randomized per bubble). Each bubble = skill category name + small icon. Tap to select: bubble glows (accent border + shadow), scales up 1.15x. Tap again to deselect. Min 2, max 5 — counter shown: "pick 2-5 (X selected)".

**Implementation:**
- No physics library — use CSS `@keyframes` with randomized `animation-duration` and `animation-delay` per bubble for organic floating feel. Each bubble gets a unique drift path via different keyframe definitions or randomized translate values.
- Bubbles: `motion.button` with `whileTap={{ scale: 0.9 }}`, selected state via Framer `animate` prop
- Layout: CSS grid or flex-wrap centered, with the CSS animation making them float
- Categories from `SKILL_CATEGORIES` constant
- Icons: react-icons/fi or react-icons/si per category

**Component:** `InterestBubblesStep.tsx` (~120 lines)

### Step 4: Learning Style Sliders

**Interaction:** Dual-label sliders + live radar chart

**Layout:** Two-column on desktop (sliders left, radar right), stacked on mobile (sliders top, radar below). *"everyone learns different. set your style."* — 4 sliders, each with opposing labels at ends:
- "Theory nerd ← → Hands-on builder"
- "Solo grinder ← → Team player"
- "Sprint learner ← → Marathon pacer"
- "Guide me ← → Let me explore"

Default: all at 50 (center). Slider thumb = accent-colored circle. As sliders move, a radar/pentagon chart on the right morphs in real-time.

**Implementation:**
- Custom range input styled with CSS (Tailwind + custom track/thumb styles)
- Radar chart: `recharts` `<RadarChart>` component — lightweight, React-native, SVG-based
- Real-time updates: sliders update store, chart re-renders reactively
- Responsive: on mobile (<768px), chart stacks below sliders at ~200px height

**New dependency:** `recharts` (only used here and potentially on dashboard later)

**Component:** `LearningStyleStep.tsx` (~140 lines)

### Step 5: Vibe Check — Swipe Cards

**Interaction:** Tinder-style swipeable card stack

**Layout:** Centered card stack. *"quick vibe check — swipe right if that's you, left if nah."* at top. Card stack showing current + 2 peeking behind. Swipe right = green glow + checkmark flash, swipe left = red glow + X flash. Below cards: left/right arrow buttons for non-touch users. Card counter: "3 of 10".

**Swipe card statements (Gen-Z relatable):**
1. "I debug at 3am and call it fun" → execution
2. "I'd rather build the thing than read the docs" → execution
3. "Group projects? I'm the one carrying" → collaboration (inverse)
4. "I can explain complex stuff so anyone gets it" → clarity
5. "I go deep into topics until I actually get it" → depth
6. "I start a lot of side projects... finishing is another story" → consistency (inverse)
7. "I love figuring out *why* something works, not just *how*" → depth
8. "I'd pick pair programming over solo coding any day" → collaboration
9. "When I commit to a streak, I don't break it" → consistency
10. "I can turn any mess into a clean diagram" → clarity

**Implementation:**
- Built with Framer Motion drag gestures: `useMotionValue`, `useTransform` for rotation/opacity
- Drag on X-axis, threshold at 150px for commit
- Card dismissed: animate off-screen (x: ±500), next card scales up from 0.95→1
- Store each swipe: `personalitySwipes[card.id] = direction === 'right'`
- Compute trait scores: sum weighted booleans per trait, normalize to 0-100

**Component:** `VibeCheckStep.tsx` (~150 lines)
**Sub-component:** `SwipeCard.tsx` (~60 lines)

### Step 6: Set Your Goal

**Interaction:** 3 large tappable cards

**Layout:** Centered. *"last thing — what's the move?"* — 3 cards in a row (desktop) or stacked (mobile):

1. **"Land my first internship"** — Icon: rocket. Sub: "1-3 month focused sprint". Maps to `internship`.
2. **"Level up for placements"** — Icon: trophy. Sub: "3-6 month structured path". Maps to `placements`.
3. **"Just exploring, no rush"** — Icon: compass. Sub: "Flexible, self-paced". Maps to `exploring`.

Selected card: accent border, scale 1.03, subtle glow shadow. Others: dim slightly (opacity 0.6).

**Implementation:**
- `motion.button` cards with `whileHover={{ scale: 1.02 }}`, `whileTap={{ scale: 0.98 }}`
- Selection triggers `computePlayerCard()` before advancing
- Continue button appears after selection with gentle fade-in

**Component:** `GoalStep.tsx` (~90 lines)

### Step 7: Player Card Reveal

**Interaction:** Cinematic card materialization

**Layout:** Screen dims momentarily (0.5s). Then a card materializes center-screen with a scale-up + glow animation. The card contains:
- Name + college at top
- Personality type badge: large text, e.g. "THE BUILDER" with type-specific accent color
- 3 interest badges (pill-shaped, from step 3)
- Mini radar chart of 5 traits (depth, execution, consistency, collaboration, clarity)
- Goal tag at bottom

Card styling: glass-morphism background, subtle gradient border, rounded-2xl. "Screenshot-worthy" energy.

Below card: *"this is you, {name}."* + "Continue" button.

**Implementation:**
- Entry animation: GSAP timeline — scale(0.8)→scale(1) + opacity(0→1) + box-shadow grow, 800ms
- Card: glass-morphism (`bg-[var(--surface-2)]/80 backdrop-blur-xl border border-[var(--border-color)]`)
- Mini radar: recharts `<RadarChart>` at 200x200
- Personality type computed from dominant trait combo in `computePlayerCard()`

**Component:** `PlayerCardReveal.tsx` (~130 lines)

### Step 8: Roadmap Reveal → Dashboard

**Interaction:** Animated skill node tree + CTA

**Layout:** Player card shrinks/slides up. Below, a simplified skill tree appears: 3-5 nodes connected by animated paths. Nodes light up sequentially (staggered 300ms each) from left to right. *"here's your path, {name}. let's get started."*

Pulsing CTA button: "Enter Dashboard →"

**Implementation:**
- Skill nodes: custom SVG circles + connecting lines, animated with GSAP stagger
- Each node = skill name + icon, styled as small circles with accent glow when "lit"
- CTA: `motion.button` with infinite subtle pulse (`scale: [1, 1.03, 1]`)
- On click: `markCompleted()`, router.push('/dashboard')
- Transition: page fades out, dashboard fades in

**Component:** `RoadmapReveal.tsx` (~120 lines)

---

## File Structure

```
src/
├── app/
│   └── onboarding/
│       └── page.tsx                    # Server wrapper
├── components/
│   └── onboarding/
│       ├── OnboardingWizard.tsx         # Step orchestrator + transitions
│       ├── OnboardingProgress.tsx       # Dot progress indicator
│       └── steps/
│           ├── WelcomeStep.tsx
│           ├── CollegeStep.tsx
│           ├── InterestBubblesStep.tsx
│           ├── LearningStyleStep.tsx
│           ├── VibeCheckStep.tsx
│           ├── SwipeCard.tsx
│           ├── GoalStep.tsx
│           ├── PlayerCardReveal.tsx
│           └── RoadmapReveal.tsx
├── store/
│   └── onboardingStore.ts
├── data/
│   └── onboardingData.ts              # Colleges list, swipe cards, personality types
├── types/
│   └── index.ts                       # Extended with onboarding types
└── constants/
    └── index.ts                       # Extended with ONBOARDING route + constants
```

---

## Dependencies

**Existing (no install needed):**
- `framer-motion` — all transitions, drag gestures, AnimatePresence
- `gsap` — player card reveal timeline, roadmap node stagger
- `react-icons` — category icons, goal icons
- `zustand` — onboarding store

**New (needs install):**
- `recharts` — radar chart in learning style step + player card reveal. Lightweight (~45KB gzipped), React-native, SVG-based. Used for 2 charts total. Will also be useful for dashboard analytics later.

---

## Responsive Breakpoints

| Breakpoint | Behavior |
|-----------|----------|
| < 640px (mobile) | Full-screen steps, stacked layouts, swipe cards full-width, bubbles in 3-col grid with float animation, sliders stacked above chart |
| 640-768px (tablet) | Slight padding increase, bubbles in 4-col, goal cards in row |
| 768px+ (desktop) | Two-column layouts where applicable, larger cards, more generous spacing |

All steps must work with touch (tap, swipe, drag) and mouse+keyboard (click, arrow keys, Enter).

---

## Design Principles Applied

1. **Progressive disclosure** — one question per screen, never overwhelming
2. **Immediate feedback** — every tap/swipe/drag has instant visual response
3. **Low time-to-first-win** — ~90 seconds to see your personalized player card
4. **Gamification without gimmicks** — swipe cards and bubble picker feel fun, not forced
5. **Personality through copy** — Gen-Z tone carries the brand without needing heavy illustration
6. **Deferred complexity** — simple on the surface, rich data capture underneath
7. **YAGNI** — no skip button (each step is fast enough it's unnecessary), no save-and-resume (90 seconds total)

---

## Theme Compliance

All colors use CSS variables from `globals.css`. Tested in both dark and light modes:
- Dark: default experience, accent yellow pops on dark surfaces
- Light: clean white backgrounds, accent still yellow, glass effects use lighter surface vars
- The `nav-over-hero` pattern is NOT needed here (no hero section)
