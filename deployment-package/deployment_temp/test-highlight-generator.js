// Simple script to test the highlight generator
import { initializeHighlightGenerationSystem, processUnanalyzedVideos } from './server/highlight-generator.fixed.js';
import { dbStorage } from './server/database-storage.js';

// Create a test video if needed
async function createTestVideoIfNeeded() {
  try {
    // Check if we have any videos
    const adminUsers = await dbStorage.getUsersByRole('admin');
    if (!adminUsers || adminUsers.length === 0) {
      console.log("No admin users found, creating a test admin user");
      
      // Create a test admin user
      const adminUser = await dbStorage.createUser({
        username: 'admin',
        email: 'admin@go4itsports.com',
        passwordHash: '$2a$10$JrqxnGS1wPzJhNP7ibVYYeIeBnlLHLDe/pZCaPoRQOr4P3vYHWBxy', // hash for 'password123'
        role: 'admin',
        firstName: 'Admin',
        lastName: 'User',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      console.log("Created admin user:", adminUser.id);
    }
    
    const adminId = adminUsers[0]?.id || 1;
    
    // Check for existing videos
    const testVideos = await dbStorage.getVideosByUser(adminId); 
    if (testVideos && testVideos.length > 0) {
      console.log(`Found ${testVideos.length} existing videos`);
      return testVideos[0];
    }
    
    // Create a test video
    console.log("No videos found, creating a test video");
    
    const testVideo = {
      title: "Basketball Game Highlights - Championship Final",
      description: "Championship game between East High and West High. Features multiple dunks, 3-pointers, and defensive plays.",
      filePath: "/uploads/videos/test-basketball-game.mp4",
      thumbnailPath: "/uploads/thumbnails/test-basketball-game.jpg",
      duration: 120,
      userId: adminId,
      sportType: "basketball",
      analyzed: false,
      processingStatus: "complete",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const createdVideo = await dbStorage.createVideo(testVideo);
    console.log("Created test video:", createdVideo.id);
    
    return createdVideo;
  } catch (error) {
    console.error("Error creating test video:", error);
    throw error;
  }
}

async function main() {
  try {
    console.log("Testing highlight generator...");
    
    // Initialize the system
    const initialized = await initializeHighlightGenerationSystem();
    if (!initialized) {
      console.error("Failed to initialize highlight generation system");
      return;
    }
    
    console.log("Highlight generation system initialized successfully");
    
    // Create a test video if needed
    const testVideo = await createTestVideoIfNeeded();
    
    // Process unanalyzed videos (should include our test video)
    const adminUsers = await dbStorage.getUsersByRole('admin');
    const adminId = adminUsers[0]?.id || 1;
    
    console.log("Processing unanalyzed videos with admin ID:", adminId);
    const result = await processUnanalyzedVideos(adminId);
    
    console.log("Processing result:", result);
    
    if (result.success) {
      // Check if any highlights were generated
      const highlights = await dbStorage.getVideoHighlightsByVideoId(testVideo.id);
      console.log(`Generated ${highlights.length} highlights for video ${testVideo.id}`);
      
      // Print out highlight details
      highlights.forEach((highlight, index) => {
        console.log(`\nHighlight #${index + 1}: ${highlight.title}`);
        console.log(`- Description: ${highlight.description}`);
        console.log(`- Time: ${highlight.startTime}s to ${highlight.endTime}s`);
        console.log(`- Quality Score: ${highlight.qualityScore}`);
        console.log(`- Primary Skill: ${highlight.primarySkill} (Level: ${highlight.skillLevel})`);
        console.log(`- Tags: ${highlight.tags.join(', ')}`);
      });
    }
  } catch (error) {
    console.error("Error testing highlight generator:", error);
  }
}

main().catch(console.error);