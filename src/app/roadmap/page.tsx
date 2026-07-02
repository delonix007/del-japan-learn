'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import { useAuthStore } from '@/stores/useAuthStore';
import { isGuestMode, getGuestProgress } from '@/lib/guest';
import type { Lesson, UserProgress } from '@/types';

type LearningStep = {
  id: number;
  title: string;
  description: string;
  icon: string;
  lessons: number[];
  category: 'hiragana' | 'katakana' | 'basic' | 'intermediate';
};

const learningSteps: LearningStep[] = [
  {
    id: 1,
    title: 'Hiragana',
    description: 'Kuasai 46 huruf dasar Hiragana',
    icon: 'あ',
    lessons: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    category: 'hiragana',
  },
  {
    id: 2,
    title: 'Katakana',
    description: 'Kuasai 46 huruf Katakana',
    icon: 'ア',
    lessons: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
    category: 'katakana',
  },
  {
    id: 3,
    title: 'Basic Grammar',
    description: 'Pola kalimat dasar & partikel',
    icon: '📝',
    lessons: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
    category: 'basic',
  },
  {
    id: 4,
    title: 'Intermediate',
    description: 'Tata bahasa tingkat lanjut',
    icon: '📚',
    lessons: [31, 32, 33, 34, 35, 36, 37, 38, 39, 40],
    category: 'intermediate',
  },
];

export default function RoadmapPage() {
  const { user, loading } = useAuthStore();
  const supabase = createClient();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [progress, setProgress] = useState<Map<number, string>>(new Map());
  const [mounted, setMounted] = useState(false);
  const [stepProgress, setStepProgress] = useState<Map<number, number>>(new Map());

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (loading) return;
    loadData();
  }, [user, loading]);

  const loadData = async () => {
    const { data: l } = await supabase.from('lessons').select('*').order('urutan');
    if (l) setLessons(l as Lesson[]);

    let progressData: UserProgress[] = [];
    if (user) {
      const { data: p } = await supabase.from('user_progress').select('*').eq('user_id', user.id);
      if (p) progressData = p as UserProgress[];
    } else if (isGuestMode()) {
      // Guest progress from localStorage
      const gp = getGuestProgress();
      progressData = gp.lessons.map(id => ({ lesson_id: id, status: 'selesai' }) as UserProgress);
    }

    const m = new Map<number, string>();
    progressData.forEach((pr) => m.set(pr.lesson_id, pr.status));
    setProgress(m);

    // Calculate step progress
    const stepProg = new Map<number, number>();
    learningSteps.forEach(step => {
      const completed = step.lessons.filter(id => m.get(id) === 'selesai').length;
      const total = step.lessons.length;
      stepProg.set(step.id, (completed / total) * 100);
    });
    setStepProgress(stepProg);
  };

  const getStepStatus = (step: LearningStep) => {
    const pct = stepProgress.get(step.id) || 0;
    if (pct === 100) return { label: '✅ Selesai', color: 'text-green-500', bg: 'bg-green-600/10', border: 'border-green-500/30' };
    if (pct > 0) return { label: `${Math.round(pct)}%`, color: 'text-amber-500', bg: 'bg-amber-600/10', border: 'border-amber-500/30' };
    return { label: 'Belum dimulai', color: 'text-[var(--color-text-muted)]', bg: 'bg-[var(--color-surface-2)]', border: 'border-[var(--color-border)]' };
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-[var(--bg-app)]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[var(--bg-app)]/95 backdrop-blur-lg border-b border-[var(--color-border)]">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-3">
          <Link href="/dashboard" className="text-xl">←</Link>
          <h1 className="font-bold text-lg">Roadmap Belajar</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-5 space-y-4 pb-24">
        {/* Overview Card */}
        <div className="bg-gradient-to-br from-[var(--color-primary)]/10 to-indigo-600/5 rounded-2xl p-5 border border-[var(--color-border)]">
          <h2 className="text-xl font-extrabold mb-2">🎯 Jalan Menuju Kemahiran</h2>
          <p className="text-sm text-[var(--color-text-muted)] mb-3">
            Ikuti langkah-langkah ini secara berurutan untuk menguasai bahasa Jepang dari nol.
          </p>
          <div className="flex gap-3">
            {learningSteps.map((step, i) => {
              const pct = stepProgress.get(step.id) || 0;
              return (
                <div key={step.id} className="flex-1 text-center">
                  <div className="text-2xl mb-1">{step.icon}</div>
                  <div className="text-[10px] font-bold">{step.title}</div>
                  <div className="text-[8px] text-[var(--color-text-muted)]">{Math.round(pct)}%</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Learning Steps */}
        {learningSteps.map((step, index) => {
          const status = getStepStatus(step);
          const isUnlocked = index === 0 || (stepProgress.get(step.id - 1) || 0) > 0;

          return (
            <div
              key={step.id}
              className={`rounded-2xl p-4 border transition-all ${
                isUnlocked
                  ? `${status.bg} ${status.border}`
                  : 'opacity-50 border-[var(--color-border)]'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-[var(--color-primary)]/20 flex items-center justify-center text-2xl shrink-0">
                  {step.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-base">{step.title}</h3>
                    <span className={`text-xs font-bold ${status.color}`}>{status.label}</span>
                  </div>
                  <p className="text-xs text-[var(--color-text-muted)] mb-2">{step.description}</p>
                  
                  {/* Progress Bar */}
                  <div className="bg-[var(--color-surface-2)] rounded-full h-2 mb-3 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${stepProgress.get(step.id) || 0}%`,
                        background: 'linear-gradient(90deg, var(--color-primary), #818cf8)',
                      }}
                    />
                  </div>

                  {/* Lesson Buttons */}
                  <div className="flex flex-wrap gap-1.5">
                    {step.lessons.slice(0, 8).map((lessonId) => {
                      const isDone = progress.get(lessonId) === 'selesai';
                      return (
                        <Link
                          key={lessonId}
                          href={`/learn/${lessonId}`}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                            isDone
                              ? 'bg-green-600/20 text-green-500'
                              : isUnlocked
                              ? 'bg-[var(--color-primary)]/15 text-[var(--color-primary)] hover:brightness-110'
                              : 'bg-[var(--color-surface-2)] text-[var(--color-text-muted)] cursor-not-allowed'
                          }`}
                        >
                          {isDone ? '✅' : `L${lessonId}`}
                        </Link>
                      );
                    })}
                    {step.lessons.length > 8 && (
                      <span className="px-2.5 py-1 text-[10px] text-[var(--color-text-muted)]">
                        +{step.lessons.length - 8} lagi
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Completion Certificate Preview */}
        {Array.from(stepProgress.values()).every(pct => pct === 100) && (
          <div className="bg-gradient-to-br from-amber-600/10 to-amber-600/5 rounded-2xl p-6 border border-amber-500/30 text-center">
            <div className="text-4xl mb-3">🏆</div>
            <h2 className="text-xl font-extrabold text-amber-600 mb-2">Selamat!</h2>
            <p className="text-sm text-[var(--color-text-muted)]">
              Kamu telah menyelesaikan semua langkah pembelajaran! Terus tingkatkan kemampuanmu dengan latihan lanjutan.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
