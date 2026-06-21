'use client';

import { cn } from '@/lib/utils';

interface PixelMeterProps {
  value: number; // 0-100
  segments?: number;
  className?: string;
  /** CSS color reference for filled segments (defaults to the accent). */
  color?: string;
}

/** Segmented pixel-block meter — the gamey stand-in for a progress bar. */
export function PixelMeter({
  value,
  segments = 12,
  className,
  color = 'var(--accent)',
}: PixelMeterProps) {
  const clamped = Math.max(0, Math.min(100, value));
  const filled = Math.round((clamped / 100) * segments);

  return (
    <div
      className={cn('flex gap-[3px]', className)}
      role="meter"
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {Array.from({ length: segments }).map((_, i) => {
        const on = i < filled;
        return (
          <span
            key={i}
            className="h-3 flex-1 rounded-[1px] transition-colors duration-300"
            style={{
              background: on ? color : 'var(--surface-3)',
              boxShadow: on ? `0 0 6px ${color}` : 'none',
              opacity: on ? 1 : 0.45,
            }}
          />
        );
      })}
    </div>
  );
}
