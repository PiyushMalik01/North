'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { usePost } from '@/lib/huddle/hooks';
import { qk } from '@/lib/huddle/client';
import { timeAgo } from '@/lib/huddle/time';
import { VoteControl } from './VoteControl';
import { CommentComposer } from './CommentComposer';
import { CommentTree } from './CommentTree';

export function PostView({ id }: { id: string }) {
  const { data, isLoading } = usePost(id);

  if (isLoading) {
    return <div className="flex h-[60vh] items-center justify-center text-sm text-[var(--text-muted)]">loading…</div>;
  }
  if (!data) {
    return <div className="flex h-[60vh] items-center justify-center text-sm text-[var(--text-muted)]">post not found</div>;
  }
  const { post, comments } = data;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-28 pt-6">
      <Link
        href="/huddle"
        className="mb-4 inline-flex items-center gap-1 text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text-secondary)]"
      >
        <ArrowLeft size={15} /> back to rooms
      </Link>

      <article
        className="flex gap-3 rounded-2xl border p-5"
        style={{ background: 'var(--scene-card)', borderColor: 'var(--scene-card-border)' }}
      >
        <VoteControl target={{ postId: post.id }} score={post.score} myVote={post.myVote} affected={[qk.post(id)]} />
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-1.5 text-[11px] text-[var(--text-muted)]">
            <span className="font-semibold text-[var(--text-secondary)]">{post.community.name}</span>
            <span>· {post.author.name}</span>
            <span>· {timeAgo(post.createdAt)}</span>
          </div>
          <h1 className="text-xl font-bold text-[var(--text-primary)]">{post.title}</h1>
          <p className="mt-2 whitespace-pre-wrap break-words text-sm text-[var(--text-secondary)]">{post.body}</p>
        </div>
      </article>

      <div className="mt-5">
        <CommentComposer postId={id} />
        <div className="mt-2">
          <CommentTree postId={id} comments={comments} />
        </div>
      </div>
    </div>
  );
}
