'use client';

import { useFeed } from '@/lib/huddle/hooks';
import { PostCard } from './PostCard';

export function Feed({ community }: { community?: string }) {
  const q = useFeed(community);
  const posts = q.data?.pages.flatMap((p) => p.items) ?? [];

  return (
    <div className="space-y-3">
      {q.isLoading &&
        Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-28 animate-pulse rounded-2xl border"
            style={{ background: 'var(--scene-card)', borderColor: 'var(--scene-card-border)' }}
          />
        ))}

      {posts.map((p) => (
        <PostCard key={p.id} post={p} community={community} />
      ))}

      {!q.isLoading && posts.length === 0 && (
        <p className="py-8 text-center text-sm text-[var(--text-muted)]">no posts here yet — start one.</p>
      )}

      {q.hasNextPage && (
        <button
          type="button"
          onClick={() => q.fetchNextPage()}
          disabled={q.isFetchingNextPage}
          className="w-full rounded-xl border py-2.5 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)] disabled:opacity-50"
          style={{ borderColor: 'var(--scene-card-border)' }}
        >
          {q.isFetchingNextPage ? 'loading…' : 'load more'}
        </button>
      )}
    </div>
  );
}
