/**
 * Profile Picture Upload API
 * Handles secure image upload for user profiles
 */

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { db } = require('../../lib/db');
const { users } = require('../../lib/db/schema');
const { eq } = require('drizzle-orm');

const router = express.Router();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../../public/uploads/profiles');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = crypto.randomBytes(16).toString('hex');
    const ext = path.extname(file.originalname);
    cb(null, `profile-${Date.now()}-${uniqueSuffix}${ext}`);
  }
});

// File filter - only allow images
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.'), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  }
});

/**
 * POST /api/profile/upload-picture
 * Upload profile picture
 */
router.post('/upload-picture', upload.single('profilePicture'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    // Get user ID from session/auth
    const userId = req.user?.id || req.session?.userId;
    
    if (!userId) {
      // Delete uploaded file if user not authenticated
      fs.unlinkSync(req.file.path);
      return res.status(401).json({
        success: false,
        error: 'User not authenticated'
      });
    }

    // Generate public URL for the uploaded image
    const imageUrl = `/uploads/profiles/${req.file.filename}`;

    // Update user profile in database
    try {
      await db.update(users)
        .set({ 
          profileImageUrl: imageUrl,
          updatedAt: new Date()
        })
        .where(eq(users.id, userId));
    } catch (dbError) {
      console.error('Database update error:', dbError);
      // Continue even if DB update fails - file is uploaded
    }

    // Optional: Delete old profile picture
    if (req.body.oldImageUrl) {
      const oldImagePath = path.join(__dirname, '../../public', req.body.oldImageUrl);
      if (fs.existsSync(oldImagePath)) {
        try {
          fs.unlinkSync(oldImagePath);
        } catch (err) {
          console.error('Failed to delete old image:', err);
        }
      }
    }

    res.json({
      success: true,
      imageUrl: imageUrl,
      filename: req.file.filename,
      size: req.file.size,
      message: 'Profile picture uploaded successfully'
    });

  } catch (error) {
    // Clean up uploaded file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      error: 'Failed to upload profile picture',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * DELETE /api/profile/delete-picture
 * Delete profile picture
 */
router.delete('/delete-picture', async (req, res) => {
  try {
    const userId = req.user?.id || req.session?.userId;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'User not authenticated'
      });
    }

    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        error: 'Image URL is required'
      });
    }

    // Delete file from filesystem
    const imagePath = path.join(__dirname, '../../public', imageUrl);
    if (fs.existsSync(imagePath)) {
      try {
        fs.unlinkSync(imagePath);
      } catch (err) {
        console.error('Failed to delete file:', err);
      }
    }

    // Update user profile in database
    try {
      await db.update(users)
        .set({ 
          profileImageUrl: null,
          updatedAt: new Date()
        })
        .where(eq(users.id, userId));
    } catch (dbError) {
      console.error('Database update error:', dbError);
    }

    res.json({
      success: true,
      message: 'Profile picture deleted successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete profile picture',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * GET /api/profile/picture/:userId
 * Get profile picture URL for a user
 */
router.get('/picture/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch user's profile picture URL from database
    const userRecord = await db.select({ 
      profileImageUrl: users.profileImageUrl,
      firstName: users.firstName,
      lastName: users.lastName 
    })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (userRecord.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'User not found' 
      });
    }

    const user = userRecord[0];

    res.json({
      success: true,
      profileImageUrl: user.profileImageUrl,
      user: {
        firstName: user.firstName,
        lastName: user.lastName
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch profile picture',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;

