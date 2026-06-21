import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/huddle/session';
import type { CommentDTO, PostDTO } from '@/lib/huddle/types';

export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const me = await getCurrentUser();
  const { id } = await ctx.params;

  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      author: { select: { id: true, name: true } },
      community: { select: { slug: true, name: true } },
      _count: { select: { comments: true } },
      votes: { where: { userId: me.id }, select: { value: true } },
    },
  });
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const comments = await prisma.comment.findMany({
    where: { postId: id },
    orderBy: { createdAt: 'asc' },
    include: {
      author: { select: { id: true, name: true } },
      votes: { where: { userId: me.id }, select: { value: true } },
    },
  });

  // Flat → nested tree.
  const map = new Map<string, CommentDTO>();
  const roots: CommentDTO[] = [];
  for (const c of comments) {
    map.set(c.id, {
      id: c.id,
      body: c.body,
      score: c.score,
      myVote: c.votes[0]?.value ?? 0,
      createdAt: c.createdAt.toISOString(),
      author: { id: c.author.id, name: c.author.name ?? 'anon' },
      parentId: c.parentId,
      replies: [],
    });
  }
  for (const c of comments) {
    const dto = map.get(c.id)!;
    if (c.parentId && map.has(c.parentId)) map.get(c.parentId)!.replies.push(dto);
    else roots.push(dto);
  }

  const postDTO: PostDTO = {
    id: post.id,
    title: post.title,
    body: post.body,
    score: post.score,
    myVote: post.votes[0]?.value ?? 0,
    createdAt: post.createdAt.toISOString(),
    author: { id: post.author.id, name: post.author.name ?? 'anon' },
    community: { slug: post.community.slug, name: post.community.name },
    commentCount: post._count.comments,
  };

  return NextResponse.json({ post: postDTO, comments: roots });
}
