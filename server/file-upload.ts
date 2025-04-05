import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import type { Request } from 'express';

// Configure storage for multer
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    // Get category from form data or use 'default'
    const category = req.body.category || 'default';
    
    // Create category directory if it doesn't exist
    const categoryPath = path.join(process.cwd(), 'uploads', category);
    if (!fs.existsSync(categoryPath)) {
      fs.mkdirSync(categoryPath, { recursive: true });
    }
    
    cb(null, categoryPath);
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    // Generate a unique filename to prevent overwriting
    const uniqueFilename = `${Date.now()}-${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueFilename);
  }
});

// Filter files to only accept images
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Accept only image files
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'));
  }
};

// Create uploader for video files
export const fileUpload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit for videos
  }
});

// Create uploader for image files
export const imageUpload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit for images
  }
});

// Utility to move file to a different location
export const moveUploadedFile = (
  sourcePath: string,
  targetDir: string,
  newFilename?: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Create target directory if it doesn't exist
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    
    const filename = newFilename || path.basename(sourcePath);
    const targetPath = path.join(targetDir, filename);
    
    const readStream = fs.createReadStream(sourcePath);
    const writeStream = fs.createWriteStream(targetPath);
    
    readStream.on('error', error => reject(error));
    writeStream.on('error', error => reject(error));
    writeStream.on('finish', () => {
      // Remove the source file
      fs.unlink(sourcePath, (err) => {
        if (err) console.error('Error removing source file:', err);
        resolve(targetPath);
      });
    });
    
    readStream.pipe(writeStream);
  });
};

// Utility to generate a thumbnail from an image
export const generateThumbnail = async (
  imagePath: string,
  targetDir: string,
  width: number = 200,
  height: number = 200
): Promise<string> => {
  // This is a placeholder for actual thumbnail generation
  // In a real implementation, you would use a library like Sharp
  return new Promise((resolve, reject) => {
    try {
      const filename = `thumb-${path.basename(imagePath)}`;
      const targetPath = path.join(targetDir, filename);
      
      // For now, just copy the file as a thumbnail
      fs.copyFile(imagePath, targetPath, (err) => {
        if (err) return reject(err);
        resolve(targetPath);
      });
    } catch (error) {
      reject(error);
    }
  });
};

// Function to get all uploaded images
export const getUploadedImages = (category?: string): Promise<{ path: string, url: string, filename: string, category: string }[]> => {
  return new Promise((resolve, reject) => {
    try {
      const uploadsDir = path.join(process.cwd(), 'uploads');
      let categories: string[];
      
      if (category) {
        categories = [category];
      } else {
        // Get all category folders
        categories = fs.readdirSync(uploadsDir).filter(item => {
          const itemPath = path.join(uploadsDir, item);
          return fs.statSync(itemPath).isDirectory();
        });
      }
      
      // Get files from each category
      const allImages = categories.flatMap(cat => {
        const categoryPath = path.join(uploadsDir, cat);
        
        // Skip if directory doesn't exist
        if (!fs.existsSync(categoryPath)) {
          return [];
        }
        
        return fs.readdirSync(categoryPath)
          .filter(file => {
            // Only include image files
            const extension = path.extname(file).toLowerCase();
            return ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'].includes(extension);
          })
          .map(file => {
            const filePath = `${cat}/${file}`;
            return {
              path: filePath,
              url: `/uploads/${filePath}`,
              filename: file,
              category: cat
            };
          });
      });
      
      resolve(allImages);
    } catch (error) {
      reject(error);
    }
  });
};

// Function to delete an image
export const deleteImage = (imagePath: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    try {
      const fullPath = path.join(process.cwd(), 'uploads', imagePath);
      
      // Check if file exists
      if (!fs.existsSync(fullPath)) {
        reject(new Error('Image does not exist'));
        return;
      }
      
      // Delete the file
      fs.unlink(fullPath, (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(true);
      });
    } catch (error) {
      reject(error);
    }
  });
};