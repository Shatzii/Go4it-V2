import { Router, Request, Response } from "express";
import { db } from "../db";
import * as schema from "@shared/schema";
import { eq } from "drizzle-orm";
import { isAuthenticated } from "../middleware/auth-middleware";

const router = Router();

// Sample data for Scout Vision (until the database tables are properly set up)
const sampleScoutVisionData = [
  {
    id: 1,
    name: "Elite Basketball Podcast",
    platform: "podcast",
    url: "https://podcasts.apple.com/us/podcast/elite-basketball-podcast",
    followerCount: 45000,
    averageEngagement: 0.12,
    sports: ["Basketball"],
    contentQuality: 85,
    relevanceScore: 92,
    partnershipPotential: 88,
    logoUrl: "https://placehold.co/200x200/0047AB/FFF?text=EBP",
    description: "In-depth discussions with coaches and players about training techniques and game strategy."
  },
  {
    id: 2,
    name: "Future Football Weekly",
    platform: "youtube",
    url: "https://youtube.com/channel/futurefootballweekly",
    followerCount: 78000,
    averageEngagement: 0.08,
    sports: ["Football"],
    contentQuality: 79,
    relevanceScore: 84,
    partnershipPotential: 91,
    logoUrl: "https://placehold.co/200x200/0047AB/FFF?text=FFW",
    description: "Weekly analysis of high school football games and emerging talent across the country."
  },
  {
    id: 3,
    name: "All Soccer Insider",
    platform: "instagram",
    url: "https://instagram.com/allsoccerinsider",
    followerCount: 120000,
    averageEngagement: 0.15,
    sports: ["Soccer"],
    contentQuality: 92,
    relevanceScore: 87,
    partnershipPotential: 95,
    logoUrl: "https://placehold.co/200x200/0047AB/FFF?text=ASI",
    description: "Showcasing top soccer talent and providing tips from professional coaches."
  },
  {
    id: 4,
    name: "Champion Swimming Hub",
    platform: "tiktok",
    url: "https://tiktok.com/@championswimminghub",
    followerCount: 65000,
    averageEngagement: 0.2,
    sports: ["Swimming"],
    contentQuality: 88,
    relevanceScore: 82,
    partnershipPotential: 87,
    logoUrl: "https://placehold.co/200x200/0047AB/FFF?text=CSH",
    description: "Short-form swimming technique videos and highlights from swimming competitions."
  },
  {
    id: 5,
    name: "The Baseball Report",
    platform: "podcast",
    url: "https://podcasts.google.com/feed/thebaseballreport",
    followerCount: 52000,
    averageEngagement: 0.11,
    sports: ["Baseball"],
    contentQuality: 84,
    relevanceScore: 89,
    partnershipPotential: 83,
    logoUrl: "https://placehold.co/200x200/0047AB/FFF?text=TBR",
    description: "Covering high school and college baseball with interviews from coaches and scouts."
  },
  {
    id: 6,
    name: "Pro Track Nation",
    platform: "youtube",
    url: "https://youtube.com/c/protracknation",
    followerCount: 89000,
    averageEngagement: 0.09,
    sports: ["Track"],
    contentQuality: 86,
    relevanceScore: 81,
    partnershipPotential: 89,
    logoUrl: "https://placehold.co/200x200/0047AB/FFF?text=PTN",
    description: "Professional track and field coverage with training tips for young athletes."
  },
  {
    id: 7,
    name: "Next Tennis Central",
    platform: "instagram",
    url: "https://instagram.com/nexttenniscentral",
    followerCount: 67000,
    averageEngagement: 0.13,
    sports: ["Tennis"],
    contentQuality: 81,
    relevanceScore: 85,
    partnershipPotential: 80,
    logoUrl: "https://placehold.co/200x200/0047AB/FFF?text=NTC",
    description: "Daily tennis content focusing on junior tournaments and rising stars."
  },
  {
    id: 8,
    name: "Game Day Volleyball Focus",
    platform: "tiktok",
    url: "https://tiktok.com/@gamedayvolleyball",
    followerCount: 105000,
    averageEngagement: 0.17,
    sports: ["Volleyball"],
    contentQuality: 90,
    relevanceScore: 93,
    partnershipPotential: 92,
    logoUrl: "https://placehold.co/200x200/0047AB/FFF?text=GDV",
    description: "Highlighting exceptional volleyball plays and providing training drills."
  }
];

// Get all media partner discoveries (Scout Vision data)
router.get("/scout-vision", async (req: Request, res: Response) => {
  try {
    // In the future, when the database tables are fixed, this would use:
    // const discoveries = await db.select().from(schema.mediaPartnerDiscoveries).limit(8);
    
    // For now, return sample data
    return res.json(sampleScoutVisionData);
  } catch (error) {
    console.error("Error fetching Scout Vision data:", error);
    return res.status(500).json({ message: "Error fetching Scout Vision data" });
  }
});

export default router;