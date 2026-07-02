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
    if (lessons.length > 0 && !selectedLessonId) {
      setSelectedLessonId(lessons[0].id);
    }
  }, [lessons]);

  useEffect(() => {
    if (selectedLessonId && lessons.length > 0) {
      const lesson = lessons.find(l => l.id === selectedLessonId);
      if (lesson) {
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
    if (status === 'selesai') return 'border-green-500/30 bg-green-600/5';
    if (status === 'sedang') return 'border-blue-500/30 bg-blue-600/5';
    return 'border-[var(--color-border)] bg-[var(--bg-card)]';
  };

  const completedCount = filtered.filter((l) => progress.get(l.id) === 'selesai').length;

  return (
    <div className="min-h-screen bg-[var(--bg-app)]">
      {/* ── HEADER STICKY ── */}
      <header className="sticky top-0 z-40 bg-[var(--bg-app)]/95 backdrop-blur-lg border-b border-[var(--color-border)]">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Link href="/dashboard" className="text-xl text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors">
              ←
            </Link>
            <div>
              <div className="text-[10px] text-[var(--color-text-muted)] leading-tight font-medium">📚 Materi</div>
              <div className="font-bold text-sm leading-tight">Belajar</div>
            </div>
          </div>
          {/* Book filter pills */}
          <div className="flex items-center gap-1 bg-[var(--color-surface-2)] rounded-lg p-0.5">
            {(['all', 'I', 'II'] as const).map((book) => (
              <button
                key={book}
                onClick={() => handleBookChange(book)}
                className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all ${
                  selectedBook === book
                    ? 'bg-[var(--color-primary)] text-white shadow-sm'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                }`}
              >
                {book === 'all' ? 'Semua' : `Buku ${book}`}
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
              Progress {selectedBook === 'all' ? 'Semua' : `Buku ${selectedBook}`}
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
        {filtered.length > 0 && (
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--color-primary)]/10 to-indigo-600/5 border border-[var(--color-border)] p-4">
            {(() => {
              const nextLesson = filtered.find((l) => progress.get(l.id) !== 'selesai') || filtered[0];
              return (
                <Link
                  href={`/learn/${nextLesson.id}`}
                  className="flex items-center justify-between group"
                >
                  <div className="relative z-10">
                    <p className="text-xs text-[var(--color-text-muted)] mb-1">Lanjut Belajar</p>
                    <div className="font-bold text-sm">
                      Pelajaran {nextLesson.nomor_pelajaran} &mdash; {nextLesson.judul?.split('(')[0]?.trim() || 'Pelajaran'}
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)]/20 flex items-center justify-center text-[var(--color-primary)] transition-transform group-hover:scale-110">
                    ▶️
                  </div>
                </Link>
              );
            })()}
          </div>
        )}

        {/* ── SECTION 3: PILIH PELAJARAN ── */}
        <div className="bg-[var(--bg-card)] rounded-2xl p-4 border border-[var(--color-border)]">
          <div className="grid grid-cols-2 gap-2 mb-4">
            <select
              className="px-3 py-2 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] text-sm text-[var(--color-text)]"
              value={selectedBook}
              onChange={(e) => handleBookChange(e.target.value as any)}
            >
              <option value="I">Buku I</option>
              <option value="II">Buku II</option>
            </select>
            <select
              className="px-3 py-2 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] text-sm text-[var(--color-text)]"
              value={selectedLessonId || ''}
              onChange={(e) => setSelectedLessonId(parseInt(e.target.value))}
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
            {['Flashcard', 'Kosa kata', 'Bunpou', 'Renshū'].map((tool) => (
              <button
                key={tool}
                className="px-2 py-2 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[11px] font-medium hover:border-[var(--color-primary)]/50 hover:bg-[var(--color-primary)]/5 transition-all"
              >
                {tool}
              </button>
            ))}
          </div>

          {/* Flashcard demo */}
          {currentVocab && (
            <div className="bg-gradient-to-br from-[var(--color-primary)]/10 to-indigo-600/5 rounded-2xl p-5 border border-[var(--color-border)]">
              <div className="text-center mb-4">
                <div className="text-4xl font-bold mb-2">{currentVocab.jepang}</div>
                <div className="text-sm text-[var(--color-text-muted)]">{currentVocab.romaji}</div>
              </div>
              <div className="text-center text-sm text-[var(--color-text-muted)] mb-4">
                Arti: <span className="text-[var(--color-text)] font-medium">{currentVocab.arti}</span>
              </div>
              <div className="flex justify-center gap-2 mb-4">
                <button className="px-4 py-2 rounded-xl bg-[var(--color-primary)]/15 text-[var(--color-primary)] text-xs font-bold hover:brightness-110 transition-all">
                  一緒に行きましょう
                </button>
                <button className="px-4 py-2 rounded-xl bg-[var(--color-surface-2)] text-xs font-medium text-[var(--color-text-muted)] hover:brightness-110 transition-all">
                  シャッフル
                </button>
                <button className="px-4 py-2 rounded-xl bg-[var(--color-primary)]/15 text-[var(--color-primary)] text-xs font-bold hover:brightness-110 transition-all">
                  次へ
                </button>
              </div>
              <button className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white text-sm font-bold hover:brightness-110 transition-all shadow-lg shadow-[var(--color-primary)]/20">
                Tandai Sudah Hafal
              </button>
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
          {(!selectedBook || selectedBook === 'all') && bukuI.length > 0 && (
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
                    <button
                      key={l.id}
                      onClick={() => setSelectedLessonId(l.id)}
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
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Book II */}
          {(!selectedBook || selectedBook === 'II') && bukuII.length > 0 && (
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
                    <button
                      key={l.id}
                      onClick={() => setSelectedLessonId(l.id)}
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
                    </button>
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

export default function LearnPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-[var(--color-text-muted)]">Loading...</div>}>
      <LearnContent />
    </Suspense>
  );
}