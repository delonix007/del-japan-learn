-- Batch 2: Susun Kalimat Bab 11-25 (8 soal each, strict MNN)
-- Chunks dengan partikel terpisah

DELETE FROM quiz_questions WHERE lesson_id BETWEEN 11 AND 25 AND jenis_soal = 'susun_kalimat';

INSERT INTO quiz_questions (lesson_id, jenis_soal, soal, pilihan_jawaban, jawaban_benar) VALUES

-- ===== BAB 11: Counters =====
(11, 'susun_kalimat', 'Saya membeli tiga buah apel.', '["りんご","を","みっつ","かいました","。"]', 'りんごをみっつかいました。'),
(11, 'susun_kalimat', 'Tolong beri saya lima perangko.', '["きって","を","ごまい","ください","。"]', 'きってをごまいください。'),
(11, 'susun_kalimat', 'Buku ini satu buah, tolong.', '["この","ほん","を","いっさつ","ください","。"]', 'このほんをいっさつください。'),
(11, 'susun_kalimat', 'Saya mempunyai dua batang pensil.', '["えんぴつ","を","にほん","もっています","。"]', 'えんぴつをにほんもっています。'),
(11, 'susun_kalimat', 'Tolong beri saya tiga cangkir kopi.', '["コーヒー","を","さんばい","ください","。"]', 'コーヒーをさんばいください。'),
(11, 'susun_kalimat', 'Saya minum dua botol bir.', '["ビール","を","にほん","のみました","。"]', 'ビールをにほんのみました。'),
(11, 'susun_kalimat', 'Berapa harga roti ini?', '["この","パン","は","いくら","です","か","？"]', 'このパンはいくらですか？'),
(11, 'susun_kalimat', 'Tas itu mahal ya.', '["その","かばん","は","たかい","です","ね","。"]', 'そのかばんはたかいですね。'),

-- ===== BAB 12: Perbandingan =====
(12, 'susun_kalimat', 'Bahasa Jepang lebih sulit daripada bahasa Inggris.', '["にほんご","は","えいご","より","むずかしい","です","。"]', 'にほんごはえいごよりむずかしいです。'),
(12, 'susun_kalimat', 'Saya suka musim panas di antara musim.', '["きせつ","の","なか","で","なつ","が","すき","です","。"]', 'きせつのなかでなつがすきです。'),
(12, 'susun_kalimat', 'Apakah bahasa Jepang atau bahasa Mandarin yang lebih sulit?', '["にほんご","と","ちゅうごくご","と","どちら","が","むずかしい","です","か","？"]', 'にほんごとちゅうごくごとどちらがむずかしいですか？'),
(12, 'susun_kalimat', 'Apel paling enak di antara buah.', '["くだもの","の","なか","で","りんご","が","いちばん","おいしい","です","。"]', 'くだもののなかでりんごがいちばんおいしいです。'),
(12, 'susun_kalimat', 'Pesawat lebih cepat daripada kereta.', '["ひこうき","は","でんしゃ","より","はやい","です","。"]', 'ひこうきはでんしゃよりはやいです。'),
(12, 'susun_kalimat', 'Osaka lebih besar daripada Kyoto.', '["おおさか","は","きょうと","より","おおきい","です","。"]', 'おおさかはきょうとよりおおきいです。'),
(12, 'susun_kalimat', 'Di antara musim, mana yang paling dingin?', '["きせつ","の","なか","で","どれ","が","いちばん","さむい","です","か","？"]', 'きせつのなかでどれがいちばんさむいですか？'),
(12, 'susun_kalimat', 'Musim dingin lebih dingin daripada musim panas.', '["ふゆ","は","なつ","より","さむい","です","。"]', 'ふゆはなつよりさむいです。'),

-- ===== BAB 13: Keinginan =====
(13, 'susun_kalimat', 'Saya ingin pergi ke Jepang.', '["わたし","は","にほん","へ","いきたい","です","。"]', 'わたしはにほんへいきたいです。'),
(13, 'susun_kalimat', 'Saya ingin komputer baru.', '["あたらしい","パソコン","が","ほしい","です","。"]', 'あたらしいパソコンがほしいです。'),
(13, 'susun_kalimat', 'Saya ingin makan tempura.', '["わたし","は","てんぷら","を","たべたい","です","。"]', 'わたしはてんぷらをたべたいです。'),
(13, 'susun_kalimat', 'Saya ingin belajar bahasa Jepang.', '["わたし","は","にほんご","を","べんきょうしたい","です","。"]', 'わたしはにほんごをべんきょうしたいです。'),
(13, 'susun_kalimat', 'Saya ingin mobil besar.', '["わたし","は","おおきい","くるま","が","ほしい","です","。"]', 'わたしはおおきいくるまがほしいです。'),
(13, 'susun_kalimat', 'Saya ingin pergi ke Okinawa.', '["わたし","は","おきなわ","へ","いきたい","です","。"]', 'わたしはおきなわへいきたいです。'),
(13, 'susun_kalimat', 'Saya ingin menonton film.', '["わたし","は","えいが","を","みたい","です","。"]', 'わたしはえいがをみたいです。'),
(13, 'susun_kalimat', 'Saya ingin pergi ke Kyoto.', '["わたし","は","きょうと","へ","いきたい","です","。"]', 'わたしはきょうとへいきたいです。'),

-- ===== BAB 14: て-form perintah =====
(14, 'susun_kalimat', 'Tolong tulis nama di sini.', '["ここ","に","なまえ","を","かいて","ください","。"]', 'ここになまえをかいてください。'),
(14, 'susun_kalimat', 'Tolong naik kereta listrik.', '["でんしゃ","に","のって","ください","。"]', 'でんしゃにのってください。'),
(14, 'susun_kalimat', 'Tolong turun dari taksi.', '["タクシー","を","おりて","ください","。"]', 'タクシーをおりてください。'),
(14, 'susun_kalimat', 'Tolong datang jam sepuluh.', '["じゅうじ","に","きて","ください","。"]', 'じゅうじにきてください。'),
(14, 'susun_kalimat', 'Tolong foto di sini.', '["ここ","で","しゃしん","を","とって","ください","。"]', 'ここでしゃしんをとってください。'),
(14, 'susun_kalimat', 'Tolong duduk di kursi ini.', '["この","せき","に","すわって","ください","。"]', 'このせきにすわってください。'),
(14, 'susun_kalimat', 'Tolong belok kanan di bank.', '["ぎんこう","を","みぎ","へ","まがって","ください","。"]', 'ぎんこうをみぎへまがってください。'),
(14, 'susun_kalimat', 'Tolong tunjukkan paspor.', '["パスポート","を","みせて","ください","。"]', 'パスポートをみせてください。'),

-- ===== BAB 15: Izin/larangan =====
(15, 'susun_kalimat', 'Boleh merokok di sini.', '["ここ","で","タバコ","を","すっても","いい","です","。"]', 'ここでタバコをすってもいいです。'),
(15, 'susun_kalimat', 'Tidak boleh mengambil foto di sini.', '["ここ","で","しゃしん","を","とっては","いけません","。"]', 'ここでしゃしんをとってはいけません。'),
(15, 'susun_kalimat', 'Boleh masuk ke ruangan ini.', '["この","へや","に","はいっても","いい","です","か","？"]', 'このへやにはいってもいいですか？'),
(15, 'susun_kalimat', 'Tidak boleh berhenti di sini.', '["ここ","に","くるま","を","とめては","いけません","。"]', 'ここにくるまをとめてはいけません。'),
(15, 'susun_kalimat', 'Tidak boleh makan di perpustakaan.', '["としょかん","で","たべては","いけません","。"]', 'としょかんでたべてはいけません。'),
(15, 'susun_kalimat', 'Boleh lewat jalan ini.', '["この","みち","を","とおっても","いい","です","。"]', 'このみちをとおってもいいです。'),
(15, 'susun_kalimat', 'Tidak boleh menggunakan telepon di sini.', '["ここ","で","でんわ","を","つかっては","いけません","。"]', 'ここででんわをつかってはいけません。'),
(15, 'susun_kalimat', 'Tidak boleh merokok di rumah sakit.', '["びょういん","で","タバコ","を","すっては","いけません","。"]', 'びょういんでタバコをすってはいけません。'),

-- ===== BAB 16: Urutan (てから) =====
(16, 'susun_kalimat', 'Setelah pulang ke rumah, saya belajar.', '["うち","に","かえって","から","べんきょう","します","。"]', 'うちにかえってからべんきょうします。'),
(16, 'susun_kalimat', 'Setelah pergi ke rumah sakit, saya belanja.', '["びょういん","へ","いって","から","かいもの","します","。"]', 'びょういんへいってからかいものします。'),
(16, 'susun_kalimat', 'Setelah makan, saya pergi.', '["ごはん","を","たべて","から","でかけます","。"]', 'ごはんをたべてからでかけます。'),
(16, 'susun_kalimat', 'Setelah sekolah selesai, saya bermain.', '["がっこう","が","おわって","から","あそびます","。"]', 'がっこうがおわってからあそびます。'),
(16, 'susun_kalimat', 'Setelah pulang ke rumah, saya mengerjakan PR.', '["いえ","に","かえって","から","しゅくだい","を","します","。"]', 'いえにかえってからしゅくだいをします。'),
(16, 'susun_kalimat', 'Setelah turun bus, saya berjalan.', '["バス","を","おりて","から","あるきます","。"]', 'バスをおりてからあるきます。'),
(16, 'susun_kalimat', 'Setelah mandi, saya tidur.', '["ふろ","に","はいって","から","ねます","。"]', 'ふろにはいってからねます。'),
(16, 'susun_kalimat', 'Setelah pergi ke perpustakaan, saya belajar.', '["としょかん","へ","いって","から","べんきょう","します","。"]', 'としょかんへいってからべんきょうします。'),

-- ===== BAB 17: Keharusan/larangan =====
(17, 'susun_kalimat', 'Setiap hari harus minum obat.', '["まいにち","くすり","を","のまなくては","いけません","。"]', 'まいにちくすりをのまなくてはいけません。'),
(17, 'susun_kalimat', 'Tidak harus pergi ke rumah sakit.', '["びょういん","へ","いかなくても","いい","です","。"]', 'びょういんへいかなくてもいいです。'),
(17, 'susun_kalimat', 'Harus mengumpulkan PR.', '["しゅくだい","を","ださなくては","いけません","。"]', 'しゅくだいをださなくてはいけません。'),
(17, 'susun_kalimat', 'Harus menulis nama di sini.', '["ここ","に","なまえ","を","かかなくては","いけません","。"]', 'ここになまえをかかなくてはいけません。'),
(17, 'susun_kalimat', 'Besok tidak harus datang.', '["あした","は","こなくても","いい","です","。"]', 'あしたはこなくてもいいです。'),
(17, 'susun_kalimat', 'Harus membayar uang.', '["おかね","を","はらわなくては","いけません","。"]', 'おかねをはらわなくてはいけません。'),
(17, 'susun_kalimat', 'Harus menyelesaikan laporan.', '["ほうこくしょ","を","かかなくては","いけません","。"]', 'ほうこくしょをかかなくてはいけません。'),
(17, 'susun_kalimat', 'Tidak harus menulis surat.', '["てがみ","を","かかなくても","いい","です","。"]', 'てがみをかかなくてもいいです。'),

-- ===== BAB 18: Kemampuan =====
(18, 'susun_kalimat', 'Saya bisa berbicara bahasa Jepang.', '["わたし","は","にほんご","が","はなせます","。"]', 'わたしはにほんごがはなせます。'),
(18, 'susun_kalimat', 'Saya bisa membuat masakan.', '["わたし","は","りょうり","が","つくれます","。"]', 'わたしはりょうりがつくれます。'),
(18, 'susun_kalimat', 'Saya bisa membaca huruf Kanji.', '["わたし","は","かんじ","が","よめます","。"]', 'わたしはかんじがよめます。'),
(18, 'susun_kalimat', 'Di sini bisa berenang.', '["ここ","で","およぐ","ことが","できます","。"]', 'ここでおよぐことができます。'),
(18, 'susun_kalimat', 'Saya bisa menyetir mobil.', '["わたし","は","くるま","の","うんてん","が","できます","。"]', 'わたしはくるまのうんてんができます。'),
(18, 'susun_kalimat', 'Di perpustakaan bisa meminjam buku.', '["としょかん","で","ほん","を","かりる","ことが","できます","。"]', 'としょかんでほんをかりることができます。'),
(18, 'susun_kalimat', 'Saya bisa bermain piano.', '["わたし","は","ピアノ","が","ひけます","。"]', 'わたしはピアノがひけます。'),
(18, 'susun_kalimat', 'Di sini bisa merokok.', '["ここ","で","タバコ","を","すう","ことが","できます","。"]', 'ここでタバコをすうことができます。'),

-- ===== BAB 19: Pengalaman (たことがある) =====
(19, 'susun_kalimat', 'Saya pernah pergi ke Jepang.', '["わたし","は","にほん","に","いった","ことが","あります","。"]', 'わたしはにほんにいったことがあります。'),
(19, 'susun_kalimat', 'Saya pernah mendaki Gunung Fuji.', '["わたし","は","ふじさん","に","のぼった","ことが","あります","。"]', 'わたしはふじさんにのぼったことがあります。'),
(19, 'susun_kalimat', 'Saya pernah makan sashimi.', '["わたし","は","さしみ","を","たべた","ことが","あります","。"]', 'わたしはさしみをたべたことがあります。'),
(19, 'susun_kalimat', 'Saya pernah menonton sumo.', '["わたし","は","すもう","を","みた","ことが","あります","。"]', 'わたしはすもうをみたことがあります。'),
(19, 'susun_kalimat', 'Saya pernah makan sukiyaki.', '["わたし","は","すきやき","を","たべた","ことが","あります","。"]', 'わたしはすきやきをたべたことがあります。'),
(19, 'susun_kalimat', 'Saya pernah pergi ke Kyoto.', '["わたし","は","きょうと","に","いった","ことが","あります","。"]', 'わたしはきょうとにいったことがあります。'),
(19, 'susun_kalimat', 'Saya pernah menonton film ini.', '["わたし","は","この","えいが","を","みた","ことが","あります","。"]', 'わたしはこのえいがをみたことがあります。'),
(19, 'susun_kalimat', 'Saya pernah menonton Kabuki.', '["わたし","は","かぶき","を","みた","ことが","あります","。"]', 'わたしはかぶきをみたことがあります。'),

-- ===== BAB 20: Plain form (普通形) =====
(20, 'susun_kalimat', 'Saya belajar bahasa Jepang setiap hari.', '["わたし","は","まいにち","にほんご","を","べんきょうする","。"]', 'わたしはまいにちにほんごをべんきょうする。'),
(20, 'susun_kalimat', 'Dia adalah seorang mahasiswa.', '["かれ","は","がくせい","だ","。"]', 'かれはがくせいだ。'),
(20, 'susun_kalimat', 'Saya suka film.', '["わたし","は","えいが","が","すき","だ","。"]', 'わたしはえいががすきだ。'),
(20, 'susun_kalimat', 'Kemarin saya pergi ke sekolah.', '["きのう","わたし","は","がっこう","へ","いった","。"]', 'きのうわたしはがっこうへいった。'),
(20, 'susun_kalimat', 'Besok saya akan pergi ke Kyoto.', '["あした","わたし","は","きょうと","へ","いく","。"]', 'あしたわたしはきょうとへいく。'),
(20, 'susun_kalimat', 'Setiap pagi saya minum kopi.', '["まいあさ","わたし","は","コーヒー","を","のむ","。"]', 'まいあさわたしはコーヒーをのむ。'),
(20, 'susun_kalimat', 'Hari Minggu saya pergi ke perpustakaan.', '["にちようび","わたし","は","としょかん","へ","いく","。"]', 'にちようびわたしはとしょかんへいく。'),
(20, 'susun_kalimat', 'Kemarin saya tidak makan apa-apa.', '["きのう","わたし","は","なにも","たべなかった","。"]', 'きのうわたしはなにもたべなかった。'),

-- ===== BAB 21: は/が (subordinate) =====
(21, 'susun_kalimat', 'Buku yang saya tulis ini adalah buku saya.', '["これ","は","わたし","が","かいた","ほん","です","。"]', 'これはわたしがかいたほんです。'),
(21, 'susun_kalimat', 'Ini adalah buku yang saya beli kemarin.', '["これ","は","きのう","わたし","が","かった","ほん","です","。"]', 'これはきのうわたしがかったほんです。'),
(21, 'susun_kalimat', 'Orang yang berdiri di sana adalah guru saya.', '["あそこ","に","たっている","ひと","は","わたし","の","せんせい","です","。"]', 'あそこにたっているひとはわたしのせんせいです。'),
(21, 'susun_kalimat', 'Ini adalah foto yang saya ambil.', '["これ","は","わたし","が","とった","しゃしん","です","。"]', 'これはわたしがとったしゃしんです。'),
(21, 'susun_kalimat', 'Buku yang dibeli kemarin sangat menarik.', '["きのう","かった","ほん","は","とても","おもしろい","です","。"]', 'きのうかったほんはとてもおもしろいです。'),
(21, 'susun_kalimat', 'Ini adalah masakan yang ibu buat.', '["これ","は","はは","が","つくった","りょうり","です","。"]', 'これはははがつくったりょうりです。'),
(21, 'susun_kalimat', 'Dia adalah orang yang saya temui kemarin.', '["かれ","は","きのう","あった","ひと","です","。"]', 'かれはきのうあったひとです。'),
(21, 'susun_kalimat', 'Di sini adalah tempat saya dilahirkan.', '["ここ","は","わたし","が","うまれた","ところ","です","。"]', 'ここはわたしがうまれたところです。'),

-- ===== BAB 22: Relative clause (連体修飾) =====
(22, 'susun_kalimat', 'Ini adalah buku yang saya beli.', '["これ","は","わたし","が","かった","ほん","です","。"]', 'これはわたしがかったほんです。'),
(22, 'susun_kalimat', 'Itu adalah masakan yang ibu saya buat.', '["あれ","は","はは","が","つくった","りょうり","です","。"]', 'あれはははがつくったりょうりです。'),
(22, 'susun_kalimat', 'Ini adalah foto yang saya ambil.', '["これ","は","わたし","が","とった","しゃしん","です","。"]', 'これはわたしがとったしゃしんです。'),
(22, 'susun_kalimat', 'Ini adalah buku yang saya baca kemarin.', '["これ","は","きのう","よんだ","ほん","です","。"]', 'これはきのうよんだほんです。'),
(22, 'susun_kalimat', 'Ini adalah kota tempat saya lahir.', '["ここ","は","わたし","が","うまれた","まち","です","。"]', 'ここはわたしがうまれたまちです。'),
(22, 'susun_kalimat', 'Itu adalah mobil yang ayah saya beli.', '["あれ","は","ちち","が","かった","くるま","です","。"]', 'あれはちちがかったくるまです。'),
(22, 'susun_kalimat', 'Ini adalah PR yang harus dikumpulkan besok.', '["これ","は","あした","ださなければ","ならない","しゅくだい","です","。"]', 'これはあしたださなければならないしゅくだいです。'),
(22, 'susun_kalimat', 'Itu adalah kue yang ibu buat.', '["あれ","は","はは","が","つくった","ケーキ","です","。"]', 'あれはははがつくったケーキです。'),

-- ===== BAB 23: くれる/あげる/もらう =====
(23, 'susun_kalimat', 'Teman memberi saya buku.', '["ともだち","が","わたし","に","ほん","を","くれました","。"]', 'ともだちがわたしにほんをくれました。'),
(23, 'susun_kalimat', 'Saya memberikan buku kepada teman.', '["わたし","は","ともだち","に","ほん","を","あげました","。"]', 'わたしはともだちにほんをあげました。'),
(23, 'susun_kalimat', 'Saya menerima buku dari guru.', '["わたし","は","せんせい","に","ほん","を","もらいました","。"]', 'わたしはせんせいにほんをもらいました。'),
(23, 'susun_kalimat', 'Ibu memberi saya sweter.', '["はは","が","わたし","に","セーター","を","くれました","。"]', 'ははがわたしにセーターをくれました。'),
(23, 'susun_kalimat', 'Dia memberi saya hadiah.', '["かのじょ","が","わたし","に","プレゼント","を","くれました","。"]', 'かのじょがわたしにプレゼントをくれました。'),
(23, 'susun_kalimat', 'Saya meminjam buku dari teman.', '["わたし","は","ともだち","から","ほん","を","かりました","。"]', 'わたしはともだちからほんをかりました。'),
(23, 'susun_kalimat', 'Ayah memberi saya jam tangan.', '["ちち","が","わたし","に","とけい","を","くれました","。"]', 'ちちがわたしにとけいをくれました。'),
(23, 'susun_kalimat', 'Saya meminjamkan uang kepada adik perempuan.', '["わたし","は","いもうと","に","おかね","を","かしました","。"]', 'わたしはいもうとにおかねをかしました。'),

-- ===== BAB 24: てくれる/てあげる/てもらう =====
(24, 'susun_kalimat', 'Saya mengajari adik bahasa Jepang.', '["わたし","は","いもうと","に","にほんご","を","おしえて","あげました","。"]', 'わたしはいもうとににほんごをおしえてあげました。'),
(24, 'susun_kalimat', 'Saya diajari kanji oleh guru.', '["わたし","は","せんせい","に","かんじ","を","おしえて","もらいました","。"]', 'わたしはせんせいにかんじをおしえてもらいました。'),
(24, 'susun_kalimat', 'Ibu mengirimkan saya sweter.', '["はは","が","わたし","に","セーター","を","おくって","くれました","。"]', 'ははがわたしにセーターをおくってくれました。'),
(24, 'susun_kalimat', 'Saya diantar teman sampai stasiun.', '["わたし","は","ともだち","に","えき","まで","おくって","もらいました","。"]', 'わたしはともだちにえきまでおくってもらいました。'),
(24, 'susun_kalimat', 'Guru mengajari saya bahasa Jepang.', '["せんせい","が","にほんご","を","おしえて","くれます","。"]', 'せんせいがにほんごをおしえてくれます。'),
(24, 'susun_kalimat', 'Saya diundang ke pesta oleh teman.', '["わたし","は","ともだち","に","パーティー","に","しょうたいして","もらいました","。"]', 'わたしはともだちにパーティーにしょうたいしてもらいました。'),
(24, 'susun_kalimat', 'Tuan Tanaka menunjukkan jalan kepada saya.', '["たなか","さん","が","わたし","を","あんないして","くれました","。"]', 'たなかさんがわたしをあんないしてくれました。'),
(24, 'susun_kalimat', 'Dia mengantar saya sampai stasiun.', '["かのじょ","が","わたし","を","えき","まで","おくって","くれました","。"]', 'かのじょがわたしをえきまでおくってくれました。'),

-- ===== BAB 25: Conditional (と/たら) =====
(25, 'susun_kalimat', 'Kalau musim semi tiba, bunga sakura mekar.', '["はる","に","なると","さくら","が","さきます","。"]', 'はるになるとさくらがさきます。'),
(25, 'susun_kalimat', 'Kalau menekan tombol ini, pintu terbuka.', '["この","ボタン","を","おすと","ドア","が","あきます","。"]', 'このボタンをおすとドアがあきます。'),
(25, 'susun_kalimat', 'Kalau turun hujan, pertandingan dibatalkan.', '["あめ","が","ふったら","しあい","は","ちゅうし","です","。"]', 'あめがふったらしあいはちゅうしです。'),
(25, 'susun_kalimat', 'Kalau ada uang, saya ingin membeli mobil.', '["おかね","が","あれば","くるま","を","かいたい","です","。"]', 'おかねがあればくるまをかいたいです。'),
(25, 'susun_kalimat', 'Kalau belok kiri, ada stasiun.', '["ひだり","へ","まがると","えき","が","あります","。"]', 'ひだりへまがるとえきがあります。'),
(25, 'susun_kalimat', 'Kalau ada waktu, ayo pergi.', '["じかん","が","あれば","いきましょう","。"]', 'じかんがあればいきましょう。'),
(25, 'susun_kalimat', 'Kalau musim semi tiba, cuaca jadi hangat.', '["はる","に","なると","あたたかく","なります","。"]', 'はるになるとあたたかくなります。'),
(25, 'susun_kalimat', 'Kalau besok cuaca cerah, kita pergi ke pantai.', '["あした","てんき","なら","うみ","へ","いきます","。"]', 'あしたてんきならうみへいきます。');
