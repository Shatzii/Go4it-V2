import axios from 'axios';

async function testGamePlanAPI() {
  try {
    // Step 1: Login to get auth token
    console.log('Logging in to get authentication token...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      username: 'admin',
      password: 'admin123'
    });
    
    const { accessToken } = loginResponse.data;
    console.log('Login successful, received token');
    
    // Step 2: Make the game plan API request
    console.log('\nTesting football game plan API...');
    const gamePlanResponse = await axios.post(
      'http://localhost:5000/api/videos/1/game-plan',
      {
        teamName: 'Eagles',
        opponentName: 'Giants',
        gameDate: '2025-04-20'
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('\nAPI Response:');
    console.log('Status:', gamePlanResponse.status);
    console.log('Headers:', JSON.stringify(gamePlanResponse.headers, null, 2));
    console.log('Data:', JSON.stringify(gamePlanResponse.data, null, 2));
    
  } catch (error) {
    console.error('Error:', error.message);
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testGamePlanAPI();