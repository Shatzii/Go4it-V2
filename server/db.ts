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

// Connect to the database with Neon serverless driver
log(`Connecting to database: ${process.env.DATABASE_URL}`, "db");
export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool, schema });

// Setup graceful shutdown
process.on("SIGINT", () => {
  pool.end();
});

process.on("SIGTERM", () => {
  pool.end();
});