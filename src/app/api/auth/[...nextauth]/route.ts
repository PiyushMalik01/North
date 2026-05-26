export const dynamic = 'force-dynamic';

export async function GET(...args: Parameters<typeof import('@/lib/auth').handlers.GET>) {
  const { handlers } = await import('@/lib/auth');
  return handlers.GET(...args);
}

export async function POST(...args: Parameters<typeof import('@/lib/auth').handlers.POST>) {
  const { handlers } = await import('@/lib/auth');
  return handlers.POST(...args);
}
