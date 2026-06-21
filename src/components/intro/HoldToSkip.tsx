'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

const HOLD_MS = 950;

interface HoldToSkipProps {
  onSkip: () => void;
  reduced: boolean;
}

/**
 * Game-style "hold to skip": press and hold Space (or press-and-hold the button)
 * and a ring fills; release before it completes and it resets. Lives bottom-right.
 */
export function HoldToSkip({ onSkip, reduced }: HoldToSkipProps) {
  const [holding, setHolding] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const active = useRef(false);

  const start = useCallback(() => {
    if (active.current) return;
    active.current = true;
    setHolding(true);
    timer.current = setTimeout(
      () => {
        active.current = false;
        onSkip();
      },
      reduced ? 1 : HOLD_MS,
    );
  }, [onSkip, reduced]);

  const cancel = useCallback(() => {
    active.current = false;
    setHolding(false);
    if (timer.current) clearTimeout(timer.current);
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat) {
        e.preventDefault();
        start();
      }
    };
    const up = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        cancel();
      }
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
      if (timer.current) clearTimeout(timer.current);
    };
  }, [start, cancel]);

  return (
    <div
      className="absolute bottom-0 right-0 z-30 p-5"
      style={{ paddingBottom: 'max(1.25rem, env(safe-area-inset-bottom))' }}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        onPointerDown={start}
        onPointerUp={cancel}
        onPointerLeave={cancel}
        onPointerCancel={cancel}
        aria-label="Hold to skip the intro"
        className="group flex items-center gap-2.5 outline-none"
      >
        <span className="text-[10px] uppercase tracking-[0.28em] text-white/40 transition-colors group-hover:text-white/75">
          hold
          <span className="mx-1.5 rounded border border-white/25 px-1.5 py-0.5 text-[9px] tracking-[0.15em] text-white/55">
            space
          </span>
          to skip
        </span>
        <span className="relative grid h-8 w-8 place-items-center">
          <svg viewBox="0 0 36 36" className="h-8 w-8 -rotate-90">
            <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="2.5" />
            <circle
              cx="18"
              cy="18"
              r="15"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="2.5"
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray={1}
              style={{
                strokeDashoffset: holding ? 0 : 1,
                transition: `stroke-dashoffset ${holding ? HOLD_MS : 200}ms linear`,
              }}
            />
          </svg>
          <span
            className="absolute h-1.5 w-1.5 rounded-full transition-colors"
            style={{ background: holding ? 'var(--accent)' : 'rgba(255,255,255,0.45)' }}
          />
        </span>
      </button>
    </div>
  );
}
