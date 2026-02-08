// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'teacher' | 'admin' | 'recruiter';
  avatar?: string;
  profile?: UserProfile;
}

export interface UserProfile {
  bio?: string;
  skills: string[];
  learningPreferences?: LearningPreferences;
  personalityAssessment?: PersonalityAssessment;
}

export interface LearningPreferences {
  learningStyle?: 'visual' | 'auditory' | 'kinesthetic' | 'reading';
  pacePreference?: 'fast' | 'moderate' | 'slow';
  studyTimePreference?: 'morning' | 'afternoon' | 'evening' | 'night';
}

export interface PersonalityAssessment {
  type?: string;
  traits: Record<string, number>;
}

// Skill Types
export interface Skill {
  id: string;
  name: string;
  description: string;
  category: string;
  prerequisites: string[];
  status: SkillStatus;
  proficiencyLevel: number;
  estimatedTime: string;
}

export type SkillStatus = 'locked' | 'unlocked' | 'in-progress' | 'completed' | 'reinforced';

export interface SkillNode extends Skill {
  children: string[];
  position: { x: number; y: number };
}

export interface SkillTree {
  id: string;
  name: string;
  description: string;
  nodes: SkillNode[];
  category: string;
}

// Assessment Types
export interface Assessment {
  id: string;
  type: 'coding' | 'reasoning' | 'quiz';
  title: string;
  description: string;
  skillId: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit?: number;
  points: number;
}

export interface AssessmentResult {
  id: string;
  assessmentId: string;
  userId: string;
  score: number;
  completedAt: Date;
  timeSpent: number;
  feedback?: string;
}

// Content Types
export interface LearningContent {
  id: string;
  title: string;
  type: 'note' | 'video' | 'article' | 'resource';
  url?: string;
  content?: string;
  skillId: string;
  rating: number;
  duration?: string;
}

// Gamification Types
export interface UserAttributes {
  depth: number;
  execution: number;
  consistency: number;
  collaboration: number;
  clarity: number;
}

export interface Quest {
  id: string;
  type: 'skill' | 'recall' | 'challenge';
  title: string;
  description: string;
  reward: number;
  deadline?: Date;
  status: 'active' | 'completed' | 'failed';
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
