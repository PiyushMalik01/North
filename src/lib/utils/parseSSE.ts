/**
 * Parse raw SSE text into accumulated content string.
 * Handles the `data: {"content": "..."}` format from the AI chat endpoint.
 */
export function parseSSEStream(raw: string): string {
  let text = '';
  const lines = raw.split('\n');
  for (const line of lines) {
    if (line.startsWith('data: ') && line !== 'data: [DONE]') {
      try {
        const parsed = JSON.parse(line.slice(6));
        if (parsed.content) text += parsed.content;
      } catch {
        // skip unparseable chunks
      }
    }
  }
  return text;
}
