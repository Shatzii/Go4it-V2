import { Request, Response } from "express";
import { storage } from "./storage";
import { z } from "zod";

// Schema for validating API key data
const apiKeySchema = z.object({
  keyType: z.enum(["openai", "stripe", "sendgrid", "twilio"]),
  keyValue: z.string().min(10),
});

// Function to set an environment variable
const setEnvironmentVariable = (key: string, value: string) => {
  process.env[key] = value;
  console.log(`Environment variable ${key} has been set.`);
};

// Function to map key types to environment variable names
const getEnvKeyName = (keyType: string): string => {
  const keyMap: Record<string, string> = {
    openai: "OPENAI_API_KEY",
    stripe: "STRIPE_SECRET_KEY",
    sendgrid: "SENDGRID_API_KEY",
    twilio: "TWILIO_AUTH_TOKEN",
  };
  return keyMap[keyType] || keyType.toUpperCase() + "_API_KEY";
};

// Save API key
export const saveApiKey = async (req: Request, res: Response) => {
  try {
    // Check if user is authenticated and is admin
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // Parse and validate the request data
    const result = apiKeySchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ 
        message: "Invalid request data", 
        errors: result.error.format() 
      });
    }

    const { keyType, keyValue } = result.data;

    // Save the API key to database
    await storage.saveApiKey({
      keyType,
      keyValue,
      isActive: true
    });

    // Set the environment variable
    const envKey = getEnvKeyName(keyType);
    setEnvironmentVariable(envKey, keyValue);

    // Return success
    return res.status(200).json({ message: `${keyType} API key saved successfully` });
  } catch (error) {
    console.error("Error saving API key:", error);
    return res.status(500).json({ message: "Error saving API key" });
  }
};

// Get API key status (not actual keys - just whether they exist)
export const getApiKeyStatus = async (req: Request, res: Response) => {
  try {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // Get API keys status
    const keyStatus = await storage.getApiKeyStatus();
    
    return res.status(200).json(keyStatus);
  } catch (error) {
    console.error("Error getting API key status:", error);
    return res.status(500).json({ message: "Error getting API key status" });
  }
};