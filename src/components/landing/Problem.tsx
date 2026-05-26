'use client';

import { cn } from '@/lib/utils';
import { useGsapReveal } from '@/hooks/useGsapReveal';
import { useStaggerReveal } from '@/hooks/useStaggerReveal';
import Image from 'next/image';

const painPoints = [
  {
    before: 'You finish a course',
    after: 'but can\'t build the thing it was supposed to teach you.',
  },
  {
    before: 'You check LinkedIn',
    after: 'and everyone seems three steps ahead — except they\'re guessing too.',
  },
  {
    before: 'You Google "what to learn"',
    after: 'and get 47 lists that contradict each other.',
  },
];

export const Problem = () => {
  const headingRef = useGsapReveal<HTMLDivElement>();
  const listRef = useStaggerReveal<HTMLDivElement>({ stagger: 0.12 });
  const imageRef = useGsapReveal<HTMLDivElement>({ from: { opacity: 0, scale: 0.92 }, to: { opacity: 1, scale: 1 } });

  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-[1100px] mx-auto px-6 md:px-12">
        <div className="flex flex-col lg:flex-row lg:items-center gap-10 lg:gap-16">
          {/* Left — heading + cards */}
          <div className="flex-1">
            <div ref={headingRef} className="mb-8 lg:mb-10 opacity-0">
              <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#EF4444] mb-3">
                The real problem
              </p>
              <h2 className={cn(
                'font-semibold text-[var(--text-primary)]',
                'text-[clamp(1.75rem,2.5vw+0.75rem,2.5rem)] leading-[1.15] tracking-[-0.02em]'
              )}>
                You don&apos;t lack talent.
                <br />
                You lack a map.
              </h2>
              <p className="text-[var(--text-secondary)] mt-3 max-w-[480px] text-base leading-[1.6]">
                Indian colleges hand you a syllabus, not a skill roadmap. So you
                graduate with a degree but no proof of what you can actually do.
              </p>
            </div>

            <div ref={listRef} className="space-y-3">
              {painPoints.map((point) => (
                <div
                  key={point.before}
                  className={cn(
                    'p-4 lg:p-5 rounded-xl group',
                    'bg-[#EF4444]/5 border border-[#EF4444]/15',
                    'flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3',
                    'transition-all duration-200',
                    'hover:border-[#EF4444]/40 hover:bg-[#EF4444]/10'
                  )}
                >
                  <span className="text-sm font-medium text-[var(--text-primary)] shrink-0 transition-colors duration-200 group-hover:text-[#EF4444]">
                    {point.before}
                  </span>
                  <span className="hidden sm:block w-6 h-px bg-[#EF4444]/20 transition-colors duration-200 group-hover:bg-[#EF4444]/40" />
                  <span className="text-sm text-[var(--text-muted)]">
                    {point.after}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — GIF */}
          <div ref={imageRef} className="opacity-0 shrink-0 w-full lg:w-[42%]">
            <div className="relative rounded-2xl overflow-hidden border-2 border-[#EF4444]/20">
              <Image
                src="/images/compass.gif"
                alt="Animated illustration of a person stuck between rigid walls — representing feeling trapped in the education system"
                width={560}
                height={400}
                className="w-full h-auto"
                unoptimized
              />
              <p className="absolute bottom-3 left-4 text-xs font-medium text-white/70">
                Feels familiar?
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
