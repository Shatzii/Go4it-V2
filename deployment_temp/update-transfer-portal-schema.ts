import { db } from "./server/db";
import { sql } from "drizzle-orm";

async function updateTransferPortalSchema() {
  try {
    console.log("Checking columns in transfer_portal_entries table...");
    
    // Check which columns exist in the table
    const result = await db.execute(sql`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'transfer_portal_entries';
    `);
    
    // Convert result to array of column names
    const existingColumns = result.rows.map((row: any) => row.column_name);
    console.log("Existing columns:", existingColumns);
    
    // Add missing text columns
    const textColumnsToAdd = [
      'hometown', 
      'high_school',
      'committed_to',
      'agent_name'
    ];
    
    // Add missing array columns
    const arrayColumnsToAdd = [
      'video_highlights',
      'best_fit_schools'
    ];
    
    // Add missing JSON columns
    const jsonColumnsToAdd = [
      'last_season_stats',
      'career_stats',
      'academic_info',
      'injury_history',
      'fit_reasons',
      'social_media_handles',
      'contact_info',
      'nil_deals'
    ];
    
    // Create SQL for adding missing columns
    let alterTableSQL = 'ALTER TABLE transfer_portal_entries ';
    let addedColumns = 0;
    
    // Add text columns
    textColumnsToAdd.forEach(column => {
      if (!existingColumns.includes(column)) {
        alterTableSQL += `ADD COLUMN IF NOT EXISTS ${column} TEXT, `;
        addedColumns++;
      }
    });
    
    // Add array columns
    arrayColumnsToAdd.forEach(column => {
      if (!existingColumns.includes(column)) {
        alterTableSQL += `ADD COLUMN IF NOT EXISTS ${column} TEXT[], `;
        addedColumns++;
      }
    });
    
    // Add JSON columns
    jsonColumnsToAdd.forEach(column => {
      if (!existingColumns.includes(column)) {
        alterTableSQL += `ADD COLUMN IF NOT EXISTS ${column} JSONB, `;
        addedColumns++;
      }
    });
    
    // Add timestamp columns
    if (!existingColumns.includes('commit_date')) {
      alterTableSQL += `ADD COLUMN IF NOT EXISTS commit_date TIMESTAMP, `;
      addedColumns++;
    }
    
    if (!existingColumns.includes('portal_deadline')) {
      alterTableSQL += `ADD COLUMN IF NOT EXISTS portal_deadline TIMESTAMP, `;
      addedColumns++;
    }
    
    // Remove trailing comma and space
    if (addedColumns > 0) {
      alterTableSQL = alterTableSQL.slice(0, -2);
      
      // Execute the SQL
      console.log(`Adding ${addedColumns} missing columns to transfer_portal_entries table...`);
      await db.execute(sql([alterTableSQL]));
      console.log("Columns successfully added to transfer_portal_entries table.");
    } else {
      console.log("All required columns already exist in transfer_portal_entries table.");
    }
    
    console.log("Update completed successfully!");
  } catch (error) {
    console.error("Error updating transfer portal schema:", error);
  } finally {
    process.exit(0);
  }
}

// Run the update function
updateTransferPortalSchema();