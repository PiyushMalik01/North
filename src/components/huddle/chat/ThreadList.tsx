'use client';

import { useThreads } from '@/lib/huddle/hooks';
import { timeAgo } from '@/lib/huddle/time';
import { cn } from '@/lib/utils';
import { Avatar } from '../Avatar';

export function ThreadList({
  selectedId,
  onSelect,
}: {
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const { data: threads, isLoading } = useThreads();

  return (
    <div className="flex h-full flex-col">
      <div className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
        chats
      </div>
      <div className="flex-1 overflow-y-auto">
        {isLoading &&
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3">
              <div className="h-9 w-9 animate-pulse rounded-full bg-[color-mix(in_srgb,var(--text-primary)_8%,transparent)]" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-2/3 animate-pulse rounded bg-[color-mix(in_srgb,var(--text-primary)_8%,transparent)]" />
                <div className="h-2 w-1/2 animate-pulse rounded bg-[color-mix(in_srgb,var(--text-primary)_6%,transparent)]" />
              </div>
            </div>
          ))}

        {threads?.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => onSelect(t.id)}
            className={cn(
              'flex w-full items-center gap-3 px-4 py-3 text-left transition-colors',
              'hover:bg-[color-mix(in_srgb,var(--text-primary)_5%,transparent)]',
              selectedId === t.id && 'bg-[color-mix(in_srgb,var(--text-primary)_8%,transparent)]',
            )}
          >
            <Avatar name={t.title} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-sm font-medium text-[var(--text-primary)]">{t.title}</span>
                <span className="shrink-0 text-[10px] text-[var(--text-muted)]">{timeAgo(t.lastMessageAt)}</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span
                  className={cn(
                    'truncate text-xs',
                    t.unread ? 'font-medium text-[var(--text-secondary)]' : 'text-[var(--text-muted)]',
                  )}
                >
                  {t.preview ?? 'no messages yet'}
                </span>
                {t.unread && <span className="h-2 w-2 shrink-0 rounded-full bg-[var(--text-primary)]" />}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
