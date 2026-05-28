import { NextResponse } from 'next/server';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

import { getOpenAIClient, isAIConnected } from '@/lib/ai/openai-client';
import { getModel } from '@/lib/ai/config';
import { NOR_SYSTEM_PROMPT } from '@/lib/ai/nor-system-prompt';

export const dynamic = 'force-dynamic';

interface ChatRequestBody {
  messages: { role: string; content: string }[];
  systemPrompt?: string;
}

export async function POST(request: Request) {
  try {
    if (!isAIConnected()) {
      return NextResponse.json(
        { success: false, error: 'No AI provider connected. Connect via /admin first.' },
        { status: 503 },
      );
    }

    const client = getOpenAIClient();
    if (!client) {
      return NextResponse.json(
        { success: false, error: 'Failed to initialize AI client.' },
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

    const chatMessages: ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt ?? NOR_SYSTEM_PROMPT },
      ...messages.map((msg) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
    ];

    let stream;
    try {
      stream = await client.chat.completions.create({
        model: getModel(),
        messages: chatMessages,
        stream: true,
        temperature: 0.8,
        max_completion_tokens: 300,
      });
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
          for await (const chunk of stream) {
            const delta = chunk.choices[0]?.delta?.content;
            if (delta) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ content: delta })}\n\n`),
              );
            }
            if (chunk.choices[0]?.finish_reason === 'stop') {
              controller.enqueue(encoder.encode('data: [DONE]\n\n'));
            }
          }
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
