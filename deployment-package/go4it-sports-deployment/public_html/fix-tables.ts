import { db } from "./server/db";
import { log } from "./server/vite";

async function createTables() {
  try {
    log("🔨 Creating missing tables...", "schema");
    
    // Create media_partner_discoveries table if it doesn't exist
    await db.execute(`
      CREATE TABLE IF NOT EXISTS media_partner_discoveries (
        id SERIAL PRIMARY KEY,
        scout_id INTEGER REFERENCES media_partnership_scouts(id),
        name TEXT NOT NULL,
        platform TEXT NOT NULL,
        url TEXT NOT NULL,
        follower_count INTEGER,
        average_engagement REAL,
        sports TEXT[],
        content_quality INTEGER,
        relevance_score INTEGER,
        partnership_potential INTEGER,
        discovered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_checked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status TEXT DEFAULT 'new'
      );
    `);
    log("✅ Created media_partner_discoveries table", "schema");

    // Update athlete_discoveries to add email column if it doesn't exist
    await db.execute(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'athlete_discoveries' 
          AND column_name = 'email'
        ) THEN
          ALTER TABLE athlete_discoveries ADD COLUMN email TEXT;
        END IF;
      END $$;
    `);
    log("✅ Updated athlete_discoveries table", "schema");

    log("✅ Schema update complete", "schema");
  } catch (error) {
    log(`Error creating tables: ${error}`, "schema");
    console.error("Error creating tables:", error);
    process.exit(1);
  }
}

createTables().then(() => {
  log("Schema update script completed", "schema");
  // Force exit to prevent hanging
  setTimeout(() => process.exit(0), 1000);
});