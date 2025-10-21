// SOC2-compliant Privacy Program with Data Classification and Retention

import { appLogger, auditLogger } from './soc2-logger';
import { SOC2Encryption } from './soc2-encryption';

export enum DataClassification {
  PUBLIC = 'public',
  INTERNAL = 'internal',
  CONFIDENTIAL = 'confidential',
  RESTRICTED = 'restricted',
  PERSONAL = 'personal',
  SENSITIVE_PII = 'sensitive_pii',
}

export enum DataRetentionPeriod {
  IMMEDIATE = 0,
  DAYS_30 = 30,
  DAYS_90 = 90,
  YEARS_1 = 365,
  YEARS_3 = 1095,
  YEARS_7 = 2555,
  PERMANENT = -1,
}

export interface DataElement {
  id: string;
  name: string;
  classification: DataClassification;
  retentionPeriod: DataRetentionPeriod;
  description: string;
  dataOwner: string;
  allowedUsers: string[];
  encryptionRequired: boolean;
  auditRequired: boolean;
  consentRequired: boolean;
}

export class SOC2PrivacyProgram {
  private static dataElements: DataElement[] = [];

  static initialize(): void {
    this.dataElements = [
      {
        id: 'user_email',
        name: 'User Email Address',
        classification: DataClassification.PERSONAL,
        retentionPeriod: DataRetentionPeriod.YEARS_7,
        description: 'User email addresses for account management',
        dataOwner: 'User Management Team',
        allowedUsers: ['admin', 'support', 'system'],
        encryptionRequired: true,
        auditRequired: true,
        consentRequired: false,
      },
      {
        id: 'payment_data',
        name: 'Payment Information',
        classification: DataClassification.SENSITIVE_PII,
        retentionPeriod: DataRetentionPeriod.YEARS_7,
        description: 'Credit card details and payment data',
        dataOwner: 'Finance Team',
        allowedUsers: ['admin', 'finance'],
        encryptionRequired: true,
        auditRequired: true,
        consentRequired: true,
      },
    ];

    appLogger.info('SOC2 Privacy Program initialized', {
      dataElementsCount: this.dataElements.length,
    });
  }

  static classifyData(content: string, context: string): DataClassification {
    const sensitiveKeywords = ['ssn', 'credit card', 'password', 'health', 'medical'];
    const personalKeywords = ['email', 'phone', 'address', 'name'];

    const lowerContent = content.toLowerCase();

    if (sensitiveKeywords.some(keyword => lowerContent.includes(keyword))) {
      return DataClassification.SENSITIVE_PII;
    }

    if (personalKeywords.some(keyword => lowerContent.includes(keyword))) {
      return DataClassification.PERSONAL;
    }

    return DataClassification.INTERNAL;
  }

  static getDataRetentionPolicy(classification: DataClassification): DataRetentionPeriod {
    const retentionMap: { [key: string]: DataRetentionPeriod } = {
      [DataClassification.PUBLIC]: DataRetentionPeriod.YEARS_1,
      [DataClassification.INTERNAL]: DataRetentionPeriod.YEARS_3,
      [DataClassification.CONFIDENTIAL]: DataRetentionPeriod.YEARS_3,
      [DataClassification.RESTRICTED]: DataRetentionPeriod.YEARS_7,
      [DataClassification.PERSONAL]: DataRetentionPeriod.YEARS_7,
      [DataClassification.SENSITIVE_PII]: DataRetentionPeriod.YEARS_7,
    };

    return retentionMap[classification] || DataRetentionPeriod.YEARS_3;
  }

  static isEncryptionRequired(classification: DataClassification): boolean {
    return [
      DataClassification.CONFIDENTIAL,
      DataClassification.RESTRICTED,
      DataClassification.PERSONAL,
      DataClassification.SENSITIVE_PII,
    ].includes(classification);
  }

  static getPrivacyMetrics(): any {
    return {
      dataElementsCount: this.dataElements.length,
      encryptedElements: this.dataElements.filter(de => de.encryptionRequired).length,
      consentRequiredElements: this.dataElements.filter(de => de.consentRequired).length,
      classificationBreakdown: this.getClassificationBreakdown(),
    };
  }

  private static getClassificationBreakdown(): any {
    const breakdown: { [key: string]: number } = {};
    this.dataElements.forEach(element => {
      breakdown[element.classification] = (breakdown[element.classification] || 0) + 1;
    });
    return breakdown;
  }
}