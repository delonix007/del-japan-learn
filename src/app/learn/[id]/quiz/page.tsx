'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import { useAuthStore } from '@/stores/useAuthStore';
import { isGuestMode, getGuestProgress, saveGuestProgress } from '@/lib/guest';
import { shuffleArray } from '@/lib/shuffle';
import type { QuizQuestion, JenisSoal } from '@/types';

const JENIS_LABEL: Record<JenisSoal, string> = {
  tebak_partikel: '🎯 Tebak Partikel',
  susun_kalimat: '🧩 Susun Kalimat',
  isi_kalimat: '✏️ Isi Kalimat',
  terjemahkan: '📖 Indonesia → Jepang',
  pasangkan: '🔗 Pasangkan Kata',
  kuis_bergambar: '📝 Kuis Bergambar',
};

export default function QuizPage() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const quizType = searchParams.get('type') as JenisSoal | null;
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

  // Isi kalimat / terjemahkan text input
  const [textInput, setTextInput] = useState('');

  // Pasangkan state
  const [pairs, setPairs] = useState<{ left: number; right: number }[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [selectedRight, setSelectedRight] = useState<number | null>(null);
  const [matchItems, setMatchItems] = useState<{ id: number; text: string; matchId: number }[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<Set<string>>(new Set());

  useEffect(() => {
    load();
  }, [id, quizType]);

  const load = async () => {
    let query = supabase.from('quiz_questions').select('*').eq('lesson_id', id);
    if (quizType) query = query.eq('jenis_soal', quizType);
    const { data } = await query;
    if (data && data.length > 0) {
      setQuestions(shuffleArray(data) as QuizQuestion[]);
      initQuestion(0, shuffleArray(data) as QuizQuestion[]);
    } else {
      setQuestions([]);
    }
  };

  const initQuestion = (i: number, qs: QuizQuestion[]) => {
    const q = qs[i];
    if (!q) return;
    setSelected(null);
    setIsCorrect(false);
    setAnswerWords([]);
    setAvailableWords([]);
    setTextInput('');
    setPairs([]);
    setSelectedLeft(null);
    setSelectedRight(null);
    setMatchItems([]);
    setMatchedPairs(new Set());

    // Parse & shuffle options for multiple choice
    const raw: string[] = typeof q.pilihan_jawaban === 'object' && q.pilihan_jawaban !== null
      ? (Array.isArray(q.pilihan_jawaban) ? q.pilihan_jawaban : Object.values(q.pilihan_jawaban))
      : [];
    setShuffledOptions(raw.length > 0 ? shuffleArray(raw) : []);

    // Init susun kalimat
    if (q.jenis_soal === 'susun_kalimat' && q.jawaban_benar) {
      const words = shuffleArray(q.jawaban_benar.split(' '));
      setAvailableWords(words);
    }

    // Init pasangkan — parse soal as JSON array of {left, right, answer}
    if (q.jenis_soal === 'pasangkan' && q.soal) {
      try {
        const parsed = JSON.parse(q.soal) as { left: string; right: string }[];
        const items: { id: number; text: string; matchId: number }[] = [];
        const rightItems: { id: number; text: string; matchId: number }[] = [];
        parsed.forEach((p, idx) => {
          items.push({ id: idx * 2, text: p.left, matchId: idx * 2 + 1 });
          rightItems.push({ id: idx * 2 + 1, text: p.right, matchId: idx * 2 });
        });
        setMatchItems(shuffleArray([...items, ...rightItems]));
      } catch {
        console.error('Failed to parse pasangkan soal');
      }
    }
  };

  const handleAnswer = (answer: string) => {
    if (selected) return;
    setSelected(answer);
    const correct = answer.toLowerCase().trim() === questions[index].jawaban_benar.toLowerCase().trim();
    setIsCorrect(correct);
    if (correct) setScore((s) => s + 1);
  };

  // Susun kalimat: tap word di available → pindah ke answer
  const addWord = (word: string, idx: number) => {
    setAvailableWords((prev) => prev.filter((_, i) => i !== idx));
    setAnswerWords((prev) => [...prev, word]);
  };

  // Susun kalimat: tap word di answer → balikin ke available
  const removeWord = (answerIdx: number) => {
    const word = answerWords[answerIdx];
    setAnswerWords((prev) => prev.filter((_, i) => i !== answerIdx));
    setAvailableWords((prev) => [...prev, word]);
  };

  // Text input answer (isi kalimat / terjemahkan)
  const handleTextSubmit = () => {
    if (!textInput.trim() || selected) return;
    handleAnswer(textInput.trim());
  };

  // Matching (pasangkan) — click pair
  const handleMatchClick = (item: { id: number; text: string; matchId: number }) => {
    if (selected !== null) return;
    const isLeft = item.id % 2 === 0;
    if (isLeft) {
      if (selectedLeft === item.id) { setSelectedLeft(null); return; }
      setSelectedLeft(item.id);
      // Auto-check if right already selected
      if (selectedRight !== null) {
        const isMatch = selectedRight === item.matchId;
        if (isMatch) {
          setMatchedPairs((prev) => new Set([...prev, String(item.id), String(item.matchId)]));
          setScore((s) => s + 1);
        }
        setSelectedLeft(null);
        setSelectedRight(null);
      }
    } else {
      if (selectedRight === item.id) { setSelectedRight(null); return; }
      setSelectedRight(item.id);
      if (selectedLeft !== null) {
        const isMatch = selectedLeft === item.matchId;
        if (isMatch) {
          setMatchedPairs((prev) => new Set([...prev, String(item.id), String(item.matchId)]));
          setScore((s) => s + 1);
        }
        setSelectedLeft(null);
        setSelectedRight(null);
      }
    }
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
      // Update EXP & mark lesson selesai
      const finalScore = score;
      if (user) {
        supabase.rpc('add_exp', { p_user_id: user.id, p_exp: finalScore * 10 }).then(() => {
          console.log('EXP updated: +' + (finalScore * 10));
        }).catch((err: any) => {
          console.error('EXP update error:', err);
        });
        // Mark lesson progress as selesai
        supabase.from('user_progress').upsert({
          user_id: user.id,
          lesson_id: Number(id),
          status: 'selesai',
          persentase_hafalan: Math.round((finalScore / questions.length) * 100),
          last_accessed: new Date().toISOString(),
        }, { onConflict: 'user_id,lesson_id' }).catch((err: any) => {
          console.error('Progress update error:', err);
        });
      } else if (isGuestMode()) {
        const gp = getGuestProgress();
        const lessonId = Number(id);
        const uniqueLessons = [...new Set([...gp.lessons, lessonId])];
        saveGuestProgress({ exp: gp.exp + finalScore * 10, lessons: uniqueLessons });
      }
    }
  };
  if (questions.length === 0) return <div className="p-8 text-center text-[var(--color-text-muted)]">Belum ada soal untuk pelajaran ini.</div>;

  const q = questions[index];
  if (!q) return null;

  return (
    <div className="min-h-screen bg-[var(--bg-app)]">
      <header className="bg-[var(--bg-card)] border-b border-[var(--color-border)]">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-4">
          <Link href={`/learn/${id}`} className="text-[var(--color-text-muted)] hover:text-[var(--color-text)]">←</Link>
          <h1 className="font-bold text-[var(--color-accent)]">✍️ Latihan Soal</h1>
          <span className="text-sm text-[var(--color-text-muted)] ml-auto">{index + 1}/{questions.length}</span>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-8">
        {showResult ? (
          <div className="bg-[var(--bg-card)] rounded-2xl p-8 text-center border border-[var(--color-border)] shadow-sm">
            <div className="text-5xl mb-4">{score === questions.length ? '🎉' : '🏆'}</div>
            <h2 className="text-xl font-bold mb-2">Latihan Selesai!</h2>
            <p className="text-4xl font-extrabold text-[var(--color-primary)] mb-2">{score}/{questions.length}</p>
            <p className="text-[var(--color-text-muted)] text-sm mb-6">
              {score === questions.length ? 'Sempurna! Lo jago! 💪' : score >= questions.length / 2 ? 'Lumayan! Terus belajar! 📚' : 'Ayo coba lagi! 🔄'}
            </p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => { setIndex(0); setScore(0); setShowResult(false); initQuestion(0, questions); }}
                className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-xl font-bold">Ulang Latihan</button>
              <Link href={`/learn/${id}`} className="px-6 py-3 bg-[var(--color-surface-2)] rounded-xl font-bold text-[var(--color-text)]">Kembali</Link>
            </div>
          </div>
        ) : (
          <div>
            {/* PROGRESS BAR */}
            <div className="bg-[var(--color-surface-2)] rounded-full h-2 mb-6">
              <div className="bg-[var(--color-primary)] h-full rounded-full transition-all" style={{ width: `${((index + 1) / questions.length) * 100}%` }} />
            </div>

            {/* SOAL */}
            <div className="bg-[var(--bg-card)] rounded-2xl p-6 border border-[var(--color-border)] shadow-sm mb-4">
              <p className="text-xs text-[var(--color-text-muted)] uppercase mb-2">
                {JENIS_LABEL[q.jenis_soal] || q.jenis_soal}
              </p>
              <p className="text-lg font-medium">{q.soal}</p>
              {q.gambar_url && <img src={q.gambar_url} alt="Soal" className="mt-3 rounded-lg max-h-48 object-contain mx-auto" />}
            </div>

            {/* ===== ISI KALIMAT / TERJEMAHKAN: Text Input ===== */}
            {(q.jenis_soal === 'isi_kalimat' || q.jenis_soal === 'terjemahkan') && (
              <div className="mb-4">
                <input
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !selected) handleTextSubmit(); }}
                  placeholder="Ketik jawabanmu..."
                  disabled={selected !== null}
                  className="w-full px-4 py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--color-border)] outline-none text-lg focus:border-[var(--color-primary)] transition-colors"
                  autoFocus
                />
                <button
                  onClick={handleTextSubmit}
                  disabled={selected !== null || !textInput.trim()}
                  className="w-full mt-3 py-3 bg-[var(--color-primary)] text-white font-bold rounded-xl hover:brightness-110 disabled:opacity-50"
                >
                  Cek Jawaban
                </button>
              </div>
            )}

            {/* ===== PASANGKAN KATA: Matching ===== */}
            {q.jenis_soal === 'pasangkan' && matchItems.length === 0 && q.soal && (() => {
              try {
                const parsed = JSON.parse(q.soal) as { left: string; right: string }[];
                const items: { id: number; text: string; matchId: number }[] = [];
                const rightItems: { id: number; text: string; matchId: number }[] = [];
                parsed.forEach((p, idx) => {
                  items.push({ id: idx * 2, text: p.left, matchId: idx * 2 + 1 });
                  rightItems.push({ id: idx * 2 + 1, text: p.right, matchId: idx * 2 });
                });
                setMatchItems(shuffleArray([...items, ...rightItems]));
                return null; // re-render will show the UI
              } catch { return null; }
            })()}
            {q.jenis_soal === 'pasangkan' && matchItems.length > 0 && (
              <div className="mb-4">
                <p className="text-xs text-[var(--color-text-muted)] mb-3">Ketuk satu dari kiri, lalu satu dari kanan untuk mencocokkan.</p>
                <div className="grid grid-cols-2 gap-3">
                  {matchItems.map((item) => {
                    const isLeft = item.id % 2 === 0;
                    const isMatched = matchedPairs.has(String(item.id)) || matchedPairs.has(String(item.matchId));
                    const isSelected = selectedLeft === item.id || selectedRight === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleMatchClick(item)}
                        disabled={isMatched || selected !== null}
                        className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                          isMatched
                            ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 opacity-50'
                            : isSelected
                            ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10'
                            : isLeft
                            ? 'border-[var(--color-border)] bg-[var(--bg-card)] hover:border-[var(--color-primary)]'
                            : 'border-[var(--color-border)] bg-[var(--bg-card)] hover:border-[var(--color-primary)]'
                        }`}
                      >
                        {item.text}
                      </button>
                    );
                  })}
                </div>
                {matchedPairs.size === matchItems.length / 2 && !selected && (
                  <button onClick={() => handleAnswer('done')} className="w-full mt-3 py-3 bg-[var(--color-primary)] text-white font-bold rounded-xl">
                    Selesai Mencocokkan
                  </button>
                )}
              </div>
            )}

            {/* ===== SUSUN KALIMAT ===== */}
            {q.jenis_soal === 'susun_kalimat' ? (
              <div>
                {/* Answer area */}
                <div className="min-h-[60px] bg-[var(--bg-card)] rounded-xl border-2 border-dashed border-primary/40 p-3 mb-3 flex flex-wrap gap-2">
                  {answerWords.length === 0 && (
                    <span className="text-sm text-gray-400 italic">Tap kata di bawah untuk menyusun...</span>
                  )}
                  {answerWords.map((word, i) => (
                    <button key={`ans-${i}`} onClick={() => removeWord(i)}
                      className="px-3 py-1.5 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-primary)]-dark transition-colors">
                      {word} ✕
                    </button>
                  ))}
                </div>

                {/* Available words */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {availableWords.map((word, i) => (
                    <button key={`avail-${i}`} onClick={() => addWord(word, i)}
                      className="px-3 py-1.5 bg-white dark:bg-gray-700 border border-[var(--color-border)]  rounded-lg text-sm font-medium hover:border-primary hover:text-[var(--color-primary)] transition-colors">
                      {word}
                    </button>
                  ))}
                </div>

                <button onClick={checkSusunKalimat} disabled={selected !== null || answerWords.length === 0}
                  className="w-full py-3 bg-[var(--color-primary)] text-white font-bold rounded-xl hover:bg-[var(--color-primary)]-dark disabled:opacity-50">
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
                      selected === null ? 'border-[var(--color-border)]  bg-[var(--bg-card)] hover:border-primary' :
                      opt === q.jawaban_benar ? 'border-green-500 bg-green-50 dark:bg-green-900/30 text-green-800 text-green-400' :
                      opt === selected ? 'border-red-500 bg-red-50 dark:bg-red-900/30 text-red-800 text-red-400' :
                      'border-[var(--color-border)] bg-[var(--bg-app)] text-[var(--color-text-muted)]'
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
                <button onClick={next} className="px-8 py-3 bg-[var(--color-primary)] text-white rounded-xl font-bold hover:bg-[var(--color-primary)]-dark">
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
