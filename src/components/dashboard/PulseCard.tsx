'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { PulseCategory, PulseItemMock } from '@/data/dashboardData';

const categoryColor: Record<PulseCategory, string> = {
  Framework: 'text-[#5B9CFB]',
  Tooling: 'text-[var(--accent-text)]',
  Language: 'text-[#52C77E]',
  Industry: 'text-[#B58BFC]',
  Pattern: 'text-[var(--text-secondary)]',
};

function timeAgo(d: Date): string {
  const ms = Date.now() - d.getTime();
  const days = Math.round(ms / (24 * 60 * 60 * 1000));
  if (days <= 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days}d ago`;
  if (days < 14) return '1w ago';
  if (days < 30) return `${Math.round(days / 7)}w ago`;
  return `${Math.round(days / 30)}mo ago`;
}

interface PulseCardProps {
  item: PulseItemMock;
  index: number;
}

export function PulseCard({ item, index }: PulseCardProps) {
  return (
    <motion.a
      href={item.sourceUrl}
      target="_blank"
      rel="noreferrer noopener"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: 0.25 + index * 0.05,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={cn(
        'group block rounded-xl p-5 lg:p-6',
        'bg-[var(--card)] border border-[var(--border-color)]',
        'hover:border-[var(--border-hover)]',
        'transition-colors duration-200',
        'snap-start shrink-0',
        'w-[82vw] sm:w-auto',
      )}
    >
      <div className="flex items-center gap-2 mb-5">
        <span className="h-px w-6 bg-[var(--text-muted)] opacity-50" />
        <span
          className={cn(
            'text-[10px] font-semibold tracking-[0.16em] uppercase',
            categoryColor[item.category],
          )}
        >
          {item.category}
        </span>
      </div>

      <h3
        className={cn(
          'text-[17px] lg:text-lg font-semibold leading-snug',
          'text-[var(--text-primary)] tracking-[-0.015em]',
          'group-hover:text-[var(--accent-text)] transition-colors',
        )}
      >
        {item.headline}
      </h3>

      <p className="mt-2 text-[13px] leading-relaxed text-[var(--text-secondary)] line-clamp-3">
        {item.dek}
      </p>

      <div className="mt-5 flex items-center gap-2 text-[11px] text-[var(--text-muted)] tabular-nums">
        <span>{item.readMinutes} min</span>
        <span className="opacity-50">·</span>
        <span>{timeAgo(item.publishedAt)}</span>
        <span className="opacity-50">·</span>
        <span className="truncate">{item.sourceName}</span>
      </div>
    </motion.a>
  );
}
