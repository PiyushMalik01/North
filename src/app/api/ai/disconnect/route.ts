import { NextResponse } from 'next/server';

import { clearOpenAIKey, clearChatGPTConnection } from '@/lib/ai/config';

export const dynamic = 'force-dynamic';

interface DisconnectRequest {
  method?: 'device_code' | 'api_key';
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as DisconnectRequest;
    if (body.method === 'api_key') {
      clearOpenAIKey();
    } else {
      clearChatGPTConnection();
    }
  } catch {
    clearOpenAIKey();
    clearChatGPTConnection();
  }
  return NextResponse.json({ success: true });
}
