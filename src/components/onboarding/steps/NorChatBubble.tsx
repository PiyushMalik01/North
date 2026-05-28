'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface NorGathered {
  gathered: string[];
  interests?: string[];
  workStyle?: string;
  goal?: string;
}

interface NorChatBubbleProps {
  message: ChatMessage;
  isLatest?: boolean;
  onOptionSelect?: (option: string) => void;
  optionsDisabled?: boolean;
}

export function parseNorMessage(text: string): {
  body: string;
  options: string[];
  data: NorGathered | null;
} {
  let remaining = text;

  let data: NorGathered | null = null;
  const dataStart = remaining.indexOf('[data:');
  if (dataStart !== -1) {
    const jsonStart = dataStart + 6;
    let depth = 0;
    let jsonEnd = -1;
    for (let i = jsonStart; i < remaining.length; i++) {
      if (remaining[i] === '{') depth++;
      if (remaining[i] === '}') { depth--; if (depth === 0) { jsonEnd = i + 1; break; } }
    }
    if (jsonEnd !== -1) {
      const jsonStr = remaining.slice(jsonStart, jsonEnd);
      const fullMarker = remaining.slice(dataStart, jsonEnd + 1);
      remaining = remaining.replace(fullMarker, '');
      try { data = JSON.parse(jsonStr); } catch { /* ignore */ }
    }
  }

  let options: string[] = [];
  const optMatch = remaining.match(/\[opt:([^\]]+)\]/);
  if (optMatch) {
    remaining = remaining.replace(optMatch[0], '');
    options = optMatch[1].split('|').map((o) => o.trim()).filter(Boolean);
  }

  remaining = remaining.replace(/^or\s+(tell|type|write)\s+.+$/gim, '');
  const body = remaining.replace(/\n{3,}/g, '\n\n').trim();
  return { body, options, data };
}

export function NorChatBubble({ message, isLatest, onOptionSelect, optionsDisabled }: NorChatBubbleProps) {
  const isNor = message.role === 'assistant';
  const parsed = isNor ? parseNorMessage(message.content) : null;
  const body = parsed ? parsed.body : message.content;
  const options = parsed?.options ?? [];
  const showOptions = isNor && isLatest && options.length > 0 && !optionsDisabled;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      className={cn('flex flex-col gap-2', isNor ? 'items-start' : 'items-end')}
    >
      {isNor && (
        <span className={cn(
          'text-[10px] font-bold tracking-[0.15em] uppercase ml-1',
          'text-[var(--accent-text)]',
        )}>
          nor
        </span>
      )}

      <div
        className={cn(
          'max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
          isNor
            ? 'bg-[var(--surface-2)] text-[var(--text-primary)] rounded-tl-md'
            : 'bg-[var(--accent)]/10 text-[var(--text-primary)] border border-[var(--accent)]/20 rounded-tr-md',
        )}
      >
        {body || (
          <span className="inline-flex items-center gap-1 h-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-muted)] animate-[bounce_1.4s_ease-in-out_infinite]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-muted)] animate-[bounce_1.4s_ease-in-out_0.2s_infinite]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-muted)] animate-[bounce_1.4s_ease-in-out_0.4s_infinite]" />
          </span>
        )}
      </div>

      {showOptions && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="flex flex-col gap-2 ml-1 mt-1"
        >
          <div className="flex flex-wrap gap-2">
            {options.map((opt, i) => (
              <motion.button
                key={opt}
                type="button"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25, delay: 0.2 + i * 0.08 }}
                onClick={() => onOptionSelect?.(opt)}
                className={cn(
                  'px-4 py-2.5 rounded-xl text-sm font-medium cursor-pointer',
                  'bg-[var(--surface-1)] border border-[var(--border-color)]',
                  'text-[var(--text-secondary)]',
                  'hover:border-[var(--accent)]/60 hover:text-[var(--accent-text)]',
                  'hover:bg-[var(--accent)]/5',
                  'active:scale-[0.97]',
                  'transition-all duration-200',
                )}
              >
                {opt}
              </motion.button>
            ))}
          </div>
          <span className="text-[11px] text-[var(--text-muted)] ml-1">
            or type your own below
          </span>
        </motion.div>
      )}
    </motion.div>
  );
}
