import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from 'ws';
import * as schema from '@shared/schema';
import { log } from "./vite";

neonConfig.webSocketConstructor = ws;

// Connection string is automatically picked up from environment variables
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  log("DATABASE_URL is not defined", "db");
  throw new Error("DATABASE_URL is not defined");
}

// Connect to the database with Neon serverless driver
log(`Connecting to database: ${DATABASE_URL}`, "db");
export const pool = new Pool({ connectionString: DATABASE_URL });
export const db = drizzle(pool, { schema });

// Setup graceful shutdown
process.on("SIGINT", () => {
  pool.end();
});

process.on("SIGTERM", () => {
  pool.end();
});