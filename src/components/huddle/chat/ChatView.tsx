'use client';

import { useState } from 'react';
import { useThreads } from '@/lib/huddle/hooks';
import { cn } from '@/lib/utils';
import { ThreadList } from './ThreadList';
import { Conversation } from './Conversation';

/** Two-pane chat: thread list + conversation. Single-pane (with back) on mobile. */
export function ChatView() {
  const [selected, setSelected] = useState<string | null>(null);
  const { data: threads } = useThreads();
  const current = threads?.find((t) => t.id === selected) ?? null;

  return (
    <div className="mx-auto h-[calc(100dvh-3.5rem)] w-full max-w-5xl px-4 pb-24 pt-4">
      <div
        className="flex h-full overflow-hidden rounded-2xl border"
        style={{ background: 'var(--scene-card)', borderColor: 'var(--scene-card-border)' }}
      >
        <div
          className={cn('w-full border-r md:w-80', selected && 'hidden md:block')}
          style={{ borderColor: 'var(--scene-card-border)' }}
        >
          <ThreadList selectedId={selected} onSelect={setSelected} />
        </div>

        <div className={cn('flex-1', !selected && 'hidden md:flex')}>
          {selected && current ? (
            <Conversation threadId={selected} title={current.title} onBack={() => setSelected(null)} />
          ) : (
            <div className="hidden h-full w-full items-center justify-center text-sm text-[var(--text-muted)] md:flex">
              select a chat to start
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
