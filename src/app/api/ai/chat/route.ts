import { NextResponse } from 'next/server';

import { createChatStream, isAIConnected, type ChatTurn } from '@/lib/ai/openai-client';
import { NOR_SYSTEM_PROMPT } from '@/lib/ai/nor-system-prompt';

export const dynamic = 'force-dynamic';

interface ChatRequestBody {
  messages: { role: string; content: string }[];
  systemPrompt?: string;
}

export async function POST(request: Request) {
  try {
    if (!(await isAIConnected())) {
      return NextResponse.json(
        { success: false, error: 'No AI provider connected. Connect via /admin first.' },
        { status: 503 },
      );
    }

    const body = (await request.json()) as ChatRequestBody;
    const { messages, systemPrompt } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Messages array is required.' },
        { status: 400 },
      );
    }

    const turns: ChatTurn[] = messages.map((msg) => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content,
    }));

    let chatStream: AsyncIterable<string>;
    try {
      chatStream = await createChatStream(turns, systemPrompt ?? NOR_SYSTEM_PROMPT);
    } catch (apiErr: unknown) {
      const detail = apiErr instanceof Error ? apiErr.message : String(apiErr);
      return NextResponse.json(
        { success: false, error: `AI API error: ${detail}` },
        { status: 502 },
      );
    }

    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const delta of chatStream) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ content: delta })}\n\n`),
            );
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        } catch {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: 'Stream interrupted.' })}\n\n`),
          );
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { success: false, error: `Chat failed: ${detail}` },
      { status: 500 },
    );
  }
}
