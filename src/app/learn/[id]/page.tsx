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

  useEffect(() => {
    if (loading) return;
    if (!user) { router.push('/auth?mode=login'); return; }
    loadLesson();
  }, [id, user, loading]);

  const loadLesson = async () => {
    const { data: l } = await supabase.from('lessons').select('*').eq('id', id).single();
    if (l) {
      setLesson(l as Lesson);
      if (!l.is_free && !profile?.is_premium) {
        setLocked(true);
        return;
      }
    }
    const { data: k } = await supabase.from('kotoba').select('*').eq('lesson_id', id);
    if (k) setKotoba(k as Kotoba[]);
    const { data: b } = await supabase.from('bunpou').select('*').eq('lesson_id', id);
    if (b) setBunpou(b as Bunpou[]);
  };

  if (locked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <div className="text-center max-w-sm">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-xl font-bold text-accent mb-2">Materi Premium</h2>
          <p className="text-gray-500 dark:text-gray-400 dark:text-gray-500 text-sm mb-6">Upgrade ke Premium buat akses pelajaran ini dan semua materi lainnya.</p>
          <Link href="/premium" className="inline-block px-6 py-3 bg-primary text-white font-bold rounded-xl">
            Upgrade Sekarang
          </Link>
        </div>
      </div>
    );
  }

  if (!lesson) return <div className="p-8 text-center text-gray-400 dark:text-gray-500">Loading...</div>;

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'kotoba', label: 'Kosakata', icon: '📖' },
    { key: 'bunpou', label: 'Tata Bahasa', icon: '📐' },
    { key: 'renshu', label: 'Latihan', icon: '✍️' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 sticky top-0">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center gap-4">
          <Link href="/learn" className="text-gray-400 dark:text-gray-500 hover:text-primary">←</Link>
          <div>
            <p className="text-xs text-gray-400 dark:text-gray-500">Pelajaran {lesson.nomor_pelajaran}</p>
            <h1 className="font-bold text-accent">{lesson.judul}</h1>
          </div>
        </div>
      </header>

      {/* TABS */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 flex">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition-all ${
                tab === t.key
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 dark:text-gray-400 dark:text-gray-500 hover:text-gray-700'
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
            {kotoba.length === 0 && <p className="text-gray-400 dark:text-gray-500 text-sm">Belum ada kosakata untuk pelajaran ini.</p>}
            {kotoba.map((k) => (
              <div key={k.id} className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xl font-bold">{k.kata_jepang}</span>
                  {k.romaji && <span className="text-sm text-gray-400 dark:text-gray-500">{k.romaji}</span>}
                </div>
                <p className="text-gray-600">{k.arti_indonesia}</p>
                {k.contoh_kalimat && (
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-1 italic">{k.contoh_kalimat}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {tab === 'bunpou' && (
          <div className="space-y-4">
            {bunpou.length === 0 && <p className="text-gray-400 dark:text-gray-500 text-sm">Belum ada tata bahasa untuk pelajaran ini.</p>}
            {bunpou.map((b) => (
              <div key={b.id} className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700">
                <h3 className="font-bold text-primary mb-2">{b.pola_grammar}</h3>
                <p className="text-gray-600 text-sm mb-2">{b.penjelasan}</p>
                {b.contoh && (
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 text-sm font-medium">{b.contoh}</div>
                )}
              </div>
            ))}
          </div>
        )}

        {tab === 'renshu' && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">✍️</div>
            <h3 className="font-bold text-lg mb-2">Latihan Soal</h3>
            <p className="text-gray-500 dark:text-gray-400 dark:text-gray-500 text-sm mb-6">Uji pemahaman lo tentang pelajaran ini.</p>
            <Link
              href={`/learn/${id}/quiz`}
              className="inline-block px-6 py-3 bg-primary text-white font-bold rounded-xl"
            >
              Mulai Latihan
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
