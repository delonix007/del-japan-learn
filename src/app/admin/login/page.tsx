'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';

export default function AdminLoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Login via Supabase Auth (same as regular user login)
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !data.user) {
      setError(authError?.message || 'Login gagal');
      setLoading(false);
      return;
    }

    // Check if admin (client-side check for UX only — server will enforce)
    const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '').split(',').map(e => e.trim()).filter(Boolean);
    if (!data.user.email || !ADMIN_EMAILS.includes(data.user.email)) {
      setError('Akses ditolak: bukan admin');
      setLoading(false);
      return;
    }

    router.push('/admin');
  };

  return (
    <div className="min-h-screen bg-[var(--bg-app)] flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl p-8 w-full max-w-sm border border-gray-100 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-center mb-1">🛡️ Admin</h1>
        <p className="text-sm text-gray-400 text-center mb-6">Del-Japan Learn</p>
        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
        <input
          type="email" placeholder="Email" value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-transparent mb-3 focus:outline-none focus:border-primary"
        />
        <input
          type="password" placeholder="Password" value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-transparent mb-4 focus:outline-none focus:border-primary"
        />
        <button
          type="submit" disabled={loading || !email || !password}
          className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50"
        >
          {loading ? '...' : 'Masuk'}
        </button>
      </form>
    </div>
  );
}