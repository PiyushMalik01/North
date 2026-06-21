'use client';

import { motion } from 'framer-motion';
import { Squircle } from '@/components/nest/ui/Squircle';
import { CardLabel } from '@/components/nest/cards/Card';
import { Avatar } from '@/components/huddle/Avatar';
import { mockPresence } from '@/data/gameData';

export function FlockPresence() {
  const activeCount = mockPresence.filter((m) => m.status !== 'away').length;

  return (
    <Squircle radius={22} hover={false}>
      <div className="p-4">
        <CardLabel className="mb-1">flock</CardLabel>
        <p className="mb-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
          {activeCount} around
        </p>
        <ul className="flex flex-col gap-2">
          {mockPresence.map((member, i) => (
            <motion.li
              key={member.name}
              initial={{ opacity: 0, x: 6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06, duration: 0.25 }}
              className="flex items-center gap-2"
            >
              <Avatar name={member.name} size={28} />
              <span className="flex-1 text-sm capitalize" style={{ color: 'var(--text-primary)' }}>
                {member.name}
              </span>
              {member.status === 'in-dive' && (
                <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                  in dive
                </span>
              )}
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{
                  background:
                    member.status === 'away'
                      ? 'color-mix(in srgb, var(--text-muted) 50%, transparent)'
                      : 'var(--text-primary)',
                }}
              />
            </motion.li>
          ))}
        </ul>
      </div>
    </Squircle>
  );
}
