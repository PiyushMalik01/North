'use client';

import { motion } from 'framer-motion';
import { Check, Gift } from 'lucide-react';

import { Card } from '@/components/nest/cards/Card';
import { Bar } from '@/components/nest/cards/Bar';
import { item } from '@/components/nest/cards/motion';
import { cn } from '@/lib/utils';
import { useProgressStore } from '@/store/progressStore';
import type { Quest } from '@/data/platform/spark';

interface QuestCardProps {
  quest: Quest;
}

export function QuestCard({ quest }: QuestCardProps) {
  const questSteps = useProgressStore((s) => s.questSteps);
  const claimedQuestIds = useProgressStore((s) => s.claimedQuestIds);
  const toggleQuestStep = useProgressStore((s) => s.toggleQuestStep);
  const claimQuest = useProgressStore((s) => s.claimQuest);

  const checkedCount = quest.steps.filter(
    (step) => questSteps[`${quest.id}:${step.id}`],
  ).length;
  const total = quest.steps.length;
  const isComplete = checkedCount === total;
  const isClaimed = claimedQuestIds.includes(quest.id);
  const isClaimable = isComplete && !isClaimed;
  const progressPct = total > 0 ? Math.round((checkedCount / total) * 100) : 0;

  return (
    <motion.div variants={item}>
      <Card hover>
        <div className="flex flex-col gap-4">
          {/* Header row */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col gap-1">
              <h3
                className="text-base font-semibold leading-snug"
                style={{ color: 'var(--text-primary)' }}
              >
                {quest.title}
              </h3>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {quest.detail}
              </p>
            </div>
            <span
              className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest"
              style={{
                background: 'color-mix(in srgb, var(--text-muted) 18%, transparent)',
                color: 'var(--text-muted)',
              }}
            >
              {quest.type}
            </span>
          </div>

          {/* Steps checklist */}
          <ul className="flex flex-col gap-1.5">
            {quest.steps.map((step) => {
              const key = `${quest.id}:${step.id}`;
              const done = questSteps[key] === true;
              return (
                <li key={step.id}>
                  <button
                    type="button"
                    onClick={() => toggleQuestStep(quest.id, step.id)}
                    disabled={isClaimed}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors',
                      isClaimed
                        ? 'cursor-default'
                        : 'cursor-pointer hover:bg-[color-mix(in_srgb,var(--text-muted)_10%,transparent)]',
                    )}
                  >
                    {/* Checkbox */}
                    <span
                      className={cn(
                        'flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors',
                        done
                          ? 'border-transparent bg-[var(--text-primary)]'
                          : 'border-[var(--scene-card-border)]',
                      )}
                    >
                      {done && (
                        <Check
                          size={10}
                          strokeWidth={3}
                          style={{ color: 'var(--scene-bg)' }}
                        />
                      )}
                    </span>
                    <span
                      className={cn('leading-snug', done && 'line-through')}
                      style={{ color: done ? 'var(--text-muted)' : 'var(--text-primary)' }}
                    >
                      {step.label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Progress bar */}
          <Bar value={progressPct} height={4} />

          {/* Footer */}
          <div className="flex items-center justify-between gap-3">
            <span
              className="text-xs font-semibold"
              style={{ color: 'var(--text-muted)' }}
            >
              +{quest.xp} xp
            </span>

            {isClaimed ? (
              <span
                className="text-xs font-semibold"
                style={{ color: 'var(--text-muted)' }}
              >
                claimed ✓
              </span>
            ) : (
              <button
                type="button"
                disabled={!isClaimable}
                onClick={() => claimQuest(quest.id, quest.xp)}
                className={cn(
                  'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-opacity',
                  isClaimable
                    ? 'opacity-100'
                    : 'cursor-not-allowed opacity-40',
                )}
                style={
                  isClaimable
                    ? {
                        background: 'var(--text-primary)',
                        color: 'var(--scene-bg)',
                      }
                    : {
                        background: 'color-mix(in srgb, var(--text-muted) 18%, transparent)',
                        color: 'var(--text-muted)',
                      }
                }
              >
                {isClaimable && <Gift size={12} />}
                {isClaimable ? `claim +${quest.xp}` : 'complete all steps'}
              </button>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
