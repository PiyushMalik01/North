'use client';

import { useCallback } from 'react';
import {
  motion,
  useMotionValue,
  useTransform,
  type PanInfo,
  type Variants,
} from 'framer-motion';
import { cn } from '@/lib/utils';
import type { SwipeCard as SwipeCardType } from '@/types';

interface SwipeCardProps {
  card: SwipeCardType;
  onSwipe: (direction: 'left' | 'right') => void;
  isTop: boolean;
}

const SWIPE_THRESHOLD = 120;

const cardVariants: Variants = {
  stacked: { scale: 0.95, y: 8, opacity: 1 },
  active: { scale: 1, y: 0, opacity: 1 },
  exit: (direction: 'left' | 'right') => ({
    x: direction === 'right' ? 400 : -400,
    opacity: 0,
    rotate: direction === 'right' ? 20 : -20,
    transition: { duration: 0.35, ease: 'easeIn' },
  }),
};

export default function SwipeCard({ card, onSwipe, isTop }: SwipeCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-25, 0, 25]);
  const rejectOpacity = useTransform(x, [-200, -60, 0], [1, 0.5, 0]);
  const acceptOpacity = useTransform(x, [0, 60, 200], [0, 0.5, 1]);

  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (Math.abs(info.offset.x) > SWIPE_THRESHOLD) {
        onSwipe(info.offset.x > 0 ? 'right' : 'left');
      }
    },
    [onSwipe],
  );

  return (
    <motion.div
      className={cn(
        'absolute w-full max-w-[320px] aspect-[3/4]',
        'rounded-2xl border border-[var(--border-color)]',
        'bg-[var(--surface-2)] overflow-hidden',
        'flex flex-col items-center justify-center',
        'select-none touch-none',
        isTop ? 'cursor-grab active:cursor-grabbing z-10' : 'z-0',
      )}
      style={{ x, rotate }}
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={isTop ? handleDragEnd : undefined}
      variants={cardVariants}
      initial={isTop ? 'active' : 'stacked'}
      animate={isTop ? 'active' : 'stacked'}
      exit="exit"
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      whileTap={isTop ? { scale: 1.02 } : undefined}
    >
      {/* Reject tint (left drag) */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none bg-red-500/15"
        style={{ opacity: rejectOpacity }}
      />

      {/* Accept tint (right drag) */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none bg-emerald-500/15"
        style={{ opacity: acceptOpacity }}
      />

      {/* Top edge label: NAH (left) */}
      <motion.span
        className={cn(
          'absolute top-5 left-5 text-xs font-bold tracking-widest uppercase',
          'text-red-400 border border-red-400/40 rounded px-2 py-0.5',
          'pointer-events-none',
        )}
        style={{ opacity: rejectOpacity }}
      >
        nah
      </motion.span>

      {/* Top edge label: ME (right) */}
      <motion.span
        className={cn(
          'absolute top-5 right-5 text-xs font-bold tracking-widest uppercase',
          'text-emerald-400 border border-emerald-400/40 rounded px-2 py-0.5',
          'pointer-events-none',
        )}
        style={{ opacity: acceptOpacity }}
      >
        me
      </motion.span>

      {/* Statement text */}
      <p
        className={cn(
          'px-8 text-center text-lg font-medium leading-relaxed',
          'text-[var(--text-primary)]',
        )}
      >
        &ldquo;
        <span className="italic text-[var(--accent)]">{card.statement}</span>
        &rdquo;
      </p>

      {/* Bottom directional hints */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-between px-6">
        <motion.span
          className="text-[var(--text-muted)] text-lg pointer-events-none"
          style={{ opacity: rejectOpacity }}
        >
          &larr;
        </motion.span>
        <motion.span
          className="text-[var(--text-muted)] text-lg pointer-events-none"
          style={{ opacity: acceptOpacity }}
        >
          &rarr;
        </motion.span>
      </div>
    </motion.div>
  );
}
