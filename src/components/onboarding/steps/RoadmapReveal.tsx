'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useOnboardingStore } from '@/store/onboardingStore';
import { SKILL_CATEGORIES } from '@/constants';
import {
  FiGlobe,
  FiSmartphone,
  FiBarChart2,
  FiCpu,
  FiTerminal,
  FiCloud,
  FiShield,
  FiPenTool,
  FiDatabase,
  FiCode,
} from 'react-icons/fi';

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  'Web Development': FiGlobe,
  'Mobile Development': FiSmartphone,
  'Data Science': FiBarChart2,
  'Machine Learning': FiCpu,
  'DevOps': FiTerminal,
  'Cloud Computing': FiCloud,
  'Cybersecurity': FiShield,
  'UI/UX Design': FiPenTool,
  'Database': FiDatabase,
  'Programming Languages': FiCode,
};

const NODE_RADIUS = 20;
const NODE_GAP = 100;

export function RoadmapReveal() {
  const router = useRouter();
  const { data, playerCard, markCompleted } = useOnboardingStore();
  const [mounted, setMounted] = useState(false);
  const [accentColor, setAccentColor] = useState('#EFC028');

  useEffect(() => {
    const resolved = getComputedStyle(document.documentElement)
      .getPropertyValue('--accent')
      .trim();
    if (resolved) setAccentColor(resolved);
    const timer = setTimeout(() => setMounted(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const skills = useMemo(() => {
    const interestIndices = data.interests.map(Number);
    const picked = interestIndices
      .filter((i) => i >= 0 && i < SKILL_CATEGORIES.length)
      .map((i) => SKILL_CATEGORIES[i]);

    // Fill to 5 from defaults if needed
    const defaults = SKILL_CATEGORIES.filter((c) => !picked.includes(c));
    const result = [...picked];
    let di = 0;
    while (result.length < 5 && di < defaults.length) {
      result.push(defaults[di]);
      di++;
    }
    return result.slice(0, 5);
  }, [data.interests]);

  function handleEnter() {
    markCompleted();
    router.push('/dashboard');
  }

  // SVG layout: 5 nodes in a row, centred with padding for labels
  const padding = 30;
  const svgWidth = 4 * NODE_GAP + NODE_RADIUS * 2 + padding * 2;
  const svgHeight = 100;
  const nodeY = svgHeight / 2;

  return (
    <div className="flex flex-col items-center justify-center min-h-full px-6">
      <div className="w-full max-w-xl flex flex-col items-center gap-8">
        {/* Mini identity line */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={mounted ? { opacity: 1 } : {}}
          transition={{ duration: 0.4 }}
          className="text-sm text-[var(--text-muted)] tracking-wide"
        >
          {playerCard?.personalityType ?? 'Your path'}
          {data.college ? ` · ${data.college}` : ''}
        </motion.p>

        {/* Roadmap SVG */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="w-full overflow-x-auto"
        >
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight + 40}`}
            className="mx-auto block"
            style={{ maxWidth: svgWidth, width: '100%' }}
          >
            {/* Connecting lines */}
            {skills.slice(0, 4).map((_, i) => {
              const x1 = padding + NODE_RADIUS + i * NODE_GAP;
              const x2 = padding + NODE_RADIUS + (i + 1) * NODE_GAP;
              return (
                <motion.line
                  key={`line-${i}`}
                  x1={x1}
                  y1={nodeY}
                  x2={x2}
                  y2={nodeY}
                  stroke={accentColor}
                  strokeWidth={2}
                  initial={{ pathLength: 0, opacity: 0.3 }}
                  animate={mounted ? { pathLength: 1, opacity: 1 } : {}}
                  transition={{ delay: 0.5 + i * 0.3, duration: 0.4, ease: 'easeOut' }}
                />
              );
            })}

            {/* Nodes */}
            {skills.map((skill, i) => {
              const cx = padding + NODE_RADIUS + i * NODE_GAP;
              const nodeDelay = 0.5 + i * 0.3;

              return (
                <g key={skill}>
                  {/* Glow behind active node */}
                  <motion.circle
                    cx={cx}
                    cy={nodeY}
                    r={NODE_RADIUS + 4}
                    fill="none"
                    stroke={accentColor}
                    strokeWidth={1}
                    initial={{ opacity: 0 }}
                    animate={mounted ? { opacity: [0, 0.3, 0.15] } : {}}
                    transition={{ delay: nodeDelay + 0.2, duration: 0.6 }}
                  />

                  {/* Node circle */}
                  <motion.circle
                    cx={cx}
                    cy={nodeY}
                    r={NODE_RADIUS}
                    fill="none"
                    strokeWidth={2}
                    initial={{ stroke: 'var(--border-color)', opacity: 0.4 }}
                    animate={
                      mounted
                        ? { stroke: accentColor, opacity: 1 }
                        : {}
                    }
                    transition={{ delay: nodeDelay, duration: 0.4 }}
                  />

                  {/* Label below */}
                  <motion.text
                    x={cx}
                    y={nodeY + NODE_RADIUS + 16}
                    textAnchor="middle"
                    fontSize={10}
                    className="font-[family-name:var(--font-sans)]"
                    initial={{ fill: 'var(--text-muted)', opacity: 0 }}
                    animate={mounted ? { opacity: 1 } : {}}
                    transition={{ delay: nodeDelay + 0.15, duration: 0.4 }}
                  >
                    {skill.length > 14 ? skill.slice(0, 13) + '…' : skill}
                  </motion.text>
                </g>
              );
            })}
          </svg>

          {/* Icon row underneath SVG — positioned to align with circles */}
          <div
            className="flex justify-between mx-auto"
            style={{ maxWidth: svgWidth, paddingLeft: 0, paddingRight: 0 }}
          >
            {skills.map((skill, i) => {
              const Icon = ICON_MAP[skill];
              const nodeDelay = 0.5 + i * 0.3;
              return (
                <motion.div
                  key={`icon-${skill}`}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={mounted ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: nodeDelay + 0.1, duration: 0.35 }}
                  className="flex justify-center"
                  style={{ width: NODE_RADIUS * 2 }}
                >
                  {Icon && (
                    <Icon size={14} className="text-[var(--accent-text)]" />
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Promise text */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 2.2, duration: 0.5 }}
          className="text-center"
        >
          <h3
            className={cn(
              'font-[family-name:var(--font-oswald)] text-xl',
              'text-[var(--text-primary)] whitespace-pre-line',
            )}
          >
            {`here’s your path, ${data.name}.\nlet’s get started.`}
          </h3>
        </motion.div>

        {/* CTA button */}
        <motion.button
          type="button"
          onClick={handleEnter}
          initial={{ opacity: 0, y: 12 }}
          animate={
            mounted
              ? { opacity: 1, y: 0, scale: [1, 1.02, 1] }
              : {}
          }
          transition={{
            opacity: { delay: 2.5, duration: 0.4 },
            y: { delay: 2.5, duration: 0.4 },
            scale: { delay: 3, duration: 2, repeat: Infinity, ease: 'easeInOut' },
          }}
          className={cn(
            'px-8 py-3 rounded-xl text-sm font-semibold cursor-pointer',
            'bg-[var(--accent)] text-[var(--accent-fg)]',
            'hover:bg-[var(--accent-hover)] transition-colors duration-150',
          )}
        >
          Enter Dashboard &rarr;
        </motion.button>
      </div>
    </div>
  );
}
