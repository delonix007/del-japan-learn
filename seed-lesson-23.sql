-- Lesson 2: これからお世話になります (Yoroshiku onegaishimasu)
INSERT INTO kotoba (lesson_id, kata_jepang, romaji, arti_indonesia, contoh_kalimat) VALUES
  (2, 'これ', 'kore', 'ini (benda dekat)', 'これは本です。'),
  (2, 'それ', 'sore', 'itu (benda agak jauh)', 'それはペンですか。'),
  (2, 'あれ', 'are', 'itu (benda jauh)', 'あれは車です。'),
  (2, 'この', 'kono', 'ini ~ (diikuti benda)', 'この本は私のです。'),
  (2, 'その', 'sono', 'itu ~', 'そのかばんは先生のです。'),
  (2, 'あの', 'ano', 'itu ~ (jauh)', 'あの人は先生です。'),
  (2, 'ペン', 'pen', 'pen/pulpen', 'これはペンです。'),
  (2, '本', 'hon', 'buku', 'それは本です。'),
  (2, 'かばん', 'kaban', 'tas', 'あれはかばんです。'),
  (2, '机', 'tsukue', 'meja', 'この机は新しいです。')
ON CONFLICT DO NOTHING;

INSERT INTO bunpou (lesson_id, pola_grammar, penjelasan, contoh) VALUES
  (2, 'これ/それ/あれ は N です', 'Kata tunjuk benda: これ (dekat saya), それ (dekat kamu), あれ (jauh dari keduanya).', 'これは本です。それはペンです。あれは車です。'),
  (2, 'N1 の N2', 'Partikel の menghubungkan dua kata benda, menunjukkan kepemilikan.', '私の本 (buku saya)'),
  (2, 'この/その/あの N', 'Kata tunjuk yang langsung menerangkan kata benda berikutnya.', 'この本は面白いです。'),
  (2, 'そうです / ちがいます', 'Ya benar / Bukan.', 'ーそれは本ですか。ーはい、そうです。／いいえ、ちがいます。')
ON CONFLICT DO NOTHING;

INSERT INTO quiz_questions (lesson_id, jenis_soal, soal, pilihan_jawaban, jawaban_benar) VALUES
  (2, 'tebak_partikel', 'これ___本です。', '["は", "が", "を", "に"]', 'は'),
  (2, 'terjemahkan', 'Terjemahkan: "Ini pena."', '["これはペンです。", "それはペンです。", "あれはペンです。", "このペンです。"]', 'これはペンです。'),
  (2, 'isi_kalimat', '___は先生の本です。', '["その", "これ", "あれ", "この"]', 'その'),
  (2, 'pasangkan', 'Pasangkan: それ / buku', NULL, 'その本')
ON CONFLICT DO NOTHING;

-- Lesson 3: これをください (Kore o kudasai)
INSERT INTO kotoba (lesson_id, kata_jepang, romaji, arti_indonesia, contoh_kalimat) VALUES
  (3, 'これ', 'kore', 'ini', 'これをください。'),
  (3, 'いくら', 'ikura', 'berapa harga', 'これはいくらですか。'),
  (3, 'ください', 'kudasai', 'tolong berikan', '水をください。'),
  (3, 'お金', 'okane', 'uang', 'お金がありません。'),
  (3, '高い', 'takai', 'mahal/tinggi', 'この車は高いです。'),
  (3, '安い', 'yasui', 'murah', 'この本は安いです。'),
  (3, '店', 'mise', 'toko', 'この店は安いです。'),
  (3, 'レストラン', 'resutoran', 'restoran', 'あのレストランは高いです。'),
  (3, 'メニュー', 'menyuu', 'menu', 'メニューを見せてください。'),
  (3, 'お願いします', 'onegaishimasu', 'tolong / minta tolong', 'これをお願いします。')
ON CONFLICT DO NOTHING;

INSERT INTO bunpou (lesson_id, pola_grammar, penjelasan, contoh) VALUES
  (3, 'N を ください', 'Minta tolong diberikan sesuatu.', '水をください。'),
  (3, 'N は いくらですか', 'Menanyakan harga.', 'これはいくらですか。'),
  (3, 'い-adj です', 'Kata sifat-I: 高い (takai) → mahal, 安い (yasui) → murah.', 'この本は安いです。'),
  (3, 'N を 見せてください', 'Minta tolong diperlihatkan.', 'メニューを見せてください。')
ON CONFLICT DO NOTHING;

INSERT INTO quiz_questions (lesson_id, jenis_soal, soal, pilihan_jawaban, jawaban_benar) VALUES
  (3, 'tebak_partikel', '水___ください。', '["を", "は", "が", "に"]', 'を'),
  (3, 'terjemahkan', 'Terjemahkan: "Berapa harga ini?"', '["これはいくらですか。", "これは何ですか。", "これを見せてください。", "これをください。"]', 'これはいくらですか。'),
  (3, 'isi_kalimat', 'この本は___です。 (murah)', '["安い", "高い", "新しい", "古い"]', '安い'),
  (3, 'susun_kalimat', 'Susun: ください / を / 水', NULL, '水をください')
ON CONFLICT DO NOTHING;
