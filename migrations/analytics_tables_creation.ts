import { drizzle } from 'drizzle-orm/node-postgres';
import { sql } from 'drizzle-orm';
import { Pool } from 'pg';
import * as schema from '../shared/schema';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  // Initialize PostgreSQL connection
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  // Initialize Drizzle ORM
  const db = drizzle(pool, { schema });

  console.log('Starting analytics tables migration...');

  // Create tables in a transaction to ensure all or nothing
  await db.transaction(async (tx) => {
    try {
      // 1. Star Path Progression Analytics
      await tx.execute(sql`
        CREATE TABLE IF NOT EXISTS star_path_analytics (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id),
          current_star_level INTEGER NOT NULL,
          previous_star_level INTEGER,
          days_at_current_level INTEGER NOT NULL,
          total_days_in_system INTEGER NOT NULL,
          progress_percentage REAL NOT NULL,
          next_level_estimated_days INTEGER,
          progress_snapshot_data JSONB,
          bottleneck_identified TEXT,
          recommended_focus TEXT,
          achieved_milestones TEXT[],
          timestamp_recorded TIMESTAMP DEFAULT NOW() NOT NULL
        )
      `);
      console.log('✅ Created star_path_analytics table');

      // 2. Engagement Patterns & ADHD Analytics
      await tx.execute(sql`
        CREATE TABLE IF NOT EXISTS engagement_analytics (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id),
          session_duration INTEGER NOT NULL,
          time_of_day TIMESTAMP NOT NULL,
          day_of_week INTEGER NOT NULL,
          features_used TEXT[],
          feature_time_distribution JSONB,
          attention_span_average REAL,
          context_switch_count INTEGER,
          focus_feature TEXT,
          device_type TEXT,
          session_completion_status TEXT,
          interface_elements JSONB,
          timestamp_recorded TIMESTAMP DEFAULT NOW() NOT NULL
        )
      `);
      console.log('✅ Created engagement_analytics table');

      // 3. Workout Verification Analytics
      await tx.execute(sql`
        CREATE TABLE IF NOT EXISTS workout_analytics (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id),
          workout_verification_id INTEGER,
          workout_type TEXT NOT NULL,
          completion_success BOOLEAN NOT NULL,
          form_quality_score REAL,
          form_improvement_rate REAL,
          consistency_streak INTEGER NOT NULL,
          best_streak INTEGER,
          difficulty_progression REAL,
          calories_burned INTEGER,
          workout_duration INTEGER,
          intensity_score REAL,
          preferred_time_of_day TEXT,
          preferred_environment TEXT,
          equipment_used TEXT[],
          timestamp_recorded TIMESTAMP DEFAULT NOW() NOT NULL
        )
      `);
      console.log('✅ Created workout_analytics table');

      // 4. Skill Development Velocity Analytics
      await tx.execute(sql`
        CREATE TABLE IF NOT EXISTS skill_development_analytics (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id),
          sport_type TEXT NOT NULL,
          skill_category TEXT NOT NULL,
          skill_name TEXT NOT NULL,
          current_level INTEGER NOT NULL,
          improvement_rate REAL,
          practice_frequency INTEGER,
          time_invested INTEGER,
          plateau_identified BOOLEAN,
          plateau_duration INTEGER,
          breakthrough_factors TEXT[],
          correlation_factors JSONB,
          drill_efficiency JSONB,
          timestamp_recorded TIMESTAMP DEFAULT NOW() NOT NULL
        )
      `);
      console.log('✅ Created skill_development_analytics table');

      // 5. Academic-Athletic Integration Analytics
      await tx.execute(sql`
        CREATE TABLE IF NOT EXISTS academic_athletic_analytics (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id),
          current_gpa REAL,
          gpa_time_series JSONB,
          strongest_subjects TEXT[],
          weakest_subjects TEXT[],
          study_hours_per_week INTEGER,
          athletic_performance_correlation REAL,
          cognitive_influence_factor REAL,
          academic_improvement_rate REAL,
          athletic_improvement_rate REAL,
          balance_score REAL,
          recommended_study_patterns JSONB,
          recommended_subject_focus TEXT,
          timestamp_recorded TIMESTAMP DEFAULT NOW() NOT NULL
        )
      `);
      console.log('✅ Created academic_athletic_analytics table');

      // 6. AI Coach Effectiveness Analytics
      await tx.execute(sql`
        CREATE TABLE IF NOT EXISTS ai_coach_analytics (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id),
          coach_id INTEGER,
          personalization_accuracy REAL,
          recommendation_adherence_rate REAL,
          user_satisfaction_rating INTEGER,
          improvement_with_ai REAL,
          improvement_without_ai REAL,
          ai_interaction_frequency INTEGER,
          average_interaction_duration INTEGER,
          most_used_features TEXT[],
          common_queries TEXT[],
          feedback_provided TEXT,
          adjustments_implemented JSONB,
          timestamp_recorded TIMESTAMP DEFAULT NOW() NOT NULL
        )
      `);
      console.log('✅ Created ai_coach_analytics table');

      // 7. Cross-Sport Potential Analytics
      await tx.execute(sql`
        CREATE TABLE IF NOT EXISTS cross_sport_analytics (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id),
          primary_sport TEXT NOT NULL,
          secondary_sports TEXT[],
          skill_transferability_score JSONB,
          cross_training_frequency INTEGER,
          multi_sport_performance_index REAL,
          sport_recommendation_accuracy REAL,
          complementary_skill_sets JSONB,
          specialty_vs_versatility_balance REAL,
          sport_progression_timeline JSONB,
          timestamp_recorded TIMESTAMP DEFAULT NOW() NOT NULL
        )
      `);
      console.log('✅ Created cross_sport_analytics table');

      // 8. Recruiting Readiness Analytics
      await tx.execute(sql`
        CREATE TABLE IF NOT EXISTS recruiting_analytics (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id),
          overall_gar_score REAL,
          gar_score_progression JSONB,
          highlight_generation_count INTEGER,
          highlight_view_count INTEGER,
          highlight_share_count INTEGER,
          scout_view_count INTEGER,
          scout_engagement_metrics JSONB,
          college_match_percentages JSONB,
          recruiting_profile_completeness REAL,
          national_ranking_projection INTEGER,
          local_ranking_projection INTEGER,
          scholarship_potential_score REAL,
          timestamp_recorded TIMESTAMP DEFAULT NOW() NOT NULL
        )
      `);
      console.log('✅ Created recruiting_analytics table');

      // 9. Neurodivergent-Specific Success Patterns
      await tx.execute(sql`
        CREATE TABLE IF NOT EXISTS neurodivergent_analytics (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id),
          adhd_friendly_feature_usage JSONB,
          accommodation_effectiveness JSONB,
          focus_duration JSONB,
          distraction_frequency INTEGER,
          recovery_time INTEGER,
          optimal_session_duration INTEGER,
          visual_vs_textual_preference REAL,
          dopamine_trigger_effectiveness JSONB,
          attention_patterns JSONB,
          environmental_factors JSONB,
          timestamp_recorded TIMESTAMP DEFAULT NOW() NOT NULL
        )
      `);
      console.log('✅ Created neurodivergent_analytics table');

      // 10. Community & Social Impact Analytics
      await tx.execute(sql`
        CREATE TABLE IF NOT EXISTS community_analytics (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id),
          peer_interaction_count INTEGER,
          peer_learning_effectiveness REAL,
          coach_athlete_message_count INTEGER,
          response_time_average INTEGER,
          parent_involvement_score REAL,
          team_vs_individual_improvement REAL,
          regional_comparison_percentile REAL,
          community_contribution_score REAL,
          social_support_network_size INTEGER,
          collaborative_workouts_percentage REAL,
          knowledge_sharing_metrics JSONB,
          timestamp_recorded TIMESTAMP DEFAULT NOW() NOT NULL
        )
      `);
      console.log('✅ Created community_analytics table');

      // 11. User Session Analytics
      await tx.execute(sql`
        CREATE TABLE IF NOT EXISTS user_session_analytics (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id),
          session_start_time TIMESTAMP NOT NULL,
          session_end_time TIMESTAMP,
          session_duration INTEGER,
          pages_visited TEXT[],
          actions_performed JSONB,
          device_info JSONB,
          browser_info JSONB,
          ip_address TEXT,
          geolocation TEXT,
          referrer TEXT,
          entry_point TEXT,
          exit_point TEXT,
          bounced BOOLEAN,
          converted_goal TEXT,
          user_type TEXT
        )
      `);
      console.log('✅ Created user_session_analytics table');

      // Create indexes for performance optimization
      await tx.execute(sql`CREATE INDEX IF NOT EXISTS star_path_analytics_user_id_idx ON star_path_analytics(user_id)`);
      await tx.execute(sql`CREATE INDEX IF NOT EXISTS engagement_analytics_user_id_idx ON engagement_analytics(user_id)`);
      await tx.execute(sql`CREATE INDEX IF NOT EXISTS workout_analytics_user_id_idx ON workout_analytics(user_id)`);
      await tx.execute(sql`CREATE INDEX IF NOT EXISTS skill_development_analytics_user_id_idx ON skill_development_analytics(user_id)`);
      await tx.execute(sql`CREATE INDEX IF NOT EXISTS academic_athletic_analytics_user_id_idx ON academic_athletic_analytics(user_id)`);
      await tx.execute(sql`CREATE INDEX IF NOT EXISTS ai_coach_analytics_user_id_idx ON ai_coach_analytics(user_id)`);
      await tx.execute(sql`CREATE INDEX IF NOT EXISTS cross_sport_analytics_user_id_idx ON cross_sport_analytics(user_id)`);
      await tx.execute(sql`CREATE INDEX IF NOT EXISTS recruiting_analytics_user_id_idx ON recruiting_analytics(user_id)`);
      await tx.execute(sql`CREATE INDEX IF NOT EXISTS neurodivergent_analytics_user_id_idx ON neurodivergent_analytics(user_id)`);
      await tx.execute(sql`CREATE INDEX IF NOT EXISTS community_analytics_user_id_idx ON community_analytics(user_id)`);
      await tx.execute(sql`CREATE INDEX IF NOT EXISTS user_session_analytics_user_id_idx ON user_session_analytics(user_id)`);
      
      console.log('✅ Created indexes for all analytics tables');
    } catch (error) {
      console.error('❌ Error creating analytics tables:', error);
      throw error;
    }
  });

  console.log('✅ Analytics tables migration completed successfully');
  
  await pool.end();
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  });