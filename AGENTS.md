# AGENTS.md - Multi-Agent Coordination Rules

## Purpose

This file defines rules for multiple developers or AI agents working on the North codebase simultaneously. Follow these strictly to prevent conflicts, redundant code, and broken features.

## Before Starting Any Work

1. **Read CLAUDE.md** — understand the tech stack, patterns, and rules
2. **Read CONVENTIONS.md** — understand the coding standards
3. **Check existing code** — search for similar components, utils, or patterns before creating new ones
4. **Check the types** — `src/types/index.ts` likely already has the interfaces you need
5. **Check the constants** — `src/constants/index.ts` has routes, enums, and config values

## Feature Boundaries

Each feature should be self-contained within its directory:

```
src/components/<feature>/       # Feature components
src/app/<feature>/              # Feature pages (Next.js App Router)
```

Shared/reusable components go in `src/components/shared/`.

### Ownership Rules

- Do NOT modify another feature's components unless fixing a bug that originates there
- Do NOT add feature-specific logic to shared components — create a wrapper instead
- Do NOT duplicate utilities — if `src/lib/utils` doesn't have what you need, add it there
- Do NOT create feature-specific stores if the existing stores (`authStore`, `skillStore`, `themeStore`) already cover the data

## File Creation Rules

| Creating... | Put it in... | Naming |
|-------------|-------------|--------|
| Page | `src/app/<route>/page.tsx` | lowercase route dirs |
| Component | `src/components/<feature>/ComponentName.tsx` | PascalCase |
| Hook | `src/hooks/useHookName.ts` | camelCase with `use` prefix |
| Store | `src/store/featureStore.ts` | camelCase with `Store` suffix |
| Type | `src/types/index.ts` (extend) or `src/types/<feature>.ts` | PascalCase interfaces |
| Utility | `src/lib/utils/index.ts` (extend) or `src/lib/<domain>/` | camelCase functions |
| Constant | `src/constants/index.ts` (extend) | UPPER_SNAKE_CASE |
| Config | `src/config/<name>.config.ts` | camelCase with `.config` suffix |

## Preventing Conflicts

### Styling
- Never use inline styles — only Tailwind utilities and CSS variables
- Never hardcode colors — use the theme system CSS variables
- Never add new CSS classes to `globals.css` unless they are truly global utilities
- Use `cn()` for conditional classes — import from `@/lib/utils`

### State
- One source of truth per data domain — don't create parallel stores
- All API data flows through `src/lib/api/client.ts`
- Auth token management lives in `authStore` — don't manage tokens elsewhere

### Navigation
- All route paths defined in `src/constants/index.ts` under `ROUTES`
- Menu items defined in `src/data/menuData.ts`
- When adding a new page, update both `ROUTES` and `menuData.ts` if it should appear in navigation

## Merge Checklist

Before considering work complete:

- [ ] Both dark and light themes tested
- [ ] Mobile (400px+), tablet (768px+), and desktop (1024px+) verified
- [ ] No hardcoded colors — all use CSS variables or Tailwind theme classes
- [ ] No `any` types
- [ ] No `console.log` left in code
- [ ] Imports use `@/` alias
- [ ] New routes added to constants
- [ ] No duplicate components or utilities
- [ ] Component under 200 lines (split if larger)
- [ ] TypeScript strict mode passes (`npm run build`)
- [ ] ESLint passes (`npm run lint`)

## Parallel Work Guidelines

When multiple agents or developers work simultaneously:

1. **Claim your scope** — declare which files you're modifying before starting
2. **Don't touch shared files without coordination** — `globals.css`, `layout.tsx`, `constants/index.ts`, `types/index.ts` are high-conflict zones
3. **Feature isolation** — work within `src/components/<your-feature>/` and `src/app/<your-route>/`
4. **Additive only for shared resources** — when modifying `types/index.ts` or `constants/index.ts`, only add new entries, never rename or remove existing ones without coordination
5. **Test the full app** — `npm run build` must pass before merging
