import { db } from "../db";
import { healingEvents, insertHealingEventSchema } from "@shared/schema";
import { eq } from "drizzle-orm";
import * as fs from 'fs';
import * as path from 'path';

/**
 * PharaohAI is a locally hosted AI engine that powers self-healing and analysis
 * It handles server monitoring, root cause analysis, and automated fixes
 * Uses a rule-based expert system with pattern matching instead of external APIs
 */
export class PharaohAI {
  private static instance: PharaohAI;
  
  private constructor() {}
  
  /**
   * Get the singleton instance of PharaohAI
   */
  public static getInstance(): PharaohAI {
    if (!PharaohAI.instance) {
      PharaohAI.instance = new PharaohAI();
    }
    return PharaohAI.instance;
  }
  
  // Database of common server issues and their solutions
  private knowledgeBase = [
    {
      pattern: /memory|out of memory|oom|memory leak/i,
      rootCause: "Memory resource exhaustion",
      severity: "high",
      impactedSystems: ["Application server", "Database"],
      recommendedFixes: [
        "Increase available memory allocation", 
        "Optimize application memory usage",
        "Implement memory leak detection"
      ],
      explanations: "The application is consuming excessive memory resources causing system instability."
    },
    {
      pattern: /cpu|processor|load average|high load/i,
      rootCause: "CPU resource saturation",
      severity: "medium",
      impactedSystems: ["Application server"],
      recommendedFixes: [
        "Scale horizontally by adding more servers",
        "Optimize computationally intensive operations",
        "Implement better caching"
      ],
      explanations: "The CPU is under excessive load, causing performance degradation."
    },
    {
      pattern: /disk|space|storage|full|io/i,
      rootCause: "Disk space or I/O bottleneck",
      severity: "high",
      impactedSystems: ["File system", "Database"],
      recommendedFixes: [
        "Clean up temporary files and logs",
        "Expand storage capacity",
        "Implement log rotation"
      ],
      explanations: "Disk resources are constrained, leading to I/O errors or space limitations."
    },
    {
      pattern: /network|connection|timeout|unreachable/i,
      rootCause: "Network connectivity issues",
      severity: "high",
      impactedSystems: ["Network infrastructure", "External services"],
      recommendedFixes: [
        "Check network configurations",
        "Verify firewall settings",
        "Ensure proper DNS resolution"
      ],
      explanations: "Network connectivity problems are causing service disruptions."
    },
    {
      pattern: /permission|access denied|forbidden|403/i,
      rootCause: "Permission or access control issues",
      severity: "medium",
      impactedSystems: ["Security", "File system"],
      recommendedFixes: [
        "Verify file and directory permissions",
        "Check user and group ownerships",
        "Review access control lists"
      ],
      explanations: "Insufficient permissions are preventing proper system operation."
    },
    {
      pattern: /database|sql|query|deadlock/i,
      rootCause: "Database performance or access issues",
      severity: "critical",
      impactedSystems: ["Database", "Application"],
      recommendedFixes: [
        "Optimize database queries",
        "Add appropriate indexes",
        "Implement connection pooling",
        "Fix deadlock scenarios"
      ],
      explanations: "Database operations are experiencing performance degradation or failures."
    },
    {
      pattern: /security|hack|breach|vulnerability|exploit/i,
      rootCause: "Potential security compromise",
      severity: "critical",
      impactedSystems: ["Security", "Application", "System"],
      recommendedFixes: [
        "Apply security patches immediately",
        "Isolate affected systems",
        "Reset credentials",
        "Enable enhanced logging",
        "Conduct security audit"
      ],
      explanations: "Possible security breach requires immediate attention."
    }
  ];

  /**
   * Analyzes server logs to find the root cause of issues using local pattern matching
   * @param logContent The server logs to analyze
   * @param issueDescription User description of the problem
   * @returns Analysis with root cause and recommended fixes
   */
  public async analyzeServerIssue(logContent: string, issueDescription: string): Promise<any> {
    try {
      // Combine logs and description for better pattern matching
      const textToAnalyze = `${issueDescription}\n${logContent}`;
      
      // Match against our knowledge base
      let bestMatch = {
        rootCause: "Unknown issue",
        severity: "medium",
        impactedSystems: ["System"],
        recommendedFixes: ["Investigate further and collect additional logs"],
        explanations: "Could not determine specific cause based on available information.",
        confidence: 0
      };
      
      // Find the best matching pattern in our knowledge base
      for (const issue of this.knowledgeBase) {
        const matches = textToAnalyze.match(issue.pattern);
        if (matches && matches.length > 0) {
          // Simple confidence calculation based on match length and count
          const confidence = matches.length * matches[0].length / textToAnalyze.length;
          
          if (confidence > bestMatch.confidence) {
            bestMatch = { ...issue, confidence };
          }
        }
      }
      
      // Create a self-healing event in the database
      await this.recordHealingEvent(
        `Analysis: ${bestMatch.rootCause}`, 
        JSON.stringify(bestMatch.recommendedFixes), 
        this.getSeverityType(bestMatch.severity),
        "pending"
      );
      
      return bestMatch;
    } catch (error) {
      console.error("Error analyzing server issue:", error);
      throw new Error("Failed to analyze server issue");
    }
  }
  
  // Database of fix commands for common issues
  private fixCommandsDatabase: Record<string, Array<{command: string, purpose: string, risk: string, verification: string}>> = {
    "Memory resource exhaustion": [
      {
        command: "free -h",
        purpose: "Check current memory usage",
        risk: "low",
        verification: "free -h"
      },
      {
        command: "sync && echo 3 > /proc/sys/vm/drop_caches",
        purpose: "Free pagecache, dentries and inodes",
        risk: "medium",
        verification: "free -h"
      },
      {
        command: "ps aux --sort=-%mem | head -n 10",
        purpose: "Find top memory-consuming processes",
        risk: "low",
        verification: "top -o %MEM -n 1"
      }
    ],
    "CPU resource saturation": [
      {
        command: "uptime",
        purpose: "Check system load",
        risk: "low",
        verification: "uptime"
      },
      {
        command: "ps aux --sort=-%cpu | head -n 10",
        purpose: "Find top CPU-consuming processes",
        risk: "low",
        verification: "top -o %CPU -n 1"
      },
      {
        command: "nice -n 10 PROCESS_PID",
        purpose: "Adjust process priority (replace PROCESS_PID)",
        risk: "medium",
        verification: "ps -o nice -p PROCESS_PID"
      }
    ],
    "Disk space or I/O bottleneck": [
      {
        command: "df -h",
        purpose: "Check disk space usage",
        risk: "low",
        verification: "df -h"
      },
      {
        command: "find /var/log -type f -name \"*.log\" -size +100M -exec ls -lh {} \\;",
        purpose: "Find large log files",
        risk: "low",
        verification: "ls -lh /var/log"
      },
      {
        command: "journalctl --vacuum-time=2d",
        purpose: "Clear old journal logs",
        risk: "medium",
        verification: "journalctl --disk-usage"
      }
    ],
    "Network connectivity issues": [
      {
        command: "ping -c 4 google.com",
        purpose: "Check internet connectivity",
        risk: "low",
        verification: "ping -c 4 google.com"
      },
      {
        command: "netstat -tuln",
        purpose: "Check listening ports",
        risk: "low",
        verification: "ss -tuln"
      },
      {
        command: "systemctl restart networking",
        purpose: "Restart networking services",
        risk: "medium",
        verification: "systemctl status networking"
      }
    ],
    "Permission or access control issues": [
      {
        command: "ls -la /path/to/file",
        purpose: "Check file permissions",
        risk: "low",
        verification: "ls -la /path/to/file"
      },
      {
        command: "chown www-data:www-data /path/to/file",
        purpose: "Adjust file ownership",
        risk: "medium",
        verification: "ls -la /path/to/file"
      },
      {
        command: "chmod 644 /path/to/file",
        purpose: "Adjust file permissions",
        risk: "medium",
        verification: "ls -la /path/to/file"
      }
    ],
    "Database performance or access issues": [
      {
        command: "systemctl status postgresql",
        purpose: "Check database service status",
        risk: "low",
        verification: "systemctl status postgresql"
      },
      {
        command: "systemctl restart postgresql",
        purpose: "Restart database service",
        risk: "high",
        verification: "systemctl status postgresql"
      },
      {
        command: "pg_isready",
        purpose: "Check if PostgreSQL is accepting connections",
        risk: "low",
        verification: "echo $?"
      }
    ],
    "Potential security compromise": [
      {
        command: "fail2ban-client status",
        purpose: "Check fail2ban status",
        risk: "low",
        verification: "fail2ban-client status"
      },
      {
        command: "lastb | head -n 20",
        purpose: "Check recent failed login attempts",
        risk: "low",
        verification: "lastb | wc -l"
      },
      {
        command: "find / -type f -mtime -1 -perm /a=x -ls",
        purpose: "Find recently modified executable files",
        risk: "medium",
        verification: "echo $?"
      }
    ]
  };

  /**
   * Perform automated healing based on detected issues using our local knowledge base
   * @param issue The issue details
   * @param autoFix Whether to automatically apply fixes
   * @returns Results of healing attempt
   */
  public async performSelfHealing(issue: {rootCause?: string, severity?: string}, autoFix: boolean = false): Promise<any> {
    try {
      let fixCommands: Array<{command: string, purpose: string, risk: string, verification: string}> = [];
      const rootCause = issue.rootCause || "";
      
      // Find appropriate fixes based on root cause
      if (rootCause && this.fixCommandsDatabase[rootCause]) {
        fixCommands = this.fixCommandsDatabase[rootCause];
      } else {
        // Fallback to generic troubleshooting commands
        fixCommands = [
          {
            command: "dmesg | tail -n 20",
            purpose: "Check recent system messages",
            risk: "low",
            verification: "dmesg | tail"
          },
          {
            command: "top -b -n 1",
            purpose: "Check system resource usage",
            risk: "low",
            verification: "top -b -n 1"
          },
          {
            command: "systemctl list-units --failed",
            purpose: "Check for failed services",
            risk: "low",
            verification: "systemctl --failed"
          }
        ];
      }
      
      // Record the healing plan
      await this.recordHealingEvent(
        `Self-Healing: ${issue.rootCause || "Unknown Issue"}`,
        JSON.stringify(fixCommands),
        this.getSeverityType(issue.severity || "medium"),
        autoFix ? "in-progress" : "pending"
      );
      
      // If autoFix is enabled, we would execute commands here
      // For now, we'll just return the commands
      return {
        issue,
        fixCommands,
        autoFixed: autoFix,
        status: autoFix ? "healing" : "pending"
      };
    } catch (error) {
      console.error("Error performing self-healing:", error);
      throw new Error("Failed to perform self-healing");
    }
  }
  
  // Performance thresholds for anomaly detection
  private performanceThresholds: Record<string, { warning: number, critical: number }> = {
    cpu: { warning: 70, critical: 90 },
    memory: { warning: 80, critical: 95 },
    disk: { warning: 85, critical: 95 },
    network: { warning: 80, critical: 95 }
  };

  // Performance optimization recommendations
  private optimizations: Record<string, string[]> = {
    cpu: [
      "Identify and optimize CPU-intensive processes",
      "Consider load balancing across multiple servers",
      "Implement caching mechanisms for frequently accessed data",
      "Schedule intensive tasks during off-peak hours",
      "Upgrade CPU resources or scale horizontally"
    ],
    memory: [
      "Check for memory leaks in applications",
      "Increase swap space as a temporary measure",
      "Optimize database query performance to reduce memory consumption",
      "Implement proper resource limits for applications",
      "Consider upgrading memory capacity"
    ],
    disk: [
      "Implement log rotation and cleanup policies",
      "Archive or remove old data no longer in use",
      "Add additional storage or migrate to larger volumes",
      "Optimize database storage with proper indexing",
      "Monitor disk I/O patterns and optimize access patterns"
    ],
    network: [
      "Check for bandwidth-intensive processes or unauthorized access",
      "Implement traffic shaping or quality of service (QoS)",
      "Optimize application protocols for efficiency",
      "Consider content delivery networks (CDN) for static content",
      "Increase network capacity if consistent high usage is expected"
    ]
  };

  /**
   * Detects performance anomalies by analyzing metrics using local threshold-based approach
   * @param metrics Recent server metrics
   * @returns Analysis of performance issues with recommendations
   */
  public async detectPerformanceAnomalies(metrics: any[]): Promise<any> {
    try {
      if (!metrics || !Array.isArray(metrics) || metrics.length === 0) {
        return {
          anomaliesDetected: false,
          issues: [],
          optimizations: [],
          priority: "low",
          impact: "No metrics provided for analysis"
        };
      }
      
      // Process the metrics to find anomalies
      const issues = [];
      const recommendedOptimizations = new Set<string>();
      let highestPriority = "low";
      
      // Check each metric against thresholds
      for (const metric of metrics) {
        if (!metric.name || typeof metric.value !== 'number') continue;
        
        const metricType = this.getMetricType(metric.name);
        const thresholds = this.performanceThresholds[metricType];
        
        if (!thresholds) continue;
        
        if (metric.value >= thresholds.critical) {
          issues.push({
            metric: metric.name,
            value: metric.value,
            threshold: thresholds.critical,
            severity: "critical"
          });
          highestPriority = "high";
          
          // Add relevant optimizations
          if (this.optimizations[metricType]) {
            this.optimizations[metricType].forEach(opt => recommendedOptimizations.add(opt));
          }
        } else if (metric.value >= thresholds.warning) {
          issues.push({
            metric: metric.name,
            value: metric.value,
            threshold: thresholds.warning,
            severity: "warning"
          });
          if (highestPriority !== "high") {
            highestPriority = "medium";
          }
          
          // Add relevant optimizations
          if (this.optimizations[metricType]) {
            this.optimizations[metricType].slice(0, 3).forEach(opt => recommendedOptimizations.add(opt));
          }
        }
      }
      
      const anomaliesDetected = issues.length > 0;
      const performanceAnalysis = {
        anomaliesDetected,
        issues,
        optimizations: Array.from(recommendedOptimizations),
        priority: highestPriority,
        impact: this.getBusinessImpact(issues, highestPriority)
      };
      
      // If anomalies are detected, create a healing event
      if (anomaliesDetected) {
        await this.recordHealingEvent(
          `Performance Anomaly Detected: ${issues.length} issues found`,
          JSON.stringify(issues),
          highestPriority === "high" ? "warning" : "info",
          "pending"
        );
      }
      
      return performanceAnalysis;
    } catch (error) {
      console.error("Error detecting performance anomalies:", error);
      throw new Error("Failed to detect performance anomalies");
    }
  }
  
  /**
   * Maps metric names to their type for threshold checking
   */
  private getMetricType(metricName: string): string {
    metricName = metricName.toLowerCase();
    
    if (metricName.includes('cpu') || metricName.includes('processor')) {
      return 'cpu';
    } else if (metricName.includes('memory') || metricName.includes('ram')) {
      return 'memory';
    } else if (metricName.includes('disk') || metricName.includes('storage') || metricName.includes('space')) {
      return 'disk';
    } else if (metricName.includes('network') || metricName.includes('bandwidth')) {
      return 'network';
    }
    
    return 'other';
  }
  
  /**
   * Generates business impact description based on issues and priority
   */
  private getBusinessImpact(issues: any[], priority: string): string {
    if (issues.length === 0) {
      return "No business impact - system performing within normal parameters";
    }
    
    const criticalCount = issues.filter(i => i.severity === "critical").length;
    const warningCount = issues.filter(i => i.severity === "warning").length;
    
    if (criticalCount > 0) {
      return `Critical system performance degradation detected that may result in service interruptions, data loss, or significant user experience degradation. Immediate attention required.`;
    } else if (warningCount > 0) {
      return `System performance is approaching critical thresholds which may impact service quality and user experience if not addressed soon.`;
    } else {
      return `Minor performance concerns detected that should be monitored, but unlikely to cause immediate business impact.`;
    }
  }
  
  // Security check patterns
  private securityChecks = [
    {
      id: "sec001",
      pattern: /password|pass|pwd|secret/i,
      title: "Hardcoded credentials",
      description: "Potential hardcoded credentials found in configuration",
      riskLevel: "critical",
      remediations: [
        "Use environment variables for sensitive information",
        "Implement a secrets management solution",
        "Remove credentials from code and configuration files"
      ]
    },
    {
      id: "sec002",
      pattern: /ssh.*port.*22|telnet|ftp/i,
      title: "Insecure remote access protocols",
      description: "System may be using insecure remote access protocols",
      riskLevel: "high",
      remediations: [
        "Disable telnet and FTP services",
        "Use SSH with key-based authentication",
        "Change SSH to a non-standard port",
        "Implement SSH key rotation"
      ]
    },
    {
      id: "sec003",
      pattern: /ssl.*v2|ssl.*v3|tls.*1\.0|tls.*1\.1/i,
      title: "Outdated encryption protocols",
      description: "System is using outdated encryption protocols",
      riskLevel: "high",
      remediations: [
        "Disable SSLv2/SSLv3 and TLS 1.0/1.1",
        "Configure services to use TLS 1.2 or newer",
        "Update cryptography libraries"
      ]
    },
    {
      id: "sec004",
      pattern: /chmod\s+777|permission.*666|permission.*777/i,
      title: "Insecure file permissions",
      description: "Overly permissive file permissions detected",
      riskLevel: "medium",
      remediations: [
        "Apply principle of least privilege to all files",
        "Use more restrictive file permissions",
        "Implement file access auditing"
      ]
    },
    {
      id: "sec005",
      pattern: /root\s+login|sudo\s+ALL|no\s+password/i,
      title: "Excessive privileges",
      description: "Configuration allows excessive privileges",
      riskLevel: "high",
      remediations: [
        "Disable root login",
        "Implement proper sudo policies",
        "Require passwords for privileged actions"
      ]
    },
    {
      id: "sec006",
      pattern: /firewall.*disable|iptables.*ACCEPT|ufw.*disable/i,
      title: "Firewall misconfiguration",
      description: "Firewall may be disabled or improperly configured",
      riskLevel: "critical",
      remediations: [
        "Enable and properly configure firewall",
        "Implement default-deny policy",
        "Only allow necessary incoming connections"
      ]
    },
    {
      id: "sec007",
      pattern: /CORS.*\*/i,
      title: "Permissive CORS policy",
      description: "Cross-Origin Resource Sharing policy is too permissive",
      riskLevel: "medium",
      remediations: [
        "Restrict CORS to specific domains",
        "Avoid using wildcard (*) in CORS configuration",
        "Implement proper CORS headers"
      ]
    }
  ];

  // General security best practices
  private securityBestPractices = [
    "Implement a regular patching schedule for all software and systems",
    "Use a Web Application Firewall (WAF) for public-facing services",
    "Enable multi-factor authentication for all administrative access",
    "Implement network segmentation to isolate critical systems",
    "Regularly back up critical data and test restoration procedures",
    "Conduct regular security audits and penetration testing",
    "Implement a comprehensive logging and monitoring solution",
    "Develop and enforce a strong password policy"
  ];

  /**
   * Analyzes security vulnerabilities in server configuration using pattern matching
   * @param config Server configuration data
   * @returns Security analysis with vulnerabilities and recommendations
   */
  public async analyzeSecurityRisks(config: any): Promise<any> {
    try {
      // Convert config to string for pattern matching
      const configString = typeof config === 'string' ? config : JSON.stringify(config);
      
      const vulnerabilities = [];
      
      // Check for known security issues
      for (const check of this.securityChecks) {
        const matches = configString.match(check.pattern);
        if (matches && matches.length > 0) {
          vulnerabilities.push({
            id: check.id,
            title: check.title,
            description: check.description,
            riskLevel: check.riskLevel,
            remediations: check.remediations,
            matches: matches.length
          });
        }
      }
      
      // Sort vulnerabilities by risk level (critical first)
      vulnerabilities.sort((a, b) => {
        const riskOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        return riskOrder[a.riskLevel] - riskOrder[b.riskLevel];
      });
      
      const securityAnalysis = {
        vulnerabilities,
        bestPractices: this.securityBestPractices,
        summary: `${vulnerabilities.length} potential security issues detected`,
        overallRiskLevel: this.calculateOverallRisk(vulnerabilities)
      };
      
      // Create security-related healing events for critical vulnerabilities
      for (const vuln of vulnerabilities) {
        if (vuln.riskLevel === "high" || vuln.riskLevel === "critical") {
          await this.recordHealingEvent(
            `Security Vulnerability: ${vuln.title}`,
            vuln.description,
            "error",
            "pending"
          );
        }
      }
      
      return securityAnalysis;
    } catch (error) {
      console.error("Error analyzing security risks:", error);
      throw new Error("Failed to analyze security risks");
    }
  }
  
  /**
   * Calculate overall risk level based on vulnerabilities
   */
  private calculateOverallRisk(vulnerabilities: Array<{riskLevel: string}>): string {
    if (vulnerabilities.some(v => v.riskLevel === "critical")) {
      return "critical";
    } else if (vulnerabilities.some(v => v.riskLevel === "high")) {
      return "high";
    } else if (vulnerabilities.some(v => v.riskLevel === "medium")) {
      return "medium";
    } else if (vulnerabilities.length > 0) {
      return "low";
    } else {
      return "none";
    }
  }
  
  // Terminal command suggestions database
  private commandDatabase = {
    "logs": {
      description: "Common log viewing commands",
      commands: [
        { command: "tail -f /var/log/syslog", description: "View live system logs" },
        { command: "journalctl -xe", description: "View systemd journal logs with explanation" },
        { command: "grep ERROR /var/log/application.log", description: "Search for errors in application logs" }
      ]
    },
    "process": {
      description: "Process management commands",
      commands: [
        { command: "ps aux | grep [process_name]", description: "Find processes by name" },
        { command: "top", description: "View real-time process information" },
        { command: "kill -9 [pid]", description: "Force kill a process" }
      ]
    },
    "disk": {
      description: "Disk space and file management commands",
      commands: [
        { command: "df -h", description: "Check disk space usage" },
        { command: "du -sh /path/to/directory", description: "Check directory size" },
        { command: "find / -type f -size +100M", description: "Find files larger than 100MB" }
      ]
    },
    "network": {
      description: "Network troubleshooting commands",
      commands: [
        { command: "netstat -tuln", description: "List listening ports" },
        { command: "ping [hostname]", description: "Check connectivity to a host" },
        { command: "traceroute [hostname]", description: "Trace route to a host" }
      ]
    },
    "database": {
      description: "Database management commands",
      commands: [
        { command: "psql -U [username] -d [database]", description: "Connect to PostgreSQL database" },
        { command: "mysqldump -u [username] -p [database] > backup.sql", description: "Backup MySQL database" },
        { command: "pg_isready", description: "Check PostgreSQL server status" }
      ]
    },
    "system": {
      description: "System information commands",
      commands: [
        { command: "uname -a", description: "Display system information" },
        { command: "free -h", description: "Check memory usage" },
        { command: "uptime", description: "View system uptime and load" }
      ]
    }
  };

  /**
   * Provides terminal assistance through local command database
   * @param userQuestion The user's question or command
   * @returns Response with helpful commands or explanations
   */
  public async getTerminalAssistance(userQuestion: string): Promise<string> {
    try {
      userQuestion = userQuestion.toLowerCase();
      
      // Find relevant command categories based on the question
      const relevantCategories = Object.entries(this.commandDatabase)
        .filter(([category, _]) => userQuestion.includes(category))
        .map(([category, data]) => ({ category, data }));
      
      if (relevantCategories.length === 0) {
        // If no exact category matches, try to find partial matches
        for (const [category, data] of Object.entries(this.commandDatabase)) {
          for (const cmd of data.commands) {
            if (cmd.description.toLowerCase().includes(userQuestion) ||
                cmd.command.toLowerCase().includes(userQuestion)) {
              relevantCategories.push({ category, data });
              break;
            }
          }
        }
      }
      
      // If still no matches, return generic assistance
      if (relevantCategories.length === 0) {
        return `
## Terminal Assistant

I can help with Linux terminal commands. Try asking about:

- Viewing or searching logs
- Managing processes
- Checking disk space
- Network troubleshooting
- Database operations
- System information

For example: "How do I check disk space?" or "Show me commands for process management"
        `;
      }
      
      // Format the response with relevant commands
      let response = `## Terminal Assistance\n\n`;
      
      relevantCategories.forEach(({ category, data }) => {
        response += `### ${data.description}\n\n`;
        
        data.commands.forEach(cmd => {
          response += `- \`${cmd.command}\` - ${cmd.description}\n`;
        });
        
        response += '\n';
      });
      
      return response;
    } catch (error) {
      console.error("Error getting terminal assistance:", error);
      return "I encountered an error while processing your request. Please try a different question about server administration or Linux commands.";
    }
  }
  
  /**
   * Records a healing event in the database
   */
  private async recordHealingEvent(
    title: string, 
    description: string | null,
    type: "success" | "warning" | "error" | "info",
    status: "complete" | "in-progress" | "pending"
  ): Promise<void> {
    try {
      // Ensure we have a valid description string
      const safeDescription = description || "No additional details";
      
      const eventData = {
        title,
        description: safeDescription,
        type,
        status,
        timestamp: new Date().toISOString(),
        serverId: "server-1", // In a real implementation, this would be dynamic
      };
      
      const validatedData = insertHealingEventSchema.parse(eventData);
      await db.insert(healingEvents).values(validatedData);
    } catch (error) {
      console.error("Error recording healing event:", error);
    }
  }
  
  /**
   * Maps severity strings to event types
   */
  private getSeverityType(severity: string | null): "success" | "warning" | "error" | "info" {
    const severityLevel = severity?.toLowerCase() || 'unknown';
    
    switch (severityLevel) {
      case "critical":
        return "error";
      case "high":
        return "error";
      case "medium":
        return "warning";
      case "low":
        return "info";
      default:
        return "info";
    }
  }
}

// Export a singleton instance
export const aiEngine = PharaohAI.getInstance();