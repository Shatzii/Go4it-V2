-- Add useful indexes; use IF NOT EXISTS patterns
-- Users table indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users (username);
CREATE INDEX IF NOT EXISTS idx_users_role ON users (role);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users (created_at);

-- Video analysis indexes
CREATE INDEX IF NOT EXISTS idx_video_analysis_user_created ON video_analysis (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_video_analysis_sport ON video_analysis (sport);
