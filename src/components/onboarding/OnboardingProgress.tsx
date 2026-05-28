'use client';

import { cn } from '@/lib/utils';

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
  onStepClick?: (step: number) => void;
}

export function OnboardingProgress({ currentStep, totalSteps, onStepClick }: OnboardingProgressProps) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: totalSteps }, (_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onStepClick?.(i)}
          className={cn(
            'rounded-full transition-all duration-500 ease-out cursor-pointer',
            'hover:opacity-80',
            i === currentStep
              ? 'w-6 h-1.5 bg-[var(--accent)]'
              : i < currentStep
                ? 'w-1.5 h-1.5 bg-[var(--text-secondary)]'
                : 'w-1.5 h-1.5 bg-[var(--border-color)]'
          )}
          aria-label={`Go to step ${i + 1}`}
        />
      ))}
    </div>
  );
}
