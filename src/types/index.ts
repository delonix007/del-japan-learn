export type Book = 'I' | 'II';

export interface Lesson {
  id: number;
  book: Book;
  nomor_pelajaran: number;
  judul: string;
  urutan: number;
  is_free: boolean;
  created_at: string;
}

export interface Kotoba {
  id: number;
  lesson_id: number;
  kata_jepang: string;
  romaji: string | null;
  arti_indonesia: string;
  contoh_kalimat: string | null;
  created_at: string;
}

export interface Bunpou {
  id: number;
  lesson_id: number;
  pola_grammar: string;
  penjelasan: string;
  contoh: string | null;
  struktur: string | null;
  fungsi: string | null;
  kesalahan: string | null;
  mirip: string | null;
  created_at: string;
}

export interface Kanji {
  id: number;
  karakter: string;
  arti: string;
  cara_baca_kunyomi: string | null;
  cara_baca_onyomi: string | null;
  level: 'N5' | 'N4';
  set_number: number;
  contoh_kata: string | null;
}

export interface Kana {
  id: number;
  karakter: string;
  jenis: 'hiragana' | 'katakana';
  romaji: string;
  urutan: number;
}

export type JenisSoal = 'tebak_partikel' | 'susun_kalimat' | 'isi_kalimat' | 'terjemahkan' | 'pasangkan' | 'kuis_bergambar';

export interface QuizQuestion {
  id: number;
  lesson_id: number;
  jenis_soal: JenisSoal;
  soal: string;
  pilihan_jawaban: string[] | null;
  jawaban_benar: string;
  gambar_url: string | null;
}

export interface UserProgress {
  id: number;
  user_id: string;
  lesson_id: number;
  status: 'belum' | 'sedang' | 'selesai';
  persentase_hafalan: number;
  last_accessed: string;
}

export interface UserExp {
  id: number;
  user_id: string;
  total_exp: number;
  level: number;
  streak_harian: number;
  last_streak_date: string | null;
}

export interface ActivationRequest {
  id: number;
  user_id: string;
  nomor_whatsapp: string;
  status: 'pending' | 'dikonfirmasi' | 'ditolak';
  kode_referensi: string | null;
  created_at: string;
  confirmed_at: string | null;
}

export interface Profile {
  id: string;
  email: string | null;
  nama: string | null;
  is_premium: boolean;
  premium_activated_at: string | null;
}
