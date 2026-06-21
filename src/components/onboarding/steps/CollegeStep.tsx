'use client';

import { useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useOnboardingStore } from '@/store/onboardingStore';
import { YEAR_OPTIONS } from '@/data/onboardingData';

interface CollegeStepProps {
  onNext: () => void;
}

export function CollegeStep({ onNext }: CollegeStepProps) {
  const { data, updateData } = useOnboardingStore();

  const canContinue = data.college.trim().length >= 2;

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && canContinue) onNext();
    },
    [canContinue, onNext],
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-full px-6">
      <div className="w-full max-w-md flex flex-col items-start gap-8">
        <h1
          className={cn(
            'font-[family-name:var(--font-oswald)] text-2xl leading-snug',
            'text-[var(--text-primary)]',
          )}
        >
          {data.name.trim() ? `nice to meet you, ${data.name.trim()}.` : 'nice to meet you.'}
          <br />
          where are you studying?
        </h1>

        {/* College — free text */}
        <input
          type="text"
          value={data.college}
          onChange={(e) => updateData({ college: e.target.value })}
          onKeyDown={handleKeyDown}
          placeholder="your college"
          autoComplete="off"
          autoFocus
          className={cn(
            'w-full bg-transparent text-xl text-[var(--text-primary)]',
            'border-b-2 border-[var(--border-color)] focus:border-[var(--accent)]',
            'outline-none pb-2 placeholder:text-[var(--text-muted)]',
            'transition-colors duration-200',
          )}
        />

        {/* Year picker */}
        <div className="w-full">
          <p className="text-[var(--text-secondary)] text-sm mb-3">and which year?</p>
          <div className="flex flex-wrap gap-2">
            {YEAR_OPTIONS.map((opt) => {
              const selected = data.year === opt.value;
              return (
                <motion.button
                  key={opt.value}
                  type="button"
                  onClick={() => updateData({ year: opt.value })}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    'px-4 py-1.5 rounded-full text-sm cursor-pointer',
                    'border transition-colors duration-150',
                    selected
                      ? 'bg-[var(--accent)] text-[var(--accent-fg)] border-[var(--accent)]'
                      : 'bg-transparent text-[var(--text-secondary)] border-[var(--border-color)] hover:border-[var(--border-hover)]',
                  )}
                >
                  {opt.label}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Continue */}
        <AnimatePresence>
          {canContinue && (
            <motion.button
              type="button"
              onClick={onNext}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={cn(
                'self-end w-12 h-12 rounded-full',
                'bg-[var(--accent)] text-[var(--accent-fg)]',
                'flex items-center justify-center text-xl cursor-pointer',
              )}
              aria-label="Continue"
            >
              &rarr;
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
