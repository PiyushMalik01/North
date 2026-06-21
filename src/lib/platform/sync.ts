import { toast } from 'sonner';
import type {
  Topic,
  Course,
  Material,
  Roadmap,
} from '@/data/platform/content';

// ─── Response shapes ──────────────────────────────────────────────────────────

export interface ContentResponse {
  topics: Topic[];
  courses: Course[];
  materials: Material[];
  roadmaps: Roadmap[];
}

export interface ProgressResponse {
  xp: number;
  completedMaterialIds: string[];
  completedCourseIds: string[];
}

interface ProgressMutateOk extends ProgressResponse {
  ok: true;
}

// ─── Content entity / op types ────────────────────────────────────────────────

type ContentEntity = 'topic' | 'course' | 'material' | 'roadmap';
type ContentOp = 'create' | 'update' | 'delete';

type ContentData =
  | Omit<Topic, 'id'>
  | Partial<Omit<Topic, 'id'>>
  | Omit<Course, 'id'>
  | Partial<Omit<Course, 'id'>>
  | Omit<Material, 'id'>
  | Partial<Omit<Material, 'id'>>
  | Omit<Roadmap, 'id'>
  | Partial<Omit<Roadmap, 'id'>>;

// ─── Progress mutate body ─────────────────────────────────────────────────────

export type ProgressMutateBody =
  | { op: 'toggleMaterial'; materialId: string; xp?: number }
  | { op: 'completeCourse'; courseId: string; xp: number }
  | { op: 'addXp'; amount: number };

// ─── Helpers ──────────────────────────────────────────────────────────────────

const BASE = '/api';

async function safeFetch<T>(
  url: string,
  init?: RequestInit,
): Promise<T | null> {
  try {
    const res = await fetch(url, init);
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

/** Fetch the full content library (public). */
export async function fetchContent(): Promise<ContentResponse> {
  const data = await safeFetch<ContentResponse>(`${BASE}/content`);
  return (
    data ?? {
      topics: [],
      courses: [],
      materials: [],
      roadmaps: [],
    }
  );
}

/**
 * Write a content mutation to the server (admin-only endpoint).
 * Fire-and-forget style — optimistic local update happens before this returns.
 * Returns true if the server accepted the change.
 */
export async function contentMutate(
  entity: ContentEntity,
  op: ContentOp,
  id?: string,
  data?: ContentData,
): Promise<boolean> {
  try {
    const res = await fetch(`${BASE}/content`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entity, op, id, data }),
    });
    if (!res.ok) {
      toast.error('Could not save — change not persisted.');
      return false;
    }
    return true;
  } catch {
    toast.error('Could not save — change not persisted.');
    return false;
  }
}

/** Fetch the authenticated user's progress (returns empty defaults if not logged in). */
export async function fetchProgress(): Promise<ProgressResponse> {
  const data = await safeFetch<ProgressResponse>(`${BASE}/progress`);
  return data ?? { xp: 0, completedMaterialIds: [], completedCourseIds: [] };
}

/**
 * Write a progress mutation to the server.
 * Fire-and-forget — optimistic local update already applied.
 */
export async function progressMutate(
  body: ProgressMutateBody,
): Promise<ProgressMutateOk | null> {
  try {
    const res = await fetch(`${BASE}/progress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      // 401 = anonymous user; their progress is local-only, so this is expected — stay silent.
      if (res.status !== 401) toast.error('Could not save — change not persisted.');
      return null;
    }
    return (await res.json()) as ProgressMutateOk;
  } catch {
    toast.error('Could not save — change not persisted.');
    return null;
  }
}
