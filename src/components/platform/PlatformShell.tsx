'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/skills': 'Skill Trees',
  '/diagnostic': 'Diagnostic',
  '/codespaces': 'CodeSpaces',
  '/profile': 'Profile',
  '/settings': 'Settings',
};

interface PlatformShellProps {
  children: React.ReactNode;
}

export default function PlatformShell({ children }: PlatformShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const title =
    Object.entries(pageTitles).find(([path]) =>
      pathname.startsWith(path)
    )?.[1] ?? 'North';

  const isFullscreen = pathname.startsWith('/skills') || pathname.startsWith('/codespaces');

  return (
    <>
      <div className="hidden lg:block">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed((prev) => !prev)}
        />
      </div>

      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-20 bg-black/40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <div className="lg:hidden">
            <Sidebar
              collapsed={false}
              onToggle={() => setMobileMenuOpen(false)}
            />
          </div>
        </>
      )}

      <TopBar
        title={title}
        sidebarCollapsed={sidebarCollapsed}
        onMenuClick={() => setMobileMenuOpen((prev) => !prev)}
      />

      <main
        className={cn(
          'transition-all duration-300 pt-14',
          sidebarCollapsed ? 'lg:pl-16' : 'lg:pl-60',
          isFullscreen ? 'h-screen' : 'min-h-screen'
        )}
      >
        {children}
      </main>
    </>
  );
}
