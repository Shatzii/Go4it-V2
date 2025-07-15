import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  console.warn("DATABASE_URL not set, using fallback");
  // Use fallback for development
  process.env.DATABASE_URL = process.env.DATABASE_URL || "postgresql://user:pass@localhost:5432/go4it";
}

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql, { 
  schema,
  logger: process.env.NODE_ENV === 'development'
});

// Export schema for convenience
export * from "./schema";

// Add connection test function
export async function testConnection() {
  try {
    await db.execute(sql`SELECT 1`);
    return { success: true };
  } catch (error) {
    console.error('Database connection failed:', error);
    return { success: false, error };
  }
}