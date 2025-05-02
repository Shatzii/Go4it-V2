/**
 * Go4It Sports Production Starter
 * 
 * This script sets the NODE_ENV to production and starts the server.js file.
 * It's a wrapper around the production server to avoid modifying package.json.
 */

// Set environment to production
process.env.NODE_ENV = 'production';

// Load server script
require('./server.js');