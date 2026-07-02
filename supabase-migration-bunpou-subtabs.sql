-- ═══════════════════════════════════════════════════════════
-- DEL-JAPAN LEARN — Bunpou Sub-tab Content Migration
-- ═══════════════════════════════════════════════════════════
-- Adds: struktur, fungsi, kesalahan, mirip columns to bunpou table
-- for MNN Learning-style 4-tab grammar view
-- ═══════════════════════════════════════════════════════════

ALTER TABLE bunpou
  ADD COLUMN IF NOT EXISTS struktur TEXT,
  ADD COLUMN IF NOT EXISTS fungsi TEXT,
  ADD COLUMN IF NOT EXISTS kesalahan TEXT,
  ADD COLUMN IF NOT EXISTS mirip TEXT;

COMMENT ON COLUMN bunpou.struktur IS 'Struktur/Kaidah: pola kalimat dan penjelasan struktural';
COMMENT ON COLUMN bunpou.fungsi IS 'Fungsi/Penggunaan: contoh kalimat dan penjelasan fungsi';
COMMENT ON COLUMN bunpou.kesalahan IS 'Kesalahan Umum: tips dan peringatan pola yang mirip';
COMMENT ON COLUMN bunpou.mirip IS 'Mirip: pola grammar yang mirip untuk perbandingan';

-- ponytail: nil columns stay nil, existing data (penjelasan/contoh) untouched.
-- new content comes from future seed scripts or admin UI.