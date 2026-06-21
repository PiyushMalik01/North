/**
 * drift — the feed. What's moving in the student's field: news, market, peers, events.
 * Saved items go to the "shelf" (tracked in the progress store).
 */

export type DriftKind = 'news' | 'market' | 'peer' | 'event';

export interface DriftItem {
  id: string;
  kind: DriftKind;
  title: string;
  body: string;
  source: string;
  ago: string;
  tags: string[];
}

export const driftKinds: { id: DriftKind; label: string }[] = [
  { id: 'news', label: 'news' },
  { id: 'market', label: 'market' },
  { id: 'peer', label: 'peers' },
  { id: 'event', label: 'events' },
];

export const driftFeed: DriftItem[] = [
  {
    id: 'd1',
    kind: 'news',
    title: 'React 20 RC ships the Activity API',
    body: 'Pre-render and keep state for hidden UI. Expect smoother tab and route transitions.',
    source: 'react.dev',
    ago: '2h ago',
    tags: ['react', 'release'],
  },
  {
    id: 'd2',
    kind: 'market',
    title: 'Frontend roles up 12% in your city',
    body: 'Hiring for React + TypeScript leads the pack. Internships open through the quarter.',
    source: 'north market',
    ago: '5h ago',
    tags: ['jobs', 'react', 'typescript'],
  },
  {
    id: 'd3',
    kind: 'peer',
    title: 'aanya shipped a portfolio in dive',
    body: 'Built with App Router and server actions — went from node 4 to node 7 this week.',
    source: 'flock',
    ago: '1d ago',
    tags: ['flock', 'nextjs'],
  },
  {
    id: 'd4',
    kind: 'event',
    title: 'Winter Frost Hack — registration open',
    body: 'A 48-hour build sprint. Solo or squads of four. Prizes and recruiter visibility.',
    source: 'flare',
    ago: '1d ago',
    tags: ['hackathon', 'event'],
  },
  {
    id: 'd5',
    kind: 'news',
    title: 'TypeScript 6.0 narrows control flow further',
    body: 'Smarter inference for discriminated unions and fewer false positives in strict mode.',
    source: 'typescriptlang.org',
    ago: '2d ago',
    tags: ['typescript', 'release'],
  },
  {
    id: 'd6',
    kind: 'market',
    title: 'Tailwind skills now in 1 of 3 frontend listings',
    body: 'Utility-first CSS is now a baseline expectation for junior frontend roles.',
    source: 'north market',
    ago: '3d ago',
    tags: ['css', 'tailwind', 'jobs'],
  },
  {
    id: 'd7',
    kind: 'peer',
    title: 'rohan passed the App Router prove',
    body: 'Scored 92% on the rapid-fire and unlocked server actions.',
    source: 'flock',
    ago: '3d ago',
    tags: ['flock', 'prove'],
  },
  {
    id: 'd8',
    kind: 'event',
    title: 'Live: building auth with server actions',
    body: 'A walkthrough from sessions to protected routes. Replay available after.',
    source: 'flare',
    ago: '4d ago',
    tags: ['event', 'auth'],
  },
];
