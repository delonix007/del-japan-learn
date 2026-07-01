'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import { useAuthStore } from '@/stores/useAuthStore';
import { useTheme } from '@/components/ThemeProvider';
import type { Lesson, Kotoba, Bunpou } from '@/types';

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

  // Flashcard
  const [fcIndex, setFcIndex] = useState(0);
  const [fcFlipped, setFcFlipped] = useState(false);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [mastered, setMastered] = useState<Set<number>>(new Set());

  // Kosakata search
  const [search, setSearch] = useState('');

  // Bunpou accordion
  const [expandedBunpou, setExpandedBunpou] = useState<Set<number>>(new Set());

  // AI Chat
  const [chatMsg, setChatMsg] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'ai'; text: string }[]>([]);

  useEffect(() => {
    if (loading) return;
    if (!user) { router.push('/auth?mode=login'); return; }
    loadLesson();
  }, [id, user, loading]);

  const loadLesson = async () => {
    setLoadingLesson(true);
    const { data: l } = await supabase.from('lessons').select('*').eq('id', id).single();
    if (l) {
      setLesson(l as Lesson);
      if (!l.is_free && !profile?.is_premium) {
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
    n.has(idx) ? n.delete(idx) : n.add(idx);
    setMastered(n);
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
        <Link href="/learn" className="inline-block px-6 py-3 bg-[var(--color-primary)] text-white font-bold rounded-xl">Kembali</Link>
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
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-[var(--bg-app)]/95 backdrop-blur border-b border-[var(--color-border)]">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-[var(--color-text-muted)] leading-tight">Del-Japan</div>
            <div className="font-bold text-sm leading-tight">Pelajaran {lesson.nomor_pelajaran} — {lesson.judul?.split('(')[0]?.trim() || ''}</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center text-xs font-bold text-[var(--color-primary)]">0%</div>
            <button onClick={toggle} className="text-sm text-[var(--color-text-muted)]">{theme === 'dark' ? '☀️' : '🌙'}</button>
            <Link href="/premium" className="px-2 py-0.5 bg-green-600/20 text-green-500 rounded-full text-[9px] font-bold">🧑 TAMU</Link>
            <Link href="/profile" className="w-7 h-7 rounded-full bg-[var(--color-text)] flex items-center justify-center text-[var(--bg-app)] text-xs font-bold">{(profile?.nama || 'U')[0].toUpperCase()}</Link>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-4 pb-28">
        {/* FILTER BAR */}
        <div className="flex gap-2 mb-4">
          <select className="flex-1 px-3 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--color-border)] text-sm outline-none">
            <option>Buku {lesson.book}</option>
            <option>Buku {lesson.book === 'I' ? 'II' : 'I'}</option>
          </select>
          <select className="flex-1 px-3 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--color-border)] text-sm outline-none truncate">
            <option>Pelajaran {lesson.nomor_pelajaran} — {(lesson.judul || '').split('(')[0]?.trim() || ''}</option>
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
            <p className="text-center text-xs text-[var(--color-text-muted)] mb-3">{fcIndex + 1} / {kotoba.length}</p>
            <div onClick={() => setFcFlipped(!fcFlipped)}
              className="bg-[var(--bg-card)] rounded-2xl border border-violet-600/30 p-8 text-center cursor-pointer min-h-[220px] flex flex-col items-center justify-center shadow-sm mb-4 select-none">
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
                className={`flex-1 py-2 rounded-xl text-xs font-medium border ${
                  mastered.has(fcIndex) ? 'border-green-500/50 bg-green-600/10 text-green-600' : 'border-[var(--color-border)] text-[var(--color-text-muted)]'
                }`}>
                {mastered.has(fcIndex) ? '✅ Sudah Hafal' : '○ Tandai Sudah Hafal'}
              </button>
              <div className="px-3 py-2 bg-[var(--color-surface-2)] rounded-xl text-xs">🔊</div>
              <button className="px-4 py-2 bg-[var(--color-surface-2)] rounded-xl text-xs text-[var(--color-text-muted)]" disabled={mastered.size === 0}>⚡ Review</button>
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
          <div className="space-y-2">
            {bunpou.length === 0 && <p className="text-xs text-[var(--color-text-muted)] text-center py-4">Belum ada grammar untuk pelajaran ini.</p>}
            {bunpou.map((b) => {
              const isOpen = expandedBunpou.has(b.id);
              return (
                <div key={b.id} className="bg-[var(--bg-card)] rounded-xl border border-[var(--color-border)] shadow-sm">
                  <button onClick={() => {
                    const n = new Set(expandedBunpou);
                    isOpen ? n.delete(b.id) : n.add(b.id);
                    setExpandedBunpou(n);
                  }} className="w-full flex items-center gap-3 p-3 text-left">
                    <span className="text-red-500 shrink-0">📌</span>
                    <span className="flex-1 font-medium text-sm">{b.pola_grammar}</span>
                    <span className={`text-xs text-[var(--color-text-muted)] transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
                  </button>
                  {isOpen && (
                    <div className="px-3 pb-3 pt-0 border-t border-[var(--color-border)]">
                      <p className="text-xs text-[var(--color-text-muted)] mt-2">{b.penjelasan}</p>
                      {b.contoh && (
                        <div className="mt-2 p-2 bg-[var(--color-surface-2)] rounded-lg text-xs font-medium">{b.contoh}</div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
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
            <form onSubmit={(e) => {
              e.preventDefault();
              if (!chatMsg.trim()) return;
              setChatHistory([...chatHistory, { role: 'user', text: chatMsg }]);
              setChatMsg('');
              setTimeout(() => {
                setChatHistory((prev) => [...prev, {
                  role: 'ai',
                  text: `Halo! Saya AI Sensei. Untuk pelajaran "${lesson.judul}", saya sarankan fokus pada kosakata dasar dan pola grammar yang ada. Ulangi flashcard setiap hari untuk hasil maksimal! 📚`
                }]);
              }, 1000);
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
              ].map((item) => (
                <Link key={item.label} href={`/learn/${id}/quiz`}
                  className="flex items-center gap-3 p-4 bg-[var(--bg-card)] rounded-xl border border-[var(--color-border)] hover:brightness-110 transition-all shadow-sm">
                  <span className={`text-2xl ${item.color}`}>{item.icon}</span>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{item.label}</div>
                    <div className="text-[10px] text-[var(--color-text-muted)]">{item.desc}</div>
                  </div>
                  <span className="text-[var(--color-text-muted)] text-lg">›</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
