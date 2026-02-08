# SkillTree - Frontend

AI-Driven Skill Intelligence & Learning Platform - Frontend Application

## Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Code Editor**: Monaco Editor (coming soon)

## Project Structure

```
src/
├── app/                  # Next.js app router pages
├── components/           # React components
│   ├── landing/         # Landing page components
│   ├── shared/          # Shared/reusable components
│   ├── auth/            # Authentication components
│   ├── dashboard/       # Dashboard components
│   ├── skills/          # Skill-related components
│   ├── assessment/      # Assessment components
│   └── profile/         # Profile components
├── lib/                 # Library code
│   ├── api/            # API client and services
│   └── utils/          # Utility functions
├── store/              # Zustand stores
├── types/              # TypeScript type definitions
├── hooks/              # Custom React hooks
└── constants/          # App constants

```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn or pnpm

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Environment Variables

See `.env.example` for required environment variables.

## Features

### Implemented
- ✅ Landing page with Hero, Features, How It Works, CTA sections
- ✅ Responsive navigation
- ✅ Basic project structure
- ✅ Type definitions
- ✅ API client setup
- ✅ State management setup (Zustand)

### Coming Soon
- 🔄 Authentication (Login/Signup)
- 🔄 Dashboard
- 🔄 Skill Tree visualization
- 🔄 Assessment system
- 🔄 Code editor integration
- 🔄 AI chat assistant
- 🔄 Profile management

## Development Guidelines

### Component Structure
- Use functional components with TypeScript
- Keep components small and focused
- Use proper prop typing
- Extract reusable logic into custom hooks

### Styling
- Use Tailwind CSS utility classes
- Follow mobile-first approach
- Maintain consistent spacing and colors
- Use the `cn()` utility for conditional classes

### State Management
- Use Zustand for global state
- Keep local state in components when possible
- Use proper TypeScript typing for stores

### API Integration
- Use the `apiClient` from `lib/api/client.ts`
- Handle loading and error states
- Type API responses properly

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

Proprietary - All rights reserved

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
