import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from 'ws';
import * as schema from '@shared/schema';
import { log } from "./vite";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  log("DATABASE_URL is not defined", "db");
  throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");
}

// Connect to the database with Neon serverless driver with optimized connection pooling
log(`Connecting to database: ${process.env.DATABASE_URL}`, "db");
export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: 5000, // How long to wait for a new connection
  allowExitOnIdle: false, // Do not allow the pool to destroy client while client is in the middle of a transaction
});

// Log pool errors
pool.on('error', (err) => {
  log(`Unexpected error on idle client: ${err.message}`, "db");
});

// Export the drizzle instance
export const db = drizzle({ client: pool, schema });

// Setup graceful shutdown
process.on("SIGINT", () => {
  pool.end();
});

process.on("SIGTERM", () => {
  pool.end();
});