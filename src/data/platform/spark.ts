/**
 * spark — quests / tasks. Daily and weekly loops plus longer milestones.
 * Progress (claimed quests + checked steps) lives in the progress store.
 */

export type QuestType = 'daily' | 'weekly' | 'milestone';

export interface QuestStep {
  id: string;
  label: string;
}

export interface Quest {
  id: string;
  title: string;
  detail: string;
  type: QuestType;
  xp: number;
  steps: QuestStep[]; // a quest is claimable once every step is checked
}

export const quests: Quest[] = [
  {
    id: 'q-warmup',
    title: 'Daily warm-up',
    detail: 'Keep the streak alive with a quick rep.',
    type: 'daily',
    xp: 60,
    steps: [
      { id: 's1', label: 'Open the nest' },
      { id: 's2', label: 'Read nor’s beam' },
      { id: 's3', label: 'Complete one rapid-fire' },
    ],
  },
  {
    id: 'q-node',
    title: 'Advance the route',
    detail: 'Push one node closer to your north.',
    type: 'daily',
    xp: 120,
    steps: [
      { id: 's1', label: 'Open trace' },
      { id: 's2', label: 'Start an available node' },
      { id: 's3', label: 'Pass its prove' },
    ],
  },
  {
    id: 'q-deep',
    title: 'Deep work block',
    detail: 'A focused 30-minute dive with no context-switching.',
    type: 'weekly',
    xp: 200,
    steps: [
      { id: 's1', label: 'Pick a dive' },
      { id: 's2', label: 'Code for 30 minutes' },
      { id: 's3', label: 'Ship something small' },
    ],
  },
  {
    id: 'q-social',
    title: 'Warm the huddle',
    detail: 'Learning sticks when it’s shared.',
    type: 'weekly',
    xp: 150,
    steps: [
      { id: 's1', label: 'Post in a room' },
      { id: 's2', label: 'Reply to a flockmate' },
    ],
  },
  {
    id: 'q-milestone',
    title: 'Frontend foundations',
    detail: 'Complete the whole web foundations branch.',
    type: 'milestone',
    xp: 500,
    steps: [
      { id: 's1', label: 'Semantic HTML' },
      { id: 's2', label: 'CSS & Layout' },
      { id: 's3', label: 'JavaScript Core' },
      { id: 's4', label: 'Async & Promises' },
    ],
  },
];
