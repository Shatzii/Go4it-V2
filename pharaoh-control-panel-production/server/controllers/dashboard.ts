import { Request, Response } from "express";
import { storage } from "../storage";
import { systemMonitor } from "../monitoring/systemMonitor";
import { logMonitor } from "../monitoring/logMonitor";

export const dashboardController = {
  getDashboardData: async (req: Request, res: Response) => {
    try {
      // Get real-time system data from monitoring services
      const latestMetrics = systemMonitor.getLatestMetrics();
      const performanceData = systemMonitor.getPerformanceData(10);
      const logAnalysis = logMonitor.getLogAnalysis();

      // Convert real metrics to dashboard format
      const metrics = latestMetrics ? [
        { 
          name: "CPU Usage", 
          value: Math.round(latestMetrics.cpu.usage), 
          change: 0,
          status: latestMetrics.cpu.usage > 80 ? "critical" : latestMetrics.cpu.usage > 60 ? "attention" : "healthy"
        },
        { 
          name: "Memory Usage", 
          value: Math.round(latestMetrics.memory.percentage), 
          change: 0,
          status: latestMetrics.memory.percentage > 90 ? "critical" : latestMetrics.memory.percentage > 75 ? "attention" : "healthy"
        },
        { 
          name: "Disk Usage", 
          value: Math.round(latestMetrics.disk.percentage), 
          change: 0,
          status: latestMetrics.disk.percentage > 90 ? "critical" : latestMetrics.disk.percentage > 80 ? "attention" : "healthy"
        },
        { 
          name: "Network Usage", 
          value: Math.round((latestMetrics.network.bytesReceived + latestMetrics.network.bytesSent) / (1024 * 1024)), 
          change: 0,
          status: "healthy"
        }
      ] : [
        { name: "CPU Usage", value: 0, change: 0, status: "healthy" },
        { name: "Memory Usage", value: 0, change: 0, status: "healthy" },
        { name: "Disk Usage", value: 0, change: 0, status: "healthy" },
        { name: "Network Usage", value: 0, change: 0, status: "healthy" }
      ];

      const dashboardData = {
        metrics,
        performanceData,
        healingEvents: [
          {
            id: "1",
            title: "NGINX Configuration Optimized",
            description: "Detected high latency and automatically optimized worker processes and connection limits.",
            type: "success",
            timestamp: "Today, 10:24 AM"
          },
          {
            id: "2",
            title: "Database Connection Leak Fixed",
            description: "Identified and resolved connection pool issue in application code that was causing memory leaks.",
            type: "success",
            timestamp: "Yesterday, 02:12 PM"
          },
          {
            id: "3",
            title: "Security Vulnerability Detected",
            description: "Detected potential SQL injection vulnerability in /admin endpoint. Patching in progress...",
            type: "warning",
            timestamp: "Just now",
            status: "in-progress"
          }
        ],
        activeModels: [
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
        ],
        subscription: {
          plan: "Pro Plan",
          features: [
            { name: "AI Models", value: "Unlimited" },
            { name: "Auto-Healing", value: "Enabled" },
            { name: "Support", value: "Priority" },
            { name: "Next Billing", value: "May 15, 2023" }
          ],
          nextBilling: "May 15, 2023"
        },
        activities: [
          {
            id: "1",
            title: "Deployed new API endpoint",
            icon: "add_circle",
            iconColor: "text-green-500",
            timestamp: "Today, 11:30 AM"
          },
          {
            id: "2",
            title: "System updated to v2.0.4",
            icon: "update",
            iconColor: "text-primary-500",
            timestamp: "Yesterday, 09:15 PM"
          },
          {
            id: "3",
            title: "Unauthorized login attempt",
            icon: "warning",
            iconColor: "text-accent-500",
            timestamp: "Apr 17, 2023, 03:22 PM"
          },
          {
            id: "4",
            title: "Backup completed successfully",
            icon: "backup",
            iconColor: "text-blue-500",
            timestamp: "Apr 16, 2023, 02:00 AM"
          }
        ],
        marketplaceModels: [
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
        ]
      };

      res.json(dashboardData);
    } catch (error) {
      res.status(500).json({ message: "Error fetching dashboard data" });
    }
  }
};
