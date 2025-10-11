// SOC2 System Integration and Orchestration

import { appLogger, auditLogger } from './soc2-logger';
import { SOC2Encryption } from './soc2-encryption';
import { SOC2AccessControl, UserRole } from './soc2-access-control';
import { SOC2SecurityMonitor } from './soc2-security-monitor';
import { SOC2BackupManager } from './soc2-backup';
import { SOC2IncidentResponse } from './soc2-incident-response';
import { SOC2PrivacyProgram } from './soc2-privacy';
import { SOC2ChangeManagement } from './soc2-change-management';
import { SOC2SecurityAssessment } from './soc2-security-assessment';
import { SOC2Compliance } from './soc2-compliance';

export interface SOC2SystemStatus {
  overallHealth: 'healthy' | 'warning' | 'critical';
  components: {
    logger: boolean;
    encryption: boolean;
    accessControl: boolean;
    securityMonitor: boolean;
    backup: boolean;
    incidentResponse: boolean;
    privacy: boolean;
    changeManagement: boolean;
    securityAssessment: boolean;
    compliance: boolean;
  };
  lastHealthCheck: Date;
  issues: string[];
}

export class SOC2Integration {
  private static initialized = false;
  private static healthCheckInterval: NodeJS.Timeout | null = null;

  /**
   * Initialize all SOC2 systems
   */
  static async initialize(): Promise<void> {
    if (this.initialized) {
      appLogger.warn('SOC2 systems already initialized');
      return;
    }

    try {
      appLogger.info('Initializing SOC2 compliance framework...');

      // Initialize core security systems
      SOC2Encryption.initialize?.();
      SOC2AccessControl.initialize?.();
      SOC2SecurityMonitor.initialize();
      SOC2BackupManager.initialize();
      SOC2IncidentResponse.initialize();
      SOC2PrivacyProgram.initialize();
      SOC2ChangeManagement.initialize();
      SOC2SecurityAssessment.initialize();
      SOC2Compliance.initialize();

      // Start health monitoring
      this.startHealthMonitoring();

      this.initialized = true;

      auditLogger.systemEvent('soc2_systems_initialized', {
        timestamp: new Date(),
        components: [
          'encryption',
          'access_control',
          'security_monitor',
          'backup',
          'incident_response',
          'privacy',
          'change_management',
          'security_assessment',
          'compliance',
        ],
      });

      appLogger.info('SOC2 compliance framework initialized successfully');

    } catch (error) {
      appLogger.error('Failed to initialize SOC2 systems', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /**
   * Get overall SOC2 system health
   */
  static getSystemHealth(): SOC2SystemStatus {
    const issues: string[] = [];

    // Check each component
    const components = {
      logger: true, // Always available
      encryption: this.checkEncryptionHealth(),
      accessControl: this.checkAccessControlHealth(),
      securityMonitor: this.checkSecurityMonitorHealth(),
      backup: this.checkBackupHealth(),
      incidentResponse: this.checkIncidentResponseHealth(),
      privacy: this.checkPrivacyHealth(),
      changeManagement: this.checkChangeManagementHealth(),
      securityAssessment: this.checkSecurityAssessmentHealth(),
      compliance: this.checkComplianceHealth(),
    };

    // Collect issues
    Object.entries(components).forEach(([component, healthy]) => {
      if (!healthy) {
        issues.push(`${component} system is not functioning properly`);
      }
    });

    // Determine overall health
    let overallHealth: 'healthy' | 'warning' | 'critical' = 'healthy';
    if (issues.length > 0) {
      overallHealth = issues.length > 3 ? 'critical' : 'warning';
    }

    return {
      overallHealth,
      components,
      lastHealthCheck: new Date(),
      issues,
    };
  }

  /**
   * Start automated health monitoring
   */
  private static startHealthMonitoring(): void {
    // Health check every 5 minutes
    this.healthCheckInterval = setInterval(() => {
      const health = this.getSystemHealth();

      if (health.overallHealth === 'critical') {
        appLogger.error('CRITICAL: SOC2 system health issues detected', {
          issues: health.issues,
          components: health.components,
        });
      } else if (health.overallHealth === 'warning') {
        appLogger.warn('WARNING: SOC2 system health issues detected', {
          issues: health.issues,
          components: health.components,
        });
      }

      // Log health metrics
      auditLogger.systemEvent('soc2_health_check', {
        overallHealth: health.overallHealth,
        issuesCount: health.issues.length,
        componentsStatus: health.components,
      });

    }, 5 * 60 * 1000); // 5 minutes

    appLogger.info('SOC2 health monitoring started');
  }

  /**
   * Stop health monitoring
   */
  static stopHealthMonitoring(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
      appLogger.info('SOC2 health monitoring stopped');
    }
  }

  /**
   * Get comprehensive SOC2 metrics
   */
  static getComprehensiveMetrics(): any {
    try {
      return {
        systemHealth: this.getSystemHealth(),
        securityMetrics: SOC2SecurityMonitor.getSecurityMetrics(),
        backupMetrics: SOC2BackupManager.getBackupMetrics(),
        incidentMetrics: SOC2IncidentResponse.getIncidentMetrics(),
        privacyMetrics: SOC2PrivacyProgram.getPrivacyMetrics(),
        changeMetrics: SOC2ChangeManagement.getChangeMetrics(),
        assessmentMetrics: SOC2SecurityAssessment.getAssessmentMetrics(),
        complianceMetrics: SOC2Compliance.getComplianceMetrics(),
        generatedAt: new Date(),
      };
    } catch (error) {
      appLogger.error('Failed to generate comprehensive metrics', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return {
        error: 'Failed to generate metrics',
        generatedAt: new Date(),
      };
    }
  }

  /**
   * Perform SOC2 readiness assessment
   */
  static performReadinessAssessment(): any {
    const assessment = {
      overallScore: 0,
      maxScore: 100,
      categories: {
        security: 0,
        availability: 0,
        processingIntegrity: 0,
        confidentiality: 0,
        privacy: 0,
      },
      recommendations: [] as string[],
      assessedAt: new Date(),
    };

    // Security category (25 points)
    const securityScore = this.assessSecurityReadiness();
    assessment.categories.security = securityScore.score;
    assessment.recommendations.push(...securityScore.recommendations);

    // Availability category (20 points)
    const availabilityScore = this.assessAvailabilityReadiness();
    assessment.categories.availability = availabilityScore.score;
    assessment.recommendations.push(...availabilityScore.recommendations);

    // Processing Integrity category (20 points)
    const integrityScore = this.assessIntegrityReadiness();
    assessment.categories.processingIntegrity = integrityScore.score;
    assessment.recommendations.push(...integrityScore.recommendations);

    // Confidentiality category (20 points)
    const confidentialityScore = this.assessConfidentialityReadiness();
    assessment.categories.confidentiality = confidentialityScore.score;
    assessment.recommendations.push(...confidentialityScore.recommendations);

    // Privacy category (15 points)
    const privacyScore = this.assessPrivacyReadiness();
    assessment.categories.privacy = privacyScore.score;
    assessment.recommendations.push(...privacyScore.recommendations);

    // Calculate overall score
    assessment.overallScore = Object.values(assessment.categories).reduce((sum, score) => sum + score, 0);

    auditLogger.systemEvent('soc2_readiness_assessment_completed', {
      overallScore: assessment.overallScore,
      categories: assessment.categories,
      recommendationsCount: assessment.recommendations.length,
    });

    appLogger.info('SOC2 readiness assessment completed', {
      overallScore: assessment.overallScore,
      maxScore: assessment.maxScore,
    });

    return assessment;
  }

  /**
   * Generate SOC2 audit evidence package
   */
  static generateAuditEvidence(): any {
    return {
      evidencePackage: {
        generatedAt: new Date(),
        version: 'SOC2-EP-1.0',
        components: {
          securityLogs: 'Available via SOC2SecurityMonitor.getSecurityMetrics()',
          auditLogs: 'Available via audit logger',
          backupEvidence: 'Available via SOC2BackupManager.getBackupMetrics()',
          incidentReports: 'Available via SOC2IncidentResponse.getIncidentMetrics()',
          changeRecords: 'Available via SOC2ChangeManagement.getChangeMetrics()',
          assessmentReports: 'Available via SOC2SecurityAssessment.getAssessmentMetrics()',
          complianceReports: 'Available via SOC2Compliance.getComplianceMetrics()',
        },
        dataRetention: 'All logs retained for 7 years per SOC2 requirements',
        encryption: 'All sensitive data encrypted using AES-256-GCM',
      },
    };
  }

  // Component health check methods
  private static checkEncryptionHealth(): boolean {
    try {
      // Test encryption functionality
      const testData = 'test data';
      const encrypted = SOC2Encryption.encrypt(testData);
      const decrypted = SOC2Encryption.decrypt(encrypted);
      return decrypted === testData;
    } catch {
      return false;
    }
  }

  private static checkAccessControlHealth(): boolean {
    try {
      // Test access control validation
      return SOC2AccessControl.hasPermission(UserRole.ADMIN, 'admin:users:read');
    } catch {
      return false;
    }
  }

  private static checkSecurityMonitorHealth(): boolean {
    try {
      // Check if security monitor is initialized
      const metrics = SOC2SecurityMonitor.getSecurityMetrics();
      return metrics !== null && typeof metrics === 'object';
    } catch {
      return false;
    }
  }

  private static checkBackupHealth(): boolean {
    try {
      const metrics = SOC2BackupManager.getBackupMetrics();
      return metrics !== null && typeof metrics === 'object';
    } catch {
      return false;
    }
  }

  private static checkIncidentResponseHealth(): boolean {
    try {
      const metrics = SOC2IncidentResponse.getIncidentMetrics();
      return metrics !== null && typeof metrics === 'object';
    } catch {
      return false;
    }
  }

  private static checkPrivacyHealth(): boolean {
    try {
      const metrics = SOC2PrivacyProgram.getPrivacyMetrics();
      return metrics !== null && typeof metrics === 'object';
    } catch {
      return false;
    }
  }

  private static checkChangeManagementHealth(): boolean {
    try {
      const metrics = SOC2ChangeManagement.getChangeMetrics();
      return metrics !== null && typeof metrics === 'object';
    } catch {
      return false;
    }
  }

  private static checkSecurityAssessmentHealth(): boolean {
    try {
      const metrics = SOC2SecurityAssessment.getAssessmentMetrics();
      return metrics !== null && typeof metrics === 'object';
    } catch {
      return false;
    }
  }

  private static checkComplianceHealth(): boolean {
    try {
      const metrics = SOC2Compliance.getComplianceMetrics();
      return metrics !== null && typeof metrics === 'object';
    } catch {
      return false;
    }
  }

  // Readiness assessment methods
  private static assessSecurityReadiness(): { score: number; recommendations: string[] } {
    const recommendations: string[] = [];
    let score = 25; // Base score

    // Check security monitoring
    const securityMetrics = SOC2SecurityMonitor.getSecurityMetrics();
    if (securityMetrics.eventsLast24h > 100) {
      score -= 2;
      recommendations.push('High security event volume detected - review monitoring thresholds');
    }

    // Check encryption
    if (!this.checkEncryptionHealth()) {
      score -= 5;
      recommendations.push('Encryption system not functioning properly');
    }

    return { score: Math.max(0, score), recommendations };
  }

  private static assessAvailabilityReadiness(): { score: number; recommendations: string[] } {
    const recommendations: string[] = [];
    let score = 20;

    const backupMetrics = SOC2BackupManager.getBackupMetrics();
    if (backupMetrics.successRate < 0.95) {
      score -= 3;
      recommendations.push('Backup success rate below 95% - improve backup reliability');
    }

    return { score: Math.max(0, score), recommendations };
  }

  private static assessIntegrityReadiness(): { score: number; recommendations: string[] } {
    const recommendations: string[] = [];
    let score = 20;

    const changeMetrics = SOC2ChangeManagement.getChangeMetrics();
    if (changeMetrics.approvalRate < 0.9) {
      score -= 2;
      recommendations.push('Change approval rate below 90% - strengthen change management');
    }

    return { score: Math.max(0, score), recommendations };
  }

  private static assessConfidentialityReadiness(): { score: number; recommendations: string[] } {
    const recommendations: string[] = [];
    let score = 20;

    if (!this.checkAccessControlHealth()) {
      score -= 5;
      recommendations.push('Access control system not functioning properly');
    }

    return { score: Math.max(0, score), recommendations };
  }

  private static assessPrivacyReadiness(): { score: number; recommendations: string[] } {
    const recommendations: string[] = [];
    let score = 15;

    const privacyMetrics = SOC2PrivacyProgram.getPrivacyMetrics();
    if (privacyMetrics.encryptedElements < privacyMetrics.dataElementsCount * 0.8) {
      score -= 3;
      recommendations.push('Less than 80% of data elements are encrypted');
    }

    return { score: Math.max(0, score), recommendations };
  }
}