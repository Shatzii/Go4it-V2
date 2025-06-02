import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// Connection string is automatically picked up from environment variables
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("DATABASE_URL is not defined");
  throw new Error("DATABASE_URL is not defined");
}

// Connect to the database with SSL enabled
console.log(`Connecting to database: ${DATABASE_URL}`);
export const connection = postgres(DATABASE_URL, {
  ssl: {
    rejectUnauthorized: false,
    require: true
  }
});
export const db = drizzle(connection);

// Setup graceful shutdown
process.on("SIGINT", () => {
  connection.end();
});

process.on("SIGTERM", () => {
  connection.end();
});