'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';
import { OverlayMenu } from './OverlayMenu';
import { skillsMenuData, communitiesMenuData, codespacesMenuData } from '@/data/menuData';

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { name: 'Skills', data: skillsMenuData },
    { name: 'Communities', data: communitiesMenuData },
    { name: 'CodeSpaces', data: codespacesMenuData },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-[var(--background-primary)] shadow-lg' : 'bg-transparent'
        }`}
      >
        <div className="px-4 min-[400px]:px-6 sm:px-8 lg:px-12 xl:px-16 2xl:px-24">
          <div className="flex justify-between items-center h-16 lg:h-20 xl:h-24">
            {/* Logo */}
            <div className="flex items-center">
              <Link
                href="/"
                className="text-xl min-[400px]:text-2xl md:text-3xl lg:text-4xl font-bold text-[var(--text-primary)] font-[family-name:var(--font-oswald)] tracking-wider"
              >
                NORTH
              </Link>
            </div>

            {/* Desktop Right Section */}
            <div className="hidden md:flex items-center space-x-6 lg:space-x-8 xl:space-x-10">
              {menuItems.map((item) => (
                <button
                  key={item.name}
                  onMouseEnter={() => setActiveMenu(item.name)}
                  className="text-sm lg:text-base xl:text-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors font-medium"
                >
                  {item.name}
                </button>
              ))}
              <Link
                href="/login"
                className="text-sm lg:text-base xl:text-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="px-5 py-2 lg:px-6 lg:py-2.5 xl:px-8 xl:py-3 bg-[#040642] text-white rounded-lg font-semibold text-sm lg:text-base xl:text-lg hover:bg-[#0D1117] transition-all border border-[#484F58] shadow-[0_4px_15px_rgba(4,6,66,0.4)] hover:shadow-[0_6px_20px_rgba(13,17,23,0.5)] backdrop-blur-sm"
              >
                Sign Up
              </Link>
              <ThemeToggle />
            </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4 border-t border-[var(--border-color)]">
            {menuItems.map((item) => (
              <details key={item.name} className="group">
                <summary className="cursor-pointer text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors list-none flex items-center justify-between py-2">
                  {item.name}
                  <svg
                    className="w-4 h-4 transition-transform group-open:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="pl-4 mt-2 space-y-4">
                  {item.data.columns.map((column, idx) => (
                    <div key={idx}>
                      <h4 className="text-xs font-semibold text-[var(--text-primary)] mb-2 uppercase tracking-wide">
                        {column.title}
                      </h4>
                      <ul className="space-y-2">
                        {column.items.map((subItem, subIdx) => (
                          <li key={subIdx}>
                            <Link href="#" className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                              {subItem}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </details>
            ))}
            <div className="pt-4 border-t border-[var(--border-color)] space-y-3">
              <Link
                href="/login"
                className="block text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors px-4"
              >
                Login
              </Link>
              <div className="px-4">
                <ThemeToggle />
              </div>
              <Link href="/signup" className="block text-[var(--brand-purple)] font-semibold px-4">
                Sign Up
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
    
    {/* Full-width overlay - keep open when hovering */}
    {activeMenu && (
      <div
        onMouseEnter={() => {}} 
        onMouseLeave={() => setActiveMenu(null)}
      >
        {menuItems.map((item) => (
          <div key={item.name}>
            {activeMenu === item.name && (
              <OverlayMenu
                columns={item.data.columns}
                bottomText={item.data.bottomText}
                isOpen={true}
              />
            )}
          </div>
        ))}
      </div>
    )}
    </>
  );
};