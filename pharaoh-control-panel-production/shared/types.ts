export interface ServerMetric {
  name: string;
  value: number;
  change: number;
  status: 'healthy' | 'attention' | 'critical';
}

export interface ServerPerformanceData {
  cpu: number[];
  memory: number[];
  network: number[];
  timestamps: string[];
}

export interface SelfHealingEvent {
  id: string;
  title: string;
  description: string;
  type: 'success' | 'warning' | 'error';
  timestamp: string;
  status?: 'complete' | 'in-progress';
}

export interface AIModel {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: 'active' | 'inactive';
  type: string;
}

export interface MarketplaceModel extends AIModel {
  memory: string;
  verified: boolean;
  featured?: boolean;
  badge?: string;
  color: string;
}

export interface SubscriptionInfo {
  plan: string;
  features: {
    name: string;
    value: string;
  }[];
  nextBilling: string;
}

export interface ActivityEvent {
  id: string;
  title: string;
  icon: string;
  iconColor: string;
  timestamp: string;
}

export interface TerminalCommand {
  command: string;
  output: string;
  isAI?: boolean;
}
