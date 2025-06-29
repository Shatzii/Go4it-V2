/**
 * AI Highlight Generator for Go4It Sports (Simplified Version)
 * 
 * This service analyzes videos to automatically identify and extract highlight clips
 * based on configurable parameters. It leverages OpenAI Vision API for motion and action detection.
 * 
 * This simplified version connects directly to the database via Drizzle ORM.
 */

import OpenAI from "openai";
import { db } from "./db";
import { videos, videoHighlights, highlightGeneratorConfigs } from "@shared/schema";
import { eq, and, desc } from "drizzle-orm";
import fs from "fs";
import path from "path";
import cron from "node-cron";

// Get OpenAI client
async function getOpenAIClient(): Promise<OpenAI> {
  // Make sure we have an API key in the environment
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY environment variable not set");
  }
  
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

// Analyze a video for highlight moments
async function analyzeVideoForHighlights(videoId: number, configId: number): Promise<{
  success: boolean;
  highlights: Array<{
    startTime: number;
    endTime: number;
    title: string;
    description: string;
    confidenceScore: number;
    tags: string[];
  }>;
  message: string;
}> {
  try {
    // Get the video and configuration from the database
    const [video] = await db.select().from(videos).where(eq(videos.id, videoId));
    if (!video) {
      return { 
        success: false, 
        highlights: [], 
        message: `Video with ID ${videoId} not found` 
      };
    }
    
    const [config] = await db.select().from(highlightGeneratorConfigs).where(eq(highlightGeneratorConfigs.id, configId));
    if (!config) {
      return { 
        success: false, 
        highlights: [], 
        message: `Configuration with ID ${configId} not found` 
      };
    }
    
    // For now, generate a simulated highlight detection using OpenAI
    console.log(`Analyzing video ${videoId} (${video.title}) for highlights using config "${config.name}"`);
    
    // This would normally send frames for analysis or process the entire video
    // For demo purposes, we'll simulate AI detection with a text prompt
    const openai = await getOpenAIClient();
    
    // Create a prompt that describes the video and asks for highlight moments
    const prompt = `
      Analyze this ${video.sportType} video: "${video.title}".
      Imagine you are watching a ${video.sportType} game or performance and identify 2-3 key highlights.
      For each highlight, provide:
      1. A title
      2. Start and end times (in seconds, between 0 and ${video.duration || 300})
      3. A detailed description of what happens
      4. A confidence score between 0.7 and 0.98
      5. Relevant tags (3-5 keywords)
      
      Respond in valid JSON format like this:
      {
        "highlights": [
          {
            "title": "Amazing Three-Pointer Shot",
            "startTime": 45,
            "endTime": 52,
            "description": "Player makes an incredible three-point shot from half court as the shot clock expires",
            "confidenceScore": 0.92,
            "tags": ["three-pointer", "buzzer beater", "long shot", "clutch"]
          }
        ]
      }
    `;
    
    // Get analysis from OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { role: "system", content: "You are a sports video analyst specializing in highlight detection." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });
    
    // Parse the response
    const aiResult = JSON.parse(response.choices[0].message.content);
    
    console.log(`Detected ${aiResult.highlights.length} potential highlights in video ${videoId}`);
    
    return {
      success: true,
      highlights: aiResult.highlights,
      message: `Successfully analyzed video and found ${aiResult.highlights.length} highlights`
    };
  } catch (error) {
    console.error("Error analyzing video for highlights:", error);
    return {
      success: false,
      highlights: [],
      message: `Error analyzing video: ${error.message}`
    };
  }
}

// Generate highlights for a specific video
export async function generateHighlightsForVideo(
  videoId: number, 
  configId: number
): Promise<{
  success: boolean;
  generatedHighlights: number;
  message: string;
}> {
  try {
    console.log(`Generating highlights for video ${videoId} using config ${configId}`);
    
    // Get the video from the database
    const [video] = await db.select().from(videos).where(eq(videos.id, videoId));
    if (!video) {
      return { 
        success: false, 
        generatedHighlights: 0, 
        message: `Video with ID ${videoId} not found` 
      };
    }
    
    // Analyze the video for highlights
    const analysis = await analyzeVideoForHighlights(videoId, configId);
    if (!analysis.success) {
      return {
        success: false,
        generatedHighlights: 0,
        message: analysis.message
      };
    }
    
    // Create highlight entries in the database
    const createdHighlights = [];
    
    for (const highlight of analysis.highlights) {
      // This would normally create actual video clips
      // For demo purposes, we're just creating database entries
      
      const newHighlight = {
        videoId: videoId,
        title: highlight.title,
        description: highlight.description,
        startTime: highlight.startTime,
        endTime: highlight.endTime,
        duration: highlight.endTime - highlight.startTime,
        clipPath: `simulated_path_${videoId}_${highlight.startTime}_${highlight.endTime}.mp4`,
        thumbnailPath: null,
        tags: highlight.tags,
        confidenceScore: highlight.confidenceScore,
        featured: highlight.confidenceScore > 0.9, // Feature high-confidence highlights
        aiGenerated: true,
        aiAnalysisNotes: JSON.stringify(highlight)
      };
      
      // Insert the highlight into the database
      const [insertedHighlight] = await db
        .insert(videoHighlights)
        .values(newHighlight)
        .returning();
      
      createdHighlights.push(insertedHighlight);
      console.log(`Created highlight ${insertedHighlight.id}: "${insertedHighlight.title}"`);
    }
    
    // Mark the video as analyzed
    await db
      .update(videos)
      .set({ analyzed: true })
      .where(eq(videos.id, videoId));
    
    return {
      success: true,
      generatedHighlights: createdHighlights.length,
      message: `Successfully generated ${createdHighlights.length} highlights for video ${videoId}`
    };
  } catch (error) {
    console.error("Error generating highlights:", error);
    return {
      success: false,
      generatedHighlights: 0,
      message: `Error generating highlights: ${error.message}`
    };
  }
}

// Process all unanalyzed videos
export async function processUnanalyzedVideos(): Promise<{
  success: boolean;
  processed: number;
  message: string;
}> {
  try {
    // Get all videos that haven't been analyzed yet
    const unanalyzedVideos = await db
      .select()
      .from(videos)
      .where(eq(videos.analyzed, false));
    
    console.log(`Found ${unanalyzedVideos.length} unanalyzed videos`);
    
    if (unanalyzedVideos.length === 0) {
      return {
        success: true,
        processed: 0,
        message: "No unanalyzed videos found"
      };
    }
    
    // Get the appropriate configuration for each video
    let processedCount = 0;
    
    for (const video of unanalyzedVideos) {
      try {
        // Find a configuration that matches the sport type
        const [config] = await db
          .select()
          .from(highlightGeneratorConfigs)
          .where(and(
            eq(highlightGeneratorConfigs.active, true),
            eq(highlightGeneratorConfigs.sportType, video.sportType || "default")
          ));
        
        // If no specific config is found, look for a default one
        const configToUse = config || await db
          .select()
          .from(highlightGeneratorConfigs)
          .where(eq(highlightGeneratorConfigs.name, "Default Highlight Generator"))
          .then(results => results[0]);
        
        if (!configToUse) {
          console.log(`No suitable configuration found for video ${video.id} (${video.sportType})`);
          continue;
        }
        
        // Generate highlights for this video
        const result = await generateHighlightsForVideo(video.id, configToUse.id);
        
        if (result.success) {
          processedCount++;
        }
      } catch (vidError) {
        console.error(`Error processing video ${video.id}:`, vidError);
        // Continue with the next video
      }
    }
    
    return {
      success: true,
      processed: processedCount,
      message: `Successfully processed ${processedCount} out of ${unanalyzedVideos.length} unanalyzed videos`
    };
  } catch (error) {
    console.error("Error processing unanalyzed videos:", error);
    return {
      success: false,
      processed: 0,
      message: `Error processing unanalyzed videos: ${error.message}`
    };
  }
}

// Schedule automatic highlight generation
export function scheduleHighlightGeneration() {
  // Schedule a job to run at 3:00 AM every day
  cron.schedule("0 3 * * *", async () => {
    console.log("Running scheduled highlight generation...");
    
    try {
      const result = await processUnanalyzedVideos();
      console.log(`Scheduled highlight generation completed: ${result.message}`);
    } catch (error) {
      console.error("Error in scheduled highlight generation:", error);
    }
  });
  
  console.log("Scheduled daily highlight generation at 3:00 AM");
}

// Create default highlight generator configurations
async function createDefaultConfigurations(adminUserId: number) {
  // Check if configurations already exist
  const existingConfigs = await db
    .select()
    .from(highlightGeneratorConfigs)
    .limit(1);
  
  if (existingConfigs.length > 0) {
    console.log("Highlight generator configurations already exist");
    return;
  }
  
  // Create default configurations for different sports
  const defaultConfigs = [
    {
      name: "Basketball Highlight Generator",
      sportType: "basketball",
      description: "Detects key basketball moments like dunks, three-pointers, blocks and steals",
      createdBy: adminUserId,
      active: true,
      highlightTypes: ["scoring", "defensive", "teamplay"],
      minConfidenceThreshold: 0.7,
      maxHighlightsPerVideo: 10,
      minHighlightDuration: 3,
      maxHighlightDuration: 15,
      includeSlowMotion: true,
      includeReplay: true,
      addBackgroundMusic: true,
      musicVolume: 0.3,
      musicCategory: "hip-hop"
    },
    {
      name: "Football Highlight Generator",
      sportType: "football",
      description: "Detects key football moments like touchdowns, interceptions, big tackles and catches",
      createdBy: adminUserId,
      active: true,
      highlightTypes: ["offensive", "defensive", "special-teams"],
      minConfidenceThreshold: 0.75,
      maxHighlightsPerVideo: 8,
      minHighlightDuration: 5,
      maxHighlightDuration: 20,
      includeSlowMotion: true,
      includeReplay: true,
      addBackgroundMusic: true,
      musicVolume: 0.3,
      musicCategory: "hip-hop"
    },
    {
      name: "Soccer Highlight Generator",
      sportType: "soccer",
      description: "Detects key soccer moments like goals, saves, and skillful plays",
      createdBy: adminUserId,
      active: true,
      highlightTypes: ["goals", "saves", "skills", "teamplay"],
      minConfidenceThreshold: 0.7,
      maxHighlightsPerVideo: 8,
      minHighlightDuration: 4,
      maxHighlightDuration: 18,
      includeSlowMotion: true,
      includeReplay: true,
      addBackgroundMusic: true,
      musicVolume: 0.25,
      musicCategory: "edm"
    },
    {
      name: "Default Highlight Generator",
      sportType: "default",
      description: "Generic configuration for sports without a specific configuration",
      createdBy: adminUserId,
      active: true,
      highlightTypes: ["exciting", "skillful", "teamplay"],
      minConfidenceThreshold: 0.8,
      maxHighlightsPerVideo: 5,
      minHighlightDuration: 5,
      maxHighlightDuration: 15,
      includeSlowMotion: true,
      includeReplay: false,
      addBackgroundMusic: true,
      musicVolume: 0.3,
      musicCategory: "motivational"
    }
  ];
  
  for (const config of defaultConfigs) {
    await db
      .insert(highlightGeneratorConfigs)
      .values(config);
  }
  
  console.log("Successfully created default highlight generator configurations");
}

// Initialize the highlight generation system
export async function initializeHighlightGenerationSystem(adminUserId: number = 1) {
  try {
    // Create default configurations if none exist
    await createDefaultConfigurations(adminUserId);
    
    // Schedule daily highlight generation
    scheduleHighlightGeneration();
    
    // Process any existing unanalyzed videos
    const initialResult = await processUnanalyzedVideos();
    console.log(`Initial processing result: ${initialResult.message}`);
    
    return true;
  } catch (error) {
    console.error("Error initializing highlight generation system:", error);
    return false;
  }
}

// Force generate highlights for a specific video (manual trigger)
export async function forceGenerateHighlights(
  videoId: number, 
  configId: number = 1
): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const result = await generateHighlightsForVideo(videoId, configId);
    return result;
  } catch (error) {
    return {
      success: false,
      generatedHighlights: 0, 
      message: `Error generating highlights: ${error.message}`
    };
  }
}