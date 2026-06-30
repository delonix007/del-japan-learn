-- ============================================================
-- DEL-JAPAN LEARN — Supabase Schema
-- ============================================================

-- 1. USERS (handled by Supabase Auth, we extend with custom fields)
-- The users table is auto-created by Supabase Auth
-- We add custom columns via ALTER or create a user_settings table

-- 2. LESSONS
CREATE TABLE lessons (
  id BIGSERIAL PRIMARY KEY,
  book TEXT NOT NULL CHECK (book IN ('I', 'II')),
  nomor_pelajaran INT NOT NULL,
  judul TEXT NOT NULL,
  urutan INT NOT NULL,
  is_free BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(book, nomor_pelajaran)
);

-- 3. KOTOBA (Vocabulary)
CREATE TABLE kotoba (
  id BIGSERIAL PRIMARY KEY,
  lesson_id BIGINT REFERENCES lessons(id) ON DELETE CASCADE,
  kata_jepang TEXT NOT NULL,
  romaji TEXT,
  arti_indonesia TEXT NOT NULL,
  contoh_kalimat TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. BUNPOU (Grammar)
CREATE TABLE bunpou (
  id BIGSERIAL PRIMARY KEY,
  lesson_id BIGINT REFERENCES lessons(id) ON DELETE CASCADE,
  pola_grammar TEXT NOT NULL,
  penjelasan TEXT NOT NULL,
  contoh TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. KANJI
CREATE TABLE kanji (
  id BIGSERIAL PRIMARY KEY,
  karakter TEXT NOT NULL UNIQUE,
  arti TEXT NOT NULL,
  cara_baca_kunyomi TEXT,
  cara_baca_onyomi TEXT,
  level TEXT NOT NULL CHECK (level IN ('N5', 'N4')),
  set_number INT NOT NULL,
  contoh_kata TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. KANA
CREATE TABLE kana (
  id BIGSERIAL PRIMARY KEY,
  karakter TEXT NOT NULL UNIQUE,
  jenis TEXT NOT NULL CHECK (jenis IN ('hiragana', 'katakana')),
  romaji TEXT NOT NULL,
  urutan INT NOT NULL
);

-- 7. QUIZ QUESTIONS
CREATE TABLE quiz_questions (
  id BIGSERIAL PRIMARY KEY,
  lesson_id BIGINT REFERENCES lessons(id) ON DELETE CASCADE,
  jenis_soal TEXT NOT NULL CHECK (jenis_soal IN (
    'tebak_partikel', 'susun_kalimat', 'isi_kalimat',
    'terjemahkan', 'pasangkan', 'kuis_bergambar'
  )),
  soal TEXT NOT NULL,
  pilihan_jawaban JSONB,
  jawaban_benar TEXT NOT NULL,
  gambar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. USER PROGRESS
CREATE TABLE user_progress (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id BIGINT REFERENCES lessons(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'belum' CHECK (status IN ('belum', 'sedang', 'selesai')),
  persentase_hafalan INT DEFAULT 0,
  last_accessed TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

-- 9. USER KANJI PROGRESS
CREATE TABLE user_kanji_progress (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  kanji_id BIGINT REFERENCES kanji(id) ON DELETE CASCADE,
  status_hafal BOOLEAN DEFAULT false,
  UNIQUE(user_id, kanji_id)
);

-- 10. USER KANA PROGRESS
CREATE TABLE user_kana_progress (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  kana_id BIGINT REFERENCES kana(id) ON DELETE CASCADE,
  status_hafal BOOLEAN DEFAULT false,
  UNIQUE(user_id, kana_id)
);

-- 11. USER EXP
CREATE TABLE user_exp (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  total_exp INT DEFAULT 0,
  level INT DEFAULT 1,
  streak_harian INT DEFAULT 0,
  last_streak_date DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 12. ACTIVATION REQUESTS (premium manual)
CREATE TABLE activation_requests (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  nomor_whatsapp TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'dikonfirmasi', 'ditolak')),
  kode_referensi TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  confirmed_at TIMESTAMPTZ
);

-- Add is_premium to auth.users via a public.users view or a separate table
-- Option: Create a public.users table that syncs with auth.users
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  nama TEXT,
  is_premium BOOLEAN DEFAULT false,
  premium_activated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE kotoba ENABLE ROW LEVEL SECURITY;
ALTER TABLE bunpou ENABLE ROW LEVEL SECURITY;
ALTER TABLE kanji ENABLE ROW LEVEL SECURITY;
ALTER TABLE kana ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_kanji_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_kana_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_exp ENABLE ROW LEVEL SECURITY;
ALTER TABLE activation_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Content tables readable by all authenticated users
CREATE POLICY "Content readable by authenticated users" ON lessons
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Content readable by authenticated users" ON kotoba
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Content readable by authenticated users" ON bunpou
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Content readable by authenticated users" ON kanji
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Content readable by authenticated users" ON kana
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Content readable by authenticated users" ON quiz_questions
  FOR SELECT USING (auth.role() = 'authenticated');

-- RLS: User tables - only own data
CREATE POLICY "Users can read own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can read own progress" ON user_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON user_progress
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can read own kanji progress" ON user_kanji_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own kanji progress" ON user_kanji_progress
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can read own kana progress" ON user_kana_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own kana progress" ON user_kana_progress
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can read own exp" ON user_exp
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can upsert own exp" ON user_exp
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own exp" ON user_exp
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS: Activation requests - users can create and read own
CREATE POLICY "Users can create activation requests" ON activation_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own activation requests" ON activation_requests
  FOR SELECT USING (auth.uid() = user_id);

-- ============================================================
-- SEED DATA: Kana (Hiragana & Katakana)
-- ============================================================
INSERT INTO kana (karakter, jenis, romaji, urutan) VALUES
  ('あ', 'hiragana', 'a', 1), ('い', 'hiragana', 'i', 2), ('う', 'hiragana', 'u', 3),
  ('え', 'hiragana', 'e', 4), ('お', 'hiragana', 'o', 5), ('か', 'hiragana', 'ka', 6),
  ('き', 'hiragana', 'ki', 7), ('く', 'hiragana', 'ku', 8), ('け', 'hiragana', 'ke', 9),
  ('こ', 'hiragana', 'ko', 10), ('さ', 'hiragana', 'sa', 11), ('し', 'hiragana', 'shi', 12),
  ('す', 'hiragana', 'su', 13), ('せ', 'hiragana', 'se', 14), ('そ', 'hiragana', 'so', 15),
  ('た', 'hiragana', 'ta', 16), ('ち', 'hiragana', 'chi', 17), ('つ', 'hiragana', 'tsu', 18),
  ('て', 'hiragana', 'te', 19), ('と', 'hiragana', 'to', 20), ('な', 'hiragana', 'na', 21),
  ('に', 'hiragana', 'ni', 22), ('ぬ', 'hiragana', 'nu', 23), ('ね', 'hiragana', 'ne', 24),
  ('の', 'hiragana', 'no', 25), ('は', 'hiragana', 'ha', 26), ('ひ', 'hiragana', 'hi', 27),
  ('ふ', 'hiragana', 'fu', 28), ('へ', 'hiragana', 'he', 29), ('ほ', 'hiragana', 'ho', 30),
  ('ま', 'hiragana', 'ma', 31), ('み', 'hiragana', 'mi', 32), ('む', 'hiragana', 'mu', 33),
  ('め', 'hiragana', 'me', 34), ('も', 'hiragana', 'mo', 35), ('や', 'hiragana', 'ya', 36),
  ('ゆ', 'hiragana', 'yu', 37), ('よ', 'hiragana', 'yo', 38), ('ら', 'hiragana', 'ra', 39),
  ('り', 'hiragana', 'ri', 40), ('る', 'hiragana', 'ru', 41), ('れ', 'hiragana', 're', 42),
  ('ろ', 'hiragana', 'ro', 43), ('わ', 'hiragana', 'wa', 44), ('を', 'hiragana', 'wo', 45),
  ('ん', 'hiragana', 'n', 46), ('が', 'hiragana', 'ga', 47), ('ぎ', 'hiragana', 'gi', 48),
  ('ぐ', 'hiragana', 'gu', 49), ('げ', 'hiragana', 'ge', 50), ('ご', 'hiragana', 'go', 51),
  ('ざ', 'hiragana', 'za', 52), ('じ', 'hiragana', 'ji', 53), ('ず', 'hiragana', 'zu', 54),
  ('ぜ', 'hiragana', 'ze', 55), ('ぞ', 'hiragana', 'zo', 56), ('だ', 'hiragana', 'da', 57),
  ('ぢ', 'hiragana', 'ji', 58), ('づ', 'hiragana', 'zu', 59), ('で', 'hiragana', 'de', 60),
  ('ど', 'hiragana', 'do', 61), ('ば', 'hiragana', 'ba', 62), ('び', 'hiragana', 'bi', 63),
  ('ぶ', 'hiragana', 'bu', 64), ('べ', 'hiragana', 'be', 65), ('ぼ', 'hiragana', 'bo', 66),
  ('ぱ', 'hiragana', 'pa', 67), ('ぴ', 'hiragana', 'pi', 68), ('ぷ', 'hiragana', 'pu', 69),
  ('ぺ', 'hiragana', 'pe', 70), ('ぽ', 'hiragana', 'po', 71),
  ('ア', 'katakana', 'a', 72), ('イ', 'katakana', 'i', 73), ('ウ', 'katakana', 'u', 74),
  ('エ', 'katakana', 'e', 75), ('オ', 'katakana', 'o', 76), ('カ', 'katakana', 'ka', 77),
  ('キ', 'katakana', 'ki', 78), ('ク', 'katakana', 'ku', 79), ('ケ', 'katakana', 'ke', 80),
  ('コ', 'katakana', 'ko', 81), ('サ', 'katakana', 'sa', 82), ('シ', 'katakana', 'shi', 83),
  ('ス', 'katakana', 'su', 84), ('セ', 'katakana', 'se', 85), ('ソ', 'katakana', 'so', 86),
  ('タ', 'katakana', 'ta', 87), ('チ', 'katakana', 'chi', 88), ('ツ', 'katakana', 'tsu', 89),
  ('テ', 'katakana', 'te', 90), ('ト', 'katakana', 'to', 91), ('ナ', 'katakana', 'na', 92),
  ('ニ', 'katakana', 'ni', 93), ('ヌ', 'katakana', 'nu', 94), ('ネ', 'katakana', 'ne', 95),
  ('ノ', 'katakana', 'no', 96), ('ハ', 'katakana', 'ha', 97), ('ヒ', 'katakana', 'hi', 98),
  ('フ', 'katakana', 'fu', 99), ('ヘ', 'katakana', 'he', 100), ('ホ', 'katakana', 'ho', 101),
  ('マ', 'katakana', 'ma', 102), ('ミ', 'katakana', 'mi', 103), ('ム', 'katakana', 'mu', 104),
  ('メ', 'katakana', 'me', 105), ('モ', 'katakana', 'mo', 106), ('ヤ', 'katakana', 'ya', 107),
  ('ユ', 'katakana', 'yu', 108), ('ヨ', 'katakana', 'yo', 109), ('ラ', 'katakana', 'ra', 110),
  ('リ', 'katakana', 'ri', 111), ('ル', 'katakana', 'ru', 112), ('レ', 'katakana', 're', 113),
  ('ロ', 'katakana', 'ro', 114), ('ワ', 'katakana', 'wa', 115), ('ヲ', 'katakana', 'wo', 116),
  ('ン', 'katakana', 'n', 117), ('ガ', 'katakana', 'ga', 118), ('ギ', 'katakana', 'gi', 119),
  ('グ', 'katakana', 'gu', 120), ('ゲ', 'katakana', 'ge', 121), ('ゴ', 'katakana', 'go', 122),
  ('ザ', 'katakana', 'za', 123), ('ジ', 'katakana', 'ji', 124), ('ズ', 'katakana', 'zu', 125),
  ('ゼ', 'katakana', 'ze', 126), ('ゾ', 'katakana', 'zo', 127), ('ダ', 'katakana', 'da', 128),
  ('ヂ', 'katakana', 'ji', 129), ('ヅ', 'katakana', 'zu', 130), ('デ', 'katakana', 'de', 131),
  ('ド', 'katakana', 'do', 132), ('バ', 'katakana', 'ba', 133), ('ビ', 'katakana', 'bi', 134),
  ('ブ', 'katakana', 'bu', 135), ('ベ', 'katakana', 'be', 136), ('ボ', 'katakana', 'bo', 137),
  ('パ', 'katakana', 'pa', 138), ('ピ', 'katakana', 'pi', 139), ('プ', 'katakana', 'pu', 140),
  ('ペ', 'katakana', 'pe', 141), ('ポ', 'katakana', 'po', 142);

-- ============================================================
-- SEED DATA: Lessons 1-3 (free preview)
-- ============================================================
INSERT INTO lessons (book, nomor_pelajaran, judul, urutan, is_free) VALUES
  ('I', 1, 'はじめまして (Hajimemashite)', 1, true),
  ('I', 2, 'これからお世話になります (Yoroshiku onegaishimasu)', 2, true),
  ('I', 3, 'これをください (Kore o kudasai)', 3, true),
  ('I', 4, 'そちらは何ですか (Sochira wa nan desu ka)', 4, false),
  ('I', 5, 'ここにあります (Koko ni arimasu)', 5, false);
