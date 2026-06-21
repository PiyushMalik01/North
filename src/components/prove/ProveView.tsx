'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Card, CardLabel } from '@/components/nest/cards/Card';
import { cn } from '@/lib/utils';
import { useProgressStore } from '@/store/progressStore';
import { assessments, type Assessment } from '@/data/platform/prove';
import AssessmentRunner from './AssessmentRunner';

const KIND_LABEL: Record<string, string> = { quiz: 'quiz', rapid: 'rapid', code: 'code' };

const GROUPS: { kind: string; label: string }[] = [
  { kind: 'quiz', label: 'Multiple Choice' },
  { kind: 'rapid', label: 'Rapid Fire' },
  { kind: 'code', label: 'Code Challenge' },
];

function AssessmentCard({
  assessment,
  isPassed,
  onStart,
}: {
  assessment: Assessment;
  isPassed: boolean;
  onStart: () => void;
}) {
  const isCode = assessment.kind === 'code';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card hover={!isCode}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1.5 min-w-0">
            <div className="flex items-center gap-2">
              <span
                className="rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-widest"
                style={{
                  background: 'color-mix(in srgb, var(--text-primary) 10%, transparent)',
                  color: 'var(--text-secondary)',
                }}
              >
                {KIND_LABEL[assessment.kind]}
              </span>
              {isPassed && (
                <span
                  className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-widest"
                  style={{
                    background: 'color-mix(in srgb, var(--text-primary) 14%, transparent)',
                    color: 'var(--text-primary)',
                  }}
                >
                  <Check size={10} strokeWidth={3} />
                  passed
                </span>
              )}
            </div>
            <h3
              className="text-base font-[family-name:var(--font-oswald)] leading-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              {assessment.title}
            </h3>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {isCode ? '—' : `${assessment.questions.length} questions`}
              {assessment.durationSec ? ` · ${assessment.durationSec}s` : ''}
              {' · '}
              <span style={{ color: 'var(--text-secondary)' }}>+{assessment.xp} xp</span>
            </p>
          </div>

          {isCode ? (
            <span
              className="shrink-0 rounded-lg px-4 py-2 text-xs font-semibold opacity-40 cursor-not-allowed"
              style={{ border: '1px solid var(--scene-card-border)', color: 'var(--text-muted)' }}
            >
              coming soon
            </span>
          ) : (
            <button
              onClick={onStart}
              className={cn(
                'shrink-0 rounded-lg px-4 py-2 text-xs font-semibold transition-opacity hover:opacity-80',
              )}
              style={{ background: 'var(--text-primary)', color: 'var(--scene-bg)' }}
            >
              start
            </button>
          )}
        </div>
      </Card>
    </motion.div>
  );
}

function ProveList({ onSelect }: { onSelect: (a: Assessment) => void }) {
  const passed = useProgressStore((s) => s.passedAssessmentIds);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1
          className="text-4xl font-[family-name:var(--font-oswald)] uppercase tracking-wide"
          style={{ color: 'var(--text-primary)' }}
        >
          prove
        </h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
          Run assessments to validate what you know and unlock trace nodes.
        </p>
      </div>

      {GROUPS.map(({ kind, label }) => {
        const group = assessments.filter((a) => a.kind === kind);
        if (group.length === 0) return null;
        return (
          <section key={kind} className="flex flex-col gap-3">
            <CardLabel>{label}</CardLabel>
            <div className="flex flex-col gap-2">
              {group.map((a) => (
                <AssessmentCard
                  key={a.id}
                  assessment={a}
                  isPassed={passed.includes(a.id)}
                  onStart={() => onSelect(a)}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

export default function ProveView() {
  const searchParams = useSearchParams();
  const passAssessment = useProgressStore((s) => s.passAssessment);

  // Auto-open from ?a= query param — lazy initial state, no effect (avoids cascading renders).
  const [active, setActive] = useState<Assessment | null>(() => {
    const id = searchParams.get('a');
    if (!id) return null;
    const found = assessments.find((a) => a.id === id);
    return found && found.kind !== 'code' ? found : null;
  });

  function handlePassed() {
    if (!active) return;
    passAssessment(active.id, active.nodeId, active.xp);
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 lg:py-8">
      {active ? (
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActive(null)}
              className="text-xs font-semibold uppercase tracking-widest transition-opacity hover:opacity-60"
              style={{ color: 'var(--text-muted)' }}
            >
              ← prove
            </button>
            <span style={{ color: 'var(--scene-card-border)' }}>/</span>
            <span
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: 'var(--text-secondary)' }}
            >
              {active.title}
            </span>
          </div>
          <Card>
            <AssessmentRunner
              assessment={active}
              onExit={() => setActive(null)}
              onPassed={handlePassed}
            />
          </Card>
        </div>
      ) : (
        <ProveList onSelect={setActive} />
      )}
    </div>
  );
}
