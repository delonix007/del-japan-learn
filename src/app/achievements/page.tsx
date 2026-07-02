'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { useAuthStore } from '@/stores/useAuthStore';
import { isGuestMode, getGuestProgress } from '@/lib/guest';

type Achievement = {
  id: string;
  icon: string;
  title: string;
  description: string;
  requirement: number;
  category: 'streak' | 'lessons' | 'vocab' | 'kana' | 'special';
  unlocked: boolean;
  progress: number;
};

export default function AchievementsPage() {
  const { user, loading } = useAuthStore();
  const supabase = createClient();
  const [expData, setExpData] = useState({ total_exp: 0, level: 1, streak_harian: 0 });
  const [lessonsCompleted, setLessonsCompleted] = useState(0);
  const [vocabLearned, setVocabLearned] = useState(0);
  const [kanaMastered, setKanaMastered] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (loading) return;
    loadData();
  }, [user, loading]);

  const loadData = async () => {
    if (user) {
      const { data: e } = await supabase.from('user_exp').select('*').eq('user_id', user.id).single();
      if (e) setExpData(e as any);

      const { data: p } = await supabase.from('user_progress').select('*').eq('user_id', user.id).eq('status', 'selesai');
      if (p) setLessonsCompleted(p.length);

      // Vocab & kana would need separate tracking tables
      setVocabLearned(0);
      setKanaMastered(0);
    } else if (isGuestMode()) {
      const gp = getGuestProgress();
      setExpData({ total_exp: gp.exp, level: gp.level, streak_harian: gp.streak });
      setLessonsCompleted(gp.lessons.length);
    }
  };

  const achievements: Achievement[] = [
    // Streak Achievements
    {
      id: 'streak_3',
      icon: '🌱',
      title: 'Konsisten',
      description: 'Belajar 3 hari berturut-turut',
      requirement: 3,
      category: 'streak',
      unlocked: expData.streak_harian >= 3,
      progress: Math.min(expData.streak_harian / 3, 1),
    },
    {
      id: 'streak_7',
      icon: '⚡',
      title: 'Stabil',
      description: 'Belajar 7 hari berturut-turut',
      requirement: 7,
      category: 'streak',
      unlocked: expData.streak_harian >= 7,
      progress: Math.min(expData.streak_harian / 7, 1),
    },
    {
      id: 'streak_14',
      icon: '🔥',
      title: 'Disiplin',
      description: 'Belajar 14 hari berturut-turut',
      requirement: 14,
      category: 'streak',
      unlocked: expData.streak_harian >= 14,
      progress: Math.min(expData.streak_harian / 14, 1),
    },
    {
      id: 'streak_30',
      icon: '👑',
      title: 'Master',
      description: 'Belajar 30 hari berturut-turut',
      requirement: 30,
      category: 'streak',
      unlocked: expData.streak_harian >= 30,
      progress: Math.min(expData.streak_harian / 30, 1),
    },
    // Lesson Achievements
    {
      id: 'lessons_5',
      icon: '📖',
      title: 'Pemula',
      description: 'Selesaikan 5 pelajaran',
      requirement: 5,
      category: 'lessons',
      unlocked: lessonsCompleted >= 5,
      progress: Math.min(lessonsCompleted / 5, 1),
    },
    {
      id: 'lessons_10',
      icon: '📚',
      title: 'Rajin',
      description: 'Selesaikan 10 pelajaran',
      requirement: 10,
      category: 'lessons',
      unlocked: lessonsCompleted >= 10,
      progress: Math.min(lessonsCompleted / 10, 1),
    },
    {
      id: 'lessons_25',
      icon: '🎓',
      title: 'Lulusan',
      description: 'Selesaikan 25 pelajaran',
      requirement: 25,
      category: 'lessons',
      unlocked: lessonsCompleted >= 25,
      progress: Math.min(lessonsCompleted / 25, 1),
    },
    {
      id: 'lessons_50',
      icon: '🏆',
      title: 'Master',
      description: 'Selesaikan semua 50 pelajaran',
      requirement: 50,
      category: 'lessons',
      unlocked: lessonsCompleted >= 50,
      progress: Math.min(lessonsCompleted / 50, 1),
    },
    // Level Achievements
    {
      id: 'level_5',
      icon: '⭐',
      title: 'Bintang Baru',
      description: 'Capai level 5',
      requirement: 5,
      category: 'special',
      unlocked: expData.level >= 5,
      progress: Math.min(expData.level / 5, 1),
    },
    {
      id: 'level_10',
      icon: '🌟',
      title: 'Super Star',
      description: 'Capai level 10',
      requirement: 10,
      category: 'special',
      unlocked: expData.level >= 10,
      progress: Math.min(expData.level / 10, 1),
    },
    {
      id: 'level_20',
      icon: '💫',
      title: 'Legend',
      description: 'Capai level 20',
      requirement: 20,
      category: 'special',
      unlocked: expData.level >= 20,
      progress: Math.min(expData.level / 20, 1),
    },
  ];

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const categories = ['streak', 'lessons', 'special'] as const;
  const categoryNames = { streak: 'Konsistensi', lessons: 'Pelajaran', special: 'Special' };
  const categoryIcons = { streak: '🔥', lessons: '📚', special: '⭐' };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-[var(--bg-app)]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[var(--bg-app)]/95 backdrop-blur-lg border-b border-[var(--color-border)]">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-3">
          <a href="/dashboard" className="text-xl">←</a>
          <h1 className="font-bold text-lg">Achievement</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-5 space-y-4 pb-24">
        {/* Overview */}
        <div className="bg-gradient-to-br from-amber-600/10 to-orange-600/5 rounded-2xl p-5 border border-amber-500/30">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-xl font-extrabold">🏆 Achievement</h2>
              <p className="text-sm text-[var(--color-text-muted)]">
                {unlockedCount} dari {achievements.length} terbuka
              </p>
            </div>
            <div className="text-4xl">🎖️</div>
          </div>
          <div className="bg-[var(--color-surface-2)] rounded-full h-3 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${(unlockedCount / achievements.length) * 100}%`,
                background: 'linear-gradient(90deg, #f59e0b, #ef4444)',
              }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-[var(--bg-card)] rounded-xl p-3 text-center border border-[var(--color-border)]">
            <div className="text-2xl font-extrabold text-[var(--color-primary)]">{expData.streak_harian}</div>
            <div className="text-[10px] text-[var(--color-text-muted)]">Hari Streak</div>
          </div>
          <div className="bg-[var(--bg-card)] rounded-xl p-3 text-center border border-[var(--color-border)]">
            <div className="text-2xl font-extrabold text-emerald-500">{lessonsCompleted}</div>
            <div className="text-[10px] text-[var(--color-text-muted)]">Pelajaran</div>
          </div>
          <div className="bg-[var(--bg-card)] rounded-xl p-3 text-center border border-[var(--color-border)]">
            <div className="text-2xl font-extrabold text-orange-500">Lv.{expData.level}</div>
            <div className="text-[10px] text-[var(--color-text-muted)]">Level</div>
          </div>
        </div>

        {/* Achievement Categories */}
        {categories.map(category => {
          const catAchievements = achievements.filter(a => a.category === category);
          return (
            <div key={category}>
              <h3 className="font-bold text-sm text-[var(--color-text-muted)] mb-2 flex items-center gap-2">
                <span>{categoryIcons[category]}</span>
                {categoryNames[category]}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {catAchievements.map(achievement => (
                  <div
                    key={achievement.id}
                    className={`rounded-xl p-3 border transition-all ${
                      achievement.unlocked
                        ? 'bg-gradient-to-br from-amber-600/15 to-amber-600/5 border-amber-500/30'
                        : 'bg-[var(--bg-card)] border-[var(--color-border)] opacity-60'
                    }`}
                  >
                    <div className="flex items-start gap-2 mb-2">
                      <span className="text-2xl">{achievement.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-xs truncate">{achievement.title}</div>
                        <div className="text-[10px] text-[var(--color-text-muted)] line-clamp-2">
                          {achievement.description}
                        </div>
                      </div>
                    </div>
                    {achievement.unlocked ? (
                      <div className="text-[10px] text-green-500 font-bold flex items-center gap-1">
                        ✅ Terbuka!
                      </div>
                    ) : (
                      <div>
                        <div className="bg-[var(--color-surface-2)] rounded-full h-1.5 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${achievement.progress * 100}%`,
                              background: 'linear-gradient(90deg, var(--color-primary), #818cf8)',
                            }}
                          />
                        </div>
                        <div className="text-[8px] text-[var(--color-text-muted)] mt-1">
                          {Math.round(achievement.progress * 100)}% ({achievement.requirement})
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </main>
    </div>
  );
}
