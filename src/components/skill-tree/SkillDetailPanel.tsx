'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { FiX, FiClock, FiTarget, FiLock, FiCheck, FiPlay } from 'react-icons/fi';
import type { SkillNodeData } from '@/data/skill-trees/web-development';

type Status = 'locked' | 'unlocked' | 'in-progress' | 'completed';

interface SkillDetailPanelProps {
  node: SkillNodeData | null;
  status: Status;
  onClose: () => void;
  allNodes: SkillNodeData[];
  nodeStatuses: Record<string, Status>;
}

const statusDisplay: Record<Status, { label: string; color: string; icon: typeof FiLock }> = {
  locked: { label: 'Locked', color: 'text-[var(--text-muted)]', icon: FiLock },
  unlocked: { label: 'Ready to Start', color: 'text-[var(--skill-unlocked)]', icon: FiTarget },
  'in-progress': { label: 'In Progress', color: 'text-[var(--brand-yellow)]', icon: FiPlay },
  completed: { label: 'Completed', color: 'text-[var(--skill-completed)]', icon: FiCheck },
};

export default function SkillDetailPanel({
  node,
  status,
  onClose,
  allNodes,
  nodeStatuses,
}: SkillDetailPanelProps) {
  const display = statusDisplay[status];
  const StatusIcon = display.icon;

  const prerequisites = node
    ? allNodes.filter((n) => node.prerequisites.includes(n.id))
    : [];

  const unlocksNext = node
    ? allNodes.filter((n) => n.prerequisites.includes(node.id))
    : [];

  return (
    <AnimatePresence>
      {node && (
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={cn(
            'fixed top-0 right-0 h-full z-50',
            'w-full sm:w-[380px] lg:w-[420px]',
            'bg-[var(--background-secondary)] border-l-2 border-[var(--border-color)]',
            'overflow-y-auto'
          )}
        >
          <div className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-2">
                <StatusIcon className={display.color} size={18} />
                <span className={cn('text-sm font-medium', display.color)}>
                  {display.label}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-md hover:bg-[var(--border-color)]/30 text-[var(--text-secondary)] transition-colors"
                aria-label="Close panel"
              >
                <FiX size={18} />
              </button>
            </div>

            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">
              {node.name}
            </h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6">
              {node.description}
            </p>

            <div className="flex gap-4 mb-6">
              <div className="flex items-center gap-1.5 text-sm text-[var(--text-muted)]">
                <FiClock size={14} />
                <span>{node.estimatedHours} hours</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-[var(--text-muted)]">
                <FiTarget size={14} />
                <span className="capitalize">{node.difficulty}</span>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-3">
                Topics Covered
              </h3>
              <div className="flex flex-wrap gap-2">
                {node.topics.map((topic) => (
                  <span
                    key={topic}
                    className="px-2.5 py-1 text-xs rounded-md bg-[var(--border-color)]/30 text-[var(--text-secondary)] border border-[var(--border-color)]"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            {prerequisites.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-3">
                  Prerequisites
                </h3>
                <div className="space-y-2">
                  {prerequisites.map((prereq) => {
                    const prereqStatus = nodeStatuses[prereq.id] ?? 'locked';
                    const isComplete = prereqStatus === 'completed';
                    return (
                      <div
                        key={prereq.id}
                        className="flex items-center gap-2 text-sm"
                      >
                        {isComplete ? (
                          <FiCheck className="text-[var(--skill-completed)]" size={14} />
                        ) : (
                          <FiLock className="text-[var(--text-muted)]" size={14} />
                        )}
                        <span
                          className={
                            isComplete
                              ? 'text-[var(--text-secondary)]'
                              : 'text-[var(--text-muted)]'
                          }
                        >
                          {prereq.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {unlocksNext.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-3">
                  Unlocks
                </h3>
                <div className="space-y-2">
                  {unlocksNext.map((next) => (
                    <div
                      key={next.id}
                      className="flex items-center gap-2 text-sm text-[var(--text-secondary)]"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-yellow)]" />
                      {next.name}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(status === 'unlocked' || status === 'in-progress') && (
              <button
                className={cn(
                  'w-full py-3 rounded-lg font-semibold text-sm transition-all duration-200',
                  'border-2',
                  status === 'unlocked'
                    ? 'bg-[var(--brand-blue)] border-[var(--brand-blue)] text-white hover:brightness-110'
                    : 'bg-[var(--brand-yellow)] border-[var(--brand-yellow)] text-[var(--accent-fg)] hover:brightness-110'
                )}
              >
                {status === 'unlocked' ? 'Start Learning' : 'Continue Learning'}
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
