/**
 * flare — live events: hackathons, contests, workshops, meetups.
 * Registration state lives in local component state (no persistence needed for mock).
 */

export type FlareKind = 'hackathon' | 'contest' | 'workshop' | 'meetup';

export interface FlareEvent {
  id: string;
  kind: FlareKind;
  title: string;
  host: string;
  date: string;
  blurb: string;
  tags: string[];
  spots: number;
  spotsLeft: number;
  featured?: boolean;
}

export const flareKinds: { id: FlareKind; label: string }[] = [
  { id: 'hackathon', label: 'hackathon' },
  { id: 'contest', label: 'contest' },
  { id: 'workshop', label: 'workshop' },
  { id: 'meetup', label: 'meetup' },
];

export const flareEvents: FlareEvent[] = [
  {
    id: 'winter-frost-hack',
    kind: 'hackathon',
    title: 'Winter Frost Hack',
    host: 'North × MLH',
    date: 'Jun 28',
    blurb:
      'Build something audacious in 36 hours. Open to all tracks — AI, systems, web, hardware. Prizes, mentors, and enough cold brew to survive the night.',
    tags: ['AI', 'Open Track', '36 hrs', 'Prizes'],
    spots: 200,
    spotsLeft: 47,
    featured: true,
  },
  {
    id: 'weekly-algo-sprint',
    kind: 'contest',
    title: 'Weekly Algo Sprint #18',
    host: 'North Prove Team',
    date: 'Jun 22',
    blurb:
      'Five problems, 90 minutes, global leaderboard. From warm-up greedy to a spicy DP closer. Sharpen your edge every Sunday.',
    tags: ['DSA', 'Timed', 'Leaderboard'],
    spots: 500,
    spotsLeft: 312,
  },
  {
    id: 'react-deep-dive',
    kind: 'workshop',
    title: 'React 19 Deep Dive',
    host: 'Aarav Mehta · Staff Eng',
    date: 'Jun 25',
    blurb:
      'Server components, use(), and the new compiler in a live coding session. Bring your laptop — the second half is hands-on.',
    tags: ['React', 'Frontend', 'Live Coding'],
    spots: 60,
    spotsLeft: 14,
  },
  {
    id: 'system-design-blitz',
    kind: 'contest',
    title: 'System Design Blitz',
    host: 'North Drift Team',
    date: 'Jun 29',
    blurb:
      'Design a distributed system under time pressure and get scored by a panel of senior engineers. Written submissions reviewed live.',
    tags: ['System Design', 'Intermediate', 'Feedback'],
    spots: 80,
    spotsLeft: 0,
  },
  {
    id: 'founders-meetup',
    kind: 'meetup',
    title: 'Student Founders Night',
    host: 'North × YC Alumni',
    date: 'Jul 3',
    blurb:
      'Casual evening with founders who shipped while still in college. Pitches welcome, roasting encouraged, ideas stolen at your own risk.',
    tags: ['Startup', 'Networking', 'In-Person'],
    spots: 100,
    spotsLeft: 63,
  },
  {
    id: 'git-internals-workshop',
    kind: 'workshop',
    title: 'Git Internals: Beyond the Commands',
    host: 'Priya Nair · Open Source Lead',
    date: 'Jul 7',
    blurb:
      'Objects, refs, the index — how Git actually stores your history. You\'ll leave able to rescue any disaster and impress any interviewer.',
    tags: ['Git', 'DevTools', 'Beginner-Friendly'],
    spots: 40,
    spotsLeft: 28,
  },
  {
    id: 'css-art-jam',
    kind: 'contest',
    title: 'CSS Art Jam',
    host: 'North Design Guild',
    date: 'Jul 10',
    blurb:
      'Pure CSS only — no JavaScript, no images. Theme revealed at noon. Community vote decides the winner. The bar is always unreasonably high.',
    tags: ['CSS', 'Creative', 'Community Vote'],
    spots: 150,
    spotsLeft: 99,
  },
];
