import { db } from "./db";
import { 
  users, 
  featuredAthletes,
  athleteStarProfiles
} from "@shared/schema";
import fs from "fs";
import path from "path";
import { hashPassword } from "./auth";
import { eq } from "drizzle-orm";
import { storage } from './storage';

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), "uploads");
const athleteImagesDir = path.join(uploadDir, "athletes");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
if (!fs.existsSync(athleteImagesDir)) {
  fs.mkdirSync(athleteImagesDir, { recursive: true });
}

function copyImagesFromAssets() {
  const assetsDir = path.join(process.cwd(), "attached_assets", "headshots");
  
  try {
    // Ensure athlete images directory exists
    if (!fs.existsSync(athleteImagesDir)) {
      fs.mkdirSync(athleteImagesDir, { recursive: true });
    }
    
    // Copy specific image files
    const imagesToCopy = [
      { source: "IMG_1606.jpeg", dest: "athlete1.jpeg" },
      { source: "IMG_3113.jpeg", dest: "athlete2.jpeg" },
      { source: "IMG_6486.jpeg", dest: "athlete3.jpeg" }
    ];
    
    for (const image of imagesToCopy) {
      const sourcePath = path.join(assetsDir, image.source);
      const destPath = path.join(athleteImagesDir, image.dest);
      
      if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, destPath);
        console.log(`Copied ${image.source} to ${image.dest}`);
      } else {
        console.log(`Source image ${sourcePath} not found, skipping`);
      }
    }
  } catch (error) {
    console.error("Error copying images from assets:", error);
  }
}

export async function seedRealisticAthletes() {
  try {
    // Copy athlete images from assets
    copyImagesFromAssets();
    
    // Create new athlete users
    const athleteUsers = [
      {
        username: "jmarcus23",
        password: await hashPassword("password123"),
        email: "jmarcus@student.edu",
        name: "Jamal Marcus",
        role: "athlete",
        profileImage: "/uploads/athletes/athlete1.jpeg",
        bio: "6'4\" senior shooting guard with a powerful drive to the basket and improving 3-point shot. 3.8 GPA with interest in sports science.",
        createdAt: new Date()
      },
      {
        username: "taylor_swift12",
        password: await hashPassword("password123"),
        email: "tswift@student.edu",
        name: "Taylor Swift",
        role: "athlete",
        profileImage: "/uploads/athletes/athlete2.jpeg",
        bio: "5'11\" junior volleyball outside hitter with exceptional vertical leap. National honor society member with 4.0 GPA.",
        createdAt: new Date()
      },
      {
        username: "dwest_runner",
        password: await hashPassword("password123"),
        email: "dwest@student.edu",
        name: "Darnell West",
        role: "athlete",
        profileImage: "/uploads/athletes/athlete3.jpeg",
        bio: "Track and field specialist focusing on 400m and long jump. Looking to earn a scholarship at a D1 program.",
        createdAt: new Date()
      }
    ];
    
    for (const userData of athleteUsers) {
      // Check if user already exists
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.username, userData.username));
      
      if (existingUser.length === 0) {
        await db.insert(users).values(userData);
        console.log(`Created athlete user: ${userData.name}`);
      }
    }
    
    // Get the created users
    const jamal = await db
      .select()
      .from(users)
      .where(eq(users.username, "jmarcus23"))
      .then(rows => rows[0]);
      
    const taylor = await db
      .select()
      .from(users)
      .where(eq(users.username, "taylor_swift12"))
      .then(rows => rows[0]);
      
    const darnell = await db
      .select()
      .from(users)
      .where(eq(users.username, "dwest_runner"))
      .then(rows => rows[0]);
    
    // Create star athlete profiles
    const starAthletes = [
      {
        userId: jamal.id,
        sport: "Basketball",
        position: "Shooting Guard",
        starLevel: 4,
        name: jamal.name,
        age: 18,
        heightInches: 76,
        weightLbs: 185,
        city: "Memphis",
        state: "TN",
        highlights: "All-Region First Team, 24.5 PPG, 5.2 APG",
        strengthAreas: ["3-point shooting", "Ball handling", "Court vision"],
        weaknessAreas: ["Defensive footwork", "Left hand finishing"],
        recruitingStatus: "Active",
        schoolInterests: ["Memphis", "Tennessee", "Kentucky"],
        gpaScore: 3.8,
        videoUrls: [],
        active: true
      },
      {
        userId: taylor.id,
        sport: "Volleyball",
        position: "Outside Hitter",
        starLevel: 5,
        name: taylor.name,
        age: 17,
        heightInches: 71,
        weightLbs: 145,
        city: "Dallas",
        state: "TX",
        highlights: "State Championship MVP, 4.8 kills per set",
        strengthAreas: ["Vertical leap", "Hitting power", "Court awareness"],
        weaknessAreas: ["Back row defense"],
        recruitingStatus: "Committed",
        schoolInterests: ["Stanford", "Texas", "USC"],
        gpaScore: 4.0,
        videoUrls: [],
        active: true
      },
      {
        userId: darnell.id,
        sport: "Track",
        position: "Sprinter/Jumper",
        starLevel: 4,
        name: darnell.name,
        age: 17,
        heightInches: 73,
        weightLbs: 165,
        city: "Atlanta",
        state: "GA",
        highlights: "Regional Champion 400m, State Qualifier Long Jump",
        strengthAreas: ["400m sprint", "Long jump", "Explosiveness"],
        weaknessAreas: ["Block starts", "Race strategy"],
        recruitingStatus: "Active",
        schoolInterests: ["Georgia", "Florida", "LSU"],
        gpaScore: 3.5,
        videoUrls: [],
        active: true
      }
    ];

    // Insert star athlete profiles
    for (const athlete of starAthletes) {
      const existing = await db
        .select()
        .from(athleteStarProfiles)
        .where(eq(athleteStarProfiles.userId, athlete.userId));

      if (existing.length === 0) {
        await db.insert(athleteStarProfiles).values(athlete);
        console.log(`Created star athlete profile for: ${athlete.name}`);
      }
    }
    
    console.log("Successfully seeded realistic athlete profiles");
  } catch (error) {
    console.error("Error seeding realistic athletes:", error);
  }
}


import { storage } from './storage';
import { db } from './db';
import { users, athleteStarProfiles } from '@shared/schema';

async function seedAthletes() {
  // Create users first
  const jamal = await storage.createUser({
    username: 'jamal23',
    email: 'jamal@example.com',
    password: 'hashedpassword123',
    name: 'Jamal Thompson',
    role: 'athlete'
  });

  const taylor = await storage.createUser({
    username: 'taylor_v',
    email: 'taylor@example.com', 
    password: 'hashedpassword123',
    name: 'Taylor Vaughn',
    role: 'athlete'
  });

  const darnell = await storage.createUser({
    username: 'darnell44',
    email: 'darnell@example.com',
    password: 'hashedpassword123',
    name: 'Darnell Jackson',
    role: 'athlete'
  });

  // Create featured athletes
  await storage.createFeaturedAthlete({
    userId: jamal.id,
    sportType: "Basketball",
    highlight: "24.5 PPG, All-Region First Team",
    quote: "Working to be the best version of myself every day",
    achievements: "District MVP, 1000 Point Club",
    active: true,
    position: 1
  });

  await storage.createFeaturedAthlete({
    userId: taylor.id,
    sportType: "Volleyball",
    highlight: "State Championship MVP",
    quote: "Dream big, work hard",
    achievements: "4.8 kills per set, All-State Team",
    active: true,
    position: 2
  });

  await storage.createFeaturedAthlete({
    userId: darnell.id,
    sportType: "Track",
    highlight: "State Record Holder - Long Jump",
    quote: "Every day is a chance to improve",
    achievements: "3x State Champion",
    active: true,
    position: 3
  });

  console.log('Athletes seeded successfully');
}

seedAthletes().catch(console.error);