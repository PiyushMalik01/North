'use client';

import { useRef, MouseEvent } from 'react';
import { cn } from '@/lib/utils';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useGsapReveal } from '@/hooks/useGsapReveal';
import { useStaggerReveal } from '@/hooks/useStaggerReveal';

const features = [
  {
    label: 'Skill Trees',
    title: 'Know exactly what to learn next',
    description:
      'Prerequisite-mapped paths replace random tutorials. Follow a clear sequence from beginner to job-ready in any domain.',
  },
  {
    label: 'AI Guidance',
    title: 'Personalized, not one-size-fits-all',
    description:
      'AI recommends your learning path based on where you are and where you want to go. Code hints when you\'re stuck, not lectures.',
  },
  {
    label: 'Assessments',
    title: 'Prove it, don\'t just claim it',
    description:
      'Coding challenges, reasoning tasks, and rapid quizzes that verify real capability — not video completion badges.',
  },
  {
    label: 'Skill Profile',
    title: 'A profile recruiters actually read',
    description:
      'Verified skill depth, project evidence, and growth trajectory. Not a keyword list on a PDF.',
  },
  {
    label: 'Gamification',
    title: 'Stay consistent without burning out',
    description:
      'Depth, execution, consistency, collaboration — tracked attributes with streaks and quests that keep momentum.',
  },
  {
    label: 'Career',
    title: 'Get found by companies that care',
    description:
      'Employers search by verified skills, not keywords. Your profile speaks before your resume does.',
  },
];

function MagneticCard({ feature }: { feature: typeof features[number] }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [4, -4]), { stiffness: 250, damping: 25 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-4, 4]), { stiffness: 250, damping: 25 });

  function handleMouse(e: MouseEvent) {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      className={cn(
        'bg-[var(--background)] p-6 lg:p-7',
        'transition-colors duration-200',
        'hover:bg-[var(--surface-1)]',
        'will-change-transform'
      )}
    >
      <span className="text-[0.6875rem] font-medium uppercase tracking-[0.06em] text-[var(--accent-text)]">
        {feature.label}
      </span>
      <h3 className="text-[1.0625rem] font-medium text-[var(--text-primary)] mt-2 mb-2 leading-[1.3] tracking-[-0.01em]">
        {feature.title}
      </h3>
      <p className="text-sm text-[var(--text-secondary)] leading-[1.6]">
        {feature.description}
      </p>
    </motion.div>
  );
}

export const Features = () => {
  const headingRef = useGsapReveal<HTMLDivElement>();
  const gridRef = useStaggerReveal<HTMLDivElement>({ stagger: 0.08, start: 'top 85%' });

  return (
    <section id="features" className="py-16 lg:py-24 relative">
      <div className="absolute inset-0 gradient-glow" />
      <div className="relative z-10 max-w-[1100px] mx-auto px-6 md:px-12">
        <div ref={headingRef} className="text-center mb-10 lg:mb-14 opacity-0">
          <p className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--text-muted)] mb-3">
            What you get
          </p>
          <h2 className={cn(
            'font-semibold text-[var(--text-primary)]',
            'text-[clamp(1.75rem,2.5vw+0.75rem,2.5rem)] leading-[1.15] tracking-[-0.02em]'
          )}>
            One platform. Zero guesswork.
          </h2>
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--border-color)] rounded-2xl overflow-hidden"
          style={{ perspective: '800px' }}
        >
          {features.map((f) => (
            <MagneticCard key={f.title} feature={f} />
          ))}
        </div>
      </div>
    </section>
  );
};
