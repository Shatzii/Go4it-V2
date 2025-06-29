import { db } from "./server/db";
import { sql } from "drizzle-orm";

async function addIsCoreToAcademicCourses() {
  try {
    console.log("Adding is_core column to academic_courses table...");
    
    // Check if the column already exists
    const checkResult = await db.execute(sql`
      SELECT column_name
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
        AND table_name = 'academic_courses' 
        AND column_name = 'is_core'
    `);
    
    if (checkResult.rows.length === 0) {
      // If column doesn't exist, add it
      await db.execute(sql`
        ALTER TABLE academic_courses ADD COLUMN is_core BOOLEAN DEFAULT FALSE
      `);
      console.log("Added is_core column to academic_courses table");
      
      // Update some courses to be core courses for NCAA eligibility
      await db.execute(sql`
        UPDATE academic_courses 
        SET is_core = TRUE 
        WHERE course_level = 'AP' OR course_level = 'Honors' 
          OR name LIKE '%Math%' OR name LIKE '%English%' 
          OR name LIKE '%Science%' OR name LIKE '%History%'
      `);
      console.log("Updated core courses for NCAA eligibility");
    } else {
      console.log("is_core column already exists in academic_courses table");
    }
    
    console.log("Schema update completed successfully");
  } catch (error) {
    console.error("Error updating academic_courses schema:", error);
  } finally {
    process.exit(0);
  }
}

// Run the function
addIsCoreToAcademicCourses();
