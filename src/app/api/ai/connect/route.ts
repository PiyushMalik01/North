import { NextResponse } from 'next/server';

import { setOpenAIKey } from '@/lib/ai/config';
import { OPENAI_CONSTANTS } from '@/lib/ai/constants';

export const dynamic = 'force-dynamic';

interface ConnectRequest {
  method: 'device_code' | 'api_key';
  provider?: string;
  key?: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ConnectRequest;

    if (body.method === 'api_key') {
      if (!body.key?.trim()) {
        return NextResponse.json({ error: 'API key required.' }, { status: 400 });
      }
      const key = body.key.trim();
      setOpenAIKey(key);
      return NextResponse.json({
        maskedKey: key.slice(0, 5) + '...' + key.slice(-4),
      });
    }

    if (body.method === 'device_code') {
      const res = await fetch(OPENAI_CONSTANTS.DEVICE_CODE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ client_id: OPENAI_CONSTANTS.CLIENT_ID }),
      });

      if (!res.ok) {
        const text = await res.text();
        return NextResponse.json(
          { error: `Device code request failed (${res.status}): ${text}` },
          { status: 502 },
        );
      }

      const data = await res.json();

      return NextResponse.json({
        deviceAuthId: data.device_code || data.device_auth_id,
        userCode: data.user_code,
        verificationUrl: data.verification_uri || data.verification_url || OPENAI_CONSTANTS.VERIFICATION_URL,
        expiresIn: data.expires_in || OPENAI_CONSTANTS.DEVICE_CODE_EXPIRY_S,
        interval: data.interval || 5,
      });
    }

    return NextResponse.json({ error: 'Invalid method.' }, { status: 400 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: `Connect failed: ${message}` }, { status: 500 });
  }
}
