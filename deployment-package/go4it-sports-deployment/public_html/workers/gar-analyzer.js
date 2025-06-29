/**
 * Go4It Engine - GAR (Growth and Ability Rating) Analyzer Worker
 * 
 * This worker analyzes video frames to extract performance metrics for the GAR scoring system.
 * It utilizes computer vision and ML techniques to assess athlete performance.
 */

const { reportProgress, completeJob, handleError, jobId, jobType, jobData } = require('./base-worker');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const { createCanvas, loadImage } = require('canvas');
const existsAsync = promisify(fs.exists);
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

// Process GAR analysis job
async function processGarAnalysis() {
  try {
    const { athleteId, videoId, framePaths, sport, position, options = {} } = jobData;
    
    // Validate inputs
    if (!framePaths || !framePaths.length) {
      throw new Error('No frames provided for analysis');
    }
    
    if (!sport) {
      throw new Error('Sport type must be specified for GAR analysis');
    }
    
    // Report start
    reportProgress(5, { status: 'Initializing GAR analysis' });
    
    // Set up task pipeline
    const tasks = [
      { name: 'pose_estimation', weight: 30 },
      { name: 'movement_analysis', weight: 30 },
      { name: 'metrics_calculation', weight: 30 },
      { name: 'score_generation', weight: 10 }
    ];
    
    // Initialize results
    const results = {
      athleteId,
      videoId,
      sport,
      position,
      frameCount: framePaths.length,
      metrics: {},
      insights: [],
      timestamp: new Date().toISOString()
    };
    
    // Track progress
    let completedWeight = 5; // Start at 5%
    
    // Process frames in batches for memory efficiency
    const batchSize = 10;
    const batches = Math.ceil(framePaths.length / batchSize);
    
    // Perform pose estimation on all frames
    reportProgress(completedWeight, { status: 'Estimating athlete poses' });
    
    const poseResults = [];
    for (let i = 0; i < batches; i++) {
      const batchStart = i * batchSize;
      const batchEnd = Math.min((i + 1) * batchSize, framePaths.length);
      const batchFrames = framePaths.slice(batchStart, batchEnd);
      
      const batchResults = await estimatePosesForBatch(batchFrames);
      poseResults.push(...batchResults);
      
      // Update progress
      const batchProgress = Math.floor((i + 1) / batches * tasks[0].weight);
      reportProgress(completedWeight + batchProgress, { 
        status: `Pose estimation progress: ${i + 1}/${batches} batches`
      });
    }
    
    results.poseKeypoints = poseResults.length;
    completedWeight += tasks[0].weight;
    
    // Analyze movements based on pose data
    reportProgress(completedWeight, { status: 'Analyzing movement patterns' });
    const movementAnalysis = await analyzeMovements(poseResults, sport, position);
    results.movements = movementAnalysis.summary;
    completedWeight += tasks[1].weight;
    
    // Calculate performance metrics
    reportProgress(completedWeight, { status: 'Calculating performance metrics' });
    const performanceMetrics = calculatePerformanceMetrics(movementAnalysis, sport, position);
    results.metrics = performanceMetrics;
    completedWeight += tasks[2].weight;
    
    // Generate final GAR score
    reportProgress(completedWeight, { status: 'Generating GAR score' });
    const garScore = calculateGarScore(performanceMetrics, sport, position);
    results.garScore = garScore;
    results.insights = generateInsights(performanceMetrics, garScore, sport, position);
    completedWeight += tasks[3].weight;
    
    // Complete the job
    reportProgress(100, { status: 'GAR analysis complete', results });
    completeJob(results);
    
  } catch (error) {
    handleError(error);
  }
}

/**
 * Estimate poses for a batch of frames
 */
async function estimatePosesForBatch(framePaths) {
  const results = [];
  
  // In a real implementation, this would use a proper pose estimation model
  // Here we'll simulate the process with randomized data
  for (const framePath of framePaths) {
    try {
      // Load the image for processing
      const image = await loadImage(framePath);
      
      // Create a canvas for visualization (if needed)
      const canvas = createCanvas(image.width, image.height);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(image, 0, 0);
      
      // Generate simulated pose keypoints
      // In a real implementation, this would be the result of a ML model
      const keypoints = generateSimulatedPoseKeypoints(image.width, image.height);
      
      // Optionally, visualize keypoints on canvas for debugging
      if (process.env.DEBUG_POSES) {
        drawKeypointsOnCanvas(ctx, keypoints);
        await writeFileAsync(
          framePath.replace('.jpg', '_pose.jpg'), 
          canvas.toBuffer('image/jpeg')
        );
      }
      
      // Store frame path and keypoints
      results.push({
        frame: path.basename(framePath),
        keypoints,
        timestamp: extractTimestampFromFramename(framePath)
      });
      
    } catch (error) {
      console.error(`Error processing frame ${framePath}: ${error.message}`);
      // Continue processing other frames
    }
  }
  
  return results;
}

/**
 * Generate simulated pose keypoints for testing
 */
function generateSimulatedPoseKeypoints(width, height) {
  // Simulate keypoints for a human body
  // In production, these would come from a real pose estimation model
  const keypoints = [
    { name: 'nose', x: width / 2 + Math.random() * 20 - 10, y: height * 0.2 + Math.random() * 10 - 5, confidence: 0.9 },
    { name: 'left_eye', x: width / 2 - 20 + Math.random() * 4 - 2, y: height * 0.19 + Math.random() * 4 - 2, confidence: 0.9 },
    { name: 'right_eye', x: width / 2 + 20 + Math.random() * 4 - 2, y: height * 0.19 + Math.random() * 4 - 2, confidence: 0.9 },
    { name: 'left_ear', x: width / 2 - 40 + Math.random() * 6 - 3, y: height * 0.2 + Math.random() * 6 - 3, confidence: 0.85 },
    { name: 'right_ear', x: width / 2 + 40 + Math.random() * 6 - 3, y: height * 0.2 + Math.random() * 6 - 3, confidence: 0.85 },
    { name: 'left_shoulder', x: width / 2 - 80 + Math.random() * 8 - 4, y: height * 0.28 + Math.random() * 8 - 4, confidence: 0.9 },
    { name: 'right_shoulder', x: width / 2 + 80 + Math.random() * 8 - 4, y: height * 0.28 + Math.random() * 8 - 4, confidence: 0.9 },
    { name: 'left_elbow', x: width / 2 - 100 + Math.random() * 10 - 5, y: height * 0.4 + Math.random() * 10 - 5, confidence: 0.85 },
    { name: 'right_elbow', x: width / 2 + 100 + Math.random() * 10 - 5, y: height * 0.4 + Math.random() * 10 - 5, confidence: 0.85 },
    { name: 'left_wrist', x: width / 2 - 110 + Math.random() * 12 - 6, y: height * 0.52 + Math.random() * 12 - 6, confidence: 0.8 },
    { name: 'right_wrist', x: width / 2 + 110 + Math.random() * 12 - 6, y: height * 0.52 + Math.random() * 12 - 6, confidence: 0.8 },
    { name: 'left_hip', x: width / 2 - 50 + Math.random() * 8 - 4, y: height * 0.55 + Math.random() * 8 - 4, confidence: 0.9 },
    { name: 'right_hip', x: width / 2 + 50 + Math.random() * 8 - 4, y: height * 0.55 + Math.random() * 8 - 4, confidence: 0.9 },
    { name: 'left_knee', x: width / 2 - 55 + Math.random() * 10 - 5, y: height * 0.7 + Math.random() * 10 - 5, confidence: 0.85 },
    { name: 'right_knee', x: width / 2 + 55 + Math.random() * 10 - 5, y: height * 0.7 + Math.random() * 10 - 5, confidence: 0.85 },
    { name: 'left_ankle', x: width / 2 - 60 + Math.random() * 12 - 6, y: height * 0.9 + Math.random() * 12 - 6, confidence: 0.8 },
    { name: 'right_ankle', x: width / 2 + 60 + Math.random() * 12 - 6, y: height * 0.9 + Math.random() * 12 - 6, confidence: 0.8 },
  ];
  
  return keypoints;
}

/**
 * Draw keypoints on canvas for visualization
 */
function drawKeypointsOnCanvas(ctx, keypoints) {
  // Draw connections between keypoints
  const connections = [
    ['nose', 'left_eye'], ['nose', 'right_eye'],
    ['left_eye', 'left_ear'], ['right_eye', 'right_ear'],
    ['left_shoulder', 'right_shoulder'], ['left_shoulder', 'left_elbow'],
    ['right_shoulder', 'right_elbow'], ['left_elbow', 'left_wrist'],
    ['right_elbow', 'right_wrist'], ['left_shoulder', 'left_hip'],
    ['right_shoulder', 'right_hip'], ['left_hip', 'right_hip'],
    ['left_hip', 'left_knee'], ['right_hip', 'right_knee'],
    ['left_knee', 'left_ankle'], ['right_knee', 'right_ankle']
  ];
  
  // Create map of keypoints by name for easy lookup
  const keypointMap = {};
  keypoints.forEach(kp => {
    keypointMap[kp.name] = kp;
  });
  
  // Draw connections
  ctx.strokeStyle = 'rgba(0, 255, 0, 0.7)';
  ctx.lineWidth = 3;
  
  connections.forEach(([from, to]) => {
    const fromPoint = keypointMap[from];
    const toPoint = keypointMap[to];
    
    if (fromPoint && toPoint && fromPoint.confidence > 0.5 && toPoint.confidence > 0.5) {
      ctx.beginPath();
      ctx.moveTo(fromPoint.x, fromPoint.y);
      ctx.lineTo(toPoint.x, toPoint.y);
      ctx.stroke();
    }
  });
  
  // Draw keypoints
  keypoints.forEach(keypoint => {
    if (keypoint.confidence > 0.5) {
      ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
      ctx.beginPath();
      ctx.arc(keypoint.x, keypoint.y, 5, 0, 2 * Math.PI);
      ctx.fill();
    }
  });
}

/**
 * Extract timestamp from frame filename
 */
function extractTimestampFromFramename(framePath) {
  const filename = path.basename(framePath);
  const frameNumberMatch = filename.match(/frame_(\d+)/);
  
  if (frameNumberMatch) {
    const frameNumber = parseInt(frameNumberMatch[1]);
    return frameNumber;
  }
  
  return 0;
}

/**
 * Analyze movement patterns from pose data
 */
async function analyzeMovements(poseResults, sport, position) {
  // In a real implementation, this would analyze the sequence of poses
  // to identify movement patterns, form quality, etc.
  
  // Calculate movement over time
  const movements = [];
  let prevPose = null;
  
  for (const pose of poseResults) {
    if (prevPose) {
      const movement = {
        frame: pose.frame,
        timestamp: pose.timestamp,
        velocities: {},
        accelerations: {},
        angles: {}
      };
      
      // Calculate joint velocities
      for (const keypoint of pose.keypoints) {
        const prevKeypoint = prevPose.keypoints.find(k => k.name === keypoint.name);
        
        if (prevKeypoint) {
          // Calculate velocity (change in position)
          movement.velocities[keypoint.name] = {
            x: keypoint.x - prevKeypoint.x,
            y: keypoint.y - prevKeypoint.y,
            magnitude: Math.sqrt(
              Math.pow(keypoint.x - prevKeypoint.x, 2) + 
              Math.pow(keypoint.y - prevKeypoint.y, 2)
            )
          };
        }
      }
      
      // Calculate joint angles
      movement.angles = calculateJointAngles(pose.keypoints);
      
      movements.push(movement);
    }
    
    prevPose = pose;
  }
  
  // Summarize movements based on sport type
  const summary = summarizeMovements(movements, sport, position);
  
  return {
    movements,
    summary
  };
}

/**
 * Calculate joint angles from keypoints
 */
function calculateJointAngles(keypoints) {
  const angles = {};
  const keypointMap = {};
  
  // Create lookup map
  keypoints.forEach(kp => {
    keypointMap[kp.name] = kp;
  });
  
  // Calculate elbow angles
  if (keypointMap.left_shoulder && keypointMap.left_elbow && keypointMap.left_wrist) {
    angles.left_elbow = calculateAngle(
      keypointMap.left_shoulder,
      keypointMap.left_elbow,
      keypointMap.left_wrist
    );
  }
  
  if (keypointMap.right_shoulder && keypointMap.right_elbow && keypointMap.right_wrist) {
    angles.right_elbow = calculateAngle(
      keypointMap.right_shoulder,
      keypointMap.right_elbow,
      keypointMap.right_wrist
    );
  }
  
  // Calculate knee angles
  if (keypointMap.left_hip && keypointMap.left_knee && keypointMap.left_ankle) {
    angles.left_knee = calculateAngle(
      keypointMap.left_hip,
      keypointMap.left_knee,
      keypointMap.left_ankle
    );
  }
  
  if (keypointMap.right_hip && keypointMap.right_knee && keypointMap.right_ankle) {
    angles.right_knee = calculateAngle(
      keypointMap.right_hip,
      keypointMap.right_knee,
      keypointMap.right_ankle
    );
  }
  
  // Calculate hip angles
  if (keypointMap.left_shoulder && keypointMap.left_hip && keypointMap.left_knee) {
    angles.left_hip = calculateAngle(
      keypointMap.left_shoulder,
      keypointMap.left_hip,
      keypointMap.left_knee
    );
  }
  
  if (keypointMap.right_shoulder && keypointMap.right_hip && keypointMap.right_knee) {
    angles.right_hip = calculateAngle(
      keypointMap.right_shoulder,
      keypointMap.right_hip,
      keypointMap.right_knee
    );
  }
  
  return angles;
}

/**
 * Calculate angle between three points
 */
function calculateAngle(p1, p2, p3) {
  // Calculate vectors
  const v1 = {
    x: p1.x - p2.x,
    y: p1.y - p2.y
  };
  
  const v2 = {
    x: p3.x - p2.x,
    y: p3.y - p2.y
  };
  
  // Calculate dot product
  const dotProduct = v1.x * v2.x + v1.y * v2.y;
  
  // Calculate magnitudes
  const v1Mag = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
  const v2Mag = Math.sqrt(v2.x * v2.x + v2.y * v2.y);
  
  // Calculate angle in radians
  const angle = Math.acos(dotProduct / (v1Mag * v2Mag));
  
  // Convert to degrees
  return angle * (180 / Math.PI);
}

/**
 * Summarize movements based on sport type
 */
function summarizeMovements(movements, sport, position) {
  // In a real implementation, this would extract sport-specific insights
  // from the movement data based on known optimal patterns
  
  // Calculate average velocities
  const avgVelocities = {};
  const jointVelocities = {};
  
  // Initialize joint velocity arrays
  for (const movement of movements) {
    for (const joint in movement.velocities) {
      if (!jointVelocities[joint]) {
        jointVelocities[joint] = [];
      }
      
      jointVelocities[joint].push(movement.velocities[joint].magnitude);
    }
  }
  
  // Calculate averages
  for (const joint in jointVelocities) {
    if (jointVelocities[joint].length > 0) {
      avgVelocities[joint] = calculateAverage(jointVelocities[joint]);
    }
  }
  
  // Calculate average angles
  const avgAngles = {};
  const jointAngles = {};
  
  // Initialize joint angle arrays
  for (const movement of movements) {
    for (const joint in movement.angles) {
      if (!jointAngles[joint]) {
        jointAngles[joint] = [];
      }
      
      jointAngles[joint].push(movement.angles[joint]);
    }
  }
  
  // Calculate averages
  for (const joint in jointAngles) {
    if (jointAngles[joint].length > 0) {
      avgAngles[joint] = calculateAverage(jointAngles[joint]);
    }
  }
  
  // Sport-specific summaries
  let sportSpecificMetrics = {};
  
  switch (sport.toLowerCase()) {
    case 'basketball':
      sportSpecificMetrics = analyzeBasketballMovements(movements, position, avgVelocities, avgAngles);
      break;
    case 'football':
      sportSpecificMetrics = analyzeFootballMovements(movements, position, avgVelocities, avgAngles);
      break;
    case 'soccer':
      sportSpecificMetrics = analyzeSoccerMovements(movements, position, avgVelocities, avgAngles);
      break;
    default:
      // Generic analysis for other sports
      sportSpecificMetrics = {
        overallSpeed: calculateOverallSpeed(avgVelocities),
        movementConsistency: calculateMovementConsistency(movements),
        formQuality: calculateFormQuality(avgAngles, sport)
      };
  }
  
  return {
    avgVelocities,
    avgAngles,
    ...sportSpecificMetrics
  };
}

/**
 * Calculate average of an array of numbers
 */
function calculateAverage(arr) {
  if (arr.length === 0) return 0;
  return arr.reduce((sum, val) => sum + val, 0) / arr.length;
}

/**
 * Analyze basketball-specific movements
 */
function analyzeBasketballMovements(movements, position, avgVelocities, avgAngles) {
  // Example analysis for basketball
  const armSpeed = (avgVelocities.left_wrist?.magnitude || 0) + (avgVelocities.right_wrist?.magnitude || 0) / 2;
  const legPower = calculateAverage([avgVelocities.left_knee?.magnitude || 0, avgVelocities.right_knee?.magnitude || 0]);
  
  // Jumping analysis
  const jumpData = detectJumps(movements);
  
  // Shooting form analysis (simplified)
  const shootingFormQuality = analyzeShootingForm(movements, avgAngles);
  
  // Lateral movement analysis
  const lateralMovement = analyzeLateralMovement(movements);
  
  return {
    armSpeed,
    legPower,
    jumpHeight: jumpData.maxHeight,
    jumpCount: jumpData.count,
    shootingFormQuality,
    lateralMovement,
    overallSpeed: calculateOverallSpeed(avgVelocities),
    movementConsistency: calculateMovementConsistency(movements)
  };
}

/**
 * Analyze football-specific movements
 */
function analyzeFootballMovements(movements, position, avgVelocities, avgAngles) {
  // Example analysis for football
  // This would be different based on position (QB vs lineman vs receiver)
  
  const armStrength = position.toLowerCase().includes('quarterback') ? 
    calculateArmStrength(movements) : 0;
  
  const sprintSpeed = calculateSprintSpeed(movements);
  const changeOfDirection = calculateChangeOfDirection(movements);
  const tacklingForm = position.toLowerCase().includes('defense') ? 
    calculateTacklingForm(movements) : 0;
  
  return {
    armStrength,
    sprintSpeed,
    changeOfDirection,
    tacklingForm,
    overallSpeed: calculateOverallSpeed(avgVelocities),
    movementConsistency: calculateMovementConsistency(movements)
  };
}

/**
 * Analyze soccer-specific movements
 */
function analyzeSoccerMovements(movements, position, avgVelocities, avgAngles) {
  // Example analysis for soccer
  const kickingPower = calculateKickingPower(movements);
  const ballControl = calculateBallControl(movements);
  const sprintSpeed = calculateSprintSpeed(movements);
  const stamina = calculateStamina(movements);
  
  return {
    kickingPower,
    ballControl,
    sprintSpeed,
    stamina,
    overallSpeed: calculateOverallSpeed(avgVelocities),
    movementConsistency: calculateMovementConsistency(movements)
  };
}

// Simulated implementations of sport-specific analysis functions
// In a real system, these would contain complex algorithms
function calculateOverallSpeed(velocities) {
  return Math.random() * 10;
}

function calculateMovementConsistency(movements) {
  return Math.random() * 10;
}

function calculateFormQuality(angles, sport) {
  return Math.random() * 10;
}

function detectJumps(movements) {
  return {
    count: Math.floor(Math.random() * 5) + 1,
    maxHeight: Math.random() * 30 + 10 // 10-40 inches
  };
}

function analyzeShootingForm(movements, angles) {
  return Math.random() * 10;
}

function analyzeLateralMovement(movements) {
  return Math.random() * 10;
}

function calculateArmStrength(movements) {
  return Math.random() * 10;
}

function calculateSprintSpeed(movements) {
  return Math.random() * 10;
}

function calculateChangeOfDirection(movements) {
  return Math.random() * 10;
}

function calculateTacklingForm(movements) {
  return Math.random() * 10;
}

function calculateKickingPower(movements) {
  return Math.random() * 10;
}

function calculateBallControl(movements) {
  return Math.random() * 10;
}

function calculateStamina(movements) {
  return Math.random() * 10;
}

/**
 * Calculate performance metrics from movement analysis
 */
function calculatePerformanceMetrics(movementAnalysis, sport, position) {
  // Base metrics for all sports
  const baseMetrics = {
    athleticism: Math.random() * 10,
    technique: Math.random() * 10,
    gameIQ: Math.random() * 10,
    consistency: movementAnalysis.summary.movementConsistency,
    speed: movementAnalysis.summary.overallSpeed
  };
  
  // Add sport-specific metrics
  let sportMetrics = {};
  
  switch (sport.toLowerCase()) {
    case 'basketball':
      sportMetrics = {
        shooting: movementAnalysis.summary.shootingFormQuality,
        verticalJump: movementAnalysis.summary.jumpHeight / 4, // Convert to 0-10 scale
        lateralQuickness: movementAnalysis.summary.lateralMovement,
        ballHandling: Math.random() * 10,
        courtVision: Math.random() * 10
      };
      break;
    case 'football':
      sportMetrics = {
        strength: Math.random() * 10,
        acceleration: Math.random() * 10,
        agility: movementAnalysis.summary.changeOfDirection,
        handSpeed: Math.random() * 10,
        fieldVision: Math.random() * 10
      };
      
      // Add position-specific metrics
      if (position?.toLowerCase().includes('quarterback')) {
        sportMetrics.throwingAccuracy = Math.random() * 10;
        sportMetrics.armStrength = movementAnalysis.summary.armStrength;
      } else if (position?.toLowerCase().includes('receiver')) {
        sportMetrics.routeRunning = Math.random() * 10;
        sportMetrics.handEyeCoordination = Math.random() * 10;
      } else if (position?.toLowerCase().includes('lineman')) {
        sportMetrics.leverageControl = Math.random() * 10;
        sportMetrics.handPlacement = Math.random() * 10;
      }
      break;
    case 'soccer':
      sportMetrics = {
        ballControl: movementAnalysis.summary.ballControl,
        passing: Math.random() * 10,
        shooting: movementAnalysis.summary.kickingPower,
        vision: Math.random() * 10,
        stamina: movementAnalysis.summary.stamina
      };
      break;
    default:
      // Generic sport metrics
      sportMetrics = {
        agility: Math.random() * 10,
        coordination: Math.random() * 10,
        power: Math.random() * 10,
        flexibility: Math.random() * 10
      };
  }
  
  return {
    ...baseMetrics,
    ...sportMetrics
  };
}

/**
 * Calculate final GAR score from metrics
 */
function calculateGarScore(metrics, sport, position) {
  // Remove any non-numeric metrics
  const numericMetrics = {};
  for (const key in metrics) {
    if (typeof metrics[key] === 'number') {
      numericMetrics[key] = metrics[key];
    }
  }
  
  // Calculate average
  const values = Object.values(numericMetrics);
  const average = values.reduce((sum, val) => sum + val, 0) / values.length;
  
  // Round to two decimal places
  return Math.round(average * 100) / 100;
}

/**
 * Generate insights based on metrics and scores
 */
function generateInsights(metrics, garScore, sport, position) {
  const insights = [];
  
  // Find strengths (top 2 metrics)
  const sortedStrengths = Object.entries(metrics)
    .filter(([key, value]) => typeof value === 'number') // Filter to numeric metrics
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2);
  
  sortedStrengths.forEach(([key, value]) => {
    insights.push({
      type: 'strength',
      area: key,
      description: `Your ${formatMetricName(key)} is exceptional at ${value.toFixed(1)}/10. Continue to build on this strength.`
    });
  });
  
  // Find areas for improvement (bottom 2 metrics)
  const sortedWeaknesses = Object.entries(metrics)
    .filter(([key, value]) => typeof value === 'number') // Filter to numeric metrics
    .sort((a, b) => a[1] - b[1])
    .slice(0, 2);
  
  sortedWeaknesses.forEach(([key, value]) => {
    insights.push({
      type: 'improvement',
      area: key,
      description: `Your ${formatMetricName(key)} could use improvement at ${value.toFixed(1)}/10. Focus on specific drills to enhance this area.`
    });
  });
  
  // Add sport-specific insights
  switch (sport.toLowerCase()) {
    case 'basketball':
      if (metrics.shooting < 7) {
        insights.push({
          type: 'drill',
          area: 'shooting',
          description: 'Work on your shooting form with 500 shots per day, focusing on consistent release point.'
        });
      }
      
      if (metrics.lateralQuickness < 6) {
        insights.push({
          type: 'drill',
          area: 'agility',
          description: 'Incorporate defensive slide drills to improve lateral movement and defensive positioning.'
        });
      }
      break;
      
    case 'football':
      if (position?.toLowerCase().includes('quarterback') && metrics.throwingAccuracy < 7) {
        insights.push({
          type: 'drill',
          area: 'accuracy',
          description: 'Practice targeted throwing drills with gradually increasing distances and smaller targets.'
        });
      }
      
      if (metrics.agility < 6) {
        insights.push({
          type: 'drill',
          area: 'agility',
          description: 'Add cone drills to your training regimen to improve change of direction abilities.'
        });
      }
      break;
      
    case 'soccer':
      if (metrics.ballControl < 7) {
        insights.push({
          type: 'drill',
          area: 'ballControl',
          description: 'Practice daily ball manipulation drills to improve first touch and close control.'
        });
      }
      
      if (metrics.stamina < 6) {
        insights.push({
          type: 'drill',
          area: 'stamina',
          description: 'Incorporate interval training twice weekly to improve endurance for full match performance.'
        });
      }
      break;
  }
  
  // Add overall assessment
  if (garScore >= 8) {
    insights.push({
      type: 'assessment',
      area: 'overall',
      description: `Your overall GAR score of ${garScore} is excellent. You're performing at an elite level for your age group.`
    });
  } else if (garScore >= 6) {
    insights.push({
      type: 'assessment',
      area: 'overall',
      description: `Your overall GAR score of ${garScore} is good. You're showing solid potential with room for improvement in specific areas.`
    });
  } else {
    insights.push({
      type: 'assessment',
      area: 'overall',
      description: `Your overall GAR score of ${garScore} shows room for growth. Focus on the fundamentals and building a strong athletic foundation.`
    });
  }
  
  return insights;
}

/**
 * Format metric names for human-readable output
 */
function formatMetricName(key) {
  // Convert camelCase to space-separated words
  const words = key.replace(/([A-Z])/g, ' $1').toLowerCase();
  
  // Capitalize first letter
  return words.charAt(0).toUpperCase() + words.slice(1);
}

// Start processing
processGarAnalysis().catch(handleError);