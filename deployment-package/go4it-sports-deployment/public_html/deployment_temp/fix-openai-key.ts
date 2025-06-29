import { db } from "./server/db";
import { apiKeys } from "./shared/schema";
import { eq } from "drizzle-orm";
import dotenv from "dotenv";

dotenv.config();

async function fixOpenAIKey() {
  try {
    // Get the OpenAI API key from the environment variable
    const openaiKey = process.env.OPENAI_API_KEY;
    
    if (!openaiKey) {
      console.error("Error: OPENAI_API_KEY environment variable is not set");
      process.exit(1);
    }

    console.log("Found OpenAI API key in environment variables, updating database...");
    console.log("API Key:", openaiKey.substring(0, 3) + "..." + openaiKey.substring(openaiKey.length - 4));

    // First, check if a key exists
    const existingKeys = await db
      .select()
      .from(apiKeys)
      .where(eq(apiKeys.keyType, "openai"));

    if (existingKeys.length > 0) {
      // Update the existing key
      const result = await db
        .update(apiKeys)
        .set({ 
          keyValue: openaiKey,
          lastUsed: new Date(),
          isActive: true
        })
        .where(eq(apiKeys.keyType, "openai"))
        .returning();

      console.log("Updated existing OpenAI API key in database");
    } else {
      // Insert a new key
      const insertResult = await db
        .insert(apiKeys)
        .values({
          keyType: "openai",
          keyValue: openaiKey,
          isActive: true
        })
        .returning();
      
      console.log("Inserted new OpenAI API key into database");
    }

    process.exit(0);
  } catch (error) {
    console.error("Error fixing OpenAI API key:", error);
    process.exit(1);
  }
}

fixOpenAIKey();