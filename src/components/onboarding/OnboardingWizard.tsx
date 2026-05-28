'use client';

import { useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useOnboardingStore } from '@/store/onboardingStore';
import { OnboardingProgress } from './OnboardingProgress';
import { WelcomeStep } from './steps/WelcomeStep';
import { CollegeStep } from './steps/CollegeStep';
import { NorChatStep } from './steps/NorChatStep';
import { VibeCheckStep } from './steps/VibeCheckStep';
import { InterestBubblesStep } from './steps/InterestBubblesStep';
import { LearningStyleStep } from './steps/LearningStyleStep';
import { GoalStep } from './steps/GoalStep';
import { PlayerCardReveal } from './steps/PlayerCardReveal';
import { RoadmapReveal } from './steps/RoadmapReveal';
import { cn } from '@/lib/utils';
import { FiArrowLeft } from 'react-icons/fi';

const TOTAL_STEPS = 9;

const stepVariants = {
  enter: { opacity: 0, y: 24 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

export function OnboardingWizard() {
  const { currentStep, nextStep, prevStep, setStep } = useOnboardingStore();

  const handleNext = useCallback(() => nextStep(), [nextStep]);
  const handleBack = useCallback(() => prevStep(), [prevStep]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (currentStep === 3) return;
      if (e.key === 'ArrowLeft' && currentStep > 0) handleBack();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, handleBack]);

  const steps = [
    <WelcomeStep key="welcome" onNext={handleNext} />,
    <CollegeStep key="college" onNext={handleNext} />,
    <NorChatStep key="nor" onNext={handleNext} />,
    <VibeCheckStep key="vibe" onNext={handleNext} />,
    <InterestBubblesStep key="interests" onNext={handleNext} />,
    <LearningStyleStep key="learning" onNext={handleNext} />,
    <GoalStep key="goal" onNext={handleNext} />,
    <PlayerCardReveal key="player-card" onNext={handleNext} />,
    <RoadmapReveal key="roadmap" />,
  ];

  return (
    <div className="fixed inset-0 bg-[var(--background)] overflow-hidden flex flex-col">
      {/* Top bar */}
      <div className={cn(
        'relative z-20 flex items-center justify-between px-6 pt-5 pb-2',
        'max-w-2xl mx-auto w-full',
      )}>
        {currentStep > 0 ? (
          <button
            onClick={handleBack}
            className="p-2 -ml-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            aria-label="Go back"
          >
            <FiArrowLeft size={18} />
          </button>
        ) : (
          <div className="w-[34px]" />
        )}

        <OnboardingProgress
          currentStep={currentStep}
          totalSteps={TOTAL_STEPS}
          onStepClick={setStep}
        />

        <div className="w-[34px]" />
      </div>

      {/* Step content */}
      <div className="relative flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute inset-0 flex items-center justify-center px-6"
          >
            {steps[currentStep]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
