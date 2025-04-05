import fs from 'fs';
import path from 'path';
import { db } from './db';
import { athleteStarProfiles, users } from '@shared/schema';
import { generateAthleteImage } from './openai';
import { hashPassword } from './auth';
import { v4 as uuidv4 } from 'uuid';
import { eq } from 'drizzle-orm';

/**
 * Generates real user accounts and athlete profiles with authentic headshots
 * from the extracted JSON files. These profiles serve as benchmarks for each
 * star rating level across different sports and positions.
 */
export async function generateProfiles() {
  try {
    console.log('Starting athlete profile generation...');
    
    // Check if athlete profiles already exist
    const existingProfiles = await db.select().from(athleteStarProfiles);
    if (existingProfiles.length > 0) {
      console.log(`Found ${existingProfiles.length} existing athlete profiles. Skipping generation.`);
      return existingProfiles;
    }
    
    // Get all JSON files in the temp_extract directory
    const extractDir = path.join(process.cwd(), 'temp_extract');
    if (!fs.existsSync(extractDir)) {
      console.error('Extract directory not found. Please unzip the athlete profiles first.');
      return [];
    }
    
    const files = fs.readdirSync(extractDir)
      .filter(file => file.endsWith('.json'));
    
    console.log(`Found ${files.length} athlete profile JSON files to process.`);
    
    // Process files in batches to avoid overwhelming the system
    const batchSize = 5; // Process 5 files at a time
    const generatedProfiles = [];
    
    for (let i = 0; i < files.length; i += batchSize) {
      const batch = files.slice(i, i + batchSize);
      console.log(`Processing batch ${Math.floor(i/batchSize) + 1} of ${Math.ceil(files.length/batchSize)}...`);
      
      // Process each file in the batch
      const batchPromises = batch.map(async (filename) => {
        const filePath = path.join(extractDir, filename);
        const profileData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        
        // Generate a username from the original profile ID
        const username = `${profileData.sport.toLowerCase().substring(0, 3)}_${profileData.position.toLowerCase().substring(0, 3)}_${profileData.star_level}star_${uuidv4().substring(0, 4)}`;
        
        // Create a realistic email based on the sport and position
        const email = `${username}@athlete.getverified.com`;
        
        // Generate a secure password for the account
        const password = await hashPassword('Password123!');
        
        // Create a user account for this athlete profile
        const [user] = await db.insert(users).values({
          username,
          password,
          email,
          name: profileData.name,
          role: 'athlete',
          bio: `${profileData.star_level}-star ${profileData.position} in ${profileData.sport}. ${profileData.rank || ''}`,
        }).returning();
        
        console.log(`Created user account for ${profileData.name}`);
        
        // Generate an authentic headshot image using OpenAI DALL-E
        const avatarPath = await generateAthleteImage(
          profileData.sport,
          profileData.position,
          profileData.star_level
        );
        
        console.log(`Generated headshot image for ${profileData.name} at ${avatarPath}`);
        
        // Update the user with the avatar
        await db
          .update(users)
          .set({ profileImage: avatarPath })
          .where(eq(users.id, user.id));
        
        // Create the athlete star profile with the user account linked
        const [profile] = await db.insert(athleteStarProfiles).values({
          profileId: profileData.id,
          userId: user.id,
          name: profileData.name,
          starLevel: profileData.star_level,
          sport: profileData.sport,
          position: profileData.position,
          ageGroup: profileData.age_group,
          metrics: profileData.metrics,
          traits: profileData.traits,
          filmExpectations: profileData.film_expectations,
          trainingFocus: profileData.training_focus,
          avatar: avatarPath,
          rank: profileData.rank,
          xpLevel: profileData.xp_level,
          active: true
        }).returning();
        
        console.log(`Created athlete star profile for ${profileData.name}`);
        
        return profile;
      });
      
      // Wait for all profiles in this batch to be generated
      const batchResults = await Promise.all(batchPromises);
      generatedProfiles.push(...batchResults);
      
      // Add a small delay between batches to avoid rate limits
      if (i + batchSize < files.length) {
        console.log('Waiting 2 seconds before processing next batch...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    console.log(`Successfully generated ${generatedProfiles.length} athlete profiles with authentic headshots.`);
    return generatedProfiles;
    
  } catch (error: unknown) {
    console.error('Error generating athlete profiles:', error);
    throw error;
  }
}

// Execute if this file is run directly
if (require.main === module) {
  generateProfiles()
    .then(() => {
      console.log('Athlete profile generation completed.');
      process.exit(0);
    })
    .catch((error: unknown) => {
      console.error('Athlete profile generation failed:', error);
      process.exit(1);
    });
}