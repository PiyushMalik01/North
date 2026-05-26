# GOALS.md — North Development Roadmap

> Focus: Functionality first. Make it work, then make it beautiful.
> Approach: Little by little. One milestone at a time.

---

## Current State (May 2026)

- [x] Landing page (Hero, Features, HowItWorks, CTA, Navbar, Footer)
- [x] Dark/light theme system
- [x] CodeSpaces IDE prototype (Monaco editor, problem panel)
- [x] TypeScript type definitions for all core entities
- [x] Zustand stores (auth, skill, theme) — client-side only, no backend
- [x] API client with interceptors (pointing at non-existent backend)
- [x] Utility functions, hooks, constants, routes
- [ ] Database — none
- [ ] Authentication — none
- [ ] Backend API — none
- [ ] Real data flow — none

---

## Milestone 0: Foundation (Week 1-2)
> Without this, nothing else works.

### 0.1 — Database Setup
- [ ] Choose database provider (Neon Postgres on Vercel Marketplace, Supabase, or local PostgreSQL)
- [ ] Set up database connection and environment variables
- [ ] Install ORM (Prisma or Drizzle ORM)
- [ ] Create initial schema: `User`, `Account`, `Session` tables
- [ ] Run first migration
- [ ] Seed script for development data

### 0.2 — Authentication
- [ ] Install and configure Auth.js (NextAuth v5) with App Router
- [ ] Email/password credentials provider
- [ ] Google OAuth provider
- [ ] Sign up page (`/signup`)
- [ ] Login page (`/login`)
- [ ] Protected route middleware
- [ ] Session management (JWT strategy)
- [ ] Connect auth store to real session data
- [ ] Logout functionality
- [ ] Update Navbar to show auth state (logged in / logged out)

### 0.3 — API Layer
- [ ] Set up Next.js API routes structure (`src/app/api/`)
- [ ] Auth API routes (handled by Auth.js)
- [ ] Response helpers (success/error formatting matching `ApiResponse<T>` type)
- [ ] Rate limiting middleware (basic)
- [ ] Error handling middleware

**Done when**: A user can sign up, log in, see their session, and log out. Protected pages redirect to login.

---

## Milestone 1: User Profile (Week 3)
> Users need identity before they can learn.

### 1.1 — Profile Schema & API
- [ ] Extend User model: bio, avatar URL, college, year, learning preferences
- [ ] `GET /api/profile` — fetch current user profile
- [ ] `PUT /api/profile` — update profile
- [ ] `GET /api/profile/[id]` — view another user's public profile
- [ ] Profile completion percentage calculation

### 1.2 — Profile Pages
- [ ] Profile setup page (`/profile/setup`) — shown after first login
- [ ] Profile view page (`/profile`)
- [ ] Profile edit page (`/profile/edit`)
- [ ] Avatar upload (Cloudinary or S3 — start with URL input if simpler)

**Done when**: Users have profiles with real data persisted in the database.

---

## Milestone 2: Skill Tree Data Model (Week 4-5)
> The core of what makes North different.

### 2.1 — Skill Schema
- [ ] `Skill` table: id, name, slug, category, description, estimated_time, difficulty
- [ ] `SkillPrerequisite` table: skill_id, prerequisite_id (DAG edges)
- [ ] `SkillCategory` table: id, name, slug, icon, description
- [ ] `UserSkill` table: user_id, skill_id, status (locked/unlocked/in_progress/completed), started_at, completed_at
- [ ] Seed data: one complete web development skill tree (15-25 nodes)

### 2.2 — Skill Tree API
- [ ] `GET /api/skills/tree/[category]` — fetch full skill tree for a category
- [ ] `GET /api/skills/[id]` — fetch single skill details
- [ ] `POST /api/skills/[id]/start` — mark skill as in-progress
- [ ] `POST /api/skills/[id]/complete` — mark skill as completed (after assessment)
- [ ] `GET /api/skills/user` — fetch user's skill progress
- [ ] Prerequisite validation (can't start a locked skill)

### 2.3 — Skill Tree Page
- [ ] Skill tree visualization page (`/skills`)
- [ ] Render DAG as interactive node graph (start simple: list/grid with connections)
- [ ] Node states visually distinct (locked=gray, unlocked=blue, in-progress=yellow, completed=green)
- [ ] Click node → skill detail panel
- [ ] Progress indicator (X of Y skills completed)

**Done when**: Users can view a skill tree, see their progress, and start/complete skills (even without assessments — manual for now).

---

## Milestone 3: Dashboard (Week 6)
> Users need a home after login.

### 3.1 — Dashboard Page
- [ ] Dashboard page (`/dashboard`) — the post-login landing
- [ ] Current skills in progress (with progress bars)
- [ ] Recommended next skills (based on prerequisites met)
- [ ] Recent activity feed
- [ ] Quick stats: skills completed, current streak (placeholder), time spent

### 3.2 — Dashboard API
- [ ] `GET /api/dashboard` — aggregated dashboard data
- [ ] Recommendations engine (simple: unlocked skills sorted by priority)

**Done when**: After login, users land on a dashboard showing their skill progress and next steps.

---

## Milestone 4: Assessments (Week 7-9)
> Skills mean nothing without proof.

### 4.1 — Assessment Schema
- [ ] `Assessment` table: id, skill_id, type (coding/reasoning/quiz), difficulty, time_limit, points
- [ ] `CodingChallenge` table: id, assessment_id, prompt, starter_code, language, test_cases (JSON)
- [ ] `QuizQuestion` table: id, assessment_id, question, options (JSON), correct_answer, explanation
- [ ] `UserAssessment` table: user_id, assessment_id, status, score, submitted_at, code_submitted
- [ ] Seed data: 2-3 assessments per skill in the web dev tree

### 4.2 — Assessment API
- [ ] `GET /api/assessments/[skillId]` — list assessments for a skill
- [ ] `GET /api/assessments/[id]` — fetch assessment details
- [ ] `POST /api/assessments/[id]/submit` — submit answer
- [ ] Grading logic: coding (run test cases), quiz (check answers), reasoning (store for review)
- [ ] Pass/fail determination (70% threshold)
- [ ] Auto-complete skill node on pass

### 4.3 — Assessment Pages
- [ ] Assessment list per skill (`/skills/[id]/assessments`)
- [ ] Coding assessment page with Monaco editor (connect existing CodeSpaces)
- [ ] Quiz assessment page (multiple choice, timed)
- [ ] Results page (score, pass/fail, correct answers)

### 4.4 — Code Execution (Simplified)
- [ ] Start with client-side JS execution only (Function constructor or iframe sandbox)
- [ ] Test case runner: compare output vs expected
- [ ] Later: server-side execution via sandboxed environment

**Done when**: Users can take coding and quiz assessments, get graded, and have skills auto-complete on pass.

---

## Milestone 5: Learning Content (Week 10-11)
> Content that teaches, not just tests.

### 5.1 — Content Schema
- [ ] `LearningContent` table: id, skill_id, type (note/video/article/external), title, body, url, order, rating
- [ ] `UserContentProgress` table: user_id, content_id, completed, completed_at

### 5.2 — Content API & Pages
- [ ] `GET /api/content/[skillId]` — fetch content for a skill
- [ ] Content viewer page within skill detail
- [ ] Markdown rendering for notes
- [ ] Video embed support
- [ ] External link cards
- [ ] Mark as read/completed tracking

**Done when**: Each skill node has learning material users can consume before taking assessments.

---

## Milestone 6: AI Chatbot (Week 12-13)
> The intelligent assistant that makes North unique.

### 6.1 — Chat Infrastructure
- [ ] Choose LLM provider (OpenAI / Anthropic / open-source)
- [ ] `ChatMessage` table: id, user_id, session_id, role, content, context, created_at
- [ ] Chat API route with streaming (`POST /api/chat`)
- [ ] System prompt with student context (current skill, progress, code)

### 6.2 — Chat UI
- [ ] Chat panel component (slide-out or sidebar)
- [ ] Message bubbles with markdown rendering
- [ ] Streaming response display
- [ ] Context indicator (which skill/assessment the AI knows about)
- [ ] Two modes: Assist (full help) and Assessment (hints only)

**Done when**: Users can chat with an AI that knows their current skill context and gives appropriate help.

---

## Milestone 7: Streaks & Basic Gamification (Week 14-15)
> Engagement mechanics that keep users coming back.

- [ ] `UserActivity` table: user_id, type, metadata, created_at
- [ ] Daily streak tracking (any meaningful activity counts)
- [ ] Streak display on dashboard and profile
- [ ] XP points for: completing content, passing assessments, daily login
- [ ] `UserStats` table: user_id, xp, streak_current, streak_longest, skills_completed
- [ ] Level system (XP thresholds)
- [ ] Basic achievement badges (first skill, first assessment, 7-day streak, etc.)

**Done when**: Users earn XP, maintain streaks, and see their level on the dashboard.

---

## Milestone 8: Community (Week 16-18)
> Learning is better together.

- [ ] `Community` table: id, name, slug, type (college/topic), description
- [ ] `Post` table: id, community_id, author_id, title, body, upvotes, created_at
- [ ] `Comment` table: id, post_id, author_id, body, parent_id (nested), upvotes
- [ ] Community listing page (`/communities`)
- [ ] Community detail page with post feed
- [ ] Create post (rich text editor)
- [ ] Upvote/downvote
- [ ] Nested comments
- [ ] User community membership

**Done when**: Users can join communities, post, comment, and vote.

---

## Milestone 9: Teacher & College Features (Week 19-21)

- [ ] Teacher registration and role
- [ ] Teacher dashboard (student progress view)
- [ ] Broadcast system (announcements to communities)
- [ ] College admin panel (basic)
- [ ] Event creation (hackathons, contests)

---

## Milestone 10: Career & Recruiter Features (Week 22-24)

- [ ] Public skill profile page (`/u/[username]`)
- [ ] Skill graph visualization on profile
- [ ] Resume auto-generation from skill data
- [ ] Recruiter search/filter API
- [ ] Company dashboard (basic)

---

## Decision Log

Track major technical decisions here so we remember why.

| Date | Decision | Reasoning |
|------|----------|-----------|
| 2026-05-15 | Start with Next.js API routes, not separate NestJS | Faster MVP. One codebase. Can extract later. |
| | | |

---

## Rules for This Roadmap

1. **Complete one milestone before starting the next.** No skipping ahead.
2. **Each checkbox is a work session.** Don't try to do everything in one day.
3. **Test each feature before moving on.** It must work, not just compile.
4. **Functionality over aesthetics.** Use basic UI that works. Polish comes after Milestone 8.
5. **Seed real data.** Every feature needs test data to verify it works.
6. **Commit after each completed sub-milestone** (0.1, 0.2, etc.).
7. **Update this file** as you complete items. Check the boxes.
