'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useOnboardingStore } from '@/store/onboardingStore';
import { computeProfile } from '@/lib/onboarding/profile';
import { buildNorSystemPrompt, parseNorMessage } from '@/lib/onboarding/norPrompt';
import { parseSSEStream } from '@/lib/utils/parseSSE';

interface Msg {
  id: number;
  role: 'nor' | 'user';
  text: string;
}

const MAX_USER_TURNS = 4;
const INTRO_LINES = [
  "hey — i'm nor.",
  "your guide here. i'll help you figure out where to start, keep you moving, and i'm around whenever you're stuck.",
  'i already caught a vibe from your answers. let me make it official.',
];

let mid = 0;

export function NorStep() {
  const router = useRouter();
  const { markCompleted } = useOnboardingStore();
  const [phase, setPhase] = useState<'intro' | 'chat'>('intro');
  const [messages, setMessages] = useState<Msg[]>([]);
  const [chips, setChips] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [ended, setEnded] = useState(false);

  const sysPrompt = useRef('');
  const apiMsgs = useRef<{ role: string; content: string }[]>([]);
  const userTurns = useRef(0);
  const kicked = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setPhase('chat'), 2800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, chips, ended, streaming]);

  const stream = useCallback(async (history: { role: string; content: string }[]) => {
    setStreaming(true);
    setChips([]);
    setMessages((m) => [...m, { id: mid++, role: 'nor', text: '' }]);
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history, systemPrompt: sysPrompt.current }),
      });
      if (!res.ok || !res.body) throw new Error('unreachable');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let raw = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        raw += decoder.decode(value, { stream: true });
        const partial = parseNorMessage(parseSSEStream(raw)).text;
        setMessages((m) => {
          const u = [...m];
          u[u.length - 1] = { ...u[u.length - 1], text: partial };
          return u;
        });
      }

      const fullRaw = parseSSEStream(raw);
      const parsed = parseNorMessage(fullRaw);
      setMessages((m) => {
        const u = [...m];
        u[u.length - 1] = { ...u[u.length - 1], text: parsed.text };
        return u;
      });
      apiMsgs.current.push({ role: 'assistant', content: fullRaw });
      if (parsed.done || userTurns.current >= MAX_USER_TURNS) setEnded(true);
      else setChips(parsed.options);
    } catch {
      setMessages((m) => {
        const u = [...m];
        u[u.length - 1] = {
          ...u[u.length - 1],
          text: "can't reach my brain right now — connect an AI in /admin, or just jump in.",
        };
        return u;
      });
      setEnded(true);
    } finally {
      setStreaming(false);
    }
  }, []);

  useEffect(() => {
    if (phase !== 'chat' || kicked.current) return;
    kicked.current = true;
    const data = useOnboardingStore.getState().data;
    sysPrompt.current = buildNorSystemPrompt(computeProfile(data), data.name);
    apiMsgs.current = [{ role: 'user', content: '[start]' }];
    stream(apiMsgs.current);
  }, [phase, stream]);

  const send = useCallback(
    (text: string) => {
      const v = text.trim();
      if (!v || streaming || ended) return;
      userTurns.current += 1;
      setMessages((m) => [...m, { id: mid++, role: 'user', text: v }]);
      setInput('');
      setChips([]);
      apiMsgs.current.push({ role: 'user', content: v });
      stream(apiMsgs.current);
    },
    [streaming, ended, stream],
  );

  const enter = () => {
    markCompleted();
    router.push('/dashboard');
  };

  // ─── Intro ───
  if (phase === 'intro') {
    return (
      <div
        className="w-full max-w-md mx-auto h-full flex flex-col items-center justify-center text-center px-8 cursor-pointer"
        onClick={() => setPhase('chat')}
      >
        <motion.span
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="font-[family-name:var(--font-oswald)] text-5xl font-semibold tracking-wide text-[var(--text-primary)] mb-6"
        >
          nor
        </motion.span>
        <div className="space-y-3 max-w-sm">
          {INTRO_LINES.map((line, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.75, duration: 0.5 }}
              className={cn(
                'text-[15px] leading-relaxed',
                i === 0 ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]',
              )}
            >
              {line}
            </motion.p>
          ))}
        </div>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.6, duration: 0.5 }}
          className="text-[11px] text-[var(--text-muted)] mt-8"
        >
          tap to continue
        </motion.span>
      </div>
    );
  }

  // ─── Chat ───
  return (
    <div className="relative w-full max-w-md mx-auto h-full flex flex-col overflow-hidden rounded-3xl bg-[var(--background)] border border-[var(--border-color)]">
      <div className="flex items-baseline gap-2.5 px-5 py-4 border-b border-[var(--border-color)]/70">
        <span className="font-[family-name:var(--font-oswald)] text-xl font-semibold text-[var(--text-primary)] tracking-wide">
          nor
        </span>
        <span className="text-[11px] text-[var(--text-muted)]">your guide · knows you already</span>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-3">
        {messages.map((m) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.2, 0.7, 0.3, 1] }}
            className={cn(
              'max-w-[82%] text-[15px] leading-relaxed px-4 py-3 whitespace-pre-wrap',
              m.role === 'nor'
                ? 'self-start bg-[var(--surface-1)] border border-[var(--border-color)] text-[var(--text-primary)] rounded-[4px_16px_16px_16px]'
                : 'self-end bg-[var(--accent)]/[0.13] border border-[var(--accent)]/30 text-[var(--text-primary)] rounded-[16px_4px_16px_16px]',
            )}
          >
            {m.text || (
              <span className="inline-flex gap-1 py-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-muted)] animate-pulse" />
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-muted)] animate-pulse [animation-delay:0.15s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-muted)] animate-pulse [animation-delay:0.3s]" />
              </span>
            )}
          </motion.div>
        ))}

        <AnimatePresence>
          {chips.length > 0 && !ended && !streaming && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="self-start flex flex-wrap gap-2 mt-0.5"
            >
              {chips.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => send(c)}
                  className={cn(
                    'px-3.5 py-2 rounded-full text-[13px] cursor-pointer',
                    'bg-[var(--surface-2)] border border-[var(--border-color)] text-[var(--text-secondary)]',
                    'hover:border-[var(--accent)] hover:text-[var(--text-primary)] hover:-translate-y-px transition-all duration-150',
                  )}
                >
                  {c}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {ended ? (
        <div className="p-4 border-t border-[var(--border-color)]/70">
          <button
            type="button"
            onClick={enter}
            className={cn(
              'w-full h-12 rounded-xl font-semibold text-sm cursor-pointer',
              'bg-[var(--accent)] text-[var(--accent-fg)] hover:bg-[var(--accent-hover)] transition-colors duration-150',
            )}
          >
            enter &rarr;
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2.5 p-4 border-t border-[var(--border-color)]/70">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') send(input);
            }}
            placeholder={streaming ? 'nor is typing…' : 'tell nor in your own words…'}
            disabled={streaming}
            className={cn(
              'flex-1 h-11 rounded-xl px-4 text-sm outline-none disabled:opacity-50',
              'bg-[var(--surface-1)] border border-[var(--border-color)] text-[var(--text-primary)]',
              'placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]/60 transition-colors',
            )}
          />
          <button
            type="button"
            onClick={() => send(input)}
            disabled={streaming || !input.trim()}
            className={cn(
              'w-11 h-11 rounded-xl flex items-center justify-center text-lg cursor-pointer',
              'bg-[var(--accent)] text-[var(--accent-fg)] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150',
            )}
            aria-label="Send"
          >
            &rarr;
          </button>
        </div>
      )}
    </div>
  );
}
