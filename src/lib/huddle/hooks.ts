'use client';

import {
  useQuery,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  type InfiniteData,
  type QueryKey,
} from '@tanstack/react-query';
import { apiGet, apiPost, qk } from './client';
import type {
  CommentDTO,
  CommunityDTO,
  HuddleUser,
  MessageDTO,
  Page,
  PostDTO,
  ThreadDTO,
} from './types';

type FeedCache = InfiniteData<Page<PostDTO>>;
type PostCache = { post: PostDTO; comments: CommentDTO[] };
type MsgCache = InfiniteData<Page<MessageDTO>>;
type VoteInput = { postId?: string; commentId?: string; value: number };

// ─── Queries ──────────────────────────────────────────────

export function useMe() {
  return useQuery({ queryKey: qk.me, queryFn: () => apiGet<HuddleUser>('/api/huddle/me'), staleTime: Infinity });
}

export function useCommunities() {
  return useQuery({ queryKey: qk.communities, queryFn: () => apiGet<CommunityDTO[]>('/api/huddle/communities') });
}

export function useFeed(community?: string) {
  return useInfiniteQuery({
    queryKey: qk.feed(community),
    queryFn: ({ pageParam }) => {
      const params = new URLSearchParams();
      if (community) params.set('community', community);
      if (pageParam) params.set('cursor', pageParam as string);
      const qs = params.toString();
      return apiGet<Page<PostDTO>>(`/api/huddle/posts${qs ? `?${qs}` : ''}`);
    },
    initialPageParam: null as string | null,
    getNextPageParam: (last) => last.nextCursor,
  });
}

export function usePost(id: string) {
  return useQuery({ queryKey: qk.post(id), queryFn: () => apiGet<PostCache>(`/api/huddle/posts/${id}`) });
}

export function useThreads() {
  return useQuery({
    queryKey: qk.threads,
    queryFn: () => apiGet<ThreadDTO[]>('/api/huddle/threads'),
    refetchInterval: 8000, // poll-now; swap for SSE/WS later
  });
}

export function useMessages(threadId: string) {
  return useInfiniteQuery({
    queryKey: qk.messages(threadId),
    queryFn: ({ pageParam }) =>
      apiGet<Page<MessageDTO>>(
        `/api/huddle/threads/${threadId}/messages${pageParam ? `?cursor=${encodeURIComponent(pageParam as string)}` : ''}`,
      ),
    initialPageParam: null as string | null,
    getNextPageParam: (last) => last.nextCursor,
  });
}

/** Flatten infinite message pages into a single ascending (oldest → newest) list. */
export function flattenMessages(data: MsgCache | undefined): MessageDTO[] {
  if (!data) return [];
  return [...data.pages].reverse().flatMap((p) => p.items);
}

// ─── Mutations ────────────────────────────────────────────

export function useSendMessage(threadId: string, me: HuddleUser | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { body: string; cid: string }) =>
      apiPost<MessageDTO>(`/api/huddle/threads/${threadId}/messages`, { body: vars.body, clientId: vars.cid }),
    onMutate: async (vars) => {
      await qc.cancelQueries({ queryKey: qk.messages(threadId) });
      const prev = qc.getQueryData<MsgCache>(qk.messages(threadId));
      const optimistic: MessageDTO = {
        id: `temp_${vars.cid}`,
        clientId: vars.cid,
        body: vars.body,
        senderId: me?.id ?? '',
        senderName: me?.name ?? 'You',
        createdAt: new Date().toISOString(),
        pending: true,
      };
      if (prev) {
        const pages = prev.pages.map((p, i) => (i === 0 ? { ...p, items: [...p.items, optimistic] } : p));
        qc.setQueryData<MsgCache>(qk.messages(threadId), { ...prev, pages });
      }
      return { prev };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(qk.messages(threadId), ctx.prev);
    },
    onSuccess: (server, vars) => {
      qc.setQueryData<MsgCache>(qk.messages(threadId), (old) => {
        if (!old) return old;
        const pages = old.pages.map((p, i) =>
          i === 0 ? { ...p, items: p.items.map((m) => (m.clientId === vars.cid ? server : m)) } : p,
        );
        return { ...old, pages };
      });
      qc.invalidateQueries({ queryKey: qk.threads });
    },
  });
}

function adjust<T extends { score: number; myVote: number }>(t: T, value: number): T {
  const delta = value - t.myVote;
  return { ...t, myVote: value, score: t.score + delta };
}

function applyVoteToCache(
  old: FeedCache | PostCache | undefined,
  v: VoteInput,
): FeedCache | PostCache | undefined {
  if (!old) return old;
  if ('pages' in old) {
    return {
      ...old,
      pages: old.pages.map((p) => ({
        ...p,
        items: p.items.map((post) => (post.id === v.postId ? adjust(post, v.value) : post)),
      })),
    };
  }
  let post = old.post;
  if (v.postId && old.post.id === v.postId) post = adjust(old.post, v.value);
  let comments = old.comments;
  if (v.commentId) {
    const upd = (nodes: CommentDTO[]): CommentDTO[] =>
      nodes.map((n) => (n.id === v.commentId ? adjust(n, v.value) : { ...n, replies: upd(n.replies) }));
    comments = upd(old.comments);
  }
  return { ...old, post, comments };
}

/** Optimistic voting across whichever caches hold the target (feed and/or post detail). */
export function useVote(affected: QueryKey[]) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (v: VoteInput) => apiPost<{ score: number; myVote: number }>('/api/huddle/vote', v),
    onMutate: async (v) => {
      const snaps: { key: QueryKey; data: unknown }[] = [];
      for (const key of affected) {
        await qc.cancelQueries({ queryKey: key });
        snaps.push({ key, data: qc.getQueryData(key) });
        qc.setQueryData(key, (old) => applyVoteToCache(old as FeedCache | PostCache | undefined, v));
      }
      return { snaps };
    },
    onError: (_e, _v, ctx) => {
      ctx?.snaps.forEach((s) => qc.setQueryData(s.key, s.data));
    },
  });
}

export function useCreatePost(community: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { title: string; body: string; communitySlug: string }) =>
      apiPost<PostDTO>('/api/huddle/posts', vars),
    onSuccess: (post) => {
      for (const key of [qk.feed(community), qk.feed(undefined)]) {
        qc.setQueryData<FeedCache>(key, (old) => {
          if (!old) return old;
          const pages = old.pages.map((p, i) => (i === 0 ? { ...p, items: [post, ...p.items] } : p));
          return { ...old, pages };
        });
      }
      qc.invalidateQueries({ queryKey: qk.communities });
    },
  });
}

export function useCreateComment(postId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { body: string; parentId?: string | null }) =>
      apiPost<CommentDTO>('/api/huddle/comments', { postId, parentId: vars.parentId ?? null, body: vars.body }),
    onSuccess: (comment) => {
      qc.setQueryData<PostCache>(qk.post(postId), (old) => {
        if (!old) return old;
        const post = { ...old.post, commentCount: old.post.commentCount + 1 };
        if (!comment.parentId) return { ...old, post, comments: [...old.comments, comment] };
        const insert = (nodes: CommentDTO[]): CommentDTO[] =>
          nodes.map((n) =>
            n.id === comment.parentId ? { ...n, replies: [...n.replies, comment] } : { ...n, replies: insert(n.replies) },
          );
        return { ...old, post, comments: insert(old.comments) };
      });
    },
  });
}
