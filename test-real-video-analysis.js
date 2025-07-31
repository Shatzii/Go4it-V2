const fs = require('fs');
const FormData = require('form-data');

async function testRealVideo() {
  try {
    console.log('Testing Local AI Analysis with Real Sports Video...\n');
    
    // Create form data with the real video
    const formData = new FormData();
    formData.append('video', fs.createReadStream('attached_assets/IMG_5141_1753940768312.mov'), {
      filename: 'sports-video.mov',
      contentType: 'video/quicktime'
    });
    formData.append('sport', 'basketball');
    formData.append('analysisType', 'local');
    
    console.log('Uploading video for local AI analysis...');
    
    const response = await fetch('http://localhost:5000/api/gar/analyze-local', {
      method: 'POST',
      body: formData
    });
    
    const result = await response.json();
    console.log('\n=== LOCAL AI ANALYSIS RESULTS ===');
    console.log(JSON.stringify(result, null, 2));
    
    if (result.success) {
      console.log('\n✓ Local AI model analysis completed successfully!');
      console.log(`✓ GAR Score: ${result.analysis?.garScore || 'N/A'}`);
      console.log(`✓ Processing Time: ${result.processingTime || 'N/A'}`);
      console.log(`✓ Models Used: ${result.modelsUsed?.join(', ') || 'N/A'}`);
    }
    
  } catch (error) {
    console.error('Analysis error:', error.message);
  }
}

// Only run if we have the fetch polyfill
if (typeof fetch === 'undefined') {
  console.log('Installing fetch...');
  global.fetch = require('node-fetch');
}

testRealVideo();