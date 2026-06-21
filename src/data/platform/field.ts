export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'internship' | 'full-time' | 'contract';
  skills: string[];
  postedAgo: string;
}

export interface Company {
  id: string;
  name: string;
  blurb: string;
  stack: string[];
  openRoles: number;
}

export interface SkillDemand {
  skill: string;
  demand: number; // 0–100
  trend: 'up' | 'flat' | 'down';
}

export const jobs: Job[] = [
  {
    id: 'j-1',
    title: 'Frontend Engineer Intern',
    company: 'Vercel',
    location: 'Remote',
    type: 'internship',
    skills: ['React', 'TypeScript', 'Next.js', 'CSS'],
    postedAgo: '2 days ago',
  },
  {
    id: 'j-2',
    title: 'Full-Stack Developer',
    company: 'Linear',
    location: 'San Francisco, CA',
    type: 'full-time',
    skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL'],
    postedAgo: '5 days ago',
  },
  {
    id: 'j-3',
    title: 'React Developer',
    company: 'Figma',
    location: 'New York, NY',
    type: 'full-time',
    skills: ['React', 'TypeScript', 'GraphQL', 'Tailwind CSS'],
    postedAgo: '1 week ago',
  },
  {
    id: 'j-4',
    title: 'Backend Engineer Intern',
    company: 'PlanetScale',
    location: 'Remote',
    type: 'internship',
    skills: ['Node.js', 'SQL', 'Go', 'Redis'],
    postedAgo: '3 days ago',
  },
  {
    id: 'j-5',
    title: 'UI Engineer',
    company: 'Loom',
    location: 'Austin, TX',
    type: 'full-time',
    skills: ['React', 'CSS', 'Framer Motion', 'TypeScript'],
    postedAgo: '4 days ago',
  },
  {
    id: 'j-6',
    title: 'Frontend Contractor',
    company: 'Retool',
    location: 'Remote',
    type: 'contract',
    skills: ['React', 'TypeScript', 'REST APIs', 'Tailwind CSS'],
    postedAgo: '6 days ago',
  },
  {
    id: 'j-7',
    title: 'Software Engineer (New Grad)',
    company: 'Supabase',
    location: 'Remote',
    type: 'full-time',
    skills: ['TypeScript', 'PostgreSQL', 'Deno', 'React'],
    postedAgo: '2 weeks ago',
  },
  {
    id: 'j-8',
    title: 'Frontend Platform Intern',
    company: 'Stripe',
    location: 'Seattle, WA',
    type: 'internship',
    skills: ['React', 'TypeScript', 'Webpack', 'Testing'],
    postedAgo: '1 day ago',
  },
];

export const companies: Company[] = [
  {
    id: 'c-1',
    name: 'Vercel',
    blurb: 'The platform for frontend developers — deploy, scale, and iterate at the speed of thought.',
    stack: ['Next.js', 'React', 'TypeScript', 'Edge Functions'],
    openRoles: 12,
  },
  {
    id: 'c-2',
    name: 'Linear',
    blurb: 'Issue tracking built for modern software teams. Fast, focused, and beautifully designed.',
    stack: ['React', 'GraphQL', 'TypeScript', 'Electron'],
    openRoles: 7,
  },
  {
    id: 'c-3',
    name: 'Supabase',
    blurb: 'The open-source Firebase alternative. Postgres, Auth, Storage, Realtime — all in one.',
    stack: ['PostgreSQL', 'Deno', 'TypeScript', 'Go'],
    openRoles: 9,
  },
  {
    id: 'c-4',
    name: 'Figma',
    blurb: 'Where teams design together. Browser-based design tooling used by millions of product teams.',
    stack: ['React', 'WebGL', 'C++', 'TypeScript'],
    openRoles: 21,
  },
  {
    id: 'c-5',
    name: 'Stripe',
    blurb: 'The financial infrastructure of the internet. Powering millions of businesses worldwide.',
    stack: ['Ruby', 'React', 'TypeScript', 'Go'],
    openRoles: 34,
  },
];

export const skillDemand: SkillDemand[] = [
  { skill: 'React', demand: 92, trend: 'up' },
  { skill: 'TypeScript', demand: 85, trend: 'up' },
  { skill: 'Tailwind CSS', demand: 70, trend: 'up' },
  { skill: 'SQL / PostgreSQL', demand: 60, trend: 'flat' },
  { skill: 'Node.js', demand: 74, trend: 'flat' },
  { skill: 'GraphQL', demand: 48, trend: 'down' },
  { skill: 'Next.js', demand: 80, trend: 'up' },
  { skill: 'REST APIs', demand: 55, trend: 'flat' },
];
