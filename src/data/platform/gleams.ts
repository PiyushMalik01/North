/**
 * gleams — badges / achievements (for halo). Earned state lives in the progress store;
 * some gleams unlock from milestones (xp, streak, nodes) computed at render time.
 */

export interface GleamDef {
  id: string;
  name: string;
  desc: string;
  /** how it's unlocked, shown as a hint when locked */
  how: string;
}

export const gleams: GleamDef[] = [
  { id: 'first-breach', name: 'first breach', desc: 'Completed your first node.', how: 'Complete any trace node.' },
  { id: 'streak-7', name: '7-day streak', desc: 'Showed up seven days running.', how: 'Reach a 7-day streak.' },
  { id: 'deep-diver', name: 'deep diver', desc: 'Logged a focused deep-work block.', how: 'Finish the deep work quest.' },
  { id: 'web-foundations', name: 'foundation laid', desc: 'Cleared the web foundations branch.', how: 'Complete all web foundation nodes.' },
  { id: 'sharpshooter', name: 'sharpshooter', desc: 'Aced a rapid-fire prove.', how: 'Score 100% on any rapid-fire.' },
  { id: 'night-owl', name: 'night owl', desc: 'Studied after midnight.', how: 'Be active between 12am and 4am.' },
  { id: 'collector', name: 'collector', desc: 'Earned 1,000 xp.', how: 'Bank 1,000 total xp.' },
  { id: 'mentor', name: 'mentor', desc: 'Helped someone in the huddle.', how: 'Reply to a flockmate’s post.' },
];

/** Recent activity timeline for halo (the "trail"). */
export interface TrailItem {
  id: string;
  text: string;
  ago: string;
}

export const trail: TrailItem[] = [
  { id: 'tr1', text: 'Passed JavaScript Core prove · +140 xp', ago: '2h ago' },
  { id: 'tr2', text: 'Claimed the daily warm-up quest · +60 xp', ago: '5h ago' },
  { id: 'tr3', text: 'Completed CSS & Layout node', ago: '1d ago' },
  { id: 'tr4', text: 'Earned the “7-day streak” gleam', ago: '1d ago' },
  { id: 'tr5', text: 'Started learning the App Router', ago: '2d ago' },
];
