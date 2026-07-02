'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { useAuthStore } from '@/stores/useAuthStore';
import type { Lesson, Kotoba, UserProgress } from '@/types';

function LearnContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookFilter = searchParams.get('book');
  const { user, loading } = useAuthStore();
  const supabase = createClient();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [progress, setProgress] = useState<Map<number, string>>(new Map());
  const [selectedBook, setSelectedBook] = useState<'all' | 'I' | 'II'>(bookFilter as any || 'all');
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);
  const [vocab, setVocab] = useState<Kotoba[]>([]);
  const [vocabFilter, setVocabFilter] = useState('');

  // Auto-select first lesson if none selected
  useEffect(() => {
    if (lessons.length > 0 && selectedLesson === null) {
      const firstLesson = selectedBook === 'all' ? lessons[0] : lessons.find(l => l.book === selectedBook) || lessons[0];
      setSelectedLesson(firstLesson.id);
    }
  }, [lessons, selectedBook, selectedLesson]);

  // Load vocab when lesson selected
  useEffect(() => {
    if (selectedLesson) {
      loadVocab(selectedLesson);
    }
  }, [selectedLesson]);

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

  const loadVocab = async (lessonId: number) => {
    const { data: v } = await supabase.from('kotoba').select('*').eq('lesson_id', lessonId).order('urutan');
    if (v) setVocab(v as Kotoba[]);
  };

  const handleBookChange = (book: 'all' | 'I' | 'II') => {
    setSelectedBook(book);
    setSelectedLesson(null);
    setVocab([]);
    if (book === 'all') {
      router.push('/learn');
    } else {
      router.push(`/learn?book=${book}`);
    }
  };

  const handleLessonChange = (lessonId: number) => {
    setSelectedLesson(lessonId);
    setVocabFilter('');
  };

  const filtered = selectedBook === 'all' ? lessons : lessons.filter((l) => l.book === selectedBook);
  const bukuI = lessons.filter((l) => l.book === 'I');
  const bukuII = lessons.filter((l) => l.book === 'II');
  const filteredVocab = vocab.filter((v) =>
    v.kata_jepang.toLowerCase().includes(vocabFilter.toLowerCase()) ||
    v.arti_indonesia.toLowerCase().includes(vocabFilter.toLowerCase()) ||
    (v.romaji || '').toLowerCase().includes(vocabFilter.toLowerCase())
  );

  const statusColor = (status?: string) => {
    if (status === 'selesai') return 'border-green-500/50 bg-green-600/10';
    if (status === 'sedang') return 'border-blue-500/50 bg-blue-600/10';
    return 'border-[var(--color-border)] bg-[var(--bg-card)]';
  };

  const completedCount = filtered.filter((l) => progress.get(l.id) === 'selesai').length;

  return (
    <div className="min-h-screen bg-[var(--bg-app)]">
      {/* Header with Book Filter */}
      <header className="sticky top-0 z-40 bg-[var(--bg-app)]/95 backdrop-blur-lg border-b border-[var(--color-border)]">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/dashboard" className="text-xl text-[var(--color-text-muted)] hover:text-[var(--color-text)]">←</Link>
            <h1 className="font-bold">📚 Belajar</h1>
          </div>
          <div className="flex items-center gap-1 bg-[var(--color-surface-2)] rounded-lg p-1">
            <button
              onClick={() => handleBookChange('all')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                selectedBook === 'all' ? 'bg-[var(--color-primary)] text-white' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => handleBookChange('I')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                selectedBook === 'I' ? 'bg-[var(--color-primary)] text-white' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              Buku I
            </button>
            <button
              onClick={() => handleBookChange('II')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                selectedBook === 'II' ? 'bg-[var(--color-primary)] text-white' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              Buku II
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-5 space-y-4 pb-24">
        {/* Lesson Dropdown Selector */}
        <div className="bg-[var(--bg-card)] rounded-2xl p-4 border border-[var(--color-border)]">
          <label className="text-xs font-bold text-[var(--color-text-muted)] mb-2 block">Pilih Pelajaran</label>
          <select
            value={selectedLesson || ''}
            onChange={(e) => handleLessonChange(parseInt(e.target.value))}
            className="w-full px-3 py-2.5 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] text-sm outline-none focus:border-[var(--color-primary)] transition-all"
          >
            <option value="">-- Pilih Pelajaran --</option>
            {filtered.map((l) => (
              <option key={l.id} value={l.id}>
                Pelajaran {l.nomor_pelajaran} — {l.judul?.split('(')[0]?.trim() || ''} {l.is_free ? '' : '🔒'}
              </option>
            ))}
          </select>
        </div>

        {/* Vocabulary Panel */}
        {selectedLesson && (
          <div className="bg-[var(--bg-card)] rounded-2xl p-4 border border-[var(--color-border)]">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-sm">Filter Kosakata</h2>
              <span className="text-xs text-[var(--color-text-muted)]">{filteredVocab.length} kata</span>
            </div>
            {/* Search Input */}
            <input
              type="text"
              placeholder="Cari kosakata..."
              value={vocabFilter}
              onChange={(e) => setVocabFilter(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] text-sm outline-none focus:border-[var(--color-primary)] transition-all mb-4"
            />
            {/* Vocab List */}
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {filteredVocab.map((v) => (
                <div key={v.id} className="p-3 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)]">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{v.kata_jepang}</div>
                      {v.romaji && <div className="text-xs text-[var(--color-text-muted)]">{v.romaji}</div>}
                    </div>
                  </div>
                  <div className="text-xs text-[var(--color-text-muted)] mt-1">{v.arti_indonesia}</div>
                  {v.contoh_kalimat && (
                    <div className="text-[10px] text-[var(--color-text-muted)] mt-1 italic border-l-2 border-[var(--color-primary)]/30 pl-2">
                      {v.contoh_kalimat}
                    </div>
                  )}
                </div>
              ))}
              {filteredVocab.length === 0 && (
                <div className="text-center text-[var(--color-text-muted)] text-sm py-8">
                  Tidak ada kosakata untuk pelajaran ini.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Progress Overview */}
        <div className="bg-[var(--bg-card)] rounded-2xl p-4 border border-[var(--color-border)]">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-sm">Progress {selectedBook === 'all' ? 'Semua' : `Buku ${selectedBook}`}</span>
            <span className="text-xs font-bold text-[var(--color-primary)]">{completedCount}/{filtered.length} selesai</span>
          </div>
          <div className="bg-[var(--color-surface-2)] rounded-full h-2 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${(completedCount / Math.max(filtered.length, 1)) * 100}%`,
                background: 'linear-gradient(90deg, var(--color-primary), #818cf8)',
              }}
            />
          </div>
        </div>

        {/* Quick Navigation - First Uncompleted */}
        {filtered.length > 0 && (
          <div className="bg-gradient-to-br from-[var(--color-primary)]/10 to-indigo-600/5 rounded-2xl p-4 border border-[var(--color-border)]">
            <p className="text-sm text-[var(--color-text-muted)] mb-2">Lanjut Belajar</p>
            {(() => {
              const nextLesson = filtered.find((l) => progress.get(l.id) !== 'selesai') || filtered[0];
              return (
                <Link
                  href={`/learn/${nextLesson.id}`}
                  className="flex items-center justify-between p-3 bg-[var(--bg-card)] rounded-xl hover:brightness-110 transition-all"
                >
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

        {/* Buku I */}
        {(!selectedBook || selectedBook === 'all') && bukuI.length > 0 && (
          <div>
            <h2 className="font-bold text-sm text-[var(--color-text-muted)] mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Minna no Nihongo I (Pelajaran 1–25)
            </h2>
            <div className="grid grid-cols-1 gap-2">
              {bukuI.map((l) => {
                const p = progress.get(l.id);
                return (
                  <Link key={l.id} href={`/learn/${l.id}`}
                    className={`p-4 rounded-xl border ${statusColor(p)} hover:brightness-110 transition-all`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                          p === 'selesai' ? 'bg-green-600/20 text-green-500' : 'bg-[var(--color-primary)]/20 text-[var(--color-primary)]'
                        }`}>
                          {p === 'selesai' ? '✅' : l.nomor_pelajaran}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{l.judul?.split('(')[0]?.trim() || `Pelajaran ${l.nomor_pelajaran}`}</p>
                          <p className="text-[10px] text-[var(--color-text-muted)]">
                            {p === 'selesai' ? 'Selesai' : p === 'sedang' ? 'Sedang dikerjakan' : 'Belum dimulai'}
                          </p>
                        </div>
                      </div>
                      {!l.is_free && <span className="text-[10px] text-[var(--color-primary)] font-bold bg-[var(--color-primary)]/10 px-2 py-1 rounded">PREMIUM</span>}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Buku II */}
        {(!selectedBook || selectedBook === 'II') && bukuII.length > 0 && (
          <div>
            <h2 className="font-bold text-sm text-[var(--color-text-muted)] mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              Minna no Nihongo II (Pelajaran 26–50)
            </h2>
            <div className="grid grid-cols-1 gap-2">
              {bukuII.map((l) => {
                const p = progress.get(l.id);
                return (
                  <Link key={l.id} href={`/learn/${l.id}`}
                    className={`p-4 rounded-xl border ${statusColor(p)} hover:brightness-110 transition-all`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                          p === 'selesai' ? 'bg-green-600/20 text-green-500' : 'bg-[var(--color-primary)]/20 text-[var(--color-primary)]'
                        }`}>
                          {p === 'selesai' ? '✅' : l.nomor_pelajaran}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{l.judul?.split('(')[0]?.trim() || `Pelajaran ${l.nomor_pelajaran}`}</p>
                          <p className="text-[10px] text-[var(--color-text-muted)]">
                            {p === 'selesai' ? 'Selesai' : p === 'sedang' ? 'Sedang dikerjakan' : 'Belum dimulai'}
                          </p>
                        </div>
                      </div>
                      {!l.is_free && <span className="text-[10px] text-[var(--color-primary)] font-bold bg-[var(--color-primary)]/10 px-2 py-1 rounded">PREMIUM</span>}
                    </div>
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
