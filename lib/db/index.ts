import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { poolConfig } from '../database-optimizations';

// Connection pooling configuration based on environment
const isProduction = process.env.NODE_ENV === 'production';
const poolSettings = isProduction ? poolConfig.production : poolConfig.development;

// Create connection with pooling
const queryClient = postgres(process.env.DATABASE_URL!, {
  max: poolSettings.max,
  min: poolSettings.min,
  idle_timeout: poolSettings.idle,
  connect_timeout: poolSettings.acquire,
  max_lifetime: poolSettings.evict,
  // Enable prepared statements for better performance
  prepare: true,
  // Connection retry logic
  retry_on_release: true,
  // Health checks
  keep_alive: 60,
});

export const db = drizzle(queryClient, { schema });

// Graceful shutdown
process.on('SIGINT', async () => {
  await queryClient.end();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await queryClient.end();
  process.exit(0);
});
