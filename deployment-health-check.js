#!/usr/bin/env node

/**
 * Deployment Health Check
 * Verifies all systems are operational for production deployment
 */

const http = require('http');

async function checkHealth(port = 5000) {
  return new Promise((resolve, reject) => {
    const req = http.get(`http://localhost:${port}/api/health`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const health = JSON.parse(data);
          resolve(health);
        } catch (e) {
          reject(new Error('Invalid health response'));
        }
      });
    });
    
    req.on('error', reject);
    req.setTimeout(5000, () => reject(new Error('Health check timeout')));
  });
}

async function runDeploymentCheck() {
  console.log('🔍 Running deployment health check...');
  
  try {
    const health = await checkHealth();
    
    console.log('✅ Health Check Results:');
    console.log(`   Status: ${health.status}`);
    console.log(`   Environment: ${health.environment}`);
    console.log(`   Port: ${health.port}`);
    console.log(`   Uptime: ${health.uptime}s`);
    
    if (health.features) {
      console.log('📊 Features Status:');
      Object.entries(health.features).forEach(([feature, status]) => {
        console.log(`   ${feature}: ${status ? '✅' : '❌'}`);
      });
    }
    
    if (health.status === 'healthy') {
      console.log('🎯 Platform ready for production deployment!');
      process.exit(0);
    } else {
      console.log('⚠️  Platform not ready - check logs');
      process.exit(1);
    }
    
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  runDeploymentCheck();
}

module.exports = { checkHealth, runDeploymentCheck };
