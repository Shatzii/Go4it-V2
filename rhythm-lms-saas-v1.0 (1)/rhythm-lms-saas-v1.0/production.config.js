// Production Configuration for Rhythm-LMS
// Optimized for server deployment

module.exports = {
  // Server Configuration
  server: {
    port: process.env.PORT || 5000,
    host: '0.0.0.0',
    compression: true,
    cors: {
      origin: process.env.CORS_ORIGIN || false,
      credentials: true
    }
  },

  // Database Configuration
  database: {
    url: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10,
      idle: 10000
    },
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  },

  // AI Engine Configuration
  ai: {
    enabled: true,
    port: 3030,
    timeout: 30000,
    retries: 3,
    fallback: true
  },

  // Security Configuration
  security: {
    helmet: true,
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100 // limit each IP to 100 requests per windowMs
    },
    session: {
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      }
    }
  },

  // Logging Configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: 'combined',
    file: process.env.LOG_FILE || '/var/log/rhythm-lms/app.log'
  },

  // Performance Configuration
  performance: {
    compression: true,
    cache: {
      enabled: true,
      ttl: 300 // 5 minutes
    },
    cluster: process.env.CLUSTER_MODE === 'true'
  }
};