'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import { useAuthStore } from '@/stores/useAuthStore';
import type { QuizQuestion } from '@/types';

// Fisher–Yates shuffle
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function QuizPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user, loading } = useAuthStore();
  const supabase = createClient();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);

  // Susun kalimat state
  const [availableWords, setAvailableWords] = useState<string[]>([]);
  const [answerWords, setAnswerWords] = useState<string[]>([]);

  useEffect(() => {
    if (loading) return;
    if (!user) { router.push('/auth?mode=login'); return; }
    load();
  }, [id, user, loading]);

  const load = async () => {
    const { data } = await supabase.from('quiz_questions').select('*').eq('lesson_id', id);
    if (data && data.length > 0) {
      setQuestions(data as QuizQuestion[]);
      initQuestion(0, data as QuizQuestion[]);
    }
  };

  const initQuestion = (i: number, qs: QuizQuestion[]) => {
    const q = qs[i];
    if (!q) return;
    setSelected(null);
    setIsCorrect(false);
    setAnswerWords([]);
    setAvailableWords([]);

    // Parse & shuffle options for multiple choice
    const raw: string[] = typeof q.pilihan_jawaban === 'object' && q.pilihan_jawaban !== null
      ? (Array.isArray(q.pilihan_jawaban) ? q.pilihan_jawaban : Object.values(q.pilihan_jawaban))
      : [];
    setShuffledOptions(raw.length > 0 ? shuffle(raw) : []);

    // Init susun kalimat
    if (q.jenis_soal === 'susun_kalimat' && q.jawaban_benar) {
      const words = q.jawaban_benar.split(' ').sort(() => Math.random() - 0.5);
      setAvailableWords(words);
    }
  };

  const handleAnswer = (answer: string) => {
    if (selected) return;
    setSelected(answer);
    const correct = answer === questions[index].jawaban_benar;
    setIsCorrect(correct);
    if (correct) setScore((s) => s + 1);
  };

  // Susun kalimat: tap word di available → pindah ke answer
  const addWord = (word: string) => {
    setAvailableWords((prev) => prev.filter((w) => w !== word));
    setAnswerWords((prev) => [...prev, word]);
  };

  // Susun kalimat: tap word di answer → balikin ke available
  const removeWord = (word: string) => {
    setAnswerWords((prev) => {
      const idx = prev.lastIndexOf(word);
      if (idx === -1) return prev;
      const newArr = [...prev];
      newArr.splice(idx, 1);
      setAvailableWords((a) => [...a, word]);
      return newArr;
    });
  };

  const checkSusunKalimat = () => {
    const answer = answerWords.join(' ');
    handleAnswer(answer);
  };

  const next = () => {
    if (index < questions.length - 1) {
      const nextIdx = index + 1;
      setIndex(nextIdx);
      initQuestion(nextIdx, questions);
    } else {
      setShowResult(true);
      supabase.rpc('add_exp', { p_user_id: user!.id, p_exp: score * 10 }).catch(() => {});
    }
  };

  if (questions.length === 0) return <div className="p-8 text-center text-gray-400 dark:text-gray-500">Belum ada soal untuk pelajaran ini.</div>;

  const q = questions[index];
  if (!q) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center gap-4">
          <Link href={`/learn/${id}`} className="text-gray-400 dark:text-gray-500 hover:text-primary">←</Link>
          <h1 className="font-bold text-accent">✍️ Latihan Soal</h1>
          <span className="text-sm text-gray-400 dark:text-gray-500 ml-auto">{index + 1}/{questions.length}</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {showResult ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="text-5xl mb-4">{score === questions.length ? '🎉' : '🏆'}</div>
            <h2 className="text-xl font-bold mb-2">Latihan Selesai!</h2>
            <p className="text-4xl font-extrabold text-primary mb-2">{score}/{questions.length}</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
              {score === questions.length ? 'Sempurna! Lo jago! 💪' : score >= questions.length / 2 ? 'Lumayan! Terus belajar! 📚' : 'Ayo coba lagi! 🔄'}
            </p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => { setIndex(0); setScore(0); setShowResult(false); initQuestion(0, questions); }}
                className="px-6 py-3 bg-primary text-white rounded-xl font-bold">Ulang Latihan</button>
              <Link href={`/learn/${id}`} className="px-6 py-3 bg-gray-100 rounded-xl font-bold text-gray-700">Kembali</Link>
            </div>
          </div>
        ) : (
          <div>
            {/* PROGRESS BAR */}
            <div className="bg-gray-100 dark:bg-gray-700 rounded-full h-2 mb-6">
              <div className="bg-primary h-full rounded-full transition-all" style={{ width: `${((index + 1) / questions.length) * 100}%` }} />
            </div>

            {/* SOAL */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm mb-4">
              <p className="text-xs text-gray-400 dark:text-gray-500 uppercase mb-2">
                {q.jenis_soal.replace('_', ' ')}
              </p>
              <p className="text-lg font-medium">{q.soal}</p>
            </div>

            {/* SUSUN KALIMAT */}
            {q.jenis_soal === 'susun_kalimat' ? (
              <div>
                {/* Answer area */}
                <div className="min-h-[60px] bg-white dark:bg-gray-800 rounded-xl border-2 border-dashed border-primary/40 p-3 mb-3 flex flex-wrap gap-2">
                  {answerWords.length === 0 && (
                    <span className="text-sm text-gray-400 italic">Tap kata di bawah untuk menyusun...</span>
                  )}
                  {answerWords.map((word, i) => (
                    <button key={`ans-${i}`} onClick={() => removeWord(word)}
                      className="px-3 py-1.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">
                      {word} ✕
                    </button>
                  ))}
                </div>

                {/* Available words */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {availableWords.map((word, i) => (
                    <button key={`avail-${i}`} onClick={() => addWord(word)}
                      className="px-3 py-1.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-medium hover:border-primary hover:text-primary transition-colors">
                      {word}
                    </button>
                  ))}
                </div>

                <button onClick={checkSusunKalimat} disabled={selected !== null || answerWords.length === 0}
                  className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark disabled:opacity-50">
                  Cek Jawaban
                </button>
              </div>
            ) : (
              /* PILIHAN GANDA (shuffled) */
              <div className="grid gap-3">
                {shuffledOptions.map((opt, i) => (
                  <button key={i} onClick={() => handleAnswer(opt)}
                    disabled={selected !== null}
                    className={`p-4 rounded-xl border-2 text-left font-medium transition-all ${
                      selected === null ? 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary' :
                      opt === q.jawaban_benar ? 'border-green-500 bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-300' :
                      opt === selected ? 'border-red-500 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-300' :
                      'border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-400 dark:text-gray-500'
                    }`}>
                    <span className="text-sm font-bold mr-2">{'ABCDEFGHIJ'[i]}.</span> {opt}
                  </button>
                ))}
              </div>
            )}

            {/* FEEDBACK + NEXT */}
            {selected && (
              <div className="mt-4 text-center">
                <p className={`text-lg font-bold mb-3 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                  {isCorrect ? '✅ Benar!' : `❌ Salah. Jawaban: ${q.jawaban_benar}`}
                </p>
                <button onClick={next} className="px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark">
                  {index < questions.length - 1 ? 'Soal Selanjutnya →' : 'Lihat Hasil'}
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
