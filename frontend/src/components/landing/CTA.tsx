import React from 'react';

export const CTA = () => {
  return (
    <section className="py-16 sm:py-20 lg:py-28 xl:py-32 gradient-glow relative overflow-hidden">
      <div className="max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto px-4 min-[400px]:px-6 sm:px-8 lg:px-12 xl:px-16 text-center relative z-10">
        <h2 className="text-2xl min-[400px]:text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-[var(--text-primary)] mb-6 lg:mb-8 leading-tight">
          Ready to move North?
        </h2>
        <p className="text-sm min-[400px]:text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-[var(--text-secondary)] mb-8 lg:mb-12 leading-relaxed">
          Join thousands of students<br className="sm:hidden" /> transforming their learning journey
        </p>
        <div className="flex flex-col sm:flex-row gap-0 justify-center max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-3 min-[400px]:px-6 min-[400px]:py-4 lg:px-8 lg:py-5 xl:px-10 xl:py-6 rounded-l-lg sm:rounded-r-none rounded-r-lg sm:rounded-l-lg text-sm min-[400px]:text-base lg:text-lg xl:text-xl bg-white/95 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 border-2 border-white"
          />
          <button className="px-6 py-3 min-[400px]:px-8 min-[400px]:py-4 lg:px-10 lg:py-5 xl:px-12 xl:py-6 bg-green-600 hover:bg-green-700 text-white rounded-r-lg sm:rounded-l-none rounded-l-lg sm:rounded-r-lg font-semibold text-sm min-[400px]:text-base lg:text-lg xl:text-xl transition-all whitespace-nowrap border-2 border-white shadow-lg hover:shadow-xl">
            Sign up for North
          </button>
        </div>
      </div>
    </section>
  );
};
