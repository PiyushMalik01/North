'use client';

import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { cn } from '@/lib/utils';
import {
  computeLayout,
  computeEdges,
  NODE_WIDTH,
  NODE_HEIGHT,
} from '@/lib/skills/layout';
import SkillTreeNode from './SkillTreeNode';
import SkillTreeEdges from './SkillTreeEdges';
import SkillDetailPanel from './SkillDetailPanel';
import { FiZoomIn, FiZoomOut, FiMaximize2 } from 'react-icons/fi';
import type {
  SkillNodeData,
  SkillTreeData,
  MockUserProgress,
} from '@/data/skill-trees/web-development';

interface SkillTreeCanvasProps {
  tree: SkillTreeData;
  progress: MockUserProgress;
}

const MIN_ZOOM = 0.3;
const MAX_ZOOM = 1.8;
const ZOOM_STEP = 0.15;
const PADDING = 80;

export default function SkillTreeCanvas({
  tree,
  progress,
}: SkillTreeCanvasProps) {
  const positions = computeLayout(tree.nodes);
  const edges = computeEdges(tree.nodes, positions);
  const nodeMap = new Map<string, SkillNodeData>(
    tree.nodes.map((n) => [n.id, n])
  );

  const maxX = Math.max(...positions.map((p) => p.x)) + NODE_WIDTH + PADDING;
  const maxY = Math.max(...positions.map((p) => p.y)) + NODE_HEIGHT + PADDING;

  const containerRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 0.85 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const centerView = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const scale = Math.min(
      (rect.width - 40) / maxX,
      (rect.height - 40) / maxY,
      1
    );
    setTransform({
      x: (rect.width - maxX * scale) / 2,
      y: 30,
      scale: Math.max(scale, MIN_ZOOM),
    });
  }, [maxX, maxY]);

  useEffect(() => {
    centerView();
  }, [centerView]);

  function handleWheel(e: React.WheelEvent) {
    e.stopPropagation();
    const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
    setTransform((prev) => ({
      ...prev,
      scale: Math.min(Math.max(prev.scale + delta, MIN_ZOOM), MAX_ZOOM),
    }));
  }

  function handlePointerDown(e: React.PointerEvent) {
    if (e.button !== 0) return;
    const target = e.target as HTMLElement;
    if (target.closest('button[aria-label]') && !target.closest('[data-canvas-control]')) return;

    setIsDragging(true);
    dragStart.current = {
      x: e.clientX - transform.x,
      y: e.clientY - transform.y,
    };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!isDragging) return;
    setTransform((prev) => ({
      ...prev,
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    }));
  }

  function handlePointerUp() {
    setIsDragging(false);
  }

  const zoom = useCallback((direction: 1 | -1) => {
    setTransform((prev) => ({
      ...prev,
      scale: Math.min(
        Math.max(prev.scale + direction * ZOOM_STEP, MIN_ZOOM),
        MAX_ZOOM
      ),
    }));
  }, []);

  const canvasControls = useMemo(
    () => [
      { icon: FiZoomIn, label: 'Zoom in', action: () => zoom(1) },
      { icon: FiZoomOut, label: 'Zoom out', action: () => zoom(-1) },
      { icon: FiMaximize2, label: 'Reset view', action: centerView },
    ],
    [zoom, centerView]
  );

  const selectedNode = selectedNodeId ? nodeMap.get(selectedNodeId) ?? null : null;
  const selectedStatus = selectedNodeId
    ? progress[selectedNodeId] ?? 'locked'
    : 'locked';

  const completed = Object.values(progress).filter((s) => s === 'completed').length;
  const total = tree.nodes.length;

  return (
    <div className="relative w-full h-full overflow-hidden bg-[var(--background)]">
      <div
        ref={containerRef}
        className={cn(
          'w-full h-full',
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        )}
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        role="application"
        aria-label="Skill tree canvas — drag to pan, scroll to zoom"
      >
        <div
          className="relative origin-top-left"
          style={{
            transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
            width: maxX,
            height: maxY,
            willChange: 'transform',
          }}
        >
          <SkillTreeEdges
            edges={edges}
            nodeStatuses={progress}
            svgWidth={maxX}
            svgHeight={maxY}
          />

          {positions.map((pos) => {
            const node = nodeMap.get(pos.id);
            if (!node) return null;
            return (
              <SkillTreeNode
                key={pos.id}
                node={node}
                x={pos.x}
                y={pos.y}
                status={progress[pos.id] ?? 'locked'}
                isSelected={selectedNodeId === pos.id}
                onSelect={setSelectedNodeId}
              />
            );
          })}
        </div>
      </div>

      <div className="absolute top-4 left-4 z-10">
        <div className="px-4 py-2 rounded-lg bg-[var(--background-secondary)]/90 backdrop-blur-sm border border-[var(--border-color)]">
          <h2 className="text-sm font-bold text-[var(--text-primary)]">
            {tree.name}
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 h-1.5 rounded-full bg-[var(--border-color)] w-24">
              <div
                className="h-full rounded-full bg-[var(--skill-completed)] transition-all duration-500"
                style={{ width: `${(completed / total) * 100}%` }}
              />
            </div>
            <span className="text-xs text-[var(--text-muted)]">
              {completed}/{total}
            </span>
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-4 right-4 z-10 flex flex-col gap-1"
        data-canvas-control
      >
        {/* eslint-disable-next-line react-hooks/refs -- actions only access refs inside onClick callbacks, never during render */}
        {canvasControls.map(({ icon: Icon, label, action }) => (
          <button
            key={label}
            onClick={action}
            className="p-2 rounded-md bg-[var(--background-secondary)]/90 backdrop-blur-sm border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--card-hover)] transition-colors"
            aria-label={label}
          >
            <Icon size={16} />
          </button>
        ))}
      </div>

      <div className="absolute bottom-4 left-4 z-10 flex items-center gap-3 text-[11px] text-[var(--text-muted)]">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-[var(--skill-completed)]" />
          Completed
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-[var(--brand-yellow)]" />
          In Progress
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-[var(--skill-unlocked)]" />
          Available
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-[var(--border-color)]" />
          Locked
        </span>
      </div>

      <SkillDetailPanel
        node={selectedNode}
        status={selectedStatus}
        onClose={() => setSelectedNodeId(null)}
        allNodes={tree.nodes}
        nodeStatuses={progress}
      />

      {selectedNode && (
        <div
          className="fixed inset-0 z-40 bg-black/20"
          onClick={() => setSelectedNodeId(null)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
