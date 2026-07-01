'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import { useAuthStore } from '@/stores/useAuthStore';
import { useTheme } from '@/components/ThemeProvider';
import DailyReview from '@/components/DailyReview';
import DailyMissions from '@/components/DailyMissions';
import type { UserExp, UserProgress, Kotoba } from '@/types';

const sampleVocab = [
  { kata: 'そうですか', arti: 'Begitu ya', romaji: 'sou desu ka' },
  { kata: 'あの方', arti: 'Beliau (orang itu)', romaji: 'ano kata' },
  { kata: 'あの人', arti: 'Orang itu', romaji: 'ano hito' },
  { kata: '医者', arti: 'Dokter', romaji: 'isha' },
  { kata: 'それ', arti: 'Itu (benda)', romaji: 'sore' },
  { kata: '本', arti: 'Buku', romaji: 'hon' },
];

export default function DashboardPage() {
  const router = useRouter();
  const { user, profile, fetchProfile, signOut, loading } = useAuthStore();
  const { theme, toggle } = useTheme();
  const supabase = createClient();
  const [exp, setExp] = useState<UserExp | null>(null);
  const [stats, setStats] = useState({ selesai: 0, total: 0 });

  useEffect(() => {
    if (loading) return;
    if (!user) { router.push('/auth?mode=login'); return; }
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

  if (loading) return <div className="p-8 text-center text-[var(--color-text-muted)]">Loading...</div>;
  if (!user) return null;

  const expData = exp || { total_exp: 0, level: 1, streak_harian: 0 };

  return (
    <div className="min-h-screen">
      {/* Simple header */}
      <header className="sticky top-0 z-40 bg-[var(--bg-app)]/90 backdrop-blur border-b border-[var(--color-border)]">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">🎌</span>
            <span className="font-bold">Del-Japan</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            {profile?.is_premium ? (
              <span className="px-2 py-0.5 bg-yellow-600/20 text-yellow-500 rounded-full text-[10px] font-bold">⭐ PREMIUM</span>
            ) : (
              <Link href="/premium" className="px-2 py-0.5 bg-[var(--color-primary)]/20 text-[var(--color-primary)] rounded-full text-[10px] font-bold">Upgrade</Link>
            )}
            <button onClick={toggle} className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] text-base">{theme === 'dark' ? '☀️' : '🌙'}</button>
            <Link href="/profile" className="text-[var(--color-text-muted)] hover:text-[var(--color-text)]">👤</Link>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-5 space-y-4">
        {/* Greeting + Stats */}
        <div className="bg-[var(--bg-card)] rounded-2xl p-5 border border-[var(--color-border)]">
          <h1 className="text-lg font-bold mb-1">こんにちは！{profile?.nama || 'Siswa'} 👋</h1>
          <p className="text-xs text-[var(--color-text-muted)] mb-4">Selamat belajar!</p>
          <div className="flex gap-3 text-center">
            {[
              { val: expData.total_exp, label: 'EXP', color: 'text-[var(--color-primary)]' },
              { val: `Lv.${expData.level}`, label: 'Level', color: 'text-blue-500' },
              { val: `${expData.streak_harian}🔥`, label: 'Streak', color: 'text-orange-500' },
              { val: `${stats.selesai}/${stats.total}`, label: 'Progress', color: 'text-green-500' },
            ].map((s) => (
              <div key={s.label} className="flex-1 p-2 bg-[var(--color-surface-2)] rounded-xl">
                <div className={`text-lg font-extrabold ${s.color}`}>{s.val}</div>
                <div className="text-[10px] text-[var(--color-text-muted)]">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: '📝 Simulasi Ujian', sub: 'JFT Basic · 60 menit', href: '/jft-simulation', color: 'from-indigo-600 to-indigo-800' },
            { label: '🗺 Roadmap', sub: `${expData.streak_harian > 0 ? 'Progress ' + Math.min(expData.level * 10, 100) + '%' : 'Mulai belajar'}`, href: '/learn', color: 'from-violet-600 to-violet-800' },
          ].map((item) => (
            <Link key={item.label} href={item.href}
              className={`bg-gradient-to-br ${item.color} rounded-2xl p-4 text-white hover:opacity-90 transition-all`}>
              <div className="text-lg">{item.label.split(' ')[0]}</div>
              <div className="font-bold text-sm">{item.label.split(' ').slice(1).join(' ')}</div>
              <div className="text-[10px] opacity-70">{item.sub}</div>
            </Link>
          ))}
        </div>

        {/* Daily Review */}
        <DailyReview words={sampleVocab} />

        {/* Daily Missions */}
        <DailyMissions />

        {/* Learning Path */}
        <div className="bg-[var(--bg-card)] rounded-2xl p-4 border border-[var(--color-border)]">
          <h3 className="font-bold text-sm mb-3">📋 Learning Path</h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: '🎯', label: 'Target Hari Ini', sub: '1 quiz + 10 kosakata' },
              { icon: '🔥', label: 'Streak', sub: `${expData.streak_harian} hari berturut-turut` },
              { icon: '⭐', label: 'Achievement', sub: '2 ter-unlock' },
              { icon: '📚', label: 'Selanjutnya', sub: `Pelajaran ${stats.selesai + 1}` },
            ].map((item) => (
              <div key={item.label} className="p-3 bg-[var(--color-surface-2)] rounded-xl">
                <div className="text-sm">{item.icon}</div>
                <div className="font-medium text-xs mt-1">{item.label}</div>
                <div className="text-[10px] text-[var(--color-text-muted)]">{item.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Hafalan */}
        <div className="bg-[var(--bg-card)] rounded-2xl p-5 border border-[var(--color-border)]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm">📈 Progress Hafalan</h3>
            <span className="text-xs text-[var(--color-text-muted)]">{stats.selesai}/50 pelajaran</span>
          </div>
          <div className="bg-[var(--color-surface-2)] rounded-full h-2.5 overflow-hidden">
            <div className="bg-gradient-to-r from-[var(--color-primary)] to-indigo-400 h-full rounded-full transition-all" style={{ width: `${(stats.selesai / 50) * 100}%` }} />
          </div>
        </div>

        {/* Buku I & II */}
        <div className="grid grid-cols-2 gap-2">
          <Link href="/learn?book=I" className="bg-[var(--bg-card)] rounded-2xl p-4 border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-all">
            <div className="text-lg mb-1">📗</div>
            <div className="font-bold text-sm">Buku I</div>
            <div className="text-[10px] text-[var(--color-text-muted)]">Pelajaran 1–25</div>
          </Link>
          <Link href="/learn?book=II" className="bg-[var(--bg-card)] rounded-2xl p-4 border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-all">
            <div className="text-lg mb-1">📘</div>
            <div className="font-bold text-sm">Buku II</div>
            <div className="text-[10px] text-[var(--color-text-muted)]">Pelajaran 26–50</div>
          </Link>
        </div>
      </main>
    </div>
  );
}
