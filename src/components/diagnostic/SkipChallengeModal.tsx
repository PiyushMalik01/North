'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, X, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CurriculumSkill, SkipChallenge } from '@/data/curriculum';

interface SkipChallengeModalProps {
  skill: CurriculumSkill;
  open: boolean;
  onClose: () => void;
  onPass: (skillSlug: string) => void;
}

type Phase = 'questions' | 'result';

export function SkipChallengeModal({
  skill,
  open,
  onClose,
  onPass,
}: SkipChallengeModalProps) {
  const challenge = skill.skipChallenge;

  const [phase, setPhase] = useState<Phase>('questions');
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    if (open) {
      setPhase('questions');
      setCurrent(0);
      setAnswers({});
      setShowFeedback(false);
    }
  }, [open, skill.slug]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!challenge) return null;

  const question = challenge.questions[current];
  const userAnswer = answers[question?.id];
  const isLast = current === challenge.questions.length - 1;

  const correctCount = challenge.questions.reduce(
    (n, q) => (answers[q.id] === q.correctIndex ? n + 1 : n),
    0,
  );
  const passed = correctCount >= challenge.passingScore;

  const onPick = (idx: number) => {
    if (showFeedback) return;
    setAnswers((prev) => ({ ...prev, [question.id]: idx }));
    setShowFeedback(true);
  };

  const onNext = () => {
    if (isLast) {
      setPhase('result');
      return;
    }
    setCurrent((c) => c + 1);
    setShowFeedback(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`Skip challenge: ${skill.name}`}
            initial={{ opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              'fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2',
              'w-[min(560px,calc(100vw-2rem))]',
              'rounded-2xl bg-[var(--card)] border border-[var(--border-color)]',
              'shadow-[0_30px_80px_rgba(0,0,0,0.35)]',
              'overflow-hidden',
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-5">
              <div className="flex items-center gap-2">
                <span className="h-px w-6 bg-[var(--accent)] opacity-80" />
                <span className="text-[10px] font-semibold tracking-[0.16em] uppercase text-[var(--accent-text)]">
                  Skip check
                </span>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="p-1.5 -mr-1.5 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-2)] transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <h3 className="px-6 mt-2 text-lg font-semibold text-[var(--text-primary)] tracking-[-0.015em]">
              {skill.name}
            </h3>

            {/* Progress dots */}
            {phase === 'questions' && (
              <div className="flex items-center gap-1.5 px-6 mt-4">
                {challenge.questions.map((_, i) => (
                  <span
                    key={i}
                    className={cn(
                      'h-1 flex-1 rounded-full transition-colors duration-300',
                      i < current
                        ? 'bg-[var(--text-secondary)]'
                        : i === current
                        ? 'bg-[var(--accent)]'
                        : 'bg-[var(--surface-3)]',
                    )}
                  />
                ))}
              </div>
            )}

            {/* Body */}
            <div className="px-6 py-6">
              <AnimatePresence mode="wait">
                {phase === 'questions' ? (
                  <motion.div
                    key={`q-${current}`}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="text-[13px] text-[var(--text-muted)] tabular-nums">
                      Question {current + 1} of {challenge.questions.length}
                    </p>
                    <h4 className="mt-2 text-[15px] text-[var(--text-primary)] leading-relaxed">
                      {question.prompt}
                    </h4>
                    <ul className="mt-4 space-y-2">
                      {question.options.map((opt, idx) => {
                        const isPicked = userAnswer === idx;
                        const isCorrect = idx === question.correctIndex;
                        const showState = showFeedback && (isPicked || isCorrect);
                        return (
                          <li key={idx}>
                            <button
                              type="button"
                              onClick={() => onPick(idx)}
                              disabled={showFeedback}
                              className={cn(
                                'w-full text-left px-4 py-3 rounded-lg',
                                'border text-sm leading-snug',
                                'transition-colors duration-150',
                                !showFeedback &&
                                  'border-[var(--border-color)] hover:border-[var(--border-hover)] hover:bg-[var(--surface-1)]',
                                showFeedback && !showState && 'border-[var(--border-color)] opacity-50',
                                showState && isCorrect && 'border-[var(--skill-completed)]/50 bg-[var(--skill-completed)]/10 text-[var(--text-primary)]',
                                showState && isPicked && !isCorrect && 'border-[#E25A2C]/50 bg-[#E25A2C]/10 text-[var(--text-primary)]',
                              )}
                            >
                              {opt}
                            </button>
                          </li>
                        );
                      })}
                    </ul>

                    {showFeedback && (
                      <div className="mt-5 flex items-center justify-between gap-3">
                        <span
                          className={cn(
                            'text-xs font-medium',
                            userAnswer === question.correctIndex
                              ? 'text-[var(--skill-completed)]'
                              : 'text-[#E25A2C]',
                          )}
                        >
                          {userAnswer === question.correctIndex ? 'Correct' : 'Not quite'}
                        </span>
                        <button
                          type="button"
                          onClick={onNext}
                          className={cn(
                            'group inline-flex items-center gap-1.5',
                            'h-9 px-3.5 rounded-lg text-sm font-medium',
                            'bg-[var(--accent)] text-[var(--accent-fg)]',
                            'hover:bg-[var(--accent-hover)] transition-colors',
                          )}
                        >
                          {isLast ? 'See result' : 'Next'}
                          <ArrowRight size={14} strokeWidth={2.25} className="group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <ResultView
                    skill={skill}
                    challenge={challenge}
                    correctCount={correctCount}
                    passed={passed}
                    onPass={() => onPass(skill.slug)}
                    onClose={onClose}
                  />
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function ResultView({
  skill,
  challenge,
  correctCount,
  passed,
  onPass,
  onClose,
}: {
  skill: CurriculumSkill;
  challenge: SkipChallenge;
  correctCount: number;
  passed: boolean;
  onPass: () => void;
  onClose: () => void;
}) {
  return (
    <motion.div
      key="result"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className={cn(
          'mx-auto w-14 h-14 rounded-full flex items-center justify-center',
          passed
            ? 'bg-[var(--skill-completed)]/15 text-[var(--skill-completed)]'
            : 'bg-[var(--surface-2)] text-[var(--text-muted)]',
        )}
      >
        {passed ? <Check size={22} strokeWidth={2.5} /> : <X size={20} strokeWidth={2.25} />}
      </div>

      <h4 className="mt-5 text-center text-lg font-semibold text-[var(--text-primary)] tracking-[-0.015em]">
        {passed ? "You've got this one" : 'Not yet — that\'s fine'}
      </h4>
      <p className="mt-2 text-center text-sm text-[var(--text-secondary)] leading-relaxed">
        {correctCount} of {challenge.questions.length} correct.{' '}
        {passed
          ? `${skill.name} marked as known. You can still revisit it later.`
          : 'Take the lessons — it shouldn\'t take long with what you already know.'}
      </p>

      <div className="mt-6 flex items-center justify-center gap-3">
        {passed ? (
          <button
            type="button"
            onClick={onPass}
            className={cn(
              'inline-flex items-center gap-1.5',
              'h-10 px-4 rounded-lg text-sm font-medium',
              'bg-[var(--accent)] text-[var(--accent-fg)]',
              'hover:bg-[var(--accent-hover)] transition-colors',
            )}
          >
            Mark as known
          </button>
        ) : (
          <button
            type="button"
            onClick={onClose}
            className={cn(
              'inline-flex items-center gap-1.5',
              'h-10 px-4 rounded-lg text-sm font-medium',
              'bg-[var(--surface-2)] text-[var(--text-primary)]',
              'hover:bg-[var(--surface-3)] transition-colors',
            )}
          >
            Back to skills
          </button>
        )}
      </div>
    </motion.div>
  );
}
