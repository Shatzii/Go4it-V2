import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { log } from '../vite';

const router = Router();

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
      log(`Multer upload error: ${err.message}`, 'uploader');
      return res.status(400).json({ 
        success: false, 
        message: `Upload error: ${err.message}` 
      });
    } else if (err) {
      // Other errors
      log(`Upload error: ${err.message}`, 'uploader');
      return res.status(400).json({ 
        success: false, 
        message: err.message 
      });
    }
    
    // File uploaded successfully
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No file was provided' 
      });
    }
    
    // Return success with file info
    log(`File uploaded successfully: ${req.file.originalname}`, 'uploader');
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
    return res.status(400).json({
      success: false,
      message: 'Both filename and destination are required'
    });
  }
  
  try {
    // Validate the source file exists
    const sourcePath = path.resolve(process.cwd(), 'uploads', filename);
    if (!fs.existsSync(sourcePath)) {
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
    
    log(`File deployed successfully: ${filename} to ${normalizedDestination}`, 'uploader');
    return res.status(200).json({
      success: true,
      message: `File deployed successfully to ${normalizedDestination}`
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    log(`Error deploying file: ${errorMessage}`, 'uploader');
    return res.status(500).json({
      success: false,
      message: `Error deploying file: ${errorMessage}`
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

export default router;