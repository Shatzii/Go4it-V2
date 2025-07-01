import { apiRequest } from "./queryClient";

/**
 * AI Service that handles interactions with the PharaohAI engine
 */
export const aiService = {
  /**
   * Analyze server logs to identify issues
   */
  async analyzeServerIssue(logContent: string, issueDescription: string) {
    const response = await apiRequest("POST", "/api/ai/analyze-issue", {
      logContent,
      issueDescription
    });
    
    if (!response.ok) {
      throw new Error("Failed to analyze server issue");
    }
    
    return response.json();
  },
  
  /**
   * Perform self-healing on a detected issue
   */
  async performSelfHealing(issue: any, autoFix: boolean = false) {
    const response = await apiRequest("POST", "/api/ai/self-heal", {
      issue,
      autoFix
    });
    
    if (!response.ok) {
      throw new Error("Failed to perform self-healing");
    }
    
    return response.json();
  },
  
  /**
   * Get AI assistance for terminal commands
   */
  async getTerminalAssistance(question: string) {
    const response = await apiRequest("POST", "/api/ai/terminal-assistance", {
      question
    });
    
    if (!response.ok) {
      throw new Error("Failed to get terminal assistance");
    }
    
    return response.json();
  },
  
  /**
   * Get healing events from the database
   */
  async getHealingEvents() {
    const response = await apiRequest("GET", "/api/healing-events");
    
    if (!response.ok) {
      throw new Error("Failed to get healing events");
    }
    
    return response.json();
  },
  
  /**
   * Update healing event status
   */
  async updateHealingEventStatus(eventId: string, status: "complete" | "in-progress" | "pending") {
    const response = await apiRequest("POST", "/api/healing-events/status", {
      eventId,
      status
    });
    
    if (!response.ok) {
      throw new Error("Failed to update healing event status");
    }
    
    return response.json();
  },
  
  /**
   * Analyze security risks in server configuration
   */
  async analyzeSecurityRisks(config: any) {
    const response = await apiRequest("POST", "/api/ai/security-analysis", {
      config
    });
    
    if (!response.ok) {
      throw new Error("Failed to analyze security risks");
    }
    
    return response.json();
  },
  
  /**
   * Detect performance anomalies in server metrics
   */
  async detectPerformanceAnomalies(metrics: any[]) {
    const response = await apiRequest("POST", "/api/ai/performance-anomalies", {
      metrics
    });
    
    if (!response.ok) {
      throw new Error("Failed to detect performance anomalies");
    }
    
    return response.json();
  }
};