import multer from "multer";
import path from "path";
import fs from "fs";
import { Request } from "express";

// Create uploads directories if they don't exist
const createUploadDirectories = () => {
  const uploadDir = path.join(process.cwd(), "uploads");
  const videosDir = path.join(uploadDir, "videos");
  const thumbnailsDir = path.join(uploadDir, "thumbnails");

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  
  if (!fs.existsSync(videosDir)) {
    fs.mkdirSync(videosDir, { recursive: true });
  }
  
  if (!fs.existsSync(thumbnailsDir)) {
    fs.mkdirSync(thumbnailsDir, { recursive: true });
  }
};

// Storage configuration for video uploads
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    createUploadDirectories();
    cb(null, path.join(process.cwd(), "uploads"));
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const fileExtension = path.extname(file.originalname);
    const safeFilename = Buffer.from(file.originalname, 'latin1').toString('utf8')
      .replace(/[^a-zA-Z0-9]/g, '-')
      .replace(/-+/g, '-')
      .toLowerCase();
    
    const finalFilename = `${safeFilename}-${uniqueSuffix}${fileExtension}`;
    cb(null, finalFilename);
  }
});

// File filter to only allow video files
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ["video/mp4", "video/quicktime", "video/webm"];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only MP4, MOV, and WebM videos are allowed."));
  }
};

// Create the multer upload middleware
export const fileUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  }
});

// Helper function to move file from temp location to final destination
export const moveUploadedFile = (
  source: string,
  destination: string
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const destDir = path.dirname(destination);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    
    const readStream = fs.createReadStream(source);
    const writeStream = fs.createWriteStream(destination);
    
    readStream.on("error", reject);
    writeStream.on("error", reject);
    writeStream.on("finish", () => {
      fs.unlink(source, (err) => {
        if (err) {
          console.warn("Failed to remove temp file:", err);
        }
        resolve();
      });
    });
    
    readStream.pipe(writeStream);
  });
};

// Generate a thumbnail from video using ffmpeg (mock implementation)
export const generateThumbnail = async (
  videoPath: string,
  thumbnailPath: string
): Promise<string> => {
  // In a real application, we would use ffmpeg to generate a thumbnail
  // For this implementation, we'll just return a placeholder image URL
  return "https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";
};
