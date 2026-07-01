'use client';

import { useState } from 'react';

interface VocabCard {
  kata: string;
  arti: string;
  romaji?: string;
}

export default function DailyReview({ words }: { words: VocabCard[] }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<Set<number>>(new Set());

  if (words.length === 0) return null;
  const current = words[index];

  return (
    <div className="bg-[var(--bg-card)] rounded-2xl p-5 border border-[var(--color-border)]">
      <h3 className="font-bold text-sm mb-1">📖 Review Vocab Hari Ini</h3>
      <p className="text-xs text-[var(--color-text-muted)] mb-4">Ketuk kartu untuk lihat artinya</p>

      <div className="text-center mb-3">
        <span className="text-xs text-[var(--color-text-muted)]">{index + 1}/{words.length}</span>
      </div>

      <div
        onClick={() => setFlipped(!flipped)}
        className="bg-[var(--color-primary-light)] rounded-2xl p-8 text-center cursor-pointer select-none border border-[var(--color-border)] min-h-[140px] flex flex-col items-center justify-center transition-all hover:border-[var(--color-primary)]"
      >
        {!flipped ? (
          <div>
            <div className="text-3xl font-bold mb-1">{current.kata}</div>
            {current.romaji && <div className="text-sm text-[var(--color-text-muted)]">{current.romaji}</div>}
          </div>
        ) : (
          <div className="text-xl font-medium text-[var(--color-primary)]">{current.arti}</div>
        )}
      </div>

      <div className="flex gap-2 mt-3">
        <button onClick={() => setFlipped(!flipped)} className="flex-1 py-2.5 bg-[var(--color-surface-2)] rounded-xl text-sm font-medium hover:brightness-110 transition-all">
          {flipped ? '🙈 Tutup' : '👀 Lihat'}
        </button>
        <button onClick={() => { setKnown(new Set([...known, index])); setFlipped(false); setIndex((i) => (i + 1) % words.length); }}
          className="flex-1 py-2.5 bg-green-600/20 text-green-500 rounded-xl text-sm font-medium hover:bg-green-600/30 transition-all">
          ✅ Hafal
        </button>
        <button onClick={() => { setFlipped(false); setIndex((i) => (i + 1) % words.length); }}
          className="flex-1 py-2.5 bg-red-600/20 text-red-500 rounded-xl text-sm font-medium hover:bg-red-600/30 transition-all">
          🔄 Skip
        </button>
      </div>

      <div className="mt-3 flex gap-1">
        {words.map((_, i) => (
          <div key={i} className={`h-1 flex-1 rounded-full ${i === index ? 'bg-[var(--color-primary)]' : known.has(i) ? 'bg-green-500' : 'bg-[var(--color-border)]'}`} />
        ))}
      </div>
    </div>
  );
}
