/**
 * Go4It Engine - Video Processor Worker
 * 
 * This worker handles video processing tasks including:
 * - Frame extraction
 * - Video compression
 * - Metadata extraction
 * - Format conversion
 */

const { reportProgress, completeJob, handleError, jobId, jobType, jobData } = require('./base-worker');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const { promisify } = require('util');
const existsAsync = promisify(fs.exists);
const mkdirAsync = promisify(fs.mkdir);

// Process video job
async function processVideo() {
  try {
    const { videoPath, outputDir, options = {} } = jobData;
    
    // Validate inputs
    if (!videoPath || !await existsAsync(videoPath)) {
      throw new Error(`Video file not found: ${videoPath}`);
    }
    
    // Create output directory if it doesn't exist
    if (!await existsAsync(outputDir)) {
      await mkdirAsync(outputDir, { recursive: true });
    }
    
    // Report start
    reportProgress(5, { status: 'Analyzing video file' });
    
    // Extract video metadata
    const metadata = await extractVideoMetadata(videoPath);
    reportProgress(10, { status: 'Metadata extracted', metadata });
    
    // Process video based on options
    const tasks = [];
    
    if (options.extractFrames) {
      tasks.push({ name: 'frame_extraction', weight: 30 });
    }
    
    if (options.compressVideo) {
      tasks.push({ name: 'video_compression', weight: 40 });
    }
    
    if (options.extractAudio) {
      tasks.push({ name: 'audio_extraction', weight: 20 });
    }
    
    // Always include metadata extraction
    tasks.push({ name: 'metadata_extraction', weight: 10 });
    
    // Calculate total weight
    const totalWeight = tasks.reduce((sum, task) => sum + task.weight, 0);
    
    // Initialize results object
    const results = {
      metadata,
      processedFiles: [],
      originalPath: videoPath,
      outputPath: outputDir
    };
    
    // Process each task
    let completedWeight = 10; // Start at 10% (metadata already done)
    
    for (const task of tasks) {
      const taskStartProgress = completedWeight;
      const taskEndProgress = completedWeight + (task.weight / totalWeight * 90);
      
      // Process based on task type
      switch (task.name) {
        case 'frame_extraction':
          const frameResults = await extractFrames(
            videoPath, 
            outputDir, 
            options.frameRate || 1,
            progress => reportProgress(
              Math.floor(taskStartProgress + (progress * (taskEndProgress - taskStartProgress) / 100))
            )
          );
          results.frames = frameResults;
          results.processedFiles.push(...frameResults.framePaths);
          break;
          
        case 'video_compression':
          const compressedPath = await compressVideo(
            videoPath, 
            outputDir, 
            options.compressionSettings || {},
            progress => reportProgress(
              Math.floor(taskStartProgress + (progress * (taskEndProgress - taskStartProgress) / 100))
            )
          );
          results.compressedVideo = compressedPath;
          results.processedFiles.push(compressedPath);
          break;
          
        case 'audio_extraction':
          const audioPath = await extractAudio(
            videoPath, 
            outputDir,
            progress => reportProgress(
              Math.floor(taskStartProgress + (progress * (taskEndProgress - taskStartProgress) / 100))
            )
          );
          results.audioPath = audioPath;
          results.processedFiles.push(audioPath);
          break;
      }
      
      completedWeight = taskEndProgress;
    }
    
    // Complete the job
    reportProgress(100, { status: 'Processing complete', results });
    completeJob(results);
    
  } catch (error) {
    handleError(error);
  }
}

/**
 * Extract metadata from video file
 */
async function extractVideoMetadata(videoPath) {
  return new Promise((resolve, reject) => {
    // Use ffprobe to extract metadata
    const ffprobe = spawn('ffprobe', [
      '-v', 'quiet',
      '-print_format', 'json',
      '-show_format',
      '-show_streams',
      videoPath
    ]);
    
    let output = '';
    
    ffprobe.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    ffprobe.stderr.on('data', (data) => {
      console.error(`ffprobe stderr: ${data}`);
    });
    
    ffprobe.on('close', (code) => {
      if (code !== 0) {
        return reject(new Error(`ffprobe process exited with code ${code}`));
      }
      
      try {
        const metadata = JSON.parse(output);
        
        // Extract relevant information
        const result = {
          duration: parseFloat(metadata.format.duration),
          size: parseInt(metadata.format.size),
          bitrate: parseInt(metadata.format.bit_rate),
          format: metadata.format.format_name,
          codec: metadata.streams[0].codec_name,
          width: metadata.streams[0].width,
          height: metadata.streams[0].height,
          fps: eval(metadata.streams[0].r_frame_rate) // Safe here as we know ffprobe output format
        };
        
        resolve(result);
      } catch (error) {
        reject(new Error(`Error parsing ffprobe output: ${error.message}`));
      }
    });
  });
}

/**
 * Extract frames from video
 */
async function extractFrames(videoPath, outputDir, frameRate = 1, progressCallback) {
  const framesDir = path.join(outputDir, 'frames');
  
  // Create frames directory
  if (!await existsAsync(framesDir)) {
    await mkdirAsync(framesDir, { recursive: true });
  }
  
  return new Promise((resolve, reject) => {
    // Calculate total frames for accurate progress reporting
    let totalFrames;
    let extractedFrames = 0;
    
    // Use ffmpeg to extract frames
    const ffmpeg = spawn('ffmpeg', [
      '-i', videoPath,
      '-vf', `fps=${frameRate}`,
      '-q:v', '1', // High quality JPEG
      path.join(framesDir, 'frame_%04d.jpg')
    ]);
    
    ffmpeg.stderr.on('data', (data) => {
      const output = data.toString();
      
      // Try to parse fps and duration to estimate total frames
      if (!totalFrames && output.includes('Duration:')) {
        const durationMatch = output.match(/Duration: (\d+):(\d+):(\d+)\.(\d+)/);
        const fpsMatch = output.match(/(\d+) fps/);
        
        if (durationMatch && fpsMatch) {
          const hours = parseInt(durationMatch[1]);
          const minutes = parseInt(durationMatch[2]);
          const seconds = parseInt(durationMatch[3]);
          const fps = parseInt(fpsMatch[1]);
          
          const totalSeconds = hours * 3600 + minutes * 60 + seconds;
          totalFrames = Math.ceil(totalSeconds * frameRate);
        }
      }
      
      // Look for frame extraction progress
      const frameMatch = output.match(/frame=\s*(\d+)/);
      if (frameMatch) {
        extractedFrames = parseInt(frameMatch[1]);
        
        // Report progress if we have total frames estimate
        if (totalFrames) {
          const progress = Math.min(99, Math.floor((extractedFrames / totalFrames) * 100));
          progressCallback(progress);
        }
      }
    });
    
    ffmpeg.on('close', async (code) => {
      if (code !== 0) {
        return reject(new Error(`ffmpeg process exited with code ${code}`));
      }
      
      // Get list of extracted frames
      const framePaths = [];
      const files = fs.readdirSync(framesDir);
      
      for (const file of files) {
        if (file.startsWith('frame_') && file.endsWith('.jpg')) {
          framePaths.push(path.join(framesDir, file));
        }
      }
      
      resolve({
        count: framePaths.length,
        framePaths,
        frameRate
      });
    });
  });
}

/**
 * Compress video
 */
async function compressVideo(videoPath, outputDir, settings = {}, progressCallback) {
  const { quality = 'medium', resolution, bitrate } = settings;
  
  // Determine output filename
  const inputFilename = path.basename(videoPath);
  const outputFilename = `compressed_${inputFilename}`;
  const outputPath = path.join(outputDir, outputFilename);
  
  // Build ffmpeg command
  const ffmpegArgs = ['-i', videoPath];
  
  // Set quality preset
  ffmpegArgs.push('-preset', quality);
  
  // Set resolution if specified
  if (resolution) {
    ffmpegArgs.push('-s', resolution);
  }
  
  // Set bitrate if specified
  if (bitrate) {
    ffmpegArgs.push('-b:v', bitrate);
  }
  
  // Output file
  ffmpegArgs.push(outputPath);
  
  return new Promise((resolve, reject) => {
    // Use ffmpeg to compress
    const ffmpeg = spawn('ffmpeg', ffmpegArgs);
    
    ffmpeg.stderr.on('data', (data) => {
      const output = data.toString();
      
      // Parse progress
      const timeMatch = output.match(/time=(\d+):(\d+):(\d+)\.(\d+)/);
      const durationMatch = output.match(/Duration: (\d+):(\d+):(\d+)\.(\d+)/);
      
      if (timeMatch && durationMatch) {
        const currentHours = parseInt(timeMatch[1]);
        const currentMinutes = parseInt(timeMatch[2]);
        const currentSeconds = parseInt(timeMatch[3]);
        
        const totalHours = parseInt(durationMatch[1]);
        const totalMinutes = parseInt(durationMatch[2]);
        const totalSeconds = parseInt(durationMatch[3]);
        
        const currentTime = currentHours * 3600 + currentMinutes * 60 + currentSeconds;
        const totalTime = totalHours * 3600 + totalMinutes * 60 + totalSeconds;
        
        const progress = Math.min(99, Math.floor((currentTime / totalTime) * 100));
        progressCallback(progress);
      }
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
 * Extract audio from video
 */
async function extractAudio(videoPath, outputDir, progressCallback) {
  // Determine output filename
  const inputFilename = path.basename(videoPath, path.extname(videoPath));
  const outputFilename = `${inputFilename}.mp3`;
  const outputPath = path.join(outputDir, outputFilename);
  
  return new Promise((resolve, reject) => {
    // Use ffmpeg to extract audio
    const ffmpeg = spawn('ffmpeg', [
      '-i', videoPath,
      '-q:a', '0', // High quality
      '-map', 'a',
      outputPath
    ]);
    
    ffmpeg.stderr.on('data', (data) => {
      const output = data.toString();
      
      // Parse progress
      const timeMatch = output.match(/time=(\d+):(\d+):(\d+)\.(\d+)/);
      const durationMatch = output.match(/Duration: (\d+):(\d+):(\d+)\.(\d+)/);
      
      if (timeMatch && durationMatch) {
        const currentHours = parseInt(timeMatch[1]);
        const currentMinutes = parseInt(timeMatch[2]);
        const currentSeconds = parseInt(timeMatch[3]);
        
        const totalHours = parseInt(durationMatch[1]);
        const totalMinutes = parseInt(durationMatch[2]);
        const totalSeconds = parseInt(durationMatch[3]);
        
        const currentTime = currentHours * 3600 + currentMinutes * 60 + currentSeconds;
        const totalTime = totalHours * 3600 + totalMinutes * 60 + totalSeconds;
        
        const progress = Math.min(99, Math.floor((currentTime / totalTime) * 100));
        progressCallback(progress);
      }
    });
    
    ffmpeg.on('close', (code) => {
      if (code !== 0) {
        return reject(new Error(`ffmpeg process exited with code ${code}`));
      }
      
      resolve(outputPath);
    });
  });
}

// Start processing
processVideo().catch(handleError);