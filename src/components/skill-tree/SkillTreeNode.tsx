'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { NODE_WIDTH, NODE_HEIGHT } from '@/lib/skills/layout';
import { FiLock, FiCheck, FiPlay, FiChevronRight } from 'react-icons/fi';
import type { SkillNodeData } from '@/data/skill-trees/web-development';

type Status = 'locked' | 'unlocked' | 'in-progress' | 'completed';

interface SkillTreeNodeProps {
  node: SkillNodeData;
  x: number;
  y: number;
  status: Status;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const statusConfig: Record<
  Status,
  { border: string; bg: string; shadow: string; icon: typeof FiLock }
> = {
  locked: {
    border: 'border-[var(--border-color)]',
    bg: 'bg-[var(--background-secondary)]',
    shadow: '',
    icon: FiLock,
  },
  unlocked: {
    border: 'border-[var(--skill-unlocked)]',
    bg: 'bg-[var(--card-bg)]',
    shadow: 'shadow-[0_0_20px_rgba(88,166,255,0.15)]',
    icon: FiChevronRight,
  },
  'in-progress': {
    border: 'border-[var(--brand-yellow)]',
    bg: 'bg-[var(--card-bg)]',
    shadow: 'shadow-[0_0_20px_rgba(239,192,40,0.2)]',
    icon: FiPlay,
  },
  completed: {
    border: 'border-[var(--skill-completed)]',
    bg: 'bg-[var(--card-bg)]',
    shadow: 'shadow-[0_0_20px_rgba(63,185,80,0.15)]',
    icon: FiCheck,
  },
};

const difficultyLabel: Record<string, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

export default function SkillTreeNode({
  node,
  x,
  y,
  status,
  isSelected,
  onSelect,
}: SkillTreeNodeProps) {
  const config = statusConfig[status];
  const StatusIcon = config.icon;
  const isLocked = status === 'locked';

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: y / 2000 }}
      onClick={() => onSelect(node.id)}
      className={cn(
        'absolute border-2 rounded-lg cursor-pointer select-none',
        'flex items-center gap-3 px-4',
        'transition-all duration-200',
        config.border,
        config.bg,
        config.shadow,
        isLocked && 'opacity-50 cursor-default',
        isSelected && 'ring-2 ring-[var(--brand-yellow)] ring-offset-2 ring-offset-[var(--background)]',
        !isLocked && 'hover:translate-y-[-2px] hover:brightness-110'
      )}
      style={{
        left: x,
        top: y,
        width: NODE_WIDTH,
        height: NODE_HEIGHT,
      }}
      aria-label={`${node.name} — ${status}`}
    >
      <div
        className={cn(
          'flex-shrink-0 w-9 h-9 rounded-md flex items-center justify-center border',
          status === 'completed' && 'bg-[var(--skill-completed)] border-[var(--skill-completed)] text-black',
          status === 'in-progress' && 'bg-[var(--brand-yellow)] border-[var(--brand-yellow)] text-[var(--accent-fg)]',
          status === 'unlocked' && 'bg-[var(--skill-unlocked)]/10 border-[var(--skill-unlocked)] text-[var(--skill-unlocked)]',
          status === 'locked' && 'bg-[var(--border-color)]/30 border-[var(--border-color)] text-[var(--text-muted)]'
        )}
      >
        <StatusIcon size={16} />
      </div>

      <div className="flex-1 min-w-0 text-left">
        <p
          className={cn(
            'text-sm font-semibold truncate',
            isLocked ? 'text-[var(--text-muted)]' : 'text-[var(--text-primary)]'
          )}
        >
          {node.name}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[11px] text-[var(--text-muted)]">
            {node.estimatedHours}h
          </span>
          <span className="text-[11px] text-[var(--text-muted)]">·</span>
          <span className="text-[11px] text-[var(--text-muted)]">
            {difficultyLabel[node.difficulty]}
          </span>
        </div>
      </div>
    </motion.button>
  );
}
