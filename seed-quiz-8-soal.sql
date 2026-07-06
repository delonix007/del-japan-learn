-- Bab 2: Kata Tunjuk (これ・それ・あれ・この・その・あの) + の (kepemilikan)
-- Hapus semua tebak_partikel lesson 2, insert 8 soal strict Bab 2

DELETE FROM quiz_questions WHERE lesson_id = 2 AND jenis_soal = 'tebak_partikel';

INSERT INTO quiz_questions (lesson_id, jenis_soal, soal, pilihan_jawaban, jawaban_benar) VALUES
  (2, 'tebak_partikel', 'これ___辞書ですか。', '["は","が","を","の"]', 'は'),
  (2, 'tebak_partikel', 'それは誰___辞書ですか。', '["の","は","が","を"]', 'の'),
  (2, 'tebak_partikel', 'あれ___本ですか。', '["は","が","を","に"]', 'は'),
  (2, 'tebak_partikel', 'これ___本___雑誌ですか。', '["か","は","の","を"]', 'か'),
  (2, 'tebak_partikel', 'これは私___本です。', '["の","は","が","を"]', 'の'),
  (2, 'tebak_partikel', 'この本___だれのですか。', '["は","の","が","か"]', 'は'),
  (2, 'tebak_partikel', 'これは先生___かばんです。', '["の","は","が","を"]', 'の'),
  (2, 'tebak_partikel', 'あれは何___本ですか。', '["の","は","が","か"]', 'の');
