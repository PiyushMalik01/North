/**
 * The full platform nav map. Lexicon: docs/brand/lexicon.md
 *
 * Top-level zones render in the sticky top bar (group: 'main' on the left,
 * 'utility' on the right). Zones with `subs` show a bottom-center pill with a
 * rolling-ball sub-nav when you're inside them.
 */
export interface SubRoute {
  label: string;
  href: string;
}

export interface NavZone {
  id: string;
  label: string;
  href: string;
  group: 'main' | 'utility';
  hint: string; // placeholder copy for the stub page
  subs?: SubRoute[]; // first sub lives at the zone's base href
}

export const ZONES: NavZone[] = [
  {
    id: 'nest',
    label: 'nest',
    href: '/dashboard',
    group: 'main',
    hint: 'your home in the cold — stats, streak, nor, and your beam today.',
  },
  {
    id: 'trace',
    label: 'trace',
    href: '/trace',
    group: 'main',
    hint: 'the route north — your skill path and roadmap.',
    subs: [
      { label: 'tree', href: '/trace' },
      { label: 'map', href: '/trace/roadmap' },
      { label: 'notes', href: '/trace/notes' },
    ],
  },
  {
    id: 'dive',
    label: 'dive',
    href: '/dive',
    group: 'main',
    hint: 'go deep — codespaces, where you build and make things.',
    subs: [
      { label: 'editor', href: '/dive' },
      { label: 'box', href: '/dive/sandbox' },
    ],
  },
  {
    id: 'prove',
    label: 'prove',
    href: '/prove',
    group: 'main',
    hint: "don't claim the skill — prove it. coding, reasoning, rapid-fire.",
    subs: [
      { label: 'code', href: '/prove' },
      { label: 'logic', href: '/prove/logic' },
      { label: 'quiz', href: '/prove/quiz' },
    ],
  },
  {
    id: 'spark',
    label: 'spark',
    href: '/spark',
    group: 'main',
    hint: 'quests and tasks — small wins that move you forward.',
  },
  {
    id: 'drift',
    label: 'drift',
    href: '/drift',
    group: 'main',
    hint: "what's moving in your field — the feed drifts in here.",
  },
  {
    id: 'huddle',
    label: 'huddle',
    href: '/huddle',
    group: 'main',
    hint: 'the warm gathering — community, rooms, and chat.',
    subs: [
      { label: 'rooms', href: '/huddle' },
      { label: 'chat', href: '/huddle/chat' },
      { label: 'flock', href: '/huddle/flock' },
    ],
  },
  {
    id: 'flare',
    label: 'flare',
    href: '/flare',
    group: 'main',
    hint: 'live events — hackathons, contests, and college challenges.',
  },
  {
    id: 'perch',
    label: 'perch',
    href: '/perch',
    group: 'main',
    hint: 'the standings — leaderboards, opt-in.',
  },
  {
    id: 'field',
    label: 'field',
    href: '/field',
    group: 'main',
    hint: 'career & market — where the field is heading.',
    subs: [
      { label: 'jobs', href: '/field' },
      { label: 'trend', href: '/field/market' },
      { label: 'firms', href: '/field/firms' },
    ],
  },
  {
    id: 'chart',
    label: 'chart',
    href: '/chart',
    group: 'main',
    hint: 'plan your terms — subjects, timetable, pyqs, mock exams.',
    subs: [
      { label: 'subs', href: '/chart' },
      { label: 'plan', href: '/chart/plan' },
      { label: 'pyqs', href: '/chart/pyqs' },
      { label: 'mock', href: '/chart/mock' },
    ],
  },

  // ── utility (right side of the bar) ──
  {
    id: 'ping',
    label: 'ping',
    href: '/ping',
    group: 'utility',
    hint: 'messages in — broadcasts, reminders, and your newsletter.',
  },
  {
    id: 'halo',
    label: 'halo',
    href: '/halo',
    group: 'utility',
    hint: 'you — your record, trail, stats, and gleams.',
    subs: [
      { label: 'you', href: '/halo' },
      { label: 'trail', href: '/halo/trail' },
      { label: 'stats', href: '/halo/stats' },
      { label: 'crest', href: '/halo/crest' },
    ],
  },
];

export const MAIN_ZONES = ZONES.filter((z) => z.group === 'main');
export const UTILITY_ZONES = ZONES.filter((z) => z.group === 'utility');

/** The zone that owns the current path (matches base href or any sub of it). */
export function activeZone(pathname: string): NavZone | undefined {
  return ZONES.find((z) => pathname === z.href || pathname.startsWith(z.href + '/'));
}
