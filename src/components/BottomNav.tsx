'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: '🏠' },
  { label: 'Materi', href: '/learn', icon: '📗' },
  { label: 'Quiz', href: '/learn/1/quiz', icon: '✍️' },
  { label: 'Kanji', href: '/kanji', icon: '🈳' },
  { label: 'Kana', href: '/kana', icon: 'あ' },
];

export default function BottomNav() {
  const path = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--bg-card)] border-t border-[var(--color-border)] safe-area-bottom">
      <div className="max-w-lg mx-auto flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = path === item.href || path.startsWith(item.href + '/');
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-0.5 px-2 py-1 rounded-xl transition-all ${
                isActive
                  ? 'text-[var(--color-primary)] scale-105'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
