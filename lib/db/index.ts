import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// For query purposes
const queryClient = postgres(process.env.DATABASE_URL!);
export const db = drizzle(queryClient, { schema });

// For migration purposes (use this client for drizzle-kit)
// export const migrationClient = postgres(process.env.DATABASE_URL!, { max: 1 });
