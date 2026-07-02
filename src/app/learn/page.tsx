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
  const [selectedBook, setSelectedBook] = useState<'all' | 'I' | 'II'>(bookFilter as any || 'all');
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);
  const [currentVocab, setCurrentVocab] = useState<{jepang: string, romaji: string, arti: string} | null>(null);

  useEffect(() => {
    loadData();
  }, [user, loading]);

  const loadData = async () => {
    const { data: l } = await supabase.from('lessons').select('*').order('urutan', { ascending: true });
    if (l) setLessons(l as Lesson[]);
    if (!user) return;
    const { data: p } = await supabase.from('user_progress').select('*').eq('user_id', user.id);
    if (p) {
      const m = new Map<number, string>();
      (p as UserProgress[]).forEach((pr) => m.set(pr.lesson_id, pr.status));
      setProgress(m);
    }
  };

  useEffect(() => {
    // Load first lesson's vocab as default
    if (lessons.length > 0 && !selectedLessonId) {
      setSelectedLessonId(lessons[0].id);
    }
  }, [lessons]);

  useEffect(() => {
    // Load vocab when lesson changes
    if (selectedLessonId && lessons.length > 0) {
      const lesson = lessons.find(l => l.id === selectedLessonId);
      if (lesson) {
        // Show first vocab word for demo
        setCurrentVocab({ jepang: 'わたし', romaji: 'watashi', arti: 'saya' });
      }
    }
  }, [selectedLessonId, lessons]);

  const handleBookChange = (book: 'all' | 'I' | 'II') => {
    setSelectedBook(book);
    if (book === 'all') {
      router.push('/learn');
    } else {
      router.push(`/learn?book=${book}`);
    }
  };

  const filtered = selectedBook === 'all' ? lessons : lessons.filter((l) => l.book === selectedBook);
  const bukuI = lessons.filter((l) => l.book === 'I');
  const bukuII = lessons.filter((l) => l.book === 'II');
  const currentLesson = lessons.find(l => l.id === selectedLessonId);

  const statusColor = (status?: string) => {
    if (status === 'selesai') return 'border-green-500/50 bg-green-600/10';
    if (status === 'sedang') return 'border-blue-500/50 bg-blue-600/10';
    return 'border-[var(--color-border)] bg-[var(--bg-card)]';
  };

  const completedCount = filtered.filter((l) => progress.get(l.id) === 'selesai').length;

  return (
    <div className="min-h-screen bg-[var(--bg-app)] flex">
      {/* Left Panel - Lesson List */}
      <aside className="w-full md:w-1/3 border-r border-[var(--color-border)] bg-[var(--bg-card)] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-[var(--bg-app)]/95 backdrop-blur-lg border-b border-[var(--color-border)] p-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="text-xl text-[var(--color-text-muted)] hover:text-[var(--color-text)]">←</Link>
            <h1 className="font-bold">📚 Belajar</h1>
          </div>
          <div className="flex items-center gap-1 bg-[var(--color-surface-2)] rounded-lg p-1 mt-2">
            <button onClick={() => handleBookChange('all')} className={`px-3 py-1.5 rounded-md text-xs font-bold ${selectedBook === 'all' ? 'bg-[var(--color-primary)] text-white' : 'text-[var(--color-text-muted)]'}`}>Semua</button>
            <button onClick={() => handleBookChange('I')} className={`px-3 py-1.5 rounded-md text-xs font-bold ${selectedBook === 'I' ? 'bg-[var(--color-primary)] text-white' : 'text-[var(--color-text-muted)]'}`}>Buku I</button>
            <button onClick={() => handleBookChange('II')} className={`px-3 py-1.5 rounded-md text-xs font-bold ${selectedBook === 'II' ? 'bg-[var(--color-primary)] text-white' : 'text-[var(--color-text-muted)]'}`}>Buku II</button>
          </div>
        </div>

        {/* Progress */}
        <div className="p-4 border-b border-[var(--color-border)]">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-sm">Progress {selectedBook === 'all' ? 'Semua' : `Buku ${selectedBook}`}</span>
            <span className="text-xs text-[var(--color-primary)]">{completedCount}/{filtered.length} selesai</span>
          </div>
          <div className="bg-[var(--color-surface-2)] rounded-full h-2 overflow-hidden">
            <div className="h-full rounded-full bg-[var(--color-primary)]" style={{ width: `${(completedCount / Math.max(filtered.length, 1)) * 100}%` }} />
          </div>
        </div>

        {/* Continue Learning */}
        {filtered.length > 0 && (
          <div className="p-4 border-b border-[var(--color-border)]">
            <p className="text-sm text-[var(--color-text-muted)] mb-2">Lanjut Belajar</p>
            {(() => {
              const nextLesson = filtered.find((l) => progress.get(l.id) !== 'selesai') || filtered[0];
              return (
                <Link href={`/learn/${nextLesson.id}`} className="flex items-center justify-between p-3 bg-[var(--bg-card)] rounded-xl hover:brightness-110">
                  <div>
                    <div className="font-bold text-sm">Pelajaran {nextLesson.nomor_pelajaran}</div>
                    <div className="text-xs text-[var(--color-text-muted)]">{nextLesson.judul?.split('(')[0]?.trim() || 'Pelajaran'}</div>
                  </div>
                  <div className="text-xl">▶️</div>
                </Link>
              );
            })()}
          </div>
        )}

        {/* Lessons List */}
        {(!selectedBook || selectedBook === 'all') && bukuI.length > 0 && (
          <div className="p-4 border-b border-[var(--color-border)]">
            <h2 className="font-bold text-sm mb-2 text-[var(--color-text-muted)]">Minna no Nihongo I</h2>
            <div className="space-y-2">
              {bukuI.map((l) => (
                <button key={l.id} onClick={() => setSelectedLessonId(l.id)} className={`w-full p-3 rounded-xl text-left ${statusColor(progress.get(l.id))}`}>
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-sm">{l.judul?.split('(')[0]?.trim() || `Pelajaran ${l.nomor_pelajaran}`}</div>
                    <div className="text-xs">{progress.get(l.id) === 'selesai' ? '✅' : l.nomor_pelajaran}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {(!selectedBook || selectedBook === 'II') && bukuII.length > 0 && (
          <div className="p-4">
            <h2 className="font-bold text-sm mb-2 text-[var(--color-text-muted)]">Minna no Nihongo II</h2>
            <div className="space-y-2">
              {bukuII.map((l) => (
                <button key={l.id} onClick={() => setSelectedLessonId(l.id)} className={`w-full p-3 rounded-xl text-left ${statusColor(progress.get(l.id))}`}>
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-sm">{l.judul?.split('(')[0]?.trim() || `Pelajaran ${l.nomor_pelajaran}`}</div>
                    <div className="text-xs">{progress.get(l.id) === 'selesai' ? '✅' : l.nomor_pelajaran}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* Right Panel - Content */}
      <main className="flex-1 p-4 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xs text-[var(--color-text-muted)] mb-1">MNN Learning</div>
            <div className="font-bold text-lg">Pelajaran {currentLesson?.nomor_pelajaran}</div>
            <div className="text-sm text-[var(--color-text-muted)]">{currentLesson?.judul}</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-xs text-[var(--color-text-muted)]">7%</div>
            <div className="w-8 h-8 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center text-[var(--color-text)]">👤</div>
          </div>
        </div>

        {/* Book & Lesson Selector */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <select className="px-3 py-2 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] text-sm" value={selectedBook} onChange={(e) => handleBookChange(e.target.value as any)}>
            <option value="I">Buku I</option>
            <option value="II">Buku II</option>
          </select>
          <select className="px-3 py-2 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] text-sm" value={selectedLessonId || ''} onChange={(e) => setSelectedLessonId(parseInt(e.target.value))}>
            {filtered.map((l) => (
              <option key={l.id} value={l.id}>Pelajaran {l.nomor_pelajaran} — {l.judul?.split('(')[0]?.trim() || ''}</option>
            ))}
          </select>
        </div>

        {/* Learning Tools */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {['Flashcard', 'Kosa kata', 'Bunpou', 'Renshū'].map((tool) => (
            <button key={tool} className="px-2 py-3 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] text-sm hover:border-[var(--color-primary)] transition-all">
              {tool}
            </button>
          ))}
        </div>

        {/* Flashcard Demo */}
        {currentVocab && (
          <div className="bg-gradient-to-br from-[var(--color-primary)]/10 to-indigo-600/5 rounded-2xl p-6 border border-[var(--color-border)]">
            <div className="text-center mb-4">
              <div className="text-4xl font-bold mb-2">{currentVocab.jepang}</div>
              <div className="text-lg text-[var(--color-text-muted)]">{currentVocab.romaji}</div>
            </div>
            <div className="text-center text-sm text-[var(--color-text-muted)] mb-4">{currentVocab.arti}</div>
            <div className="flex justify-center gap-2 mb-4">
              <button className="px-4 py-2 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-sm">一緒に行きましょう</button>
              <button className="px-4 py-2 rounded-lg bg-[var(--color-surface-2)] text-sm">シャッフル</button>
              <button className="px-4 py-2 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-sm">次へ</button>
            </div>
            <button className="w-full py-2 rounded-xl bg-[var(--color-primary)] text-white text-sm">Tandai Sudah Hafal</button>
          </div>
        )}
      </main>
    </div>
  );
}

export default function LearnPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <LearnContent />
    </Suspense>
  );
}
