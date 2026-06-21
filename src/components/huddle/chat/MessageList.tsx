'use client';

import { useEffect, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { MessageBubble } from './MessageBubble';
import type { MessageDTO } from '@/lib/huddle/types';

interface Props {
  messages: MessageDTO[];
  myId: string;
  hasOlder: boolean;
  loadingOlder: boolean;
  onLoadOlder: () => void;
}

/** Windowed message list (react-virtual) with auto-scroll-to-bottom + load-older. */
export function MessageList({ messages, myId, hasOlder, loadingOlder, onLoadOlder }: Props) {
  const parentRef = useRef<HTMLDivElement>(null);
  const lastCount = useRef(0);

  // eslint-disable-next-line react-hooks/incompatible-library
  const v = useVirtualizer({
    count: messages.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 56,
    overscan: 10,
  });

  // Scroll to the newest whenever a message is appended at the bottom.
  useEffect(() => {
    if (messages.length > lastCount.current && messages.length > 0) {
      v.scrollToIndex(messages.length - 1, { align: 'end' });
    }
    lastCount.current = messages.length;
  }, [messages.length, v]);

  const onScroll = () => {
    const el = parentRef.current;
    if (el && el.scrollTop < 80 && hasOlder && !loadingOlder) onLoadOlder();
  };

  return (
    <div ref={parentRef} onScroll={onScroll} className="flex-1 overflow-y-auto px-4 py-3">
      {loadingOlder && (
        <div className="py-2 text-center text-[11px] text-[var(--text-muted)]">loading older…</div>
      )}
      <div style={{ height: v.getTotalSize(), position: 'relative', width: '100%' }}>
        {v.getVirtualItems().map((vi) => {
          const m = messages[vi.index];
          const mine = m.senderId === myId;
          const prev = messages[vi.index - 1];
          const showName = !mine && (!prev || prev.senderId !== m.senderId);
          return (
            <div
              key={m.clientId ?? m.id}
              data-index={vi.index}
              ref={v.measureElement}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${vi.start}px)`,
                paddingBottom: 6,
              }}
            >
              <MessageBubble m={m} mine={mine} showName={showName} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
