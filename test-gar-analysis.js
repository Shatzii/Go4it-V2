// Test GAR analysis endpoints
const fs = require('fs');
const FormData = require('form-data');
const fetch = require('node-fetch');

async function testGARAnalysis() {
  try {
    console.log('Testing GAR Analysis System...\n');
    
    // Test 1: Local analysis endpoint (should work without models)
    console.log('1. Testing local analysis endpoint...');
    
    // Create a small test file
    const testVideoContent = Buffer.from('test video content');
    fs.writeFileSync('/tmp/test-video.mp4', testVideoContent);
    
    const formData = new FormData();
    formData.append('video', fs.createReadStream('/tmp/test-video.mp4'), 'test-video.mp4');
    formData.append('sport', 'basketball');
    
    const response = await fetch('http://localhost:5000/api/gar/analyze-local', {
      method: 'POST',
      body: formData
    });
    
    const result = await response.text();
    console.log('Local analysis response:', result);
    
    // Test 2: Cloud analysis endpoint
    console.log('\n2. Testing cloud analysis endpoint...');
    
    const cloudResponse = await fetch('http://localhost:5000/api/gar/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sport: 'basketball', testMode: true })
    });
    
    const cloudResult = await cloudResponse.text();
    console.log('Cloud analysis response:', cloudResult);
    
  } catch (error) {
    console.error('Test error:', error.message);
  }
}

testGARAnalysis();