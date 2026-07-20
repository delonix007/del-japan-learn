-- Admin users table (separate from Supabase Auth users)
CREATE TABLE admin_users (
  id BIGSERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  last_login TIMESTAMPTZ
);

-- RLS: Admin users only accessible via service role (no user access)
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin users - service role only" ON admin_users
  FOR ALL USING (auth.role() = 'service_role');

-- Insert default admin (password will be set via API)
INSERT INTO admin_users (username, email) VALUES ('delonix', 'admin@deljapan.local');