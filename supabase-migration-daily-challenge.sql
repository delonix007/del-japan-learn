-- ═══════════════════════════════════════════════════════════
-- DEL-JAPAN LEARN — Daily Challenge System Migration
-- ═══════════════════════════════════════════════════════════
-- Problem: Tidak ada challenge harian untuk engagement
-- Solution: Table daily_challenges + user_daily_progress
-- ═══════════════════════════════════════════════════════════

-- 1. Create daily_challenges table (admin-defined challenges)
CREATE TABLE IF NOT EXISTS daily_challenges (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    challenge_type TEXT NOT NULL CHECK (challenge_type IN ('vocab', 'kana', 'bunpou', 'kanji', 'listening', 'reading')),
    difficulty TEXT NOT NULL DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
    exp_reward INT NOT NULL DEFAULT 50,
    item_count INT NOT NULL DEFAULT 10,
    items JSONB NOT NULL DEFAULT '[]', -- Array of question items
    starts_at DATE NOT NULL DEFAULT CURRENT_DATE,
    ends_at DATE NOT NULL DEFAULT (CURRENT_DATE + INTERVAL '1 day'),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create user_daily_challenges table (user progress)
CREATE TABLE IF NOT EXISTS user_daily_challenges (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    challenge_id BIGINT REFERENCES daily_challenges(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'failed')),
    score INT DEFAULT 0,
    correct_count INT DEFAULT 0,
    total_attempts INT DEFAULT 0,
    exp_earned INT DEFAULT 0,
    started_at TIMESTAMPTZ DEFAULT now(),
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, challenge_id)
);

-- 3. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_daily_challenges_active ON daily_challenges(is_active, starts_at, ends_at);
CREATE INDEX IF NOT EXISTS idx_user_daily_challenges_user ON user_daily_challenges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_daily_challenges_challenge ON user_daily_challenges(challenge_id);

-- 4. Function to get today's active challenges
CREATE OR REPLACE FUNCTION get_todays_challenges()
RETURNS TABLE (
    id BIGINT,
    title TEXT,
    description TEXT,
    challenge_type TEXT,
    difficulty TEXT,
    exp_reward INT,
    item_count INT,
    items JSONB,
    is_completed BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        dc.id,
        dc.title,
        dc.description,
        dc.challenge_type,
        dc.difficulty,
        dc.exp_reward,
        dc.item_count,
        dc.items,
        CASE WHEN udc.id IS NOT NULL AND udc.status = 'completed' THEN true ELSE false END
    FROM daily_challenges dc
    LEFT JOIN user_daily_challenges udc ON dc.id = udc.challenge_id AND udc.user_id = auth.uid()
    WHERE dc.is_active = true 
      AND dc.starts_at <= CURRENT_DATE 
      AND dc.ends_at >= CURRENT_DATE
    ORDER BY dc.difficulty, dc.id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Function to start a challenge
CREATE OR REPLACE FUNCTION start_daily_challenge(p_challenge_id BIGINT)
RETURNS BIGINT AS $$
DECLARE
    v_user_challenge_id BIGINT;
BEGIN
    -- Check if already started/completed
    SELECT id INTO v_user_challenge_id 
    FROM user_daily_challenges 
    WHERE user_id = auth.uid() AND challenge_id = p_challenge_id;

    IF v_user_challenge_id IS NOT NULL THEN
        RETURN v_user_challenge_id;
    END IF;

    -- Create new challenge record
    INSERT INTO user_daily_challenges (user_id, challenge_id, status)
    VALUES (auth.uid(), p_challenge_id, 'in_progress')
    RETURNING id INTO v_user_challenge_id;

    RETURN v_user_challenge_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Function to complete a challenge with score
CREATE OR REPLACE FUNCTION complete_daily_challenge(
    p_challenge_id BIGINT,
    p_score INT,
    p_correct_count INT,
    p_total_attempts INT
)
RETURNS TABLE (
    exp_earned INT,
    challenge_completed BOOLEAN
) AS $$
DECLARE
    v_exp_reward INT;
    v_exp_earned INT;
    v_user_challenge_id BIGINT;
BEGIN
    -- Get challenge reward
    SELECT exp_reward INTO v_exp_reward 
    FROM daily_challenges 
    WHERE id = p_challenge_id;

    -- Calculate EXP (base reward * performance ratio)
    IF p_total_attempts > 0 THEN
        v_exp_earned := ROUND(v_exp_reward::NUMERIC * (p_correct_count::NUMERIC / p_total_attempts::NUMERIC))::INT;
    ELSE
        v_exp_earned := 0;
    END IF;

    -- Update challenge record
    UPDATE user_daily_challenges 
    SET 
        status = 'completed',
        score = p_score,
        correct_count = p_correct_count,
        total_attempts = p_total_attempts,
        exp_earned = v_exp_earned,
        completed_at = now(),
        updated_at = now()
    WHERE user_id = auth.uid() AND challenge_id = p_challenge_id
    RETURNING id INTO v_user_challenge_id;

    IF v_user_challenge_id IS NULL THEN
        -- Create new record if not exists
        INSERT INTO user_daily_challenges (user_id, challenge_id, status, score, correct_count, total_attempts, exp_earned, completed_at)
        VALUES (auth.uid(), p_challenge_id, 'completed', p_score, p_correct_count, p_total_attempts, v_exp_earned, now())
        RETURNING id INTO v_user_challenge_id;
    END IF;

    -- Add EXP to user profile (via existing function or direct update)
    -- This assumes there's a function add_user_exp or similar
    -- If not, we can create one

    RETURN QUERY SELECT v_exp_earned, (v_user_challenge_id IS NOT NULL) AS challenge_completed;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Function to get user's daily challenge stats
CREATE OR REPLACE FUNCTION get_user_daily_stats(p_user_id UUID, p_days INT DEFAULT 7)
RETURNS TABLE (
    date DATE,
    challenges_completed INT,
    total_exp_earned INT,
    best_score INT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        d.starts_at::DATE,
        COUNT(udc.id)::INT,
        COALESCE(SUM(udc.exp_earned), 0)::INT,
        COALESCE(MAX(udc.score), 0)::INT
    FROM daily_challenges d
    LEFT JOIN user_daily_challenges udc ON d.id = udc.challenge_id 
        AND udc.user_id = p_user_id 
        AND udc.status = 'completed'
    WHERE d.starts_at >= (CURRENT_DATE - INTERVAL '%s days', p_days)
      AND d.starts_at <= CURRENT_DATE
    GROUP BY d.starts_at
    ORDER BY d.starts_at DESC;
END;
$$ LANGUAGE plpgsql;

-- 8. RLS Policies
ALTER TABLE daily_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_daily_challenges ENABLE ROW LEVEL SECURITY;

-- Daily challenges: everyone can read active ones
DROP POLICY IF EXISTS "Anyone can read active challenges" ON daily_challenges;
CREATE POLICY "Anyone can read active challenges" ON daily_challenges
    FOR SELECT USING (is_active = true);

-- User daily challenges: users can only read/write their own
DROP POLICY IF EXISTS "Users can read own daily challenges" ON user_daily_challenges;
CREATE POLICY "Users can read own daily challenges" ON user_daily_challenges
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own daily challenges" ON user_daily_challenges;
CREATE POLICY "Users can manage own daily challenges" ON user_daily_challenges
    FOR ALL USING (auth.uid() = user_id);

-- 9. Grant permissions (function sudah dibuat di step 4-7)
-- GRANT SELECT ON FUNCTION get_todays_challenges TO authenticated;
-- GRANT EXECUTE ON FUNCTION start_daily_challenge TO authenticated;
-- GRANT EXECUTE ON FUNCTION complete_daily_challenge TO authenticated;
-- GRANT SELECT ON FUNCTION get_user_daily_stats TO authenticated;

-- ═══════════════════════════════════════════════════════════
-- SEED DATA: Sample daily challenges
-- ═══════════════════════════════════════════════════════════
INSERT INTO daily_challenges (title, description, challenge_type, difficulty, exp_reward, item_count, items) VALUES
('Kosa Kata Harian', 'Tebak 10 kosakata bahasa Jepang hari ini!', 'vocab', 'easy', 30, 10, '[]'),
('Tantangan Kana', 'Tulis 15 hiragana/katakana dengan benar!', 'kana', 'medium', 50, 15, '[]'),
('Grammar Master', 'Lengkapi 8 kalimat dengan pola grammar yang tepat!', 'bunpou', 'hard', 80, 8, '[]')
ON CONFLICT DO NOTHING;
