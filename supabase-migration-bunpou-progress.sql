-- ═══════════════════════════════════════════════════════════
-- DEL-JAPAN LEARN — Bunpou Progress Tracking Migration
-- ═══════════════════════════════════════════════════════════
-- Problem: Tidak ada tracking progress untuk tata bahasa
-- Solution: Table user_bunpou_progress + progress calculation
-- ═══════════════════════════════════════════════════════════

-- 1. Create user_bunpou_progress table
CREATE TABLE IF NOT EXISTS user_bunpou_progress (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    lesson_id BIGINT REFERENCES lessons(id) ON DELETE CASCADE,
    bunpou_id BIGINT REFERENCES bunpou(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'belum' CHECK (status IN ('belum', 'belajar', 'paham', 'hafal')),
    times_reviewed INT DEFAULT 0,
    last_reviewed TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, bunpou_id)
);

-- 2. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_bunpou_progress_user_id ON user_bunpou_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_bunpou_progress_lesson ON user_bunpou_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_user_bunpou_progress_status ON user_bunpou_progress(status);

-- 3. Function to get bunpou progress by lesson
CREATE OR REPLACE FUNCTION get_bunpou_progress_by_lesson(
    p_user_id UUID,
    p_lesson_id BIGINT
)
RETURNS TABLE (
    bunpou_id BIGINT,
    pola_grammar TEXT,
    status TEXT,
    times_reviewed INT,
    last_reviewed TIMESTAMPTZ,
    progress_pct NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        b.id,
        b.pola_grammar,
        COALESCE(upp.status, 'belum')::TEXT,
        COALESCE(upp.times_reviewed, 0)::INT,
        upp.last_reviewed,
        CASE COALESCE(upp.status, 'belum')
            WHEN 'belum' THEN 0
            WHEN 'belajar' THEN 25
            WHEN 'paham' THEN 60
            WHEN 'hafal' THEN 100
            ELSE 0
        END::NUMERIC
    FROM bunpou b
    LEFT JOIN user_bunpou_progress upp ON b.id = upp.bunpou_id AND upp.user_id = p_user_id
    WHERE b.lesson_id = p_lesson_id
    ORDER BY b.id;
END;
$$ LANGUAGE plpgsql;

-- 4. Function to get overall bunpou progress for a user
CREATE OR REPLACE FUNCTION get_user_bunpou_overall_progress(p_user_id UUID)
RETURNS TABLE (
    total_bunpou BIGINT,
    mastered_count BIGINT,
    learning_count BIGINT,
    not_started_count BIGINT,
    overall_pct NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::BIGINT,
        COUNT(CASE WHEN upp.status = 'hafal' THEN 1 END)::BIGINT,
        COUNT(CASE WHEN upp.status IN ('belajar', 'paham') THEN 1 END)::BIGINT,
        COUNT(CASE WHEN upp.status = 'belum' OR upp.status IS NULL THEN 1 END)::BIGINT,
        ROUND(
            AVG(
                CASE upp.status
                    WHEN 'belum' THEN 0
                    WHEN 'belajar' THEN 25
                    WHEN 'paham' THEN 60
                    WHEN 'hafal' THEN 100
                    ELSE 0
                END::NUMERIC
            ), 2
        )::NUMERIC
    FROM bunpou b
    LEFT JOIN user_bunpou_progress upp ON b.id = upp.bunpou_id AND upp.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- 5. Function to update bunpou progress (mark as learned)
CREATE OR REPLACE FUNCTION update_bunpou_progress(
    p_user_id UUID,
    p_bunpou_id BIGINT,
    p_status TEXT
)
RETURNS void AS $$
BEGIN
    INSERT INTO user_bunpou_progress (user_id, bunpou_id, status, times_reviewed, last_reviewed)
    VALUES (p_user_id, p_bunpou_id, p_status, 1, now())
    ON CONFLICT (user_id, bunpou_id) 
    DO UPDATE SET 
        status = EXCLUDED.status,
        times_reviewed = user_bunpou_progress.times_reviewed + 1,
        last_reviewed = now(),
        updated_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Auto-update trigger for updated_at
CREATE OR REPLACE FUNCTION update_bunpou_progress_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_bunpou_progress_timestamp ON user_bunpou_progress;
CREATE TRIGGER trg_bunpou_progress_timestamp
    BEFORE UPDATE ON user_bunpou_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_bunpou_progress_timestamp();

-- 7. RLS Policies
ALTER TABLE user_bunpou_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own bunpou progress" ON user_bunpou_progress;
CREATE POLICY "Users can read own bunpou progress" ON user_bunpou_progress
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own bunpou progress" ON user_bunpou_progress;
CREATE POLICY "Users can manage own bunpou progress" ON user_bunpou_progress
    FOR ALL USING (auth.uid() = user_id);

-- 8. Grant permissions (setelah function dibuat)
-- GRANT SELECT ON FUNCTION get_bunpou_progress_by_lesson TO authenticated;
-- GRANT SELECT ON FUNCTION get_user_bunpou_overall_progress TO authenticated;
-- GRANT EXECUTE ON FUNCTION update_bunpou_progress TO authenticated;

-- ═══════════════════════════════════════════════════════════
-- USAGE EXAMPLES:
-- ═══════════════════════════════════════════════════════════
-- Get progress for a lesson:
--   SELECT * FROM get_bunpou_progress_by_lesson('user-uuid', 1);
-- Get overall progress:
--   SELECT * FROM get_user_bunpou_overall_progress('user-uuid');
-- Mark a bunpou as learned:
--   SELECT update_bunpou_progress('user-uuid', 1, 'paham');
-- ═══════════════════════════════════════════════════════════
