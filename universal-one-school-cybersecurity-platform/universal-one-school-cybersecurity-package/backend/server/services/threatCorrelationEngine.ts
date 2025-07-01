import { log } from '../vite';
import { storage } from '../storage';
import { Alert, Threat, Anomaly } from '@shared/schema';

/**
 * AI-Powered Threat Correlation Engine
 * 
 * Analyzes relationships between seemingly disconnected security events
 * to identify sophisticated attack patterns and reduce false positives
 */
export class ThreatCorrelationEngine {
  private alertCache: Map<number, Alert[]> = new Map();
  private threatCache: Map<number, Threat[]> = new Map();
  private anomalyCache: Map<number, Anomaly[]> = new Map();
  private correlationRules: CorrelationRule[] = [];
  
  constructor() {
    this.initializeCorrelationRules();
    log('Threat Correlation Engine initialized', 'threat-correlation');
  }
  
  /**
   * Initialize the correlation rules
   */
  private initializeCorrelationRules(): void {
    // Rule 1: Multiple failed login attempts followed by a successful login
    this.correlationRules.push({
      id: 'RULE-001',
      name: 'Brute Force Success',
      description: 'Multiple failed login attempts followed by a successful login',
      severity: 'high',
      requiredPatterns: [
        { eventType: 'failed_login', minCount: 3, timeWindowMinutes: 10 },
        { eventType: 'successful_login', minCount: 1, timeWindowMinutes: 5, afterPrevious: true }
      ],
      score: 85
    });
    
    // Rule 2: Malware detection followed by outbound connection attempts
    this.correlationRules.push({
      id: 'RULE-002',
      name: 'Malware Command and Control',
      description: 'Malware detection followed by suspicious outbound connections',
      severity: 'critical',
      requiredPatterns: [
        { eventType: 'malware_detected', minCount: 1, timeWindowMinutes: 60 },
        { eventType: 'suspicious_connection', minCount: 1, timeWindowMinutes: 30, afterPrevious: true }
      ],
      score: 90
    });
    
    // Rule 3: Privilege escalation followed by sensitive file access
    this.correlationRules.push({
      id: 'RULE-003',
      name: 'Privilege Abuse',
      description: 'Privilege escalation followed by access to sensitive files',
      severity: 'critical',
      requiredPatterns: [
        { eventType: 'privilege_escalation', minCount: 1, timeWindowMinutes: 60 },
        { eventType: 'sensitive_file_access', minCount: 1, timeWindowMinutes: 30, afterPrevious: true }
      ],
      score: 95
    });
    
    // Rule 4: Port scan followed by exploitation attempt
    this.correlationRules.push({
      id: 'RULE-004',
      name: 'Reconnaissance and Exploitation',
      description: 'Port scanning activity followed by exploitation attempts',
      severity: 'high',
      requiredPatterns: [
        { eventType: 'port_scan', minCount: 1, timeWindowMinutes: 120 },
        { eventType: 'exploitation_attempt', minCount: 1, timeWindowMinutes: 60, afterPrevious: true }
      ],
      score: 85
    });
    
    // Rule 5: Multiple file integrity violations across systems
    this.correlationRules.push({
      id: 'RULE-005',
      name: 'Coordinated File Tampering',
      description: 'Multiple file integrity violations across different systems',
      severity: 'high',
      requiredPatterns: [
        { eventType: 'file_integrity_violation', minCount: 3, timeWindowMinutes: 30, uniqueSystems: true }
      ],
      score: 80
    });
    
    // Rule 6: Unusual admin activity outside business hours
    this.correlationRules.push({
      id: 'RULE-006',
      name: 'Off-hours Admin Activity',
      description: 'Administrative actions performed outside of normal business hours',
      severity: 'medium',
      requiredPatterns: [
        { eventType: 'admin_action', minCount: 1, timeWindowMinutes: 60, businessHours: false }
      ],
      score: 65
    });
  }
  
  /**
   * Analyze new security events for patterns
   */
  async analyzeEvents(clientId: number, newEvents: SecurityEvent[]): Promise<CorrelationResult[]> {
    try {
      // Load recent data if not in cache
      await this.loadRecentData(clientId);
      
      // Add new events to memory for analysis
      this.updateEventCache(clientId, newEvents);
      
      // Apply correlation rules
      const results: CorrelationResult[] = [];
      
      for (const rule of this.correlationRules) {
        const matches = await this.applyRule(clientId, rule, newEvents);
        results.push(...matches);
      }
      
      // Process results (create correlated threats, update risk scores, etc.)
      if (results.length > 0) {
        await this.processCorrelationResults(clientId, results);
      }
      
      return results;
    } catch (error) {
      log(`Error in threat correlation engine: ${error}`, 'threat-correlation');
      return [];
    }
  }
  
  /**
   * Load recent security data for correlation analysis
   */
  private async loadRecentData(clientId: number): Promise<void> {
    try {
      // Only load data if not already in cache
      if (!this.alertCache.has(clientId)) {
        // Get recent alerts (last 24 hours)
        const alerts = await storage.getAlerts(clientId, 100);
        this.alertCache.set(clientId, alerts);
        
        // Get recent threats (last 24 hours)
        const threats = await storage.getThreats(clientId, 50);
        this.threatCache.set(clientId, threats);
        
        // Get recent anomalies (last 24 hours)
        const anomalies = await storage.getAnomalies(clientId, 50);
        this.anomalyCache.set(clientId, anomalies);
      }
    } catch (error) {
      log(`Error loading recent data: ${error}`, 'threat-correlation');
      throw error;
    }
  }
  
  /**
   * Update the event cache with new events
   */
  private updateEventCache(clientId: number, newEvents: SecurityEvent[]): void {
    for (const event of newEvents) {
      switch (event.type) {
        case 'alert':
          const alerts = this.alertCache.get(clientId) || [];
          alerts.push(event.data as Alert);
          this.alertCache.set(clientId, alerts);
          break;
        case 'threat':
          const threats = this.threatCache.get(clientId) || [];
          threats.push(event.data as Threat);
          this.threatCache.set(clientId, threats);
          break;
        case 'anomaly':
          const anomalies = this.anomalyCache.get(clientId) || [];
          anomalies.push(event.data as Anomaly);
          this.anomalyCache.set(clientId, anomalies);
          break;
      }
    }
  }
  
  /**
   * Apply a correlation rule to the dataset
   */
  private async applyRule(
    clientId: number, 
    rule: CorrelationRule, 
    triggerEvents: SecurityEvent[]
  ): Promise<CorrelationResult[]> {
    const results: CorrelationResult[] = [];
    
    // For each trigger event, check if it potentially completes a pattern
    for (const triggerEvent of triggerEvents) {
      // Skip events that don't match any pattern in the rule
      if (!this.eventMatchesRulePattern(triggerEvent, rule)) {
        continue;
      }
      
      // Get all recent events that could form a pattern with this event
      const relevantEvents = this.getRelevantEvents(clientId, rule, triggerEvent.timestamp);
      
      // Check if the events match the pattern
      if (this.eventsMatchPattern(relevantEvents, rule, triggerEvent)) {
        // Create a correlation result
        const matchedEvents = this.extractMatchedEvents(relevantEvents, rule, triggerEvent);
        
        results.push({
          ruleId: rule.id,
          ruleName: rule.name,
          ruleDescription: rule.description,
          severity: rule.severity,
          score: rule.score,
          triggerEvent: triggerEvent,
          matchedEvents: matchedEvents,
          timestamp: new Date().toISOString(),
          systemsInvolved: this.getUniqueSystemsInvolved(matchedEvents)
        });
      }
    }
    
    return results;
  }
  
  /**
   * Check if an event matches any pattern in the rule
   */
  private eventMatchesRulePattern(event: SecurityEvent, rule: CorrelationRule): boolean {
    return rule.requiredPatterns.some(pattern => {
      // Extract the event type from various event sources
      let eventType = '';
      
      if (event.type === 'alert') {
        const alert = event.data as Alert;
        eventType = alert.alertType || '';
      } else if (event.type === 'threat') {
        const threat = event.data as Threat;
        eventType = threat.threatType || '';
      } else if (event.type === 'anomaly') {
        const anomaly = event.data as Anomaly;
        eventType = anomaly.anomalyType || '';
      }
      
      return eventType === pattern.eventType;
    });
  }
  
  /**
   * Get all events relevant to a rule within the time window
   */
  private getRelevantEvents(
    clientId: number, 
    rule: CorrelationRule, 
    currentTime: string
  ): SecurityEvent[] {
    const relevantEvents: SecurityEvent[] = [];
    const now = new Date(currentTime);
    
    // Calculate the maximum time window needed for this rule
    const maxTimeWindow = Math.max(...rule.requiredPatterns.map(p => p.timeWindowMinutes));
    const oldestRelevantTime = new Date(now.getTime() - maxTimeWindow * 60 * 1000);
    
    // Get relevant alerts
    const alerts = this.alertCache.get(clientId) || [];
    for (const alert of alerts) {
      const alertTime = new Date(alert.createdAt);
      if (alertTime >= oldestRelevantTime && alertTime <= now) {
        relevantEvents.push({
          type: 'alert',
          data: alert,
          timestamp: alert.createdAt
        });
      }
    }
    
    // Get relevant threats
    const threats = this.threatCache.get(clientId) || [];
    for (const threat of threats) {
      const threatTime = new Date(threat.detectedAt);
      if (threatTime >= oldestRelevantTime && threatTime <= now) {
        relevantEvents.push({
          type: 'threat',
          data: threat,
          timestamp: threat.detectedAt
        });
      }
    }
    
    // Get relevant anomalies
    const anomalies = this.anomalyCache.get(clientId) || [];
    for (const anomaly of anomalies) {
      const anomalyTime = new Date(anomaly.detectedAt);
      if (anomalyTime >= oldestRelevantTime && anomalyTime <= now) {
        relevantEvents.push({
          type: 'anomaly',
          data: anomaly,
          timestamp: anomaly.detectedAt
        });
      }
    }
    
    return relevantEvents;
  }
  
  /**
   * Check if the events match the pattern specified in the rule
   */
  private eventsMatchPattern(
    events: SecurityEvent[], 
    rule: CorrelationRule, 
    triggerEvent: SecurityEvent
  ): boolean {
    // Check each pattern in the rule
    for (const pattern of rule.requiredPatterns) {
      // Find events that match this pattern's event type
      const matchingEvents = events.filter(event => {
        let eventType = '';
        
        if (event.type === 'alert') {
          const alert = event.data as Alert;
          eventType = alert.alertType || '';
        } else if (event.type === 'threat') {
          const threat = event.data as Threat;
          eventType = threat.threatType || '';
        } else if (event.type === 'anomaly') {
          const anomaly = event.data as Anomaly;
          eventType = anomaly.anomalyType || '';
        }
        
        return eventType === pattern.eventType;
      });
      
      // Check if we have enough events of this type
      if (matchingEvents.length < pattern.minCount) {
        return false;
      }
      
      // Check if events occurred within the time window
      const now = new Date(triggerEvent.timestamp);
      const windowStart = new Date(now.getTime() - pattern.timeWindowMinutes * 60 * 1000);
      
      const eventsInWindow = matchingEvents.filter(event => {
        const eventTime = new Date(event.timestamp);
        return eventTime >= windowStart && eventTime <= now;
      });
      
      if (eventsInWindow.length < pattern.minCount) {
        return false;
      }
      
      // If required, check if events are from unique systems
      if (pattern.uniqueSystems) {
        const systems = new Set<string>();
        
        eventsInWindow.forEach(event => {
          let system = '';
          
          if (event.type === 'alert') {
            const alert = event.data as Alert;
            system = alert.source || '';
          } else if (event.type === 'threat') {
            const threat = event.data as Threat;
            system = threat.affectedSystem || '';
          } else if (event.type === 'anomaly') {
            const anomaly = event.data as Anomaly;
            system = anomaly.source || '';
          }
          
          if (system) {
            systems.add(system);
          }
        });
        
        if (systems.size < pattern.minCount) {
          return false;
        }
      }
      
      // If required, check if events occurred outside business hours
      if (pattern.businessHours === false) {
        const businessHoursStart = 9; // 9 AM
        const businessHoursEnd = 17; // 5 PM
        
        const eventsOutsideBusinessHours = eventsInWindow.filter(event => {
          const eventTime = new Date(event.timestamp);
          const hour = eventTime.getHours();
          return hour < businessHoursStart || hour >= businessHoursEnd;
        });
        
        if (eventsOutsideBusinessHours.length < pattern.minCount) {
          return false;
        }
      }
    }
    
    return true;
  }
  
  /**
   * Extract the events that matched the pattern
   */
  private extractMatchedEvents(
    events: SecurityEvent[], 
    rule: CorrelationRule, 
    triggerEvent: SecurityEvent
  ): SecurityEvent[] {
    const matchedEvents: SecurityEvent[] = [triggerEvent];
    
    // Group events by type
    const eventsByType: Record<string, SecurityEvent[]> = {};
    
    for (const event of events) {
      let eventType = '';
      
      if (event.type === 'alert') {
        const alert = event.data as Alert;
        eventType = alert.alertType || '';
      } else if (event.type === 'threat') {
        const threat = event.data as Threat;
        eventType = threat.threatType || '';
      } else if (event.type === 'anomaly') {
        const anomaly = event.data as Anomaly;
        eventType = anomaly.anomalyType || '';
      }
      
      if (!eventsByType[eventType]) {
        eventsByType[eventType] = [];
      }
      
      eventsByType[eventType].push(event);
    }
    
    // For each pattern, select the required number of matching events
    for (const pattern of rule.requiredPatterns) {
      const matchingEvents = eventsByType[pattern.eventType] || [];
      
      // Sort by timestamp (most recent first)
      matchingEvents.sort((a, b) => {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      });
      
      // Add the required number of events
      for (let i = 0; i < Math.min(pattern.minCount, matchingEvents.length); i++) {
        if (!matchedEvents.includes(matchingEvents[i])) {
          matchedEvents.push(matchingEvents[i]);
        }
      }
    }
    
    return matchedEvents;
  }
  
  /**
   * Get unique systems involved in the events
   */
  private getUniqueSystemsInvolved(events: SecurityEvent[]): string[] {
    const systems = new Set<string>();
    
    for (const event of events) {
      let system = '';
      
      if (event.type === 'alert') {
        const alert = event.data as Alert;
        system = alert.source || '';
      } else if (event.type === 'threat') {
        const threat = event.data as Threat;
        system = threat.affectedSystem || '';
      } else if (event.type === 'anomaly') {
        const anomaly = event.data as Anomaly;
        system = anomaly.source || '';
      }
      
      if (system) {
        systems.add(system);
      }
    }
    
    return Array.from(systems);
  }
  
  /**
   * Process correlation results (create threats, update risk scores, etc.)
   */
  private async processCorrelationResults(clientId: number, results: CorrelationResult[]): Promise<void> {
    try {
      for (const result of results) {
        // Create a new threat based on the correlation
        const newThreat = {
          clientId,
          title: `AI Correlated Threat: ${result.ruleName}`,
          description: `${result.ruleDescription} - Correlation Score: ${result.score}`,
          severity: result.severity,
          status: 'active',
          threatType: 'correlated',
          source: 'AI Correlation Engine',
          affectedSystem: result.systemsInvolved.join(', '),
          detectedAt: result.timestamp,
          details: JSON.stringify({
            ruleId: result.ruleId,
            score: result.score,
            matchedEvents: result.matchedEvents.map(e => ({
              type: e.type,
              id: this.getEventId(e),
              timestamp: e.timestamp
            }))
          })
        };
        
        // Create the threat in storage
        await storage.createThreat(newThreat);
        
        log(`Created correlated threat: ${result.ruleName}`, 'threat-correlation');
      }
    } catch (error) {
      log(`Error processing correlation results: ${error}`, 'threat-correlation');
      throw error;
    }
  }
  
  /**
   * Get the ID of an event
   */
  private getEventId(event: SecurityEvent): number {
    if (event.type === 'alert') {
      return (event.data as Alert).id;
    } else if (event.type === 'threat') {
      return (event.data as Threat).id;
    } else if (event.type === 'anomaly') {
      return (event.data as Anomaly).id;
    }
    return 0;
  }
}

// Types for the correlation engine
interface SecurityEvent {
  type: 'alert' | 'threat' | 'anomaly';
  data: Alert | Threat | Anomaly;
  timestamp: string;
}

interface PatternDefinition {
  eventType: string;
  minCount: number;
  timeWindowMinutes: number;
  afterPrevious?: boolean;
  uniqueSystems?: boolean;
  businessHours?: boolean;
}

interface CorrelationRule {
  id: string;
  name: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  requiredPatterns: PatternDefinition[];
  score: number;
}

interface CorrelationResult {
  ruleId: string;
  ruleName: string;
  ruleDescription: string;
  severity: string;
  score: number;
  triggerEvent: SecurityEvent;
  matchedEvents: SecurityEvent[];
  timestamp: string;
  systemsInvolved: string[];
}

// Export singleton instance
export const threatCorrelationEngine = new ThreatCorrelationEngine();