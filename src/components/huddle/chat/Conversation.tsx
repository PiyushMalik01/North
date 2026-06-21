'use client';

import { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useMe, useMessages, useSendMessage, flattenMessages } from '@/lib/huddle/hooks';
import { apiPost } from '@/lib/huddle/client';
import { MessageList } from './MessageList';
import { Composer } from './Composer';
import { Avatar } from '../Avatar';

export function Conversation({
  threadId,
  title,
  onBack,
}: {
  threadId: string;
  title: string;
  onBack?: () => void;
}) {
  const { data: me } = useMe();
  const mq = useMessages(threadId);
  const messages = flattenMessages(mq.data);
  const send = useSendMessage(threadId, me);

  // Mark the thread read once the latest (confirmed) message arrives.
  const last = messages[messages.length - 1];
  const lastId = last && !last.pending ? last.id : null;
  useEffect(() => {
    if (lastId) {
      apiPost(`/api/huddle/threads/${threadId}/read`, { messageId: lastId }).catch(() => {});
    }
  }, [threadId, lastId]);

  return (
    <div className="flex h-full flex-col">
      <header
        className="flex items-center gap-3 border-b px-4 py-3"
        style={{ borderColor: 'var(--scene-card-border)' }}
      >
        {onBack && (
          <button type="button" onClick={onBack} aria-label="Back" className="md:hidden">
            <ArrowLeft size={18} className="text-[var(--text-secondary)]" />
          </button>
        )}
        <Avatar name={title} size={32} />
        <span className="font-semibold text-[var(--text-primary)]">{title}</span>
      </header>

      {mq.isLoading ? (
        <div className="flex flex-1 items-center justify-center text-sm text-[var(--text-muted)]">loading…</div>
      ) : (
        <MessageList
          messages={messages}
          myId={me?.id ?? ''}
          hasOlder={!!mq.hasNextPage}
          loadingOlder={mq.isFetchingNextPage}
          onLoadOlder={() => mq.fetchNextPage()}
        />
      )}

      <Composer onSend={(body, cid) => send.mutate({ body, cid })} />
    </div>
  );
}
