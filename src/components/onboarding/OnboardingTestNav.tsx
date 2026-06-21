'use client';

import { FiChevronLeft, FiChevronRight, FiRefreshCw } from 'react-icons/fi';
import { cn } from '@/lib/utils';

interface OnboardingTestNavProps {
  currentStep: number;
  totalSteps: number;
  onPrev: () => void;
  onNext: () => void;
  onRestart: () => void;
}

const btnClass = cn(
  'inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-medium',
  'bg-[var(--surface-2)] border border-[var(--border-color)]',
  'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)]',
  'transition-all duration-150 active:translate-y-px',
  'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-[var(--text-secondary)]',
);

/**
 * Temporary testing aid: an always-available Prev / Next / Restart bar that
 * bypasses each step's own gating so the full onboarding flow can be walked
 * through repeatedly. Remove before shipping onboarding to real users.
 */
export function OnboardingTestNav({
  currentStep,
  totalSteps,
  onPrev,
  onNext,
  onRestart,
}: OnboardingTestNavProps) {
  return (
    <div className="relative z-20 w-full border-t border-[var(--border-color)]/60 bg-[var(--background)]/80 backdrop-blur-sm">
      <div className="max-w-2xl mx-auto w-full flex items-center justify-between gap-3 px-6 py-2.5">
        <span className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
          Test nav
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPrev}
            disabled={currentStep === 0}
            className={btnClass}
            aria-label="Previous step"
          >
            <FiChevronLeft size={14} /> Prev
          </button>

          <span className="text-xs font-mono text-[var(--text-muted)] tabular-nums min-w-[3rem] text-center">
            {currentStep + 1} / {totalSteps}
          </span>

          <button
            type="button"
            onClick={onNext}
            disabled={currentStep === totalSteps - 1}
            className={btnClass}
            aria-label="Next step"
          >
            Next <FiChevronRight size={14} />
          </button>
        </div>

        <button
          type="button"
          onClick={onRestart}
          className={cn(btnClass, 'hover:text-[var(--accent-text)]')}
          aria-label="Restart onboarding"
        >
          <FiRefreshCw size={13} /> Restart
        </button>
      </div>
    </div>
  );
}
