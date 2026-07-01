'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { useAuthStore } from '@/stores/useAuthStore';
import type { Lesson, UserProgress } from '@/types';

function LearnContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookFilter = searchParams.get('book');
  const { user, loading } = useAuthStore();
  const supabase = createClient();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [progress, setProgress] = useState<Map<number, string>>(new Map());

  useEffect(() => {
    loadData();
  }, [user, loading]);

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

  const filtered = bookFilter ? lessons.filter((l) => l.book === bookFilter) : lessons;
  const bukuI = filtered.filter((l) => l.book === 'I');
  const bukuII = filtered.filter((l) => l.book === 'II');

  const statusColor = (status?: string) => {
    if (status === 'selesai') return 'border-green-500/50 bg-green-600/10';
    if (status === 'sedang') return 'border-blue-500/50 bg-blue-600/10';
    return 'border-[var(--color-border)] bg-[var(--bg-card)]';
  };

  return (
    <div className="min-h-screen bg-[var(--bg-app)]">
      <header className="sticky top-0 z-40 bg-[var(--bg-app)]/90 backdrop-blur border-b border-[var(--color-border)]">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-3">
          <Link href="/dashboard" className="text-[var(--color-text-muted)] hover:text-[var(--color-text)]">←</Link>
          <h1 className="font-bold">📚 {bookFilter === 'I' ? 'Buku I' : bookFilter === 'II' ? 'Buku II' : 'Semua Pelajaran'}</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-5 space-y-4">
        {(!bookFilter || bookFilter === 'I') && (
          <div>
            <h2 className="font-bold text-sm text-[var(--color-text-muted)] mb-2">Minna no Nihongo I (Pelajaran 1–25)</h2>
            <div className="grid grid-cols-1 gap-2">
              {bukuI.map((l) => {
                const p = progress.get(l.id);
                return (
                  <Link key={l.id} href={`/learn/${l.id}`}
                    className={`p-4 rounded-xl border ${statusColor(p)} hover:brightness-110 transition-all`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-[var(--color-text-muted)]">Pelajaran {l.nomor_pelajaran}</span>
                      {p === 'selesai' && <span className="text-[10px] text-green-500">✅</span>}
                      {!l.is_free && <span className="text-[10px] text-[var(--color-primary)] font-bold">PREMIUM</span>}
                    </div>
                    <p className="font-medium text-sm">{l.judul}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {(!bookFilter || bookFilter === 'II') && (
          <div>
            <h2 className="font-bold text-sm text-[var(--color-text-muted)] mb-2">Minna no Nihongo II (Pelajaran 26–50)</h2>
            <div className="grid grid-cols-1 gap-2">
              {bukuII.map((l) => {
                const p = progress.get(l.id);
                return (
                  <Link key={l.id} href={`/learn/${l.id}`}
                    className={`p-4 rounded-xl border ${statusColor(p)} hover:brightness-110 transition-all`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-[var(--color-text-muted)]">Pelajaran {l.nomor_pelajaran}</span>
                      {p === 'selesai' && <span className="text-[10px] text-green-500">✅</span>}
                      {!l.is_free && <span className="text-[10px] text-[var(--color-primary)] font-bold">PREMIUM</span>}
                    </div>
                    <p className="font-medium text-sm">{l.judul}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function LearnPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-[var(--color-text-muted)]">Loading...</div>}>
      <LearnContent />
    </Suspense>
  );
}
