// OpenAI Service for Highlight Generation
// This module provides functions to analyze videos and generate highlights using OpenAI

const { OpenAI } = require('openai');
const fs = require('fs');
const path = require('path');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Function to extract frames from video at specific timestamps
// This is a placeholder - in a real implementation, ffmpeg would be used
async function extractFrameFromVideo(videoPath, timestamp) {
  // Placeholder implementation
  // In reality, you would use ffmpeg to extract frames at specific timestamps
  console.log(`Extracting frame at ${timestamp} seconds from ${videoPath}`);
  
  // For demo purposes, return a fixed path to a test image if available
  const testImagePath = path.join(process.cwd(), 'uploads', 'test-frame.jpg');
  if (fs.existsSync(testImagePath)) {
    return testImagePath;
  }
  
  return null;
}

// Convert image file to base64 for API submission
function imageToBase64(imagePath) {
  try {
    const imageBuffer = fs.readFileSync(imagePath);
    return imageBuffer.toString('base64');
  } catch (error) {
    console.error('Error converting image to base64:', error);
    return null;
  }
}

// Analyze a frame using OpenAI Vision
async function analyzeFrame(imagePath, prompt) {
  try {
    // Convert image to base64
    const base64Image = imageToBase64(imagePath);
    if (!base64Image) {
      throw new Error('Failed to convert image to base64');
    }
    
    // Call OpenAI API with the image
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        }
      ],
      max_tokens: 500
    });
    
    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error analyzing frame with OpenAI:', error);
    throw error;
  }
}

// Function to detect highlights in a video
async function detectHighlightsInVideo(videoPath, config) {
  try {
    // Extract key information from config
    const { 
      sportType, 
      highlightCriteria, 
      sampleInterval = 5,  // Sample every 5 seconds by default
      minimumConfidence = 0.7
    } = config;
    
    console.log(`Analyzing video for ${sportType} highlights with criteria: ${highlightCriteria}`);
    
    // For testing purposes, let's simulate analyzing frames at intervals
    // In a real implementation, we would:
    // 1. Calculate video duration
    // 2. Extract frames at regular intervals
    // 3. Analyze each frame for highlight-worthy content
    
    // Simulated video duration (30 seconds)
    const videoDuration = 30;
    const timestamps = [];
    
    // Generate timestamps at specified intervals
    for (let t = 0; t < videoDuration; t += sampleInterval) {
      timestamps.push(t);
    }
    
    // Storage for detected highlights
    const highlights = [];
    
    // Analyze frames at each timestamp
    for (const timestamp of timestamps) {
      // Extract frame at this timestamp
      const framePath = await extractFrameFromVideo(videoPath, timestamp);
      
      // If we couldn't extract a frame, skip this timestamp
      if (!framePath) {
        console.log(`Couldn't extract frame at timestamp ${timestamp}`);
        continue;
      }
      
      // Build prompt for analyzing this frame
      const prompt = `
        Analyze this frame from a ${sportType} video.
        Is this a highlight-worthy moment based on the following criteria: ${highlightCriteria}?
        
        Respond with JSON in this format:
        {
          "isHighlight": true/false,
          "confidence": 0.0-1.0,
          "description": "Brief description of what's happening",
          "reasons": ["reason1", "reason2"]
        }
      `;
      
      // Analyze the frame
      const analysisResult = await analyzeFrame(framePath, prompt);
      
      // Parse the result
      let analysis;
      try {
        analysis = JSON.parse(analysisResult);
      } catch (e) {
        console.error('Failed to parse OpenAI response as JSON:', e);
        console.log('Raw response:', analysisResult);
        // Create a default response
        analysis = {
          isHighlight: false,
          confidence: 0,
          description: "Error analyzing frame",
          reasons: ["Failed to parse AI response"]
        };
      }
      
      // If this is a highlight with sufficient confidence, add it
      if (analysis.isHighlight && analysis.confidence >= minimumConfidence) {
        highlights.push({
          timestamp,
          duration: 5, // Default highlight duration in seconds
          confidence: analysis.confidence,
          description: analysis.description,
          reasons: analysis.reasons
        });
      }
    }
    
    return highlights;
  } catch (error) {
    console.error('Error detecting highlights:', error);
    throw error;
  }
}

// Function to generate a caption for a highlight
async function generateHighlightCaption(highlightDescription, sportType) {
  try {
    const prompt = `
      Write a short, exciting caption for this ${sportType} highlight:
      ${highlightDescription}
      
      Make it engaging and suitable for social media. Keep it under 100 characters.
    `;
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { role: "user", content: prompt }
      ],
      max_tokens: 100
    });
    
    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error generating caption:', error);
    return highlightDescription; // Fallback to the original description
  }
}

// Function to generate a title for a collection of highlights
async function generateHighlightTitle(descriptions, athleteName, sportType) {
  try {
    const descriptionsText = descriptions.join('\n- ');
    
    const prompt = `
      Generate a catchy title for a ${sportType} highlight reel featuring athlete ${athleteName}.
      The highlight reel includes these moments:
      - ${descriptionsText}
      
      Create a title that is exciting and would perform well on social media.
      Keep it under 50 characters.
    `;
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { role: "user", content: prompt }
      ],
      max_tokens: 50
    });
    
    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error generating title:', error);
    return `${athleteName}'s ${sportType} Highlights`; // Fallback title
  }
}

module.exports = {
  detectHighlightsInVideo,
  generateHighlightCaption,
  generateHighlightTitle
};