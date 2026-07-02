-- ═══════════════════════════════════════════════════════════
-- DEL-JAPAN LEARN — Cloud Progress Sync Migration
-- ═══════════════════════════════════════════════════════════
-- Problem: localStorage domain-specific → ganti domain = progress hilang
-- Solution: Sync semua progress ke Supabase (JSONB blob)
-- ═══════════════════════════════════════════════════════════

-- 1. Extend user_progress table dengan JSONB blob untuk full state backup
ALTER TABLE user_progress 
ADD COLUMN IF NOT EXISTS progress_data JSONB DEFAULT '{}'::jsonb;

-- 2. Create table untuk menyimpan semua localStorage keys yang di-sync
CREATE TABLE IF NOT EXISTS user_cloud_sync (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    sync_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    last_sync TIMESTAMPTZ DEFAULT now(),
    sync_version INT DEFAULT 1
);

-- 3. Index untuk performance
CREATE INDEX IF NOT EXISTS idx_user_cloud_sync_user_id ON user_cloud_sync(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_data ON user_progress USING GIN (progress_data);

-- 4. Function untuk auto-upsert progress
CREATE OR REPLACE FUNCTION sync_user_progress()
RETURNS TRIGGER AS $$
BEGIN
    -- Update last_sync timestamp
    UPDATE user_cloud_sync 
    SET last_sync = now(),
        sync_version = sync_version + 1
    WHERE user_id = NEW.user_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. Trigger untuk auto-sync setiap user_progress berubah
DROP TRIGGER IF EXISTS trg_sync_progress ON user_progress;
CREATE TRIGGER trg_sync_progress
    AFTER INSERT OR UPDATE ON user_progress
    FOR EACH ROW
    EXECUTE FUNCTION sync_user_progress();

-- 6. Function untuk push progress dari localStorage ke cloud
CREATE OR REPLACE FUNCTION push_progress_to_cloud(
    p_user_id UUID,
    p_sync_data JSONB
)
RETURNS void AS $$
BEGIN
    INSERT INTO user_cloud_sync (user_id, sync_data, last_sync)
    VALUES (p_user_id, p_sync_data, now())
    ON CONFLICT (user_id) 
    DO UPDATE SET 
        sync_data = EXCLUDED.sync_data,
        last_sync = now(),
        sync_version = user_cloud_sync.sync_version + 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Function untuk pull progress dari cloud ke localStorage
CREATE OR REPLACE FUNCTION pull_progress_from_cloud(
    p_user_id UUID
)
RETURNS JSONB AS $$
DECLARE
    v_sync_data JSONB;
BEGIN
    SELECT sync_data INTO v_sync_data
    FROM user_cloud_sync
    WHERE user_id = p_user_id;
    
    RETURN COALESCE(v_sync_data, '{}'::jsonb);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. RLS Policies untuk user_cloud_sync
ALTER TABLE user_cloud_sync ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own cloud sync" ON user_cloud_sync;
CREATE POLICY "Users can read own cloud sync" ON user_cloud_sync
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can upsert own cloud sync" ON user_cloud_sync;
CREATE POLICY "Users can upsert own cloud sync" ON user_cloud_sync
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own cloud sync" ON user_cloud_sync;
CREATE POLICY "Users can update own cloud sync" ON user_cloud_sync
    FOR UPDATE USING (auth.uid() = user_id);

-- 9. Grant execute permission untuk functions
GRANT EXECUTE ON FUNCTION push_progress_to_cloud TO authenticated;
GRANT EXECUTE ON FUNCTION pull_progress_from_cloud TO authenticated;

-- ═══════════════════════════════════════════════════════════
-- USAGE EXAMPLES (Client-side):
-- ═══════════════════════════════════════════════════════════
-- Push: SELECT push_progress_to_cloud(auth.uid(), '{"mnn_learned": [...], "mnn_gamify": {...}}');
-- Pull: SELECT pull_progress_from_cloud(auth.uid());
-- ═══════════════════════════════════════════════════════════
