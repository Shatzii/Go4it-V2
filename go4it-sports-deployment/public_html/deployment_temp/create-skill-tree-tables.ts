import { db } from "./server/db";
import { skillTreeNodes, skillTreeRelationships, skills, trainingDrills } from "./shared/schema";
import { log } from "./server/vite";

// Function to create skill tree related tables
async function createSkillTreeTables() {
  log("Creating skill tree tables...", "schema");
  
  try {
    // Create skillTreeNodes table
    log("Creating skill_tree_nodes table...", "schema");
    await db.execute(`
      CREATE TABLE IF NOT EXISTS skill_tree_nodes (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        sport_type TEXT,
        position TEXT,
        level INTEGER NOT NULL DEFAULT 1,
        xp_to_unlock INTEGER DEFAULT 0,
        icon_path TEXT,
        parent_category TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    // Create skillTreeRelationships table
    log("Creating skill_tree_relationships table...", "schema");
    await db.execute(`
      CREATE TABLE IF NOT EXISTS skill_tree_relationships (
        id SERIAL PRIMARY KEY,
        parent_id INTEGER REFERENCES skill_tree_nodes(id),
        child_id INTEGER NOT NULL REFERENCES skill_tree_nodes(id),
        relationship_type TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    // Create skills table
    log("Creating skills table...", "schema");
    await db.execute(`
      CREATE TABLE IF NOT EXISTS skills (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        skill_node_id INTEGER NOT NULL REFERENCES skill_tree_nodes(id),
        skill_name TEXT NOT NULL,
        skill_category TEXT NOT NULL,
        skill_level INTEGER NOT NULL DEFAULT 0,
        xp_earned INTEGER NOT NULL DEFAULT 0,
        unlocked BOOLEAN DEFAULT FALSE,
        last_practiced TIMESTAMP,
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    // Create trainingDrills table
    log("Creating training_drills table...", "schema");
    await db.execute(`
      CREATE TABLE IF NOT EXISTS training_drills (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        difficulty INTEGER NOT NULL DEFAULT 1,
        duration_minutes INTEGER NOT NULL,
        skill_node_id INTEGER REFERENCES skill_tree_nodes(id),
        equipment_needed TEXT[],
        instructions TEXT[],
        video_url TEXT,
        thumbnail_url TEXT,
        points_value INTEGER DEFAULT 10,
        created_by INTEGER REFERENCES users(id),
        ai_generated BOOLEAN DEFAULT FALSE,
        sport_type TEXT,
        position TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Create AI coach content table if it doesn't exist
    log("Creating ai_coach_content table...", "schema");
    await db.execute(`
      CREATE TABLE IF NOT EXISTS ai_coach_content (
        id SERIAL PRIMARY KEY,
        sport_type TEXT NOT NULL,
        position TEXT,
        content_type TEXT NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        skill_level TEXT NOT NULL,
        tags TEXT[],
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        ai_model TEXT,
        metadata JSONB
      )
    `);
    
    log("✅ Skill tree tables created successfully", "schema");
  } catch (error) {
    log(`Error creating skill tree tables: ${error}`, "schema");
    console.error("Error creating skill tree tables:", error);
    throw error;
  }
}

// Run the function
createSkillTreeTables()
  .then(() => {
    log("Skill tree tables creation completed", "schema");
    process.exit(0);
  })
  .catch((error) => {
    log(`Failed to create skill tree tables: ${error}`, "schema");
    console.error("Failed to create skill tree tables:", error);
    process.exit(1);
  });