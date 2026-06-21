import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/huddle/session';

export async function GET() {
  const me = await getCurrentUser();
  return NextResponse.json(me);
}
