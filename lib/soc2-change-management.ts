// SOC2-compliant Change Management and Deployment Controls

import { appLogger, auditLogger } from './soc2-logger';
import { SOC2SecurityMonitor, SecurityEventType, AlertSeverity } from './soc2-security-monitor';

export enum ChangeType {
  EMERGENCY = 'emergency',
  STANDARD = 'standard',
  MAJOR = 'major',
  MINOR = 'minor',
}

export enum ChangeStatus {
  DRAFT = 'draft',
  REVIEW = 'review',
  APPROVED = 'approved',
  SCHEDULED = 'scheduled',
  IMPLEMENTING = 'implementing',
  TESTING = 'testing',
  DEPLOYED = 'deployed',
  ROLLED_BACK = 'rolled_back',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
}

export enum ChangeRisk {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export interface ChangeRequest {
  id: string;
  title: string;
  description: string;
  type: ChangeType;
  risk: ChangeRisk;
  status: ChangeStatus;
  requestedBy: string;
  approvedBy?: string;
  implementedBy?: string;
  createdAt: Date;
  approvedAt?: Date;
  scheduledAt?: Date;
  implementedAt?: Date;
  completedAt?: Date;
  affectedSystems: string[];
  impact: string;
  rollbackPlan: string;
  testPlan: string;
  businessJustification: string;
}

export class SOC2ChangeManagement {
  private static changeRequests: ChangeRequest[] = [];

  static initialize(): void {
    appLogger.info('SOC2 Change Management initialized');
  }

  static createChangeRequest(
    title: string,
    description: string,
    type: ChangeType,
    risk: ChangeRisk,
    requestedBy: string,
    affectedSystems: string[],
    impact: string,
    rollbackPlan: string,
    testPlan: string,
    businessJustification: string
  ): string {
    const changeRequest: ChangeRequest = {
      id: `CR-${Date.now()}`,
      title,
      description,
      type,
      risk,
      status: ChangeStatus.DRAFT,
      requestedBy,
      createdAt: new Date(),
      affectedSystems,
      impact,
      rollbackPlan,
      testPlan,
      businessJustification,
    };

    this.changeRequests.push(changeRequest);

    auditLogger.userAction(requestedBy, 'change_request_created', {
      changeId: changeRequest.id,
      type,
      risk,
    });

    appLogger.info('Change request created', {
      changeId: changeRequest.id,
      title,
      requestedBy,
    });

    return changeRequest.id;
  }

  static approveChangeRequest(changeId: string, approvedBy: string, comments?: string): void {
    const changeRequest = this.changeRequests.find(cr => cr.id === changeId);
    if (!changeRequest) {
      throw new Error(`Change request ${changeId} not found`);
    }

    if (changeRequest.status !== ChangeStatus.REVIEW) {
      throw new Error(`Change request ${changeId} is not in review status`);
    }

    changeRequest.approvedBy = approvedBy;
    changeRequest.approvedAt = new Date();
    changeRequest.status = ChangeStatus.APPROVED;

    auditLogger.userAction(approvedBy, 'change_request_approved', {
      changeId,
      comments,
    });

    // Log security event for high-risk changes
    if (changeRequest.risk === ChangeRisk.HIGH || changeRequest.risk === ChangeRisk.CRITICAL) {
      SOC2SecurityMonitor.logEvent(
        SecurityEventType.CONFIG_CHANGE,
        AlertSeverity.HIGH,
        'system',
        {
          changeId,
          type: changeRequest.type,
          risk: changeRequest.risk,
          approvedBy,
        },
        approvedBy
      );
    }

    appLogger.info('Change request approved', {
      changeId,
      approvedBy,
    });
  }

  static rejectChangeRequest(changeId: string, rejectedBy: string, reason: string): void {
    const changeRequest = this.changeRequests.find(cr => cr.id === changeId);
    if (!changeRequest) {
      throw new Error(`Change request ${changeId} not found`);
    }

    changeRequest.status = ChangeStatus.REJECTED;

    auditLogger.userAction(rejectedBy, 'change_request_rejected', {
      changeId,
      reason,
    });

    appLogger.info('Change request rejected', {
      changeId,
      rejectedBy,
      reason,
    });
  }

  static updateChangeStatus(changeId: string, status: ChangeStatus, updatedBy: string, details?: string): void {
    const changeRequest = this.changeRequests.find(cr => cr.id === changeId);
    if (!changeRequest) {
      throw new Error(`Change request ${changeId} not found`);
    }

    const oldStatus = changeRequest.status;
    changeRequest.status = status;

    if (status === ChangeStatus.IMPLEMENTING) {
      changeRequest.implementedBy = updatedBy;
      changeRequest.implementedAt = new Date();
    }

    if (status === ChangeStatus.DEPLOYED || status === ChangeStatus.ROLLED_BACK) {
      changeRequest.completedAt = new Date();
    }

    auditLogger.userAction(updatedBy, 'change_status_updated', {
      changeId,
      oldStatus,
      newStatus: status,
      details,
    });

    appLogger.info('Change status updated', {
      changeId,
      oldStatus,
      newStatus: status,
      updatedBy,
    });
  }

  static getChangeMetrics(): any {
    const now = Date.now();
    const last30d = now - 30 * 24 * 60 * 60 * 1000;

    const recentChanges = this.changeRequests.filter(cr => cr.createdAt.getTime() > last30d);

    return {
      totalChanges: this.changeRequests.length,
      changesLast30d: recentChanges.length,
      approvalRate: this.calculateApprovalRate(recentChanges),
      averageImplementationTime: this.calculateAverageImplementationTime(),
      changesByRisk: this.getChangesByRisk(recentChanges),
      changesByType: this.getChangesByType(recentChanges),
      emergencyChanges: recentChanges.filter(cr => cr.type === ChangeType.EMERGENCY).length,
    };
  }

  private static calculateApprovalRate(changes: ChangeRequest[]): number {
    if (changes.length === 0) return 1;
    const approved = changes.filter(cr => cr.status === ChangeStatus.APPROVED || cr.status === ChangeStatus.DEPLOYED).length;
    return approved / changes.length;
  }

  private static calculateAverageImplementationTime(): number {
    const completedChanges = this.changeRequests.filter(cr =>
      cr.implementedAt && cr.completedAt && cr.status === ChangeStatus.DEPLOYED
    );

    if (completedChanges.length === 0) return 0;

    const totalTime = completedChanges.reduce((sum, cr) => {
      return sum + (cr.completedAt!.getTime() - cr.implementedAt!.getTime());
    }, 0);

    return totalTime / completedChanges.length / (1000 * 60 * 60); // Return in hours
  }

  private static getChangesByRisk(changes: ChangeRequest[]): any {
    const riskCounts: { [key: string]: number } = {};
    changes.forEach(change => {
      riskCounts[change.risk] = (riskCounts[change.risk] || 0) + 1;
    });
    return riskCounts;
  }

  private static getChangesByType(changes: ChangeRequest[]): any {
    const typeCounts: { [key: string]: number } = {};
    changes.forEach(change => {
      typeCounts[change.type] = (typeCounts[change.type] || 0) + 1;
    });
    return typeCounts;
  }

  static validateChangeRequest(changeRequest: ChangeRequest): { valid: boolean; issues: string[] } {
    const issues: string[] = [];

    if (!changeRequest.title || changeRequest.title.length < 10) {
      issues.push('Title must be at least 10 characters long');
    }

    if (!changeRequest.description || changeRequest.description.length < 50) {
      issues.push('Description must be at least 50 characters long');
    }

    if (!changeRequest.businessJustification || changeRequest.businessJustification.length < 20) {
      issues.push('Business justification must be at least 20 characters long');
    }

    if (!changeRequest.rollbackPlan || changeRequest.rollbackPlan.length < 20) {
      issues.push('Rollback plan must be at least 20 characters long');
    }

    if (!changeRequest.testPlan || changeRequest.testPlan.length < 20) {
      issues.push('Test plan must be at least 20 characters long');
    }

    if (changeRequest.affectedSystems.length === 0) {
      issues.push('At least one affected system must be specified');
    }

    // Risk-based validation
    if (changeRequest.risk === ChangeRisk.CRITICAL) {
      if (!changeRequest.approvedBy) {
        issues.push('Critical changes require explicit approval');
      }
    }

    return {
      valid: issues.length === 0,
      issues,
    };
  }
}