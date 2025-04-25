import { pool } from './server/db';
import {
  combineRatingTemplates,
  combineAthleteRatings,
  combineAnalysisResults,
} from './shared/schema';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { migrate } from 'drizzle-orm/neon-serverless/migrator';
import * as schema from "./shared/schema";

async function main() {
  console.log("Creating combine tables in database...");
  
  // Create Drizzle ORM instance
  const db = drizzle(pool, { schema });
  
  try {
    // Create the combine_rating_templates table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS combine_rating_templates (
        id SERIAL PRIMARY KEY,
        template_id TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        star_level INTEGER NOT NULL,
        sport TEXT NOT NULL,
        position TEXT NOT NULL,
        age_group TEXT,
        metrics JSONB,
        traits JSONB,
        film_expectations TEXT[],
        training_focus TEXT[],
        avatar TEXT,
        rank TEXT,
        xp_level INTEGER,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log("Created combine_rating_templates table");
    
    // Create the combine_athlete_ratings table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS combine_athlete_ratings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        event_id INTEGER REFERENCES combine_tour_events(id),
        template_id TEXT REFERENCES combine_rating_templates(template_id),
        sport TEXT NOT NULL,
        position TEXT NOT NULL,
        star_level INTEGER NOT NULL,
        metrics JSONB,
        traits JSONB,
        notes TEXT,
        rated_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log("Created combine_athlete_ratings table");
    
    // Create the combine_analysis_results table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS combine_analysis_results (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        event_id INTEGER REFERENCES combine_tour_events(id),
        video_id INTEGER REFERENCES videos(id),
        position_fit TEXT[],
        skill_analysis JSONB,
        next_steps JSONB,
        challenges TEXT[],
        recovery_status TEXT,
        recovery_score INTEGER,
        ai_analysis_date TIMESTAMP DEFAULT NOW(),
        ai_coach_notes TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log("Created combine_analysis_results table");
    
    // Seed some initial combine rating templates
    const basketballTemplates = [
      {
        template_id: 'bas_cen_5star_1',
        name: 'Five-Star Center',
        star_level: 5,
        sport: 'basketball',
        position: 'center',
        age_group: '16-18',
        metrics: JSON.stringify({
          height: { min: 82, ideal: 85, unit: 'inches' },  // 6'10" to 7'1"
          weight: { min: 230, ideal: 250, unit: 'lbs' },
          wingspan: { min: 86, ideal: 90, unit: 'inches' },
          standing_reach: { min: 108, ideal: 114, unit: 'inches' },
          vertical_leap: { min: 28, ideal: 35, unit: 'inches' },
          bench_press: { min: 185, ideal: 225, reps: true, unit: 'lbs' },
          lane_agility: { min: 12.5, ideal: 11.5, unit: 'seconds' },
          three_quarter_sprint: { min: 3.4, ideal: 3.25, unit: 'seconds' }
        }),
        traits: JSON.stringify({
          rebounding: { min: 8, ideal: 10, scale: 10 },
          shot_blocking: { min: 7, ideal: 10, scale: 10 },
          post_defense: { min: 8, ideal: 10, scale: 10 },
          post_offense: { min: 7, ideal: 9, scale: 10 },
          passing: { min: 6, ideal: 8, scale: 10 },
          shooting_range: { min: 4, ideal: 7, scale: 10 },
          ball_handling: { min: 5, ideal: 7, scale: 10 }
        }),
        film_expectations: ['dominant_paint_presence', 'rim_protection', 'pick_and_roll_finishing'],
        training_focus: ['footwork', 'post_moves', 'defensive_positioning', 'free_throw_shooting']
      },
      {
        template_id: 'bas_pg_5star_1',
        name: 'Five-Star Point Guard',
        star_level: 5,
        sport: 'basketball',
        position: 'point_guard',
        age_group: '16-18',
        metrics: JSON.stringify({
          height: { min: 73, ideal: 77, unit: 'inches' },  // 6'1" to 6'5"
          weight: { min: 175, ideal: 195, unit: 'lbs' },
          wingspan: { min: 75, ideal: 80, unit: 'inches' },
          standing_reach: { min: 96, ideal: 102, unit: 'inches' },
          vertical_leap: { min: 32, ideal: 38, unit: 'inches' },
          bench_press: { min: 155, ideal: 185, reps: true, unit: 'lbs' },
          lane_agility: { min: 11.2, ideal: 10.5, unit: 'seconds' },
          three_quarter_sprint: { min: 3.1, ideal: 2.9, unit: 'seconds' }
        }),
        traits: JSON.stringify({
          ball_handling: { min: 9, ideal: 10, scale: 10 },
          passing: { min: 9, ideal: 10, scale: 10 },
          court_vision: { min: 8, ideal: 10, scale: 10 },
          perimeter_defense: { min: 7, ideal: 9, scale: 10 },
          shooting: { min: 7, ideal: 9, scale: 10 },
          decision_making: { min: 8, ideal: 10, scale: 10 },
          speed: { min: 8, ideal: 10, scale: 10 }
        }),
        film_expectations: ['excellent_court_vision', 'high_assist_numbers', 'defensive_disruption'],
        training_focus: ['advanced_dribbling', 'pick_and_roll_reads', 'shooting_off_dribble', 'defensive_positioning']
      }
    ];
    
    const footballTemplates = [
      {
        template_id: 'fb_qb_5star_1',
        name: 'Five-Star Quarterback',
        star_level: 5,
        sport: 'football',
        position: 'quarterback',
        age_group: '16-18',
        metrics: JSON.stringify({
          height: { min: 73, ideal: 77, unit: 'inches' },  // 6'1" to 6'5"
          weight: { min: 190, ideal: 225, unit: 'lbs' },
          forty_yard_dash: { min: 4.8, ideal: 4.5, unit: 'seconds' },
          throwing_velocity: { min: 55, ideal: 60, unit: 'mph' },
          throwing_distance: { min: 60, ideal: 70, unit: 'yards' },
          vertical_leap: { min: 28, ideal: 34, unit: 'inches' },
          shuttle: { min: 4.3, ideal: 4.0, unit: 'seconds' }
        }),
        traits: JSON.stringify({
          arm_strength: { min: 8, ideal: 10, scale: 10 },
          accuracy: { min: 8, ideal: 10, scale: 10 },
          decision_making: { min: 8, ideal: 10, scale: 10 },
          pocket_presence: { min: 7, ideal: 9, scale: 10 },
          mobility: { min: 6, ideal: 8, scale: 10 },
          leadership: { min: 8, ideal: 10, scale: 10 },
          football_iq: { min: 8, ideal: 10, scale: 10 }
        }),
        film_expectations: ['reads_progressions', 'accurate_deep_ball', 'third_down_efficiency'],
        training_focus: ['footwork', 'progressions', 'defensive_recognition', 'throw_mechanics']
      },
      {
        template_id: 'fb_wr_5star_1',
        name: 'Five-Star Wide Receiver',
        star_level: 5,
        sport: 'football',
        position: 'wide_receiver',
        age_group: '16-18',
        metrics: JSON.stringify({
          height: { min: 71, ideal: 76, unit: 'inches' },  // 5'11" to 6'4"
          weight: { min: 175, ideal: 210, unit: 'lbs' },
          forty_yard_dash: { min: 4.5, ideal: 4.35, unit: 'seconds' },
          vertical_leap: { min: 35, ideal: 40, unit: 'inches' },
          shuttle: { min: 4.2, ideal: 3.9, unit: 'seconds' },
          broad_jump: { min: 120, ideal: 133, unit: 'inches' },
          bench_press: { min: 12, ideal: 20, reps: true, unit: 'reps' }
        }),
        traits: JSON.stringify({
          route_running: { min: 8, ideal: 10, scale: 10 },
          hands: { min: 9, ideal: 10, scale: 10 },
          separation: { min: 8, ideal: 10, scale: 10 },
          speed: { min: 8, ideal: 10, scale: 10 },
          body_control: { min: 8, ideal: 10, scale: 10 },
          yards_after_catch: { min: 7, ideal: 9, scale: 10 },
          blocking: { min: 6, ideal: 8, scale: 10 }
        }),
        film_expectations: ['consistent_separation', 'reliable_hands', 'big_play_ability'],
        training_focus: ['route_precision', 'release_techniques', 'catching_in_traffic', 'blocking_technique']
      }
    ];
    
    // Check if templates already exist before inserting
    const existingTemplates = await db.select().from(combineRatingTemplates);
    if (existingTemplates.length === 0) {
      console.log("Seeding initial combine rating templates...");
      
      // Insert basketball templates
      for (const template of basketballTemplates) {
        await db.insert(combineRatingTemplates).values(template);
      }
      
      // Insert football templates
      for (const template of footballTemplates) {
        await db.insert(combineRatingTemplates).values(template);
      }
      
      console.log("Inserted initial combine rating templates");
    } else {
      console.log(`${existingTemplates.length} templates already exist, skipping seed data`);
    }
    
    console.log("All combine tables created successfully!");
  } catch (error) {
    console.error("Error creating combine tables:", error);
    throw error;
  } finally {
    // Close the database connection
    await pool.end();
  }
}

main().catch(console.error);