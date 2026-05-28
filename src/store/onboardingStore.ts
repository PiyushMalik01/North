import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { OnboardingData, LearningStyleSliders, PlayerCardData, UserAttributes, NorAnalysis } from '@/types';
import { SWIPE_CARDS, TRAIT_TO_PERSONALITY, PERSONALITY_TYPES } from '@/data/onboardingData';
import { SKILL_CATEGORIES } from '@/constants';

interface OnboardingState {
  currentStep: number;
  data: OnboardingData;
  playerCard: PlayerCardData | null;
  norAnalysis: NorAnalysis | null;
  completed: boolean;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateData: (partial: Partial<OnboardingData>) => void;
  updateLearningStyle: (partial: Partial<LearningStyleSliders>) => void;
  recordSwipe: (cardId: string, swipedRight: boolean) => void;
  setNorAnalysis: (analysis: NorAnalysis) => void;
  computePlayerCard: () => void;
  markCompleted: () => void;
  reset: () => void;
}

const TOTAL_STEPS = 9;

const initialData: OnboardingData = {
  name: '',
  college: '',
  year: '1st',
  interests: [],
  learningStyle: {
    theoryVsHandsOn: 50,
    soloVsCollab: 50,
    sprintVsMarathon: 50,
    guidedVsExplore: 50,
  },
  personalitySwipes: {},
  goal: '',
};

function computeTraits(swipes: Record<string, boolean>): UserAttributes {
  const traits: UserAttributes = { depth: 50, execution: 50, consistency: 50, collaboration: 50, clarity: 50 };
  const counts: Record<string, number> = { depth: 0, execution: 0, consistency: 0, collaboration: 0, clarity: 0 };

  for (const card of SWIPE_CARDS) {
    const swiped = swipes[card.id];
    if (swiped === undefined) continue;
    const delta = swiped ? card.weight * 20 : card.weight * -10;
    traits[card.trait] = Math.max(0, Math.min(100, traits[card.trait] + delta));
    counts[card.trait]++;
  }

  return traits;
}

function getDominantTrait(traits: UserAttributes): string {
  let max = -1;
  let dominant = 'execution';
  for (const [key, val] of Object.entries(traits)) {
    if (val > max) { max = val; dominant = key; }
  }
  return dominant;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      currentStep: 0,
      data: { ...initialData },
      playerCard: null,
      norAnalysis: null,
      completed: false,

      setStep: (step) => set({ currentStep: Math.max(0, Math.min(TOTAL_STEPS - 1, step)) }),
      nextStep: () => set((s) => ({ currentStep: Math.min(TOTAL_STEPS - 1, s.currentStep + 1) })),
      prevStep: () => set((s) => ({ currentStep: Math.max(0, s.currentStep - 1) })),

      updateData: (partial) => set((s) => ({ data: { ...s.data, ...partial } })),

      updateLearningStyle: (partial) => set((s) => ({
        data: { ...s.data, learningStyle: { ...s.data.learningStyle, ...partial } },
      })),

      recordSwipe: (cardId, swipedRight) => set((s) => ({
        data: { ...s.data, personalitySwipes: { ...s.data.personalitySwipes, [cardId]: swipedRight } },
      })),

      setNorAnalysis: (analysis) => set({ norAnalysis: analysis }),

      computePlayerCard: () => {
        const { data } = get();
        const traits = computeTraits(data.personalitySwipes);
        const dominant = getDominantTrait(traits);
        const typeKey = TRAIT_TO_PERSONALITY[dominant] || 'builder';
        const personalityInfo = PERSONALITY_TYPES[typeKey];

        const topInterests = data.interests
          .slice(0, 3)
          .map((i) => SKILL_CATEGORIES[Number(i)] || i);

        const radarData = [
          { axis: 'Depth', value: traits.depth },
          { axis: 'Execute', value: traits.execution },
          { axis: 'Consist.', value: traits.consistency },
          { axis: 'Collab', value: traits.collaboration },
          { axis: 'Clarity', value: traits.clarity },
        ];

        set({
          playerCard: {
            personalityType: personalityInfo.name,
            personalityDescription: personalityInfo.description,
            traits,
            topInterests,
            radarData,
          },
        });
      },

      markCompleted: () => set({ completed: true }),

      reset: () => set({ currentStep: 0, data: { ...initialData }, playerCard: null, norAnalysis: null, completed: false }),
    }),
    { name: 'onboarding-storage' }
  )
);
