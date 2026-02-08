// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api';

// App Configuration
export const APP_NAME = 'North';
export const APP_DESCRIPTION = 'AI-Driven Skill Intelligence & Learning Platform';

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  SKILLS: '/skills',
  SKILL_TREE: '/skills/tree',
  ASSESSMENTS: '/assessments',
  PROFILE: '/profile',
  LEARNING: '/learning',
  COMMUNITY: '/community',
  CHALLENGES: '/challenges',
  MARKET_INSIGHTS: '/insights',
} as const;

// Skill Categories
export const SKILL_CATEGORIES = [
  'Web Development',
  'Mobile Development',
  'Data Science',
  'Machine Learning',
  'DevOps',
  'Cloud Computing',
  'Cybersecurity',
  'UI/UX Design',
  'Database',
  'Programming Languages',
] as const;

// Assessment Types
export const ASSESSMENT_TYPES = {
  CODING: 'coding',
  REASONING: 'reasoning',
  QUIZ: 'quiz',
} as const;

// Difficulty Levels
export const DIFFICULTY_LEVELS = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
} as const;

// User Roles
export const USER_ROLES = {
  STUDENT: 'student',
  TEACHER: 'teacher',
  ADMIN: 'admin',
  RECRUITER: 'recruiter',
} as const;

// Learning Time Frames
export const LEARNING_TIMEFRAMES = {
  ONE_MONTH: '1month',
  THREE_MONTHS: '3months',
  SIX_MONTHS: '6months',
} as const;

// Gamification Constants
export const ATTRIBUTE_TYPES = {
  DEPTH: 'depth',
  EXECUTION: 'execution',
  CONSISTENCY: 'consistency',
  COLLABORATION: 'collaboration',
  CLARITY: 'clarity',
} as const;

export const QUEST_TYPES = {
  SKILL: 'skill',
  RECALL: 'recall',
  CHALLENGE: 'challenge',
} as const;

// Status Constants
export const SKILL_STATUS = {
  LOCKED: 'locked',
  UNLOCKED: 'unlocked',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
  REINFORCED: 'reinforced',
} as const;

// Pagination
export const DEFAULT_PAGE_SIZE = 20;

// Toast Messages
export const TOAST_MESSAGES = {
  SUCCESS: {
    SKILL_COMPLETED: 'Congratulations! Skill completed successfully!',
    ASSESSMENT_PASSED: 'Great job! Assessment passed!',
    PROFILE_UPDATED: 'Profile updated successfully',
  },
  ERROR: {
    GENERIC: 'Something went wrong. Please try again.',
    NETWORK: 'Network error. Please check your connection.',
    AUTH_FAILED: 'Authentication failed. Please login again.',
  },
} as const;
