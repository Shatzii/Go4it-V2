import { db } from './db';
import { log } from './vite';
import { 
  filmComparisons, 
  comparisonVideos, 
  comparisonAnalyses,
  spotlightProfiles,
  playerProgress,
  xpTransactions,
  playerBadges,
  workoutVerifications,
  workoutVerificationCheckpoints,
  weightRoomEquipment,
  playerEquipment
} from '../shared/schema';
import { sql } from 'drizzle-orm';

/**
 * Creates all required tables that don't exist yet.
 * This function is used for development purposes only.
 */
export async function createSchema() {
  try {
    log('Creating schema if tables do not exist...', 'db');
    
    // First, check if we need to create workout_playlists, which other tables depend on
    const tablesExist = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'workout_playlists'
      ) as exists;
    `);
    
    // If workout_playlists doesn't exist, create it first
    const exists = tablesExist[0]?.exists === true;
    if (!exists) {
      log('Creating workout_playlists table...', 'db');
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS workout_playlists (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL,
          title TEXT NOT NULL,
          description TEXT,
          workout_type TEXT NOT NULL,
          intensity_level TEXT NOT NULL,
          duration INTEGER NOT NULL,
          targets TEXT[],
          created_at TIMESTAMP DEFAULT NOW(),
          last_used TIMESTAMP,
          times_used INTEGER DEFAULT 0,
          is_custom BOOLEAN DEFAULT TRUE,
          is_public BOOLEAN DEFAULT FALSE
        )
      `);
    }
    
    // Film Comparison tables
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS film_comparisons (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        title TEXT NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        is_public BOOLEAN DEFAULT FALSE,
        comparison_type TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'draft',
        tags TEXT[]
      )
    `);
    
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS comparison_videos (
        id SERIAL PRIMARY KEY,
        comparison_id INTEGER NOT NULL REFERENCES film_comparisons(id),
        video_id INTEGER REFERENCES videos(id),
        external_video_url TEXT,
        athlete_name TEXT,
        video_type TEXT NOT NULL,
        "order" INTEGER DEFAULT 0,
        notes TEXT,
        key_points TEXT[],
        markups JSONB
      )
    `);
    
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS comparison_analyses (
        id SERIAL PRIMARY KEY,
        comparison_id INTEGER NOT NULL REFERENCES film_comparisons(id),
        analysis_date TIMESTAMP DEFAULT NOW(),
        similarity_score INTEGER,
        differences JSONB,
        recommendations TEXT[],
        ai_generated_notes TEXT,
        technique_breakdown JSONB
      )
    `);
    
    // NextUp Spotlight tables
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS spotlight_profiles (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        title TEXT NOT NULL,
        summary TEXT NOT NULL,
        story TEXT NOT NULL,
        cover_image TEXT NOT NULL,
        media_gallery TEXT[],
        spotlight_date TIMESTAMP DEFAULT NOW(),
        featured BOOLEAN DEFAULT FALSE,
        status TEXT NOT NULL DEFAULT 'pending',
        approved_by INTEGER REFERENCES users(id),
        views INTEGER DEFAULT 0,
        likes INTEGER DEFAULT 0,
        is_trending BOOLEAN DEFAULT FALSE,
        category TEXT NOT NULL
      )
    `);
    
    // MyPlayer XP System tables
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS player_progress (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        current_level INTEGER NOT NULL DEFAULT 1,
        total_xp INTEGER NOT NULL DEFAULT 0,
        level_xp INTEGER NOT NULL DEFAULT 0,
        xp_to_next_level INTEGER NOT NULL DEFAULT 100,
        rank TEXT NOT NULL DEFAULT 'Rookie',
        lifetime_achievements INTEGER DEFAULT 0,
        streak_days INTEGER DEFAULT 0,
        last_active TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS xp_transactions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        amount INTEGER NOT NULL,
        transaction_type TEXT NOT NULL,
        source_id TEXT,
        description TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        multiplier REAL DEFAULT 1.0
      )
    `);
    
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS player_badges (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        badge_id TEXT NOT NULL,
        badge_name TEXT NOT NULL,
        description TEXT NOT NULL,
        category TEXT NOT NULL,
        tier TEXT NOT NULL DEFAULT 'bronze',
        is_active BOOLEAN DEFAULT TRUE,
        icon_path TEXT NOT NULL,
        earned_at TIMESTAMP DEFAULT NOW(),
        progress INTEGER DEFAULT 100
      )
    `);
    
    // Create workout_exercises table first if needed
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS workout_exercises (
        id SERIAL PRIMARY KEY,
        playlist_id INTEGER NOT NULL REFERENCES workout_playlists(id),
        name TEXT NOT NULL,
        description TEXT,
        sets INTEGER,
        reps INTEGER,
        duration INTEGER,
        rest_period INTEGER,
        exercise_order INTEGER NOT NULL,
        video_url TEXT,
        image_url TEXT,
        notes TEXT,
        equipment_needed TEXT[]
      )
    `);
    
    // MyPlayer Workout Verification tables
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS workout_verifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        workout_id INTEGER REFERENCES workout_playlists(id),
        title TEXT NOT NULL,
        submission_date TIMESTAMP DEFAULT NOW(),
        verification_status TEXT NOT NULL DEFAULT 'pending',
        rejection_reason TEXT,
        verified_by INTEGER REFERENCES users(id),
        verification_date TIMESTAMP,
        workout_duration INTEGER,
        workout_type TEXT,
        intensity_level TEXT,
        location TEXT,
        notes TEXT,
        xp_earned INTEGER DEFAULT 0
      )
    `);
    
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS workout_verification_checkpoints (
        id SERIAL PRIMARY KEY,
        verification_id INTEGER NOT NULL REFERENCES workout_verifications(id),
        checkpoint_time TIMESTAMP DEFAULT NOW(),
        checkpoint_type TEXT NOT NULL,
        data JSONB,
        media_url TEXT,
        notes TEXT,
        is_verified BOOLEAN DEFAULT FALSE
      )
    `);
    
    // MyPlayer UI Weight Room tables
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS weight_room_equipment (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        equipment_type TEXT NOT NULL,
        difficulty_level TEXT NOT NULL,
        target_muscles TEXT[],
        base_xp INTEGER NOT NULL,
        icon_path TEXT NOT NULL,
        model_path TEXT,
        price INTEGER NOT NULL DEFAULT 0,
        unlock_level INTEGER NOT NULL DEFAULT 1,
        is_premium BOOLEAN DEFAULT FALSE
      )
    `);
    
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS player_equipment (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        equipment_id INTEGER NOT NULL REFERENCES weight_room_equipment(id),
        acquired_date TIMESTAMP DEFAULT NOW(),
        level INTEGER NOT NULL DEFAULT 1,
        times_used INTEGER DEFAULT 0,
        last_used TIMESTAMP,
        is_favorite BOOLEAN DEFAULT FALSE,
        custom_name TEXT,
        usage_streak INTEGER DEFAULT 0
      )
    `);
    
    log('Schema creation completed', 'db');
  } catch (error) {
    log(`Error creating schema: ${error}`, 'db');
    throw error;
  }
}