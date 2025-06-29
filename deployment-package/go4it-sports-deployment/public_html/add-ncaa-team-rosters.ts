import { db } from "./server/db";
import { sql } from "drizzle-orm";

async function addNcaaTeamRostersTable() {
  try {
    console.log("Checking if ncaa_team_rosters table exists...");
    
    // Check if the table exists
    const result = await db.execute(sql`
      SELECT table_name
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'ncaa_team_rosters'
    `);
    
    // If table doesn't exist, create it
    if (result.rows.length === 0) {
      console.log("Creating ncaa_team_rosters table...");
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS ncaa_team_rosters (
          id SERIAL PRIMARY KEY,
          school TEXT NOT NULL,
          sport TEXT NOT NULL,
          division TEXT,
          conference TEXT,
          roster_status TEXT DEFAULT 'normal',
          roster_size INTEGER,
          position_needs JSONB,
          last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      
      // Insert sample data
      console.log("Inserting sample data into ncaa_team_rosters...");
      const schools = ["Alabama", "Clemson", "Ohio State", "LSU", "Georgia", "Oklahoma", "Notre Dame", "Michigan", "Texas", "Florida"];
      const sports = ["football", "basketball", "baseball", "soccer"];
      const divisions = ["D1", "D2", "D3"];
      const conferences = ["SEC", "Big Ten", "ACC", "Big 12", "Pac-12"];
      const statusOptions = ["normal", "low", "overstocked"];
      
      for (const school of schools) {
        for (const sport of sports) {
          const division = divisions[Math.floor(Math.random() * divisions.length)];
          const conference = conferences[Math.floor(Math.random() * conferences.length)];
          const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];
          const rosterSize = Math.floor(Math.random() * 40) + 40; // 40-80 players
          
          // Create position needs based on sport
          let positionNeeds: any = {};
          
          if (sport === "football") {
            positionNeeds = {
              QB: Math.random() > 0.7 ? "high" : "low",
              RB: Math.random() > 0.5 ? "medium" : "low",
              WR: Math.random() > 0.6 ? "high" : "medium",
              OL: Math.random() > 0.4 ? "high" : "medium",
              DL: Math.random() > 0.5 ? "medium" : "low",
              LB: Math.random() > 0.6 ? "high" : "low",
              DB: Math.random() > 0.5 ? "medium" : "high"
            };
          } else if (sport === "basketball") {
            positionNeeds = {
              PG: Math.random() > 0.6 ? "high" : "low",
              SG: Math.random() > 0.5 ? "medium" : "low",
              SF: Math.random() > 0.7 ? "high" : "medium",
              PF: Math.random() > 0.4 ? "medium" : "low",
              C: Math.random() > 0.6 ? "high" : "medium"
            };
          } else {
            positionNeeds = {
              offense: Math.random() > 0.5 ? "high" : "medium",
              defense: Math.random() > 0.5 ? "medium" : "high"
            };
          }
          
          await db.execute(sql`
            INSERT INTO ncaa_team_rosters (
              school, sport, division, conference, roster_status, roster_size, position_needs
            ) VALUES (
              ${school}, ${sport}, ${division}, ${conference}, ${status}, ${rosterSize}, ${JSON.stringify(positionNeeds)}::jsonb
            )
          `);
        }
      }
      
      console.log("NCAA team rosters table created and populated with sample data.");
    } else {
      console.log("The ncaa_team_rosters table already exists.");
    }
    
    console.log("Update completed successfully!");
  } catch (error) {
    console.error("Error creating NCAA team rosters table:", error);
  } finally {
    process.exit(0);
  }
}

// Run the update function
addNcaaTeamRostersTable();