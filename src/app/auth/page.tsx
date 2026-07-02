'use client';

import { Suspense } from 'react';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import { useAuthStore } from '@/stores/useAuthStore';

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') || 'login';
  const isLogin = mode === 'login';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nama, setNama] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const supabase = createClient();
  const setUser = useAuthStore((s) => s.setUser);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        console.log('[Login] signInWithPassword:', { email, hasUser: !!data?.user, error: error?.message });
        if (error) {
          setError(error.message);
          setLoading(false);
          return;
        }
        // ponytail: update Zustand store immediately after login
        if (data.user) {
          setUser(data.user);
        }
        // Force refresh session to ensure it's saved
        await supabase.auth.getSession();
        router.push('/dashboard');
        router.refresh();
      } else {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { nama },
          },
        });
        if (signUpError) throw signUpError;

        if (data.user?.identities?.length === 0) {
          setError('Email sudah terdaftar. Silakan login.');
        } else {
          setSuccess('Akun berhasil dibuat! Mengalihkan...');
          setTimeout(() => {
            router.push('/auth?mode=login');
            router.refresh();
          }, 1500);
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">{error}</div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl">{success}</div>
      )}
      {!isLogin && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
          <input type="text" value={nama} onChange={(e) => setNama(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            placeholder="Nama lo" required />
        </div>
      )}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          placeholder="email@contoh.com" required />
      </div>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          placeholder="Min 6 karakter" minLength={6} required />
      </div>
      <button type="submit" disabled={loading}
        className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50 shadow-lg shadow-primary/20">
        {loading ? 'Tunggu...' : isLogin ? 'Masuk' : 'Daftar Gratis'}
      </button>
      <p className="text-center text-sm text-gray-500 mt-4">
        {isLogin ? 'Belum punya akun?' : 'Udah punya akun?'}{' '}
        <Link href={isLogin ? '/auth?mode=register' : '/auth?mode=login'} className="text-primary font-medium hover:underline">
          {isLogin ? 'Daftar' : 'Masuk'}
        </Link>
      </p>
    </form>
  );
}

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-light to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-accent">🇯🇵 Del-Japan Learn</Link>
          <p className="text-gray-500 text-sm mt-1">Belajar Bahasa Jepang dari nol</p>
          <Link href="/" className="inline-block mt-3 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)]">← Kembali</Link>
        </div>
        <Suspense fallback={<div className="text-center py-8 text-gray-400">Loading...</div>}>
          <AuthForm />
        </Suspense>
      </div>
    </div>
  );
}
