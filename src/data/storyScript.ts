/**
 * The North cold-open — "How a penguin went north."
 * Ten anime keyframes + Nor's subtitles, sequenced into the story-mode intro.
 * Images are the optimized WebP exports in /public/images/story.
 */

export interface KenBurns {
  scale: number; // end scale (starts at 1)
  x: number; // end x drift, % of frame
  y: number; // end y drift, % of frame
}

export interface StoryScene {
  id: number;
  src: string;
  alt: string;
  lines: string[]; // subtitle, 1-2 short lines in Nor's voice
  dwellMs: number; // time on screen before auto-advance
  kb: KenBurns; // gentle motion for this scene
}

export const STORY: StoryScene[] = [
  {
    id: 1,
    src: '/images/story/scene1.webp',
    alt: 'A lone penguin walks toward a golden star while the colony heads the other way.',
    lines: ['every winter, the colony goes south.', 'one of them didn’t.'],
    dwellMs: 5400,
    kb: { scale: 1.07, x: -1.5, y: 0 },
  },
  {
    id: 2,
    src: '/images/story/scene2.webp',
    alt: 'The penguin pushes through a fierce polar blizzard at night.',
    lines: ['it walked the other way — north, alone.', 'the cold tried to send it back.'],
    dwellMs: 5200,
    kb: { scale: 1.08, x: 1.5, y: 1 },
  },
  {
    id: 3,
    src: '/images/story/scene3.webp',
    alt: 'The penguin spots a small lost robot on the ice below.',
    lines: ['it wasn’t the only thing lost out there.'],
    dwellMs: 4800,
    kb: { scale: 1.06, x: -2, y: 0 },
  },
  {
    id: 4,
    src: '/images/story/scene4.webp',
    alt: 'The penguin and the small robot meet face to face under the star.',
    lines: ['a machine that knew every way —', 'and no reason to go.'],
    dwellMs: 5200,
    kb: { scale: 1.06, x: 0, y: -1 },
  },
  {
    id: 5,
    src: '/images/story/scene5.webp',
    alt: 'The penguin and robot travel together toward the star.',
    lines: ['one knew the way. one knew why.', 'so they went together.'],
    dwellMs: 5000,
    kb: { scale: 1.07, x: -1.5, y: 0 },
  },
  {
    id: 6,
    src: '/images/story/scene6.webp',
    alt: 'The two stand beneath an enormous radiant North Star.',
    lines: ['for the first time, neither was alone.'],
    dwellMs: 5600,
    kb: { scale: 1.09, x: 0, y: 2 },
  },
  {
    id: 7,
    src: '/images/story/scene7.webp',
    alt: 'The old penguin lies in the snow as the robot watches over it.',
    lines: ['years are short at the top of the world.', 'the cold finally came for the penguin.'],
    dwellMs: 6000,
    kb: { scale: 1.05, x: 1, y: 0 },
  },
  {
    id: 8,
    src: '/images/story/scene8.webp',
    alt: 'The robot pours its glowing core into the fading penguin.',
    lines: ['so the machine gave it everything it had —', 'and kept it.'],
    dwellMs: 5800,
    kb: { scale: 1.08, x: 0, y: 0 },
  },
  {
    id: 9,
    src: '/images/story/scene9.webp',
    alt: 'Explorers find the frozen, glowing fused being inside a block of ice.',
    lines: ['the ice took them both — for years.', 'until someone dug it out.'],
    dwellMs: 5600,
    kb: { scale: 1.06, x: 0, y: -1.5 },
  },
  {
    id: 10,
    src: '/images/story/scene10.webp',
    alt: 'Nor, the reborn penguin-machine, turns to face you.',
    lines: ['what woke up knew two things:', 'the way — and why no one should walk it alone.'],
    dwellMs: 6000,
    kb: { scale: 1.07, x: 0, y: 0 },
  },
];
