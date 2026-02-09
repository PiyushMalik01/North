'use client';

import React, { useEffect, useState } from 'react';

export const Hero = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate scale: starts at 1, zooms out to 0.95 as you scroll down
  const scale = Math.max(0.95, 1 - scrollY / 2000);

  return (
    <section className="relative min-h-screen flex items-center justify-center gradient-hero overflow-hidden pb-16">
      <div 
        className="max-w-7xl mx-auto px-4 min-[400px]:px-6 sm:px-8 lg:px-12 xl:px-16 text-center transition-transform duration-300 ease-out"
        style={{ transform: `scale(${scale})` }}
      >
        <h1 className="text-3xl min-[400px]:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-[var(--text-primary)] mb-6 lg:mb-8 leading-tight">
          Find Your Direction<br />
          Build Your Future.
        </h1>
        <p className="text-sm min-[400px]:text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-[var(--text-secondary)] mb-8 lg:mb-12 max-w-2xl sm:max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto leading-relaxed">
          North helps students discover what to learn, build real skills, and grow with clarity — from the first semester to their first job.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 justify-center">
          <button className="px-6 py-3 min-[400px]:px-8 min-[400px]:py-4 lg:px-10 lg:py-5 xl:px-12 xl:py-6 bg-[#040642] text-white rounded-lg font-semibold text-sm min-[400px]:text-base lg:text-lg xl:text-xl hover:bg-[#0D1117] transition-all border border-[#484F58] shadow-[0_4px_15px_rgba(4,6,66,0.4)] hover:shadow-[0_6px_20px_rgba(13,17,23,0.5)] backdrop-blur-sm">
            Get Started.
          </button>
          <button className="px-6 py-3 min-[400px]:px-8 min-[400px]:py-4 lg:px-10 lg:py-5 xl:px-12 xl:py-6 bg-[#040642] text-white rounded-lg font-semibold text-sm min-[400px]:text-base lg:text-lg xl:text-xl hover:bg-[#0D1117] transition-all border border-[#484F58] shadow-[0_4px_15px_rgba(4,6,66,0.4)] hover:shadow-[0_6px_20px_rgba(13,17,23,0.5)] backdrop-blur-sm">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
};
