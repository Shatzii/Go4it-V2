import { storage } from "../storage";
import { alertSystemService } from "./alertSystem";

interface ThreatIndicator {
  type: string;
  pattern: RegExp;
  severity: "critical" | "high" | "medium" | "low";
  description: string;
}

class ThreatDetectionService {
  private isMonitoring = false;
  private monitoringInterval: NodeJS.Timeout | null = null;

  private threatIndicators: ThreatIndicator[] = [
    {
      type: "malware",
      pattern: /malware|virus|trojan|ransomware|backdoor/i,
      severity: "critical",
      description: "Malware signature detected"
    },
    {
      type: "intrusion",
      pattern: /unauthorized|breach|intrusion|exploit/i,
      severity: "high",
      description: "Potential intrusion attempt"
    },
    {
      type: "suspicious_activity",
      pattern: /suspicious|anomalous|unusual/i,
      severity: "medium",
      description: "Suspicious activity detected"
    },
    {
      type: "port_scan",
      pattern: /port.?scan|scanning|reconnaissance/i,
      severity: "medium",
      description: "Port scanning activity detected"
    },
    {
      type: "data_exfiltration",
      pattern: /exfiltration|data.?theft|unauthorized.?transfer/i,
      severity: "critical",
      description: "Potential data exfiltration detected"
    }
  ];

  startMonitoring(): void {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    console.log("Starting threat detection monitoring...");
    
    // Monitor every 30 seconds
    this.monitoringInterval = setInterval(() => {
      this.performPeriodicThreatDetection();
    }, 30000);
  }

  stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    this.isMonitoring = false;
    console.log("Stopped threat detection monitoring");
  }

  async performThreatScan(clientId: number): Promise<void> {
    console.log(`Performing threat scan for client ${clientId}`);
    
    try {
      // Get recent logs to analyze
      const recentLogs = await storage.getLogs(clientId, 100);
      
      for (const log of recentLogs) {
        await this.analyzeLogForThreats(clientId, log);
      }
      
      // Simulate network traffic analysis
      await this.analyzeNetworkTraffic(clientId);
      
      // Check for known threat signatures
      await this.checkThreatIntelligence(clientId);
      
    } catch (error) {
      console.error("Error performing threat scan:", error);
    }
  }

  private async performPeriodicThreatDetection(): Promise<void> {
    try {
      // Get all active clients
      const clients = await storage.getClients();
      
      for (const client of clients) {
        // Simulate random threat detection
        if (Math.random() < 0.1) { // 10% chance per cycle
          await this.generateSimulatedThreat(client.id);
        }
      }
    } catch (error) {
      console.error("Error in periodic threat detection:", error);
    }
  }

  private async analyzeLogForThreats(clientId: number, log: any): Promise<void> {
    const message = log.message.toLowerCase();
    
    for (const indicator of this.threatIndicators) {
      if (indicator.pattern.test(message)) {
        await this.createThreatFromIndicator(clientId, indicator, log);
        break;
      }
    }
  }

  private async analyzeNetworkTraffic(clientId: number): Promise<void> {
    // Simulate network traffic analysis
    const networkNodes = await storage.getNetworkNodes(clientId);
    
    for (const node of networkNodes) {
      // Check for suspicious network patterns
      if (Math.random() < 0.05) { // 5% chance of finding suspicious activity
        await storage.createThreat({
          clientId,
          type: "network_anomaly",
          severity: "medium",
          title: `Suspicious network activity on ${node.name}`,
          description: `Unusual network patterns detected on ${node.ipAddress}`,
          sourceIp: node.ipAddress,
          targetIp: "external"
        });

        await alertSystemService.createAlert(clientId, {
          type: "network_threat",
          severity: "medium",
          title: "Network Anomaly Detected",
          description: `Suspicious activity detected on ${node.name} (${node.ipAddress})`
        });
      }
    }
  }

  private async checkThreatIntelligence(clientId: number): Promise<void> {
    // Simulate threat intelligence feed analysis
    const threatFeeds = [
      { ip: "203.0.113.45", type: "known_malicious", severity: "high" },
      { ip: "198.51.100.77", type: "botnet", severity: "critical" },
      { ip: "192.0.2.123", type: "phishing", severity: "medium" }
    ];

    for (const threat of threatFeeds) {
      if (Math.random() < 0.03) { // 3% chance of matching threat intel
        await storage.createThreat({
          clientId,
          type: threat.type,
          severity: threat.severity as any,
          title: `Threat Intelligence Match: ${threat.type}`,
          description: `Known malicious IP ${threat.ip} detected in network traffic`,
          sourceIp: threat.ip,
          targetIp: "internal"
        });

        await alertSystemService.createAlert(clientId, {
          type: "threat_intelligence",
          severity: threat.severity as any,
          title: "Threat Intelligence Alert",
          description: `Communication with known malicious IP ${threat.ip} detected`
        });
      }
    }
  }

  private async createThreatFromIndicator(
    clientId: number, 
    indicator: ThreatIndicator, 
    log: any
  ): Promise<void> {
    await storage.createThreat({
      clientId,
      type: indicator.type,
      severity: indicator.severity,
      title: indicator.description,
      description: `Detected in log: ${log.message}`,
      sourceIp: this.extractIpFromLog(log.message),
      targetIp: "internal"
    });

    await alertSystemService.createAlert(clientId, {
      type: "threat_detected",
      severity: indicator.severity,
      title: `Threat Detected: ${indicator.type}`,
      description: indicator.description
    });
  }

  private async generateSimulatedThreat(clientId: number): Promise<void> {
    const simulatedThreats = [
      {
        type: "login_anomaly",
        severity: "medium" as const,
        title: "Suspicious Login Attempt",
        description: "Multiple failed login attempts detected from unusual location",
        sourceIp: this.generateRandomIp()
      },
      {
        type: "port_scan",
        severity: "medium" as const,
        title: "Port Scan Detected",
        description: "External port scanning activity detected",
        sourceIp: this.generateRandomIp()
      },
      {
        type: "malware",
        severity: "high" as const,
        title: "Malware Signature Detected",
        description: "Known malware signature found in network traffic",
        sourceIp: this.generateRandomIp()
      }
    ];

    const threat = simulatedThreats[Math.floor(Math.random() * simulatedThreats.length)];
    
    await storage.createThreat({
      clientId,
      ...threat,
      targetIp: "internal"
    });

    await alertSystemService.createAlert(clientId, {
      type: "threat_detected",
      severity: threat.severity,
      title: threat.title,
      description: threat.description
    });
  }

  private extractIpFromLog(message: string): string | undefined {
    const ipRegex = /\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/;
    const match = message.match(ipRegex);
    return match ? match[0] : undefined;
  }

  private generateRandomIp(): string {
    return [
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256)
    ].join('.');
  }
}

export const threatDetectionService = new ThreatDetectionService();
