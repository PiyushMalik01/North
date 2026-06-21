'use client';

import { Check, Clock } from 'lucide-react';
import { clockTime } from '@/lib/huddle/time';
import { cn } from '@/lib/utils';
import type { MessageDTO } from '@/lib/huddle/types';

export function MessageBubble({ m, mine, showName }: { m: MessageDTO; mine: boolean; showName: boolean }) {
  return (
    <div className={cn('flex w-full', mine ? 'justify-end' : 'justify-start')}>
      <div
        className={cn('max-w-[78%] rounded-2xl px-3.5 py-2', mine ? 'rounded-br-md' : 'rounded-bl-md')}
        style={
          mine
            ? { background: 'var(--text-primary)', color: 'var(--scene-bg)' }
            : { background: 'color-mix(in srgb, var(--text-primary) 8%, transparent)', color: 'var(--text-primary)' }
        }
      >
        {showName && !mine && <div className="mb-0.5 text-[11px] font-semibold opacity-70">{m.senderName}</div>}
        <div className="whitespace-pre-wrap break-words text-sm leading-snug">{m.body}</div>
        <div className={cn('mt-0.5 flex items-center justify-end gap-1 text-[10px]', mine ? 'opacity-70' : 'opacity-50')}>
          {clockTime(m.createdAt)}
          {mine && (m.pending ? <Clock size={11} /> : <Check size={11} />)}
        </div>
      </div>
    </div>
  );
}
