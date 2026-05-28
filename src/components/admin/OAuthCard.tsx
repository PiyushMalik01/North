'use client';

import { cn } from '@/lib/utils';
import { FiLink, FiCheck, FiX, FiLoader } from 'react-icons/fi';

type ConnectionStatus = 'disconnected' | 'polling' | 'connected';

interface DeviceFlow {
  userCode: string;
  verificationUrl: string;
  deviceAuthId: string;
}

interface OAuthCardProps {
  status: ConnectionStatus;
  deviceFlow: DeviceFlow | null;
  onConnect: () => void;
  onDisconnect: () => void;
}

export function OAuthCard({ status, deviceFlow, onConnect, onDisconnect }: OAuthCardProps) {
  return (
    <section className="bg-[var(--surface-1)] border border-[var(--border-color)] rounded-xl p-5 space-y-4">
      <div className="flex items-center gap-2 text-[var(--text-primary)]">
        <FiLink className="w-4 h-4 text-[var(--accent)]" />
        <h2 className="text-sm font-medium">Connect ChatGPT</h2>
      </div>

      {status === 'connected' ? (
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-500">
            <FiCheck className="w-4 h-4" /> Connected
          </span>
          <button
            onClick={onDisconnect}
            className={cn(
              'inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-medium cursor-pointer',
              'bg-[var(--surface-2)] border border-[var(--border-color)]',
              'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)]',
              'transition-all duration-150',
            )}
          >
            <FiX className="w-3.5 h-3.5" /> Disconnect
          </button>
        </div>
      ) : status === 'polling' && deviceFlow ? (
        <div className="space-y-3">
          <p className="text-sm text-[var(--text-secondary)]">
            Enter this code at the verification page:
          </p>
          <div className="flex items-center gap-3">
            <code className="px-3 py-1.5 rounded-lg bg-[var(--surface-2)] border border-[var(--border-color)] text-sm font-mono text-[var(--accent-text)] tracking-widest select-all">
              {deviceFlow.userCode}
            </code>
            <FiLoader className="w-4 h-4 text-[var(--text-muted)] animate-spin shrink-0" />
          </div>
          <a
            href={deviceFlow.verificationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-sm text-[var(--accent-text)] hover:text-[var(--accent)] underline underline-offset-2 transition-colors"
          >
            Open verification page
          </a>
        </div>
      ) : (
        <button
          onClick={onConnect}
          className={cn(
            'inline-flex items-center gap-2 h-9 px-4 rounded-lg text-sm font-medium cursor-pointer',
            'bg-[var(--accent)] text-[var(--accent-fg)]',
            'hover:bg-[var(--accent-hover)]',
            'transition-all duration-150 active:translate-y-px',
          )}
        >
          <FiLink className="w-4 h-4" /> Connect with ChatGPT
        </button>
      )}
    </section>
  );
}
