import { NextResponse } from 'next/server';

import { getConnectionStatus, setModel } from '@/lib/ai/config';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(getConnectionStatus());
}

interface PatchBody {
  model?: string;
}

export async function PATCH(request: Request) {
  try {
    const body = (await request.json()) as PatchBody;
    if (body.model?.trim()) {
      setModel(body.model.trim());
    }
    return NextResponse.json(getConnectionStatus());
  } catch {
    return NextResponse.json(getConnectionStatus());
  }
}
