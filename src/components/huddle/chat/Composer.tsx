'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';
import { clientId } from '@/lib/huddle/client';

export function Composer({ onSend }: { onSend: (body: string, cid: string) => void }) {
  const [text, setText] = useState('');

  const submit = () => {
    const body = text.trim();
    if (!body) return;
    onSend(body, clientId());
    setText('');
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="flex items-center gap-2 border-t px-4 py-3"
      style={{ borderColor: 'var(--scene-card-border)' }}
    >
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="message…"
        className="flex-1 rounded-full border px-4 py-2.5 text-sm outline-none focus:border-[var(--text-secondary)]"
        style={{ background: 'var(--scene-bg)', borderColor: 'var(--scene-card-border)', color: 'var(--text-primary)' }}
      />
      <button
        type="submit"
        disabled={!text.trim()}
        aria-label="Send"
        className="grid h-10 w-10 shrink-0 place-items-center rounded-full transition-opacity disabled:opacity-40"
        style={{ background: 'var(--text-primary)', color: 'var(--scene-bg)' }}
      >
        <Send size={16} />
      </button>
    </form>
  );
}
