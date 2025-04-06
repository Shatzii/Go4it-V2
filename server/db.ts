import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { log } from "./vite";

// Connection string is automatically picked up from environment variables
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  log("DATABASE_URL is not defined", "db");
  throw new Error("DATABASE_URL is not defined");
}

// Connect to the database with SSL enabled
log(`Connecting to database: ${DATABASE_URL}`, "db");
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