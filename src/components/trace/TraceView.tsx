'use client';

import { motion } from 'framer-motion';
import { traceBranches, traceNodes } from '@/data/platform/trace';
import { useProgressStore } from '@/store/progressStore';
import { Bar } from '@/components/nest/cards/Bar';
import { CardLabel } from '@/components/nest/cards/Card';
import { container } from '@/components/nest/cards/motion';
import { TraceNodeCard } from './TraceNodeCard';
import type { NodeState } from './TraceNodeCard';

function deriveState(nodeId: string, deps: string[], completedIds: string[]): NodeState {
  if (completedIds.includes(nodeId)) return 'completed';
  if (deps.every((d) => completedIds.includes(d))) return 'available';
  return 'locked';
}

export function TraceView() {
  const completedNodeIds = useProgressStore((s) => s.completedNodeIds);

  const totalNodes = traceNodes.length;
  const completedCount = traceNodes.filter((n) => completedNodeIds.includes(n.id)).length;
  const progressValue = totalNodes > 0 ? Math.round((completedCount / totalNodes) * 100) : 0;

  // Build a lookup: id → title for dep labels
  const titleById = Object.fromEntries(traceNodes.map((n) => [n.id, n.title]));

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:py-8"
    >
      {/* ── Page header ── */}
      <div className="mb-10 flex flex-col gap-4">
        <div>
          <h1
            className="font-[family-name:var(--font-oswald)] text-5xl font-bold lowercase leading-none sm:text-6xl"
            style={{ color: 'var(--text-primary)' }}
          >
            trace
          </h1>
          <p
            className="mt-2 text-base"
            style={{ color: 'var(--text-secondary)' }}
          >
            your route north — unlock nodes, prove skills, level up.
          </p>
        </div>

        {/* overall progress */}
        <div className="max-w-sm">
          <div className="mb-2 flex items-center justify-between">
            <CardLabel>overall progress</CardLabel>
            <span
              className="text-[11px] font-semibold tabular-nums"
              style={{ color: 'var(--text-muted)' }}
            >
              {completedCount}/{totalNodes} nodes
            </span>
          </div>
          <Bar value={progressValue} height={7} />
        </div>
      </div>

      {/* ── Branch columns ── */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {traceBranches.map((branch) => {
          const branchNodes = traceNodes
            .filter((n) => n.branchId === branch.id)
            .sort((a, b) => a.tier - b.tier);

          return (
            <div key={branch.id} className="flex flex-col gap-0">
              {/* branch header */}
              <div className="mb-4">
                <CardLabel className="mb-1">{branch.name}</CardLabel>
                <p
                  className="text-[13px] leading-snug"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {branch.blurb}
                </p>
              </div>

              {/* nodes with connector lines */}
              <div className="flex flex-col">
                {branchNodes.map((node, index) => {
                  const state = deriveState(node.id, node.deps, completedNodeIds);
                  const depTitles = node.deps.map((d) => titleById[d] ?? d);
                  const isLast = index === branchNodes.length - 1;

                  return (
                    <div key={node.id} className="flex flex-col">
                      <TraceNodeCard node={node} state={state} depTitles={depTitles} />
                      {!isLast && (
                        <div
                          className="mx-auto w-0.5 self-stretch"
                          style={{
                            height: 20,
                            background:
                              'color-mix(in srgb, var(--text-muted) 30%, transparent)',
                          }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
