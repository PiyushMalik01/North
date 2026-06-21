import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

type ProgressPayload = {
  xp: number;
  completedMaterialIds: string[];
  completedCourseIds: string[];
};

async function fetchProgress(userId: string): Promise<ProgressPayload> {
  const [materialRows, courseRows, profile] = await Promise.all([
    prisma.userMaterialProgress.findMany({
      where: { userId },
      select: { materialId: true },
    }),
    prisma.userCourseProgress.findMany({
      where: { userId },
      select: { courseId: true },
    }),
    prisma.userProfile.findUnique({
      where: { userId },
      select: { xp: true },
    }),
  ]);

  return {
    xp: profile?.xp ?? 0,
    completedMaterialIds: materialRows.map((r) => r.materialId),
    completedCourseIds: courseRows.map((r) => r.courseId),
  };
}

async function ensureProfile(userId: string): Promise<void> {
  await prisma.userProfile.upsert({
    where: { userId },
    update: {},
    create: { userId },
  });
}

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({
      xp: 0,
      completedMaterialIds: [],
      completedCourseIds: [],
    });
  }

  try {
    const progress = await fetchProgress(session.user.id);
    return NextResponse.json(progress);
  } catch {
    return NextResponse.json({ ok: false, error: 'server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const body = (await request.json()) as {
      op?: string;
      materialId?: string;
      courseId?: string;
      xp?: number;
      amount?: number;
    };

    const { op, materialId, courseId, xp = 0, amount = 0 } = body;

    await ensureProfile(userId);

    if (op === 'toggleMaterial') {
      if (!materialId) {
        return NextResponse.json(
          { ok: false, error: 'materialId required' },
          { status: 400 }
        );
      }

      const existing = await prisma.userMaterialProgress.findUnique({
        where: { userId_materialId: { userId, materialId } },
      });

      if (existing) {
        await prisma.userMaterialProgress.delete({
          where: { userId_materialId: { userId, materialId } },
        });
        // Decrement xp, floor at 0
        await prisma.userProfile.update({
          where: { userId },
          data: { xp: { decrement: xp } },
        });
        // Re-clamp to 0 if negative
        await prisma.userProfile.updateMany({
          where: { userId, xp: { lt: 0 } },
          data: { xp: 0 },
        });
      } else {
        await prisma.userMaterialProgress.create({
          data: { userId, materialId },
        });
        if (xp > 0) {
          await prisma.userProfile.update({
            where: { userId },
            data: { xp: { increment: xp } },
          });
        }
      }
    } else if (op === 'completeCourse') {
      if (!courseId) {
        return NextResponse.json(
          { ok: false, error: 'courseId required' },
          { status: 400 }
        );
      }

      const existing = await prisma.userCourseProgress.findUnique({
        where: { userId_courseId: { userId, courseId } },
      });

      if (!existing) {
        await prisma.userCourseProgress.create({
          data: { userId, courseId },
        });
        if (xp > 0) {
          await prisma.userProfile.update({
            where: { userId },
            data: { xp: { increment: xp } },
          });
        }
      }
      // If already completed, do nothing (no double-count)
    } else if (op === 'addXp') {
      if (amount > 0) {
        await prisma.userProfile.update({
          where: { userId },
          data: { xp: { increment: amount } },
        });
      }
    } else {
      return NextResponse.json({ ok: false, error: 'invalid op' }, { status: 400 });
    }

    const progress = await fetchProgress(userId);
    return NextResponse.json({ ok: true, ...progress });
  } catch {
    return NextResponse.json({ ok: false, error: 'server error' }, { status: 500 });
  }
}
