/**
 * Go4It Sports Database Migration Tool
 * 
 * This script safely migrates the database schema for production deployment.
 * It performs a backup before attempting any changes and provides rollback capability.
 */

require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const { exec } = require('child_process');
const execAsync = promisify(exec);

// Constants
const SCHEMA_DIR = path.join(__dirname, 'shared', 'schema');
const BACKUP_DIR = path.join(__dirname, 'backups');
const LOG_DIR = path.join(__dirname, 'logs');

// Ensure directories exist
fs.mkdirSync(BACKUP_DIR, { recursive: true });
fs.mkdirSync(LOG_DIR, { recursive: true });

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

/**
 * Creates a backup of the current database
 */
async function createBackup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFilePath = path.join(BACKUP_DIR, `db-backup-${timestamp}.sql`);
  
  console.log(`Creating database backup at ${backupFilePath}...`);
  
  try {
    const pgDumpCmd = `PGPASSWORD="${process.env.PGPASSWORD}" pg_dump -h ${process.env.PGHOST} -U ${process.env.PGUSER} -d ${process.env.PGDATABASE} -F p -f "${backupFilePath}"`;
    await execAsync(pgDumpCmd);
    console.log('✅ Database backup completed successfully');
    return backupFilePath;
  } catch (error) {
    console.error('❌ Failed to create database backup:', error.message);
    throw new Error('Backup failed - migration aborted for safety');
  }
}

/**
 * Check current database structure
 */
async function checkDatabase() {
  console.log('\nChecking existing database structure...');
  
  try {
    const client = await pool.connect();
    
    try {
      // Check if database exists and is accessible
      const testQuery = await client.query('SELECT current_database() as db;');
      console.log(`✅ Connected to database: ${testQuery.rows[0].db}`);
      
      // Check existing tables
      const tablesQuery = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        ORDER BY table_name;
      `);
      
      if (tablesQuery.rows.length === 0) {
        console.log('No existing tables found - this appears to be a new installation');
        return { isNewInstall: true, tables: [] };
      } else {
        console.log(`Found ${tablesQuery.rows.length} existing tables:`);
        tablesQuery.rows.forEach(row => {
          console.log(`  - ${row.table_name}`);
        });
        return { 
          isNewInstall: false, 
          tables: tablesQuery.rows.map(row => row.table_name) 
        };
      }
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('❌ Database check failed:', error.message);
    throw new Error('Database check failed - migration aborted for safety');
  }
}

/**
 * Apply database migrations
 */
async function applyMigrations(dbInfo) {
  console.log('\nPreparing to apply database migrations...');
  
  // If this is a new installation, we'll create all tables
  // Otherwise, we'll check for schema changes and apply them safely
  
  try {
    const client = await pool.connect();
    
    try {
      // Start a transaction to ensure atomic updates
      await client.query('BEGIN');
      
      if (dbInfo.isNewInstall) {
        console.log('Creating new database schema...');
        // For a clean install, we can just execute the schema creation SQL
        await client.query(`
          -- Create tables defined in schema.js
          -- We'd typically load this directly from our schema definitions
          
          -- This is a simplified example
          CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(255) NOT NULL UNIQUE,
            email VARCHAR(255) UNIQUE,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          );
          
          CREATE TABLE IF NOT EXISTS athlete_profiles (
            id SERIAL PRIMARY KEY, 
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            sport VARCHAR(50) NOT NULL,
            position VARCHAR(50),
            bio TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          );
          
          -- Add more tables based on your schema
        `);
      } else {
        console.log('Applying schema migrations to existing database...');
        
        // For an existing installation, we check for schema changes
        // and apply migrations that won't destroy data
        
        // Example: Check if a new column needs to be added
        if (!await columnExists(client, 'users', 'profile_complete')) {
          console.log('Adding profile_complete column to users table...');
          await client.query(`
            ALTER TABLE users 
            ADD COLUMN profile_complete BOOLEAN DEFAULT FALSE;
          `);
        }
        
        // Example: Check if a new table needs to be created
        if (!dbInfo.tables.includes('gar_scores')) {
          console.log('Creating missing gar_scores table...');
          await client.query(`
            CREATE TABLE gar_scores (
              id SERIAL PRIMARY KEY,
              athlete_id INTEGER REFERENCES athlete_profiles(id) ON DELETE CASCADE,
              score NUMERIC(5,2) NOT NULL,
              category VARCHAR(50) NOT NULL,
              recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
          `);
        }
        
        // You would add more migration checks here based on your schema
      }
      
      // Commit the transaction
      await client.query('COMMIT');
      console.log('✅ Database migration successfully applied');
      
    } catch (error) {
      // Rollback the transaction on error
      await client.query('ROLLBACK');
      console.error('❌ Migration failed, changes rolled back:', error.message);
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Migration error:', error.message);
    throw new Error('Migration failed - please restore from backup');
  }
}

/**
 * Check if a column exists in a table
 */
async function columnExists(client, tableName, columnName) {
  const result = await client.query(`
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = $1 AND column_name = $2;
  `, [tableName, columnName]);
  
  return result.rows.length > 0;
}

/**
 * Main migration function
 */
async function migrate() {
  console.log('===== Go4It Sports Database Migration =====');
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Timestamp: ${new Date().toISOString()}\n`);
  
  let backupPath = null;
  
  try {
    // Step 1: Create a backup
    backupPath = await createBackup();
    
    // Step 2: Check database structure
    const dbInfo = await checkDatabase();
    
    // Step 3: Apply migrations
    await applyMigrations(dbInfo);
    
    console.log('\n✅ Migration completed successfully!');
    console.log(`Backup created at: ${backupPath}`);
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    
    if (backupPath) {
      console.log(`\nTo restore from backup, run:`);
      console.log(`PGPASSWORD="${process.env.PGPASSWORD}" psql -h ${process.env.PGHOST} -U ${process.env.PGUSER} -d ${process.env.PGDATABASE} -f "${backupPath}"`);
    }
    
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run migration if executed directly
if (require.main === module) {
  migrate().catch(err => {
    console.error('Unhandled error in migration:', err);
    process.exit(1);
  });
}

module.exports = { migrate, createBackup };