-- Database Performance Optimization Script
-- Run this to create indexes for better query performance

-- High priority indexes for critical queries

-- User authentication and lookup
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_username ON users(username);

-- Athletic data filtering
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_sport_graduation ON users(sport, graduation_year);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_gar_score ON users(gar_score) WHERE gar_score IS NOT NULL;

-- Video analysis performance
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_video_analysis_user_created ON video_analysis(user_id, created_at);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_video_analysis_sport ON video_analysis(sport);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_videos_user_sport ON videos(user_id, sport);

-- StarPath system
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_starpath_progress_user ON starpath_progress(user_id);

-- Medium priority indexes

-- Camp registrations
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_camp_registrations_user ON camp_registrations(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_camp_registrations_camp_status ON camp_registrations(camp_id, status);

-- Subscription management
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_subscription ON users(subscription_plan, subscription_status);

-- User activity tracking
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_last_login ON users(last_login_at) WHERE last_login_at IS NOT NULL;

-- Active users for performance
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_active_role ON users(is_active, role);

-- Composite indexes for common queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_active_sport_gar ON users(is_active, sport, gar_score) WHERE is_active = true AND gar_score IS NOT NULL;

-- Analysis: Update user GAR scores efficiently
CREATE OR REPLACE FUNCTION update_user_gar_scores()
RETURNS void AS $$
BEGIN
    WITH latest_analysis AS (
        SELECT 
            user_id,
            AVG(gar_score) as avg_gar_score,
            MAX(created_at) as last_analysis
        FROM video_analysis 
        WHERE created_at >= NOW() - INTERVAL '30 days'
          AND gar_score IS NOT NULL
        GROUP BY user_id
    )
    UPDATE users 
    SET 
        gar_score = latest_analysis.avg_gar_score,
        last_gar_analysis = latest_analysis.last_analysis
    FROM latest_analysis
    WHERE users.id = latest_analysis.user_id;
END;
$$ LANGUAGE plpgsql;