// Simple test for OpenAI-based highlight generation
// This version avoids the schema imports to simplify testing

import OpenAI from "openai";

async function testHighlightGenerator() {
  try {
    console.log("Testing highlight generator with OpenAI...");
    
    // Check for API key
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY environment variable not set");
    }
    
    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    
    // Test video metadata (simulated)
    const video = {
      id: 1,
      title: "Basketball Championship Final",
      sportType: "basketball",
      duration: 180 // 3 minutes
    };
    
    // Create a prompt that describes the video and asks for highlight moments
    const prompt = `
      Analyze this ${video.sportType} video: "${video.title}".
      Imagine you are watching a ${video.sportType} game or performance and identify 2-3 key highlights.
      For each highlight, provide:
      1. A title
      2. Start and end times (in seconds, between 0 and ${video.duration})
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
    
    console.log("Sending request to OpenAI...");
    
    // Get analysis from OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024
      messages: [
        { role: "system", content: "You are a sports video analyst specializing in highlight detection." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });
    
    // Parse the response
    const result = JSON.parse(response.choices[0].message.content);
    
    console.log("OpenAI Response:");
    console.log(JSON.stringify(result, null, 2));
    
    console.log(`✅ Success! Detected ${result.highlights.length} potential highlights`);
    
    return result;
  } catch (error) {
    console.error("❌ Error in highlight generator test:", error);
    return null;
  }
}

// Run the test
testHighlightGenerator();