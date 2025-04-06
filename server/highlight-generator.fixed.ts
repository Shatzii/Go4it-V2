/**
 * AI Highlight Generator for Go4It Sports
 * 
 * This service analyzes full game videos to automatically identify and extract highlight clips
 * based on configurable parameters. It leverages OpenAI Vision API for motion and action detection.
 * 
 * This is a fixed version that uses the database storage implementation.
 */

import OpenAI from "openai";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from 'uuid';
import { storage } from "./storage";
import { 
  HighlightGeneratorConfig, 
  InsertVideoHighlight, 
  Video 
} from "@shared/schema";
import { spawn } from 'child_process';
import { promisify } from 'util';
import cron from 'node-cron';

// Promisify fs functions
const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);

// Initialize OpenAI client
async function getOpenAIClient(): Promise<OpenAI> {
  try {
    // Create a client with environment variable
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("No OpenAI API key available");
    }
    
    return new OpenAI({ apiKey });
  } catch (error) {
    console.error("Error getting OpenAI client:", error);
    throw error;
  }
}

// This function would normally analyze video frames using ffmpeg to extract them
// and OpenAI Vision API to identify key moments. For this demo, we're simplifying
// with timestamps detection from a description of the video.
async function analyzeVideoForHighlights(
  video: Video, 
  config: HighlightGeneratorConfig
): Promise<{ 
  detectedHighlights: Array<{
    title: string;
    description: string;
    startTime: number;
    endTime: number;
    qualityScore: number;
    primarySkill: string;
    skillLevel: number;
    tags: string[];
    gameContext?: string;
    aiAnalysisNotes?: string;
  }>
}> {
  try {
    console.log(`Analyzing video ${video.id} (${video.title}) for highlights using config "${config.name}"`);
    
    // Check for API key
    const client = await getOpenAIClient();
    
    // In a real implementation, we would:
    // 1. Extract frames using ffmpeg at appropriate intervals
    // 2. Send frames to OpenAI Vision API for analysis
    // 3. Identify moments of interest based on config.highlightTypes
    // 4. Calculate precise start/end timestamps for each highlight
    
    // For our demo, we'll use GPT-4o to simulate analyzing the video
    // based on its title, description, and sport type
    
    const sportType = config.sportType || video.sportType || "basketball";
    const highlightTypes = config.highlightTypes || ["scoring", "skills", "teamwork"];
    
    // Extract duration from video metadata or use default
    // Since 'duration' is not directly in the Video type, we might need to parse it from metadata
    // or just use a reasonable default for the demo
    const durationInSeconds = 120; // Default duration in seconds
    
    // Construct a prompt that explains what we're looking for
    const analysisPrompt = `
You are an expert sports video analyst specializing in ${sportType}. You're analyzing a video with the following information:

Title: ${video.title}
Description: ${video.description || "Not provided"}
Duration: ${durationInSeconds || 120} seconds
Sport: ${sportType}

Based on this information, identify ${Math.min(config.maxHighlightsPerVideo || 3, 5)} potential highlight moments that would occur in this video.
Focus on detecting these types of highlights: ${highlightTypes.join(", ")}.

For each highlight, provide:
1. A short title (5-7 words)
2. A brief description (1-2 sentences)
3. The estimated start time in seconds (between 0 and ${durationInSeconds || 120})
4. The estimated end time in seconds (start time + ${config.minDuration || 8} to ${config.maxDuration || 30} seconds)
5. A quality score (0-100) based on how exceptional the moment likely is
6. The primary skill being showcased
7. A skill level rating (1-100)
8. Relevant tags (3-5 tags)
9. Game context (optional)
10. Brief analysis notes

Return your response as a valid JSON object with this exact structure:
{
  "detectedHighlights": [
    {
      "title": "string",
      "description": "string",
      "startTime": number,
      "endTime": number,
      "qualityScore": number,
      "primarySkill": "string",
      "skillLevel": number,
      "tags": ["string"],
      "gameContext": "string",
      "aiAnalysisNotes": "string"
    }
  ]
}

Ensure all highlights have appropriate durations between ${config.minDuration || 8} and ${config.maxDuration || 30} seconds, and don't overlap.
Make the highlights realistic and specific to ${sportType}.
`;

    // Call OpenAI API
    const response = await client.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system", 
          content: "You are a sports video analysis AI that can identify key highlight moments in sports footage."
        },
        { 
          role: "user", 
          content: analysisPrompt 
        }
      ],
      response_format: { type: "json_object" }
    });

    // Parse the response
    const analysisResult = JSON.parse(response.choices[0].message.content || '{}');
    
    // Apply quality threshold filter
    const qualityThreshold = config.qualityThreshold || 70;
    const filteredHighlights = analysisResult.detectedHighlights.filter(
      (h: any) => h.qualityScore >= qualityThreshold
    );
    
    console.log(`Identified ${filteredHighlights.length} highlights above quality threshold (${qualityThreshold})`);
    
    return {
      detectedHighlights: filteredHighlights
    };
  } catch (error: any) {
    console.error("Error analyzing video for highlights:", error);
    throw new Error(`Failed to analyze video for highlights: ${error?.message || 'Unknown error'}`);
  }
}

// This function would normally use ffmpeg to extract the actual clip
// For this demo, we'll simulate the extraction
async function extractHighlightClip(
  video: Video,
  startTime: number,
  endTime: number,
  title: string
): Promise<{ 
  highlightPath: string;
  thumbnailPath: string;
}> {
  try {
    console.log(`Extracting highlight clip from video ${video.id} (${startTime}s to ${endTime}s)`);
    
    // Ensure directories exist
    const highlightsDir = path.join(process.cwd(), 'uploads', 'highlights');
    const thumbnailsDir = path.join(process.cwd(), 'uploads', 'thumbnails');
    
    await mkdir(highlightsDir, { recursive: true });
    await mkdir(thumbnailsDir, { recursive: true });
    
    // Generate unique filenames
    const sanitizedTitle = title.toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 20);
    const uniqueId = uuidv4().substring(0, 8);
    const highlightFilename = `${sanitizedTitle}-${uniqueId}.mp4`;
    const thumbnailFilename = `${sanitizedTitle}-${uniqueId}.jpg`;
    
    const highlightPath = path.join(highlightsDir, highlightFilename);
    const thumbnailPath = path.join(thumbnailsDir, thumbnailFilename);
    
    // In a real implementation, we would use ffmpeg to:
    // 1. Extract the clip using: ffmpeg -i original.mp4 -ss startTime -to endTime -c copy highlight.mp4
    // 2. Generate a thumbnail using: ffmpeg -i highlight.mp4 -ss 1 -vframes 1 thumbnail.jpg
    
    // For our demo, we'll just log what we would do
    console.log(`Would extract: ffmpeg -i ${video.filePath} -ss ${startTime} -to ${endTime} -c copy ${highlightPath}`);
    console.log(`Would create thumbnail: ffmpeg -i ${highlightPath} -ss 1 -vframes 1 ${thumbnailPath}`);
    
    // In a demo/mock context, we could create placeholder files
    await writeFile(highlightPath, `This is a placeholder for highlight clip from ${video.title} (${startTime}s to ${endTime}s)`);
    
    // Create a basic text file as a placeholder for the thumbnail
    await writeFile(thumbnailPath, `This is a placeholder for highlight thumbnail from ${video.title}`);
    
    return {
      // Return paths relative to the uploads directory for storage in the database
      highlightPath: `/uploads/highlights/${highlightFilename}`,
      thumbnailPath: `/uploads/thumbnails/${thumbnailFilename}`
    };
  } catch (error: any) {
    console.error("Error extracting highlight clip:", error);
    throw new Error(`Failed to extract highlight clip: ${error?.message || 'Unknown error'}`);
  }
}

// Main function to generate highlights for a video
export async function generateHighlightsForVideo(
  videoId: number,
  configId: number,
  userId: number
): Promise<{
  success: boolean;
  highlightCount: number;
  message: string;
  highlightIds: number[];
}> {
  try {
    console.log(`Generating highlights for video ${videoId} using config ${configId}`);
    
    // Get the video data
    const video = await storage.getVideo(videoId);
    if (!video) {
      throw new Error(`Video with ID ${videoId} not found`);
    }
    
    // Get the generator configuration
    const config = await storage.getHighlightGeneratorConfig(configId);
    if (!config) {
      throw new Error(`Highlight generator config with ID ${configId} not found`);
    }
    
    // Check if video is of the correct sport type for this config
    if (config.sportType !== video.sportType && config.sportType !== 'any') {
      throw new Error(`Config is for ${config.sportType} but video is ${video.sportType || 'unspecified'}`);
    }
    
    // Analyze the video to identify potential highlights
    const analysis = await analyzeVideoForHighlights(video, config);
    
    // Handle case where no highlights were found
    if (!analysis.detectedHighlights || analysis.detectedHighlights.length === 0) {
      return {
        success: true,
        highlightCount: 0,
        message: "No highlights meeting the quality threshold were detected",
        highlightIds: []
      };
    }
    
    // Process each detected highlight
    const highlightIds: number[] = [];
    
    for (const highlight of analysis.detectedHighlights) {
      // Extract the actual clip
      const { highlightPath, thumbnailPath } = await extractHighlightClip(
        video,
        highlight.startTime,
        highlight.endTime,
        highlight.title
      );
      
      // Create the highlight record in the database
      const newHighlight: InsertVideoHighlight = {
        videoId,
        title: highlight.title,
        description: highlight.description,
        startTime: highlight.startTime,
        endTime: highlight.endTime,
        highlightPath,
        thumbnailPath,
        createdBy: userId,
        aiGenerated: true,
        tags: highlight.tags,
        qualityScore: highlight.qualityScore,
        primarySkill: highlight.primarySkill,
        skillLevel: highlight.skillLevel,
        gameContext: highlight.gameContext,
        aiAnalysisNotes: highlight.aiAnalysisNotes,
        // Only feature the top highlights
        featured: highlight.qualityScore >= 85,
        // Make high-quality highlights eligible for homepage
        homePageEligible: highlight.qualityScore >= 90
      };
      
      // Save to database
      const savedHighlight = await storage.createVideoHighlight(newHighlight);
      highlightIds.push(savedHighlight.id);
    }
    
    // Update the last run timestamp for the config
    await storage.updateHighlightGeneratorConfig(configId, {
      lastRun: new Date()
    });
    
    return {
      success: true,
      highlightCount: highlightIds.length,
      message: `Successfully generated ${highlightIds.length} highlights`,
      highlightIds
    };
  } catch (error: any) {
    console.error("Error generating highlights:", error);
    return {
      success: false,
      highlightCount: 0,
      message: `Failed to generate highlights: ${error?.message || 'Unknown error'}`,
      highlightIds: []
    };
  }
}

// Process all unanalyzed videos using active configurations
export async function processUnanalyzedVideos(adminUserId: number): Promise<{
  success: boolean;
  totalProcessed: number;
  totalHighlights: number;
  message: string;
}> {
  try {
    console.log("Processing unanalyzed videos for highlight generation");
    
    // Get all active configurations
    const activeConfigs = await storage.getActiveHighlightGeneratorConfigs();
    if (!activeConfigs || activeConfigs.length === 0) {
      return {
        success: true,
        totalProcessed: 0,
        totalHighlights: 0,
        message: "No active highlight generator configurations found"
      };
    }
    
    // Get all unanalyzed videos
    const unanalyzedVideos = await storage.getUnanalyzedVideosForHighlights();
    if (!unanalyzedVideos || unanalyzedVideos.length === 0) {
      return {
        success: true,
        totalProcessed: 0,
        totalHighlights: 0,
        message: "No unanalyzed videos found"
      };
    }
    
    console.log(`Found ${unanalyzedVideos.length} unanalyzed videos and ${activeConfigs.length} active configurations`);
    
    // Process each video with the most appropriate configuration
    let totalHighlights = 0;
    
    for (const video of unanalyzedVideos) {
      // Find the best configuration for this video
      const bestConfig = activeConfigs.find((c: HighlightGeneratorConfig) => c.sportType === video.sportType) || 
                       activeConfigs.find((c: HighlightGeneratorConfig) => c.sportType === 'any');
      
      if (!bestConfig) {
        console.log(`No suitable configuration found for video ${video.id} (${video.sportType || 'unspecified sport'})`);
        continue;
      }
      
      // Generate highlights
      const result = await generateHighlightsForVideo(video.id, bestConfig.id, adminUserId);
      
      if (result.success) {
        totalHighlights += result.highlightCount;
        
        // Mark the video as analyzed for highlights
        await storage.updateVideo(video.id, { analyzed: true });
      } else {
        console.error(`Failed to generate highlights for video ${video.id}: ${result.message}`);
      }
    }
    
    return {
      success: true,
      totalProcessed: unanalyzedVideos.length,
      totalHighlights,
      message: `Successfully processed ${unanalyzedVideos.length} videos and generated ${totalHighlights} highlights`
    };
  } catch (error: any) {
    console.error("Error processing unanalyzed videos:", error);
    return {
      success: false,
      totalProcessed: 0,
      totalHighlights: 0,
      message: `Failed to process unanalyzed videos: ${error?.message || 'Unknown error'}`
    };
  }
}

// Schedule daily highlight generation
export function scheduleHighlightGeneration(adminUserId: number) {
  console.log("Scheduling daily highlight generation at 3:00 AM");
  
  // Run every day at 3:00 AM
  cron.schedule('0 3 * * *', async () => {
    console.log("Running scheduled highlight generation...");
    try {
      await processUnanalyzedVideos(adminUserId);
    } catch (error) {
      console.error("Error in scheduled highlight generation:", error);
    }
  });
}

// Create default configurations for common sports
async function createDefaultConfigurations(adminUserId: number) {
  try {
    console.log("Creating default highlight generator configurations");
    
    // Basketball configuration
    await storage.createHighlightGeneratorConfig({
      name: "Basketball Highlight Generator",
      description: "Identifies key moments in basketball games including scoring plays, defensive stops, and skillful moves",
      sportType: "basketball",
      createdBy: adminUserId,
      active: true,
      highlightTypes: ["scoring", "defense", "skills", "teamwork"],
      minDuration: 5,
      maxDuration: 15,
      qualityThreshold: 70,
      maxHighlightsPerVideo: 5,
    });
    
    // Football configuration
    await storage.createHighlightGeneratorConfig({
      name: "Football Highlight Generator",
      description: "Identifies key moments in football games including touchdowns, big plays, and defensive stops",
      sportType: "football",
      createdBy: adminUserId,
      active: true,
      highlightTypes: ["scoring", "big plays", "defense", "special teams"],
      minDuration: 8,
      maxDuration: 20,
      qualityThreshold: 75,
      maxHighlightsPerVideo: 5,
    });
    
    // Soccer configuration
    await storage.createHighlightGeneratorConfig({
      name: "Soccer Highlight Generator",
      description: "Identifies key moments in soccer matches including goals, saves, and skillful play",
      sportType: "soccer",
      createdBy: adminUserId,
      active: true,
      highlightTypes: ["goals", "saves", "skills", "passes", "defense"],
      minDuration: 6,
      maxDuration: 15,
      qualityThreshold: 70,
      maxHighlightsPerVideo: 6,
    });
    
    // Generic configuration for other sports
    await storage.createHighlightGeneratorConfig({
      name: "Generic Sports Highlight Generator",
      description: "General-purpose configuration for identifying exciting moments in any sport",
      sportType: "any",
      createdBy: adminUserId,
      active: true,
      highlightTypes: ["scoring", "skills", "excitement", "teamwork"],
      minDuration: 5,
      maxDuration: 20,
      qualityThreshold: 75,
      maxHighlightsPerVideo: 4,
    });
    
    console.log("Successfully created default highlight generator configurations");
  } catch (error: any) {
    console.error("Error creating default configurations:", error);
    throw new Error(`Failed to create default configurations: ${error?.message || 'Unknown error'}`);
  }
}

// Initialize highlight generation system
export async function initializeHighlightGenerationSystem() {
  try {
    // Check if we have at least one admin user
    const adminUsers = await storage.getUsersByRole('admin');
    if (!adminUsers || adminUsers.length === 0) {
      console.log("No admin users found, can't initialize highlight generation system");
      return false;
    }
    
    // Check if we have any configuration
    const existingConfigs = await storage.getHighlightGeneratorConfigs();
    
    // If no configs exist, create default configurations
    if (!existingConfigs || existingConfigs.length === 0) {
      await createDefaultConfigurations(adminUsers[0].id);
    }
    
    // Schedule daily highlight generation
    scheduleHighlightGeneration(adminUsers[0].id);
    
    return true;
  } catch (error: any) {
    console.error("Error initializing highlight generation system:", error);
    return false;
  }
}

// Force a highlight generation for a specific video
export async function forceGenerateHighlights(videoId: number, adminUserId: number): Promise<{
  success: boolean;
  message: string;
  highlightIds?: number[];
}> {
  try {
    // Get the video
    const video = await storage.getVideo(videoId);
    if (!video) {
      return {
        success: false,
        message: `Video with ID ${videoId} not found`
      };
    }
    
    // Find the best configuration for this video
    const configs = await storage.getActiveHighlightGeneratorConfigs();
    const bestConfig = configs.find((c: HighlightGeneratorConfig) => c.sportType === video.sportType) || 
                       configs.find((c: HighlightGeneratorConfig) => c.sportType === 'any');
    
    if (!bestConfig) {
      return {
        success: false,
        message: `No suitable configuration found for video sport type: ${video.sportType || 'unspecified'}`
      };
    }
    
    // Generate highlights
    const result = await generateHighlightsForVideo(videoId, bestConfig.id, adminUserId);
    
    if (result.success) {
      // Mark the video as analyzed
      await storage.updateVideo(videoId, { analyzed: true });
      
      return {
        success: true,
        message: `Successfully generated ${result.highlightCount} highlights`,
        highlightIds: result.highlightIds
      };
    } else {
      return {
        success: false,
        message: result.message
      };
    }
  } catch (error: any) {
    console.error("Error forcing highlight generation:", error);
    return {
      success: false,
      message: `Failed to generate highlights: ${error?.message || 'Unknown error'}`
    };
  }
}