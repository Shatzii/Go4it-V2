import { storage } from "../storage";
import { alertSystemService } from "./alertSystem";

interface NetworkScanResult {
  ip: string;
  hostname?: string;
  openPorts: number[];
  services: string[];
  status: "online" | "offline" | "filtered";
  responseTime: number;
}

class NetworkMonitorService {
  private isMonitoring = false;
  private monitoringInterval: NodeJS.Timeout | null = null;

  startMonitoring(): void {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    console.log("Starting network monitoring...");
    
    // Monitor every 2 minutes
    this.monitoringInterval = setInterval(() => {
      this.performNetworkMonitoring();
    }, 120000);
  }

  stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    this.isMonitoring = false;
    console.log("Stopped network monitoring");
  }

  async scanNetwork(clientId: number): Promise<void> {
    console.log(`Performing network scan for client ${clientId}`);
    
    try {
      // Get existing network nodes
      const existingNodes = await storage.getNetworkNodes(clientId);
      
      // Simulate network discovery
      await this.performNetworkDiscovery(clientId, existingNodes);
      
      // Perform port scans
      await this.performPortScans(clientId, existingNodes);
      
      // Check for unauthorized devices
      await this.detectUnauthorizedDevices(clientId, existingNodes);
      
      // Analyze network traffic patterns
      await this.analyzeNetworkTraffic(clientId);
      
    } catch (error) {
      console.error("Error performing network scan:", error);
    }
  }

  private async performNetworkMonitoring(): Promise<void> {
    try {
      const clients = await storage.getClients();
      
      for (const client of clients) {
        await this.monitorClientNetwork(client.id);
      }
    } catch (error) {
      console.error("Error in network monitoring:", error);
    }
  }

  private async monitorClientNetwork(clientId: number): Promise<void> {
    const nodes = await storage.getNetworkNodes(clientId);
    
    for (const node of nodes) {
      // Simulate ping/health check
      const isOnline = Math.random() > 0.05; // 95% uptime simulation
      const newStatus = isOnline ? "online" : "offline";
      
      if (node.status !== newStatus) {
        await storage.updateNodeStatus(node.id, newStatus);
        
        if (!isOnline) {
          await alertSystemService.createAlert(clientId, {
            type: "network_node_down",
            severity: "medium",
            title: `Network Node Offline`,
            description: `Node ${node.name} (${node.ipAddress}) is no longer responding`
          });
        }
      }

      // Simulate detection of suspicious activity
      if (Math.random() < 0.02) { // 2% chance
        await this.detectSuspiciousActivity(clientId, node);
      }
    }
  }

  private async performNetworkDiscovery(clientId: number, existingNodes: any[]): Promise<void> {
    // Simulate discovery of new devices
    const commonIpRanges = [
      "192.168.1",
      "192.168.0",
      "10.0.0",
      "172.16.0"
    ];

    for (const range of commonIpRanges) {
      // Simulate scanning a few IPs in each range
      for (let i = 1; i <= 5; i++) {
        const ip = `${range}.${100 + i}`;
        
        // Check if this IP is already known
        const existingNode = existingNodes.find(node => node.ipAddress === ip);
        
        if (!existingNode && Math.random() < 0.1) { // 10% chance of finding new device
          const deviceTypes = ["workstation", "server", "printer", "router", "switch"];
          const deviceType = deviceTypes[Math.floor(Math.random() * deviceTypes.length)];
          
          await storage.createNetworkNode({
            clientId,
            name: `${deviceType}-${ip.split('.').pop()}`,
            ipAddress: ip,
            nodeType: deviceType,
            status: "online"
          });

          await alertSystemService.createAlert(clientId, {
            type: "new_device_detected",
            severity: "medium",
            title: "New Device Detected",
            description: `New ${deviceType} detected at ${ip}. Please verify if this is authorized.`
          });
        }
      }
    }
  }

  private async performPortScans(clientId: number, nodes: any[]): Promise<void> {
    const commonPorts = [22, 23, 25, 53, 80, 110, 143, 443, 993, 995, 3389, 5432, 3306];
    
    for (const node of nodes) {
      const scanResult = await this.simulatePortScan(node.ipAddress);
      
      // Check for unexpected open ports
      const unexpectedPorts = scanResult.openPorts.filter(port => 
        !this.isExpectedPort(port, node.nodeType)
      );

      if (unexpectedPorts.length > 0) {
        await alertSystemService.createAlert(clientId, {
          type: "unexpected_open_ports",
          severity: "medium",
          title: "Unexpected Open Ports Detected",
          description: `Node ${node.name} has unexpected open ports: ${unexpectedPorts.join(', ')}`
        });

        // Log the scan results
        await storage.createLog({
          clientId,
          level: "warn",
          source: "network_monitor",
          message: `Port scan detected unexpected ports on ${node.name}`,
          metadata: {
            nodeId: node.id,
            ipAddress: node.ipAddress,
            openPorts: scanResult.openPorts,
            unexpectedPorts
          }
        });
      }
    }
  }

  private async simulatePortScan(ip: string): Promise<NetworkScanResult> {
    const commonPorts = [22, 23, 25, 53, 80, 110, 143, 443, 993, 995, 3389, 5432, 3306];
    const openPorts: number[] = [];
    
    // Simulate random open ports
    for (const port of commonPorts) {
      if (Math.random() < 0.3) { // 30% chance each port is open
        openPorts.push(port);
      }
    }

    return {
      ip,
      openPorts,
      services: openPorts.map(port => this.getServiceForPort(port)),
      status: "online",
      responseTime: Math.floor(Math.random() * 100) + 1
    };
  }

  private isExpectedPort(port: number, nodeType: string): boolean {
    const expectedPorts: Record<string, number[]> = {
      "server": [22, 80, 443, 3306, 5432],
      "workstation": [22, 3389],
      "router": [22, 23, 80, 443],
      "printer": [80, 443, 9100],
      "switch": [22, 23, 80, 443]
    };

    return expectedPorts[nodeType]?.includes(port) || false;
  }

  private getServiceForPort(port: number): string {
    const services: Record<number, string> = {
      22: "SSH",
      23: "Telnet",
      25: "SMTP",
      53: "DNS",
      80: "HTTP",
      110: "POP3",
      143: "IMAP",
      443: "HTTPS",
      993: "IMAPS",
      995: "POP3S",
      3389: "RDP",
      3306: "MySQL",
      5432: "PostgreSQL",
      9100: "Print"
    };

    return services[port] || "Unknown";
  }

  private async detectUnauthorizedDevices(clientId: number, knownNodes: any[]): Promise<void> {
    // Simulate detection of unauthorized devices
    if (Math.random() < 0.05) { // 5% chance
      const suspiciousIp = this.generateRandomIp();
      const existingNode = knownNodes.find(node => node.ipAddress === suspiciousIp);
      
      if (!existingNode) {
        await alertSystemService.createAlert(clientId, {
          type: "unauthorized_device",
          severity: "high",
          title: "Unauthorized Device Detected",
          description: `Unknown device detected at ${suspiciousIp}. Device is not in authorized device list.`
        });

        await storage.createLog({
          clientId,
          level: "error",
          source: "network_monitor",
          message: `Unauthorized device detected: ${suspiciousIp}`,
          metadata: {
            ipAddress: suspiciousIp,
            detectionMethod: "network_scan",
            requiresInvestigation: true
          }
        });
      }
    }
  }

  private async analyzeNetworkTraffic(clientId: number): Promise<void> {
    // Simulate traffic analysis
    const trafficPatterns = [
      {
        type: "bandwidth_spike",
        severity: "medium" as const,
        description: "Unusual bandwidth usage detected"
      },
      {
        type: "suspicious_connections",
        severity: "high" as const,
        description: "Connections to known malicious IPs detected"
      },
      {
        type: "data_exfiltration",
        severity: "critical" as const,
        description: "Potential data exfiltration pattern detected"
      }
    ];

    // Random chance of detecting traffic anomaly
    if (Math.random() < 0.03) { // 3% chance
      const pattern = trafficPatterns[Math.floor(Math.random() * trafficPatterns.length)];
      
      await alertSystemService.createAlert(clientId, {
        type: "network_traffic_anomaly",
        severity: pattern.severity,
        title: "Network Traffic Anomaly",
        description: pattern.description
      });

      await storage.createAnomaly({
        clientId,
        type: pattern.type,
        score: pattern.severity === "critical" ? 90 : pattern.severity === "high" ? 75 : 60,
        description: pattern.description,
        metadata: {
          detectionMethod: "traffic_analysis",
          timestamp: new Date().toISOString()
        }
      });
    }
  }

  private async detectSuspiciousActivity(clientId: number, node: any): Promise<void> {
    const activities = [
      "Unusual outbound connections detected",
      "Port scanning activity originating from this node",
      "High volume of failed authentication attempts",
      "Suspicious process network activity",
      "Communication with known command & control servers"
    ];

    const activity = activities[Math.floor(Math.random() * activities.length)];
    
    await alertSystemService.createAlert(clientId, {
      type: "suspicious_network_activity",
      severity: "medium",
      title: `Suspicious Activity on ${node.name}`,
      description: activity
    });

    await storage.updateNodeStatus(node.id, "warning");
  }

  private generateRandomIp(): string {
    return [
      192,
      168,
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256)
    ].join('.');
  }

  async getNetworkStatistics(clientId: number): Promise<any> {
    const nodes = await storage.getNetworkNodes(clientId);
    
    const stats = {
      totalNodes: nodes.length,
      onlineNodes: nodes.filter(n => n.status === "online").length,
      offlineNodes: nodes.filter(n => n.status === "offline").length,
      warningNodes: nodes.filter(n => n.status === "warning").length,
      compromisedNodes: nodes.filter(n => n.status === "compromised").length,
      nodeTypes: nodes.reduce((acc, node) => {
        acc[node.nodeType] = (acc[node.nodeType] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };

    return stats;
  }
}

export const networkMonitorService = new NetworkMonitorService();
