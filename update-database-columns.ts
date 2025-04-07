import { db } from "./server/db";

async function updateDatabaseColumns() {
  console.log("📊 Updating database columns...");
  
  try {
    // Add missing columns to athlete_discoveries table
    await db.execute(`
      DO $$
      BEGIN
        -- Check if phone column exists in athlete_discoveries
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'athlete_discoveries' 
          AND column_name = 'phone'
        ) THEN
          ALTER TABLE athlete_discoveries ADD COLUMN phone TEXT;
          RAISE NOTICE 'Added phone column to athlete_discoveries';
        END IF;
        
        -- Check if location column exists in athlete_discoveries
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'athlete_discoveries' 
          AND column_name = 'location'
        ) THEN
          ALTER TABLE athlete_discoveries ADD COLUMN location TEXT;
          RAISE NOTICE 'Added location column to athlete_discoveries';
        END IF;
        
        -- Check if school_name column exists in athlete_discoveries
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'athlete_discoveries' 
          AND column_name = 'school_name'
        ) THEN
          ALTER TABLE athlete_discoveries ADD COLUMN school_name TEXT;
          RAISE NOTICE 'Added school_name column to athlete_discoveries';
        END IF;
        
        -- Check if graduation_year column exists in athlete_discoveries
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'athlete_discoveries' 
          AND column_name = 'graduation_year'
        ) THEN
          ALTER TABLE athlete_discoveries ADD COLUMN graduation_year INTEGER;
          RAISE NOTICE 'Added graduation_year column to athlete_discoveries';
        END IF;
        
        -- Check if bio column exists in athlete_discoveries
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'athlete_discoveries' 
          AND column_name = 'bio'
        ) THEN
          ALTER TABLE athlete_discoveries ADD COLUMN bio TEXT;
          RAISE NOTICE 'Added bio column to athlete_discoveries';
        END IF;
      END $$;
    `);
    console.log("✅ Updated athlete_discoveries table with phone and location columns");

    // Add missing columns to media_partner_discoveries table
    await db.execute(`
      DO $$
      BEGIN
        -- Check if contact_name column exists in media_partner_discoveries
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'media_partner_discoveries' 
          AND column_name = 'contact_name'
        ) THEN
          ALTER TABLE media_partner_discoveries ADD COLUMN contact_name TEXT;
          RAISE NOTICE 'Added contact_name column to media_partner_discoveries';
        END IF;

        -- Check if contact_email column exists in media_partner_discoveries
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'media_partner_discoveries' 
          AND column_name = 'contact_email'
        ) THEN
          ALTER TABLE media_partner_discoveries ADD COLUMN contact_email TEXT;
          RAISE NOTICE 'Added contact_email column to media_partner_discoveries';
        END IF;

        -- Check if contact_phone column exists in media_partner_discoveries
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'media_partner_discoveries' 
          AND column_name = 'contact_phone'
        ) THEN
          ALTER TABLE media_partner_discoveries ADD COLUMN contact_phone TEXT;
          RAISE NOTICE 'Added contact_phone column to media_partner_discoveries';
        END IF;
        
        -- Check if audience_type column exists in media_partner_discoveries
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'media_partner_discoveries' 
          AND column_name = 'audience_type'
        ) THEN
          ALTER TABLE media_partner_discoveries ADD COLUMN audience_type TEXT;
          RAISE NOTICE 'Added audience_type column to media_partner_discoveries';
        END IF;
        
        -- Check if recent_topics column exists in media_partner_discoveries
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'media_partner_discoveries' 
          AND column_name = 'recent_topics'
        ) THEN
          ALTER TABLE media_partner_discoveries ADD COLUMN recent_topics TEXT[];
          RAISE NOTICE 'Added recent_topics column to media_partner_discoveries';
        END IF;
      END $$;
    `);
    console.log("✅ Updated media_partner_discoveries table with all required columns");

  } catch (error) {
    console.error("Error updating database columns:", error);
  }
}

// Run the function
updateDatabaseColumns().then(() => {
  console.log("🎉 Database columns update completed");
  process.exit(0);
}).catch(error => {
  console.error("❌ Failed to update database columns:", error);
  process.exit(1);
});