import { storage } from "../storage";
import { alertSystemService } from "./alertSystem";

interface AnomalyDetectionModel {
  type: string;
  threshold: number;
  windowSize: number; // in minutes
  description: string;
}

class AnomalyDetectionService {
  private isMonitoring = false;
  private monitoringInterval: NodeJS.Timeout | null = null;
  
  private models: AnomalyDetectionModel[] = [
    {
      type: "login_frequency",
      threshold: 10,
      windowSize: 5,
      description: "Unusual login attempt frequency"
    },
    {
      type: "data_transfer",
      threshold: 1000, // MB
      windowSize: 15,
      description: "Unusual data transfer volume"
    },
    {
      type: "network_connections",
      threshold: 50,
      windowSize: 10,
      description: "Unusual network connection pattern"
    },
    {
      type: "process_creation",
      threshold: 20,
      windowSize: 5,
      description: "Unusual process creation rate"
    },
    {
      type: "file_access",
      threshold: 100,
      windowSize: 10,
      description: "Unusual file access pattern"
    }
  ];

  startMonitoring(): void {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    console.log("Starting anomaly detection monitoring...");
    
    // Monitor every 60 seconds
    this.monitoringInterval = setInterval(() => {
      this.performAnomalyDetection();
    }, 60000);
  }

  stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    this.isMonitoring = false;
    console.log("Stopped anomaly detection monitoring");
  }

  private async performAnomalyDetection(): Promise<void> {
    try {
      const clients = await storage.getClients();
      
      for (const client of clients) {
        await this.detectClientAnomalies(client.id);
      }
    } catch (error) {
      console.error("Error in anomaly detection:", error);
    }
  }

  private async detectClientAnomalies(clientId: number): Promise<void> {
    try {
      // User behavior anomalies
      await this.detectUserBehaviorAnomalies(clientId);
      
      // Network traffic anomalies
      await this.detectNetworkAnomalies(clientId);
      
      // System resource anomalies
      await this.detectSystemAnomalies(clientId);
      
      // Time-based anomalies
      await this.detectTimeBasedAnomalies(clientId);
      
    } catch (error) {
      console.error(`Error detecting anomalies for client ${clientId}:`, error);
    }
  }

  private async detectUserBehaviorAnomalies(clientId: number): Promise<void> {
    // Analyze recent logs for user behavior patterns
    const recentLogs = await storage.getLogs(clientId, 500);
    const timeWindow = 30 * 60 * 1000; // 30 minutes
    const now = new Date().getTime();
    
    // Check for unusual login patterns
    const loginLogs = recentLogs.filter(log => 
      log.message.toLowerCase().includes('login') &&
      now - new Date(log.timestamp!).getTime() < timeWindow
    );

    if (loginLogs.length > 15) {
      const score = Math.min(100, (loginLogs.length / 15) * 60);
      await this.createAnomaly(clientId, {
        type: "unusual_login_frequency",
        score: Math.floor(score),
        description: `${loginLogs.length} login attempts detected in 30 minutes (baseline: 5-10)`,
        metadata: {
          loginCount: loginLogs.length,
          timeWindow: "30min",
          threshold: 15
        }
      });
    }

    // Check for unusual access patterns
    const accessLogs = recentLogs.filter(log => 
      log.message.toLowerCase().includes('access') &&
      now - new Date(log.timestamp!).getTime() < timeWindow
    );

    const uniqueIPs = new Set(
      accessLogs.map(log => this.extractIpFromMessage(log.message)).filter(Boolean)
    );

    if (uniqueIPs.size > 10) {
      const score = Math.min(100, (uniqueIPs.size / 10) * 70);
      await this.createAnomaly(clientId, {
        type: "unusual_access_pattern",
        score: Math.floor(score),
        description: `Access from ${uniqueIPs.size} different IPs in 30 minutes`,
        metadata: {
          uniqueIPs: Array.from(uniqueIPs),
          timeWindow: "30min",
          threshold: 10
        }
      });
    }
  }

  private async detectNetworkAnomalies(clientId: number): Promise<void> {
    const networkNodes = await storage.getNetworkNodes(clientId);
    
    // Simulate network traffic analysis
    for (const node of networkNodes) {
      // Generate random network metrics for simulation
      const connectionCount = Math.floor(Math.random() * 100);
      const dataTransfer = Math.floor(Math.random() * 2000); // MB
      
      // Check for unusual connection patterns
      if (connectionCount > 70) {
        const score = Math.min(100, (connectionCount / 70) * 80);
        await this.createAnomaly(clientId, {
          type: "high_network_connections",
          score: Math.floor(score),
          description: `Node ${node.name} showing ${connectionCount} concurrent connections`,
          metadata: {
            nodeId: node.id,
            nodeName: node.name,
            connectionCount,
            threshold: 70
          }
        });
      }

      // Check for unusual data transfer
      if (dataTransfer > 1500) {
        const score = Math.min(100, (dataTransfer / 1500) * 75);
        await this.createAnomaly(clientId, {
          type: "high_data_transfer",
          score: Math.floor(score),
          description: `Node ${node.name} transferred ${dataTransfer}MB (above normal threshold)`,
          metadata: {
            nodeId: node.id,
            nodeName: node.name,
            dataTransfer,
            threshold: 1500
          }
        });
      }
    }
  }

  private async detectSystemAnomalies(clientId: number): Promise<void> {
    // Simulate system resource monitoring
    const nodes = await storage.getNetworkNodes(clientId);
    
    for (const node of nodes) {
      // Generate random system metrics
      const cpuUsage = Math.random() * 100;
      const memoryUsage = Math.random() * 100;
      const diskUsage = Math.random() * 100;
      
      // Check for resource anomalies
      if (cpuUsage > 90) {
        await this.createAnomaly(clientId, {
          type: "high_cpu_usage",
          score: Math.floor(cpuUsage),
          description: `High CPU usage detected on ${node.name}: ${cpuUsage.toFixed(1)}%`,
          metadata: {
            nodeId: node.id,
            nodeName: node.name,
            cpuUsage: cpuUsage.toFixed(1),
            threshold: 90
          }
        });
      }

      if (memoryUsage > 85) {
        await this.createAnomaly(clientId, {
          type: "high_memory_usage",
          score: Math.floor(memoryUsage),
          description: `High memory usage detected on ${node.name}: ${memoryUsage.toFixed(1)}%`,
          metadata: {
            nodeId: node.id,
            nodeName: node.name,
            memoryUsage: memoryUsage.toFixed(1),
            threshold: 85
          }
        });
      }

      if (diskUsage > 95) {
        await this.createAnomaly(clientId, {
          type: "high_disk_usage",
          score: Math.floor(diskUsage),
          description: `Critical disk usage detected on ${node.name}: ${diskUsage.toFixed(1)}%`,
          metadata: {
            nodeId: node.id,
            nodeName: node.name,
            diskUsage: diskUsage.toFixed(1),
            threshold: 95
          }
        });
      }
    }
  }

  private async detectTimeBasedAnomalies(clientId: number): Promise<void> {
    const now = new Date();
    const hour = now.getHours();
    const dayOfWeek = now.getDay();
    
    // Check for unusual activity during off-hours
    if ((hour < 6 || hour > 22) || dayOfWeek === 0 || dayOfWeek === 6) {
      const recentLogs = await storage.getLogs(clientId, 100);
      const recentActivity = recentLogs.filter(log => 
        new Date().getTime() - new Date(log.timestamp!).getTime() < 60 * 60 * 1000 // 1 hour
      );

      if (recentActivity.length > 20) {
        await this.createAnomaly(clientId, {
          type: "off_hours_activity",
          score: 65,
          description: `High activity detected during off-hours: ${recentActivity.length} events in the last hour`,
          metadata: {
            hour,
            dayOfWeek,
            activityCount: recentActivity.length,
            timeContext: hour < 6 || hour > 22 ? "night" : "weekend"
          }
        });
      }
    }
  }

  private async createAnomaly(clientId: number, anomalyData: {
    type: string;
    score: number;
    description: string;
    metadata?: any;
  }): Promise<void> {
    await storage.createAnomaly({
      clientId,
      ...anomalyData
    });

    // Create alert for high-score anomalies
    if (anomalyData.score > 70) {
      await alertSystemService.createAlert(clientId, {
        type: "anomaly_detected",
        severity: anomalyData.score > 85 ? "high" : "medium",
        title: "Behavioral Anomaly Detected",
        description: anomalyData.description
      });
    }
  }

  private extractIpFromMessage(message: string): string | null {
    const ipRegex = /\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/;
    const match = message.match(ipRegex);
    return match ? match[0] : null;
  }

  async getAnomalyTrends(clientId: number): Promise<any> {
    const anomalies = await storage.getAnomalies(clientId, 200);
    
    // Group by type
    const byType = anomalies.reduce((acc, anomaly) => {
      acc[anomaly.type] = (acc[anomaly.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Group by day for trend analysis
    const byDay = anomalies.reduce((acc, anomaly) => {
      const day = new Date(anomaly.detectedAt!).toDateString();
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Score distribution
    const scoreRanges = {
      low: anomalies.filter(a => a.score < 40).length,
      medium: anomalies.filter(a => a.score >= 40 && a.score < 70).length,
      high: anomalies.filter(a => a.score >= 70).length
    };

    return {
      total: anomalies.length,
      byType,
      byDay,
      scoreRanges,
      averageScore: anomalies.reduce((sum, a) => sum + a.score, 0) / anomalies.length || 0
    };
  }
}

export const anomalyDetectionService = new AnomalyDetectionService();
