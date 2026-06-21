'use client';

import Link from 'next/link';
import { MessageSquare } from 'lucide-react';
import { qk } from '@/lib/huddle/client';
import { timeAgo } from '@/lib/huddle/time';
import { VoteControl } from './VoteControl';
import type { PostDTO } from '@/lib/huddle/types';

export function PostCard({ post, community }: { post: PostDTO; community?: string }) {
  return (
    <article
      className="flex gap-3 rounded-2xl border p-4"
      style={{ background: 'var(--scene-card)', borderColor: 'var(--scene-card-border)' }}
    >
      <VoteControl
        target={{ postId: post.id }}
        score={post.score}
        myVote={post.myVote}
        affected={[qk.feed(community), qk.feed(undefined)]}
      />
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex flex-wrap items-center gap-1.5 text-[11px] text-[var(--text-muted)]">
          <span className="font-semibold text-[var(--text-secondary)]">{post.community.name}</span>
          <span>·</span>
          <span>{post.author.name}</span>
          <span>·</span>
          <span>{timeAgo(post.createdAt)}</span>
        </div>
        <Link href={`/huddle/post/${post.id}`} className="block">
          <h3 className="text-base font-semibold text-[var(--text-primary)] hover:underline">{post.title}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-[var(--text-secondary)]">{post.body}</p>
        </Link>
        <Link
          href={`/huddle/post/${post.id}`}
          className="mt-2 inline-flex items-center gap-1.5 text-xs text-[var(--text-muted)] transition-colors hover:text-[var(--text-secondary)]"
        >
          <MessageSquare size={13} /> {post.commentCount} comments
        </Link>
      </div>
    </article>
  );
}
