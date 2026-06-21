'use client';

import { cn } from '@/lib/utils';

interface PanelProps {
  label?: string;
  className?: string;
  glow?: boolean;
  children: React.ReactNode;
}

/**
 * The game HUD frame — a bordered console panel with a corner label tag and
 * a brutalist offset shadow. Every tile on the home base wears this.
 */
export function Panel({ label, className, glow, children }: PanelProps) {
  return (
    <div
      className={cn(
        'relative border-2 backdrop-blur-sm',
        'bg-[var(--surface-1)]/70',
        glow ? 'border-[var(--accent)]/45' : 'border-[var(--border-color)]',
        className,
      )}
      style={{
        boxShadow: glow
          ? '5px 5px 0 0 var(--accent-muted)'
          : '5px 5px 0 0 rgba(0,0,0,0.35)',
      }}
    >
      {label && (
        <span
          className={cn(
            'absolute -top-[9px] left-3 px-1.5 text-[10px] uppercase tracking-[0.22em]',
            'bg-[var(--background)] font-[family-name:var(--font-oswald)]',
            glow ? 'text-[var(--accent-text)]' : 'text-[var(--text-muted)]',
          )}
        >
          {label}
        </span>
      )}
      {children}
    </div>
  );
}
