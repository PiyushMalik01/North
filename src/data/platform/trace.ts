/**
 * trace — the skill tree / route north. A DAG of nodes across branches.
 * Node state is derived at render time from the progress store's completedNodeIds:
 *   completed → in completedNodeIds
 *   available → every dep is completed (or no deps)
 *   locked    → some dep is not yet completed
 * Shapes mirror the eventual API so the backend swap is data-only.
 */

export interface TraceBranch {
  id: string;
  name: string;
  blurb: string;
}

export interface TraceNode {
  id: string;
  title: string;
  branchId: string;
  tier: number; // vertical depth, 0 = roots
  deps: string[]; // prerequisite node ids
  xp: number; // reward on completion
  summary: string;
  proveId?: string; // assessment that completes this node (see prove.ts)
}

export const traceBranches: TraceBranch[] = [
  { id: 'web', name: 'web foundations', blurb: 'the bedrock — html, css, the language of the browser.' },
  { id: 'react', name: 'react & next', blurb: 'components, state, and the app router.' },
  { id: 'craft', name: 'engineering craft', blurb: 'types, testing, and shipping with confidence.' },
];

export const traceNodes: TraceNode[] = [
  // web foundations
  { id: 'html', title: 'Semantic HTML', branchId: 'web', tier: 0, deps: [], xp: 80, summary: 'Structure pages with meaning, not just divs.', proveId: 'quiz-html' },
  { id: 'css', title: 'CSS & Layout', branchId: 'web', tier: 1, deps: ['html'], xp: 120, summary: 'Flexbox, grid, and the cascade.', proveId: 'quiz-css' },
  { id: 'js', title: 'JavaScript Core', branchId: 'web', tier: 1, deps: ['html'], xp: 140, summary: 'Types, scope, closures, the event loop.', proveId: 'quiz-js' },
  { id: 'async', title: 'Async & Promises', branchId: 'web', tier: 2, deps: ['js'], xp: 160, summary: 'Promises, async/await, fetch.', proveId: 'rapid-async' },

  // react & next
  { id: 'react-basics', title: 'React Basics', branchId: 'react', tier: 2, deps: ['js', 'css'], xp: 180, summary: 'Components, props, and JSX.', proveId: 'quiz-react' },
  { id: 'hooks', title: 'Hooks & State', branchId: 'react', tier: 3, deps: ['react-basics'], xp: 200, summary: 'useState, useEffect, custom hooks.', proveId: 'quiz-hooks' },
  { id: 'app-router', title: 'App Router', branchId: 'react', tier: 4, deps: ['hooks', 'async'], xp: 240, summary: 'Server components, layouts, routing.', proveId: 'rapid-router' },
  { id: 'server-actions', title: 'Server Actions', branchId: 'react', tier: 5, deps: ['app-router'], xp: 280, summary: 'Mutations without an API layer.' },

  // engineering craft
  { id: 'ts', title: 'TypeScript', branchId: 'craft', tier: 3, deps: ['js'], xp: 200, summary: 'Generics, narrowing, safe code.', proveId: 'quiz-ts' },
  { id: 'testing', title: 'Testing', branchId: 'craft', tier: 4, deps: ['ts'], xp: 220, summary: 'Unit, integration, and the testing pyramid.' },
  { id: 'auth-flow', title: 'Auth Flow', branchId: 'craft', tier: 5, deps: ['server-actions', 'ts'], xp: 320, summary: 'Sessions, tokens, and protecting routes.' },
];

/** Nodes seeded as already done for the demo player (also reflected in progress store default). */
export const seedCompletedNodeIds = ['html', 'css', 'js'];
