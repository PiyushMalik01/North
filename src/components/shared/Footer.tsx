import Link from 'next/link';
import { cn } from '@/lib/utils';

const links = {
  product: [
    { name: 'Features', href: '/#features' },
    { name: 'Skill Trees', href: '/skills' },
    { name: 'CodeSpaces', href: '/codespaces' },
  ],
  company: [
    { name: 'Blog', href: '/blog' },
    { name: 'About', href: '#' },
    { name: 'Careers', href: '#' },
  ],
  support: [
    { name: 'Help Center', href: '#' },
    { name: 'Contact', href: '#' },
    { name: 'Privacy', href: '#' },
  ],
};

export const Footer = () => {
  return (
    <footer className="border-t border-[var(--border-color)]">
      <div className="max-w-[1100px] mx-auto px-6 md:px-12 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <p className="text-lg font-semibold text-[var(--text-primary)] font-[family-name:var(--font-oswald)] tracking-wider">
              NORTH
            </p>
            <div className="text-sm text-[var(--text-muted)] mt-3 space-y-0.5">
              <p>Built for students.</p>
              <p>Designed for growth.</p>
              <p>Guided by direction.</p>
            </div>
          </div>

          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <p className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--text-muted)] mb-3">
                {category}
              </p>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-150"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-[var(--border-color)] mt-10 pt-6 text-center">
          <p className="text-xs text-[var(--text-muted)]">
            &copy; 2026 North. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
