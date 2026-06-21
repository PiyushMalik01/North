import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/huddle/session';
import { voteSchema } from '@/lib/huddle/schemas';

export async function POST(req: Request) {
  const me = await getCurrentUser();
  const parsed = voteSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: 'Invalid body' }, { status: 400 });

  const { postId, commentId, value } = parsed.data;

  if (postId) {
    const existing = await prisma.vote.findUnique({ where: { userId_postId: { userId: me.id, postId } } });
    const delta = value - (existing?.value ?? 0);
    await prisma.$transaction(async (tx) => {
      if (value === 0) {
        if (existing) await tx.vote.delete({ where: { userId_postId: { userId: me.id, postId } } });
      } else {
        await tx.vote.upsert({
          where: { userId_postId: { userId: me.id, postId } },
          create: { user: { connect: { id: me.id } }, post: { connect: { id: postId } }, value },
          update: { value },
        });
      }
      if (delta !== 0) await tx.post.update({ where: { id: postId }, data: { score: { increment: delta } } });
    });
    const p = await prisma.post.findUnique({ where: { id: postId }, select: { score: true } });
    return NextResponse.json({ score: p?.score ?? 0, myVote: value });
  }

  // commentId branch
  const existing = await prisma.vote.findUnique({ where: { userId_commentId: { userId: me.id, commentId: commentId! } } });
  const delta = value - (existing?.value ?? 0);
  await prisma.$transaction(async (tx) => {
    if (value === 0) {
      if (existing) await tx.vote.delete({ where: { userId_commentId: { userId: me.id, commentId: commentId! } } });
    } else {
      await tx.vote.upsert({
        where: { userId_commentId: { userId: me.id, commentId: commentId! } },
        create: { user: { connect: { id: me.id } }, comment: { connect: { id: commentId! } }, value },
        update: { value },
      });
    }
    if (delta !== 0) await tx.comment.update({ where: { id: commentId! }, data: { score: { increment: delta } } });
  });
  const c = await prisma.comment.findUnique({ where: { id: commentId! }, select: { score: true } });
  return NextResponse.json({ score: c?.score ?? 0, myVote: value });
}
