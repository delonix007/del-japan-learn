'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { useAuthStore } from '@/stores/useAuthStore';
import type { Kana } from '@/types';

type Tab = 'hiragana' | 'katakana' | 'quiz' | 'ketik';

export default function KanaPage() {
  const router = useRouter();
  const { user, loading } = useAuthStore();
  const supabase = createClient();
  const [kanaList, setKanaList] = useState<Kana[]>([]);
  const [progress, setProgress] = useState<Set<number>>(new Set());
  const [tab, setTab] = useState<Tab>('hiragana');
  const [showAnswer, setShowAnswer] = useState(false);
  const [cardIndex, setCardIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizIndex, setQuizIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [typingInput, setTypingInput] = useState('');
  const [typingResult, setTypingResult] = useState<'benar' | 'salah' | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<Kana[]>([]);
  const [typingQuestions, setTypingQuestions] = useState<Kana[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { data } = await supabase.from('kana').select('*').order('urutan');
    if (data) setKanaList(data as Kana[]);
    const { data: p } = await supabase.from('user_kana_progress').select('kana_id').eq('user_id', user!.id).eq('status_hafal', true);
    if (p) setProgress(new Set(p.map((r: any) => r.kana_id)));
  };

  const toggleHafal = async (kanaId: number) => {
    const n = new Set(progress);
    if (n.has(kanaId)) { n.delete(kanaId); await supabase.from('user_kana_progress').delete().eq('user_id', user!.id).eq('kana_id', kanaId); }
    else { n.add(kanaId); await supabase.from('user_kana_progress').insert({ user_id: user!.id, kana_id: kanaId, status_hafal: true }); }
    setProgress(n);
  };

  const generateQuiz = () => {
    const filtered = kanaList.filter((k) => tab === 'hiragana' ? k.jenis === 'hiragana' : k.jenis === 'katakana');
    const shuffled = [...filtered].sort(() => Math.random() - 0.5).slice(0, 10);
    setQuizQuestions(shuffled);
    setQuizIndex(0);
    setQuizScore(0);
    setShowResult(false);
  };

  const generateTyping = () => {
    const filtered = kanaList.filter((k) => k.jenis === 'hiragana');
    const shuffled = [...filtered].sort(() => Math.random() - 0.5).slice(0, 10);
    setTypingQuestions(shuffled);
    setQuizIndex(0);
    setQuizScore(0);
    setShowResult(false);
    setTypingInput('');
    setTypingResult(null);
  };

  const handleQuizAnswer = (answer: string) => {
    const q = quizQuestions[quizIndex];
    if (q && answer === q.romaji) setQuizScore((s) => s + 1);
    if (quizIndex < quizQuestions.length - 1) setQuizIndex((i) => i + 1);
    else setShowResult(true);
  };

  const handleTypingSubmit = () => {
    const q = typingQuestions[quizIndex];
    if (!q) return;
    if (typingInput.trim().toLowerCase() === q.romaji.toLowerCase()) {
      setTypingResult('benar');
      setQuizScore((s) => s + 1);
    } else {
      setTypingResult('salah');
    }
  };

  const nextTyping = () => {
    if (quizIndex < typingQuestions.length - 1) {
      setQuizIndex((i) => i + 1);
      setTypingInput('');
      setTypingResult(null);
    } else {
      setShowResult(true);
    }
  };

  const filteredKana = kanaList.filter((k) => tab === 'hiragana' ? k.jenis === 'hiragana' : k.jenis === 'katakana');
  const currentCard = tab === 'hiragana' || tab === 'katakana' ? filteredKana[cardIndex] : null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center gap-4">
          <Link href="/dashboard" className="text-[var(--color-text-muted)] hover:text-[var(--color-text)]">←</Link>
          <h1 className="font-bold text-accent">あ Kana Trainer</h1>
          <span className="text-sm text-gray-400 dark:text-gray-500">{progress.size}/{kanaList.length} hafal</span>
        </div>
        <div className="max-w-4xl mx-auto px-4 flex border-t border-gray-50">
          {([{ k: 'hiragana', l: 'ひ Hiragana' }, { k: 'katakana', l: 'カ Katakana' }, { k: 'quiz', l: '✍️ Quiz' }, { k: 'ketik', l: '⌨️ Ketik' }] as { k: Tab; l: string }[]).map((t) => (
            <button key={t.k} onClick={() => { setTab(t.k); if (t.k === 'quiz') generateQuiz(); if (t.k === 'ketik') generateTyping(); }}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-all ${tab === t.k ? 'border-primary text-primary' : 'border-transparent text-gray-500 dark:text-gray-400 dark:text-gray-500'}`}>{t.l}</button>
          ))}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* HIRAGANA / KATAKANA FLASHCARD */}
        {(tab === 'hiragana' || tab === 'katakana') && currentCard && (
          <div className="max-w-sm mx-auto">
            <p className="text-center text-sm text-gray-400 dark:text-gray-500 mb-4">{cardIndex + 1} / {filteredKana.length}</p>
            <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-100 dark:border-gray-700 p-10 text-center min-h-[200px] flex flex-col items-center justify-center">
              <div className="text-6xl mb-2">{showAnswer ? currentCard.karakter : '❓'}</div>
              {showAnswer && (
                <>
                  <div className="text-xl font-bold text-primary mt-2">{currentCard.romaji}</div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">{currentCard.jenis} - urutan ke-{currentCard.urutan}</div>
                </>
              )}
            </div>
            <button onClick={() => setShowAnswer(!showAnswer)} className="w-full py-3 bg-primary text-white rounded-xl font-bold mt-4 hover:bg-primary-dark">
              {showAnswer ? 'Tutup' : 'Lihat Jawaban'}
            </button>
            <div className="flex gap-3 mt-3">
              <button onClick={() => { setCardIndex((i) => (i > 0 ? i - 1 : filteredKana.length - 1)); setShowAnswer(false); }} className="flex-1 py-3 bg-gray-100 rounded-xl font-medium">←</button>
              <button onClick={() => toggleHafal(currentCard.id)} className={`px-4 py-3 rounded-xl font-medium ${progress.has(currentCard.id) ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}>
                {progress.has(currentCard.id) ? '✅' : '☑️'}</button>
              <button onClick={() => { setCardIndex((i) => (i < filteredKana.length - 1 ? i + 1 : 0)); setShowAnswer(false); }} className="flex-1 py-3 bg-primary text-white rounded-xl font-medium">→</button>
            </div>
          </div>
        )}

        {/* TABLE */}
        {(tab === 'hiragana' || tab === 'katakana') && (
          <details className="mt-8">
            <summary className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500 cursor-pointer font-medium">Lihat Tabel Lengkap</summary>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-1 mt-3">
              {filteredKana.map((k) => (
                <div key={k.id} onClick={() => toggleHafal(k.id)}
                  className={`p-1.5 text-center rounded-lg border text-xs cursor-pointer transition-all ${progress.has(k.id) ? 'border-green-300 bg-green-50 text-green-800' : 'border-gray-100 dark:border-gray-700 bg-white'}`}>
                  <div className="text-sm">{k.karakter}</div>
                  <div className="text-[10px] text-gray-400 dark:text-gray-500">{k.romaji}</div>
                </div>
              ))}
            </div>
          </details>
        )}

        {/* QUIZ PILIHAN GANDA */}
        {tab === 'quiz' && (
          <div className="max-w-md mx-auto">
            {showResult ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center border border-gray-100 dark:border-gray-700">
                <div className="text-4xl mb-3">🏆</div>
                <h2 className="text-xl font-bold mb-2">Quiz Selesai!</h2>
                <p className="text-3xl font-extrabold text-primary">{quizScore}/{quizQuestions.length}</p>
                <button onClick={generateQuiz} className="mt-6 px-6 py-3 bg-primary text-white rounded-xl font-bold">Ulang Quiz</button>
              </div>
            ) : quizQuestions.length > 0 ? (
              <div>
                <p className="text-center text-sm text-gray-400 dark:text-gray-500 mb-4">Soal {quizIndex + 1} / {quizQuestions.length}</p>
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-10 text-center border border-gray-100 dark:border-gray-700 mb-4">
                  <div className="text-6xl mb-2">{quizQuestions[quizIndex].karakter}</div>
                  <p className="text-gray-500 dark:text-gray-400 dark:text-gray-500 text-sm">Pilih romaji yang benar</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[quizQuestions[quizIndex].romaji, ...kanaList.filter((k) => k.romaji !== quizQuestions[quizIndex].romaji).sort(() => Math.random() - 0.5).slice(0, 3).map((k) => k.romaji)].sort(() => Math.random() - 0.5).slice(0, 4).map((opt, i) => (
                    <button key={i} onClick={() => handleQuizAnswer(opt)}
                      className="p-4 bg-white rounded-xl border border-gray-200 hover:border-primary font-medium transition-all">{opt}</button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* QUIZ KETIK */}
        {tab === 'ketik' && (
          <div className="max-w-md mx-auto">
            {showResult ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center border border-gray-100 dark:border-gray-700">
                <div className="text-4xl mb-3">🏆</div>
                <h2 className="text-xl font-bold mb-2">Quiz Selesai!</h2>
                <p className="text-3xl font-extrabold text-primary">{quizScore}/{typingQuestions.length}</p>
                <button onClick={generateTyping} className="mt-6 px-6 py-3 bg-primary text-white rounded-xl font-bold">Ulang Quiz</button>
              </div>
            ) : typingQuestions.length > 0 ? (
              <div>
                <p className="text-center text-sm text-gray-400 dark:text-gray-500 mb-4">Soal {quizIndex + 1} / {typingQuestions.length}</p>
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-10 text-center border border-gray-100 dark:border-gray-700 mb-4">
                  <div className="text-6xl mb-2">{typingQuestions[quizIndex].karakter}</div>
                  <p className="text-gray-500 dark:text-gray-400 dark:text-gray-500 text-sm">Ketik romaji</p>
                </div>
                {typingResult === null ? (
                  <div className="flex gap-2">
                    <input value={typingInput} onChange={(e) => setTypingInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleTypingSubmit()}
                      className="flex-1 px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-primary"
                      placeholder="ketik romaji..." autoFocus />
                    <button onClick={handleTypingSubmit} className="px-6 py-3 bg-primary text-white rounded-xl font-bold">Cek</button>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className={`text-2xl font-bold mb-2 ${typingResult === 'benar' ? 'text-green-600' : 'text-red-600'}`}>
                      {typingResult === 'benar' ? '✅ Benar!' : `❌ Salah! (${typingQuestions[quizIndex].romaji})`}
                    </div>
                    <button onClick={nextTyping} className="px-6 py-3 bg-primary text-white rounded-xl font-bold mt-2">
                      {quizIndex < typingQuestions.length - 1 ? 'Lanjut' : 'Lihat Hasil'}
                    </button>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        )}
      </main>
    </div>
  );
}
