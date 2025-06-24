#!/usr/bin/env node

const http = require('http');

function testEndpoint(port, path = '/') {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${port}${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: data.substring(0, 200)
        });
      });
    });
    req.on('error', (err) => {
      resolve({ error: err.message });
    });
    req.setTimeout(5000, () => {
      req.destroy();
      resolve({ error: 'timeout' });
    });
  });
}

async function main() {
  console.log('Testing Go4It Sports Platform...');
  
  // Test main site
  const result = await testEndpoint(3000);
  console.log('Port 3000 test:', result.error || `${result.status} - ${result.body.substring(0, 100)}...`);
  
  // Test API endpoint
  const apiResult = await testEndpoint(3000, '/api/auth/status');
  console.log('API test:', apiResult.error || `${apiResult.status}`);
  
  // Test teams endpoint
  const teamsResult = await testEndpoint(3000, '/teams');
  console.log('Teams page test:', teamsResult.error || `${teamsResult.status}`);
  
  console.log('Test complete.');
}

main();