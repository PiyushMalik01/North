'use client';

import React from 'react';
import Link from 'next/link';

interface MenuItem {
  title: string;
  items: string[];
}

interface OverlayMenuProps {
  columns: MenuItem[];
  bottomText: string;
  isOpen: boolean;
}

export const OverlayMenu: React.FC<OverlayMenuProps> = ({ columns, bottomText, isOpen }) => {
  return (
    <div
      className={`absolute left-0 right-0 top-full bg-[var(--background-primary)] border-t border-[var(--border-color)] shadow-xl transition-all duration-200 ${
        isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {columns.map((column, idx) => (
            <div key={idx}>
              <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4 uppercase tracking-wide">
                {column.title}
              </h3>
              <ul className="space-y-3">
                {column.items.map((item, itemIdx) => (
                  <li key={itemIdx}>
                    <Link
                      href="#"
                      className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-sm"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 pt-6 border-t border-[var(--border-color)]">
          <p className="text-sm text-[var(--text-muted)] italic">{bottomText}</p>
        </div>
      </div>
    </div>
  );
};
