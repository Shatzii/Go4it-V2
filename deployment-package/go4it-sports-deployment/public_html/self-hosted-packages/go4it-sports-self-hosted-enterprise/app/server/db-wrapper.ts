import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// Create a simplified wrapper around the database connection
// This allows us to avoid the problematic imports and only focus on the database interaction

// Connection string is automatically picked up from environment variables
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.log("DATABASE_URL is not defined");
  throw new Error("DATABASE_URL is not defined");
}

// Connect to the database
console.log(`Connecting to database: ${DATABASE_URL}`);
export const connection = postgres(DATABASE_URL);
export const db = drizzle(connection);

// Setup graceful shutdown
process.on("SIGINT", () => {
  connection.end();
});

process.on("SIGTERM", () => {
  connection.end();
});

export const testConnection = async () => {
  try {
    // Test connection by running a simple query
    const result = await connection`SELECT 1 as test`;
    if (result && result[0]?.test === 1) {
      return { success: true, message: "Successfully connected to the database" };
    } else {
      return { success: false, message: "Connection test failed" };
    }
  } catch (error: any) {
    return { 
      success: false, 
      message: `Database connection error: ${error.message}`,
      error 
    };
  }
};