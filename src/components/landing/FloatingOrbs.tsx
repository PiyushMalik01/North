'use client';

import { motion } from 'framer-motion';

export function FloatingOrbs() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full"
        style={{
          top: '-8%',
          left: '15%',
          background: 'radial-gradient(circle, var(--brand-yellow) 0%, transparent 70%)',
          opacity: 0.04,
          filter: 'blur(80px)',
        }}
        animate={{ x: [0, 40, 0], y: [0, 25, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full"
        style={{
          bottom: '5%',
          right: '8%',
          background: 'radial-gradient(circle, var(--brand-blue) 0%, transparent 70%)',
          opacity: 0.035,
          filter: 'blur(80px)',
        }}
        animate={{ x: [0, -35, 0], y: [0, -20, 0] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}
