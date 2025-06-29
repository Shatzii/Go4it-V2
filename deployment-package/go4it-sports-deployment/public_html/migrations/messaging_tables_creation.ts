import { sql } from 'drizzle-orm';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Messaging Tables Migration
 * 
 * Creates database tables for the messaging system:
 * - Direct messages between users
 */

async function main() {
  console.log("Starting messaging tables migration...");
  
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL not defined");
    process.exit(1);
  }
  
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  try {
    // Create direct_messages table
    console.log("Creating direct_messages table...");
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS direct_messages (
        id SERIAL PRIMARY KEY,
        sender_id INTEGER NOT NULL REFERENCES users(id),
        recipient_id INTEGER NOT NULL REFERENCES users(id),
        content TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW(),
        deleted_by_sender BOOLEAN DEFAULT FALSE,
        deleted_by_recipient BOOLEAN DEFAULT FALSE
      );
    `);
    
    // Create indexes for better performance
    console.log("Creating indexes on messaging tables...");
    
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_direct_messages_sender ON direct_messages(sender_id);
      CREATE INDEX IF NOT EXISTS idx_direct_messages_recipient ON direct_messages(recipient_id);
      CREATE INDEX IF NOT EXISTS idx_direct_messages_created_at ON direct_messages(created_at);
    `);
    
    console.log("Messaging tables migration completed successfully!");
  } catch (error) {
    console.error("Error during migration:", error);
    throw error;
  } finally {
    await pool.end();
  }
}

main().catch(console.error);