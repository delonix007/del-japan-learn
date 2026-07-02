import { createBrowserClient } from '@supabase/ssr';

// Singleton Supabase client for browser
let clientInstance: any = null;

// Client-side Supabase client (for browser components)
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || supabaseUrl === 'https://placeholder.supabase.co') {
    // Return a mock client during build/development without Supabase config
    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        getSession: async () => ({ data: { session: null }, error: null }),
        signInWithPassword: async () => ({ data: null, error: new Error('Supabase not configured') }),
        signUp: async () => ({ data: null, error: new Error('Supabase not configured') }),
        signOut: async () => {},
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            single: async () => ({ data: null, error: null }),
            order: async () => ({ data: [], error: null }),
          }),
          order: async () => ({ data: [], error: null }),
          insert: async () => ({ error: null }),
        }),
      }),
    } as any;
  }

  // Return singleton instance
  if (!clientInstance) {
    clientInstance = createBrowserClient(supabaseUrl!, supabaseKey!);
  }
  return clientInstance;
}
