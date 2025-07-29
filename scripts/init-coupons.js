#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('🎫 Initializing Go4It Sports Coupon System...');

try {
  // Initialize the coupon tables and predefined coupons
  console.log('📝 Creating coupon tables...');
  
  // This would normally run drizzle migrations, but for now we'll just call the API
  console.log('🔄 Setting up predefined coupons...');
  
  const initResult = execSync('curl -X POST http://localhost:5000/api/coupons/admin?action=init', { 
    encoding: 'utf8',
    timeout: 10000 
  });
  
  console.log('✅ Coupon system initialized successfully!');
  console.log('\n🎯 Available Coupon Codes:');
  console.log('• FREEMONTH - Get one month completely free');
  console.log('• SAVE20 - Save 20% on any subscription');
  console.log('• HALFOFF - Limited time 50% discount');
  console.log('• SUPERSTAR75 - Massive 75% savings for elite athletes');
  
  console.log('\n🔗 Access the coupon management at: http://localhost:5000/coupons');
  
} catch (error) {
  console.error('❌ Failed to initialize coupon system:', error.message);
  console.log('\n💡 Make sure the server is running with: npm run dev');
}