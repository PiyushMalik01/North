import type { SwipeCard } from '@/types';

export const PERSONALITY_TYPES: Record<string, { name: string; description: string }> = {
  builder:    { name: 'The Builder',    description: 'You learn by making things. Ship first, theory later.' },
  explorer:   { name: 'The Explorer',   description: 'Curious about everything. You go wide before going deep.' },
  analyst:    { name: 'The Analyst',     description: 'You need to understand why before you move on.' },
  connector:  { name: 'The Connector',   description: 'You thrive in teams and learn best through collaboration.' },
  strategist: { name: 'The Strategist',  description: 'You plan your moves. Consistent, focused, deliberate.' },
};

export const TRAIT_TO_PERSONALITY: Record<string, string> = {
  execution: 'builder',
  depth: 'analyst',
  collaboration: 'connector',
  consistency: 'strategist',
  clarity: 'explorer',
};

export const SWIPE_CARDS: SwipeCard[] = [
  { id: 'debug-3am',       statement: 'I debug at 3am and call it fun',                          trait: 'execution',     weight: 1 },
  { id: 'build-not-read',  statement: "I'd rather build the thing than read the docs",            trait: 'execution',     weight: 1 },
  { id: 'group-carry',     statement: "Group projects? I'm the one carrying",                     trait: 'collaboration', weight: -1 },
  { id: 'explain-simple',  statement: 'I can explain complex stuff so anyone gets it',             trait: 'clarity',       weight: 1 },
  { id: 'go-deep',         statement: 'I go deep into topics until I actually get it',             trait: 'depth',         weight: 1 },
  { id: 'side-projects',   statement: 'I start a lot of side projects... finishing is another story', trait: 'consistency', weight: -1 },
  { id: 'why-not-how',     statement: "I love figuring out *why* something works, not just *how*", trait: 'depth',         weight: 1 },
  { id: 'pair-program',    statement: "I'd pick pair programming over solo coding any day",        trait: 'collaboration', weight: 1 },
  { id: 'streak-keeper',   statement: "When I commit to a streak, I don't break it",              trait: 'consistency',   weight: 1 },
  { id: 'clean-diagram',   statement: 'I can turn any mess into a clean diagram',                  trait: 'clarity',       weight: 1 },
];

export const INTEREST_ICONS: Record<string, string> = {
  'Web Development':       'globe',
  'Mobile Development':    'smartphone',
  'Data Science':          'bar-chart',
  'Machine Learning':      'cpu',
  'DevOps':                'terminal',
  'Cloud Computing':       'cloud',
  'Cybersecurity':         'shield',
  'UI/UX Design':          'pen-tool',
  'Database':              'database',
  'Programming Languages': 'code',
};

export const COLLEGES = [
  'IIT Bombay', 'IIT Delhi', 'IIT Madras', 'IIT Kanpur', 'IIT Kharagpur',
  'IIT Roorkee', 'IIT Guwahati', 'IIT Hyderabad', 'BITS Pilani', 'BITS Goa',
  'BITS Hyderabad', 'NIT Trichy', 'NIT Warangal', 'NIT Surathkal', 'NIT Calicut',
  'IIIT Hyderabad', 'IIIT Bangalore', 'IIIT Delhi', 'DTU Delhi', 'NSUT Delhi',
  'IIIT Allahabad', 'VIT Vellore', 'SRM Chennai', 'Manipal University',
  'Amity University', 'LPU Punjab', 'Chandigarh University', 'Thapar University',
  'PEC Chandigarh', 'COEP Pune', 'VJTI Mumbai', 'ICT Mumbai', 'DAIICT Gandhinagar',
  'LNMIIT Jaipur', 'MNNIT Allahabad', 'ABV-IIITM Gwalior', 'IIITDM Jabalpur',
  'NIT Rourkela', 'NIT Durgapur', 'NIT Jamshedpur', 'NIT Patna', 'NIT Silchar',
  'NIT Kurukshetra', 'NIT Hamirpur', 'NIT Srinagar', 'NIT Nagpur', 'NIT Bhopal',
  'NIT Jaipur', 'NIT Raipur', 'NIT Agartala', 'NIT Meghalaya', 'NIT Mizoram',
  'KIIT Bhubaneswar', 'Lovely Professional University', 'Bennett University',
  'Shiv Nadar University', 'Ashoka University', 'FLAME University',
  'Symbiosis Institute of Technology', 'Vellore Institute of Technology',
  'Christ University', 'St. Xaviers Mumbai', 'Presidency University',
  'Jadavpur University', 'Anna University', 'Osmania University',
  'Mumbai University', 'Delhi University', 'Bangalore University',
  'Pune University', 'Calcutta University', 'Madras University',
];

export const YEAR_OPTIONS = [
  { value: '1st', label: '1st Year' },
  { value: '2nd', label: '2nd Year' },
  { value: '3rd', label: '3rd Year' },
  { value: '4th', label: '4th Year' },
  { value: 'grad', label: 'Grad' },
] as const;

export const GOAL_OPTIONS = [
  {
    value: 'internship' as const,
    title: 'Land my first internship',
    sub: '1-3 month focused sprint',
    icon: 'rocket',
  },
  {
    value: 'placements' as const,
    title: 'Level up for placements',
    sub: '3-6 month structured path',
    icon: 'trophy',
  },
  {
    value: 'exploring' as const,
    title: 'Just exploring, no rush',
    sub: 'Flexible, self-paced',
    icon: 'compass',
  },
];
