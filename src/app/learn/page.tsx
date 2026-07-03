'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { useAuthStore } from '@/stores/useAuthStore';
import type { Lesson, UserProgress } from '@/types';

export default function LearnPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookParam = searchParams.get('book');
  const { user } = useAuthStore();
  const supabase = createClient();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [progress, setProgress] = useState<Map<number, string>>(new Map());
  const [selectedBook, setSelectedBook] = useState<'I' | 'II'>(bookParam === 'II' ? 'II' : 'I');
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { data: l } = await supabase.from('lessons').select('*').order('urutan', { ascending: true });
    if (l) {
      setLessons(l as Lesson[]);
      const bukuI = (l as Lesson[]).filter((x) => x.book === 'I');
      const bukuII = (l as Lesson[]).filter((x) => x.book === 'II');
      const allLessons = selectedBook === 'I' ? bukuI : bukuII;
      if (allLessons.length > 0 && !selectedLessonId) {
        const firstFree = allLessons.find(x => x.is_free) || allLessons[0];
        setSelectedLessonId(firstFree.id);
        // Redirect to first lesson if on /learn page
        if (window.location.pathname === '/learn') {
          router.replace(`/learn/${firstFree.id}`);
        }
      }
    }
    if (user) {
      const { data: p } = await supabase.from('user_progress').select('*').eq('user_id', user.id);
      if (p) {
        const m = new Map<number, string>();
        (p as UserProgress[]).forEach((pr) => m.set(pr.lesson_id, pr.status));
        setProgress(m);
      }
    }
    setLoading(false);
  };

  const filtered = lessons.filter((l) => l.book === selectedBook);
  const bukuI = lessons.filter((l) => l.book === 'I');
  const bukuII = lessons.filter((l) => l.book === 'II');
  const currentLesson = lessons.find(l => l.id === selectedLessonId);
  const completedCount = filtered.filter((l) => progress.get(l.id) === 'selesai').length;

  const handleBookChange = (book: 'I' | 'II') => {
    setSelectedBook(book);
    const targetLessons = book === 'I' ? bukuI : bukuII;
    if (targetLessons.length > 0) {
      const firstFree = targetLessons.find(x => x.is_free) || targetLessons[0];
      setSelectedLessonId(firstFree.id);
      router.push(`/learn?book=${book}`);
    }
  };

  const handleLessonChange = (lessonId: number) => {
    setSelectedLessonId(lessonId);
    router.push(`/learn/${lessonId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-app)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-app)]">
      {/* ── HEADER STICKY ── */}
      <header className="sticky top-0 z-40 bg-[var(--bg-app)]/95 backdrop-blur-lg border-b border-[var(--color-border)]">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <a href="/dashboard" className="text-xl text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors">←</a>
            <div>
              <div className="text-[10px] text-[var(--color-text-muted)] leading-tight font-medium">📚 Materi</div>
              <div className="font-bold text-sm leading-tight">Belajar</div>
            </div>
          </div>
          {/* Book filter pills */}
          <div className="flex items-center gap-1 bg-[var(--color-surface-2)] rounded-lg p-0.5">
            {(['I', 'II'] as const).map((book) => (
              <button
                key={book}
                onClick={() => handleBookChange(book)}
                className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all ${
                  selectedBook === book
                    ? 'bg-[var(--color-primary)] text-white shadow-sm'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                }`}
              >
                Buku {book}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ── CONTENT ── */}
      <div className="max-w-lg mx-auto px-4 py-5 space-y-4 pb-24">
        {/* ── SECTION 1: PROGRESS ── */}
        <div className="bg-[var(--bg-card)] rounded-2xl p-4 border border-[var(--color-border)]">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-sm flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[var(--color-primary)]" />
              Progress Buku {selectedBook}
            </span>
            <span className="text-xs font-bold text-[var(--color-primary)]">{completedCount}/{filtered.length} selesai</span>
          </div>
          <div className="bg-[var(--color-surface-2)] rounded-full h-2 mb-1 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${Math.min((completedCount / Math.max(filtered.length, 1)) * 100, 100)}%`,
                background: 'linear-gradient(90deg, var(--color-primary), #818cf8)',
              }}
            />
          </div>
          <p className="text-[11px] text-[var(--color-text-muted)]">
            Selesaikan quiz untuk menandai pelajaran selesai ✨
          </p>
        </div>

        {/* ── SECTION 2: LANJUT BELAJAR ── */}
        {filtered.length > 0 && currentLesson && (
          <a
            href={`/learn/${currentLesson.id}`}
            className="block relative overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--color-primary)]/10 to-indigo-600/5 border border-[var(--color-border)] p-4 hover:brightness-110 transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-[var(--color-text-muted)] mb-1">Lanjut Belajar</p>
                <div className="font-bold text-sm">
                  Pelajaran {currentLesson.nomor_pelajaran} &mdash; {currentLesson.judul?.split('(')[0]?.trim() || 'Pelajaran'}
                </div>
              </div>
              <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)]/20 flex items-center justify-center text-[var(--color-primary)] transition-transform hover:scale-110">
                ▶️
              </div>
            </div>
          </a>
        )}

        {/* ── SECTION 3: PILIH PELAJARAN ── */}
        <div className="bg-[var(--bg-card)] rounded-2xl p-4 border border-[var(--color-border)]">
          <div className="grid grid-cols-2 gap-2 mb-4">
            <select
              className="px-3 py-2 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] text-sm text-[var(--color-text)]"
              value={selectedBook}
              onChange={(e) => handleBookChange(e.target.value as 'I' | 'II')}
            >
              <option value="I">Buku I</option>
              <option value="II">Buku II</option>
            </select>
            <select
              className="px-3 py-2 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] text-sm text-[var(--color-text)]"
              value={selectedLessonId || ''}
              onChange={(e) => handleLessonChange(parseInt(e.target.value))}
            >
              {filtered.map((l) => (
                <option key={l.id} value={l.id}>
                  P {l.nomor_pelajaran} &mdash; {l.judul?.split('(')[0]?.trim() || ''}
                </option>
              ))}
            </select>
          </div>

          {/* Lesson info */}
          {currentLesson && (
            <div className="mb-4 p-3 rounded-xl bg-gradient-to-br from-[var(--color-primary)]/5 to-indigo-600/3 border border-[var(--color-border)]">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-[var(--color-text-muted)] mb-0.5">MNN Learning</div>
                  <div className="font-bold text-sm">Pelajaran {currentLesson.nomor_pelajaran}</div>
                  <div className="text-xs text-[var(--color-text-muted)]">{currentLesson.judul}</div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="text-[10px] font-bold text-[var(--color-primary)]">7%</div>
                  <div className="w-7 h-7 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center text-xs">
                    👤
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Learning tools */}
          <div className="grid grid-cols-4 gap-1.5 mb-4">
            {currentLesson && ['Flashcard', 'Kosa kata', 'Bunpou', 'Renshū'].map((tool) => (
              <a
                key={tool}
                href={`/learn/${currentLesson.id}#${tool.toLowerCase().replace(' ', '')}`}
                className="px-2 py-2 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[11px] font-medium hover:border-[var(--color-primary)]/50 hover:bg-[var(--color-primary)]/5 transition-all block text-center"
              >
                {tool}
              </a>
            ))}
          </div>

          {/* Flashcard demo */}
          {currentLesson && (
            <div className="bg-gradient-to-br from-[var(--color-primary)]/10 to-indigo-600/5 rounded-2xl p-5 border border-[var(--color-border)]">
              <div className="text-center mb-4">
                <div className="text-4xl font-bold mb-2">わたし</div>
                <div className="text-sm text-[var(--color-text-muted)]">watashi</div>
              </div>
              <div className="text-center text-sm text-[var(--color-text-muted)] mb-4">
                Arti: <span className="text-[var(--color-text)] font-medium">saya</span>
              </div>
              <div className="flex justify-center gap-2 mb-4">
                <a href={`/learn/${currentLesson.id}#flashcard`} className="px-4 py-2 rounded-xl bg-[var(--color-primary)]/15 text-[var(--color-primary)] text-xs font-bold hover:brightness-110 transition-all">
                  一緒に行きましょう
                </a>
                <button className="px-4 py-2 rounded-xl bg-[var(--color-surface-2)] text-xs font-medium text-[var(--color-text-muted)] hover:brightness-110 transition-all">
                  シャッフル
                </button>
                <a href={`/learn/${currentLesson.id}#flashcard`} className="px-4 py-2 rounded-xl bg-[var(--color-primary)]/15 text-[var(--color-primary)] text-xs font-bold hover:brightness-110 transition-all">
                  次へ
                </a>
              </div>
              <a href={`/learn/${currentLesson.id}#flashcard`} className="block w-full py-2.5 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white text-sm font-bold hover:brightness-110 transition-all shadow-lg shadow-[var(--color-primary)]/20 text-center">
                Tandai Sudah Hafal
              </a>
            </div>
          )}
        </div>

        {/* ── SECTION 4: DAFTAR PELAJARAN ── */}
        <div>
          <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase mb-2 tracking-wider flex items-center gap-1.5">
            <span className="w-1 h-3 rounded-full bg-[var(--color-primary)]" />
            Daftar Pelajaran
          </p>

          {/* Book I */}
          {selectedBook === 'I' && bukuI.length > 0 && (
            <div className="mb-3">
              <h2 className="text-xs font-bold text-[var(--color-text-muted)] mb-2 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" />
                Minna no Nihongo I
              </h2>
              <div className="space-y-1.5">
                {bukuI.map((l) => {
                  const p = progress.get(l.id);
                  const isPremium = !l.is_free;
                  const isDone = p === 'selesai';
                  return (
                    <a
                      key={l.id}
                      href={`/learn/${l.id}`}
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-all hover:brightness-110 w-full text-left ${
                        isPremium
                          ? 'border-[var(--color-border)] opacity-60'
                          : isDone
                          ? 'border-green-500/30 bg-green-600/5'
                          : selectedLessonId === l.id
                          ? 'border-[var(--color-primary)]/50 bg-[var(--color-primary)]/5'
                          : 'border-[var(--color-border)] bg-[var(--bg-card)]'
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                          isPremium
                            ? 'bg-[var(--color-surface-2)] text-[var(--color-text-muted)]'
                            : isDone
                            ? 'bg-green-600/20 text-green-500'
                            : selectedLessonId === l.id
                            ? 'bg-[var(--color-primary)]/20 text-[var(--color-primary)]'
                            : 'bg-violet-600/20 text-violet-500'
                        }`}
                      >
                        {isPremium ? '🔒' : isDone ? '✅' : l.nomor_pelajaran}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">
                          {l.judul?.split('(')[0]?.trim() || `Pelajaran ${l.nomor_pelajaran}`}
                        </div>
                        <div className="text-[10px] text-[var(--color-text-muted)]">
                          {isPremium ? '🔒 PREMIUM' : isDone ? '✅ Selesai' : selectedLessonId === l.id ? '▶ Dipilih' : '0% hafal'}
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          {/* Book II */}
          {selectedBook === 'II' && bukuII.length > 0 && (
            <div>
              <h2 className="text-xs font-bold text-[var(--color-text-muted)] mb-2 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500/50" />
                Minna no Nihongo II
              </h2>
              <div className="space-y-1.5">
                {bukuII.map((l) => {
                  const p = progress.get(l.id);
                  const isPremium = !l.is_free;
                  const isDone = p === 'selesai';
                  return (
                    <a
                      key={l.id}
                      href={`/learn/${l.id}`}
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-all hover:brightness-110 w-full text-left ${
                        isPremium
                          ? 'border-[var(--color-border)] opacity-60'
                          : isDone
                          ? 'border-green-500/30 bg-green-600/5'
                          : selectedLessonId === l.id
                          ? 'border-[var(--color-primary)]/50 bg-[var(--color-primary)]/5'
                          : 'border-[var(--color-border)] bg-[var(--bg-card)]'
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                          isPremium
                            ? 'bg-[var(--color-surface-2)] text-[var(--color-text-muted)]'
                            : isDone
                            ? 'bg-green-600/20 text-green-500'
                            : selectedLessonId === l.id
                            ? 'bg-[var(--color-primary)]/20 text-[var(--color-primary)]'
                            : 'bg-blue-600/20 text-blue-500'
                        }`}
                      >
                        {isPremium ? '🔒' : isDone ? '✅' : l.nomor_pelajaran}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">
                          {l.judul?.split('(')[0]?.trim() || `Pelajaran ${l.nomor_pelajaran}`}
                        </div>
                        <div className="text-[10px] text-[var(--color-text-muted)]">
                          {isPremium ? '🔒 PREMIUM' : isDone ? '✅ Selesai' : selectedLessonId === l.id ? '▶ Dipilih' : '0% hafal'}
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}