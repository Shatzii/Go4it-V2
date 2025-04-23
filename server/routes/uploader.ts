import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { log } from '../vite';
import { exec } from 'child_process';
import { promisify } from 'util';
import { OpenAI } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();
const execPromise = promisify(exec);

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Keep track of upload logs
const uploadLogs: {timestamp: Date, action: string, details: string, user?: string}[] = [];

// Function to add entries to the log
function addLogEntry(action: string, details: string, user?: string) {
  const entry = {
    timestamp: new Date(),
    action,
    details,
    user
  };
  uploadLogs.push(entry);
  
  // Keep log size manageable (last 100 entries)
  if (uploadLogs.length > 100) {
    uploadLogs.shift();
  }
  
  log(`[UPLOADER] ${action}: ${details}`, 'uploader');
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.resolve(process.cwd(), 'uploads');
    
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Use original filename but prevent duplicates with timestamp
    const uniquePrefix = Date.now() + '-';
    cb(null, uniquePrefix + file.originalname);
  }
});

// File filter to control allowed file types
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Allow only specific file types
  const allowedExtensions = ['.js', '.ts', '.jsx', '.tsx', '.css', '.json', '.html'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('File type not allowed. Only code files (.js, .ts, .jsx, .tsx, .css, .json, .html) are permitted.'));
  }
};

// Setup multer upload
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max file size
  }
});

// Route to handle file uploads
router.post('/upload', (req: Request, res: Response) => {
  // Check if user is admin
  if (!req.isAuthenticated() || req.user?.role !== 'admin') {
    return res.status(403).json({ 
      success: false, 
      message: 'Unauthorized. Admin access required.' 
    });
  }

  const uploadHandler = upload.single('file');
  
  uploadHandler(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred
      const errorMsg = `Multer upload error: ${err.message}`;
      addLogEntry('ERROR', errorMsg, req.user?.username);
      return res.status(400).json({ 
        success: false, 
        message: `Upload error: ${err.message}` 
      });
    } else if (err) {
      // Other errors
      const errorMsg = `Upload error: ${err.message}`;
      addLogEntry('ERROR', errorMsg, req.user?.username);
      return res.status(400).json({ 
        success: false, 
        message: err.message 
      });
    }
    
    // File uploaded successfully
    if (!req.file) {
      addLogEntry('ERROR', 'No file was provided in upload request', req.user?.username);
      return res.status(400).json({ 
        success: false, 
        message: 'No file was provided' 
      });
    }
    
    // Return success with file info
    const successMsg = `File uploaded successfully: ${req.file.originalname} (${req.file.size} bytes)`;
    addLogEntry('UPLOAD', successMsg, req.user?.username);
    
    return res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      file: {
        originalName: req.file.originalname,
        filename: req.file.filename,
        path: req.file.path,
        size: req.file.size
      }
    });
  });
});

// Function to verify deployment token
function verifyDeployToken(token: string): boolean {
  const deployToken = process.env.DEPLOY_SECRET_KEY;
  if (!deployToken) {
    addLogEntry('ERROR', 'DEPLOY_SECRET_KEY not set in environment variables', 'system');
    return false;
  }
  return token === deployToken;
}

// Route to handle file deployment (moving files to appropriate locations)
router.post('/deploy', async (req: Request, res: Response) => {
  // Check if user is admin
  if (!req.isAuthenticated() || req.user?.role !== 'admin') {
    return res.status(403).json({ 
      success: false, 
      message: 'Unauthorized. Admin access required.' 
    });
  }
  
  const { filename, destination } = req.body;
  
  if (!filename || !destination) {
    addLogEntry('ERROR', 'Deploy attempt missing filename or destination', req.user?.username);
    return res.status(400).json({
      success: false,
      message: 'Both filename and destination are required'
    });
  }
  
  try {
    // Validate the source file exists
    const sourcePath = path.resolve(process.cwd(), 'uploads', filename);
    if (!fs.existsSync(sourcePath)) {
      addLogEntry('ERROR', `Deploy source file not found: ${filename}`, req.user?.username);
      return res.status(404).json({
        success: false,
        message: 'Source file not found'
      });
    }
    
    // Validate the destination path (prevent directory traversal)
    const normalizedDestination = path.normalize(destination).replace(/^(\.\.(\/|\\|$))+/, '');
    const destPath = path.resolve(process.cwd(), normalizedDestination);
    
    // Ensure the destination directory exists
    const destDir = path.dirname(destPath);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    
    // Copy the file to the destination
    fs.copyFileSync(sourcePath, destPath);
    
    const successMsg = `File deployed successfully: ${filename} to ${normalizedDestination}`;
    addLogEntry('DEPLOY', successMsg, req.user?.username);
    
    return res.status(200).json({
      success: true,
      message: `File deployed successfully to ${normalizedDestination}`
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    addLogEntry('ERROR', `Deploy error: ${errorMessage}`, req.user?.username);
    return res.status(500).json({
      success: false,
      message: `Error deploying file: ${errorMessage}`
    });
  }
});

// Route to run deployment from zip to build directory
router.post('/run-deploy', async (req: Request, res: Response) => {
  // First check deployment token for security
  const { token } = req.body;
  if (!token || !verifyDeployToken(token)) {
    addLogEntry('ERROR', 'Unauthorized deployment attempt - invalid token', req.user?.username || 'unknown');
    return res.status(403).json({
      success: false,
      message: 'Unauthorized. Valid deployment token required.'
    });
  }
  
  try {
    // Get the latest uploaded ZIP file
    const uploadDir = path.resolve(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
      return res.status(404).json({
        success: false,
        message: 'No files found in uploads directory'
      });
    }
    
    // Find the most recent zip file
    const zipFiles = fs.readdirSync(uploadDir)
      .filter(file => file.toLowerCase().endsWith('.zip'))
      .map(file => {
        const filePath = path.join(uploadDir, file);
        const stats = fs.statSync(filePath);
        return {
          name: file,
          path: filePath,
          modified: stats.mtime
        };
      })
      .sort((a, b) => b.modified.getTime() - a.modified.getTime());
    
    if (zipFiles.length === 0) {
      addLogEntry('ERROR', 'No ZIP files found for deployment', req.user?.username || 'system');
      return res.status(404).json({
        success: false,
        message: 'No ZIP files found for deployment'
      });
    }
    
    const latestZip = zipFiles[0];
    const buildDir = path.resolve(process.cwd(), 'build');
    const buildBackupDir = path.resolve(process.cwd(), 'build_backup');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    // Execute the unzip command to extract files to build directory
    addLogEntry('DEPLOY', `Starting deployment of ${latestZip.name}`, req.user?.username || 'system');
    
    // Backup existing build directory if it exists
    if (fs.existsSync(buildDir)) {
      // Create backup command
      await execPromise(`mv ${buildDir} ${buildBackupDir}_${timestamp}`);
      addLogEntry('DEPLOY', 'Created backup of current build directory', req.user?.username || 'system');
    }
    
    // Create build directory
    fs.mkdirSync(buildDir, { recursive: true });
    
    // Unzip the file to the build directory
    await execPromise(`unzip -o "${latestZip.path}" -d ${buildDir}`);
    
    addLogEntry('DEPLOY', `Successfully deployed ${latestZip.name} to build directory`, req.user?.username || 'system');
    
    return res.status(200).json({
      success: true,
      message: 'Deployment completed successfully',
      deployedFile: latestZip.name,
      timestamp: new Date()
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    addLogEntry('ERROR', `Deployment failed: ${errorMessage}`, req.user?.username || 'system');
    return res.status(500).json({
      success: false,
      message: `Deployment failed: ${errorMessage}`
    });
  }
});

// Route to list uploaded files
router.get('/files', (req: Request, res: Response) => {
  // Check if user is admin
  if (!req.isAuthenticated() || req.user?.role !== 'admin') {
    return res.status(403).json({ 
      success: false, 
      message: 'Unauthorized. Admin access required.' 
    });
  }
  
  try {
    const uploadDir = path.resolve(process.cwd(), 'uploads');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
      return res.json({ files: [] });
    }
    
    // Read directory and get file stats
    const files = fs.readdirSync(uploadDir)
      .filter(file => !file.startsWith('.')) // Filter out hidden files
      .map(file => {
        const filePath = path.join(uploadDir, file);
        const stats = fs.statSync(filePath);
        
        return {
          name: file,
          size: stats.size,
          created: stats.birthtime,
          modified: stats.mtime
        };
      })
      .sort((a, b) => b.modified.getTime() - a.modified.getTime()); // Sort by most recent
    
    return res.json({ files });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    log(`Error listing files: ${errorMessage}`, 'uploader');
    return res.status(500).json({
      success: false,
      message: `Error listing files: ${errorMessage}`
    });
  }
});

// Route to get system status including last uploaded file and build info
router.get('/status', async (req: Request, res: Response) => {
  // Check if user is admin
  if (!req.isAuthenticated() || req.user?.role !== 'admin') {
    return res.status(403).json({ 
      success: false, 
      message: 'Unauthorized. Admin access required.' 
    });
  }
  
  try {
    const uploadDir = path.resolve(process.cwd(), 'uploads');
    const buildDir = path.resolve(process.cwd(), 'build');
    
    // Get last uploaded file info
    let lastUploadedFile = null;
    if (fs.existsSync(uploadDir)) {
      const files = fs.readdirSync(uploadDir)
        .filter(file => !file.startsWith('.'))
        .map(file => {
          const filePath = path.join(uploadDir, file);
          const stats = fs.statSync(filePath);
          return {
            name: file,
            size: stats.size,
            created: stats.birthtime,
            modified: stats.mtime,
            isZip: file.toLowerCase().endsWith('.zip')
          };
        })
        .sort((a, b) => b.modified.getTime() - a.modified.getTime());
      
      if (files.length > 0) {
        lastUploadedFile = files[0];
      }
    }
    
    // Get build directory info
    let buildInfo = null;
    if (fs.existsSync(buildDir)) {
      const stats = fs.statSync(buildDir);
      buildInfo = {
        exists: true,
        modified: stats.mtime,
        size: await getDirSize(buildDir),
        files: fs.readdirSync(buildDir).length
      };
    } else {
      buildInfo = {
        exists: false
      };
    }
    
    return res.json({
      success: true,
      lastUploadedFile,
      buildInfo,
      serverTime: new Date()
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    addLogEntry('ERROR', `Error getting system status: ${errorMessage}`, req.user?.username);
    return res.status(500).json({
      success: false,
      message: `Error getting system status: ${errorMessage}`
    });
  }
});

// Helper function to calculate directory size
async function getDirSize(dirPath: string): Promise<number> {
  const files = fs.readdirSync(dirPath);
  let size = 0;
  
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isDirectory()) {
      size += await getDirSize(filePath);
    } else {
      size += stats.size;
    }
  }
  
  return size;
}

// Route to get logs of uploader activity
router.get('/logs', (req: Request, res: Response) => {
  // Check if user is admin
  if (!req.isAuthenticated() || req.user?.role !== 'admin') {
    return res.status(403).json({ 
      success: false, 
      message: 'Unauthorized. Admin access required.' 
    });
  }
  
  return res.json({
    success: true,
    logs: uploadLogs
  });
});

// Route to communicate with OpenAI for AI-assisted deployments
router.post('/agent-message', async (req: Request, res: Response) => {
  // Check if user is admin
  if (!req.isAuthenticated() || req.user?.role !== 'admin') {
    return res.status(403).json({ 
      success: false, 
      message: 'Unauthorized. Admin access required.' 
    });
  }
  
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: 'No prompt provided'
      });
    }
    
    // Check if OpenAI API key is set
    if (!process.env.OPENAI_API_KEY) {
      addLogEntry('ERROR', 'OpenAI API key not provided in environment variables', req.user?.username);
      return res.status(500).json({
        success: false,
        message: 'OpenAI API key not configured'
      });
    }
    
    addLogEntry('AI', `Agent requested: ${prompt.substring(0, 50)}...`, req.user?.username);
    
    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: "You are a helpful AI assistant for a sports performance platform called Go4It. You help developers deploy code and troubleshoot system issues. Keep your answers focused on web development, deployment processes, and system administration. Don't provide extended code snippets unless explicitly asked. Be concise but thorough."
        },
        { role: "user", content: prompt }
      ],
    });
    
    const response = completion.choices[0].message.content;
    
    addLogEntry('AI', `Agent responded with ${response?.length || 0} characters`, req.user?.username);
    
    return res.json({
      success: true,
      response
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    addLogEntry('ERROR', `OpenAI API error: ${errorMessage}`, req.user?.username);
    return res.status(500).json({
      success: false,
      message: `Error communicating with OpenAI: ${errorMessage}`
    });
  }
});

export default router;