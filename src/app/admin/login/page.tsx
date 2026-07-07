'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/admin/login/api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (res.ok) { router.push('/admin'); return; }
    const d = await res.json().catch(() => ({}));
    setError(d.error || 'Login gagal');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-app)] flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl p-8 w-full max-w-sm border border-gray-100 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-center mb-1">🛡️ Admin</h1>
        <p className="text-sm text-gray-400 text-center mb-6">Del-Japan Learn</p>
        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
        <input
          type="text" placeholder="Username" value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-transparent mb-3 focus:outline-none focus:border-primary"
        />
        <input
          type="password" placeholder="Password" value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-transparent mb-4 focus:outline-none focus:border-primary"
        />
        <button
          type="submit" disabled={loading || !username || !password}
          className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50"
        >
          {loading ? '...' : 'Masuk'}
        </button>
      </form>
    </div>
  );
}