/**
 * prove — assessments. Passing one marks its linked trace node done and grants xp.
 * kinds: quiz (multiple choice), rapid (timed multiple choice), code (stub for now).
 */

export type ProveKind = 'quiz' | 'rapid' | 'code';

export interface ProveQuestion {
  id: string;
  prompt: string;
  options: string[];
  answer: number; // index into options
  explain: string;
}

export interface Assessment {
  id: string;
  title: string;
  kind: ProveKind;
  branchId: string;
  nodeId?: string; // trace node completed on pass
  xp: number;
  passPct: number; // percent correct required to pass
  durationSec?: number; // for rapid
  questions: ProveQuestion[];
}

const q = (id: string, prompt: string, options: string[], answer: number, explain: string): ProveQuestion => ({
  id,
  prompt,
  options,
  answer,
  explain,
});

export const assessments: Assessment[] = [
  {
    id: 'quiz-js',
    title: 'JavaScript Core',
    kind: 'quiz',
    branchId: 'web',
    nodeId: 'js',
    xp: 140,
    passPct: 70,
    questions: [
      q('j1', 'What does `typeof null` return?', ['"null"', '"object"', '"undefined"', '"none"'], 1, 'A historical quirk — null reports as "object".'),
      q('j2', 'Which keyword creates a block-scoped variable that cannot be reassigned?', ['var', 'let', 'const', 'static'], 2, 'const is block-scoped and non-reassignable.'),
      q('j3', 'What is the result of `[1,2,3].map(x => x*2)`?', ['[1,2,3]', '[2,4,6]', '6', '[1,4,9]'], 1, 'map returns a new array with each element doubled.'),
      q('j4', 'The event loop processes which queue after the call stack empties?', ['render queue', 'microtask queue', 'paint queue', 'macro only'], 1, 'Microtasks (promises) drain before the next macrotask.'),
      q('j5', 'A closure gives a function access to…', ['the global only', 'its outer scope variables', 'nothing', 'the DOM'], 1, 'Closures capture variables from their defining scope.'),
    ],
  },
  {
    id: 'quiz-html',
    title: 'Semantic HTML',
    kind: 'quiz',
    branchId: 'web',
    nodeId: 'html',
    xp: 80,
    passPct: 70,
    questions: [
      q('h1', 'Which element best wraps a site’s primary navigation?', ['<div>', '<nav>', '<section>', '<aside>'], 1, '<nav> conveys navigation landmarks to assistive tech.'),
      q('h2', 'What does the `alt` attribute on an image provide?', ['a tooltip', 'a caption', 'text alternative', 'lazy loading'], 2, 'alt is the text alternative for screen readers and broken images.'),
      q('h3', 'Which is a block-level element by default?', ['<span>', '<a>', '<p>', '<strong>'], 2, '<p> is block-level; the others are inline.'),
    ],
  },
  {
    id: 'quiz-css',
    title: 'CSS & Layout',
    kind: 'quiz',
    branchId: 'web',
    nodeId: 'css',
    xp: 120,
    passPct: 70,
    questions: [
      q('c1', 'Which property makes a flex container lay items in a column?', ['flex-wrap', 'flex-direction: column', 'align-items', 'justify-content'], 1, 'flex-direction: column stacks items vertically.'),
      q('c2', 'In CSS grid, `1fr` represents…', ['1 pixel', '1 fraction of free space', '1 rem', '100%'], 1, 'fr distributes remaining free space.'),
      q('c3', 'Which selector has the highest specificity?', ['.class', '#id', 'tag', '*'], 1, 'An id selector outranks classes and tags.'),
    ],
  },
  {
    id: 'quiz-react',
    title: 'React Basics',
    kind: 'quiz',
    branchId: 'react',
    nodeId: 'react-basics',
    xp: 180,
    passPct: 70,
    questions: [
      q('r1', 'Props in React are…', ['mutable', 'read-only', 'global', 'optional always'], 1, 'Props are read-only inputs to a component.'),
      q('r2', 'JSX compiles to calls of…', ['document.createElement', 'React.createElement', 'new Component', 'render()'], 1, 'JSX is sugar over React.createElement.'),
      q('r3', 'A list of elements needs a stable…', ['ref', 'key', 'id only', 'index always'], 1, 'key helps React reconcile list items.'),
    ],
  },
  {
    id: 'quiz-hooks',
    title: 'Hooks & State',
    kind: 'quiz',
    branchId: 'react',
    nodeId: 'hooks',
    xp: 200,
    passPct: 70,
    questions: [
      q('hk1', 'useEffect runs by default…', ['before render', 'after every render', 'never', 'only on unmount'], 1, 'Without deps it runs after every render.'),
      q('hk2', 'To memoize an expensive value you use…', ['useState', 'useMemo', 'useRef', 'useId'], 1, 'useMemo caches a computed value.'),
      q('hk3', 'Rules of hooks: call them…', ['conditionally', 'at the top level', 'in loops', 'in classes'], 1, 'Hooks must run in the same order every render.'),
    ],
  },
  {
    id: 'quiz-ts',
    title: 'TypeScript',
    kind: 'quiz',
    branchId: 'craft',
    nodeId: 'ts',
    xp: 200,
    passPct: 70,
    questions: [
      q('t1', 'A `type` and an `interface` can both…', ['be re-opened', 'describe object shapes', 'only extend classes', 'run at runtime'], 1, 'Both describe shapes; only interface merges.'),
      q('t2', '`unknown` differs from `any` because it…', ['is faster', 'requires narrowing before use', 'is a number', 'is nullable'], 1, 'unknown forces a check before you use it.'),
      q('t3', 'Generics let you…', ['avoid types', 'write reusable typed code', 'disable strict mode', 'import JS'], 1, 'Generics parameterize types for reuse.'),
    ],
  },
  {
    id: 'rapid-async',
    title: 'Async — Rapid Fire',
    kind: 'rapid',
    branchId: 'web',
    nodeId: 'async',
    xp: 160,
    passPct: 60,
    durationSec: 60,
    questions: [
      q('a1', '`await` can only be used inside…', ['any function', 'an async function or module top level', 'a loop', 'a class'], 1, 'await needs an async context.'),
      q('a2', 'Promise.all rejects when…', ['all reject', 'any one rejects', 'never', 'the first resolves'], 1, 'It rejects on the first rejection.'),
      q('a3', '`fetch` returns a…', ['string', 'Promise<Response>', 'JSON object', 'callback'], 1, 'fetch resolves to a Response.'),
      q('a4', 'To run promises in parallel and keep all results use…', ['await in a for loop', 'Promise.all', 'setTimeout', 'sync code'], 1, 'Promise.all awaits them concurrently.'),
    ],
  },
  {
    id: 'rapid-router',
    title: 'App Router — Rapid Fire',
    kind: 'rapid',
    branchId: 'react',
    nodeId: 'app-router',
    xp: 240,
    passPct: 60,
    durationSec: 75,
    questions: [
      q('rr1', 'By default, App Router components are…', ['client', 'server', 'static only', 'edge'], 1, 'Components are Server Components unless marked "use client".'),
      q('rr2', 'A shared UI wrapper that persists across routes is a…', ['page.tsx', 'layout.tsx', 'route.ts', 'loading.tsx'], 1, 'layout.tsx stays mounted across child routes.'),
      q('rr3', 'A streaming fallback is provided by…', ['error.tsx', 'loading.tsx', 'head.tsx', 'middleware'], 1, 'loading.tsx renders while a segment streams.'),
      q('rr4', 'Dynamic route segment syntax is…', ['(name)', '[name]', '{name}', '<name>'], 1, '[name] captures a dynamic segment.'),
    ],
  },
];
