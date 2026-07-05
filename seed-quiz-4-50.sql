-- ============================================================
-- SEED DATA: Quiz Questions for Lessons 4-50
-- Run this in Supabase SQL Editor: 
-- https://jhdrycdmifoctudnxvcz.supabase.co/project/jhdrycdmifoctudnxvcz/sql
-- ============================================================
-- All 6 quiz types: tebak_partikel, susun_kalimat, isi_kalimat,
-- terjemahkan, pasangkan, kuis_bergambar
-- ============================================================

-- Lesson 4: そちらは何ですか (Sochira wa nan desu ka)
INSERT INTO quiz_questions (lesson_id, jenis_soal, soal, pilihan_jawaban, jawaban_benar) VALUES
  (4, 'tebak_partikel', 'それ___何ですか。', '["は", "が", "を", "に"]', 'は'),
  (4, 'terjemahkan', 'Terjemahkan: "Apa itu?"', '["それは何ですか。", "これは何ですか。", "あれは何ですか。", "それは何ですか。"]', 'それは何ですか。'),
  (4, 'isi_kalimat', '___はペンですか。', '["それ", "これ", "あれ", "どの"]', 'それ'),
  (4, 'susun_kalimat', 'Susun: 何 / です / それ / か', NULL, 'それは何ですか')
ON CONFLICT DO NOTHING;

-- Lesson 5: ここにあります (Koko ni arimasu)
INSERT INTO quiz_questions (lesson_id, jenis_soal, soal, pilihan_jawaban, jawaban_benar) VALUES
  (5, 'tebak_partikel', '本___机の上___あります。', '["は・に", "が・で", "を・に", "の・へ"]', 'は・に'),
  (5, 'terjemahkan', 'Terjemahkan: "Ada di atas meja."', '["机の上にあります。", "机の下にあります。", "机の隣にあります。", "机の前にあります。"]', '机の上にあります。'),
  (5, 'isi_kalimat', 'かばん___どこ___ありますか。', '["は・に", "が・で", "を・に", "の・へ"]', 'は・に'),
  (5, 'kuis_bergambar', 'Lihat gambar: 📚 di atas meja. Pilih kalimat yang benar.', '["本は机の上にあります。", "本は机の下にあります。", "本は椅子にあります。", "本は床にあります。"]', '本は机の上にあります。')
ON CONFLICT DO NOTHING;

-- Lesson 6: いっしょに行きませんか (Issho ni ikimasen ka)
INSERT INTO quiz_questions (lesson_id, jenis_soal, soal, pilihan_jawaban, jawaban_benar) VALUES
  (6, 'tebak_partikel', '映画___行きませんか。', '["に", "を", "で", "へ"]', 'に'),
  (6, 'terjemahkan', 'Terjemahkan: "Maukah kamu pergi bersamaku?"', '["いっしょに行きませんか。", "いっしょに行きます。", "いっしょに行きましょう。", "いっしょに行ってください。"]', 'いっしょに行きませんか。'),
  (6, 'isi_kalimat', '___に行きませんか。', '["映画", "本", "机", "ペン"]', '映画'),
  (6, 'susun_kalimat', 'Susun: 映画 / 行きませんか / へ', NULL, '映画へ行きませんか')
ON CONFLICT DO NOTHING;

-- Lesson 7: 何を勉強しますか (Nani o benkyou shimasu ka)
INSERT INTO quiz_questions (lesson_id, jenis_soal, soal, pilihan_jawaban, jawaban_benar) VALUES
  (7, 'tebak_partikel', '日本語___勉強します。', '["を", "が", "に", "で"]', 'を'),
  (7, 'terjemahkan', 'Terjemahkan: "Apa yang akan kamu pelajari?"', '["何を勉強しますか。", "どこで勉強しますか。", "いつ勉強しますか。", "だれと勉強しますか。"]', '何を勉強しますか。'),
  (7, 'isi_kalimat', '___を勉強します。', '["日本語", "机", "本", "ペン"]', '日本語'),
  (7, 'pasangkan', 'Pasangkan: 勉強 / belajar, 日本語 / bahasa Jepang, 英語 / bahasa Inggris', NULL, '勉強-benar')
ON CONFLICT DO NOTHING;

-- Lesson 8: もう一度お願いします (Mou ichido onegai shimasu)
INSERT INTO quiz_questions (lesson_id, jenis_soal, soal, pilihan_jawaban, jawaban_benar) VALUES
  (8, 'tebak_partikel', 'もう___度お願いします。', '["一", "二", "三", "四"]', '一'),
  (8, 'terjemahkan', 'Terjemahkan: "Tolong sekali lagi."', '["もう一度お願いします。", "お願いします。", "どうもありがとうございます。", "すみません。"]', 'もう一度お願いします。'),
  (8, 'isi_kalimat', '___お願いします。', '["もう一度", "一度も", "いつも", "とても"]', 'もう一度'),
  (8, 'susun_kalimat', 'Susun: お願いします / もう / 一度', NULL, 'もう一度お願いします')
ON CONFLICT DO NOTHING;

-- Lesson 9: 少し分かります (Sukoshi wakarimasu)
INSERT INTO quiz_questions (lesson_id, jenis_soal, soal, pilihan_jawaban, jawaban_benar) VALUES
  (9, 'tebak_partikel', '日本語___少し分かります。', '["が", "を", "に", "で"]', 'が'),
  (9, 'terjemahkan', 'Terjemahkan: "Saya mengerti sedikit."', '["少し分かります。", "よく分かります。", "全然分かりません。", "たくさん分かります。"]', '少し分かります。'),
  (9, 'isi_kalimat', '___分かります。', '["少し", "机", "本", "ペン"]', '少し'),
  (9, 'kuis_bergambar', 'Lihat gambar: 🧠💡. Pilih kalimat yang benar.', '["少し分かります。", "全然分かりません。", "よく分かります。", "分かりました。"]', '少し分かります。')
ON CONFLICT DO NOTHING;

-- Lesson 10: あそこにあります (Asoko ni arimasu)
INSERT INTO quiz_questions (lesson_id, jenis_soal, soal, pilihan_jawaban, jawaban_benar) VALUES
  (10, 'tebak_partikel', 'トイレ___あそこにあります。', '["は", "が", "を", "に"]', 'は'),
  (10, 'terjemahkan', 'Terjemahkan: "Ada di sana."', '["あそこにあります。", "そこにあります。", "ここにあります。", "どこにあります。"]', 'あそこにあります。'),
  (10, 'isi_kalimat', '___にあります。', '["あそこ", "なん", "だれ", "いつ"]', 'あそこ'),
  (10, 'susun_kalimat', 'Susun: あそこ / あります / に', NULL, 'あそこにあります')
ON CONFLICT DO NOTHING;

-- Lesson 11: いくらですか (Ikura desu ka)
INSERT INTO quiz_questions (lesson_id, jenis_soal, soal, pilihan_jawaban, jawaban_benar) VALUES
  (11, 'tebak_partikel', 'これ___いくらですか。', '["は", "が", "を", "に"]', 'は'),
  (11, 'terjemahkan', 'Terjemahkan: "Berapa harganya?"', '["いくらですか。", "何ですか。", "どこですか。", "いつですか。"]', 'いくらですか。'),
  (11, 'isi_kalimat', '___円です。', '["千", "机", "本", "ペン"]', '千'),
  (11, 'pasangkan', 'Pasangkan: 千 / 1000, 百 / 100, 万 / 10000', NULL, '千-benar')
ON CONFLICT DO NOTHING;

-- Lesson 12: 私の町はにぎやかです (Watashi no machi wa nigiyaka desu)
INSERT INTO quiz_questions (lesson_id, jenis_soal, soal, pilihan_jawaban, jawaban_benar) VALUES
  (12, 'tebak_partikel', '町___にぎやかです。', '["は", "が", "を", "に"]', 'は'),
  (12, 'terjemahkan', 'Terjemahkan: "Kota saya ramai."', '["私の町はにぎやかです。", "私の町は静かです。", "私の町は大きいです。", "私の町は小さいです。"]', '私の町はにぎやかです。'),
  (12, 'isi_kalimat', '___はにぎやかです。', '["町", "机", "本", "ペン"]', '町'),
  (12, 'susun_kalimat', 'Susun: にぎやか / 町 / です / の / 私', NULL, '私の町はにぎやかです')
ON CONFLICT DO NOTHING;

-- Lesson 13: もう予約しましたか (Mou yoyaku shimashita ka)
INSERT INTO quiz_questions (lesson_id, jenis_soal, soal, pilihan_jawaban, jawaban_benar) VALUES
  (13, 'tebak_partikel', '___予約しましたか。', '["もう", "まだ", "いつも", "とても"]', 'もう'),
  (13, 'terjemahkan', 'Terjemahkan: "Sudah reservasi?"', '["もう予約しましたか。", "予約していませんか。", "予約しませんか。", "予約しましょうか。"]', 'もう予約しましたか。'),
  (13, 'isi_kalimat', '___しましたか。', '["予約", "机", "本", "ペン"]', '予約'),
  (13, 'kuis_bergambar', 'Lihat gambar: 📞🍽️. Pilih kalimat yang benar.', '["もう予約しましたか。", "何を勉強しますか。", "どこに行きますか。", "いつ来ますか。"]', 'もう予約しましたか。')
ON CONFLICT DO NOTHING;

-- Lesson 14: 電車で行きます (Densha de ikimasu)
INSERT INTO quiz_questions (lesson_id, jenis_soal, soal, pilihan_jawaban, jawaban_benar) VALUES
  (14, 'tebak_partikel', '電車___行きます。', '["で", "を", "に", "が"]', 'で'),
  (14, 'terjemahkan', 'Terjemahkan: "Pergi naik kereta."', '["電車で行きます。", "バスで行きます。", "車で来ます。", "歩いて行きます。"]', '電車で行きます。'),
  (14, 'isi_kalimat', '___で行きます。', '["電車", "机", "本", "ペン"]', '電車'),
  (14, 'susun_kalimat', 'Susun: 電車 / 行きます / で', NULL, '電車で行きます')
ON CONFLICT DO NOTHING;

-- Lesson 15: どうぞよろしく (Douzo yoroshiku)
INSERT INTO quiz_questions (lesson_id, jenis_soal, soal, pilihan_jawaban, jawaban_benar) VALUES
  (15, 'tebak_partikel', '___よろしく。', '["どうぞ", "どうも", "とても", "本当に"]', 'どうぞ'),
  (15, 'terjemahkan', 'Terjemahkan: "Senang bertemu denganmu."', '["どうぞよろしく。", "こんにちは。", "さようなら。", "ありがとうございます。"]', 'どうぞよろしく。'),
  (15, 'isi_kalimat', 'どうぞ___。', '["よろしく", "机", "本", "ペン"]', 'よろしく'),
  (15, 'pasangkan', 'Pasangkan: どうぞよろしく / senang bertemu, こんにちは / halo, さようなら / selamat tinggal', NULL, 'どうぞよろしく-benar')
ON CONFLICT DO NOTHING;

-- Lesson 16: 使い方を教えてください (Tsukaikata o oshiete kudasai)
INSERT INTO quiz_questions (lesson_id, jenis_soal, soal, pilihan_jawaban, jawaban_benar) VALUES
  (16, 'tebak_partikel', '使い___を教えてください。', '["方", "物", "所", "時"]', '方'),
  (16, 'terjemahkan', 'Terjemahkan: "Tolong ajari cara pakainya."', '["使い方を教えてください。", "見せてください。", "教えてください。", "手伝ってください。"]', '使い方を教えてください。'),
  (16, 'isi_kalimat', '___方を教えてください。', '["使い", "机", "本", "ペン"]', '使い'),
  (16, 'susun_kalimat', 'Susun: ください / 使い / 教え / 方 / て', NULL, '使い方を教えてください')
ON CONFLICT DO NOTHING;

-- Lesson 17: どうしましたか (Dou shimashita ka)
INSERT INTO quiz_questions (lesson_id, jenis_soal, soal, pilihan_jawaban, jawaban_benar) VALUES
  (17, 'tebak_partikel', '___しましたか。', '["どう", "なん", "どこ", "だれ"]', 'どう'),
  (17, 'terjemahkan', 'Terjemahkan: "Ada apa?"', '["どうしましたか。", "何ですか。", "どこですか。", "いつですか。"]', 'どうしましたか。'),
  (17, 'isi_kalimat', '___しましたか。', '["どう", "机", "本", "ペン"]', 'どう'),
  (17, 'kuis_bergambar', 'Lihat gambar: 😟. Pilih kalimat yang benar.', '["どうしましたか。", "こんにちは。", "ありがとうございます。", "さようなら。"]', 'どうしましたか。')
ON CONFLICT DO NOTHING;

-- Lesson 18: 趣味は何ですか (Shumi wa nan desu ka)
INSERT INTO quiz_questions (lesson_id, jenis_soal, soal, pilihan_jawaban, jawaban_benar) VALUES
  (18, 'tebak_partikel', '趣味___何ですか。', '["は", "が", "を", "に"]', 'は'),
  (18, 'terjemahkan', 'Terjemahkan: "Apa hobimu?"', '["趣味は何ですか。", "名前は何ですか。", "仕事は何ですか。", "国はどこですか。"]', '趣味は何ですか。'),
  (18, 'isi_kalimat', '趣味___読書です。', '["は", "が", "を", "に"]', 'は'),
  (18, 'susun_kalimat', 'Susun: 何 / 趣味 / です / か', NULL, '趣味は何ですか')
ON CONFLICT DO NOTHING;

-- Lesson 19: 体に気をつけてください (Karada ni ki o tsukete kudasai)
INSERT INTO quiz_questions (lesson_id, jenis_soal, soal, pilihan_jawaban, jawaban_benar) VALUES
  (19, 'tebak_partikel', '体___気をつけてください。', '["に", "を", "が", "で"]', 'に'),
  (19, 'terjemahkan', 'Terjemahkan: "Jaga kesehatanmu."', '["体に気をつけてください。", "頑張ってください。", "気をつけてください。", "大丈夫です。"]', '体に気をつけてください。'),
  (19, 'isi_kalimat', '___に気をつけてください。', '["体", "机", "本", "ペン"]', '体'),
  (19, 'pasangkan', 'Pasangkan: 体 / tubuh, 気 / perhatian, つける / memperhatikan', NULL, '体-benar')
ON CONFLICT DO NOTHING;

-- Lesson 20: 夏休みはどうですか (Natsuyasumi wa dou desu ka)
INSERT INTO quiz_questions (lesson_id, jenis_soal, soal, pilihan_jawaban, jawaban_benar) VALUES
  (20, 'tebak_partikel', '夏休み___どうですか。', '["は", "が", "を", "に"]', 'は'),
  (20, 'terjemahkan', 'Terjemahkan: "Bagaimana liburan musim panasmu?"', '["夏休みはどうですか。", "冬休みはどうですか。", "週末はどうですか。", "休日はどうですか。"]', '夏休みはどうですか。'),
  (20, 'isi_kalimat', '___休みはどうですか。', '["夏", "机", "本", "ペン"]', '夏'),
  (20, 'susun_kalimat', 'Susun: どう / 夏休み / です / か', NULL, '夏休みはどうですか')
ON CONFLICT DO NOTHING;

-- Lesson 21: 何と言いましたか (Nan to iimashita ka)
INSERT INTO quiz_questions (lesson_id, jenis_soal, soal, pilihan_jawaban, jawaban_benar) VALUES
  (21, 'tebak_partikel', '何___言いましたか。', '["と", "を", "が", "に"]', 'と'),
  (21, 'terjemahkan', 'Terjemahkan: "Dia berkata apa?"', '["何と言いましたか。", "何を食べましたか。", "何を見ましたか。", "何をしましたか。"]', '何と言いましたか。'),
  (21, 'isi_kalimat', '___と言いましたか。', '["何", "机", "本", "ペン"]', '何'),
  (21, 'kuis_bergambar', 'Lihat gambar: 💬❓. Pilih kalimat yang benar.', '["何と言いましたか。", "何を食べましたか。", "どこに行きましたか。", "いつ来ましたか。"]', '何と言いましたか。')
ON CONFLICT DO NOTHING;

-- Lesson 22: これは便利ですね (Kore wa benri desu ne)
INSERT INTO quiz_questions (lesson_id, jenis_soal, soal, pilihan_jawaban, jawaban_benar) VALUES
  (22, 'tebak_partikel', 'これ___便利ですね。', '["は", "が", "を", "に"]', 'は'),
  (22, 'terjemahkan', 'Terjemahkan: "Ini praktis ya."', '["これは便利ですね。", "これは高いですね。", "これは安いですね。", "これは大きいですね。"]', 'これは便利ですね。'),
  (22, 'isi_kalimat', '___は便利ですね。', '["これ", "机", "本", "ペン"]', 'これ'),
  (22, 'susun_kalimat', 'Susun: 便利 / これ / ね / です', NULL, 'これは便利ですね')
ON CONFLICT DO NOTHING;

-- Lesson 23: 約束を忘れないでください (Yakusoku o wasurenaide kudasai)
INSERT INTO quiz_questions (lesson_id, jenis_soal, soal, pilihan_jawaban, jawaban_benar) VALUES
  (23, 'tebak_partikel', '約束___忘れないでください。', '["を", "が", "に", "で"]', 'を'),
  (23, 'terjemahkan', 'Terjemahkan: "Jangan lupa janji."', '["約束を忘れないでください。", "約束を忘れました。", "約束を覚えています。", "約束をしました。"]', '約束を忘れないでください。'),
  (23, 'isi_kalimat', '___を忘れないでください。', '["約束", "机", "本", "ペン"]', '約束'),
  (23, 'pasangkan', 'Pasangkan: 約束 / janji, 忘れる / lupa, 覚える / ingat', NULL, '約束-benar')
ON CONFLICT DO NOTHING;

-- Lesson 24: 手伝ってくれますか (Tetsudatte kuremasu ka)
INSERT INTO quiz_questions (lesson_id, jenis_soal, soal, pilihan_jawaban, jawaban_benar) VALUES
  (24, 'tebak_partikel', '手伝___くれますか。', '["って", "を", "が", "に"]', 'って'),
  (24, 'terjemahkan', 'Terjemahkan: "Bisakah kamu membantuku?"', '["手伝ってくれますか。", "手伝いますか。", "手伝ってください。", "手伝いましょうか。"]', '手伝ってくれますか。'),
  (24, 'isi_kalimat', '___ってくれますか。', '["手伝", "机", "本", "ペン"]', '手伝'),
  (24, 'susun_kalimat', 'Susun: くれます / 手伝って / か', NULL, '手伝ってくれますか')
ON CONFLICT DO NOTHING;

-- Lesson 25: どうやって行きますか (Dou yatte ikimasu ka)
INSERT INTO quiz_questions (lesson_id, jenis_soal, soal, pilihan_jawaban, jawaban_benar) VALUES
  (25, 'tebak_partikel', '___やって行きますか。', '["どう", "なん", "どこ", "だれ"]', 'どう'),
  (25, 'terjemahkan', 'Terjemahkan: "Bagaimana cara perginya?"', '["どうやって行きますか。", "どこに行って行きますか。", "いつ行きますか。", "だれと行きますか。"]', 'どうやって行きますか。'),
  (25, 'isi_kalimat', '___やって行きますか。', '["どう", "机", "本", "ペン"]', 'どう'),
  (25, 'kuis_bergambar', 'Lihat gambar: 🚶‍♂️❓🗺️. Pilih kalimat yang benar.', '["どうやって行きますか。", "何を食べますか。", "どこに行きますか。", "いつ来ますか。"]', 'どうやって行きますか。')
ON CONFLICT DO NOTHING;

-- Lesson 26: お久しぶりです (Ohisashiburi desu)
INSERT INTO quiz_questions (lesson_id, jenis_soal, soal, pilihan_jawaban, jawaban_benar) VALUES
  (26, 'tebak_partikel', 'お久しぶり___。', '["です", "だ", "である", "でした"]', 'です'),
  (26, 'terjemahkan', 'Terjemahkan: "Sudah lama tidak bertemu."', '["お久しぶりです。", "はじめまして。", "よろしくお願いします。", "お元気で。"]', 'お久しぶりです。'),
  (26, 'isi_kalimat', 'お___ぶりです。', '["久しぶ", "机", "本", "ペン"]', '久しぶ'),
  (26, 'susun_kalimat', 'Susun: です / お久しぶり', NULL, 'お久しぶりです')
ON CONFLICT DO NOTHING;

-- Lesson 27: 伺ってもいいですか (Ukagatte mo ii desu ka)
INSERT INTO quiz_questions (lesson_id, jenis_soal, soal, pilihan_jawaban, jawaban_benar) VALUES
  (27, 'tebak_partikel', '伺___もいいですか。', '["っ", "い", "く", "き"]', 'っ'),
  (27, 'terjemahkan', 'Terjemahkan: "Bolehkah saya bertanya?"', '["伺ってもいいですか。", "聞いてもいいですか。", "言ってもいいですか。", "見てもいいですか。"]', '伺ってもいいですか。'),
  (27, 'isi_kalimat', '___てもいいですか。', '["伺", "机", "本", "ペン"]', '伺'),
  (27, 'pasangkan', 'Pasangkan: 伺う / bertanya (sopan), 聞く / mendengar, 言う / berkata', NULL, '伺う-benar')
ON CONFLICT DO NOTHING;

-- Lesson 28: 日本語を教えてくれませんか (Nihongo o oshiete kuremasen ka)
INSERT INTO quiz_questions (lesson_id, jenis_soal, soal, pilihan_jawaban, jawaban_benar) VALUES
  (28, 'tebak_partikel', '日本語___教えてくれませんか。', '["を", "が", "に", "で"]', 'を'),
  (28, 'terjemahkan', 'Terjemahkan: "Bisakah Anda mengajariku bahasa Jepang?"', '["日本語を教えてくれませんか。", "日本語を勉強します。", "日本語が分かります。", "日本語を話します。"]', '日本語を教えてくれませんか。'),
  (28, 'isi_kalimat', '___を教えてくれませんか。', '["日本語", "机", "本", "ペン"]', '日本語'),
  (28, 'susun_kalimat', 'Susun: ください / 教え / 日本語 / て / くれませんか', NULL, '日本語を教えてくれませんか')
ON CONFLICT DO NOTHING;

-- Lesson 29: 駅まで迎えに行きます (Eki made mukae ni ikimasu)
INSERT INTO quiz_questions (lesson_id, jenis_soal, soal, pilihan_jawaban, jawaban_benar) VALUES
  (29, 'tebak_partikel', '駅___迎えに行きます。', '["まで", "を", "が", "に"]', 'まで'),
  (29, 'terjemahkan', 'Terjemahkan: "Saya akan menjemput sampai stasiun."', '["駅まで迎えに行きます。", "駅に行きます。", "駅で待ちます。", "駅から来ます。"]', '駅まで迎えに行きます。'),
  (29, 'isi_kalimat', '___まで迎えに行きます。', '["駅", "机", "本", "ペン"]', '駅'),
  (29, 'kuis_bergambar', 'Lihat gambar: 🚉👋. Pilih kalimat yang benar.', '["駅まで迎えに行きます。", "駅に行きます。", "駅で食べます。", "駅から帰ります。"]', '駅まで迎えに行きます。')
ON CONFLICT DO NOTHING;

-- Lesson 30: 忘れ物をしました (Wasuremono o shimashita)
INSERT INTO quiz_questions (lesson_id, jenis_soal, soal, pilihan_jawaban, jawaban_benar) VALUES
  (30, 'tebak_partikel', '忘れ___をしました。', '["物", "方", "所", "時"]', '物'),
  (30, 'terjemahkan', 'Terjemahkan: "Saya lupa barang."', '["忘れ物をしました。", "忘れました。", "覚えています。", "持っています。"]', '忘れ物をしました。'),
  (30, 'isi_kalimat', '忘れ___をしました。', '["物", "机", "本", "ペン"]', '物'),
  (30, 'susun_kalimat', 'Susun: 忘れ / しました / 物 / を', NULL, '忘れ物をしました')
ON CONFLICT DO NOTHING;

-- Lesson 31: これは便利なアプリです (Kore wa benri na apuri desu)
INSERT INTO quiz_questions (lesson_id, jenis_soal, soal, pilihan_jawaban, jawaban_benar) VALUES
  (31, 'tebak_partikel', 'これ___便利なアプリです。', '["は", "が", "を", "に"]', 'は'),
  (31, 'terjemahkan', 'Terjemahkan: "Ini aplikasi yang praktis."', '["これは便利なアプリです。", "これは便利な本です。", "これは便利でした。", "これは便利ではありません。"]', 'これは便利なアプリです。'),
  (31, 'isi_kalimat', '___は便利なアプリです。', '["これ", "机", "本", "ペン"]', 'これ'),
  (31, 'pasangkan', 'Pasangkan: アプリ / aplikasi, 便利 / praktis, 使う / menggunakan', NULL, 'アプリ-benar')
ON CONFLICT DO NOTHING;

-- Lesson 32: 今住んでいるところはどこですか (Ima sunde iru tokoro wa doko desu ka)
INSERT INTO quiz_questions (lesson_id, jenis_soal, soal, pilihan_jawaban, jawaban_benar) VALUES
  (32, 'tebak_partikel', '今住___いるところはどこですか。', '["ん", "ま", "み", "む"]', 'ん'),
  (32, 'terjemahkan', 'Terjemahkan: "Di mana kamu tinggal sekarang?"', '["今住んでいるところはどこですか。", "どこに住んでいますか。", "どこに行きますか。", "どこから来ましたか。"]', '今住んでいるところはどこですか。'),
  (32, 'isi_kalimat', '今住___いるところ', '["ん", "ま", "み", "む"]', 'ん'),
  (32, 'susun_kalimat', 'Susun: ところ / 今 / どこ / 住んでいる / は', NULL, '今住んでいるところはどこですか')
ON CONFLICT DO NOTHING;

-- Lesson 33: 道に迷いました (Michi ni mayoimashita)
INSERT INTO quiz_questions (lesson_id, jenis_soal, soal, pilihan_jawaban, jawaban_benar) VALUES
  (33, 'tebak_partikel', '道___迷いました。', '["に", "を", "が", "で"]', 'に'),
  (33, 'terjemahkan', 'Terjemahkan: "Saya tersesat."', '["道に迷いました。", "道を歩きました。", "道を行きました。", "道が分かりました。"]', '道に迷いました。'),
  (33, 'isi_kalimat', '___に迷いました。', '["道", "机", "本", "ペン"]', '道'),
  (33, 'kuis_bergambar', 'Lihat gambar: 🗺️❓😰. Pilih kalimat yang benar.', '["道に迷いました。", "道が分かりました。", "家に帰りました。", "駅に着きました。"]', '道に迷いました。')
ON CONFLICT DO NOTHING;

-- Lesson 34: 病院に行ったほうがいいです (Byouin ni itta hou ga ii desu)
INSERT INTO quiz_questions (lesson_id, jenis_soal, soal, pilihan_jawaban, jawaban_benar) VALUES
  (34, 'tebak_partikel', '病院___行ったほうがいいです。', '["に", "を", "が", "で"]', 'に'),
  (34, 'terjemahkan', 'Terjemahkan: "Lebih baik pergi ke rumah sakit."', '["病院に行ったほうがいいです。", "病院に行きます。", "病院に行きました。", "病院に行きましょう。"]', '病院に行ったほうがいいです。'),
  (34, 'isi_kalimat', '___に行ったほうがいいです。', '["病院", "机", "本", "ペン"]', '病院'),
  (34, 'susun_kalimat', 'Susun: 病院 / 行った / ほうがいい / に / です', NULL, '病院に行ったほうがいいです')
ON CONFLICT DO NOTHING;

-- Lesson 35: 予約をしてもいいですか (Yoyaku o shite mo ii desu ka)
INSERT INTO quiz_questions (lesson_id, jenis_soal, soal, pilihan_jawaban, jawaban_benar) VALUES
  (35, 'tebak_partikel', '予約___してもいいですか。', '["を", "が", "に", "で"]', 'を'),
  (35, 'terjemahkan', 'Terjemahkan: "Bolehkah saya membuat reservasi?"', '["予約をしてもいいですか。", "予約をしました。", "予約をします。", "予約をしてください。"]', '予約をしてもいいですか。'),
  (35, 'isi_kalimat', '___をしてもいいですか。', '["予約", "机", "本", "ペン"]', '予約'),
  (35, 'pasangkan', 'Pasangkan: 予約 / reservasi, する / melakukan, いい / baik', NULL, '予約-benar')
ON CONFLICT DO NOTHING;

-- Lesson 36: 旅行の準備をしています (Ryokou no junbi o shite imasu)
INSERT INTO quiz_questions (lesson_id, jenis_soal, soal, pilihan_jawaban, jawaban_benar) VALUES
  (36, 'tebak_partikel', '旅行___準備をしています。', '["の", "を", "が", "に"]', 'の'),
  (36, 'terjemahkan', 'Terjemahkan: "Saya sedang mempersiapkan perjalanan."', '["旅行の準備をしています。", "旅行に行きます。", "旅行をしました。", "旅行を計画しています。"]', '旅行の準備をしています。'),
  (36, 'isi_kalimat', '旅行の___をしています。', '["準備", "机", "本", "ペン"]', '準備'),
  (36, 'susun_kalimat', 'Susun: 準備 / 旅行 / しています / の / を', NULL, '旅行の準備をしています')
ON CONFLICT DO NOTHING;

-- Lesson 37: 日本にいる間に (Nihon ni iru aida ni)
INSERT INTO quiz_questions (lesson_id, jenis_soal, soal, pilihan_jawaban, jawaban_benar) VALUES
  (37, 'tebak_partikel', '日本___いる間に。', '["に", "を", "が", "で"]', 'に'),
  (37, 'terjemahkan', 'Terjemahkan: "Selama di Jepang..."', '["日本にいる間に。", "日本に行きます。", "日本から来ました。", "日本が好きです。"]', '日本にいる間に。'),
  (37, 'isi_kalimat', '日本___いる間に。', '["に", "を", "が", "で"]', 'に'),
  (37, 'kuis_bergambar', 'Lihat gambar: 🗾⏰. Pilih kalimat yang benar.', '["日本にいる間に。", "日本に行きます。", "日本を食べます。", "日本を勉強します。"]', '日本にいる間に。')
ON CONFLICT DO NOTHING;

-- Lesson 38: アルバイトを探しています (Arubaito o sagashite imasu)
INSERT INTO quiz_questions (lesson_id, jenis_soal, soal, pilihan_jawaban, jawaban_benar) VALUES
  (38, 'tebak_partikel', 'アルバイト___探しています。', '["を", "が", "に", "で"]', 'を'),
  (38, 'terjemahkan', 'Terjemahkan: "Saya sedang mencari pekerjaan paruh waktu."', '["アルバイトを探しています。", "アルバイトをしています。", "アルバイトをしました。", "アルバイトをします。"]', 'アルバイトを探しています。'),
  (38, 'isi_kalimat', '___を探しています。', '["アルバイト", "机", "本", "ペン"]', 'アルバイト'),
  (38, 'susun_kalimat', 'Susun: アルバイト / 探しています / を', NULL, 'アルバイトを探しています')
ON CONFLICT DO NOTHING;

-- Lesson 39: インターネットで調べました (Inta-netto de shirabemashita)
INSERT INTO quiz_questions (lesson_id, jenis_soal, soal, pilihan_jawaban, jawaban_benar) VALUES
  (39, 'tebak_partikel', 'インターネット___調べました。', '["で", "を", "が", "に"]', 'で'),
  (39, 'terjemahkan', 'Terjemahkan: "Saya mencari di internet."', '["インターネットで調べました。", "インターネットを使います。", "インターネットを見ました。", "インターネットに行きました。"]', 'インターネットで調べました。'),
  (39, 'isi_kalimat', '___で調べました。', '["インターネット", "机", "本", "ペン"]', 'インターネット'),
  (39, 'pasangkan', 'Pasangkan: インターネット / internet, 調べる / mencari, 使う / menggunakan', NULL, 'インターネット-benar')
ON CONFLICT DO NOTHING;

-- Lesson 40: 新聞を読んでいます (Shinbun o yonde imasu)
INSERT INTO quiz_questions (lesson_id, jenis_soal, soal, pilihan_jawaban, jawaban_benar) VALUES
  (40, 'tebak_partikel', '新聞___読んでいます。', '["を", "が", "に", "で"]', 'を'),
  (40, 'terjemahkan', 'Terjemahkan: "Saya sedang membaca koran."', '["新聞を読んでいます。", "新聞を買いました。", "新聞を見ました。", "新聞を書きました。"]', '新聞を読んでいます。'),
  (40, 'isi_kalimat', '___を読んでいます。', '["新聞", "机", "本", "ペン"]', '新聞'),
  (40, 'susun_kalimat', 'Susun: 新聞 / 読んでいます / を', NULL, '新聞を読んでいます')
ON CONFLICT DO NOTHING;

-- Lesson 41: 意見を聞かせてください (Iken o kikasete kudasai)
INSERT INTO quiz_questions (lesson_id, jenis_soal, soal, pilihan_jawaban, jawaban_benar) VALUES
  (41, 'tebak_partikel', '意見___聞かせてください。', '["を", "が", "に", "で"]', 'を'),
  (41, 'terjemahkan', 'Terjemahkan: "Tolong berikan pendapatmu."', '["意見を聞かせてください。", "意見を言います。", "意見をします。", "意見があります。"]', '意見を聞かせてください。'),
  (41, 'isi_kalimat', '___を聞かせてください。', '["意見", "机", "本", "ペン"]', '意見'),
  (41, 'kuis_bergambar', 'Lihat gambar: 💬👂. Pilih kalimat yang benar.', '["意見を聞かせてください。", "意見があります。", "意見をします。", "意見を食べます。"]', '意見を聞かせてください。')
ON CONFLICT DO NOTHING;

-- Lesson 42: 天気予報を見ましたか (Tenki yohou o mimashita ka)
INSERT INTO quiz_questions (lesson_id, jenis_soal, soal, pilihan_jawaban, jawaban_benar) VALUES
  (42, 'tebak_partikel', '天気予報___見ましたか。', '["を", "が", "に", "で"]', 'を'),
  (42, 'terjemahkan', 'Terjemahkan: "Sudah lihat prakiraan cuaca?"', '["天気予報を見ましたか。", "天気予報を見ます。", "天気予報を見ません。", "天気予報を見ましょう。"]', '天気予報を見ましたか。'),
  (42, 'isi_kalimat', '___を見ましたか。', '["天気予報", "机", "本", "ペン"]', '天気予報'),
  (42, 'susun_kalimat', 'Susun: 天気予報 / 見ました / か / を', NULL, '天気予報を見ましたか')
ON CONFLICT DO NOTHING;

-- Lesson 43: お世話になりました (Osewa ni narimashita)
INSERT INTO quiz_questions (lesson_id, jenis_soal, soal, pilihan_jawaban, jawaban_benar) VALUES
  (43, 'tebak_partikel', 'お世話___なりました。', '["に", "を", "が", "で"]', 'に'),
  (43, 'terjemahkan', 'Terjemahkan: "Terima kasih atas bantuannya."', '["お世話になりました。", "お元気で。", "お久しぶりです。", "よろしくお願いします。"]', 'お世話になりました。'),
  (43, 'isi_kalimat', 'お世話___なりました。', '["に", "を", "が", "で"]', 'に'),
  (43, 'pasangkan', 'Pasangkan: お世話 / bantuan, なる / menjadi, ありがとう / terima kasih', NULL, 'お世話-benar')
ON CONFLICT DO NOTHING;

-- Lesson 44: これは私が作ったものです (Kore wa watashi ga tsukutta mono desu)
INSERT INTO quiz_questions (lesson_id, jenis_soal, soal, pilihan_jawaban, jawaban_benar) VALUES
  (44, 'tebak_partikel', 'これ___私が作ったものです。', '["は", "が", "を", "に"]', 'は'),
  (44, 'terjemahkan', 'Terjemahkan: "Ini adalah barang yang saya buat."', '["これは私が作ったものです。", "これは私が買いました。", "これは私が使います。", "これは私のです。"]', 'これは私が作ったものです。'),
  (44, 'isi_kalimat', '___は私が作ったものです。', '["これ", "机", "本", "ペン"]', 'これ'),
  (44, 'susun_kalimat', 'Susun: もの / 私 / 作った / です / が', NULL, 'これは私が作ったものです')
ON CONFLICT DO NOTHING;

-- Lesson 45: 日本語が上手になりましたね (Nihongo ga jouzu ni narimashita ne)
INSERT INTO quiz_questions (lesson_id, jenis_soal, soal, pilihan_jawaban, jawaban_benar) VALUES
  (45, 'tebak_partikel', '日本語___上手になりました。', '["が", "を", "に", "で"]', 'が'),
  (45, 'terjemahkan', 'Terjemahkan: "Bahasa Jepanmgmu sudah mahir ya."', '["日本語が上手になりましたね。", "日本語を勉強します。", "日本語が分かります。", "日本語を話します。"]', '日本語が上手になりましたね。'),
  (45, 'isi_kalimat', '___が上手になりました。', '["日本語", "机", "本", "ペン"]', '日本語'),
  (45, 'kuis_bergambar', 'Lihat gambar: 📈🇯🇵😊. Pilih kalimat yang benar.', '["日本語が上手になりましたね。", "日本語を勉強します。", "日本語を食べます。", "日本語に行きます。"]', '日本語が上手になりましたね。')
ON CONFLICT DO NOTHING;

-- Lesson 46: おかげさまで (Okagesama de)
INSERT INTO quiz_questions (lesson_id, jenis_soal, soal, pilihan_jawaban, jawaban_benar) VALUES
  (46, 'tebak_partikel', 'おかげさま___。', '["で", "を", "が", "に"]', 'で'),
  (46, 'terjemahkan', 'Terjemahkan: "Berkat Anda / Alhamdulillah."', '["おかげさまで。", "ありがとうございます。", "すみません。", "どうぞよろしく。"]', 'おかげさまで。'),
  (46, 'isi_kalimat', 'おかげ___。', '["さま", "机", "本", "ペン"]', 'さま'),
  (46, 'susun_kalimat', 'Susun: おかげさまで', NULL, 'おかげさまで')
ON CONFLICT DO NOTHING;

-- Lesson 47: 留学したいです (Ryuugaku shitai desu)
INSERT INTO quiz_questions (lesson_id, jenis_soal, soal, pilihan_jawaban, jawaban_benar) VALUES
  (47, 'tebak_partikel', '留学___したいです。', '["を", "が", "に", "で"]', 'を'),
  (47, 'terjemahkan', 'Terjemahkan: "Saya ingin belajar di luar negeri."', '["留学したいです。", "留学します。", "留学しました。", "留学しましょう。"]', '留学したいです。'),
  (47, 'isi_kalimat', '___したいです。', '["留学", "机", "本", "ペン"]', '留学'),
  (47, 'pasangkan', 'Pasangkan: 留学 / belajar di luar negeri, する / melakukan, たい / ingin', NULL, '留学-benar')
ON CONFLICT DO NOTHING;

-- Lesson 48: お元気で (Ogenki de)
INSERT INTO quiz_questions (lesson_id, jenis_soal, soal, pilihan_jawaban, jawaban_benar) VALUES
  (48, 'tebak_partikel', 'お元気___。', '["で", "を", "が", "に"]', 'で'),
  (48, 'terjemahkan', 'Terjemahkan: "Semoga sehat selalu."', '["お元気で。", "お元気ですか。", "お元気です。", "お大事に。"]', 'お元気で。'),
  (48, 'isi_kalimat', 'お___で。', '["元気", "机", "本", "ペン"]', '元気'),
  (48, 'susun_kalimat', 'Susun: お元気で', NULL, 'お元気で')
ON CONFLICT DO NOTHING;

-- Lesson 49: これからもよろしく (Korekara mo yoroshiku)
INSERT INTO quiz_questions (lesson_id, jenis_soal, soal, pilihan_jawaban, jawaban_benar) VALUES
  (49, 'tebak_partikel', 'これから___よろしく。', '["も", "を", "が", "に"]', 'も'),
  (49, 'terjemahkan', 'Terjemahkan: "Mulai sekarang juga mohon bantuannya."', '["これからもよろしく。", "どうぞよろしく。", "よろしくお願いします。", "お元気で。"]', 'これからもよろしく。'),
  (49, 'isi_kalimat', '___もよろしく。', '["これから", "机", "本", "ペン"]', 'これから'),
  (49, 'kuis_bergambar', 'Lihat gambar: 🤝➡️. Pilih kalimat yang benar.', '["これからもよろしく。", "さようなら。", "お元気で。", "ありがとうございました。"]', 'これからもよろしく。')
ON CONFLICT DO NOTHING;

-- Lesson 50: 勉強を続けます (Benkyou o tsuzukemasu)
INSERT INTO quiz_questions (lesson_id, jenis_soal, soal, pilihan_jawaban, jawaban_benar) VALUES
  (50, 'tebak_partikel', '勉強___続けます。', '["を", "が", "に", "で"]', 'を'),
  (50, 'terjemahkan', 'Terjemahkan: "Saya akan melanjutkan belajar."', '["勉強を続けます。", "勉強します。", "勉強しました。", "勉強しましょう。"]', '勉強を続けます。'),
  (50, 'isi_kalimat', '___を続けます。', '["勉強", "机", "本", "ペン"]', '勉強'),
  (50, 'susun_kalimat', 'Susun: 勉強 / 続けます / を', NULL, '勉強を続けます')
ON CONFLICT DO NOTHING;
