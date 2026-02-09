import React from 'react';
import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="gradient-glow relative overflow-hidden text-[var(--text-secondary)]">
      <div className="max-w-7xl mx-auto px-4 min-[400px]:px-6 sm:px-8 lg:px-12 xl:px-16 py-12 lg:py-16 xl:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12 xl:gap-16">
          <div>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--text-primary)] mb-4 lg:mb-6 font-[family-name:var(--font-oswald)]">NORTH</h3>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-[var(--text-muted)]">
              <ul>Built for students.</ul>
              <ul>Designed for growth.</ul>
              <ul>Guided by direction.</ul>
            </p>
          </div>
          
          <div>
            <h4 className="text-base md:text-lg lg:text-xl text-[var(--text-primary)] font-semibold mb-4 lg:mb-6">Product</h4>
            <ul className="space-y-2 lg:space-y-3 text-sm md:text-base lg:text-lg">
              <li><Link href="#features" className="hover:text-[var(--text-primary)] transition-colors">Features</Link></li>
              <li><Link href="#pricing" className="hover:text-[var(--text-primary)] transition-colors">Pricing</Link></li>
              <li><Link href="#roadmap" className="hover:text-[var(--text-primary)] transition-colors">Roadmap</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-base md:text-lg lg:text-xl text-[var(--text-primary)] font-semibold mb-4 lg:mb-6">Company</h4>
            <ul className="space-y-2 lg:space-y-3 text-sm md:text-base lg:text-lg">
              <li><Link href="#about" className="hover:text-[var(--text-primary)] transition-colors">About</Link></li>
              <li><Link href="#blog" className="hover:text-[var(--text-primary)] transition-colors">Blog</Link></li>
              <li><Link href="#careers" className="hover:text-[var(--text-primary)] transition-colors">Careers</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-base md:text-lg lg:text-xl text-[var(--text-primary)] font-semibold mb-4 lg:mb-6">Support</h4>
            <ul className="space-y-2 lg:space-y-3 text-sm md:text-base lg:text-lg">
              <li><Link href="#help" className="hover:text-[var(--text-primary)] transition-colors">Help Center</Link></li>
              <li><Link href="#contact" className="hover:text-[var(--text-primary)] transition-colors">Contact</Link></li>
              <li><Link href="#privacy" className="hover:text-[var(--text-primary)] transition-colors">Privacy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-[var(--border-color)] mt-8 lg:mt-12 xl:mt-16 pt-8 lg:pt-12 text-center text-sm md:text-base lg:text-lg text-[var(--text-muted)]">
          <p>&copy; 2026 North. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
