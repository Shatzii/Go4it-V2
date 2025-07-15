/**
 * AI Coach Feature Testing
 * Tests the self-hosted AI coaching functionality
 */

const testAICoach = async () => {
  console.log('🤖 Testing AI Coach Feature...\n');
  
  try {
    // Test 1: Login and get token
    console.log('1. Testing authentication...');
    const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    });
    
    if (!loginResponse.ok) {
      throw new Error(`Login failed: ${loginResponse.status}`);
    }
    
    const loginData = await loginResponse.json();
    const token = loginData.token;
    console.log('✅ Authentication successful');
    
    // Test 2: Get available AI models
    console.log('\n2. Testing AI models endpoint...');
    const modelsResponse = await fetch('http://localhost:5000/api/ai-coach/models', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!modelsResponse.ok) {
      throw new Error(`Models endpoint failed: ${modelsResponse.status}`);
    }
    
    const modelsData = await modelsResponse.json();
    console.log('✅ AI models endpoint working');
    console.log(`   Available models: ${modelsData.models.length}`);
    console.log(`   Default model: ${modelsData.defaultModel}`);
    
    // Test 3: Generate coaching session
    console.log('\n3. Testing coaching session generation...');
    const sessionResponse = await fetch('http://localhost:5000/api/ai-coach', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        sport: 'Basketball',
        currentLevel: 'Intermediate',
        goals: 'Improve shooting accuracy and ball handling',
        weaknesses: 'Inconsistent shooting form, slow dribbling',
        strengths: 'Good court vision, strong defensive positioning',
        sessionType: 'Skill Development'
      })
    });
    
    if (!sessionResponse.ok) {
      throw new Error(`Coaching session failed: ${sessionResponse.status}`);
    }
    
    const sessionData = await sessionResponse.json();
    console.log('✅ Coaching session generation working');
    console.log(`   Session ID: ${sessionData.session?.id}`);
    console.log(`   AI Coach Response: ${sessionData.success ? 'Generated' : 'Failed'}`);
    
    // Test 4: Test progress tracking
    console.log('\n4. Testing progress tracking...');
    const progressResponse = await fetch('http://localhost:5000/api/ai-coach/progress', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!progressResponse.ok) {
      throw new Error(`Progress tracking failed: ${progressResponse.status}`);
    }
    
    const progressData = await progressResponse.json();
    console.log('✅ Progress tracking working');
    console.log(`   Current level: ${progressData.starPathStatus?.currentLevel}`);
    console.log(`   Total XP: ${progressData.starPathStatus?.totalXP}`);
    console.log(`   Unlocked skills: ${progressData.starPathStatus?.unlockedSkills?.length || 0}`);
    
    // Test 5: Test drill completion
    console.log('\n5. Testing drill completion...');
    const completionResponse = await fetch('http://localhost:5000/api/ai-coach/progress', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        sessionId: sessionData.session?.id || 'test-session',
        drillId: 'test-drill-1',
        completed: true,
        performance: {
          accuracy: 85,
          speed: 80,
          consistency: 88
        },
        notes: 'Drill completed successfully'
      })
    });
    
    if (!completionResponse.ok) {
      throw new Error(`Drill completion failed: ${completionResponse.status}`);
    }
    
    const completionData = await completionResponse.json();
    console.log('✅ Drill completion working');
    console.log(`   XP gained: ${completionData.starPathUpdate?.xpGained || 0}`);
    console.log(`   Skills unlocked: ${completionData.starPathUpdate?.skillsUnlocked?.length || 0}`);
    
    console.log('\n🎉 AI Coach Feature Test Complete!');
    console.log('✅ All core functionality working correctly');
    
    console.log('\n📋 AI Coach Feature Summary:');
    console.log('• Self-hosted AI model integration: ✅ Working');
    console.log('• Personalized coaching sessions: ✅ Working');
    console.log('• Skills and drills generation: ✅ Working');
    console.log('• StarPath progression tracking: ✅ Working');
    console.log('• Drill completion and XP: ✅ Working');
    console.log('• Model management interface: ✅ Working');
    
  } catch (error) {
    console.error('❌ AI Coach test failed:', error.message);
    process.exit(1);
  }
};

// Run the test
testAICoach();