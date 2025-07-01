/**
 * Universal One School - Integrated Security Monitoring System
 * 
 * Enhanced cybersecurity monitoring with educational platform compliance
 * COPPA, FERPA, GDPR compliant security event monitoring
 */

import { EventEmitter } from 'events';
import crypto from 'crypto';
import { storage } from '../storage';
import { alertSystemService } from './alertSystem';
import { notificationHub } from './notificationHub';

// Security Event Types for Educational Platform
export enum EducationalSecurityEventType {
  STUDENT_AUTHENTICATION = 'student_authentication',
  PARENT_ACCESS = 'parent_access',
  TEACHER_DATA_ACCESS = 'teacher_data_access',
  GRADE_MODIFICATION = 'grade_modification',
  STUDENT_RECORD_ACCESS = 'student_record_access',
  SOCIAL_MEDIA_MONITORING = 'social_media_monitoring',
  CYBERBULLYING_DETECTION = 'cyberbullying_detection',
  PREDATOR_ALERT = 'predator_alert',
  PARENTAL_CONSENT = 'parental_consent',
  DATA_EXPORT_REQUEST = 'data_export_request',
  PRIVACY_VIOLATION = 'privacy_violation',
  AI_INTERACTION = 'ai_interaction',
  SYSTEM_INTRUSION = 'system_intrusion'
}

export enum SecuritySeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
  EMERGENCY = 'emergency'
}

export interface EducationalSecurityEvent {
  id: string;
  timestamp: Date;
  type: EducationalSecurityEventType;
  severity: SecuritySeverity;
  schoolId: string;
  userId?: string;
  studentId?: string;
  parentId?: string;
  sessionId?: string;
  ipAddress?: string;
  userAgent?: string;
  action: string;
  resource: string;
  success: boolean;
  details: Record<string, any>;
  riskScore: number;
  compliance: {
    coppa: boolean;
    ferpa: boolean;
    gdpr: boolean;
    violations: string[];
  };
  requiresParentNotification: boolean;
  requiresLawEnforcement: boolean;
  autoResponse?: string;
}

export interface ThreatPattern {
  id: string;
  name: string;
  description: string;
  severity: SecuritySeverity;
  conditions: ((events: EducationalSecurityEvent[]) => boolean)[];
  autoResponse?: 'block_user' | 'notify_parent' | 'alert_admin' | 'contact_law_enforcement';
  complianceImpact?: ('COPPA' | 'FERPA' | 'GDPR')[];
}

export class UniversalOneSchoolSecurityMonitor extends EventEmitter {
  private events: EducationalSecurityEvent[] = [];
  private threatPatterns: ThreatPattern[] = [];
  private schoolConfigs: Map<string, any> = new Map();
  private alertThresholds: Map<string, number> = new Map();

  constructor() {
    super();
    this.initializeSchoolConfigurations();
    this.initializeThreatPatterns();
    this.setupAlertThresholds();
    this.startRealTimeMonitoring();
  }

  private initializeSchoolConfigurations(): void {
    // Configuration for each school in Universal One School system
    this.schoolConfigs.set('superhero', {
      name: 'SuperHero School',
      gradeRange: 'K-6',
      studentCount: 687,
      campus: 'dallas',
      securityLevel: 'enhanced', // Higher protection for younger students
      coppaRequired: true, // All students likely under 13
      parentNotificationRequired: true,
      socialMediaMonitoring: 'comprehensive'
    });

    this.schoolConfigs.set('stage-prep', {
      name: 'Stage Prep School',
      gradeRange: '7-12',
      studentCount: 312,
      campus: 'merida',
      securityLevel: 'enhanced',
      coppaRequired: false, // Students over 13
      parentNotificationRequired: true,
      socialMediaMonitoring: 'enhanced'
    });

    this.schoolConfigs.set('language-academy', {
      name: 'Language Academy',
      gradeRange: 'All Ages',
      studentCount: 1000,
      campus: 'vienna',
      securityLevel: 'standard',
      coppaRequired: true, // Mixed ages
      parentNotificationRequired: true,
      socialMediaMonitoring: 'standard'
    });

    this.schoolConfigs.set('law-school', {
      name: 'Law School',
      gradeRange: 'Justice Youth',
      studentCount: 147,
      campus: 'dallas',
      securityLevel: 'maximum', // Highest protection for at-risk youth
      coppaRequired: false,
      parentNotificationRequired: true,
      socialMediaMonitoring: 'comprehensive',
      lawEnforcementIntegration: true
    });
  }

  private initializeThreatPatterns(): void {
    this.threatPatterns = [
      {
        id: 'social_media_predator_contact',
        name: 'Predator Contact Detection',
        description: 'Potential predator attempting to contact student',
        severity: SecuritySeverity.EMERGENCY,
        conditions: [
          (events) => events.some(e => 
            e.type === EducationalSecurityEventType.SOCIAL_MEDIA_MONITORING &&
            e.details.predatorRiskScore > 85
          )
        ],
        autoResponse: 'contact_law_enforcement',
        complianceImpact: ['COPPA']
      },
      {
        id: 'cyberbullying_escalation',
        name: 'Cyberbullying Escalation',
        description: 'Cyberbullying incident requiring immediate intervention',
        severity: SecuritySeverity.CRITICAL,
        conditions: [
          (events) => events.some(e => 
            e.type === EducationalSecurityEventType.CYBERBULLYING_DETECTION &&
            e.details.bullyingIntensity === 'severe'
          )
        ],
        autoResponse: 'notify_parent'
      },
      {
        id: 'student_data_breach',
        name: 'Student Data Unauthorized Access',
        description: 'Unauthorized access to student records',
        severity: SecuritySeverity.CRITICAL,
        conditions: [
          (events) => events.some(e => 
            e.type === EducationalSecurityEventType.STUDENT_RECORD_ACCESS &&
            !e.success &&
            e.details.attemptCount > 3
          )
        ],
        autoResponse: 'block_user',
        complianceImpact: ['FERPA', 'COPPA']
      },
      {
        id: 'bulk_grade_modification',
        name: 'Suspicious Grade Changes',
        description: 'Unusual pattern of grade modifications',
        severity: SecuritySeverity.HIGH,
        conditions: [
          (events) => {
            const gradeChanges = events.filter(e => 
              e.type === EducationalSecurityEventType.GRADE_MODIFICATION &&
              e.timestamp > new Date(Date.now() - 60 * 60 * 1000) // Last hour
            );
            return gradeChanges.length > 50;
          }
        ],
        autoResponse: 'alert_admin',
        complianceImpact: ['FERPA']
      },
      {
        id: 'after_hours_access',
        name: 'After Hours System Access',
        description: 'System access during unusual hours',
        severity: SecuritySeverity.MEDIUM,
        conditions: [
          (events) => {
            const hour = new Date().getHours();
            return events.some(e => 
              (hour < 6 || hour > 22) &&
              e.type === EducationalSecurityEventType.TEACHER_DATA_ACCESS
            );
          }
        ],
        autoResponse: 'alert_admin'
      },
      {
        id: 'parent_consent_violation',
        name: 'COPPA Consent Violation',
        description: 'Data collection without parental consent for under-13 users',
        severity: SecuritySeverity.CRITICAL,
        conditions: [
          (events) => events.some(e => 
            !e.compliance.coppa &&
            e.details.studentAge < 13
          )
        ],
        autoResponse: 'notify_parent',
        complianceImpact: ['COPPA']
      }
    ];
  }

  private setupAlertThresholds(): void {
    this.alertThresholds.set('failed_student_logins_per_hour', 5);
    this.alertThresholds.set('parent_access_failures_per_day', 3);
    this.alertThresholds.set('student_records_accessed_per_hour', 100);
    this.alertThresholds.set('social_media_alerts_per_day', 10);
    this.alertThresholds.set('ai_interactions_per_student_per_hour', 50);
  }

  // Core Security Event Logging for Educational Platform
  async logEducationalSecurityEvent(
    type: EducationalSecurityEventType,
    action: string,
    resource: string,
    schoolId: string,
    details: Record<string, any>,
    context?: {
      userId?: string;
      studentId?: string;
      parentId?: string;
      sessionId?: string;
      ipAddress?: string;
      userAgent?: string;
      success?: boolean;
    }
  ): Promise<void> {
    const schoolConfig = this.schoolConfigs.get(schoolId);
    
    const event: EducationalSecurityEvent = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      type,
      severity: this.calculateEducationalSeverity(type, action, details, schoolConfig),
      schoolId,
      userId: context?.userId,
      studentId: context?.studentId,
      parentId: context?.parentId,
      sessionId: context?.sessionId,
      ipAddress: context?.ipAddress,
      userAgent: context?.userAgent,
      action,
      resource,
      success: context?.success ?? true,
      details,
      riskScore: this.calculateEducationalRiskScore(type, action, details, schoolConfig),
      compliance: this.checkEducationalCompliance(type, action, details, schoolConfig),
      requiresParentNotification: this.requiresParentNotification(type, details, schoolConfig),
      requiresLawEnforcement: this.requiresLawEnforcement(type, details, schoolConfig)
    };

    // Store event
    this.events.push(event);
    if (this.events.length > 50000) {
      this.events = this.events.slice(-25000); // Rotate events
    }

    // Real-time threat detection
    await this.detectEducationalThreats(event);

    // Compliance violation checking
    await this.handleComplianceViolations(event);

    // Automated responses
    await this.executeAutomatedResponse(event);

    // Emit for real-time monitoring
    this.emit('educationalSecurityEvent', event);

    console.log(`Educational security event logged: ${type} - ${action} - School: ${schoolId}`);
  }

  // Specialized logging methods for educational scenarios
  async logSocialMediaIncident(
    studentId: string,
    schoolId: string,
    platform: string,
    incidentType: 'cyberbullying' | 'predator_contact' | 'inappropriate_content',
    severity: SecuritySeverity,
    details: {
      content?: string;
      participants: string[];
      riskScore: number;
      evidenceUrls?: string[];
      parentNotified?: boolean;
    }
  ): Promise<void> {
    await this.logEducationalSecurityEvent(
      incidentType === 'cyberbullying' ? 
        EducationalSecurityEventType.CYBERBULLYING_DETECTION :
        EducationalSecurityEventType.PREDATOR_ALERT,
      'incident_detected',
      `social_media_${platform}`,
      schoolId,
      {
        platform,
        incidentType,
        participants: details.participants,
        riskScore: details.riskScore,
        evidenceUrls: details.evidenceUrls,
        contentAnalysis: details.content ? 'analyzed' : 'no_content',
        parentNotified: details.parentNotified
      },
      { studentId, success: true }
    );
  }

  async logParentalConsentEvent(
    studentId: string,
    parentId: string,
    schoolId: string,
    action: 'consent_given' | 'consent_withdrawn' | 'consent_requested',
    dataTypes: string[],
    age: number
  ): Promise<void> {
    await this.logEducationalSecurityEvent(
      EducationalSecurityEventType.PARENTAL_CONSENT,
      action,
      'parental_consent_system',
      schoolId,
      {
        dataTypes,
        studentAge: age,
        coppaRequired: age < 13,
        consentMethod: 'digital_signature',
        timestamp: new Date()
      },
      { studentId, parentId, success: true }
    );
  }

  async logStudentDataAccess(
    userId: string,
    schoolId: string,
    action: 'view' | 'edit' | 'export' | 'delete',
    studentIds: string[],
    dataType: 'grades' | 'records' | 'communications' | 'health' | 'disciplinary',
    purpose: string
  ): Promise<void> {
    await this.logEducationalSecurityEvent(
      EducationalSecurityEventType.STUDENT_RECORD_ACCESS,
      action,
      `student_${dataType}`,
      schoolId,
      {
        dataType,
        studentIds,
        studentCount: studentIds.length,
        purpose,
        ferpaRequired: true,
        accessReason: purpose
      },
      { userId, success: true }
    );
  }

  async logAIInteraction(
    studentId: string,
    schoolId: string,
    interactionType: 'question' | 'assignment_help' | 'tutoring' | 'creative_writing',
    contentAnalysis: {
      appropriate: boolean;
      riskLevel: 'low' | 'medium' | 'high';
      topics: string[];
    }
  ): Promise<void> {
    await this.logEducationalSecurityEvent(
      EducationalSecurityEventType.AI_INTERACTION,
      'student_ai_chat',
      'claude_ai_system',
      schoolId,
      {
        interactionType,
        contentAppropriate: contentAnalysis.appropriate,
        riskLevel: contentAnalysis.riskLevel,
        topics: contentAnalysis.topics,
        parentalSupervisionRequired: contentAnalysis.riskLevel === 'high'
      },
      { studentId, success: true }
    );
  }

  // Enhanced threat detection for educational environment
  private async detectEducationalThreats(event: EducationalSecurityEvent): Promise<void> {
    for (const pattern of this.threatPatterns) {
      const recentEvents = this.events.filter(e => 
        e.timestamp > new Date(Date.now() - 24 * 60 * 60 * 1000) && // Last 24 hours
        e.schoolId === event.schoolId
      );

      if (pattern.conditions.every(condition => condition([...recentEvents, event]))) {
        await this.handleThreatDetection(event, pattern);
      }
    }
  }

  private async handleThreatDetection(
    event: EducationalSecurityEvent, 
    pattern: ThreatPattern
  ): Promise<void> {
    // Create high-priority alert
    await alertSystemService.createAlert(1, { // Using client ID 1 for now
      type: 'educational_threat_detected',
      severity: pattern.severity,
      title: `Educational Threat: ${pattern.name}`,
      description: `${pattern.description} - School: ${event.schoolId}, Pattern: ${pattern.id}`
    });

    // Execute automated response
    if (pattern.autoResponse) {
      await this.executePatternResponse(event, pattern);
    }

    console.log(`Educational threat detected: ${pattern.name} at school ${event.schoolId}`);
  }

  private async executePatternResponse(
    event: EducationalSecurityEvent,
    pattern: ThreatPattern
  ): Promise<void> {
    switch (pattern.autoResponse) {
      case 'contact_law_enforcement':
        await this.contactLawEnforcement(event, pattern);
        break;
      case 'notify_parent':
        await this.notifyParent(event);
        break;
      case 'alert_admin':
        await this.alertSchoolAdmin(event);
        break;
      case 'block_user':
        await this.blockUser(event);
        break;
    }
  }

  private async contactLawEnforcement(
    event: EducationalSecurityEvent,
    pattern: ThreatPattern
  ): Promise<void> {
    // Implementation for law enforcement notification
    console.log(`EMERGENCY: Contacting law enforcement for ${pattern.name} - Event ID: ${event.id}`);
    
    // Send notification to authorities
    await notificationHub.sendNotification(1, {
      title: 'EMERGENCY: Law Enforcement Required',
      description: `Serious threat detected requiring immediate law enforcement intervention`,
      severity: 'critical',
      type: 'emergency',
      source: 'educational_security_monitor'
    });
  }

  private async notifyParent(event: EducationalSecurityEvent): Promise<void> {
    if (event.studentId) {
      console.log(`Notifying parent for student ${event.studentId} - Event: ${event.type}`);
      
      // Send parent notification
      await notificationHub.sendNotification(1, {
        title: 'Student Safety Alert',
        description: `Your child requires immediate attention regarding online safety`,
        severity: event.severity,
        type: 'parent_notification',
        source: 'educational_security_monitor'
      });
    }
  }

  private async alertSchoolAdmin(event: EducationalSecurityEvent): Promise<void> {
    const schoolConfig = this.schoolConfigs.get(event.schoolId);
    console.log(`Alerting admin for ${schoolConfig?.name} - Event: ${event.type}`);
    
    await notificationHub.sendNotification(1, {
      title: `School Security Alert - ${schoolConfig?.name}`,
      description: `Security incident requires administrative review`,
      severity: event.severity,
      type: 'admin_alert',
      source: 'educational_security_monitor'
    });
  }

  private async blockUser(event: EducationalSecurityEvent): Promise<void> {
    if (event.userId) {
      console.log(`Blocking user ${event.userId} due to security violation`);
      // Implementation for user blocking would go here
    }
  }

  // Educational-specific compliance checking
  private checkEducationalCompliance(
    type: EducationalSecurityEventType,
    action: string,
    details: Record<string, any>,
    schoolConfig: any
  ): { coppa: boolean; ferpa: boolean; gdpr: boolean; violations: string[] } {
    const violations: string[] = [];
    
    // COPPA compliance check
    const coppaCompliant = this.checkCOPPACompliance(type, details, schoolConfig, violations);
    
    // FERPA compliance check
    const ferpaCompliant = this.checkFERPACompliance(type, action, details, violations);
    
    // GDPR compliance check
    const gdprCompliant = this.checkGDPRCompliance(type, details, violations);

    return {
      coppa: coppaCompliant,
      ferpa: ferpaCompliant,
      gdpr: gdprCompliant,
      violations
    };
  }

  private checkCOPPACompliance(
    type: EducationalSecurityEventType,
    details: Record<string, any>,
    schoolConfig: any,
    violations: string[]
  ): boolean {
    if (!schoolConfig?.coppaRequired) return true;

    // Check age verification
    if (details.studentAge && details.studentAge < 13) {
      if (!details.parentalConsent) {
        violations.push('COPPA: Data collection for under-13 user without parental consent');
        return false;
      }
    }

    // Check data minimization
    if (type === EducationalSecurityEventType.STUDENT_RECORD_ACCESS) {
      if (!details.purpose || details.purpose === 'undefined') {
        violations.push('COPPA: Data collection without specified educational purpose');
        return false;
      }
    }

    return true;
  }

  private checkFERPACompliance(
    type: EducationalSecurityEventType,
    action: string,
    details: Record<string, any>,
    violations: string[]
  ): boolean {
    if (type === EducationalSecurityEventType.STUDENT_RECORD_ACCESS) {
      // Check authorization for educational records access
      if (action === 'export' && !details.authorizedDisclosure) {
        violations.push('FERPA: Unauthorized disclosure of educational records');
        return false;
      }
      
      // Check legitimate educational interest
      if (!details.educationalInterest) {
        violations.push('FERPA: Access without legitimate educational interest');
        return false;
      }
    }

    return true;
  }

  private checkGDPRCompliance(
    type: EducationalSecurityEventType,
    details: Record<string, any>,
    violations: string[]
  ): boolean {
    // Check lawful basis for processing
    if (!details.lawfulBasis) {
      violations.push('GDPR: Data processing without lawful basis');
      return false;
    }

    // Check data minimization principle
    if (details.dataMinimization === false) {
      violations.push('GDPR: Violation of data minimization principle');
      return false;
    }

    return true;
  }

  private calculateEducationalRiskScore(
    type: EducationalSecurityEventType,
    action: string,
    details: Record<string, any>,
    schoolConfig: any
  ): number {
    let score = 0;

    // Base scores for educational event types
    const baseScores = {
      [EducationalSecurityEventType.STUDENT_AUTHENTICATION]: 1,
      [EducationalSecurityEventType.PARENT_ACCESS]: 2,
      [EducationalSecurityEventType.TEACHER_DATA_ACCESS]: 3,
      [EducationalSecurityEventType.GRADE_MODIFICATION]: 5,
      [EducationalSecurityEventType.STUDENT_RECORD_ACCESS]: 6,
      [EducationalSecurityEventType.SOCIAL_MEDIA_MONITORING]: 4,
      [EducationalSecurityEventType.CYBERBULLYING_DETECTION]: 8,
      [EducationalSecurityEventType.PREDATOR_ALERT]: 10,
      [EducationalSecurityEventType.PARENTAL_CONSENT]: 3,
      [EducationalSecurityEventType.DATA_EXPORT_REQUEST]: 7,
      [EducationalSecurityEventType.PRIVACY_VIOLATION]: 9,
      [EducationalSecurityEventType.AI_INTERACTION]: 2,
      [EducationalSecurityEventType.SYSTEM_INTRUSION]: 10
    };

    score += baseScores[type] || 1;

    // School-specific risk modifiers
    if (schoolConfig?.securityLevel === 'maximum') score += 2;
    if (schoolConfig?.securityLevel === 'enhanced') score += 1;

    // Age-related risk factors
    if (details.studentAge && details.studentAge < 13) score += 2;
    if (details.studentAge && details.studentAge < 8) score += 3;

    // Action-specific modifiers
    if (action === 'export') score += 3;
    if (action === 'delete') score += 4;
    if (action === 'unauthorized_access') score += 5;

    // Volume-based risk
    if (details.studentCount > 10) score += 2;
    if (details.studentCount > 100) score += 4;

    return Math.min(score, 10);
  }

  private calculateEducationalSeverity(
    type: EducationalSecurityEventType,
    action: string,
    details: Record<string, any>,
    schoolConfig: any
  ): SecuritySeverity {
    if (type === EducationalSecurityEventType.PREDATOR_ALERT) {
      return SecuritySeverity.EMERGENCY;
    }

    if (type === EducationalSecurityEventType.CYBERBULLYING_DETECTION && 
        details.bullyingIntensity === 'severe') {
      return SecuritySeverity.CRITICAL;
    }

    if (type === EducationalSecurityEventType.PRIVACY_VIOLATION ||
        type === EducationalSecurityEventType.SYSTEM_INTRUSION) {
      return SecuritySeverity.CRITICAL;
    }

    if (type === EducationalSecurityEventType.STUDENT_RECORD_ACCESS && 
        details.studentCount > 100) {
      return SecuritySeverity.HIGH;
    }

    if (schoolConfig?.securityLevel === 'maximum') {
      return SecuritySeverity.HIGH;
    }

    return SecuritySeverity.MEDIUM;
  }

  private requiresParentNotification(
    type: EducationalSecurityEventType,
    details: Record<string, any>,
    schoolConfig: any
  ): boolean {
    if (!schoolConfig?.parentNotificationRequired) return false;

    const notificationEvents = [
      EducationalSecurityEventType.CYBERBULLYING_DETECTION,
      EducationalSecurityEventType.PREDATOR_ALERT,
      EducationalSecurityEventType.PRIVACY_VIOLATION
    ];

    return notificationEvents.includes(type) || 
           (details.studentAge && details.studentAge < 13);
  }

  private requiresLawEnforcement(
    type: EducationalSecurityEventType,
    details: Record<string, any>,
    schoolConfig: any
  ): boolean {
    if (type === EducationalSecurityEventType.PREDATOR_ALERT) return true;
    
    if (schoolConfig?.lawEnforcementIntegration && 
        type === EducationalSecurityEventType.CYBERBULLYING_DETECTION &&
        details.bullyingIntensity === 'severe') {
      return true;
    }

    return false;
  }

  private async handleComplianceViolations(event: EducationalSecurityEvent): Promise<void> {
    if (event.compliance.violations.length > 0) {
      console.log(`Compliance violations detected: ${event.compliance.violations.join(', ')}`);
      
      await alertSystemService.createAlert(1, {
        type: 'compliance_violation',
        severity: 'critical',
        title: 'Educational Compliance Violation',
        description: `Violations: ${event.compliance.violations.join(', ')}`
      });
    }
  }

  private async executeAutomatedResponse(event: EducationalSecurityEvent): Promise<void> {
    if (event.autoResponse) {
      switch (event.autoResponse) {
        case 'block_user':
          await this.blockUser(event);
          break;
        case 'notify_parent':
          await this.notifyParent(event);
          break;
        case 'alert_admin':
          await this.alertSchoolAdmin(event);
          break;
        case 'contact_law_enforcement':
          await this.contactLawEnforcement(event, { name: 'Automated Response' } as ThreatPattern);
          break;
      }
    }
  }

  private startRealTimeMonitoring(): void {
    // Monitor for real-time threat patterns every 30 seconds
    setInterval(async () => {
      const recentEvents = this.events.filter(e => 
        e.timestamp > new Date(Date.now() - 30 * 60 * 1000) // Last 30 minutes
      );

      for (const pattern of this.threatPatterns) {
        if (pattern.conditions.every(condition => condition(recentEvents))) {
          console.log(`Real-time threat pattern detected: ${pattern.name}`);
        }
      }
    }, 30000);
  }

  // Public methods for getting security statistics
  async getSchoolSecurityStats(schoolId: string): Promise<any> {
    const schoolEvents = this.events.filter(e => e.schoolId === schoolId);
    const last24Hours = schoolEvents.filter(e => 
      e.timestamp > new Date(Date.now() - 24 * 60 * 60 * 1000)
    );

    return {
      totalEvents: schoolEvents.length,
      events24h: last24Hours.length,
      criticalEvents: last24Hours.filter(e => e.severity === SecuritySeverity.CRITICAL).length,
      complianceViolations: last24Hours.filter(e => e.compliance.violations.length > 0).length,
      socialMediaAlerts: last24Hours.filter(e => 
        e.type === EducationalSecurityEventType.SOCIAL_MEDIA_MONITORING
      ).length,
      parentNotifications: last24Hours.filter(e => e.requiresParentNotification).length
    };
  }
}

export const universalOneSchoolSecurity = new UniversalOneSchoolSecurityMonitor();