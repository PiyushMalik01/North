import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/huddle/session';
import { createCommentSchema } from '@/lib/huddle/schemas';
import type { CommentDTO } from '@/lib/huddle/types';

export async function POST(req: Request) {
  const me = await getCurrentUser();
  const parsed = createCommentSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: 'Invalid body' }, { status: 400 });

  const { postId, parentId, body } = parsed.data;
  const c = await prisma.comment.create({
    data: {
      post: { connect: { id: postId } },
      ...(parentId ? { parent: { connect: { id: parentId } } } : {}),
      author: { connect: { id: me.id } },
      body,
    },
    include: { author: { select: { id: true, name: true } } },
  });

  const dto: CommentDTO = {
    id: c.id,
    body: c.body,
    score: 0,
    myVote: 0,
    createdAt: c.createdAt.toISOString(),
    author: { id: c.author.id, name: c.author.name ?? 'anon' },
    parentId: c.parentId,
    replies: [],
  };
  return NextResponse.json(dto, { status: 201 });
}
