/**
 * This script verifies that all essential content is present before deployment
 * It checks for critical database tables, essential static files,
 * and required environment variables
 */

import { db } from '../server/db';
import * as schema from '../shared/schema';
import { eq } from 'drizzle-orm';
import fs from 'fs';
import path from 'path';

async function verifyEssentialContent() {
  console.log('Verifying essential content before deployment...');
  let errors = 0;

  try {
    // Check for critical database tables
    console.log('\n--- Database Tables ---');
    
    // Verify users table has at least one admin user
    const adminUsers = await db.select().from(schema.users)
      .where(eq(schema.users.role, 'admin'));
      
    if (adminUsers.length === 0) {
      console.error('❌ ERROR: No admin users found. At least one admin user must exist.');
      errors++;
    } else {
      console.log(`✅ Found ${adminUsers.length} admin user(s)`);
    }

    // Verify content blocks exist for essential sections
    const essentialSections = [
      'what-makes-us-different',
      'home-hero',
      'footer'
    ];
    
    for (const section of essentialSections) {
      const contentBlocks = await db.select()
        .from(schema.contentBlocks)
        .where(eq(schema.contentBlocks.section, section));
      
      if (contentBlocks.length === 0) {
        console.error(`❌ ERROR: No content blocks found for section '${section}'`);
        errors++;
      } else {
        console.log(`✅ Found ${contentBlocks.length} content block(s) for section '${section}'`);
      }
    }

    // Check for essential directories
    console.log('\n--- Directory Structure ---');
    const essentialDirs = [
      'uploads',
      'uploads/videos',
      'logs'
    ];
    
    for (const dir of essentialDirs) {
      if (!fs.existsSync(dir)) {
        console.error(`❌ ERROR: Directory '${dir}' not found`);
        fs.mkdirSync(dir, { recursive: true });
        console.log(`   Created missing directory '${dir}'`);
      } else {
        console.log(`✅ Directory '${dir}' exists`);
      }
    }

    // Check that the build directory exists
    const buildDir = path.join('client', 'dist');
    if (!fs.existsSync(buildDir)) {
      console.error(`❌ ERROR: Build directory '${buildDir}' not found. Frontend may not be built.`);
      errors++;
    } else {
      console.log(`✅ Frontend build directory '${buildDir}' exists`);
    }

    // Check for critical environment variables
    console.log('\n--- Environment Variables ---');
    const requiredEnvVars = [
      'DATABASE_URL',
      'NODE_ENV',
      'OPENAI_API_KEY',
      'ANTHROPIC_API_KEY'
    ];
    
    for (const envVar of requiredEnvVars) {
      if (!process.env[envVar]) {
        console.error(`❌ ERROR: Required environment variable '${envVar}' is not set`);
        errors++;
      } else {
        console.log(`✅ Environment variable '${envVar}' is set`);
      }
    }

    console.log('\n--- Verification Complete ---');
    if (errors > 0) {
      console.error(`❌ Found ${errors} error(s) that must be resolved before deployment`);
      process.exit(1);
    } else {
      console.log('✅ All essential content verified successfully!');
      process.exit(0);
    }
  } catch (error) {
    console.error('❌ ERROR during verification:', error);
    process.exit(1);
  }
}

verifyEssentialContent();