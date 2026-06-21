import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/huddle/session';
import { createPostSchema } from '@/lib/huddle/schemas';
import type { PostDTO, Page } from '@/lib/huddle/types';

const PAGE = 15;

export async function GET(req: Request) {
  const me = await getCurrentUser();
  const url = new URL(req.url);
  const slug = url.searchParams.get('community');
  const cursor = url.searchParams.get('cursor');

  const rows = await prisma.post.findMany({
    where: {
      ...(slug ? { community: { slug } } : {}),
      ...(cursor ? { createdAt: { lt: new Date(cursor) } } : {}),
    },
    orderBy: { createdAt: 'desc' },
    take: PAGE + 1,
    include: {
      author: { select: { id: true, name: true } },
      community: { select: { slug: true, name: true } },
      _count: { select: { comments: true } },
      votes: { where: { userId: me.id }, select: { value: true } },
    },
  });

  const hasMore = rows.length > PAGE;
  const slice = hasMore ? rows.slice(0, PAGE) : rows;
  const items: PostDTO[] = slice.map((p) => ({
    id: p.id,
    title: p.title,
    body: p.body,
    score: p.score,
    myVote: p.votes[0]?.value ?? 0,
    createdAt: p.createdAt.toISOString(),
    author: { id: p.author.id, name: p.author.name ?? 'anon' },
    community: { slug: p.community.slug, name: p.community.name },
    commentCount: p._count.comments,
  }));

  const page: Page<PostDTO> = {
    items,
    nextCursor: hasMore ? slice[slice.length - 1].createdAt.toISOString() : null,
  };
  return NextResponse.json(page);
}

export async function POST(req: Request) {
  const me = await getCurrentUser();
  const parsed = createPostSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: 'Invalid body' }, { status: 400 });

  const { communitySlug, title, body } = parsed.data;
  const community = await prisma.community.findUnique({ where: { slug: communitySlug }, select: { id: true } });
  if (!community) return NextResponse.json({ error: 'Community not found' }, { status: 404 });

  const p = await prisma.post.create({
    data: {
      community: { connect: { id: community.id } },
      author: { connect: { id: me.id } },
      title,
      body,
    },
    include: {
      author: { select: { id: true, name: true } },
      community: { select: { slug: true, name: true } },
    },
  });

  const dto: PostDTO = {
    id: p.id,
    title: p.title,
    body: p.body,
    score: 0,
    myVote: 0,
    createdAt: p.createdAt.toISOString(),
    author: { id: p.author.id, name: p.author.name ?? 'anon' },
    community: { slug: p.community.slug, name: p.community.name },
    commentCount: 0,
  };
  return NextResponse.json(dto, { status: 201 });
}
