-- ============================================================
-- SEED DATA: N5 Kanji (Sekitar 120 kanji level N5)
-- ============================================================
INSERT INTO kanji (karakter, arti, cara_baca_kunyomi, cara_baca_onyomi, level, set_number) VALUES
  ('一', 'satu', 'ひと', 'イチ', 'N5', 1),
  ('二', 'dua', 'ふた', 'ニ', 'N5', 1),
  ('三', 'tiga', 'み', 'サン', 'N5', 1),
  ('四', 'empat', 'よ', 'シ', 'N5', 1),
  ('五', 'lima', 'いつ', 'ゴ', 'N5', 1),
  ('六', 'enam', 'む', 'ロク', 'N5', 1),
  ('七', 'tujuh', 'なな', 'シチ', 'N5', 1),
  ('八', 'delapan', 'や', 'ハチ', 'N5', 1),
  ('九', 'sembilan', 'ここの', 'キュウ', 'N5', 1),
  ('十', 'sepuluh', 'とお', 'ジュウ', 'N5', 1),
  ('百', 'ratus', 'もも', 'ヒャク', 'N5', 1),
  ('千', 'ribu', 'ち', 'セン', 'N5', 1),
  ('万', 'sepuluh ribu', 'よろず', 'マン', 'N5', 1),
  ('円', 'yen, lingkaran', 'まる', 'エン', 'N5', 1),
  ('日', 'hari, matahari', 'ひ', 'ニチ', 'N5', 2),
  ('月', 'bulan', 'つき', 'ゲツ', 'N5', 2),
  ('年', 'tahun', 'とし', 'ネン', 'N5', 2),
  ('時', 'waktu', 'とき', 'ジ', 'N5', 2),
  ('間', 'selang, antara', 'あいだ', 'カン', 'N5', 2),
  ('毎', 'setiap', 'ごと', 'マイ', 'N5', 2),
  ('先', 'sebelum, sebelumnya', 'さき', 'セン', 'N5', 2),
  ('今', 'sekarang', 'いま', 'コン', 'N5', 2),
  ('大', 'besar', 'おお', 'ダイ', 'N5', 2),
  ('小', 'kecil', 'ちい', 'ショウ', 'N5', 2),
  ('中', 'tengah', 'なか', 'チュウ', 'N5', 2),
  ('上', 'atas', 'うえ', 'ジョウ', 'N5', 2),
  ('下', 'bawah', 'した', 'カ', 'N5', 2),
  ('右', 'kanan', 'みぎ', 'ウ', 'N5', 2),
  ('左', 'kiri', 'ひだり', 'サ', 'N5', 2),
  ('東', 'timur', 'ひがし', 'トウ', 'N5', 2),
  ('西', 'barat', 'にし', 'セイ', 'N5', 2),
  ('南', 'selatan', 'みなみ', 'ナン', 'N5', 2),
  ('北', 'utara', 'きた', 'ホク', 'N5', 2),
  ('人', 'orang', 'ひと', 'ジン', 'N5', 3),
  ('名', 'nama', 'な', 'メイ', 'N5', 3),
  ('女', 'perempuan', 'おんな', 'ジョ', 'N5', 3),
  ('男', 'laki-laki', 'おとこ', 'ダン', 'N5', 3),
  ('子', 'anak', 'こ', 'シ', 'N5', 3),
  ('友', 'teman', 'とも', 'ユウ', 'N5', 3),
  ('父', 'ayah', 'ちち', 'フ', 'N5', 3),
  ('母', 'ibu', 'はは', 'ボ', 'N5', 3),
  ('学', 'belajar', 'まな', 'ガク', 'N5', 3),
  ('生', 'hidup', 'い', 'セイ', 'N5', 3),
  ('何', 'apa', 'なに', 'カ', 'N5', 3),
  ('本', 'buku', 'もと', 'ホン', 'N5', 3),
  ('語', 'bahasa', 'かた', 'ゴ', 'N5', 3),
  ('国', 'negara', 'くに', 'コク', 'N5', 3);

-- ============================================================
-- SEED DATA: Lesson 1 Vocabulary (Kotoba)
-- ============================================================
INSERT INTO kotoba (lesson_id, kata_jepang, romaji, arti_indonesia, contoh_kalimat) VALUES
  (1, 'わたし', 'watashi', 'saya', 'わたしは学生です。'),
  (1, 'あなた', 'anata', 'kamu', 'あなたは先生ですか。'),
  (1, 'せんせい', 'sensei', 'guru', 'せんせいは日本語の先生です。'),
  (1, 'がくせい', 'gakusei', 'mahasiswa', 'わたしはがくせいです。'),
  (1, 'かいしゃいん', 'kaishain', 'karyawan perusahaan', '父はかいしゃいんです。'),
  (1, 'にほんじん', 'nihonjin', 'orang Jepang', 'わたしはにほんじんではありません。'),
  (1, 'がいこくじん', 'gaikokujin', 'orang asing', 'あなたはがいこくじんですか。');

-- ============================================================
-- SEED DATA: Lesson 1 Grammar (Bunpou)
-- ============================================================
INSERT INTO bunpou (lesson_id, pola_grammar, penjelasan, contoh) VALUES
  (1, 'N1 は N2 です', 'Pola untuk menyatakan bahwa N1 adalah N2.', 'わたしは学生です。'),
  (1, 'N1 は N2 ではありません', 'Bentuk negatif dari ~です, menyatakan N1 bukan N2.', 'わたしは日本人ではありません。'),
  (1, 'N1 は N2 ですか', 'Bentuk pertanyaan, menanyakan apakah N1 adalah N2.', 'あなたは先生ですか。'),
  (1, 'N1 の N2', 'Partikel の menunjukkan kepemilikan atau hubungan.', 'わたしは大学の学生です。');

-- ============================================================
-- SEED DATA: Quiz Questions Lesson 1
-- ============================================================
INSERT INTO quiz_questions (lesson_id, jenis_soal, soal, pilihan_jawaban, jawaban_benar) VALUES
  (1, 'tebak_partikel', 'わたし___学生です。', '["は", "が", "を", "に"]', 'は'),
  (1, 'terjemahkan', 'Terjemahkan: "Saya adalah guru."', '["わたしは先生です。", "わたしは学生です。", "あなたは先生です。", "あなたは学生です。"]', 'わたしは先生です。'),
  (1, 'isi_kalimat', '___は学生ですか。', '["あなた", "わたし", "先生", "がくせい"]', 'あなた'),
  (1, 'susun_kalimat', 'Susun: です / 学生 / わたし / は', NULL, 'わたしは学生です');
