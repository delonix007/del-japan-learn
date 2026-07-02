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
      
      // Initialize cloud sync (pull progress from cloud)
      try {
        const cloudSync = getCloudSync(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        );
        
        if (cloudSync) {
          set({ syncStatus: 'syncing' });
          
          // Hook into localStorage events for auto-sync
          cloudSync.onStorageChange = (key: string, value: string | null) => {
            if (value === null) {
              localStorage.removeItem(key);
            } else {
              localStorage.setItem(key, value);
            }
            // Trigger React re-render if needed
            window.dispatchEvent(new Event('storage'));
          };
          
          await cloudSync.initialize(user.id);
          
          set({ 
            syncStatus: 'idle', 
            lastSync: cloudSync.getSyncState().lastSync 
          });
        }
      } catch (error) {
        console.error('[Auth] Cloud sync init error:', error);
        set({ syncStatus: 'error' });
        // Continue anyway - localStorage still works
      }
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
