import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { promises as fsPromises } from 'fs';
import OpenAI from 'openai';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.resolve(__dirname, '../dist');
const LOGS_DIR = path.resolve(__dirname, '../logs');
const BUILD_INFO_FILE = path.join(DIST_DIR, 'build-info.json');

// Initialize OpenAI client for status check
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Create router
const router = express.Router();

// Status endpoint
router.get('/status', async (req, res) => {
  try {
    const status = {
      buildInfo: await getBuildInfo(),
      uploaderHealth: await getUploaderHealth(),
      aiConnectionStatus: await getAIConnectionStatus(),
      serverTime: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    };
    
    return res.status(200).json(status);
  } catch (error) {
    console.error('Error retrieving status:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error retrieving system status',
      error: error.message
    });
  }
});

// Get build information
async function getBuildInfo() {
  try {
    // Check if build info file exists
    if (fs.existsSync(BUILD_INFO_FILE)) {
      const buildInfoContent = await fsPromises.readFile(BUILD_INFO_FILE, 'utf8');
      return JSON.parse(buildInfoContent);
    }
    
    // Check if dist directory exists and get stats
    if (fs.existsSync(DIST_DIR)) {
      const stats = await fsPromises.stat(DIST_DIR);
      return {
        lastBuildTime: stats.mtime,
        buildExists: true,
        buildCreatedAt: stats.birthtime,
        buildInfoFile: 'Not available'
      };
    }
    
    return {
      lastBuildTime: null,
      buildExists: false,
      message: 'No build found'
    };
  } catch (error) {
    console.error('Error getting build info:', error);
    return {
      error: error.message,
      buildExists: false
    };
  }
}

// Check uploader health
async function getUploaderHealth() {
  try {
    // Check if logs directory exists
    const logsExist = fs.existsSync(LOGS_DIR);
    
    // Get uploader log file path
    const uploaderLogFile = path.join(LOGS_DIR, 'uploader.log');
    
    // Check if uploader log file exists
    let lastUploadTime = null;
    let recentUploads = [];
    
    if (fs.existsSync(uploaderLogFile)) {
      // Read the last few lines of the log file
      const logContent = await fsPromises.readFile(uploaderLogFile, 'utf8');
      const logLines = logContent.split('\n').filter(line => line.trim());
      
      if (logLines.length > 0) {
        // Parse the most recent log entry
        const lastLog = JSON.parse(logLines[logLines.length - 1]);
        lastUploadTime = lastLog.timestamp;
        
        // Get the 5 most recent uploads
        recentUploads = logLines
          .slice(-5)
          .map(line => JSON.parse(line))
          .filter(log => log.action.includes('upload'));
      }
    }
    
    return {
      healthy: true,
      logsDirectoryExists: logsExist,
      lastUploadTime,
      recentUploads
    };
  } catch (error) {
    console.error('Error checking uploader health:', error);
    return {
      healthy: false,
      error: error.message
    };
  }
}

// Check AI connection status
async function getAIConnectionStatus() {
  try {
    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return {
        connected: false,
        apiKeyConfigured: false,
        message: 'OpenAI API key not configured'
      };
    }
    
    // Attempt to call OpenAI API
    await openai.models.list();
    
    return {
      connected: true,
      apiKeyConfigured: true,
      message: 'OpenAI API connection successful'
    };
  } catch (error) {
    console.error('Error checking AI connection:', error);
    return {
      connected: false,
      apiKeyConfigured: true,
      message: 'OpenAI API connection failed',
      error: error.message
    };
  }
}

// Update build info
router.post('/update-build-info', async (req, res) => {
  try {
    const { version, buildNumber, commitHash, buildDate } = req.body;
    
    // Ensure build directory exists
    if (!fs.existsSync(DIST_DIR)) {
      fs.mkdirSync(DIST_DIR, { recursive: true });
    }
    
    // Create build info object
    const buildInfo = {
      version: version || '1.0.0',
      buildNumber: buildNumber || Date.now(),
      commitHash: commitHash || 'unknown',
      buildDate: buildDate || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Write build info to file
    await fsPromises.writeFile(
      BUILD_INFO_FILE,
      JSON.stringify(buildInfo, null, 2),
      'utf8'
    );
    
    return res.status(200).json({
      success: true,
      message: 'Build info updated successfully',
      buildInfo
    });
  } catch (error) {
    console.error('Error updating build info:', error);
    return res.status(500).json({
      success: false,
      message: 'Error updating build info',
      error: error.message
    });
  }
});

export default router;