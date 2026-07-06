-- Batch 3: Susun Kalimat Bab 26-50 (8 soal each, strict MNN Buku II)

DELETE FROM quiz_questions WHERE lesson_id BETWEEN 26 AND 50 AND jenis_soal = 'susun_kalimat';

INSERT INTO quiz_questions (lesson_id, jenis_soal, soal, pilihan_jawaban, jawaban_benar) VALUES

-- ===== BAB 26: 〜んです (explanation) =====
(26, 'susun_kalimat', 'Kemarin saya libur.', '["きのう","は","やすみ","ました","。"]', 'きのうはやすみました。'),
(26, 'susun_kalimat', 'Kepala saya sakit.', '["あたま","が","いたい","んです","。"]', 'あたまがいたいんです。'),
(26, 'susun_kalimat', 'Perut saya lapar.', '["おなか","が","すいた","んです","。"]', 'おなかがすいたんです。'),
(26, 'susun_kalimat', 'Saya masuk angin.', '["かぜ","を","ひいた","んです","。"]', 'かぜをひいたんです。'),
(26, 'susun_kalimat', 'Saya terlambat naik kereta.', '["でんしゃ","に","おくれた","んです","。"]', 'でんしゃにおくれたんです。'),
(26, 'susun_kalimat', 'Saya tidak punya uang.', '["おかね","が","ない","んです","。"]', 'おかねがないんです。'),
(26, 'susun_kalimat', 'Dia tidak datang.', '["かのじょ","が","こない","んです","。"]', 'かのじょがこないんです。'),
(26, 'susun_kalimat', 'Saya sibuk bekerja.', '["しごと","が","いそがしい","んです","。"]', 'しごとがいそがしいんです。'),

-- ===== BAB 27: 〜そうです (hearsay) =====
(27, 'susun_kalimat', 'Menurut ramalan cuaca, besok akan turun hujan.', '["てんきよほう","に","よると","あした","は","あめ","が","ふる","そうです","。"]', 'てんきよほうによるとあしたはあめがふるそうです。'),
(27, 'susun_kalimat', 'Tuan Tanaka akan menikah.', '["たなか","さん","が","けっこん","する","そうです","。"]', 'たなかさんがけっこんするそうです。'),
(27, 'susun_kalimat', 'Bulan depan katanya akan pergi jalan-jalan.', '["らいげつ","りょこう","に","いく","そうです","。"]', 'らいげつりょこうにいくそうです。'),
(27, 'susun_kalimat', 'Katanya dia tidak datang.', '["かれ","は","こない","そうです","。"]', 'かれはこないそうです。'),
(27, 'susun_kalimat', 'Katanya besok turun salju.', '["あした","ゆき","が","ふる","そうです","。"]', 'あしたゆきがふるそうです。'),
(27, 'susun_kalimat', 'Katanya restoran itu enak.', '["あの","みせ","は","おいしい","そうです","。"]', 'あのみせはおいしいそうです。'),
(27, 'susun_kalimat', 'Katanya minggu depan ada ujian.', '["らいしゅう","しけん","が","ある","そうです","。"]', 'らいしゅうしけんがあるそうです。'),
(27, 'susun_kalimat', 'Katanya dia pandai piano.', '["かのじょ","は","ピアノ","が","じょうず","だ","そうです","。"]', 'かのじょはピアノがじょうずだそうです。'),

-- ===== BAB 28: 〜ながら (while doing) =====
(28, 'susun_kalimat', 'Saya belajar sambil mendengarkan musik.', '["おんがく","を","きき","ながら","べんきょう","します","。"]', 'おんがくをききながらべんきょうします。'),
(28, 'susun_kalimat', 'Saya makan sambil menonton TV.', '["テレビ","を","み","ながら","ごはん","を","たべます","。"]', 'テレビをみながらごはんをたべます。'),
(28, 'susun_kalimat', 'Saya berbicara sambil minum kopi.', '["コーヒー","を","のみ","ながら","はなします","。"]', 'コーヒーをのみながらはなします。'),
(28, 'susun_kalimat', 'Saya menelepon sambil berjalan.', '["あるき","ながら","でんわ","を","します","。"]', 'あるきながらでんわをします。'),
(28, 'susun_kalimat', 'Saya menunggu kereta sambil membaca buku.', '["ほん","を","よみ","ながら","でんしゃ","を","まちます","。"]', 'ほんをよみながらでんしゃをまちます。'),
(28, 'susun_kalimat', 'Saya berlari sambil mendengarkan musik setiap hari.', '["まいにち","おんがく","を","きき","ながら","はしります","。"]', 'まいにちおんがくをききながらはしります。'),
(28, 'susun_kalimat', 'Saya mengemudi sambil mendengarkan radio.', '["ラジオ","を","きき","ながら","くるま","を","うんてん","します","。"]', 'ラジオをききながらくるまをうんてんします。'),
(28, 'susun_kalimat', 'Saya makan sambil berbicara dengan dia.', '["かれ","と","はなし","ながら","ごはん","を","たべます","。"]', 'かれとはなしながらごはんをたべます。'),

-- ===== BAB 29: 〜てある／〜ておく (preparation) =====
(29, 'susun_kalimat', 'Jendela sudah dibuka.', '["まど","が","あけて","あります","。"]', 'まどがあけてあります。'),
(29, 'susun_kalimat', 'PR sudah dikerjakan.', '["しゅくだい","が","やって","あります","。"]', 'しゅくだいがやってあります。'),
(29, 'susun_kalimat', 'Lampu sudah dinyalakan.', '["でんき","が","つけて","あります","。"]', 'でんきがつけてあります。'),
(29, 'susun_kalimat', 'Saya akan memesan tiket sebelum perjalanan.', '["りょこう","の","まえ","に","よやく","して","おきます","。"]', 'りょこうのまえによやくしておきます。'),
(29, 'susun_kalimat', 'Saya akan menyiapkan makanan.', '["ごはん","を","つくって","おきます","。"]', 'ごはんをつくっておきます。'),
(29, 'susun_kalimat', 'Ruang sudah dibersihkan.', '["へや","が","そうじ","して","あります","。"]', 'へやがそうじしてあります。'),
(29, 'susun_kalimat', 'Piring sudah ditata di meja.', '["テーブル","に","しょっき","が","ならべて","あります","。"]', 'テーブルにしょっきがならべてあります。'),
(29, 'susun_kalimat', 'Materi sudah disiapkan.', '["しりょう","が","じゅんび","して","あります","。"]', 'しりょうがじゅんびしてあります。'),

-- ===== BAB 30: 〜てしまう (completion/regret) =====
(30, 'susun_kalimat', 'Saya lupa mengerjakan PR.', '["しゅくだい","を","わすれて","しまいました","。"]', 'しゅくだいをわすれてしまいました。'),
(30, 'susun_kalimat', 'Saya kehilangan dompet.', '["さいふ","を","おとして","しまいました","。"]', 'さいふをおとしてしまいました。'),
(30, 'susun_kalimat', 'Kemarin saya menghabiskan uang.', '["きのう","おかね","を","つかって","しまいました","。"]', 'きのうおかねをつかってしまいました。'),
(30, 'susun_kalimat', 'Saya meminum seluruh kopi.', '["コーヒー","を","ぜんぶ","のんで","しまいました","。"]', 'コーヒーをぜんぶのんでしまいました。'),
(30, 'susun_kalimat', 'Kemarin saya kehilangan dokumen penting.', '["きのう","たいせつ","な","しょるい","を","なくして","しまいました","。"]', 'きのうたいせつなしょるいをなくしてしまいました。'),
(30, 'susun_kalimat', 'Saya menonton film sampai habis.', '["えいが","を","さいご","まで","みて","しまいました","。"]', 'えいがをさいごまでみてしまいました。'),
(30, 'susun_kalimat', 'Saya memakan seluruh kue.', '["ケーキ","を","ぜんぶ","たべて","しまいました","。"]', 'ケーキをぜんぶたべてしまいました。'),
(30, 'susun_kalimat', 'Saya sudah meminum obat.', '["くすり","を","のんで","しまいました","。"]', 'くすりをのんでしまいました。'),

-- ===== BAB 31: 〜そうです (appearance) =====
(31, 'susun_kalimat', 'Kue ini kelihatan enak.', '["この","ケーキ","は","おいし","そうです","。"]', 'このケーキはおいしそうです。'),
(31, 'susun_kalimat', 'Dia kelihatan sehat.', '["かのじょ","は","げんき","そうです","。"]', 'かのじょはげんきそうです。'),
(31, 'susun_kalimat', 'Buku ini kelihatan menarik.', '["この","ほん","は","おもしろ","そうです","。"]', 'このほんはおもしろそうです。'),
(31, 'susun_kalimat', 'Kelihatannya akan turun hujan.', '["あめ","が","ふり","そうです","。"]', 'あめがふりそうです。'),
(31, 'susun_kalimat', 'Dia kelihatan lelah.', '["かれ","は","つかれている","ようです","。"]', 'かれはつかれているようです。'),
(31, 'susun_kalimat', 'Masakan ini kelihatan pedas.', '["この","りょうり","は","から","そうです","。"]', 'このりょうりはからそうです。'),
(31, 'susun_kalimat', 'Film itu kelihatan membosankan.', '["あの","えいが","は","つまらな","そうです","。"]', 'あのえいがはつまらなそうです。'),
(31, 'susun_kalimat', 'Tas ini kelihatan mahal.', '["この","かばん","は","たか","そうです","。"]', 'このかばんはたかそうです。'),

-- ===== BAB 32: 〜すぎる (too much) =====
(32, 'susun_kalimat', 'Saya terlalu banyak makan.', '["たべ","すぎ","ました","。"]', 'たべすぎました。'),
(32, 'susun_kalimat', 'Pekerjaan ini terlalu sulit.', '["この","しごと","は","むずかし","すぎます","。"]', 'このしごとはむずかしすぎます。'),
(32, 'susun_kalimat', 'Kemarin saya terlalu banyak minum.', '["きのう","のみ","すぎ","ました","。"]', 'きのうのみすぎました。'),
(32, 'susun_kalimat', 'Harganya terlalu mahal.', '["ねだん","が","たか","すぎます","。"]', 'ねだんがたかすぎます。'),
(32, 'susun_kalimat', 'Ruang ini terlalu sempit.', '["この","へや","は","せま","すぎます","。"]', 'このへやはせますぎます。'),
(32, 'susun_kalimat', 'Dia terlalu banyak bicara.', '["かれ","は","はなし","すぎます","。"]', 'かれははなしすぎます。'),
(32, 'susun_kalimat', 'Soal ini terlalu sulit.', '["この","もんだい","は","むずかし","すぎます","。"]', 'このもんだいはむずかしすぎます。'),
(32, 'susun_kalimat', 'Kemarin saya terlalu banyak tidur.', '["きのう","ね","すぎ","ました","。"]', 'きのうねすぎました。'),

-- ===== BAB 33: 〜ば／〜と (conditional) =====
(33, 'susun_kalimat', 'Kalau musim semi tiba, cuaca jadi hangat.', '["はる","に","なる","と","あたたかく","なります","。"]', 'はるになるとあたたかくなります。'),
(33, 'susun_kalimat', 'Kalau ada uang, saya pergi.', '["おかね","が","あれ","ば","いきます","。"]', 'おかねがあればいきます。'),
(33, 'susun_kalimat', 'Kalau ada waktu, saya bisa membantu.', '["じかん","が","あれ","ば","てつだえます","。"]', 'じかんがあればてつだえます。'),
(33, 'susun_kalimat', 'Kalau menekan tombol ini, mesin bergerak.', '["この","ボタン","を","おす","と","うごきます","。"]', 'このボタンをおすとうごきます。'),
(33, 'susun_kalimat', 'Kalau belok kiri, ada stasiun.', '["ひだり","へ","まがる","と","えき","が","あります","。"]', 'ひだりへまがるとえきがあります。'),
(33, 'susun_kalimat', 'Kalau belajar setiap hari, jadi pintar.', '["まいにち","べんきょう","すれ","ば","じょうず","に","なります","。"]', 'まいにちべんきょうすればじょうずになります。'),
(33, 'susun_kalimat', 'Kalau minum obat, sembuh.', '["くすり","を","のめ","ば","なおります","。"]', 'くすりをのめばなおります。'),
(33, 'susun_kalimat', 'Kalau besok hujan, ditunda.', '["あした","あめ","が","ふれ","ば","ちゅうし","です","。"]', 'あしたあめがふればちゅうしです。'),

-- ===== BAB 34: 〜たら／〜ても (even if) =====
(34, 'susun_kalimat', 'Kalau turun hujan, saya tidak pergi.', '["あめ","が","ふっ","たら","いきません","。"]', 'あめがふったらいきません。'),
(34, 'susun_kalimat', 'Kalau besok cerah, pergi ke pantai.', '["あした","はれ","たら","うみ","へ","いきます","。"]', 'あしたはれたらうみへいきます。'),
(34, 'susun_kalimat', 'Bahkan kalau dia datang, saya tunggu.', '["かれ","が","き","ても","まちます","。"]', 'かれがきてもまちます。'),
(34, 'susun_kalimat', 'Bahkan kalau mahal, saya beli.', '["たかく","ても","かいます","。"]', 'たかくてもかいます。'),
(34, 'susun_kalimat', 'Bahkan kalau ada waktu, saya tidak pergi.', '["じかん","が","あっ","ても","いきません","。"]', 'じかんがあってもいきません。'),
(34, 'susun_kalimat', 'Bahkan kalau besok hujan, saya pergi.', '["あした","あめ","でも","いきます","。"]', 'あしたあめでもいきます。'),
(34, 'susun_kalimat', 'Bahkan guru bilang, saya tidak dengar.', '["せんせい","が","いっ","ても","ききません","。"]', 'せんせいがいてもききません。'),
(34, 'susun_kalimat', 'Bahkan kalau pergi sekarang, tidak akan sampai.', '["いま","から","いっ","ても","まにあいません","。"]', 'いまからいってもまにあいません。'),

-- ===== BAB 35: 〜たい／〜たがる (want) =====
(35, 'susun_kalimat', 'Saya ingin pergi ke Jepang.', '["わたし","は","にほん","へ","いき","たい","です","。"]', 'わたしはにほんへいきたいです。'),
(35, 'susun_kalimat', 'Dia ingin makan kue.', '["かのじょ","は","ケーキ","を","たべ","たがって","います","。"]', 'かのじょはケーキをたべたがっています。'),
(35, 'susun_kalimat', 'Saya ingin menonton film.', '["わたし","は","えいが","を","み","たい","です","。"]', 'わたしはえいがをみたいです。'),
(35, 'susun_kalimat', 'Anak-anak ingin bermain.', '["こども","たち","は","あそび","たがって","います","。"]', 'こどもたちはあそびたがっています。'),
(35, 'susun_kalimat', 'Dia ingin membeli mobil baru.', '["かれ","は","あたらしい","くるま","を","かい","たがって","います","。"]', 'かれはあたらしいくるまをかいたがっています。'),
(35, 'susun_kalimat', 'Saya ingin pergi ke Kyoto.', '["わたし","は","きょうと","へ","いき","たい","です","。"]', 'わたしはきょうとへいきたいです。'),
(35, 'susun_kalimat', 'Kakak perempuan ingin belajar di luar negeri.', '["あね","は","りゅうがく","し","たがって","います","。"]', 'あねはりゅうがくしたがっています。'),
(35, 'susun_kalimat', 'Saya ingin makan tempura.', '["わたし","は","てんぷら","を","たべ","たい","です","。"]', 'わたしはてんぷらをたべたいです。'),

-- ===== BAB 36: 〜ように (purpose) =====
(36, 'susun_kalimat', 'Saya pergi ke depan supaya kelihatan jelas.', '["よく","みえる","ように","まえ","に","いきました","。"]', 'よくみえるようにまえにいきました。'),
(36, 'susun_kalimat', 'Ayo berangkat lebih awal supaya tidak terlambat.', '["おくれ","ない","ように","はやく","でかけましょう","。"]', 'おくれないようにはやくでかけましょう。'),
(36, 'susun_kalimat', 'Hati-hati supaya tidak masuk angin.', '["かぜ","を","ひか","ない","ように","きをつけて","ください","。"]', 'かぜをひかないようにきをつけてください。'),
(36, 'susun_kalimat', 'Saya catat supaya tidak lupa.', '["わすれ","ない","ように","メモ","します","。"]', 'わすれないようにメモします。'),
(36, 'susun_kalimat', 'Saya belajar supaya bisa lulus.', '["ごうかく","できる","ように","べんきょう","します","。"]', 'ごうかくできるようにべんきょうします。'),
(36, 'susun_kalimat', 'Saya berangkat lebih awal supaya tidak terlambat.', '["まにあう","ように","はやく","でます","。"]', 'まにあうようにはやくでます。'),
(36, 'susun_kalimat', 'Saya buru-buru supaya naik kereta.', '["でんしゃ","に","まにあう","ように","いそぎます","。"]', 'でんしゃにまにあうようにいそぎます。'),
(36, 'susun_kalimat', 'Hati-hati supaya tidak ketinggalan barang.', '["わすれもの","を","し","ない","ように","きをつけます","。"]', 'わすれものをしないようにきをつけます。'),

-- ===== BAB 37: 〜ばかり (just did) =====
(37, 'susun_kalimat', 'Saya baru saja makan.', '["ごはん","を","たべた","ばかり","です","。"]', 'ごはんをたべたばかりです。'),
(37, 'susun_kalimat', 'Saya baru saja pulang.', '["いま","かえった","ばかり","です","。"]', 'いまかえったばかりです。'),
(37, 'susun_kalimat', 'Saya baru saja membeli kemarin.', '["きのう","かった","ばかり","です","。"]', 'きのうかったばかりです。'),
(37, 'susun_kalimat', 'Saya baru saja membaca buku ini.', '["この","ほん","を","よんだ","ばかり","です","。"]', 'このほんをよんだばかりです。'),
(37, 'susun_kalimat', 'Saya baru saja tiba.', '["さっき","ついた","ばかり","です","。"]', 'さっきついたばかりです。'),
(37, 'susun_kalimat', 'Padahal baru saja dibeli minggu lalu, sudah rusak.', '["せんしゅう","かった","ばかり","なのに","こわれました","。"]', 'せんしゅうかったばかりなのにこわれました。'),
(37, 'susun_kalimat', 'Saya baru saja menelepon.', '["さっき","でんわ","した","ばかり","です","。"]', 'さっきでんわしたばかりです。'),
(37, 'susun_kalimat', 'Dia baru saja pergi.', '["かれ","は","でかけた","ばかり","です","。"]', 'かれはでかけたばかりです。'),

-- ===== BAB 38: 〜のに (although) =====
(38, 'susun_kalimat', 'Meskipun sudah belajar, tidak lulus.', '["べんきょう","した","のに","ごうかく","しません","でした","。"]', 'べんきょうしたのにごうかくしませんでした。'),
(38, 'susun_kalimat', 'Meskipun murah, tidak beli.', '["やすい","のに","かいません","。"]', 'やすいのにかいません。'),
(38, 'susun_kalimat', 'Meskipun belajar setiap hari, tidak pintar.', '["まいにち","べんきょう","している","のに","じょうず","に","なりません","。"]', 'まいにちべんきょうしているのにじょうずになりません。'),
(38, 'susun_kalimat', 'Meskipun pergi lebih awal, tidak sempat.', '["はやく","いった","のに","まにあいません","でした","。"]', 'はやくいったのにまにあいませんでした。'),
(38, 'susun_kalimat', 'Meskipun dia datang, tidak bertemu.', '["かれ","が","きた","のに","あえません","でした","。"]', 'かれがきたのにあえませんでした'),
(38, 'susun_kalimat', 'Meskipun membeli kamus, tidak dipakai.', '["じしょ","を","かった","のに","つかいません","。"]', 'じしょをかったのに つかいません。'),
(38, 'susun_kalimat', 'Meskipun dekat, tidak pergi.', '["ちかい","のに","いきません","。"]', 'ちかいのにいきません。'),
(38, 'susun_kalimat', 'Meskipun minum obat, tidak sembuh.', '["くすり","を","のんだ","のに","なおりません","。"]', 'くすりをのんだのに なおりません。'),

-- ===== BAB 39: 〜てから (after doing) =====
(39, 'susun_kalimat', 'Setelah pulang ke rumah, saya belajar.', '["いえ","に","かえって","から","べんきょう","します","。"]', 'いえにかえってからべんきょうします。'),
(39, 'susun_kalimat', 'Setelah pergi ke rumah sakit, saya belanja.', '["びょういん","へ","いって","から","かいもの","します","。"]', 'びょういんへいってからかいものします。'),
(39, 'susun_kalimat', 'Setelah makan, saya pergi.', '["ごはん","を","たべて","から","でかけます","。"]', 'ごはんをたべてからでかけます。'),
(39, 'susun_kalimat', 'Setelah sekolah selesai, saya bermain.', '["がっこう","が","おわって","から","あそびます","。"]', 'がっこうがおわってからあそびます。'),
(39, 'susun_kalimat', 'Setelah mandi, saya tidur.', '["ふろ","に","はいって","から","ねます","。"]', 'ふろにはいってからねます。'),
(39, 'susun_kalimat', 'Setelah pergi ke perpustakaan, saya belajar.', '["としょかん","へ","いって","から","べんきょう","します","。"]', 'としょかんへいってからべんきょうします。'),
(39, 'susun_kalimat', 'Setelah turun bus, saya berjalan.', '["バス","を","おりて","から","あるきます","。"]', 'バスをおりてからあるきます。'),
(39, 'susun_kalimat', 'Setelah pulang ke rumah, saya mengerjakan PR.', '["うち","に","かえって","から","しゅくだい","を","します","。"]', 'うちにかえってからしゅくだいをします。'),

-- ===== BAB 40: 〜ことにする (decide to) =====
(40, 'susun_kalimat', 'Saya memutuskan untuk berolahraga setiap hari.', '["まいにち","うんどう","する","こと","に","しました","。"]', 'まいにちうんどうすることにしました。'),
(40, 'susun_kalimat', 'Saya memutuskan untuk pergi ke rumah sakit besok.', '["あした","びょういん","へ","いく","こと","に","します","。"]', 'あしたびょういんへいくことにします。'),
(40, 'susun_kalimat', 'Saya memutuskan berhenti merokok.', '["タバコ","を","やめる","こと","に","しました","。"]', 'タバコをやめることにしました。'),
(40, 'susun_kalimat', 'Saya memutuskan menikah tahun depan.', '["らいねん","けっこん","する","こと","に","しました","。"]', 'らいねんけっこんすることにしました。'),
(40, 'susun_kalimat', 'Saya memutuskan membeli mobil.', '["くるま","を","かう","こと","に","しました","。"]', 'くるまをかうことにしました。'),
(40, 'susun_kalimat', 'Saya memutuskan pindah rumah bulan depan.', '["らいげつ","ひっこす","こと","に","しました","。"]', 'らいげつひっこすことにしました。'),
(40, 'susun_kalimat', 'Saya memutuskan belajar bahasa Jepang.', '["にほんご","を","べんきょう","する","こと","に","しました","。"]', 'にほんごをべんきょうすることにしました。'),
(40, 'susun_kalimat', 'Saya memutuskan pergi ke Tokyo.', '["とうきょう","へ","いく","こと","に","しました","。"]', 'とうきょうへいくことにしました。'),

-- ===== BAB 41: 〜れる／〜られる (potential) =====
(41, 'susun_kalimat', 'Saya bisa berbicara bahasa Jepang.', '["わたし","は","にほんご","が","はなせます","。"]', 'わたしはにほんごがはなせます。'),
(41, 'susun_kalimat', 'Saya bisa membaca huruf Kanji.', '["わたし","は","かんじ","が","よめます","。"]', 'わたしはかんじがよめます。'),
(41, 'susun_kalimat', 'Di sini bisa berenang.', '["ここ","で","およげます","。"]', 'ここでおよげます。'),
(41, 'susun_kalimat', 'Saya bisa menyetir mobil.', '["わたし","は","くるま","の","うんてん","が","できます","。"]', 'わたしはくるまのうんてんができます。'),
(41, 'susun_kalimat', 'Di perpustakaan ini bisa meminjam buku.', '["この","としょかん","で","ほん","を","かりられます","。"]', 'このとしょかんでほんをかりられます。'),
(41, 'susun_kalimat', 'Saya bisa bermain piano.', '["わたし","は","ピアノ","が","ひけます","。"]', 'わたしはピアノがひけます。'),
(41, 'susun_kalimat', 'Di sini bisa merokok.', '["ここ","で","タバコ","が","すえます","。"]', 'ここでタバコがすえます。'),
(41, 'susun_kalimat', 'Saya tidak bisa menulis huruf dengan baik.', '["わたし","は","じ","が","あまり","かけません","。"]', 'わたしはじがあまりかけません。'),

-- ===== BAB 42: 〜れる／〜られる (passive) =====
(42, 'susun_kalimat', 'Saya dipuji oleh guru.', '["わたし","は","せんせい","に","ほめられました","。"]', 'わたしはせんせいにほめられました。'),
(42, 'susun_kalimat', 'Saya dimarahi oleh ibu.', '["わたし","は","はは","に","しかられました","。"]', 'わたしはははにしかられました。'),
(42, 'susun_kalimat', 'Saya digigit anjing.', '["わたし","は","いぬ","に","かまれました","。"]', 'わたしはいぬにかまれました。'),
(42, 'susun_kalimat', 'Saya ditertawakan teman.', '["わたし","は","ともだち","に","わらわれました","。"]', 'わたしはともだちにわらわれました。'),
(42, 'susun_kalimat', 'Saya diundang oleh dia.', '["わたし","は","かれ","に","しょうたい","されました","。"]', 'わたしはかれにしょうたいされました。'),
(42, 'susun_kalimat', 'Saya kehujanan.', '["わたし","は","あめ","に","ふられました","。"]', 'わたしはあめにふられました。'),
(42, 'susun_kalimat', 'Saya dipanggil oleh direktur.', '["わたし","は","ぶちょう","に","よばれました","。"]', 'わたしはぶちょうによばれました。'),
(42, 'susun_kalimat', 'Saya diperhatikan semua orang.', '["わたし","は","みんな","に","ちゅうもく","されました","。"]', 'わたしはみんなにちゅうもくされました。'),

-- ===== BAB 43: 〜させる (causative) =====
(43, 'susun_kalimat', 'Ibu menyuruh saya mengerjakan PR.', '["はは","は","わたし","に","しゅくだい","を","させました","。"]', 'はははわたしにしゅくだいをさせました。'),
(43, 'susun_kalimat', 'Guru menyuruh murid membaca buku.', '["せんせい","は","せいと","に","ほん","を","よませました","。"]', 'せんせいはせいとにほんをよませました。'),
(43, 'susun_kalimat', 'Ayah menyuruh saya belajar piano.', '["ちち","は","わたし","に","ピアノ","を","ならわせました","。"]', 'ちちはわたしにピアノをならわせました。'),
(43, 'susun_kalimat', 'Direktur menyuruh karyawan bekerja.', '["しゃちょう","は","しゃいん","を","はたらかせました","。"]', 'しゃちょうはしゃいんをはたらかせました。'),
(43, 'susun_kalimat', 'Ibu menyuruh anak makan sayur.', '["はは","は","こども","に","やさい","を","たべさせました","。"]', 'はははこどもにやさいをたべさせました。'),
(43, 'susun_kalimat', 'Guru menyuruh murid lari.', '["せんせい","は","せいと","を","はしらせました","。"]', 'せんせいはせいとをはしらせました。'),
(43, 'susun_kalimat', 'Dia membuat saya menunggu.', '["かれ","は","わたし","を","またせました","。"]', 'かれはわたしをまたせました。'),
(43, 'susun_kalimat', 'Ibu menyuruh saya membersihkan kamar.', '["はは","は","わたし","に","へや","を","そうじ","させました","。"]', 'はははわたしにへやをそうじさせました。'),

-- ===== BAB 44: 〜させられる (causative-passive) =====
(44, 'susun_kalimat', 'Saya disuruh ibu mengerjakan PR.', '["わたし","は","はは","に","しゅくだい","を","させられました","。"]', 'わたしはははにしゅくだいをさせられました。'),
(44, 'susun_kalimat', 'Saya disuruh guru berdiri di koridor.', '["わたし","は","せんせい","に","ろうか","に","たたされました","。"]', 'わたしはせんせいにろうかにたたされました。'),
(44, 'susun_kalimat', 'Saya disuruh ayah membantu.', '["わたし","は","ちち","に","てつだい","を","させられました","。"]', 'わたしはちちにてつだいをさせられました。'),
(44, 'susun_kalimat', 'Saya disuruh atasan lembur.', '["わたし","は","じょうし","に","ざんぎょう","させられました","。"]', 'わたしはじょうしにざんぎょうさせられました。'),
(44, 'susun_kalimat', 'Saya disuruh ibu membereskan kamar.', '["わたし","は","はは","に","へや","を","かたづけ","させられました","。"]', 'わたしはははにへやをかたづけさせられました。'),
(44, 'susun_kalimat', 'Saya disuruh guru memperbaiki karangan.', '["わたし","は","せんせい","に","さくぶん","を","なおさせられました","。"]', 'わたしはせんせいにさくぶんをなおさせられました。'),
(44, 'susun_kalimat', 'Saya dibuat menunggu lama oleh dia.', '["わたし","は","かれ","に","ちょうじかん","またされました","。"]', 'わたしはかれにちょうじかんまたされました。'),
(44, 'susun_kalimat', 'Saya disuruh ayah belajar.', '["わたし","は","ちち","に","べんきょう","させられました","。"]', 'わたしはちちにべんきょうさせられました。'),

-- ===== BAB 45: 〜てくれる／〜てもらう =====
(45, 'susun_kalimat', 'Teman meminjami saya buku.', '["ともだち","が","ほん","を","かして","くれました","。"]', 'ともだちがほんをかしてくれました。'),
(45, 'susun_kalimat', 'Saya diajari bahasa Jepang oleh guru.', '["わたし","は","せんせい","に","にほんご","を","おしえて","もらいました","。"]', 'わたしはせんせいににほんごをおしえてもらいました。'),
(45, 'susun_kalimat', 'Ibu mengirimkan saya sweter.', '["はは","が","セーター","を","おくって","くれました","。"]', 'ははがセーターをおくってくれました。'),
(45, 'susun_kalimat', 'Saya diantar teman sampai stasiun.', '["わたし","は","ともだち","に","えき","まで","おくって","もらいました","。"]', 'わたしはともだちにえきまでおくってもらいました。'),
(45, 'susun_kalimat', 'Dia membantu saya.', '["かのじょ","が","てつだって","くれました","。"]', 'かのじょがてつだってくれました。'),
(45, 'susun_kalimat', 'Saya diundang ke pesta oleh teman.', '["わたし","は","かれ","に","パーティー","に","しょうたいして","もらいました","。"]', 'わたしはかれにパーティーにしょうたいしてもらいました。'),
(45, 'susun_kalimat', 'Ayah meminjamkan saya mobil.', '["ちち","が","くるま","を","かして","くれました","。"]', 'ちちがくるまをかしてくれました。'),
(45, 'susun_kalimat', 'Saya diajari bahasa Inggris oleh dia.', '["わたし","は","かのじょ","に","えいご","を","おしえて","もらいました","。"]', 'わたしはかのじょにえいごをおしえてもらいました。'),

-- ===== BAB 46: 敬語 (honorific — てくださる／ていただく) =====
(46, 'susun_kalimat', 'Guru meminjamkan saya buku.', '["せんせい","が","ほん","を","かして","くださいました","。"]', 'せんせいがほんをかしてくださいました。'),
(46, 'susun_kalimat', 'Saya mendapat surat rekomendasi dari guru.', '["わたし","は","せんせい","に","すいせんじょう","を","かいて","いただきました","。"]', 'わたしはせんせいにすいせんじょうをかいていただきました。'),
(46, 'susun_kalimat', 'Direktur menjelaskan untuk saya.', '["ぶちょう","が","せつめい","して","くださいました","。"]', 'ぶちょうがせつめいしてくださいました。'),
(46, 'susun_kalimat', 'Saya diterima oleh direktur.', '["わたし","は","しゃちょう","に","あって","いただきました","。"]', 'わたしはしゃちょうにあっていただきました。'),
(46, 'susun_kalimat', 'Tamu datang ke sini.', '["おきゃくさま","が","きて","くださいました","。"]', 'おきゃくさまがきてくださいました。'),
(46, 'susun_kalimat', 'Saya diantar guru sampai pintu.', '["わたし","は","せんせい","に","みおくって","いただきました","。"]', 'わたしはせんせいにみおくっていただきました。'),
(46, 'susun_kalimat', 'Direktur berbicara.', '["しゃちょう","が","おはなし","して","くださいました","。"]', 'しゃちょうがおはなししてくださいました。'),
(46, 'susun_kalimat', 'Saya diperkenalkan oleh profesor.', '["わたし","は","きょうじゅ","に","しょうかい","して","いただきました","。"]', 'わたしはきょうじゅにしょうかいしていただきました。'),

-- ===== BAB 47: 〜そうです (hearsay review) =====
(47, 'susun_kalimat', 'Menurut ramalan cuaca, besok cerah.', '["てんきよほう","に","よると","あした","は","はれる","そうです","。"]', 'てんきよほうによるとあしたははれるそうです。'),
(47, 'susun_kalimat', 'Katanya dia menikah bulan depan.', '["かれ","は","らいげつ","けっこん","する","そうです","。"]', 'かれはらいげつけっこんするそうです。'),
(47, 'susun_kalimat', 'Katanya restoran ini enak.', '["この","みせ","は","おいしい","そうです","。"]', 'このみせはおいしいそうです。'),
(47, 'susun_kalimat', 'Katanya tahun depan akan ada stasiun baru.', '["らいねん","あたらしい","えき","が","できる","そうです","。"]', 'らいねんあたらしいえきができるそうです。'),
(47, 'susun_kalimat', 'Katanya dia akan belajar di luar negeri.', '["かのじょ","は","りゅうがく","する","そうです","。"]', 'かのじょはりゅうがくするそうです。'),
(47, 'susun_kalimat', 'Katanya film itu menarik.', '["あの","えいが","は","おもしろい","そうです","。"]', 'あのえいがはおもしろいそうです。'),
(47, 'susun_kalimat', 'Katanya besok akan turun hujan.', '["あした","あめ","が","ふる","そうです","。"]', 'あしたあめがふるそうです。'),
(47, 'susun_kalimat', 'Katanya dia lulus universitas.', '["かれ","は","だいがく","に","ごうかく","した","そうです","。"]', 'かれはだいがくにごうかくしたそうです。'),

-- ===== BAB 48: 〜ように言う (quoting) =====
(48, 'susun_kalimat', 'Guru bilang supaya datang lebih awal.', '["せんせい","が","はやく","くる","ように","いいました","。"]', 'せんせいがはやくくるようにいいました。'),
(48, 'susun_kalimat', 'Ibu bilang supaya makan sayur.', '["はは","が","やさい","を","たべる","ように","いいました","。"]', 'ははがやさいをたべるようにいいました。'),
(48, 'susun_kalimat', 'Dia bilang supaya saya menunggu.', '["かれ","は","わたし","に","まつ","ように","いいました","。"]', 'かれはわたしにまつようにいいました。'),
(48, 'susun_kalimat', 'Dokter bilang supaya berhenti merokok.', '["いしゃ","が","タバコ","を","やめる","ように","いいました","。"]', 'いしゃがタバコをやめるようにいいました。'),
(48, 'susun_kalimat', 'Ayah bilang supaya belajar.', '["ちち","が","べんきょう","する","ように","いいました","。"]', 'ちちがべんきょうするようにいいました。'),
(48, 'susun_kalimat', 'Atasan bilang supaya mengumpulkan laporan.', '["じょうし","が","ほうこくしょ","を","だす","ように","いいました","。"]', 'じょうしがほうこくしょをだすようにいいました。'),
(48, 'susun_kalimat', 'Dia bilang supaya saya menjemputnya.', '["かのじょ","が","むかえ","に","いく","ように","いいました","。"]', 'かのじょがむかえにいくようにいいました。'),
(48, 'susun_kalimat', 'Dokter bilang supaya istirahat.', '["いしゃ","が","あんせい","する","ように","いいました","。"]', 'いしゃがあんせいするようにいいました。'),

-- ===== BAB 49: 敬語 (honorific — お〜になる) =====
(49, 'susun_kalimat', 'Guru sudah pulang.', '["せんせい","が","おかえり","に","なりました","。"]', 'せんせいがおかえりになりました。'),
(49, 'susun_kalimat', 'Direktur bersabda.', '["しゃちょう","が","おっしゃいました","。"]', 'しゃちょうがおっしゃいました。'),
(49, 'susun_kalimat', 'Tamu sudah datang.', '["おきゃくさま","が","おみえ","に","なりました","。"]', 'おきゃくさまがおみえになりました。'),
(49, 'susun_kalimat', 'Ini buku yang ditulis oleh guru.', '["せんせい","が","おかき","に","なった","ほん","です","。"]', 'せんせいがおかきになったほんです。'),
(49, 'susun_kalimat', 'Direktur sudah membaca.', '["ぶちょう","は","およみ","に","なりました","か","？"]', 'ぶちょうはおよみになりましたか？'),
(49, 'susun_kalimat', 'Direktur sudah berbicara.', '["しゃちょう","が","おはなし","に","なりました","。"]', 'しゃちょうがおはなしになりました。'),
(49, 'susun_kalimat', 'Seperti yang guru katakan.', '["せんせい","が","おっしゃった","とおり","です","。"]', 'せんせいがおっしゃったとおりです。'),
(49, 'susun_kalimat', 'Tamu sudah pulang.', '["おきゃくさま","が","おかえり","に","なりました","。"]', 'おきゃくさまがおかえりになりました。'),

-- ===== BAB 50: 敬語 (humble — お〜する／ご〜します) =====
(50, 'susun_kalimat', 'Saya yang akan mengantar.', '["わたし","が","ごあんない","します","。"]', 'わたしがごあんないします。'),
(50, 'susun_kalimat', 'Saya yang akan membawakan.', '["わたし","が","おもち","します","。"]', 'わたしがおもちします。'),
(50, 'susun_kalimat', 'Saya yang akan mengirimkan.', '["わたし","が","おとどけ","します","。"]', 'わたしがおとどけします。'),
(50, 'susun_kalimat', 'Besok saya akan menelepon.', '["あした","おでんわ","します","。"]', 'あしたおでんわします。'),
(50, 'susun_kalimat', 'Saya yang akan memanggil.', '["わたし","が","および","します","。"]', 'わたしがおよびします。'),
(50, 'susun_kalimat', 'Saya yang akan mengirimkan kepada guru.', '["わたし","は","せんせい","に","おおくり","します","。"]', 'わたしはせんせいにおおくりします。'),
(50, 'susun_kalimat', 'Saya yang akan membantu.', '["わたし","が","おてつだい","します","。"]', 'わたしがおてつだいします'),
(50, 'susun_kalimat', 'Nanti akan saya hubungi.', '["ごれんらく","します","。"]', 'ごれんらくします。');