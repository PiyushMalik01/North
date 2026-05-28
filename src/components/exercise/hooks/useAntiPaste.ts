'use client';

import { useCallback, useRef } from 'react';

export interface PasteEvent {
  attemptedChars: number;
  timestamp: number;
}

export interface AntiPasteState {
  pasteAttempts: number;
  totalAttemptedChars: number;
  events: PasteEvent[];
  keystrokes: number;
}

export interface UseAntiPaste {
  onPaste: (e: ClipboardEvent | React.ClipboardEvent) => void;
  onKeyDown: () => void;
  state: () => AntiPasteState;
  reset: () => void;
}

/**
 * Tracks paste attempts and keystrokes for an exercise editor.
 *
 * Returns a stable handler that callers wire into a paste listener
 * (DOM or React). Optionally pass an onAttempt callback to surface
 * UX (toasts, prompts) when paste is blocked.
 *
 * Telemetry is stored client-side only; backend persistence comes later.
 */
export function useAntiPaste(onAttempt?: (chars: number) => void): UseAntiPaste {
  const ref = useRef<AntiPasteState>({
    pasteAttempts: 0,
    totalAttemptedChars: 0,
    events: [],
    keystrokes: 0,
  });

  const onPaste = useCallback(
    (e: ClipboardEvent | React.ClipboardEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const text =
        ('clipboardData' in e ? e.clipboardData?.getData('text') : '') ?? '';
      const chars = text.length;
      ref.current.pasteAttempts += 1;
      ref.current.totalAttemptedChars += chars;
      ref.current.events.push({
        attemptedChars: chars,
        timestamp: Date.now(),
      });
      onAttempt?.(chars);
    },
    [onAttempt],
  );

  const onKeyDown = useCallback(() => {
    ref.current.keystrokes += 1;
  }, []);

  const state = useCallback(() => ({ ...ref.current }), []);

  const reset = useCallback(() => {
    ref.current = {
      pasteAttempts: 0,
      totalAttemptedChars: 0,
      events: [],
      keystrokes: 0,
    };
  }, []);

  return { onPaste, onKeyDown, state, reset };
}
