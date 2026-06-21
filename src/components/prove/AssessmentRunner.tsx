'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Clock, ChevronRight, RotateCcw, Trophy } from 'lucide-react';
import { Bar } from '@/components/nest/cards/Bar';
import { cn } from '@/lib/utils';
import type { Assessment } from '@/data/platform/prove';

interface AssessmentRunnerProps {
  assessment: Assessment;
  onExit: () => void;
  onPassed: () => void;
}

type Phase = 'quiz' | 'result';

export default function AssessmentRunner({ assessment, onExit, onPassed }: AssessmentRunnerProps) {
  const { questions, passPct, durationSec, xp } = assessment;
  const total = questions.length;
  const isRapid = assessment.kind === 'rapid' && durationSec != null;

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [phase, setPhase] = useState<Phase>('quiz');
  const [timeLeft, setTimeLeft] = useState(durationSec ?? null);
  const [finalCorrect, setFinalCorrect] = useState(0);
  const passCalledRef = useRef(false);
  const correctRef = useRef(0); // mirror for use inside interval

  // Keep ref in sync so the interval can read without stale closure
  useEffect(() => { correctRef.current = correctCount; }, [correctCount]);

  // Countdown for rapid kind
  useEffect(() => {
    if (!isRapid || phase !== 'quiz') return;
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t === null || t <= 1) {
          clearInterval(id);
          setFinalCorrect(correctRef.current);
          setPhase('result');
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [isRapid, phase]);

  const currentQ = questions[index];
  const resultPct = phase === 'result' ? Math.round((finalCorrect / total) * 100) : 0;
  const passed = resultPct >= passPct;

  useEffect(() => {
    if (phase === 'result' && passed && !passCalledRef.current) {
      passCalledRef.current = true;
      onPassed();
    }
  }, [phase, passed, onPassed]);

  function handleSelect(i: number) {
    if (selected !== null) return;
    setSelected(i);
    if (i === currentQ.answer) setCorrectCount((c) => c + 1);
  }

  function handleNext() {
    if (index + 1 >= total) { setFinalCorrect(correctCount); setPhase('result'); }
    else { setIndex((n) => n + 1); setSelected(null); }
  }

  function handleRetry() {
    setIndex(0); setSelected(null); setCorrectCount(0);
    setFinalCorrect(0); setPhase('quiz'); setTimeLeft(durationSec ?? null);
    passCalledRef.current = false;
  }

  if (phase === 'result') {
    return (
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        className="flex flex-col items-center gap-6 py-8 text-center">
        {passed
          ? <Trophy size={48} strokeWidth={1.5} style={{ color: 'var(--text-primary)', opacity: 0.9 }} />
          : <X size={48} strokeWidth={1.5} style={{ color: 'var(--text-muted)' }} />}
        <div>
          <p className="text-5xl font-[family-name:var(--font-oswald)] leading-none" style={{ color: 'var(--text-primary)' }}>
            {resultPct}%
          </p>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
            {finalCorrect} / {total} correct · pass at {passPct}%
          </p>
        </div>
        <p className="text-lg font-[family-name:var(--font-oswald)] uppercase tracking-wide"
          style={{ color: passed ? 'var(--text-primary)' : 'var(--text-muted)' }}>
          {passed ? 'passed' : 'not quite'}
        </p>
        {passed && <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>+{xp} xp awarded</p>}
        <div className="flex gap-3">
          <button onClick={handleRetry}
            className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-opacity hover:opacity-70"
            style={{ borderColor: 'var(--scene-card-border)', color: 'var(--text-secondary)' }}>
            <RotateCcw size={14} /> retry
          </button>
          <button onClick={onExit}
            className="rounded-lg px-5 py-2 text-sm font-semibold transition-opacity hover:opacity-80"
            style={{ background: 'var(--text-primary)', color: 'var(--scene-bg)' }}>
            back to prove
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
          {index + 1} / {total}
        </span>
        {isRapid && timeLeft !== null && (
          <span className="flex items-center gap-1.5 text-xs font-semibold tabular-nums"
            style={{ color: timeLeft <= 10 ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
            <Clock size={13} /> {timeLeft}s
          </span>
        )}
      </div>

      <Bar value={Math.round((index / total) * 100)} height={4} />

      <AnimatePresence mode="wait">
        <motion.div key={index}
          initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.25 }} className="flex flex-col gap-4">
          <p className="text-base font-medium leading-snug sm:text-lg" style={{ color: 'var(--text-primary)' }}>
            {currentQ.prompt}
          </p>
          <div className="flex flex-col gap-2">
            {currentQ.options.map((opt, i) => {
              const isCorrect = i === currentQ.answer;
              const isPicked = i === selected;
              const borderColor = selected !== null
                ? isCorrect ? 'var(--text-primary)' : isPicked ? 'var(--text-muted)' : 'var(--scene-card-border)'
                : 'var(--scene-card-border)';
              const bg = selected !== null
                ? isCorrect ? 'color-mix(in srgb, var(--text-primary) 10%, transparent)'
                  : isPicked ? 'color-mix(in srgb, var(--text-muted) 14%, transparent)' : 'transparent'
                : 'transparent';
              return (
                <button key={i} onClick={() => handleSelect(i)} disabled={selected !== null}
                  className={cn('flex items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-colors',
                    selected === null && 'hover:border-[var(--text-secondary)]')}
                  style={{ borderColor, background: bg, color: 'var(--text-primary)' }}>
                  <span className="shrink-0 text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="flex-1">{opt}</span>
                  {selected !== null && isCorrect && <Check size={14} strokeWidth={2.5} />}
                  {selected !== null && isPicked && !isCorrect && <X size={14} strokeWidth={2.5} style={{ color: 'var(--text-muted)' }} />}
                </button>
              );
            })}
          </div>
          {selected !== null && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
              className="flex flex-col gap-3">
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {currentQ.explain}
              </p>
              <div className="flex justify-end">
                <button onClick={handleNext}
                  className="flex items-center gap-1.5 rounded-lg px-5 py-2 text-sm font-semibold transition-opacity hover:opacity-80"
                  style={{ background: 'var(--text-primary)', color: 'var(--scene-bg)' }}>
                  {index + 1 >= total ? 'finish' : 'next'} <ChevronRight size={14} />
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
