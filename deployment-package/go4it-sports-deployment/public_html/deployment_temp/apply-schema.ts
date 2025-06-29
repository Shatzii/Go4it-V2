import postgres from 'postgres';
import { db } from './server/db';
import * as schema from './shared/schema';

// Handle the case where the schema file imported includes models 
// that are already in the database by catching errors and continuing
async function createTables() {
  try {
    console.log('Connecting to database...');
    const pg = postgres(process.env.DATABASE_URL!);
    
    // Create specific tables needed for our AI services
    // Wrap each operation in a try/catch so other tables will be created even if some fail
    
    try {
      // Force create transfer portal monitors
      await pg`
        CREATE TABLE IF NOT EXISTS transfer_portal_monitors (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT NOT NULL, 
          sport TEXT NOT NULL,
          monitor_type TEXT NOT NULL,
          created_by INTEGER NOT NULL REFERENCES users(id),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          last_run TIMESTAMP WITH TIME ZONE,
          is_active BOOLEAN DEFAULT TRUE,
          update_frequency INTEGER,
          configuration JSONB
        )
      `;
      console.log('Created transfer_portal_monitors table');
    } catch (err) {
      console.error('Error creating transfer_portal_monitors:', err);
    }
    
    try {
      // Force create social media scouts
      await pg`
        CREATE TABLE IF NOT EXISTS social_media_scouts (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT NOT NULL,
          created_by INTEGER NOT NULL REFERENCES users(id),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          last_run TIMESTAMP WITH TIME ZONE,
          is_active BOOLEAN DEFAULT TRUE,
          sport_focus TEXT[] DEFAULT '{}',
          platforms_to_search TEXT[] DEFAULT '{}',
          age_range_min INTEGER,
          age_range_max INTEGER,
          min_height INTEGER,
          min_weight INTEGER,
          position TEXT,
          keywords TEXT[] DEFAULT '{}',
          custom_criteria JSONB
        )
      `;
      console.log('Created social_media_scouts table');
    } catch (err) {
      console.error('Error creating social_media_scouts:', err);
    }
    
    try {
      // Force create media partnership scouts
      await pg`
        CREATE TABLE IF NOT EXISTS media_partnership_scouts (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT NOT NULL,
          created_by INTEGER NOT NULL REFERENCES users(id),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          last_run TIMESTAMP WITH TIME ZONE,
          is_active BOOLEAN DEFAULT TRUE,
          media_types TEXT[] DEFAULT '{}',
          sport_focus TEXT[] DEFAULT '{}',
          follower_threshold INTEGER,
          regions TEXT[] DEFAULT '{}',
          configuration JSONB
        )
      `;
      console.log('Created media_partnership_scouts table');
    } catch (err) {
      console.error('Error creating media_partnership_scouts:', err);
    }
    
    try {
      // Force create city influencer scouts
      await pg`
        CREATE TABLE IF NOT EXISTS city_influencer_scouts (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT NOT NULL,
          created_by INTEGER NOT NULL REFERENCES users(id),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          last_run TIMESTAMP WITH TIME ZONE,
          is_active BOOLEAN DEFAULT TRUE,
          cities TEXT[] DEFAULT '{}',
          states TEXT[] DEFAULT '{}',
          regions TEXT[] DEFAULT '{}',
          platforms TEXT[] DEFAULT '{}',
          min_followers INTEGER,
          sport_focus TEXT[] DEFAULT '{}',
          max_influencers INTEGER DEFAULT 10,
          age_range_min INTEGER,
          age_range_max INTEGER,
          influencer_type TEXT[] DEFAULT '{}', 
          configuration JSONB
        )
      `;
      console.log('Created city_influencer_scouts table');
    } catch (err) {
      console.error('Error creating city_influencer_scouts:', err);
    }
    
    // Clean up connection
    await pg.end();
    
    console.log('Database schema applied successfully');
  } catch (error) {
    console.error('Error applying database schema:', error);
  }
}

createTables().catch(console.error);