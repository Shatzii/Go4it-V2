// A simple script to test OpenAI integration
import OpenAI from "openai";

async function testOpenAI() {
  try {
    console.log("Testing OpenAI API...");
    
    // Get API key from environment
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY environment variable is not set");
    }
    
    // Initialize OpenAI client
    const client = new OpenAI({ apiKey });
    
    // Test with a simple prompt
    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system", 
          content: "You are a sports highlight analyzer."
        },
        { 
          role: "user", 
          content: "Generate a highlight description for a basketball game" 
        }
      ],
      max_tokens: 150
    });
    
    console.log("OpenAI API response received:");
    console.log(response.choices[0].message.content);
    
    return true;
  } catch (error) {
    console.error("Error testing OpenAI:", error);
    return false;
  }
}

async function main() {
  const success = await testOpenAI();
  console.log("Test completed successfully:", success);
}

main().catch(console.error);