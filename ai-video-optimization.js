/**
 * Go4It Sports AI Video Analysis Optimization
 * 
 * This configuration optimizes the AI video analysis module for a server with:
 * - 4 vCPU
 * - 16GB RAM
 * - 160GB Disk
 */

const path = require('path');
const fs = require('fs');
const os = require('os');
const { Worker } = require('worker_threads');

// Configuration parameters optimized for 4 vCPU / 16GB RAM
const config = {
  // Video processing settings
  video: {
    // Storage paths
    storagePath: process.env.VIDEO_STORAGE_PATH || path.join(process.cwd(), 'uploads', 'videos'),
    processedPath: process.env.PROCESSED_VIDEOS_PATH || path.join(process.cwd(), 'uploads', 'processed'),
    tempPath: process.env.TEMP_PATH || path.join(os.tmpdir(), 'go4it-video-processing'),
    
    // Processing settings
    maxConcurrentJobs: 3,          // Reserve 1 CPU core for other tasks
    maxVideoSizeGB: 2,             // 2GB max for admin uploaded videos
    maxVideoDurationMinutes: 30,   // 30 minutes max per video
    
    // Transcoding settings
    defaultFormat: 'mp4',
    defaultCodec: 'h264',
    defaultResolution: '720p',     // Process at 720p for analysis
    preserveOriginal: true,        // Keep original video
    
    // Analysis batch settings
    frameSamplingRate: 1,          // Sample 1 frame per second
    maxFramesPerBatch: 60,         // Process 60 frames per batch (1 minute of footage)
    maxBatchSizeBytes: 10485760,   // 10MB max batch size for API calls
    
    // Performance tuning
    useHardwareAcceleration: true, // Use GPU if available
    memoryLimitPerJob: "4g",       // 4GB per job (max 12GB for 3 concurrent jobs)
    timeoutSeconds: 3600,          // 1 hour timeout for large videos
    
    // Caching settings
    enableResultsCache: true,
    cacheTTLDays: 30,              // Cache analysis results for 30 days
    
    // Auto-scaling settings
    reduceQualityOnHighLoad: true, // Reduce processing quality when system load is high
    systemLoadThreshold: 0.85      // Threshold for system load (85%)
  },
  
  // AI API settings
  ai: {
    // Queue settings for API calls
    maxConcurrentAPICalls: 5,
    retryAttempts: 3,
    retryDelayMs: 1000,
    
    // Request optimization
    batchRequests: true,
    prioritizeAdminJobs: true,
    
    // Advanced AI settings
    modelSettings: {
      sport_detection: {
        model: "gpt-4o",
        temperature: 0.2,
        maxTokens: 256
      },
      player_tracking: {
        model: "gpt-4o-vision",
        temperature: 0.1,
        maxTokens: 512
      },
      technique_analysis: {
        model: "claude-3-7-sonnet-20250219",
        temperature: 0.3,
        maxTokens: 1024
      },
      highlight_generation: {
        model: "gpt-4o-vision",
        temperature: 0.7,
        maxTokens: 2048
      }
    }
  },
  
  // Storage optimization
  storage: {
    // Auto-cleanup settings
    enableAutoCleanup: true,
    cleanupIntervalHours: 24,
    tempFileMaxAgeHours: 24,
    
    // For videos older than 90 days
    archiveOldVideos: true,
    archiveThresholdDays: 90,
    compressionLevel: 9,           // Maximum compression for archives
    
    // Quota settings
    enableUserQuotas: true,
    defaultUserQuotaGB: 0.5,       // 500MB for regular users
    adminQuotaGB: 10,              // 10GB for admins
    paidUserQuotaGB: 5,            // 5GB for paid users
    
    // Storage monitoring
    alertThresholdPercent: 90,     // Alert when disk usage reaches 90%
    criticalThresholdPercent: 95   // Take action when disk usage reaches 95%
  }
};

// Create necessary directories
const ensureDirectoriesExist = () => {
  const directories = [
    config.video.storagePath,
    config.video.processedPath,
    config.video.tempPath
  ];
  
  directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
  });
};

// Initialize worker pool for video processing
const initializeWorkerPool = () => {
  const workerPool = [];
  const availableCores = Math.min(os.cpus().length, config.video.maxConcurrentJobs);
  
  for (let i = 0; i < availableCores; i++) {
    const worker = new Worker(path.join(__dirname, 'video-processing-worker.js'), {
      workerData: {
        workerId: i,
        config: config
      }
    });
    
    worker.on('error', error => {
      console.error(`Worker ${i} error:`, error);
      // Replace the crashed worker
      const index = workerPool.findIndex(w => w.threadId === worker.threadId);
      if (index !== -1) {
        workerPool.splice(index, 1);
        workerPool.push(initializeWorker(i));
      }
    });
    
    workerPool.push(worker);
    console.log(`Initialized worker ${i}`);
  }
  
  return workerPool;
};

// System monitoring function
const monitorSystemResources = () => {
  setInterval(() => {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const memUsage = (totalMem - freeMem) / totalMem;
    const cpuLoad = os.loadavg()[0] / os.cpus().length;
    
    console.log(`Memory usage: ${(memUsage * 100).toFixed(2)}%, CPU load: ${(cpuLoad * 100).toFixed(2)}%`);
    
    // Take action if resources are constrained
    if (memUsage > 0.9 || cpuLoad > config.video.systemLoadThreshold) {
      console.warn('System under high load, reducing processing quality and throttling new jobs');
      // Implement throttling logic here
    }
  }, 60000); // Check every minute
};

// Initialize module
const initialize = () => {
  ensureDirectoriesExist();
  const workerPool = initializeWorkerPool();
  monitorSystemResources();
  
  console.log('AI Video Analysis module initialized with optimized settings for 4 vCPU / 16GB RAM');
  
  return {
    config,
    workerPool,
    // Add methods for video processing here
    processVideo: (videoPath, options = {}) => {
      // Implementation of video processing logic
    },
    generateHighlights: (videoId, parameters = {}) => {
      // Implementation of highlight generation
    },
    analyzePerformance: (videoId, athleteId, sportType) => {
      // Implementation of performance analysis
    }
  };
};

module.exports = {
  initialize,
  config
};