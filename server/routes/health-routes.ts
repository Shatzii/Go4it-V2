import { Router, Request, Response } from "express";
import { pool } from "../db";
import os from "os";

const router = Router();

/**
 * @route GET /api/health
 * @description Simple health check endpoint that returns basic system info
 * @access Public
 */
router.get("/", async (req: Request, res: Response) => {
  const startTime = process.hrtime();
  
  try {
    // Check database connection
    const dbStatus = await checkDatabaseConnection();
    
    // Get basic system info
    const systemInfo = {
      uptime: Math.floor(process.uptime()),
      memoryUsage: process.memoryUsage(),
      cpuLoad: os.loadavg(),
      totalMemory: os.totalmem(),
      freeMemory: os.freemem(),
    };
    
    // Calculate response time
    const hrtime = process.hrtime(startTime);
    const responseTimeMs = hrtime[0] * 1000 + hrtime[1] / 1000000;
    
    res.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || "1.0.0",
      database: dbStatus,
      system: systemInfo,
      responseTime: `${responseTimeMs.toFixed(2)}ms`,
    });
  } catch (error) {
    console.error("Health check failed:", error);
    
    // Calculate response time even on error
    const hrtime = process.hrtime(startTime);
    const responseTimeMs = hrtime[0] * 1000 + hrtime[1] / 1000000;
    
    res.status(500).json({
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : "Unknown error",
      responseTime: `${responseTimeMs.toFixed(2)}ms`,
    });
  }
});

/**
 * @route GET /api/health/ping
 * @description Simple endpoint that returns a 200 status code
 * @access Public
 */
router.get("/ping", (req: Request, res: Response) => {
  res.status(200).send("pong");
});

/**
 * @route GET /api/health/db
 * @description Check if the database is connected
 * @access Public
 */
router.get("/db", async (req: Request, res: Response) => {
  try {
    const dbStatus = await checkDatabaseConnection();
    
    if (dbStatus.connected) {
      res.status(200).json(dbStatus);
    } else {
      res.status(503).json(dbStatus);
    }
  } catch (error) {
    console.error("Database health check failed:", error);
    res.status(500).json({
      connected: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * Check database connection
 */
async function checkDatabaseConnection() {
  try {
    const client = await pool.connect();
    
    try {
      // Get database connection info
      const versionResult = await client.query('SELECT version()');
      const dbVersion = versionResult.rows[0].version;
      
      // Get connection pool stats
      const poolStats = {
        totalCount: pool.totalCount,
        idleCount: pool.idleCount,
        waitingCount: pool.waitingCount,
      };
      
      return {
        connected: true,
        version: dbVersion,
        poolStats,
      };
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Failed to connect to database:", error);
    return {
      connected: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export default router;