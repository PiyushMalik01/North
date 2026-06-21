'use client';

import { SessionProvider } from 'next-auth/react';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { StoreHydrator } from '@/components/providers/StoreHydrator';

/**
 * App-wide client providers: session context, query cache, and store hydration.
 * Wraps all page content rendered inside the root layout.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <QueryProvider>
        <StoreHydrator />
        {children}
      </QueryProvider>
    </SessionProvider>
  );
}
