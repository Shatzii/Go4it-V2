// TypeScript version of the highlight generator test
import { initializeHighlightGenerationSystem, forceGenerateHighlights } from './server/highlight-generator.fixed';
import { dbStorage } from './server/database-storage';
import { InsertUser, InsertVideo } from '@shared/schema';

// Create a test video if needed
async function createTestVideoIfNeeded() {
  try {
    // Check if we have any admin users
    const adminUsers = await dbStorage.getUsersByRole('admin');
    
    let adminId: number;
    
    if (!adminUsers || adminUsers.length === 0) {
      console.log("No admin users found, creating a test admin user");
      
      // Create a test admin user
      const adminUser: InsertUser = {
        username: 'admin',
        email: 'admin@go4itsports.com',
        passwordHash: '$2a$10$JrqxnGS1wPzJhNP7ibVYYeIeBnlLHLDe/pZCaPoRQOr4P3vYHWBxy', // hash for 'password123'
        role: 'admin',
        firstName: 'Admin',
        lastName: 'User'
      };
      
      const createdAdmin = await dbStorage.createUser(adminUser);
      adminId = createdAdmin.id;
      console.log("Created admin user:", adminId);
    } else {
      adminId = adminUsers[0].id;
      console.log("Using existing admin user:", adminId);
    }
    
    // Check for existing videos
    const testVideos = await dbStorage.getVideosByUser(adminId); 
    if (testVideos && testVideos.length > 0) {
      console.log(`Found ${testVideos.length} existing videos`);
      return { video: testVideos[0], adminId };
    }
    
    // Create a test video
    console.log("No videos found, creating a test video");
    
    const testVideo: InsertVideo = {
      title: "Basketball Game Highlights - Championship Final",
      description: "Championship game between East High and West High. Features multiple dunks, 3-pointers, and defensive plays.",
      filePath: "/uploads/videos/test-basketball-game.mp4",
      thumbnailPath: "/uploads/thumbnails/test-basketball-game.jpg",
      userId: adminId,
      sportType: "basketball",
      analyzed: false,
      processingStatus: "complete"
    };
    
    const createdVideo = await dbStorage.createVideo(testVideo);
    console.log("Created test video:", createdVideo.id);
    
    return { video: createdVideo, adminId };
  } catch (error: any) {
    console.error("Error creating test video:", error);
    throw error;
  }
}

async function main() {
  try {
    console.log("Testing highlight generator...");
    
    // Create a test video if needed
    const { video, adminId } = await createTestVideoIfNeeded();
    console.log("Working with video ID:", video.id, "and admin ID:", adminId);
    
    // Initialize the system
    const initialized = await initializeHighlightGenerationSystem();
    if (!initialized) {
      console.error("Failed to initialize highlight generation system");
      return;
    }
    
    console.log("Highlight generation system initialized successfully");
    
    // Generate highlights for our specific video
    const result = await forceGenerateHighlights(video.id, adminId);
    
    console.log("Generation result:", result);
    
    if (result.success) {
      // Check if any highlights were generated
      const highlights = await dbStorage.getVideoHighlightsByVideoId(video.id);
      console.log(`Generated ${highlights.length} highlights for video ${video.id}`);
      
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