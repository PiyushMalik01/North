'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { FiCpu, FiCheck } from 'react-icons/fi';

interface ModelCardProps {
  model: string;
  onSave: (model: string) => void;
}

export function ModelCard({ model, onSave }: ModelCardProps) {
  const [value, setValue] = useState(model);
  const [saved, setSaved] = useState(false);
  const changed = value.trim() !== model;

  function handleSave() {
    if (!value.trim()) return;
    onSave(value.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <section className="bg-[var(--surface-1)] border border-[var(--border-color)] rounded-xl p-5 space-y-4">
      <div className="flex items-center gap-2 text-[var(--text-primary)]">
        <FiCpu className="w-4 h-4 text-[var(--accent)]" />
        <h2 className="text-sm font-medium">Model</h2>
      </div>

      <div>
        <label className="text-xs font-medium text-[var(--text-secondary)] tracking-[0.02em] mb-1.5 block">
          Model name
        </label>
        <input
          type="text"
          value={value}
          onChange={(e) => { setValue(e.target.value); setSaved(false); }}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); }}
          placeholder="gpt-4o-mini"
          className={cn(
            'w-full h-10 px-3 rounded-lg text-sm',
            'bg-[var(--surface-1)] border border-[var(--border-color)]',
            'text-[var(--text-primary)] placeholder:text-[var(--text-muted)]',
            'focus:outline-none focus:border-[var(--accent)]/50 focus:ring-1 focus:ring-[var(--accent)]/20',
            'transition-colors duration-150',
          )}
        />
        <p className="text-[10px] text-[var(--text-muted)] mt-1.5">
          used for all AI features. change this if your provider requires a specific model.
        </p>
      </div>

      <button
        onClick={handleSave}
        disabled={!changed && !saved}
        className={cn(
          'inline-flex items-center gap-2 h-9 px-4 rounded-lg text-sm font-medium cursor-pointer',
          'transition-all duration-150 active:translate-y-px',
          saved
            ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
            : 'bg-[var(--accent)] text-[var(--accent-fg)] hover:bg-[var(--accent-hover)]',
          !changed && !saved && 'opacity-50 cursor-not-allowed',
        )}
      >
        {saved ? (
          <>
            <FiCheck className="w-4 h-4" /> Saved
          </>
        ) : (
          'Save'
        )}
      </button>
    </section>
  );
}
