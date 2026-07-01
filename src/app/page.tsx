'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { setGuestMode } from '@/lib/guest';

export default function LandingPage() {
  const router = useRouter();

  const handleGuestMode = () => {
    setGuestMode(true);
    router.push('/dashboard');
  };
  return (
    <div className="min-h-screen">
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🇯🇵</span>
            <span className="font-bold text-xl text-accent">Del-Japan</span>
            <span className="text-sm text-gray-400 hidden sm:inline">Learn</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/auth?mode=login"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary transition-colors"
            >
              Masuk
            </Link>
            <Link
              href="/auth?mode=register"
              className="px-5 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary-dark transition-colors shadow-sm"
            >
              Daftar Gratis
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-b from-primary-light to-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-6xl mb-6">🇯🇵</div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-accent mb-4 leading-tight">
            Kuasai Bahasa Jepang
            <br />
            <span className="text-primary">dari Nol Sampai Mahir</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Belajar JLPT N5–N4 dengan kurikulum Minna no Nihongo. Lengkap dengan
            Kanji, Kana, Tata Bahasa, dan Latihan Interaktif — semua dalam satu
            aplikasi PWA yang bisa diakses kapan aja.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/auth?mode=register"
              className="px-8 py-3.5 bg-primary text-white font-bold rounded-xl text-lg hover:bg-primary-dark transition-colors shadow-lg shadow-primary/30"
            >
              Mulai Belajar Gratis
            </Link>
            <button
              onClick={handleGuestMode}
              className="px-8 py-3.5 border-2 border-gray-200 text-gray-700 font-medium rounded-xl hover:border-primary hover:text-primary transition-colors"
            >
              👤 Mode Tamu — Coba Dulu
            </button>
          </div>
        </div>
      </section>

      {/* FITUR */}
      <section id="fitur" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-accent mb-12">
            Semua yang lo Butuhin buat Belajar Jepang
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="p-6 rounded-2xl border border-gray-100 hover:border-primary/20 hover:shadow-lg transition-all">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HARGA */}
      <section id="harga" className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-accent mb-4">Pilih Paket Lo</h2>
          <p className="text-gray-500 mb-10">Mulai gratis, upgrade kapan aja</p>
          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="p-8 rounded-2xl bg-white border-2 border-gray-100">
              <h3 className="font-bold text-xl mb-2">Gratis</h3>
              <p className="text-3xl font-extrabold text-accent mb-4">Rp0</p>
              <ul className="text-left space-y-2 text-sm text-gray-600 mb-6">
                <li className="flex items-center gap-2">✅ 3 Pelajaran pertama</li>
                <li className="flex items-center gap-2">✅ Kana Trainer</li>
                <li className="flex items-center gap-2">✅ Quiz dasar</li>
                <li className="flex items-center gap-2">✅ Streak & EXP</li>
              </ul>
              <Link href="/auth?mode=register" className="block w-full py-3 rounded-xl border-2 border-primary text-primary font-bold hover:bg-primary-light transition-colors">
                Daftar Gratis
              </Link>
            </div>
            <div className="p-8 rounded-2xl bg-accent text-white relative overflow-hidden">
              <div className="absolute top-2 right-2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">POPULER</div>
              <h3 className="font-bold text-xl mb-2">Premium</h3>
              <p className="text-3xl font-extrabold mb-1">Rp99K</p>
              <p className="text-sm text-gray-300 mb-4">Sekali bayar, akses seumur hidup</p>
              <ul className="text-left space-y-2 text-sm mb-6">
                <li className="flex items-center gap-2">✅ Semua 50 Pelajaran</li>
                <li className="flex items-center gap-2">✅ 352 Kanji lengkap</li>
                <li className="flex items-center gap-2">✅ Semua jenis quiz</li>
                <li className="flex items-center gap-2">✅ Offline-ready</li>
                <li className="flex items-center gap-2">✅ Aktivasi via WhatsApp</li>
              </ul>
              <a href="https://wa.me/6281234567890?text=Halo%20saya%20tertarik%20premium%20Del-Japan" className="block w-full py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary-dark transition-colors text-center" target="_blank">
                Hubungi Admin
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CARA AKTIVASI */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-accent mb-12">Cara Aktivasi Premium</h2>
          <div className="grid sm:grid-cols-4 gap-4">
            {steps.map((s, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
                  {i + 1}
                </div>
                <p className="font-medium text-sm">{s}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-accent text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Siap Mulai Belajar?</h2>
        <p className="mb-8 text-gray-300">Gabung ribuan pembelajar lainnya. Gratis!</p>
        <Link
          href="/auth?mode=register"
          className="inline-block px-10 py-4 bg-primary text-white font-bold rounded-xl text-lg hover:bg-primary-dark transition-colors shadow-lg"
        >
          Daftar Sekarang
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="py-8 px-4 border-t border-gray-100 text-center text-sm text-gray-400">
        <p>© 2026 Del-Japan Learn. All rights reserved.</p>
      </footer>
    </div>
  );
}

const features = [
  { icon: '📚', title: '50 Pelajaran', desc: 'Kurikulum Minna no Nihongo Book I & II, dari N5 sampai N4.' },
  { icon: '🈳', title: '352 Kanji', desc: 'Flashcard + quiz + tracking progress hafalan per set.' },
  { icon: 'あ', title: 'Kana Trainer', desc: 'Hiragana & Katakana lengkap dengan quiz ketik & pilihan ganda.' },
  { icon: '📝', title: '6 Jenis Latihan', desc: 'Tebak partikel, susun kalimat, terjemah, pasang kata, dan kuis bergambar.' },
  { icon: '🏆', title: 'Gamifikasi', desc: 'EXP, level, streak harian, dan achievement biar makin semangat.' },
  { icon: '📱', title: 'PWA Mobile-first', desc: 'Bisa di-install di HP kayak app native & offline-ready.' },
];

const steps = [
  'Daftar akun gratis',
  'Pelajari materi free',
  'Chat admin via WhatsApp',
  'Aktivasi & akses semua!',
];
