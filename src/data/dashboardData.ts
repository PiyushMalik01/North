/**
 * Dashboard mock data — shape matches what future Prisma queries will return.
 * Replace with real queries when backend wiring lands (see dashboard-rebuild-design.md).
 */

export interface DashboardUserState {
  userName: string;
  streak: {
    days: number;
    freezes: number;
    lastActiveAt: Date;
  };
  xp: number;
  rank: string;
  skills: {
    completed: number;
    total: number;
  };
  activeSkill: ActiveSkill | null;
  activeQuest: ActiveQuest | null;
  recentlyCompletedSkill: RecentCompletion | null;
  nextUnlockedSkill: NextUnlock | null;
  diagnosticTaken: boolean;
  treeName: string;
  treeSlug: string;
}

export interface ActiveSkill {
  id: string;
  name: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  progress: number;
  estimatedHoursLeft: number;
  lastPracticedAt: Date;
}

export interface ActiveQuest {
  id: string;
  title: string;
  description: string;
  reward: number;
  deadlineAt: Date | null;
}

export interface RecentCompletion {
  id: string;
  name: string;
  completedAt: Date;
}

export interface NextUnlock {
  id: string;
  name: string;
}

export type PulseCategory =
  | 'Framework'
  | 'Tooling'
  | 'Language'
  | 'Industry'
  | 'Pattern';

export interface PulseItemMock {
  id: string;
  category: PulseCategory;
  headline: string;
  dek: string;
  sourceUrl: string;
  sourceName: string;
  readMinutes: number;
  publishedAt: Date;
}

const hoursAgo = (h: number) => new Date(Date.now() - h * 60 * 60 * 1000);
const daysAhead = (d: number) => new Date(Date.now() + d * 24 * 60 * 60 * 1000);

export const mockUserState: DashboardUserState = {
  userName: 'Piyush',
  streak: {
    days: 7,
    freezes: 2,
    lastActiveAt: hoursAgo(4),
  },
  xp: 2340,
  rank: 'Rising Dev',
  skills: {
    completed: 11,
    total: 25,
  },
  activeSkill: {
    id: 'nextjs-app-router',
    name: 'Next.js 16 App Router',
    category: 'Production Frontend',
    difficulty: 'advanced',
    progress: 45,
    estimatedHoursLeft: 11,
    lastPracticedAt: hoursAgo(4),
  },
  activeQuest: {
    id: 'q-blog-ppr',
    title: 'Ship a blog with PPR + Server Actions',
    description: 'Stream comments via Suspense, mutate with useOptimistic.',
    reward: 300,
    deadlineAt: daysAhead(2),
  },
  recentlyCompletedSkill: null,
  nextUnlockedSkill: {
    id: 'caching-rendering',
    name: 'Caching, Rendering & the Edge',
  },
  diagnosticTaken: true,
  treeName: 'Web Development',
  treeSlug: 'web-development',
};

export const mockPulseItems: PulseItemMock[] = [
  {
    id: 'p1',
    category: 'Framework',
    headline: 'Next 16 changes the cache model',
    dek: 'How `use cache` and cacheLife replace unstable_cache for partial prerendering.',
    sourceUrl: 'https://nextjs.org/blog',
    sourceName: 'nextjs.org',
    readMinutes: 3,
    publishedAt: hoursAgo(48),
  },
  {
    id: 'p2',
    category: 'Tooling',
    headline: 'Bun 1.3 ships native HTTP/3',
    dek: 'What it means for your local dev server loop and edge runtime parity.',
    sourceUrl: 'https://bun.sh/blog',
    sourceName: 'bun.sh',
    readMinutes: 2,
    publishedAt: hoursAgo(24 * 5),
  },
  {
    id: 'p3',
    category: 'Language',
    headline: 'TC39 advances Pattern Matching',
    dek: 'Why this changes the way you write switch statements in modern JavaScript.',
    sourceUrl: 'https://github.com/tc39/proposals',
    sourceName: 'tc39',
    readMinutes: 4,
    publishedAt: hoursAgo(24 * 7),
  },
];
