'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useContentStore } from '@/store/contentStore';
import { useProgressStore } from '@/store/progressStore';

/**
 * One-shot server hydration. Content is public, so it hydrates immediately.
 * Progress is per-user, so it hydrates only once the session is authenticated
 * (anonymous users keep their local-only progress instead of being overwritten).
 * Renders nothing; the async setState happens in the promise callback.
 */
export function StoreHydrator() {
  const { status } = useSession();

  useEffect(() => {
    void useContentStore.getState().hydrate();
  }, []);

  useEffect(() => {
    if (status === 'authenticated') {
      void useProgressStore.getState().hydrate();
    }
  }, [status]);

  return null;
}
