import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Until login is wired into huddle, the API falls back to this seeded demo user.
const DEMO_EMAIL = 'piyush@north.dev';
let demoCache: { id: string; name: string } | null = null;

/** The current user from the session, or the seeded demo user as a dev fallback. */
export async function getCurrentUser(): Promise<{ id: string; name: string }> {
  const session = await auth();
  if (session?.user?.id) {
    return { id: session.user.id, name: session.user.name ?? 'You' };
  }
  if (!demoCache) {
    const demo = await prisma.user.findUnique({
      where: { email: DEMO_EMAIL },
      select: { id: true, name: true },
    });
    if (!demo) throw new Error('Demo user not found — run `npx tsx prisma/seed-huddle.ts`.');
    demoCache = { id: demo.id, name: demo.name ?? 'You' };
  }
  return demoCache;
}
