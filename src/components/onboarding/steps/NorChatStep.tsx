'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiCheck } from 'react-icons/fi';
import { cn } from '@/lib/utils';
import { parseSSEStream } from '@/lib/utils/parseSSE';
import { useOnboardingStore } from '@/store/onboardingStore';
import { NorChatBubble, parseNorMessage } from './NorChatBubble';
import type { NorGathered } from './NorChatBubble';
import type { NorAnalysis } from '@/types';

interface NorChatStepProps {
  onNext: () => void;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const GOALS = [
  { key: 'interests', label: 'interests' },
  { key: 'workStyle', label: 'work style' },
  { key: 'goal', label: 'goal' },
] as const;

export function NorChatStep({ onNext }: NorChatStepProps) {
  const { data, setNorAnalysis } = useOnboardingStore();
  const [phase, setPhase] = useState<'intro' | 'chat'>('intro');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gathered, setGathered] = useState<Set<string>>(new Set());
  const [wrappingUp, setWrappingUp] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const initializedRef = useRef(false);
  const autoAdvancedRef = useRef(false);

  const allGathered = GOALS.every((g) => gathered.has(g.key));

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    const timer = setTimeout(() => setPhase('chat'), 1800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (phase !== 'chat' || initializedRef.current) return;
    initializedRef.current = true;
    const ctx: ChatMessage = {
      role: 'user',
      content: `[context] my name is ${data.name}, ${data.year} year${data.college ? ` at ${data.college}` : ''}`,
    };
    setMessages([ctx]);
    streamAIResponse([ctx]);
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (allGathered && !wrappingUp && !isStreaming && !autoAdvancedRef.current) {
      autoAdvancedRef.current = true;
      setWrappingUp(true);
      const timer = setTimeout(() => extractAndAdvance(), 2000);
      return () => clearTimeout(timer);
    }
  }, [allGathered, wrappingUp, isStreaming]); // eslint-disable-line react-hooks/exhaustive-deps

  function processDataMarker(fullText: string) {
    const parsed = parseNorMessage(fullText);
    if (parsed.data?.gathered) {
      setGathered(new Set(parsed.data.gathered));
    }
  }

  async function streamAIResponse(history: ChatMessage[]) {
    setIsStreaming(true);
    setError(null);
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: history.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      if (!res.ok || !res.body) {
        let detail = '';
        try {
          const errData = await res.json();
          detail = errData.error ?? '';
        } catch { /* no json body */ }
        if (res.status === 503) {
          setError("nor isn't connected yet — head to /admin to set up AI, or skip this step.");
        } else {
          setError(detail || 'something went wrong reaching nor. you can skip this step.');
        }
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let rawBuffer = '';
      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        rawBuffer += decoder.decode(value, { stream: true });
        const text = parseSSEStream(rawBuffer);
        setMessages((prev) => {
          const u = [...prev];
          u[u.length - 1] = { role: 'assistant', content: text };
          return u;
        });
        scrollToBottom();
      }

      const full = parseSSEStream(rawBuffer);
      setMessages((prev) => {
        const u = [...prev];
        u[u.length - 1] = { role: 'assistant', content: full };
        return u;
      });
      processDataMarker(full);
    } catch {
      setError('something went wrong reaching nor. you can skip this step.');
    } finally {
      setIsStreaming(false);
      inputRef.current?.focus();
    }
  }

  function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isStreaming || wrappingUp) return;
    const updated: ChatMessage[] = [...messages, { role: 'user', content: trimmed }];
    setMessages(updated);
    setInput('');
    streamAIResponse(updated);
  }

  function handleSend() {
    sendMessage(input);
  }

  function handleOptionSelect(option: string) {
    sendMessage(option);
  }

  async function extractAndAdvance() {
    setIsStreaming(true);
    try {
      const prompt =
        'Based on our conversation, return ONLY valid JSON: {"suggestedInterests":["..."],"suggestedLearningStyle":{"theoryVsHandsOn":0-100,"soloVsCollab":0-100,"sprintVsMarathon":0-100,"guidedVsExplore":0-100},"suggestedGoal":"internship"|"placements"|"exploring","personalitySummary":"one sentence"}';
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            ...messages.map((m) => ({ role: m.role, content: m.content })),
            { role: 'user', content: prompt },
          ],
          systemPrompt: 'You are a data extraction engine. Return ONLY valid JSON, nothing else.',
        }),
      });
      if (res.ok && res.body) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let raw = '';
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          raw += decoder.decode(value, { stream: true });
        }
        try {
          const parsed = parseSSEStream(raw);
          const cleaned = parsed.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
          const analysis: NorAnalysis = JSON.parse(cleaned);
          setNorAnalysis(analysis);
        } catch {
          /* continue without analysis */
        }
      }
    } catch {
      /* continue without analysis */
    } finally {
      setIsStreaming(false);
      onNext();
    }
  }

  // ─── Intro phase ───
  if (phase === 'intro') {
    return (
      <div className="flex flex-col items-center justify-center min-h-full gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex flex-col items-center gap-3"
        >
          <h1
            className={cn(
              'font-[family-name:var(--font-oswald)] text-5xl tracking-tight',
              'text-[var(--text-primary)]',
            )}
          >
            nor
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-sm text-[var(--text-muted)]"
          >
            your ai guide through north
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.5 }}
          className="flex items-center gap-1.5 mt-4"
        >
          <span className="w-1 h-1 rounded-full bg-[var(--accent)] animate-pulse" />
          <span className="w-1 h-1 rounded-full bg-[var(--accent)] animate-pulse [animation-delay:0.2s]" />
          <span className="w-1 h-1 rounded-full bg-[var(--accent)] animate-pulse [animation-delay:0.4s]" />
        </motion.div>
      </div>
    );
  }

  // ─── Chat phase ───
  const visibleMessages = messages.filter((m) => !m.content.startsWith('[context]'));

  return (
    <motion.div
      className="flex flex-col w-full max-w-lg mx-auto h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header with progress */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-color)]/50">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'font-[family-name:var(--font-oswald)] text-base tracking-tight',
              'text-[var(--text-primary)]',
            )}
          >
            nor
          </span>
          <span className="text-[10px] text-[var(--text-muted)]">
            getting to know you
          </span>
        </div>

        {/* Goal checkmarks */}
        <div className="flex items-center gap-3">
          {GOALS.map((g) => {
            const done = gathered.has(g.key);
            return (
              <div key={g.key} className="flex items-center gap-1">
                <div
                  className={cn(
                    'w-4 h-4 rounded-full flex items-center justify-center transition-all duration-300',
                    done
                      ? 'bg-emerald-500/20 text-emerald-500'
                      : 'bg-[var(--surface-2)] text-transparent',
                  )}
                >
                  <FiCheck size={10} strokeWidth={3} />
                </div>
                <span className={cn(
                  'text-[10px] transition-colors duration-300 hidden sm:inline',
                  done ? 'text-emerald-500' : 'text-[var(--text-muted)]',
                )}>
                  {g.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 px-3 py-4">
        {visibleMessages.map((msg, i) => (
          <NorChatBubble
            key={i}
            message={msg}
            isLatest={i === visibleMessages.length - 1}
            onOptionSelect={handleOptionSelect}
            optionsDisabled={isStreaming || wrappingUp}
          />
        ))}

        {/* Auto-advance indicator */}
        <AnimatePresence>
          {wrappingUp && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-2 py-4"
            >
              <span className="w-1 h-1 rounded-full bg-[var(--accent)] animate-pulse" />
              <span className="text-xs text-[var(--text-muted)]">
                setting up your personalized experience...
              </span>
              <span className="w-1 h-1 rounded-full bg-[var(--accent)] animate-pulse [animation-delay:0.3s]" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4 py-3 mx-3 mb-2 rounded-xl bg-[var(--surface-2)] text-sm text-[var(--text-secondary)]"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input area */}
      <div className="px-3 pt-3 pb-4 border-t border-[var(--border-color)]/50">
        {wrappingUp ? (
          <div className="text-center text-xs text-[var(--text-muted)] py-2">
            all done — moving to the next step
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSend();
                }}
                placeholder={isStreaming ? 'nor is typing...' : 'type your own answer...'}
                disabled={isStreaming}
                className={cn(
                  'flex-1 bg-[var(--surface-1)] text-sm text-[var(--text-primary)]',
                  'rounded-xl px-4 py-3 outline-none',
                  'border border-[var(--border-color)] focus:border-[var(--accent)]/60',
                  'placeholder:text-[var(--text-muted)] transition-all duration-200',
                  'disabled:opacity-50',
                )}
              />
              <button
                type="button"
                onClick={handleSend}
                disabled={isStreaming || !input.trim()}
                className={cn(
                  'p-3 rounded-xl cursor-pointer',
                  'bg-[var(--accent)] text-[var(--accent-fg)]',
                  'disabled:opacity-30 disabled:cursor-not-allowed',
                  'transition-all duration-150 active:scale-95',
                )}
                aria-label="Send message"
              >
                <FiSend size={16} />
              </button>
            </div>

            <div className="flex items-center justify-between mt-3 px-1">
              <button
                type="button"
                onClick={onNext}
                className={cn(
                  'text-xs cursor-pointer',
                  'text-[var(--text-muted)] hover:text-[var(--text-secondary)]',
                  'transition-colors duration-150',
                )}
              >
                skip for now
              </button>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
