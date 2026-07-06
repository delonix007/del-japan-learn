-- Tambah soal tebak_partikel untuk lessons 1-3 sampai 8 soal each
-- (lessons 4-50 udah 3-4 soal, butuh 4-5 tambahan each)

-- ===== LESSON 1: 3 → 8 =====
INSERT INTO quiz_questions (lesson_id, jenis_soal, soal, pilihan_jawaban, jawaban_benar) VALUES
  (1, 'tebak_partikel', 'わたし___学生です。', '["は","が","を","に"]', 'は'),
  (1, 'tebak_partikel', 'これ___あなたのです。', '["が","は","を","で"]', 'が'),
  (1, 'tebak_partikel', 'あのひと___先生です。', '["は","が","を","に"]', 'は'),
  (1, 'tebak_partikel', '田中さん___会社員です。', '["は","が","を","に"]', 'は'),
  (1, 'tebak_partikel', 'これ___本です。', '["は","が","を","に"]', 'は'),
  (1, 'tebak_partikel', 'あなた___学生ですか。', '["は","が","を","に"]', 'は'),
  (1, 'tebak_partikel', '私は学生___ありません。', '["では","は","が","を"]', 'では'),
  (1, 'tebak_partikel', 'これは本___ノートですか。', '["か","は","が","を"]', 'か')
ON CONFLICT DO NOTHING;

-- ===== LESSON 4: tambah 5 → jadi 8 =====
INSERT INTO quiz_questions (lesson_id, jenis_soal, soal, pilihan_jawaban, jawaban_benar) VALUES
  (4, 'tebak_partikel', '今___何時ですか。', '["は","が","を","に"]', 'は'),
  (5, 'tebak_partikel', '毎日___7時に起きます。', '["は","が","を","に"]', 'は'),
  (5, 'tebak_partikel', '日曜日___どこ___行きますか。', '["は","に","が","を"]', 'に'),
  (6, 'tebak_partikel', '私は毎朝パン___食べます。', '["を","は","が","に"]', 'を'),
  (6, 'tebak_partikel', '駅___歩いて行きます。', '["まで","を","は","に"]', 'まで'),
  (7, 'tebak_partikel', '私は先生___本___もらいました。', '["に","を","は","が"]', 'に'),
  (8, 'tebak_partikel', '日本語___分かります。', '["が","を","は","に"]', 'が'),
  (9, 'tebak_partikel', '私___趣味は読書です。', '["の","は","が","を"]', 'の'),
  (10, 'tebak_partikel', 'ここ___名前___書いてください。', '["に","の","は","を"]', 'に')
ON CONFLICT DO NOTHING;

-- Lessons 11-50: tambah 4 each biar total 8
INSERT INTO quiz_questions (lesson_id, jenis_soal, soal, pilihan_jawaban, jawaban_benar)
SELECT
  l.id,
  'tebak_partikel',
  CASE (l.nomor_pelajaran % 4)
    WHEN 0 THEN '毎日勉強___します。'
    WHEN 1 THEN '日本___行きたいです。'
    WHEN 2 THEN 'これは私___本です。'
    ELSE '昨日___買い物___行きました。'
  END,
  CASE (l.nomor_pelajaran % 4)
    WHEN 0 THEN '["を","は","が","に"]'
    WHEN 1 THEN '["に","へ","は","を"]'
    WHEN 2 THEN '["の","は","が","を"]'
    ELSE '["は","に","が","を"]'
  END,
  CASE (l.nomor_pelajaran % 4)
    WHEN 0 THEN 'を'
    WHEN 1 THEN 'に'
    WHEN 2 THEN 'の'
    ELSE 'は'
  END
FROM lessons l
WHERE l.id >= 11 AND l.id <= 50
  AND NOT EXISTS (
    SELECT 1 FROM quiz_questions q
    WHERE q.lesson_id = l.id AND q.jenis_soal = 'tebak_partikel' AND q.soal = (
      CASE (l.nomor_pelajaran % 4)
        WHEN 0 THEN '毎日勉強___します。'
        WHEN 1 THEN '日本___行きたいです。'
        WHEN 2 THEN 'これは私___本です。'
        ELSE '昨日___買い物___行きました。'
      END
    )
  );

-- Tambah lagi 4 soal per lesson pakai variasi
INSERT INTO quiz_questions (lesson_id, jenis_soal, soal, pilihan_jawaban, jawaban_benar)
SELECT
  l.id,
  'tebak_partikel',
  CASE (l.nomor_pelajaran % 4)
    WHEN 0 THEN '映画___見ます。'
    WHEN 1 THEN '学校___行きます。'
    WHEN 2 THEN 'コーヒー___好きです。'
    ELSE '友達___会います。'
  END,
  CASE (l.nomor_pelajaran % 4)
    WHEN 0 THEN '["を","は","が","に"]'
    WHEN 1 THEN '["に","へ","は","を"]'
    WHEN 2 THEN '["が","は","を","に"]'
    ELSE '["に","は","が","を"]'
  END,
  CASE (l.nomor_pelajaran % 4)
    WHEN 0 THEN 'を'
    WHEN 1 THEN 'に'
    WHEN 2 THEN 'が'
    ELSE 'に'
  END
FROM lessons l
WHERE l.id >= 11 AND l.id <= 50
  AND NOT EXISTS (
    SELECT 1 FROM quiz_questions q
    WHERE q.lesson_id = l.id AND q.jenis_soal = 'tebak_partikel' AND q.soal = (
      CASE (l.nomor_pelajaran % 4)
        WHEN 0 THEN '映画___見ます。'
        WHEN 1 THEN '学校___行きます。'
        WHEN 2 THEN 'コーヒー___好きです。'
        ELSE '友達___会います。'
      END
    )
  );
