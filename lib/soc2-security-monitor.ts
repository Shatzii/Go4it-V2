import crypto from 'crypto';

// SOC2-compliant Security Monitoring and Alerting System

import { securityLogger, auditLogger, appLogger } from './soc2-logger';

export enum SecurityEventType {
  AUTHENTICATION_SUCCESS = 'auth_success',
  AUTHENTICATION_FAILURE = 'auth_failure',
  AUTHORIZATION_DENIED = 'authz_denied',
  SUSPICIOUS_ACTIVITY = 'suspicious_activity',
  DATA_ACCESS = 'data_access',
  CONFIG_CHANGE = 'config_change',
  BRUTE_FORCE_ATTACK = 'brute_force',
  SQL_INJECTION_ATTEMPT = 'sql_injection',
  XSS_ATTEMPT = 'xss_attempt',
  CSRF_ATTEMPT = 'csrf_attempt',
  SESSION_HIJACKING = 'session_hijacking',
  DATA_EXFILTRATION = 'data_exfiltration',
  MALWARE_DETECTED = 'malware_detected',
  SYSTEM_INTRUSION = 'system_intrusion',
}

export enum AlertSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export interface SecurityEvent {
  id: string;
  type: SecurityEventType;
  severity: AlertSeverity;
  timestamp: Date;
  userId?: string;
  ipAddress: string;
  userAgent?: string;
  resource?: string;
  action?: string;
  details?: any;
  source: string;
}

export interface AlertRule {
  id: string;
  name: string;
  eventType: SecurityEventType;
  condition: (event: SecurityEvent) => boolean;
  severity: AlertSeverity;
  cooldownMinutes: number; // Prevent alert spam
  enabled: boolean;
}

export class SOC2SecurityMonitor {
  private static events: SecurityEvent[] = [];
  private static alerts: AlertRule[] = [];
  private static lastAlertTimes: Map<string, Date> = new Map();

  // Initialize default alert rules
  static initialize(): void {
    this.alerts = [
      {
        id: 'brute_force_login',
        name: 'Brute Force Login Attempts',
        eventType: SecurityEventType.AUTHENTICATION_FAILURE,
        condition: (event) => this.checkBruteForcePattern(event),
        severity: AlertSeverity.HIGH,
        cooldownMinutes: 15,
        enabled: true,
      },
      {
        id: 'multiple_authz_denials',
        name: 'Multiple Authorization Denials',
        eventType: SecurityEventType.AUTHORIZATION_DENIED,
        condition: (event) => this.checkMultipleDenials(event),
        severity: AlertSeverity.MEDIUM,
        cooldownMinutes: 10,
        enabled: true,
      },
      {
        id: 'suspicious_data_access',
        name: 'Suspicious Data Access Patterns',
        eventType: SecurityEventType.DATA_ACCESS,
        condition: (event) => this.checkSuspiciousDataAccess(event),
        severity: AlertSeverity.HIGH,
        cooldownMinutes: 5,
        enabled: true,
      },
      {
        id: 'config_changes',
        name: 'Security Configuration Changes',
        eventType: SecurityEventType.CONFIG_CHANGE,
        condition: () => true, // Always alert on config changes
        severity: AlertSeverity.HIGH,
        cooldownMinutes: 0,
        enabled: true,
      },
    ];

    appLogger.info('SOC2 Security Monitor initialized', {
      alertRulesCount: this.alerts.length,
    });
  }

  /**
   * Log a security event
   */
  static logEvent(
    type: SecurityEventType,
    severity: AlertSeverity,
    ipAddress: string,
    details: any = {},
    userId?: string,
    userAgent?: string,
    resource?: string,
    action?: string
  ): void {
    const event: SecurityEvent = {
      id: crypto.randomUUID(),
      type,
      severity,
      timestamp: new Date(),
      userId,
      ipAddress,
      userAgent,
      resource,
      action,
      details,
      source: 'go4it-platform',
    };

    // Store event (keep last 1000 events in memory)
    this.events.push(event);
    if (this.events.length > 1000) {
      this.events.shift();
    }

    // Log to appropriate logger
    const logData = {
      eventId: event.id,
      userId,
      ipAddress,
      resource,
      action,
      details,
    };

    switch (severity) {
      case AlertSeverity.CRITICAL:
      case AlertSeverity.HIGH:
        securityLogger.suspiciousActivity(userId || 'unknown', `${type}: ${JSON.stringify(details)}`, ipAddress, details);
        break;
      case AlertSeverity.MEDIUM:
        auditLogger.userAction(userId || 'system', `security_event_${type}`, details);
        break;
      default:
        appLogger.info(`Security event: ${type}`, logData);
    }

    // Check for alerts
    this.checkAlerts(event);
  }

  /**
   * Check if event triggers any alerts
   */
  private static checkAlerts(event: SecurityEvent): void {
    for (const rule of this.alerts) {
      if (!rule.enabled || rule.eventType !== event.type) continue;

      // Check cooldown
      const lastAlert = this.lastAlertTimes.get(rule.id);
      if (lastAlert) {
        const cooldownMs = rule.cooldownMinutes * 60 * 1000;
        if (Date.now() - lastAlert.getTime() < cooldownMs) continue;
      }

      // Check condition
      if (rule.condition(event)) {
        this.triggerAlert(rule, event);
        this.lastAlertTimes.set(rule.id, new Date());
      }
    }
  }

  /**
   * Trigger security alert
   */
  private static triggerAlert(rule: AlertRule, event: SecurityEvent): void {
    const alert = {
      alertId: crypto.randomUUID(),
      ruleId: rule.id,
      ruleName: rule.name,
      severity: rule.severity,
      event,
      timestamp: new Date(),
    };

    // Log critical alerts
    if (rule.severity === AlertSeverity.CRITICAL || rule.severity === AlertSeverity.HIGH) {
      securityLogger.suspiciousActivity(
        event.userId || 'system',
        `ALERT: ${rule.name}`,
        event.ipAddress,
        alert
      );
    }

    // In production, this would send alerts to:
    // - SIEM system
    // - Security team email/SMS
    // - Incident response system
    appLogger.warn(`Security Alert Triggered: ${rule.name}`, alert);

    // Trigger incident response if critical
    if (rule.severity === AlertSeverity.CRITICAL) {
      this.triggerIncidentResponse(alert);
    }
  }

  /**
   * Check for brute force login patterns
   */
  private static checkBruteForcePattern(event: SecurityEvent): boolean {
    const recentFailures = this.events.filter(e =>
      e.type === SecurityEventType.AUTHENTICATION_FAILURE &&
      e.ipAddress === event.ipAddress &&
      e.timestamp.getTime() > Date.now() - 15 * 60 * 1000 // Last 15 minutes
    );

    return recentFailures.length >= 5; // 5+ failures in 15 minutes
  }

  /**
   * Check for multiple authorization denials
   */
  private static checkMultipleDenials(event: SecurityEvent): boolean {
    const recentDenials = this.events.filter(e =>
      e.type === SecurityEventType.AUTHORIZATION_DENIED &&
      e.userId === event.userId &&
      e.timestamp.getTime() > Date.now() - 10 * 60 * 1000 // Last 10 minutes
    );

    return recentDenials.length >= 3; // 3+ denials in 10 minutes
  }

  /**
   * Check for suspicious data access patterns
   */
  private static checkSuspiciousDataAccess(event: SecurityEvent): boolean {
    // Check for unusual access patterns
    const recentAccess = this.events.filter(e =>
      e.type === SecurityEventType.DATA_ACCESS &&
      e.userId === event.userId &&
      e.timestamp.getTime() > Date.now() - 60 * 60 * 1000 // Last hour
    );

    // Flag if accessing many different resources rapidly
    const uniqueResources = new Set(recentAccess.map(e => e.resource));
    return uniqueResources.size >= 10 && recentAccess.length >= 20;
  }

  /**
   * Trigger incident response for critical alerts
   */
  private static triggerIncidentResponse(alert: any): void {
    appLogger.error('CRITICAL SECURITY INCIDENT - Immediate Response Required', {
      alert,
      incidentId: crypto.randomUUID(),
      responseActions: [
        'Isolate affected systems',
        'Notify security team',
        'Preserve evidence',
        'Assess impact',
        'Implement containment',
      ],
    });
  }

  /**
   * Get security metrics for monitoring
   */
  static getSecurityMetrics(): any {
    const now = Date.now();
    const last24h = now - 24 * 60 * 60 * 1000;
    const last7d = now - 7 * 24 * 60 * 60 * 1000;

    const recentEvents = this.events.filter(e => e.timestamp.getTime() > last24h);
    const weeklyEvents = this.events.filter(e => e.timestamp.getTime() > last7d);

    return {
      totalEvents: this.events.length,
      eventsLast24h: recentEvents.length,
      eventsLast7d: weeklyEvents.length,
      alertsTriggered: Array.from(this.lastAlertTimes.keys()).length,
      severityBreakdown: {
        critical: recentEvents.filter(e => e.severity === AlertSeverity.CRITICAL).length,
        high: recentEvents.filter(e => e.severity === AlertSeverity.HIGH).length,
        medium: recentEvents.filter(e => e.severity === AlertSeverity.MEDIUM).length,
        low: recentEvents.filter(e => e.severity === AlertSeverity.LOW).length,
      },
      topEventTypes: this.getTopEventTypes(recentEvents),
      suspiciousIPs: this.getSuspiciousIPs(recentEvents),
    };
  }

  private static getTopEventTypes(events: SecurityEvent[]): any {
    const typeCounts: { [key: string]: number } = {};
    events.forEach(event => {
      typeCounts[event.type] = (typeCounts[event.type] || 0) + 1;
    });
    return Object.entries(typeCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);
  }

  private static getSuspiciousIPs(events: SecurityEvent[]): string[] {
    const ipCounts: { [key: string]: number } = {};
    events.forEach(event => {
      if (event.severity === AlertSeverity.HIGH || event.severity === AlertSeverity.CRITICAL) {
        ipCounts[event.ipAddress] = (ipCounts[event.ipAddress] || 0) + 1;
      }
    });
    return Object.entries(ipCounts)
      .filter(([, count]) => count >= 3)
      .map(([ip]) => ip);
  }
}

// SOC2 Intrusion Detection System (IDS)
export class SOC2IntrusionDetection {
  private static patterns = {
    sqlInjection: [
      /(\bUNION\b|\bSELECT\b|\bINSERT\b|\bUPDATE\b|\bDELETE\b|\bDROP\b|\bCREATE\b|\bALTER\b)/i,
      /('|(\\x27)|(\\x2D\\x2D)|(\\#)|(\%27)|(\%23))/i,
      /(\bor\b|\band\b).*(\=|\<|\>)/i,
    ],
    xss: [
      /<script[^>]*>.*?<\/script>/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /<iframe[^>]*>.*?<\/iframe>/i,
    ],
    pathTraversal: [
      /\.\.\//,
      /\.\.\\/,
      /\/etc\/passwd/,
      /\/windows\/system32/,
    ],
  };

  /**
   * Analyze input for security threats
   */
  static analyzeInput(input: string, context: string): { threats: string[], riskLevel: AlertSeverity } {
    const threats: string[] = [];
    let maxRisk: AlertSeverity = AlertSeverity.LOW;

    // Check SQL injection patterns
    for (const pattern of this.patterns.sqlInjection) {
      if (pattern.test(input)) {
        threats.push('SQL_INJECTION_ATTEMPT');
        maxRisk = AlertSeverity.HIGH;
        break;
      }
    }

    // Check XSS patterns
    for (const pattern of this.patterns.xss) {
      if (pattern.test(input)) {
        threats.push('XSS_ATTEMPT');
        maxRisk = Math.max(maxRisk, AlertSeverity.MEDIUM) as AlertSeverity;
      }
    }

    // Check path traversal
    for (const pattern of this.patterns.pathTraversal) {
      if (pattern.test(input)) {
        threats.push('PATH_TRAVERSAL_ATTEMPT');
        maxRisk = AlertSeverity.HIGH;
      }
    }

    // Log threats
    if (threats.length > 0) {
      SOC2SecurityMonitor.logEvent(
        SecurityEventType.SUSPICIOUS_ACTIVITY,
        maxRisk,
        'unknown', // IP would be passed from caller
        { threats, input: input.substring(0, 100), context },
        undefined,
        undefined,
        context
      );
    }

    return { threats, riskLevel: maxRisk };
  }

  /**
   * Sanitize input to prevent injection attacks
   */
  static sanitizeInput(input: string): string {
    return input
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .replace(/('|(\\x27)|(\\x2D\\x2D)|(\\#)|(\%27)|(\%23))/gi, '')
      .trim();
  }
}