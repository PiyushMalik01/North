'use client';

import { motion } from 'framer-motion';
import type { EdgeData } from '@/lib/skills/layout';

type Status = 'locked' | 'unlocked' | 'in-progress' | 'completed';

interface SkillTreeEdgesProps {
  edges: EdgeData[];
  nodeStatuses: Record<string, Status>;
  svgWidth: number;
  svgHeight: number;
}

function getEdgeColor(
  sourceStatus: Status,
  targetStatus: Status
): { stroke: string; opacity: number; dashArray?: string } {
  if (sourceStatus === 'completed' && targetStatus === 'completed') {
    return { stroke: 'var(--skill-completed)', opacity: 0.7 };
  }
  if (
    sourceStatus === 'completed' &&
    (targetStatus === 'in-progress' || targetStatus === 'unlocked')
  ) {
    return { stroke: 'var(--skill-unlocked)', opacity: 0.6, dashArray: '6 4' };
  }
  return { stroke: 'var(--border-color)', opacity: 0.3 };
}

function buildPath(edge: EdgeData): string {
  const midY = (edge.sourceY + edge.targetY) / 2;
  return [
    `M ${edge.sourceX} ${edge.sourceY}`,
    `C ${edge.sourceX} ${midY}, ${edge.targetX} ${midY}, ${edge.targetX} ${edge.targetY}`,
  ].join(' ');
}

export default function SkillTreeEdges({
  edges,
  nodeStatuses,
  svgWidth,
  svgHeight,
}: SkillTreeEdgesProps) {
  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      width={svgWidth}
      height={svgHeight}
      aria-hidden="true"
    >
      {edges.map((edge, i) => {
        const sourceStatus = nodeStatuses[edge.sourceId] ?? 'locked';
        const targetStatus = nodeStatuses[edge.targetId] ?? 'locked';
        const { stroke, opacity, dashArray } = getEdgeColor(
          sourceStatus,
          targetStatus
        );
        const path = buildPath(edge);

        return (
          <motion.path
            key={edge.id}
            d={path}
            fill="none"
            stroke={stroke}
            strokeWidth={2}
            strokeLinecap="round"
            strokeDasharray={dashArray}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity }}
            transition={{ duration: 0.6, delay: 0.1 + i * 0.03 }}
          />
        );
      })}
    </svg>
  );
}
