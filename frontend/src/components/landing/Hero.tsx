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
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center transition-transform duration-300 ease-out"
        style={{ transform: `scale(${scale})` }}
      >
        <h1 className="text-5xl md:text-7xl font-bold text-[var(--text-primary)] mb-6">
          Find Your Direction
          <span className="block mt-2 bg-clip-text">
            Build Your Future.
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-[var(--text-secondary)] mb-8 max-w-3xl mx-auto">
          North helps students discover what to learn, build real skills,
         and grow with clarity — from the first semester to their first job.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-8 py-4 bg-[#040642] text-white rounded-lg font-semibold hover:bg-[#0D1117] transition-all border border-[#484F58] shadow-[0_4px_15px_rgba(4,6,66,0.4)] hover:shadow-[0_6px_20px_rgba(13,17,23,0.5)] backdrop-blur-sm">
            Get Started.
          </button>
          <button className="px-8 py-4 bg-[#040642] text-white rounded-lg font-semibold hover:bg-[#0D1117] transition-all border border-[#484F58] shadow-[0_4px_15px_rgba(4,6,66,0.4)] hover:shadow-[0_6px_20px_rgba(13,17,23,0.5)] backdrop-blur-sm">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
};
