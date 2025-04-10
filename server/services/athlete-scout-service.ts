import { db } from "../db";
import { eq, and, desc, sql } from "drizzle-orm";
import OpenAI from "openai";
import * as schema from "@shared/schema";

// Ensure we have an OpenAI API key
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface ScoutOptions {
  locationFocus?: string[];
  keywordsToTrack?: string[];
  platformsToSearch?: string[];
  sportFocus?: string[];
  ageRangeMin?: number;
  ageRangeMax?: number;
}

class AthleteScoutService {
  private scoutIntervals: { [key: number]: NodeJS.Timeout } = {};
  
  constructor() {
    console.log("Athlete Scout Service initialized");
  }

  async initialize() {
    try {
      // Load all active athlete scouts and start their discovery cycles
      const activeScouts = await db
        .select()
        .from(schema.socialMediaScouts)
        .where(eq(schema.socialMediaScouts.active, true));

      for (const scout of activeScouts) {
        this.startScoutDiscoveryCycle(scout);
      }

      // Load all active media partnership scouts
      const activeMediaScouts = await db
        .select()
        .from(schema.mediaPartnershipScouts)
        .where(eq(schema.mediaPartnershipScouts.active, true));

      for (const scout of activeMediaScouts) {
        this.startMediaScoutDiscoveryCycle(scout);
      }

      // Load all active city influencer scouts
      const activeCityScouts = await db
        .select()
        .from(schema.cityInfluencerScouts)
        .where(eq(schema.cityInfluencerScouts.active, true));

      for (const scout of activeCityScouts) {
        this.startCityInfluencerScoutCycle(scout);
      }

      console.log(
        `Started ${activeScouts.length} athlete scouts, ${activeMediaScouts.length} media scouts, and ${activeCityScouts.length} city influencer scouts`
      );
      return true;
    } catch (error) {
      console.error("Failed to initialize athlete scout service:", error);
      return false;
    }
  }

  /**
   * Create a new athlete scout
   */
  async createScout(
    name: string,
    description: string,
    createdBy: number,
    options: ScoutOptions = {}
  ) {
    try {
      const [newScout] = await db
        .insert(schema.socialMediaScouts)
        .values({
          name,
          description,
          active: true,
          createdBy,
          sportFocus: options.sportFocus || [],
          locationFocus: options.locationFocus || [],
          keywordsToTrack: options.keywordsToTrack || [],
          platformsToSearch: options.platformsToSearch || ["instagram", "tiktok", "twitter"],
          ageRangeMin: options.ageRangeMin || 12,
          ageRangeMax: options.ageRangeMax || 18,
        })
        .returning();

      if (newScout) {
        this.startScoutDiscoveryCycle(newScout);
        return newScout;
      }
      return null;
    } catch (error) {
      console.error("Failed to create athlete scout:", error);
      return null;
    }
  }

  /**
   * Create a new media partnership scout
   */
  async createMediaScout(
    name: string,
    description: string,
    createdBy: number,
    mediaTypes: string[],
    sportFocus: string[],
    options: { 
      followerThreshold?: number;
      locationFocus?: string[];
      keywordsToTrack?: string[];
      exclusionTerms?: string[];
    } = {}
  ) {
    try {
      const [newScout] = await db
        .insert(schema.mediaPartnershipScouts)
        .values({
          name,
          description,
          active: true,
          createdBy,
          mediaTypes,
          sportFocus,
          followerThreshold: options.followerThreshold || 10000,
          locationFocus: options.locationFocus || [],
          keywordsToTrack: options.keywordsToTrack || [],
          exclusionTerms: options.exclusionTerms || [],
        })
        .returning();

      if (newScout) {
        this.startMediaScoutDiscoveryCycle(newScout);
        return newScout;
      }
      return null;
    } catch (error) {
      console.error("Failed to create media partnership scout:", error);
      return null;
    }
  }

  /**
   * Create a new city influencer scout for combine events
   */
  async createCityInfluencerScout(
    name: string,
    description: string,
    city: string,
    state: string,
    sportFocus: string[],
    createdBy: number,
    options: {
      platforms?: string[];
      minFollowers?: number;
      maxInfluencers?: number;
      combineEventId?: number;
    } = {}
  ) {
    try {
      const [newScout] = await db
        .insert(schema.cityInfluencerScouts)
        .values({
          name,
          description,
          active: true,
          city,
          state,
          sportFocus,
          createdBy,
          platforms: options.platforms || ["instagram", "tiktok", "youtube"],
          minFollowers: options.minFollowers || 5000,
          maxInfluencers: options.maxInfluencers || 10,
          combineEventId: options.combineEventId,
        })
        .returning();

      if (newScout) {
        this.startCityInfluencerScoutCycle(newScout);
        return newScout;
      }
      return null;
    } catch (error) {
      console.error("Failed to create city influencer scout:", error);
      return null;
    }
  }

  /**
   * Start the discovery cycle for an athlete scout
   */
  private startScoutDiscoveryCycle(scout: typeof schema.socialMediaScouts.$inferSelect) {
    // Clear any existing interval for this scout
    if (this.scoutIntervals[scout.id]) {
      clearInterval(this.scoutIntervals[scout.id]);
    }

    // Set the interval for discovery (every 6 hours)
    this.scoutIntervals[scout.id] = setInterval(
      () => this.runAthleteDiscovery(scout.id),
      6 * 60 * 60 * 1000 // 6 hours
    );

    // Run immediately on startup
    this.runAthleteDiscovery(scout.id);
  }

  /**
   * Start the discovery cycle for a media partnership scout
   */
  private startMediaScoutDiscoveryCycle(scout: typeof schema.mediaPartnershipScouts.$inferSelect) {
    // Clear any existing interval for this scout
    const scoutKey = `media_${scout.id}`;
    if (this.scoutIntervals[scoutKey]) {
      clearInterval(this.scoutIntervals[scoutKey]);
    }

    // Set the interval for discovery (every 12 hours)
    this.scoutIntervals[scoutKey] = setInterval(
      () => this.runMediaPartnerDiscovery(scout.id),
      12 * 60 * 60 * 1000 // 12 hours
    );

    // Run immediately on startup
    this.runMediaPartnerDiscovery(scout.id);
  }

  /**
   * Start the discovery cycle for a city influencer scout
   */
  private startCityInfluencerScoutCycle(scout: typeof schema.cityInfluencerScouts.$inferSelect) {
    // Clear any existing interval for this scout
    const scoutKey = `city_${scout.id}`;
    if (this.scoutIntervals[scoutKey]) {
      clearInterval(this.scoutIntervals[scoutKey]);
    }

    // Set the interval for discovery (every 24 hours)
    this.scoutIntervals[scoutKey] = setInterval(
      () => this.runCityInfluencerDiscovery(scout.id),
      24 * 60 * 60 * 1000 // 24 hours
    );

    // Run immediately on startup
    this.runCityInfluencerDiscovery(scout.id);
  }

  /**
   * Run the athlete discovery process for a specific scout
   */
  async runAthleteDiscovery(scoutId: number) {
    try {
      // Get the scout
      const [scout] = await db
        .select()
        .from(schema.socialMediaScouts)
        .where(eq(schema.socialMediaScouts.id, scoutId));

      if (!scout || !scout.active) {
        // If the scout is no longer active, clear its interval
        if (this.scoutIntervals[scoutId]) {
          clearInterval(this.scoutIntervals[scoutId]);
          delete this.scoutIntervals[scoutId];
        }
        return;
      }

      // Update the last run timestamp
      await db
        .update(schema.socialMediaScouts)
        .set({ lastRunAt: new Date() })
        .where(eq(schema.socialMediaScouts.id, scoutId));

      // In a production system, this would connect to social media APIs
      // For now, we'll simulate discovering 1-3 new athletes
      const discoveryCount = Math.floor(Math.random() * 3) + 1;

      for (let i = 0; i < discoveryCount; i++) {
        const discovery = await this.simulateAthleteDiscovery(scout);

        if (discovery) {
          // Update the discovery count for the scout
          await db
            .update(schema.socialMediaScouts)
            .set({
              discoveryCount: sql`${schema.socialMediaScouts.discoveryCount} + 1`,
            })
            .where(eq(schema.socialMediaScouts.id, scoutId));
        }
      }
    } catch (error) {
      console.error(`Error running athlete discovery for scout ID ${scoutId}:`, error);
    }
  }

  /**
   * Run the media partner discovery process for a specific scout
   */
  async runMediaPartnerDiscovery(scoutId: number) {
    try {
      // Get the scout
      const [scout] = await db
        .select()
        .from(schema.mediaPartnershipScouts)
        .where(eq(schema.mediaPartnershipScouts.id, scoutId));

      if (!scout || !scout.active) {
        // If the scout is no longer active, clear its interval
        const scoutKey = `media_${scoutId}`;
        if (this.scoutIntervals[scoutKey]) {
          clearInterval(this.scoutIntervals[scoutKey]);
          delete this.scoutIntervals[scoutKey];
        }
        return;
      }

      // Update the last run timestamp
      await db
        .update(schema.mediaPartnershipScouts)
        .set({ lastRunAt: new Date() })
        .where(eq(schema.mediaPartnershipScouts.id, scoutId));

      // In a production system, this would connect to social media & podcast APIs
      // For now, we'll simulate discovering 1-2 new media partners
      const discoveryCount = Math.floor(Math.random() * 2) + 1;

      for (let i = 0; i < discoveryCount; i++) {
        const discovery = await this.simulateMediaPartnerDiscovery(scout);

        if (discovery) {
          // Update the discovery count for the scout
          await db
            .update(schema.mediaPartnershipScouts)
            .set({
              discoveryCount: sql`${schema.mediaPartnershipScouts.discoveryCount} + 1`,
            })
            .where(eq(schema.mediaPartnershipScouts.id, scoutId));
        }
      }
    } catch (error) {
      console.error(`Error running media partner discovery for scout ID ${scoutId}:`, error);
    }
  }

  /**
   * Run the city influencer discovery process for a specific scout
   */
  async runCityInfluencerDiscovery(scoutId: number) {
    try {
      // Get the scout
      const [scout] = await db
        .select()
        .from(schema.cityInfluencerScouts)
        .where(eq(schema.cityInfluencerScouts.id, scoutId));

      if (!scout || !scout.active) {
        // If the scout is no longer active, clear its interval
        const scoutKey = `city_${scoutId}`;
        if (this.scoutIntervals[scoutKey]) {
          clearInterval(this.scoutIntervals[scoutKey]);
          delete this.scoutIntervals[scoutKey];
        }
        return;
      }

      // Update the last run timestamp
      await db
        .update(schema.cityInfluencerScouts)
        .set({ 
          lastRunAt: new Date(),
          lastUpdated: new Date() 
        })
        .where(eq(schema.cityInfluencerScouts.id, scoutId));

      // In a production system, this would connect to social media APIs and filter by location
      // For now, we'll simulate discovering city influencers
      
      // First, check how many influencers we've already discovered for this city
      const existingCount = await db
        .select({ count: sql<number>`count(*)` })
        .from(schema.cityInfluencerDiscoveries)
        .where(eq(schema.cityInfluencerDiscoveries.scoutId, scoutId));

      const currentCount = existingCount[0]?.count || 0;
      
      // Only discover more if we're under the max limit
      if (currentCount < scout.maxInfluencers) {
        const toDiscover = Math.min(
          scout.maxInfluencers - currentCount,
          Math.floor(Math.random() * 2) + 1
        );

        for (let i = 0; i < toDiscover; i++) {
          const discovery = await this.simulateCityInfluencerDiscovery(scout, currentCount + i + 1);

          if (discovery) {
            // Update the discovery count for the scout
            await db
              .update(schema.cityInfluencerScouts)
              .set({
                discoveryCount: sql`${schema.cityInfluencerScouts.discoveryCount} + 1`,
              })
              .where(eq(schema.cityInfluencerScouts.id, scoutId));
          }
        }
      }
    } catch (error) {
      console.error(`Error running city influencer discovery for scout ID ${scoutId}:`, error);
    }
  }

  /**
   * Simulate discovering an athlete on social media
   * In production, this would use real social media API data
   */
  private async simulateAthleteDiscovery(scout: typeof schema.socialMediaScouts.$inferSelect) {
    try {
      // First names and last names for simulation
      const firstNames = ["Michael", "James", "John", "Robert", "David", "William", "Mary", "Patricia", "Jennifer", "Linda", "Elizabeth", "Sarah"];
      const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Miller", "Davis", "Garcia", "Rodriguez", "Wilson", "Martinez", "Anderson"];

      // Generate a random athlete name
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const fullName = `${firstName} ${lastName}`;
      const username = `${firstName.toLowerCase()}${lastName.toLowerCase()}${Math.floor(Math.random() * 1000)}`;

      // Determine platform
      const platforms = scout.platformsToSearch.length > 0 
        ? scout.platformsToSearch 
        : ["instagram", "tiktok", "twitter"];
      const platform = platforms[Math.floor(Math.random() * platforms.length)];

      // Generate random sports focus from scout config or defaults
      const sports = scout.sportFocus.length > 0 
        ? scout.sportFocus 
        : ["basketball", "football", "soccer", "volleyball", "track"];
      
      // Pick 1-2 sports for this athlete
      const athleteSports = [];
      athleteSports.push(sports[Math.floor(Math.random() * sports.length)]);
      if (Math.random() > 0.7 && sports.length > 1) {
        let secondSport;
        do {
          secondSport = sports[Math.floor(Math.random() * sports.length)];
        } while (secondSport === athleteSports[0]);
        athleteSports.push(secondSport);
      }

      // Generate positions based on the sport
      const positions = [];
      for (const sport of athleteSports) {
        if (sport === "basketball") {
          positions.push(["PG", "SG", "SF", "PF", "C"][Math.floor(Math.random() * 5)]);
        } else if (sport === "football") {
          positions.push(["QB", "RB", "WR", "TE", "OL", "DL", "LB", "CB", "S"][Math.floor(Math.random() * 9)]);
        } else if (sport === "soccer") {
          positions.push(["Forward", "Midfielder", "Defender", "Goalkeeper"][Math.floor(Math.random() * 4)]);
        } else if (sport === "volleyball") {
          positions.push(["Outside Hitter", "Middle Blocker", "Setter", "Libero"][Math.floor(Math.random() * 4)]);
        } else {
          positions.push(["Sprinter", "Distance", "Jumper", "Thrower"][Math.floor(Math.random() * 4)]);
        }
      }

      // Graduation year
      const currentYear = new Date().getFullYear();
      const gradYear = currentYear + Math.floor(Math.random() * 4) + 1;

      // Create the discovery using Drizzle ORM to avoid parameter binding issues
      const [result] = await db.insert(schema.athleteDiscoveries).values({
        scoutId: scout.id,
        fullName: fullName,
        username: username,
        platform: platform,
        profileUrl: `https://www.${platform}.com/${username}`,
        estimatedAge: Math.floor(Math.random() * (scout.ageRangeMax - scout.ageRangeMin + 1)) + scout.ageRangeMin,
        sports: athleteSports,
        positions: positions,
        followerCount: Math.floor(Math.random() * 10000) + 500,
        postCount: Math.floor(Math.random() * 100) + 10,
        graduationYear: gradYear,
        potentialRating: Math.floor(Math.random() * 5) + 1,
        email: `${username}@example.com`,
        discoveredAt: new Date()
      }).returning();

      // Return the result directly
      return result;
    } catch (error) {
      console.error("Error creating simulated athlete discovery:", error);
      return null;
    }
  }

  /**
   * Simulate discovering a media partner
   * In production, this would use real APIs
   */
  private async simulateMediaPartnerDiscovery(scout: typeof schema.mediaPartnershipScouts.$inferSelect) {
    try {
      // Media outlet names - podcasts, Instagram pages, etc.
      const prefixes = ["The", "All", "Inside", "Beyond", "Next", "Elite", "Pro", "Champion", "Future", "Game Day"];
      const sports = scout.sportFocus.length > 0 
        ? scout.sportFocus 
        : ["Basketball", "Football", "Soccer", "Sports", "Athletics"];
      const suffixes = ["Talk", "Zone", "Nation", "Insider", "Report", "Network", "Hub", "Channel", "Central", "Focus", "Daily", "Weekly", "Podcast"];
      
      const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
      const sport = sports[Math.floor(Math.random() * sports.length)];
      const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
      
      const name = `${prefix} ${sport} ${suffix}`;
      
      // Determine media type
      const mediaTypes = scout.mediaTypes.length > 0 
        ? scout.mediaTypes 
        : ["podcast", "instagram", "youtube", "tiktok"];
      const platform = mediaTypes[Math.floor(Math.random() * mediaTypes.length)];
      
      // Determine URL based on platform
      let url = "";
      if (platform === "podcast") {
        url = `https://podcasts.apple.com/us/podcast/${name.toLowerCase().replace(/ /g, "-")}`;
      } else {
        url = `https://www.${platform}.com/${name.toLowerCase().replace(/ /g, "")}`;
      }
      
      // Follower count that meets threshold
      const followerCount = Math.floor(Math.random() * 90000) + scout.followerThreshold;
      
      // Random engagement rate between 1% and 15%
      const engagementRate = (Math.random() * 14 + 1) / 100;
      
      // Generate AI-rated scores
      const contentQuality = Math.floor(Math.random() * 31) + 70; // 70-100
      const relevanceScore = Math.floor(Math.random() * 31) + 70; // 70-100
      const partnershipPotential = Math.floor(Math.random() * 31) + 70; // 70-100
      
      // Use Drizzle ORM to avoid parameter binding issues
      const [result] = await db.insert(schema.mediaPartnerDiscoveries).values({
        scoutId: scout.id,
        name: name,
        platform: platform,
        url: url,
        followerCount: followerCount,
        averageEngagement: engagementRate,
        sports: scout.sportFocus?.length > 0 ? scout.sportFocus : [sport],
        contentQuality: contentQuality,
        relevanceScore: relevanceScore,
        partnershipPotential: partnershipPotential,
        discoveredAt: new Date()
      }).returning();

      // Return the result directly
      return result;
    } catch (error) {
      console.error("Error creating simulated media partner discovery:", error);
      return null;
    }
  }

  /**
   * Simulate discovering a city influencer
   * In production, this would use real APIs with location filtering
   */
  private async simulateCityInfluencerDiscovery(
    scout: typeof schema.cityInfluencerScouts.$inferSelect,
    rank: number
  ) {
    try {
      // First names and last names for simulation
      const firstNames = ["Michael", "James", "John", "Robert", "David", "William", "Mary", "Patricia", "Jennifer", "Linda", "Elizabeth", "Sarah"];
      const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Miller", "Davis", "Garcia", "Rodriguez", "Wilson", "Martinez", "Anderson"];

      // Generate a random influencer name
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const fullName = `${firstName} ${lastName}`;
      
      // Username variations
      const usernameOptions = [
        `${firstName.toLowerCase()}${lastName.toLowerCase()}`,
        `${firstName.toLowerCase()}_${lastName.toLowerCase()}`,
        `${scout.city.toLowerCase()}${firstName.charAt(0).toLowerCase()}${lastName.toLowerCase()}`,
        `${firstName.toLowerCase()}${lastName.toLowerCase()}_${scout.city.toLowerCase()}`,
        `the_real_${firstName.toLowerCase()}${lastName.charAt(0).toLowerCase()}`
      ];
      const username = `${usernameOptions[Math.floor(Math.random() * usernameOptions.length)]}${Math.floor(Math.random() * 100)}`;
      
      // Determine platform
      const platforms = scout.platforms.length > 0 
        ? scout.platforms 
        : ["instagram", "tiktok", "youtube"];
      const platform = platforms[Math.floor(Math.random() * platforms.length)];
      
      // Follower count that meets threshold
      const followerCount = Math.floor(Math.random() * 95000) + scout.minFollowers;
      
      // Random engagement rate between 2% and 20%
      const engagementRate = (Math.random() * 18 + 2) / 100;
      
      // Generate sports focused on
      const sports = scout.sportFocus.length > 0 
        ? scout.sportFocus 
        : ["basketball", "football", "soccer"];
      
      // Local score - how connected they are to the area (70-100)
      const localityScore = Math.floor(Math.random() * 31) + 70;
      
      // Create the city influencer discovery
      const [discovery] = await db
        .insert(schema.cityInfluencerDiscoveries)
        .values({
          scoutId: scout.id,
          name: fullName,
          username,
          platform,
          url: `https://www.${platform}.com/${username}`,
          followerCount,
          engagementRate,
          sports,
          localityScore,
          influenceRank: rank, // Rank within the city's top influencers
          bio: `${sports[0].charAt(0).toUpperCase() + sports[0].slice(1)} enthusiast and content creator from ${scout.city}, ${scout.state}. Bringing you the best local sports coverage!`,
          // Add more fields as needed
        })
        .returning();

      return discovery;
    } catch (error) {
      console.error("Error creating simulated city influencer discovery:", error);
      return null;
    }
  }

  /**
   * Get all discovered athletes from a specific scout
   */
  async getAthleteDiscoveries(scoutId: number) {
    return db
      .select()
      .from(schema.athleteDiscoveries)
      .where(eq(schema.athleteDiscoveries.scoutId, scoutId))
      .orderBy(desc(schema.athleteDiscoveries.discoveredAt));
  }

  /**
   * Get all discovered media partners from a specific scout
   */
  async getMediaPartnerDiscoveries(scoutId: number) {
    return db
      .select()
      .from(schema.mediaPartnerDiscoveries)
      .where(eq(schema.mediaPartnerDiscoveries.scoutId, scoutId))
      .orderBy(desc(schema.mediaPartnerDiscoveries.discoveredAt));
  }

  /**
   * Get all discovered city influencers from a specific scout
   */
  async getCityInfluencerDiscoveries(scoutId: number) {
    return db
      .select()
      .from(schema.cityInfluencerDiscoveries)
      .where(eq(schema.cityInfluencerDiscoveries.scoutId, scoutId))
      .orderBy(schema.cityInfluencerDiscoveries.influenceRank);
  }

  /**
   * Generate a social media audit for an athlete
   */
  async generateSocialMediaAudit(userId: number, reportGeneratedBy: number) {
    try {
      // In a production app, we would fetch real social media data
      // For now, we'll simulate an audit based on randomized data with weighted patterns
      
      // Generate the audit data
      const platforms = ["instagram", "twitter", "tiktok", "facebook", "youtube"];
      const randomPlatforms = [];
      for (let i = 0; i < Math.floor(Math.random() * 3) + 2; i++) {
        const platform = platforms[Math.floor(Math.random() * platforms.length)];
        if (!randomPlatforms.includes(platform)) {
          randomPlatforms.push(platform);
        }
      }
      
      // Calculate scores
      const overallScore = Math.floor(Math.random() * 50) + 50; // 50-99
      
      // Generate some red flags
      const redFlagCount = Math.floor(Math.random() * 5);
      const redFlagItems = [];
      const redFlagTypes = [
        "Inappropriate language",
        "Political commentary",
        "Controversial posts",
        "Unprofessional content",
        "Inconsistent messaging",
        "Negative comments about coaches/teammates"
      ];
      
      for (let i = 0; i < redFlagCount; i++) {
        redFlagItems.push({
          type: redFlagTypes[Math.floor(Math.random() * redFlagTypes.length)],
          count: Math.floor(Math.random() * 5) + 1,
          impact: Math.floor(Math.random() * 3) + 1, // 1-3 severity
          examples: [`Example post from ${randomPlatforms[0]}: "Lorem ipsum dolor sit amet..."`]
        });
      }
      
      // Generate improvement suggestions
      const suggestionsList = [
        "Highlight more of your community service involvement",
        "Increase posting frequency about your training regimen",
        "Share more content about your academic achievements",
        "Consider creating a dedicated athlete page separate from personal account",
        "Add more team-focused content rather than individual highlights",
        "Engage more with college programs you're interested in",
        "Showcase your versatility across different positions/skills",
        "Remove or archive posts containing controversial language or topics",
        "Maintain consistency in the type of content you share"
      ];
      
      const improvementSuggestions = [];
      const suggestionCount = Math.floor(Math.random() * 4) + 2; // 2-5 suggestions
      
      for (let i = 0; i < suggestionCount; i++) {
        const suggestion = suggestionsList[Math.floor(Math.random() * suggestionsList.length)];
        if (!improvementSuggestions.includes(suggestion)) {
          improvementSuggestions.push(suggestion);
        }
      }
      
      // Calculate recruitment impact
      const recruitmentImpactScore = Math.max(30, overallScore - (redFlagCount * 5));
      
      // Create the audit record
      const [audit] = await db
        .insert(schema.socialMediaAudits)
        .values({
          userId,
          overallScore,
          platformsAnalyzed: randomPlatforms,
          contentAnalysis: {
            postFrequency: `${Math.floor(Math.random() * 5) + 1} posts per week`,
            engagement: `${Math.floor(Math.random() * 15) + 5}% average engagement rate`,
            contentTypes: {
              athletic: Math.floor(Math.random() * 40) + 60,
              personal: Math.floor(Math.random() * 30) + 10,
              academic: Math.floor(Math.random() * 20) + 5,
              other: Math.floor(Math.random() * 10) + 5
            }
          },
          redFlagCount,
          redFlagItems,
          improvementSuggestions,
          positiveHighlights: {
            strengths: [
              "Strong presence of athletic achievements",
              "Good engagement with followers",
              "Consistent posting schedule",
              `Excellent ${randomPlatforms[0]} presence`
            ],
            topPosts: [
              {
                platform: randomPlatforms[0],
                engagement: Math.floor(Math.random() * 500) + 500,
                description: "Game-winning highlight video"
              },
              {
                platform: randomPlatforms[1] || randomPlatforms[0],
                engagement: Math.floor(Math.random() * 300) + 300,
                description: "Training session with coach"
              }
            ]
          },
          recruitmentImpactScore,
          reportGeneratedBy,
          sharedWithUser: false,
          userAcknowledged: false
        })
        .returning();
      
      return audit;
    } catch (error) {
      console.error("Error generating social media audit:", error);
      return null;
    }
  }
}

// Create and export the singleton instance
export const athleteScoutService = new AthleteScoutService();