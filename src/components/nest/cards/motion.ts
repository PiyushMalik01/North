import type { Variants } from 'framer-motion';

/** Parent container: staggers its card children in on mount. */
export const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
};

/** A single card: fades + rises into place. */
export const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.2, 0.7, 0.3, 1] } },
};
