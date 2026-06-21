import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { OnboardingData, DilemmaSide, YearValue } from '@/types';

const TOTAL_STEPS = 5;

interface OnboardingState {
  currentStep: number;
  data: OnboardingData;
  completed: boolean;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateData: (partial: Partial<Pick<OnboardingData, 'name' | 'college' | 'year'>>) => void;
  recordLove: (cardId: string, liked: boolean) => void;
  recordChoice: (dilemmaId: string, side: DilemmaSide) => void;
  setNorAnswer: (key: keyof OnboardingData['norAnswers'], value: string) => void;
  markCompleted: () => void;
  reset: () => void;
}

const initialData: OnboardingData = {
  name: '',
  college: '',
  year: '1st' as YearValue,
  loves: [],
  choices: {},
  norAnswers: {},
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      currentStep: 0,
      data: { ...initialData },
      completed: false,

      setStep: (step) => set({ currentStep: Math.max(0, Math.min(TOTAL_STEPS - 1, step)) }),
      nextStep: () => set((s) => ({ currentStep: Math.min(TOTAL_STEPS - 1, s.currentStep + 1) })),
      prevStep: () => set((s) => ({ currentStep: Math.max(0, s.currentStep - 1) })),

      updateData: (partial) => set((s) => ({ data: { ...s.data, ...partial } })),

      recordLove: (cardId, liked) =>
        set((s) => {
          const loves = (s.data.loves ?? []).filter((id) => id !== cardId);
          if (liked) loves.push(cardId);
          return { data: { ...s.data, loves } };
        }),

      recordChoice: (dilemmaId, side) =>
        set((s) => ({ data: { ...s.data, choices: { ...s.data.choices, [dilemmaId]: side } } })),

      setNorAnswer: (key, value) =>
        set((s) => ({ data: { ...s.data, norAnswers: { ...s.data.norAnswers, [key]: value } } })),

      markCompleted: () => set({ completed: true }),

      reset: () => set({ currentStep: 0, data: { ...initialData }, completed: false }),
    }),
    {
      name: 'onboarding-storage',
      version: 2,
      // The data shape changed with the redesign; reset anyone on an older version
      // so stale localStorage can't crash the new flow.
      migrate: () => ({ currentStep: 0, data: { ...initialData }, completed: false }),
      partialize: (s) => ({ currentStep: s.currentStep, data: s.data, completed: s.completed }),
    },
  ),
);
