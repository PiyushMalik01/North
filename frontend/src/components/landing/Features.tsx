import React from 'react';

const features = [
  {
    title: 'Skill Tree Progression',
    description: 'Navigate structured learning paths with prerequisite mapping and parallel progression.',
  },
  {
    title: 'AI-Assisted Learning',
    description: 'Get personalized roadmaps, code hints, and contextual guidance from AI.',
  },
  {
    title: 'Real Assessments',
    description: 'Prove skills through coding challenges, reasoning tasks, and rapid-fire quizzes.',
  },
  {
    title: 'Dynamic Skill Profile',
    description: 'Build a verifiable skill graph that showcases your real capabilities.',
  },
  {
    title: 'Gamified Engagement',
    description: 'Track attributes like depth, execution, consistency, and collaboration.',
  },
  {
    title: 'Talent Discovery',
    description: 'Connect with companies looking for skill-first candidates.',
  },
];

export const Features = () => {
  return (
    <section className="py-16 sm:py-20 lg:py-28 xl:py-32 gradient-glow relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 min-[400px]:px-6 sm:px-8 lg:px-12 xl:px-16">
        <div className="text-center mb-12 sm:mb-16 lg:mb-20 xl:mb-24">
          <h2 className="text-2xl min-[400px]:text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-[var(--text-primary)] mb-4 lg:mb-6 leading-tight">
            Stop drifting.<br />Start moving North.
          </h2>
          <p className="text-sm min-[400px]:text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-[var(--text-secondary)] max-w-xl sm:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto leading-relaxed">
            A comprehensive platform combining<br className="sm:hidden" /> learning, assessment, and career growth
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 xl:gap-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="brutalist-card group"
            >
              <h3 className="text-base min-[400px]:text-lg md:text-xl lg:text-2xl font-semibold text-[var(--text-primary)] mb-4 pb-4 border-b-[3px] border-[var(--text-primary)] leading-tight">
                {feature.title}
              </h3>
              
              <p className="text-sm min-[400px]:text-base md:text-lg lg:text-xl text-[var(--text-secondary)] leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
