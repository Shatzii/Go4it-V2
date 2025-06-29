/**
 * Go4It Sports License Middleware
 * Protects API routes based on subscription tier and features
 */

const licenseManager = require('../license-manager');

// Require specific subscription tier
const requiresSubscription = (requiredTier) => {
  const tierLevels = { starter: 1, professional: 2, enterprise: 3 };
  
  return (req, res, next) => {
    const license = licenseManager.getLicenseStatus();
    
    if (!license.valid) {
      return res.status(403).json({
        error: 'License validation failed',
        message: 'Your subscription has expired or is invalid',
        renewalUrl: license.renewalUrl,
        gracePeriodEnd: license.gracePeriodEnd
      });
    }
    
    const userLevel = tierLevels[license.tier] || 0;
    const requiredLevel = tierLevels[requiredTier] || 999;
    
    if (userLevel < requiredLevel) {
      return res.status(403).json({
        error: `Feature requires ${requiredTier} subscription`,
        currentTier: license.tier,
        requiredTier: requiredTier,
        upgradeUrl: 'https://go4itsports.com/upgrade'
      });
    }
    
    req.license = license;
    next();
  };
};

// Require specific feature
const requiresFeature = (feature) => {
  return (req, res, next) => {
    const license = licenseManager.getLicenseStatus();
    
    if (!license.valid) {
      return res.status(403).json({
        error: 'License validation failed',
        renewalUrl: license.renewalUrl
      });
    }
    
    if (!licenseManager.hasFeature(feature)) {
      return res.status(403).json({
        error: `Feature '${feature}' not available`,
        message: `This feature requires a higher subscription tier`,
        currentTier: license.tier,
        availableFeatures: license.features,
        upgradeUrl: 'https://go4itsports.com/upgrade'
      });
    }
    
    req.license = license;
    next();
  };
};

// Check athlete limit before adding new athletes
const checkAthleteLimit = (req, res, next) => {
  const license = licenseManager.getLicenseStatus();
  
  if (!license.valid) {
    return res.status(403).json({
      error: 'License validation failed',
      renewalUrl: license.renewalUrl
    });
  }
  
  // Note: Actual athlete count would be checked against database
  // This is a placeholder that the application would implement
  req.maxAthletes = license.maxAthletes;
  req.license = license;
  next();
};

// License status endpoint for frontend
const getLicenseStatus = (req, res) => {
  const status = licenseManager.getLicenseStatus();
  res.json(status);
};

// Handle license expiration gracefully
const handleLicenseExpiration = (req, res, next) => {
  const license = licenseManager.getLicenseStatus();
  
  if (!license.valid && !licenseManager.isWithinGracePeriod()) {
    // For expired licenses, only allow essential endpoints
    const allowedPaths = [
      '/api/license/status',
      '/api/auth/logout',
      '/api/data/export',
      '/admin/license'
    ];
    
    if (!allowedPaths.some(path => req.path.startsWith(path))) {
      return res.status(403).json({
        error: 'Subscription expired',
        message: 'Please renew your subscription to access this feature',
        renewalUrl: license.renewalUrl,
        allowedEndpoints: allowedPaths
      });
    }
  }
  
  next();
};

module.exports = {
  requiresSubscription,
  requiresFeature,
  checkAthleteLimit,
  getLicenseStatus,
  handleLicenseExpiration
};