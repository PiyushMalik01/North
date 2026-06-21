import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getAllContent, mutateContent } from '@/lib/content/db';

export const dynamic = 'force-dynamic';

const ALLOWED_ENTITIES = new Set(['topic', 'course', 'material', 'roadmap']);
const ALLOWED_OPS = new Set(['create', 'update', 'delete']);

export async function GET() {
  try {
    const content = await getAllContent();
    return NextResponse.json(content);
  } catch {
    return NextResponse.json({ ok: false, error: 'server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
    }

    const role = (session.user as { role?: string }).role;
    if (role !== 'ADMIN') {
      return NextResponse.json({ ok: false, error: 'forbidden' }, { status: 403 });
    }

    const body = (await request.json()) as {
      entity?: string;
      op?: string;
      id?: string;
      data?: Record<string, unknown>;
    };

    const { entity, op, id, data } = body;

    if (!entity || !ALLOWED_ENTITIES.has(entity)) {
      return NextResponse.json(
        { ok: false, error: 'invalid entity' },
        { status: 400 }
      );
    }

    if (!op || !ALLOWED_OPS.has(op)) {
      return NextResponse.json(
        { ok: false, error: 'invalid op' },
        { status: 400 }
      );
    }

    await mutateContent(
      entity as 'topic' | 'course' | 'material' | 'roadmap',
      op as 'create' | 'update' | 'delete',
      id ?? '',
      data ?? {}
    );

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: 'server error' }, { status: 500 });
  }
}
