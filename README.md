# North

**AI-Driven Skill Intelligence & Learning Platform**

North replaces random learning with structured skill mastery. Built for college students who want clarity, direction, and real skill development — from first semester to first job.

## What It Does

- **Skill Trees**: Structured learning paths modeled as directed acyclic graphs with prerequisites, parallel branches, and progress tracking
- **AI-Assisted Learning**: Personalized roadmaps, contextual chatbot, code hints, and learning guidance
- **Real Assessments**: Coding challenges, reasoning evaluations, and rapid-fire quizzes that prove actual skill
- **Gamification**: Five core attributes (depth, execution, consistency, collaboration, clarity) tied to objective signals, not vanity metrics
- **Dynamic Skill Profiles**: Auto-generated skill graphs and resumes that companies can verify
- **Communities**: College-based groups, topic discussions, peer collaboration, and reputation systems
- **CodeSpaces IDE**: Built-in multi-language code editor with live preview and assessment mode

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16+ (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS 4 |
| State | Zustand 5 |
| HTTP | Axios |
| Code Editor | Monaco Editor |
| Animations | Framer Motion |
| Icons | react-icons |

**Planned backend**: Node.js + NestJS, PostgreSQL, Redis, LLM APIs

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Setup

```bash
git clone <repo-url>
cd North
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check code formatting |

## Project Structure

```
North/
├── src/
│   ├── app/              # Pages and layouts (App Router)
│   ├── components/       # React components by feature
│   │   ├── shared/       # Navbar, Footer, Theme components
│   │   ├── landing/      # Landing page sections
│   │   └── codespaces/   # Code editor components
│   ├── store/            # Zustand state management
│   ├── lib/              # API client and utilities
│   ├── hooks/            # Custom React hooks
│   ├── types/            # TypeScript definitions
│   ├── constants/        # Routes, enums, config
│   ├── data/             # Static data (menus)
│   └── config/           # Theme and animation config
├── public/               # Static assets
├── CLAUDE.md             # AI assistant context and rules
├── AGENTS.md             # Multi-agent coordination
├── PROJECT-OVERVIEW.md   # Full feature spec and timeline
└── CONVENTIONS.md        # Coding standards
```

## Design

- **Theme**: Dark (default) and light mode with CSS variable system
- **Aesthetic**: Brutalist-modern — thick borders, offset shadows, bold typography
- **Fonts**: Roboto Condensed (body), Oswald (headings/logo)
- **Brand**: Blue (#08398C) + Purple (#9A6DE3) gradient system
- **Responsive**: Mobile-first with 6 breakpoints (400px to 1536px+)

## Contributing

1. Read `CLAUDE.md` for project context and rules
2. Read `CONVENTIONS.md` for coding standards
3. Read `AGENTS.md` for coordination guidelines
4. Work in feature-isolated branches
5. Test both themes and all breakpoints before submitting

## License

All rights reserved. 2026 North.
