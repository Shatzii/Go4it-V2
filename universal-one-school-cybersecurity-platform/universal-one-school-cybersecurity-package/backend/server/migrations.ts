import { db } from "./db";
import * as schema from "@shared/schema";
import { sql } from "drizzle-orm";

/**
 * Run database migrations to ensure all tables and relationships exist
 */
export async function runMigrations() {
  try {
    console.log("Running database migrations...");
    
    // Create or update tables based on schema
    await createTablesIfNotExist();
    
    console.log("Database migrations completed successfully");
  } catch (error) {
    console.error("Error running migrations:", error);
    throw error;
  }
}

async function createTablesIfNotExist() {
  // Check if users table exists
  const userTableExists = await checkTableExists('users');
  if (!userTableExists) {
    console.log("Creating users table...");
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        role TEXT NOT NULL DEFAULT 'user',
        client_id INTEGER,
        is_active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
  }
  
  // Check if clients table exists
  const clientTableExists = await checkTableExists('clients');
  if (!clientTableExists) {
    console.log("Creating clients table...");
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS clients (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        domain TEXT,
        is_active BOOLEAN NOT NULL DEFAULT true,
        settings JSONB,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
  }
  
  // Check if threats table exists
  const threatsTableExists = await checkTableExists('threats');
  if (!threatsTableExists) {
    console.log("Creating threats table...");
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS threats (
        id SERIAL PRIMARY KEY,
        client_id INTEGER NOT NULL,
        type TEXT NOT NULL,
        severity TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'active',
        title TEXT NOT NULL,
        description TEXT,
        source_ip TEXT,
        target_ip TEXT,
        detected_at TIMESTAMP DEFAULT NOW(),
        resolved_at TIMESTAMP,
        FOREIGN KEY (client_id) REFERENCES clients(id)
      )
    `);
  }
  
  // Check if logs table exists
  const logsTableExists = await checkTableExists('logs');
  if (!logsTableExists) {
    console.log("Creating logs table...");
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS logs (
        id SERIAL PRIMARY KEY,
        client_id INTEGER NOT NULL,
        level TEXT NOT NULL,
        source TEXT NOT NULL,
        message TEXT NOT NULL,
        metadata JSONB,
        timestamp TIMESTAMP DEFAULT NOW(),
        FOREIGN KEY (client_id) REFERENCES clients(id)
      )
    `);
  }
  
  // Check if network_nodes table exists
  const networkNodesTableExists = await checkTableExists('network_nodes');
  if (!networkNodesTableExists) {
    console.log("Creating network_nodes table...");
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS network_nodes (
        id SERIAL PRIMARY KEY,
        client_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        ip_address TEXT NOT NULL,
        node_type TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'offline',
        last_seen TIMESTAMP,
        FOREIGN KEY (client_id) REFERENCES clients(id)
      )
    `);
  }
  
  // Check if alerts table exists
  const alertsTableExists = await checkTableExists('alerts');
  if (!alertsTableExists) {
    console.log("Creating alerts table...");
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS alerts (
        id SERIAL PRIMARY KEY,
        client_id INTEGER NOT NULL,
        type TEXT NOT NULL,
        severity TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        is_read BOOLEAN NOT NULL DEFAULT false,
        is_resolved BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW(),
        FOREIGN KEY (client_id) REFERENCES clients(id)
      )
    `);
  }
  
  // Check if file_integrity_checks table exists
  const fileIntegrityTableExists = await checkTableExists('file_integrity_checks');
  if (!fileIntegrityTableExists) {
    console.log("Creating file_integrity_checks table...");
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS file_integrity_checks (
        id SERIAL PRIMARY KEY,
        client_id INTEGER NOT NULL,
        file_path TEXT NOT NULL,
        file_type TEXT NOT NULL,
        checksum TEXT,
        status TEXT NOT NULL DEFAULT 'unchanged',
        last_checked TIMESTAMP DEFAULT NOW(),
        FOREIGN KEY (client_id) REFERENCES clients(id)
      )
    `);
  }
  
  // Check if anomalies table exists
  const anomaliesTableExists = await checkTableExists('anomalies');
  if (!anomaliesTableExists) {
    console.log("Creating anomalies table...");
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS anomalies (
        id SERIAL PRIMARY KEY,
        client_id INTEGER NOT NULL,
        type TEXT NOT NULL,
        score INTEGER NOT NULL,
        description TEXT,
        metadata JSONB,
        detected_at TIMESTAMP DEFAULT NOW(),
        FOREIGN KEY (client_id) REFERENCES clients(id)
      )
    `);
  }
  
  // Create indexes for faster queries
  await createOptimizedIndexes();
}

async function checkTableExists(tableName: string): Promise<boolean> {
  const result = await db.execute(sql`
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public'
      AND table_name = ${tableName}
    )
  `);
  
  return result.rows[0].exists;
}

async function createOptimizedIndexes() {
  console.log("Creating optimized indexes...");
  
  // Index on clients.is_active for quicker lookups
  await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_clients_is_active ON clients(is_active)`);
  
  // Indexes for threats table
  await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_threats_client_id ON threats(client_id)`);
  await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_threats_severity ON threats(severity)`);
  await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_threats_status ON threats(status)`);
  
  // Indexes for logs table
  await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_logs_client_id ON logs(client_id)`);
  await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_logs_level ON logs(level)`);
  await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_logs_timestamp ON logs(timestamp)`);
  
  // Indexes for network_nodes table
  await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_network_nodes_client_id ON network_nodes(client_id)`);
  await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_network_nodes_status ON network_nodes(status)`);
  
  // Indexes for alerts table
  await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_alerts_client_id ON alerts(client_id)`);
  await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_alerts_severity ON alerts(severity)`);
  await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_alerts_is_read ON alerts(is_read)`);
  
  // Indexes for anomalies table
  await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_anomalies_client_id ON anomalies(client_id)`);
  await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_anomalies_score ON anomalies(score)`);
  
  console.log("Database indexes created successfully");
}