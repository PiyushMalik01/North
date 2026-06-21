import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/huddle/session';
import type { ThreadDTO } from '@/lib/huddle/types';

export async function GET() {
  const me = await getCurrentUser();

  const parts = await prisma.threadParticipant.findMany({
    where: { userId: me.id },
    include: {
      thread: {
        include: {
          participants: { include: { user: { select: { id: true, name: true } } } },
          messages: { orderBy: { createdAt: 'desc' }, take: 1 },
        },
      },
    },
    orderBy: { thread: { lastMessageAt: 'desc' } },
  });

  const data: ThreadDTO[] = parts.map((p) => {
    const t = p.thread;
    const others = t.participants.filter((pp) => pp.userId !== me.id).map((pp) => ({
      id: pp.user.id,
      name: pp.user.name ?? 'anon',
    }));
    const last = t.messages[0];
    const unread = !!last && last.senderId !== me.id && p.lastReadMessageId !== last.id;
    return {
      id: t.id,
      type: t.type,
      title: t.type === 'GROUP' ? t.name ?? 'group' : others[0]?.name ?? 'chat',
      lastMessageAt: t.lastMessageAt.toISOString(),
      preview: last?.body ?? null,
      unread,
      participants: others,
    };
  });

  return NextResponse.json(data);
}
