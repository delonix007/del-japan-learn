-- ============================================================
-- EXP + STREAK SYSTEM — Run this in Supabase SQL Editor
-- ============================================================

-- 1. ADD_EXP function
CREATE OR REPLACE FUNCTION add_exp(p_user_id UUID, p_exp INT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_today DATE := CURRENT_DATE;
  v_yesterday DATE := v_today - 1;
BEGIN
  INSERT INTO user_exp (user_id, total_exp, level, streak_harian, last_streak_date)
  VALUES (p_user_id, p_exp, GREATEST(1, FLOOR(SQRT(p_exp::numeric / 50))::int + 1), 1, v_today)
  ON CONFLICT (user_id) DO UPDATE SET
    total_exp = user_exp.total_exp + p_exp,
    level = GREATEST(1, FLOOR(SQRT((user_exp.total_exp + p_exp)::numeric / 50))::int + 1),
    last_streak_date = CASE
      WHEN user_exp.last_streak_date IS NULL THEN v_today
      WHEN user_exp.last_streak_date = v_yesterday THEN v_today
      WHEN user_exp.last_streak_date = v_today THEN user_exp.last_streak_date
      ELSE v_today
    END,
    streak_harian = CASE
      WHEN user_exp.last_streak_date IS NULL THEN 1
      WHEN user_exp.last_streak_date = v_yesterday THEN user_exp.streak_harian + 1
      WHEN user_exp.last_streak_date = v_today THEN user_exp.streak_harian
      ELSE 1
    END;
END;
$$;

-- 2. CHECK_STREAK function — call on login to see if streak needs resetting
CREATE OR REPLACE FUNCTION check_streak(p_user_id UUID)
RETURNS TABLE(streak_harian INT, last_streak_date DATE)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_today DATE := CURRENT_DATE;
  v_yesterday DATE := v_today - 1;
  v_record user_exp%ROWTYPE;
BEGIN
  SELECT * INTO v_record FROM user_exp WHERE user_id = p_user_id;
  IF NOT FOUND THEN
    RETURN QUERY SELECT 0 AS streak_harian, NULL::DATE AS last_streak_date;
    RETURN;
  END IF;
  
  -- If last streak was before yesterday, reset to 0
  IF v_record.last_streak_date IS NOT NULL 
     AND v_record.last_streak_date < v_yesterday THEN
    UPDATE user_exp SET streak_harian = 0 
    WHERE user_id = p_user_id;
    RETURN QUERY SELECT 0 AS streak_harian, v_record.last_streak_date;
  ELSE
    RETURN QUERY SELECT v_record.streak_harian, v_record.last_streak_date;
  END IF;
END;
$$;
