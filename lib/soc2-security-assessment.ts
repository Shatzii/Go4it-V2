// SOC2-compliant Security Assessment and Vulnerability Management

import { appLogger, auditLogger } from './soc2-logger';
import { SOC2SecurityMonitor, SecurityEventType, AlertSeverity } from './soc2-security-monitor';

export enum AssessmentType {
  VULNERABILITY_SCAN = 'vulnerability_scan',
  PENETRATION_TEST = 'penetration_test',
  CODE_REVIEW = 'code_review',
  CONFIGURATION_AUDIT = 'configuration_audit',
  COMPLIANCE_CHECK = 'compliance_check',
}

export enum AssessmentStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export enum VulnerabilitySeverity {
  INFO = 'info',
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export interface Vulnerability {
  id: string;
  title: string;
  description: string;
  severity: VulnerabilitySeverity;
  cvssScore?: number;
  cve?: string;
  affectedSystems: string[];
  discoveredAt: Date;
  reportedBy: string;
  status: 'open' | 'investigating' | 'remediated' | 'accepted' | 'false_positive';
  remediation?: string;
  remediationDeadline?: Date;
  assignedTo?: string;
  evidence: string[];
  tags: string[];
}

export interface SecurityAssessment {
  id: string;
  type: AssessmentType;
  title: string;
  description: string;
  status: AssessmentStatus;
  scheduledBy: string;
  assignedTo: string;
  scheduledAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  targetSystems: string[];
  scope: string;
  methodology: string[];
  findings: Vulnerability[];
  executiveSummary?: string;
  recommendations: string[];
  nextAssessmentDate?: Date;
}

export class SOC2SecurityAssessment {
  private static assessments: SecurityAssessment[] = [];
  private static vulnerabilities: Vulnerability[] = [];

  static initialize(): void {
    // Schedule regular security assessments
    this.scheduleRegularAssessments();

    appLogger.info('SOC2 Security Assessment initialized');
  }

  private static scheduleRegularAssessments(): void {
    const assessments = [
      {
        type: AssessmentType.VULNERABILITY_SCAN,
        title: 'Weekly Vulnerability Scan',
        frequency: 'weekly',
        targetSystems: ['web_servers', 'databases', 'apis'],
      },
      {
        type: AssessmentType.CONFIGURATION_AUDIT,
        title: 'Monthly Configuration Audit',
        frequency: 'monthly',
        targetSystems: ['servers', 'network', 'applications'],
      },
      {
        type: AssessmentType.PENETRATION_TEST,
        title: 'Quarterly Penetration Test',
        frequency: 'quarterly',
        targetSystems: ['external_perimeter', 'web_apps', 'apis'],
      },
      {
        type: AssessmentType.CODE_REVIEW,
        title: 'Code Review Assessment',
        frequency: 'biweekly',
        targetSystems: ['application_code'],
      },
    ];

    assessments.forEach(assessment => {
      this.scheduleAssessment(
        assessment.type,
        assessment.title,
        `Regular ${assessment.frequency} ${assessment.type.replace('_', ' ')}`,
        'security_team',
        'security_team',
        assessment.targetSystems,
        `Automated ${assessment.frequency} assessment of ${assessment.targetSystems.join(', ')}`,
        ['automated_scanning', 'manual_review']
      );
    });
  }

  static scheduleAssessment(
    type: AssessmentType,
    title: string,
    description: string,
    scheduledBy: string,
    assignedTo: string,
    targetSystems: string[],
    scope: string,
    methodology: string[]
  ): string {
    const assessment: SecurityAssessment = {
      id: `SA-${Date.now()}`,
      type,
      title,
      description,
      status: AssessmentStatus.SCHEDULED,
      scheduledBy,
      assignedTo,
      scheduledAt: new Date(),
      targetSystems,
      scope,
      methodology,
      findings: [],
      recommendations: [],
    };

    this.assessments.push(assessment);

    auditLogger.userAction(scheduledBy, 'security_assessment_scheduled', {
      assessmentId: assessment.id,
      type,
      targetSystems,
    });

    appLogger.info('Security assessment scheduled', {
      assessmentId: assessment.id,
      type,
      title,
      assignedTo,
    });

    return assessment.id;
  }

  static startAssessment(assessmentId: string, startedBy: string): void {
    const assessment = this.assessments.find(a => a.id === assessmentId);
    if (!assessment) {
      throw new Error(`Assessment ${assessmentId} not found`);
    }

    if (assessment.status !== AssessmentStatus.SCHEDULED) {
      throw new Error(`Assessment ${assessmentId} is not in scheduled status`);
    }

    assessment.status = AssessmentStatus.IN_PROGRESS;
    assessment.startedAt = new Date();

    auditLogger.userAction(startedBy, 'security_assessment_started', {
      assessmentId,
    });

    appLogger.info('Security assessment started', {
      assessmentId,
      startedBy,
    });
  }

  static completeAssessment(
    assessmentId: string,
    completedBy: string,
    findings: Vulnerability[],
    executiveSummary: string,
    recommendations: string[]
  ): void {
    const assessment = this.assessments.find(a => a.id === assessmentId);
    if (!assessment) {
      throw new Error(`Assessment ${assessmentId} not found`);
    }

    assessment.status = AssessmentStatus.COMPLETED;
    assessment.completedAt = new Date();
    assessment.findings = findings;
    assessment.executiveSummary = executiveSummary;
    assessment.recommendations = recommendations;

    // Add findings to vulnerability database
    findings.forEach(finding => {
      this.vulnerabilities.push(finding);
    });

    // Log high-severity findings
    const highSeverityFindings = findings.filter(f =>
      f.severity === VulnerabilitySeverity.HIGH ||
      f.severity === VulnerabilitySeverity.CRITICAL
    );

    if (highSeverityFindings.length > 0) {
      SOC2SecurityMonitor.logEvent(
        SecurityEventType.SUSPICIOUS_ACTIVITY,
        AlertSeverity.HIGH,
        'system',
        {
          assessmentId,
          highSeverityFindings: highSeverityFindings.length,
          findings: highSeverityFindings.map(f => f.title),
        },
        completedBy
      );
    }

    auditLogger.userAction(completedBy, 'security_assessment_completed', {
      assessmentId,
      findingsCount: findings.length,
      highSeverityCount: highSeverityFindings.length,
    });

    appLogger.info('Security assessment completed', {
      assessmentId,
      findingsCount: findings.length,
      completedBy,
    });
  }

  static reportVulnerability(
    title: string,
    description: string,
    severity: VulnerabilitySeverity,
    affectedSystems: string[],
    reportedBy: string,
    evidence: string[] = [],
    tags: string[] = []
  ): string {
    const vulnerability: Vulnerability = {
      id: `VULN-${Date.now()}`,
      title,
      description,
      severity,
      affectedSystems,
      discoveredAt: new Date(),
      reportedBy,
      status: 'open',
      evidence,
      tags,
    };

    this.vulnerabilities.push(vulnerability);

    // Log critical vulnerabilities immediately
    if (severity === VulnerabilitySeverity.CRITICAL) {
      SOC2SecurityMonitor.logEvent(
        SecurityEventType.SUSPICIOUS_ACTIVITY,
        AlertSeverity.CRITICAL,
        'system',
        {
          vulnerabilityId: vulnerability.id,
          title,
          severity,
          affectedSystems,
        },
        reportedBy
      );
    }

    auditLogger.userAction(reportedBy, 'vulnerability_reported', {
      vulnerabilityId: vulnerability.id,
      severity,
      affectedSystems,
    });

    appLogger.warn('Vulnerability reported', {
      vulnerabilityId: vulnerability.id,
      title,
      severity,
      reportedBy,
    });

    return vulnerability.id;
  }

  static updateVulnerabilityStatus(
    vulnerabilityId: string,
    status: Vulnerability['status'],
    updatedBy: string,
    remediation?: string,
    assignedTo?: string
  ): void {
    const vulnerability = this.vulnerabilities.find(v => v.id === vulnerabilityId);
    if (!vulnerability) {
      throw new Error(`Vulnerability ${vulnerabilityId} not found`);
    }

    const oldStatus = vulnerability.status;
    vulnerability.status = status;

    if (remediation) {
      vulnerability.remediation = remediation;
    }

    if (assignedTo) {
      vulnerability.assignedTo = assignedTo;
    }

    auditLogger.userAction(updatedBy, 'vulnerability_status_updated', {
      vulnerabilityId,
      oldStatus,
      newStatus: status,
      assignedTo,
    });

    appLogger.info('Vulnerability status updated', {
      vulnerabilityId,
      oldStatus,
      newStatus: status,
      updatedBy,
    });
  }

  static getAssessmentMetrics(): any {
    const now = Date.now();
    const last30d = now - 30 * 24 * 60 * 60 * 1000;
    const last90d = now - 90 * 24 * 60 * 60 * 1000;

    const recentAssessments = this.assessments.filter(a =>
      a.completedAt && a.completedAt.getTime() > last30d
    );

    const recentVulnerabilities = this.vulnerabilities.filter(v =>
      v.discoveredAt.getTime() > last90d
    );

    return {
      totalAssessments: this.assessments.length,
      completedAssessments: this.assessments.filter(a => a.status === AssessmentStatus.COMPLETED).length,
      assessmentsLast30d: recentAssessments.length,
      totalVulnerabilities: this.vulnerabilities.length,
      openVulnerabilities: this.vulnerabilities.filter(v => v.status === 'open').length,
      vulnerabilitiesLast90d: recentVulnerabilities.length,
      averageFindingsPerAssessment: this.calculateAverageFindings(recentAssessments),
      vulnerabilitySeverityBreakdown: this.getVulnerabilitySeverityBreakdown(recentVulnerabilities),
      assessmentTypeBreakdown: this.getAssessmentTypeBreakdown(recentAssessments),
      remediationRate: this.calculateRemediationRate(),
    };
  }

  private static calculateAverageFindings(assessments: SecurityAssessment[]): number {
    if (assessments.length === 0) return 0;
    const totalFindings = assessments.reduce((sum, a) => sum + a.findings.length, 0);
    return totalFindings / assessments.length;
  }

  private static getVulnerabilitySeverityBreakdown(vulnerabilities: Vulnerability[]): any {
    const breakdown: { [key: string]: number } = {};
    vulnerabilities.forEach(vuln => {
      breakdown[vuln.severity] = (breakdown[vuln.severity] || 0) + 1;
    });
    return breakdown;
  }

  private static getAssessmentTypeBreakdown(assessments: SecurityAssessment[]): any {
    const breakdown: { [key: string]: number } = {};
    assessments.forEach(assessment => {
      breakdown[assessment.type] = (breakdown[assessment.type] || 0) + 1;
    });
    return breakdown;
  }

  private static calculateRemediationRate(): number {
    const totalVulns = this.vulnerabilities.length;
    if (totalVulns === 0) return 1;

    const remediatedVulns = this.vulnerabilities.filter(v =>
      v.status === 'remediated' || v.status === 'false_positive'
    ).length;

    return remediatedVulns / totalVulns;
  }

  static generateAssessmentReport(assessmentId: string): any {
    const assessment = this.assessments.find(a => a.id === assessmentId);
    if (!assessment) {
      throw new Error(`Assessment ${assessmentId} not found`);
    }

    return {
      assessment,
      generatedAt: new Date(),
      reportVersion: 'SOC2-SA-1.0',
      summary: {
        totalFindings: assessment.findings.length,
        criticalFindings: assessment.findings.filter(f => f.severity === VulnerabilitySeverity.CRITICAL).length,
        highFindings: assessment.findings.filter(f => f.severity === VulnerabilitySeverity.HIGH).length,
        mediumFindings: assessment.findings.filter(f => f.severity === VulnerabilitySeverity.MEDIUM).length,
        lowFindings: assessment.findings.filter(f => f.severity === VulnerabilitySeverity.LOW).length,
      },
    };
  }
}