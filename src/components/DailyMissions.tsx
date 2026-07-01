'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { useAuthStore } from '@/stores/useAuthStore';
import { isGuestMode, getGuestProgress, saveGuestProgress } from '@/lib/guest';

interface Mission {
  icon: string;
  label: string;
  exp: number;
  key: string;
}

const missions: Mission[] = [
  { icon: '📖', label: 'Pelajari 10 kosakata baru', exp: 20, key: 'vocab' },
  { icon: '🎯', label: 'Selesaikan 1 sesi quiz', exp: 30, key: 'quiz' },
  { icon: '🃏', label: 'Review 5 flashcard', exp: 50, key: 'flashcard' },
];

function getResetTime(): string {
  const now = new Date();
  const reset = new Date(now);
  reset.setHours(24, 0, 0, 0);
  const diff = reset.getTime() - now.getTime();
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  return `${h}j ${m}m`;
}

export default function DailyMissions() {
  const { user } = useAuthStore();
  const supabase = createClient();
  const [done, setDone] = useState<string[]>([]);
  const [timer, setTimer] = useState('');
  const [claiming, setClaiming] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('deljapan-missions');
    const today = new Date().toDateString();
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.date === today) {
          setDone(data.done || []);
        } else {
          localStorage.removeItem('deljapan-missions');
        }
      } catch {}
    }
    setTimer(getResetTime());
    const interval = setInterval(() => setTimer(getResetTime()), 60000);
    return () => clearInterval(interval);
  }, []);

  const claim = async (key: string) => {
    if (done.includes(key) || claiming) return;
    setClaiming(key);
    const mission = missions.find((m) => m.key === key);
    if (!mission) return;

    const newDone = [...done, key];
    setDone(newDone);
    localStorage.setItem('deljapan-missions', JSON.stringify({
      date: new Date().toDateString(),
      done: newDone,
    }));

    // Award EXP
    try {
      if (user) {
        await supabase.rpc('add_exp', { p_user_id: user.id, p_exp: mission.exp });
      } else if (isGuestMode()) {
        const gp = getGuestProgress();
        saveGuestProgress({ exp: gp.exp + mission.exp });
      }
    } catch (err) {
      console.error('Mission EXP error:', err);
    }
    setClaiming(null);
  };

  return (
    <div className="bg-[var(--bg-card)] rounded-2xl p-5 border border-[var(--color-border)]">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-sm">🎯 Misi Harian ({done.length}/{missions.length})</h3>
        <span className="text-xs text-[var(--color-text-muted)]">Reset {timer}</span>
      </div>
      <div className="space-y-2">
        {missions.map((m) => {
          const isDone = done.includes(m.key);
          return (
            <div key={m.key}
              className={`flex items-center gap-3 p-2.5 rounded-xl text-sm ${isDone ? 'bg-green-600/10' : 'bg-[var(--color-surface-2)]'}`}>
              <span className="text-lg">{m.icon}</span>
              <span className={`flex-1 ${isDone ? 'text-green-500 line-through' : ''}`}>{m.label}</span>
              <span className="text-[var(--color-primary)] font-medium text-xs">+{m.exp}</span>
              {isDone ? (
                <span className="text-green-500 text-xs">✅</span>
              ) : (
                <button onClick={() => claim(m.key)} disabled={claiming === m.key}
                  className="px-2 py-1 text-[10px] bg-[var(--color-primary)]/20 text-[var(--color-primary)] rounded-lg font-bold hover:brightness-110 disabled:opacity-50">
                  {claiming === m.key ? '...' : 'Ambil'}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
