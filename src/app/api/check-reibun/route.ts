import { NextRequest, NextResponse } from 'next/server';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_BASE_URL = process.env.OPENAI_BASE_URL || 'https://opencode.ai/zen/v1';

export async function POST(request: NextRequest) {
  try {
    const { sentence, pattern } = await request.json();

    if (!sentence?.trim()) {
      return NextResponse.json(
        { is_correct: false, correction: '', feedback: 'Kalimat kosong.' },
        { status: 400 }
      );
    }

    const systemPrompt = `Kamu adalah guru bahasa Jepang yang sangat ketat (strict). Tugasmu HANYA mengevaluasi satu kalimat bahasa Jepang yang dibuat oleh murid. 
Murid sedang belajar pola tata bahasa: ${pattern}.
Aturan evaluasi:
1. Periksa apakah kalimat tersebut menggunakan pola tata bahasa yang diminta dengan benar.
2. Periksa apakah ada kesalahan partikel, kosakata, atau struktur.
3. Jangan berikan balasan percakapan. Kembalikan respons murni dalam format JSON.

Format JSON yang WAJIB dikembalikan:
{
  "is_correct": boolean,
  "correction": "Kalimat yang benar (jika ada salah, kosongkan jika sudah benar)",
  "feedback": "Penjelasan singkat dalam bahasa Indonesia (maksimal 2 kalimat) mengapa salah atau konfirmasi jika benar."
}`;

    const response = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Evaluasi kalimat ini: "${sentence}"` },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.1,
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      console.error('[Reibun AI] API error:', response.status, response.statusText);
      return NextResponse.json(
        { is_correct: false, correction: '', feedback: 'Gagal menghubungi AI. Coba lagi.' },
        { status: 500 }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { is_correct: false, correction: '', feedback: 'Response kosong dari AI.' },
        { status: 500 }
      );
    }

    try {
      const parsed = JSON.parse(content);
      return NextResponse.json({
        is_correct: !!parsed.is_correct,
        correction: parsed.correction || '',
        feedback: parsed.feedback || 'Tidak ada feedback.',
      });
    } catch (parseError) {
      console.error('[Reibun AI] Parse error:', parseError, 'Content:', content);
      return NextResponse.json(
        { is_correct: false, correction: '', feedback: 'AI mengembalikan format tidak valid.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('[Reibun AI] Unexpected error:', error);
    return NextResponse.json(
      { is_correct: false, correction: '', feedback: 'Terjadi kesalahan. Coba lagi.' },
      { status: 500 }
    );
  }
}