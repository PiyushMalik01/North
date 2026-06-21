import { prisma } from '@/lib/prisma';

/**
 * AI connection config is persisted in the `AIConfig` table (Supabase Postgres)
 * as a single `singleton` row, so keys survive dev hot-reloads and restarts.
 */

const SINGLETON_ID = 'singleton';
const DEFAULT_MODEL = 'gpt-4o-mini';

export interface AIConnectionConfig {
  openaiApiKey: string | null;
  chatgptAccessToken: string | null;
  chatgptAccountId: string | null;
  model: string;
}

const FALLBACK_CONFIG: AIConnectionConfig = {
  openaiApiKey: null,
  chatgptAccessToken: null,
  chatgptAccountId: null,
  model: DEFAULT_MODEL,
};

async function readConfig(): Promise<AIConnectionConfig> {
  const row = await prisma.aIConfig.findUnique({ where: { id: SINGLETON_ID } });
  if (!row) return { ...FALLBACK_CONFIG };
  return {
    openaiApiKey: row.openaiApiKey,
    chatgptAccessToken: row.chatgptAccessToken,
    chatgptAccountId: row.chatgptAccountId,
    model: row.model,
  };
}

async function writeConfig(patch: Partial<AIConnectionConfig>): Promise<void> {
  await prisma.aIConfig.upsert({
    where: { id: SINGLETON_ID },
    create: { id: SINGLETON_ID, model: DEFAULT_MODEL, ...patch },
    update: patch,
  });
}

export async function getAIConfig(): Promise<Readonly<AIConnectionConfig>> {
  return readConfig();
}

export async function setOpenAIKey(apiKey: string): Promise<void> {
  await writeConfig({ openaiApiKey: apiKey });
}

export async function setChatGPTConnection(accessToken: string, accountId: string): Promise<void> {
  await writeConfig({ chatgptAccessToken: accessToken, chatgptAccountId: accountId });
}

export async function clearOpenAIKey(): Promise<void> {
  await writeConfig({ openaiApiKey: null });
}

export async function clearChatGPTConnection(): Promise<void> {
  await writeConfig({ chatgptAccessToken: null, chatgptAccountId: null });
}

export async function setModel(model: string): Promise<void> {
  await writeConfig({ model });
}

export async function getModel(): Promise<string> {
  const cfg = await readConfig();
  return cfg.model;
}

export async function getConnectionStatus() {
  const cfg = await readConfig();
  return {
    oauth: { connected: cfg.chatgptAccessToken !== null },
    apiKey: {
      connected: cfg.openaiApiKey !== null,
      maskedKey: cfg.openaiApiKey
        ? cfg.openaiApiKey.slice(0, 5) + '...' + cfg.openaiApiKey.slice(-4)
        : undefined,
    },
    model: cfg.model,
  };
}

export async function getActiveProvider(): Promise<'openai' | 'chatgpt' | null> {
  const cfg = await readConfig();
  if (cfg.openaiApiKey) return 'openai';
  if (cfg.chatgptAccessToken) return 'chatgpt';
  return null;
}
