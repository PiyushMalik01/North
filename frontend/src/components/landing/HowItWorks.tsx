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
    <section className="py-20 gradient-glow relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">
            How It Works
          </h2>
          <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
            No guesswork. No random learning. Just direction.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((item, index) => (
            <div key={index} className="relative">
              <div className="bg-[var(--background-primary)] p-6 rounded-xl border border-[var(--border-color)] h-full hover:border-[var(--border-hover)] transition-colors">
                <div className="text-5xl font-bold gradient-brand-text mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                  {item.title}
                </h3>
                <p className="text-[var(--text-muted)]">{item.description}</p>
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
