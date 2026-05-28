import { NextResponse } from 'next/server';

import { setChatGPTConnection, setModel } from '@/lib/ai/config';
import { OPENAI_CONSTANTS } from '@/lib/ai/constants';

export const dynamic = 'force-dynamic';

interface PollRequest {
  deviceAuthId: string;
  userCode: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as PollRequest;

    if (!body.deviceAuthId || !body.userCode) {
      return NextResponse.json(
        { status: 'error', error: 'Missing deviceAuthId or userCode.' },
        { status: 400 },
      );
    }

    // Step 2: Poll for authorization
    const pollRes = await fetch(OPENAI_CONSTANTS.POLL_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        device_auth_id: body.deviceAuthId,
        user_code: body.userCode,
      }),
    });

    // 403/404 = user hasn't authorized yet
    if (pollRes.status === 403 || pollRes.status === 404) {
      return NextResponse.json({ status: 'pending' });
    }

    // 410 = device code expired
    if (pollRes.status === 410) {
      return NextResponse.json({ status: 'expired', error: 'Device code expired. Try again.' });
    }

    const pollData = await pollRes.json();

    // Check for pending/slow_down errors in response body
    if (pollData.error === 'authorization_pending' || pollData.error === 'slow_down') {
      return NextResponse.json({ status: 'pending' });
    }

    if (pollData.error) {
      return NextResponse.json({ status: 'error', error: pollData.error });
    }

    // Success — extract authorization_code and code_verifier
    const authCode = pollData.authorization_code || pollData.code;
    const codeVerifier = pollData.code_verifier;

    if (!authCode || !codeVerifier) {
      return NextResponse.json({
        status: 'error',
        error: 'Missing authorization_code or code_verifier in response.',
      });
    }

    // Step 3: Exchange code for tokens
    const tokenParams = new URLSearchParams({
      client_id: OPENAI_CONSTANTS.CLIENT_ID,
      grant_type: 'authorization_code',
      code: authCode,
      redirect_uri: 'https://auth.openai.com/deviceauth/callback',
      code_verifier: codeVerifier,
    });

    const tokenRes = await fetch(OPENAI_CONSTANTS.TOKEN_EXCHANGE_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: tokenParams.toString(),
    });

    if (!tokenRes.ok) {
      const errText = await tokenRes.text();
      return NextResponse.json({
        status: 'error',
        error: `Token exchange failed (${tokenRes.status}): ${errText}`,
      });
    }

    const tokenData = await tokenRes.json();

    if (!tokenData.access_token) {
      return NextResponse.json({ status: 'error', error: 'No access_token in response.' });
    }

    // Extract account ID from id_token if available
    let accountId = '';
    if (tokenData.id_token) {
      try {
        const payload = JSON.parse(
          Buffer.from(tokenData.id_token.split('.')[1], 'base64url').toString(),
        );
        accountId =
          payload['https://api.openai.com/auth']?.chatgpt_account_id ||
          payload.chatgpt_account_id ||
          '';
      } catch {
        /* id_token parse failed, continue without account ID */
      }
    }

    setChatGPTConnection(tokenData.access_token, accountId);
    setModel('gpt-5.4');

    return NextResponse.json({ status: 'connected' });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ status: 'error', error: `Poll failed: ${message}` }, { status: 500 });
  }
}
