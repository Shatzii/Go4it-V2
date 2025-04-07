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
      END $$;
    `);
    console.log("✅ Updated athlete_discoveries table with phone column");

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
      END $$;
    `);
    console.log("✅ Updated media_partner_discoveries table with contact columns");

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