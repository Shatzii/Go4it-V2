// Database Migration for Advanced Social Media Engine Enterprise Features
// This script creates all necessary tables for enterprise-grade social media automation

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function runMigrations() {
  console.log('Starting database migrations for Advanced Social Media Engine...');

  try {
    // Create audit_events table
    console.log('Creating audit_events table...');
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS audit_events (
          id TEXT PRIMARY KEY,
          timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          user_id TEXT NOT NULL,
          action TEXT NOT NULL,
          resource TEXT NOT NULL,
          details JSONB,
          ip_address TEXT,
          user_agent TEXT,
          session_id TEXT,
          location JSONB,
          risk_score INTEGER,
          compliance_flags TEXT[],
          metadata JSONB,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        CREATE INDEX IF NOT EXISTS idx_audit_events_timestamp ON audit_events(timestamp);
        CREATE INDEX IF NOT EXISTS idx_audit_events_user_id ON audit_events(user_id);
        CREATE INDEX IF NOT EXISTS idx_audit_events_action ON audit_events(action);
        CREATE INDEX IF NOT EXISTS idx_audit_events_resource ON audit_events(resource);
        CREATE INDEX IF NOT EXISTS idx_audit_events_risk_score ON audit_events(risk_score);
        CREATE INDEX IF NOT EXISTS idx_audit_events_compliance_flags ON audit_events USING GIN(compliance_flags);
      `
    });

    // Create metrics table
    console.log('Creating metrics table...');
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS metrics (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          value NUMERIC NOT NULL,
          timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          tags JSONB,
          metadata JSONB,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        CREATE INDEX IF NOT EXISTS idx_metrics_name ON metrics(name);
        CREATE INDEX IF NOT EXISTS idx_metrics_timestamp ON metrics(timestamp);
        CREATE INDEX IF NOT EXISTS idx_metrics_tags ON metrics USING GIN(tags);
      `
    });

    // Create cache_entries table
    console.log('Creating cache_entries table...');
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS cache_entries (
          id SERIAL PRIMARY KEY,
          key TEXT UNIQUE NOT NULL,
          value TEXT,
          ttl INTEGER,
          expires_at TIMESTAMPTZ,
          metadata JSONB,
          last_accessed TIMESTAMPTZ,
          access_count INTEGER DEFAULT 0,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        CREATE INDEX IF NOT EXISTS idx_cache_entries_key ON cache_entries(key);
        CREATE INDEX IF NOT EXISTS idx_cache_entries_expires_at ON cache_entries(expires_at);
        CREATE INDEX IF NOT EXISTS idx_cache_entries_last_accessed ON cache_entries(last_accessed);
      `
    });

    // Create rate_limits table
    console.log('Creating rate_limits table...');
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS rate_limits (
          id SERIAL PRIMARY KEY,
          key TEXT UNIQUE NOT NULL,
          requests INTEGER NOT NULL DEFAULT 0,
          window_start TIMESTAMPTZ NOT NULL,
          window_end TIMESTAMPTZ NOT NULL,
          blocked BOOLEAN NOT NULL DEFAULT FALSE,
          block_expiry TIMESTAMPTZ,
          last_request TIMESTAMPTZ NOT NULL,
          metadata JSONB,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        CREATE INDEX IF NOT EXISTS idx_rate_limits_key ON rate_limits(key);
        CREATE INDEX IF NOT EXISTS idx_rate_limits_window_end ON rate_limits(window_end);
        CREATE INDEX IF NOT EXISTS idx_rate_limits_blocked ON rate_limits(blocked);
      `
    });

    // Create social_media_metrics table
    console.log('Creating social_media_metrics table...');
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS social_media_metrics (
          id SERIAL PRIMARY KEY,
          metrics JSONB NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        CREATE INDEX IF NOT EXISTS idx_social_media_metrics_created_at ON social_media_metrics(created_at);
      `
    });

    // Create generated_content table
    console.log('Creating generated_content table...');
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS generated_content (
          id SERIAL PRIMARY KEY,
          athlete_id TEXT NOT NULL,
          platform TEXT NOT NULL,
          content TEXT NOT NULL,
          media_urls TEXT[],
          hashtags TEXT[],
          scheduled_time TIMESTAMPTZ,
          content_type TEXT NOT NULL,
          priority TEXT NOT NULL DEFAULT 'medium',
          audit_id TEXT,
          status TEXT NOT NULL DEFAULT 'generated',
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        CREATE INDEX IF NOT EXISTS idx_generated_content_athlete_id ON generated_content(athlete_id);
        CREATE INDEX IF NOT EXISTS idx_generated_content_platform ON generated_content(platform);
        CREATE INDEX IF NOT EXISTS idx_generated_content_status ON generated_content(status);
        CREATE INDEX IF NOT EXISTS idx_generated_content_scheduled_time ON generated_content(scheduled_time);
        CREATE INDEX IF NOT EXISTS idx_generated_content_audit_id ON generated_content(audit_id);
      `
    });

    // Create social_media_posts table
    console.log('Creating social_media_posts table...');
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS social_media_posts (
          id SERIAL PRIMARY KEY,
          athlete_id TEXT NOT NULL,
          platform TEXT NOT NULL,
          post_id TEXT,
          url TEXT,
          content TEXT,
          media_urls TEXT[],
          hashtags TEXT[],
          engagement JSONB,
          status TEXT NOT NULL DEFAULT 'posted',
          error_message TEXT,
          posted_at TIMESTAMPTZ,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        CREATE INDEX IF NOT EXISTS idx_social_media_posts_athlete_id ON social_media_posts(athlete_id);
        CREATE INDEX IF NOT EXISTS idx_social_media_posts_platform ON social_media_posts(platform);
        CREATE INDEX IF NOT EXISTS idx_social_media_posts_status ON social_media_posts(status);
        CREATE INDEX IF NOT EXISTS idx_social_media_posts_posted_at ON social_media_posts(posted_at);
        CREATE INDEX IF NOT EXISTS idx_social_media_posts_engagement ON social_media_posts USING GIN(engagement);
      `
    });

    // Create athlete_profiles table (if not exists)
    console.log('Ensuring athlete_profiles table exists...');
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS athlete_profiles (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          sport TEXT NOT NULL,
          position TEXT NOT NULL,
          school TEXT NOT NULL,
          stats JSONB,
          rankings JSONB,
          social_media JSONB,
          achievements TEXT[],
          highlight_video TEXT,
          quality_score INTEGER,
          graduation_year INTEGER,
          location TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        CREATE INDEX IF NOT EXISTS idx_athlete_profiles_sport ON athlete_profiles(sport);
        CREATE INDEX IF NOT EXISTS idx_athlete_profiles_school ON athlete_profiles(school);
        CREATE INDEX IF NOT EXISTS idx_athlete_profiles_quality_score ON athlete_profiles(quality_score);
        CREATE INDEX IF NOT EXISTS idx_athlete_profiles_graduation_year ON athlete_profiles(graduation_year);
      `
    });

    // Create indexes for performance
    console.log('Creating performance indexes...');
    await supabase.rpc('exec_sql', {
      sql: `
        -- Composite indexes for common queries
        CREATE INDEX IF NOT EXISTS idx_audit_events_user_action ON audit_events(user_id, action);
        CREATE INDEX IF NOT EXISTS idx_audit_events_resource_timestamp ON audit_events(resource, timestamp);
        CREATE INDEX IF NOT EXISTS idx_metrics_name_timestamp ON metrics(name, timestamp);
        CREATE INDEX IF NOT EXISTS idx_social_media_posts_athlete_platform ON social_media_posts(athlete_id, platform);
        CREATE INDEX IF NOT EXISTS idx_generated_content_athlete_platform ON generated_content(athlete_id, platform);

        -- Partial indexes for active data
        CREATE INDEX IF NOT EXISTS idx_cache_entries_active ON cache_entries(key) WHERE expires_at > NOW();
        CREATE INDEX IF NOT EXISTS idx_rate_limits_active ON rate_limits(key) WHERE window_end > NOW();
      `
    });

    // Create retention policies (if supported)
    console.log('Setting up data retention policies...');
    try {
      await supabase.rpc('exec_sql', {
        sql: `
          -- Create function for cleanup if it doesn't exist
          CREATE OR REPLACE FUNCTION cleanup_old_data()
          RETURNS void AS $$
          BEGIN
            -- Clean up old audit events (7 years retention)
            DELETE FROM audit_events WHERE timestamp < NOW() - INTERVAL '7 years';

            -- Clean up old metrics (90 days retention)
            DELETE FROM metrics WHERE timestamp < NOW() - INTERVAL '90 days';

            -- Clean up expired cache entries
            DELETE FROM cache_entries WHERE expires_at < NOW();

            -- Clean up old rate limit entries
            DELETE FROM rate_limits WHERE window_end < NOW();

            -- Clean up old social media metrics (30 days retention)
            DELETE FROM social_media_metrics WHERE created_at < NOW() - INTERVAL '30 days';
          END;
          $$ LANGUAGE plpgsql;
        `
      });
    } catch (error) {
      console.log('Retention policies setup skipped (may not be supported in this environment)');
    }

    console.log('✅ Database migrations completed successfully!');
    console.log('');
    console.log('Created tables:');
    console.log('- audit_events (enterprise audit logging)');
    console.log('- metrics (performance and business metrics)');
    console.log('- cache_entries (persistent caching)');
    console.log('- rate_limits (rate limiting data)');
    console.log('- social_media_metrics (social media performance)');
    console.log('- generated_content (AI-generated content tracking)');
    console.log('- social_media_posts (posted content tracking)');
    console.log('- athlete_profiles (athlete data)');
    console.log('');
    console.log('The Advanced Social Media Engine is now ready for enterprise use!');

  } catch (error) {
    console.error('❌ Database migration failed:', error);
    process.exit(1);
  }
}

// Run migrations if this script is executed directly
if (require.main === module) {
  runMigrations()
    .then(() => {
      console.log('Migration script completed.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration script failed:', error);
      process.exit(1);
    });
}

export { runMigrations };
