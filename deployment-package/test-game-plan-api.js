import axios from 'axios';
import { writeFileSync, readFileSync, existsSync } from 'fs';

// Create an axios instance that automatically handles cookies
const api = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true
});

// Utility function to extract cookies from set-cookie header
function extractCookies(response) {
  const cookies = {};
  const cookieHeader = response.headers['set-cookie'];
  if (cookieHeader) {
    cookieHeader.forEach(cookie => {
      const parts = cookie.split(';')[0].split('=');
      cookies[parts[0]] = parts[1];
    });
  }
  return cookies;
}

// Save session cookie to file for reuse
function saveSessionCookie(cookie) {
  writeFileSync('cookies.txt', JSON.stringify(cookie), 'utf8');
  console.log('Session cookie saved to cookies.txt');
}

// Load session cookie from file
function loadSessionCookie() {
  if (existsSync('cookies.txt')) {
    try {
      return JSON.parse(readFileSync('cookies.txt', 'utf8'));
    } catch (e) {
      console.error('Error loading cookie:', e.message);
      return null;
    }
  }
  return null;
}

async function testGamePlanAPI() {
  try {
    // Check if we have a stored cookie
    let sessionCookie = loadSessionCookie();
    let cookieString = '';
    
    if (!sessionCookie) {
      // Step 1: Login to get session cookie
      console.log('No stored session found. Logging in to establish authenticated session...');
      const loginResponse = await api.post('/api/auth/login', {
        username: 'admin',
        password: 'admin123'
      });
      
      console.log('Login successful:', loginResponse.status === 200);
      
      // Extract the session cookie
      sessionCookie = extractCookies(loginResponse);
      if (sessionCookie['connect.sid']) {
        saveSessionCookie(sessionCookie);
      }
    }
    
    // Create cookie string for direct request
    if (sessionCookie && sessionCookie['connect.sid']) {
      cookieString = `connect.sid=${sessionCookie['connect.sid']}`;
      console.log('Using session cookie:', cookieString);
    } else {
      console.error('No valid session cookie found');
      return;
    }
    
    // Step 3: Make the game plan API request with direct cookie header
    console.log('\nTesting football game plan API...');
    
    // Add the cookie directly
    const gamePlanResponse = await axios.post(
      'http://localhost:5000/api/videos/1/game-plan',
      {
        teamName: 'Eagles',
        opponentName: 'Giants',
        gameDate: '2025-04-20'
      },
      {
        headers: {
          'Cookie': cookieString,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('\nAPI Response:');
    console.log('Status:', gamePlanResponse.status);
    
    // Show a detailed summary of the game plan
    const gameplan = gamePlanResponse.data;
    
    // Check if we have a proper game plan response
    if (gameplan && gameplan.summary) {
      console.log('\nGAME PLAN SUMMARY:');
      console.log('Opponent:', gameplan.summary.opponentName);
      console.log('Game Date:', gameplan.summary.gameDate);
      console.log('Overall Strategy:', gameplan.summary.overallStrategy);
      console.log('\nOffensive Formation:', gameplan.offensiveGamePlan.formation.recommended.join(', '));
      console.log('Defensive Formation:', gameplan.defensiveGamePlan.formation.recommended.join(', '));
      console.log('Red Zone Strategy:', gameplan.offensiveGamePlan.redZoneStrategy);
      console.log('Practice Emphasis:', gameplan.practiceEmphasis.join(', '));
    } else {
      console.log('Unexpected response format:', JSON.stringify(gameplan, null, 2).substring(0, 500) + '...');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testGamePlanAPI();