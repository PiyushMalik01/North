'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { FiZap, FiAward, FiCompass } from 'react-icons/fi';
import { cn } from '@/lib/utils';
import { useOnboardingStore } from '@/store/onboardingStore';
import { GOAL_OPTIONS } from '@/data/onboardingData';

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  rocket: FiZap,
  trophy: FiAward,
  compass: FiCompass,
};

interface GoalStepProps {
  onNext: () => void;
}

export function GoalStep({ onNext }: GoalStepProps) {
  const { data, updateData, computePlayerCard } = useOnboardingStore();

  function handleSelect(value: 'internship' | 'placements' | 'exploring') {
    updateData({ goal: value });
    computePlayerCard();
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-full px-6">
      <div className="w-full max-w-lg flex flex-col gap-8">
        {/* Heading */}
        <h2
          className={cn(
            'font-[family-name:var(--font-oswald)] text-2xl tracking-tight',
            'text-[var(--text-primary)]',
          )}
        >
          last thing &mdash; what&rsquo;s the move?
        </h2>

        {/* Goal cards -- vertical stack */}
        <div className="flex flex-col gap-3">
          {GOAL_OPTIONS.map((option) => {
            const Icon = ICON_MAP[option.icon];
            const isSelected = data.goal === option.value;

            return (
              <motion.button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  'w-full flex items-center gap-4 py-5 px-6 rounded-xl',
                  'border text-left cursor-pointer',
                  'transition-colors duration-200',
                  isSelected
                    ? 'border-[var(--accent)] bg-[var(--accent)]/5'
                    : 'border-[var(--border-color)] bg-transparent hover:border-[var(--border-hover)]',
                )}
              >
                {Icon && (
                  <Icon
                    size={22}
                    className={cn(
                      'shrink-0 transition-colors duration-200',
                      isSelected
                        ? 'text-[var(--accent-text)]'
                        : 'text-[var(--text-muted)]',
                    )}
                  />
                )}
                <div className="flex flex-col">
                  <span
                    className={cn(
                      'text-lg font-medium transition-colors duration-200',
                      isSelected
                        ? 'text-[var(--text-primary)]'
                        : 'text-[var(--text-secondary)]',
                    )}
                  >
                    {option.title}
                  </span>
                  <span className="text-sm text-[var(--text-muted)]">
                    {option.sub}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Reassurance */}
        <p className="text-xs text-[var(--text-muted)]">
          not locked in — your goals can evolve as you grow
        </p>

        {/* Continue -- text button that feels like a reveal prompt */}
        <AnimatePresence>
          {data.goal && (
            <motion.button
              type="button"
              onClick={onNext}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className={cn(
                'self-end text-sm font-medium cursor-pointer',
                'text-[var(--accent-text)] hover:text-[var(--accent-hover)]',
                'transition-colors duration-150',
              )}
            >
              see your profile &rarr;
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
