'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useOnboardingStore } from '@/store/onboardingStore';
import { DILEMMAS } from '@/data/onboardingData';
import type { DilemmaSide } from '@/types';

interface TheChoicesStepProps {
  onNext: () => void;
}

export function TheChoicesStep({ onNext }: TheChoicesStepProps) {
  const { recordChoice } = useOnboardingStore();
  const [index, setIndex] = useState(0);
  const lock = useRef(false);
  const doneRef = useRef(false);

  const total = DILEMMAS.length;
  const dilemma = DILEMMAS[index];

  const pick = useCallback(
    (side: DilemmaSide) => {
      if (lock.current || index >= total) return;
      lock.current = true;
      recordChoice(DILEMMAS[index].id, side);
      setIndex((i) => i + 1);
      setTimeout(() => {
        lock.current = false;
      }, 280);
    },
    [index, total, recordChoice],
  );

  useEffect(() => {
    if (index >= total && !doneRef.current) {
      doneRef.current = true;
      const t = setTimeout(onNext, 350);
      return () => clearTimeout(t);
    }
  }, [index, total, onNext]);

  if (!dilemma) return null;

  return (
    <div className="relative w-full max-w-md mx-auto h-full flex flex-col overflow-hidden rounded-3xl bg-[#07090d] border border-[#1b2130]">
      {/* Top: progress + question */}
      <div className="absolute top-0 inset-x-0 z-20 px-6 pt-5 pb-7 text-center bg-gradient-to-b from-[#07090d] to-transparent">
        <div className="flex gap-1.5 justify-center mb-4">
          {DILEMMAS.map((_, i) => (
            <span
              key={i}
              className={cn('h-[3px] w-5 rounded-full', i < index ? 'bg-[var(--accent)]' : 'bg-[#2a3344]')}
            />
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.p
            key={dilemma.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="font-[family-name:var(--font-oswald)] text-xl md:text-2xl text-[#f4f7fb] leading-tight max-w-[18ch] mx-auto"
          >
            {dilemma.prompt}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Split */}
      <AnimatePresence mode="wait">
        <motion.div
          key={dilemma.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="flex-1 flex flex-col sm:flex-row"
        >
          <button
            type="button"
            onClick={() => pick('blue')}
            className={cn(
              'relative flex-1 flex flex-col justify-end p-6 text-left cursor-pointer',
              'transition-[filter] duration-200 hover:brightness-[1.15]',
            )}
            style={{ background: 'linear-gradient(155deg,#0a1830 0%,#143266 55%,#1f4d9e 100%)' }}
          >
            <span className="text-[11px] tracking-[0.22em] uppercase text-white/70 mb-2.5">left</span>
            <span className="text-base md:text-lg font-semibold text-white leading-snug max-w-[20ch]">
              {dilemma.blue}
            </span>
          </button>

          <button
            type="button"
            onClick={() => pick('red')}
            className={cn(
              'relative flex-1 flex flex-col justify-end p-6 text-left cursor-pointer',
              'transition-[filter] duration-200 hover:brightness-[1.15]',
            )}
            style={{ background: 'linear-gradient(155deg,#260a10 0%,#641521 55%,#a01d2b 100%)' }}
          >
            <span className="text-[11px] tracking-[0.22em] uppercase text-white/70 mb-2.5">right</span>
            <span className="text-base md:text-lg font-semibold text-white leading-snug max-w-[20ch]">
              {dilemma.red}
            </span>
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
