// Model Encryption and Licensing System for Go4It Sports Platform
// Provides secure offline AI model protection with licensing validation

import crypto from 'crypto';
import { writeFile, readFile, access, mkdir } from 'fs/promises';
import path from 'path';

export interface ModelLicense {
  id: string;
  userId: number;
  modelName: string;
  licenseKey: string;
  encryptionKey: string;
  expirationDate: Date;
  activationDate: Date;
  maxActivations: number;
  currentActivations: number;
  hardwareFingerprint: string;
  features: string[];
  isActive: boolean;
  lastValidation: Date;
}

export interface EncryptedModel {
  modelName: string;
  encryptedData: Buffer;
  metadata: {
    originalSize: number;
    checksum: string;
    version: string;
    capabilities: string[];
    requirements: {
      ram: string;
      storage: string;
      gpu?: string;
    };
  };
  licenseId: string;
  encryptionAlgorithm: string;
  createdAt: Date;
}

export class ModelEncryptionManager {
  private readonly algorithm = 'aes-256-gcm';
  private readonly keyLength = 32;
  private readonly ivLength = 16;
  private readonly tagLength = 16;
  private readonly modelsPath: string;
  private readonly licensePath: string;

  constructor() {
    this.modelsPath = path.join(process.cwd(), 'models');
    this.licensePath = path.join(process.cwd(), 'licenses');
  }

  async initializeDirectories(): Promise<void> {
    await mkdir(this.modelsPath, { recursive: true });
    await mkdir(this.licensePath, { recursive: true });
  }

  // Generate hardware fingerprint for license binding
  generateHardwareFingerprint(): string {
    const os = require('os');
    const cpuInfo = os.cpus()[0];
    const networkInterfaces = os.networkInterfaces();

    const fingerprint = crypto
      .createHash('sha256')
      .update(cpuInfo.model)
      .update(os.platform())
      .update(os.arch())
      .update(JSON.stringify(networkInterfaces))
      .digest('hex');

    return fingerprint;
  }

  // Generate a new license for a model
  async generateLicense(
    userId: number,
    modelName: string,
    features: string[] = [],
    maxActivations: number = 1,
    validityDays: number = 365,
  ): Promise<ModelLicense> {
    const licenseId = crypto.randomUUID();
    const encryptionKey = crypto.randomBytes(this.keyLength).toString('hex');
    const licenseKey = this.generateLicenseKey(licenseId, userId, modelName);

    const license: ModelLicense = {
      id: licenseId,
      userId,
      modelName,
      licenseKey,
      encryptionKey,
      expirationDate: new Date(Date.now() + validityDays * 24 * 60 * 60 * 1000),
      activationDate: new Date(),
      maxActivations,
      currentActivations: 0,
      hardwareFingerprint: this.generateHardwareFingerprint(),
      features,
      isActive: true,
      lastValidation: new Date(),
    };

    await this.saveLicense(license);
    return license;
  }

  // Generate a secure license key
  private generateLicenseKey(licenseId: string, userId: number, modelName: string): string {
    const payload = `${licenseId}:${userId}:${modelName}:${Date.now()}`;
    const signature = crypto
      .createHmac('sha256', process.env.LICENSE_SECRET || 'go4it-sports-default-secret')
      .update(payload)
      .digest('hex');

    return `${Buffer.from(payload).toString('base64')}.${signature}`;
  }

  // Validate license key
  async validateLicense(
    licenseKey: string,
  ): Promise<{ valid: boolean; license?: ModelLicense; error?: string }> {
    try {
      const [encodedPayload, signature] = licenseKey.split('.');
      if (!encodedPayload || !signature) {
        return { valid: false, error: 'Invalid license key format' };
      }

      const payload = Buffer.from(encodedPayload, 'base64').toString();
      const expectedSignature = crypto
        .createHmac('sha256', process.env.LICENSE_SECRET || 'go4it-sports-default-secret')
        .update(payload)
        .digest('hex');

      if (signature !== expectedSignature) {
        return { valid: false, error: 'Invalid license signature' };
      }

      const [licenseId] = payload.split(':');
      const license = await this.loadLicense(licenseId);

      if (!license) {
        return { valid: false, error: 'License not found' };
      }

      if (!license.isActive) {
        return { valid: false, error: 'License is deactivated' };
      }

      if (new Date() > license.expirationDate) {
        return { valid: false, error: 'License has expired' };
      }

      const currentFingerprint = this.generateHardwareFingerprint();
      if (license.hardwareFingerprint !== currentFingerprint) {
        return { valid: false, error: 'License not valid for this hardware' };
      }

      // Update last validation time
      license.lastValidation = new Date();
      await this.saveLicense(license);

      return { valid: true, license };
    } catch (error) {
      return { valid: false, error: 'License validation failed' };
    }
  }

  // Encrypt model data
  async encryptModel(
    modelData: Buffer,
    license: ModelLicense,
    metadata: EncryptedModel['metadata'],
  ): Promise<EncryptedModel> {
    const key = Buffer.from(license.encryptionKey, 'hex');
    const iv = crypto.randomBytes(this.ivLength);

    const cipher = crypto.createCipherGCM(this.algorithm, key, iv);

    const encryptedChunks: Buffer[] = [];
    encryptedChunks.push(cipher.update(modelData));
    encryptedChunks.push(cipher.final());

    const tag = cipher.getAuthTag();
    const encryptedData = Buffer.concat([iv, tag, ...encryptedChunks]);

    const encryptedModel: EncryptedModel = {
      modelName: license.modelName,
      encryptedData,
      metadata: {
        ...metadata,
        checksum: crypto.createHash('sha256').update(modelData).digest('hex'),
      },
      licenseId: license.id,
      encryptionAlgorithm: this.algorithm,
      createdAt: new Date(),
    };

    return encryptedModel;
  }

  // Decrypt model data
  async decryptModel(encryptedModel: EncryptedModel, license: ModelLicense): Promise<Buffer> {
    const key = Buffer.from(license.encryptionKey, 'hex');
    const encryptedData = encryptedModel.encryptedData;

    const iv = encryptedData.subarray(0, this.ivLength);
    const tag = encryptedData.subarray(this.ivLength, this.ivLength + this.tagLength);
    const encrypted = encryptedData.subarray(this.ivLength + this.tagLength);

    const decipher = crypto.createDecipherGCM(this.algorithm, key, iv);
    decipher.setAuthTag(tag);

    const decryptedChunks: Buffer[] = [];
    decryptedChunks.push(decipher.update(encrypted));
    decryptedChunks.push(decipher.final());

    const decryptedData = Buffer.concat(decryptedChunks);

    // Verify checksum
    const checksum = crypto.createHash('sha256').update(decryptedData).digest('hex');
    if (checksum !== encryptedModel.metadata.checksum) {
      throw new Error('Model integrity check failed');
    }

    return decryptedData;
  }

  // Save encrypted model to disk
  async saveEncryptedModel(encryptedModel: EncryptedModel): Promise<string> {
    await this.initializeDirectories();

    const fileName = `${encryptedModel.modelName.replace(/\s+/g, '-').toLowerCase()}.enc`;
    const filePath = path.join(this.modelsPath, fileName);

    const modelData = {
      ...encryptedModel,
      encryptedData: encryptedModel.encryptedData.toString('base64'),
    };

    await writeFile(filePath, JSON.stringify(modelData, null, 2));
    return filePath;
  }

  // Load encrypted model from disk
  async loadEncryptedModel(modelName: string): Promise<EncryptedModel | null> {
    try {
      const fileName = `${modelName.replace(/\s+/g, '-').toLowerCase()}.enc`;
      const filePath = path.join(this.modelsPath, fileName);

      await access(filePath);
      const data = await readFile(filePath, 'utf8');
      const parsed = JSON.parse(data);

      return {
        ...parsed,
        encryptedData: Buffer.from(parsed.encryptedData, 'base64'),
        metadata: parsed.metadata,
        createdAt: new Date(parsed.createdAt),
      };
    } catch (error) {
      return null;
    }
  }

  // Save license to disk
  private async saveLicense(license: ModelLicense): Promise<void> {
    await this.initializeDirectories();

    const fileName = `${license.id}.license`;
    const filePath = path.join(this.licensePath, fileName);

    await writeFile(filePath, JSON.stringify(license, null, 2));
  }

  // Load license from disk
  private async loadLicense(licenseId: string): Promise<ModelLicense | null> {
    try {
      const fileName = `${licenseId}.license`;
      const filePath = path.join(this.licensePath, fileName);

      await access(filePath);
      const data = await readFile(filePath, 'utf8');
      const parsed = JSON.parse(data);

      return {
        ...parsed,
        expirationDate: new Date(parsed.expirationDate),
        activationDate: new Date(parsed.activationDate),
        lastValidation: new Date(parsed.lastValidation),
      };
    } catch (error) {
      return null;
    }
  }

  // Activate license (increment activation count)
  async activateLicense(licenseId: string): Promise<{ success: boolean; error?: string }> {
    const license = await this.loadLicense(licenseId);

    if (!license) {
      return { success: false, error: 'License not found' };
    }

    if (license.currentActivations >= license.maxActivations) {
      return { success: false, error: 'Maximum activations reached' };
    }

    license.currentActivations++;
    await this.saveLicense(license);

    return { success: true };
  }

  // Deactivate license
  async deactivateLicense(licenseId: string): Promise<{ success: boolean; error?: string }> {
    const license = await this.loadLicense(licenseId);

    if (!license) {
      return { success: false, error: 'License not found' };
    }

    license.isActive = false;
    await this.saveLicense(license);

    return { success: true };
  }

  // Get license status
  async getLicenseStatus(licenseId: string): Promise<{
    valid: boolean;
    license?: ModelLicense;
    status: string;
  }> {
    const license = await this.loadLicense(licenseId);

    if (!license) {
      return { valid: false, status: 'not_found' };
    }

    if (!license.isActive) {
      return { valid: false, license, status: 'deactivated' };
    }

    if (new Date() > license.expirationDate) {
      return { valid: false, license, status: 'expired' };
    }

    const currentFingerprint = this.generateHardwareFingerprint();
    if (license.hardwareFingerprint !== currentFingerprint) {
      return { valid: false, license, status: 'hardware_mismatch' };
    }

    return { valid: true, license, status: 'active' };
  }

  // List all licenses for a user
  async getUserLicenses(userId: number): Promise<ModelLicense[]> {
    try {
      const licenses: ModelLicense[] = [];
      const fs = require('fs');
      const files = fs.readdirSync(this.licensePath);

      for (const file of files) {
        if (file.endsWith('.license')) {
          const licenseId = file.replace('.license', '');
          const license = await this.loadLicense(licenseId);

          if (license && license.userId === userId) {
            licenses.push(license);
          }
        }
      }

      return licenses;
    } catch (error) {
      return [];
    }
  }
}

// Factory function for creating encryption manager
export function createModelEncryptionManager(): ModelEncryptionManager {
  return new ModelEncryptionManager();
}
