import { db } from "./server/db";
import { apiKeys } from "./shared/schema";
import { eq } from "drizzle-orm";
import dotenv from "dotenv";

dotenv.config();

async function updateOpenAIKey() {
  try {
    // Get the OpenAI API key from the environment
    const openaiKey = process.env.OPENAI_API_KEY;
    
    if (!openaiKey) {
      console.error("Error: OPENAI_API_KEY environment variable is not set");
      process.exit(1);
    }

    console.log("Found OpenAI API key in environment variables, updating database...");

    // Update the key in the database
    const result = await db
      .update(apiKeys)
      .set({ 
        keyValue: openaiKey,
        lastUsed: new Date(),
        isActive: true
      })
      .where(eq(apiKeys.keyType, "openai"))
      .returning();

    if (result.length > 0) {
      console.log("OpenAI API key updated successfully");
    } else {
      // If no key exists, insert a new one
      const insertResult = await db
        .insert(apiKeys)
        .values({
          keyType: "openai",
          keyValue: openaiKey,
          isActive: true
        })
        .returning();
      
      if (insertResult.length > 0) {
        console.log("OpenAI API key inserted successfully");
      } else {
        console.error("Failed to insert OpenAI API key");
      }
    }

    process.exit(0);
  } catch (error) {
    console.error("Error updating OpenAI API key:", error);
    process.exit(1);
  }
}

updateOpenAIKey();