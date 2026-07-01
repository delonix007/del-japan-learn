'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import { useAuthStore } from '@/stores/useAuthStore';
import { useTheme } from '@/components/ThemeProvider';
import DailyReview from '@/components/DailyReview';
import DailyMissions from '@/components/DailyMissions';
import type { UserExp, UserProgress, Lesson } from '@/types';

const sampleVocab = [
  { kata: 'そうですか', arti: 'Begitu ya', romaji: 'sou desu ka' },
  { kata: 'あの方', arti: 'Beliau', romaji: 'ano kata' },
  { kata: 'あの人', arti: 'Orang itu', romaji: 'ano hito' },
  { kata: '医者', arti: 'Dokter', romaji: 'isha' },
  { kata: '〜階', arti: 'Lantai ~', romaji: '~kai/gai' },
  { kata: 'それ', arti: 'Itu', romaji: 'sore' },
];

export default function DashboardPage() {
  const router = useRouter();
  const { user, profile, fetchProfile, loading } = useAuthStore();
  const { theme, toggle } = useTheme();
  const supabase = createClient();
  const [exp, setExp] = useState<UserExp | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [progress, setProgress] = useState<Map<number, string>>(new Map());
  const [vocabCount, setVocabCount] = useState(0);

  useEffect(() => {
    if (loading) return;
    if (!user) { router.push('/auth?mode=login'); return; }
    fetchProfile(user.id);
    loadAll();
  }, [user, loading]);

  const loadAll = async () => {
    const { data: e } = await supabase.from('user_exp').select('*').eq('user_id', user!.id).single();
    if (e) setExp(e as UserExp);

    const { data: l } = await supabase.from('lessons').select('*').order('urutan');
    if (l) setLessons(l as Lesson[]);

    const { data: p } = await supabase.from('user_progress').select('*').eq('user_id', user!.id);
    if (p) {
      const m = new Map<number, string>();
      (p as UserProgress[]).forEach((pr) => m.set(pr.lesson_id, pr.status));
      setProgress(m);
    }

    const { data: v } = await supabase.from('kotoba').select('id', { count: 'exact' });
    if (v) setVocabCount(v.length || 280);
  };

  const menghitungLevel = (totalExp: number) => Math.floor(Math.sqrt(totalExp / 50)) + 1;
  const expData = exp || { total_exp: 0, level: 1, streak_harian: 0 };
  const currLevel = menghitungLevel(expData.total_exp);
  const nextLevelExp = (lv: number) => lv * lv * 50;
  const nextExp = nextLevelExp(currLevel);
  const prevExp = nextLevelExp(currLevel - 1);
  const expPct = exp ? Math.min(((expData.total_exp - prevExp) / (nextExp - prevExp)) * 100, 100) : 0;
  const lessonsDone = lessons.filter((l) => progress.get(l.id) === 'selesai').length;
  const vocabLearned = 0; // from user_kotoba_progress ideally

  const completedCount = lessons.filter((l) => progress.get(l.id) === 'selesai').length;

  if (loading) return <div className="p-8 text-center text-[var(--color-text-muted)]">Loading...</div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-[var(--bg-app)]">
      {/* HEADER STICKY */}
      <header className="sticky top-0 z-40 bg-[var(--bg-app)]/95 backdrop-blur border-b border-[var(--color-border)]">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-[var(--color-text-muted)] leading-tight">Del-Japan</div>
            <div className="font-bold text-sm leading-tight">
              {lessons[completedCount] ? `Pelajaran ${completedCount + 1} — ${lessons[completedCount].judul?.split('(')[0]?.trim() || 'Mulai belajar'}` : 'Mulai belajar'}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center text-xs font-bold text-[var(--color-primary)]">{expPct.toFixed(0)}%</div>
            <button onClick={toggle} className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)]">{theme === 'dark' ? '☀️' : '🌙'}</button>
            <Link href="/premium" className="px-2 py-0.5 bg-green-600/20 text-green-500 rounded-full text-[9px] font-bold whitespace-nowrap">🧑 {profile?.nama?.split(' ')[0] || 'TAMU'}</Link>
            <Link href="/profile" className="w-7 h-7 rounded-full bg-[var(--color-text)] flex items-center justify-center text-[var(--bg-app)] text-xs font-bold">
              {(profile?.nama || 'U')[0].toUpperCase()}
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-5 space-y-5 pb-24">
        {/* ===== SECTION 1 — TOP HERO ===== */}
        <div>
          <p className="text-sm mb-1">こんにちは、{profile?.nama || 'Tamu'}！ Selamat belajar 👋</p>
          <div className="text-3xl font-bold mb-4 leading-tight tracking-tight">
            みんなの<span className="text-[var(--color-primary)]">日本語</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { val: lessons.length, label: 'Pelajaran', color: 'text-blue-600' },
              { val: vocabCount.toLocaleString(), label: 'Kosakata', color: 'text-teal-600' },
              { val: lessonsDone, label: 'Dipelajari', color: 'text-[var(--color-text-muted)]' },
            ].map((s) => (
              <div key={s.label} className="bg-[var(--bg-card)] rounded-xl p-3 border border-[var(--color-border)] text-center shadow-sm">
                <div className={`text-2xl font-extrabold ${s.color}`}>{s.val}</div>
                <div className="text-[10px] text-[var(--color-text-muted)]">{s.label}</div>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-[var(--color-text-muted)] text-center mt-2">✦ Diproduksi oleh Del-Japan ✦</p>
        </div>

        {/* ===== SECTION 2 — PROGRESS & FITUR UTAMA ===== */}
        <div className="bg-[var(--bg-card)] rounded-2xl p-4 border border-[var(--color-border)]">
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold text-sm">📈 Progress Hafalan</span>
            <span className="text-xs text-[var(--color-primary)]">{expPct.toFixed(0)}%</span>
          </div>
          <div className="bg-[var(--color-surface-2)] rounded-full h-2 mb-1">
            <div className="bg-gradient-to-r from-[var(--color-primary)] to-indigo-400 h-full rounded-full" style={{ width: `${expPct}%` }} />
          </div>
          <p className="text-xs text-[var(--color-text-muted)]">Mulai belajar flashcard ✨</p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Link href="/jft-simulation" className="bg-emerald-600/15 rounded-2xl p-4 flex items-center gap-3 hover:brightness-110 transition-all">
            <div className="text-xl">📝</div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm">Simulasi Ujian</div>
              <div className="text-[10px] text-[var(--color-text-muted)] truncate">JFT Basic · 60 Menit</div>
            </div>
            <div className="text-[var(--color-text-muted)] text-xs">→</div>
          </Link>
          <Link href="/learn" className="bg-violet-600/15 rounded-2xl p-4 flex items-center gap-3 hover:brightness-110 transition-all">
            <div className="text-xl">🗺</div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm">Roadmap</div>
              <div className="text-[10px] text-[var(--color-text-muted)] truncate">{expPct.toFixed(0)}% — Hiragana</div>
            </div>
            <div className="text-[var(--color-text-muted)] text-xs">→</div>
          </Link>
        </div>

        <div className="bg-amber-600/10 rounded-2xl p-4 border border-amber-600/20">
          <p className="font-bold text-xs text-amber-600 mb-1">💡 Cara Belajar Efektif</p>
          <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">Balik kartu untuk uji ingatan (Active Recall) → tandai yang sudah hafal → ulangi yang belum. Gunakan Quiz untuk evaluasi pemahamanmu.</p>
        </div>

        {/* ===== SECTION 3 — REVIEW VOCAB & GAMIFIKASI ===== */}
        <div className="bg-[var(--bg-card)] rounded-2xl p-4 border border-[var(--color-border)]">
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold text-sm text-teal-600">📖 Review Vocab Hari Ini</span>
            <span className="text-[10px] text-[var(--color-text-muted)]">{new Date().toISOString().split('T')[0]}</span>
          </div>
          <p className="text-[10px] text-[var(--color-text-muted)] mb-3">Ketuk kartu untuk lihat artinya. Yuk mulai hafal!</p>
          <div className="grid grid-cols-2 gap-2">
            {sampleVocab.map((v, i) => (
              <DailyReviewCard key={i} kata={v.kata} romaji={v.romaji} arti={v.arti} />
            ))}
          </div>
          <button className="w-full mt-3 py-2 bg-teal-600/10 text-teal-600 rounded-xl text-sm font-medium hover:brightness-110 transition-all">🔄 Ganti Set Kata Baru</button>
        </div>

        {/* Level & EXP Card */}
        <div className="bg-[var(--bg-card)] rounded-2xl p-4 border border-[var(--color-border)]">
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold">Level {currLevel}</span>
            <span className="px-2 py-0.5 bg-orange-600/20 text-orange-500 rounded-full text-[10px] font-bold">🔥 {expData.streak_harian} Hari</span>
          </div>
          <div className="flex justify-between text-[10px] text-[var(--color-text-muted)] mb-1">
            <span>{expData.total_exp} / {nextExp} EXP</span>
            <span>{expData.total_exp} Total</span>
          </div>
          <div className="bg-[var(--color-surface-2)] rounded-full h-2.5 mb-2 overflow-hidden">
            <div className="h-full rounded-full" style={{
              width: `${expPct}%`,
              background: 'linear-gradient(90deg, #ef4444, #f97316, #eab308, #22c55e)'
            }} />
          </div>
          <div className="flex justify-between text-xs mb-3">
            <Link href="/profile" className="text-[var(--color-text-muted)]">🏆 0/22 Achievement →</Link>
            <div className="flex gap-1">
              <span>⭐</span><span>🎯</span><span>🔥</span>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-1 text-center">
            {[
              { icon: '🌱', val: '3', label: 'Konsisten' },
              { icon: '⚡', val: '7', label: 'Stabil' },
              { icon: '🔥', val: '14', label: 'Disiplin' },
              { icon: '👑', val: '30', label: 'Master' },
            ].map((s) => (
              <div key={s.label} className="p-1.5 bg-[var(--color-surface-2)] rounded-lg">
                <div className="text-xs">{s.icon}</div>
                <div className="font-bold text-xs">{s.val}</div>
                <div className="text-[8px] text-[var(--color-text-muted)]">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Learning Path */}
        <div>
          <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase mb-2 tracking-wider">📋 Learning Path</p>
          <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--color-border)] divide-y divide-[var(--color-border)]">
            {[
              { icon: '🎯', label: 'Target Hari Ini', sub: 'Selesaikan 1 quiz + 10 kosakata' },
              { icon: '🔥', label: 'Streak Belajar', sub: `${expData.streak_harian} hari berturut-turut` },
              { icon: '⭐', label: 'Achievement', sub: '0 achievement di-unlock' },
              { icon: '📚', label: 'Materi Selanjutnya', sub: `Pelajaran ${completedCount + 1}` },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 p-3">
                <span className="text-lg">{item.icon}</span>
                <div className="flex-1">
                  <div className="font-medium text-sm">{item.label}</div>
                  <div className="text-[10px] text-[var(--color-text-muted)]">{item.sub}</div>
                </div>
                <span className="text-[var(--color-text-muted)] text-xs">→</span>
              </div>
            ))}
          </div>
        </div>

        {/* ===== SECTION 4 — MISI HARIAN & DAFTAR PELAJARAN ===== */}
        <DailyMissions />

        {/* Database Kosakata */}
        <Link href="/kanji" className="block bg-[var(--bg-card)] rounded-2xl p-4 border border-[var(--color-border)] hover:brightness-110 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-sm">📚 Database Kosakata</span>
            <span className="text-xs text-[var(--color-text-muted)]">→</span>
          </div>
          <div className="text-3xl font-extrabold mb-1">{vocabCount.toLocaleString()}<span className="text-sm font-normal text-[var(--color-text-muted)]"> Kosakata Jepang</span></div>
          <div className="text-[10px] text-[var(--color-text-muted)] mb-1">Kosakata Dikuasai: 0 / {vocabCount.toLocaleString()}</div>
          <div className="bg-[var(--color-surface-2)] rounded-full h-1.5">
            <div className="bg-[var(--color-primary)] h-full rounded-full" style={{ width: '0%' }} />
          </div>
        </Link>

        {/* Pilih Buku */}
        <div>
          <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase mb-2 tracking-wider">Pilih Buku</p>
          <div className="grid grid-cols-2 gap-2">
            <Link href="/learn?book=I" className="bg-[var(--bg-card)] rounded-2xl p-4 border border-[var(--color-border)] hover:border-emerald-500/50 transition-all">
              <div className="text-lg mb-1">📗</div>
              <div className="font-bold text-sm" style={{ color: '#059669' }}>Buku I</div>
              <div className="text-[10px] text-[var(--color-text-muted)]">Pelajaran 1–25</div>
            </Link>
            <Link href="/learn?book=II" className="bg-[var(--bg-card)] rounded-2xl p-4 border border-[var(--color-border)] hover:border-blue-500/50 transition-all">
              <div className="text-lg mb-1">📘</div>
              <div className="font-bold text-sm" style={{ color: '#2563eb' }}>Buku II</div>
              <div className="text-[10px] text-[var(--color-text-muted)]">Pelajaran 26–50</div>
            </Link>
          </div>
        </div>

        {/* Daftar Pelajaran */}
        <div>
          <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase mb-2 tracking-wider">Daftar Pelajaran</p>
          <div className="space-y-1.5">
            {lessons.slice(0, 25).map((l) => {
              const p = progress.get(l.id);
              const isPremium = !l.is_free;
              const isDone = p === 'selesai';
              return (
                <Link key={l.id} href={`/learn/${l.id}`}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                    isPremium ? 'border-[var(--color-border)] opacity-60' : isDone ? 'border-green-500/30 bg-green-600/5' : 'border-[var(--color-border)] bg-[var(--bg-card)]'
                  }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    isPremium ? 'bg-[var(--color-surface-2)] text-[var(--color-text-muted)]' : 'bg-violet-600/20 text-violet-600'
                  }`}>
                    {isPremium ? '🔒' : l.nomor_pelajaran}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{l.judul?.split('(')[0]?.trim() || `Pelajaran ${l.nomor_pelajaran}`}</div>
                    <div className="text-[10px] text-[var(--color-text-muted)]">
                      {isPremium ? '🔒 PREMIUM' : `${p === 'selesai' ? '✅ Selesai' : '0% hafal'}`}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}

function DailyReviewCard({ kata, romaji, arti }: { kata: string; romaji?: string; arti: string }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div onClick={() => setFlipped(!flipped)}
      className="bg-[var(--bg-card)] border border-[var(--color-border)] rounded-xl p-4 text-center cursor-pointer min-h-[80px] flex flex-col items-center justify-center hover:shadow-sm transition-all select-none">
      {!flipped ? (
        <>
          <div className="text-lg font-bold">{kata}</div>
          {romaji && <div className="text-[10px] text-[var(--color-text-muted)] mt-0.5">{romaji}</div>}
        </>
      ) : (
        <div className="text-sm font-medium text-[var(--color-primary)]">{arti}</div>
      )}
    </div>
  );
}
