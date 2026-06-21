import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/huddle/session';
import { readSchema } from '@/lib/huddle/schemas';

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const me = await getCurrentUser();
  const { id } = await ctx.params;
  const parsed = readSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: 'Invalid body' }, { status: 400 });

  await prisma.threadParticipant.updateMany({
    where: { threadId: id, userId: me.id },
    data: { lastReadMessageId: parsed.data.messageId },
  });
  return NextResponse.json({ ok: true });
}
