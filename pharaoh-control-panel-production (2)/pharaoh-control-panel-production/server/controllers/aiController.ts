import { Request, Response } from "express";
import { aiEngine } from "../ai/engine";
import { db } from "../db";
import { healingEvents } from "@shared/schema";
import { desc, eq } from "drizzle-orm";

/**
 * This controller handles all AI-powered functionality in the server
 */
export const aiController = {
  /**
   * Analyze server logs for root cause analysis
   */
  analyzeServerIssue: async (req: Request, res: Response) => {
    try {
      const { logContent, issueDescription } = req.body;
      
      if (!logContent || !issueDescription) {
        return res.status(400).json({ error: "Log content and issue description are required" });
      }
      
      const analysis = await aiEngine.analyzeServerIssue(logContent, issueDescription);
      return res.json({ analysis });
    } catch (error) {
      console.error("Error in analyzeServerIssue:", error);
      return res.status(500).json({ error: "Failed to analyze server issue" });
    }
  },
  
  /**
   * Apply self-healing to detected issues
   */
  performSelfHealing: async (req: Request, res: Response) => {
    try {
      const { issue, autoFix = false } = req.body;
      
      if (!issue) {
        return res.status(400).json({ error: "Issue details are required" });
      }
      
      const healingResult = await aiEngine.performSelfHealing(issue, autoFix);
      return res.json({ healingResult });
    } catch (error) {
      console.error("Error in performSelfHealing:", error);
      return res.status(500).json({ error: "Failed to perform self-healing" });
    }
  },
  
  /**
   * Detect performance anomalies from server metrics
   */
  detectPerformanceAnomalies: async (req: Request, res: Response) => {
    try {
      const { metrics } = req.body;
      
      if (!metrics || !Array.isArray(metrics)) {
        return res.status(400).json({ error: "Valid metrics array is required" });
      }
      
      const anomalies = await aiEngine.detectPerformanceAnomalies(metrics);
      return res.json({ anomalies });
    } catch (error) {
      console.error("Error in detectPerformanceAnomalies:", error);
      return res.status(500).json({ error: "Failed to detect performance anomalies" });
    }
  },
  
  /**
   * Analyze security vulnerabilities in server configuration
   */
  analyzeSecurityRisks: async (req: Request, res: Response) => {
    try {
      const { config } = req.body;
      
      if (!config) {
        return res.status(400).json({ error: "Server configuration is required" });
      }
      
      const securityAnalysis = await aiEngine.analyzeSecurityRisks(config);
      return res.json({ securityAnalysis });
    } catch (error) {
      console.error("Error in analyzeSecurityRisks:", error);
      return res.status(500).json({ error: "Failed to analyze security risks" });
    }
  },
  
  /**
   * Get AI assistance for terminal commands
   */
  getTerminalAssistance: async (req: Request, res: Response) => {
    try {
      const { question } = req.body;
      
      if (!question) {
        return res.status(400).json({ error: "Question is required" });
      }
      
      const response = await aiEngine.getTerminalAssistance(question);
      return res.json({ response });
    } catch (error) {
      console.error("Error in getTerminalAssistance:", error);
      return res.status(500).json({ error: "Failed to get terminal assistance" });
    }
  },

  /**
   * Get healing events from the database
   */
  getHealingEvents: async (req: Request, res: Response) => {
    try {
      const events = await db.select().from(healingEvents).orderBy(desc(healingEvents.timestamp)).limit(10);
      
      // Format the events for the frontend
      const formattedEvents = events.map(event => ({
        id: event.id.toString(),
        title: event.title,
        description: event.description,
        type: event.type,
        status: event.status,
        timestamp: event.timestamp ? new Date(event.timestamp).toLocaleString() : "Just now"
      }));
      
      return res.json({ events: formattedEvents });
    } catch (error) {
      console.error("Error in getHealingEvents:", error);
      return res.status(500).json({ error: "Failed to get healing events" });
    }
  },

  /**
   * Update the status of a healing event
   */
  updateHealingEventStatus: async (req: Request, res: Response) => {
    try {
      const { eventId, status } = req.body;
      
      if (!eventId || !status) {
        return res.status(400).json({ error: "Event ID and status are required" });
      }
      
      if (!["complete", "in-progress", "pending"].includes(status)) {
        return res.status(400).json({ error: "Invalid status. Must be 'complete', 'in-progress', or 'pending'" });
      }
      
      const [updatedEvent] = await db
        .update(healingEvents)
        .set({ status })
        .where(eq(healingEvents.id, parseInt(eventId)))
        .returning();
        
      if (!updatedEvent) {
        return res.status(404).json({ error: "Healing event not found" });
      }
      
      return res.json({ event: updatedEvent });
    } catch (error) {
      console.error("Error in updateHealingEventStatus:", error);
      return res.status(500).json({ error: "Failed to update healing event status" });
    }
  }
};