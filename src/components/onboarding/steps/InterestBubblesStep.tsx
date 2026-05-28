'use client';

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiGlobe,
  FiSmartphone,
  FiBarChart2,
  FiCpu,
  FiTerminal,
  FiCloud,
  FiShield,
  FiPenTool,
  FiDatabase,
  FiCode,
  FiArrowRight,
} from 'react-icons/fi';
import { cn } from '@/lib/utils';
import { useOnboardingStore } from '@/store/onboardingStore';
import { SKILL_CATEGORIES, SKILL_DESCRIPTIONS } from '@/constants';

const ICON_MAP: Record<string, React.ComponentType<{ size?: number }>> = {
  'Web Development': FiGlobe,
  'Mobile Development': FiSmartphone,
  'Data Science': FiBarChart2,
  'Machine Learning': FiCpu,
  'DevOps': FiTerminal,
  'Cloud Computing': FiCloud,
  'Cybersecurity': FiShield,
  'UI/UX Design': FiPenTool,
  'Database': FiDatabase,
  'Programming Languages': FiCode,
};

const MIN_PICKS = 2;
const MAX_PICKS = 5;

const DRIFT_PRESETS = [
  { x: 6, y: -7, r: 1.5, dur: 9.2 },
  { x: -5, y: 8, r: -2, dur: 11.4 },
  { x: 7, y: 5, r: 1, dur: 10.1 },
  { x: -8, y: -5, r: -1.5, dur: 13.3 },
  { x: 4, y: -8, r: 2, dur: 8.7 },
  { x: -6, y: 6, r: -1, dur: 12.6 },
  { x: 5, y: 7, r: 1.8, dur: 9.8 },
  { x: -4, y: -6, r: -2, dur: 14.1 },
  { x: 8, y: -4, r: 1.2, dur: 10.9 },
  { x: -7, y: 5, r: -1.8, dur: 11.7 },
];

interface InterestBubblesStepProps {
  onNext: () => void;
}

export function InterestBubblesStep({ onNext }: InterestBubblesStepProps) {
  const { data, updateData } = useOnboardingStore();
  const selected = data.interests;

  const offsets = useMemo(
    () => SKILL_CATEGORIES.map((_, i) => DRIFT_PRESETS[i % DRIFT_PRESETS.length]),
    [],
  );

  function toggle(index: number) {
    const key = String(index);
    if (selected.includes(key)) {
      updateData({ interests: selected.filter((k) => k !== key) });
    } else if (selected.length < MAX_PICKS) {
      updateData({ interests: [...selected, key] });
    }
  }

  const canContinue = selected.length >= MIN_PICKS;

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-xl mx-auto px-4">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2
          className="font-[family-name:var(--font-logo)] text-2xl md:text-3xl tracking-tight text-[var(--text-primary)]"
        >
          what sounds interesting?
        </h2>
        <p className="text-sm text-[var(--text-secondary)]">
          don&rsquo;t overthink it — tap what catches your eye
        </p>
        <p className="text-xs text-[var(--text-muted)]">
          pick {MIN_PICKS}-{MAX_PICKS}{' '}
          <span className="mx-1 text-[var(--text-muted)]">·</span>{' '}
          <span
            className={cn(
              'font-semibold tabular-nums',
              selected.length > 0 ? 'text-[var(--accent-text)]' : 'text-[var(--text-muted)]'
            )}
          >
            {selected.length}
          </span>{' '}
          selected
        </p>
      </div>

      {/* Bubble field */}
      <div className="flex flex-wrap justify-center gap-3 py-3 min-h-[260px] items-center">
        {SKILL_CATEGORIES.map((name, i) => {
          const Icon = ICON_MAP[name];
          const isSelected = selected.includes(String(i));
          const drift = offsets[i];
          const description = SKILL_DESCRIPTIONS[name];

          return (
            <motion.button
              key={name}
              type="button"
              onClick={() => toggle(i)}
              animate={{
                y: [0, drift.y, 0],
                x: [0, drift.x, 0],
                rotate: [0, drift.r, 0],
                scale: isSelected ? 1.08 : 1,
              }}
              transition={{
                y: { duration: drift.dur, repeat: Infinity, ease: 'easeInOut' },
                x: { duration: drift.dur * 1.15, repeat: Infinity, ease: 'easeInOut' },
                rotate: { duration: drift.dur * 1.3, repeat: Infinity, ease: 'easeInOut' },
                scale: { duration: 0.25, ease: 'easeOut' },
              }}
              whileTap={{ scale: 0.92 }}
              className={cn(
                'inline-flex flex-col items-center rounded-2xl border cursor-pointer select-none',
                'px-4 py-2.5 text-sm md:px-5 md:py-3',
                'transition-colors duration-200',
                isSelected
                  ? 'bg-[var(--accent)]/15 border-[var(--accent)] text-[var(--accent-text)]'
                  : 'bg-[var(--surface-2)] border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--border-hover)]',
              )}
            >
              <span className="flex items-center gap-2">
                {Icon && <Icon size={16} />}
                <span className="whitespace-nowrap font-medium">{name}</span>
              </span>
              {description && (
                <span className={cn(
                  'text-[10px] mt-0.5 leading-tight',
                  isSelected ? 'text-[var(--accent-text)]/70' : 'text-[var(--text-muted)]',
                )}>
                  {description}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Reassurance */}
      <p className="text-xs text-[var(--text-muted)] text-center max-w-xs">
        this just sets your starting point — you can explore new areas or switch anytime
      </p>

      {/* Continue button */}
      <AnimatePresence>
        {canContinue && (
          <motion.button
            type="button"
            onClick={onNext}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              'flex items-center justify-center gap-2 rounded-full',
              'px-6 py-3 text-sm font-semibold',
              'bg-[var(--accent)] text-[var(--accent-fg)]',
              'hover:bg-[var(--accent-hover)] transition-colors duration-150',
            )}
          >
            continue
            <FiArrowRight size={16} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
