-- ═══════════════════════════════════════════════════════════
-- DEL-JAPAN LEARN — Sentence Engine Migration
-- ═══════════════════════════════════════════════════════════
-- Problem: Contoh kalimat statis, tidak ada adaptive difficulty
-- Solution: Tambah difficulty level ke vocab + example sentences
-- ═══════════════════════════════════════════════════════════

-- 1. Add difficulty column to kotoba (vocab) table
ALTER TABLE kotoba 
ADD COLUMN IF NOT EXISTS difficulty TEXT DEFAULT 'easy' 
CHECK (difficulty IN ('easy', 'medium', 'hard'));

-- 2. Add example sentence fields with romaji
ALTER TABLE kotoba 
ADD COLUMN IF NOT EXISTS contoh_romaji TEXT,
ADD COLUMN IF NOT EXISTS contoh_indonesia TEXT;

-- 3. Create sentence_engine view for easy querying
CREATE OR REPLACE VIEW sentence_engine AS
SELECT 
    k.id,
    k.kata_jepang,
    k.romaji,
    k.arti_indonesia,
    k.contoh_kalimat as contoh_jepang,
    k.contoh_romaji,
    k.contoh_indonesia,
    k.difficulty,
    k.lesson_id,
    l.nomor_pelajaran,
    l.book
FROM kotoba k
LEFT JOIN lessons l ON k.lesson_id = l.id
WHERE k.contoh_kalimat IS NOT NULL 
  AND k.contoh_kalimat != ''
ORDER BY 
    CASE k.difficulty 
        WHEN 'easy' THEN 1 
        WHEN 'medium' THEN 2 
        WHEN 'hard' THEN 3 
    END,
    l.nomor_pelajaran;

-- 4. Function to get sentences by difficulty
CREATE OR REPLACE FUNCTION get_sentences_by_difficulty(
    p_difficulty TEXT DEFAULT 'easy',
    p_lesson_id BIGINT DEFAULT NULL
)
RETURNS TABLE (
    kata_jepang TEXT,
    romaji TEXT,
    arti_indonesia TEXT,
    contoh_jepang TEXT,
    contoh_romaji TEXT,
    contoh_indonesia TEXT,
    difficulty TEXT,
    lesson_number INT,
    book TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        k.kata_jepang,
        k.romaji,
        k.arti_indonesia,
        k.contoh_kalimat::TEXT,
        k.contoh_romaji,
        k.contoh_indonesia,
        k.difficulty,
        l.nomor_pelajaran,
        l.book
    FROM kotoba k
    LEFT JOIN lessons l ON k.lesson_id = l.id
    WHERE k.contoh_kalimat IS NOT NULL 
      AND k.contoh_kalimat != ''
      AND k.difficulty = p_difficulty
      AND (p_lesson_id IS NULL OR k.lesson_id = p_lesson_id)
    ORDER BY l.nomor_pelajaran
    LIMIT 20;
END;
$$ LANGUAGE plpgsql;

-- 5. Function to get adaptive sentences based on user level
CREATE OR REPLACE FUNCTION get_adaptive_sentences(
    p_user_id UUID,
    p_lesson_id BIGINT DEFAULT NULL
)
RETURNS TABLE (
    kata_jepang TEXT,
    romaji TEXT,
    arti_indonesia TEXT,
    contoh_jepang TEXT,
    contoh_romaji TEXT,
    contoh_indonesia TEXT,
    difficulty TEXT,
    lesson_number INT,
    book TEXT
) AS $$
DECLARE
    v_user_level INT;
    v_difficulty TEXT;
BEGIN
    -- Get user level from EXP
    SELECT level INTO v_user_level
    FROM user_exp
    WHERE user_id = p_user_id;
    
    v_user_level := COALESCE(v_user_level, 1);
    
    -- Determine difficulty based on level
    IF v_user_level <= 5 THEN
        v_difficulty := 'easy';
    ELSIF v_user_level <= 15 THEN
        v_difficulty := 'medium';
    ELSE
        v_difficulty := 'hard';
    END IF;
    
    RETURN QUERY
    SELECT 
        k.kata_jepang,
        k.romaji,
        k.arti_indonesia,
        k.contoh_kalimat::TEXT,
        k.contoh_romaji,
        k.contoh_indonesia,
        k.difficulty,
        l.nomor_pelajaran,
        l.book
    FROM kotoba k
    LEFT JOIN lessons l ON k.lesson_id = l.id
    WHERE k.contoh_kalimat IS NOT NULL 
      AND k.contoh_kalimat != ''
      AND k.difficulty = v_difficulty
      AND (p_lesson_id IS NULL OR k.lesson_id = p_lesson_id)
    ORDER BY l.nomor_pelajaran
    LIMIT 20;
END;
$$ LANGUAGE plpgsql;

-- 6. Seed data: Update existing vocab with difficulty levels
-- Easy: Lessons 1-3 (basic vocabulary)
UPDATE kotoba 
SET difficulty = 'easy'
WHERE lesson_id IN (
    SELECT id FROM lessons WHERE nomor_pelajaran <= 3
)
AND contoh_kalimat IS NOT NULL 
AND contoh_kalimat != '';

-- Medium: Lessons 4-10 (intermediate vocabulary)
UPDATE kotoba 
SET difficulty = 'medium'
WHERE lesson_id IN (
    SELECT id FROM lessons WHERE nomor_pelajaran BETWEEN 4 AND 10
)
AND contoh_kalimat IS NOT NULL 
AND contoh_kalimat != '';

-- Hard: Lessons 11+ (advanced vocabulary)
UPDATE kotoba 
SET difficulty = 'hard'
WHERE lesson_id IN (
    SELECT id FROM lessons WHERE nomor_pelajaran > 10
)
AND contoh_kalimat IS NOT NULL 
AND contoh_kalimat != '';

-- 7. Grant permissions
GRANT SELECT ON sentence_engine TO authenticated;
GRANT EXECUTE ON FUNCTION get_sentences_by_difficulty TO authenticated;
GRANT EXECUTE ON FUNCTION get_adaptive_sentences TO authenticated;

-- ═══════════════════════════════════════════════════════════
-- USAGE EXAMPLES:
-- ═══════════════════════════════════════════════════════════
-- SELECT * FROM sentence_engine; -- All sentences
-- SELECT * FROM get_sentences_by_difficulty('easy'); -- Easy only
-- SELECT * FROM get_adaptive_sentences('user-uuid-here'); -- Based on user level
-- ═══════════════════════════════════════════════════════════
