import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { User } from './user';
import { Analytics } from './analytics';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

export { db, User, Analytics };