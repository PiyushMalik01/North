import React from 'react';

export const CTA = () => {
  return (
    <section className="py-20 gradient-glow relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-6">
          Ready to move North?
        </h2>
        <p className="text-xl text-[var(--text-secondary)] mb-8">
          Join thousands of students transforming their learning journey
        </p>
        <div className="flex flex-col sm:flex-row gap-0 justify-center max-w-2xl mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-6 py-4 rounded-l-lg sm:rounded-r-none rounded-r-lg sm:rounded-l-lg text-lg bg-white/95 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 border-2 border-white"
          />
          <button className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-r-lg sm:rounded-l-none rounded-l-lg sm:rounded-r-lg font-semibold text-lg transition-all whitespace-nowrap border-2 border-white shadow-lg hover:shadow-xl">
            Sign up for North
          </button>
        </div>
      </div>
    </section>
  );
};
