'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { createClient } from '@/lib/supabase';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const supabase = createClient();
    
    supabase.auth.getSession().then((res: any) => {
      const session = res.data?.session;
      if (session?.user) {
        useAuthStore.getState().setUser(session.user);
      }
      useAuthStore.getState().initialize();
    });
    
    const sub = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      if (session?.user) {
        useAuthStore.getState().setUser(session.user);
        useAuthStore.getState().initialize();
      } else {
        useAuthStore.getState().setUser(null);
      }
    });
    
    return () => sub?.subscription?.unsubscribe();
  }, []);

  return <>{children}</>;
}