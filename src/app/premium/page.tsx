'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import { useAuthStore } from '@/stores/useAuthStore';

export default function PremiumPage() {
  const { user } = useAuthStore();
  const supabase = createClient();
  const [wa, setWa] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRequest = async () => {
    if (!user || !wa) return;
    setLoading(true);
    await supabase.from('activation_requests').insert({
      user_id: user.id,
      nomor_whatsapp: wa,
      status: 'pending',
      kode_referensi: `DEL-${Date.now().toString(36)}`,
    });
    setSent(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-app)]">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-4">
          <Link href="/dashboard" className="text-[var(--color-text-muted)] hover:text-[var(--color-text)]">←</Link>
          <h1 className="font-bold text-accent">⭐ Upgrade Premium</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-8">
        <div className="bg-gradient-to-br from-accent to-blue-900 rounded-2xl p-8 text-white text-center mb-8">
          <div className="text-5xl mb-4">🌟</div>
          <h2 className="text-2xl font-bold mb-2">Del-Japan Premium</h2>
          <p className="text-gray-300 mb-4">Akses seumur hidup — semua materi & fitur</p>
          <div className="text-4xl font-extrabold mb-2">Rp99K</div>
          <p className="text-sm text-gray-400 dark:text-gray-500">Sekali bayar, akses selamanya</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 mb-6">
          <h3 className="font-bold text-lg mb-4">Yang lo dapetin:</h3>
          <ul className="space-y-3 text-sm">
            {[
              '✅ 50 Pelajaran Minna no Nihongo (I & II)',
              '✅ 352 Kanji N5–N4 lengkap',
              '✅ Semua jenis quiz interaktif',
              '✅ Kana Trainer penuh',
              '✅ Offline-ready',
              '✅ Tanpa iklan',
            ].map((item) => (
              <li key={item} className="text-gray-700">{item}</li>
            ))}
          </ul>
        </div>

        {!sent ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
            <h3 className="font-bold text-lg mb-4">Aktivasi via WhatsApp</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500 mb-4">Masukin nomor WhatsApp lo, admin bakal konfirmasi manual.</p>
            <input
              type="tel"
              value={wa}
              onChange={(e) => setWa(e.target.value)}
              placeholder="Contoh: 081234567890"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 mb-4 focus:border-primary outline-none"
            />
            <button
              onClick={handleRequest}
              disabled={loading || !wa}
              className="w-full py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Mengirim...' : `Hubungi Admin via WhatsApp`}
            </button>
          </div>
        ) : (
          <div className="bg-green-50 rounded-2xl p-6 border border-green-200 text-center">
            <div className="text-3xl mb-2">✅</div>
            <h3 className="font-bold text-green-800 mb-2">Permintaan Terkirim!</h3>
            <p className="text-sm text-green-600">Admin bakal konfirmasi dalam 1x24 jam. Pantau status di halaman ini.</p>
          </div>
        )}
      </main>
    </div>
  );
}
