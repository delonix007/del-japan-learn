'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';

// 60 JFT Basic-style questions across 5 sections
const sections = [
  {
    id: 'moji', label: '文字・語彙', icon: '🈳', duration: 10,
    desc: 'Pilih bacaan huruf / arti yang benar',
    questions: [
      { q: '「本」の読み方は？', a: 'ほん', opts: ['ほん', 'こん', 'はん', 'もん'] },
      { q: '「先生」の意味は？', a: 'Guru', opts: ['Dokter', 'Guru', 'Murid', 'Karyawan'] },
      { q: '「車」の読み方は？', a: 'くるま', opts: ['くろま', 'くるま', 'かろま', 'こるま'] },
      { q: '「大きい」の反対は？', a: '小さい', opts: ['小さい', '新しい', '古い', '安い'] },
      { q: '「英語」の「英」の読み方は？', a: 'えい', opts: ['えい', 'おう', 'よう', 'あい'] },
      { q: '「図書館」の読み方は？', a: 'としょかん', opts: ['としょかん', 'ずしょかん', 'つしょかん', 'としょうかん'] },
      { q: '「勉強」の意味は？', a: 'Belajar', opts: ['Bekerja', 'Belajar', 'Bermain', 'Berjalan'] },
      { q: '「駅」の読み方は？', a: 'えき', opts: ['えき', 'てき', 'へき', 'せき'] },
      { q: '「電話」の読み方は？', a: 'でんわ', opts: ['でんわ', 'てんわ', 'でわ', 'てわ'] },
      { q: '「料理」の意味は？', a: 'Masakan', opts: ['Makanan', 'Masakan', 'Minuman', 'Cemilan'] },
      { q: '「買い物」の読み方は？', a: 'かいもの', opts: ['かいもの', 'かうもの', 'かりもの', 'かいも'] },
      { q: '「出口」の反対は？', a: '入口', opts: ['入口', '窓口', '戸口', '門口'] },
    ]
  },
  {
    id: 'goi', label: '語彙', icon: '📖', duration: 10,
    desc: 'Pilih kata yang paling tepat untuk kalimat',
    questions: [
      { q: '毎朝、———を飲みます。', a: 'コーヒー', opts: ['コーヒー', 'テレビ', '新聞', 'ラジオ'] },
      { q: '———で映画を見ます。', a: '映画館', opts: ['映画館', '図書館', '公園', '病院'] },
      { q: '母は———で働いています。', a: '病院', opts: ['病院', '銀行', '会社', '学校'] },
      { q: 'すみません、———はどこですか。', a: 'トイレ', opts: ['トイレ', '駅', '本屋', '出口'] },
      { q: 'この———はいくらですか。', a: 'かばん', opts: ['かばん', '先生', '学生', '友達'] },
      { q: '父は———に勤めています。', a: '会社', opts: ['家', '会社', '店', '学校'] },
      { q: '———をください。', a: '水', opts: ['水', '木', '火', '金'] },
      { q: '———が好きです。', a: '猫', opts: ['猫', '机', '窓', '町'] },
      { q: '明日、———に行きます。', a: '京都', opts: ['京都', '今日', '今週', '去年'] },
      { q: '———でご飯を食べます。', a: 'レストラン', opts: ['教室', 'レストラン', '会社', '会議室'] },
      { q: 'この———はとても面白いです。', a: '本', opts: ['本', '花', '犬', '山'] },
      { q: '———を勉強しています。', a: '日本語', opts: ['日本語', '食堂', '運動', '映画'] },
    ]
  },
  {
    id: 'bunpou', label: '文法', icon: '📐', duration: 10,
    desc: 'Pilih partikel / bentuk kata yang benar',
    questions: [
      { q: 'わたし———学生です。', a: 'は', opts: ['は', 'が', 'を', 'に'] },
      { q: '水———ください。', a: 'を', opts: ['は', 'が', 'を', 'で'] },
      { q: '駅———行きます。', a: 'へ', opts: ['へ', 'を', 'で', 'と'] },
      { q: '毎朝８時———起きます。', a: 'に', opts: ['に', 'へ', 'を', 'で'] },
      { q: '田中さん———電話しました。', a: 'に', opts: ['に', 'を', 'が', 'へ'] },
      { q: 'ここ———名前を書いてください。', a: 'に', opts: ['に', 'で', 'を', 'が'] },
      { q: '銀行———お金を借りました。', a: 'から', opts: ['から', 'まで', 'より', 'ほど'] },
      { q: '今日は昨日———暑いです。', a: 'より', opts: ['より', 'から', 'まで', 'ほど'] },
      { q: 'この料理———作れますか。', a: 'が', opts: ['が', 'を', 'に', 'で'] },
      { q: '日本語———話せます。', a: 'が', opts: ['を', 'が', 'に', 'で'] },
      { q: '日本———３年住んでいました。', a: 'に', opts: ['に', 'を', 'へ', 'で'] },
      { q: '明日———試験があります。', a: 'は', opts: ['は', 'が', 'を', 'に'] },
    ]
  },
  {
    id: 'dokkai', label: '読解', icon: '📖', duration: 15,
    desc: 'Baca teks dan jawab pertanyaan',
    questions: [
      { q: '「すみません、駅はどこですか。」「まっすぐ行って、右に曲がってください。」駅に行くには？', a: 'まっすぐ行って右に曲がる', opts: ['まっすぐ行って右に曲がる', '右に行ってまっすぐ', 'まっすぐ行って左に曲がる', '左に行ってまっすぐ'] },
      { q: '「この本はとても面白いです。先週買いました。」この本はいつ買いましたか。', a: '先週', opts: ['先週', '今日', '昨日', '来週'] },
      { q: '「山田さんは毎朝ジョギングをします。それからシャワーを浴びて会社に行きます。」山田さんはまず何をしますか。', a: 'ジョギング', opts: ['ジョギング', 'シャワー', '会社に行く', '朝ご飯'] },
      { q: '「私の母は有名な料理人です。毎日美味しい料理を作ってくれます。」母の仕事は？', a: '料理人', opts: ['料理人', '先生', '医者', '会社員'] },
      { q: '「昨日、友達と映画を見ました。その後、レストランで晩ご飯を食べました。」昨日何をしましたか。', a: '映画を見てご飯を食べた', opts: ['映画を見てご飯を食べた', '映画だけ見た', 'ご飯だけ食べた', '何もしなかった'] },
      { q: '「日本では、家に入る前に靴を脱ぎます。」日本ではどうしますか。', a: '靴を脱ぐ', opts: ['靴を脱ぐ', '靴を履く', '靴を洗う', '靴を買う'] },
      { q: '「このレストランは安くて美味しいです。でも週末はとても混みます。」週末はどうですか。', a: '混む', opts: ['混む', '安い', '美味しい', '空いている'] },
      { q: '「鈴木さんは親切で、よく手伝ってくれます。」鈴木さんはどんな人ですか。', a: '親切な人', opts: ['親切な人', '忙しい人', '静かな人', '厳しい人'] },
    ]
  },
  {
    id: 'kaiwa', label: '会話', icon: '💬', duration: 15,
    desc: 'Pilih respon yang paling tepat untuk percakapan',
    questions: [
      { q: '「お元気ですか。」→ ?', a: 'はい、元気です', opts: ['はい、元気です', 'はい、そうです', 'いいえ、違います', 'おやすみなさい'] },
      { q: '「ありがとうございます。」→ ?', a: 'どういたしまして', opts: ['どういたしまして', 'ごめんなさい', 'いただきます', 'いってきます'] },
      { q: '「お先に失礼します。」→ ?', a: 'お疲れ様です', opts: ['お疲れ様です', 'おやすみなさい', 'いただきます', 'ごちそうさま'] },
      { q: '「いただきます。」→ ?', a: 'ごちそうさま', opts: ['ごちそうさま', 'おやすみ', 'おはよう', 'こんばんは'] },
      { q: '「すみません、遅れました。」→ ?', a: 'いいえ、大丈夫です', opts: ['いいえ、大丈夫です', 'そうです', 'そうですか', 'おかげさまで'] },
      { q: '「明日、一緒に映画を見ませんか。」→ ?', a: 'はい、いいですね', opts: ['はい、いいですね', 'はい、そうです', 'いいえ、違います', 'さようなら'] },
      { q: '「これはいくらですか。」→ ?', a: '500円です', opts: ['500円です', '5つです', '5人です', '5階です'] },
      { q: '「お手洗いはどこですか。」→ ?', a: 'あちらです', opts: ['あちらです', 'こちらです', 'どちらですか', 'あれです'] },
      { q: '「何を勉強していますか。」→ ?', a: '日本語を勉強しています', opts: ['日本語を勉強しています', '学生です', '東京に住んでいます', '本を読んでいます'] },
    ]
  }
];

export default function JFTSimulation() {
  const router = useRouter();
  const { user, loading } = useAuthStore();
  const [screen, setScreen] = useState<'start' | 'test' | 'result'>('start');
  const [sectionIdx, setSectionIdx] = useState(0);
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(3600); // 60 min
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) router.push('/auth?mode=login');
  }, [user, loading]);

  // Timer
  useEffect(() => {
    if (screen !== 'test' || showResult) return;
    const t = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) { clearInterval(t); finishTest(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [screen, showResult]);

  const allQuestions = sections.flatMap((s) => s.questions.map((q) => ({ ...q, sectionId: s.id })));

  const currentSection = sections[sectionIdx];
  const totalSections = sections.length;
  const sectionProgress = allQuestions.filter((q) => answers[q.q] !== undefined).length;

  const handleAnswer = (qText: string, answer: string) => {
    const newAnswers = { ...answers, [qText]: answer };
    setAnswers(newAnswers);

    // Auto-advance after answering
    const sQ = currentSection.questions;
    if (qIdx < sQ.length - 1) {
      setTimeout(() => setQIdx((i) => i + 1), 300);
    } else if (sectionIdx < totalSections - 1) {
      setTimeout(() => {
        setSectionIdx((i) => i + 1);
        setQIdx(0);
      }, 500);
    } else {
      // Last question answered
      setTimeout(() => finishTest(), 500);
    }
  };

  const finishTest = () => {
    setShowResult(true);
    setScreen('result');
    // Calculate score
    let correct = 0;
    allQuestions.forEach((q) => {
      if (answers[q.q] === q.a) correct++;
    });
    return correct;
  };

  const calculateScore = () => {
    let correct = 0;
    allQuestions.forEach((q) => {
      if (answers[q.q] === q.a) correct++;
    });
    const total = allQuestions.length;
    const pct = correct / total;
    const scaled = Math.round(pct * 300); // JFT scale 0-300
    let level: string, color: string;
    if (scaled >= 200) { level = 'A1 — Beginner High'; color = 'text-green-500'; }
    else if (scaled >= 100) { level = 'A2 — Elementary'; color = 'text-yellow-500'; }
    else { level = 'Below A1 — Basic'; color = 'text-red-500'; }
    return { correct, total, scaled, level, color };
  };

  const fmtTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  if (loading) return <div className="p-8 text-center text-[var(--color-text-muted)]">Loading...</div>;

  // START SCREEN
  if (screen === 'start') {
    return (
      <div className="min-h-screen bg-[var(--bg-app)] flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-5 text-center">
          <div className="text-5xl">📝</div>
          <h1 className="text-2xl font-bold">Simulasi Ujian JFT Basic</h1>
          <div className="bg-[var(--bg-card)] rounded-2xl p-5 border border-[var(--color-border)] text-left space-y-2 text-sm">
            <p className="font-medium">📋 Informasi Tes:</p>
            <div className="text-[var(--color-text-muted)] space-y-1">
              <p>⏱ Durasi: 60 menit</p>
              <p>📖 {allQuestions.length} soal</p>
              <p>📚 5 sesi: 文字・語彙, 語彙, 文法, 読解, 会話</p>
              <p>🎯 Skala nilai: 0–300</p>
            </div>
            <div className="mt-3 p-3 bg-yellow-600/10 rounded-xl text-yellow-500 text-xs">
              ⚡ Jawaban akan otomatis tersimpan. Timer berjalan setelah mulai.
            </div>
          </div>
          <button onClick={() => { setScreen('test'); setTimeLeft(3600); }}
            className="w-full py-4 bg-[var(--color-primary)] text-white font-bold rounded-xl text-lg hover:brightness-110 transition-all">
            🚀 Mulai Simulasi
          </button>
          <Link href="/dashboard" className="block text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)]">Kembali</Link>
        </div>
      </div>
    );
  }

  // RESULT SCREEN
  if (screen === 'result') {
    const res = calculateScore();
    return (
      <div className="min-h-screen bg-[var(--bg-app)] flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-5 text-center">
          <div className="text-5xl">{res.scaled >= 200 ? '🎉' : res.scaled >= 100 ? '💪' : '📚'}</div>
          <h1 className="text-2xl font-bold">Hasil Simulasi</h1>
          <div className="bg-[var(--bg-card)] rounded-2xl p-6 border border-[var(--color-border)] space-y-3">
            <div className="text-5xl font-extrabold text-[var(--color-primary)]">{res.scaled}</div>
            <div className="text-sm text-[var(--color-text-muted)]">dari 300 poin</div>
            <div className={`font-bold text-lg ${res.color}`}>{res.level}</div>
            <div className="text-sm">✅ {res.correct}/{res.total} jawaban benar</div>
            <div className="bg-[var(--color-surface-2)] rounded-full h-2 mt-2">
              <div className="bg-[var(--color-primary)] h-full rounded-full" style={{ width: `${(res.correct / res.total) * 100}%` }} />
            </div>
            <div className="grid grid-cols-5 gap-1 mt-3">
              {allQuestions.map((q, i) => {
                const correct = answers[q.q] === q.a;
                return <div key={i} className={`h-1.5 rounded-full ${answers[q.q] ? (correct ? 'bg-green-500' : 'bg-red-500') : 'bg-[var(--color-border)]'}`} />;
              })}
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => { setScreen('start'); setAnswers({}); setSectionIdx(0); setQIdx(0); setShowResult(false); }}
              className="flex-1 py-3 bg-[var(--color-primary)] text-white font-bold rounded-xl hover:brightness-110">
              Ulang Simulasi
            </button>
            <Link href="/dashboard" className="flex-1 py-3 bg-[var(--color-surface-2)] rounded-xl font-bold text-center">
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // TEST SCREEN
  const sq = currentSection.questions[qIdx];
  if (!sq) return null;

  return (
    <div className="min-h-screen bg-[var(--bg-app)]">
      {/* Top bar */}
      <header className="sticky top-0 bg-[var(--bg-card)] border-b border-[var(--color-border)]">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/dashboard" className="text-sm text-[var(--color-text-muted)]">✕</Link>
          <span className="text-sm font-bold">{fmtTime(timeLeft)}</span>
          <span className="text-xs text-[var(--color-text-muted)]">{sectionProgress}/{allQuestions.length}</span>
        </div>
        {/* Section tabs */}
        <div className="max-w-lg mx-auto px-4 flex gap-1 pb-2 overflow-x-auto">
          {sections.map((s, i) => (
            <div key={s.id}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] whitespace-nowrap ${
                i === sectionIdx ? 'bg-[var(--color-primary)]/20 text-[var(--color-primary)]' : 'text-[var(--color-text-muted)]'
              }`}>
              {s.icon} {s.label}
            </div>
          ))}
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-5">
        {/* Section Header */}
        <div className="mb-4">
          <p className="text-xs text-[var(--color-text-muted)]">Sesi {sectionIdx + 1}/{totalSections}</p>
          <h2 className="font-bold text-lg">{currentSection.icon} {currentSection.label}</h2>
          <p className="text-xs text-[var(--color-text-muted)]">{currentSection.desc}</p>
        </div>

        {/* Question card */}
        <div className="bg-[var(--bg-card)] rounded-2xl p-5 border border-[var(--color-border)] mb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-[var(--color-text-muted)]">Soal {qIdx + 1}/{currentSection.questions.length}</span>
            <span className="text-[10px] text-[var(--color-text-muted)]">
              Total: {sectionIdx * currentSection.questions.length + qIdx + 1}/{allQuestions.length}
            </span>
          </div>
          <p className="text-lg font-medium mb-5 leading-relaxed">{sq.q}</p>
          <div className="space-y-2">
            {sq.opts.map((opt, i) => (
              <button key={i} onClick={() => handleAnswer(sq.q, opt)}
                className={`w-full p-3.5 rounded-xl border-2 text-left font-medium transition-all ${
                  answers[sq.q] === opt
                    ? (opt === sq.a ? 'border-green-500 bg-green-600/10' : 'border-red-500 bg-red-600/10')
                    : 'border-[var(--color-border)] bg-[var(--color-surface-2)] hover:border-[var(--color-primary)]'
                }`}>
                <span className="font-bold mr-2">{['A', 'B', 'C', 'D'][i]}.</span> {opt}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
