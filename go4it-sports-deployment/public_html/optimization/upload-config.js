/**
 * Go4It Sports Upload Configuration
 * 
 * This file configures the file upload limits based on user roles:
 * - Admin users: 2GB upload limit
 * - Paid users: 1GB upload limit
 * - Regular users: 500MB upload limit
 */

const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

// Constants for file size limits in bytes
const ADMIN_MAX_SIZE = 2 * 1024 * 1024 * 1024;     // 2GB
const PAID_USER_MAX_SIZE = 1 * 1024 * 1024 * 1024; // 1GB
const REGULAR_USER_MAX_SIZE = 500 * 1024 * 1024;   // 500MB

// Create storage configuration with proper permissions
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Determine upload directory based on content type
    let baseUploadDir = path.join(process.cwd(), 'uploads');
    let uploadDir;
    
    if (file.mimetype.startsWith('image/')) {
      uploadDir = path.join(baseUploadDir, 'images');
    } else if (file.mimetype.startsWith('video/')) {
      uploadDir = path.join(baseUploadDir, 'videos');
    } else if (file.mimetype.startsWith('audio/')) {
      uploadDir = path.join(baseUploadDir, 'audio');
    } else {
      uploadDir = path.join(baseUploadDir, 'documents');
    }
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with original extension
    const fileExtension = path.extname(file.originalname);
    const uniqueId = uuidv4();
    const timestamp = Date.now();
    cb(null, `${timestamp}-${uniqueId}${fileExtension}`);
  }
});

// File filter to validate uploads
const fileFilter = (req, file, cb) => {
  // Define allowed MIME types
  const allowedMimeTypes = [
    // Images
    'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
    // Videos
    'video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo',
    // Audio
    'audio/mpeg', 'audio/wav', 'audio/ogg',
    // Documents
    'application/pdf', 'application/msword', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain'
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type not allowed. Accepted types: ${allowedMimeTypes.join(', ')}`), false);
  }
};

// Determine file size limit based on user role
const getFileSizeLimit = (req) => {
  if (req.user && req.user.role === 'admin') {
    return ADMIN_MAX_SIZE;
  } else if (req.user && req.user.isPaidAccount) {
    return PAID_USER_MAX_SIZE;
  } else {
    return REGULAR_USER_MAX_SIZE;
  }
};

// Create upload middleware generator
const createUploadMiddleware = (fieldName = 'file', multiple = false) => {
  return (req, res, next) => {
    const sizeLimit = getFileSizeLimit(req);
    
    // Configure multer with dynamic size limit
    const upload = multer({
      storage,
      fileFilter,
      limits: {
        fileSize: sizeLimit
      }
    });
    
    // Handle single or multiple file uploads
    const uploadHandler = multiple ? upload.array(fieldName, 10) : upload.single(fieldName);
    
    uploadHandler(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          const limitInMB = Math.round(sizeLimit / (1024 * 1024));
          return res.status(413).json({ 
            error: `File too large. Maximum allowed size is ${limitInMB}MB.` 
          });
        }
        return res.status(400).json({ error: `Upload error: ${err.message}` });
      } else if (err) {
        return res.status(400).json({ error: err.message });
      }
      
      // Add file URL(s) to the request
      if (req.file) {
        // For single file upload
        req.file.url = `/uploads/${path.basename(path.dirname(req.file.path))}/${req.file.filename}`;
      } else if (req.files) {
        // For multiple file uploads
        req.files.forEach(file => {
          file.url = `/uploads/${path.basename(path.dirname(file.path))}/${file.filename}`;
        });
      }
      
      next();
    });
  };
};

module.exports = {
  createUploadMiddleware,
  ADMIN_MAX_SIZE,
  PAID_USER_MAX_SIZE,
  REGULAR_USER_MAX_SIZE
};