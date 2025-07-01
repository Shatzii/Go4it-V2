import { storage } from "../storage";
import { alertSystemService } from "./alertSystem";
import type { Log } from "@shared/schema";

interface LogPattern {
  name: string;
  pattern: RegExp;
  severity: "critical" | "high" | "medium" | "low";
  action: string;
}

class LogAnalysisService {
  private logPatterns: LogPattern[] = [
    {
      name: "failed_login",
      pattern: /failed.?login|authentication.?failed|invalid.?credentials/i,
      severity: "medium",
      action: "Monitor for brute force attacks"
    },
    {
      name: "privilege_escalation",
      pattern: /sudo|privilege.?escalation|root.?access|admin.?access/i,
      severity: "high",
      action: "Investigate privilege escalation attempt"
    },
    {
      name: "suspicious_process",
      pattern: /suspicious.?process|malicious.?binary|unknown.?executable/i,
      severity: "high",
      action: "Quarantine suspicious process"
    },
    {
      name: "network_intrusion",
      pattern: /intrusion.?detected|unauthorized.?access|network.?breach/i,
      severity: "critical",
      action: "Isolate affected network segment"
    },
    {
      name: "data_access",
      pattern: /sensitive.?data|confidential|database.?access|file.?access/i,
      severity: "medium",
      action: "Review data access patterns"
    },
    {
      name: "system_error",
      pattern: /system.?error|critical.?error|service.?failure/i,
      severity: "low",
      action: "Check system health"
    }
  ];

  async analyzeLog(log: Log): Promise<void> {
    try {
      // Basic pattern matching
      await this.performPatternAnalysis(log);
      
      // Frequency analysis
      await this.performFrequencyAnalysis(log);
      
      // Anomaly detection
      await this.performAnomalyDetection(log);
      
    } catch (error) {
      console.error("Error analyzing log:", error);
    }
  }

  async performBatchAnalysis(clientId: number, limit = 1000): Promise<void> {
    try {
      console.log(`Performing batch log analysis for client ${clientId}`);
      
      const logs = await storage.getLogs(clientId, limit);
      
      for (const log of logs) {
        await this.analyzeLog(log);
      }
      
      // Generate summary report
      await this.generateAnalysisSummary(clientId, logs);
      
    } catch (error) {
      console.error("Error in batch log analysis:", error);
    }
  }

  private async performPatternAnalysis(log: Log): Promise<void> {
    const message = log.message.toLowerCase();
    
    for (const pattern of this.logPatterns) {
      if (pattern.pattern.test(message)) {
        await this.handlePatternMatch(log, pattern);
        break; // Only match the first pattern to avoid duplicates
      }
    }
  }

  private async handlePatternMatch(log: Log, pattern: LogPattern): Promise<void> {
    // Create alert for significant patterns
    if (pattern.severity === "critical" || pattern.severity === "high") {
      await alertSystemService.createAlert(log.clientId, {
        type: "log_analysis",
        severity: pattern.severity,
        title: `Log Analysis Alert: ${pattern.name}`,
        description: `Pattern "${pattern.name}" detected in logs. ${pattern.action}`
      });
    }

    // Log the analysis result
    await storage.createLog({
      clientId: log.clientId,
      level: "info",
      source: "log_analysis",
      message: `Pattern analysis: ${pattern.name} detected in log ${log.id}`,
      metadata: {
        originalLogId: log.id,
        patternName: pattern.name,
        severity: pattern.severity,
        action: pattern.action
      }
    });
  }

  private async performFrequencyAnalysis(log: Log): Promise<void> {
    // Check for repeated similar messages (potential brute force or DoS)
    const recentLogs = await storage.getLogs(log.clientId, 100);
    
    const similarMessages = recentLogs.filter(recentLog => 
      this.calculateSimilarity(log.message, recentLog.message) > 0.8 &&
      Math.abs(new Date(log.timestamp!).getTime() - new Date(recentLog.timestamp!).getTime()) < 300000 // 5 minutes
    );

    if (similarMessages.length > 10) {
      await alertSystemService.createAlert(log.clientId, {
        type: "frequency_analysis",
        severity: "medium",
        title: "High Frequency Log Pattern Detected",
        description: `${similarMessages.length} similar log messages detected within 5 minutes. Possible automated attack.`
      });
    }
  }

  private async performAnomalyDetection(log: Log): Promise<void> {
    // Check for unusual log sources or levels
    const recentLogs = await storage.getLogs(log.clientId, 1000);
    
    // Analyze log level distribution
    const levelCounts = recentLogs.reduce((acc, l) => {
      acc[l.level] = (acc[l.level] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalLogs = recentLogs.length;
    const errorRate = (levelCounts['error'] || 0) / totalLogs;
    
    // Alert if error rate is unusually high
    if (errorRate > 0.1 && log.level === 'error') { // More than 10% errors
      await alertSystemService.createAlert(log.clientId, {
        type: "log_anomaly",
        severity: "medium",
        title: "High Error Rate Detected",
        description: `Error rate of ${(errorRate * 100).toFixed(1)}% detected in recent logs. Normal baseline exceeded.`
      });
    }

    // Check for unusual log sources
    const sourceCounts = recentLogs.reduce((acc, l) => {
      acc[l.source] = (acc[l.source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const currentSourceCount = sourceCounts[log.source] || 0;
    const avgSourceCount = Object.values(sourceCounts).reduce((a, b) => a + b, 0) / Object.keys(sourceCounts).length;
    
    if (currentSourceCount > avgSourceCount * 3) { // 3x above average
      await storage.createAnomaly({
        clientId: log.clientId,
        type: "log_source_anomaly",
        score: Math.min(100, Math.floor((currentSourceCount / avgSourceCount) * 25)),
        description: `Unusual activity from log source: ${log.source}`,
        metadata: {
          source: log.source,
          count: currentSourceCount,
          avgCount: avgSourceCount
        }
      });
    }
  }

  private async generateAnalysisSummary(clientId: number, logs: Log[]): Promise<void> {
    const summary = {
      totalLogs: logs.length,
      errorCount: logs.filter(l => l.level === 'error').length,
      warningCount: logs.filter(l => l.level === 'warn').length,
      uniqueSources: new Set(logs.map(l => l.source)).size,
      timeRange: {
        start: logs[logs.length - 1]?.timestamp,
        end: logs[0]?.timestamp
      }
    };

    await storage.createLog({
      clientId,
      level: "info",
      source: "log_analysis",
      message: "Log analysis summary generated",
      metadata: summary
    });
  }

  private calculateSimilarity(str1: string, str2: string): number {
    const words1 = str1.toLowerCase().split(/\s+/);
    const words2 = str2.toLowerCase().split(/\s+/);
    
    const set1 = new Set(words1);
    const set2 = new Set(words2);
    
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    
    return intersection.size / union.size;
  }

  async getLogStatistics(clientId: number): Promise<any> {
    const logs = await storage.getLogs(clientId, 1000);
    
    const stats = {
      total: logs.length,
      byLevel: logs.reduce((acc, log) => {
        acc[log.level] = (acc[log.level] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      bySource: logs.reduce((acc, log) => {
        acc[log.source] = (acc[log.source] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      recentActivity: this.getHourlyActivity(logs)
    };

    return stats;
  }

  private getHourlyActivity(logs: Log[]): number[] {
    const hourlyData = new Array(24).fill(0);
    
    logs.forEach(log => {
      const hour = new Date(log.timestamp!).getHours();
      hourlyData[hour]++;
    });

    return hourlyData;
  }
}

export const logAnalysisService = new LogAnalysisService();
