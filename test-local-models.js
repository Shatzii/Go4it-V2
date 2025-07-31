// Simple test script for local models
const { localModelManager, localVideoAnalyzer } = require('./lib/local-models.ts');

async function testModels() {
  console.log('Testing Local Model System...\n');
  
  try {
    // Get model status
    const status = await localModelManager.getModelsStatus();
    console.log('Model Status:', JSON.stringify(status, null, 2));
    
    // Test if we can analyze a video (even without models installed)
    console.log('\nTesting video analysis...');
    
    try {
      const result = await localVideoAnalyzer.analyzeVideoLocal('test-video.mp4', 'basketball');
      console.log('Analysis Result:', JSON.stringify(result, null, 2));
    } catch (error) {
      console.log('Expected error (models not installed):', error.message);
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testModels();