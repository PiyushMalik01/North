import type { LoveCard, Dilemma } from '@/types';

// ─── Step 3: "find your love" — swipe deck → interests ─────
// Each right-swipe maps to one or more skill domains (SKILL_CATEGORIES).

export const LOVE_CARDS: LoveCard[] = [
  { id: 'love-web', statement: 'building things people can actually click, poke, and use', domains: ['Web Development'] },
  { id: 'love-mobile', statement: "apps that live in someone's pocket and buzz in their hand", domains: ['Mobile Development'] },
  { id: 'love-ai', statement: 'digging through data til it spills the tea, then teaching a machine to predict it', domains: ['Data Science', 'Machine Learning'] },
  { id: 'love-design', statement: 'obsessing over how it looks, moves, and feels under your thumb', domains: ['UI/UX Design'] },
  { id: 'love-sec', statement: 'breaking into systems — the legal way — to find the cracks first', domains: ['Cybersecurity'] },
  { id: 'love-infra', statement: 'the dark magic that keeps an app alive at 3am for a million people', domains: ['DevOps', 'Cloud Computing'] },
];

// ─── Step 4: "the choices" — blue/red dilemmas → work-style ─
// blue = first dimension value, red = second (mapping lives in lib/onboarding/profile.ts).

export const DILEMMAS: Dilemma[] = [
  {
    id: '2am',
    prompt: "it's 2am. you & the code. status?",
    blue: "can't stop til it's perfect",
    red: 'shipped it ugly, moving on',
  },
  {
    id: 'doors',
    prompt: 'two doors. you take the one that says—',
    blue: "'here's the exact path'",
    red: "'figure it out'",
  },
  {
    id: 'future',
    prompt: 'your future self texts you one line. it reads—',
    blue: "'we got the offer'",
    red: "'we built something people love'",
  },
  {
    id: 'evening',
    prompt: 'a free evening opens up. for real—',
    blue: 'all in, every night',
    red: "one solid session, i've got a life too",
  },
];

// Casual labels for domains, used in Nor's read-back voice.
export const DOMAIN_LABELS: Record<string, string> = {
  'Web Development': 'web',
  'Mobile Development': 'mobile',
  'Data Science': 'data',
  'Machine Learning': 'ai',
  DevOps: 'infra',
  'Cloud Computing': 'cloud',
  Cybersecurity: 'security',
  'UI/UX Design': 'design',
  Database: 'data',
  'Programming Languages': 'languages',
};

export const YEAR_OPTIONS = [
  { value: '1st', label: '1st Year' },
  { value: '2nd', label: '2nd Year' },
  { value: '3rd', label: '3rd Year' },
  { value: '4th', label: '4th Year' },
  { value: 'grad', label: 'Grad' },
] as const;
