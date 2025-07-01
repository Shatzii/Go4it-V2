import pkg from 'pg';
const { Pool } = pkg;
import 'dotenv/config';

// Connect to the database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Main function
async function main() {
  console.log('Initializing database tables...');
  
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
    
    console.log('Session table created successfully');
    
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
    
    console.log('Users table created successfully');
    
    // Create server_metrics table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS server_metrics (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        server_id TEXT NOT NULL,
        name TEXT NOT NULL,
        value DECIMAL(10,2) NOT NULL,
        change DECIMAL(10,2) NOT NULL,
        status TEXT NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log('Server metrics table created successfully');
    
    // Create marketplace_models table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS marketplace_models (
        id VARCHAR(255) PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        type TEXT NOT NULL,
        icon TEXT NOT NULL,
        memory TEXT NOT NULL,
        verified BOOLEAN DEFAULT FALSE,
        featured BOOLEAN DEFAULT FALSE,
        badge TEXT,
        color TEXT NOT NULL,
        status TEXT DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        category TEXT,
        rating DECIMAL(3,1),
        review_count INTEGER,
        price TEXT,
        publisher_name TEXT,
        publisher_verified BOOLEAN DEFAULT FALSE,
        premium BOOLEAN DEFAULT FALSE
      );
    `);
    
    console.log('Marketplace models table created successfully');
    
    // Create installed_models table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS installed_models (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        model_id VARCHAR(255) NOT NULL,
        installed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status TEXT DEFAULT 'active',
        last_used TIMESTAMP,
        configuration JSONB,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (model_id) REFERENCES marketplace_models(id) ON DELETE CASCADE
      );
    `);
    
    console.log('Installed models table created successfully');
    
    // Create healing_events table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS healing_events (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        type TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        server_id TEXT NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        affected_service TEXT,
        severity TEXT DEFAULT 'medium',
        auto_resolved BOOLEAN DEFAULT FALSE,
        resolution_time INTEGER,
        impact TEXT,
        category TEXT,
        commands JSONB,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);
    
    console.log('Healing events table created successfully');
    
    console.log('Database initialization complete!');
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();