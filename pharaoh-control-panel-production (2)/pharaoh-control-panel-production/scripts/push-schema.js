import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from '../shared/schema.js';

// Connect to the database
const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Initialize Drizzle with the schema
const db = drizzle(pool, { schema });

// Main function
async function main() {
  console.log('Creating tables based on schema...');
  
  try {
    // Create the session table first
    await pool.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        sid VARCHAR(255) PRIMARY KEY,
        sess JSONB NOT NULL,
        expire TIMESTAMP NOT NULL
      );
      CREATE INDEX IF NOT EXISTS IDX_session_expire ON sessions (expire);
    `);
    
    console.log('Session table created or verified');
    
    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        username TEXT UNIQUE,
        email TEXT UNIQUE,
        first_name TEXT,
        last_name TEXT,
        profile_image_url TEXT,
        plan TEXT DEFAULT 'free',
        stripe_customer_id TEXT,
        stripe_subscription_id TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log('Users table created or verified');
    
    // Add more tables here as needed
    console.log('Schema initialization complete!');
  } catch (error) {
    console.error('Error initializing database schema:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();