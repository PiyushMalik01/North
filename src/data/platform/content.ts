/**
 * The platform's content model — the single source of truth for learning material.
 * Admins create/edit these via the CMS; learners consume them in trace + course
 * pages. Seeded here, then owned by the persisted contentStore (admin edits win).
 *
 *   Topic ──< Course ──< Material
 *   Roadmap ──< (ordered course refs)
 */

export type CourseLevel = 'beginner' | 'intermediate' | 'advanced';
export type MaterialType = 'video' | 'article' | 'doc' | 'link' | 'exercise';

export interface Topic {
  id: string;
  name: string;
  slug: string;
  blurb: string;
}

export interface Material {
  id: string;
  courseId: string;
  type: MaterialType;
  title: string;
  url: string;
  minutes: number;
}

export interface Course {
  id: string;
  topicId: string;
  title: string;
  level: CourseLevel;
  summary: string;
  tags: string[];
  xp: number; // granted when the whole course is completed
  proveId?: string; // optional assessment that caps the course (see prove.ts)
}

export interface RoadmapStep {
  courseId: string;
  note?: string;
}

export interface Roadmap {
  id: string;
  title: string;
  blurb: string;
  topicId?: string;
  steps: RoadmapStep[];
}

export interface ContentSeed {
  topics: Topic[];
  courses: Course[];
  materials: Material[];
  roadmaps: Roadmap[];
}

// ─── seed ────────────────────────────────────────────────────────────────────

export const seedTopics: Topic[] = [
  { id: 't-frontend', name: 'Frontend', slug: 'frontend', blurb: 'The browser, the DOM, and modern UI engineering.' },
  { id: 't-react', name: 'React & Next', slug: 'react', blurb: 'Components, state, and full-stack React.' },
  { id: 't-dsa', name: 'DSA', slug: 'dsa', blurb: 'Data structures, algorithms, and problem solving.' },
  { id: 't-backend', name: 'Backend', slug: 'backend', blurb: 'APIs, databases, and server craft.' },
];

export const seedCourses: Course[] = [
  { id: 'c-html', topicId: 't-frontend', title: 'Semantic HTML', level: 'beginner', summary: 'Structure pages with meaning and accessibility.', tags: ['html', 'a11y'], xp: 120, proveId: 'quiz-html' },
  { id: 'c-css', topicId: 't-frontend', title: 'CSS & Layout', level: 'beginner', summary: 'Flexbox, grid, and the cascade.', tags: ['css', 'layout'], xp: 160, proveId: 'quiz-css' },
  { id: 'c-js', topicId: 't-frontend', title: 'JavaScript Core', level: 'beginner', summary: 'Types, scope, closures, and the event loop.', tags: ['javascript'], xp: 200, proveId: 'quiz-js' },
  { id: 'c-async', topicId: 't-frontend', title: 'Async JavaScript', level: 'intermediate', summary: 'Promises, async/await, and fetch.', tags: ['javascript', 'async'], xp: 200, proveId: 'rapid-async' },
  { id: 'c-react', topicId: 't-react', title: 'React Fundamentals', level: 'intermediate', summary: 'Components, props, JSX, and rendering.', tags: ['react'], xp: 240, proveId: 'quiz-react' },
  { id: 'c-hooks', topicId: 't-react', title: 'Hooks & State', level: 'intermediate', summary: 'useState, useEffect, and custom hooks.', tags: ['react', 'hooks'], xp: 260, proveId: 'quiz-hooks' },
  { id: 'c-approuter', topicId: 't-react', title: 'Next.js App Router', level: 'advanced', summary: 'Server components, layouts, and routing.', tags: ['nextjs'], xp: 320, proveId: 'rapid-router' },
  { id: 'c-ts', topicId: 't-frontend', title: 'TypeScript', level: 'intermediate', summary: 'Generics, narrowing, and safe code.', tags: ['typescript'], xp: 240, proveId: 'quiz-ts' },
  { id: 'c-arrays', topicId: 't-dsa', title: 'Arrays & Hashing', level: 'beginner', summary: 'The workhorses of interview problems.', tags: ['dsa', 'arrays'], xp: 200 },
  { id: 'c-trees', topicId: 't-dsa', title: 'Trees & Graphs', level: 'advanced', summary: 'Traversals, BFS/DFS, and shortest paths.', tags: ['dsa', 'graphs'], xp: 320 },
  { id: 'c-rest', topicId: 't-backend', title: 'REST APIs', level: 'intermediate', summary: 'Design clean, predictable HTTP endpoints.', tags: ['api', 'http'], xp: 240 },
  { id: 'c-sql', topicId: 't-backend', title: 'SQL & Modeling', level: 'intermediate', summary: 'Schemas, joins, and indexes that scale.', tags: ['sql', 'db'], xp: 240 },
];

const mat = (id: string, courseId: string, type: MaterialType, title: string, minutes: number, url = '#'): Material => ({ id, courseId, type, title, url, minutes });

export const seedMaterials: Material[] = [
  // HTML
  mat('m-html-1', 'c-html', 'video', 'HTML document structure', 9),
  mat('m-html-2', 'c-html', 'article', 'Landmarks & semantic tags', 7),
  mat('m-html-3', 'c-html', 'exercise', 'Mark up a blog post', 15),
  // CSS
  mat('m-css-1', 'c-css', 'video', 'The box model & the cascade', 12),
  mat('m-css-2', 'c-css', 'article', 'Flexbox deep dive', 10),
  mat('m-css-3', 'c-css', 'doc', 'Grid cheat sheet', 5),
  mat('m-css-4', 'c-css', 'exercise', 'Build a responsive card grid', 20),
  // JS
  mat('m-js-1', 'c-js', 'video', 'Values, types, and coercion', 14),
  mat('m-js-2', 'c-js', 'article', 'Scope & closures explained', 11),
  mat('m-js-3', 'c-js', 'video', 'The event loop', 13),
  mat('m-js-4', 'c-js', 'exercise', 'Implement debounce & throttle', 18),
  // Async
  mat('m-async-1', 'c-async', 'video', 'Promises from scratch', 12),
  mat('m-async-2', 'c-async', 'article', 'async/await patterns', 9),
  mat('m-async-3', 'c-async', 'exercise', 'Build a retrying fetch', 16),
  // React
  mat('m-react-1', 'c-react', 'video', 'Thinking in components', 15),
  mat('m-react-2', 'c-react', 'article', 'Props, state, and re-renders', 10),
  mat('m-react-3', 'c-react', 'exercise', 'Build a filterable list', 22),
  // Hooks
  mat('m-hooks-1', 'c-hooks', 'video', 'useState & useEffect', 13),
  mat('m-hooks-2', 'c-hooks', 'doc', 'Rules of hooks', 4),
  mat('m-hooks-3', 'c-hooks', 'exercise', 'Write a useLocalStorage hook', 18),
  // App Router
  mat('m-ar-1', 'c-approuter', 'video', 'Server vs client components', 16),
  mat('m-ar-2', 'c-approuter', 'article', 'Layouts, loading & streaming', 12),
  mat('m-ar-3', 'c-approuter', 'exercise', 'Ship a streamed dashboard', 25),
  // TS
  mat('m-ts-1', 'c-ts', 'video', 'Types & narrowing', 12),
  mat('m-ts-2', 'c-ts', 'article', 'Generics in practice', 10),
  // DSA arrays
  mat('m-arr-1', 'c-arrays', 'video', 'Two pointers & sliding window', 14),
  mat('m-arr-2', 'c-arrays', 'exercise', 'Solve: two sum, group anagrams', 30),
  // DSA trees
  mat('m-tree-1', 'c-trees', 'video', 'BFS & DFS', 16),
  mat('m-tree-2', 'c-trees', 'exercise', 'Solve: level order, num islands', 35),
  // REST
  mat('m-rest-1', 'c-rest', 'video', 'Resources, verbs, status codes', 13),
  mat('m-rest-2', 'c-rest', 'doc', 'API design checklist', 6),
  // SQL
  mat('m-sql-1', 'c-sql', 'video', 'Joins & relationships', 15),
  mat('m-sql-2', 'c-sql', 'exercise', 'Model a learning platform', 28),
];

export const seedRoadmaps: Roadmap[] = [
  {
    id: 'r-frontend',
    title: 'Frontend Developer',
    blurb: 'Zero to job-ready frontend, in order.',
    topicId: 't-frontend',
    steps: [
      { courseId: 'c-html' },
      { courseId: 'c-css' },
      { courseId: 'c-js' },
      { courseId: 'c-async' },
      { courseId: 'c-ts' },
      { courseId: 'c-react' },
      { courseId: 'c-hooks' },
      { courseId: 'c-approuter', note: 'capstone' },
    ],
  },
  {
    id: 'r-interview',
    title: 'DSA for Interviews',
    blurb: 'The patterns that show up again and again.',
    topicId: 't-dsa',
    steps: [{ courseId: 'c-arrays' }, { courseId: 'c-trees', note: 'hard but worth it' }],
  },
  {
    id: 'r-backend',
    title: 'Backend Basics',
    blurb: 'Serve data the right way.',
    topicId: 't-backend',
    steps: [{ courseId: 'c-rest' }, { courseId: 'c-sql' }],
  },
];

export const contentSeed: ContentSeed = {
  topics: seedTopics,
  courses: seedCourses,
  materials: seedMaterials,
  roadmaps: seedRoadmaps,
};
