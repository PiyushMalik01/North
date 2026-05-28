'use client';

import { cn } from '@/lib/utils';
import { FiKey, FiCheck, FiX, FiLoader } from 'react-icons/fi';

type ConnectionStatus = 'disconnected' | 'polling' | 'connected';

interface ApiKeyCardProps {
  status: ConnectionStatus;
  maskedKey: string;
  apiKey: string;
  onApiKeyChange: (value: string) => void;
  onConnect: () => void;
  onDisconnect: () => void;
}

const inputClass = cn(
  'w-full h-10 px-3 rounded-lg text-sm',
  'bg-[var(--surface-1)] border border-[var(--border-color)]',
  'text-[var(--text-primary)] placeholder:text-[var(--text-muted)]',
  'focus:outline-none focus:border-[var(--accent)]/50 focus:ring-1 focus:ring-[var(--accent)]/20',
  'transition-colors duration-150',
);

const accentBtnClass = cn(
  'inline-flex items-center gap-2 h-9 px-4 rounded-lg text-sm font-medium',
  'bg-[var(--accent)] text-[var(--accent-fg)]',
  'hover:bg-[var(--accent-hover)]',
  'transition-all duration-150 active:translate-y-px',
);

const disconnectBtnClass = cn(
  'inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-medium',
  'bg-[var(--surface-2)] border border-[var(--border-color)]',
  'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)]',
  'transition-all duration-150',
);

export function ApiKeyCard({ status, maskedKey, apiKey, onApiKeyChange, onConnect, onDisconnect }: ApiKeyCardProps) {
  const disabled = !apiKey.trim() || status === 'polling';

  return (
    <section className="bg-[var(--surface-1)] border border-[var(--border-color)] rounded-xl p-5 space-y-4">
      <div className="flex items-center gap-2 text-[var(--text-primary)]">
        <FiKey className="w-4 h-4 text-[var(--accent)]" />
        <h2 className="text-sm font-medium">API Key</h2>
      </div>

      {status === 'connected' ? (
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)]">
            <FiCheck className="w-4 h-4 text-emerald-500" />
            <code className="text-xs font-mono text-[var(--text-muted)]">{maskedKey}</code>
          </span>
          <button onClick={onDisconnect} className={disconnectBtnClass}>
            <FiX className="w-3.5 h-3.5" /> Disconnect
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-[var(--text-secondary)] tracking-[0.02em] mb-1.5 block">
              Provider
            </label>
            <select disabled className={cn(inputClass, 'appearance-none cursor-not-allowed opacity-70')}>
              <option value="openai">OpenAI</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-[var(--text-secondary)] tracking-[0.02em] mb-1.5 block">
              Secret key
            </label>
            <input
              type="password"
              placeholder="sk-..."
              value={apiKey}
              onChange={(e) => onApiKeyChange(e.target.value)}
              className={inputClass}
            />
          </div>

          <button
            onClick={onConnect}
            disabled={disabled}
            className={cn(accentBtnClass, disabled && 'opacity-50 cursor-not-allowed')}
          >
            {status === 'polling' ? (
              <FiLoader className="w-4 h-4 animate-spin" />
            ) : (
              <FiKey className="w-4 h-4" />
            )}
            Connect
          </button>
        </div>
      )}
    </section>
  );
}
