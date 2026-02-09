import React from 'react';

const steps = [
  {
    step: '01',
    title: 'Choose Your Path',
    description: 'AI recommends skills based on your profile and goals. Select your learning roadmap.',
  },
  {
    step: '02',
    title: 'Learn & Progress',
    description: 'Navigate skill trees, access curated content, and get AI assistance along the way.',
  },
  {
    step: '03',
    title: 'Prove Your Skills',
    description: 'Complete assessments, build projects, and demonstrate real capability.',
  },
  {
    step: '04',
    title: 'Build Your Profile',
    description: 'Generate dynamic skill graphs and resumes that showcase authentic growth.',
  },
];

export const HowItWorks = () => {
  return (
    <section className="py-16 sm:py-20 lg:py-28 xl:py-32 gradient-glow relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 min-[400px]:px-6 sm:px-8 lg:px-12 xl:px-16">
        <div className="text-center mb-12 sm:mb-16 lg:mb-20 xl:mb-24">
          <h2 className="text-2xl min-[400px]:text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-[var(--text-primary)] mb-4 lg:mb-6 leading-tight">
            How It Works
          </h2>
          <p className="text-sm min-[400px]:text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-[var(--text-secondary)] max-w-xl sm:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto leading-relaxed">
            No guesswork. No random learning.<br className="sm:hidden" /> Just direction.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 xl:gap-10">
          {steps.map((item, index) => (
            <div key={index} className="relative">
              <div className="bg-[var(--background-primary)] p-5 sm:p-6 lg:p-8 xl:p-10 rounded-xl border border-[var(--border-color)] h-full hover:border-[var(--border-hover)] transition-colors">
                <div className="text-3xl min-[400px]:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold gradient-brand-text mb-3 sm:mb-4 lg:mb-6 leading-none">
                  {item.step}
                </div>
                <h3 className="text-base min-[400px]:text-lg md:text-xl lg:text-2xl font-semibold text-[var(--text-primary)] mb-2 lg:mb-3 leading-tight">
                  {item.title}
                </h3>
                <p className="text-sm min-[400px]:text-base md:text-lg lg:text-xl text-[var(--text-muted)] leading-relaxed">{item.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-[var(--border-color)]" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
