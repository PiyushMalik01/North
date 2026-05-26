# CONVENTIONS.md - North Development Standards

## File Naming

| Type | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `SkillTree.tsx`, `UserProfile.tsx` |
| Pages | lowercase directories | `src/app/dashboard/page.tsx` |
| Hooks | camelCase with `use` prefix | `useMediaQuery.ts` |
| Stores | camelCase with `Store` suffix | `authStore.ts`, `skillStore.ts` |
| Utils | camelCase | `formatDate.ts` |
| Constants | UPPER_SNAKE_CASE for values | `API_BASE_URL`, `ROUTES` |
| Config | camelCase with `.config` suffix | `theme.config.ts` |
| Types | PascalCase interfaces | `User`, `SkillNode`, `Assessment` |
| CSS | kebab-case | `globals.css` |

## Component Structure

Every component follows this order:

```typescript
// 1. Directive
'use client';  // Only if component needs client-side interactivity

// 2. Imports (grouped: react/next, external libs, internal modules, types)
import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { Skill } from '@/types';

// 3. Props interface (if any)
interface SkillCardProps {
  skill: Skill;
  className?: string;
  onSelect?: (skill: Skill) => void;
}

// 4. Component (default export, named function)
export default function SkillCard({ skill, className, onSelect }: SkillCardProps) {
  // 5. Hooks first
  const [isExpanded, setIsExpanded] = useState(false);

  // 6. Handlers
  function handleClick() {
    onSelect?.(skill);
  }

  // 7. Return JSX
  return (
    <div className={cn('base-classes', className)}>
      {/* content */}
    </div>
  );
}
```

## Styling Rules

1. **Tailwind only** — no inline styles, no CSS modules, no styled-components
2. **CSS variables for colors** — never hardcode hex values in components
3. **`cn()` for conditionals** — `cn('base', isActive && 'active-class', className)`
4. **Theme-aware** — every color must work in both dark and light mode
5. **Responsive** — every component must handle these breakpoints:
   - `min-[400px]`: Small phones
   - `sm` (640px): Landscape phones
   - `md` (768px): Tablets
   - `lg` (1024px): Desktops
   - `xl` (1280px): Large desktops
   - `2xl` (1536px): Ultra-wide
6. **No new global CSS** — add utilities to `globals.css` only if genuinely reusable across the entire app
7. **Brutalist card pattern** — use the `.brutalist-card` class for card components

## State Management

- **Zustand** is the only state management library
- Stores live in `src/store/`
- Use `devtools` middleware for debugging
- Use `persist` middleware only when data must survive page refreshes
- Store naming: `use<Domain>Store` (e.g., `useAuthStore`, `useSkillStore`)
- Keep stores flat — avoid deeply nested objects
- One store per data domain — don't create overlapping stores

## API Calls

- All requests go through `src/lib/api/client.ts`
- Never call `fetch` or `axios` directly in components
- Use the typed methods: `apiClient.get<T>()`, `apiClient.post<T>()`
- Handle loading/error states in the component, not the API client
- Backend responses follow `ApiResponse<T>` shape from `src/types`

## TypeScript

- **Strict mode is on** — no implicit any, no unchecked index access
- Define interfaces in `src/types/index.ts` for shared types
- Feature-specific types can go in `src/types/<feature>.ts`
- Prefer `interface` over `type` for object shapes
- Use `type` for unions, intersections, and utility types
- Export types separately: `export type { User }` or `import type { User }`

## Imports

- Always use the `@/` path alias: `import { cn } from '@/lib/utils'`
- Never use relative paths that go up more than one level (`../../` is a smell)
- Group imports in this order, separated by blank lines:
  1. React/Next.js
  2. External packages
  3. Internal modules (`@/`)
  4. Types (as `import type`)

## Git Workflow

- **Branch naming**: `feature/<name>`, `fix/<name>`, `refactor/<name>`
- **Commits**: Descriptive present-tense messages ("add skill tree visualization", "fix theme toggle on mobile")
- **One feature per branch** — don't mix unrelated changes
- **Build must pass** — run `npm run build` before pushing
- **Lint must pass** — run `npm run lint` before pushing

## Component Size

- **Max 200 lines per component** — split if larger
- Extract sub-components into the same feature directory
- Extract complex logic into custom hooks in `src/hooks/`
- Extract repeated UI patterns into shared components

## Accessibility

- Use semantic HTML (`nav`, `main`, `section`, `article`, `button`)
- Add `aria-label` to interactive elements without visible text
- Ensure keyboard navigation works (tab order, enter/space activation)
- Maintain visible focus indicators
- Use sufficient color contrast (check against both themes)

## Performance

- Use Next.js `Image` component for all images
- Lazy load below-the-fold content
- Keep bundle size in check — check before adding new dependencies
- Use `'use client'` only on components that need it
- Prefer Server Components for data fetching and static content
