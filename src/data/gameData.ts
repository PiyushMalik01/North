/**
 * Game-home mock state. Shape is intentionally close to what real Prisma
 * queries will return so wiring the backend later is a swap, not a rewrite.
 * This replaces the old SaaS dashboard data — the home is now a game HUD.
 */

export type AttributeKey =
  | 'depth'
  | 'execution'
  | 'consistency'
  | 'collaboration'
  | 'clarity';

export interface PlayerAttribute {
  key: AttributeKey;
  label: string;
  value: number; // 0-100
}

export interface ActiveSkill {
  id: string;
  slug: string;
  name: string;
  branch: string;
  progress: number; // 0-100
  nextNode: string;
}

export interface ActiveQuest {
  id: string;
  title: string;
  detail: string;
  reward: number;
  progress: number; // 0-100
}

export interface PlayerState {
  name: string;
  level: number;
  rank: string;
  xp: number;
  xpIntoLevel: number; // progress within the current level, 0-100
  streakDays: number;
  northStar: string;
  attributes: PlayerAttribute[];
  activeSkill: ActiveSkill;
  activeQuest: ActiveQuest;
  skillsCompleted: number;
  skillsTotal: number;
  norLine: string;
}

export const mockPlayer: PlayerState = {
  name: 'Piyush',
  level: 7,
  rank: 'Rising Dev',
  xp: 2340,
  xpIntoLevel: 62,
  streakDays: 7,
  northStar: 'Land a frontend internship',
  attributes: [
    { key: 'depth', label: 'Depth', value: 64 },
    { key: 'execution', label: 'Execution', value: 48 },
    { key: 'consistency', label: 'Consistency', value: 80 },
    { key: 'collaboration', label: 'Collaboration', value: 32 },
    { key: 'clarity', label: 'Clarity', value: 55 },
  ],
  activeSkill: {
    id: 'nextjs-app-router',
    slug: 'nextjs-app-router',
    name: 'App Router',
    branch: 'Web Development',
    progress: 45,
    nextNode: 'Server Actions',
  },
  activeQuest: {
    id: 'q-blog-ppr',
    title: 'Ship a blog with PPR',
    detail: 'Stream comments with Suspense, mutate with useOptimistic.',
    reward: 300,
    progress: 20,
  },
  skillsCompleted: 11,
  skillsTotal: 25,
  norLine: "pick up app router — you're 45% in, about 2h to the next unlock.",
};

/** Mini skill-tree teaser: a short chain of nodes for the WORLD tile. */
export const mockNodeChain: { id: string; state: 'done' | 'active' | 'locked' }[] = [
  { id: 'n1', state: 'done' },
  { id: 'n2', state: 'done' },
  { id: 'n3', state: 'active' },
  { id: 'n4', state: 'locked' },
  { id: 'n5', state: 'locked' },
];

/** Streak heatmap — 5 weeks × 7 days, intensity 0–4 (0 = inactive). */
export const mockStreakCalendar: number[] = [
  0, 1, 2, 0, 3, 1, 0,
  2, 3, 4, 2, 0, 1, 3,
  4, 2, 3, 4, 1, 0, 2,
  3, 4, 4, 2, 3, 4, 1,
  2, 3, 4, 4, 3, 4, 2,
];
export const mockFreezes = 2;

export interface LeaderRow {
  rank: number;
  name: string;
  xp: number;
  you?: boolean;
}
export const mockLeaderboard: LeaderRow[] = [
  { rank: 1, name: 'aanya', xp: 4120 },
  { rank: 2, name: 'rohan', xp: 3380 },
  { rank: 3, name: 'piyush', xp: 2340, you: true },
  { rank: 4, name: 'meera', xp: 2110 },
  { rank: 5, name: 'kabir', xp: 1980 },
];

export interface Course {
  id: string;
  name: string;
  branch: string;
  progress: number; // 0-100
  status: 'learning' | 'done';
}
export const mockCourses: Course[] = [
  { id: 'app-router', name: 'App Router', branch: 'Next.js', progress: 45, status: 'learning' },
  { id: 'server-components', name: 'Server Components', branch: 'React', progress: 20, status: 'learning' },
  { id: 'ts-generics', name: 'TypeScript Generics', branch: 'TypeScript', progress: 60, status: 'learning' },
  { id: 'flexbox', name: 'Flexbox & Grid', branch: 'CSS', progress: 100, status: 'done' },
  { id: 'promises', name: 'Promises & Async', branch: 'JavaScript', progress: 100, status: 'done' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Nest redesign mocks (hero, ring, switcher, rail).
// Shapes mirror the eventual API so wiring the backend is a data-source swap.
// ─────────────────────────────────────────────────────────────────────────────

/** The cinematic hero: nor's beam today + where "resume" deep-links to. */
export interface NorthBeam {
  goal: string; // the student's north star
  task: string; // the concrete next move (hero title)
  node: string; // e.g. "node 7"
  zone: string; // lexicon zone the task lives in: dive | trace | prove
  minutesLeft: number;
  resumeHref: string; // deep-link target
}
export const mockNorth: NorthBeam = {
  goal: 'Land a frontend internship',
  task: 'Build the auth flow',
  node: 'node 7',
  zone: 'dive',
  minutesLeft: 40,
  resumeHref: '/dive',
};

/** Progress toward your north, for the signature ring. */
export const mockNorthProgress = 68; // 0-100

/** Today's quests (switcher · quests). */
export interface DailyQuest {
  id: string;
  label: string;
  reward: number;
  done: boolean;
}
export const mockQuests: DailyQuest[] = [
  { id: 'q1', label: 'finish node 7', reward: 120, done: false },
  { id: 'q2', label: 'a 30-min dive', reward: 80, done: false },
  { id: 'q3', label: 'review yesterday’s prove', reward: 60, done: true },
];

/** Badges (switcher · gleams). */
export interface Gleam {
  id: string;
  name: string;
  earned: boolean;
}
export const mockGleams: Gleam[] = [
  { id: 'g1', name: 'first breach', earned: true },
  { id: 'g2', name: '7-day streak', earned: true },
  { id: 'g3', name: 'deep diver', earned: true },
  { id: 'g4', name: 'night owl', earned: false },
];

/** Field signals (rail · drift). */
export interface DriftSignal {
  id: string;
  text: string;
  meta: string; // e.g. "2h ago"
  href: string;
}
export const mockDrift: DriftSignal[] = [
  { id: 'd1', text: 'React 20 RC drops Activity API', meta: '2h ago', href: '/drift' },
  { id: 'd2', text: 'Frontend roles up 12% in your city', meta: '5h ago', href: '/drift' },
  { id: 'd3', text: 'aanya shipped a portfolio in dive', meta: '1d ago', href: '/drift' },
];

/** Who's around (rail · flock). */
export interface PresenceMember {
  name: string;
  status: 'online' | 'in-dive' | 'away';
}
export const mockPresence: PresenceMember[] = [
  { name: 'aanya', status: 'in-dive' },
  { name: 'rohan', status: 'online' },
  { name: 'meera', status: 'online' },
  { name: 'kabir', status: 'away' },
];
