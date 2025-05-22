/**
 * Go4It Sports Deployment Configuration
 * 
 * This file contains configuration settings for deploying the Go4It Sports platform to go4itsports.org
 */

module.exports = {
  // Server configuration
  server: {
    port: process.env.PORT || 5000,
    cors: {
      origin: ['https://go4itsports.org', 'http://localhost:5000'],
      credentials: true
    },
    staticDir: 'client/dist',
  },
  
  // Database configuration
  database: {
    // When using Supabase as requested
    type: 'supabase',
    connectionString: process.env.DATABASE_URL,
    maxConnections: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  },
  
  // Security settings
  security: {
    // Integration with Sentinel cybersecurity as requested
    sentinelEnabled: true,
    sentinelConfig: {
      apiKey: process.env.SENTINEL_API_KEY,
      monitoringLevel: 'standard',
      alertThreshold: 'medium',
      autoBlock: false,
    },
    jwt: {
      secret: process.env.JWT_SECRET || 'go4it-dev-secret-key',
      expiresIn: '7d'
    },
    rateLimiting: {
      enabled: true,
      maxRequests: 100,
      windowMs: 15 * 60 * 1000 // 15 minutes
    }
  },
  
  // Content settings
  content: {
    uploadLimits: {
      videoSizeLimit: 500 * 1024 * 1024, // 500MB
      imageSizeLimit: 5 * 1024 * 1024,   // 5MB
      allowedVideoTypes: ['video/mp4', 'video/quicktime', 'video/avi'],
      allowedImageTypes: ['image/jpeg', 'image/png', 'image/gif']
    },
    storage: {
      provider: 'local',           // 'local', 's3', or 'cloudinary'
      localPath: './uploads',      // Path for local storage
      cloudConfig: {
        // Config for cloud storage like S3 or Cloudinary would go here
      }
    }
  },
  
  // GAR Engine configuration
  garEngine: {
    version: '2.0',
    modelPath: './models/gar-analysis-model.json',
    categories: ['physical', 'technical', 'tactical', 'mental', 'academic', 'social'],
    weights: {
      physical: 1.0,
      technical: 1.0,
      tactical: 1.0,
      mental: 1.0,
      academic: 0.8,
      social: 0.8
    },
    minimumVideoLength: 30,  // seconds
    processingTimeout: 180,  // seconds
  },
  
  // Academic integration configuration
  academicIntegration: {
    powerschool: {
      enabled: true,
      apiBase: 'https://powerschool-api.example.com',
      clientId: process.env.POWERSCHOOL_CLIENT_ID,
      clientSecret: process.env.POWERSCHOOL_CLIENT_SECRET
    },
    ncaaEligibility: {
      divisionI: {
        minGPA: 2.3,
        coreCourses: 16
      },
      divisionII: {
        minGPA: 2.2,
        coreCourses: 16
      }
    }
  },

  // Mobile configuration
  mobile: {
    pwaEnabled: true,
    fcmEnabled: false,  // Firebase Cloud Messaging
    minimumIosVersion: '14.0',
    minimumAndroidVersion: '8.0',
    appStoreUrl: 'https://apps.apple.com/us/app/go4it-sports/id1234567890',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=org.go4itsports.app'
  },
  
  // Theming
  theme: {
    defaultTheme: 'dark',
    allowThemeToggle: true,
    colors: {
      primary: '#2563eb',
      secondary: '#0891b2',
      background: '#0e1628',
      foreground: '#f8fafc',
      accent: '#38bdf8'
    }
  }
};