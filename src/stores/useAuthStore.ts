import { create } from 'zustand';
import { createClient } from '@/lib/supabase';
import { getCloudSync } from '@/lib/cloud-sync';
import type { User } from '@supabase/supabase-js';
import type { Profile } from '@/types';

interface AuthState {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  syncStatus: 'idle' | 'syncing' | 'error';
  lastSync: Date | null;
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
  syncStatus: 'idle',
  lastSync: null,

  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),

  initialize: async () => {
    const supabase = createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    
    // ponytail: mock client or error → skip, go to localStorage-only mode
    if (error || !user) {
      set({ user: null, profile: null, loading: false });
      return;
    }
    
    set({ user, loading: false });
    
    try {
      const { data } = await supabase.from('users').select('*').eq('id', user.id).single();
      if (data) set({ profile: data as Profile });
      
      try {
        await supabase.rpc('check_streak', { p_user_id: user.id });
      } catch {}
      
      const cloudSync = getCloudSync(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      );
      
      if (cloudSync) {
        set({ syncStatus: 'syncing' });
        cloudSync.onStorageChange = (key: string, value: string | null) => {
          if (value === null) localStorage.removeItem(key);
          else localStorage.setItem(key, value);
          window.dispatchEvent(new Event('storage'));
        };
        await cloudSync.initialize(user.id);
        set({ syncStatus: 'idle', lastSync: cloudSync.getSyncState().lastSync });
      }
    } catch (err) {
      console.error('[Auth] Init error:', err);
      set({ syncStatus: 'error' });
    }
  },

  fetchProfile: async (userId: string) => {
    const supabase = createClient();
    const { data } = await supabase.from('users').select('*').eq('id', userId).single();
    if (data) set({ profile: data as Profile });
  },

  signOut: async () => {
    const supabase = createClient();
    
    // Clear cloud sync state
    const cloudSync = getCloudSync();
    if (cloudSync) {
      cloudSync.clear();
    }
    
    await supabase.auth.signOut();
    set({ user: null, profile: null, syncStatus: 'idle', lastSync: null });
  },
}));
