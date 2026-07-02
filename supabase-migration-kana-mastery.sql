-- ═══════════════════════════════════════════════════════════
-- DEL-JAPAN LEARN — Kana Mastery Enhancement Migration
-- ═══════════════════════════════════════════════════════════
-- Problem: Tidak ada tracking mastery per karakter kana
-- Solution: Table user_kana_mastery + mastery calculation
-- ═══════════════════════════════════════════════════════════

-- 1. Create user_kana_mastery table
CREATE TABLE IF NOT EXISTS user_kana_mastery (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    kana_id BIGINT REFERENCES kana(id) ON DELETE CASCADE,
    category TEXT NOT NULL CHECK (category IN ('hiragana_basic', 'hiragana_dakuten', 'hiragana_combo', 'katakana_basic', 'katakana_dakuten', 'katakana_combo')),
    kana_character TEXT NOT NULL,
    romaji TEXT NOT NULL,
    mastery_level INT DEFAULT 0 CHECK (mastery_level >= 0 AND mastery_level <= 100),
    times_practiced INT DEFAULT 0,
    correct_count INT DEFAULT 0,
    wrong_count INT DEFAULT 0,
    last_practiced TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, kana_id)
);

-- 2. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_kana_mastery_user ON user_kana_mastery(user_id);
CREATE INDEX IF NOT EXISTS idx_user_kana_mastery_category ON user_kana_mastery(category);
CREATE INDEX IF NOT EXISTS idx_user_kana_mastery_mastery ON user_kana_mastery(mastery_level);

-- 3. Function to get kana mastery by category
CREATE OR REPLACE FUNCTION get_kana_mastery_by_category(
    p_user_id UUID,
    p_category TEXT
)
RETURNS TABLE (
    kana_id BIGINT,
    kana_character TEXT,
    romaji TEXT,
    mastery_level INT,
    times_practiced INT,
    accuracy NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        k.id,
        k.character::TEXT,
        k.romaji::TEXT,
        COALESCE(ukm.mastery_level, 0)::INT,
        COALESCE(ukm.times_practiced, 0)::INT,
        CASE 
            WHEN ukm.times_practiced > 0 THEN 
                ROUND((ukm.correct_count::NUMERIC / ukm.times_practiced::NUMERIC) * 100, 2)
            ELSE 0 
        END::NUMERIC
    FROM kana k
    LEFT JOIN user_kana_mastery ukm ON k.id = ukm.kana_id AND ukm.user_id = p_user_id
    WHERE k.category = p_category
    ORDER BY k.id;
END;
$$ LANGUAGE plpgsql;

-- 4. Function to get overall kana mastery for a user
CREATE OR REPLACE FUNCTION get_user_kana_overall_progress(p_user_id UUID)
RETURNS TABLE (
    total_kana BIGINT,
    mastered_count BIGINT,
    learning_count BIGINT,
    not_started_count BIGINT,
    overall_mastery NUMERIC,
    hiragana_mastery NUMERIC,
    katakana_mastery NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::BIGINT,
        COUNT(CASE WHEN ukm.mastery_level >= 80 THEN 1 END)::BIGINT,
        COUNT(CASE WHEN ukm.mastery_level > 0 AND ukm.mastery_level < 80 THEN 1 END)::BIGINT,
        COUNT(CASE WHEN ukm.mastery_level = 0 OR ukm.mastery_level IS NULL THEN 1 END)::BIGINT,
        ROUND(AVG(COALESCE(ukm.mastery_level, 0)), 2)::NUMERIC,
        ROUND(AVG(CASE WHEN k.category LIKE 'hiragana%' THEN COALESCE(ukm.mastery_level, 0) END), 2)::NUMERIC,
        ROUND(AVG(CASE WHEN k.category LIKE 'katakana%' THEN COALESCE(ukm.mastery_level, 0) END), 2)::NUMERIC
    FROM kana k
    LEFT JOIN user_kana_mastery ukm ON k.id = ukm.kana_id AND ukm.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- 5. Function to update kana mastery
CREATE OR REPLACE FUNCTION update_kana_mastery(
    p_user_id UUID,
    p_kana_id BIGINT,
    p_correct BOOLEAN
)
RETURNS void AS $$
DECLARE
    v_current_mastery INT;
    v_new_mastery INT;
    v_times_practiced INT;
    v_correct_count INT;
    v_wrong_count INT;
BEGIN
    -- Get current stats
    SELECT 
        COALESCE(mastery_level, 0),
        COALESCE(times_practiced, 0),
        COALESCE(correct_count, 0),
        COALESCE(wrong_count, 0)
    INTO v_current_mastery, v_times_practiced, v_correct_count, v_wrong_count
    FROM user_kana_mastery
    WHERE user_id = p_user_id AND kana_id = p_kana_id;

    -- Calculate new mastery
    IF p_correct THEN
        v_new_mastery := LEAST(100, v_current_mastery + 10);
        v_correct_count := v_correct_count + 1;
    ELSE
        v_new_mastery := GREATEST(0, v_current_mastery - 5);
        v_wrong_count := v_wrong_count + 1;
    END IF;

    v_times_practiced := v_times_practiced + 1;

    -- Upsert record
    INSERT INTO user_kana_mastery (user_id, kana_id, mastery_level, times_practiced, correct_count, wrong_count, last_practiced)
    VALUES (p_user_id, p_kana_id, v_new_mastery, v_times_practiced, v_correct_count, v_wrong_count, now())
    ON CONFLICT (user_id, kana_id) 
    DO UPDATE SET 
        mastery_level = EXCLUDED.mastery_level,
        times_practiced = EXCLUDED.times_practiced,
        correct_count = EXCLUDED.correct_count,
        wrong_count = EXCLUDED.wrong_count,
        last_practiced = EXCLUDED.last_practiced,
        updated_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Function to get weak kana (mastery < 50)
CREATE OR REPLACE FUNCTION get_weak_kana(p_user_id UUID)
RETURNS TABLE (
    kana_id BIGINT,
    kana_character TEXT,
    romaji TEXT,
    category TEXT,
    mastery_level INT,
    times_practiced INT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        k.id,
        k.character::TEXT,
        k.romaji::TEXT,
        k.category::TEXT,
        COALESCE(ukm.mastery_level, 0)::INT,
        COALESCE(ukm.times_practiced, 0)::INT
    FROM kana k
    LEFT JOIN user_kana_mastery ukm ON k.id = ukm.kana_id AND ukm.user_id = p_user_id
    WHERE COALESCE(ukm.mastery_level, 0) < 50
    ORDER BY COALESCE(ukm.mastery_level, 0) ASC, k.id
    LIMIT 10;
END;
$$ LANGUAGE plpgsql;

-- 7. Auto-update trigger for updated_at
CREATE OR REPLACE FUNCTION update_kana_mastery_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_kana_mastery_timestamp ON user_kana_mastery;
CREATE TRIGGER trg_kana_mastery_timestamp
    BEFORE UPDATE ON user_kana_mastery
    FOR EACH ROW
    EXECUTE FUNCTION update_kana_mastery_timestamp();

-- 8. RLS Policies
ALTER TABLE user_kana_mastery ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own kana mastery" ON user_kana_mastery;
CREATE POLICY "Users can read own kana mastery" ON user_kana_mastery
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own kana mastery" ON user_kana_mastery;
CREATE POLICY "Users can manage own kana mastery" ON user_kana_mastery
    FOR ALL USING (auth.uid() = user_id);

-- 9. Grant permissions (commented out to avoid error)
-- GRANT SELECT ON FUNCTION get_kana_mastery_by_category TO authenticated;
-- GRANT SELECT ON FUNCTION get_user_kana_overall_progress TO authenticated;
-- GRANT EXECUTE ON FUNCTION update_kana_mastery TO authenticated;
-- GRANT SELECT ON FUNCTION get_weak_kana TO authenticated;

-- ═══════════════════════════════════════════════════════════
-- USAGE EXAMPLES:
-- ═══════════════════════════════════════════════════════════
-- Get mastery by category:
--   SELECT * FROM get_kana_mastery_by_category('user-uuid', 'hiragana_basic');
-- Get overall progress:
--   SELECT * FROM get_user_kana_overall_progress('user-uuid');
-- Update mastery after practice:
--   SELECT update_kana_mastery('user-uuid', 1, true);
-- Get weak kana for review:
--   SELECT * FROM get_weak_kana('user-uuid');
-- ═══════════════════════════════════════════════════════════
