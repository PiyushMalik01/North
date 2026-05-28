'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PulseCard } from './PulseCard';
import type { PulseItemMock } from '@/data/dashboardData';

interface PulseProps {
  items: PulseItemMock[];
  treeName: string;
}

export function Pulse({ items, treeName }: PulseProps) {
  const hasItems = items.length > 0;

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      aria-label="What's moving"
    >
      <div className="flex items-end justify-between mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="h-px w-6 bg-[var(--text-muted)] opacity-60" />
            <span className="text-[10px] font-semibold tracking-[0.16em] uppercase text-[var(--text-muted)]">
              The Pulse
            </span>
          </div>
          <h2 className="text-xl lg:text-2xl font-semibold text-[var(--text-primary)] tracking-[-0.02em] leading-tight">
            What&apos;s moving in {treeName.toLowerCase()} this week
          </h2>
        </div>

        {hasItems && (
          <Link
            href="/pulse"
            className={cn(
              'group hidden sm:inline-flex items-center gap-1.5',
              'text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]',
              'transition-colors duration-150',
            )}
          >
            See all
            <ArrowRight
              size={12}
              strokeWidth={2.25}
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </Link>
        )}
      </div>

      {hasItems ? (
        <div
          className={cn(
            'grid gap-4',
            // Mobile: horizontal snap-scroll. Desktop: 3-up.
            'sm:grid-cols-3',
            'overflow-x-auto sm:overflow-visible',
            'flex sm:grid',
            'snap-x snap-mandatory sm:snap-none',
            'scrollbar-none -mx-1 px-1 sm:mx-0 sm:px-0',
          )}
        >
          {items.slice(0, 3).map((item, i) => (
            <PulseCard key={item.id} item={item} index={i} />
          ))}
        </div>
      ) : (
        <div
          className={cn(
            'rounded-xl px-5 py-8',
            'border border-dashed border-[var(--border-color)]',
            'text-center',
          )}
        >
          <p className="text-sm text-[var(--text-muted)]">
            The Pulse is warming up. Check back tomorrow.
          </p>
        </div>
      )}
    </motion.section>
  );
}
