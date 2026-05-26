# CLAUDE.md - North Platform

## What is North?

North is an AI-driven skill intelligence and learning platform for college students. It replaces syllabus-driven education with structured skill trees, real assessments, gamification, and AI-assisted guidance — from first semester to first job.

**Target users**: Students (primary), Teachers, Colleges, Recruiters (secondary).

## Quick Start

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # Production build
npm run lint         # ESLint
npm run format       # Prettier
npm run format:check # Check formatting
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16+ (App Router, TypeScript) |
| React | 19 |
| Styling | Tailwind CSS 4 (via @tailwindcss/postcss) |
| State | Zustand 5 (persist + devtools middleware) |
| HTTP | Axios (interceptors, token injection) |
| Animations | Framer Motion, Web Animations API |
| Code Editor | Monaco Editor (@monaco-editor/react) |
| Icons | react-icons |
| Utils | clsx, tailwind-merge |
| Fonts | Roboto Condensed (body), Oswald (logo/headings) |

**Planned backend**: Node.js + NestJS, PostgreSQL, Redis, Cloudinary/S3, LLM APIs.

## Project Structure

```
North/
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── layout.tsx           # Root layout (fonts, theme hydration, metadata)
│   │   ├── page.tsx             # Landing page
│   │   ├── globals.css          # CSS variables, theme tokens, utility classes
│   │   └── codespaces/
│   │       └── page.tsx         # CodeSpaces IDE page
│   ├── components/
│   │   ├── shared/              # Navbar, Footer, ThemeToggle, ThemeProvider, etc.
│   │   ├── landing/             # Hero, Features, HowItWorks, CTA
│   │   └── codespaces/          # CodeEditor, ProblemPanel
│   ├── store/                   # Zustand stores (themeStore, authStore, skillStore)
│   ├── lib/
│   │   ├── api/client.ts        # Axios API client with auth interceptors
│   │   └── utils/index.ts       # cn(), formatDate(), debounce(), etc.
│   ├── hooks/                   # useMediaQuery, useLogoAnimation
│   ├── types/index.ts           # All TypeScript interfaces (User, Skill, Assessment, etc.)
│   ├── constants/index.ts       # Routes, enums, config values
│   ├── data/menuData.ts         # Navigation menu structure
│   └── config/                  # theme.config.ts, animation.config.ts
├── public/                      # Static assets (images, logos)
├── CLAUDE.md                    # This file
├── AGENTS.md                    # Multi-agent coordination rules
├── README.md                    # Public-facing readme
├── PROJECT-OVERVIEW.md          # Complete feature spec and timeline
└── CONVENTIONS.md               # Coding standards and rules
```

## Theme System

Two modes: **dark** (default) and **light**. All colors are CSS variables in `globals.css`.

| Token | Dark | Light |
|-------|------|-------|
| --background-primary | #0D1117 | #FFFFFF |
| --background-secondary | #161B22 | #F6F8FA |
| --text-primary | #FFFFFF | #24292F |
| --text-secondary | #C9D1D9 | #57606A |
| --brand-blue | #08398C | #0969DA |
| --brand-purple | #9A6DE3 | #8250DF |
| --border-color | #30363D | #D0D7DE |

- State managed by `src/store/themeStore.ts` (Zustand with localStorage persistence)
- Theme applied via `.light` class on `:root` element
- Inline script in `layout.tsx` prevents flash-of-wrong-theme on load
- Ripple animation on toggle via `ThemeTransition.tsx`

## Design Language

- **Aesthetic**: Brutalist-modern — thick 3px borders, colored offset shadows, bold type
- **Gradients**: `gradient-hero`, `gradient-brand`, `gradient-glow`, `gradient-brand-text` (defined in globals.css)
- **Cards**: `.brutalist-card` class — 3px border, offset box-shadow, hover/active states
- **Responsive breakpoints**: `min-[400px]` → `sm` (640) → `md` (768) → `lg` (1024) → `xl` (1280) → `2xl` (1536)

## Rules for AI Assistants

### Always Do

- Use `cn()` from `@/lib/utils` for conditional class merging
- Use the `@/` path alias for all imports (maps to `src/`)
- Use CSS variables or Tailwind theme classes for colors — never hardcode hex values
- Test both light and dark themes when modifying any UI
- Check mobile responsiveness at all breakpoints (especially min-[400px])
- Follow existing naming: PascalCase components, camelCase hooks/utils/stores
- Put shared components in `src/components/shared/`, feature-specific in `src/components/<feature>/`
- Use existing types from `src/types/index.ts` — extend them, don't duplicate
- Follow the Zustand pattern: devtools + persist middleware where data needs persistence
- Add new routes to `src/constants/index.ts`

### Never Do

- Add packages without discussing with the user first
- Use hardcoded colors or inline styles
- Use `React.FC` — use plain function components with typed props
- Use `any` type unless absolutely unavoidable
- Leave `console.log` in committed code
- Create components over 200 lines — split them
- Create new Zustand stores without checking if an existing one covers the need
- Import from `react-icons` directly — use sub-packages (e.g., `react-icons/fi`)
- Skip responsive design on any component
- Modify `globals.css` theme variables without understanding both theme modes

### API Integration

- All API calls go through `src/lib/api/client.ts`
- Base URL: `NEXT_PUBLIC_API_BASE_URL` env var (default: `http://localhost:3001/api`)
- Auth token stored in localStorage, auto-injected via request interceptor
- 401 responses auto-redirect to `/login`
- Timeout: 30 seconds

### State Management Pattern

```typescript
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface ExampleState {
  data: DataType | null;
  setData: (data: DataType) => void;
}

export const useExampleStore = create<ExampleState>()(
  devtools(
    persist(
      (set) => ({
        data: null,
        setData: (data) => set({ data }),
      }),
      { name: 'example-storage' }
    )
  )
);
```

### Component Pattern

```typescript
'use client';

import { cn } from '@/lib/utils';

interface ComponentNameProps {
  className?: string;
}

export default function ComponentName({ className }: ComponentNameProps) {
  return (
    <div className={cn('base-classes', className)}>
      {/* content */}
    </div>
  );
}
```

## Current Status

**Completed**: Landing page (Hero, Features, HowItWorks, CTA, Navbar, Footer), theme system, CodeSpaces IDE prototype, type definitions, API client, Zustand stores (auth, skills, theme), utility functions, constants/routes.

**Next**: Authentication pages, Dashboard, Skill Tree visualization, Assessment system, AI chatbot integration.

## Environment Variables

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api   # Backend API
NEXT_PUBLIC_APP_URL=http://localhost:3000             # Frontend URL
```
