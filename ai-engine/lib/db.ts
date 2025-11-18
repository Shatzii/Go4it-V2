import { drizzle } from 'drizzle-orm/better-sqlite3';
import { sql } from 'drizzle-orm';
import Database from 'better-sqlite3';
import * as schema from './schema';

// Skip database initialization during build phase
const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build' || 
                    process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL;

let db: ReturnType<typeof drizzle>;

if (!isBuildTime) {
  // Use SQLite for development only
  const dbPath = process.env.DATABASE_URL?.replace('file:', '').replace(/^\/+/, '') || './go4it-os.db';
  
  try {
    const sqlite = new Database(dbPath);
    sqlite.pragma('journal_mode = WAL');
    
    db = drizzle(sqlite, {
      schema,
      logger: process.env.NODE_ENV === 'development',
    });
  } catch (error) {
    console.warn('SQLite database initialization skipped during build:', error);
    // Create a mock db object for build time
    db = null as any;
  }
} else {
  console.log('Database initialization skipped during build phase');
  db = null as any;
}

export { db };

// Export schema for convenience
export * from './schema';

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
