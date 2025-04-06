// Simple test for the highlight generator
import { db } from './server/db.js';
import { videos, users, highlightGeneratorConfigs } from './shared/schema.js';
import { 
  initializeHighlightGenerationSystem,
  forceGenerateHighlights 
} from './server/highlight-generator-simple.js';
import { eq } from 'drizzle-orm';

async function createTestData() {
  try {
    console.log('Setting up test data...');

    // Check if we already have an admin user
    let adminUser = await db.select().from(users).where(eq(users.role, 'admin')).limit(1).then(results => results[0]);
    
    if (!adminUser) {
      // Create an admin user
      [adminUser] = await db.insert(users)
        .values({
          username: 'admin',
          password: '$2a$10$JdRJ2XNtMxlrMCmHxr4FRe6ZD1T7EDvtEdDXYBYLJE4XJ.Y9lU0qC', // 'password'
          email: 'admin@go4itsports.com',
          role: 'admin',
          firstName: 'Admin',
          lastName: 'User',
          createdAt: new Date(),
          updatedAt: new Date()
        })
        .returning();
      
      console.log(`Created admin user with ID ${adminUser.id}`);
    } else {
      console.log(`Using existing admin user with ID ${adminUser.id}`);
    }

    // Create a test video if none exists
    const existingVideos = await db.select().from(videos).limit(1);
    
    if (existingVideos.length === 0) {
      const [testVideo] = await db.insert(videos)
        .values({
          userId: adminUser.id,
          title: 'Basketball Game Highlights - Championship Final',
          description: 'Exciting championship game between two top high school teams',
          sportType: 'basketball',
          filePath: '/uploads/sample_basketball_game.mp4',
          thumbnailPath: '/uploads/sample_basketball_thumbnail.jpg',
          duration: 180, // 3 minutes
          uploadDate: new Date(),
          private: false,
          analyzed: false
        })
        .returning();
      
      console.log(`Created test video: ${testVideo.id}`);
      return { adminId: adminUser.id, videoId: testVideo.id };
    } else {
      console.log(`Using existing video: ${existingVideos[0].id}`);
      return { adminId: adminUser.id, videoId: existingVideos[0].id };
    }
  } catch (error) {
    console.error('Error creating test data:', error);
    throw error;
  }
}

async function main() {
  try {
    console.log('Testing highlight generator system...');
    
    const { adminId, videoId } = await createTestData();
    
    // Initialize the highlight generation system
    console.log(`Initializing highlight generation system with admin ID ${adminId}`);
    await initializeHighlightGenerationSystem(adminId);
    
    // Force generate highlights for our test video
    console.log(`Generating highlights for video ${videoId}`);
    const config = await db.select().from(highlightGeneratorConfigs)
      .where(eq(highlightGeneratorConfigs.sportType, 'basketball'))
      .limit(1)
      .then(results => results[0] || null);
    
    if (!config) {
      throw new Error('No basketball highlight generator config found');
    }
    
    const result = await forceGenerateHighlights(videoId, config.id);
    
    console.log('Highlight generation result:', result);
    
    if (result.success) {
      console.log('✅ Highlight generator test completed successfully!');
    } else {
      console.log('❌ Highlight generator test failed:', result.message);
    }
    
    // Close the database connection (optional)
    // await db.end();
  } catch (error) {
    console.error('Error running test:', error);
  }
}

main();