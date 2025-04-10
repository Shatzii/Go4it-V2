import { db } from '../db';
import { videos, videoAnalysis, users } from '@shared/schema';
import { eq } from 'drizzle-orm';
import { getOpenAIClient } from '../openai';

/**
 * GAR (Growth and Ability Rating) Score Categories
 * - Physical: Speed, strength, agility, endurance, coordination
 * - Psychological: Focus, confidence, decision-making, mental toughness, adaptability
 * - Technical: Skill execution, game IQ, technique, positioning, tactical awareness
 */

interface GARCategory {
  name: string;
  attributes: string[];
  description: string;
}

interface GARScore {
  category: string;
  attributes: {
    name: string;
    score: number;
    comments: string;
  }[];
  overallScore: number;
}

interface GARScoreResult {
  categories: GARScore[];
  overallScore: number;
  improvementAreas: string[];
  strengths: string[];
  adhd: {
    focusScore: number;
    focusStrategies: string[];
    attentionInsights: string;
    learningPatterns: string;
  };
}

// Define the GAR categories for all sports
const GAR_CATEGORIES: Record<string, GARCategory[]> = {
  // Common categories across all sports
  common: [
    {
      name: "Physical",
      attributes: ["Speed", "Strength", "Agility", "Endurance", "Coordination"],
      description: "Assesses the athlete's physical capabilities and athletic attributes"
    },
    {
      name: "Psychological",
      attributes: ["Focus", "Confidence", "Decision-making", "Mental toughness", "Adaptability"],
      description: "Evaluates mental aspects of performance including focus and decision-making"
    },
    {
      name: "Technical",
      attributes: ["Skill execution", "Game IQ", "Technique", "Positioning", "Tactical awareness"],
      description: "Rates sport-specific skills, knowledge and tactical understanding"
    }
  ],
  
  // Sport-specific additional attributes or specialized categories
  basketball: [
    {
      name: "Physical",
      attributes: ["Vertical leap", "Speed", "Strength", "Endurance", "Coordination"],
      description: "Assesses the athlete's physical basketball capabilities"
    },
    {
      name: "Psychological",
      attributes: ["Focus", "Confidence", "Decision-making", "Game pressure handling", "Team awareness"],
      description: "Evaluates mental aspects of basketball performance"
    },
    {
      name: "Technical",
      attributes: ["Shooting form", "Dribbling", "Passing accuracy", "Court vision", "Defensive footwork"],
      description: "Rates basketball-specific skills and fundamentals"
    }
  ],
  
  football: [
    {
      name: "Physical",
      attributes: ["Explosiveness", "Speed", "Strength", "Durability", "Agility"],
      description: "Assesses the athlete's physical football capabilities"
    },
    {
      name: "Psychological",
      attributes: ["Focus", "Confidence", "Situational awareness", "Pressure handling", "Team communication"],
      description: "Evaluates mental aspects of football performance"
    },
    {
      name: "Technical",
      attributes: ["Position fundamentals", "Play execution", "Football IQ", "Technique consistency", "Reading game situations"],
      description: "Rates football-specific skills and knowledge"
    }
  ],
  
  soccer: [
    {
      name: "Physical",
      attributes: ["Stamina", "Speed", "Strength", "Agility", "Balance"],
      description: "Assesses the athlete's physical soccer capabilities"
    },
    {
      name: "Psychological",
      attributes: ["Focus", "Confidence", "Spatial awareness", "Game intelligence", "Competitiveness"],
      description: "Evaluates mental aspects of soccer performance"
    },
    {
      name: "Technical",
      attributes: ["Ball control", "Passing accuracy", "Shooting technique", "Defensive positioning", "First touch"],
      description: "Rates soccer-specific skills and fundamentals"
    }
  ],
  
  // Add more sports as needed with their specific attributes
};

/**
 * Get the appropriate GAR categories for a specific sport
 * Falls back to common categories if sport-specific ones don't exist
 */
function getGARCategoriesForSport(sportType: string): GARCategory[] {
  const lowerSport = sportType.toLowerCase();
  return GAR_CATEGORIES[lowerSport] || GAR_CATEGORIES.common;
}

/**
 * Generate GAR scores for a video using AI analysis
 */
export async function generateGARScores(videoId: number, sportType: string): Promise<GARScoreResult | null> {
  try {
    // Get the video details
    const [video] = await db.select().from(videos).where(eq(videos.id, videoId));
    
    if (!video) {
      console.error(`Video not found with ID: ${videoId}`);
      return null;
    }
    
    // Check if video has analysis data already
    const [analysis] = await db
      .select()
      .from(videoAnalysis)
      .where(eq(videoAnalysis.videoId, videoId));
    
    // Use OpenAI to analyze the video and generate GAR scores
    const openai = await getOpenAIClient();
    
    // Get user details for additional context
    const [user] = await db.select().from(users).where(eq(users.id, video.userId));
    
    // Get GAR categories for this sport
    const garCategories = getGARCategoriesForSport(sportType);
    
    // Format categories for prompt
    const categoriesForPrompt = garCategories.map(cat => {
      return `${cat.name}: ${cat.attributes.join(', ')}`;
    }).join('\n');
    
    // Create a detailed system prompt
    const systemPrompt = `
      You are an expert sports analyst with special expertise in neurodivergent athletes (especially those with ADHD).
      You will generate a comprehensive GAR (Growth and Ability Rating) score analysis for a ${sportType} athlete's performance.
      
      The GAR score breakdown includes:
      ${categoriesForPrompt}
      
      Each attribute is scored on a scale of 1-10, where:
      1-2: Significantly below average
      3-4: Below average
      5-6: Average
      7-8: Above average
      9-10: Exceptional
      
      Include specific, actionable feedback for each score.
      
      Provide a neurodivergent-specific section focusing on:
      1. Focus score (1-10) with suggested focus strategies
      2. Attention insights - how ADHD affects their performance
      3. Learning patterns observed in the performance
      
      The athlete is ${user?.age || 'a teenager'} years old and plays ${sportType}.
    `;
    
    // Prompt description of the video details
    const userPrompt = `
      Analyze this ${sportType} performance video and generate GAR scores:
      
      Video title: ${video.title}
      Description: ${video.description || "No description provided"}
      Duration: ${video.duration || "Unknown"} seconds
      Athlete age: ${user?.age || "Teen"}
      Position: ${video.sportPosition || "Unknown"}
      
      Please provide:
      1. GAR scores for all attributes in each category
      2. Overall score for each category
      3. Total GAR score (average of all category scores)
      4. Top 3 strengths and improvement areas
      5. ADHD-specific analysis with focus score and strategies
      
      Format your response as a JSON object with these exact keys:
      {
        "categories": [
          {
            "category": "Category Name",
            "attributes": [
              {
                "name": "Attribute Name",
                "score": 1-10,
                "comments": "Specific feedback"
              }
            ],
            "overallScore": 1-10
          }
        ],
        "overallScore": 1-10,
        "improvementAreas": ["Area 1", "Area 2", "Area 3"],
        "strengths": ["Strength 1", "Strength 2", "Strength 3"],
        "adhd": {
          "focusScore": 1-10,
          "focusStrategies": ["Strategy 1", "Strategy 2", "Strategy 3"],
          "attentionInsights": "How ADHD impacts performance",
          "learningPatterns": "Observed learning patterns"
        }
      }
    `;
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" }
    });
    
    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content returned from OpenAI");
    }
    
    const garScores = JSON.parse(content) as GARScoreResult;
    
    // Store the GAR scores in the database
    // If analysis already exists, update it, otherwise create a new one
    if (analysis) {
      await db
        .update(videoAnalysis)
        .set({ 
          analysisData: garScores,
          updatedAt: new Date()
        })
        .where(eq(videoAnalysis.id, analysis.id));
    } else {
      await db.insert(videoAnalysis).values({
        videoId: videoId,
        analysisData: garScores,
        garScore: Math.round(garScores.overallScore * 10) / 10,  // Store with 1 decimal place
        createdAt: new Date(),
        updatedAt: new Date(),
        improvementTips: garScores.improvementAreas
      });
    }
    
    return garScores;
  } catch (error) {
    console.error("Error generating GAR scores:", error);
    return null;
  }
}

/**
 * Get GAR scores for a video if they exist
 */
export async function getGARScores(videoId: number): Promise<GARScoreResult | null> {
  try {
    const [analysis] = await db
      .select()
      .from(videoAnalysis)
      .where(eq(videoAnalysis.videoId, videoId));
    
    if (!analysis || !analysis.analysisData) {
      return null;
    }
    
    return analysis.analysisData as GARScoreResult;
  } catch (error) {
    console.error("Error retrieving GAR scores:", error);
    return null;
  }
}

/**
 * Get GAR category descriptions
 */
export function getGARCategoryDescriptions(sportType: string): Record<string, string> {
  const categories = getGARCategoriesForSport(sportType);
  
  return categories.reduce((acc, category) => {
    acc[category.name] = category.description;
    return acc;
  }, {} as Record<string, string>);
}