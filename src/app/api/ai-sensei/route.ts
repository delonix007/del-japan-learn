import { NextRequest, NextResponse } from 'next/server';

const AI_API = process.env.AI_API_URL || 'http://127.0.0.1:20128/v1';
const AI_MODEL = process.env.AI_SENSEI_MODEL || 'oc/claude-sonnet-4';
const AI_API_KEY = process.env.AI_API_KEY;

// Smart fallback responses when API is unavailable
const fallbackResponses: Record<string, (msg: string, lesson?: string) => string> = {
  default: (msg, lesson) =>
    `Hmm, pertanyaan bagus! 🤔 Untuk pelajaran *${lesson || 'ini'}*, coba fokus dulu ke kosakata dasar dan pola grammar yang ada. Ulangi flashcard setiap hari — konsistensi lebih penting daripada durasi! 📚 Semangat! 💪`,

  'arti': (msg, lesson) =>
    `Lo nanya arti kata ya? 🔍 Coba cek di tab **Kosakata** pelajaran ini — semua vocab ada lengkap sama contoh kalimatnya. Kalo masih kurang, catet kata itu dan tanya di forum diskusi! 📝`,

  'grammar': (msg, lesson) =>
        `Pola grammar emang kadang bikin bingung 😅 Tapi ingat: bahasa Jepang itu rutinitas. Pelajari polanya dari tab **Bunpou**, trus langsung praktek lewat **Renshū** (latihan). Practice makes perfect! 🎯`,

  'tips': (msg, lesson) =>
    `Tips belajar dari AI Sensei: 📌\n1️⃣ **Active Recall** — balik flashcard sebelum lihat artinya\n2️⃣ **Spaced Repetition** — ulang materi yang udah lo pelajari 1 hari, 3 hari, 1 minggu setelahnya\n3️⃣ **Immersion** — tonton anime/drama Jepang dengan subtitle Jepang!\nSemangat terus! 🔥`,

  'hafal': (msg, lesson) =>
        `Biar cepet hafal, coba metode ini: 🧠\n1. Tulis kata Jepangnya 5x\n2. Ucapin keras-keras\n3. Bikin kalimat sendiri pake kata itu\n4. Minta AI Sensei (aku!) buat koreksi\nLo pasti bisa! 💪`,
};

function getResponseType(msg: string): string {
  const lower = msg.toLowerCase();
  if (lower.includes('arti') || lower.includes('meaning') || lower.includes('maksud') || lower.includes('terjemah')) return 'arti';
  if (lower.includes('grammar') || lower.includes('bunpou') || lower.includes('pola') || lower.includes('tata bahasa') || lower.includes('partikel')) return 'grammar';
  if (lower.includes('tips') || lower.includes('saran') || lower.includes('cara') || lower.includes('belajar') || lower.includes('efektif')) return 'tips';
  if (lower.includes('hafal') || lower.includes('ingat') || lower.includes('lupa') || lower.includes('hafalan') || lower.includes('memorize')) return 'hafal';
  return 'default';
}

export async function POST(req: NextRequest) {
  try {
    const { message, lessonTitle, kotoba, bunpou } = await req.json();
    const msgTrimmed = (message || '').trim();

    // First try: real API if key is configured
    if (AI_API_KEY) {
      const systemPrompt = `Kamu adalah AI Sensei, asisten belajar Bahasa Jepang yang ramah dan sabar.
Gaya bicara: casual Indonesia (pake "lo"/"gue" sesekali), semangat, pake emoji 👍
BANTU user memahami pelajaran "${lessonTitle || ''}".

Kosakata terkait: ${(kotoba || []).slice(0, 10).map((k: any) => `${k.kata_jepang} (${k.arti_indonesia})`).join(', ')}
Grammar terkait: ${(bunpou || []).slice(0, 5).map((b: any) => `${b.pola_grammar}: ${b.penjelasan?.slice(0, 80)}`).join(' | ')}

Jawab dengan: relevant, beri contoh, encourage. Max 3 paragraf.`;

      const response = await fetch(`${AI_API}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AI_API_KEY}`,
        },
        body: JSON.stringify({
          model: AI_MODEL,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message },
          ],
          max_tokens: 500,
          temperature: 0.7,
        }),
        signal: AbortSignal.timeout(15000),
      });

      if (response.ok) {
        const data = await response.json();
        const text = data.choices?.[0]?.message?.content;
        if (text) return NextResponse.json({ text });
      }
    }

    // Fallback: smart local response
    const responseType = getResponseType(msgTrimmed);
    const responder = fallbackResponses[responseType] || fallbackResponses.default;
    const text = responder(msgTrimmed, lessonTitle);

    return NextResponse.json({ text });
  } catch (error) {
    console.error('AI Sensei error:', error);
    // Final fallback
    return NextResponse.json({
      text: 'Maaf, AI Sensei sedang sibuk. Coba tanya lagi nanti ya! Atau cek tab Kosakata & Bunpou dulu 📚 Semangat! 💪',
    });
  }
}
