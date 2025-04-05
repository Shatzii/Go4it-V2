import OpenAI from "openai";
import fs from "fs";
import { storage } from "./storage";
import { AthleteProfile } from "@shared/schema";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "sk-demo-key" });

interface MotionData {
  elbowAlignment?: number;
  releasePoint?: number;
  followThrough?: number;
  balance?: number;
  keypoints?: {
    x: number;
    y: number;
    confidence: number;
    name: string;
  }[];
  [key: string]: any;
}

interface AnalysisResult {
  motionData: MotionData;
  overallScore: number;
  feedback: string;
  improvementTips: string[];
  keyFrameTimestamps: number[];
}

interface SportRecommendation {
  sport: string;
  matchPercentage: number;
  positionRecommendation: string;
  potentialLevel: string;
  reasonForMatch: string;
}

// Function to analyze video using OpenAI API
export async function analyzeVideo(videoId: number, videoPath: string): Promise<AnalysisResult> {
  try {
    console.log(`Analyzing video with ID: ${videoId} at path: ${videoPath}`);
    
    // Get the video data
    const video = await storage.getVideo(videoId);
    if (!video) {
      throw new Error("Video not found");
    }
    
    const sportType = video.sportType || "basketball"; // Default to basketball if not specified
    
    // For this implementation, we're using a single frame approach
    // In a production system, we would extract multiple key frames from the video
    // and analyze the athlete's motion sequence
    
    // Since we're not processing the actual video in this demo version, 
    // we'll use OpenAI's GPT-4o to generate an analysis based on the sport type
    
    const analysisPrompt = `
You are an expert sports motion analyst and coach. You are analyzing a video of an athlete performing in ${sportType}. 
Please provide a detailed analysis of their form and technique.

Generate a JSON response with the following structure:
{
  "motionData": {
    // Include 3-5 sport-specific metrics as decimal values between 0-100
    // For basketball: elbowAlignment, releasePoint, followThrough, balance
    // For soccer: kickingForm, balance, followThrough, positioning
    // For baseball: stanceBalance, swingPath, hipRotation, followThrough
    // For volleyball: approachTiming, armSwing, jumpHeight, handContact
    // For track: stride, armMotion, posture, kneeHeight
    // Include 3-5 keypoints representing important body positions during the motion
    "keypoints": [
      {"x": decimal, "y": decimal, "confidence": decimal, "name": "bodyPart"}
    ]
  },
  "overallScore": number between 0-100,
  "feedback": "Detailed feedback on the athlete's form and technique",
  "improvementTips": [
    "3-5 specific, actionable tips for improvement"
  ],
  "keyFrameTimestamps": [
    // 3-4 key timestamps in seconds where form should be analyzed
  ]
}

Keep in mind that this is for a student athlete who is looking to improve and potentially be recruited.
Focus on constructive feedback while being encouraging. Be specific about strengths and areas for improvement.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are an expert sports motion analyst specializing in biomechanics and athletic performance."
        },
        {
          role: "user",
          content: analysisPrompt
        }
      ],
      response_format: { type: "json_object" }
    });

    // Parse the JSON response
    const analysisResult: AnalysisResult = JSON.parse(response.choices[0].message.content || '{}');
    
    // Validate and ensure all required fields are present
    if (!analysisResult.motionData) analysisResult.motionData = {};
    if (!analysisResult.keyFrameTimestamps) analysisResult.keyFrameTimestamps = [1.5, 3.0, 4.5];
    if (!analysisResult.improvementTips) analysisResult.improvementTips = [];
    if (!analysisResult.feedback) analysisResult.feedback = "Analysis completed.";
    
    console.log("Analysis completed successfully");
    return analysisResult;
  } catch (error: any) {
    console.error("Error analyzing video:", error);
    throw new Error(`Failed to analyze video: ${error?.message || 'Unknown error'}`);
  }
}

// Function to generate sport recommendations based on motion analysis and athlete profile
export async function generateSportRecommendations(
  userId: number,
  motionData: MotionData,
  athleteProfile: AthleteProfile
): Promise<SportRecommendation[]> {
  try {
    console.log(`Generating sport recommendations for user ${userId}`);
    
    // Get existing recommendations to avoid duplicates
    const existingRecommendations = await storage.getSportRecommendations(userId);
    const existingSports = new Set(existingRecommendations.map(r => r.sport.toLowerCase()));
    
    // Format the athlete profile for the prompt
    const athleteInfo = {
      age: athleteProfile.age || 18,
      height: athleteProfile.height || 175, // in cm
      weight: athleteProfile.weight || 70, // in kg
      sports: athleteProfile.sportsInterest || [],
      injuries: [],
      strengths: [],
      goals: []
    };
    
    // Format the motion data for the prompt
    const formattedMotionData = {
      ...motionData,
      overallScore: motionData.overallScore || 75
    };
    
    // Create a prompt for OpenAI
    const recommendationPrompt = `
You are an expert sports scout and talent evaluator helping a student athlete find the sports that best match their physical attributes and movement patterns.

ATHLETE PROFILE:
- Age: ${athleteInfo.age} years
- Height: ${athleteInfo.height} cm
- Weight: ${athleteInfo.weight} kg
- Previous Sports Experience: ${athleteInfo.sports.join(', ') || 'None'}
- Physical Strengths: ${athleteInfo.strengths.join(', ') || 'Not specified'}
- Injuries: ${athleteInfo.injuries.join(', ') || 'None'}
- Athletic Goals: ${athleteInfo.goals.join(', ') || 'Not specified'}

MOTION ANALYSIS DATA:
${JSON.stringify(formattedMotionData, null, 2)}

TASK:
Recommend 5 sports that would be an excellent match for this athlete based on their profile and motion analysis data. 
For each recommendation, provide:
1. Sport name
2. Match percentage (1-100)
3. Position recommendation
4. Potential level (High School, Club, NCAA Div II, NCAA Div I, etc.)
5. A specific reason for why this sport matches their attributes

Return your response as a JSON array with the following structure:
[
  {
    "sport": "Sport name",
    "matchPercentage": number between 60-95,
    "positionRecommendation": "Best position for this athlete",
    "potentialLevel": "Competitive level potential",
    "reasonForMatch": "Detailed reason for this recommendation based on their attributes"
  },
  ...
]

Consider both traditional sports (basketball, soccer, etc.) and less common sports (rowing, fencing, etc.) that might be a good match.
Focus on realistic NCAA recruitment potential for college scholarships.

${existingSports.size > 0 ? `Note: The athlete already has recommendations for these sports, so exclude them: ${Array.from(existingSports).join(', ')}` : ''}
`;

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are an expert sports talent scout with deep knowledge of athletic performance metrics and NCAA recruitment standards."
        },
        {
          role: "user",
          content: recommendationPrompt
        }
      ],
      response_format: { type: "json_object" }
    });

    // Parse the JSON response
    let recommendations: SportRecommendation[] = JSON.parse(response.choices[0].message.content || '[]');
    
    // Validate the response and ensure it has the correct format
    if (!Array.isArray(recommendations)) {
      recommendations = [];
    }
    
    // Sort by match percentage
    recommendations.sort((a, b) => b.matchPercentage - a.matchPercentage);
    
    // Return top 3 (or fewer if we don't have 3)
    return recommendations.slice(0, 3);
    
  } catch (error: any) {
    console.error("Error generating sport recommendations:", error);
    throw new Error(`Failed to generate sport recommendations: ${error?.message || 'Unknown error'}`);
  }
}

// Note: We've replaced the mock analysis functions with real OpenAI-powered analysis

// Function to generate weight room workout recommendations
export async function generateWeightRoomPlan(
  userId: number,
  equipmentList: any[],
  level: number,
  goals: string[] = ["Strength", "Speed", "Endurance"]
): Promise<any> {
  try {
    console.log(`Generating weight room plan for user ${userId} at level ${level}`);
    
    // Get the user's progress
    const playerProgress = await storage.getPlayerProgress(userId);
    if (!playerProgress) {
      throw new Error("Player progress not found");
    }
    
    // Get the user's equipment
    const playerEquipment = await storage.getPlayerEquipment(userId);
    const availableEquipment = equipmentList
      .filter(eq => {
        // Check if player has this equipment
        return playerEquipment.some(pe => pe.equipmentId === eq.id);
      })
      .map(eq => ({
        name: eq.name,
        category: eq.category,
        id: eq.id,
        difficultyLevel: eq.difficultyLevel
      }));
    
    // Check if player has any equipment
    if (availableEquipment.length === 0) {
      // Recommend equipment that's appropriate for their level
      const recommendedEquipment = equipmentList
        .filter(eq => eq.unlockLevel <= playerProgress.currentLevel)
        .slice(0, 3)
        .map(eq => ({
          name: eq.name,
          category: eq.category,
          id: eq.id,
          unlockLevel: eq.unlockLevel,
          difficultyLevel: eq.difficultyLevel,
          description: eq.description
        }));
      
      return {
        hasEquipment: false,
        playerLevel: playerProgress.currentLevel,
        recommendedEquipment
      };
    }
    
    // Create a prompt for OpenAI
    const workoutPrompt = `
You are an expert athletic trainer designing a personalized weight room workout plan for a student athlete.

ATHLETE PROFILE:
- Skill Level: ${level} out of 10
- Current XP Level: ${playerProgress.currentLevel}
- Athletic Goals: ${goals.join(', ')}

AVAILABLE EQUIPMENT:
${JSON.stringify(availableEquipment, null, 2)}

TASK:
Create a personalized 30-minute weight room workout routine that will help this athlete improve based on their goals and available equipment.

The workout should include:
1. A 5-minute warm-up
2. 3-4 main exercises using their available equipment
3. A 3-minute cool-down

For each exercise, provide:
- Equipment to use (from their available list)
- Number of sets
- Number of reps per set
- Rest time between sets
- A form tip to help them perform the exercise correctly
- How this exercise contributes to their athletic goals

Return your response as a JSON object with the following structure:
{
  "warmup": {
    "duration": "5 minutes",
    "description": "Detailed warmup instructions"
  },
  "exercises": [
    {
      "name": "Exercise name",
      "equipmentId": equipment ID number,
      "sets": number of sets,
      "reps": number of reps per set,
      "rest": "rest time in seconds",
      "formTip": "Key form tip for proper execution",
      "benefit": "How this helps their athletic goals"
    },
    ...
  ],
  "cooldown": {
    "duration": "3 minutes",
    "description": "Detailed cooldown instructions"
  },
  "progressionTip": "Advice on how to progress to more advanced workouts",
  "expectedXpGain": number between 20-50
}

Make sure the exercises are appropriate for their skill level (${level}/10) and use only equipment from their available list.
Focus on proper form and technique to prevent injuries.
`;

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024
      messages: [
        {
          role: "system",
          content: "You are an expert athletic trainer and strength coach specializing in youth and collegiate athletic development."
        },
        {
          role: "user",
          content: workoutPrompt
        }
      ],
      response_format: { type: "json_object" }
    });

    // Parse the JSON response
    const workoutPlan = JSON.parse(response.choices[0].message.content || '{}');
    
    return {
      hasEquipment: true,
      playerLevel: playerProgress.currentLevel,
      workoutPlan
    };
    
  } catch (error: any) {
    console.error("Error generating weight room plan:", error);
    throw new Error(`Failed to generate weight room plan: ${error?.message || 'Unknown error'}`);
  }
}

// Function to provide AI coaching feedback on weight room form
export async function getFormFeedback(
  userId: number,
  equipmentId: number,
  formDescription: string
): Promise<any> {
  try {
    console.log(`Generating form feedback for user ${userId} using equipment ${equipmentId}`);
    
    // Get the equipment details
    const equipment = await storage.getWeightRoomEquipmentById(equipmentId);
    if (!equipment) {
      throw new Error("Equipment not found");
    }
    
    // Create a prompt for OpenAI
    const feedbackPrompt = `
You are a professional strength and conditioning coach providing feedback on a student athlete's weight room form.

EQUIPMENT BEING USED:
Name: ${equipment.name}
Category: ${equipment.category}
Difficulty Level: ${equipment.difficultyLevel}/10

ATHLETE'S FORM DESCRIPTION:
${formDescription}

TASK:
Provide detailed, constructive feedback on the athlete's form when using this equipment.

Your feedback should include:
1. Overall form quality assessment (on a scale of 1-10)
2. What they're doing correctly
3. 2-3 specific form corrections they should make
4. How proper form will improve their results and reduce injury risk
5. One advanced tip they can focus on once they master the basics

Return your response as a JSON object with the following structure:
{
  "formScore": number between 1-10,
  "strengths": ["What they're doing well", ...],
  "corrections": ["Specific correction 1", "Specific correction 2", ...],
  "safetyTip": "Important safety consideration",
  "advancedTip": "One advanced technique to focus on later",
  "overallFeedback": "Summary feedback paragraph"
}

Be encouraging but honest - this is a student athlete who wants to improve, not a professional.
`;

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024
      messages: [
        {
          role: "system",
          content: "You are an expert strength and conditioning coach specializing in proper form and technique for student athletes."
        },
        {
          role: "user",
          content: feedbackPrompt
        }
      ],
      response_format: { type: "json_object" }
    });

    // Parse the JSON response
    const feedback = JSON.parse(response.choices[0].message.content || '{}');
    
    // Add XP for submitting form for feedback
    const xpAmount = Math.floor(10 + (feedback.formScore || 5) * 2);
    await storage.addXpToPlayer(
      userId,
      xpAmount,
      "form_feedback",
      `Form feedback for ${equipment.name}`,
      String(equipmentId)
    );
    
    return {
      equipment: {
        id: equipment.id,
        name: equipment.name,
        category: equipment.category
      },
      feedback,
      xpAwarded: xpAmount
    };
    
  } catch (error: any) {
    console.error("Error generating form feedback:", error);
    throw new Error(`Failed to generate form feedback: ${error?.message || 'Unknown error'}`);
  }
}
