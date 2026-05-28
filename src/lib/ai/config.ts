interface AIConnectionConfig {
  openaiApiKey: string | null;
  chatgptAccessToken: string | null;
  chatgptAccountId: string | null;
  model: string;
}

const DEFAULT_CONFIG: AIConnectionConfig = {
  openaiApiKey: null,
  chatgptAccessToken: null,
  chatgptAccountId: null,
  model: 'gpt-4o-mini',
};

const GLOBAL_KEY = '__north_ai_config__' as const;

function getConfig(): AIConnectionConfig {
  if (!(globalThis as Record<string, unknown>)[GLOBAL_KEY]) {
    (globalThis as Record<string, unknown>)[GLOBAL_KEY] = { ...DEFAULT_CONFIG };
  }
  return (globalThis as Record<string, unknown>)[GLOBAL_KEY] as AIConnectionConfig;
}

export function getAIConfig(): Readonly<AIConnectionConfig> {
  return { ...getConfig() };
}

export function setOpenAIKey(apiKey: string): void {
  getConfig().openaiApiKey = apiKey;
}

export function setChatGPTConnection(accessToken: string, accountId: string): void {
  const cfg = getConfig();
  cfg.chatgptAccessToken = accessToken;
  cfg.chatgptAccountId = accountId;
}

export function clearOpenAIKey(): void {
  getConfig().openaiApiKey = null;
}

export function clearChatGPTConnection(): void {
  const cfg = getConfig();
  cfg.chatgptAccessToken = null;
  cfg.chatgptAccountId = null;
}

export function setModel(model: string): void {
  getConfig().model = model;
}

export function getModel(): string {
  return getConfig().model;
}

export function getConnectionStatus() {
  const cfg = getConfig();
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

export function getActiveProvider(): 'openai' | 'chatgpt' | null {
  const cfg = getConfig();
  if (cfg.openaiApiKey) return 'openai';
  if (cfg.chatgptAccessToken) return 'chatgpt';
  return null;
}
