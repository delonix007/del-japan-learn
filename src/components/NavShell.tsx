'use client';

import { usePathname } from 'next/navigation';
import BottomNav from './BottomNav';

export function NavShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const isLanding = path === '/' || path.startsWith('/auth');

  return (
    <div className="min-h-screen bg-[var(--bg-app)] text-[var(--color-text)]">
      {/* Full-page for landing/auth */}
      {isLanding ? (
        children
      ) : (
        <>
          <div className="pb-20">{children}</div>
          <BottomNav />
        </>
      )}
    </div>
  );
}
