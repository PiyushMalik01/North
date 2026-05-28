'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PenLine, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EnglishBlockProps {
  prompt?: string;
  minWords?: number;
  value: string;
  onChange: (value: string) => void;
}

function countWords(s: string): number {
  return s.trim().split(/\s+/).filter(Boolean).length;
}

const DEFAULT_PROMPT =
  'Explain in your own words what you built and the choices you made. No copying, no AI-generated essays — write like you’re telling a friend.';

export function EnglishBlock({
  prompt = DEFAULT_PROMPT,
  minWords = 100,
  value,
  onChange,
}: EnglishBlockProps) {
  const wordCount = useMemo(() => countWords(value), [value]);
  const enough = wordCount >= minWords;
  const pct = Math.min(100, Math.round((wordCount / minWords) * 100));

  // Subtle indicator nudge when crossing the threshold
  const [justCrossed, setJustCrossed] = useState(false);
  useEffect(() => {
    if (!enough) return;
    setJustCrossed(true);
    const t = setTimeout(() => setJustCrossed(false), 900);
    return () => clearTimeout(t);
  }, [enough]);

  return (
    <section
      aria-label="Plain-English explanation"
      className={cn(
        'rounded-xl border bg-[var(--card)]',
        'border-[var(--border-color)]',
        'overflow-hidden',
      )}
    >
      <div className="flex items-center gap-2 px-5 pt-5">
        <span className="h-px w-6 bg-[var(--text-muted)] opacity-60" />
        <span className="text-[10px] font-semibold tracking-[0.16em] uppercase text-[var(--text-muted)]">
          English Block
        </span>
        <PenLine
          size={12}
          strokeWidth={2.25}
          className="text-[var(--text-muted)] opacity-70 ml-1"
        />
      </div>

      <p className="px-5 mt-3 text-sm text-[var(--text-secondary)] leading-relaxed">
        {prompt}
      </p>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Start typing…"
        rows={6}
        className={cn(
          'mt-4 w-full px-5 py-4',
          'bg-transparent resize-y',
          'text-[14px] leading-relaxed text-[var(--text-primary)]',
          'placeholder:text-[var(--text-muted)]',
          'border-t border-[var(--border-color)]',
          'focus:outline-none focus:bg-[var(--surface-1)]',
          'transition-colors duration-150',
          'min-h-[160px] max-h-[400px]',
        )}
      />

      {/* Progress + status */}
      <div className="flex items-center justify-between gap-3 px-5 py-3 border-t border-[var(--border-color)] bg-[var(--surface-1)]/40">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-[2px] w-32 sm:w-40 bg-[var(--surface-3)] overflow-hidden rounded-full">
            <motion.div
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                'h-full rounded-full',
                enough ? 'bg-[var(--skill-completed)]' : 'bg-[var(--accent)]',
              )}
            />
          </div>
          <span className="text-[11px] tabular-nums text-[var(--text-muted)]">
            {wordCount} / {minWords} words
          </span>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {enough ? (
            <motion.span
              key="enough"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0, scale: justCrossed ? [1, 1.08, 1] : 1 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25 }}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-[var(--skill-completed)]"
            >
              <Check size={12} strokeWidth={2.5} />
              enough
            </motion.span>
          ) : (
            <motion.span
              key="more"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25 }}
              className="text-[11px] text-[var(--text-muted)] tabular-nums"
            >
              {minWords - wordCount} to go
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
