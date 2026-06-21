'use client';

import { motion } from 'framer-motion';
import { mockPlayer } from '@/data/gameData';
import { Card, CardLabel } from '@/components/nest/cards/Card';

const CX = 100;
const CY = 100;
const MAX_R = 70;
const RINGS = [0.33, 0.66, 1];
const N = 5;

function toRad(deg: number) {
  return (deg * Math.PI) / 180;
}

function axisAngle(i: number) {
  return toRad(-90 + i * 72);
}

function polarPt(angle: number, r: number) {
  return { x: CX + r * Math.cos(angle), y: CY + r * Math.sin(angle) };
}

function pentagonPoints(r: number): string {
  return Array.from({ length: N }, (_, i) => {
    const pt = polarPt(axisAngle(i), r);
    return `${pt.x},${pt.y}`;
  }).join(' ');
}

function dataPoints(values: number[]): string {
  return values
    .map((v, i) => {
      const pt = polarPt(axisAngle(i), MAX_R * (v / 100));
      return `${pt.x},${pt.y}`;
    })
    .join(' ');
}

const LABEL_PADDING = 13;

function labelPosition(i: number) {
  const angle = axisAngle(i);
  const x = CX + (MAX_R + LABEL_PADDING) * Math.cos(angle);
  const y = CY + (MAX_R + LABEL_PADDING) * Math.sin(angle);
  return { x, y };
}

const GRID_STROKE = 'color-mix(in srgb, var(--text-muted) 18%, transparent)';
const DATA_FILL = 'color-mix(in srgb, var(--text-primary) 12%, transparent)';

export function StatsRadar() {
  const attrs = mockPlayer.attributes;
  const values = attrs.map((a) => a.value);
  const pts = dataPoints(values);

  return (
    <Card>
      <CardLabel className="mb-4">stats</CardLabel>
      <svg
        viewBox="0 0 200 200"
        width="100%"
        style={{ maxWidth: 220, display: 'block', margin: '0 auto' }}
        aria-label="Stats radar chart"
      >
        {/* Grid rings */}
        {RINGS.map((frac) => (
          <polygon
            key={frac}
            points={pentagonPoints(MAX_R * frac)}
            fill="none"
            strokeWidth={1}
            style={{ stroke: GRID_STROKE }}
          />
        ))}

        {/* Spokes */}
        {Array.from({ length: N }, (_, i) => {
          const outer = polarPt(axisAngle(i), MAX_R);
          return (
            <line
              key={i}
              x1={CX}
              y1={CY}
              x2={outer.x}
              y2={outer.y}
              strokeWidth={1}
              style={{ stroke: GRID_STROKE }}
            />
          );
        })}

        {/* Data polygon — animated */}
        <motion.g
          initial={{ scale: 0.4, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 180, damping: 18 }}
          style={{ transformOrigin: `${CX}px ${CY}px` }}
        >
          <polygon
            points={pts}
            strokeWidth={1.5}
            strokeLinejoin="round"
            style={{ fill: DATA_FILL, stroke: 'var(--text-primary)' }}
          />
        </motion.g>

        {/* Vertex labels */}
        {attrs.map((attr, i) => {
          const { x, y } = labelPosition(i);
          return (
            <text
              key={attr.key}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={9}
              style={{ fill: 'var(--text-secondary)', fontFamily: 'inherit', letterSpacing: '0.04em' }}
            >
              {attr.label.toLowerCase()}
            </text>
          );
        })}
      </svg>
    </Card>
  );
}
