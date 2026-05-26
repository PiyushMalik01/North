# PROJECT-OVERVIEW.md - North Platform

## Vision

North is a college-focused, AI-driven skill development and evaluation system that shifts learning from syllabus-driven to skill-driven. It combines structured learning (skill trees), real assessment, gamification, AI assistance, collaboration, and talent discovery into a single platform.

The system serves four user types:
- **Students** (primary): Learn skills, track progress, build verifiable profiles
- **Teachers**: Monitor students, mentor, broadcast, request research help
- **Colleges**: Host events, manage broadcasts, sponsor challenges
- **Recruiters/Companies**: Filter candidates by verified skills, track growth, access project evidence

---

## Complete Feature List

### Core Learning

| # | Feature | Description | Priority |
|---|---------|-------------|----------|
| 1 | **Authentication** | Email/password + Google SSO. Role-based access (student, teacher, admin, recruiter). | MVP |
| 2 | **Profile Creation** | Personal details, avatar/character creation, skill history (structured metadata with proficiency levels), learning preferences, optional personality assessment (5-12 questions). | MVP |
| 3 | **Skill Recommender & Roadmap** | Hybrid system (rule-based prerequisite graphs + ML ranking). Proposes skill-maps based on profile/assessment. Roadmaps at 1/3/6 month intervals. Users can override and select custom tracks. | MVP |
| 4 | **Skill Tree** | DAG-based skill structure. Node states: locked, unlocked, in-progress, completed, reinforced. Parallel learning paths with prerequisite mapping. Estimated time-to-complete per node. Progression tied to assessment pass and code quality. | MVP |
| 5 | **Learning Content** | Layered pipeline: curated content (human-reviewed) + AI-generated summaries/notes + suggested videos. Content provenance shown. User ratings. Per-skill content delivery. | MVP |
| 6 | **Assessments** | Three types: (a) Coding — code editor with test cases, (b) Reasoning — explain solution approach, (c) Rapid-fire quiz — timed concept questions. Not compulsory to proceed, but 70% pass marks skill-tree node as done. Performance-based points. | MVP |
| 7 | **CodeSpaces IDE** | Multi-language editor (JS, Python, Java, C++). Live preview for web/app. Visualization for AI/ML. No copy-paste from external sources during assessments. Allow paste from in-app docs panel. Undo/change history. Offline export. | MVP |
| 8 | **AI Chatbot** | Contextual assistant with student data, current activity, and code as context. Two modes: Assist (general help) and Assessment (hints only, no solutions). Short-term context (current file/node) + long-term profile context. User can clear context. | MVP |

### Gamification & Engagement

| # | Feature | Description | Priority |
|---|---------|-------------|----------|
| 9 | **Gamification System** | Five attributes: depth, execution, consistency, collaboration, clarity. Quests (skill, recall, challenge). Micro-wins and progress feedback. Character/avatar improves with progress. Traits tied to objective signals. | MVP |
| 10 | **Streak Feature** | Daily activity tracking (like GitHub/LeetCode). Monitors all user activities, development, and progress. Awards performance points. | Phase 2 |
| 11 | **Leaderboards** | Opt-in only. Two types: (a) College-level — ranks highest performers per college, visible in college communities, (b) Friendly — users add friends and track mutual progress. Multiple metrics (consistency, mastery, contribution). Privacy opt-out. | Phase 2 |
| 12 | **Reminders & Newsletter** | Tied to skill tree ("To unlock Node X by Fri, do 45 mins today"). Skill-specific newsletter with curated + AI-generated summaries. Latest tech trends, company demands, industry news. Subscribe per-skill. | Phase 2 |

### Community & Social

| # | Feature | Description | Priority |
|---|---------|-------------|----------|
| 13 | **Communities (Reddit-like)** | Subreddit-style communities by colleges and topics. Posts: text, images, links, polls. Rich text editor. Upvote/downvote. Nested comments. Awards system. Social points from positive interactions. | Phase 2 |
| 14 | **Chat System** | Privacy-preserving 1:1 and group messaging. Initiated from profiles or community interactions. Message history, read receipts, typing indicators. | Phase 2 |
| 15 | **Hub Creation** | Teams of custom size pursuing shared field of interest. Track each other's progress for mutual motivation. | Phase 3 |
| 16 | **Collaborative Activities** | Group projects, pair programming, team challenges. | Phase 3 |

### Academic & Planning

| # | Feature | Description | Priority |
|---|---------|-------------|----------|
| 17 | **Subject Selection** | Select college/industry subjects to pursue. Relevant content unlocked and delivered, similar to skill tree but for academic subjects. | Phase 2 |
| 18 | **Timetable Maker** | AI-generated dynamic timetable tied to skill tree. Non-idealistic, practical, comfortable, evolving. Auto-reschedule on missed tasks. | Phase 3 |
| 19 | **Student Life Planner** | Smart planning for remaining college life. Weekly, monthly, half-yearly, yearly checkpoints. Works regardless of starting point (year 1 or year 3). | Phase 3 |
| 20 | **PYQs (Previous Year Questions)** | Collection of previous year papers. Solve online (timed) or download PDF. Answers provided where available. AI generates practice questions from PYQ data. | Phase 3 |
| 21 | **Mock OA & Exams** | Mock online assessments per skill/subject. Company OA preparation. Exam-season mock exams following college patterns. | Phase 3 |
| 22 | **LMS Integration** | Colleges can add subject content. Students search by subject. Skill verification focus (not file hosting). LMS connectors for upload/expose assessments. | Phase 3 |

### Institutional & Career

| # | Feature | Description | Priority |
|---|---------|-------------|----------|
| 23 | **Teacher Features** | Faculty register via college or standalone. Interact with students, solve doubts, earn mentor points. Broadcast to students. Request research help. Mentor metrics on profiles. | Phase 2 |
| 24 | **College Broadcasts** | Campus news, deadlines, event announcements, placement info. Push + email + in-app delivery with scheduling and reminders. | Phase 2 |
| 25 | **Internal Events** | Platform-hosted hackathons, contests. Community owners host internal events (public/private). Prizes and points for participants/winners. | Phase 2 |
| 26 | **College-Sponsored Internships** | Colleges/companies post challenges (bug fixes, new features, app creation). Students submit individually or in teams. Voting + selection. Signed proof-of-work badges and timestamped artifacts. | Phase 3 |
| 27 | **Market Analysis** | Skill-to-job-mapping dashboards. Top company tech stacks. Latest skills and technologies. Employer-demand signals per region/college. Updated via curated sources. | Phase 3 |
| 28 | **Company Student Evaluation** | Detailed student report with skills, progress, and field-specific data. Companies filter candidates by skill profiles for targeted recruitment. | Phase 3 |
| 29 | **Resume Builder** | Auto-generated from skill graph. Role-based templates. Editable export. Integrates assessment results and project evidence. | Phase 3 |
| 30 | **Theme Toggle** | Dark (default) and light mode. Customizable beyond the two defaults. | Done |

---

## Architecture

### System Layers

```
┌─────────────────────────────────────────────────┐
│                  Frontend Layer                   │
│         Next.js 16+ / React 19 / TypeScript       │
├─────────────────────────────────────────────────┤
│                Backend API Layer                   │
│              Node.js / NestJS (TS)                 │
├─────────────────────────────────────────────────┤
│              Intelligence Layer                    │
│     LLM APIs / Python ML services                  │
├─────────────────────────────────────────────────┤
│                  Data Layer                        │
│      PostgreSQL / Redis / Cloudinary/S3            │
├─────────────────────────────────────────────────┤
│               Infrastructure                       │
│         Docker / AWS or GCP / Vercel               │
└─────────────────────────────────────────────────┘
```

### Frontend Architecture

- **Routing**: Next.js App Router (file-system based)
- **Rendering**: Server Components by default, Client Components where interactivity needed
- **State**: Zustand stores with persist middleware for client-side state
- **Styling**: Tailwind CSS 4 + CSS variables for theming
- **API**: Centralized Axios client with interceptors

### Data Model (Core Entities)

- **User**: id, email, name, role, avatar, profile (bio, skills, learningPreferences, personalityAssessment)
- **Skill**: id, name, category, prerequisites, status, proficiencyLevel, estimatedTime
- **SkillTree**: id, name, nodes (DAG structure with positions and children)
- **Assessment**: id, type (coding/reasoning/quiz), skillId, difficulty, timeLimit, points
- **LearningContent**: id, title, type (note/video/article), skillId, rating, duration
- **UserAttributes**: depth, execution, consistency, collaboration, clarity
- **Quest**: id, type (skill/recall/challenge), reward, deadline, status

---

## Development Timeline

### MVP (Months 1-3)

Focus: Core loop — sign up, pick a skill, learn, get assessed, see progress.

| Week | Deliverable |
|------|-------------|
| 1-2 | Auth (email/password + Google SSO), protected routes, role-based access |
| 3-4 | Profile creation (personal details, skill history, learning preferences) |
| 5-6 | Skill tree system (DAG visualization, node states, prerequisite logic) |
| 7-8 | Learning content viewer (notes, videos, curated resources per skill node) |
| 9-10 | Assessment system (coding editor, reasoning input, rapid-fire quiz) |
| 11-12 | AI chatbot integration (assist + assessment modes, contextual awareness) |
| 13 | Gamification core (attributes, basic quests, progress feedback) |
| 14 | Dashboard (skill overview, progress tracking, recommendations) |

### Phase 2 (Months 4-6)

Focus: Engagement and community.

- Streak feature and leaderboards
- Community system (posts, comments, voting, awards)
- Chat system (1:1 and group)
- Teacher module (mentoring, broadcasts)
- College broadcasts
- Internal events (hackathons, contests)
- Reminders and newsletters
- Subject selection and content

### Phase 3 (Months 7-9)

Focus: Career readiness and institutional features.

- Timetable maker and student life planner
- PYQs and mock OA/exams
- College-sponsored internships/challenges
- Market analysis dashboards
- Company evaluation dashboard
- Resume builder
- Hub creation and collaborative activities
- LMS integration

### Future Scope

- Adaptive AI models for personalized difficulty
- Full internship marketplace
- Global collaboration network
- Skill passport (portable, verifiable credentials)
- Decentralized credentials

---

## Non-Functional Requirements

| Category | Requirement |
|----------|-------------|
| Performance | UI load < 2 seconds, optimized code execution latency |
| Scalability | Modular architecture, microservice-ready backend, horizontal scaling |
| Security | Secure auth, role-based authorization, data encryption, safe AI controls |
| Reliability | High uptime, fault-tolerant services, backup mechanisms |
| Responsiveness | Mobile-first, works on low-end laptops, tablets, phones |
| Maintainability | Modular codebase, documentation, CI/CD support |

## Success Metrics

- Student engagement (DAU/MAU ratio)
- Skill completion rate
- Assessment accuracy and progression speed
- Recruiter adoption and candidate filtering usage
- Placement success correlation with platform skill profiles

---

## Current Status (as of May 2026)

**Completed:**
- Landing page (Hero, Features, HowItWorks, CTA, responsive Navbar, Footer)
- Full dark/light theme system with CSS variables and smooth transitions
- CodeSpaces IDE prototype (split-panel, language selector, problem panel)
- TypeScript type definitions for all core entities
- Zustand stores (auth, skill, theme)
- API client with interceptors
- Utility functions and custom hooks
- Constants, routes, and menu data

**Next immediate priority:** Authentication pages and backend API setup.
