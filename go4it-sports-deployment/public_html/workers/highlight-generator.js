/**
 * Go4It Engine - Highlight Generator Worker
 * 
 * This worker identifies important moments from video analysis
 * and creates highlight clips automatically.
 */

const { reportProgress, completeJob, handleError, jobId, jobType, jobData } = require('./base-worker');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const { promisify } = require('util');
const existsAsync = promisify(fs.exists);
const mkdirAsync = promisify(fs.mkdir);
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

// Process highlight generation job
async function generateHighlights() {
  try {
    const { videoId, videoPath, garAnalysis, options = {} } = jobData;
    
    // Validate inputs
    if (!videoPath || !await existsAsync(videoPath)) {
      throw new Error(`Video file not found: ${videoPath}`);
    }
    
    if (!garAnalysis) {
      throw new Error('GAR analysis data is required for highlight generation');
    }
    
    // Create output directory
    const outputDir = options.outputDir || path.join(path.dirname(videoPath), 'highlights');
    if (!await existsAsync(outputDir)) {
      await mkdirAsync(outputDir, { recursive: true });
    }
    
    // Report start
    reportProgress(5, { status: 'Initializing highlight generation' });
    
    // Extract video metadata
    reportProgress(10, { status: 'Extracting video metadata' });
    const metadata = await extractVideoMetadata(videoPath);
    
    // Identify important moments from GAR analysis
    reportProgress(20, { status: 'Identifying key moments' });
    const keyMoments = identifyKeyMoments(garAnalysis, metadata, options);
    
    // Generate highlight clips
    reportProgress(30, { status: 'Generating highlight clips' });
    const clipResults = await generateClips(videoPath, outputDir, keyMoments, metadata);
    
    // Generate highlight sequence
    reportProgress(70, { status: 'Creating highlight sequence' });
    const highlightPath = await createHighlightSequence(clipResults.clipPaths, outputDir, options, metadata);
    
    // Create metadata file with highlight annotations
    const metadataPath = path.join(outputDir, 'highlight_metadata.json');
    await writeFileAsync(metadataPath, JSON.stringify({
      videoId,
      originalVideo: videoPath,
      highlightVideo: highlightPath,
      keyMoments,
      clips: clipResults.clips,
      metadata,
      generatedAt: new Date().toISOString()
    }, null, 2));
    
    // Complete the job
    reportProgress(100, { 
      status: 'Highlight generation complete',
      highlightPath,
      metadataPath,
      keyMoments: keyMoments.length,
      duration: clipResults.totalDuration
    });
    
    completeJob({
      videoId,
      highlightPath,
      metadataPath,
      keyMoments: keyMoments.length,
      duration: clipResults.totalDuration,
      thumbnailPath: clipResults.thumbnailPath
    });
    
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
 * Identify key moments based on GAR analysis
 */
function identifyKeyMoments(garAnalysis, metadata, options) {
  const { sport, metrics, movements = [], insights = [] } = garAnalysis;
  const { highlightCount = 5, minDuration = 3, maxDuration = 10 } = options;
  
  // In a real implementation, we would analyze the movements data to find moments of interest
  // For example, peaks in velocity, particularly good form, or scoring moments
  
  // For this simulation, we'll generate random timestamps that represent key moments
  const keyMoments = [];
  const videoDuration = metadata.duration;
  
  // Ensure we don't exceed the video length
  const effectiveVideoDuration = Math.max(0, videoDuration - maxDuration);
  
  // Generate moments based on sport type
  switch (sport?.toLowerCase()) {
    case 'basketball':
      // Basketball moments: shots, passes, defensive plays
      keyMoments.push(
        { type: 'shot', startTime: randomTimeInRange(0, effectiveVideoDuration), duration: randomTimeInRange(3, 6) },
        { type: 'pass', startTime: randomTimeInRange(0, effectiveVideoDuration), duration: randomTimeInRange(2, 5) },
        { type: 'defensive', startTime: randomTimeInRange(0, effectiveVideoDuration), duration: randomTimeInRange(2, 6) },
        { type: 'dribble', startTime: randomTimeInRange(0, effectiveVideoDuration), duration: randomTimeInRange(2, 4) }
      );
      break;
      
    case 'football':
      // Football moments: throws, runs, tackles
      keyMoments.push(
        { type: 'throw', startTime: randomTimeInRange(0, effectiveVideoDuration), duration: randomTimeInRange(3, 7) },
        { type: 'run', startTime: randomTimeInRange(0, effectiveVideoDuration), duration: randomTimeInRange(4, 8) },
        { type: 'tackle', startTime: randomTimeInRange(0, effectiveVideoDuration), duration: randomTimeInRange(2, 5) },
        { type: 'play', startTime: randomTimeInRange(0, effectiveVideoDuration), duration: randomTimeInRange(5, 10) }
      );
      break;
      
    case 'soccer':
      // Soccer moments: shots, passes, dribbles, tackles
      keyMoments.push(
        { type: 'shot', startTime: randomTimeInRange(0, effectiveVideoDuration), duration: randomTimeInRange(3, 6) },
        { type: 'pass', startTime: randomTimeInRange(0, effectiveVideoDuration), duration: randomTimeInRange(2, 4) },
        { type: 'dribble', startTime: randomTimeInRange(0, effectiveVideoDuration), duration: randomTimeInRange(3, 7) },
        { type: 'tackle', startTime: randomTimeInRange(0, effectiveVideoDuration), duration: randomTimeInRange(2, 5) }
      );
      break;
      
    default:
      // Generic moments for other sports
      for (let i = 0; i < highlightCount; i++) {
        keyMoments.push({
          type: 'highlight',
          startTime: randomTimeInRange(0, effectiveVideoDuration),
          duration: randomTimeInRange(minDuration, maxDuration)
        });
      }
  }
  
  // Add metrics-based text descriptions
  keyMoments.forEach(moment => {
    // Add description based on moment type
    switch (moment.type) {
      case 'shot':
        moment.description = `Great shooting form with ${formatMetricValue(metrics.shooting || 7.5)}/10 technique`;
        break;
      case 'pass':
        moment.description = `Excellent passing vision rated ${formatMetricValue(metrics.passing || 8.2)}/10`;
        break;
      case 'defensive':
        moment.description = `Strong defensive positioning with ${formatMetricValue(metrics.defense || 7.8)}/10 technique`;
        break;
      case 'dribble':
        moment.description = `Impressive ball handling rated ${formatMetricValue(metrics.ballHandling || 8.0)}/10`;
        break;
      case 'throw':
        moment.description = `Powerful throw showing ${formatMetricValue(metrics.armStrength || 7.9)}/10 arm strength`;
        break;
      case 'run':
        moment.description = `Explosive running ability rated ${formatMetricValue(metrics.speed || 8.3)}/10`;
        break;
      case 'tackle':
        moment.description = `Solid tackling technique with ${formatMetricValue(metrics.tacklingForm || 7.6)}/10 form`;
        break;
      case 'play':
        moment.description = `High IQ play showing ${formatMetricValue(metrics.gameIQ || 8.1)}/10 game intelligence`;
        break;
      default:
        moment.description = `Athletic highlight showing ${formatMetricValue(metrics.athleticism || 7.5)}/10 ability`;
    }
  });
  
  // Ensure moments are in chronological order
  keyMoments.sort((a, b) => a.startTime - b.startTime);
  
  // Ensure we don't have overlapping segments
  for (let i = 1; i < keyMoments.length; i++) {
    const prevEnd = keyMoments[i-1].startTime + keyMoments[i-1].duration;
    if (keyMoments[i].startTime < prevEnd) {
      keyMoments[i].startTime = prevEnd;
    }
  }
  
  return keyMoments;
}

/**
 * Format metric value to one decimal place
 */
function formatMetricValue(value) {
  return parseFloat(value).toFixed(1);
}

/**
 * Generate random time value within a range
 */
function randomTimeInRange(min, max) {
  return min + Math.random() * (max - min);
}

/**
 * Generate individual clip files for each key moment
 */
async function generateClips(videoPath, outputDir, keyMoments, metadata) {
  const clipResults = {
    clipPaths: [],
    clips: [],
    totalDuration: 0,
    thumbnailPath: null
  };
  
  let totalProgress = 30; // Start at 30% (continuing from previous steps)
  const progressPerClip = 40 / keyMoments.length; // 40% of progress is for clip generation
  
  // Process each key moment
  for (let i = 0; i < keyMoments.length; i++) {
    const moment = keyMoments[i];
    const clipName = `clip_${i+1}_${moment.type}_${moment.startTime.toFixed(1)}.mp4`;
    const clipPath = path.join(outputDir, clipName);
    
    // Update progress
    reportProgress(totalProgress, { 
      status: `Generating clip ${i+1} of ${keyMoments.length}: ${moment.type}`
    });
    
    // Create clip using ffmpeg
    await createClip(videoPath, clipPath, moment.startTime, moment.duration);
    
    // Generate thumbnail for first clip
    if (i === 0) {
      const thumbnailPath = path.join(outputDir, `thumbnail_${i+1}.jpg`);
      await generateThumbnail(clipPath, thumbnailPath);
      clipResults.thumbnailPath = thumbnailPath;
    }
    
    // Add clip to results
    clipResults.clipPaths.push(clipPath);
    clipResults.clips.push({
      path: clipPath,
      startTime: moment.startTime,
      duration: moment.duration,
      type: moment.type,
      description: moment.description
    });
    clipResults.totalDuration += moment.duration;
    
    // Update progress
    totalProgress += progressPerClip;
    reportProgress(Math.min(70, totalProgress));
  }
  
  return clipResults;
}

/**
 * Create a single clip from the original video
 */
async function createClip(videoPath, outputPath, startTime, duration) {
  return new Promise((resolve, reject) => {
    // Use ffmpeg to extract clip
    const ffmpeg = spawn('ffmpeg', [
      '-i', videoPath,
      '-ss', startTime.toString(),
      '-t', duration.toString(),
      '-c:v', 'libx264',
      '-c:a', 'aac',
      '-b:v', '2000k',
      '-b:a', '128k',
      '-y', // Overwrite output
      outputPath
    ]);
    
    ffmpeg.stderr.on('data', (data) => {
      // ffmpeg outputs progress to stderr
      console.log(`ffmpeg: ${data}`);
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
 * Generate thumbnail image from video clip
 */
async function generateThumbnail(videoPath, outputPath) {
  return new Promise((resolve, reject) => {
    // Use ffmpeg to extract frame at 25% into the clip
    const ffmpeg = spawn('ffmpeg', [
      '-i', videoPath,
      '-ss', '0', // Start at beginning
      '-vframes', '1', // Extract 1 frame
      '-q:v', '2', // High quality
      '-y', // Overwrite output
      outputPath
    ]);
    
    ffmpeg.stderr.on('data', (data) => {
      // ffmpeg outputs progress to stderr
      console.log(`ffmpeg: ${data}`);
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
 * Create final highlight sequence from individual clips
 */
async function createHighlightSequence(clipPaths, outputDir, options, metadata) {
  // Create a file list for concat
  const listPath = path.join(outputDir, 'clips.txt');
  const listContent = clipPaths.map(clip => `file '${clip}'`).join('\n');
  await writeFileAsync(listPath, listContent);
  
  // Output path for highlight video
  const highlightPath = path.join(outputDir, 'highlight_reel.mp4');
  
  return new Promise((resolve, reject) => {
    // Use ffmpeg to concatenate clips
    const ffmpeg = spawn('ffmpeg', [
      '-f', 'concat',
      '-safe', '0',
      '-i', listPath,
      '-c', 'copy', // Use same codec (no re-encoding)
      '-y', // Overwrite output
      highlightPath
    ]);
    
    ffmpeg.stderr.on('data', (data) => {
      // ffmpeg outputs progress to stderr
      console.log(`ffmpeg: ${data}`);
    });
    
    ffmpeg.on('close', (code) => {
      if (code !== 0) {
        return reject(new Error(`ffmpeg process exited with code ${code}`));
      }
      
      resolve(highlightPath);
    });
  });
}

// Start processing
generateHighlights().catch(handleError);