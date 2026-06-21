import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import {
  contentSeed,
  type Topic,
  type Course,
  type Material,
  type Roadmap,
} from '@/data/platform/content';

/** Short unique id with a readable prefix. */
function uid(prefix: string): string {
  const rand =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);
  return `${prefix}-${rand}`;
}

interface ContentState {
  topics: Topic[];
  courses: Course[];
  materials: Material[];
  roadmaps: Roadmap[];

  // topics
  addTopic: (data: Omit<Topic, 'id'>) => string;
  updateTopic: (id: string, patch: Partial<Omit<Topic, 'id'>>) => void;
  deleteTopic: (id: string) => void;

  // courses
  addCourse: (data: Omit<Course, 'id'>) => string;
  updateCourse: (id: string, patch: Partial<Omit<Course, 'id'>>) => void;
  deleteCourse: (id: string) => void;

  // materials
  addMaterial: (data: Omit<Material, 'id'>) => string;
  updateMaterial: (id: string, patch: Partial<Omit<Material, 'id'>>) => void;
  deleteMaterial: (id: string) => void;

  // roadmaps
  addRoadmap: (data: Omit<Roadmap, 'id'>) => string;
  updateRoadmap: (id: string, patch: Partial<Omit<Roadmap, 'id'>>) => void;
  deleteRoadmap: (id: string) => void;

  resetContent: () => void;
}

/**
 * The editable content library — the single source of truth wired both ways:
 * the admin CMS mutates it, the learner zones (trace, course pages) read it.
 * Persisted so admin edits survive reloads. Deleting cascades to keep integrity.
 */
export const useContentStore = create<ContentState>()(
  devtools(
    persist(
      (set) => ({
        topics: contentSeed.topics,
        courses: contentSeed.courses,
        materials: contentSeed.materials,
        roadmaps: contentSeed.roadmaps,

        addTopic: (data) => {
          const id = uid('t');
          set((s) => ({ topics: [...s.topics, { ...data, id }] }));
          return id;
        },
        updateTopic: (id, patch) =>
          set((s) => ({ topics: s.topics.map((t) => (t.id === id ? { ...t, ...patch } : t)) })),
        deleteTopic: (id) =>
          set((s) => {
            const courseIds = s.courses.filter((c) => c.topicId === id).map((c) => c.id);
            return {
              topics: s.topics.filter((t) => t.id !== id),
              courses: s.courses.filter((c) => c.topicId !== id),
              materials: s.materials.filter((m) => !courseIds.includes(m.courseId)),
            };
          }),

        addCourse: (data) => {
          const id = uid('c');
          set((s) => ({ courses: [...s.courses, { ...data, id }] }));
          return id;
        },
        updateCourse: (id, patch) =>
          set((s) => ({ courses: s.courses.map((c) => (c.id === id ? { ...c, ...patch } : c)) })),
        deleteCourse: (id) =>
          set((s) => ({
            courses: s.courses.filter((c) => c.id !== id),
            materials: s.materials.filter((m) => m.courseId !== id),
            roadmaps: s.roadmaps.map((r) => ({
              ...r,
              steps: r.steps.filter((step) => step.courseId !== id),
            })),
          })),

        addMaterial: (data) => {
          const id = uid('m');
          set((s) => ({ materials: [...s.materials, { ...data, id }] }));
          return id;
        },
        updateMaterial: (id, patch) =>
          set((s) => ({
            materials: s.materials.map((m) => (m.id === id ? { ...m, ...patch } : m)),
          })),
        deleteMaterial: (id) =>
          set((s) => ({ materials: s.materials.filter((m) => m.id !== id) })),

        addRoadmap: (data) => {
          const id = uid('r');
          set((s) => ({ roadmaps: [...s.roadmaps, { ...data, id }] }));
          return id;
        },
        updateRoadmap: (id, patch) =>
          set((s) => ({ roadmaps: s.roadmaps.map((r) => (r.id === id ? { ...r, ...patch } : r)) })),
        deleteRoadmap: (id) =>
          set((s) => ({ roadmaps: s.roadmaps.filter((r) => r.id !== id) })),

        resetContent: () =>
          set({
            topics: contentSeed.topics,
            courses: contentSeed.courses,
            materials: contentSeed.materials,
            roadmaps: contentSeed.roadmaps,
          }),
      }),
      { name: 'north-content', version: 1 },
    ),
    { name: 'content' },
  ),
);
