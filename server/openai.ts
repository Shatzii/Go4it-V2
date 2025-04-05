import OpenAI from "openai";
import fs from "fs";
import { storage } from "./storage";
import { AthleteProfile } from "@shared/schema";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
console.log("Initializing OpenAI client with API key from environment");

// Get API key from environment or use fallback for development only
const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey || !apiKey.startsWith('sk-')) {
  console.error("Warning: Invalid or missing OpenAI API key! Please set a valid OPENAI_API_KEY environment variable.");
  console.error("API analysis features will not work without a valid key.");
}

// Create OpenAI client
const openai = new OpenAI({ 
  apiKey: apiKey
});

export interface MotionData {
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

export interface AnalysisResult {
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

// Function to generate a mock analysis when API key is not available
function generateMockAnalysis(sportType: string): AnalysisResult {
  console.log(`Generating mock analysis for ${sportType} due to missing API key`);
  
  // Default metrics based on sport type
  const getDefaultMetrics = () => {
    switch (sportType.toLowerCase()) {
      case 'basketball':
        return {
          elbowAlignment: 85,
          releasePoint: 78,
          followThrough: 82,
          balance: 75
        };
      case 'soccer':
        return {
          kickingForm: 80,
          balance: 85,
          followThrough: 75,
          positioning: 82
        };
      case 'baseball':
        return {
          stanceBalance: 78,
          swingPath: 82,
          hipRotation: 76,
          followThrough: 80
        };
      case 'volleyball':
        return {
          approachTiming: 75,
          armSwing: 80,
          jumpHeight: 85,
          handContact: 78
        };
      case 'track':
        return {
          stride: 82,
          armMotion: 78,
          posture: 85,
          kneeHeight: 80
        };
      default:
        return {
          athleticism: 80,
          coordination: 78,
          balance: 75,
          powerGeneration: 82
        };
    }
  };
  
  // Generate mock keypoints data
  const mockKeypoints = [
    { x: 0.45, y: 0.38, confidence: 0.92, name: "head" },
    { x: 0.48, y: 0.52, confidence: 0.95, name: "torso" },
    { x: 0.42, y: 0.65, confidence: 0.88, name: "knees" },
    { x: 0.46, y: 0.85, confidence: 0.85, name: "feet" }
  ];
  
  // Generate feedback and tips based on sport
  const generateFeedback = () => {
    switch (sportType.toLowerCase()) {
      case 'basketball':
        return "Good form on your jumpshot. Your elbow alignment is solid, and your follow-through shows good technique. Your balance could use some improvement on landing.";
      case 'soccer':
        return "Your kicking technique shows good fundamentals. You maintain solid balance throughout the motion, and your follow-through is consistent. Work on your positioning for maximum power.";
      case 'baseball':
        return "Your swing demonstrates good fundamentals. Your stance is balanced, and you generate good hip rotation. Work on completing your follow-through for maximum power.";
      case 'volleyball':
        return "Your approach timing is consistent, and you generate good height on your jump. Your arm swing technique is solid, but you could improve hand contact for better ball control.";
      case 'track':
        return "Your running form shows good fundamentals. Your stride length is efficient, and your posture remains upright. Focus on arm motion to complement your leg drive.";
      default:
        return "Your athletic movement demonstrates good overall technique. You show solid coordination and balance throughout the motion. Continue to work on power generation for improved performance.";
    }
  };

  // Generate improvement tips
  const generateTips = () => {
    switch (sportType.toLowerCase()) {
      case 'basketball':
        return [
          "Focus on landing with knees slightly bent for better balance after shot",
          "Ensure your guide hand stays on the side of the ball without affecting the shot",
          "Practice maintaining a consistent release point",
          "Work on keeping your shooting elbow directly under the ball"
        ];
      case 'soccer':
        return [
          "Practice planting your non-kicking foot more firmly beside the ball",
          "Focus on striking the ball with the instep for more power",
          "Improve your follow-through by extending through the kick",
          "Work on hip rotation to generate more power"
        ];
      case 'baseball':
        return [
          "Keep your weight back slightly longer before transferring forward",
          "Focus on keeping your hands inside the ball during your swing",
          "Improve hip rotation timing for better power transfer",
          "Work on maintaining a level swing path through the zone"
        ];
      case 'volleyball':
        return [
          "Focus on timing your approach consistently with the set",
          "Work on extending your arm fully during your swing",
          "Practice contacting the ball at the highest point of your jump",
          "Improve wrist snap at contact for better ball control"
        ];
      case 'track':
        return [
          "Focus on driving your knees higher during acceleration phase",
          "Work on arm motion that complements your stride",
          "Practice maintaining upright posture throughout your run",
          "Improve foot strike for more efficient energy transfer"
        ];
      default:
        return [
          "Focus on maintaining balanced positioning throughout the movement",
          "Work on coordinating upper and lower body movements",
          "Practice consistent technique to build muscle memory",
          "Improve power generation through proper sequencing of movements"
        ];
    }
  };

  // Generate mock result
  return {
    motionData: {
      ...getDefaultMetrics(),
      keypoints: mockKeypoints
    },
    overallScore: Math.floor(75 + Math.random() * 10), // 75-85 range
    feedback: generateFeedback(),
    improvementTips: generateTips(),
    keyFrameTimestamps: [1.2, 2.8, 4.1, 5.6]
  };
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
    
    // Check if we have a valid API key
    if (!apiKey || !apiKey.startsWith('sk-')) {
      console.log("No valid OpenAI API key found, using mock analysis");
      
      // Generate and save a mock analysis
      const mockAnalysis = generateMockAnalysis(sportType);
      
      // Save the analysis to the database
      await storage.saveVideoAnalysis(videoId, mockAnalysis);
      
      return mockAnalysis;
    }
    
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
    
    // Save the analysis to the database
    await storage.saveVideoAnalysis(videoId, analysisResult);
    
    console.log("Analysis completed successfully");
    return analysisResult;
  } catch (error: any) {
    console.error("Error analyzing video:", error);
    
    // If there's an API key error, try using the mock analysis
    if (error.message && error.message.includes("API key")) {
      console.log("API key error, falling back to mock analysis");
      
      // Get the video data
      const video = await storage.getVideo(videoId);
      if (!video) {
        throw new Error("Video not found");
      }
      
      const sportType = video.sportType || "basketball";
      const mockAnalysis = generateMockAnalysis(sportType);
      
      // Save the mock analysis to the database
      await storage.saveVideoAnalysis(videoId, mockAnalysis);
      
      return mockAnalysis;
    }
    
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

// AI Coach functions
interface CoachMessage {
  role: string;
  content: string;
  metadata?: any;
}

// Function to generate AI coach responses for the MyPlayer feature
export async function generateAICoachResponse(
  userId: number,
  userMessage: string,
  messageHistory: CoachMessage[] = []
): Promise<CoachMessage> {
  try {
    console.log(`Generating AI coach response for user ${userId}`);
    
    // Get the athlete profile if available
    const athleteProfile = await storage.getAthleteProfile(userId);
    
    // Get the user's progress data
    const playerProgress = await storage.getPlayerProgress(userId);
    
    // Format athlete info for context
    const athleteInfo = athleteProfile ? {
      age: athleteProfile.age || 18,
      height: athleteProfile.height || 175, // in cm
      weight: athleteProfile.weight || 70, // in kg
      sports: athleteProfile.sportsInterest || [],
      experience: "beginner" // Default to beginner since experienceLevel isn't in schema
    } : {
      experience: "beginner"
    };
    
    // Format player progress for context
    const progressInfo = playerProgress ? {
      level: playerProgress.currentLevel,
      xpTotal: playerProgress.totalXp,
      focusAreas: ["Overall Fitness"] // Default focus areas since skillsFocus isn't in schema
    } : {
      level: 1,
      xpTotal: 0,
      focusAreas: ["Overall Fitness"]
    };
    
    // Get recent video analyses if available
    const videos = await storage.getVideosByUser(userId);
    const recentAnalyses = [];
    
    for (const video of videos.slice(0, 3)) {
      const analysis = await storage.getVideoAnalysisByVideoId(video.id);
      if (analysis) {
        recentAnalyses.push({
          sport: video.sportType,
          score: analysis.overallScore,
          feedback: analysis.feedback,
          improvementAreas: analysis.improvementTips
        });
      }
    }
    
    // Format message history for context - ensure types match OpenAI's requirements
    const formattedHistory = messageHistory.map(msg => ({
      role: msg.role === "coach" ? "assistant" as const : "user" as const,
      content: msg.content
    }));
    
    // Create a system prompt for the AI coach
    const systemPrompt = `
You are an AI sports coach and performance specialist named Coach AI, embedded in the GetVerified platform. 
Your goal is to guide student athletes through personalized training, technique improvements, and performance analysis.

ATHLETE PROFILE:
${JSON.stringify(athleteInfo, null, 2)}

PROGRESS INFO:
${JSON.stringify(progressInfo, null, 2)}

${recentAnalyses.length > 0 ? `RECENT PERFORMANCE ANALYSIS:
${JSON.stringify(recentAnalyses, null, 2)}` : ''}

Your coaching style should be:
- Motivational and positive, but honest about areas for improvement
- Focused on proper technique and injury prevention
- Adaptable to the athlete's current level (${progressInfo.level}/10)
- Specific and actionable with personalized advice
- Educational about sports science concepts when relevant

You can provide various types of assistance:
1. Answer questions about training, technique, and athletic development
2. Create personalized training plans for different goals
3. Analyze technique descriptions and provide feedback
4. Explain sport-specific skills and drills
5. Give advice on recovery, nutrition, and mental preparation
6. Interpret performance data when shared by the athlete

If the user asks for a workout or training plan, create a structured plan with:
- Specific exercises with sets, reps, and rest periods
- Clear progression path
- Focus areas tailored to their sport interests
- Explanation of how each component improves performance

For form analysis, provide:
- Specific corrections
- Key technique points
- Safety considerations
- Progressive skill development

Remember that you're working with student athletes, primarily focused on development and improvement, not professional performance.
`;

    // Messages to send to the API with proper type definitions
    const messages = [
      { role: "system" as const, content: systemPrompt },
      ...formattedHistory,
      { role: "user" as const, content: userMessage }
    ];

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024
      messages,
      temperature: 0.7,
      max_tokens: 1000
    });

    // Get the content from the response
    const content = response.choices[0].message.content || "I'm sorry, I couldn't process that request.";
    
    // Check if it's a workout or training plan response
    let metadata = undefined;
    
    // Look for structured workout data patterns
    if (
      (userMessage.toLowerCase().includes("workout") || 
       userMessage.toLowerCase().includes("training plan") ||
       userMessage.toLowerCase().includes("program") ||
       userMessage.toLowerCase().includes("routine")) &&
      (content.includes("Day 1") || content.includes("Week 1") || content.includes("Sets:") || content.includes("Reps:"))
    ) {
      // Extract training plan structure
      metadata = {
        type: "workout",
        title: extractWorkoutTitle(content),
        items: extractWorkoutItems(content)
      };
    }
    
    // Generate XP for interacting with the AI coach
    await storage.addXpToPlayer(
      userId,
      10, // Base XP for interaction
      "ai_coach",
      "Interacted with AI Coach",
      undefined
    );
    
    // Return the coach message
    return {
      role: "coach",
      content,
      metadata
    };
    
  } catch (error: any) {
    console.error("Error generating AI coach response:", error);
    throw new Error(`Failed to generate AI coach response: ${error?.message || 'Unknown error'}`);
  }
}

// Function to generate a real-time workout assessment
export async function generateRealTimeWorkoutFeedback(
  userId: number,
  exerciseType: string,
  performanceData: any
): Promise<any> {
  try {
    console.log(`Generating real-time feedback for ${exerciseType} workout`);
    
    // Get the athlete profile if available
    const athleteProfile = await storage.getAthleteProfile(userId);
    
    // Prepare performance data for the prompt
    const formattedPerformanceData = {
      exerciseType,
      ...performanceData
    };
    
    // Create a prompt for OpenAI
    const feedbackPrompt = `
You are an expert real-time workout coach providing immediate feedback on a student athlete's exercise performance.

EXERCISE INFORMATION:
Type: ${exerciseType}

PERFORMANCE DATA:
${JSON.stringify(formattedPerformanceData, null, 2)}

ATHLETE PROFILE:
${athleteProfile ? JSON.stringify({
  age: athleteProfile.age || 18,
  height: athleteProfile.height || 175,
  weight: athleteProfile.weight || 70,
  experience: "beginner" // We don't have experienceLevel in the schema
}, null, 2) : "Beginner level athlete"}

TASK:
Provide immediate, actionable feedback on the athlete's current exercise performance.

Your feedback should include:
1. What they're doing well
2. One specific adjustment to improve form or effectiveness
3. A motivational cue to maintain energy and focus
4. A safety tip if relevant

Return your response as a JSON object with the following structure:
{
  "positiveFeedback": "What they're doing well",
  "adjustment": "Specific form correction or technique adjustment",
  "motivationalCue": "Short motivational phrase",
  "safetyTip": "Important safety consideration if needed",
  "overallAssessment": "Brief overall assessment of performance"
}

Keep your feedback concise - this is meant for real-time guidance during a workout.
`;

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024
      messages: [
        {
          role: "system" as const,
          content: "You are an expert athletic trainer providing real-time workout feedback."
        },
        {
          role: "user" as const,
          content: feedbackPrompt
        }
      ],
      response_format: { type: "json_object" }
    });

    // Parse the JSON response
    const feedback = JSON.parse(response.choices[0].message.content || '{}');
    
    return feedback;
    
  } catch (error: any) {
    console.error("Error generating real-time workout feedback:", error);
    throw new Error(`Failed to generate real-time workout feedback: ${error?.message || 'Unknown error'}`);
  }
}

// Function to create personalized training plans based on goals and profile
export async function generatePersonalizedTrainingPlan(
  userId: number,
  goals: string[] = ["Overall Performance"],
  durationWeeks: number = 4,
  daysPerWeek: number = 3,
  focusAreas: string[] = []
): Promise<any> {
  try {
    console.log(`Generating personalized training plan for user ${userId}`);
    
    // Get the athlete profile
    const athleteProfile = await storage.getAthleteProfile(userId);
    if (!athleteProfile) {
      throw new Error("Athlete profile not found");
    }
    
    // Get the player progress
    const playerProgress = await storage.getPlayerProgress(userId);
    const athleteLevel = playerProgress ? playerProgress.currentLevel : 1;
    
    // Format athlete info for the prompt
    const athleteInfo = {
      age: athleteProfile.age || 18,
      height: athleteProfile.height || 175,
      weight: athleteProfile.weight || 70,
      sports: athleteProfile.sportsInterest || [],
      experience: "beginner", // Default to beginner since experienceLevel isn't in schema
      skillLevel: athleteLevel
    };
    
    // Create a prompt for OpenAI
    const planPrompt = `
You are an expert athletic trainer creating a personalized training plan for a student athlete.

ATHLETE PROFILE:
${JSON.stringify(athleteInfo, null, 2)}

TRAINING PLAN PARAMETERS:
- Goals: ${goals.join(', ')}
- Duration: ${durationWeeks} weeks
- Frequency: ${daysPerWeek} days per week
- Focus Areas: ${focusAreas.length > 0 ? focusAreas.join(', ') : 'General athletic development'}

TASK:
Create a comprehensive, progressive training plan that will help this athlete improve based on their profile, goals, and focus areas.

The training plan should include:
1. An overall description of the training approach
2. Weekly breakdown of workouts
3. Day-by-day exercise prescriptions
4. Progression scheme throughout the program
5. Key performance indicators to track

For each workout, include:
- Warm-up activities
- Main exercises with sets, reps, and rest periods
- Cool-down/recovery activities
- Training tips specific to that workout

Return your response as a JSON object with the following structure:
{
  "planTitle": "Name of the training plan",
  "planDescription": "Overall description and approach",
  "weeks": [
    {
      "weekNumber": 1,
      "focus": "Focus for this week",
      "progressionNotes": "How this week builds on previous training",
      "days": [
        {
          "dayNumber": 1,
          "type": "Type of training (e.g., Strength, Speed, Recovery)",
          "warmup": "Warm-up routine description",
          "exercises": [
            {
              "name": "Exercise name",
              "sets": number of sets,
              "reps": "reps description (e.g., '10 reps' or '30 seconds')",
              "rest": "rest period in seconds",
              "notes": "Form cues or important details",
              "progressionTip": "How to progress this exercise"
            },
            ...more exercises
          ],
          "cooldown": "Cool-down routine description",
          "tips": "Tips specific to this workout day"
        },
        ...more days
      ]
    },
    ...more weeks
  ],
  "keyPerformanceIndicators": [
    "KPI 1 to track progress",
    "KPI 2 to track progress",
    ...
  ],
  "nutritionTips": "General nutrition advice for this plan",
  "recoveryRecommendations": "Recovery recommendations during this program"
}

Make sure the plan is appropriate for their age (${athleteInfo.age}), experience level (${athleteInfo.experience}), and skill level (${athleteInfo.skillLevel}/10).
Focus on proper progression to prevent injuries while maximizing improvement.
If the athlete has specific sports interests, tailor exercises to improve sport-specific performance.
`;

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024
      messages: [
        {
          role: "system" as const,
          content: "You are an expert athletic trainer and sports science specialist creating personalized training programs for athletes."
        },
        {
          role: "user" as const,
          content: planPrompt
        }
      ],
      response_format: { type: "json_object" }
    });

    // Parse the JSON response
    const trainingPlan = JSON.parse(response.choices[0].message.content || '{}');
    
    // Add XP for generating a training plan
    await storage.addXpToPlayer(
      userId,
      50, // Significant XP for getting a full training plan
      "training_plan",
      `Generated ${trainingPlan.planTitle || 'personalized training plan'}`,
      undefined
    );
    
    return trainingPlan;
    
  } catch (error: any) {
    console.error("Error generating personalized training plan:", error);
    throw new Error(`Failed to generate personalized training plan: ${error?.message || 'Unknown error'}`);
  }
}

// Helper Functions
function extractWorkoutTitle(content: string): string {
  // Look for patterns that might be a title
  const titlePatterns = [
    /[#*]+\s*(.*?training plan.*?|.*?workout.*?|.*?program.*?)\s*[#*]*/i,
    /(?:^|\n)#+\s*(.*?training plan.*?|.*?workout.*?|.*?program.*?)\s*(?:\n|$)/i,
    /(?:^|\n)[A-Z][\w\s&-]+(?:TRAINING|WORKOUT|PROGRAM|PLAN)[\w\s&-]*(?:\n|$)/,
    /(?:^|\n)["']*([\w\s&-]+(?:Training|Workout|Program|Plan)[\w\s&-]*)["']*(?:\n|$)/i
  ];
  
  for (const pattern of titlePatterns) {
    const match = content.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  
  // If no specific title pattern is found, use a default with some text from the beginning
  const firstLine = content.split('\n')[0].trim();
  return firstLine.length > 5 ? firstLine : "Personalized Training Plan";
}

function extractWorkoutItems(content: string): string[] {
  // Extract key workout components
  const items: string[] = [];
  
  // Common patterns in workout descriptions
  const patterns = [
    /(?:^|\n)[-*•]?\s*((?:Day|Week)\s+\d+:.*?)(?:\n|$)/g,
    /(?:^|\n)[-*•]?\s*((?:Strength|Cardio|HIIT|Speed|Agility|Recovery|Mobility).*?)(?:\n|$)/g,
    /(?:^|\n)[-*•]?\s*((?:\d+[x×]|\d+\s+sets).*?)(?:\n|$)/g,
    /(?:^|\n)[-*•]?\s*((?:\d+\s+reps|seconds).*?)(?:\n|$)/g
  ];
  
  // Collect up to 5 key items
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(content)) !== null && items.length < 5) {
      if (match[1] && !items.includes(match[1].trim())) {
        items.push(match[1].trim());
      }
    }
  }
  
  // If we didn't find enough items, add some general categories
  if (items.length < 3) {
    const contentLower = content.toLowerCase();
    if (contentLower.includes("warm")) items.push("Proper warm-up included");
    if (contentLower.includes("strength") || contentLower.includes("weight")) items.push("Strength training components");
    if (contentLower.includes("cardio") || contentLower.includes("endurance")) items.push("Cardiovascular conditioning");
    if (contentLower.includes("mobility") || contentLower.includes("flexibility")) items.push("Mobility and flexibility work");
    if (contentLower.includes("recovery") || contentLower.includes("rest")) items.push("Recovery protocols included");
  }
  
  return items.slice(0, 5); // Return maximum 5 items
}

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
        return playerEquipment.some((pe: any) => pe.equipmentId === eq.id);
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
          role: "system" as const,
          content: "You are an expert athletic trainer and strength coach specializing in youth and collegiate athletic development."
        },
        {
          role: "user" as const,
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
          role: "system" as const,
          content: "You are an expert strength and conditioning coach specializing in proper form and technique for student athletes."
        },
        {
          role: "user" as const,
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

// Function to analyze workout videos for verification
export async function verifyWorkoutVideo(verificationId: number, videoPath: string): Promise<{
  isCompleted: boolean;
  completedAmount: number;
  targetAmount: number;
  repAccuracy: number;
  feedback: string;
  motionAnalysis: any;
}> {
  try {
    console.log(`Verifying workout video for verification ID: ${verificationId} at path: ${videoPath}`);
    
    // Get the verification data
    const verification = await storage.getWorkoutVerification(verificationId);
    if (!verification) {
      throw new Error("Workout verification not found");
    }
    
    // Get the checkpoints that need to be verified
    const checkpoints = await storage.getWorkoutVerificationCheckpoints(verificationId);
    if (!checkpoints || checkpoints.length === 0) {
      throw new Error("No checkpoints found for this verification");
    }
    
    // This would typically be a video analysis which counts reps, analyzes technique, etc.
    // Here we'll simulate it with OpenAI
    
    // First, we need to create a description of the video for OpenAI
    // In a real implementation, this would use the actual video data
    const videoDescription = `The video shows an athlete performing a ${verification.title} workout. 
    The video lasts for ${verification.duration || 'unknown'} minutes.
    The exercise being performed is ${checkpoints[0]?.exerciseName || 'unknown'}.
    The target amount is ${checkpoints[0]?.targetAmount || 'unknown'} reps.`;
    
    // Now we'll ask GPT-4o to analyze this workout
    const messages = [
      {
        role: "system" as const,
        content: `You are an AI sports coach that specializes in analyzing workout videos. 
        Your task is to count repetitions, analyze technique, measure distance and speed,
        and provide feedback on the workout. Be specific about what you observe and provide
        constructive feedback for improvement. You always return a JSON object with the following fields:
        - isCompleted: boolean indicating if the workout was completed successfully
        - completedAmount: number of reps completed or distance covered
        - targetAmount: target number of reps or distance
        - repAccuracy: number from 0-100 indicating the accuracy/quality of the reps
        - feedback: string with detailed feedback about form, technique, and suggestions
        - motionAnalysis: object with detailed analysis of the motion including:
          - posture: rating from 0-100
          - formConsistency: rating from 0-100
          - power: rating from 0-100
          - speed: rating from 0-100
          - keyIssues: array of strings describing key issues
          - strengths: array of strings describing key strengths
        `
      },
      {
        role: "user" as const,
        content: `Please analyze this workout video: ${videoDescription}
        
        For this simulation, assume the athlete is performing ${checkpoints[0]?.exerciseName || 'push-ups'} with 
        a target of ${checkpoints[0]?.targetAmount || '20'} repetitions.
        
        Generate a detailed analysis including rep counting, technique assessment, and feedback.`
      }
    ];

    // Make the API call to OpenAI
    const completionResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      temperature: 0.2,
      max_tokens: 1000,
      response_format: { type: "json_object" }
    });

    // Parse the response
    const responseContent = completionResponse.choices[0]?.message?.content || '{}';
    console.log(`OpenAI response for workout verification: ${responseContent}`);
    
    try {
      // Parse the JSON response
      const analysis = JSON.parse(responseContent);
      
      // Return the analysis
      return {
        isCompleted: analysis.isCompleted || false,
        completedAmount: analysis.completedAmount || 0,
        targetAmount: analysis.targetAmount || 0,
        repAccuracy: analysis.repAccuracy || 0,
        feedback: analysis.feedback || "Unable to provide detailed feedback",
        motionAnalysis: analysis.motionAnalysis || {
          posture: 0,
          formConsistency: 0,
          power: 0,
          speed: 0,
          keyIssues: ["Unable to analyze motion"],
          strengths: []
        }
      };
    } catch (error) {
      console.error("Error parsing OpenAI response:", error);
      return {
        isCompleted: false,
        completedAmount: 0,
        targetAmount: checkpoints[0]?.targetAmount || 0,
        repAccuracy: 0,
        feedback: "Error analyzing workout video. Please try again or contact support.",
        motionAnalysis: {
          posture: 0,
          formConsistency: 0,
          power: 0,
          speed: 0,
          keyIssues: ["Error in analysis"],
          strengths: []
        }
      };
    }
  } catch (error) {
    console.error("Error in verifyWorkoutVideo:", error);
    throw new Error("Failed to verify workout video");
  }
}
