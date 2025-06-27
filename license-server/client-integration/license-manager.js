
/**
 * Go4It Sports Client-Side License Validator
 * 
 * This code gets integrated into the self-hosted Go4It application
 * to validate subscriptions with the license server.
 */

const crypto = require('crypto');
const os = require('os');

class LicenseManager {
  constructor() {
    this.licenseKey = process.env.GO4IT_LICENSE_KEY;
    this.licenseServer = process.env.GO4IT_LICENSE_SERVER || 'https://licensing.go4itsports.com';
    this.lastValidation = null;
    this.cachedLicense = null;
    this.gracePeriodEnd = null;
    this.validationInterval = null;
    
    // Start validation loop
    this.startValidationLoop();
  }
  
  generateServerFingerprint() {
    // Create unique server fingerprint
    const networkInterfaces = os.networkInterfaces();
    const cpus = os.cpus();
    const hostname = os.hostname();
    
    const fingerprint = crypto
      .createHash('sha256')
      .update(JSON.stringify({
        hostname,
        cpus: cpus.length,
        arch: os.arch(),
        platform: os.platform(),
        networkMacs: Object.values(networkInterfaces)
          .flat()
          .filter(iface => iface.mac && iface.mac !== '00:00:00:00:00:00')
          .map(iface => iface.mac)
          .sort()
      }))
      .digest('hex');
      
    return fingerprint;
  }
  
  async validateLicense() {
    try {
      if (!this.licenseKey) {
        throw new Error('No license key configured');
      }
      
      const response = await fetch(`${this.licenseServer}/api/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          licenseKey: this.licenseKey,
          serverFingerprint: this.generateServerFingerprint(),
          installationId: this.getInstallationId()
        }),
        timeout: 10000 // 10 second timeout
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'License validation failed');
      }
      
      const license = await response.json();
      
      // Cache valid license
      this.cachedLicense = license;
      this.lastValidation = new Date();
      this.gracePeriodEnd = null;
      
      console.log('License validated successfully');
      return license;
      
    } catch (error) {
      console.warn('License validation failed:', error.message);
      
      // Handle offline or server issues
      if (this.cachedLicense && this.isWithinGracePeriod()) {
        console.log('Using cached license within grace period');
        return this.cachedLicense;
      }
      
      // Start grace period if not already started
      if (!this.gracePeriodEnd) {
        this.gracePeriodEnd = new Date(Date.now() + this.getGracePeriodMs());
        console.log('Starting grace period until:', this.gracePeriodEnd);
      }
      
      return null;
    }
  }
  
  getGracePeriodMs() {
    // Grace period based on cached license tier
    if (!this.cachedLicense) return 24 * 60 * 60 * 1000; // 1 day default
    
    const gracePeriods = {
      starter: 7 * 24 * 60 * 60 * 1000,      // 7 days
      professional: 3 * 24 * 60 * 60 * 1000, // 3 days  
      enterprise: 1 * 24 * 60 * 60 * 1000    // 1 day
    };
    
    return gracePeriods[this.cachedLicense.tier] || gracePeriods.starter;
  }
  
  isWithinGracePeriod() {
    return this.gracePeriodEnd && new Date() < this.gracePeriodEnd;
  }
  
  startValidationLoop() {
    // Validate immediately
    this.validateLicense();
    
    // Then validate every 24 hours
    this.validationInterval = setInterval(async () => {
      const license = await this.validateLicense();
      if (!license && !this.isWithinGracePeriod()) {
        this.handleLicenseExpired();
      }
    }, 24 * 60 * 60 * 1000);
  }
  
  hasFeature(feature) {
    if (!this.cachedLicense) return false;
    if (!this.isLicenseValid()) return false;
    
    return this.cachedLicense.features.includes(feature);
  }
  
  isLicenseValid() {
    if (!this.cachedLicense) return false;
    
    // Check if within grace period
    if (this.gracePeriodEnd && new Date() > this.gracePeriodEnd) {
      return false;
    }
    
    // Check if license has expired
    if (new Date() > new Date(this.cachedLicense.expiresAt)) {
      return false;
    }
    
    return true;
  }
  
  getMaxAthletes() {
    return this.cachedLicense ? this.cachedLicense.maxAthletes : 0;
  }
  
  getLicenseStatus() {
    return {
      valid: this.isLicenseValid(),
      tier: this.cachedLicense?.tier,
      features: this.cachedLicense?.features || [],
      maxAthletes: this.getMaxAthletes(),
      expiresAt: this.cachedLicense?.expiresAt,
      gracePeriodEnd: this.gracePeriodEnd,
      lastValidation: this.lastValidation
    };
  }
  
  handleLicenseExpired() {
    console.error('License expired - disabling application features');
    
    // Emit event for application to handle
    process.emit('licenseExpired', {
      renewalUrl: `https://go4itsports.com/renew?license=${this.licenseKey}`
    });
  }
  
  getInstallationId() {
    // Generate or retrieve installation ID
    const fs = require('fs');
    const path = require('path');
    const installationFile = path.join(process.cwd(), '.go4it-installation');
    
    if (fs.existsSync(installationFile)) {
      return fs.readFileSync(installationFile, 'utf8').trim();
    }
    
    const installationId = crypto.randomUUID();
    fs.writeFileSync(installationFile, installationId);
    return installationId;
  }
  
  shutdown() {
    if (this.validationInterval) {
      clearInterval(this.validationInterval);
    }
  }
}

// Export singleton instance
module.exports = new LicenseManager();
