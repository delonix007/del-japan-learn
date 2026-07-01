'use client';

const missions = [
  { icon: '📖', label: 'Pelajari 10 kosakata baru', exp: 20 },
  { icon: '🎯', label: 'Selesaikan 1 sesi quiz', exp: 30 },
  { icon: '🃏', label: 'Review 5 flashcard', exp: 50 },
];

export default function DailyMissions({ done = 0 }: { done?: number }) {
  return (
    <div className="bg-[var(--bg-card)] rounded-2xl p-5 border border-[var(--color-border)]">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-sm">🎯 Misi Harian ({done}/{missions.length})</h3>
        <span className="text-xs text-[var(--color-text-muted)]">Reset 7j 21m</span>
      </div>
      <div className="space-y-2">
        {missions.map((m, i) => (
          <div key={i} className={`flex items-center gap-3 p-2.5 rounded-xl text-sm ${i < done ? 'bg-green-600/10 text-green-500' : 'bg-[var(--color-surface-2)]'}`}>
            <span className="text-lg">{m.icon}</span>
            <span className="flex-1">{m.label}</span>
            <span className="text-[var(--color-primary)] font-medium text-xs">+{m.exp}</span>
            {i < done && <span className="text-green-500">✅</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
