'use client';

import { cn } from '@/lib/utils';
import { FiMenu, FiBell, FiSearch } from 'react-icons/fi';
import { ThemeToggle } from '@/components/shared/ThemeToggle';

interface TopBarProps {
  title: string;
  sidebarCollapsed: boolean;
  onMenuClick: () => void;
}

export default function TopBar({
  title,
  sidebarCollapsed,
  onMenuClick,
}: TopBarProps) {
  return (
    <header
      className={cn(
        'fixed top-0 right-0 z-20 h-14',
        'bg-[var(--background)]/80 backdrop-blur-sm',
        'border-b border-[var(--border-color)]',
        'flex items-center justify-between px-4 lg:px-6',
        'transition-all duration-300',
        sidebarCollapsed ? 'left-16' : 'left-0 lg:left-60'
      )}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-1.5 rounded-md hover:bg-[var(--border-color)]/30 text-[var(--text-secondary)] transition-colors"
          aria-label="Toggle menu"
        >
          <FiMenu size={18} />
        </button>
        <h1 className="text-base font-semibold text-[var(--text-primary)]">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <button
          className="p-2 rounded-md hover:bg-[var(--border-color)]/30 text-[var(--text-secondary)] transition-colors"
          aria-label="Search"
        >
          <FiSearch size={16} />
        </button>
        <button
          className="p-2 rounded-md hover:bg-[var(--border-color)]/30 text-[var(--text-secondary)] transition-colors relative"
          aria-label="Notifications"
        >
          <FiBell size={16} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[var(--brand-yellow)]" />
        </button>
        <ThemeToggle />
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--brand-blue)] to-[var(--brand-yellow)] flex items-center justify-center text-[var(--accent-fg)] text-xs font-bold ml-1">
          P
        </div>
      </div>
    </header>
  );
}
