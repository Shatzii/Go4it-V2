import { Request, Response } from "express";
import { storage } from "../storage";

// Interface for installed model tracking
interface InstalledModel {
  modelId: string;
  userId: number;
  installedAt: Date;
  status: 'active' | 'inactive';
}

// In-memory store for installed models (would be a database table in production)
const installedModels: InstalledModel[] = [];

export const aiModelsController = {
  getActiveModels: async (req: Request, res: Response) => {
    try {
      // In a real implementation, this would fetch from database
      const activeModels = [
        {
          id: "1",
          name: "StarCoder",
          description: "Code Generation Model",
          icon: "code",
          status: "active",
          type: "code"
        },
        {
          id: "2",
          name: "Security Auditor",
          description: "Custom-trained Llama 3",
          icon: "security",
          status: "active",
          type: "security"
        },
        {
          id: "3",
          name: "SEO Optimizer",
          description: "Hugging Face Pipeline",
          icon: "analytics",
          status: "inactive",
          type: "seo"
        }
      ];

      res.json(activeModels);
    } catch (error) {
      res.status(500).json({ message: "Error fetching active AI models" });
    }
  },

  getMarketplaceModels: async (req: Request, res: Response) => {
    try {
      // In a real implementation, this would fetch from database
      const marketplaceModels = [
        {
          id: "1",
          name: "Auto-Scale AI",
          description: "Automatically scales your server resources based on real-time traffic patterns and ML predictions.",
          icon: "auto_fix_high",
          type: "Traffic-aware resource scaling",
          memory: "250MB",
          verified: true,
          featured: true,
          badge: "Featured",
          color: "primary",
          status: "inactive"
        },
        {
          id: "2",
          name: "Database Optimizer",
          description: "Analyzes and optimizes database queries using machine learning to improve performance and reduce costs.",
          icon: "schema",
          type: "ML-powered query optimization",
          memory: "480MB",
          verified: true,
          badge: "Popular",
          color: "secondary",
          status: "inactive"
        },
        {
          id: "3",
          name: "Advanced Firewall",
          description: "Uses ML to detect and block sophisticated attack patterns before they can compromise your server.",
          icon: "health_and_safety",
          type: "AI-powered intrusion prevention",
          memory: "320MB",
          verified: true,
          badge: "New",
          color: "accent",
          status: "inactive"
        },
        {
          id: "4",
          name: "Traffic Analyzer",
          description: "Analyzes user traffic patterns and provides actionable insights to optimize your application experience.",
          icon: "insights",
          type: "ML-based user behavior analysis",
          memory: "400MB",
          verified: true,
          badge: "Pro",
          color: "blue",
          status: "inactive"
        }
      ];

      res.json(marketplaceModels);
    } catch (error) {
      res.status(500).json({ message: "Error fetching marketplace AI models" });
    }
  },

  addModel: async (req: Request, res: Response) => {
    try {
      const { name, description, type, icon } = req.body;
      
      // In a real implementation, this would add to database
      const newModel = {
        id: Date.now().toString(),
        name,
        description,
        icon,
        type,
        status: "inactive",
      };

      res.status(201).json(newModel);
    } catch (error) {
      res.status(500).json({ message: "Error adding AI model" });
    }
  },

  updateModel: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { name, description, status, icon, type } = req.body;
      
      // In a real implementation, this would update the database
      const updatedModel = {
        id,
        name,
        description,
        icon,
        type,
        status
      };

      res.json(updatedModel);
    } catch (error) {
      res.status(500).json({ message: "Error updating AI model" });
    }
  },

  deleteModel: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      
      // In a real implementation, this would delete from database
      res.json({ message: "Model deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting AI model" });
    }
  },
  
  /**
   * Install an AI model for the user
   */
  installModel: async (req: Request, res: Response) => {
    try {
      const { modelId } = req.body;
      const userId = (req as any).userId;
      
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      
      // Get user to check permissions
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Check if user's plan allows installing this model
      // Free users can only install basic models (IDs 3 and 4)
      if (user.plan === 'free' && (modelId === '1' || modelId === '2')) {
        return res.status(403).json({ 
          message: "Premium model installation requires an upgraded plan",
          requiresUpgrade: true
        });
      }
      
      // Check if model is already installed
      const alreadyInstalled = installedModels.find(
        model => model.modelId === modelId && model.userId === userId
      );
      
      if (alreadyInstalled) {
        return res.status(409).json({ message: "Model already installed" });
      }
      
      // Install model (simulate installation time)
      setTimeout(() => {
        // Add to installed models
        installedModels.push({
          modelId,
          userId,
          installedAt: new Date(),
          status: 'active'
        });
      }, 1000);
      
      // Return immediate success response
      res.status(202).json({ 
        message: "Model installation started",
        installationStatus: "in_progress"
      });
    } catch (error) {
      console.error("Error installing model:", error);
      res.status(500).json({ 
        message: "Error installing AI model",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  },
  
  /**
   * Get user's installed models
   */
  getInstalledModels: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId;
      
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      
      // Get all marketplace models
      const allModels = [
        {
          id: "1",
          name: "Auto-Scale AI",
          description: "Automatically scales your server resources based on real-time traffic patterns and ML predictions.",
          icon: "auto_fix_high",
          type: "Traffic-aware resource scaling",
          memory: "250MB",
          verified: true,
          featured: true,
          badge: "Featured",
          color: "primary",
          status: "inactive"
        },
        {
          id: "2",
          name: "Database Optimizer",
          description: "Analyzes and optimizes database queries using machine learning to improve performance and reduce costs.",
          icon: "schema",
          type: "ML-powered query optimization",
          memory: "480MB",
          verified: true,
          badge: "Popular",
          color: "secondary",
          status: "inactive"
        },
        {
          id: "3",
          name: "Advanced Firewall",
          description: "Uses ML to detect and block sophisticated attack patterns before they can compromise your server.",
          icon: "health_and_safety",
          type: "AI-powered intrusion prevention",
          memory: "320MB",
          verified: true,
          badge: "New",
          color: "accent",
          status: "inactive"
        },
        {
          id: "4",
          name: "Traffic Analyzer",
          description: "Analyzes user traffic patterns and provides actionable insights to optimize your application experience.",
          icon: "insights",
          type: "ML-based user behavior analysis",
          memory: "400MB",
          verified: true,
          badge: "Pro",
          color: "blue",
          status: "inactive"
        }
      ];
      
      // Filter for only installed models for this user
      const userInstalledModelsIds = installedModels
        .filter(model => model.userId === userId)
        .map(model => model.modelId);
      
      // Combine with full model details
      const userInstalledModels = allModels
        .filter(model => userInstalledModelsIds.includes(model.id))
        .map(model => ({
          ...model,
          status: 'active',
          installedAt: installedModels.find(m => m.modelId === model.id && m.userId === userId)?.installedAt
        }));
      
      res.json(userInstalledModels);
    } catch (error) {
      console.error("Error getting installed models:", error);
      res.status(500).json({ 
        message: "Error retrieving installed AI models",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  }
};
