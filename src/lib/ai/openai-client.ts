import OpenAI from 'openai';

import { getAIConfig, getActiveProvider } from '@/lib/ai/config';

export function getOpenAIClient(): OpenAI | null {
  const cfg = getAIConfig();
  const provider = getActiveProvider();

  if (provider === 'openai' && cfg.openaiApiKey) {
    return new OpenAI({ apiKey: cfg.openaiApiKey });
  }

  if (provider === 'chatgpt' && cfg.chatgptAccessToken) {
    return new OpenAI({ apiKey: cfg.chatgptAccessToken });
  }

  return null;
}

export function isAIConnected(): boolean {
  return getActiveProvider() !== null;
}
