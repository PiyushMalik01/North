export const OPENAI_CONSTANTS = {
  CLIENT_ID: 'app_EMoamEEZ73f0CkXaXp7hrann',
  DEVICE_CODE_ENDPOINT:
    'https://auth.openai.com/api/accounts/deviceauth/usercode',
  POLL_ENDPOINT: 'https://auth.openai.com/api/accounts/deviceauth/token',
  TOKEN_EXCHANGE_ENDPOINT: 'https://auth.openai.com/oauth/token',
  CODEX_API_ENDPOINT: 'https://chatgpt.com/backend-api/codex/responses',
  VERIFICATION_URL: 'https://auth.openai.com/codex/device',
  POLL_INTERVAL_MS: 5000,
  DEVICE_CODE_EXPIRY_S: 600,
} as const;
