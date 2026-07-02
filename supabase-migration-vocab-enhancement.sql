-- ═══════════════════════════════════════════════════════════
-- DEL-JAPAN LEARN — Vocab Example Enhancement Migration
-- ═══════════════════════════════════════════════════════════
-- Problem: Contoh kalimat vocab tidak ada romaji & audio
-- Solution: Add romaji + audio columns to kotoba table
-- ═══════════════════════════════════════════════════════════

-- 1. Add romaji and audio columns to kotoba table
ALTER TABLE kotoba ADD COLUMN IF NOT EXISTS contoh_romaji TEXT;
ALTER TABLE kotoba ADD COLUMN IF NOT EXISTS contoh_audio_url TEXT;

-- 2. Function to get kotoba with enhanced examples
CREATE OR REPLACE FUNCTION get_kotoba_with_examples(p_lesson_id BIGINT)
RETURNS TABLE (
    kotoba_id BIGINT,
    word TEXT,
    meaning TEXT,
    example_sentence TEXT,
    example_romaji TEXT,
    example_audio_url TEXT,
    pos TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        k.id,
        k.kata_jepang::TEXT,
        k.arti_indonesia::TEXT,
        k.contoh_kalimat::TEXT,
        k.contoh_romaji::TEXT,
        k.contoh_audio_url::TEXT,
        NULL::TEXT AS pos
    FROM kotoba k
    WHERE k.lesson_id = p_lesson_id
    ORDER BY k.id;
END;
$$ LANGUAGE plpgsql;

-- 3. Update kotoba examples with romaji (seed data for common words)
UPDATE kotoba 
SET contoh_romaji = CASE id
    WHEN 1 THEN 'Watashi wa gakusei desu.'
    WHEN 2 THEN 'Kore wa hon desu.'
    WHEN 3 THEN 'Nihongo o benkyou shiteimasu.'
    WHEN 4 THEN 'Kyō wa ii tenki desu.'
    WHEN 5 THEN 'Gakkō e ikimasu.'
    -- Add more as needed
END
WHERE id IN (1,2,3,4,5) AND contoh_romaji IS NULL;

-- 4. RLS Policies
-- (kotoba already has RLS from previous migrations)

-- 5. Grant permissions (commented out to avoid error)
-- GRANT SELECT ON FUNCTION get_kotoba_with_examples TO authenticated;

-- ═══════════════════════════════════════════════════════════
-- USAGE EXAMPLES:
-- ═══════════════════════════════════════════════════════════
-- Get kotoba with enhanced examples:
--   SELECT * FROM get_kotoba_with_examples(1);
-- ═══════════════════════════════════════════════════════════
