import OpenAI from 'openai';

import { getAIConfig, getActiveProvider } from '@/lib/ai/config';
import { OPENAI_CONSTANTS } from '@/lib/ai/constants';

export interface ChatTurn {
  role: 'user' | 'assistant';
  content: string;
}

export async function isAIConnected(): Promise<boolean> {
  return (await getActiveProvider()) !== null;
}

/**
 * The Codex/ChatGPT backend rejects non-ASCII input, so instructions and
 * message content are stripped to printable ASCII before sending.
 */
function sanitizeToAscii(text: string): string {
  return text.replace(/[^\x20-\x7E\n\r\t]/g, '').replace(/\{\{.*?\}\}/g, '');
}

/** Incrementally parse the Codex SSE stream, yielding text deltas. */
async function* parseCodexSSE(body: ReadableStream<Uint8Array>): AsyncGenerator<string> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    let nl: number;
    while ((nl = buffer.indexOf('\n')) !== -1) {
      const line = buffer.slice(0, nl).trim();
      buffer = buffer.slice(nl + 1);
      if (!line.startsWith('data:')) continue;
      const data = line.slice(5).trim();
      if (data === '[DONE]') return;
      try {
        const parsed = JSON.parse(data);
        if (parsed.type === 'response.output_text.delta' && parsed.delta) {
          yield parsed.delta as string;
        }
      } catch {
        /* skip malformed line */
      }
    }
  }
}

/**
 * Returns an async iterable of text deltas for the active provider, or throws.
 *
 * - `openai`  → standard OpenAI API via `chat.completions` (Bearer = API key).
 * - `chatgpt` → ChatGPT/Codex backend via the Responses API. ChatGPT OAuth
 *   tokens are NOT valid against api.openai.com and the OpenAI SDK's request
 *   shape is rejected by the Codex backend, so this path uses a raw fetch with
 *   the `chatgpt-account-id` header and ASCII-sanitized input (mirrors the
 *   proven Codex client). The supported model depends on the ChatGPT plan
 *   (e.g. `gpt-5.2` on Go) and is configured in /admin.
 *
 * The underlying request is awaited here so connection/API errors surface
 * synchronously to the caller (before streaming begins).
 */
export async function createChatStream(
  messages: ChatTurn[],
  systemPrompt: string,
): Promise<AsyncIterable<string>> {
  const cfg = await getAIConfig();
  const provider = await getActiveProvider();

  if (provider === 'openai' && cfg.openaiApiKey) {
    const client = new OpenAI({ apiKey: cfg.openaiApiKey });
    const stream = await client.chat.completions.create({
      model: cfg.model,
      messages: [{ role: 'system', content: systemPrompt }, ...messages],
      stream: true,
      temperature: 0.8,
      max_completion_tokens: 300,
    });
    return (async function* () {
      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content;
        if (delta) yield delta;
      }
    })();
  }

  if (provider === 'chatgpt' && cfg.chatgptAccessToken) {
    const res = await fetch(OPENAI_CONSTANTS.CODEX_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/event-stream',
        Authorization: `Bearer ${cfg.chatgptAccessToken}`,
        ...(cfg.chatgptAccountId ? { 'chatgpt-account-id': cfg.chatgptAccountId } : {}),
      },
      body: JSON.stringify({
        model: cfg.model,
        instructions: sanitizeToAscii(systemPrompt),
        input: messages.map((m) => ({ role: m.role, content: sanitizeToAscii(m.content) })),
        store: false,
        stream: true,
      }),
    });

    if (!res.ok || !res.body) {
      const errText = await res.text().catch(() => '');
      let detail = errText.slice(0, 200);
      try {
        detail = (JSON.parse(errText).detail as string) ?? detail;
      } catch {
        /* non-JSON error body */
      }
      throw new Error(`Codex API failed (${res.status}): ${detail}`);
    }

    return parseCodexSSE(res.body);
  }

  throw new Error('No AI provider connected. Connect via /admin first.');
}
