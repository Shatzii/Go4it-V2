// Script to directly check our health endpoints
// Run with: node check-health-endpoints.js

import http from 'http';

// Function to make an HTTP GET request
function httpGet(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-Bypass-Vite': 'true' // Custom header to help identify direct API calls
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const contentType = res.headers['content-type'] || '';
          if (contentType.includes('application/json')) {
            resolve({ 
              statusCode: res.statusCode, 
              headers: res.headers,
              data: JSON.parse(data) 
            });
          } else {
            // If response is not JSON, just return the raw data
            resolve({ 
              statusCode: res.statusCode, 
              headers: res.headers,
              data: data,
              isHtml: data.includes('<!DOCTYPE html>')
            });
          }
        } catch (e) {
          resolve({ 
            statusCode: res.statusCode, 
            headers: res.headers,
            data: data,
            parseError: e.message 
          });
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.end();
  });
}

// Main function to check all health endpoints
async function checkHealthEndpoints() {
  console.log('Checking health endpoints...\n');
  
  try {
    // Check main health endpoint
    console.log('1. Checking /api/health endpoint:');
    const healthResponse = await httpGet('/api/health');
    console.log(`   Status code: ${healthResponse.statusCode}`);
    if (healthResponse.isHtml) {
      console.log('   Response appears to be HTML (Vite is likely intercepting the request)');
    } else {
      console.log('   Response data:', JSON.stringify(healthResponse.data, null, 2));
    }
    console.log();
    
    // Check WebSocket stats endpoint
    console.log('2. Checking /api/health/ws-stats endpoint:');
    const wsStatsResponse = await httpGet('/api/health/ws-stats');
    console.log(`   Status code: ${wsStatsResponse.statusCode}`);
    if (wsStatsResponse.isHtml) {
      console.log('   Response appears to be HTML (Vite is likely intercepting the request)');
    } else {
      console.log('   Response data:', JSON.stringify(wsStatsResponse.data, null, 2));
    }
    console.log();
    
    // Check database health endpoint
    console.log('3. Checking /api/health/db endpoint:');
    const dbHealthResponse = await httpGet('/api/health/db');
    console.log(`   Status code: ${dbHealthResponse.statusCode}`);
    if (dbHealthResponse.isHtml) {
      console.log('   Response appears to be HTML (Vite is likely intercepting the request)');
    } else {
      console.log('   Response data:', JSON.stringify(dbHealthResponse.data, null, 2));
    }
    console.log();
    
    // Check ping endpoint
    console.log('4. Checking /api/health/ping endpoint:');
    const pingResponse = await httpGet('/api/health/ping');
    console.log(`   Status code: ${pingResponse.statusCode}`);
    console.log(`   Response data: ${pingResponse.data}`);
    
  } catch (error) {
    console.error('Error checking health endpoints:', error.message);
  }
}

// Run the checks
checkHealthEndpoints();