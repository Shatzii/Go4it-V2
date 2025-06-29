/**
 * Go4It Sports Video Processing Worker
 * Optimized for 4 vCPU / 16GB RAM server
 * 
 * This worker handles video processing tasks in a separate thread
 */

const { workerData, parentPort } = require('worker_threads');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const os = require('os');

// Get worker configuration from main thread
const { workerId, config } = workerData;

// Track worker state
let isProcessing = false;
let currentJobId = null;
let memoryUsage = 0;

// Initialize worker
console.log(`Video processing worker ${workerId} started`);

// Report ready status to main thread
parentPort.postMessage({
  type: 'READY',
  workerId,
  status: 'initialized'
});

// Handle messages from main thread
parentPort.on('message', async (message) => {
  try {
    switch (message.type) {
      case 'PROCESS_VIDEO':
        await processVideo(message.data);
        break;
      case 'GENERATE_HIGHLIGHTS':
        await generateHighlights(message.data);
        break;
      case 'ANALYZE_PERFORMANCE':
        await analyzePerformance(message.data);
        break;
      case 'STATUS_CHECK':
        reportStatus();
        break;
      case 'SHUTDOWN':
        gracefulShutdown();
        break;
      default:
        throw new Error(`Unknown message type: ${message.type}`);
    }
  } catch (error) {
    parentPort.postMessage({
      type: 'ERROR',
      workerId,
      jobId: currentJobId,
      error: {
        message: error.message,
        stack: error.stack
      }
    });
  }
});

/**
 * Process a video for AI analysis
 */
async function processVideo({ jobId, videoPath, options }) {
  if (isProcessing) {
    throw new Error('Worker is already processing a job');
  }
  
  isProcessing = true;
  currentJobId = jobId;
  
  try {
    parentPort.postMessage({
      type: 'STATUS_UPDATE',
      workerId,
      jobId,
      status: 'processing',
      progress: 0
    });
    
    // Validate video file
    await validateVideo(videoPath);
    
    // Create output directory
    const outputDir = path.join(config.video.processedPath, jobId);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Process video in stages
    await preprocessVideo(videoPath, outputDir, options);
    
    // Extract frames for analysis
    const frames = await extractFrames(videoPath, outputDir, options);
    
    // Send success message
    parentPort.postMessage({
      type: 'JOB_COMPLETE',
      workerId,
      jobId,
      result: {
        outputDir,
        frames,
        processingTime: new Date().toISOString()
      }
    });
  } catch (error) {
    parentPort.postMessage({
      type: 'JOB_FAILED',
      workerId,
      jobId,
      error: {
        message: error.message,
        stack: error.stack
      }
    });
  } finally {
    isProcessing = false;
    currentJobId = null;
    // Force garbage collection if possible
    if (global.gc) {
      global.gc();
    }
  }
}

/**
 * Generate highlights from a processed video
 */
async function generateHighlights({ jobId, videoId, parameters }) {
  if (isProcessing) {
    throw new Error('Worker is already processing a job');
  }
  
  isProcessing = true;
  currentJobId = jobId;
  
  try {
    parentPort.postMessage({
      type: 'STATUS_UPDATE',
      workerId,
      jobId,
      status: 'generating_highlights',
      progress: 0
    });
    
    // Get processed video path
    const videoPath = path.join(config.video.processedPath, videoId, 'processed.mp4');
    
    if (!fs.existsSync(videoPath)) {
      throw new Error(`Processed video not found: ${videoPath}`);
    }
    
    // Create highlights directory
    const highlightsDir = path.join(config.video.processedPath, videoId, 'highlights');
    if (!fs.existsSync(highlightsDir)) {
      fs.mkdirSync(highlightsDir, { recursive: true });
    }
    
    // Generate highlights here
    // This would involve:
    // 1. Analyzing key moments using AI models
    // 2. Extracting segments from the video
    // 3. Creating a highlight compilation
    
    // Mock implementation (would be replaced with actual highlight generation)
    const highlights = [
      { startTime: 30, endTime: 40, score: 0.95, label: 'Key Play' },
      { startTime: 120, endTime: 135, score: 0.87, label: 'Team Effort' },
      { startTime: 280, endTime: 295, score: 0.92, label: 'Technical Skill' }
    ];
    
    // Generate highlight clips
    const highlightClips = await Promise.all(
      highlights.map((highlight, index) => extractClip(
        videoPath, 
        path.join(highlightsDir, `highlight_${index + 1}.mp4`),
        highlight.startTime,
        highlight.endTime - highlight.startTime
      ))
    );
    
    // Combine highlight clips (mock implementation)
    const highlightPath = path.join(highlightsDir, 'highlights.mp4');
    
    // Send success message
    parentPort.postMessage({
      type: 'HIGHLIGHTS_COMPLETE',
      workerId,
      jobId,
      result: {
        highlightPath,
        highlights,
        clips: highlightClips
      }
    });
  } catch (error) {
    parentPort.postMessage({
      type: 'JOB_FAILED',
      workerId,
      jobId,
      error: {
        message: error.message,
        stack: error.stack
      }
    });
  } finally {
    isProcessing = false;
    currentJobId = null;
  }
}

/**
 * Analyze athlete performance in a video
 */
async function analyzePerformance({ jobId, videoId, athleteId, sportType }) {
  if (isProcessing) {
    throw new Error('Worker is already processing a job');
  }
  
  isProcessing = true;
  currentJobId = jobId;
  
  try {
    parentPort.postMessage({
      type: 'STATUS_UPDATE',
      workerId,
      jobId,
      status: 'analyzing_performance',
      progress: 0
    });
    
    // Get processed frames directory
    const framesDir = path.join(config.video.processedPath, videoId, 'frames');
    
    if (!fs.existsSync(framesDir)) {
      throw new Error(`Processed frames not found: ${framesDir}`);
    }
    
    // Create analysis directory
    const analysisDir = path.join(config.video.processedPath, videoId, 'analysis');
    if (!fs.existsSync(analysisDir)) {
      fs.mkdirSync(analysisDir, { recursive: true });
    }
    
    // Get list of frames
    const frameFiles = fs.readdirSync(framesDir)
      .filter(file => file.endsWith('.jpg'))
      .sort((a, b) => {
        const numA = parseInt(a.match(/\d+/)[0]);
        const numB = parseInt(b.match(/\d+/)[0]);
        return numA - numB;
      });
    
    // Analyze frames in batches
    const totalFrames = frameFiles.length;
    const batchSize = config.video.maxFramesPerBatch;
    const batches = Math.ceil(totalFrames / batchSize);
    
    const analysisResults = [];
    
    for (let i = 0; i < batches; i++) {
      const batchFrames = frameFiles.slice(i * batchSize, (i + 1) * batchSize);
      
      // Report progress
      parentPort.postMessage({
        type: 'STATUS_UPDATE',
        workerId,
        jobId,
        status: 'analyzing_performance',
        progress: (i / batches) * 100
      });
      
      // Process batch of frames
      const batchPaths = batchFrames.map(frame => path.join(framesDir, frame));
      const batchResults = await analyzeBatch(batchPaths, athleteId, sportType);
      analysisResults.push(...batchResults);
    }
    
    // Save analysis results
    const analysisPath = path.join(analysisDir, `${athleteId}_analysis.json`);
    fs.writeFileSync(analysisPath, JSON.stringify(analysisResults, null, 2));
    
    // Send success message
    parentPort.postMessage({
      type: 'ANALYSIS_COMPLETE',
      workerId,
      jobId,
      result: {
        analysisPath,
        metrics: summarizeMetrics(analysisResults)
      }
    });
  } catch (error) {
    parentPort.postMessage({
      type: 'JOB_FAILED',
      workerId,
      jobId,
      error: {
        message: error.message,
        stack: error.stack
      }
    });
  } finally {
    isProcessing = false;
    currentJobId = null;
  }
}

/**
 * Validate a video file
 */
async function validateVideo(videoPath) {
  if (!fs.existsSync(videoPath)) {
    throw new Error(`Video file not found: ${videoPath}`);
  }
  
  const stats = fs.statSync(videoPath);
  const fileSizeInBytes = stats.size;
  const fileSizeInGB = fileSizeInBytes / (1024 * 1024 * 1024);
  
  if (fileSizeInGB > config.video.maxVideoSizeGB) {
    throw new Error(`Video file too large: ${fileSizeInGB.toFixed(2)}GB (max: ${config.video.maxVideoSizeGB}GB)`);
  }
  
  // Check video duration and format using ffprobe
  return new Promise((resolve, reject) => {
    const ffprobe = spawn('ffprobe', [
      '-v', 'error',
      '-show_entries', 'format=duration',
      '-of', 'json',
      videoPath
    ]);
    
    let output = '';
    
    ffprobe.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    ffprobe.on('error', (err) => {
      reject(new Error(`Failed to execute ffprobe: ${err.message}`));
    });
    
    ffprobe.on('close', (code) => {
      if (code !== 0) {
        return reject(new Error(`ffprobe process exited with code ${code}`));
      }
      
      try {
        const result = JSON.parse(output);
        const durationInSeconds = parseFloat(result.format.duration);
        const durationInMinutes = durationInSeconds / 60;
        
        if (durationInMinutes > config.video.maxVideoDurationMinutes) {
          return reject(new Error(`Video duration too long: ${durationInMinutes.toFixed(2)} minutes (max: ${config.video.maxVideoDurationMinutes} minutes)`));
        }
        
        resolve({
          duration: durationInSeconds,
          size: fileSizeInBytes
        });
      } catch (err) {
        reject(new Error(`Failed to parse ffprobe output: ${err.message}`));
      }
    });
  });
}

/**
 * Preprocess a video for analysis
 */
async function preprocessVideo(videoPath, outputDir, options) {
  const outputPath = path.join(outputDir, 'processed.mp4');
  
  return new Promise((resolve, reject) => {
    // Use ffmpeg to process the video
    const ffmpeg = spawn('ffmpeg', [
      '-i', videoPath,
      '-c:v', config.video.defaultCodec,
      '-vf', `scale=-1:${options.resolution || 720}`,
      '-an', // Remove audio
      '-y', // Overwrite existing file
      outputPath
    ]);
    
    ffmpeg.on('error', (err) => {
      reject(new Error(`Failed to execute ffmpeg: ${err.message}`));
    });
    
    ffmpeg.on('close', (code) => {
      if (code !== 0) {
        return reject(new Error(`ffmpeg process exited with code ${code}`));
      }
      
      resolve(outputPath);
    });
  });
}

/**
 * Extract frames from a video for analysis
 */
async function extractFrames(videoPath, outputDir, options = {}) {
  const framesDir = path.join(outputDir, 'frames');
  
  if (!fs.existsSync(framesDir)) {
    fs.mkdirSync(framesDir, { recursive: true });
  }
  
  const framerate = options.framerate || config.video.frameSamplingRate;
  
  return new Promise((resolve, reject) => {
    // Use ffmpeg to extract frames
    const ffmpeg = spawn('ffmpeg', [
      '-i', videoPath,
      '-vf', `fps=${framerate}`,
      '-q:v', '2', // JPEG quality (2 is high quality)
      path.join(framesDir, 'frame_%04d.jpg')
    ]);
    
    ffmpeg.on('error', (err) => {
      reject(new Error(`Failed to execute ffmpeg: ${err.message}`));
    });
    
    ffmpeg.on('close', (code) => {
      if (code !== 0) {
        return reject(new Error(`ffmpeg process exited with code ${code}`));
      }
      
      // Get list of extracted frames
      const frames = fs.readdirSync(framesDir)
        .filter(file => file.endsWith('.jpg'))
        .map(file => path.join(framesDir, file));
      
      resolve(frames);
    });
  });
}

/**
 * Extract a clip from a video
 */
async function extractClip(videoPath, outputPath, startTime, duration) {
  return new Promise((resolve, reject) => {
    // Use ffmpeg to extract clip
    const ffmpeg = spawn('ffmpeg', [
      '-i', videoPath,
      '-ss', startTime.toString(),
      '-t', duration.toString(),
      '-c:v', 'copy',
      '-c:a', 'copy',
      '-y', // Overwrite existing file
      outputPath
    ]);
    
    ffmpeg.on('error', (err) => {
      reject(new Error(`Failed to execute ffmpeg: ${err.message}`));
    });
    
    ffmpeg.on('close', (code) => {
      if (code !== 0) {
        return reject(new Error(`ffmpeg process exited with code ${code}`));
      }
      
      resolve({
        path: outputPath,
        startTime,
        duration
      });
    });
  });
}

/**
 * Analyze a batch of frames
 */
async function analyzeBatch(framePaths, athleteId, sportType) {
  // This would be replaced with actual AI analysis using OpenAI API
  // Mock implementation for demonstration
  return framePaths.map((framePath, index) => {
    const frameNumber = parseInt(path.basename(framePath).match(/\d+/)[0]);
    
    return {
      frameNumber,
      timestamp: frameNumber / config.video.frameSamplingRate,
      athleteId,
      sportType,
      detections: [
        {
          type: 'athlete',
          id: athleteId,
          confidence: 0.95,
          boundingBox: { x: 120, y: 150, width: 100, height: 200 }
        }
      ],
      metrics: {
        posture: Math.random() * 5,
        technique: Math.random() * 5,
        position: Math.random() * 5,
        movement: Math.random() * 5
      }
    };
  });
}

/**
 * Summarize metrics from analysis results
 */
function summarizeMetrics(analysisResults) {
  if (!analysisResults.length) {
    return {};
  }
  
  // Calculate averages for each metric
  const metrics = {};
  
  // Get all metric keys from the first result
  const metricKeys = Object.keys(analysisResults[0].metrics || {});
  
  metricKeys.forEach(key => {
    const values = analysisResults
      .filter(r => r.metrics && r.metrics[key] !== undefined)
      .map(r => r.metrics[key]);
    
    if (values.length > 0) {
      const sum = values.reduce((a, b) => a + b, 0);
      metrics[key] = {
        average: sum / values.length,
        min: Math.min(...values),
        max: Math.max(...values),
        samples: values.length
      };
    }
  });
  
  return {
    overallScore: calculateOverallScore(metrics),
    metrics
  };
}

/**
 * Calculate overall score from metrics
 */
function calculateOverallScore(metrics) {
  // This would be replaced with a more sophisticated algorithm
  const averages = Object.values(metrics)
    .map(m => m.average)
    .filter(v => !isNaN(v));
  
  if (averages.length === 0) {
    return 0;
  }
  
  return averages.reduce((a, b) => a + b, 0) / averages.length;
}

/**
 * Report worker status to main thread
 */
function reportStatus() {
  const memoryUsage = process.memoryUsage();
  
  parentPort.postMessage({
    type: 'STATUS_REPORT',
    workerId,
    status: isProcessing ? 'busy' : 'idle',
    currentJobId,
    memory: {
      rss: memoryUsage.rss / (1024 * 1024), // MB
      heapTotal: memoryUsage.heapTotal / (1024 * 1024), // MB
      heapUsed: memoryUsage.heapUsed / (1024 * 1024) // MB
    },
    uptime: process.uptime()
  });
}

/**
 * Gracefully shutdown the worker
 */
function gracefulShutdown() {
  if (isProcessing) {
    parentPort.postMessage({
      type: 'SHUTDOWN_REJECTED',
      workerId,
      reason: 'Worker is currently processing a job'
    });
    return;
  }
  
  parentPort.postMessage({
    type: 'SHUTDOWN_ACCEPTED',
    workerId
  });
  
  // Clean up resources
  setTimeout(() => {
    process.exit(0);
  }, 1000);
}