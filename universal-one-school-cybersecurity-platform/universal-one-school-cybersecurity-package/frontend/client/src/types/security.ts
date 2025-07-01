export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  clientId?: number;
  isActive: boolean;
  createdAt?: string;
}

export interface Client {
  id: number;
  name: string;
  domain?: string;
  isActive: boolean;
  settings?: any;
  createdAt?: string;
}

export interface Threat {
  id: number;
  clientId: number;
  type: string;
  severity: "critical" | "high" | "medium" | "low";
  status: string;
  title: string;
  description?: string;
  sourceIp?: string;
  targetIp?: string;
  detectedAt?: string;
  resolvedAt?: string;
}

export interface Log {
  id: number;
  clientId: number;
  level: "error" | "warn" | "info" | "debug";
  source: string;
  message: string;
  metadata?: any;
  timestamp?: string;
}

export interface NetworkNode {
  id: number;
  clientId: number;
  name: string;
  ipAddress: string;
  nodeType: string;
  status: "online" | "offline" | "compromised" | "warning";
  lastSeen?: string;
}

export interface Alert {
  id: number;
  clientId: number;
  type: string;
  severity: "critical" | "high" | "medium" | "low";
  title: string;
  description?: string;
  isRead: boolean;
  isResolved: boolean;
  createdAt?: string;
}

export interface FileIntegrityCheck {
  id: number;
  clientId: number;
  filePath: string;
  fileType: string;
  checksum?: string;
  status: "unchanged" | "modified" | "deleted" | "quarantined";
  lastChecked?: string;
}

export interface Anomaly {
  id: number;
  clientId: number;
  type: string;
  score: number;
  description?: string;
  metadata?: any;
  detectedAt?: string;
}

export interface DashboardStats {
  activeThreats: number;
  blockedAttacks: number;
  endpoints: number;
  securityScore: string;
  unreadAlerts: number;
}

export interface ThreatChartData {
  time: string;
  critical: number;
  warning: number;
  info: number;
}

export interface WebSocketMessage {
  type: string;
  data: any;
  clientId?: number;
}
