import React from 'react';
import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="gradient-glow relative overflow-hidden text-[var(--text-secondary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-3xl font-bold text-[var(--text-primary)] mb-4 font-[family-name:var(--font-oswald)]">NORTH</h3>
            <p className="text-[var(--text-muted)]">
              <ul>Built for students.</ul>
              <ul>Designed for growth.</ul>
              <ul>Guided by direction.</ul>
            </p>
          </div>
          
          <div>
            <h4 className="text-[var(--text-primary)] font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              <li><Link href="#features" className="hover:text-[var(--text-primary)] transition-colors">Features</Link></li>
              <li><Link href="#pricing" className="hover:text-[var(--text-primary)] transition-colors">Pricing</Link></li>
              <li><Link href="#roadmap" className="hover:text-[var(--text-primary)] transition-colors">Roadmap</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-[var(--text-primary)] font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link href="#about" className="hover:text-[var(--text-primary)] transition-colors">About</Link></li>
              <li><Link href="#blog" className="hover:text-[var(--text-primary)] transition-colors">Blog</Link></li>
              <li><Link href="#careers" className="hover:text-[var(--text-primary)] transition-colors">Careers</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-[var(--text-primary)] font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><Link href="#help" className="hover:text-[var(--text-primary)] transition-colors">Help Center</Link></li>
              <li><Link href="#contact" className="hover:text-[var(--text-primary)] transition-colors">Contact</Link></li>
              <li><Link href="#privacy" className="hover:text-[var(--text-primary)] transition-colors">Privacy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-[var(--border-color)] mt-8 pt-8 text-center text-[var(--text-muted)]">
          <p>&copy; 2026 North. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
