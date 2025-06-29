import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { createWriteStream, promises as fsPromises } from 'fs';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import * as stream from 'stream';
import { promisify } from 'util';
import AdmZip from 'adm-zip';

const pipeline = promisify(stream.pipeline);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configuration
const UPLOAD_DIR = path.resolve(__dirname, '../uploads');
const DIST_DIR = path.resolve(__dirname, '../dist');
const LOGS_DIR = path.resolve(__dirname, '../logs');
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'admin-secret-token'; // Replace with env variable in production

// Ensure directories exist
for (const dir of [UPLOAD_DIR, DIST_DIR, LOGS_DIR]) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Setup multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only zip and JS files
    if (file.mimetype === 'application/zip' || file.mimetype === 'application/javascript' ||
        file.originalname.endsWith('.zip') || file.originalname.endsWith('.js')) {
      cb(null, true);
    } else {
      cb(new Error('Only .zip and .js files are allowed'));
    }
  }
});

// Create router
const router = express.Router();

// Auth middleware
const authMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1] || req.body.token;
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'Authentication token is required' });
  }

  // For JWT verification
  try {
    if (token === ADMIN_TOKEN) {
      next();
    } else {
      // Optional: Implement JWT verification
      jwt.verify(token, process.env.JWT_SECRET || 'jwt-secret');
      next();
    }
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid authentication token' });
  }
};

// Log function
async function logActivity(action: string, details: any) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    action,
    details,
  };
  
  const logFile = path.join(LOGS_DIR, 'uploader.log');
  await fsPromises.appendFile(
    logFile, 
    JSON.stringify(logEntry) + '\n',
    { encoding: 'utf8' }
  );
  
  return logEntry;
}

// Upload endpoint
router.post('/upload', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    
    const file = req.file;
    const targetDir = req.body.targetDir === 'dist' ? DIST_DIR : UPLOAD_DIR;
    
    // Handle ZIP files
    if (file.originalname.endsWith('.zip')) {
      const zip = new AdmZip(file.path);
      
      // Extract to target directory
      zip.extractAllTo(targetDir, true);
      
      await logActivity('zip_upload', { 
        file: file.originalname,
        size: file.size,
        targetDir,
        extractedTo: targetDir
      });
      
      return res.status(200).json({ 
        success: true, 
        message: 'ZIP file uploaded and extracted successfully',
        file: file.originalname,
        targetDir
      });
    } 
    // Handle JS files
    else if (file.originalname.endsWith('.js')) {
      // Move file to target directory
      const targetPath = path.join(targetDir, path.basename(file.originalname));
      await fsPromises.copyFile(file.path, targetPath);
      
      await logActivity('js_upload', { 
        file: file.originalname,
        size: file.size,
        targetDir,
        path: targetPath
      });
      
      return res.status(200).json({ 
        success: true, 
        message: 'JavaScript file uploaded successfully',
        file: file.originalname,
        targetDir
      });
    }
    
    return res.status(400).json({ success: false, message: 'Unsupported file type' });
    
  } catch (error) {
    console.error('Upload error:', error);
    
    await logActivity('upload_error', { 
      error: error.message,
      file: req.file?.originalname
    });
    
    return res.status(500).json({ 
      success: false, 
      message: 'Error processing upload',
      error: error.message
    });
  }
});

// Get logs endpoint
router.get('/logs', authMiddleware, async (req, res) => {
  try {
    const logFile = path.join(LOGS_DIR, 'uploader.log');
    
    // Check if log file exists
    if (!fs.existsSync(logFile)) {
      return res.status(200).json({ logs: [] });
    }
    
    // Read and parse logs
    const logContent = await fsPromises.readFile(logFile, 'utf8');
    const logs = logContent
      .split('\n')
      .filter(line => line.trim())
      .map(line => JSON.parse(line));
    
    return res.status(200).json({ logs });
  } catch (error) {
    console.error('Error retrieving logs:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error retrieving logs',
      error: error.message
    });
  }
});

export default router;