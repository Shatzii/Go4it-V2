import { db } from "./server/db";
import { sql } from "drizzle-orm";

async function fixLastUpdatedColumn() {
  try {
    console.log("Adding 'last_updated' column to transfer_portal_entries table...");
    
    // Add the missing column with defaultNow()
    await db.execute(sql`
      ALTER TABLE transfer_portal_entries
      ADD COLUMN IF NOT EXISTS last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    `);
    
    console.log("Column 'last_updated' successfully added to transfer_portal_entries table.");
    console.log("Fix completed successfully!");
  } catch (error) {
    console.error("Error adding last_updated column:", error);
  } finally {
    process.exit(0);
  }
}

// Run the fix function
fixLastUpdatedColumn();