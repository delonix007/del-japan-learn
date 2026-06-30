'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { useAuthStore } from '@/stores/useAuthStore';
import type { Lesson, UserProgress } from '@/types';

export default function LearnPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const supabase = createClient();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [progress, setProgress] = useState<Map<number, string>>(new Map());

  useEffect(() => {
    if (!user) { router.push('/auth?mode=login'); return; }
    loadData();
  }, [user]);

  const loadData = async () => {
    const { data: l } = await supabase.from('lessons').select('*').order('urutan', { ascending: true });
    if (l) setLessons(l as Lesson[]);

    const { data: p } = await supabase.from('user_progress').select('*').eq('user_id', user!.id);
    if (p) {
      const m = new Map<number, string>();
      (p as UserProgress[]).forEach((pr) => m.set(pr.lesson_id, pr.status));
      setProgress(m);
    }
  };

  const statusColor = (status?: string) => {
    if (status === 'selesai') return 'border-green-500 bg-green-50';
    if (status === 'sedang') return 'border-blue-500 bg-blue-50';
    return 'border-gray-200 bg-white';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-400 hover:text-primary">←</Link>
          <h1 className="font-bold text-accent">📚 Semua Pelajaran</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Buku I */}
        <h2 className="font-bold text-lg text-accent mb-3">Minna no Nihongo I (Pelajaran 1–25)</h2>
        <div className="grid sm:grid-cols-2 gap-3 mb-8">
          {lessons.filter((l) => l.book === 'I').map((l) => {
            const p = progress.get(l.id);
            return (
              <Link
                key={l.id}
                href={`/learn/${l.id}`}
                className={`p-4 rounded-xl border-2 ${statusColor(p)} hover:shadow-md transition-all`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-gray-400">Pelajaran {l.nomor_pelajaran}</span>
                  {p === 'selesai' && <span className="text-xs text-green-600">✅ Selesai</span>}
                  {!l.is_free && <span className="text-xs text-primary font-bold">PREMIUM</span>}
                </div>
                <p className="font-bold text-sm">{l.judul}</p>
              </Link>
            );
          })}
        </div>

        {/* Buku II */}
        <h2 className="font-bold text-lg text-accent mb-3">Minna no Nihongo II (Pelajaran 26–50)</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {lessons.filter((l) => l.book === 'II').map((l) => {
            const p = progress.get(l.id);
            return (
              <Link
                key={l.id}
                href={`/learn/${l.id}`}
                className={`p-4 rounded-xl border-2 ${statusColor(p)} hover:shadow-md transition-all`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-gray-400">Pelajaran {l.nomor_pelajaran}</span>
                  {p === 'selesai' && <span className="text-xs text-green-600">✅ Selesai</span>}
                  <span className="text-xs text-primary font-bold">PREMIUM</span>
                </div>
                <p className="font-bold text-sm">{l.judul || `Pelajaran ${l.nomor_pelajaran}`}</p>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
