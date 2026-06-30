'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import { useAuthStore } from '@/stores/useAuthStore';
import type { UserExp, UserProgress } from '@/types';

export default function DashboardPage() {
  const router = useRouter();
  const { user, profile, setUser, setProfile, fetchProfile, signOut, loading } = useAuthStore();
  const supabase = createClient();
  const [exp, setExp] = useState<UserExp | null>(null);
  const [stats, setStats] = useState({ selesai: 0, total: 0 });

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push('/auth?mode=login');
      return;
    }
    fetchProfile(user.id);
    loadExp(user.id);
    loadProgress(user.id);
  }, [user, loading]);

  const loadExp = async (userId: string) => {
    const { data } = await supabase.from('user_exp').select('*').eq('user_id', userId).single();
    if (data) setExp(data as UserExp);
  };

  const loadProgress = async (userId: string) => {
    const { data } = await supabase.from('user_progress').select('*').eq('user_id', userId);
    if (data) {
      const done = data.filter((p: UserProgress) => p.status === 'selesai');
      setStats({ selesai: done.length, total: 50 });
    }
  };

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  if (!user) return null;

  const expData = exp || { total_exp: 0, level: 1, streak_harian: 0 };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="font-bold text-lg text-accent">
            🇯🇵 Del-Japan
          </Link>
          <div className="flex items-center gap-4 text-sm">
            {profile?.is_premium ? (
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold">
                PREMIUM
              </span>
            ) : (
              <Link href="/premium" className="px-3 py-1 bg-primary text-white rounded-full text-xs font-bold">
                Upgrade
              </Link>
            )}
            <Link href="/profile" className="text-gray-600 hover:text-primary">Profil</Link>
            <button onClick={handleLogout} className="text-gray-400 hover:text-primary">Keluar</button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* GREETING + STATS */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <h1 className="text-2xl font-bold text-accent mb-4">
            Hai, {profile?.nama || 'Siswa'}! 👋
          </h1>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-primary-light rounded-xl">
              <p className="text-2xl font-extrabold text-primary">{expData.total_exp}</p>
              <p className="text-xs text-gray-500">EXP</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl">
              <p className="text-2xl font-extrabold text-blue-600">Lv.{expData.level}</p>
              <p className="text-xs text-gray-500">Level</p>
            </div>
            <div className="p-3 bg-green-50 rounded-xl">
              <p className="text-2xl font-extrabold text-green-600">{expData.streak_harian}🔥</p>
              <p className="text-xs text-gray-500">Streak</p>
            </div>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Lanjut Belajar', href: '/learn', icon: '📚', color: 'bg-primary text-white' },
            { label: 'Kanji', href: '/kanji', icon: '🈳', color: 'bg-accent text-white' },
            { label: 'Kana', href: '/kana', icon: 'あ', color: 'bg-amber-500 text-white' },
            { label: 'Latihan', href: '/learn/quiz', icon: '✍️', color: 'bg-emerald-500 text-white' },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`${item.color} p-4 rounded-xl text-center hover:opacity-90 transition-all`}
            >
              <div className="text-2xl mb-1">{item.icon}</div>
              <p className="text-xs font-bold">{item.label}</p>
            </Link>
          ))}
        </div>

        {/* PROGRESS */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <h2 className="font-bold text-lg mb-4">Progress Pelajaran</h2>
          <div className="flex items-center gap-4 mb-2">
            <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
              <div
                className="bg-primary h-full rounded-full transition-all"
                style={{ width: `${stats.total > 0 ? (stats.selesai / stats.total) * 100 : 0}%` }}
              />
            </div>
            <span className="text-sm text-gray-500 font-medium">
              {stats.selesai}/{stats.total}
            </span>
          </div>
        </div>

        {/* NAVIGATION LINKS */}
        <div className="grid sm:grid-cols-2 gap-3">
          <Link href="/learn" className="block p-4 bg-white rounded-xl border border-gray-100 hover:border-primary/30 transition-all">
            <p className="font-bold">📚 Semua Pelajaran</p>
            <p className="text-sm text-gray-500">50 pelajaran Minna no Nihongo</p>
          </Link>
          <Link href="/kanji" className="block p-4 bg-white rounded-xl border border-gray-100 hover:border-primary/30 transition-all">
            <p className="font-bold">🈳 Kanji List</p>
            <p className="text-sm text-gray-500">352 Kanji N5-N4</p>
          </Link>
          <Link href="/kana" className="block p-4 bg-white rounded-xl border border-gray-100 hover:border-primary/30 transition-all">
            <p className="font-bold">あ Kana Trainer</p>
            <p className="text-sm text-gray-500">Hiragana & Katakana</p>
          </Link>
          <Link href="/premium" className="block p-4 bg-white rounded-xl border border-gray-100 hover:border-primary/30 transition-all">
            <p className="font-bold">⭐ Upgrade Premium</p>
            <p className="text-sm text-gray-500">Akses semua materi</p>
          </Link>
        </div>
      </main>
    </div>
  );
}
