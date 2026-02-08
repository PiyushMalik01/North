import React from 'react';

const features = [
  {
    title: 'Skill Tree Progression',
    description: 'Navigate structured learning paths with prerequisite mapping and parallel progression.',
    icon: '🌳',
  },
  {
    title: 'AI-Assisted Learning',
    description: 'Get personalized roadmaps, code hints, and contextual guidance from AI.',
    icon: '🤖',
  },
  {
    title: 'Real Assessments',
    description: 'Prove skills through coding challenges, reasoning tasks, and rapid-fire quizzes.',
    icon: '✅',
  },
  {
    title: 'Dynamic Skill Profile',
    description: 'Build a verifiable skill graph that showcases your real capabilities.',
    icon: '📊',
  },
  {
    title: 'Gamified Engagement',
    description: 'Track attributes like depth, execution, consistency, and collaboration.',
    icon: '🎮',
  },
  {
    title: 'Talent Discovery',
    description: 'Connect with companies looking for skill-first candidates.',
    icon: '🎯',
  },
];

export const Features = () => {
  return (
    <section className="py-20 pt-8 gradient-glow relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">
            Stop drifting. Start moving North.
          </h2>
          <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
            A comprehensive platform combining learning, assessment, and career growth
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-[var(--background-secondary)] border border-[var(--border-color)] rounded-xl hover:border-[var(--border-hover)] hover:bg-[var(--card-hover)] transition-all"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                {feature.title}
              </h3>
              <p className="text-[var(--text-muted)]">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
