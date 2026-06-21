import 'dotenv/config';
import { PrismaClient, QuestType } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const pool = new pg.Pool({ connectionString: process.env.DIRECT_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const DIFFICULTY_MAP = {
  beginner: 'BEGINNER',
  intermediate: 'INTERMEDIATE',
  advanced: 'ADVANCED',
} as const;

const webDevNodes = [
  { slug: 'web-fundamentals', name: 'How the Web Works', description: 'HTTP, DNS, browsers, client-server architecture.', hours: 4, difficulty: 'beginner', topics: ['HTTP/HTTPS', 'DNS', 'Browsers', 'Client-Server Model'], prereqs: [] },
  { slug: 'html', name: 'HTML Fundamentals', description: 'Semantic HTML, document structure, forms, accessibility.', hours: 8, difficulty: 'beginner', topics: ['Semantic Tags', 'Forms', 'Accessibility', 'SEO Basics'], prereqs: ['web-fundamentals'] },
  { slug: 'css', name: 'CSS Fundamentals', description: 'Selectors, box model, flexbox, grid, positioning.', hours: 12, difficulty: 'beginner', topics: ['Box Model', 'Flexbox', 'Grid', 'Selectors', 'Specificity'], prereqs: ['html'] },
  { slug: 'javascript', name: 'JavaScript Essentials', description: 'Variables, functions, objects, arrays, control flow.', hours: 20, difficulty: 'beginner', topics: ['Variables', 'Functions', 'Objects', 'Arrays', 'ES6+'], prereqs: ['html'] },
  { slug: 'git', name: 'Git & Version Control', description: 'Repositories, branches, commits, merging.', hours: 6, difficulty: 'beginner', topics: ['Commits', 'Branches', 'Merging', 'GitHub', 'Pull Requests'], prereqs: ['web-fundamentals'] },
  { slug: 'responsive', name: 'Responsive Design', description: 'Media queries, mobile-first, fluid layouts.', hours: 8, difficulty: 'intermediate', topics: ['Media Queries', 'Mobile-First', 'Fluid Typography', 'Viewport Units'], prereqs: ['css'] },
  { slug: 'dom', name: 'DOM Manipulation', description: 'Selecting elements, events, dynamic content.', hours: 10, difficulty: 'intermediate', topics: ['Query Selectors', 'Event Listeners', 'Dynamic Elements', 'Event Delegation'], prereqs: ['javascript'] },
  { slug: 'async-js', name: 'Async JavaScript', description: 'Promises, async/await, fetch API, error handling.', hours: 12, difficulty: 'intermediate', topics: ['Promises', 'Async/Await', 'Fetch API', 'Error Handling'], prereqs: ['javascript'] },
  { slug: 'typescript', name: 'TypeScript', description: 'Static types, interfaces, generics, type inference.', hours: 15, difficulty: 'intermediate', topics: ['Types', 'Interfaces', 'Generics', 'Type Guards', 'Utility Types'], prereqs: ['javascript'] },
  { slug: 'tailwind', name: 'Tailwind CSS', description: 'Utility-first CSS, custom themes, responsive utilities.', hours: 8, difficulty: 'intermediate', topics: ['Utility Classes', 'Custom Config', 'Responsive Prefixes', 'Dark Mode'], prereqs: ['css', 'responsive'] },
  { slug: 'react', name: 'React Fundamentals', description: 'Components, JSX, props, conditional rendering.', hours: 20, difficulty: 'intermediate', topics: ['Components', 'JSX', 'Props', 'Lists & Keys', 'Conditional Rendering'], prereqs: ['dom', 'async-js'] },
  { slug: 'react-hooks', name: 'React Hooks & Patterns', description: 'useState, useEffect, custom hooks, context.', hours: 15, difficulty: 'intermediate', topics: ['useState', 'useEffect', 'useRef', 'Custom Hooks', 'Context API'], prereqs: ['react'] },
  { slug: 'state-mgmt', name: 'State Management', description: 'Zustand, global state, persistence, devtools.', hours: 10, difficulty: 'advanced', topics: ['Zustand', 'Global State', 'Persistence', 'Selectors'], prereqs: ['react-hooks'] },
  { slug: 'api-design', name: 'API Design & REST', description: 'REST principles, route design, status codes, authentication.', hours: 10, difficulty: 'intermediate', topics: ['REST Principles', 'Route Design', 'Status Codes', 'Auth Patterns'], prereqs: ['async-js'] },
  { slug: 'nextjs', name: 'Next.js App Router', description: 'Server components, routing, data fetching, API routes.', hours: 20, difficulty: 'advanced', topics: ['App Router', 'Server Components', 'Data Fetching', 'API Routes', 'Middleware'], prereqs: ['react-hooks', 'typescript'] },
  { slug: 'databases', name: 'Databases & SQL', description: 'PostgreSQL, schemas, queries, ORMs, migrations.', hours: 15, difficulty: 'advanced', topics: ['SQL', 'PostgreSQL', 'Prisma ORM', 'Migrations', 'Relations'], prereqs: ['api-design'] },
  { slug: 'fullstack', name: 'Full-Stack Project', description: 'Build and deploy a complete application.', hours: 40, difficulty: 'advanced', topics: ['Architecture', 'Deployment', 'Testing', 'Performance', 'Production'], prereqs: ['nextjs', 'state-mgmt', 'tailwind', 'databases', 'git'] },
];

const quests = [
  { type: 'SKILL', title: 'Complete Responsive Design', description: 'Finish all topics in Responsive Design', reward: 150 },
  { type: 'CHALLENGE', title: 'Build a Landing Page', description: 'Apply HTML, CSS & responsive skills to build a real landing page', reward: 300 },
  { type: 'RECALL', title: 'CSS Flexbox Recall', description: 'Quick quiz on flexbox concepts', reward: 50 },
  { type: 'SKILL', title: 'Master Async JavaScript', description: 'Complete all async JS topics including Promises and Fetch', reward: 200 },
  { type: 'CHALLENGE', title: 'API Integration Challenge', description: 'Build a weather app using a public API', reward: 350 },
];

async function main() {
  console.log('Seeding database...');

  // Upsert skill tree
  const tree = await prisma.skillTree.upsert({
    where: { slug: 'web-development' },
    update: {},
    create: {
      slug: 'web-development',
      name: 'Web Development',
      description: 'From HTML basics to full-stack applications. The complete path to becoming a web developer.',
      category: 'Web Development',
      sortOrder: 0,
    },
  });
  console.log(`  ✓ Skill tree: ${tree.name}`);

  // Create skill nodes
  const nodeMap: Record<string, string> = {};
  for (let i = 0; i < webDevNodes.length; i++) {
    const n = webDevNodes[i];
    const node = await prisma.skillNode.upsert({
      where: { treeId_slug: { treeId: tree.id, slug: n.slug } },
      update: {
        name: n.name,
        description: n.description,
        estimatedHours: n.hours,
        difficulty: DIFFICULTY_MAP[n.difficulty as keyof typeof DIFFICULTY_MAP],
        topics: n.topics,
        sortOrder: i,
      },
      create: {
        slug: n.slug,
        name: n.name,
        description: n.description,
        estimatedHours: n.hours,
        difficulty: DIFFICULTY_MAP[n.difficulty as keyof typeof DIFFICULTY_MAP],
        topics: n.topics,
        sortOrder: i,
        treeId: tree.id,
      },
    });
    nodeMap[n.slug] = node.id;
  }
  console.log(`  ✓ ${webDevNodes.length} skill nodes`);

  // Wire prerequisites
  let prereqCount = 0;
  for (const n of webDevNodes) {
    for (const pSlug of n.prereqs) {
      if (nodeMap[n.slug] && nodeMap[pSlug]) {
        await prisma.skillPrerequisite.upsert({
          where: {
            skillId_prerequisiteId: {
              skillId: nodeMap[n.slug],
              prerequisiteId: nodeMap[pSlug],
            },
          },
          update: {},
          create: {
            skillId: nodeMap[n.slug],
            prerequisiteId: nodeMap[pSlug],
          },
        });
        prereqCount++;
      }
    }
  }
  console.log(`  ✓ ${prereqCount} prerequisite links`);

  // Seed quests
  for (const q of quests) {
    await prisma.quest.create({
      data: {
        type: q.type as QuestType,
        title: q.title,
        description: q.description,
        reward: q.reward,
      },
    });
  }
  console.log(`  ✓ ${quests.length} quests`);

  console.log('\nDone!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
