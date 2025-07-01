import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  console.warn("DATABASE_URL not found, falling back to in-memory storage");
  // In development or when DATABASE_URL is not available, use memory storage
  // In production with Railway, DATABASE_URL is automatically provided
}

export const pool = process.env.DATABASE_URL ? new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
}) : null;

export const db = pool ? drizzle({ client: pool, schema }) : null;
