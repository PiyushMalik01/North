import type { QueryKey } from '@tanstack/react-query';

/** Typed fetch helpers. */
export async function apiGet<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GET ${url} → ${res.status}`);
  return res.json() as Promise<T>;
}

export async function apiPost<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`POST ${url} → ${res.status}`);
  return res.json() as Promise<T>;
}

/** Query-key factory — structured keys keep cache invalidation predictable. */
export const qk = {
  me: ['huddle', 'me'] as QueryKey,
  communities: ['huddle', 'communities'] as QueryKey,
  feed: (community?: string) => ['huddle', 'feed', community ?? 'all'] as QueryKey,
  post: (id: string) => ['huddle', 'post', id] as QueryKey,
  threads: ['huddle', 'threads'] as QueryKey,
  messages: (threadId: string) => ['huddle', 'messages', threadId] as QueryKey,
};

let counter = 0;
/** A client-side id for optimistic-send dedupe. */
export function clientId(): string {
  counter += 1;
  return `c_${Date.now().toString(36)}_${counter}`;
}
