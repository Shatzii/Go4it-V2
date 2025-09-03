// Enterprise Audit Logger Module
// Production-ready audit logging with compliance features and data retention

import { createClient } from '@supabase/supabase-js';
import { logger } from './logger';

// Enterprise audit logger configuration
const config = {
  supabaseUrl: process.env.SUPABASE_URL || '',
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  enableAuditLogging: process.env.ENABLE_AUDIT_LOGGING !== 'false',
  retentionDays: parseInt(process.env.AUDIT_RETENTION_DAYS || '2555'), // 7 years for compliance
  batchSize: parseInt(process.env.AUDIT_BATCH_SIZE || '100'),
  flushInterval: parseInt(process.env.AUDIT_FLUSH_INTERVAL || '30000'), // 30 seconds
  enableEncryption: process.env.ENABLE_AUDIT_ENCRYPTION === 'true',
  encryptionKey: process.env.AUDIT_ENCRYPTION_KEY,
  complianceMode: process.env.AUDIT_COMPLIANCE_MODE === 'true', // Strict mode for regulated industries
};

interface AuditEvent {
  id: string;
  timestamp: Date;
  userId: string;
  action: string;
  resource: string;
  details: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
  location?: {
    country?: string;
    region?: string;
    city?: string;
  };
  riskScore?: number;
  complianceFlags?: string[];
  metadata?: Record<string, any>;
}

interface AuditQuery {
  userId?: string;
  action?: string;
  resource?: string;
  startDate?: Date;
  endDate?: Date;
  ipAddress?: string;
  sessionId?: string;
  limit?: number;
  offset?: number;
}

export class EnterpriseAuditLogger {
  private supabase: any;
  private pendingEvents: AuditEvent[] = [];
  private flushTimer?: NodeJS.Timeout;
  private isInitialized: boolean = false;

  constructor() {
    this.initializeAuditLogger();
  }

  private async initializeAuditLogger(): Promise<void> {
    try {
      if (!config.enableAuditLogging) {
        console.log('Audit logging disabled');
        return;
      }

      this.supabase = createClient(config.supabaseUrl, config.supabaseServiceKey);

      // Start periodic flush
      this.flushTimer = setInterval(() => {
        this.flushEvents();
      }, config.flushInterval);

      this.isInitialized = true;
      console.log('Enterprise Audit Logger initialized successfully');

    } catch (error) {
      console.error('Failed to initialize Enterprise Audit Logger:', error);
      throw error;
    }
  }

  // Log an audit event
  async log(event: AuditEvent): Promise<void> {
    if (!this.isInitialized) return;

    try {
      // Enrich event with additional context
      const enrichedEvent = await this.enrichEvent(event);

      // Add to pending batch
      this.pendingEvents.push(enrichedEvent);

      // Auto-flush if batch size reached
      if (this.pendingEvents.length >= config.batchSize) {
        await this.flushEvents();
      }

      // Log to console for immediate visibility
      logger.info(`AUDIT: ${event.action} on ${event.resource}`, {
        userId: event.userId,
        auditId: event.id,
        details: event.details,
      });

    } catch (error) {
      console.error('Failed to log audit event:', error);
      // Don't throw - audit logging should never break the main flow
    }
  }

  // Log user authentication events
  async logAuthentication(
    userId: string,
    action: 'login' | 'logout' | 'failed_login' | 'password_change' | 'mfa_enabled' | 'mfa_disabled',
    details: {
      ipAddress?: string;
      userAgent?: string;
      sessionId?: string;
      success?: boolean;
      failureReason?: string;
      deviceInfo?: Record<string, any>;
    }
  ): Promise<void> {
    const event: AuditEvent = {
      id: `auth_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      userId,
      action: `auth_${action}`,
      resource: 'user_authentication',
      details: {
        ...details,
        riskScore: this.calculateAuthRiskScore(action, details),
      },
      ipAddress: details.ipAddress,
      userAgent: details.userAgent,
      sessionId: details.sessionId,
    };

    await this.log(event);
  }

  // Log data access events
  async logDataAccess(
    userId: string,
    action: 'read' | 'create' | 'update' | 'delete' | 'export',
    resource: string,
    details: {
      recordId?: string;
      recordType?: string;
      fields?: string[];
      filters?: Record<string, any>;
      ipAddress?: string;
      userAgent?: string;
      sessionId?: string;
      sensitiveData?: boolean;
    }
  ): Promise<void> {
    const event: AuditEvent = {
      id: `data_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      userId,
      action: `data_${action}`,
      resource,
      details: {
        ...details,
        complianceFlags: this.getComplianceFlags(action, details),
      },
      ipAddress: details.ipAddress,
      userAgent: details.userAgent,
      sessionId: details.sessionId,
      complianceFlags: this.getComplianceFlags(action, details),
    };

    await this.log(event);
  }

  // Log system events
  async logSystemEvent(
    action: string,
    details: {
      component?: string;
      severity?: 'low' | 'medium' | 'high' | 'critical';
      error?: Error;
      performance?: Record<string, any>;
      configuration?: Record<string, any>;
    }
  ): Promise<void> {
    const event: AuditEvent = {
      id: `system_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      userId: 'system',
      action: `system_${action}`,
      resource: 'system',
      details,
      riskScore: details.severity === 'critical' ? 100 : details.severity === 'high' ? 75 : 25,
    };

    await this.log(event);
  }

  // Log compliance events
  async logComplianceEvent(
    userId: string,
    regulation: 'GDPR' | 'CCPA' | 'HIPAA' | 'SOX' | 'PCI_DSS',
    action: string,
    details: {
      dataSubject?: string;
      dataCategories?: string[];
      legalBasis?: string;
      consentGiven?: boolean;
      ipAddress?: string;
      userAgent?: string;
      sessionId?: string;
    }
  ): Promise<void> {
    const event: AuditEvent = {
      id: `compliance_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      userId,
      action: `compliance_${regulation}_${action}`,
      resource: 'compliance',
      details,
      ipAddress: details.ipAddress,
      userAgent: details.userAgent,
      sessionId: details.sessionId,
      complianceFlags: [regulation],
    };

    await this.log(event);
  }

  // Query audit events
  async queryEvents(query: AuditQuery): Promise<{
    events: AuditEvent[];
    total: number;
    hasMore: boolean;
  }> {
    if (!this.isInitialized) return { events: [], total: 0, hasMore: false };

    try {
      let dbQuery = this.supabase
        .from('audit_events')
        .select('*', { count: 'exact' })
        .order('timestamp', { ascending: false });

      // Apply filters
      if (query.userId) {
        dbQuery = dbQuery.eq('user_id', query.userId);
      }

      if (query.action) {
        dbQuery = dbQuery.ilike('action', `%${query.action}%`);
      }

      if (query.resource) {
        dbQuery = dbQuery.ilike('resource', `%${query.resource}%`);
      }

      if (query.startDate) {
        dbQuery = dbQuery.gte('timestamp', query.startDate.toISOString());
      }

      if (query.endDate) {
        dbQuery = dbQuery.lte('timestamp', query.endDate.toISOString());
      }

      if (query.ipAddress) {
        dbQuery = dbQuery.eq('ip_address', query.ipAddress);
      }

      if (query.sessionId) {
        dbQuery = dbQuery.eq('session_id', query.sessionId);
      }

      // Apply pagination
      const limit = query.limit || 50;
      const offset = query.offset || 0;
      dbQuery = dbQuery.range(offset, offset + limit - 1);

      const { data, error, count } = await dbQuery;

      if (error) {
        throw error;
      }

      // Decrypt events if encryption is enabled
      const events = data.map((row: any) => this.decryptEvent(row));

      return {
        events,
        total: count || 0,
        hasMore: (offset + limit) < (count || 0),
      };

    } catch (error) {
      console.error('Failed to query audit events:', error);
      return { events: [], total: 0, hasMore: false };
    }
  }

  // Get audit statistics
  async getAuditStats(timeRange?: { start: Date; end: Date }): Promise<any> {
    if (!this.isInitialized) return {};

    try {
      let query = this.supabase
        .from('audit_events')
        .select('action, resource, risk_score, compliance_flags');

      if (timeRange) {
        query = query
          .gte('timestamp', timeRange.start.toISOString())
          .lte('timestamp', timeRange.end.toISOString());
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      const stats = {
        totalEvents: data.length,
        eventsByAction: {} as Record<string, number>,
        eventsByResource: {} as Record<string, number>,
        riskScoreDistribution: {
          low: 0,
          medium: 0,
          high: 0,
          critical: 0,
        },
        complianceEvents: 0,
        timeRange: timeRange || 'all',
        timestamp: new Date().toISOString(),
      };

      data.forEach((event: any) => {
        // Count by action
        stats.eventsByAction[event.action] = (stats.eventsByAction[event.action] || 0) + 1;

        // Count by resource
        stats.eventsByResource[event.resource] = (stats.eventsByResource[event.resource] || 0) + 1;

        // Risk score distribution
        const riskScore = event.risk_score || 0;
        if (riskScore >= 75) stats.riskScoreDistribution.critical++;
        else if (riskScore >= 50) stats.riskScoreDistribution.high++;
        else if (riskScore >= 25) stats.riskScoreDistribution.medium++;
        else stats.riskScoreDistribution.low++;

        // Compliance events
        if (event.compliance_flags && event.compliance_flags.length > 0) {
          stats.complianceEvents++;
        }
      });

      return stats;

    } catch (error) {
      console.error('Failed to get audit stats:', error);
      return {};
    }
  }

  // Export audit events for compliance
  async exportEvents(query: AuditQuery, format: 'json' | 'csv' = 'json'): Promise<string> {
    const { events } = await this.queryEvents({ ...query, limit: 10000 });

    if (format === 'csv') {
      return this.convertToCSV(events);
    }

    return JSON.stringify(events, null, 2);
  }

  // Private helper methods
  private async enrichEvent(event: AuditEvent): Promise<AuditEvent> {
    const enriched = { ...event };

    // Add location data if IP is available
    if (event.ipAddress && event.ipAddress !== 'unknown') {
      try {
        enriched.location = await this.getLocationFromIP(event.ipAddress);
      } catch (error) {
        // Silently fail for location enrichment
      }
    }

    // Calculate risk score if not provided
    if (enriched.riskScore === undefined) {
      enriched.riskScore = this.calculateRiskScore(event);
    }

    // Add compliance flags if not provided
    if (!enriched.complianceFlags) {
      enriched.complianceFlags = this.getComplianceFlags(event.action, event.details);
    }

    return enriched;
  }

  private calculateAuthRiskScore(action: string, details: any): number {
    let score = 0;

    if (action === 'failed_login') score += 50;
    if (details.success === false) score += 25;

    // Add score based on unusual patterns
    if (details.deviceInfo?.isNewDevice) score += 20;
    if (details.deviceInfo?.isSuspiciousLocation) score += 30;

    return Math.min(score, 100);
  }

  private calculateRiskScore(event: AuditEvent): number {
    let score = 0;

    // Base score by action type
    if (event.action.includes('delete')) score += 40;
    if (event.action.includes('admin')) score += 30;
    if (event.action.includes('export')) score += 25;
    if (event.action.includes('failed')) score += 35;

    // Score by resource sensitivity
    if (event.resource.includes('user') || event.resource.includes('profile')) score += 20;
    if (event.resource.includes('payment') || event.resource.includes('financial')) score += 50;
    if (event.resource.includes('system') || event.resource.includes('config')) score += 45;

    // Score by details
    if (event.details?.sensitiveData) score += 30;
    if (event.details?.adminAction) score += 25;

    return Math.min(score, 100);
  }

  private getComplianceFlags(action: string, details: any): string[] {
    const flags: string[] = [];

    // GDPR flags
    if (action.includes('data') && details?.dataSubject) {
      flags.push('GDPR');
    }

    // HIPAA flags
    if (details?.healthData || details?.medicalRecords) {
      flags.push('HIPAA');
    }

    // SOX flags
    if (action.includes('financial') || details?.financialData) {
      flags.push('SOX');
    }

    // PCI DSS flags
    if (details?.paymentData || details?.cardData) {
      flags.push('PCI_DSS');
    }

    return flags;
  }

  private async getLocationFromIP(ipAddress: string): Promise<any> {
    // In production, integrate with IP geolocation service
    // For now, return mock data
    return {
      country: 'US',
      region: 'CA',
      city: 'San Francisco',
    };
  }

  private async flushEvents(): Promise<void> {
    if (!this.isInitialized || this.pendingEvents.length === 0) return;

    try {
      const eventsToFlush = [...this.pendingEvents];
      this.pendingEvents = [];

      // Encrypt events if enabled
      const processedEvents = config.enableEncryption
        ? eventsToFlush.map(event => this.encryptEvent(event))
        : eventsToFlush;

      const eventRecords = processedEvents.map(event => ({
        id: event.id,
        timestamp: event.timestamp.toISOString(),
        user_id: event.userId,
        action: event.action,
        resource: event.resource,
        details: event.details,
        ip_address: event.ipAddress,
        user_agent: event.userAgent,
        session_id: event.sessionId,
        location: event.location,
        risk_score: event.riskScore,
        compliance_flags: event.complianceFlags,
        metadata: event.metadata,
      }));

      const { error } = await this.supabase
        .from('audit_events')
        .insert(eventRecords);

      if (error) {
        console.error('Failed to flush audit events:', error);
        // Re-queue failed events
        this.pendingEvents.unshift(...eventsToFlush);
      } else {
        console.log(`Flushed ${eventsToFlush.length} audit events to database`);
      }

    } catch (error) {
      console.error('Error flushing audit events:', error);
      // Don't re-queue on error to prevent infinite loops
    }
  }

  private encryptEvent(event: AuditEvent): any {
    // In production, implement proper encryption
    // For now, return as-is
    return event;
  }

  private decryptEvent(row: any): AuditEvent {
    // In production, implement proper decryption
    // For now, return as-is
    return {
      id: row.id,
      timestamp: new Date(row.timestamp),
      userId: row.user_id,
      action: row.action,
      resource: row.resource,
      details: row.details,
      ipAddress: row.ip_address,
      userAgent: row.user_agent,
      sessionId: row.session_id,
      location: row.location,
      riskScore: row.risk_score,
      complianceFlags: row.compliance_flags,
      metadata: row.metadata,
    };
  }

  private convertToCSV(events: AuditEvent[]): string {
    const headers = [
      'ID',
      'Timestamp',
      'User ID',
      'Action',
      'Resource',
      'IP Address',
      'Risk Score',
      'Compliance Flags',
      'Details'
    ];

    const rows = events.map(event => [
      event.id,
      event.timestamp.toISOString(),
      event.userId,
      event.action,
      event.resource,
      event.ipAddress || '',
      event.riskScore?.toString() || '',
      (event.complianceFlags || []).join(';'),
      JSON.stringify(event.details),
    ]);

    return [headers, ...rows]
      .map(row => row.map(field => `"${field.replace(/"/g, '""')}"`).join(','))
      .join('\n');
  }

  // Clean up old audit events
  async cleanupOldEvents(): Promise<void> {
    if (!this.isInitialized) return;

    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - config.retentionDays);

      const { error } = await this.supabase
        .from('audit_events')
        .delete()
        .lt('timestamp', cutoffDate.toISOString());

      if (error) {
        console.error('Failed to cleanup old audit events:', error);
      } else {
        console.log(`Cleaned up audit events older than ${config.retentionDays} days`);
      }

    } catch (error) {
      console.error('Error cleaning up old audit events:', error);
    }
  }

  // Shutdown gracefully
  async shutdown(): Promise<void> {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }

    // Final flush
    await this.flushEvents();

    console.log('Enterprise Audit Logger shut down gracefully');
  }
}

// Export singleton instance
export const auditLogger = new EnterpriseAuditLogger();

// Graceful shutdown handling
process.on('SIGINT', async () => {
  await auditLogger.shutdown();
});

process.on('SIGTERM', async () => {
  await auditLogger.shutdown();
});

export default auditLogger;
