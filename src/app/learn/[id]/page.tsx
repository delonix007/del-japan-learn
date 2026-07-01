'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import { useAuthStore } from '@/stores/useAuthStore';
import type { Lesson, Kotoba, Bunpou } from '@/types';

type Tab = 'kotoba' | 'bunpou' | 'renshu';

export default function LessonDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user, profile, loading } = useAuthStore();
  const supabase = createClient();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [kotoba, setKotoba] = useState<Kotoba[]>([]);
  const [bunpou, setBunpou] = useState<Bunpou[]>([]);
  const [tab, setTab] = useState<Tab>('kotoba');
  const [locked, setLocked] = useState(false);

  const [loadingLesson, setLoadingLesson] = useState(true);

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

  if (locked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-app)] p-4">
        <div className="text-center max-w-sm">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-xl font-bold text-[var(--color-accent)] mb-2">Materi Premium</h2>
          <p className="text-[var(--color-text-muted)]  text-sm mb-6">Upgrade ke Premium buat akses pelajaran ini dan semua materi lainnya.</p>
          <Link href="/premium" className="inline-block px-6 py-3 bg-[var(--color-primary)] text-white font-bold rounded-xl">
            Upgrade Sekarang
          </Link>
        </div>
      </div>
    );
  }

  if (!lesson && loadingLesson) return <div className="p-8 text-center text-[var(--color-text-muted)]">Loading...</div>;
  if (!lesson) return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-app)] p-4">
      <div className="text-center max-w-sm">
        <div className="text-5xl mb-4">🔍</div>
        <h2 className="text-xl font-bold text-[var(--color-accent)] mb-2">Pelajaran Tidak Ditemukan</h2>
        <p className="text-[var(--color-text-muted)] text-sm mb-6">Mungkin pelajaran ini belum tersedia atau URL-nya salah.</p>
        <Link href="/learn" className="inline-block px-6 py-3 bg-[var(--color-primary)] text-white font-bold rounded-xl">Kembali ke Daftar</Link>
      </div>
    </div>
  );

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'kotoba', label: 'Kosakata', icon: '📖' },
    { key: 'bunpou', label: 'Tata Bahasa', icon: '📐' },
    { key: 'renshu', label: 'Latihan', icon: '✍️' },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-app)]">
      <header className="bg-[var(--bg-card)] border-b border-[var(--color-border)] sticky top-0">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center gap-4">
          <Link href="/learn" className="text-[var(--color-text-muted)] hover:text-[var(--color-text)]">←</Link>
          <div>
            <p className="text-xs text-[var(--color-text-muted)]">Pelajaran {lesson.nomor_pelajaran}</p>
            <h1 className="font-bold text-[var(--color-accent)]">{lesson.judul}</h1>
          </div>
        </div>
      </header>

      {/* TABS */}
      <div className="bg-[var(--bg-card)] border-b border-[var(--color-border)]">
        <div className="max-w-4xl mx-auto px-4 flex">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition-all ${
                tab === t.key
                  ? 'border-primary text-[var(--color-primary)]'
                  : 'border-transparent text-[var(--color-text-muted)]  hover:text-[var(--color-text)]'
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {tab === 'kotoba' && (
          <div className="space-y-3">
            {kotoba.length === 0 && <p className="text-[var(--color-text-muted)] text-sm">Belum ada kosakata untuk pelajaran ini.</p>}
            {kotoba.map((k) => (
              <div key={k.id} className="bg-[var(--bg-card)] rounded-xl p-4 border border-[var(--color-border)]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xl font-bold">{k.kata_jepang}</span>
                  {k.romaji && <span className="text-sm text-[var(--color-text-muted)]">{k.romaji}</span>}
                </div>
                <p className="text-[var(--color-text-muted)]">{k.arti_indonesia}</p>
                {k.contoh_kalimat && (
                  <p className="text-sm text-[var(--color-text-muted)] mt-1 italic">{k.contoh_kalimat}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {tab === 'bunpou' && (
          <div className="space-y-4">
            {bunpou.length === 0 && <p className="text-[var(--color-text-muted)] text-sm">Belum ada tata bahasa untuk pelajaran ini.</p>}
            {bunpou.map((b) => (
              <div key={b.id} className="bg-[var(--bg-card)] rounded-xl p-5 border border-[var(--color-border)]">
                <h3 className="font-bold text-[var(--color-primary)] mb-2">{b.pola_grammar}</h3>
                <p className="text-[var(--color-text-muted)] text-sm mb-2">{b.penjelasan}</p>
                {b.contoh && (
                  <div className="bg-[var(--bg-app)] rounded-lg p-3 text-sm font-medium">{b.contoh}</div>
                )}
              </div>
            ))}
          </div>
        )}

        {tab === 'renshu' && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">✍️</div>
            <h3 className="font-bold text-lg mb-2">Latihan Soal</h3>
            <p className="text-[var(--color-text-muted)]  text-sm mb-6">Uji pemahaman lo tentang pelajaran ini.</p>
            <Link
              href={`/learn/${id}/quiz`}
              className="inline-block px-6 py-3 bg-[var(--color-primary)] text-white font-bold rounded-xl"
            >
              Mulai Latihan
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
