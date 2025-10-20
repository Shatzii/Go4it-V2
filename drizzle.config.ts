import { defineConfig } from 'drizzle-kit';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL, ensure the database is provisioned');
}

// Detect database type from URL
const isSQLite = process.env.DATABASE_URL.startsWith('file:');
const dialect = isSQLite ? 'sqlite' : 'postgresql';

export default defineConfig({
  out: './migrations',
  schema: ['./shared/schema.ts', './shared/enterprise-schema.ts', './lib/db/schema.ts'],
  dialect: dialect as 'sqlite' | 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
