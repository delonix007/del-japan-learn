'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { useAuthStore } from '@/stores/useAuthStore';
import { shuffleArray, sampleArray } from '@/lib/shuffle';
import type { Kanji } from '@/types';

type ViewMode = 'list' | 'flashcard' | 'quiz';

export default function KanjiPage() {
  const router = useRouter();
  const { user, loading } = useAuthStore();
  const supabase = createClient();
  const [kanjiList, setKanjiList] = useState<Kanji[]>([]);
  const [progress, setProgress] = useState<Set<number>>(new Set());
  const [view, setView] = useState<ViewMode>('list');
  const [filterSet, setFilterSet] = useState<number>(0);
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [quizMode, setQuizMode] = useState<'baca' | 'info'>('baca');
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { data: k } = await supabase.from('kanji').select('*').order('set_number', { ascending: true }).order('id', { ascending: true });
    if (k) setKanjiList(k as Kanji[]);
    if (!user) return;
    const { data: p } = await supabase.from('user_kanji_progress').select('kanji_id').eq('user_id', user.id).eq('status_hafal', true);
    if (p) setProgress(new Set(p.map((r: any) => r.kanji_id)));
  };

  const toggleHafal = async (kanjiId: number) => {
    const newProgress = new Set(progress);
    if (newProgress.has(kanjiId)) {
      newProgress.delete(kanjiId);
      await supabase.from('user_kanji_progress').delete().eq('user_id', user!.id).eq('kanji_id', kanjiId);
    } else {
      newProgress.add(kanjiId);
      await supabase.from('user_kanji_progress').insert({ user_id: user!.id, kanji_id: kanjiId, status_hafal: true });
    }
    setProgress(newProgress);
  };

  const filtered = filterSet === 0 ? kanjiList : kanjiList.filter((k) => k.set_number === filterSet);
  const sets = [...new Set(kanjiList.map((k) => k.set_number))].sort();

  // Flashcard
  const fcList = filtered.length > 0 ? filtered : kanjiList;
  const current = fcList[cardIndex] || null;

  // Quiz
  const quizList = sampleArray(kanjiList, 10);
  const qCurrent = quizList[quizIndex];

  const handleQuizAnswer = (answer: string) => {
    if (quizMode === 'baca') {
      if (answer === qCurrent.arti) setQuizScore((s) => s + 1);
    } else {
      if (answer === qCurrent.karakter) setQuizScore((s) => s + 1);
    }
    if (quizIndex < quizList.length - 1) {
      setQuizIndex((i) => i + 1);
    } else {
      setShowResult(true);
    }
  };

  if (kanjiList.length === 0) return <div className="p-8 text-center text-gray-400 dark:text-gray-500">Loading...</div>;

  return (
    <div className="min-h-screen bg-[var(--bg-app)]">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-4">
          <Link href="/dashboard" className="text-[var(--color-text-muted)] hover:text-[var(--color-text)]">←</Link>
          <h1 className="font-bold text-accent">🈳 Kanji</h1>
          <span className="text-sm text-gray-400 dark:text-gray-500">{progress.size}/{kanjiList.length} hafal</span>
          <div className="ml-auto flex gap-1 bg-gray-100 rounded-xl p-1">
            {(['list', 'flashcard', 'quiz'] as ViewMode[]).map((v) => (
              <button key={v} onClick={() => { setView(v); setCardIndex(0); setFlipped(false); setQuizIndex(0); setQuizScore(0); setShowResult(false); }}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${view === v ? 'bg-white dark:bg-gray-800 shadow-sm text-primary' : 'text-gray-500 dark:text-gray-400 dark:text-gray-500'}`}>
                {v === 'list' ? '📋' : v === 'flashcard' ? '🃏' : '✍️'} {v}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        {/* LIST VIEW */}
        {view === 'list' && (
          <>
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
              <button onClick={() => setFilterSet(0)} className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${filterSet === 0 ? 'bg-primary text-white' : 'bg-white dark:bg-gray-800 border border-gray-200 text-gray-600'}`}>Semua</button>
              {sets.map((s) => (
                <button key={s} onClick={() => setFilterSet(s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${filterSet === s ? 'bg-primary text-white' : 'bg-white dark:bg-gray-800 border border-gray-200 text-gray-600'}`}>Set {s} ({kanjiList.filter((k) => k.set_number === s).length})</button>
              ))}
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
              {filtered.map((k) => (
                <div key={k.id} onClick={() => toggleHafal(k.id)}
                  className={`p-3 rounded-xl border-2 text-center cursor-pointer transition-all hover:shadow-md ${progress.has(k.id) ? 'border-green-500 bg-green-50' : 'border-gray-100 dark:border-gray-700 bg-white'}`}>
                  <div className="text-2xl mb-1">{k.karakter}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">{k.arti}</div>
                  <div className="text-[10px] text-gray-400 dark:text-gray-500">{k.cara_baca_onyomi || ''} {k.cara_baca_kunyomi || ''}</div>
                  {progress.has(k.id) && <div className="text-[10px] text-green-600 mt-1">✅ Hafal</div>}
                </div>
              ))}
            </div>
          </>
        )}

        {/* FLASHCARD */}
        {view === 'flashcard' && current && (
          <div className="max-w-sm mx-auto">
            <div className="text-center text-sm text-gray-400 dark:text-gray-500 mb-4">{cardIndex + 1} / {fcList.length}</div>
            <div onClick={() => setFlipped(!flipped)} className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-100 dark:border-gray-700 p-12 text-center cursor-pointer hover:shadow-lg transition-all min-h-[280px] flex flex-col items-center justify-center">
              {!flipped ? (
                <div className="text-7xl mb-4">{current.karakter}</div>
              ) : (
                <div>
                  <div className="text-3xl mb-2">{current.karakter}</div>
                  <div className="text-lg font-bold text-primary mb-2">{current.arti}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">Kunyomi: {current.cara_baca_kunyomi || '-'}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">Onyomi: {current.cara_baca_onyomi || '-'}</div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-2">Level: {current.level} | Set {current.set_number}</div>
                </div>
              )}
            </div>
            <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-2">Tap kartu buat balik</p>
            <div className="flex gap-3 mt-4">
              <button onClick={() => { setCardIndex((i) => (i > 0 ? i - 1 : fcList.length - 1)); setFlipped(false); }} className="flex-1 py-3 bg-gray-100 rounded-xl font-medium hover:bg-gray-200">← Sebelum</button>
              <button onClick={() => toggleHafal(current.id)} className={`px-4 py-3 rounded-xl font-medium ${progress.has(current.id) ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{progress.has(current.id) ? '✅ Hafal' : '😵 Belum'}</button>
              <button onClick={() => { setCardIndex((i) => (i < fcList.length - 1 ? i + 1 : 0)); setFlipped(false); }} className="flex-1 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark">Selesai →</button>
            </div>
          </div>
        )}

        {/* QUIZ */}
        {view === 'quiz' && (
          <div className="max-w-md mx-auto">
            {showResult ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center border border-gray-100 dark:border-gray-700">
                <div className="text-4xl mb-3">🏆</div>
                <h2 className="text-xl font-bold mb-2">Quiz Selesai!</h2>
                <p className="text-3xl font-extrabold text-primary">{quizScore}/{quizList.length}</p>
                <button onClick={() => { setQuizIndex(0); setQuizScore(0); setShowResult(false); }}
                  className="mt-6 px-6 py-3 bg-primary text-white rounded-xl font-bold">Ulang Quiz</button>
              </div>
            ) : qCurrent ? (
              <div>
                <div className="text-center text-sm text-gray-400 dark:text-gray-500 mb-4">Soal {quizIndex + 1} / {quizList.length}</div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center border border-gray-100 dark:border-gray-700 mb-6">
                  <div className="text-6xl mb-2">{quizMode === 'baca' ? qCurrent.karakter : qCurrent.arti}</div>
                  <p className="text-gray-500 dark:text-gray-400 dark:text-gray-500 text-sm">{quizMode === 'baca' ? 'Pilih arti yang benar' : 'Pilih kanji yang benar'}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[qCurrent.arti, ...sampleArray(kanjiList.filter((k) => k.id !== qCurrent.id), 3).map((k) => quizMode === 'baca' ? k.arti : k.karakter)].slice(0, 4).map((option, i) => (
                    <button key={i} onClick={() => handleQuizAnswer(option)}
                      className="p-4 bg-white rounded-xl border border-gray-200 hover:border-primary hover:bg-primary-light font-medium transition-all">
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        )}
      </main>
    </div>
  );
}
