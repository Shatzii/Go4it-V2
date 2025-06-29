// Script to test WebSocket stats functionality directly
// Run with: node test-websocket-stats.js

import WebSocket from 'ws';

// WebSocket server URL (update port if needed)
const WS_URL = 'ws://localhost:5000/ws';

// Number of connections to create for testing
const NUM_CONNECTIONS = 5;
const connections = [];

// Create multiple WebSocket connections for testing
console.log(`Creating ${NUM_CONNECTIONS} test WebSocket connections to ${WS_URL}`);
for (let i = 0; i < NUM_CONNECTIONS; i++) {
  const ws = new WebSocket(WS_URL);
  
  ws.on('open', () => {
    console.log(`Connection ${i+1} established`);
    
    // Send auth message (required for connection to be counted)
    ws.send(JSON.stringify({
      type: 'auth',
      userId: 1, // Using a test user ID
      token: 'test-token'
    }));
    
    // Send a test message
    setTimeout(() => {
      ws.send(JSON.stringify({
        type: 'test',
        message: `Test message from connection ${i+1}`
      }));
    }, 500);
  });
  
  ws.on('message', (data) => {
    console.log(`Connection ${i+1} received: ${data}`);
  });
  
  ws.on('error', (error) => {
    console.error(`Connection ${i+1} error: ${error.message}`);
  });
  
  connections.push(ws);
}

// Keep the connections open for 10 seconds, then close them
setTimeout(() => {
  console.log('Closing connections...');
  connections.forEach((ws, i) => {
    ws.close();
    console.log(`Connection ${i+1} closed`);
  });
  
  // Give some time for connections to properly close before exiting
  setTimeout(() => {
    console.log('Test completed');
    process.exit(0);
  }, 1000);
}, 10000);