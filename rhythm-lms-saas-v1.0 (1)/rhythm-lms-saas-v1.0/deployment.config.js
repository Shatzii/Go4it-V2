// Deployment configuration for Rhythm LMS
// Self-hosted AI-powered educational platform for neurodivergent students

module.exports = {
  // Application configuration
  app: {
    name: "Rhythm LMS",
    version: "1.0.0",
    description: "AI-powered educational platform for neurodivergent students aged 3-25",
    port: process.env.PORT || 5000,
    environment: process.env.NODE_ENV || "production"
  },

  // Database configuration
  database: {
    url: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === "production",
    maxConnections: 20,
    connectionTimeout: 30000
  },

  // AI service configuration
  ai: {
    engineUrl: process.env.AI_ENGINE_URL || "http://localhost:3030",
    openaiApiKey: process.env.OPENAI_API_KEY,
    fallbackToRuleBased: true,
    maxRetries: 3,
    timeout: 30000
  },

  // State compliance configuration
  compliance: {
    supportedStates: ["TX", "AL", "MS", "CO", "GA"],
    reportingEnabled: true,
    accessibilityCompliance: ["WCAG 2.1 AA", "Section 508"],
    autoGenerateReports: true
  },

  // Neurodivergent support features
  neurodivergentSupport: {
    profiles: ["ADHD", "Autism", "Dyslexia", "Dyscalculia", "Combined"],
    adaptiveFeatures: true,
    sensoryAccommodations: true,
    executiveFunctionSupport: true,
    realTimeAdaptation: true
  },

  // English with Sports dual certification
  dualCertification: {
    enabled: true,
    practicumTracking: true,
    competencyMapping: true,
    stateSpecificRequirements: true
  },

  // Security configuration
  security: {
    sessionSecret: process.env.SESSION_SECRET || "rhythm-lms-secure-session",
    cors: {
      origin: process.env.ALLOWED_ORIGINS?.split(",") || ["http://localhost:5000"],
      credentials: true
    },
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100 // limit each IP to 100 requests per windowMs
    }
  },

  // File storage configuration
  storage: {
    type: process.env.STORAGE_TYPE || "local",
    maxFileSize: "10MB",
    allowedTypes: [".rhy", ".json", ".txt", ".pdf", ".docx", ".mp3", ".mp4", ".png", ".jpg"]
  },

  // Monitoring and logging
  monitoring: {
    enableHealthCheck: true,
    logLevel: process.env.LOG_LEVEL || "info",
    metricsEnabled: true,
    errorReporting: process.env.NODE_ENV === "production"
  },

  // Feature flags
  features: {
    rhythmEditor: true,
    aiCurriculumGeneration: true,
    progressTracking: true,
    stateReporting: true,
    parentPortal: true,
    mobileApp: true,
    offlineMode: true
  },

  // Performance optimization
  performance: {
    enableCaching: true,
    cacheTimeout: 300000, // 5 minutes
    compression: true,
    staticAssetCaching: true
  }
};