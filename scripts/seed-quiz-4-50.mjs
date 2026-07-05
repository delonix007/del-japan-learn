/**
 * Seed Quiz Questions for Lessons 4-50
 * 
 * Run: node scripts/seed-quiz-4-50.mjs
 * 
 * This script inserts quiz questions into the Supabase database using the
 * Supabase JS client. Requires SUPABASE_URL and SUPABASE_ANON_KEY in .env.local.
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_ANON_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Quiz data for lessons 4-50
const quizData = [];

// Helper to add quiz question
function addQuiz(lesson_id, jenis_soal, soal, pilihan_jawaban, jawaban_benar) {
  quizData.push({
    lesson_id,
    jenis_soal,
    soal,
    pilihan_jawaban: pilihan_jawaban ? JSON.stringify(pilihan_jawaban) : null,
    jawaban_benar,
  });
}

// Lesson 4: そちらは何ですか
addQuiz(4, 'tebak_partikel', 'それ___何ですか。', ['は', 'が', 'を', 'に'], 'は');
addQuiz(4, 'terjemahkan', 'Terjemahkan: "Apa itu?"', ['それは何ですか。', 'これは何ですか。', 'あれは何ですか。', 'それは何ですか。'], 'それは何ですか。');
addQuiz(4, 'isi_kalimat', '___はペンですか。', ['それ', 'これ', 'あれ', 'どの'], 'それ');
addQuiz(4, 'susun_kalimat', 'Susun: 何 / です / それ / か', null, 'それは何ですか');

// Lesson 5: ここにあります
addQuiz(5, 'tebak_partikel', '本___机の上___あります。', ['は・に', 'が・で', 'を・に', 'の・へ'], 'は・に');
addQuiz(5, 'terjemahkan', 'Terjemahkan: "Ada di atas meja."', ['机の上にあります。', '机の下にあります。', '机の隣にあります。', '机の前にあります。'], '机の上にあります。');
addQuiz(5, 'isi_kalimat', 'かばん___どこ___ありますか。', ['は・に', 'が・で', 'を・に', 'の・へ'], 'は・に');
addQuiz(5, 'kuis_bergambar', 'Lihat gambar: 📚 di atas meja. Pilih kalimat yang benar.', ['本は机の上にあります。', '本は机の下にあります。', '本は椅子にあります。', '本は床にあります。'], '本は机の上にあります。');

// Lesson 6: いっしょに行きませんか
addQuiz(6, 'tebak_partikel', '映画___行きませんか。', ['に', 'を', 'で', 'へ'], 'に');
addQuiz(6, 'terjemahkan', 'Terjemahkan: "Maukah kamu pergi bersamaku?"', ['いっしょに行きませんか。', 'いっしょに行きます。', 'いっしょに行きましょう。', 'いっしょに行ってください。'], 'いっしょに行きませんか。');
addQuiz(6, 'isi_kalimat', '___に行きませんか。', ['映画', '本', '机', 'ペン'], '映画');
addQuiz(6, 'susun_kalimat', 'Susun: 映画 / 行きませんか / へ', null, '映画へ行きませんか');

// Lesson 7: 何を勉強しますか
addQuiz(7, 'tebak_partikel', '日本語___勉強します。', ['を', 'が', 'に', 'で'], 'を');
addQuiz(7, 'terjemahkan', 'Terjemahkan: "Apa yang akan kamu pelajari?"', ['何を勉強しますか。', 'どこで勉強しますか。', 'いつ勉強しますか。', 'だれと勉強しますか。'], '何を勉強しますか。');
addQuiz(7, 'isi_kalimat', '___を勉強します。', ['日本語', '机', '本', 'ペン'], '日本語');
addQuiz(7, 'pasangkan', 'Pasangkan: 勉強 / belajar, 日本語 / bahasa Jepang, 英語 / bahasa Inggris', null, '勉強-benar');

// Lesson 8: もう一度お願いします
addQuiz(8, 'tebak_partikel', 'もう___度お願いします。', ['一', '二', '三', '四'], '一');
addQuiz(8, 'terjemahkan', 'Terjemahkan: "Tolong sekali lagi."', ['もう一度お願いします。', 'お願いします。', 'どうもありがとうございます。', 'すみません。'], 'もう一度お願いします。');
addQuiz(8, 'isi_kalimat', '___お願いします。', ['もう一度', '一度も', 'いつも', 'とても'], 'もう一度');
addQuiz(8, 'susun_kalimat', 'Susun: お願いします / もう / 一度', null, 'もう一度お願いします');

// Lesson 9: 少し分かります
addQuiz(9, 'tebak_partikel', '日本語___少し分かります。', ['が', 'を', 'に', 'で'], 'が');
addQuiz(9, 'terjemahkan', 'Terjemahkan: "Saya mengerti sedikit."', ['少し分かります。', 'よく分かります。', '全然分かりません。', 'たくさん分かります。'], '少し分かります。');
addQuiz(9, 'isi_kalimat', '___分かります。', ['少し', '机', '本', 'ペン'], '少し');
addQuiz(9, 'kuis_bergambar', 'Lihat gambar: 🧠💡. Pilih kalimat yang benar.', ['少し分かります。', '全然分かりません。', 'よく分かります。', '分かりました。'], '少し分かります。');

// Lesson 10: あそこにあります
addQuiz(10, 'tebak_partikel', 'トイレ___あそこにあります。', ['は', 'が', 'を', 'に'], 'は');
addQuiz(10, 'terjemahkan', 'Terjemahkan: "Ada di sana."', ['あそこにあります。', 'そこにあります。', 'ここにあります。', 'どこにあります。'], 'あそこにあります。');
addQuiz(10, 'isi_kalimat', '___にあります。', ['あそこ', 'なん', 'だれ', 'いつ'], 'あそこ');
addQuiz(10, 'susun_kalimat', 'Susun: あそこ / あります / に', null, 'あそこにあります');

// Lesson 11: いくらですか
addQuiz(11, 'tebak_partikel', 'これ___いくらですか。', ['は', 'が', 'を', 'に'], 'は');
addQuiz(11, 'terjemahkan', 'Terjemahkan: "Berapa harganya?"', ['いくらですか。', '何ですか。', 'どこですか。', 'いつですか。'], 'いくらですか。');
addQuiz(11, 'isi_kalimat', '___円です。', ['千', '机', '本', 'ペン'], '千');
addQuiz(11, 'pasangkan', 'Pasangkan: 千 / 1000, 百 / 100, 万 / 10000', null, '千-benar');

// Lesson 12: 私の町はにぎやかです
addQuiz(12, 'tebak_partikel', '町___にぎやかです。', ['は', 'が', 'を', 'に'], 'は');
addQuiz(12, 'terjemahkan', 'Terjemahkan: "Kota saya ramai."', ['私の町はにぎやかです。', '私の町は静かです。', '私の町は大きいです。', '私の町は小さいです。'], '私の町はにぎやかです。');
addQuiz(12, 'isi_kalimat', '___はにぎやかです。', ['町', '机', '本', 'ペン'], '町');
addQuiz(12, 'susun_kalimat', 'Susun: にぎやか / 町 / です / の / 私', null, '私の町はにぎやかです');

// Lesson 13: もう予約しましたか
addQuiz(13, 'tebak_partikel', '___予約しましたか。', ['もう', 'まだ', 'いつも', 'とても'], 'もう');
addQuiz(13, 'terjemahkan', 'Terjemahkan: "Sudah reservasi?"', ['もう予約しましたか。', '予約していませんか。', '予約しませんか。', '予約しましょうか。'], 'もう予約しましたか。');
addQuiz(13, 'isi_kalimat', '___しましたか。', ['予約', '机', '本', 'ペン'], '予約');
addQuiz(13, 'kuis_bergambar', 'Lihat gambar: 📞🍽️. Pilih kalimat yang benar.', ['もう予約しましたか。', '何を勉強しますか。', 'どこに行きますか。', 'いつ来ますか。'], 'もう予約しましたか。');

// Lesson 14: 電車で行きます
addQuiz(14, 'tebak_partikel', '電車___行きます。', ['で', 'を', 'に', 'が'], 'で');
addQuiz(14, 'terjemahkan', 'Terjemahkan: "Pergi naik kereta."', ['電車で行きます。', 'バスで行きます。', '車で来ます。', '歩いて行きます。'], '電車で行きます。');
addQuiz(14, 'isi_kalimat', '___で行きます。', ['電車', '机', '本', 'ペン'], '電車');
addQuiz(14, 'susun_kalimat', 'Susun: 電車 / 行きます / で', null, '電車で行きます');

// Lesson 15: どうぞよろしく
addQuiz(15, 'tebak_partikel', '___よろしく。', ['どうぞ', 'どうも', 'とても', '本当に'], 'どうぞ');
addQuiz(15, 'terjemahkan', 'Terjemahkan: "Senang bertemu denganmu."', ['どうぞよろしく。', 'こんにちは。', 'さようなら。', 'ありがとうございます。'], 'どうぞよろしく。');
addQuiz(15, 'isi_kalimat', 'どうぞ___。', ['よろしく', '机', '本', 'ペン'], 'よろしく');
addQuiz(15, 'pasangkan', 'Pasangkan: どうぞよろしく / senang bertemu, こんにちは / halo, さようなら / selamat tinggal', null, 'どうぞよろしく-benar');

// Lesson 16: 使い方を教えてください
addQuiz(16, 'tebak_partikel', '使い___を教えてください。', ['方', '物', '所', '時'], '方');
addQuiz(16, 'terjemahkan', 'Terjemahkan: "Tolong ajari cara pakainya."', ['使い方を教えてください。', '見せてください。', '教えてください。', '手伝ってください。'], '使い方を教えてください。');
addQuiz(16, 'isi_kalimat', '___方を教えてください。', ['使い', '机', '本', 'ペン'], '使い');
addQuiz(16, 'susun_kalimat', 'Susun: ください / 使い / 教え / 方 / て', null, '使い方を教えてください');

// Lesson 17: どうしましたか
addQuiz(17, 'tebak_partikel', '___しましたか。', ['どう', 'なん', 'どこ', 'だれ'], 'どう');
addQuiz(17, 'terjemahkan', 'Terjemahkan: "Ada apa?"', ['どうしましたか。', '何ですか。', 'どこですか。', 'いつですか。'], 'どうしましたか。');
addQuiz(17, 'isi_kalimat', '___しましたか。', ['どう', '机', '本', 'ペン'], 'どう');
addQuiz(17, 'kuis_bergambar', 'Lihat gambar: 😟. Pilih kalimat yang benar.', ['どうしましたか。', 'こんにちは。', 'ありがとうございます。', 'さようなら。'], 'どうしましたか。');

// Lesson 18: 趣味は何ですか
addQuiz(18, 'tebak_partikel', '趣味___何ですか。', ['は', 'が', 'を', 'に'], 'は');
addQuiz(18, 'terjemahkan', 'Terjemahkan: "Apa hobimu?"', ['趣味は何ですか。', '名前は何ですか。', '仕事は何ですか。', '国はどこですか。'], '趣味は何ですか。');
addQuiz(18, 'isi_kalimat', '趣味___読書です。', ['は', 'が', 'を', 'に'], 'は');
addQuiz(18, 'susun_kalimat', 'Susun: 何 / 趣味 / です / か', null, '趣味は何ですか');

// Lesson 19: 体に気をつけてください
addQuiz(19, 'tebak_partikel', '体___気をつけてください。', ['に', 'を', 'が', 'で'], 'に');
addQuiz(19, 'terjemahkan', 'Terjemahkan: "Jaga kesehatanmu."', ['体に気をつけてください。', '頑張ってください。', '気をつけてください。', '大丈夫です。'], '体に気をつけてください。');
addQuiz(19, 'isi_kalimat', '___に気をつけてください。', ['体', '机', '本', 'ペン'], '体');
addQuiz(19, 'pasangkan', 'Pasangkan: 体 / tubuh, 気 / perhatian, つける / memperhatikan', null, '体-benar');

// Lesson 20: 夏休みはどうですか
addQuiz(20, 'tebak_partikel', '夏休み___どうですか。', ['は', 'が', 'を', 'に'], 'は');
addQuiz(20, 'terjemahkan', 'Terjemahkan: "Bagaimana liburan musim panasmu?"', ['夏休みはどうですか。', '冬休みはどうですか。', '週末はどうですか。', '休日はどうですか。'], '夏休みはどうですか。');
addQuiz(20, 'isi_kalimat', '___休みはどうですか。', ['夏', '机', '本', 'ペン'], '夏');
addQuiz(20, 'susun_kalimat', 'Susun: どう / 夏休み / です / か', null, '夏休みはどうですか');

// Lesson 21: 何と言いましたか
addQuiz(21, 'tebak_partikel', '何___言いましたか。', ['と', 'を', 'が', 'に'], 'と');
addQuiz(21, 'terjemahkan', 'Terjemahkan: "Dia berkata apa?"', ['何と言いましたか。', '何を食べましたか。', '何を見ましたか。', '何をしましたか。'], '何と言いましたか。');
addQuiz(21, 'isi_kalimat', '___と言いましたか。', ['何', '机', '本', 'ペン'], '何');
addQuiz(21, 'kuis_bergambar', 'Lihat gambar: 💬❓. Pilih kalimat yang benar.', ['何と言いましたか。', '何を食べましたか。', 'どこに行きましたか。', 'いつ来ましたか。'], '何と言いましたか。');

// Lesson 22: これは便利ですね
addQuiz(22, 'tebak_partikel', 'これ___便利ですね。', ['は', 'が', 'を', 'に'], 'は');
addQuiz(22, 'terjemahkan', 'Terjemahkan: "Ini praktis ya."', ['これは便利ですね。', 'これは高いですね。', 'これは安いですね。', 'これは大きいですね。'], 'これは便利ですね。');
addQuiz(22, 'isi_kalimat', '___は便利ですね。', ['これ', '机', '本', 'ペン'], 'これ');
addQuiz(22, 'susun_kalimat', 'Susun: 便利 / これ / ね / です', null, 'これは便利ですね');

// Lesson 23: 約束を忘れないでください
addQuiz(23, 'tebak_partikel', '約束___忘れないでください。', ['を', 'が', 'に', 'で'], 'を');
addQuiz(23, 'terjemahkan', 'Terjemahkan: "Jangan lupa janji."', ['約束を忘れないでください。', '約束を忘れました。', '約束を覚えています。', '約束をしました。'], '約束を忘れないでください。');
addQuiz(23, 'isi_kalimat', '___を忘れないでください。', ['約束', '机', '本', 'ペン'], '約束');
addQuiz(23, 'pasangkan', 'Pasangkan: 約束 / janji, 忘れる / lupa, 覚える / ingat', null, '約束-benar');

// Lesson 24: 手伝ってくれますか
addQuiz(24, 'tebak_partikel', '手伝___くれますか。', ['って', 'を', 'が', 'に'], 'って');
addQuiz(24, 'terjemahkan', 'Terjemahkan: "Bisakah kamu membantuku?"', ['手伝ってくれますか。', '手伝いますか。', '手伝ってください。', '手伝いましょうか。'], '手伝ってくれますか。');
addQuiz(24, 'isi_kalimat', '___ってくれますか。', ['手伝', '机', '本', 'ペン'], '手伝');
addQuiz(24, 'susun_kalimat', 'Susun: くれます / 手伝って / か', null, '手伝ってくれますか');

// Lesson 25: どうやって行きますか
addQuiz(25, 'tebak_partikel', '___やって行きますか。', ['どう', 'なん', 'どこ', 'だれ'], 'どう');
addQuiz(25, 'terjemahkan', 'Terjemahkan: "Bagaimana cara perginya?"', ['どうやって行きますか。', 'どこに行って行きますか。', 'いつ行きますか。', 'だれと行きますか。'], 'どうやって行きますか。');
addQuiz(25, 'isi_kalimat', '___やって行きますか。', ['どう', '机', '本', 'ペン'], 'どう');
addQuiz(25, 'kuis_bergambar', 'Lihat gambar: 🚶‍♂️❓🗺️. Pilih kalimat yang benar.', ['どうやって行きますか。', '何を食べますか。', 'どこに行きますか。', 'いつ来ますか。'], 'どうやって行きますか。');

// Lesson 26: お久しぶりです
addQuiz(26, 'tebak_partikel', 'お久しぶり___。', ['です', 'だ', 'である', 'でした'], 'です');
addQuiz(26, 'terjemahkan', 'Terjemahkan: "Sudah lama tidak bertemu."', ['お久しぶりです。', 'はじめまして。', 'よろしくお願いします。', 'お元気で。'], 'お久しぶりです。');
addQuiz(26, 'isi_kalimat', 'お___ぶりです。', ['久しぶ', '机', '本', 'ペン'], '久しぶ');
addQuiz(26, 'susun_kalimat', 'Susun: です / お久しぶり', null, 'お久しぶりです');

// Lesson 27: 伺ってもいいですか
addQuiz(27, 'tebak_partikel', '伺___もいいですか。', ['っ', 'い', 'く', 'き'], 'っ');
addQuiz(27, 'terjemahkan', 'Terjemahkan: "Bolehkah saya bertanya?"', ['伺ってもいいですか。', '聞いてもいいですか。', '言ってもいいですか。', '見てもいいですか。'], '伺ってもいいですか。');
addQuiz(27, 'isi_kalimat', '___てもいいですか。', ['伺', '机', '本', 'ペン'], '伺');
addQuiz(27, 'pasangkan', 'Pasangkan: 伺う / bertanya (sopan), 聞く / mendengar, 言う / berkata', null, '伺う-benar');

// Lesson 28: 日本語を教えてくれませんか
addQuiz(28, 'tebak_partikel', '日本語___教えてくれませんか。', ['を', 'が', 'に', 'で'], 'を');
addQuiz(28, 'terjemahkan', 'Terjemahkan: "Bisakah Anda mengajariku bahasa Jepang?"', ['日本語を教えてくれませんか。', '日本語を勉強します。', '日本語が分かります。', '日本語を話します。'], '日本語を教えてくれませんか。');
addQuiz(28, 'isi_kalimat', '___を教えてくれませんか。', ['日本語', '机', '本', 'ペン'], '日本語');
addQuiz(28, 'susun_kalimat', 'Susun: ください / 教え / 日本語 / て / くれませんか', null, '日本語を教えてくれませんか');

// Lesson 29: 駅まで迎えに行きます
addQuiz(29, 'tebak_partikel', '駅___迎えに行きます。', ['まで', 'を', 'が', 'に'], 'まで');
addQuiz(29, 'terjemahkan', 'Terjemahkan: "Saya akan menjemput sampai stasiun."', ['駅まで迎えに行きます。', '駅に行きます。', '駅で待ちます。', '駅から来ます。'], '駅まで迎えに行きます。');
addQuiz(29, 'isi_kalimat', '___まで迎えに行きます。', ['駅', '机', '本', 'ペン'], '駅');
addQuiz(29, 'kuis_bergambar', 'Lihat gambar: 🚉👋. Pilih kalimat yang benar.', ['駅まで迎えに行きます。', '駅に行きます。', '駅で食べます。', '駅から帰ります。'], '駅まで迎えに行きます。');

// Lesson 30: 忘れ物をしました
addQuiz(30, 'tebak_partikel', '忘れ___をしました。', ['物', '方', '所', '時'], '物');
addQuiz(30, 'terjemahkan', 'Terjemahkan: "Saya lupa barang."', ['忘れ物をしました。', '忘れました。', '覚えています。', '持っています。'], '忘れ物をしました。');
addQuiz(30, 'isi_kalimat', '忘れ___をしました。', ['物', '机', '本', 'ペン'], '物');
addQuiz(30, 'susun_kalimat', 'Susun: 忘れ / しました / 物 / を', null, '忘れ物をしました');

// Lesson 31: これは便利なアプリです
addQuiz(31, 'tebak_partikel', 'これ___便利なアプリです。', ['は', 'が', 'を', 'に'], 'は');
addQuiz(31, 'terjemahkan', 'Terjemahkan: "Ini aplikasi yang praktis."', ['これは便利なアプリです。', 'これは便利な本です。', 'これは便利でした。', 'これは便利ではありません。'], 'これは便利なアプリです。');
addQuiz(31, 'isi_kalimat', '___は便利なアプリです。', ['これ', '机', '本', 'ペン'], 'これ');
addQuiz(31, 'pasangkan', 'Pasangkan: アプリ / aplikasi, 便利 / praktis, 使う / menggunakan', null, 'アプリ-benar');

// Lesson 32: 今住んでいるところはどこですか
addQuiz(32, 'tebak_partikel', '今住___いるところはどこですか。', ['ん', 'ま', 'み', 'む'], 'ん');
addQuiz(32, 'terjemahkan', 'Terjemahkan: "Di mana kamu tinggal sekarang?"', ['今住んでいるところはどこですか。', 'どこに住んでいますか。', 'どこに行きますか。', 'どこから来ましたか。'], '今住んでいるところはどこですか。');
addQuiz(32, 'isi_kalimat', '今住___いるところ', ['ん', 'ま', 'み', 'む'], 'ん');
addQuiz(32, 'susun_kalimat', 'Susun: ところ / 今 / どこ / 住んでいる / は', null, '今住んでいるところはどこですか');

// Lesson 33: 道に迷いました
addQuiz(33, 'tebak_partikel', '道___迷いました。', ['に', 'を', 'が', 'で'], 'に');
addQuiz(33, 'terjemahkan', 'Terjemahkan: "Saya tersesat."', ['道に迷いました。', '道を歩きました。', '道を行きました。', '道が分かりました。'], '道に迷いました。');
addQuiz(33, 'isi_kalimat', '___に迷いました。', ['道', '机', '本', 'ペン'], '道');
addQuiz(33, 'kuis_bergambar', 'Lihat gambar: 🗺️❓😰. Pilih kalimat yang benar.', ['道に迷いました。', '道が分かりました。', '家に帰りました。', '駅に着きました。'], '道に迷いました。');

// Lesson 34: 病院に行ったほうがいいです
addQuiz(34, 'tebak_partikel', '病院___行ったほうがいいです。', ['に', 'を', 'が', 'で'], 'に');
addQuiz(34, 'terjemahkan', 'Terjemahkan: "Lebih baik pergi ke rumah sakit."', ['病院に行ったほうがいいです。', '病院に行きます。', '病院に行きました。', '病院に行きましょう。'], '病院に行ったほうがいいです。');
addQuiz(34, 'isi_kalimat', '___に行ったほうがいいです。', ['病院', '机', '本', 'ペン'], '病院');
addQuiz(34, 'susun_kalimat', 'Susun: 病院 / 行った / ほうがいい / に / です', null, '病院に行ったほうがいいです');

// Lesson 35: 予約をしてもいいですか
addQuiz(35, 'tebak_partikel', '予約___してもいいですか。', ['を', 'が', 'に', 'で'], 'を');
addQuiz(35, 'terjemahkan', 'Terjemahkan: "Bolehkah saya membuat reservasi?"', ['予約をしてもいいですか。', '予約をしました。', '予約をします。', '予約をしてください。'], '予約をしてもいいですか。');
addQuiz(35, 'isi_kalimat', '___をしてもいいですか。', ['予約', '机', '本', 'ペン'], '予約');
addQuiz(35, 'pasangkan', 'Pasangkan: 予約 / reservasi, する / melakukan, いい / baik', null, '予約-benar');

// Lesson 36: 旅行の準備をしています
addQuiz(36, 'tebak_partikel', '旅行___準備をしています。', ['の', 'を', 'が', 'に'], 'の');
addQuiz(36, 'terjemahkan', 'Terjemahkan: "Saya sedang mempersiapkan perjalanan."', ['旅行の準備をしています。', '旅行に行きます。', '旅行をしました。', '旅行を計画しています。'], '旅行の準備をしています。');
addQuiz(36, 'isi_kalimat', '旅行の___をしています。', ['準備', '机', '本', 'ペン'], '準備');
addQuiz(36, 'susun_kalimat', 'Susun: 準備 / 旅行 / しています / の / を', null, '旅行の準備をしています');

// Lesson 37: 日本にいる間に
addQuiz(37, 'tebak_partikel', '日本___いる間に。', ['に', 'を', 'が', 'で'], 'に');
addQuiz(37, 'terjemahkan', 'Terjemahkan: "Selama di Jepang..."', ['日本にいる間に。', '日本に行きます。', '日本から来ました。', '日本が好きです。'], '日本にいる間に。');
addQuiz(37, 'isi_kalimat', '日本___いる間に。', ['に', 'を', 'が', 'で'], 'に');
addQuiz(37, 'kuis_bergambar', 'Lihat gambar: 🗾⏰. Pilih kalimat yang benar.', ['日本にいる間に。', '日本に行きます。', '日本を食べます。', '日本を勉強します。'], '日本にいる間に。');

// Lesson 38: アルバイトを探しています
addQuiz(38, 'tebak_partikel', 'アルバイト___探しています。', ['を', 'が', 'に', 'で'], 'を');
addQuiz(38, 'terjemahkan', 'Terjemahkan: "Saya sedang mencari pekerjaan paruh waktu."', ['アルバイトを探しています。', 'アルバイトをしています。', 'アルバイトをしました。', 'アルバイトをします。'], 'アルバイトを探しています。');
addQuiz(38, 'isi_kalimat', '___を探しています。', ['アルバイト', '机', '本', 'ペン'], 'アルバイト');
addQuiz(38, 'susun_kalimat', 'Susun: アルバイト / 探しています / を', null, 'アルバイトを探しています');

// Lesson 39: インターネットで調べました
addQuiz(39, 'tebak_partikel', 'インターネット___調べました。', ['で', 'を', 'が', 'に'], 'で');
addQuiz(39, 'terjemahkan', 'Terjemahkan: "Saya mencari di internet."', ['インターネットで調べました。', 'インターネットを使います。', 'インターネットを見ました。', 'インターネットに行きました。'], 'インターネットで調べました。');
addQuiz(39, 'isi_kalimat', '___で調べました。', ['インターネット', '机', '本', 'ペン'], 'インターネット');
addQuiz(39, 'pasangkan', 'Pasangkan: インターネット / internet, 調べる / mencari, 使う / menggunakan', null, 'インターネット-benar');

// Lesson 40: 新聞を読んでいます
addQuiz(40, 'tebak_partikel', '新聞___読んでいます。', ['を', 'が', 'に', 'で'], 'を');
addQuiz(40, 'terjemahkan', 'Terjemahkan: "Saya sedang membaca koran."', ['新聞を読んでいます。', '新聞を買いました。', '新聞を見ました。', '新聞を書きました。'], '新聞を読んでいます。');
addQuiz(40, 'isi_kalimat', '___を読んでいます。', ['新聞', '机', '本', 'ペン'], '新聞');
addQuiz(40, 'susun_kalimat', 'Susun: 新聞 / 読んでいます / を', null, '新聞を読んでいます');

// Lesson 41: 意見を聞かせてください
addQuiz(41, 'tebak_partikel', '意見___聞かせてください。', ['を', 'が', 'に', 'で'], 'を');
addQuiz(41, 'terjemahkan', 'Terjemahkan: "Tolong berikan pendapatmu."', ['意見を聞かせてください。', '意見を言います。', '意見をします。', '意見があります。'], '意見を聞かせてください。');
addQuiz(41, 'isi_kalimat', '___を聞かせてください。', ['意見', '机', '本', 'ペン'], '意見');
addQuiz(41, 'kuis_bergambar', 'Lihat gambar: 💬👂. Pilih kalimat yang benar.', ['意見を聞かせてください。', '意見があります。', '意見をします。', '意見を食べます。'], '意見を聞かせてください。');

// Lesson 42: 天気予報を見ましたか
addQuiz(42, 'tebak_partikel', '天気予報___見ましたか。', ['を', 'が', 'に', 'で'], 'を');
addQuiz(42, 'terjemahkan', 'Terjemahkan: "Sudah lihat prakiraan cuaca?"', ['天気予報を見ましたか。', '天気予報を見ます。', '天気予報を見ません。', '天気予報を見ましょう。'], '天気予報を見ましたか。');
addQuiz(42, 'isi_kalimat', '___を見ましたか。', ['天気予報', '机', '本', 'ペン'], '天気予報');
addQuiz(42, 'susun_kalimat', 'Susun: 天気予報 / 見ました / か / を', null, '天気予報を見ましたか');

// Lesson 43: お世話になりました
addQuiz(43, 'tebak_partikel', 'お世話___なりました。', ['に', 'を', 'が', 'で'], 'に');
addQuiz(43, 'terjemahkan', 'Terjemahkan: "Terima kasih atas bantuannya."', ['お世話になりました。', 'お元気で。', 'お久しぶりです。', 'よろしくお願いします。'], 'お世話になりました。');
addQuiz(43, 'isi_kalimat', 'お世話___なりました。', ['に', 'を', 'が', 'で'], 'に');
addQuiz(43, 'pasangkan', 'Pasangkan: お世話 / bantuan, なる / menjadi, ありがとう / terima kasih', null, 'お世話-benar');

// Lesson 44: これは私が作ったものです
addQuiz(44, 'tebak_partikel', 'これ___私が作ったものです。', ['は', 'が', 'を', 'に'], 'は');
addQuiz(44, 'terjemahkan', 'Terjemahkan: "Ini adalah barang yang saya buat."', ['これは私が作ったものです。', 'これは私が買いました。', 'これは私が使います。', 'これは私のです。'], 'これは私が作ったものです。');
addQuiz(44, 'isi_kalimat', '___は私が作ったものです。', ['これ', '机', '本', 'ペン'], 'これ');
addQuiz(44, 'susun_kalimat', 'Susun: もの / 私 / 作った / です / が', null, 'これは私が作ったものです');

// Lesson 45: 日本語が上手になりましたね
addQuiz(45, 'tebak_partikel', '日本語___上手になりました。', ['が', 'を', 'に', 'で'], 'が');
addQuiz(45, 'terjemahkan', 'Terjemahkan: "Bahasa Jepanmgmu sudah mahir ya."', ['日本語が上手になりましたね。', '日本語を勉強します。', '日本語が分かります。', '日本語を話します。'], '日本語が上手になりましたね。');
addQuiz(45, 'isi_kalimat', '___が上手になりました。', ['日本語', '机', '本', 'ペン'], '日本語');
addQuiz(45, 'kuis_bergambar', 'Lihat gambar: 📈🇯🇵😊. Pilih kalimat yang benar.', ['日本語が上手になりましたね。', '日本語を勉強します。', '日本語を食べます。', '日本語に行きます。'], '日本語が上手になりましたね。');

// Lesson 46: おかげさまで
addQuiz(46, 'tebak_partikel', 'おかげさま___。', ['で', 'を', 'が', 'に'], 'で');
addQuiz(46, 'terjemahkan', 'Terjemahkan: "Berkat Anda / Alhamdulillah."', ['おかげさまで。', 'ありがとうございます。', 'すみません。', 'どうぞよろしく。'], 'おかげさまで。');
addQuiz(46, 'isi_kalimat', 'おかげ___。', ['さま', '机', '本', 'ペン'], 'さま');
addQuiz(46, 'susun_kalimat', 'Susun: おかげさまで', null, 'おかげさまで');

// Lesson 47: 留学したいです
addQuiz(47, 'tebak_partikel', '留学___したいです。', ['を', 'が', 'に', 'で'], 'を');
addQuiz(47, 'terjemahkan', 'Terjemahkan: "Saya ingin belajar di luar negeri."', ['留学したいです。', '留学します。', '留学しました。', '留学しましょう。'], '留学したいです。');
addQuiz(47, 'isi_kalimat', '___したいです。', ['留学', '机', '本', 'ペン'], '留学');
addQuiz(47, 'pasangkan', 'Pasangkan: 留学 / belajar di luar negeri, する / melakukan, たい / ingin', null, '留学-benar');

// Lesson 48: お元気で
addQuiz(48, 'tebak_partikel', 'お元気___。', ['で', 'を', 'が', 'に'], 'で');
addQuiz(48, 'terjemahkan', 'Terjemahkan: "Semoga sehat selalu."', ['お元気で。', 'お元気ですか。', 'お元気です。', 'お大事に。'], 'お元気で。');
addQuiz(48, 'isi_kalimat', 'お___で。', ['元気', '机', '本', 'ペン'], '元気');
addQuiz(48, 'susun_kalimat', 'Susun: お元気で', null, 'お元気で');

// Lesson 49: これからもよろしく
addQuiz(49, 'tebak_partikel', 'これから___よろしく。', ['も', 'を', 'が', 'に'], 'も');
addQuiz(49, 'terjemahkan', 'Terjemahkan: "Mulai sekarang juga mohon bantuannya."', ['これからもよろしく。', 'どうぞよろしく。', 'よろしくお願いします。', 'お元気で。'], 'これからもよろしく。');
addQuiz(49, 'isi_kalimat', '___もよろしく。', ['これから', '机', '本', 'ペン'], 'これから');
addQuiz(49, 'kuis_bergambar', 'Lihat gambar: 🤝➡️. Pilih kalimat yang benar.', ['これからもよろしく。', 'さようなら。', 'お元気で。', 'ありがとうございました。'], 'これからもよろしく。');

// Lesson 50: 勉強を続けます
addQuiz(50, 'tebak_partikel', '勉強___続けます。', ['を', 'が', 'に', 'で'], 'を');
addQuiz(50, 'terjemahkan', 'Terjemahkan: "Saya akan melanjutkan belajar."', ['勉強を続けます。', '勉強します。', '勉強しました。', '勉強しましょう。'], '勉強を続けます。');
addQuiz(50, 'isi_kalimat', '___を続けます。', ['勉強', '机', '本', 'ペン'], '勉強');
addQuiz(50, 'susun_kalimat', 'Susun: 勉強 / 続けます / を', null, '勉強を続けます');

console.log(`📝 Total quiz questions: ${quizData.length}`);

async function seed() {
  console.log('🚀 Starting seed...');
  
  let inserted = 0;
  let skipped = 0;
  let errors = 0;
  
  for (const q of quizData) {
    try {
      const { data, error } = await supabase
        .from('quiz_questions')
        .insert(q)
        .select()
        .single();
      
      if (error) {
        if (error.code === '23505') {
          // Unique constraint violation - already exists
          skipped++;
        } else {
          console.error(`❌ Lesson ${q.lesson_id} (${q.jenis_soal}): ${error.message}`);
          errors++;
        }
      } else {
        inserted++;
      }
    } catch (err) {
      console.error(`❌ Unexpected error for lesson ${q.lesson_id}: ${err.message}`);
      errors++;
    }
  }
  
  console.log(`✅ Done! Inserted: ${inserted}, Skipped: ${skipped}, Errors: ${errors}`);
}

seed();
