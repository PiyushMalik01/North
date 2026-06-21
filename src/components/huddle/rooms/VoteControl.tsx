'use client';

import { ChevronUp, ChevronDown } from 'lucide-react';
import type { QueryKey } from '@tanstack/react-query';
import { useVote } from '@/lib/huddle/hooks';
import { cn } from '@/lib/utils';

export function VoteControl({
  target,
  score,
  myVote,
  affected,
  size = 'md',
}: {
  target: { postId?: string; commentId?: string };
  score: number;
  myVote: number;
  affected: QueryKey[];
  size?: 'sm' | 'md';
}) {
  const vote = useVote(affected);
  const set = (v: number) => vote.mutate({ ...target, value: myVote === v ? 0 : v });
  const s = size === 'sm' ? 15 : 18;

  return (
    <div className={cn('flex shrink-0 items-center', size === 'sm' ? 'flex-row gap-1.5' : 'flex-col gap-0.5')}>
      <button
        type="button"
        onClick={() => set(1)}
        aria-label="Upvote"
        className="rounded p-0.5 transition-colors hover:bg-[color-mix(in_srgb,var(--text-primary)_8%,transparent)]"
        style={{ color: myVote === 1 ? 'var(--text-primary)' : 'var(--text-muted)' }}
      >
        <ChevronUp size={s} />
      </button>
      <span className="min-w-[1.5rem] text-center text-xs font-bold text-[var(--text-primary)]">{score}</span>
      <button
        type="button"
        onClick={() => set(-1)}
        aria-label="Downvote"
        className="rounded p-0.5 transition-colors hover:bg-[color-mix(in_srgb,var(--text-primary)_8%,transparent)]"
        style={{ color: myVote === -1 ? 'var(--text-primary)' : 'var(--text-muted)' }}
      >
        <ChevronDown size={s} />
      </button>
    </div>
  );
}
