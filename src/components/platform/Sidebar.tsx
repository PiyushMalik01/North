'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Home,
  Map,
  Compass,
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  type LucideIcon,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: Home },
  { label: 'Skill Trees', href: '/skills', icon: Map },
  { label: 'Diagnostic', href: '/diagnostic', icon: Compass },
  { label: 'Profile', href: '/profile', icon: User },
];

const bottomItems: NavItem[] = [
  { label: 'Settings', href: '/settings', icon: Settings },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        'fixed top-0 left-0 h-full z-30',
        'bg-[var(--background-secondary)] border-r border-[var(--border-color)]',
        'flex flex-col transition-all duration-300 ease-in-out',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      <div
        className={cn(
          'h-14 flex items-center border-b border-[var(--border-color)] px-4',
          collapsed ? 'justify-center' : 'justify-between'
        )}
      >
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-2">
            <span
              className="text-lg font-bold tracking-wider text-[var(--text-primary)]"
              style={{ fontFamily: 'var(--font-oswald)' }}
            >
              NORTH
            </span>
          </Link>
        )}
        <button
          onClick={onToggle}
          className="p-1.5 rounded-md hover:bg-[var(--border-color)]/30 text-[var(--text-secondary)] transition-colors"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <nav className="flex-1 py-3 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-md transition-all duration-150',
                collapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2.5',
                isActive
                  ? 'bg-[var(--brand-blue)]/15 text-[var(--brand-yellow)]'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--border-color)]/20 hover:text-[var(--text-primary)]'
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon size={18} className="flex-shrink-0" />
              {!collapsed && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="py-3 px-2 space-y-1 border-t border-[var(--border-color)]">
        {bottomItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-md transition-all duration-150',
                collapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2.5',
                isActive
                  ? 'bg-[var(--brand-blue)]/15 text-[var(--brand-yellow)]'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--border-color)]/20 hover:text-[var(--text-primary)]'
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon size={18} className="flex-shrink-0" />
              {!collapsed && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
            </Link>
          );
        })}

        <button
          className={cn(
            'flex items-center gap-3 rounded-md w-full transition-all duration-150',
            collapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2.5',
            'text-[var(--text-secondary)] hover:bg-[var(--border-color)]/20 hover:text-[var(--text-primary)]'
          )}
          title={collapsed ? 'Log Out' : undefined}
        >
          <LogOut size={18} className="flex-shrink-0" />
          {!collapsed && (
            <span className="text-sm font-medium">Log Out</span>
          )}
        </button>
      </div>
    </aside>
  );
}
