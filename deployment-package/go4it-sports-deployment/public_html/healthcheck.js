/**
 * Go4It Sports Health Check Monitor
 * 
 * This script monitors the health of all system components 
 * and provides diagnostic information.
 */

require('dotenv').config();
const http = require('http');
const https = require('https');
const fs = require('fs');
const { Pool } = require('pg');
const os = require('os');
const WebSocket = require('ws');

// Configure logging
const LOG_FILE = process.env.LOG_FILE_PATH || './logs/healthcheck.log';
const LOG_LEVEL = process.env.LOG_LEVEL || 'info';

// Constants
const CHECK_INTERVAL = process.env.HEALTH_CHECK_INTERVAL || 60000; // Default: 1 minute
const API_TIMEOUT = 10000; // 10 seconds
const SITE_URL = process.env.SITE_URL || 'https://go4itsports.org';
const API_ENDPOINTS = [
  '/api/health',
  '/api/status',
  '/api/content-blocks/section/what-makes-us-different',
  '/api/blog-posts'
];

// Initialize database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 2, // Use minimal connections for health checks
  idleTimeoutMillis: 10000
});

// Ensure log directory exists
const logDir = LOG_FILE.substring(0, LOG_FILE.lastIndexOf('/'));
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Simple logger
const logger = {
  info: (message) => {
    if (['debug', 'info', 'warn', 'error'].includes(LOG_LEVEL)) {
      const logMessage = `[${new Date().toISOString()}] [INFO] ${message}`;
      console.log(logMessage);
      fs.appendFileSync(LOG_FILE, logMessage + '\n');
    }
  },
  warn: (message) => {
    if (['debug', 'info', 'warn', 'error'].includes(LOG_LEVEL)) {
      const logMessage = `[${new Date().toISOString()}] [WARN] ${message}`;
      console.warn(logMessage);
      fs.appendFileSync(LOG_FILE, logMessage + '\n');
    }
  },
  error: (message, error) => {
    if (['debug', 'info', 'warn', 'error'].includes(LOG_LEVEL)) {
      const logMessage = `[${new Date().toISOString()}] [ERROR] ${message}`;
      console.error(logMessage);
      fs.appendFileSync(LOG_FILE, logMessage + '\n');
      
      if (error && error.stack) {
        fs.appendFileSync(LOG_FILE, error.stack + '\n');
      }
    }
  },
  debug: (message) => {
    if (LOG_LEVEL === 'debug') {
      const logMessage = `[${new Date().toISOString()}] [DEBUG] ${message}`;
      console.log(logMessage);
      fs.appendFileSync(LOG_FILE, logMessage + '\n');
    }
  }
};

/**
 * Check system resources
 */
async function checkSystemResources() {
  logger.debug('Checking system resources...');
  
  try {
    // CPU load
    const cpus = os.cpus();
    const cpuCount = cpus.length;
    const loadAvg = os.loadavg();
    const cpuUsage = (loadAvg[0] / cpuCount) * 100;
    
    // Memory usage
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;
    const memoryUsage = (usedMemory / totalMemory) * 100;
    
    // Disk space check - approximate for root directory
    let diskSpace = { available: 'Unknown', total: 'Unknown', usage: 'Unknown' };
    try {
      const { stdout } = await require('util').promisify(require('child_process').exec)('df -k / | tail -1');
      const parts = stdout.trim().split(/\s+/);
      diskSpace = {
        total: `${Math.round(parts[1] * 1024 / (1024 * 1024 * 1024))} GB`,
        available: `${Math.round(parts[3] * 1024 / (1024 * 1024 * 1024))} GB`,
        usage: `${parts[4]}`
      };
    } catch (err) {
      logger.warn('Could not check disk space: ' + err.message);
    }
    
    // Uptime
    const uptime = os.uptime();
    const uptimeHours = Math.floor(uptime / 3600);
    const uptimeMinutes = Math.floor((uptime % 3600) / 60);
    
    const systemInfo = {
      cpu: {
        count: cpuCount,
        model: cpus[0].model,
        loadAverage: loadAvg,
        usage: `${cpuUsage.toFixed(2)}%`,
        status: cpuUsage > 90 ? 'critical' : cpuUsage > 70 ? 'warning' : 'ok'
      },
      memory: {
        total: `${Math.round(totalMemory / (1024 * 1024 * 1024))} GB`,
        free: `${Math.round(freeMemory / (1024 * 1024 * 1024))} GB`,
        used: `${Math.round(usedMemory / (1024 * 1024 * 1024))} GB`,
        usage: `${memoryUsage.toFixed(2)}%`,
        status: memoryUsage > 90 ? 'critical' : memoryUsage > 80 ? 'warning' : 'ok'
      },
      disk: {
        total: diskSpace.total,
        available: diskSpace.available,
        usage: diskSpace.usage,
        status: diskSpace.usage && parseInt(diskSpace.usage) > 90 ? 'critical' : 
               diskSpace.usage && parseInt(diskSpace.usage) > 80 ? 'warning' : 'ok'
      },
      uptime: {
        seconds: uptime,
        formatted: `${uptimeHours}h ${uptimeMinutes}m`,
      },
      os: {
        platform: os.platform(),
        release: os.release(),
        type: os.type()
      }
    };
    
    logger.debug(`System resources: CPU ${systemInfo.cpu.usage}, Memory ${systemInfo.memory.usage}, Disk ${systemInfo.disk.usage}`);
    return { status: 'ok', data: systemInfo };
  } catch (error) {
    logger.error('Error checking system resources', error);
    return { status: 'error', message: error.message, error };
  }
}

/**
 * Check database connection and health
 */
async function checkDatabase() {
  logger.debug('Checking database connection...');
  
  try {
    const client = await pool.connect();
    
    try {
      // Basic connection test
      const result = await client.query('SELECT NOW() as time, current_database() as database, version() as version');
      
      // Check database size
      const sizeResult = await client.query(`
        SELECT pg_size_pretty(pg_database_size(current_database())) as size,
               pg_database_size(current_database()) as size_bytes
      `);
      
      // Check for long-running queries (>30 seconds)
      const longQueriesResult = await client.query(`
        SELECT pid, now() - query_start as duration, query
        FROM pg_stat_activity
        WHERE state = 'active' AND now() - query_start > interval '30 seconds'
        LIMIT 5
      `);
      
      // Check connection stats
      const connectionStats = await client.query(`
        SELECT sum(numbackends) as active_connections
        FROM pg_stat_database
      `);
      
      const dbInfo = {
        time: result.rows[0].time,
        database: result.rows[0].database,
        version: result.rows[0].version,
        size: sizeResult.rows[0].size,
        size_bytes: parseInt(sizeResult.rows[0].size_bytes),
        connections: {
          active: parseInt(connectionStats.rows[0].active_connections),
          max: parseInt(process.env.PG_MAX_CONNECTIONS || '20'),
          status: parseInt(connectionStats.rows[0].active_connections) > parseInt(process.env.PG_MAX_CONNECTIONS || '20') * 0.9 ? 'warning' : 'ok'
        },
        longRunningQueries: longQueriesResult.rows.map(row => ({
          pid: row.pid,
          duration: row.duration,
          query: row.query
        }))
      };
      
      // Critical warning if long-running queries exist
      if (longQueriesResult.rows.length > 0) {
        dbInfo.warnings = [`${longQueriesResult.rows.length} long-running queries detected`];
        dbInfo.status = 'warning';
      } else {
        dbInfo.status = 'ok';
      }
      
      logger.debug(`Database connection successful: ${dbInfo.database}, ${dbInfo.connections.active} connections active`);
      return { status: 'ok', data: dbInfo };
    } finally {
      client.release();
    }
  } catch (error) {
    logger.error('Database connection failed', error);
    return { status: 'error', message: error.message, error };
  }
}

/**
 * Check API endpoint health
 */
async function checkAPIEndpoints() {
  logger.debug('Checking API endpoints...');
  
  const results = [];
  const protocol = SITE_URL.startsWith('https') ? https : http;
  
  for (const endpoint of API_ENDPOINTS) {
    const url = `${SITE_URL}${endpoint}`;
    
    try {
      const startTime = Date.now();
      const response = await new Promise((resolve, reject) => {
        const req = protocol.get(url, { timeout: API_TIMEOUT }, (res) => {
          let data = '';
          res.on('data', (chunk) => {
            data += chunk;
          });
          res.on('end', () => {
            resolve({
              statusCode: res.statusCode,
              headers: res.headers,
              data: data.length < 1000 ? data : data.substring(0, 500) + '... (truncated)'
            });
          });
        }).on('error', (err) => {
          reject(err);
        });
        
        req.setTimeout(API_TIMEOUT, () => {
          req.abort();
          reject(new Error('Request timeout'));
        });
      });
      
      const responseTime = Date.now() - startTime;
      
      results.push({
        endpoint,
        url,
        statusCode: response.statusCode,
        responseTime: `${responseTime}ms`,
        contentType: response.headers['content-type'],
        status: response.statusCode >= 200 && response.statusCode < 300 ? 'ok' : 'error',
        headers: response.headers
      });
      
      logger.debug(`API endpoint ${endpoint}: ${response.statusCode} in ${responseTime}ms`);
    } catch (error) {
      logger.error(`API endpoint ${endpoint} failed`, error);
      results.push({
        endpoint,
        url,
        status: 'error',
        message: error.message
      });
    }
  }
  
  const overallStatus = results.every(r => r.status === 'ok') ? 'ok' : 'error';
  return { status: overallStatus, data: results };
}

/**
 * Check WebSocket connection
 */
async function checkWebSocketConnection() {
  logger.debug('Checking WebSocket connection...');
  
  const wsProtocol = SITE_URL.startsWith('https') ? 'wss' : 'ws';
  const wsUrl = `${wsProtocol}://${SITE_URL.replace(/^https?:\/\//, '')}/ws`;
  
  return new Promise((resolve) => {
    try {
      const startTime = Date.now();
      const ws = new WebSocket(wsUrl);
      let connected = false;
      
      const timeout = setTimeout(() => {
        if (ws.readyState !== WebSocket.CLOSED) {
          ws.close();
        }
        
        if (!connected) {
          logger.error(`WebSocket connection timed out after ${API_TIMEOUT}ms`);
          resolve({
            status: 'error',
            message: 'Connection timed out',
            data: {
              url: wsUrl,
              connectionTime: `${Date.now() - startTime}ms`,
              readyState: ws.readyState
            }
          });
        }
      }, API_TIMEOUT);
      
      ws.on('open', () => {
        connected = true;
        const connectionTime = Date.now() - startTime;
        logger.debug(`WebSocket connected in ${connectionTime}ms`);
        
        // Send a ping
        ws.send(JSON.stringify({ type: 'ping' }));
        
        // We don't need to wait for response in health check
        clearTimeout(timeout);
        ws.close();
        
        resolve({
          status: 'ok',
          data: {
            url: wsUrl,
            connectionTime: `${connectionTime}ms`,
            readyState: 'OPEN'
          }
        });
      });
      
      ws.on('error', (error) => {
        logger.error('WebSocket connection error', error);
        clearTimeout(timeout);
        ws.close();
        
        resolve({
          status: 'error',
          message: error.message,
          data: {
            url: wsUrl,
            connectionTime: `${Date.now() - startTime}ms`,
            readyState: ws.readyState
          }
        });
      });
    } catch (error) {
      logger.error('WebSocket connection setup failed', error);
      resolve({
        status: 'error',
        message: error.message
      });
    }
  });
}

/**
 * Run a complete health check
 */
async function runHealthCheck() {
  logger.info('Starting health check...');
  
  const startTime = Date.now();
  const results = {
    timestamp: new Date().toISOString(),
    system: await checkSystemResources(),
    database: await checkDatabase(),
    api: await checkAPIEndpoints(),
    websocket: await checkWebSocketConnection(),
    duration: `${Date.now() - startTime}ms`
  };
  
  // Determine overall status
  const componentStatuses = [
    results.system.status,
    results.database.status,
    results.api.status,
    results.websocket.status
  ];
  
  if (componentStatuses.includes('error')) {
    results.status = 'error';
  } else if (componentStatuses.includes('warning')) {
    results.status = 'warning';
  } else {
    results.status = 'ok';
  }
  
  logger.info(`Health check complete: status=${results.status}, duration=${results.duration}`);
  
  // Write results to file
  const resultsPath = `./logs/health-${new Date().toISOString().replace(/:/g, '-')}.json`;
  fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
  
  return results;
}

/**
 * Start periodic health checks
 */
function startHealthChecks() {
  logger.info(`Starting health check monitor (interval: ${CHECK_INTERVAL}ms)...`);
  
  // Run an initial health check
  runHealthCheck().catch(err => {
    logger.error('Error in health check', err);
  });
  
  // Set up periodic health checks
  setInterval(() => {
    runHealthCheck().catch(err => {
      logger.error('Error in health check', err);
    });
  }, CHECK_INTERVAL);
}

// Run the health check if this script is executed directly
if (require.main === module) {
  startHealthChecks();
}

module.exports = { runHealthCheck, startHealthChecks };