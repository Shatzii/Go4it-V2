import postgres from 'postgres';

async function updateTables() {
  try {
    console.log('Connecting to database...');
    const pg = postgres(process.env.DATABASE_URL!);
    
    // Rename columns from is_active to active across all tables
    try {
      await pg`ALTER TABLE transfer_portal_monitors RENAME COLUMN is_active TO active`;
      console.log('Renamed is_active to active in transfer_portal_monitors');
    } catch (err) {
      console.error('Error renaming column in transfer_portal_monitors:', err);
    }
    
    try {
      await pg`ALTER TABLE social_media_scouts RENAME COLUMN is_active TO active`;
      console.log('Renamed is_active to active in social_media_scouts');
    } catch (err) {
      console.error('Error renaming column in social_media_scouts:', err);
    }
    
    try {
      await pg`ALTER TABLE media_partnership_scouts RENAME COLUMN is_active TO active`;
      console.log('Renamed is_active to active in media_partnership_scouts');
    } catch (err) {
      console.error('Error renaming column in media_partnership_scouts:', err);
    }
    
    try {
      await pg`ALTER TABLE city_influencer_scouts RENAME COLUMN is_active TO active`;
      console.log('Renamed is_active to active in city_influencer_scouts');
    } catch (err) {
      console.error('Error renaming column in city_influencer_scouts:', err);
    }
    
    // Create necessary discovery tables
    try {
      await pg`
        CREATE TABLE IF NOT EXISTS athlete_discoveries (
          id SERIAL PRIMARY KEY,
          scout_id INTEGER NOT NULL REFERENCES social_media_scouts(id),
          full_name TEXT NOT NULL,
          username TEXT NOT NULL,
          platform TEXT NOT NULL,
          profile_url TEXT NOT NULL,
          estimated_age INTEGER,
          sports TEXT[] DEFAULT '{}',
          positions TEXT[] DEFAULT '{}',
          follower_count INTEGER,
          engagement_rate NUMERIC(5,2),
          contact_info JSONB,
          discovery_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          star_rating INTEGER,
          notes TEXT,
          talent_score INTEGER,
          potential_rating INTEGER,
          contacted BOOLEAN DEFAULT FALSE,
          contacted_date TIMESTAMP WITH TIME ZONE
        )
      `;
      console.log('Created athlete_discoveries table');
    } catch (err) {
      console.error('Error creating athlete_discoveries table:', err);
    }
    
    try {
      await pg`
        CREATE TABLE IF NOT EXISTS media_partnership_discoveries (
          id SERIAL PRIMARY KEY,
          scout_id INTEGER NOT NULL REFERENCES media_partnership_scouts(id),
          outlet_name TEXT NOT NULL,
          media_type TEXT NOT NULL,
          platform TEXT NOT NULL,
          profile_url TEXT NOT NULL,
          follower_count INTEGER,
          engagement_rate NUMERIC(5,2),
          content_focus TEXT[] DEFAULT '{}',
          discovery_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          contact_info JSONB,
          partnership_potential INTEGER,
          contacted BOOLEAN DEFAULT FALSE,
          contacted_date TIMESTAMP WITH TIME ZONE,
          notes TEXT
        )
      `;
      console.log('Created media_partnership_discoveries table');
    } catch (err) {
      console.error('Error creating media_partnership_discoveries table:', err);
    }
    
    try {
      await pg`
        CREATE TABLE IF NOT EXISTS city_influencer_discoveries (
          id SERIAL PRIMARY KEY,
          scout_id INTEGER NOT NULL REFERENCES city_influencer_scouts(id),
          full_name TEXT NOT NULL,
          username TEXT NOT NULL,
          platform TEXT NOT NULL,
          profile_url TEXT NOT NULL,
          city TEXT NOT NULL,
          state TEXT NOT NULL,
          follower_count INTEGER,
          engagement_rate NUMERIC(5,2),
          content_focus TEXT[] DEFAULT '{}',
          discovery_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          contact_info JSONB,
          influence_score INTEGER,
          contacted BOOLEAN DEFAULT FALSE,
          contacted_date TIMESTAMP WITH TIME ZONE,
          notes TEXT,
          ranking INTEGER
        )
      `;
      console.log('Created city_influencer_discoveries table');
    } catch (err) {
      console.error('Error creating city_influencer_discoveries table:', err);
    }
    
    try {
      await pg`
        CREATE TABLE IF NOT EXISTS transfer_portal_entries (
          id SERIAL PRIMARY KEY,
          player_name TEXT NOT NULL,
          previous_school TEXT NOT NULL,
          sport TEXT NOT NULL,
          position TEXT NOT NULL,
          eligibility_remaining TEXT,
          height TEXT,
          weight TEXT,
          star_rating INTEGER,
          portal_entry_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          portal_status TEXT DEFAULT 'active',
          committed_to TEXT,
          commit_date TIMESTAMP WITH TIME ZONE,
          best_fit_schools TEXT[] DEFAULT '{}',
          fit_reasons JSONB,
          transfer_rating INTEGER,
          notes TEXT
        )
      `;
      console.log('Created transfer_portal_entries table');
    } catch (err) {
      console.error('Error creating transfer_portal_entries table:', err);
    }
    
    try {
      await pg`
        CREATE TABLE IF NOT EXISTS ncaa_team_rosters (
          id SERIAL PRIMARY KEY,
          school TEXT NOT NULL,
          sport TEXT NOT NULL,
          division TEXT NOT NULL,
          conference TEXT NOT NULL,
          roster_size INTEGER,
          coaching_staff JSONB,
          roster_status TEXT DEFAULT 'normal',
          position_needs TEXT[] DEFAULT '{}',
          last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          roster_composition JSONB
        )
      `;
      console.log('Created ncaa_team_rosters table');
    } catch (err) {
      console.error('Error creating ncaa_team_rosters table:', err);
    }
    
    // Clean up connection
    await pg.end();
    
    console.log('Database schema updated successfully');
  } catch (error) {
    console.error('Error updating database schema:', error);
  }
}

updateTables().catch(console.error);