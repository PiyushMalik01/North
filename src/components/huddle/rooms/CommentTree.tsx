'use client';

import { useState } from 'react';
import { qk } from '@/lib/huddle/client';
import { timeAgo } from '@/lib/huddle/time';
import { VoteControl } from './VoteControl';
import { CommentComposer } from './CommentComposer';
import { Avatar } from '../Avatar';
import type { CommentDTO } from '@/lib/huddle/types';

function CommentNode({ postId, c, depth }: { postId: string; c: CommentDTO; depth: number }) {
  const [replying, setReplying] = useState(false);

  return (
    <div style={{ marginLeft: depth > 0 ? 14 : 0 }} className="mt-3">
      <div
        className="rounded-xl border p-3"
        style={{
          background: 'var(--scene-card)',
          borderColor: 'var(--scene-card-border)',
          borderLeftWidth: depth > 0 ? 2 : 1,
        }}
      >
        <div className="mb-1 flex items-center gap-2 text-[11px] text-[var(--text-muted)]">
          <Avatar name={c.author.name} size={20} />
          <span className="font-semibold text-[var(--text-secondary)]">{c.author.name}</span>
          <span>· {timeAgo(c.createdAt)}</span>
        </div>
        <p className="whitespace-pre-wrap break-words text-sm text-[var(--text-primary)]">{c.body}</p>
        <div className="mt-1.5 flex items-center gap-3">
          <VoteControl target={{ commentId: c.id }} score={c.score} myVote={c.myVote} affected={[qk.post(postId)]} size="sm" />
          <button
            type="button"
            onClick={() => setReplying((r) => !r)}
            className="text-xs text-[var(--text-muted)] transition-colors hover:text-[var(--text-secondary)]"
          >
            reply
          </button>
        </div>
        {replying && (
          <div className="mt-2">
            <CommentComposer postId={postId} parentId={c.id} onDone={() => setReplying(false)} />
          </div>
        )}
      </div>
      {c.replies.map((r) => (
        <CommentNode key={r.id} postId={postId} c={r} depth={depth + 1} />
      ))}
    </div>
  );
}

export function CommentTree({ postId, comments }: { postId: string; comments: CommentDTO[] }) {
  if (comments.length === 0) {
    return <p className="py-4 text-sm text-[var(--text-muted)]">no comments yet — be the first.</p>;
  }
  return (
    <div>
      {comments.map((c) => (
        <CommentNode key={c.id} postId={postId} c={c} depth={0} />
      ))}
    </div>
  );
}
