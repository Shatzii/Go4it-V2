import crypto from 'crypto';

// SOC2-compliant encryption utilities
export class SOC2Encryption {
  private static algorithm = 'aes-256-gcm';
  private static keyLength = 32; // 256 bits
  private static ivLength = 16; // 128 bits for GCM
  private static tagLength = 16; // 128 bits authentication tag

  // Generate encryption key from environment variable
  private static getEncryptionKey(): Buffer {
    const key = process.env.SOC2_ENCRYPTION_KEY;
    if (!key) {
      throw new Error('SOC2_ENCRYPTION_KEY environment variable is required');
    }

    // If key is shorter than required, hash it to get proper length
    if (key.length < this.keyLength) {
      return crypto.scryptSync(key, 'soc2-salt', this.keyLength);
    }

    // If key is hex-encoded
    if (key.length === this.keyLength * 2) {
      return Buffer.from(key, 'hex');
    }

    // Otherwise, hash the key to get proper length
    return crypto.scryptSync(key, 'soc2-salt', this.keyLength);
  }

  /**
   * Encrypt sensitive data for storage
   */
  static encrypt(plainText: string): string {
    try {
      const key = this.getEncryptionKey();
      const iv = crypto.randomBytes(this.ivLength);

      const cipher = crypto.createCipher(this.algorithm, key);
      cipher.setAAD(Buffer.from('soc2-data')); // Additional authenticated data

      let encrypted = cipher.update(plainText, 'utf8', 'hex');
      encrypted += cipher.final('hex');

      const authTag = cipher.getAuthTag();

      // Return format: iv:authTag:encryptedData
      return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
    } catch (error) {
      throw new Error(`Encryption failed: ${error.message}`);
    }
  }

  /**
   * Decrypt sensitive data from storage
   */
  static decrypt(encryptedText: string): string {
    try {
      const key = this.getEncryptionKey();
      const parts = encryptedText.split(':');

      if (parts.length !== 3) {
        throw new Error('Invalid encrypted data format');
      }

      const iv = Buffer.from(parts[0], 'hex');
      const authTag = Buffer.from(parts[1], 'hex');
      const encrypted = parts[2];

      const decipher = crypto.createDecipher(this.algorithm, key);
      decipher.setAAD(Buffer.from('soc2-data'));
      decipher.setAuthTag(authTag);

      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted;
    } catch (error) {
      throw new Error(`Decryption failed: ${error.message}`);
    }
  }

  /**
   * Hash sensitive data (one-way) for verification
   */
  static hash(data: string, saltRounds: number = 12): string {
    return crypto.scryptSync(data, 'soc2-hash-salt', 64, { N: 1 << saltRounds }).toString('hex');
  }

  /**
   * Verify hashed data
   */
  static verifyHash(data: string, hash: string, saltRounds: number = 12): boolean {
    const computedHash = this.hash(data, saltRounds);
    return crypto.timingSafeEqual(Buffer.from(computedHash, 'hex'), Buffer.from(hash, 'hex'));
  }

  /**
   * Generate secure random token
   */
  static generateSecureToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  /**
   * Generate secure session ID
   */
  static generateSessionId(): string {
    return crypto.randomUUID();
  }
}

// SOC2 Data Classification and Encryption
export enum DataClassification {
  PUBLIC = 'public',           // No encryption needed
  INTERNAL = 'internal',       // Encrypted for internal use
  CONFIDENTIAL = 'confidential', // Highly sensitive, encrypted
  RESTRICTED = 'restricted'    // Most sensitive, additional controls
}

export class SOC2DataProtection {
  /**
   * Determine data classification based on content
   */
  static classifyData(data: any): DataClassification {
    const dataString = JSON.stringify(data).toLowerCase();

    // Check for highly sensitive patterns
    if (/\b(ssn|social.security|tax.id|passport|drivers?.license)\b/.test(dataString)) {
      return DataClassification.RESTRICTED;
    }

    // Check for confidential patterns
    if (/\b(password|credit.card|bank.account|medical|health)\b/.test(dataString)) {
      return DataClassification.CONFIDENTIAL;
    }

    // Check for internal patterns
    if (/\b(email|phone|address|personal)\b/.test(dataString)) {
      return DataClassification.INTERNAL;
    }

    return DataClassification.PUBLIC;
  }

  /**
   * Encrypt data based on classification
   */
  static encryptByClassification(data: any): { encrypted: boolean; data: any; classification: DataClassification } {
    const classification = this.classifyData(data);

    switch (classification) {
      case DataClassification.RESTRICTED:
      case DataClassification.CONFIDENTIAL:
      case DataClassification.INTERNAL:
        return {
          encrypted: true,
          data: SOC2Encryption.encrypt(JSON.stringify(data)),
          classification
        };

      default:
        return {
          encrypted: false,
          data,
          classification
        };
    }
  }

  /**
   * Decrypt data if encrypted
   */
  static decryptIfNeeded(encryptedData: any): any {
    if (typeof encryptedData === 'string' && encryptedData.includes(':')) {
      try {
        const decrypted = SOC2Encryption.decrypt(encryptedData);
        return JSON.parse(decrypted);
      } catch {
        // If decryption fails, return as-is (might not be encrypted)
        return encryptedData;
      }
    }
    return encryptedData;
  }
}

// SOC2 Key Management (simplified for this implementation)
export class SOC2KeyManagement {
  private static keyRotationInterval = 90 * 24 * 60 * 60 * 1000; // 90 days

  /**
   * Check if encryption key needs rotation
   */
  static needsRotation(lastRotation: Date): boolean {
    return Date.now() - lastRotation.getTime() > this.keyRotationInterval;
  }

  /**
   * Generate new encryption key
   */
  static generateNewKey(): string {
    return SOC2Encryption.generateSecureToken(32);
  }

  /**
   * Validate encryption key strength
   */
  static validateKeyStrength(key: string): { valid: boolean; issues: string[] } {
    const issues: string[] = [];

    if (key.length < 32) {
      issues.push('Key must be at least 32 characters long');
    }

    if (!/[A-Z]/.test(key)) {
      issues.push('Key must contain uppercase letters');
    }

    if (!/[a-z]/.test(key)) {
      issues.push('Key must contain lowercase letters');
    }

    if (!/\d/.test(key)) {
      issues.push('Key must contain numbers');
    }

    if (!/[^A-Za-z0-9]/.test(key)) {
      issues.push('Key must contain special characters');
    }

    return {
      valid: issues.length === 0,
      issues
    };
  }
}