import { db } from "./db";
import { 
  users, 
  featuredAthletes,
  blogPosts
} from "@shared/schema";
import fs from "fs";
import path from "path";
import { hashPassword } from "./auth";
import { eq } from "drizzle-orm";

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), "uploads");
const athleteImagesDir = path.join(uploadDir, "athletes");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
if (!fs.existsSync(athleteImagesDir)) {
  fs.mkdirSync(athleteImagesDir);
}

// Copy images from attached_assets to uploads/athletes
function copyImagesFromAssets() {
  const assetsDir = path.join(process.cwd(), "attached_assets");
  
  try {
    // Ensure attached_assets directory exists
    if (!fs.existsSync(assetsDir)) {
      console.log("attached_assets directory not found, skipping image copying");
      return;
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
        console.log(`Copied ${image.source} to ${destPath}`);
      } else {
        console.log(`Source image ${sourcePath} not found, skipping`);
      }
    }
  } catch (error) {
    console.error("Error copying images from assets:", error);
  }
}

// Function to update or create realistic athlete profiles
export async function seedRealisticAthletes() {
  try {
    // Copy athlete images from assets
    copyImagesFromAssets();
    
    // Check if we already have updated athlete profiles
    const existingAthletes = await db.select().from(featuredAthletes);
    if (existingAthletes.length >= 3) {
      console.log("Realistic athletes already seeded, skipping...");
      return;
    }
    
    // First, delete any existing featured athletes
    await db.delete(featuredAthletes);
    
    // Create new athlete users if they don't exist
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
    
    // Create featured athletes
    const featuredAthleteData = [
      {
        userId: jamal.id,
        highlightText: "Jamal Marcus is establishing himself as an elite college prospect with his combination of size, scoring ability, and academic excellence. His basketball IQ and work ethic have caught the attention of several D1 programs.",
        sportPosition: "Basketball Shooting Guard",
        starRating: 88,
        featuredStats: {
          points: 22.5,
          assists: 4.2,
          rebounds: 6.8,
          fieldGoalPct: 49,
          threePointPct: 38,
          achievements: ["First Team All-State", "District MVP", "3.8 GPA"]
        },
        featuredDate: new Date(),
        featuredVideo: "5",
        coverImage: "/uploads/athletes/athlete1.jpeg",
        order: 1,
        active: true
      },
      {
        userId: taylor.id,
        highlightText: "Taylor Swift has demonstrated exceptional volleyball skills as an outside hitter, combining powerful attacks with precise ball placement. Her vertical leap and timing on blocks make her a formidable defensive player as well.",
        sportPosition: "Volleyball Outside Hitter",
        starRating: 91,
        featuredStats: {
          kills: 312,
          blocks: 87,
          aces: 45,
          digs: 220,
          hittingPct: 0.328,
          achievements: ["Tournament MVP", "All-Conference", "4.0 GPA"]
        },
        featuredDate: new Date(),
        featuredVideo: "4",
        coverImage: "/uploads/athletes/athlete2.jpeg",
        order: 2,
        active: true
      },
      {
        userId: darnell.id,
        highlightText: "Darnell West has shown tremendous progress in both 400m sprint and long jump events. His combination of speed and explosive power gives him versatility across multiple track and field disciplines.",
        sportPosition: "Track Sprinter/Jumper",
        starRating: 84,
        featuredStats: {
          longJump: "6.8m",
          sprint400m: "49.2s",
          sprint200m: "21.8s",
          verticalLeap: "36 inches",
          achievements: ["Regional Champion 400m", "State Qualifier Long Jump", "Academic Honor Roll"]
        },
        featuredDate: new Date(),
        featuredVideo: "3",
        coverImage: "/uploads/athletes/athlete3.jpeg",
        order: 3,
        active: true
      }
    ];
    
    for (const athleteData of featuredAthleteData) {
      await db.insert(featuredAthletes).values(athleteData);
      console.log(`Created featured athlete profile for: ${athleteData.sportPosition}`);
    }
    
    console.log("Successfully seeded realistic athlete profiles");
  } catch (error) {
    console.error("Error seeding realistic athletes:", error);
  }
}