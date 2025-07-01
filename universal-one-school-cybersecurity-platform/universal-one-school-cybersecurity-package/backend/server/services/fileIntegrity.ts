import { storage } from "../storage";
import { alertSystemService } from "./alertSystem";
import crypto from "crypto";

interface FileIntegrityRule {
  path: string;
  type: string;
  importance: "critical" | "high" | "medium" | "low";
  checkInterval: number; // in minutes
}

class FileIntegrityService {
  private isMonitoring = false;
  private monitoringInterval: NodeJS.Timeout | null = null;
  
  private criticalFiles: FileIntegrityRule[] = [
    {
      path: "/etc/passwd",
      type: "system_file",
      importance: "critical",
      checkInterval: 5
    },
    {
      path: "/etc/shadow",
      type: "system_file",
      importance: "critical",
      checkInterval: 5
    },
    {
      path: "/etc/hosts",
      type: "system_file",
      importance: "high",
      checkInterval: 10
    },
    {
      path: "/var/www/config.php",
      type: "application_config",
      importance: "high",
      checkInterval: 15
    },
    {
      path: "/home/user/.ssh/authorized_keys",
      type: "security_file",
      importance: "critical",
      checkInterval: 5
    },
    {
      path: "/etc/crontab",
      type: "system_file",
      importance: "high",
      checkInterval: 10
    }
  ];

  startMonitoring(): void {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    console.log("Starting file integrity monitoring...");
    
    // Monitor every 5 minutes
    this.monitoringInterval = setInterval(() => {
      this.performFileIntegrityCheck();
    }, 300000);
  }

  stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    this.isMonitoring = false;
    console.log("Stopped file integrity monitoring");
  }

  async performIntegrityCheck(clientId: number): Promise<void> {
    console.log(`Performing file integrity check for client ${clientId}`);
    
    try {
      // Check critical files
      for (const fileRule of this.criticalFiles) {
        await this.checkFileIntegrity(clientId, fileRule);
      }
      
      // Scan for suspicious new files
      await this.scanForSuspiciousFiles(clientId);
      
      // Check for modified system binaries
      await this.checkSystemBinaries(clientId);
      
      // Monitor configuration files
      await this.monitorConfigFiles(clientId);
      
    } catch (error) {
      console.error("Error performing file integrity check:", error);
    }
  }

  private async performFileIntegrityCheck(): Promise<void> {
    try {
      const clients = await storage.getClients();
      
      for (const client of clients) {
        await this.performIntegrityCheck(client.id);
      }
    } catch (error) {
      console.error("Error in periodic file integrity check:", error);
    }
  }

  private async checkFileIntegrity(clientId: number, fileRule: FileIntegrityRule): Promise<void> {
    try {
      // Get existing file record
      const existingChecks = await storage.getFileIntegrityChecks(clientId);
      const existingCheck = existingChecks.find(check => check.filePath === fileRule.path);
      
      // Simulate file content and checksum
      const fileExists = Math.random() > 0.05; // 95% chance file exists
      
      if (!fileExists) {
        // File deleted
        if (existingCheck && existingCheck.status !== "deleted") {
          await storage.updateFileStatus(existingCheck.id, "deleted");
          
          await alertSystemService.createAlert(clientId, {
            type: "file_deleted",
            severity: fileRule.importance === "critical" ? "critical" : "high",
            title: "Critical File Deleted",
            description: `Important file deleted: ${fileRule.path}`
          });
        }
        return;
      }

      // Generate simulated checksum
      const newChecksum = this.generateSimulatedChecksum(fileRule.path);
      
      if (existingCheck) {
        // Compare checksums
        if (existingCheck.checksum !== newChecksum) {
          await storage.updateFileStatus(existingCheck.id, "modified");
          
          await alertSystemService.createAlert(clientId, {
            type: "file_modified",
            severity: fileRule.importance === "critical" ? "high" : "medium",
            title: "File Modification Detected",
            description: `File ${fileRule.path} has been modified unexpectedly`
          });

          await storage.createLog({
            clientId,
            level: "warn",
            source: "file_integrity",
            message: `File modification detected: ${fileRule.path}`,
            metadata: {
              filePath: fileRule.path,
              oldChecksum: existingCheck.checksum,
              newChecksum,
              importance: fileRule.importance
            }
          });
        } else {
          // File unchanged
          await storage.updateFileStatus(existingCheck.id, "unchanged");
        }
      } else {
        // New file to monitor
        await storage.createFileIntegrityCheck({
          clientId,
          filePath: fileRule.path,
          fileType: fileRule.type,
          checksum: newChecksum,
          status: "unchanged"
        });
      }
    } catch (error) {
      console.error(`Error checking file integrity for ${fileRule.path}:`, error);
    }
  }

  private async scanForSuspiciousFiles(clientId: number): Promise<void> {
    const suspiciousPatterns = [
      "/tmp/malware.exe",
      "/var/tmp/suspicious_script.sh",
      "/home/user/backdoor.py",
      "/usr/local/bin/keylogger",
      "/etc/cron.d/malicious_task"
    ];

    for (const suspiciousPath of suspiciousPatterns) {
      // Random chance of finding suspicious file
      if (Math.random() < 0.02) { // 2% chance
        const checksum = this.generateSimulatedChecksum(suspiciousPath);
        
        await storage.createFileIntegrityCheck({
          clientId,
          filePath: suspiciousPath,
          fileType: "suspicious_file",
          checksum,
          status: "quarantined"
        });

        await alertSystemService.createAlert(clientId, {
          type: "suspicious_file_detected",
          severity: "critical",
          title: "Suspicious File Detected",
          description: `Potentially malicious file found: ${suspiciousPath}. File has been quarantined.`
        });

        await storage.createThreat({
          clientId,
          type: "malware",
          severity: "high",
          title: "Malicious File Detected",
          description: `Suspicious file found and quarantined: ${suspiciousPath}`,
          sourceIp: "local",
          targetIp: "local"
        });
      }
    }
  }

  private async checkSystemBinaries(clientId: number): Promise<void> {
    const systemBinaries = [
      "/bin/bash",
      "/bin/sh",
      "/usr/bin/sudo",
      "/bin/login",
      "/usr/bin/passwd",
      "/sbin/init"
    ];

    for (const binary of systemBinaries) {
      // Simulate binary integrity check
      if (Math.random() < 0.01) { // 1% chance of detecting compromised binary
        await storage.createFileIntegrityCheck({
          clientId,
          filePath: binary,
          fileType: "system_binary",
          checksum: this.generateSimulatedChecksum(binary),
          status: "modified"
        });

        await alertSystemService.createAlert(clientId, {
          type: "system_binary_compromised",
          severity: "critical",
          title: "System Binary Compromised",
          description: `Critical system binary has been modified: ${binary}. This may indicate rootkit installation.`
        });

        await storage.createThreat({
          clientId,
          type: "rootkit",
          severity: "critical",
          title: "Potential Rootkit Detected",
          description: `System binary modification detected: ${binary}`,
          sourceIp: "local",
          targetIp: "local"
        });
      }
    }
  }

  private async monitorConfigFiles(clientId: number): Promise<void> {
    const configFiles = [
      "/etc/apache2/apache2.conf",
      "/etc/nginx/nginx.conf",
      "/etc/mysql/my.cnf",
      "/etc/ssh/sshd_config",
      "/etc/firewall/rules.conf"
    ];

    for (const configFile of configFiles) {
      // Check if config file has been modified
      if (Math.random() < 0.03) { // 3% chance
        const existingChecks = await storage.getFileIntegrityChecks(clientId);
        const existingCheck = existingChecks.find(check => check.filePath === configFile);
        
        if (existingCheck) {
          await storage.updateFileStatus(existingCheck.id, "modified");
        } else {
          await storage.createFileIntegrityCheck({
            clientId,
            filePath: configFile,
            fileType: "configuration_file",
            checksum: this.generateSimulatedChecksum(configFile),
            status: "modified"
          });
        }

        await alertSystemService.createAlert(clientId, {
          type: "config_file_modified",
          severity: "medium",
          title: "Configuration File Modified",
          description: `Configuration file has been changed: ${configFile}. Please verify this change was authorized.`
        });
      }
    }
  }

  private generateSimulatedChecksum(filePath: string): string {
    // Generate a deterministic but "random-looking" checksum based on file path and current time
    const baseString = filePath + Math.floor(Date.now() / 300000); // Changes every 5 minutes
    return crypto.createHash('sha256').update(baseString).digest('hex').substring(0, 16);
  }

  async getFileIntegrityStatistics(clientId: number): Promise<any> {
    const checks = await storage.getFileIntegrityChecks(clientId);
    
    const stats = {
      totalFiles: checks.length,
      byStatus: checks.reduce((acc, check) => {
        acc[check.status] = (acc[check.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      byType: checks.reduce((acc, check) => {
        acc[check.fileType] = (acc[check.fileType] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      recentChanges: checks.filter(check => 
        check.status === "modified" && 
        new Date().getTime() - new Date(check.lastChecked!).getTime() < 24 * 60 * 60 * 1000
      ).length
    };

    return stats;
  }

  async getFilesByStatus(clientId: number, status: string): Promise<any[]> {
    const checks = await storage.getFileIntegrityChecks(clientId);
    return checks.filter(check => check.status === status);
  }
}

export const fileIntegrityService = new FileIntegrityService();
