'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { createClient } from '@/lib/supabase';
import type { Session } from '@supabase/supabase-js';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const initialize = useAuthStore((s) => s.initialize);

  useEffect(() => {
    // Initialize auth state using singleton client
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }: { data: { session: Session | null } }) => {
      if (session?.user) {
        useAuthStore.getState().setUser(session.user);
      }
      useAuthStore.getState().initialize();
    });
  }, []);

  return <>{children}</>;
}
