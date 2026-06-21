'use client';

import Link from 'next/link';
import { Users } from 'lucide-react';
import { useThreads } from '@/lib/huddle/hooks';
import { timeAgo } from '@/lib/huddle/time';
import { Avatar } from '../Avatar';

/** flock — your crews (group threads). Tap one to jump into chat. */
export function FlockView() {
  const { data: threads, isLoading } = useThreads();
  const groups = threads?.filter((t) => t.type === 'GROUP') ?? [];

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-28 pt-6">
      <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">your crews</p>

      {isLoading && (
        <div className="grid gap-3 sm:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-2xl border"
              style={{ background: 'var(--scene-card)', borderColor: 'var(--scene-card-border)' }}
            />
          ))}
        </div>
      )}

      {!isLoading && groups.length === 0 && (
        <p className="py-8 text-center text-sm text-[var(--text-muted)]">no crews yet.</p>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {groups.map((g) => (
          <Link
            key={g.id}
            href="/huddle/chat"
            className="rounded-2xl border p-4 transition-transform hover:-translate-y-0.5"
            style={{ background: 'var(--scene-card)', borderColor: 'var(--scene-card-border)' }}
          >
            <div className="mb-2 flex items-center gap-2">
              <span
                className="grid h-9 w-9 place-items-center rounded-full"
                style={{ background: 'color-mix(in srgb, var(--text-primary) 10%, transparent)' }}
              >
                <Users size={16} className="text-[var(--text-primary)]" />
              </span>
              <div className="min-w-0">
                <p className="truncate font-semibold text-[var(--text-primary)]">{g.title}</p>
                <p className="text-[11px] text-[var(--text-muted)]">{g.participants.length + 1} members</p>
              </div>
            </div>
            <p className="truncate text-xs text-[var(--text-secondary)]">{g.preview ?? 'no messages yet'}</p>
            <div className="mt-2 flex items-center justify-between">
              <div className="flex -space-x-2">
                {g.participants.slice(0, 4).map((p) => (
                  <Avatar key={p.id} name={p.name} size={22} />
                ))}
              </div>
              <span className="text-[10px] text-[var(--text-muted)]">{timeAgo(g.lastMessageAt)}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
