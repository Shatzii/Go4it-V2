
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
const rateLimit = require('express-rate-limit');

const app = express();

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiting for license validation
const licenseValidationLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// License validation endpoint
app.post('/api/validate', licenseValidationLimit, async (req, res) => {
  try {
    const { licenseKey, serverFingerprint, installationId } = req.body;
    
    if (!licenseKey || !serverFingerprint) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Get license from database
    const licenseResult = await pool.query(
      `SELECT l.*, c.subscription_status, c.subscription_tier, c.subscription_expires_at
       FROM licenses l 
       JOIN customers c ON l.customer_id = c.id 
       WHERE l.license_key = $1 AND l.active = true`,
      [licenseKey]
    );
    
    if (licenseResult.rows.length === 0) {
      return res.status(404).json({ error: 'Invalid license key' });
    }
    
    const license = licenseResult.rows[0];
    
    // Check if subscription is active
    if (license.subscription_status !== 'active') {
      return res.status(403).json({ 
        error: 'Subscription inactive',
        status: license.subscription_status,
        renewalUrl: `https://go4itsports.com/renew?license=${licenseKey}`
      });
    }
    
    // Check if subscription has expired
    if (new Date() > new Date(license.subscription_expires_at)) {
      return res.status(403).json({
        error: 'Subscription expired',
        expiredAt: license.subscription_expires_at,
        renewalUrl: `https://go4itsports.com/renew?license=${licenseKey}`
      });
    }
    
    // Verify server fingerprint (prevent license sharing)
    if (license.server_fingerprint && license.server_fingerprint !== serverFingerprint) {
      return res.status(403).json({
        error: 'License bound to different server',
        support: 'Contact support to transfer license'
      });
    }
    
    // Update server fingerprint if not set
    if (!license.server_fingerprint) {
      await pool.query(
        'UPDATE licenses SET server_fingerprint = $1, installation_id = $2 WHERE id = $3',
        [serverFingerprint, installationId, license.id]
      );
    }
    
    // Log usage
    await pool.query(
      `INSERT INTO license_validations (license_id, server_fingerprint, validated_at) 
       VALUES ($1, $2, NOW())`,
      [license.id, serverFingerprint]
    );
    
    // Get feature permissions based on subscription tier
    const features = getFeaturesByTier(license.subscription_tier);
    
    res.json({
      valid: true,
      tier: license.subscription_tier,
      features,
      maxAthletes: getMaxAthletesByTier(license.subscription_tier),
      expiresAt: license.subscription_expires_at,
      validatedAt: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('License validation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Feature definitions by tier
function getFeaturesByTier(tier) {
  const features = {
    starter: [
      'basic_gar_analysis',
      'team_management', 
      'performance_tracking',
      'basic_reports'
    ],
    professional: [
      'basic_gar_analysis',
      'advanced_gar_analysis',
      'team_management',
      'performance_tracking', 
      'ai_coaching',
      'recruitment_tools',
      'academic_tracking',
      'advanced_reports'
    ],
    enterprise: [
      'basic_gar_analysis',
      'advanced_gar_analysis',
      'premium_gar_analysis',
      'team_management',
      'performance_tracking',
      'ai_coaching', 
      'recruitment_tools',
      'academic_tracking',
      'white_label',
      'custom_branding',
      'advanced_reports',
      'analytics_api',
      'bulk_operations'
    ]
  };
  
  return features[tier] || features.starter;
}

function getMaxAthletesByTier(tier) {
  const limits = {
    starter: 50,
    professional: 200,
    enterprise: 9999 // Unlimited
  };
  
  return limits[tier] || limits.starter;
}

// Customer portal authentication
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const customerResult = await pool.query(
      'SELECT * FROM customers WHERE email = $1',
      [email]
    );
    
    if (customerResult.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const customer = customerResult.rows[0];
    const validPassword = await bcrypt.compare(password, customer.password_hash);
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { customerId: customer.id, email: customer.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      token,
      customer: {
        id: customer.id,
        email: customer.email,
        name: customer.name,
        subscriptionTier: customer.subscription_tier,
        subscriptionStatus: customer.subscription_status
      }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get customer license info
app.get('/api/customer/license', authenticateToken, async (req, res) => {
  try {
    const licenseResult = await pool.query(
      `SELECT l.*, c.subscription_tier, c.subscription_status, c.subscription_expires_at
       FROM licenses l
       JOIN customers c ON l.customer_id = c.id
       WHERE c.id = $1`,
      [req.customer.customerId]
    );
    
    if (licenseResult.rows.length === 0) {
      return res.status(404).json({ error: 'No license found' });
    }
    
    const license = licenseResult.rows[0];
    
    res.json({
      licenseKey: license.license_key,
      tier: license.subscription_tier,
      status: license.subscription_status,
      expiresAt: license.subscription_expires_at,
      features: getFeaturesByTier(license.subscription_tier),
      maxAthletes: getMaxAthletesByTier(license.subscription_tier)
    });
    
  } catch (error) {
    console.error('License info error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Token authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, customer) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.customer = customer;
    next();
  });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`License server running on port ${PORT}`);
});
