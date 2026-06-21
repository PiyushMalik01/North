'use client';

import { cn } from '@/lib/utils';
import { Squircle } from '../ui/Squircle';

interface CardProps {
  className?: string;
  /** Override the squircle silhouette (default near-square squircle). */
  shape?: 'squircle' | 'stadium';
  radius?: number;
  hover?: boolean;
  /** Apply the default inner padding (default true). */
  padded?: boolean;
  children: React.ReactNode;
}

/**
 * Premium-minimal card shell: a frosted-glass squircle with depth + hover-lift.
 * Layout classes (e.g. col-span) go on `className`; padding is handled inside so
 * the glass reaches the squircle edges.
 */
export function Card({
  className,
  shape,
  radius,
  hover,
  padded = true,
  children,
}: CardProps) {
  return (
    <Squircle shape={shape} radius={radius} hover={hover} className={className}>
      <div className={cn('h-full', padded && 'p-5')}>{children}</div>
    </Squircle>
  );
}

/** Small uppercase label used at the top of each card. */
export function CardLabel({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <p
      className={cn(
        'text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]',
        className,
      )}
    >
      {children}
    </p>
  );
}
