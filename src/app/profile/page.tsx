'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import { useAuthStore } from '@/stores/useAuthStore';
import type { UserExp, UserProgress } from '@/types';

export default function ProfilePage() {
  const router = useRouter();
  const { user, profile, setUser, fetchProfile, signOut, loading } = useAuthStore();
  const supabase = createClient();
  const [exp, setExp] = useState<UserExp | null>(null);
  const [stats, setStats] = useState({ selesai: 0, streak: 0, kanjiHafal: 0, kanaHafal: 0 });

  useEffect(() => {
    if (loading) return;
    if (!user) { router.push('/auth?mode=login'); return; }
    fetchProfile(user.id);
    loadStats(user.id);
  }, [user, loading]);

  const loadStats = async (userId: string) => {
    const { data: e } = await supabase.from('user_exp').select('*').eq('user_id', userId).single();
    if (e) setExp(e as UserExp);

    const { data: p } = await supabase.from('user_progress').select('status').eq('user_id', userId);
    const selesai = p?.filter((r: any) => r.status === 'selesai').length || 0;

    const { data: k } = await supabase.from('user_kanji_progress').select('id', { count: 'exact' }).eq('user_id', userId).eq('status_hafal', true);
    const { data: ka } = await supabase.from('user_kana_progress').select('id', { count: 'exact' }).eq('user_id', userId).eq('status_hafal', true);

    setStats({ selesai, streak: e?.streak_harian || 0, kanjiHafal: k?.length || 0, kanaHafal: ka?.length || 0 });
  };

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  if (!user) return null;

  const menghitungLevel = (totalExp: number) => Math.floor(Math.sqrt(totalExp / 50)) + 1;
  const nextLevelExp = (level: number) => level * level * 50;
  const currLevel = exp ? menghitungLevel(exp.total_exp) : 1;
  const nextExp = nextLevelExp(currLevel);
  const prevExp = nextLevelExp(currLevel - 1);
  const progressPct = exp ? ((exp.total_exp - prevExp) / (nextExp - prevExp)) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center gap-4">
          <Link href="/dashboard" className="text-[var(--color-text-muted)] hover:text-[var(--color-text)]">←</Link>
          <h1 className="font-bold text-accent">Profil</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* PROFILE CARD */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {(profile?.nama || 'U')[0].toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold">{profile?.nama || 'Siswa'}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">{user.email}</p>
              {profile?.is_premium && <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-bold">⭐ PREMIUM</span>}
            </div>
          </div>

          {/* EXP BAR */}
          {exp && (
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-bold text-primary">Level {currLevel}</span>
                <span className="text-gray-500 dark:text-gray-400 dark:text-gray-500">{exp.total_exp} / {nextExp} EXP</span>
              </div>
              <div className="bg-gray-100 rounded-full h-3 overflow-hidden">
                <div className="bg-gradient-to-r from-primary to-orange-500 h-full rounded-full transition-all" style={{ width: `${Math.min(progressPct, 100)}%` }} />
              </div>
            </div>
          )}

          {/* STATS */}
          <div className="grid grid-cols-4 gap-2 text-center">
            {[
              { label: 'Pelajaran', value: stats.selesai, icon: '📚' },
              { label: 'Streak', value: stats.streak, icon: '🔥' },
              { label: 'Kanji Hafal', value: stats.kanjiHafal, icon: '🈳' },
              { label: 'Kana Hafal', value: stats.kanaHafal, icon: 'あ' },
            ].map((s) => (
              <div key={s.label} className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl">
                <div className="text-lg">{s.icon}</div>
                <div className="text-lg font-extrabold text-accent">{s.value}</div>
                <div className="text-[10px] text-gray-500 dark:text-gray-400 dark:text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* SETTINGS */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden mb-6">
          <Link href="/premium" className="block p-4 border-b border-gray-50 hover:bg-gray-50 dark:bg-gray-900 transition-colors">
            <p className="font-medium text-primary">⭐ Upgrade ke Premium</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">Akses semua 50 pelajaran</p>
          </Link>
          <Link href="/learn" className="block p-4 border-b border-gray-50 hover:bg-gray-50 dark:bg-gray-900 transition-colors">
            <p className="font-medium">📚 Lanjut Belajar</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">Lanjutin pelajaran terakhir</p>
          </Link>
        </div>

        <button onClick={handleLogout} className="w-full py-3 bg-red-50 text-red-700 font-bold rounded-xl hover:bg-red-100 transition-colors">
          Keluar
        </button>
      </main>
    </div>
  );
}
