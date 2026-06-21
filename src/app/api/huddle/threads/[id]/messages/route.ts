import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/huddle/session';
import { sendMessageSchema } from '@/lib/huddle/schemas';
import type { MessageDTO, Page } from '@/lib/huddle/types';

const PAGE = 30;

export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  await getCurrentUser();
  const { id } = await ctx.params;
  const url = new URL(req.url);
  const cursor = url.searchParams.get('cursor');

  const rows = await prisma.message.findMany({
    where: { threadId: id, ...(cursor ? { createdAt: { lt: new Date(cursor) } } : {}) },
    orderBy: { createdAt: 'desc' },
    take: PAGE + 1,
    include: { sender: { select: { id: true, name: true } } },
  });

  const hasMore = rows.length > PAGE;
  const slice = hasMore ? rows.slice(0, PAGE) : rows;
  const nextCursor = hasMore ? slice[slice.length - 1].createdAt.toISOString() : null;

  // Return ascending for display (oldest → newest).
  const items: MessageDTO[] = slice
    .slice()
    .reverse()
    .map((m) => ({
      id: m.id,
      body: m.body,
      senderId: m.senderId,
      senderName: m.sender.name ?? 'anon',
      createdAt: m.createdAt.toISOString(),
      clientId: m.clientId,
    }));

  const page: Page<MessageDTO> = { items, nextCursor };
  return NextResponse.json(page);
}

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const me = await getCurrentUser();
  const { id } = await ctx.params;
  const parsed = sendMessageSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: 'Invalid body' }, { status: 400 });

  const msg = await prisma.message.create({
    data: {
      thread: { connect: { id } },
      sender: { connect: { id: me.id } },
      body: parsed.data.body,
      clientId: parsed.data.clientId,
    },
    include: { sender: { select: { id: true, name: true } } },
  });

  await prisma.thread.update({ where: { id }, data: { lastMessageAt: msg.createdAt } });
  await prisma.threadParticipant.updateMany({
    where: { threadId: id, userId: me.id },
    data: { lastReadMessageId: msg.id },
  });

  const dto: MessageDTO = {
    id: msg.id,
    body: msg.body,
    senderId: msg.senderId,
    senderName: msg.sender.name ?? 'anon',
    createdAt: msg.createdAt.toISOString(),
    clientId: msg.clientId,
  };
  return NextResponse.json(dto, { status: 201 });
}
