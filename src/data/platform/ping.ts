export type PingKind = 'system' | 'social' | 'streak' | 'achievement' | 'event';

export interface Ping {
  id: string;
  kind: PingKind;
  title: string;
  body: string;
  ago: string;
  read: boolean;
}

export const pings: Ping[] = [
  {
    id: 'p1',
    kind: 'streak',
    title: '7-day streak — keep it up',
    body: 'You have logged in 7 days in a row. Come back tomorrow to hit 8.',
    ago: '2h ago',
    read: false,
  },
  {
    id: 'p2',
    kind: 'social',
    title: 'Aryan replied to your post',
    body: '"Solid breakdown on dynamic programming — agree on the memoisation point."',
    ago: '4h ago',
    read: false,
  },
  {
    id: 'p3',
    kind: 'achievement',
    title: 'Gleam earned: Binary Search',
    body: 'You passed the Binary Search assessment with 94%. Gleam added to your profile.',
    ago: '9h ago',
    read: false,
  },
  {
    id: 'p4',
    kind: 'event',
    title: 'Flare: Mock Interview Sprint — now open',
    body: 'A 48-hour interview prep challenge just opened. Seats are limited — join before it fills.',
    ago: '12h ago',
    read: false,
  },
  {
    id: 'p5',
    kind: 'social',
    title: 'Sara started following you',
    body: 'Sara from your DSA flock is now following your progress.',
    ago: '1d ago',
    read: true,
  },
  {
    id: 'p6',
    kind: 'achievement',
    title: 'Gleam earned: Recursion Fundamentals',
    body: 'You cleared Recursion Fundamentals. This skill is now visible to recruiters.',
    ago: '2d ago',
    read: true,
  },
  {
    id: 'p7',
    kind: 'system',
    title: 'Scheduled maintenance — tonight 02:00 IST',
    body: 'North will be offline for ~15 minutes for a database upgrade. No data will be lost.',
    ago: '2d ago',
    read: true,
  },
  {
    id: 'p8',
    kind: 'streak',
    title: 'Streak at risk',
    body: 'You have not logged a session today. Complete any exercise to keep your streak alive.',
    ago: '3d ago',
    read: true,
  },
  {
    id: 'p9',
    kind: 'social',
    title: 'Your flock hit 10 members',
    body: 'DSA Grind is growing — 10 students are now learning together in your flock.',
    ago: '4d ago',
    read: true,
  },
  {
    id: 'p10',
    kind: 'event',
    title: 'Flare: System Design Deep-Dive — results',
    body: 'The System Design event wrapped up. You placed in the top 30%. Full results are in Flare.',
    ago: '6d ago',
    read: true,
  },
];

export const pingKinds: { id: PingKind; label: string }[] = [
  { id: 'system', label: 'system' },
  { id: 'social', label: 'social' },
  { id: 'streak', label: 'streak' },
  { id: 'achievement', label: 'achievement' },
  { id: 'event', label: 'event' },
];
