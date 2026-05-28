'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export type SubmitState =
  | { kind: 'idle' }
  | { kind: 'submitting' }
  | { kind: 'success'; xp: number; nextSkillSlug?: string }
  | { kind: 'failed'; reason: string };

interface ExerciseSubmitProps {
  state: SubmitState;
  disabled: boolean;
  disabledReason?: string;
  onSubmit: () => void;
  onContinue?: () => void;
}

export function ExerciseSubmit({
  state,
  disabled,
  disabledReason,
  onSubmit,
  onContinue,
}: ExerciseSubmitProps) {
  return (
    <div className="space-y-3">
      <AnimatePresence mode="wait" initial={false}>
        {state.kind === 'success' ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            className={cn(
              'rounded-xl p-5',
              'border border-[var(--skill-completed)]/40',
              'bg-[var(--skill-completed)]/5',
            )}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <Check size={16} strokeWidth={2.5} className="text-[var(--skill-completed)]" />
              <span className="text-sm font-semibold text-[var(--skill-completed)]">
                Submitted
              </span>
            </div>
            <p className="text-sm text-[var(--text-primary)] mb-3">
              Nice work. +{state.xp} XP added to your profile.
            </p>
            <button
              type="button"
              onClick={onContinue}
              className={cn(
                'inline-flex items-center gap-1.5',
                'text-sm font-medium text-[var(--accent-text)]',
                'hover:text-[var(--accent)] transition-colors',
              )}
            >
              Continue
              <ArrowRight size={14} strokeWidth={2.25} />
            </button>
          </motion.div>
        ) : state.kind === 'failed' ? (
          <motion.div
            key="failed"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            className="rounded-xl p-4 border border-[var(--border-color)] bg-[var(--surface-1)]"
          >
            <p className="text-sm text-[var(--text-primary)] mb-3">
              {state.reason}
            </p>
            <button
              type="button"
              onClick={onSubmit}
              className="text-xs font-medium text-[var(--accent-text)] hover:text-[var(--accent)] transition-colors"
            >
              Try again
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {state.kind !== 'success' && (
        <div className="flex items-center justify-between gap-3 flex-wrap">
          {disabled && disabledReason ? (
            <p className="text-[11px] text-[var(--text-muted)]">{disabledReason}</p>
          ) : (
            <span />
          )}
          <button
            type="button"
            onClick={onSubmit}
            disabled={disabled || state.kind === 'submitting'}
            className={cn(
              'group inline-flex items-center gap-2',
              'h-11 px-5 rounded-lg',
              'text-sm font-medium',
              'transition-colors duration-150',
              'active:translate-y-px',
              disabled || state.kind === 'submitting'
                ? 'bg-[var(--surface-3)] text-[var(--text-muted)] cursor-not-allowed'
                : 'bg-[var(--accent)] text-[var(--accent-fg)] hover:bg-[var(--accent-hover)]',
            )}
          >
            {state.kind === 'submitting' ? (
              <>
                <Loader2 size={14} strokeWidth={2.25} className="animate-spin" />
                Submitting…
              </>
            ) : (
              <>
                Submit
                <ArrowRight
                  size={15}
                  strokeWidth={2.25}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
