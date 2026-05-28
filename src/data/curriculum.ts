/**
 * North curriculum — single source of truth for skill content (mock layer).
 *
 * Authored from research-agent output dated 2026-05-28. 25 skills covering
 * the modern web dev stack — compressed fundamentals, then production frontend,
 * backend, AI integration, ship-it. ~266 hours total for a focused student.
 *
 * For v1 (testing phase), this is THE source. The dashboard, skill detail
 * page, and diagnostic page all read from here. Backend wiring lands later.
 */

export type SkillDifficulty = 'beginner' | 'intermediate' | 'advanced';
export type SkillStatus =
  | 'locked'
  | 'unlocked'
  | 'in-progress'
  | 'completed'
  | 'reinforced';
export type LessonKind = 'read' | 'watch' | 'doc' | 'note';

export interface CurriculumLesson {
  id: string;
  title: string;
  kind: LessonKind;
  url?: string;
  body?: string;
  estimatedMinutes: number;
  source?: string;
}

export interface ExerciseSpec {
  title: string;
  brief: string;
  bullets: string[];
  starterCode?: { filename: string; content: string }[];
  englishPromptHint?: string;
}

export interface SkipChallengeQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

export interface SkipChallenge {
  passingScore: number;
  questions: SkipChallengeQuestion[];
  codeTaskBrief?: string;
}

export interface CurriculumSkill {
  slug: string;
  name: string;
  description: string;
  whyNow: string;
  branch: CurriculumBranch;
  difficulty: SkillDifficulty;
  estimatedHours: number;
  topics: string[];
  prerequisites: string[];
  lessons: CurriculumLesson[];
  exercise: ExerciseSpec;
  skipChallenge?: SkipChallenge;
}

export type CurriculumBranch =
  | 'Core'
  | 'Frontend Stack'
  | 'Production Frontend'
  | 'Backend & Data'
  | 'AI Layer'
  | 'Ship It';

export interface BranchInfo {
  name: CurriculumBranch;
  description: string;
  order: number;
}

export const branches: BranchInfo[] = [
  { name: 'Core', description: 'Tight fundamentals. Compressed.', order: 0 },
  { name: 'Frontend Stack', description: 'The modern React toolchain.', order: 1 },
  { name: 'Production Frontend', description: 'What ships at real companies.', order: 2 },
  { name: 'Backend & Data', description: 'APIs, databases, auth that work.', order: 3 },
  { name: 'AI Layer', description: 'LLMs as a primitive, not a side quest.', order: 4 },
  { name: 'Ship It', description: 'Deploy, observe, secure, prove it.', order: 5 },
];

// ─── Curriculum: 25 nodes ──────────────────────────────────────────────────

export const curriculum: CurriculumSkill[] = [
  // ─── CORE ─────────────────────────────────────────────────────────────────

  {
    slug: 'web-platform',
    name: 'How the Web Actually Works',
    description:
      'The request/response lifecycle, browser internals, and what happens between typing a URL and pixels on screen.',
    whyNow:
      'You cannot reason about Server Components, edge runtimes, or streaming without understanding HTTP, caching layers, and the rendering pipeline.',
    branch: 'Core',
    difficulty: 'beginner',
    estimatedHours: 5,
    topics: [
      'HTTP/2 & HTTP/3',
      'DNS & TLS',
      'Browser Rendering Pipeline',
      'Critical Rendering Path',
      'Caching Headers',
      'CDNs & Edge Networks',
    ],
    prerequisites: [],
    lessons: [
      { id: 'l1', title: 'High-performance browser networking', kind: 'read', url: 'https://hpbn.co/', source: 'hpbn.co', estimatedMinutes: 20 },
      { id: 'l2', title: 'Inside the browser rendering pipeline', kind: 'doc', url: 'https://web.dev/articles/howbrowserswork', source: 'web.dev', estimatedMinutes: 15 },
      { id: 'l3', title: 'HTTP caching headers — a practical map', kind: 'doc', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching', source: 'MDN', estimatedMinutes: 10 },
    ],
    exercise: {
      title: 'Dissect a real page load',
      brief: 'Open DevTools on github.com, run a load with cache disabled, and produce a written report.',
      bullets: [
        'Identify the render-blocking resources.',
        'Note which assets came from cache, edge, or origin.',
        'Quantify the TLS handshake cost.',
        'Pick one optimization the team could ship.',
      ],
      englishPromptHint:
        'Walk through the waterfall step by step. Why are certain assets render-blocking? What changes if the user is on the cache-warm second visit?',
    },
    skipChallenge: {
      passingScore: 3,
      questions: [
        {
          id: 'q1',
          prompt: 'Which HTTP feature lets a server push multiple resources over one connection?',
          options: ['HTTP/1.1 pipelining', 'HTTP/2 multiplexing', 'WebSockets', 'gRPC streaming'],
          correctIndex: 1,
        },
        {
          id: 'q2',
          prompt: 'What does `Cache-Control: stale-while-revalidate=60` do?',
          options: [
            'Drops cache after 60s',
            'Serves stale content for 60s while revalidating in the background',
            'Refreshes every 60s no matter what',
            'Blocks the response for 60s',
          ],
          correctIndex: 1,
        },
        {
          id: 'q3',
          prompt: 'A CDN edge node is closest to which party?',
          options: ['Origin server', 'Database', 'End user', 'DNS root'],
          correctIndex: 2,
        },
        {
          id: 'q4',
          prompt: 'Critical Rendering Path bottlenecks usually involve which assets?',
          options: ['JSON', 'Render-blocking CSS and synchronous JS', 'Fonts (always)', 'Images'],
          correctIndex: 1,
        },
      ],
    },
  },

  {
    slug: 'html-css-essentials',
    name: 'HTML & CSS Essentials (Compressed)',
    description: 'Semantic HTML, the modern CSS layout model (Flexbox + Grid + Subgrid), and accessibility-by-default.',
    whyNow:
      'Most "frontend" problems trace back to bad markup or layout; we compress the basics so we can spend weeks on what actually ships.',
    branch: 'Core',
    difficulty: 'beginner',
    estimatedHours: 8,
    topics: ['Semantic Landmarks', 'ARIA Roles & Labels', 'Flexbox', 'CSS Grid + Subgrid', 'Logical Properties', 'Form Controls'],
    prerequisites: ['web-platform'],
    lessons: [
      { id: 'l1', title: 'Semantic HTML in practice', kind: 'doc', url: 'https://developer.mozilla.org/en-US/docs/Glossary/Semantics', source: 'MDN', estimatedMinutes: 12 },
      { id: 'l2', title: 'A complete guide to Flexbox', kind: 'doc', url: 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/', source: 'CSS-Tricks', estimatedMinutes: 18 },
      { id: 'l3', title: 'A complete guide to Grid', kind: 'doc', url: 'https://css-tricks.com/snippets/css/complete-guide-grid/', source: 'CSS-Tricks', estimatedMinutes: 20 },
      { id: 'l4', title: 'Inclusive form controls', kind: 'read', url: 'https://www.smashingmagazine.com/2023/03/guide-accessible-form-validation/', source: 'Smashing', estimatedMinutes: 14 },
    ],
    exercise: {
      title: 'Rebuild a Stripe section, accessibly',
      brief: 'Recreate a Stripe or Linear marketing section, pixel-aware, mobile-first, keyboard-navigable.',
      bullets: [
        'Use semantic landmarks (header/main/section).',
        'Lighthouse Accessibility score of 100.',
        'Layout works at 360px, 768px, 1280px without horizontal scroll.',
        'All interactive elements reachable by keyboard.',
      ],
    },
  },

  {
    slug: 'modern-css',
    name: 'Modern CSS (2026 Edition)',
    description: 'Container queries, `:has()`, cascade layers, nesting, view transitions, scroll-driven animations, color-mix().',
    whyNow: 'Browsers shipped a half-decade of features in 2024-25; component-driven layout now lives in CSS, not JS.',
    branch: 'Core',
    difficulty: 'intermediate',
    estimatedHours: 8,
    topics: [
      'Container Queries',
      ':has() Parent Selector',
      'Cascade Layers (@layer)',
      'Native Nesting',
      'View Transitions API',
      'Scroll-Driven Animations',
      'color-mix() & OKLCH',
    ],
    prerequisites: ['html-css-essentials'],
    lessons: [
      { id: 'l1', title: 'A primer on container queries', kind: 'read', url: 'https://developer.chrome.com/docs/css-ui/container-queries', source: 'web.dev', estimatedMinutes: 12 },
      { id: 'l2', title: 'The :has() relational selector', kind: 'doc', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/:has', source: 'MDN', estimatedMinutes: 8 },
      { id: 'l3', title: 'View Transitions, deeply', kind: 'read', url: 'https://developer.chrome.com/docs/web-platform/view-transitions', source: 'web.dev', estimatedMinutes: 15 },
      { id: 'l4', title: 'Cascade layers — sane CSS at scale', kind: 'read', url: 'https://css-tricks.com/css-cascade-layers/', source: 'CSS-Tricks', estimatedMinutes: 10 },
    ],
    exercise: {
      title: 'Container-query card + View Transitions',
      brief: 'Build a card component that fluidly adapts via container queries, and animate page transitions using the View Transitions API — zero JS animation library.',
      bullets: [
        'Card layout switches at 3 container breakpoints.',
        'Page-to-page navigation uses View Transitions.',
        'No animation library — only CSS + the API.',
        'Works in light and dark mode via color-mix().',
      ],
    },
  },

  {
    slug: 'js-modern',
    name: 'Modern JavaScript (ES2024+)',
    description: 'Modules, async/await, structured cloning, iterators, Temporal, top-level await.',
    whyNow: 'Compresses what most curricula spread over 6 weeks; targeted at students who already know variables and loops.',
    branch: 'Core',
    difficulty: 'intermediate',
    estimatedHours: 12,
    topics: [
      'ES Modules',
      'Destructuring & Spread',
      'Async/Await & AbortController',
      'Iterators & Generators',
      'Map/Set/WeakMap',
      'Temporal API',
      'Structured Clone',
    ],
    prerequisites: ['web-platform'],
    lessons: [
      { id: 'l1', title: 'JavaScript modules', kind: 'doc', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules', source: 'MDN', estimatedMinutes: 15 },
      { id: 'l2', title: 'Async/await + AbortController', kind: 'doc', url: 'https://developer.mozilla.org/en-US/docs/Web/API/AbortController', source: 'MDN', estimatedMinutes: 12 },
      { id: 'l3', title: 'Iterators and generators', kind: 'doc', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_generators', source: 'MDN', estimatedMinutes: 14 },
      { id: 'l4', title: 'Temporal proposal — finally fixing Date', kind: 'read', url: 'https://tc39.es/proposal-temporal/docs/', source: 'TC39', estimatedMinutes: 10 },
    ],
    exercise: {
      title: 'Cancellable search-as-you-type',
      brief: 'Build a paginated, cancellable search against the GitHub API using only Fetch + AbortController + an async iterator.',
      bullets: [
        'Cancel in-flight requests when user keeps typing.',
        'Iterate pages with an async generator.',
        'Handle network errors gracefully.',
        'No third-party libraries.',
      ],
    },
  },

  {
    slug: 'typescript',
    name: 'TypeScript for Real Apps',
    description: 'Types that catch real bugs: discriminated unions, generics, inference, `satisfies`, narrowing, Zod schemas.',
    whyNow: 'TS is no longer optional. Every modern framework, library, and job posting assumes it.',
    branch: 'Core',
    difficulty: 'intermediate',
    estimatedHours: 14,
    topics: [
      'Types vs Interfaces',
      'Discriminated Unions',
      'Generics',
      'Inference & `satisfies`',
      'Utility Types',
      'Zod Schemas',
      'Type-Safe Env Vars',
    ],
    prerequisites: ['js-modern'],
    lessons: [
      { id: 'l1', title: 'TypeScript handbook — essentials', kind: 'doc', url: 'https://www.typescriptlang.org/docs/handbook/2/basic-types.html', source: 'typescriptlang.org', estimatedMinutes: 25 },
      { id: 'l2', title: 'Total TypeScript essentials', kind: 'read', url: 'https://www.totaltypescript.com/books/total-typescript-essentials', source: 'Matt Pocock', estimatedMinutes: 30 },
      { id: 'l3', title: 'Zod: schemas at runtime, types at compile time', kind: 'doc', url: 'https://zod.dev', source: 'zod.dev', estimatedMinutes: 12 },
    ],
    exercise: {
      title: 'Type a REST client end-to-end',
      brief: 'Convert an untyped JS REST client using generics and Zod so response shapes are validated at runtime and inferred at compile time.',
      bullets: [
        'One generic `apiFetch<T>(schema)` helper.',
        'Zod schemas for at least 3 endpoint responses.',
        'Compile errors when consumers misuse a response field.',
        'Runtime errors when the API returns unexpected shape.',
      ],
    },
  },

  {
    slug: 'git-github-flow',
    name: 'Git, GitHub & Team Workflow',
    description: 'Branching, rebasing, PRs, code review, GitHub Actions basics, trunk-based development.',
    whyNow: 'Solo `git commit -m "fix"` is not a skill; reviewing a teammate\'s PR is.',
    branch: 'Core',
    difficulty: 'beginner',
    estimatedHours: 6,
    topics: ['Rebase vs Merge', 'Pull Request Etiquette', 'Conventional Commits', 'GitHub Actions (CI)', 'Branch Protection', 'Resolving Conflicts'],
    prerequisites: ['web-platform'],
    lessons: [
      { id: 'l1', title: 'Pro Git — branching basics', kind: 'read', url: 'https://git-scm.com/book/en/v2/Git-Branching-Branches-in-a-Nutshell', source: 'git-scm.com', estimatedMinutes: 20 },
      { id: 'l2', title: 'How to write a good PR description', kind: 'read', url: 'https://github.blog/2022-06-21-write-better-commits-build-better-projects/', source: 'GitHub Blog', estimatedMinutes: 8 },
      { id: 'l3', title: 'Conventional commits', kind: 'doc', url: 'https://www.conventionalcommits.org/', source: 'conventionalcommits.org', estimatedMinutes: 6 },
    ],
    exercise: {
      title: 'Ship an open-source PR',
      brief: 'Open a real PR against an open-source repo (good-first-issue), respond to review comments, get it merged.',
      bullets: [
        'Find a real `good-first-issue`.',
        'Branch, commit conventionally, open the PR.',
        'Engage with reviewer feedback.',
        'Submit a link to the merged PR.',
      ],
    },
  },

  // ─── FRONTEND STACK ───────────────────────────────────────────────────────

  {
    slug: 'tooling-vite',
    name: 'Modern Build Tooling',
    description: 'Vite, esbuild, package managers (pnpm), monorepo basics, and why Turbopack now matters.',
    whyNow: 'Webpack is on its way out; Vite/Turbopack are the present. You need to know what bundling does, not configure it from scratch.',
    branch: 'Frontend Stack',
    difficulty: 'intermediate',
    estimatedHours: 5,
    topics: ['Vite Dev Server & HMR', 'pnpm Workspaces', 'esbuild & SWC', 'Source Maps', 'Code Splitting', 'Tree Shaking'],
    prerequisites: ['js-modern'],
    lessons: [
      { id: 'l1', title: 'Vite guide — the why', kind: 'doc', url: 'https://vite.dev/guide/why', source: 'vite.dev', estimatedMinutes: 10 },
      { id: 'l2', title: 'pnpm workspaces basics', kind: 'doc', url: 'https://pnpm.io/workspaces', source: 'pnpm.io', estimatedMinutes: 10 },
    ],
    exercise: {
      title: 'Vite + pnpm monorepo',
      brief: 'Scaffold a Vite + TS + pnpm workspace with two packages (a shared `ui` lib and a consumer `app`), HMR working across packages.',
      bullets: [
        'Two packages in a single pnpm workspace.',
        'Editing the `ui` package live-updates the `app`.',
        'Production build produces tree-shaken output.',
        'Both packages share TS config via `tsconfig` extends.',
      ],
    },
  },

  {
    slug: 'tailwind-shadcn',
    name: 'Tailwind CSS & shadcn/ui',
    description: 'Utility-first styling, design tokens, dark mode, and composing accessible primitives from shadcn/ui + Radix.',
    whyNow: 'Tailwind v4 + shadcn is the de facto stack for Next.js, Remix, and most React apps shipping in 2026.',
    branch: 'Frontend Stack',
    difficulty: 'intermediate',
    estimatedHours: 8,
    topics: ['Tailwind v4 Engine', 'Design Tokens (@theme)', 'cn() & tailwind-merge', 'shadcn CLI', 'Radix Primitives', 'Dark Mode Strategies'],
    prerequisites: ['modern-css', 'typescript'],
    lessons: [
      { id: 'l1', title: 'Tailwind v4 — what changed', kind: 'doc', url: 'https://tailwindcss.com/docs/v4-beta', source: 'tailwindcss.com', estimatedMinutes: 12 },
      { id: 'l2', title: 'shadcn — the philosophy', kind: 'doc', url: 'https://ui.shadcn.com/docs', source: 'shadcn.com', estimatedMinutes: 8 },
      { id: 'l3', title: 'Radix primitives — accessible by default', kind: 'doc', url: 'https://www.radix-ui.com/primitives/docs/overview/introduction', source: 'radix-ui.com', estimatedMinutes: 12 },
    ],
    exercise: {
      title: 'Settings page in shadcn',
      brief: 'Build a settings page with form, modal, dropdown, and toast using shadcn primitives + Tailwind tokens.',
      bullets: [
        'Composes Form, Dialog, DropdownMenu, Toast.',
        'Themable via one CSS-variable swap.',
        'Works in light and dark mode.',
        'Keyboard-navigable end-to-end.',
      ],
    },
  },

  {
    slug: 'react-19',
    name: 'React 19 Fundamentals',
    description: 'Function components, hooks, lifecycle thinking, suspense, transitions, the new use() hook + Actions.',
    whyNow: 'React 19 made async data + form handling first-class; class components and most older patterns are gone.',
    branch: 'Frontend Stack',
    difficulty: 'intermediate',
    estimatedHours: 18,
    topics: [
      'JSX & Components',
      'useState / useEffect / useRef',
      'useTransition & useOptimistic',
      'use() Hook',
      'Suspense Boundaries',
      'React Compiler basics',
    ],
    prerequisites: ['typescript', 'tooling-vite'],
    lessons: [
      { id: 'l1', title: 'React: thinking in components', kind: 'doc', url: 'https://react.dev/learn/thinking-in-react', source: 'react.dev', estimatedMinutes: 18 },
      { id: 'l2', title: 'React 19 — what\'s new', kind: 'read', url: 'https://react.dev/blog/2024/12/05/react-19', source: 'react.dev', estimatedMinutes: 12 },
      { id: 'l3', title: 'useOptimistic in practice', kind: 'doc', url: 'https://react.dev/reference/react/useOptimistic', source: 'react.dev', estimatedMinutes: 10 },
      { id: 'l4', title: 'React Compiler — when memo is automatic', kind: 'read', url: 'https://react.dev/learn/react-compiler', source: 'react.dev', estimatedMinutes: 10 },
    ],
    exercise: {
      title: 'Optimistic Kanban',
      brief: 'Build a Kanban board with optimistic drag-and-drop using `useOptimistic` and Suspense — no external state lib.',
      bullets: [
        'Columns + cards with drag-and-drop.',
        '`useOptimistic` for instant visual feedback.',
        'Async "save" that can fail and reverts.',
        'No third-party state library.',
      ],
    },
    skipChallenge: {
      passingScore: 3,
      questions: [
        {
          id: 'q1',
          prompt: 'Which hook lets you mark a state update as non-urgent so the UI stays responsive?',
          options: ['useDeferredValue', 'useTransition', 'useLayoutEffect', 'useId'],
          correctIndex: 1,
        },
        {
          id: 'q2',
          prompt: 'After React Compiler, when do you still need manual useMemo?',
          options: [
            'Always — the compiler is a hint',
            'Only when the compiler bails out (unknown referential identity)',
            'Never — the compiler handles every case',
            'Only on the server',
          ],
          correctIndex: 1,
        },
        {
          id: 'q3',
          prompt: 'What does `useOptimistic` give you?',
          options: [
            'A way to subscribe to server state',
            'An immediate UI value that resolves to the real one when the async action completes',
            'A debounced state setter',
            'A way to memoize a value',
          ],
          correctIndex: 1,
        },
        {
          id: 'q4',
          prompt: '<Suspense> primarily handles which scenario?',
          options: [
            'Error boundaries',
            'Showing a fallback while a child is loading data or code',
            'Lazy hydration',
            'Server-side caching',
          ],
          correctIndex: 1,
        },
      ],
    },
  },

  {
    slug: 'react-patterns',
    name: 'React Patterns & Performance',
    description: 'Composition, custom hooks, when to memoize (and when not to), error boundaries, react-hook-form.',
    whyNow: 'React Compiler changed perf advice; knowing what NOT to do is now half the skill.',
    branch: 'Frontend Stack',
    difficulty: 'advanced',
    estimatedHours: 10,
    topics: ['Custom Hooks', 'Compound Components', 'Context Splitting', 'Error Boundaries', 'react-hook-form + Zod', 'When React Compiler skips memo'],
    prerequisites: ['react-19'],
    lessons: [
      { id: 'l1', title: 'You probably don\'t need an effect', kind: 'doc', url: 'https://react.dev/learn/you-might-not-need-an-effect', source: 'react.dev', estimatedMinutes: 14 },
      { id: 'l2', title: 'react-hook-form quickstart', kind: 'doc', url: 'https://react-hook-form.com/get-started', source: 'react-hook-form.com', estimatedMinutes: 12 },
      { id: 'l3', title: 'Compound components in practice', kind: 'read', url: 'https://kentcdodds.com/blog/compound-components-with-react-hooks', source: 'Kent C. Dodds', estimatedMinutes: 10 },
    ],
    exercise: {
      title: 'Multi-step wizard form',
      brief: 'Build a multi-step wizard with validation per step, persisted draft, and undo, using react-hook-form + Zod + a custom `useWizard` hook.',
      bullets: [
        'At least 3 steps with per-step Zod validation.',
        'Drafts persisted to localStorage.',
        'Undo / step-back without losing data.',
        'Compound-component API for the wizard.',
      ],
    },
  },

  {
    slug: 'data-fetching',
    name: 'Data Fetching & Client State',
    description: 'Server state vs client state, caching, mutations, optimistic updates — TanStack Query + Zustand.',
    whyNow: '80% of "state management" is server-cache management. Redux is mostly dead; TanStack Query is dominant.',
    branch: 'Frontend Stack',
    difficulty: 'advanced',
    estimatedHours: 10,
    topics: ['TanStack Query (queries/mutations)', 'Cache Invalidation', 'Optimistic Updates', 'Zustand for UI State', 'Suspense Integration', 'Pagination & Infinite Scroll'],
    prerequisites: ['react-patterns'],
    lessons: [
      { id: 'l1', title: 'TanStack Query — important defaults', kind: 'doc', url: 'https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults', source: 'tanstack.com', estimatedMinutes: 12 },
      { id: 'l2', title: 'Server state vs client state', kind: 'read', url: 'https://tkdodo.eu/blog/server-state-vs-client-state', source: 'tkdodo.eu', estimatedMinutes: 10 },
      { id: 'l3', title: 'Zustand essentials', kind: 'doc', url: 'https://zustand.docs.pmnd.rs/', source: 'pmnd.rs', estimatedMinutes: 10 },
    ],
    exercise: {
      title: 'Feed → TanStack Query + Zustand',
      brief: 'Convert a useState/useEffect-based feed into TanStack Query with optimistic likes and infinite scroll.',
      bullets: [
        'Replace effects with `useQuery`/`useMutation`.',
        'Optimistic like with rollback on failure.',
        'Infinite scroll via `useInfiniteQuery`.',
        'UI-only state (filter, modal) in Zustand.',
      ],
    },
  },

  // ─── PRODUCTION FRONTEND ─────────────────────────────────────────────────

  {
    slug: 'nextjs-app-router',
    name: 'Next.js 16 App Router',
    description: 'Server Components, Server Actions, layouts, route handlers, streaming, Partial Prerendering.',
    whyNow: 'Server Components are the biggest paradigm shift in React in a decade — and the default in every new Next.js project.',
    branch: 'Production Frontend',
    difficulty: 'advanced',
    estimatedHours: 20,
    topics: [
      'Server vs Client Components',
      'Server Actions',
      'Layouts & Templates',
      'Streaming with Suspense',
      'Partial Prerendering (PPR)',
      'Route Handlers',
      'Middleware',
    ],
    prerequisites: ['react-patterns', 'data-fetching'],
    lessons: [
      { id: 'l1', title: 'Next.js — the App Router', kind: 'doc', url: 'https://nextjs.org/docs/app/getting-started', source: 'nextjs.org', estimatedMinutes: 25 },
      { id: 'l2', title: 'Server and Client Components, explained', kind: 'doc', url: 'https://nextjs.org/docs/app/getting-started/server-and-client-components', source: 'nextjs.org', estimatedMinutes: 14 },
      { id: 'l3', title: 'Server Actions: mutations without an API route', kind: 'doc', url: 'https://nextjs.org/docs/app/getting-started/updating-data', source: 'nextjs.org', estimatedMinutes: 12 },
      { id: 'l4', title: 'Partial Prerendering — the new default', kind: 'read', url: 'https://nextjs.org/learn/dashboard-app/partial-prerendering', source: 'nextjs.org', estimatedMinutes: 10 },
      { id: 'l5', title: 'When NOT to reach for a Server Component', kind: 'note', body: 'Interactive widgets (drag, hover, complex local state) stay client. Heuristic: if it needs an event handler, it\'s a client component.', estimatedMinutes: 4 },
    ],
    exercise: {
      title: 'Blog with PPR + Server Actions',
      brief: 'Build a blog with a static shell + dynamic comments via PPR; mutations via Server Actions with `useOptimistic` — no client-side API client.',
      bullets: [
        'Article pages prerender; comments stream in via Suspense.',
        'Add Comment uses a Server Action.',
        '`useOptimistic` shows the comment instantly.',
        '`revalidatePath` refreshes the list on success.',
      ],
      starterCode: [
        {
          filename: 'app/post/[slug]/page.tsx',
          content:
            "import { Suspense } from 'react';\n\nexport default function PostPage({ params }: { params: { slug: string } }) {\n  return (\n    <article className=\"max-w-2xl mx-auto p-8\">\n      {/* TODO: render post header (static) */}\n      <Suspense fallback={<div className=\"text-sm opacity-60\">loading comments…</div>}>\n        {/* TODO: <Comments postSlug={params.slug} /> */}\n      </Suspense>\n    </article>\n  );\n}\n",
        },
        {
          filename: 'app/post/[slug]/actions.ts',
          content:
            "'use server';\n\nimport { revalidatePath } from 'next/cache';\n\nexport async function addComment(formData: FormData) {\n  // TODO: validate, write to store, revalidatePath(`/post/${slug}`)\n}\n",
        },
      ],
      englishPromptHint:
        'Why is the static shell separate from the dynamic comments? When does `revalidatePath` actually re-render, and what triggers Suspense to re-suspend?',
    },
    skipChallenge: {
      passingScore: 3,
      questions: [
        {
          id: 'q1',
          prompt: 'In a Server Component, where does the data fetch run?',
          options: [
            'In the browser, before hydration',
            'On the server, before HTML is sent',
            'In a Web Worker',
            'After hydration, in useEffect',
          ],
          correctIndex: 1,
        },
        {
          id: 'q2',
          prompt: 'Which directive marks a function as a Server Action?',
          options: ["'use cache'", "'use action'", "'use server'", "'use rsc'"],
          correctIndex: 2,
        },
        {
          id: 'q3',
          prompt: 'A component needs onClick handlers and useState. Server or Client?',
          options: [
            'Server — handlers attach after hydration',
            'Client — Server Components cannot use event handlers or state',
            'Either, with Suspense',
            'Depends on default export',
          ],
          correctIndex: 1,
        },
        {
          id: 'q4',
          prompt: 'After a Server Action mutates data, what refreshes the listing?',
          options: [
            'router.refresh() inside the action',
            'Throw and let Next.js retry',
            'revalidatePath() or revalidateTag() inside the action',
            'Set a cookie and reload',
          ],
          correctIndex: 2,
        },
      ],
      codeTaskBrief:
        'Write a Server Action that takes a postId, deletes it from a mock store, and revalidates the /posts path.',
    },
  },

  {
    slug: 'caching-rendering',
    name: 'Caching, Rendering & the Edge',
    description: '`use cache`, `cacheTag`, `cacheLife`, ISR, edge vs Node runtimes, and how a CDN serves your page.',
    whyNow: 'Cache Components shipped in Next 16; getting caching wrong is the #1 cause of "it worked locally" prod bugs.',
    branch: 'Production Frontend',
    difficulty: 'advanced',
    estimatedHours: 8,
    topics: ['use cache Directive', 'cacheTag & updateTag', 'cacheLife Profiles', 'Edge vs Node Runtime', 'ISR & On-Demand Revalidation', 'Vercel CDN Behavior'],
    prerequisites: ['nextjs-app-router'],
    lessons: [
      { id: 'l1', title: 'Cache Components in Next 16', kind: 'doc', url: 'https://nextjs.org/docs/app/api-reference/directives/use-cache', source: 'nextjs.org', estimatedMinutes: 12 },
      { id: 'l2', title: 'cacheTag and updateTag', kind: 'doc', url: 'https://nextjs.org/docs/app/api-reference/functions/cacheTag', source: 'nextjs.org', estimatedMinutes: 10 },
      { id: 'l3', title: 'Edge vs Node runtime — when to pick which', kind: 'read', url: 'https://nextjs.org/docs/app/api-reference/edge', source: 'nextjs.org', estimatedMinutes: 8 },
    ],
    exercise: {
      title: 'Slow listing → cached + tag-invalidated',
      brief: 'Take a slow product-listing page, add `use cache` with proper tags, invalidate via `updateTag` from an admin Server Action.',
      bullets: [
        'Initial TTFB measured before changes.',
        '`use cache` + per-product tag applied.',
        'Admin action `updateTag(productId)` flushes only that entry.',
        'Measure TTFB after — include both numbers in the write-up.',
      ],
    },
  },

  {
    slug: 'accessibility-perf',
    name: 'Accessibility & Core Web Vitals',
    description: 'WCAG 2.2 essentials, screen reader testing, and shipping LCP/INP/CLS in the green.',
    whyNow: 'Google ranks on it, regulations require it, INP replaced FID — most apps are now failing.',
    branch: 'Production Frontend',
    difficulty: 'intermediate',
    estimatedHours: 8,
    topics: ['Keyboard Navigation', 'ARIA Live Regions', 'Screen Reader Testing (NVDA/VoiceOver)', 'LCP / INP / CLS', 'Lighthouse CI', 'Image & Font Optimization'],
    prerequisites: ['nextjs-app-router', 'modern-css'],
    lessons: [
      { id: 'l1', title: 'WCAG 2.2 — what changed', kind: 'doc', url: 'https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/', source: 'w3.org', estimatedMinutes: 10 },
      { id: 'l2', title: 'Core Web Vitals in 2026', kind: 'read', url: 'https://web.dev/articles/vitals', source: 'web.dev', estimatedMinutes: 12 },
      { id: 'l3', title: 'Optimizing INP', kind: 'read', url: 'https://web.dev/articles/optimize-inp', source: 'web.dev', estimatedMinutes: 12 },
    ],
    exercise: {
      title: 'Audit & fix the blog from earlier',
      brief: 'Take your blog from the App Router exercise; achieve a real Lighthouse score >95 across all four categories and pass a screen-reader walkthrough.',
      bullets: [
        'LCP, INP, CLS all green.',
        'Lighthouse Accessibility = 100.',
        'Navigable with screen reader (NVDA or VoiceOver).',
        'Lazy-loaded images, system fonts or self-hosted with `font-display: optional`.',
      ],
    },
  },

  // ─── BACKEND & DATA ──────────────────────────────────────────────────────

  {
    slug: 'databases-postgres',
    name: 'Databases & PostgreSQL',
    description: 'Relational modeling, SQL essentials, indexes, transactions, when JSONB is the right call.',
    whyNow: 'Postgres ate the database world (Supabase, Neon, Vercel Postgres). Knowing it deeply is leverage.',
    branch: 'Backend & Data',
    difficulty: 'intermediate',
    estimatedHours: 14,
    topics: ['Schema Design', 'Joins & Subqueries', 'Indexes & EXPLAIN', 'Transactions & Isolation', 'JSONB', 'Migrations', 'Row-Level Security'],
    prerequisites: ['git-github-flow'],
    lessons: [
      { id: 'l1', title: 'PostgreSQL — getting started', kind: 'doc', url: 'https://www.postgresql.org/docs/current/tutorial.html', source: 'postgresql.org', estimatedMinutes: 20 },
      { id: 'l2', title: 'Use the index, Luke', kind: 'read', url: 'https://use-the-index-luke.com/', source: 'Markus Winand', estimatedMinutes: 30 },
      { id: 'l3', title: 'JSONB — when and why', kind: 'read', url: 'https://www.crunchydata.com/blog/jsonb-types-and-performance-in-postgresql', source: 'Crunchy Data', estimatedMinutes: 10 },
    ],
    exercise: {
      title: 'Model a multi-tenant SaaS',
      brief: 'Model a SaaS (orgs, users, projects, billing) in Postgres; write the 5 hardest analytical queries; index them to sub-10ms.',
      bullets: [
        'Normalized schema with FKs.',
        'Five analytical queries with EXPLAIN.',
        'Indexes that drop each query below 10ms.',
        'Migrations versioned in `migrations/`.',
      ],
    },
  },

  {
    slug: 'prisma-drizzle',
    name: 'Type-Safe ORMs (Prisma & Drizzle)',
    description: 'Schema-first modeling, migrations, generated types, query builders.',
    whyNow: 'Hand-rolling SQL strings into TS is over; type-safe ORMs are how production teams ship.',
    branch: 'Backend & Data',
    difficulty: 'intermediate',
    estimatedHours: 8,
    topics: ['Prisma Schema & Migrate', 'Drizzle Schema & Queries', 'Type Inference', 'Relations & N+1', 'Seed Scripts', 'Edge Compatibility'],
    prerequisites: ['typescript', 'databases-postgres'],
    lessons: [
      { id: 'l1', title: 'Prisma quickstart', kind: 'doc', url: 'https://www.prisma.io/docs/getting-started', source: 'prisma.io', estimatedMinutes: 14 },
      { id: 'l2', title: 'Drizzle quickstart', kind: 'doc', url: 'https://orm.drizzle.team/docs/get-started', source: 'orm.drizzle.team', estimatedMinutes: 14 },
    ],
    exercise: {
      title: 'Same schema, two ORMs',
      brief: 'Take the SaaS schema and implement it in BOTH Prisma and Drizzle; write a one-page comparison of DX, perf, and bundle size.',
      bullets: [
        'Both implementations expose the same query API.',
        'Migrations work end-to-end in both.',
        'Bundle size for an Edge function measured.',
        'A short comparison written from real use.',
      ],
    },
  },

  {
    slug: 'api-design',
    name: 'API Design (REST, tRPC, Server Actions)',
    description: 'When to pick REST vs Server Actions vs tRPC; endpoint design; pagination, errors, idempotency.',
    whyNow: 'The "API layer" looks different in a Server Components world — many teams don\'t write REST at all now.',
    branch: 'Backend & Data',
    difficulty: 'advanced',
    estimatedHours: 8,
    topics: ['REST Resource Design', 'Server Actions as RPC', 'tRPC End-to-End Types', 'Pagination Patterns', 'Error Envelopes', 'Idempotency Keys'],
    prerequisites: ['nextjs-app-router', 'prisma-drizzle'],
    lessons: [
      { id: 'l1', title: 'tRPC — concepts', kind: 'doc', url: 'https://trpc.io/docs/concepts', source: 'trpc.io', estimatedMinutes: 12 },
      { id: 'l2', title: 'Idempotency keys, in practice', kind: 'read', url: 'https://stripe.com/blog/idempotency', source: 'Stripe Engineering', estimatedMinutes: 10 },
    ],
    exercise: {
      title: 'One mutation, three ways',
      brief: 'Expose the same "create todo" mutation as a REST route handler, a Server Action, and a tRPC procedure; write up tradeoffs.',
      bullets: [
        'Three working implementations.',
        'Identical validation via shared Zod schema.',
        'Idempotency key support in the REST version.',
        'Short comparison: when would you pick each?',
      ],
    },
  },

  {
    slug: 'auth-modern',
    name: 'Modern Authentication',
    description: 'Sessions vs JWTs, OAuth/OIDC, magic links, passkeys (WebAuthn), Auth.js / Clerk / Supabase Auth.',
    whyNow: 'Passkeys are mainstream in 2026; rolling-your-own auth is a liability; managed auth is the default.',
    branch: 'Backend & Data',
    difficulty: 'advanced',
    estimatedHours: 10,
    topics: ['Sessions vs JWTs', 'OAuth 2.1 & OIDC', 'Magic Links', 'Passkeys / WebAuthn', 'Auth.js (NextAuth)', 'Clerk / Supabase Auth', 'RBAC patterns'],
    prerequisites: ['api-design'],
    lessons: [
      { id: 'l1', title: 'Auth.js quickstart', kind: 'doc', url: 'https://authjs.dev/getting-started', source: 'authjs.dev', estimatedMinutes: 16 },
      { id: 'l2', title: 'Passkeys explained', kind: 'read', url: 'https://passkeys.dev/', source: 'passkeys.dev', estimatedMinutes: 12 },
      { id: 'l3', title: 'Sessions vs JWTs — stop the debate', kind: 'read', url: 'https://thecopenhagenbook.com/sessions', source: 'Pilcrow', estimatedMinutes: 10 },
    ],
    exercise: {
      title: 'Add four sign-in methods',
      brief: 'Add email+password, Google OAuth, magic link, AND passkey sign-in to the SaaS app — with role-based protected routes.',
      bullets: [
        'All four methods working end-to-end.',
        'Role-based route protection (admin vs user).',
        'Session refresh handled correctly.',
        'CSRF protection where applicable.',
      ],
    },
  },

  // ─── AI LAYER ────────────────────────────────────────────────────────────

  {
    slug: 'ai-sdk-llms',
    name: 'LLM Integration with the AI SDK',
    description: 'Streaming chat, structured output, tool calling, embeddings — Vercel AI SDK across OpenAI / Anthropic / etc.',
    whyNow: '"Add AI" is in every PRD now; the AI SDK is the JS-side standard library for it.',
    branch: 'AI Layer',
    difficulty: 'advanced',
    estimatedHours: 10,
    topics: ['streamText & useChat', 'generateObject + Zod', 'Tool Calling', 'Multi-Provider Routing', 'Streaming UI', 'Token Costs & Rate Limits'],
    prerequisites: ['nextjs-app-router', 'typescript'],
    lessons: [
      { id: 'l1', title: 'AI SDK — overview', kind: 'doc', url: 'https://sdk.vercel.ai/docs', source: 'sdk.vercel.ai', estimatedMinutes: 14 },
      { id: 'l2', title: 'Structured output with generateObject', kind: 'doc', url: 'https://sdk.vercel.ai/docs/ai-sdk-core/generating-structured-data', source: 'sdk.vercel.ai', estimatedMinutes: 10 },
      { id: 'l3', title: 'Tool calling, end-to-end', kind: 'doc', url: 'https://sdk.vercel.ai/docs/ai-sdk-core/tools-and-tool-calling', source: 'sdk.vercel.ai', estimatedMinutes: 12 },
    ],
    exercise: {
      title: '"Talk to your data" — typed and streaming',
      brief: 'Build a chat page that uses tool calls to query your Postgres SaaS data and renders typed structured responses.',
      bullets: [
        'Streamed chat UI via `useChat`.',
        'At least 2 tools that hit the DB.',
        'Structured responses validated with Zod.',
        'Per-message token cost displayed.',
      ],
    },
  },

  {
    slug: 'rag-embeddings',
    name: 'RAG, Embeddings & Vector Search',
    description: 'Chunking, embeddings, pgvector / vector DBs, hybrid search, grounding LLM answers in your data.',
    whyNow: 'Plain LLM chat is a toy; RAG is what makes AI features actually useful in product.',
    branch: 'AI Layer',
    difficulty: 'advanced',
    estimatedHours: 8,
    topics: ['Embedding Models', 'Chunking Strategies', 'pgvector basics', 'Cosine vs Hybrid Search', 'Reranking', 'Citation & Grounding'],
    prerequisites: ['ai-sdk-llms', 'databases-postgres'],
    lessons: [
      { id: 'l1', title: 'pgvector — getting started', kind: 'doc', url: 'https://github.com/pgvector/pgvector', source: 'github.com', estimatedMinutes: 12 },
      { id: 'l2', title: 'RAG, the practical guide', kind: 'read', url: 'https://www.pinecone.io/learn/retrieval-augmented-generation/', source: 'Pinecone', estimatedMinutes: 18 },
    ],
    exercise: {
      title: 'Cite-your-sources doc chat',
      brief: 'Index your project\'s docs + GitHub issues into pgvector; build a chat that answers with cited source snippets.',
      bullets: [
        'Documents chunked + embedded.',
        'Retrieval pipeline returns top-k with scores.',
        'Answers cite at least one source snippet.',
        'Hybrid search (vector + keyword) as a stretch.',
      ],
    },
  },

  // ─── SHIP IT ─────────────────────────────────────────────────────────────

  {
    slug: 'testing',
    name: 'Testing (Vitest + Playwright)',
    description: 'Unit with Vitest, components with Testing Library, end-to-end with Playwright, and what\'s worth testing.',
    whyNow: 'Jest is fading; Vitest + Playwright is the modern combo, and Playwright now drives AI agent test runs too.',
    branch: 'Ship It',
    difficulty: 'intermediate',
    estimatedHours: 10,
    topics: ['Vitest setup', 'Testing Library queries', 'Mocking & MSW', 'Playwright E2E', 'Visual Regression', 'Test Pyramid Strategy'],
    prerequisites: ['react-patterns'],
    lessons: [
      { id: 'l1', title: 'Vitest — getting started', kind: 'doc', url: 'https://vitest.dev/guide/', source: 'vitest.dev', estimatedMinutes: 10 },
      { id: 'l2', title: 'Testing Library principles', kind: 'doc', url: 'https://testing-library.com/docs/guiding-principles', source: 'testing-library.com', estimatedMinutes: 8 },
      { id: 'l3', title: 'Playwright — your first test', kind: 'doc', url: 'https://playwright.dev/docs/intro', source: 'playwright.dev', estimatedMinutes: 12 },
    ],
    exercise: {
      title: 'Three test types in one repo',
      brief: 'Write a unit test for a custom hook, a component test for a form, and a Playwright flow for sign-up → create-todo on the SaaS app.',
      bullets: [
        'Vitest unit test for a hook.',
        'Testing Library test for a form with validation.',
        'Playwright e2e for sign-up + first mutation.',
        'CI workflow that runs all three.',
      ],
    },
  },

  {
    slug: 'observability',
    name: 'Observability & Debugging in Prod',
    description: 'Structured logging, error tracking (Sentry), tracing, analytics, reading Vercel runtime logs.',
    whyNow: 'Shipping is easy; debugging a 2am incident on serverless without observability is what separates juniors from seniors.',
    branch: 'Ship It',
    difficulty: 'advanced',
    estimatedHours: 6,
    topics: ['Structured Logging', 'Sentry / Error Tracking', 'OpenTelemetry basics', 'Vercel Runtime Logs', 'Web Vitals in Production', 'Source Map Debugging'],
    prerequisites: ['nextjs-app-router'],
    lessons: [
      { id: 'l1', title: 'Sentry for Next.js', kind: 'doc', url: 'https://docs.sentry.io/platforms/javascript/guides/nextjs/', source: 'sentry.io', estimatedMinutes: 12 },
      { id: 'l2', title: 'Structured logging on Vercel', kind: 'doc', url: 'https://vercel.com/docs/observability/runtime-logs', source: 'vercel.com', estimatedMinutes: 8 },
    ],
    exercise: {
      title: 'Trace a prod bug end to end',
      brief: 'Add Sentry + structured logs to the SaaS app, throw a server error in prod, then trace user report → log → stack frame → fix.',
      bullets: [
        'Sentry integrated, source maps uploaded.',
        'Structured logger with consistent fields.',
        'Triggered error appears with full stack in Sentry.',
        'Write-up describes the trace, root cause, fix.',
      ],
    },
  },

  {
    slug: 'deploy-vercel',
    name: 'Deployment, Edge & CI/CD',
    description: 'Deploying to Vercel, preview branches, env vars, edge functions, custom domains, GitHub Actions.',
    whyNow: 'Modern deploys are not "SSH into a box"; preview deploys + Edge are table stakes.',
    branch: 'Ship It',
    difficulty: 'intermediate',
    estimatedHours: 6,
    topics: ['Vercel Deploys & Previews', 'Environment Variables', 'Edge Functions', 'Cron Jobs', 'GitHub Actions for tests/lint', 'Custom Domains & DNS'],
    prerequisites: ['nextjs-app-router', 'git-github-flow'],
    lessons: [
      { id: 'l1', title: 'Vercel — deployments overview', kind: 'doc', url: 'https://vercel.com/docs/deployments/overview', source: 'vercel.com', estimatedMinutes: 10 },
      { id: 'l2', title: 'GitHub Actions for Node projects', kind: 'doc', url: 'https://docs.github.com/en/actions/automating-builds-and-tests/building-and-testing-nodejs', source: 'docs.github.com', estimatedMinutes: 12 },
    ],
    exercise: {
      title: 'PR pipeline that protects main',
      brief: 'Preview-on-PR pipeline that runs Vitest + Playwright + Lighthouse before allowing merge; auto-deploy to prod on merge.',
      bullets: [
        'Preview URL posted to each PR.',
        'PR cannot merge unless all three checks pass.',
        'Merge to main triggers a prod deploy.',
        'Env vars distinguish preview vs prod.',
      ],
    },
  },

  {
    slug: 'web-security',
    name: 'Web Security Essentials',
    description: 'OWASP Top 10, CSRF/XSS in a Server Actions world, secrets management, dependency auditing.',
    whyNow: 'AI-generated code introduces new classes of vulns; companies ask security questions in junior interviews now.',
    branch: 'Ship It',
    difficulty: 'advanced',
    estimatedHours: 6,
    topics: ['OWASP Top 10 (2025)', 'XSS in JSX & dangerouslySetInnerHTML', 'CSRF & Server Actions', 'Content Security Policy', 'Secrets Management', 'Dependency Auditing'],
    prerequisites: ['auth-modern', 'api-design'],
    lessons: [
      { id: 'l1', title: 'OWASP Top 10', kind: 'doc', url: 'https://owasp.org/www-project-top-ten/', source: 'owasp.org', estimatedMinutes: 18 },
      { id: 'l2', title: 'Content Security Policy', kind: 'doc', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP', source: 'MDN', estimatedMinutes: 10 },
    ],
    exercise: {
      title: 'Security audit of the SaaS app',
      brief: 'Write a CSP, fix any XSS sinks, rotate a leaked secret, add `npm audit` to CI.',
      bullets: [
        'CSP header in production.',
        'No `dangerouslySetInnerHTML` without sanitization.',
        'Secret rotation playbook documented.',
        'CI fails when `npm audit` finds high/critical.',
      ],
    },
  },

  {
    slug: 'capstone-saas',
    name: 'Capstone — Ship a Real Product',
    description: 'One production app combining everything: auth, DB, AI feature, tests, monitoring, real domain.',
    whyNow: 'A shipped, observable, monetizable app on your domain is the artifact recruiters actually look at.',
    branch: 'Ship It',
    difficulty: 'advanced',
    estimatedHours: 40,
    topics: ['Project Scoping', 'Architecture Decisions', 'Production Deploy', 'Real Users (beta)', 'Stripe / Polar Billing', 'Post-Launch Iteration'],
    prerequisites: ['caching-rendering', 'rag-embeddings', 'auth-modern', 'testing', 'observability', 'deploy-vercel', 'web-security'],
    lessons: [
      { id: 'l1', title: 'How to choose a project', kind: 'note', body: 'Pick something a real person you know would use weekly. Not "another todo app." Not "Twitter clone." A small, sharp niche tool.', estimatedMinutes: 4 },
      { id: 'l2', title: 'Shipping post-mortems — patterns', kind: 'read', url: 'https://blog.pragmaticengineer.com/incident-review-and-postmortem-best-practices/', source: 'Pragmatic Engineer', estimatedMinutes: 14 },
    ],
    exercise: {
      title: 'Ship it. Publicly.',
      brief: 'Ship a small but real SaaS (AI-assisted resume builder, micro-CRM, study-group scheduler) with paying users or invited testers, observability, and a public post-mortem.',
      bullets: [
        'Real domain, HTTPS, working production deploy.',
        'At least 5 active users (not friends).',
        'Sentry + analytics in production.',
        'Public write-up: architecture, tradeoffs, lessons.',
      ],
    },
  },
];

// ─── Lookups ──────────────────────────────────────────────────────────────

export function getSkill(slug: string): CurriculumSkill | null {
  return curriculum.find((s) => s.slug === slug) ?? null;
}

export function getSkillsByBranch(branch: CurriculumBranch): CurriculumSkill[] {
  return curriculum.filter((s) => s.branch === branch);
}

export function getAllSlugs(): string[] {
  return curriculum.map((s) => s.slug);
}

export function totalEstimatedHours(): number {
  return curriculum.reduce((sum, s) => sum + s.estimatedHours, 0);
}

// ─── Mock user progress ───────────────────────────────────────────────────

export const mockUserProgress: Record<string, SkillStatus> = {
  'web-platform': 'completed',
  'html-css-essentials': 'completed',
  'js-modern': 'completed',
  'typescript': 'completed',
  'git-github-flow': 'completed',
  'modern-css': 'completed',
  'tooling-vite': 'completed',
  'tailwind-shadcn': 'completed',
  'react-19': 'completed',
  'react-patterns': 'completed',
  'data-fetching': 'completed',
  'nextjs-app-router': 'in-progress',
};

export function getSkillStatus(slug: string): SkillStatus {
  if (mockUserProgress[slug]) return mockUserProgress[slug];
  // Auto-determine unlocked vs locked from prereq status
  const skill = getSkill(slug);
  if (!skill) return 'locked';
  const allPrereqsDone = skill.prerequisites.every(
    (p) => mockUserProgress[p] === 'completed' || mockUserProgress[p] === 'reinforced',
  );
  return allPrereqsDone ? 'unlocked' : 'locked';
}

export function getDependents(slug: string): CurriculumSkill[] {
  return curriculum.filter((s) => s.prerequisites.includes(slug));
}
