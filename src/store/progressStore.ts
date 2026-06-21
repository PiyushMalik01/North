import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { seedCompletedNodeIds } from '@/data/platform/trace';

/** XP needed per level (flat curve keeps the math legible). */
export const XP_PER_LEVEL = 500;
export const levelFromXp = (xp: number) => Math.floor(xp / XP_PER_LEVEL) + 1;
export const xpIntoLevel = (xp: number) => Math.round(((xp % XP_PER_LEVEL) / XP_PER_LEVEL) * 100);

export type AttributeKey = 'depth' | 'execution' | 'consistency' | 'collaboration' | 'clarity';

interface ProgressState {
  xp: number;
  streakDays: number;
  completedNodeIds: string[];
  passedAssessmentIds: string[];
  claimedQuestIds: string[];
  questSteps: Record<string, boolean>; // key `${questId}:${stepId}`
  savedDriftIds: string[];
  earnedGleamIds: string[];
  attributes: Record<AttributeKey, number>;

  // actions
  addXp: (amount: number) => void;
  completeNode: (nodeId: string, xp?: number) => void;
  passAssessment: (assessmentId: string, nodeId: string | undefined, xp: number) => void;
  toggleQuestStep: (questId: string, stepId: string) => void;
  claimQuest: (questId: string, xp: number) => void;
  toggleSavedDrift: (id: string) => void;
  earnGleam: (id: string) => void;
  reset: () => void;
}

const initial = {
  xp: 2340,
  streakDays: 7,
  completedNodeIds: seedCompletedNodeIds,
  passedAssessmentIds: [] as string[],
  claimedQuestIds: [] as string[],
  questSteps: {} as Record<string, boolean>,
  savedDriftIds: [] as string[],
  earnedGleamIds: ['first-breach', 'streak-7'],
  attributes: {
    depth: 64,
    execution: 48,
    consistency: 80,
    collaboration: 32,
    clarity: 55,
  } as Record<AttributeKey, number>,
};

/**
 * The player's living progress — shared across trace, prove, spark, drift, halo.
 * Completing a prove unlocks a node, grants xp, and can light up gleams; everything
 * reads from here so the zones interconnect. Persisted to localStorage.
 */
export const useProgressStore = create<ProgressState>()(
  devtools(
    persist(
      (set) => ({
        ...initial,

        addXp: (amount) => set((s) => ({ xp: s.xp + amount })),

        completeNode: (nodeId, xp = 0) =>
          set((s) =>
            s.completedNodeIds.includes(nodeId)
              ? {}
              : { completedNodeIds: [...s.completedNodeIds, nodeId], xp: s.xp + xp },
          ),

        passAssessment: (assessmentId, nodeId, xp) =>
          set((s) => {
            const alreadyPassed = s.passedAssessmentIds.includes(assessmentId);
            const completedNodeIds =
              nodeId && !s.completedNodeIds.includes(nodeId)
                ? [...s.completedNodeIds, nodeId]
                : s.completedNodeIds;
            return {
              passedAssessmentIds: alreadyPassed
                ? s.passedAssessmentIds
                : [...s.passedAssessmentIds, assessmentId],
              completedNodeIds,
              xp: alreadyPassed ? s.xp : s.xp + xp,
            };
          }),

        toggleQuestStep: (questId, stepId) =>
          set((s) => {
            const key = `${questId}:${stepId}`;
            return { questSteps: { ...s.questSteps, [key]: !s.questSteps[key] } };
          }),

        claimQuest: (questId, xp) =>
          set((s) =>
            s.claimedQuestIds.includes(questId)
              ? {}
              : { claimedQuestIds: [...s.claimedQuestIds, questId], xp: s.xp + xp },
          ),

        toggleSavedDrift: (id) =>
          set((s) => ({
            savedDriftIds: s.savedDriftIds.includes(id)
              ? s.savedDriftIds.filter((x) => x !== id)
              : [...s.savedDriftIds, id],
          })),

        earnGleam: (id) =>
          set((s) =>
            s.earnedGleamIds.includes(id) ? {} : { earnedGleamIds: [...s.earnedGleamIds, id] },
          ),

        reset: () => set({ ...initial }),
      }),
      { name: 'north-progress' },
    ),
    { name: 'progress' },
  ),
);
