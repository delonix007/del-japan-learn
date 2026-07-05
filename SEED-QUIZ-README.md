# Seed Quiz Questions Lessons 4-50

## File: `seed-quiz-4-50.sql`

File ini berisi INSERT statements untuk `quiz_questions` table, melengkapi semua 50 pelajaran dengan 6 jenis soal:
- 🎯 Tebak Partikel
- 📝 Susun Kalimat  
- ✍️ Isi Kalimat
- 🌐 Terjemahkan
- 🔗 Pasangkan
- 🖼️ Kuis Bergambar

Setiap pelajaran mendapat 4 soal (rotasi tipe).

## Cara Menjalankan

### Opsi 1: Supabase SQL Editor (Recommended)
1. Buka https://jhdrycdmifoctudnxvcz.supabase.co
2. Masuk ke **SQL Editor**
3. Copy-paste isi `seed-quiz-4-50.sql`
4. Klik **Run**

### Opsi 2: Via psql CLI
```bash
psql postgres://postgres:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres -f seed-quiz-4-50.sql
```

### Opsi 3: Via Supabase CLI
```bash
supabase db seed run --file seed-quiz-4-50.sql
```

## Verifikasi
Setelah dijalankan, cek di quiz page:
- Buka `/learn/[id]/quiz` untuk lesson 4-50
- Semua 6 tipe soal seharusnya tersedia

## Catatan
- Menggunakan `ON CONFLICT DO NOTHING` untuk menghindari duplicate
- `pilihan_jawaban` disimpan sebagai JSON string array
- `susun_kalimat` dan `pasangkan` menggunakan `NULL` untuk `pilihan_jawaban` (di-parse di client)
- `kuis_bergambar` menggunakan soal teks + gambar (gambar bisa ditambahkan nanti via `gambar_url`)
