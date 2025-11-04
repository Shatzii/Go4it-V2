import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'file:./go4it-os.db';
}

// Extract the file path from the DATABASE_URL
const dbPath = process.env.DATABASE_URL.replace('file:', '').replace(/^\/+/, '');

// Create SQLite database connection
const sqlite = new Database(dbPath);
sqlite.pragma('journal_mode = WAL');

export const db = drizzle(sqlite, {
  schema,
  logger: process.env.NODE_ENV === 'development',
});

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
