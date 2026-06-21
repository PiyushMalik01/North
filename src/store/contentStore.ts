import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  contentSeed,
  type Topic,
  type Course,
  type Material,
  type Roadmap,
} from '@/data/platform/content';
import { fetchContent, contentMutate } from '@/lib/platform/sync';

/** Short unique id with a readable prefix. */
function uid(prefix: string): string {
  const rand =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);
  return `${prefix}-${rand}`;
}

// Module-level guard — prevents concurrent or repeated hydration calls.
let hydrating = false;

interface ContentState {
  topics: Topic[];
  courses: Course[];
  materials: Material[];
  roadmaps: Roadmap[];
  hydrated: boolean;

  /** Fetch content from the server once; subsequent calls are no-ops. */
  hydrate: () => Promise<void>;

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
 * The DB is now the source of truth; the seed provides the initial paint before
 * hydration completes. Deleting cascades to keep integrity.
 */
export const useContentStore = create<ContentState>()(
  devtools(
    (set, get) => ({
      topics: contentSeed.topics,
      courses: contentSeed.courses,
      materials: contentSeed.materials,
      roadmaps: contentSeed.roadmaps,
      hydrated: false,

      hydrate: async () => {
        if (hydrating || get().hydrated) return;
        hydrating = true;
        const content = await fetchContent();
        set({
          topics: content.topics,
          courses: content.courses,
          materials: content.materials,
          roadmaps: content.roadmaps,
          hydrated: true,
        });
      },

      addTopic: (data) => {
        const id = uid('t');
        set((s) => ({ topics: [...s.topics, { ...data, id }] }));
        void contentMutate('topic', 'create', id, data);
        return id;
      },
      updateTopic: (id, patch) => {
        set((s) => ({ topics: s.topics.map((t) => (t.id === id ? { ...t, ...patch } : t)) }));
        void contentMutate('topic', 'update', id, patch);
      },
      deleteTopic: (id) => {
        set((s) => {
          const courseIds = s.courses.filter((c) => c.topicId === id).map((c) => c.id);
          return {
            topics: s.topics.filter((t) => t.id !== id),
            courses: s.courses.filter((c) => c.topicId !== id),
            materials: s.materials.filter((m) => !courseIds.includes(m.courseId)),
          };
        });
        void contentMutate('topic', 'delete', id);
      },

      addCourse: (data) => {
        const id = uid('c');
        set((s) => ({ courses: [...s.courses, { ...data, id }] }));
        void contentMutate('course', 'create', id, data);
        return id;
      },
      updateCourse: (id, patch) => {
        set((s) => ({ courses: s.courses.map((c) => (c.id === id ? { ...c, ...patch } : c)) }));
        void contentMutate('course', 'update', id, patch);
      },
      deleteCourse: (id) => {
        set((s) => ({
          courses: s.courses.filter((c) => c.id !== id),
          materials: s.materials.filter((m) => m.courseId !== id),
          roadmaps: s.roadmaps.map((r) => ({
            ...r,
            steps: r.steps.filter((step) => step.courseId !== id),
          })),
        }));
        void contentMutate('course', 'delete', id);
      },

      addMaterial: (data) => {
        const id = uid('m');
        set((s) => ({ materials: [...s.materials, { ...data, id }] }));
        void contentMutate('material', 'create', id, data);
        return id;
      },
      updateMaterial: (id, patch) => {
        set((s) => ({
          materials: s.materials.map((m) => (m.id === id ? { ...m, ...patch } : m)),
        }));
        void contentMutate('material', 'update', id, patch);
      },
      deleteMaterial: (id) => {
        set((s) => ({ materials: s.materials.filter((m) => m.id !== id) }));
        void contentMutate('material', 'delete', id);
      },

      addRoadmap: (data) => {
        const id = uid('r');
        set((s) => ({ roadmaps: [...s.roadmaps, { ...data, id }] }));
        void contentMutate('roadmap', 'create', id, data);
        return id;
      },
      updateRoadmap: (id, patch) => {
        set((s) => ({ roadmaps: s.roadmaps.map((r) => (r.id === id ? { ...r, ...patch } : r)) }));
        void contentMutate('roadmap', 'update', id, patch);
      },
      deleteRoadmap: (id) => {
        set((s) => ({ roadmaps: s.roadmaps.filter((r) => r.id !== id) }));
        void contentMutate('roadmap', 'delete', id);
      },

      resetContent: () =>
        set({
          topics: contentSeed.topics,
          courses: contentSeed.courses,
          materials: contentSeed.materials,
          roadmaps: contentSeed.roadmaps,
        }),
    }),
    { name: 'content' },
  ),
);
