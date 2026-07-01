import { create } from 'zustand';
import { createClient } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';
import type { Profile } from '@/types';

interface AuthState {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setProfile: (profile: Profile | null) => void;
  fetchProfile: (userId: string) => Promise<void>;
  initialize: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  loading: true,

  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),

  initialize: async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    set({ user, loading: false });
    if (user) {
      // Fetch profile
      const { data } = await supabase.from('users').select('*').eq('id', user.id).single();
      if (data) set({ profile: data as Profile });
      // Check streak on login
      try {
        await supabase.rpc('check_streak', { p_user_id: user.id });
      } catch {}
    }
  },

  fetchProfile: async (userId: string) => {
    const supabase = createClient();
    const { data } = await supabase.from('users').select('*').eq('id', userId).single();
    if (data) set({ profile: data as Profile });
  },

  signOut: async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    set({ user: null, profile: null });
  },
}));
