'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import { useAuthStore } from '@/stores/useAuthStore';
import type { QuizQuestion } from '@/types';

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
  const [dragOrder, setDragOrder] = useState<string[]>([]);

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
    if (q.jenis_soal === 'susun_kalimat' && q.jawaban_benar) {
      const words = q.jawaban_benar.split(' ').sort(() => Math.random() - 0.5);
      setDragOrder(words);
    }
  };

  const handleAnswer = (answer: string) => {
    if (selected) return;
    setSelected(answer);
    const correct = answer === questions[index].jawaban_benar;
    setIsCorrect(correct);
    if (correct) setScore((s) => s + 1);
  };

  const next = () => {
    if (index < questions.length - 1) {
      const nextIdx = index + 1;
      setIndex(nextIdx);
      initQuestion(nextIdx, questions);
    } else {
      setShowResult(true);
      // Update EXP
      supabase.rpc('add_exp', { p_user_id: user!.id, p_exp: score * 10 }).catch(() => {});
    }
  };

  if (questions.length === 0) return <div className="p-8 text-center text-gray-400">Belum ada soal untuk pelajaran ini.</div>;

  const q = questions[index];
  if (!q) return null;

  const options: string[] = typeof q.pilihan_jawaban === 'object' && q.pilihan_jawaban !== null
    ? (Array.isArray(q.pilihan_jawaban) ? q.pilihan_jawaban : Object.values(q.pilihan_jawaban))
    : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center gap-4">
          <Link href={`/learn/${id}`} className="text-gray-400 hover:text-primary">←</Link>
          <h1 className="font-bold text-accent">✍️ Latihan Soal</h1>
          <span className="text-sm text-gray-400 ml-auto">{index + 1}/{questions.length}</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {showResult ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-gray-100 shadow-sm">
            <div className="text-5xl mb-4">{score === questions.length ? '🎉' : '🏆'}</div>
            <h2 className="text-xl font-bold mb-2">Latihan Selesai!</h2>
            <p className="text-4xl font-extrabold text-primary mb-2">{score}/{questions.length}</p>
            <p className="text-gray-500 text-sm mb-6">{score === questions.length ? 'Sempurna! Lo jago! 💪' : score >= questions.length / 2 ? 'Lumayan! Terus belajar! 📚' : 'Ayo coba lagi! 🔄'}</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => { setIndex(0); setScore(0); setShowResult(false); initQuestion(0, questions); }} className="px-6 py-3 bg-primary text-white rounded-xl font-bold">Ulang Latihan</button>
              <Link href={`/learn/${id}`} className="px-6 py-3 bg-gray-100 rounded-xl font-bold text-gray-700">Kembali</Link>
            </div>
          </div>
        ) : (
          <div>
            {/* PROGRESS BAR */}
            <div className="bg-gray-100 rounded-full h-2 mb-6">
              <div className="bg-primary h-full rounded-full transition-all" style={{ width: `${((index + 1) / questions.length) * 100}%` }} />
            </div>

            {/* SOAL */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-4">
              <p className="text-xs text-gray-400 uppercase mb-2">{q.jenis_soal.replace('_', ' ')}</p>
              <p className="text-lg font-medium">{q.soal}</p>
            </div>

            {/* SUSUN KALIMAT */}
            {q.jenis_soal === 'susun_kalimat' ? (
              <div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {dragOrder.map((word, i) => (
                    <div key={i} className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium">
                      {word}
                    </div>
                  ))}
                </div>
                <button onClick={() => handleAnswer(dragOrder.join(' '))} className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark">
                  Cek Jawaban
                </button>
              </div>
            ) : (
              /* PILIHAN GANDA */
              <div className="grid gap-3">
                {options.map((opt, i) => (
                  <button key={i} onClick={() => handleAnswer(opt)}
                    disabled={selected !== null}
                    className={`p-4 rounded-xl border-2 text-left font-medium transition-all ${
                      selected === null ? 'border-gray-200 bg-white hover:border-primary' :
                      opt === q.jawaban_benar ? 'border-green-500 bg-green-50 text-green-800' :
                      opt === selected ? 'border-red-500 bg-red-50 text-red-800' :
                      'border-gray-100 bg-gray-50 text-gray-400'
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
