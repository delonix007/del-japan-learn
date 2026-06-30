'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const initialize = useAuthStore((s) => s.initialize);

  useEffect(() => {
    initialize();
  }, []);

  return <>{children}</>;
}
