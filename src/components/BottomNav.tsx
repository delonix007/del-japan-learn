'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { label: 'Home', href: '/dashboard', icon: '🏠' },
  { label: 'Materi', href: '/learn', icon: '📗' },
  { label: 'Quiz', href: '/jft-simulation', icon: '✍️' },
  { label: 'Kotoba', href: '/kanji', icon: '📖' },
  { label: 'Kana', href: '/kana', icon: 'あ' },
  { label: 'Setelan', href: '/profile', icon: '⚙️' },
];

export default function BottomNav() {
  const path = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--bg-card)] border-t border-[var(--color-border)] safe-area-bottom">
      <div className="max-w-lg mx-auto flex items-center justify-around h-16 px-1">
        {navItems.map((item) => {
          const isActive = path === item.href || (item.href !== '/dashboard' && path.startsWith(item.href));
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-0 px-2 py-1 rounded-xl transition-all min-w-[48px] ${
                isActive
                  ? 'text-[var(--color-text)] scale-105'
                  : 'text-[var(--color-text-muted)]'
              }`}
            >
              <span className="text-[18px] leading-none">{item.icon}</span>
              <span className={`text-[9px] font-medium mt-0.5 ${isActive ? 'opacity-100' : 'opacity-70'}`}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
