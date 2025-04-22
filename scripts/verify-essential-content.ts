/**
 * Verify Essential Content Script
 * 
 * This script checks for essential content in the database and creates it if missing.
 * It ensures that the minimal required content is in place for the platform to function properly.
 */

import 'dotenv/config';
import { db } from '../server/db';
import { contentBlocks } from '../shared/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { log } from '../server/utils';

async function verifyEssentialContent() {
  log("Starting verification of essential content...");
  
  try {
    // Check if admin user exists
    await verifyAdminUser();
    
    // Check and create essential content blocks
    await verifyContentBlocks();
    
    // Check if required blog posts exist
    await verifyBlogPosts();
    
    // Check if featured athletes exist
    await verifyFeaturedAthletes();
    
    // Verify skill tree data
    await verifySkillTree();
    
    log("Essential content verification completed successfully");
  } catch (error) {
    log(`Error verifying essential content: ${error}`, 'error');
    throw error;
  }
}

async function verifyAdminUser() {
  log("Checking admin user...");
  
  const adminUser = await db.query.users.findFirst({
    where: eq(db.query.users.role, 'admin')
  });
  
  if (!adminUser) {
    log("No admin user found, creating default admin user...");
    
    // Hash the default password
    const hashedPassword = await bcrypt.hash('MyTime$$', 10);
    
    await db.insert(db.query.users).values({
      username: 'admin',
      email: 'admin@go4itsports.com',
      password: hashedPassword,
      role: 'admin',
      created_at: new Date(),
      updated_at: new Date()
    });
    
    log("Default admin user created (username: admin, password: MyTime$$)");
  } else {
    log("Admin user exists");
  }
}

async function verifyContentBlocks() {
  log("Checking essential content blocks...");
  
  const essentialSections = [
    'home-hero',
    'what-makes-us-different',
    'how-it-works',
    'featured-athletes',
    'sport-options',
    'coach-resources',
    'about-us',
    'faq'
  ];
  
  for (const section of essentialSections) {
    const existingBlock = await db.query.contentBlocks.findFirst({
      where: eq(contentBlocks.section, section)
    });
    
    if (!existingBlock) {
      log(`Creating placeholder content block for section: ${section}`);
      
      await db.insert(contentBlocks).values({
        section,
        title: `${section.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}`,
        content: JSON.stringify({
          headline: `${section.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}`,
          subheadline: 'This content needs to be updated before launch',
          items: [
            { title: 'Content Item 1', description: 'Description for item 1' },
            { title: 'Content Item 2', description: 'Description for item 2' },
            { title: 'Content Item 3', description: 'Description for item 3' }
          ],
          ctaText: 'Learn More',
          ctaLink: '#'
        }),
        active: true,
        created_at: new Date(),
        updated_at: new Date()
      });
      
      log(`Created placeholder content block for section: ${section}`);
    } else {
      log(`Content block for section ${section} exists`);
    }
  }
}

async function verifyBlogPosts() {
  log("Checking essential blog posts...");
  
  const blogCount = await db.query.blogPosts.findMany({
    limit: 1
  });
  
  if (blogCount.length === 0) {
    log("No blog posts found. The system will automatically generate blog posts when the server runs.");
  } else {
    log(`${blogCount.length} blog posts exist`);
  }
}

async function verifyFeaturedAthletes() {
  log("Checking featured athletes...");
  
  const featuredAthletes = await db.query.featuredAthletes.findMany({
    limit: 1
  });
  
  if (featuredAthletes.length === 0) {
    log("No featured athletes found. Please add featured athletes through the admin dashboard.");
  } else {
    log(`${featuredAthletes.length} featured athletes exist`);
  }
}

async function verifySkillTree() {
  log("Checking skill tree data...");
  
  const skillTreeNodes = await db.query.skillTreeNodes.findMany({
    limit: 1
  });
  
  if (skillTreeNodes.length === 0) {
    log("No skill tree nodes found. Running skill tree seeding...");
    
    // Import and run the seed function
    try {
      const { seedSkillTree } = require('../server/seed-skill-tree');
      await seedSkillTree();
      log("Skill tree data seeded successfully");
    } catch (error) {
      log(`Error seeding skill tree data: ${error}`, 'error');
    }
  } else {
    log(`${skillTreeNodes.length} skill tree nodes exist`);
  }
}

// Run the verification process
verifyEssentialContent()
  .then(() => {
    console.log("Content verification completed");
    process.exit(0);
  })
  .catch(error => {
    console.error("Error during content verification:", error);
    process.exit(1);
  });