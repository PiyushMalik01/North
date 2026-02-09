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
  if (!isOpen) return null;

  return (
    <div className="fixed left-0 right-0 top-16 lg:top-20 xl:top-24 bg-[var(--background-primary)] border-t border-[var(--border-color)] shadow-2xl z-40 animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="px-4 min-[400px]:px-6 sm:px-8 lg:px-12 xl:px-16 2xl:px-24 py-6 lg:py-8 xl:py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 xl:gap-12">
          {columns.map((column, idx) => (
            <div key={idx}>
              <h3 className="text-xs md:text-sm lg:text-base font-semibold text-[var(--text-primary)] mb-3 lg:mb-4 uppercase tracking-wide">
                {column.title}
              </h3>
              <ul className="space-y-2 lg:space-y-3">
                {column.items.map((item, itemIdx) => (
                  <li key={itemIdx}>
                    <Link
                      href="#"
                      className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-sm lg:text-base xl:text-lg"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-6 lg:mt-8 pt-4 lg:pt-6 border-t border-[var(--border-color)]">
          <p className="text-xs md:text-sm lg:text-base text-[var(--text-muted)] italic">{bottomText}</p>
        </div>
      </div>
    </div>
  );
};
