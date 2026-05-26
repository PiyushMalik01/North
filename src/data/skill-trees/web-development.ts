export interface SkillNodeData {
  id: string;
  name: string;
  description: string;
  estimatedHours: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  prerequisites: string[];
  topics: string[];
}

export interface SkillTreeData {
  id: string;
  name: string;
  description: string;
  category: string;
  nodes: SkillNodeData[];
}

export const webDevelopmentTree: SkillTreeData = {
  id: 'web-development',
  name: 'Web Development',
  description:
    'From HTML basics to full-stack applications. The complete path to becoming a web developer.',
  category: 'Web Development',
  nodes: [
    {
      id: 'web-fundamentals',
      name: 'How the Web Works',
      description:
        'HTTP, DNS, browsers, client-server architecture. The foundation everything else builds on.',
      estimatedHours: 4,
      difficulty: 'beginner',
      prerequisites: [],
      topics: ['HTTP/HTTPS', 'DNS', 'Browsers', 'Client-Server Model'],
    },
    {
      id: 'html',
      name: 'HTML Fundamentals',
      description:
        'Semantic HTML, document structure, forms, accessibility. The skeleton of every web page.',
      estimatedHours: 8,
      difficulty: 'beginner',
      prerequisites: ['web-fundamentals'],
      topics: ['Semantic Tags', 'Forms', 'Accessibility', 'SEO Basics'],
    },
    {
      id: 'css',
      name: 'CSS Fundamentals',
      description:
        'Selectors, box model, flexbox, grid, positioning. Making things look right.',
      estimatedHours: 12,
      difficulty: 'beginner',
      prerequisites: ['html'],
      topics: ['Box Model', 'Flexbox', 'Grid', 'Selectors', 'Specificity'],
    },
    {
      id: 'javascript',
      name: 'JavaScript Essentials',
      description:
        'Variables, functions, objects, arrays, control flow. The language of the web.',
      estimatedHours: 20,
      difficulty: 'beginner',
      prerequisites: ['html'],
      topics: ['Variables', 'Functions', 'Objects', 'Arrays', 'ES6+'],
    },
    {
      id: 'git',
      name: 'Git & Version Control',
      description:
        'Repositories, branches, commits, merging. How every team ships code.',
      estimatedHours: 6,
      difficulty: 'beginner',
      prerequisites: ['web-fundamentals'],
      topics: ['Commits', 'Branches', 'Merging', 'GitHub', 'Pull Requests'],
    },
    {
      id: 'responsive',
      name: 'Responsive Design',
      description:
        'Media queries, mobile-first, fluid layouts. One codebase, every screen size.',
      estimatedHours: 8,
      difficulty: 'intermediate',
      prerequisites: ['css'],
      topics: [
        'Media Queries',
        'Mobile-First',
        'Fluid Typography',
        'Viewport Units',
      ],
    },
    {
      id: 'dom',
      name: 'DOM Manipulation',
      description:
        'Selecting elements, events, dynamic content. Making pages interactive without a framework.',
      estimatedHours: 10,
      difficulty: 'intermediate',
      prerequisites: ['javascript'],
      topics: [
        'Query Selectors',
        'Event Listeners',
        'Dynamic Elements',
        'Event Delegation',
      ],
    },
    {
      id: 'async-js',
      name: 'Async JavaScript',
      description:
        'Promises, async/await, fetch API, error handling. Talking to servers and handling time.',
      estimatedHours: 12,
      difficulty: 'intermediate',
      prerequisites: ['javascript'],
      topics: ['Promises', 'Async/Await', 'Fetch API', 'Error Handling'],
    },
    {
      id: 'typescript',
      name: 'TypeScript',
      description:
        'Static types, interfaces, generics, type inference. JavaScript that catches bugs before runtime.',
      estimatedHours: 15,
      difficulty: 'intermediate',
      prerequisites: ['javascript'],
      topics: ['Types', 'Interfaces', 'Generics', 'Type Guards', 'Utility Types'],
    },
    {
      id: 'tailwind',
      name: 'Tailwind CSS',
      description:
        'Utility-first CSS, custom themes, responsive utilities. Ship styled UIs at speed.',
      estimatedHours: 8,
      difficulty: 'intermediate',
      prerequisites: ['css', 'responsive'],
      topics: [
        'Utility Classes',
        'Custom Config',
        'Responsive Prefixes',
        'Dark Mode',
      ],
    },
    {
      id: 'react',
      name: 'React Fundamentals',
      description:
        'Components, JSX, props, conditional rendering. The library that changed frontend development.',
      estimatedHours: 20,
      difficulty: 'intermediate',
      prerequisites: ['dom', 'async-js'],
      topics: ['Components', 'JSX', 'Props', 'Lists & Keys', 'Conditional Rendering'],
    },
    {
      id: 'react-hooks',
      name: 'React Hooks & Patterns',
      description:
        'useState, useEffect, custom hooks, context. Modern React patterns that scale.',
      estimatedHours: 15,
      difficulty: 'intermediate',
      prerequisites: ['react'],
      topics: [
        'useState',
        'useEffect',
        'useRef',
        'Custom Hooks',
        'Context API',
      ],
    },
    {
      id: 'state-mgmt',
      name: 'State Management',
      description:
        'Zustand, global state, persistence, devtools. Managing data across your entire app.',
      estimatedHours: 10,
      difficulty: 'advanced',
      prerequisites: ['react-hooks'],
      topics: ['Zustand', 'Global State', 'Persistence', 'Selectors'],
    },
    {
      id: 'api-design',
      name: 'API Design & REST',
      description:
        'REST principles, route design, status codes, authentication. Building the bridge between frontend and data.',
      estimatedHours: 10,
      difficulty: 'intermediate',
      prerequisites: ['async-js'],
      topics: [
        'REST Principles',
        'Route Design',
        'Status Codes',
        'Auth Patterns',
      ],
    },
    {
      id: 'nextjs',
      name: 'Next.js App Router',
      description:
        'Server components, routing, data fetching, API routes. The full-stack React framework.',
      estimatedHours: 20,
      difficulty: 'advanced',
      prerequisites: ['react-hooks', 'typescript'],
      topics: [
        'App Router',
        'Server Components',
        'Data Fetching',
        'API Routes',
        'Middleware',
      ],
    },
    {
      id: 'databases',
      name: 'Databases & SQL',
      description:
        'PostgreSQL, schemas, queries, ORMs, migrations. Where all the data lives.',
      estimatedHours: 15,
      difficulty: 'advanced',
      prerequisites: ['api-design'],
      topics: ['SQL', 'PostgreSQL', 'Prisma ORM', 'Migrations', 'Relations'],
    },
    {
      id: 'fullstack',
      name: 'Full-Stack Project',
      description:
        'Build and deploy a complete application. Everything comes together here.',
      estimatedHours: 40,
      difficulty: 'advanced',
      prerequisites: ['nextjs', 'state-mgmt', 'tailwind', 'databases', 'git'],
      topics: [
        'Architecture',
        'Deployment',
        'Testing',
        'Performance',
        'Production',
      ],
    },
  ],
};

export type MockUserProgress = Record<
  string,
  'locked' | 'unlocked' | 'in-progress' | 'completed'
>;

export const mockProgress: MockUserProgress = {
  'web-fundamentals': 'completed',
  html: 'completed',
  css: 'completed',
  javascript: 'completed',
  git: 'completed',
  responsive: 'in-progress',
  dom: 'in-progress',
  'async-js': 'unlocked',
  typescript: 'unlocked',
  tailwind: 'locked',
  react: 'locked',
  'react-hooks': 'locked',
  'state-mgmt': 'locked',
  'api-design': 'unlocked',
  nextjs: 'locked',
  databases: 'locked',
  fullstack: 'locked',
};
