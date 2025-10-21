// SOC2 Compliance Monitoring and Reporting

import { appLogger, auditLogger } from './soc2-logger';

export enum ComplianceFramework {
  SOC2 = 'soc2',
  GDPR = 'gdpr',
  HIPAA = 'hipaa',
  PCI_DSS = 'pci_dss',
  ISO27001 = 'iso27001',
}

export enum ComplianceStatus {
  COMPLIANT = 'compliant',
  NON_COMPLIANT = 'non_compliant',
  COMPENSATING_CONTROL = 'compensating_control',
  NOT_APPLICABLE = 'not_applicable',
  UNDER_REVIEW = 'under_review',
}

export interface ComplianceControl {
  id: string;
  framework: ComplianceFramework;
  controlId: string;
  title: string;
  description: string;
  category: string;
  status: ComplianceStatus;
  evidence: string[];
  lastAssessed: Date;
  nextAssessment: Date;
  assignedTo: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  compensatingControls?: string[];
  exceptions?: string[];
}

export interface ComplianceAudit {
  id: string;
  framework: ComplianceFramework;
  title: string;
  description: string;
  status: 'planned' | 'in_progress' | 'completed' | 'failed';
  startDate: Date;
  endDate?: Date;
  auditor: string;
  scope: string[];
  findings: ComplianceFinding[];
  recommendations: string[];
  reportUrl?: string;
}

export interface ComplianceFinding {
  id: string;
  controlId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  evidence: string[];
  remediation: string;
  status: 'open' | 'in_progress' | 'remediated' | 'accepted';
  assignedTo: string;
  dueDate: Date;
}

export class SOC2Compliance {
  private static controls: ComplianceControl[] = [];
  private static audits: ComplianceAudit[] = [];

  static initialize(): void {
    // Initialize SOC2 controls
    this.initializeSOC2Controls();

    appLogger.info('SOC2 Compliance system initialized', {
      controlsCount: this.controls.length,
    });
  }

  private static initializeSOC2Controls(): void {
    const soc2Controls: Partial<ComplianceControl>[] = [
      {
        controlId: 'CC1.1',
        title: 'COSO Principle 1: The entity demonstrates a commitment to integrity and ethical values',
        category: 'Control Environment',
        status: ComplianceStatus.COMPLIANT,
        assignedTo: 'compliance_team',
        riskLevel: 'high',
      },
      {
        controlId: 'CC2.1',
        title: 'COSO Principle 2: The board of directors demonstrates independence from management',
        category: 'Control Environment',
        status: ComplianceStatus.COMPLIANT,
        assignedTo: 'board',
        riskLevel: 'high',
      },
      {
        controlId: 'CC3.1',
        title: 'COSO Principle 3: Management establishes, with board oversight, structures, reporting lines, and appropriate authorities',
        category: 'Control Environment',
        status: ComplianceStatus.COMPLIANT,
        assignedTo: 'management',
        riskLevel: 'high',
      },
      {
        controlId: 'CC4.1',
        title: 'COSO Principle 4: The entity demonstrates a commitment to attract, develop, and retain competent individuals',
        category: 'Control Environment',
        status: ComplianceStatus.COMPLIANT,
        assignedTo: 'hr',
        riskLevel: 'medium',
      },
      {
        controlId: 'CC5.1',
        title: 'COSO Principle 5: The entity holds individuals accountable for their internal control responsibilities',
        category: 'Control Environment',
        status: ComplianceStatus.COMPLIANT,
        assignedTo: 'management',
        riskLevel: 'high',
      },
      {
        controlId: 'CC6.1',
        title: 'COSO Principle 6: The entity specifies objectives with sufficient clarity',
        category: 'Risk Assessment',
        status: ComplianceStatus.COMPLIANT,
        assignedTo: 'management',
        riskLevel: 'medium',
      },
      {
        controlId: 'CC7.1',
        title: 'COSO Principle 7: The entity identifies and assesses changes that could significantly impact the system of internal control',
        category: 'Risk Assessment',
        status: ComplianceStatus.COMPLIANT,
        assignedTo: 'risk_team',
        riskLevel: 'high',
      },
    ];

    soc2Controls.forEach(control => {
      const fullControl: ComplianceControl = {
        id: `SOC2-${control.controlId}`,
        framework: ComplianceFramework.SOC2,
        controlId: control.controlId!,
        title: control.title!,
        description: control.title!,
        category: control.category!,
        status: control.status!,
        evidence: [],
        lastAssessed: new Date(),
        nextAssessment: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
        assignedTo: control.assignedTo!,
        riskLevel: control.riskLevel!,
      };

      this.controls.push(fullControl);
    });
  }

  static assessControl(
    controlId: string,
    status: ComplianceStatus,
    evidence: string[],
    assessedBy: string,
    notes?: string
  ): void {
    const control = this.controls.find(c => c.id === controlId);
    if (!control) {
      throw new Error(`Control ${controlId} not found`);
    }

    const oldStatus = control.status;
    control.status = status;
    control.evidence = evidence;
    control.lastAssessed = new Date();
    control.nextAssessment = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

    auditLogger.userAction(assessedBy, 'compliance_control_assessed', {
      controlId,
      oldStatus,
      newStatus: status,
      evidenceCount: evidence.length,
      notes,
    });

    appLogger.info('Compliance control assessed', {
      controlId,
      status,
      assessedBy,
    });
  }

  static scheduleAudit(
    framework: ComplianceFramework,
    title: string,
    description: string,
    auditor: string,
    scope: string[],
    startDate: Date
  ): string {
    const audit: ComplianceAudit = {
      id: `AUDIT-${Date.now()}`,
      framework,
      title,
      description,
      status: 'planned',
      startDate,
      auditor,
      scope,
      findings: [],
      recommendations: [],
    };

    this.audits.push(audit);

    auditLogger.systemEvent('compliance_audit_scheduled', {
      auditId: audit.id,
      framework,
      auditor,
      startDate,
    });

    appLogger.info('Compliance audit scheduled', {
      auditId: audit.id,
      framework,
      title,
      auditor,
    });

    return audit.id;
  }

  static completeAudit(
    auditId: string,
    findings: ComplianceFinding[],
    recommendations: string[],
    reportUrl?: string
  ): void {
    const audit = this.audits.find(a => a.id === auditId);
    if (!audit) {
      throw new Error(`Audit ${auditId} not found`);
    }

    audit.status = 'completed';
    audit.endDate = new Date();
    audit.findings = findings;
    audit.recommendations = recommendations;
    audit.reportUrl = reportUrl;

    // Log critical findings
    const criticalFindings = findings.filter(f => f.severity === 'critical');
    if (criticalFindings.length > 0) {
      appLogger.error('Critical compliance findings identified', {
        auditId,
        criticalFindingsCount: criticalFindings.length,
        findings: criticalFindings.map(f => f.title),
      });
    }

    auditLogger.systemEvent('compliance_audit_completed', {
      auditId,
      findingsCount: findings.length,
      criticalFindingsCount: criticalFindings.length,
      recommendationsCount: recommendations.length,
    });

    appLogger.info('Compliance audit completed', {
      auditId,
      findingsCount: findings.length,
      auditor: audit.auditor,
    });
  }

  static getComplianceMetrics(): any {
    const now = Date.now();
    const last365d = now - 365 * 24 * 60 * 60 * 1000;

    const recentAudits = this.audits.filter(a =>
      a.endDate && a.endDate.getTime() > last365d
    );

    return {
      totalControls: this.controls.length,
      compliantControls: this.controls.filter(c => c.status === ComplianceStatus.COMPLIANT).length,
      nonCompliantControls: this.controls.filter(c => c.status === ComplianceStatus.NON_COMPLIANT).length,
      complianceRate: this.calculateComplianceRate(),
      totalAudits: this.audits.length,
      completedAudits: this.audits.filter(a => a.status === 'completed').length,
      auditsLastYear: recentAudits.length,
      openFindings: this.calculateOpenFindings(),
      controlsByCategory: this.getControlsByCategory(),
      controlsByRisk: this.getControlsByRisk(),
    };
  }

  private static calculateComplianceRate(): number {
    if (this.controls.length === 0) return 1;
    const compliant = this.controls.filter(c => c.status === ComplianceStatus.COMPLIANT).length;
    return compliant / this.controls.length;
  }

  private static calculateOpenFindings(): number {
    return this.audits.reduce((sum, audit) => {
      return sum + audit.findings.filter(f => f.status === 'open').length;
    }, 0);
  }

  private static getControlsByCategory(): any {
    const categoryCounts: { [key: string]: number } = {};
    this.controls.forEach(control => {
      categoryCounts[control.category] = (categoryCounts[control.category] || 0) + 1;
    });
    return categoryCounts;
  }

  private static getControlsByRisk(): any {
    const riskCounts: { [key: string]: number } = {};
    this.controls.forEach(control => {
      riskCounts[control.riskLevel] = (riskCounts[control.riskLevel] || 0) + 1;
    });
    return riskCounts;
  }

  static generateComplianceReport(framework: ComplianceFramework): any {
    const frameworkControls = this.controls.filter(c => c.framework === framework);
    const frameworkAudits = this.audits.filter(a => a.framework === framework);

    return {
      framework,
      generatedAt: new Date(),
      reportVersion: 'SOC2-CR-1.0',
      summary: {
        totalControls: frameworkControls.length,
        compliantControls: frameworkControls.filter(c => c.status === ComplianceStatus.COMPLIANT).length,
        complianceRate: frameworkControls.length > 0 ?
          frameworkControls.filter(c => c.status === ComplianceStatus.COMPLIANT).length / frameworkControls.length : 0,
        totalAudits: frameworkAudits.length,
        completedAudits: frameworkAudits.filter(a => a.status === 'completed').length,
        openFindings: frameworkAudits.reduce((sum, a) => {
          return sum + a.findings.filter(f => f.status === 'open').length;
        }, 0),
      },
      controls: frameworkControls,
      recentAudits: frameworkAudits.filter(a => a.status === 'completed').slice(-5),
    };
  }
}