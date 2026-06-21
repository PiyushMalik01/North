'use client';

import { useState } from 'react';
import { useCreateComment } from '@/lib/huddle/hooks';

export function CommentComposer({
  postId,
  parentId,
  onDone,
}: {
  postId: string;
  parentId?: string;
  onDone?: () => void;
}) {
  const [text, setText] = useState('');
  const create = useCreateComment(postId);

  const submit = () => {
    const body = text.trim();
    if (!body) return;
    create.mutate({ body, parentId: parentId ?? null });
    setText('');
    onDone?.();
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="flex gap-2"
    >
      <input
        autoFocus={!!parentId}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={parentId ? 'reply…' : 'add a comment…'}
        className="flex-1 rounded-lg border px-3 py-2 text-sm outline-none focus:border-[var(--text-secondary)]"
        style={{ background: 'var(--scene-bg)', borderColor: 'var(--scene-card-border)', color: 'var(--text-primary)' }}
      />
      <button
        type="submit"
        disabled={!text.trim()}
        className="rounded-lg px-3 py-2 text-sm font-semibold disabled:opacity-40"
        style={{ background: 'var(--text-primary)', color: 'var(--scene-bg)' }}
      >
        {parentId ? 'reply' : 'comment'}
      </button>
    </form>
  );
}
