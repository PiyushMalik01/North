'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ActiveQuest } from '@/data/dashboardData';

interface ActiveQuestCardProps {
  quest: ActiveQuest | null;
}

function formatDeadline(deadline: Date | null): string | null {
  if (!deadline) return null;
  const ms = deadline.getTime() - Date.now();
  if (ms <= 0) return 'overdue';
  const hours = ms / (60 * 60 * 1000);
  if (hours < 24) return `${Math.max(1, Math.round(hours))}h left`;
  const days = Math.round(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} left`;
}

export function ActiveQuestCard({ quest }: ActiveQuestCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      {quest ? (
        <Link
          href={`/quests/${quest.id}`}
          className={cn(
            'group block rounded-xl p-5 lg:p-6',
            'bg-[var(--card)] border border-[var(--border-color)]',
            'hover:border-[var(--border-hover)]',
            'transition-colors duration-200',
          )}
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="h-px w-6 bg-[var(--text-muted)] opacity-60" />
            <span className="text-[10px] font-semibold tracking-[0.16em] uppercase text-[var(--text-muted)]">
              Active Quest
            </span>
          </div>

          <h3 className="text-lg font-semibold text-[var(--text-primary)] tracking-[-0.015em] leading-snug">
            {quest.title}
          </h3>
          <p className="mt-1.5 text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-2">
            {quest.description}
          </p>

          <div className="mt-5 flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs">
              <span className="text-[var(--accent-text)] font-medium tabular-nums">
                +{quest.reward} XP
              </span>
              {quest.deadlineAt && (
                <>
                  <span className="text-[var(--text-muted)] opacity-50">·</span>
                  <span className="text-[var(--text-secondary)] tabular-nums">
                    {formatDeadline(quest.deadlineAt)}
                  </span>
                </>
              )}
            </div>
            <ArrowUpRight
              size={16}
              strokeWidth={2}
              className="text-[var(--text-muted)] group-hover:text-[var(--text-primary)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200"
            />
          </div>
        </Link>
      ) : (
        <EmptyCard
          label="Active Quest"
          icon={Target}
          title="Pick up a quest"
          supporting="Quests bundle skills into a real, shippable thing."
          ctaHref="/quests"
        />
      )}
    </motion.div>
  );
}

function EmptyCard({
  label,
  icon: Icon,
  title,
  supporting,
  ctaHref,
}: {
  label: string;
  icon: typeof Target;
  title: string;
  supporting: string;
  ctaHref: string;
}) {
  return (
    <Link
      href={ctaHref}
      className={cn(
        'group block rounded-xl p-5 lg:p-6',
        'bg-[var(--card)] border border-dashed border-[var(--border-color)]',
        'hover:border-[var(--accent)]/40',
        'transition-colors duration-200',
      )}
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="h-px w-6 bg-[var(--text-muted)] opacity-60" />
        <span className="text-[10px] font-semibold tracking-[0.16em] uppercase text-[var(--text-muted)]">
          {label}
        </span>
      </div>
      <h3 className="text-lg font-semibold text-[var(--text-primary)] tracking-[-0.015em]">
        {title}
      </h3>
      <p className="mt-1.5 text-sm text-[var(--text-secondary)] leading-relaxed">
        {supporting}
      </p>
      <div className="mt-5 inline-flex items-center gap-1.5 text-xs text-[var(--text-secondary)] group-hover:text-[var(--accent-text)] transition-colors">
        <Icon size={13} strokeWidth={2.25} />
        Browse
      </div>
    </Link>
  );
}
