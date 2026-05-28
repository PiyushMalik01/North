'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useOnboardingStore } from '@/store/onboardingStore';
import { SWIPE_CARDS } from '@/data/onboardingData';
import SwipeCard from '@/components/onboarding/steps/SwipeCard';

interface VibeCheckStepProps {
  onNext: () => void;
}

export function VibeCheckStep({ onNext }: VibeCheckStepProps) {
  const { recordSwipe } = useOnboardingStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [exitDirection, setExitDirection] = useState<'left' | 'right'>('right');
  const swiping = useRef(false);
  const doneRef = useRef(false);

  const total = SWIPE_CARDS.length;
  const remaining = SWIPE_CARDS.slice(currentIndex);

  const handleSwipe = useCallback(
    (direction: 'left' | 'right') => {
      if (swiping.current) return;
      swiping.current = true;

      const card = SWIPE_CARDS[currentIndex];
      if (!card) return;

      setExitDirection(direction);
      recordSwipe(card.id, direction === 'right');
      setCurrentIndex((prev) => prev + 1);

      // Allow next swipe after exit animation settles
      setTimeout(() => {
        swiping.current = false;
      }, 250);
    },
    [currentIndex, recordSwipe],
  );

  // Keyboard support: arrow keys
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handleSwipe('left');
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleSwipe('right');
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleSwipe]);

  // Auto-advance when all cards are swiped
  useEffect(() => {
    if (currentIndex >= total && !doneRef.current) {
      doneRef.current = true;
      const timer = setTimeout(onNext, 500);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, total, onNext]);

  return (
    <div className="flex flex-col items-center justify-center min-h-full px-4">
      <div className="w-full max-w-md flex flex-col items-center gap-6">
        {/* Header row */}
        <div className="w-full flex items-end justify-between">
          <div>
            <h2
              className={cn(
                'font-[family-name:var(--font-oswald)] text-2xl tracking-tight',
                'text-[var(--text-primary)]',
              )}
            >
              quick vibe check
            </h2>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              swipe right if that&apos;s you, left if nah
            </p>
          </div>

          {/* Counter */}
          <span
            className={cn(
              'text-sm font-mono tabular-nums',
              'text-[var(--text-muted)]',
            )}
          >
            {Math.min(currentIndex + 1, total)} of {total}
          </span>
        </div>

        {/* Card stack area */}
        <div className="relative w-full max-w-[320px] aspect-[3/4] flex items-center justify-center">
          <AnimatePresence custom={exitDirection} mode="popLayout">
            {remaining.slice(0, 2).reverse().map((card, reverseIdx) => {
              const isTop = reverseIdx === remaining.slice(0, 2).length - 1;
              return (
                <SwipeCard
                  key={card.id}
                  card={card}
                  onSwipe={handleSwipe}
                  isTop={isTop}
                />
              );
            })}
          </AnimatePresence>

          {/* Empty state */}
          {remaining.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center text-[var(--text-muted)] text-sm"
            >
              locked in.
            </motion.div>
          )}
        </div>

        {/* Button hints for non-touch users */}
        {remaining.length > 0 && (
          <div className="flex items-center gap-8">
            <button
              type="button"
              onClick={() => handleSwipe('left')}
              className={cn(
                'flex items-center gap-1.5 text-xs',
                'text-[var(--text-muted)] hover:text-red-400',
                'transition-colors duration-150 cursor-pointer',
              )}
              aria-label="Swipe left, nah"
            >
              <span className="text-base">&larr;</span>
              nah
            </button>

            <button
              type="button"
              onClick={() => handleSwipe('right')}
              className={cn(
                'flex items-center gap-1.5 text-xs',
                'text-[var(--text-muted)] hover:text-emerald-400',
                'transition-colors duration-150 cursor-pointer',
              )}
              aria-label="Swipe right, me"
            >
              me
              <span className="text-base">&rarr;</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
