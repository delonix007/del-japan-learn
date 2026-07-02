'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import { useAuthStore } from '@/stores/useAuthStore';
import DailyChallengeWidget from '@/components/DailyChallengeWidget';
import { useTheme } from '@/components/ThemeProvider';
import { isGuestMode, getGuestProgress } from '@/lib/guest';
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

const vocabSets = [
  sampleVocab,
  [
    { kata: '学生', arti: 'Siswa', romaji: 'gakusei' },
    { kata: '先生', arti: 'Guru', romaji: 'sensei' },
    { kata: '学校', arti: 'Sekolah', romaji: 'gakkou' },
    { kata: '勉強', arti: 'Belajar', romaji: 'benkyou' },
    { kata: '友達', arti: 'Teman', romaji: 'tomodachi' },
    { kata: '時間', arti: 'Waktu', romaji: 'jikan' },
  ],
  [
    { kata: '食べる', arti: 'Makan', romaji: 'taberu' },
    { kata: '飲む', arti: 'Minum', romaji: 'nomu' },
    { kata: '行く', arti: 'Pergi', romaji: 'iku' },
    { kata: '来る', arti: 'Datang', romaji: 'kuru' },
    { kata: '見る', arti: 'Melihat', romaji: 'miru' },
    { kata: '聞く', arti: 'Mendengar', romaji: 'kiku' },
  ],
  [
    { kata: '今日', arti: 'Hari ini', romaji: 'kyou' },
    { kata: '明日', arti: 'Besok', romaji: 'ashita' },
    { kata: '昨日', arti: 'Kemarin', romaji: 'kinou' },
    { kata: '毎日', arti: 'Setiap hari', romaji: 'mainichi' },
    { kata: '今', arti: 'Sekarang', romaji: 'ima' },
    { kata: '後', arti: 'Nanti', romaji: 'ato' },
  ],
  [
    { kata: '水', arti: 'Air', romaji: 'mizu' },
    { kata: '火', arti: 'Api', romaji: 'hi' },
    { kata: '木', arti: 'Kayu', romaji: 'ki' },
    { kata: '金', arti: 'Emas', romaji: 'kin' },
    { kata: '土', arti: 'Tanah', romaji: 'tsuchi' },
    { kata: '空', arti: 'Langit', romaji: 'sora' },
  ],
  [
    { kata: '大きい', arti: 'Besar', romaji: 'ookii' },
    { kata: '小さい', arti: 'Kecil', romaji: 'chiisai' },
    { kata: '新しい', arti: 'Baru', romaji: 'atarashii' },
    { kata: '古い', arti: 'Lama', romaji: 'furui' },
    { kata: '高い', arti: 'Tinggi/Mahal', romaji: 'takai' },
    { kata: '安い', arti: 'Murah', romaji: 'yasui' },
  ],
  [
    { kata: '家族', arti: 'Keluarga', romaji: 'kazoku' },
    { kata: '母親', arti: 'Ibu', romaji: 'hahaoya' },
    { kata: '父親', arti: 'Ayah', romaji: 'chichioya' },
    { kata: '兄弟', arti: 'Saudara', romaji: 'kyoudai' },
    { kata: '姉', arti: 'Kakak Perempuan', romaji: 'ane' },
    { kata: '弟', arti: 'Adik Laki-laki', romaji: 'otouto' },
  ],
  [
    { kata: '本', arti: 'Buku', romaji: 'hon' },
    { kata: '車', arti: 'Mobil', romaji: 'kuruma' },
    { kata: '家', arti: 'Rumah', romaji: 'ie' },
    { kata: '駅', arti: 'Stasiun', romaji: 'eki' },
    { kata: '店', arti: 'Toko', romaji: 'mise' },
    { kata: '病院', arti: 'Rumah Sakit', romaji: 'byouin' },
  ],
];

export default function DashboardPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, profile, fetchProfile, loading } = useAuthStore();
  const { theme, toggle } = useTheme();
  const supabase = createClient();
  const [exp, setExp] = useState<UserExp | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [progress, setProgress] = useState<Map<number, string>>(new Map());
  const [vocabCount, setVocabCount] = useState(0);
  const [lessonsCount, setLessonsCount] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [currentVocabSet, setCurrentVocabSet] = useState(0);

  const handleGantiVocab = () => {
    setCurrentVocabSet((prev) => (prev + 1) % vocabSets.length);
  };

  useEffect(() => { setMounted(true); }, []);

  // Scroll to top when component mounts (fixes "kejang" issue)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Real-time EXP sync via localStorage events
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'deljapan-guest-progress' && isGuestMode()) {
        const gp = getGuestProgress();
        setExp({ total_exp: gp.exp, level: gp.level, streak_harian: gp.streak } as any);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Poll for EXP updates every 5 seconds (for both guest and logged-in users)
  useEffect(() => {
    const interval = setInterval(async () => {
      if (isGuestMode()) {
        const gp = getGuestProgress();
        setExp(prev => {
          const newExp = { total_exp: gp.exp, level: gp.level, streak_harian: gp.streak } as any;
          // Only update if different to prevent re-renders
          if (prev && prev.total_exp === gp.exp && prev.level === gp.level && prev.streak_harian === gp.streak) return prev;
          return newExp;
        });
      } else if (user) {
        const { data: e } = await supabase.from('user_exp').select('*').eq('user_id', user.id).single();
        if (e) setExp(prev => {
          if (prev && prev.total_exp === e.total_exp) return prev;
          return e as UserExp;
        });
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    if (loading) return;
    if (!user && !isGuestMode()) { router.push('/auth?mode=login'); return; }
    if (isGuestMode()) {
      const gp = getGuestProgress();
      setExp({ total_exp: gp.exp, level: gp.level, streak_harian: gp.streak } as any);
      setLessonsCount(gp.lessons.length);
      setVocabCount(0);
      // Load lessons for guest mode (only once)
      if (lessons.length === 0) {
        supabase.from('lessons').select('*').order('urutan').then((response: { data: Lesson[] | null }) => {
          if (response.data) setLessons(response.data as Lesson[]);
        });
      }
      return;
    }
    fetchProfile(user!.id);
    // Load all data for logged-in users (only once)
    if (lessons.length === 0 && user) {
      supabase.from('user_exp').select('*').eq('user_id', user.id).single().then((response: { data: UserExp | null }) => {
        if (response.data) setExp(response.data as UserExp);
      });
      supabase.from('lessons').select('*').order('urutan').then((response: { data: Lesson[] | null }) => {
        if (response.data) setLessons(response.data as Lesson[]);
      });
      supabase.from('user_progress').select('*').eq('user_id', user.id).then((response: { data: UserProgress[] | null }) => {
        if (response.data) {
          const m = new Map<number, string>();
          (response.data as UserProgress[]).forEach((pr) => m.set(pr.lesson_id, pr.status));
          setProgress(m);
        }
      });
      supabase.from('kotoba').select('id', { count: 'exact' }).then((response: { data: any[] | null }) => {
        if (response.data) setVocabCount(response.data.length || 280);
      });
    }
  }, [user, loading]);

  const menghitungLevel = (totalExp: number) => Math.floor(Math.sqrt(totalExp / 50)) + 1;
  const expData = exp || { total_exp: 0, level: 1, streak_harian: 0 };
  const currLevel = menghitungLevel(expData.total_exp);
  const nextLevelExp = (lv: number) => lv * lv * 50;
  const nextExp = nextLevelExp(currLevel);
  const prevExp = nextLevelExp(currLevel - 1);
  const expPct = exp ? Math.min(((expData.total_exp - prevExp) / (nextExp - prevExp)) * 100, 100) : 0;
  const lessonsDone = lessons.filter((l) => progress.get(l.id) === 'selesai').length;

  if (loading) return (
    <div className="min-h-screen bg-[var(--bg-app)] flex items-center justify-center">
      <div className="text-center space-y-3">
        <div className="w-10 h-10 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-[var(--color-text-muted)]">Memuat data...</p>
      </div>
    </div>
  );
  if (!user && !isGuestMode()) return null;

  return (
    <div className="min-h-screen bg-[var(--bg-app)]">
      {/* ── HEADER STICKY ── */}
      <header className="sticky top-0 z-40 bg-[var(--bg-app)]/95 backdrop-blur-lg border-b border-[var(--color-border)]">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)]/15 flex items-center justify-center text-sm">🇯🇵</div>
            <div>
              <div className="text-[10px] text-[var(--color-text-muted)] leading-tight font-medium">Del-Japan</div>
              <div className="font-bold text-sm leading-tight">
                {lessons[lessonsDone] ? `Pelajaran ${lessonsDone + 1}` : 'Selamat Belajar!'}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggle} className="w-8 h-8 rounded-lg bg-[var(--color-surface-2)] flex items-center justify-center text-sm hover:brightness-110 transition-all">
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <Link href="/profile" className="w-8 h-8 rounded-lg bg-[var(--color-primary)]/20 flex items-center justify-center text-xs font-bold text-[var(--color-primary)] hover:brightness-110 transition-all">
              {(profile?.nama || 'U')[0].toUpperCase()}
            </Link>
          </div>
        </div>
      </header>

      <main className={`max-w-lg mx-auto px-4 py-5 space-y-4 pb-24 ${mounted ? 'animate-in' : 'opacity-0'}`}>
        {/* ── SECTION 1: HERO GREETING ── */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--color-primary)]/10 to-indigo-600/5 border border-[var(--color-border)] p-5">
          <div className="relative z-10">
            <p className="text-sm font-medium text-[var(--color-text-muted)] mb-1">
              {new Date().getHours() < 12 ? '☀️ Selamat pagi' : new Date().getHours() < 18 ? '🌤 Selamat siang' : '🌙 Selamat malam'}{profile?.nama ? `, ${profile.nama}` : ''}!
            </p>
            <h1 className="text-2xl font-extrabold leading-tight tracking-tight mb-3">
              みんなの<span className="text-[var(--color-primary)]">日本語</span>
            </h1>
            <div className="grid grid-cols-3 gap-2">
              {[
                { val: lessons.length || 50, label: 'Pelajaran', color: 'text-[var(--color-primary)]' },
                { val: vocabCount.toLocaleString() || '280+', label: 'Kosakata', color: 'text-emerald-500' },
                { val: lessonsDone, label: 'Selesai', color: lessonsDone > 0 ? 'text-amber-500' : 'text-[var(--color-text-muted)]' },
              ].map((s) => (
                <div key={s.label} className="bg-[var(--bg-card)]/60 backdrop-blur rounded-xl p-3 text-center border border-[var(--color-border)]/50">
                  <div className={`text-xl font-extrabold ${s.color}`}>{s.val}</div>
                  <div className="text-[10px] text-[var(--color-text-muted)]">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── SECTION 2: PROGRESS HAFALAN ── */}
        <div className="bg-[var(--bg-card)] rounded-2xl p-4 border border-[var(--color-border)]">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-sm flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[var(--color-primary)]" />
              Progress Hafalan
            </span>
            <span className="text-xs font-bold text-[var(--color-primary)]">{lessonsDone}/{lessons.length || 50} selesai</span>
          </div>
          <div className="bg-[var(--color-surface-2)] rounded-full h-2 mb-1 overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${Math.min((lessonsDone / Math.max(lessons.length || 50, 1)) * 100, 100)}%`,
                background: 'linear-gradient(90deg, var(--color-primary), #818cf8)'
              }} />
          </div>
          <p className="text-[11px] text-[var(--color-text-muted)]">Selesaikan quiz untuk menandai pelajaran selesai ✨</p>
        </div>

        {/* ── SECTION 3: QUICK ACTIONS ── */}
        <div className="grid grid-cols-2 gap-2">
          <Link href="/jft-simulation"
            className="group relative overflow-hidden rounded-2xl p-4 border border-emerald-600/20 bg-gradient-to-br from-emerald-600/10 to-emerald-600/5 hover:brightness-110 transition-all">
            <div className="text-2xl mb-1">📝</div>
            <div className="font-bold text-sm">Simulasi Ujian</div>
            <div className="text-[10px] text-[var(--color-text-muted)]">JFT Basic · 60 Menit</div>
            <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-emerald-600/20 flex items-center justify-center text-xs text-emerald-500 transition-transform group-hover:translate-x-0.5">→</div>
          </Link>
          <Link href="/roadmap"
            className="group relative overflow-hidden rounded-2xl p-4 border border-violet-600/20 bg-gradient-to-br from-violet-600/10 to-violet-600/5 hover:brightness-110 transition-all">
            <div className="text-2xl mb-1">🗺</div>
            <div className="font-bold text-sm">Roadmap</div>
            <div className="text-[10px] text-[var(--color-text-muted)]">{lessons.length} Pelajaran</div>
            <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-violet-600/20 flex items-center justify-center text-xs text-violet-500 transition-transform group-hover:translate-x-0.5">→</div>
          </Link>
        </div>

        {/* ── SECTION 4: LEVEL & EXP ── */}
        <div className="bg-[var(--bg-card)] rounded-2xl p-4 border border-[var(--color-border)]">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-sm font-bold text-white">{currLevel}</span>
              <div>
                <span className="font-bold text-sm">Level {currLevel}</span>
                <span className="text-[10px] text-[var(--color-text-muted)] ml-2">{expData.total_exp} EXP</span>
              </div>
            </div>
            <a href="/achievements" className="px-2.5 py-1 bg-orange-600/15 text-orange-500 rounded-full text-[10px] font-bold flex items-center gap-1 hover:brightness-110 transition-all">
              🔥 {expData.streak_harian} Hari →
            </a>
          </div>
          <div className="flex justify-between text-[10px] text-[var(--color-text-muted)] mb-1">
            <span>{expData.total_exp - prevExp} / {nextExp - prevExp} EXP</span>
            <span>Level {currLevel + 1}</span>
          </div>
          <div className="bg-[var(--color-surface-2)] rounded-full h-2.5 overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${expPct}%`,
                background: 'linear-gradient(90deg, #ef4444, #f97316, #eab308, #22c55e)'
              }} />
          </div>
          <div className="grid grid-cols-4 gap-1.5 mt-3">
            {[
              { icon: '🌱', val: '3', label: 'Konsisten', active: expData.streak_harian >= 3 },
              { icon: '⚡', val: '7', label: 'Stabil', active: expData.streak_harian >= 7 },
              { icon: '🔥', val: '14', label: 'Disiplin', active: expData.streak_harian >= 14 },
              { icon: '👑', val: '30', label: 'Master', active: expData.streak_harian >= 30 },
            ].map((s) => (
              <div key={s.label}
                className={`p-2 rounded-xl text-center transition-all ${s.active ? 'bg-[var(--color-primary)]/15 ring-1 ring-[var(--color-primary)]/30' : 'bg-[var(--color-surface-2)] opacity-50'}`}>
                <div className={`text-base transition-all ${s.active ? 'scale-110' : ''}`}>{s.icon}</div>
                <div className="font-bold text-xs">{s.val}</div>
                <div className="text-[8px] text-[var(--color-text-muted)]">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── SECTION 5: TIPS CARD ── */}
        <div className="rounded-2xl p-4 border border-amber-600/15 bg-gradient-to-br from-amber-600/8 to-amber-600/3">
          <div className="flex items-start gap-3">
            <span className="text-xl shrink-0">💡</span>
            <div>
              <p className="font-bold text-xs text-amber-600 mb-1">Cara Belajar Efektif</p>
              <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">Aktifkan <strong>Active Recall</strong>: balik kartu untuk uji ingatan → tandai yang sudah hafal → ulangi yang belum. Gunakan Quiz untuk evaluasi pemahamanmu.</p>
            </div>
          </div>
        </div>

        {/* ── SECTION 6: REVIEW VOCAB ── */}
        <div className="bg-[var(--bg-card)] rounded-2xl p-4 border border-[var(--color-border)]">
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold text-sm flex items-center gap-1.5 text-teal-500">
              <span>📖</span> Review Vocab Hari Ini
            </span>
            <span className="text-[10px] text-[var(--color-text-muted)]">{new Date().toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
          </div>
          <p className="text-[10px] text-[var(--color-text-muted)] mb-3">Ketuk kartu untuk lihat artinya</p>
          <div className="grid grid-cols-2 gap-2">
            {vocabSets[currentVocabSet].map((v, i) => (
              <DailyReviewCard key={i} kata={v.kata} romaji={v.romaji} arti={v.arti} />
            ))}
          </div>
          <button onClick={handleGantiVocab} className="w-full mt-2.5 py-2.5 bg-teal-600/10 text-teal-500 rounded-xl text-xs font-bold hover:brightness-110 transition-all">
            🔄 Ganti Set Kata Baru
          </button>
        </div>

        {/* ── SECTION 7: MISI HARIAN ── */}
        <DailyMissions />

        {/* ── SECTION 8: PILIH BUKU ── */}
        <div>
          <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase mb-2 tracking-wider flex items-center gap-1.5">
            <span className="w-1 h-3 rounded-full bg-[var(--color-primary)]" />
            Pilih Buku
          </p>
          <div className="grid grid-cols-2 gap-2">
            <Link href="/learn?book=I"
              className="group relative overflow-hidden rounded-2xl p-4 border border-emerald-600/20 bg-gradient-to-br from-emerald-600/8 to-emerald-600/3 hover:brightness-110 transition-all">
              <div className="text-xl mb-1">📗</div>
              <div className="font-bold text-sm" style={{ color: '#059669' }}>Buku I</div>
              <div className="text-[10px] text-[var(--color-text-muted)]">Pelajaran 1–25</div>
              <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-full bg-emerald-600/5" />
            </Link>
            <Link href="/learn?book=II"
              className="group relative overflow-hidden rounded-2xl p-4 border border-blue-600/20 bg-gradient-to-br from-blue-600/8 to-blue-600/3 hover:brightness-110 transition-all">
              <div className="text-xl mb-1">📘</div>
              <div className="font-bold text-sm" style={{ color: '#2563eb' }}>Buku II</div>
              <div className="text-[10px] text-[var(--color-text-muted)]">Pelajaran 26–50</div>
              <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-full bg-blue-600/5" />
            </Link>
          </div>
        </div>

        {/* ── SECTION 9: DAFTAR PELAJARAN ── */}
        <div>
          <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase mb-2 tracking-wider flex items-center gap-1.5">
            <span className="w-1 h-3 rounded-full bg-[var(--color-primary)]" />
            Daftar Pelajaran
          </p>
          <div className="space-y-1.5">
            {lessons.slice(0, 25).map((l) => {
              const p = progress.get(l.id);
              const isPremium = !l.is_free;
              const isDone = p === 'selesai';
              return (
                <Link key={l.id} href={`/learn/${l.id}`}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all hover:brightness-110 ${
                    isPremium ? 'border-[var(--color-border)] opacity-60' : isDone ? 'border-green-500/30 bg-green-600/5' : 'border-[var(--color-border)] bg-[var(--bg-card)]'
                  }`}>
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                    isPremium ? 'bg-[var(--color-surface-2)] text-[var(--color-text-muted)]' : isDone ? 'bg-green-600/20 text-green-500' : 'bg-violet-600/20 text-violet-500'
                  }`}>
                    {isPremium ? '🔒' : isDone ? '✅' : l.nomor_pelajaran}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{l.judul?.split('(')[0]?.trim() || `Pelajaran ${l.nomor_pelajaran}`}</div>
                    <div className="text-[10px] text-[var(--color-text-muted)]">
                      {isPremium ? '🔒 PREMIUM' : isDone ? '✅ Selesai' : '0% hafal'}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-in > * {
          animation: fadeInUp 0.4s ease-out both;
        }
        .animate-in > *:nth-child(1) { animation-delay: 0ms; }
        .animate-in > *:nth-child(2) { animation-delay: 50ms; }
        .animate-in > *:nth-child(3) { animation-delay: 100ms; }
        .animate-in > *:nth-child(4) { animation-delay: 150ms; }
        .animate-in > *:nth-child(5) { animation-delay: 200ms; }
        .animate-in > *:nth-child(6) { animation-delay: 250ms; }
        .animate-in > *:nth-child(7) { animation-delay: 300ms; }
        .animate-in > *:nth-child(8) { animation-delay: 350ms; }
        .animate-in > *:nth-child(9) { animation-delay: 400ms; }
      `}</style>
    </div>
  );
}

function DailyReviewCard({ kata, romaji, arti }: { kata: string; romaji?: string; arti: string }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div onClick={() => setFlipped(!flipped)}
      className="bg-[var(--bg-card)] border border-[var(--color-border)] rounded-xl p-3.5 text-center cursor-pointer min-h-[72px] flex flex-col items-center justify-center hover:border-[var(--color-primary)]/30 transition-all select-none group">
      {!flipped ? (
        <>
          <div className="text-base font-bold group-hover:text-[var(--color-primary)] transition-colors">{kata}</div>
          {romaji && <div className="text-[9px] text-[var(--color-text-muted)] mt-0.5">{romaji}</div>}
        </>
      ) : (
        <div className="text-sm font-medium text-[var(--color-primary)] animate-in">{arti}</div>
      )}
    </div>
  );
}
