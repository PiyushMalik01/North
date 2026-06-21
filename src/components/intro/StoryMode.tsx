'use client';

import { useState, useEffect, useCallback, useRef, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { STORY } from '@/data/storyScript';
import { StoryScene } from './StoryScene';
import { HoldToSkip } from './HoldToSkip';

// Reduced-motion as an external store — hydration-safe (server reports false).
const MQ = '(prefers-reduced-motion: reduce)';
const subReduced = (cb: () => void) => {
  const m = window.matchMedia(MQ);
  m.addEventListener('change', cb);
  return () => m.removeEventListener('change', cb);
};
const getReduced = () => window.matchMedia(MQ).matches;
const getReducedServer = () => false;

export function StoryMode() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const reduced = useSyncExternalStore(subReduced, getReduced, getReducedServer);
  const hintTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showHint, setShowHint] = useState(true);

  const scene = STORY[index];
  const isLast = index === STORY.length - 1;

  // Preload every (tiny) scene up front for seamless cuts.
  useEffect(() => {
    STORY.forEach((s) => {
      const img = new Image();
      img.src = s.src;
    });
  }, []);

  const finish = useCallback(() => router.push('/onboarding'), [router]);
  const next = useCallback(() => {
    setIndex((i) => (i < STORY.length - 1 ? i + 1 : i));
  }, []);
  const back = useCallback(() => setIndex((i) => Math.max(0, i - 1)), []);

  // Auto-advance through non-final scenes.
  useEffect(() => {
    if (isLast) return;
    const t = setTimeout(next, scene.dwellMs);
    return () => clearTimeout(t);
  }, [index, isLast, scene.dwellMs, next]);

  // Hide the "tap to continue" hint after first interaction / a few seconds.
  useEffect(() => {
    hintTimer.current = setTimeout(() => setShowHint(false), 4200);
    return () => {
      if (hintTimer.current) clearTimeout(hintTimer.current);
    };
  }, []);

  // Keyboard controls. (Space is reserved for hold-to-skip — see HoldToSkip.)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Enter') {
        e.preventDefault();
        if (isLast) finish();
        else next();
      } else if (e.key === 'ArrowLeft') {
        back();
      } else if (e.key === 'Escape') {
        finish();
      }
      setShowHint(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isLast, next, back, finish]);

  const onStageClick = () => {
    setShowHint(false);
    if (!isLast) next();
  };

  return (
    <div
      className="fixed inset-0 z-50 h-[100dvh] w-full select-none overflow-hidden bg-black text-white"
      onClick={onStageClick}
    >
      {/* Scenes (crossfade) */}
      <AnimatePresence mode="sync">
        <motion.div
          key={scene.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0.001 : 1, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <StoryScene scene={scene} reduced={reduced} showCaption={!isLast} />
        </motion.div>
      </AnimatePresence>

      {/* Hold-to-skip (bottom-right, game style) */}
      {!isLast && <HoldToSkip onSkip={finish} reduced={reduced} />}

      {/* Back */}
      {index > 0 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            back();
          }}
          aria-label="Previous scene"
          className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full p-2 text-white/40 transition-colors hover:bg-white/10 hover:text-white"
        >
          <ChevronLeft size={26} />
        </button>
      )}

      {/* Final hand-off — composed closing lines + name + CTA (no overlap) */}
      {isLast && (
        <div className="absolute inset-x-0 bottom-[6vh] z-20 flex flex-col items-center gap-5 px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="max-w-2xl"
          >
            {scene.lines.map((line, i) => (
              <p
                key={i}
                className="text-balance text-lg leading-snug text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)] sm:text-2xl"
              >
                {line}
              </p>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.7 }}
            className="flex flex-col items-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="font-[family-name:var(--font-oswald)] text-xl text-white sm:text-2xl">
              i&rsquo;m <span className="text-[var(--accent)]">nor</span>. let&rsquo;s find your north.
            </p>
            <button
              type="button"
              onClick={finish}
              className={cn(
                'flex h-12 items-center justify-center gap-2 border-2 border-[var(--accent)] bg-[var(--accent)] px-9',
                'font-[family-name:var(--font-oswald)] text-sm font-bold uppercase tracking-[0.14em] text-[var(--accent-fg)]',
                'transition-all duration-150 hover:-translate-y-0.5 hover:bg-[var(--accent-hover)]',
              )}
            >
              begin <span aria-hidden="true">&#9656;</span>
            </button>
          </motion.div>
        </div>
      )}

      {/* First-time hint */}
      <AnimatePresence>
        {showHint && !isLast && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-x-0 bottom-[6vh] z-10 text-center text-[11px] uppercase tracking-[0.25em] text-white/45"
          >
            tap to continue
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
