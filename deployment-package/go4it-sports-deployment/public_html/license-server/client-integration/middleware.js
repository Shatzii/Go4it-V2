
/**
 * Express middleware for feature protection based on license
 */

const licenseManager = require('./license-manager');

// Require specific subscription tier
const requiresSubscription = (requiredTier) => {
  const tierLevels = { starter: 1, professional: 2, enterprise: 3 };
  
  return (req, res, next) => {
    const license = licenseManager.getLicenseStatus();
    
    if (!license.valid) {
      return res.status(403).json({
        error: 'Invalid or expired license',
        renewalUrl: `https://go4itsports.com/renew?license=${process.env.GO4IT_LICENSE_KEY}`
      });
    }
    
    const userLevel = tierLevels[license.tier] || 0;
    const requiredLevel = tierLevels[requiredTier] || 999;
    
    if (userLevel < requiredLevel) {
      return res.status(403).json({
        error: `Feature requires ${requiredTier} subscription`,
        currentTier: license.tier,
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
    if (!licenseManager.hasFeature(feature)) {
      return res.status(403).json({
        error: `Feature '${feature}' not available in your subscription`,
        availableFeatures: licenseManager.getLicenseStatus().features
      });
    }
    
    next();
  };
};

// Check athlete limit
const checkAthleteLimit = async (req, res, next) => {
  const maxAthletes = licenseManager.getMaxAthletes();
  
  // Get current athlete count from database
  const currentCount = await getCurrentAthleteCount();
  
  if (currentCount >= maxAthletes) {
    return res.status(403).json({
      error: 'Athlete limit reached',
      current: currentCount,
      maximum: maxAthletes,
      upgradeUrl: 'https://go4itsports.com/upgrade'
    });
  }
  
  next();
};

module.exports = {
  requiresSubscription,
  requiresFeature,
  checkAthleteLimit
};
