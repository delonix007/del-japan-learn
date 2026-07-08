'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import { useAuthStore } from '@/stores/useAuthStore';
import { useTheme } from '@/components/ThemeProvider';
import { isGuestMode } from '@/lib/guest';
import { getVocabAudioSystem } from '@/lib/vocab-audio';
import { sampleArray, shuffleArray } from '@/lib/shuffle';
import BunpouProgressList from '@/components/BunpouProgressList';
import type { Lesson, Kotoba, Bunpou, JenisSoal, QuizQuestion } from '@/types';

type Tab = 'flashcard' | 'kosakata' | 'bunpou' | 'ai' | 'renshu';

export default function LessonDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user, profile, loading } = useAuthStore();
  const { theme, toggle } = useTheme();
  const supabase = createClient();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [kotoba, setKotoba] = useState<Kotoba[]>([]);
  const [bunpou, setBunpou] = useState<Bunpou[]>([]);
  const [tab, setTab] = useState<Tab>('flashcard');
  const [locked, setLocked] = useState(false);
  const [loadingLesson, setLoadingLesson] = useState(true);
  const [allLessons, setAllLessons] = useState<Lesson[]>([]);
  const [selectedBook, setSelectedBook] = useState<'I' | 'II'>('I');
  const [filteredLessons, setFilteredLessons] = useState<Lesson[]>([]);

  // Flashcard
  const [fcIndex, setFcIndex] = useState(0);
  const [fcFlipped, setFcFlipped] = useState(false);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [mastered, setMastered] = useState<Set<number>>(new Set());
  const [isPlaying, setIsPlaying] = useState(false);
  const [expToast, setExpToast] = useState<{ show: boolean; text: string }>({ show: false, text: '' });

  // Kosakata search
  const [search, setSearch] = useState('');

  // AI Chat
  const [chatMsg, setChatMsg] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'ai'; text: string }[]>([]);

  // Inline Quiz (inside Renshu tab)
  const [activeQuizType, setActiveQuizType] = useState<JenisSoal | null>(null);
  const [activeQuizQuestions, setActiveQuizQuestions] = useState<QuizQuestion[]>([]);
  const [activeQuizIndex, setActiveQuizIndex] = useState(0);
  const [activeQuizSelected, setActiveQuizSelected] = useState<string | string[] | null>(null);
  const [activeQuizCorrect, setActiveQuizCorrect] = useState(false);
  const [activeQuizScore, setActiveQuizScore] = useState(0);
  const [activeQuizArrangement, setActiveQuizArrangement] = useState<string[]>([]);
  const [activeQuizAvailable, setActiveQuizAvailable] = useState<string[]>([]);
  const [activeQuizAnswered, setActiveQuizAnswered] = useState(false);
  const [activeQuizMatchSelected, setActiveQuizMatchSelected] = useState<{ left: number | null; right: number | null }>({ left: null, right: null });
  const [activeQuizMatchPairs, setActiveQuizMatchPairs] = useState<Set<number>>(new Set());
  const [activeQuizFinished, setActiveQuizFinished] = useState(false);
  // ponytail: ref-cached shuffled particles per question index
  const shuffledParticlesRef = useRef<Map<number, string[]>>(new Map());

  useEffect(() => {
    loadLesson();
  }, [id]);

  // Load mastered flashcards from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`mastered_${id}`);
      if (saved) {
        const arr: number[] = JSON.parse(saved);
        setMastered(new Set(arr));
      }
    } catch {}
  }, [id]);

  const loadLesson = async () => {
    setLoadingLesson(true);
    // Fetch all lessons for dropdown
    const { data: allL } = await supabase.from('lessons').select('*').order('urutan', { ascending: true });
    if (allL) {
      setAllLessons(allL as Lesson[]);
    }

    const { data: l } = await supabase.from('lessons').select('*').eq('id', id).single();
    if (l) {
      setLesson(l as Lesson);
      setSelectedBook(l.book as 'I' | 'II');
      if (!l.is_free && !profile?.is_premium && !isGuestMode()) {
        setLocked(true);
        setLoadingLesson(false);
        return;
      }
    } else {
      setLesson(null);
      setLoadingLesson(false);
      return;
    }
    const { data: k } = await supabase.from('kotoba').select('*').eq('lesson_id', id);
    if (k) setKotoba(k as Kotoba[]);
    const { data: b } = await supabase.from('bunpou').select('*').eq('lesson_id', id);
    if (b) setBunpou(b as Bunpou[]);
    setLoadingLesson(false);
  };

  const openInlineQuiz = async (type: JenisSoal) => {
    setActiveQuizType(type);
    setActiveQuizIndex(0);
    setActiveQuizScore(0);
    setActiveQuizSelected(null);
    setActiveQuizCorrect(false);
    setActiveQuizArrangement([]);
    setActiveQuizAvailable([]);
    setActiveQuizAnswered(false);
    setActiveQuizMatchSelected({ left: null, right: null });
    setActiveQuizMatchPairs(new Set());
    setActiveQuizFinished(false);
    shuffledParticlesRef.current.clear();
    const { data } = await supabase.from('quiz_questions').select('*').eq('lesson_id', id).eq('jenis_soal', type);
    if (data) setActiveQuizQuestions(data as QuizQuestion[]);
    else setActiveQuizQuestions([]);
  };

  const closeInlineQuiz = () => {
    setActiveQuizType(null);
    setActiveQuizQuestions([]);
    setActiveQuizArrangement([]);
    setActiveQuizAvailable([]);
    setActiveQuizFinished(false);
  };

  // Filter lessons when book changes
  useEffect(() => {
    const filtered = allLessons.filter(l => l.book === selectedBook);
    setFilteredLessons(filtered);
  }, [selectedBook, allLessons]);

  const shuffleFlashcard = () => {
    setFcIndex(Math.floor(Math.random() * kotoba.length));
    setFcFlipped(false);
  };

  const toggleFavorite = (idx: number) => {
    const n = new Set(favorites);
    n.has(idx) ? n.delete(idx) : n.add(idx);
    setFavorites(n);
  };

  const toggleMastered = (idx: number) => {
    const n = new Set(mastered);
    if (!n.has(idx)) {
      n.add(idx);
      setMastered(n);
      try { localStorage.setItem(`mastered_${id}`, JSON.stringify(Array.from(n))); } catch {}
      // Show EXP toast
      setExpToast({ show: true, text: '+10 EXP' });
      setTimeout(() => setExpToast({ show: false, text: '' }), 2000);
    } else {
      n.delete(idx);
      setMastered(n);
      try { localStorage.setItem(`mastered_${id}`, JSON.stringify(Array.from(n))); } catch {}
    }
  };

  const playAudio = async (text: string) => {
    if (!text || isPlaying) return;
    setIsPlaying(true);
    try {
      // Ponytail: use Google TTS URL (works without Japanese voice installed)
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=ja&client=tw-ob`;
      const audio = new Audio(url);
      audio.onended = () => setIsPlaying(false);
      audio.onerror = () => {
        console.error('[Audio] Google TTS failed, fallback to speechSynthesis');
        const synth = window.speechSynthesis;
        if (synth) {
          const u = new SpeechSynthesisUtterance(text);
          u.lang = 'ja-JP';
          u.onend = () => setIsPlaying(false);
          synth.speak(u);
        } else {
          setIsPlaying(false);
        }
      };
      audio.play();
      return;
    } catch (e) {
      console.error('Audio playback failed:', e);
    }
    setIsPlaying(false);
  };

  if (locked) {
    return (
      <div className="min-h-screen bg-[var(--bg-app)] flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-xl font-bold mb-2">Materi Premium</h2>
          <p className="text-[var(--color-text-muted)] text-sm mb-6">Upgrade ke Premium buat akses pelajaran ini.</p>
          <Link href="/premium" className="inline-block px-6 py-3 bg-[var(--color-primary)] text-white font-bold rounded-xl">Upgrade Sekarang</Link>
        </div>
      </div>
    );
  }

  if (loadingLesson) return <div className="p-8 text-center text-[var(--color-text-muted)]">Loading...</div>;
  if (!lesson) return (
    <div className="min-h-screen bg-[var(--bg-app)] flex items-center justify-center p-4">
      <div className="text-center max-w-sm">
        <div className="text-5xl mb-4">🔍</div>
        <h2 className="text-xl font-bold mb-2">Pelajaran Tidak Ditemukan</h2>
        <Link href="/dashboard" className="inline-block px-6 py-3 bg-[var(--color-primary)] text-white font-bold rounded-xl">Kembali</Link>
      </div>
    </div>
  );

  const filteredKotoba = kotoba.filter((k) =>
    k.kata_jepang.toLowerCase().includes(search.toLowerCase()) ||
    k.arti_indonesia.toLowerCase().includes(search.toLowerCase()) ||
    (k.romaji || '').toLowerCase().includes(search.toLowerCase())
  );

  const current = kotoba[fcIndex];

  const tabs: { key: Tab; label: string; icon: string; wide?: boolean }[] = [
    { key: 'flashcard', label: 'Flashcard', icon: '🃏' },
    { key: 'kosakata', label: 'Kosakata', icon: '📚' },
    { key: 'bunpou', label: 'Bunpou', icon: '📖' },
    { key: 'ai', label: 'AI Sensei', icon: '✨' },
    { key: 'renshu', label: 'Renshū', icon: '✏️', wide: true },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-app)]">
      {/* EXP Toast Notification */}
      {expToast.show && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-2">
          <div className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex flex-col items-center gap-0.5">
            <span>✨ {expToast.text}</span>
            <span className="text-[10px] opacity-90">Kosakata dihafal</span>
          </div>
        </div>
      )}

      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-[var(--bg-app)]/95 backdrop-blur border-b border-[var(--color-border)]">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/dashboard" className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] text-lg">←</Link>
            <div>
              <div className="text-[11px] text-[var(--color-text-muted)] leading-tight">Del-Japan</div>
              <div className="font-bold text-sm leading-tight">Pelajaran {lesson.nomor_pelajaran} — {lesson.judul?.split('(')[0]?.trim() || ''}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center text-xs font-bold text-[var(--color-primary)]">0%</div>
            <button onClick={toggle} className="text-sm text-[var(--color-text-muted)]">{theme === 'dark' ? '☀️' : '🌙'}</button>
            {isGuestMode() && <Link href="/premium" className="px-2 py-0.5 bg-green-600/20 text-green-500 rounded-full text-[9px] font-bold">🧑 TAMU</Link>}
            <Link href="/profile" className="w-7 h-7 rounded-full bg-[var(--color-text)] flex items-center justify-center text-[var(--bg-app)] text-xs font-bold">{(profile?.nama || 'U')[0].toUpperCase()}</Link>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-4 pb-28">
        {/* FILTER BAR */}
        <div className="flex gap-2 mb-4">
          <select
            className="flex-1 px-3 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--color-border)] text-sm outline-none"
            value={selectedBook}
            onChange={(e) => {
              setSelectedBook(e.target.value as 'I' | 'II');
              const first = allLessons.find(l => l.book === e.target.value);
              if (first && first.id.toString() !== id) {
                router.push(`/learn/${first.id}`);
              }
            }}
          >
            <option value="I">Buku I</option>
            <option value="II">Buku II</option>
          </select>
          <select
            className="flex-1 px-3 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--color-border)] text-sm outline-none truncate"
            value={lesson?.id?.toString() || ''}
            onChange={(e) => {
              const lessonId = e.target.value;
              if (lessonId) {
                router.push(`/learn/${lessonId}`);
              }
            }}
          >
            {filteredLessons.map((l) => (
              <option key={l.id} value={l.id}>
                P {l.nomor_pelajaran} — {(l.judul || '').split('(')[0]?.trim()}
              </option>
            ))}
          </select>
        </div>

        {/* TAB MENU */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {tabs.filter(t => !t.wide).map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`py-2.5 px-3 rounded-xl text-sm font-medium border transition-all ${
                tab === t.key ? 'bg-[var(--bg-card)] border-[var(--color-text)] text-[var(--color-text)]' : 'bg-transparent border-[var(--color-border)] text-[var(--color-text-muted)]'
              }`}>
              {t.icon} {t.label}
            </button>
          ))}
          <button onClick={() => setTab('renshu')}
            className={`col-span-2 py-2.5 px-3 rounded-xl text-sm font-medium border transition-all ${
              tab === 'renshu' ? 'bg-[var(--bg-card)] border-[var(--color-text)] text-[var(--color-text)]' : 'bg-transparent border-[var(--color-border)] text-[var(--color-text-muted)]'
            }`}>
            ✏️ Renshū
          </button>
        </div>

        {/* ===== TAB 1: FLASHCARD ===== */}
        {tab === 'flashcard' && current && (
          <div>
            <p className="text-center text-xs text-[var(--color-text-muted)] mb-3">
              {fcIndex + 1} / {kotoba.length}
            </p>
            <div onClick={() => setFcFlipped(!fcFlipped)}
              className="bg-[var(--bg-card)] rounded-2xl border border-violet-600/30 p-8 text-center cursor-pointer min-h-[220px] flex flex-col items-center justify-center shadow-sm mb-4 select-none relative">
              <button
                onClick={(e) => { e.stopPropagation(); playAudio(current.kata_jepang); }}
                className="absolute top-3 right-3 w-10 h-10 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center hover:bg-[var(--color-primary)]/20 transition-all"
                disabled={isPlaying}
              >
                {isPlaying ? (
                  <span className="flex gap-0.5">
                    <span className="w-1 h-3 bg-[var(--color-primary)] rounded-full animate-pulse" />
                    <span className="w-1 h-3 bg-[var(--color-primary)] rounded-full animate-pulse" style={{ animationDelay: '0.1s' }} />
                    <span className="w-1 h-3 bg-[var(--color-primary)] rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                  </span>
                ) : (
                  <span className="text-lg">🔊</span>
                )}
              </button>
              {!fcFlipped ? (
                <>
                  <div className="text-3xl font-bold mb-2">{current.kata_jepang}</div>
                  {current.romaji && <div className="text-xs text-[var(--color-text-muted)]">{current.romaji}</div>}
                  <div className="text-[10px] text-[var(--color-text-muted)] mt-4 italic">タップしてめくる</div>
                </>
              ) : (
                <div>
                  <div className="text-lg font-bold text-[var(--color-primary)] mb-1">{current.arti_indonesia}</div>
                  {current.contoh_kalimat && <div className="text-xs text-[var(--color-text-muted)] mt-2">{current.contoh_kalimat}</div>}
                </div>
              )}
            </div>
            <div className="flex gap-2 mb-3">
              <button onClick={() => { setFcIndex((i) => (i > 0 ? i - 1 : kotoba.length - 1)); setFcFlipped(false); }}
                className="flex-1 py-2 bg-[var(--color-surface-2)] rounded-xl text-xs font-medium hover:brightness-110">← 前へ</button>
              <button onClick={shuffleFlashcard} className="flex-1 py-2 bg-[var(--color-surface-2)] rounded-xl text-xs font-medium hover:brightness-110">シャッフル</button>
              <button onClick={() => toggleFavorite(fcIndex)} className={`px-3 py-2 rounded-xl text-xs ${favorites.has(fcIndex) ? 'bg-yellow-600/20 text-yellow-500' : 'bg-[var(--color-surface-2)]'}`}>☆</button>
              <button onClick={() => { setFcIndex((i) => (i < kotoba.length - 1 ? i + 1 : 0)); setFcFlipped(false); }}
                className="flex-1 py-2 bg-[var(--color-primary)] text-white rounded-xl text-xs font-medium">次へ →</button>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => toggleMastered(fcIndex)}
                className={`flex-[2] py-2 rounded-xl text-xs font-medium border ${
                  mastered.has(fcIndex) ? 'border-green-500/50 bg-green-600/10 text-green-600' : 'border-[var(--color-border)] text-[var(--color-text-muted)]'
                }`}>
                {mastered.has(fcIndex) ? '✅ Sudah Hafal' : '○ Tandai Sudah Hafal'}
              </button>
              <button className="flex-1 px-4 py-2 bg-[var(--color-surface-2)] rounded-xl text-xs text-[var(--color-text-muted)]" disabled={mastered.size === 0}>⚡ Review</button>
            </div>
          </div>
        )}

        {/* ===== TAB 2: KOSAKATA ===== */}
        {tab === 'kosakata' && (
          <div>
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--color-border)] outline-none text-sm mb-4"
              placeholder="🔍 Filter kosakata pelajaran ini..." />
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Semua Kosakata</span>
              <span className="text-[10px] text-[var(--color-text-muted)]">{filteredKotoba.length} kata</span>
            </div>
            <div className="space-y-2">
              {filteredKotoba.map((k) => (
                <div key={k.id} className="bg-[var(--bg-card)] rounded-xl p-3 border border-[var(--color-border)] flex items-center gap-3 shadow-sm">
                  <div className="flex-1">
                    <div className="text-lg font-bold">{k.kata_jepang}</div>
                    {k.romaji && <div className="text-[9px] text-[var(--color-text-muted)]">{k.romaji}</div>}
                  </div>
                  <div className="w-px h-8 bg-[var(--color-border)]" />
                  <div className="flex-1 text-sm">{k.arti_indonesia}</div>
                </div>
              ))}
              {filteredKotoba.length === 0 && <p className="text-xs text-[var(--color-text-muted)] text-center py-4">Kosakata tidak ditemukan</p>}
            </div>
          </div>
        )}

        {/* ===== TAB 3: BUNPOU ===== */}
        {tab === 'bunpou' && (
          <div>
            {user ? (
              <BunpouProgressList
                bunpouList={bunpou}
                lessonId={lesson.id}
                userId={user.id}
              />
            ) : (
              <p className="text-xs text-[var(--color-text-muted)] text-center py-4">Login untuk tracking progress Bunpou.</p>
            )}
          </div>
        )}

        {/* ===== TAB 4: AI SENSEI ===== */}
        {tab === 'ai' && (
          <div>
            <div className="text-center mb-4">
              <div className="text-3xl mb-1">✨</div>
              <h3 className="font-bold">AI Sensei</h3>
              <p className="text-xs text-[var(--color-text-muted)]">Tanya apa aja tentang pelajaran ini</p>
            </div>
            <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--color-border)] p-4 min-h-[200px] mb-3 space-y-2">
              {chatHistory.length === 0 && (
                <p className="text-xs text-[var(--color-text-muted)] text-center py-10">Belum ada percakapan. Mulai dengan mengetik pertanyaan!</p>
              )}
              {chatHistory.map((msg, i) => (
                <div key={i} className={`p-2 rounded-xl text-sm max-w-[85%] ${msg.role === 'user' ? 'bg-[var(--color-primary)]/20 ml-auto' : 'bg-[var(--color-surface-2)]'}`}>
                  {msg.text}
                </div>
              ))}
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              if (!chatMsg.trim()) return;
              setChatHistory([...chatHistory, { role: 'user', text: chatMsg }]);
              setChatMsg('');
              try {
                const res = await fetch('/api/ai-sensei', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    message: chatMsg,
                    lessonTitle: lesson.judul,
                    kotoba: kotoba.slice(0, 10),
                    bunpou: bunpou.slice(0, 5),
                  }),
                });
                const data = await res.json();
                setChatHistory((prev) => [...prev, { role: 'ai', text: data.text }]);
              } catch {
                setChatHistory((prev) => [...prev, { role: 'ai', text: 'Wah error nih. Coba lagi ya! 😅' }]);
              }
            }} className="flex gap-2">
              <input value={chatMsg} onChange={(e) => setChatMsg(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--color-border)] outline-none text-sm"
                placeholder="Ketik pesan..." />
              <button type="submit" className="px-4 py-2.5 bg-[var(--color-primary)] text-white rounded-xl text-sm font-bold hover:brightness-110">Kirim</button>
            </form>
          </div>
        )}

        {/* ===== TAB 5: RENSHŪ ===== */}
        {tab === 'renshu' && (
          <div>
            {activeQuizType ? (
              /* ===== INLINE QUIZ MODE ===== */
              <div>
                <div className="flex items-center justify-between mb-4">
                  <button onClick={closeInlineQuiz} className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)]">← Kembali</button>
                  <span className="text-xs text-[var(--color-text-muted)]">{activeQuizScore}/{activeQuizQuestions.length}</span>
                </div>
                {activeQuizQuestions.length === 0 ? (
                  <div className="text-center py-10 text-[var(--color-text-muted)]">
                    <p className="text-sm">Belum ada soal untuk tipe ini.</p>
                  </div>
                ) : activeQuizFinished ? (
                  /* ===== RESULT SCREEN ===== */
                  <div className="text-center">
                    {/* Icon */}
                    <div className="text-2xl mb-4">📚</div>
                    {/* Score */}
                    <div className="mb-4">
                      <span className="text-6xl font-bold">{activeQuizScore}</span>
                      <span className="text-2xl text-[var(--color-text-muted)]">/{activeQuizQuestions.length}</span>
                    </div>
                    {/* Progress bar */}
                    <div className="w-full h-3 bg-[var(--color-surface-2)] rounded-full overflow-hidden mb-2">
                      <div className="h-full rounded-full transition-all duration-500 bg-[var(--color-primary)]"
                        style={{ width: `${Math.round((activeQuizScore / activeQuizQuestions.length) * 100)}%` }} />
                    </div>
                    <p className="text-xs text-[var(--color-text-muted)] mb-6">
                      {Math.round((activeQuizScore / activeQuizQuestions.length) * 100)}% benar
                    </p>
                    {/* Buttons */}
                    <div className="flex gap-3">
                      <button onClick={closeInlineQuiz}
                        className="w-[35%] py-3 rounded-xl text-sm font-bold border border-[var(--color-border)] text-[var(--color-text)]">
                        ← Menu
                      </button>
                      <button onClick={() => openInlineQuiz(activeQuizType!)}
                        className="flex-1 py-3 rounded-xl text-sm font-bold bg-[var(--color-primary)] text-white">
                        🔄 Latihan Lagi
                      </button>
                    </div>
                  </div>
                ) : (() => {
                  const q = activeQuizQuestions[activeQuizIndex];
                  if (!q) return null;

                  // ===== TEBAK PARTIKEL =====
                  if (activeQuizType === 'tebak_partikel') {
                    const rawParticles = q.pilihan_jawaban || [];
                    // ponytail: shuffle once per question, cache in ref
                    if (!shuffledParticlesRef.current.has(activeQuizIndex)) {
                      shuffledParticlesRef.current.set(activeQuizIndex, shuffleArray([...rawParticles]));
                    }
                    const particles = shuffledParticlesRef.current.get(activeQuizIndex)!;
                    const isAnswered = activeQuizSelected !== null;
                    return (
                      <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--color-border)] p-4 shadow-sm">
                        <div className="text-center mb-4">
                          <p className="text-lg font-medium">{q.soal}</p>
                          <p className="text-[10px] text-[var(--color-text-muted)] mt-2">Pilih partikel yang tepat</p>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mb-4">
                          {particles.map((p: string) => {
                            const isCorrect = p === q.jawaban_benar;
                            const isSelected = activeQuizSelected === p;
                            let btnClass = 'bg-[var(--color-surface-2)] border-[var(--color-border)] hover:brightness-110';
                            if (isAnswered && isSelected && isCorrect) btnClass = 'bg-green-600/20 border-green-500 text-green-500';
                            if (isAnswered && isSelected && !isCorrect) btnClass = 'bg-red-600/20 border-red-500 text-red-500';
                            if (isAnswered && !isSelected && isCorrect) btnClass = 'bg-green-600/10 border-green-500/30 text-green-500';
                            return (
                              <button key={p} disabled={isAnswered}
                                onClick={() => {
                                  setActiveQuizSelected(p);
                                  setActiveQuizAnswered(true);
                                  const correct = p === q.jawaban_benar;
                                  setActiveQuizCorrect(correct);
                                  if (correct) {
                                    setActiveQuizScore(s => s + 1);
                                    setExpToast({ show: true, text: '+5 EXP' });
                                    setTimeout(() => setExpToast({ show: false, text: '' }), 2000);
                                  }
                                  setTimeout(() => {
                                    if (activeQuizIndex < activeQuizQuestions.length - 1) {
                                      setActiveQuizIndex(i => i + 1);
                                      setActiveQuizSelected(null);
                                      setActiveQuizCorrect(false);
                                      setActiveQuizAnswered(false);
                                    } else {
                                      setActiveQuizFinished(true);
                                    }
                                  }, 800);
                                }}
                                className={`py-3 rounded-xl text-sm font-bold border transition-all ${btnClass}`}>
                                {p}
                              </button>
                            );
                          })}
                        </div>
                        {isAnswered && (
                          <div className={`text-center text-sm font-medium ${activeQuizCorrect ? 'text-green-500' : 'text-red-500'}`}>
                            {activeQuizCorrect ? '✅ Benar!' : `❌ Salah! Jawaban: ${q.jawaban_benar}`}
                          </div>
                        )}
                      </div>
                    );
                  }

                  // ===== SUSUN KALIMAT =====
                  if (activeQuizType === 'susun_kalimat') {
                    const words: string[] = q.pilihan_jawaban || [];
                    const isAnswered = activeQuizAnswered;
                    // ponytail: init available words if empty (first render or question change)
                    if (activeQuizAvailable.length === 0 && words.length > 0) {
                      setTimeout(() => setActiveQuizAvailable(shuffleArray([...words])), 0);
                    }
                    return (
                      <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--color-border)] p-4 shadow-sm">
                        <div className="text-center mb-4">
                          <p className="text-sm text-[var(--color-text-muted)] mb-2">Susun kalimat yang benar:</p>
                          <p className="text-lg font-medium">{q.soal}</p>
                        </div>
                        <div className="min-h-[48px] bg-[var(--color-surface-2)] rounded-xl p-2 mb-4 flex flex-wrap gap-2 items-center justify-center">
                          {activeQuizArrangement.length === 0 && <span className="text-xs text-[var(--color-text-muted)]">Ketuk kata untuk menyusun</span>}
                          {activeQuizArrangement.map((word, idx) => (
                            <button key={idx} onClick={() => {
                              setActiveQuizArrangement(a => a.filter((_, i) => i !== idx));
                              setActiveQuizAvailable(av => [...av, word]);
                            }} className="px-3 py-1 bg-[var(--color-primary)]/20 text-[var(--color-primary)] rounded-lg text-sm font-medium">
                              {word}
                            </button>
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-2 justify-center mb-4">
                          {activeQuizAvailable.map((word, idx) => (
                            <button key={idx} onClick={() => {
                              setActiveQuizArrangement(a => [...a, word]);
                              setActiveQuizAvailable(av => av.filter((_, i) => i !== idx));
                            }} className="px-3 py-1.5 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-lg text-sm hover:brightness-110">
                              {word}
                            </button>
                          ))}
                        </div>
                        {!isAnswered && activeQuizArrangement.length > 0 && (
                          <button onClick={() => {
                            const answer = activeQuizArrangement.join('');
                            const correct = answer === q.jawaban_benar;
                            setActiveQuizAnswered(true);
                            setActiveQuizCorrect(correct);
                            if (correct) {
                              setActiveQuizScore(s => s + 1);
                              setExpToast({ show: true, text: '+10 EXP' });
                              setTimeout(() => setExpToast({ show: false, text: '' }), 2000);
                            }
                            setTimeout(() => {
                              if (activeQuizIndex < activeQuizQuestions.length - 1) {
                                const nextIdx = activeQuizIndex + 1;
                                const nextQ = activeQuizQuestions[nextIdx];
                                const nextWords: string[] = nextQ?.pilihan_jawaban || [];
                                setActiveQuizIndex(i => i + 1);
                                setActiveQuizArrangement([]);
                                setActiveQuizAvailable(shuffleArray([...nextWords]));
                                setActiveQuizCorrect(false);
                                setActiveQuizAnswered(false);
                              } else {
                                setActiveQuizFinished(true);
                              }
                            }, 1200);
                          }} className="w-full py-3 bg-[var(--color-primary)] text-white rounded-xl text-sm font-bold">Periksa</button>
                        )}
                        {isAnswered && (
                          <div className={`text-center text-sm font-medium ${activeQuizCorrect ? 'text-green-500' : 'text-red-500'}`}>
                            {activeQuizCorrect ? '✅ Benar!' : `❌ Salah! Jawaban: ${q.jawaban_benar}`}
                          </div>
                        )}
                      </div>
                    );
                  }

                  // ===== PASANGKAN =====
                  if (activeQuizType === 'pasangkan') {
                    let matchItems: { left: string; right: string }[] = [];
                    try { matchItems = JSON.parse(q.soal); } catch { matchItems = []; }
                    const leftItems = matchItems.map((item, i) => ({ ...item, idx: i }));
                    const rightItems = matchItems.map((item, i) => ({ ...item, idx: i }));
                    return (
                      <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--color-border)] p-4 shadow-sm">
                        <p className="text-sm text-[var(--color-text-muted)] mb-4 text-center">Ketuk satu dari kiri, lalu satu dari kanan untuk mencocokkan.</p>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            {leftItems.map((item) => {
                              const isSelected = activeQuizMatchSelected.left === item.idx;
                              const isMatched = activeQuizMatchPairs.has(item.idx);
                              return (
                                <button key={`l-${item.idx}`} disabled={isMatched || (activeQuizMatchSelected.left !== null && !isSelected)}
                                  onClick={() => setActiveQuizMatchSelected(s => ({ ...s, left: item.idx }))}
                                  className={`w-full py-3 rounded-xl text-sm font-bold border transition-all ${
                                    isMatched ? 'bg-green-600/10 border-green-500/30 text-green-500 line-through' :
                                    isSelected ? 'bg-[var(--color-primary)]/20 border-[var(--color-primary)] text-[var(--color-primary)]' :
                                    'bg-[var(--color-surface-2)] border-[var(--color-border)] hover:brightness-110'
                                  }`}>
                                  {item.left}
                                </button>
                              );
                            })}
                          </div>
                          <div className="space-y-2">
                            {rightItems.map((item) => {
                              const isSelected = activeQuizMatchSelected.right === item.idx;
                              const isMatched = activeQuizMatchPairs.has(item.idx);
                              return (
                                <button key={`r-${item.idx}`} disabled={isMatched || (activeQuizMatchSelected.right !== null && !isSelected)}
                                  onClick={() => {
                                    setActiveQuizMatchSelected(s => ({ ...s, right: item.idx }));
                                    if (activeQuizMatchSelected.left !== null && activeQuizMatchSelected.left === item.idx) {
                                      const newPairs = new Set(activeQuizMatchPairs);
                                      newPairs.add(activeQuizMatchSelected.left);
                                      newPairs.add(item.idx);
                                      setActiveQuizMatchPairs(newPairs);
                                      setActiveQuizMatchSelected({ left: null, right: null });
                                      setActiveQuizScore(s => s + 1);
                                      if (newPairs.size === matchItems.length * 2) {
                                        setExpToast({ show: true, text: '+10 EXP' });
                                        setTimeout(() => setExpToast({ show: false, text: '' }), 2000);
                                        setTimeout(() => {
                                          if (activeQuizIndex < activeQuizQuestions.length - 1) {
                                            setActiveQuizIndex(i => i + 1);
                                            setActiveQuizMatchSelected({ left: null, right: null });
                                            setActiveQuizMatchPairs(new Set());
                                          } else {
                                            setActiveQuizFinished(true);
                                          }
                                        }, 1000);
                                      }
                                    } else {
                                      setActiveQuizMatchSelected({ left: null, right: null });
                                    }
                                  }}
                                  className={`w-full py-3 rounded-xl text-sm font-bold border transition-all ${
                                    isMatched ? 'bg-green-600/10 border-green-500/30 text-green-500 line-through' :
                                    isSelected ? 'bg-[var(--color-primary)]/20 border-[var(--color-primary)] text-[var(--color-primary)]' :
                                    'bg-[var(--color-surface-2)] border-[var(--color-border)] hover:brightness-110'
                                  }`}>
                                  {item.right}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  }

                  // ===== DEFAULT: Other types =====
                  return (
                    <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--color-border)] p-4 shadow-sm text-center">
                      <p className="text-sm text-[var(--color-text-muted)]">Tipe quiz "{activeQuizType}" akan segera hadir.</p>
                      <button onClick={() => {
                        if (activeQuizIndex < activeQuizQuestions.length - 1) setActiveQuizIndex(i => i + 1);
                      }} className="mt-4 px-4 py-2 bg-[var(--color-primary)] text-white rounded-xl text-sm font-bold">Lewati</button>
                    </div>
                  );
                })()}
              </div>
            ) : (
              /* ===== QUIZ LIST MODE ===== */
              <div>
                <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider font-bold mb-1">Latihan Interaktif</p>
                <h2 className="text-lg font-bold mb-1">✏️ Renshū — Pelajaran {lesson.nomor_pelajaran}</h2>
                <p className="text-xs text-[var(--color-text-muted)] mb-4">{lesson.judul?.split('(')[0]?.trim() || ''} · {kotoba.length} kosakata · {bunpou.length} pola grammar</p>
                <div className="space-y-2">
                  {[
                    { icon: '🎯', label: 'Tebak Partikel', desc: `Pilih partikel untuk ${kotoba.length} contoh kalimat`, color: 'text-rose-500' },
                    { icon: '🧩', label: 'Susun Kalimat', desc: 'Rangkai kata dari pola yang sudah dipelajari', color: 'text-blue-500' },
                    { icon: '✏️', label: 'Isi Kalimat', desc: `Ketik terjemahan ${kotoba.length} kata kosakata`, color: 'text-amber-500' },
                    { icon: '📖', label: 'Indonesia → Jepang', desc: 'Terjemahkan 10 kata pilihan acak ke Jepang', color: 'text-emerald-500' },
                    { icon: '🔗', label: 'Pasangkan Kata', desc: 'Cocokkan 8 kata Jepang dengan artinya', color: 'text-violet-500' },
                    { icon: '📝', label: 'Kuis Bergambar', desc: `Soal pilihan ganda dari ${kotoba.length} kosakata`, color: 'text-cyan-500' },
                  ].map((item) => {
                    const typeMap: Record<string, JenisSoal> = {
                      'Tebak Partikel': 'tebak_partikel',
                      'Susun Kalimat': 'susun_kalimat',
                      'Isi Kalimat': 'isi_kalimat',
                      'Indonesia → Jepang': 'terjemahkan',
                      'Pasangkan Kata': 'pasangkan',
                      'Kuis Bergambar': 'kuis_bergambar',
                    };
                    const qType = typeMap[item.label];
                    return (
                      <button key={item.label} onClick={() => openInlineQuiz(qType)}
                        className="w-full flex items-center gap-3 p-4 bg-[var(--bg-card)] rounded-xl border border-[var(--color-border)] hover:brightness-110 transition-all shadow-sm text-left">
                        <span className={`text-2xl ${item.color}`}>{item.icon}</span>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{item.label}</div>
                          <div className="text-[10px] text-[var(--color-text-muted)]">{item.desc}</div>
                        </div>
                        <span className="text-[var(--color-text-muted)] text-lg">›</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}