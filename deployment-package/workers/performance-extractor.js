/**
 * Go4It Engine - Performance Extractor Worker
 * 
 * This worker extracts detailed performance metrics from video analysis
 * and consolidates them into a comprehensive athlete performance profile.
 */

const { reportProgress, completeJob, handleError, jobId, jobType, jobData } = require('./base-worker');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

// Process performance extraction job
async function extractPerformance() {
  try {
    const { 
      athleteId, 
      videoId, 
      garAnalysis, 
      historicalData = [],
      sport,
      position,
      options = {} 
    } = jobData;
    
    // Validate inputs
    if (!athleteId) {
      throw new Error('Athlete ID is required for performance extraction');
    }
    
    if (!garAnalysis) {
      throw new Error('GAR analysis data is required for performance extraction');
    }
    
    // Report start
    reportProgress(5, { status: 'Initializing performance extraction' });
    
    // Extract metrics from GAR analysis
    reportProgress(20, { status: 'Extracting performance metrics' });
    const currentMetrics = extractMetricsFromGarAnalysis(garAnalysis);
    
    // Compare with historical data
    reportProgress(40, { status: 'Analyzing historical trends' });
    const trends = analyzeHistoricalTrends(currentMetrics, historicalData);
    
    // Generate sport-specific insights
    reportProgress(60, { status: 'Generating sport-specific insights' });
    const insights = generateSportSpecificInsights(currentMetrics, trends, sport, position);
    
    // Create development recommendations
    reportProgress(80, { status: 'Creating development recommendations' });
    const recommendations = createDevelopmentRecommendations(currentMetrics, trends, insights, sport, position);
    
    // Compile complete performance profile
    const performanceProfile = {
      athleteId,
      videoId,
      sport,
      position,
      timestamp: new Date().toISOString(),
      currentMetrics,
      trends,
      insights,
      recommendations,
      garScore: garAnalysis.garScore || 0
    };
    
    // Complete the job
    reportProgress(100, { status: 'Performance extraction complete' });
    completeJob(performanceProfile);
    
  } catch (error) {
    handleError(error);
  }
}

/**
 * Extract core metrics from GAR analysis
 */
function extractMetricsFromGarAnalysis(garAnalysis) {
  const { metrics = {}, sport } = garAnalysis;
  
  // Extract core metrics that are relevant for all sports
  const coreMetrics = {
    athleticism: metrics.athleticism || 0,
    technique: metrics.technique || 0,
    gameIQ: metrics.gameIQ || 0,
    consistency: metrics.consistency || 0,
    speed: metrics.speed || 0
  };
  
  // Add sport-specific metrics
  let sportMetrics = {};
  
  switch (sport?.toLowerCase()) {
    case 'basketball':
      sportMetrics = {
        shooting: metrics.shooting || 0,
        ballHandling: metrics.ballHandling || 0,
        passing: metrics.passing || 0,
        defense: metrics.defense || 0,
        rebounding: metrics.rebounding || 0,
        verticalJump: metrics.verticalJump || 0,
        lateralQuickness: metrics.lateralQuickness || 0
      };
      break;
      
    case 'football':
      sportMetrics = {
        strength: metrics.strength || 0,
        agility: metrics.agility || 0,
        acceleration: metrics.acceleration || 0,
        fieldVision: metrics.fieldVision || 0,
        tackling: metrics.tackling || 0
      };
      
      // Add position-specific metrics
      if (garAnalysis.position?.toLowerCase().includes('quarterback')) {
        sportMetrics.throwingAccuracy = metrics.throwingAccuracy || 0;
        sportMetrics.armStrength = metrics.armStrength || 0;
      } else if (garAnalysis.position?.toLowerCase().includes('receiver')) {
        sportMetrics.routeRunning = metrics.routeRunning || 0;
        sportMetrics.handEyeCoordination = metrics.handEyeCoordination || 0;
      }
      break;
      
    case 'soccer':
      sportMetrics = {
        ballControl: metrics.ballControl || 0,
        passing: metrics.passing || 0,
        shooting: metrics.shooting || 0,
        vision: metrics.vision || 0,
        stamina: metrics.stamina || 0,
        tackling: metrics.tackling || 0,
        positioning: metrics.positioning || 0
      };
      break;
  }
  
  return {
    ...coreMetrics,
    ...sportMetrics
  };
}

/**
 * Analyze historical trends by comparing current metrics with past performance
 */
function analyzeHistoricalTrends(currentMetrics, historicalData) {
  // If no historical data, just return current as baseline
  if (!historicalData || historicalData.length === 0) {
    const baseline = {};
    for (const key in currentMetrics) {
      baseline[key] = {
        current: currentMetrics[key],
        trending: 'baseline',
        percentChange: 0,
        isImproving: false
      };
    }
    return baseline;
  }
  
  // Get the most recent previous metrics
  // Historical data should be ordered with most recent first
  const previousMetrics = historicalData[0].metrics || {};
  
  // Calculate trends for each metric
  const trends = {};
  
  for (const key in currentMetrics) {
    const current = currentMetrics[key];
    const previous = previousMetrics[key] || 0;
    
    // Calculate percent change
    let percentChange = 0;
    if (previous > 0) {
      percentChange = ((current - previous) / previous) * 100;
    }
    
    // Determine trend direction
    let trending = 'stable';
    let isImproving = false;
    
    if (percentChange > 5) {
      trending = 'improving';
      isImproving = true;
    } else if (percentChange < -5) {
      trending = 'declining';
    }
    
    trends[key] = {
      current,
      previous,
      trending,
      percentChange,
      isImproving
    };
  }
  
  // Calculate long-term trends if we have enough data
  if (historicalData.length >= 3) {
    for (const key in trends) {
      const values = historicalData
        .slice(0, Math.min(5, historicalData.length)) // Take up to 5 most recent entries
        .map(data => data.metrics?.[key] || 0);
      
      // Add current value to beginning of array
      values.unshift(currentMetrics[key]);
      
      // Calculate slope of trend line
      const slope = calculateTrendSlope(values);
      
      trends[key].longTermTrend = {
        slope,
        direction: slope > 0.1 ? 'up' : slope < -0.1 ? 'down' : 'stable'
      };
    }
  }
  
  return trends;
}

/**
 * Calculate slope of trend line using linear regression
 */
function calculateTrendSlope(values) {
  // Simple implementation of linear regression to find slope
  const n = values.length;
  
  // Handle edge cases
  if (n <= 1) return 0;
  
  // X values are just indices (0, 1, 2, ...)
  const xValues = Array.from({ length: n }, (_, i) => i);
  
  // Calculate means
  const xMean = xValues.reduce((sum, val) => sum + val, 0) / n;
  const yMean = values.reduce((sum, val) => sum + val, 0) / n;
  
  // Calculate slope
  let numerator = 0;
  let denominator = 0;
  
  for (let i = 0; i < n; i++) {
    const xDiff = xValues[i] - xMean;
    const yDiff = values[i] - yMean;
    
    numerator += xDiff * yDiff;
    denominator += xDiff * xDiff;
  }
  
  // Avoid division by zero
  if (denominator === 0) return 0;
  
  return numerator / denominator;
}

/**
 * Generate sport-specific insights based on metrics and trends
 */
function generateSportSpecificInsights(metrics, trends, sport, position) {
  const insights = [];
  
  // Check for significant improvements
  const improvements = [];
  const declines = [];
  
  for (const key in trends) {
    if (trends[key].trending === 'improving' && trends[key].percentChange > 10) {
      improvements.push({
        metric: key,
        percentChange: trends[key].percentChange
      });
    } else if (trends[key].trending === 'declining' && trends[key].percentChange < -10) {
      declines.push({
        metric: key,
        percentChange: Math.abs(trends[key].percentChange)
      });
    }
  }
  
  // Sort improvements and declines by magnitude
  improvements.sort((a, b) => b.percentChange - a.percentChange);
  declines.sort((a, b) => b.percentChange - a.percentChange);
  
  // Add insights about improvements
  if (improvements.length > 0) {
    improvements.slice(0, 2).forEach(improvement => {
      insights.push({
        type: 'improvement',
        metric: improvement.metric,
        description: `Strong improvement in ${formatMetricName(improvement.metric)} with a ${improvement.percentChange.toFixed(1)}% increase.`
      });
    });
  }
  
  // Add insights about declines
  if (declines.length > 0) {
    declines.slice(0, 2).forEach(decline => {
      insights.push({
        type: 'decline',
        metric: decline.metric,
        description: `Notable decline in ${formatMetricName(decline.metric)} with a ${decline.percentChange.toFixed(1)}% decrease.`
      });
    });
  }
  
  // Add insights based on the sport
  switch (sport?.toLowerCase()) {
    case 'basketball':
      // Basketball-specific insights
      if (metrics.shooting > 8) {
        insights.push({
          type: 'strength',
          metric: 'shooting',
          description: 'Excellent shooting technique places you in the top tier for your age group.'
        });
      }
      
      if (metrics.ballHandling < 6) {
        insights.push({
          type: 'opportunity',
          metric: 'ballHandling',
          description: 'Improving ball handling would significantly raise your overall effectiveness.'
        });
      }
      
      if (metrics.verticalJump > 7.5 && metrics.lateralQuickness > 7) {
        insights.push({
          type: 'advantage',
          metric: 'athleticism',
          description: 'Your combination of vertical leap and lateral quickness gives you a strong defensive advantage.'
        });
      }
      break;
      
    case 'football':
      // Football-specific insights based on position
      if (position?.toLowerCase().includes('quarterback')) {
        if (metrics.throwingAccuracy > 8) {
          insights.push({
            type: 'strength',
            metric: 'throwingAccuracy',
            description: 'Your accuracy places you among the top prospects at your position.'
          });
        }
        
        if (metrics.fieldVision < 6.5) {
          insights.push({
            type: 'opportunity',
            metric: 'fieldVision',
            description: 'Working on field vision and progressions would significantly improve your QB rating.'
          });
        }
      } else if (position?.toLowerCase().includes('receiver')) {
        if (metrics.speed > 8.5) {
          insights.push({
            type: 'strength',
            metric: 'speed',
            description: 'Your top-end speed makes you a deep threat that defenses must respect.'
          });
        }
        
        if (metrics.routeRunning < 6) {
          insights.push({
            type: 'opportunity',
            metric: 'routeRunning',
            description: 'Focusing on route precision would create more separation opportunities.'
          });
        }
      } else {
        if (metrics.strength > 8) {
          insights.push({
            type: 'strength',
            metric: 'strength',
            description: 'Your physical strength is a standout attribute at your position.'
          });
        }
        
        if (metrics.agility < 6) {
          insights.push({
            type: 'opportunity',
            metric: 'agility',
            description: 'Improving your change of direction ability would enhance your overall effectiveness.'
          });
        }
      }
      break;
      
    case 'soccer':
      // Soccer-specific insights
      if (metrics.ballControl > 8) {
        insights.push({
          type: 'strength',
          metric: 'ballControl',
          description: 'Your touch and ball control are exceptional, allowing you to maintain possession under pressure.'
        });
      }
      
      if (metrics.passing > 7.5 && metrics.vision > 7.5) {
        insights.push({
          type: 'strength',
          metric: 'playmaking',
          description: 'Your combination of passing ability and field vision makes you an excellent playmaker.'
        });
      }
      
      if (metrics.stamina < 6) {
        insights.push({
          type: 'opportunity',
          metric: 'stamina',
          description: 'Improving your endurance would help maintain performance throughout the full match.'
        });
      }
      break;
  }
  
  return insights;
}

/**
 * Create specific development recommendations based on metrics and insights
 */
function createDevelopmentRecommendations(metrics, trends, insights, sport, position) {
  const recommendations = [];
  
  // Find areas most in need of improvement
  const improvementAreas = [];
  
  for (const key in metrics) {
    // Consider both the current value and the trend
    const trend = trends[key] || {};
    const value = metrics[key];
    
    // Calculate an "improvement priority" score
    // Lower values and declining trends get higher priority
    const priority = (10 - value) + (trend.trending === 'declining' ? 2 : 0);
    
    improvementAreas.push({
      metric: key,
      value,
      priority
    });
  }
  
  // Sort by priority (higher number = higher priority)
  improvementAreas.sort((a, b) => b.priority - a.priority);
  
  // Take top 3 areas for focused development
  const focusAreas = improvementAreas.slice(0, 3);
  
  // Generate recommendations based on sport and position
  switch (sport?.toLowerCase()) {
    case 'basketball':
      // Basketball recommendations
      focusAreas.forEach(area => {
        switch (area.metric) {
          case 'shooting':
            recommendations.push({
              metric: 'shooting',
              title: 'Shooting Development Program',
              description: 'Focus on form shooting drills and gradually increase distance. Aim for 250-500 shots daily.',
              drills: [
                '3-point form shooting (25 shots from 5 spots)',
                'Free throw routine (100 shots with consistent routine)',
                'Catch and shoot drills with proper footwork'
              ],
              duration: '6 weeks',
              frequency: '5 days per week',
              priority: 'high'
            });
            break;
            
          case 'ballHandling':
            recommendations.push({
              metric: 'ballHandling',
              title: 'Ball Handling Improvement',
              description: 'Develop advanced dribbling skills and ball control through daily drills.',
              drills: [
                'Two-ball dribbling series (3 minutes each hand)',
                'Cone dribbling course with change of direction',
                'Hesitation and crossover combination drills'
              ],
              duration: '4 weeks',
              frequency: 'Daily',
              priority: 'high'
            });
            break;
            
          case 'lateralQuickness':
            recommendations.push({
              metric: 'lateralQuickness',
              title: 'Defensive Movement Program',
              description: 'Enhance lateral quickness and defensive positioning.',
              drills: [
                'Defensive slide ladder (30 seconds x 5 sets)',
                'Close-out and recover drills',
                'Mirror defensive movement with partner'
              ],
              duration: '6 weeks',
              frequency: '3 days per week',
              priority: 'medium'
            });
            break;
            
          default:
            recommendations.push({
              metric: area.metric,
              title: `${formatMetricName(area.metric)} Development`,
              description: `Focused training to improve your ${formatMetricName(area.metric)} rating.`,
              drills: [
                `${formatMetricName(area.metric)} drill series A`,
                `${formatMetricName(area.metric)} drill series B`,
                'Sport-specific application drills'
              ],
              duration: '4 weeks',
              frequency: '3 days per week',
              priority: 'medium'
            });
        }
      });
      break;
      
    case 'football':
      // Football recommendations based on position
      if (position?.toLowerCase().includes('quarterback')) {
        focusAreas.forEach(area => {
          switch (area.metric) {
            case 'throwingAccuracy':
              recommendations.push({
                metric: 'throwingAccuracy',
                title: 'Precision Passing Program',
                description: 'Develop consistent throwing mechanics and accuracy at various distances.',
                drills: [
                  'Target practice (10 throws to each corner at 10, 20, and 30 yards)',
                  'Move in pocket and throw to stationary targets',
                  'Progressive read drill with multiple receivers'
                ],
                duration: '8 weeks',
                frequency: '4 days per week',
                priority: 'high'
              });
              break;
              
            case 'fieldVision':
              recommendations.push({
                metric: 'fieldVision',
                title: 'Field Vision Enhancement',
                description: 'Improve ability to read defenses and make quick decisions.',
                drills: [
                  'Film study with defensive recognition exercises',
                  'Full-field progression reads with timer',
                  'Live scrimmage with defensive disguises'
                ],
                duration: '6 weeks',
                frequency: '3 days per week plus game film',
                priority: 'high'
              });
              break;
              
            default:
              recommendations.push({
                metric: area.metric,
                title: `${formatMetricName(area.metric)} Development`,
                description: `Targeted training to enhance your ${formatMetricName(area.metric)} as a quarterback.`,
                drills: [
                  `Position-specific ${formatMetricName(area.metric)} drill A`,
                  `Position-specific ${formatMetricName(area.metric)} drill B`,
                  'Game situation application'
                ],
                duration: '4 weeks',
                frequency: '3 days per week',
                priority: 'medium'
              });
          }
        });
      } else {
        // Generic football recommendations for other positions
        focusAreas.forEach(area => {
          switch (area.metric) {
            case 'strength':
              recommendations.push({
                metric: 'strength',
                title: 'Football-Specific Strength Program',
                description: 'Develop functional strength for your position.',
                drills: [
                  'Compound lifts (squat, bench, deadlift) 4x6-8',
                  'Position-specific resistance training',
                  'Explosive power development (box jumps, medicine ball throws)'
                ],
                duration: '8 weeks',
                frequency: '4 days per week',
                priority: 'high'
              });
              break;
              
            case 'agility':
              recommendations.push({
                metric: 'agility',
                title: 'Change of Direction Program',
                description: 'Improve cutting ability and reactive agility.',
                drills: [
                  '5-10-5 shuttle drill variations',
                  'Cone agility course with ball skills',
                  'Reactive agility drills with visual cues'
                ],
                duration: '6 weeks',
                frequency: '3 days per week',
                priority: 'high'
              });
              break;
              
            default:
              recommendations.push({
                metric: area.metric,
                title: `${formatMetricName(area.metric)} Development`,
                description: `Focused training to improve your ${formatMetricName(area.metric)} for football.`,
                drills: [
                  `${formatMetricName(area.metric)} drill series A`,
                  `${formatMetricName(area.metric)} drill series B`,
                  'Position-specific application'
                ],
                duration: '4 weeks',
                frequency: '3 days per week',
                priority: 'medium'
              });
          }
        });
      }
      break;
      
    case 'soccer':
      // Soccer recommendations
      focusAreas.forEach(area => {
        switch (area.metric) {
          case 'ballControl':
            recommendations.push({
              metric: 'ballControl',
              title: 'Technical Ball Control Program',
              description: 'Develop first touch and close control under pressure.',
              drills: [
                'First touch directional control (100 repetitions)',
                'Confined space dribbling course',
                'One-touch passing in traffic'
              ],
              duration: '6 weeks',
              frequency: 'Daily',
              priority: 'high'
            });
            break;
            
          case 'stamina':
            recommendations.push({
              metric: 'stamina',
              title: 'Soccer-Specific Endurance Program',
              description: 'Build match fitness and sustained performance.',
              drills: [
                'Interval training (30s sprint/30s jog x 15)',
                'Small-sided games with continuous play',
                'Progressive distance runs with technical elements'
              ],
              duration: '8 weeks',
              frequency: '3 days per week',
              priority: 'high'
            });
            break;
            
          case 'shooting':
            recommendations.push({
              metric: 'shooting',
              title: 'Finishing Development Program',
              description: 'Enhance shooting technique and goal scoring ability.',
              drills: [
                'Finishing from various angles (20 shots per position)',
                'First-time finishing from crosses',
                'Shooting under pressure with defenders'
              ],
              duration: '6 weeks',
              frequency: '4 days per week',
              priority: 'medium'
            });
            break;
            
          default:
            recommendations.push({
              metric: area.metric,
              title: `${formatMetricName(area.metric)} Development`,
              description: `Focused training to improve your ${formatMetricName(area.metric)} for soccer.`,
              drills: [
                `${formatMetricName(area.metric)} drill series A`,
                `${formatMetricName(area.metric)} drill series B`,
                'Game situation application'
              ],
              duration: '4 weeks',
              frequency: '3 days per week',
              priority: 'medium'
            });
        }
      });
      break;
      
    default:
      // Generic recommendations for other sports
      focusAreas.forEach(area => {
        recommendations.push({
          metric: area.metric,
          title: `${formatMetricName(area.metric)} Development`,
          description: `Targeted training to enhance your ${formatMetricName(area.metric)}.`,
          drills: [
            `Fundamental ${formatMetricName(area.metric)} drill series`,
            `Advanced ${formatMetricName(area.metric)} training`,
            'Sport-specific application'
          ],
          duration: '6 weeks',
          frequency: '3 days per week',
          priority: area.priority > 5 ? 'high' : 'medium'
        });
      });
  }
  
  return recommendations;
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
extractPerformance().catch(handleError);