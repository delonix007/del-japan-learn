-- Tambah soal tebak_partikel, susun_kalimat, pasangkan untuk lessons 1-3
-- (seed-data.sql awal cuma masukin 1 soal per tipe untuk lessons 1-3)

-- Lesson 1: tebak_partikel (tambah 3 soal lagi = total 4)
INSERT INTO quiz_questions (lesson_id, jenis_soal, soal, pilihan_jawaban, jawaban_benar) VALUES
  (1, 'tebak_partikel', 'わたし___学生です。', '["は", "が", "を", "に"]', 'は')
  ON CONFLICT DO NOTHING;
INSERT INTO quiz_questions (lesson_id, jenis_soal, soal, pilihan_jawaban, jawaban_benar) VALUES
  (1, 'tebak_partikel', 'これ___あなたのです。', '["が", "は", "を", "で"]', 'が')
  ON CONFLICT DO NOTHING;
INSERT INTO quiz_questions (lesson_id, jenis_soal, soal, pilihan_jawaban, jawaban_benar) VALUES
  (1, 'tebak_partikel', 'わたし___名前___田中さんです。', '["は", "の", "が", "を"]', '{"blank":"の"}')
  ON CONFLICT DO NOTHING;

-- Lesson 2: tebak_partikel (tambah 3 soal lagi)
INSERT INTO quiz_questions (lesson_id, jenis_soal, soal, pilihan_jawaban, jawaban_benar) VALUES
  (2, 'tebak_partikel', 'これ___なん___すか。', '["は", "で", "が", "を"]', '{"blank":"で"}')
  ON CONFLICT DO NOTHING;
INSERT INTO quiz_questions (lesson_id, jenis_soal, soal, pilihan_jawaban, jawaban_benar) VALUES
  (2, 'tebak_partikel', 'あなた___名前___なん___すか。', '["は", "の", "で", "が"]', '{"blank":"の"}')
  ON CONFLICT DO NOTHING;
INSERT INTO quiz_questions (lesson_id, jenis_soal, soal, pilihan_jawaban, jawaban_benar) VALUES
  (2, 'tebak_partikel', 'これ___なん___すか。', '["は", "で", "を", "に"]', '{"blank":"で"}')
  ON CONFLICT DO NOTHING;

-- Lesson 3: tebak_partikel (tambah 3 soal lagi)
INSERT INTO quiz_questions (lesson_id, jenis_soal, soal, pilihan_jawaban, jawaban_benar) VALUES
  (3, 'tebak_partikel', 'それ___あなた___かさ___すか。', '["は", "の", "が", "を"]', '{"blank":"の"}')
  ON CONFLICT DO NOTHING;
INSERT INTO quiz_questions (lesson_id, jenis_soal, soal, pilihan_jawaban, jawaban_benar) VALUES
  (3, 'tebak_partikel', 'これ___だれ___ほん___すか。', '["は", "の", "が", "を"]', '{"blank":"の"}')
  ON CONFLICT DO NOTHING;
INSERT INTO quiz_questions (lesson_id, jenis_soal, soal, pilihan_jawaban, jawaban_benar) VALUES
  (3, 'tebak_partikel', 'あれ___だれ___かさ___すか。', '["は", "の", "が", "を"]', '{"blank":"の"}')
  ON CONFLICT DO NOTHING;

-- Lesson 1: susun_kalimat (tambah 4 soal)
INSERT INTO quiz_questions (lesson_id, jenis_soal, soal, pilihan_jawaban, jawaban_benar) VALUES
  (1, 'susun_kalimat', 'Saya adalah mahasiswa', '["わたし", "は", "がくせい", "です"]', 'わたしはがくせいです')
  ON CONFLICT DO NOTHING;
INSERT INTO quiz_questions (lesson_id, jenis_soal, soal, pilihan_jawaban, jawaban_benar) VALUES
  (1, 'susun_kalimat', 'Siapa nama Anda?', '["あなた", "の", "なまえ", "は"]', 'あなたのなまえは')
  ON CONFLICT DO NOTHING;
INSERT INTO quiz_questions (lesson_id, jenis_soal, soal, pilihan_jawaban, jawaban_benar) VALUES
  (1, 'susun_kalimat', 'Ini adalah buku', '["これ", "は", "ほん", "です"]', 'これはほんです')
  ON CONFLICT DO NOTHING;
INSERT INTO quiz_questions (lesson_id, jenis_soal, soal, pilihan_jawaban, jawaban_benar) VALUES
  (1, 'susun_kalimat', 'Dia adalah guru', '["あのひと", "は", "せんせい", "です"]', 'あのひとはせんせいです')
  ON CONFLICT DO NOTHING;

-- Lesson 2: susun_kalimat (tambah 4 soal)
INSERT INTO quiz_questions (lesson_id, jenis_soal, soal, pilihan_jawaban, jawaban_benar) VALUES
  (2, 'susun_kalimat', 'Mulai sekarang mohon bantuannya', '["これから", "よろしく", "おねがいします", "します"]', 'これからよろしくおねがいします')
  ON CONFLICT DO NOTHING;
INSERT INTO quiz_questions (lesson_id, jenis_soal, soal, pilihan_jawaban, jawaban_benar) VALUES
  (2, 'susun_kalimat', 'Perkenalkan, saya Tanaka', '["はじめまして", "わたし", "は", "たなかです"]', 'はじめましてわたしはたなかです')
  ON CONFLICT DO NOTHING;
INSERT INTO quiz_questions (lesson_id, jenis_soal, soal, pilihan_jawaban, jawaban_benar) VALUES
  (2, 'susun_kalimat', 'Saya juga, mohon bantuannya', '["こちらこそ", "よろしく", "おねがいします", "します"]', 'こちらこそよろしくおねがいします')
  ON CONFLICT DO NOTHING;
INSERT INTO quiz_questions (lesson_id, jenis_soal, soal, pilihan_jawaban, jawaban_benar) VALUES
  (2, 'susun_kalimat', 'Mohon bantuan Anda mulai sekarang', '["これから", "おせわ", "になります", "よろしく"]', 'これからおせわになりますよろしく')
  ON CONFLICT DO NOTHING;

-- Lesson 3: susun_kalimat (tambah 4 soal)
INSERT INTO quiz_questions (lesson_id, jenis_soal, soal, pilihan_jawaban, jawaban_benar) VALUES
  (3, 'susun_kalimat', 'Ini adalah payung saya', '["これ", "は", "わたし", "のかさです"]', 'これはわたしのかさです')
  ON CONFLICT DO NOTHING;
INSERT INTO quiz_questions (lesson_id, jenis_soal, soal, pilihan_jawaban, jawaban_benar) VALUES
  (3, 'susun_kalimat', 'Itu (dekat) adalah buku siapa?', '["それ", "は", "だれ", "のほんですか"]', 'それはだれのほんですか')
  ON CONFLICT DO NOTHING;
INSERT INTO quiz_questions (lesson_id, jenis_soal, soal, pilihan_jawaban, jawaban_benar) VALUES
  (3, 'susun_kalimat', 'Itu (jauh) adalah tas siapa?', '["あれ", "は", "だれ", "のかばんですか"]', 'あれはだれのかばんですか')
  ON CONFLICT DO NOTHING;
INSERT INTO quiz_questions (lesson_id, jenis_soal, soal, pilihan_jawaban, jawaban_benar) VALUES
  (3, 'susun_kalimat', 'Mana kamus Anda?', '["どれ", "が", "あなた", "のじしょですか"]', 'どれがあなたのじしょですか')
  ON CONFLICT DO NOTHING;

-- Lesson 1: pasangkan (update soal existing ke format JSON yang bener)
UPDATE quiz_questions 
SET soal = '[{"left":"わたし","right":"saya"},{"left":"がくせい","right":"mahasiswa"},{"left":"せんせい","right":"guru"},{"left":"かいしゃいん","right":"karyawan"}]'
WHERE lesson_id = 1 AND jenis_soal = 'pasangkan' AND soal NOT LIKE '[%';

-- Lesson 2: pasangkan (update)
UPDATE quiz_questions 
SET soal = '[{"left":"はじめまして","right":"perkenalkan"},{"left":"よろしく","right":"mohon bantuan"},{"left":"これから","right":"mulai sekarang"},{"left":"おせわ","right":"bantuan"}]'
WHERE lesson_id = 2 AND jenis_soal = 'pasangkan' AND soal NOT LIKE '[%';

-- Lesson 3: pasangkan (update)
UPDATE quiz_questions 
SET soal = '[{"left":"これ","right":"ini"},{"left":"それ","right":"itu"},{"left":"あれ","right":"itu (jauh)"},{"left":"どれ","right":"yang mana"}]'
WHERE lesson_id = 3 AND jenis_soal = 'pasangkan' AND soal NOT LIKE '[%';
