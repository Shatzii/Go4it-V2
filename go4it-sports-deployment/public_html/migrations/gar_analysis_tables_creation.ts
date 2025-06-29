/**
 * GAR Analysis Tables Migration
 * 
 * Creates database tables for the GAR (Growth and Ability Rating) analysis system:
 * - Sport positions
 * - Biomechanics data
 * - Neurodivergent profiles
 * - Athlete body metrics
 * - Athlete assessments
 * - Athlete skills
 * - GAR scores
 * - Sport attributes
 */

import { sql } from 'drizzle-orm';
import { db } from '../server/db';

async function main() {
  console.log('Starting GAR analysis tables migration...');

  try {
    // Create sport positions table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS sport_positions (
        id SERIAL PRIMARY KEY,
        sport_type TEXT NOT NULL,
        position_name TEXT NOT NULL,
        description TEXT,
        age_minimum INTEGER,
        physical_requirements JSONB,
        technical_requirements JSONB,
        tactical_requirements JSONB,
        psychological_requirements JSONB,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('Created sport_positions table');

    // Create biomechanics data table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS biomechanics_data (
        id SERIAL PRIMARY KEY,
        athlete_id INTEGER NOT NULL REFERENCES users(id),
        capture_date TIMESTAMP DEFAULT NOW(),
        sport_type TEXT,
        position_played TEXT,
        category TEXT NOT NULL,
        metrics JSONB NOT NULL,
        video_reference TEXT,
        capture_method TEXT,
        ai_analysis_notes TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('Created biomechanics_data table');

    // Create neurodivergent profiles table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS neurodivergent_profiles (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        has_adhd BOOLEAN DEFAULT FALSE,
        adhd_type TEXT,
        adhd_diagnosis_date TIMESTAMP,
        adhd_medication BOOLEAN DEFAULT FALSE,
        has_dyslexia BOOLEAN DEFAULT FALSE,
        has_autism BOOLEAN DEFAULT FALSE,
        sensory_processing_needs JSONB,
        learning_preferences JSONB,
        environmental_adaptations JSONB,
        birth_date TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('Created neurodivergent_profiles table');

    // Create athlete body metrics table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS athlete_body_metrics (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        height NUMERIC,
        weight NUMERIC,
        wingspan NUMERIC,
        standing_reach NUMERIC,
        vertical_jump NUMERIC,
        sprint_speed NUMERIC,
        agility NUMERIC,
        strength_score NUMERIC,
        flexibility_score NUMERIC,
        body_fat_percentage NUMERIC,
        muscle_mass NUMERIC,
        bmi NUMERIC,
        vo2_max NUMERIC,
        resting_heart_rate INTEGER,
        growth_velocity NUMERIC,
        height_percentile INTEGER,
        weight_percentile INTEGER,
        handedness TEXT,
        footedness TEXT,
        measurement_date TIMESTAMP DEFAULT NOW(),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('Created athlete_body_metrics table');

    // Create athlete assessments table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS athlete_assessments (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        assessment_date TIMESTAMP DEFAULT NOW(),
        assessor_id INTEGER REFERENCES users(id),
        athlete_age NUMERIC,
        speed INTEGER,
        agility INTEGER,
        strength INTEGER,
        endurance INTEGER,
        flexibility INTEGER,
        balance INTEGER,
        coordination INTEGER,
        focus INTEGER,
        determination INTEGER,
        teamwork INTEGER,
        pressure_response INTEGER,
        confidence INTEGER,
        sport_specific_skills JSONB,
        motor_skills JSONB,
        notes TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('Created athlete_assessments table');

    // Create athlete skills table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS athlete_skills (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        sport_id INTEGER,
        skill_name TEXT NOT NULL,
        level INTEGER DEFAULT 1,
        experience INTEGER,
        last_practiced TIMESTAMP,
        notes TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('Created athlete_skills table');

    // Create GAR scores table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS gar_scores (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        sport_id INTEGER NOT NULL,
        overall_score NUMERIC NOT NULL,
        physical_score NUMERIC NOT NULL,
        technical_score NUMERIC NOT NULL,
        psychological_score NUMERIC NOT NULL,
        developmental_score NUMERIC NOT NULL,
        adhd_compatibility_score NUMERIC,
        score_date TIMESTAMP DEFAULT NOW(),
        age_at_assessment NUMERIC,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('Created gar_scores table');

    // Create sport attributes table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS sport_attributes (
        id SERIAL PRIMARY KEY,
        sport_id INTEGER NOT NULL,
        attribute_name TEXT NOT NULL,
        importance NUMERIC NOT NULL,
        description TEXT,
        development_age JSONB,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('Created sport_attributes table');

    // Create indexes
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_sport_pos_sport ON sport_positions(sport_type);`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_biomech_athlete ON biomechanics_data(athlete_id);`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_biomech_sport_pos ON biomechanics_data(sport_type, position_played);`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_neuro_user ON neurodivergent_profiles(user_id);`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_body_metrics_user ON athlete_body_metrics(user_id);`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_assessments_user ON athlete_assessments(user_id);`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_skills_user ON athlete_skills(user_id);`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_skills_sport ON athlete_skills(sport_id);`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_gar_user ON gar_scores(user_id);`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_gar_sport ON gar_scores(sport_id);`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_gar_date ON gar_scores(score_date);`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_sport_attr ON sport_attributes(sport_id, attribute_name);`);
    
    console.log('Created all indexes');

    console.log('GAR analysis tables migration completed successfully.');
  } catch (error) {
    console.error('Error in GAR analysis tables migration:', error);
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });