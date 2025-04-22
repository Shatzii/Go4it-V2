import { Router, Request, Response } from "express";
import { db } from "../db";

const router = Router();

/**
 * Health check endpoint
 * Used for monitoring and deployment services to verify the application is running
 */
router.get("/health", async (req: Request, res: Response) => {
  try {
    // Check database connection
    const dbStatus = await checkDatabaseConnection();
    
    // Return health status
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      database: dbStatus,
      version: process.env.npm_package_version || "1.0.0"
    });
  } catch (error) {
    console.error("Health check failed:", error);
    
    res.status(500).json({
      status: "error",
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

/**
 * Check database connection
 */
async function checkDatabaseConnection() {
  try {
    // Simple query to test database connection
    await db.query.users.findMany({
      limit: 1,
    });
    
    return { connected: true };
  } catch (error) {
    return { 
      connected: false,
      error: error instanceof Error ? error.message : "Unknown database error"
    };
  }
}

export default router;