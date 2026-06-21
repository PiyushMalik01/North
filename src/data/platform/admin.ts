/**
 * admin — mock operational data for the admin panel. Monitoring + moderation
 * content. Real wiring would replace these with Prisma queries / metrics.
 */

export type UserRole = 'student' | 'teacher' | 'admin';
export type UserStatus = 'active' | 'suspended';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  level: number;
  xp: number;
  streak: number;
  status: UserStatus;
  joined: string; // ISO date
  lastActive: string; // relative
}

export const adminUsers: AdminUser[] = [
  { id: 'u1', name: 'Piyush Malik', email: 'piyush@north.dev', role: 'admin', level: 7, xp: 2340, streak: 7, status: 'active', joined: '2026-01-12', lastActive: 'now' },
  { id: 'u2', name: 'Aanya Rao', email: 'aanya@north.dev', role: 'student', level: 9, xp: 4120, streak: 21, status: 'active', joined: '2026-01-04', lastActive: '12m ago' },
  { id: 'u3', name: 'Rohan Verma', email: 'rohan@north.dev', role: 'student', level: 8, xp: 3380, streak: 14, status: 'active', joined: '2026-01-19', lastActive: '1h ago' },
  { id: 'u4', name: 'Meera Iyer', email: 'meera@north.dev', role: 'student', level: 6, xp: 2110, streak: 4, status: 'active', joined: '2026-02-02', lastActive: '3h ago' },
  { id: 'u5', name: 'Kabir Shah', email: 'kabir@north.dev', role: 'student', level: 5, xp: 1980, streak: 0, status: 'suspended', joined: '2026-02-10', lastActive: '6d ago' },
  { id: 'u6', name: 'Prof. Nair', email: 'nair@college.edu', role: 'teacher', level: 3, xp: 640, streak: 2, status: 'active', joined: '2026-01-28', lastActive: '1d ago' },
  { id: 'u7', name: 'Diya Menon', email: 'diya@north.dev', role: 'student', level: 7, xp: 2600, streak: 9, status: 'active', joined: '2026-02-14', lastActive: '20m ago' },
  { id: 'u8', name: 'Arjun Pillai', email: 'arjun@north.dev', role: 'student', level: 4, xp: 1240, streak: 1, status: 'active', joined: '2026-03-01', lastActive: '2d ago' },
];

export interface Kpi {
  id: string;
  label: string;
  value: string;
  delta: number; // percent change vs prior period
}

export const kpis: Kpi[] = [
  { id: 'users', label: 'total users', value: '8,421', delta: 6.2 },
  { id: 'active', label: 'active today', value: '2,310', delta: 3.1 },
  { id: 'assessments', label: 'proves taken', value: '1,094', delta: 11.4 },
  { id: 'posts', label: 'huddle posts', value: '372', delta: -2.3 },
];

/** 14-day signup + active-user timeseries for the overview charts. */
export interface DayPoint {
  day: string; // e.g. "Jun 8"
  signups: number;
  active: number;
}

export const activityTrend: DayPoint[] = [
  { day: 'Jun 8', signups: 48, active: 1820 },
  { day: 'Jun 9', signups: 52, active: 1910 },
  { day: 'Jun 10', signups: 41, active: 1760 },
  { day: 'Jun 11', signups: 63, active: 2040 },
  { day: 'Jun 12', signups: 70, active: 2150 },
  { day: 'Jun 13', signups: 58, active: 1990 },
  { day: 'Jun 14', signups: 44, active: 1680 },
  { day: 'Jun 15', signups: 66, active: 2100 },
  { day: 'Jun 16', signups: 72, active: 2230 },
  { day: 'Jun 17', signups: 81, active: 2310 },
  { day: 'Jun 18', signups: 69, active: 2180 },
  { day: 'Jun 19', signups: 77, active: 2260 },
  { day: 'Jun 20', signups: 84, active: 2350 },
  { day: 'Jun 21', signups: 59, active: 2310 },
];

/** Zone engagement split for a bar/donut chart. */
export interface ZoneUsage {
  zone: string;
  sessions: number;
}

export const zoneUsage: ZoneUsage[] = [
  { zone: 'nest', sessions: 4200 },
  { zone: 'trace', sessions: 3100 },
  { zone: 'prove', sessions: 2400 },
  { zone: 'dive', sessions: 1800 },
  { zone: 'huddle', sessions: 2950 },
  { zone: 'spark', sessions: 1600 },
  { zone: 'drift', sessions: 1350 },
];

export interface ActivityEvent {
  id: string;
  user: string;
  action: string;
  ago: string;
}

export const activityLog: ActivityEvent[] = [
  { id: 'e1', user: 'Aanya Rao', action: 'passed the App Router prove (92%)', ago: '4m ago' },
  { id: 'e2', user: 'Diya Menon', action: 'completed node “Hooks & State”', ago: '12m ago' },
  { id: 'e3', user: 'Rohan Verma', action: 'posted in r/frontend', ago: '26m ago' },
  { id: 'e4', user: 'Arjun Pillai', action: 'started onboarding', ago: '38m ago' },
  { id: 'e5', user: 'Meera Iyer', action: 'claimed the deep-work quest', ago: '1h ago' },
  { id: 'e6', user: 'Kabir Shah', action: 'was suspended by an admin', ago: '6d ago' },
];

/** Moderation queue — reported huddle content (mock, since the DB is offline). */
export type ReportStatus = 'pending' | 'approved' | 'removed';

export interface ModItem {
  id: string;
  kind: 'post' | 'comment';
  author: string;
  excerpt: string;
  reason: string;
  reports: number;
  status: ReportStatus;
  ago: string;
}

export const moderationQueue: ModItem[] = [
  { id: 'm1', kind: 'post', author: 'spam_user_22', excerpt: 'Get 10k followers fast — link in bio!!!', reason: 'spam', reports: 7, status: 'pending', ago: '20m ago' },
  { id: 'm2', kind: 'comment', author: 'Kabir Shah', excerpt: 'this take is just wrong and you know it', reason: 'harassment', reports: 3, status: 'pending', ago: '1h ago' },
  { id: 'm3', kind: 'post', author: 'unknown', excerpt: 'Check out my paid course (not affiliated)', reason: 'self-promo', reports: 2, status: 'pending', ago: '3h ago' },
  { id: 'm4', kind: 'comment', author: 'Arjun Pillai', excerpt: 'duplicate cross-post across five rooms', reason: 'spam', reports: 4, status: 'approved', ago: '1d ago' },
];

export interface AiConfigShape {
  provider: string;
  model: string;
  temperature: number;
  systemPrompt: string;
}

export const defaultAiConfig: AiConfigShape = {
  provider: 'anthropic',
  model: 'claude-opus-4-8',
  temperature: 0.6,
  systemPrompt:
    'You are nor — a warm, sharp guide for a college student finding their north. Be concise, concrete, and encouraging. Point to the next move.',
};

/** Feature flags the platform reads. Zone ids match components/nest/zones.ts. */
export const defaultFlags: Record<string, boolean> = {
  trace: true,
  prove: true,
  spark: true,
  drift: true,
  huddle: true,
  flare: true,
  perch: true,
  field: true,
  chart: true,
  maintenance: false,
};
