'use client';

import Link from 'next/link';
import { Check, Lock, ChevronRight, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardLabel } from '@/components/nest/cards/Card';
import { item } from '@/components/nest/cards/motion';
import { cn } from '@/lib/utils';
import type { TraceNode } from '@/data/platform/trace';

export type NodeState = 'completed' | 'available' | 'locked';

interface TraceNodeCardProps {
  node: TraceNode;
  state: NodeState;
  depTitles: string[];
}

export function TraceNodeCard({ node, state, depTitles }: TraceNodeCardProps) {
  const isCompleted = state === 'completed';
  const isAvailable = state === 'available';
  const isLocked = state === 'locked';

  return (
    <motion.div variants={item} className={cn(isLocked && 'opacity-50')}>
      <Card hover={isAvailable}>
        <div className="flex flex-col gap-3">
          {/* top row: tier label + state icon */}
          <div className="flex items-center justify-between">
            <CardLabel>tier {node.tier}</CardLabel>
            {isCompleted && (
              <Check
                size={14}
                strokeWidth={2.5}
                style={{ color: 'var(--text-muted)' }}
              />
            )}
            {isLocked && (
              <Lock
                size={13}
                strokeWidth={2}
                style={{ color: 'var(--text-muted)' }}
              />
            )}
          </div>

          {/* title */}
          <h3
            className={cn(
              'font-[family-name:var(--font-oswald)] text-lg leading-tight',
              isCompleted
                ? 'opacity-60'
                : 'opacity-100',
            )}
            style={{ color: 'var(--text-primary)' }}
          >
            {node.title}
          </h3>

          {/* summary */}
          <p
            className="text-[13px] leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            {node.summary}
          </p>

          {/* footer row */}
          <div className="flex items-center justify-between pt-1">
            {/* xp badge */}
            <span
              className="text-[11px] font-semibold tabular-nums"
              style={{
                color: isCompleted
                  ? 'var(--text-muted)'
                  : 'var(--text-secondary)',
              }}
            >
              +{node.xp} xp
            </span>

            {/* action / status */}
            {isCompleted && (
              <span
                className="text-[11px] font-semibold uppercase tracking-widest"
                style={{ color: 'var(--text-muted)' }}
              >
                done
              </span>
            )}

            {isAvailable && node.proveId && (
              <Link
                href={`/prove?a=${node.proveId}`}
                className="flex items-center gap-0.5 rounded-lg px-3 py-1 text-[12px] font-semibold"
                style={{
                  background: 'var(--text-primary)',
                  color: 'var(--scene-bg)',
                }}
              >
                <Play size={11} strokeWidth={2.5} />
                prove
                <ChevronRight size={11} strokeWidth={2.5} />
              </Link>
            )}

            {isAvailable && !node.proveId && (
              <Link
                href="/dive"
                className="flex items-center gap-0.5 rounded-lg px-3 py-1 text-[12px] font-semibold"
                style={{
                  background: 'var(--text-primary)',
                  color: 'var(--scene-bg)',
                }}
              >
                build
                <ChevronRight size={11} strokeWidth={2.5} />
              </Link>
            )}

            {isLocked && depTitles.length > 0 && (
              <span
                className="max-w-[55%] text-right text-[11px] leading-snug"
                style={{ color: 'var(--text-muted)' }}
              >
                needs: {depTitles.join(', ')}
              </span>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
