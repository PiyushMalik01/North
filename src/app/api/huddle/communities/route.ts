import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/huddle/session';
import type { CommunityDTO } from '@/lib/huddle/types';

export async function GET() {
  const me = await getCurrentUser();
  const rows = await prisma.community.findMany({
    orderBy: { createdAt: 'asc' },
    include: {
      _count: { select: { members: true, posts: true } },
      members: { where: { userId: me.id }, select: { id: true } },
    },
  });

  const data: CommunityDTO[] = rows.map((c) => ({
    id: c.id,
    slug: c.slug,
    name: c.name,
    description: c.description,
    memberCount: c._count.members,
    postCount: c._count.posts,
    joined: c.members.length > 0,
  }));

  return NextResponse.json(data);
}
