import { db } from "../db";
import { eq, and, desc, sql } from "drizzle-orm";
import OpenAI from "openai";
import * as schema from "@shared/schema";

// Ensure we have an OpenAI API key
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface TransferPortalMonitorOptions {
  sport?: string;
  sportType?: string;
  divisions?: string[];
  conferences?: string[];
  monitorType?: string;
  updateFrequency?: number;
  positionGroups?: string[];
}

class TransferPortalService {
  private updateIntervals: { [key: number]: NodeJS.Timeout } = {};

  constructor() {
    console.log("Transfer Portal Service initialized");
  }

  async initialize() {
    try {
      // Load all active transfer portal monitors and start their update cycles
      const activeMonitors = await db
        .select()
        .from(schema.transferPortalMonitors)
        .where(eq(schema.transferPortalMonitors.active, true));

      for (const monitor of activeMonitors) {
        this.startMonitorUpdateCycle(monitor);
      }

      console.log(`Started ${activeMonitors.length} transfer portal monitors`);
      return true;
    } catch (error) {
      console.error("Failed to initialize transfer portal service:", error);
      return false;
    }
  }

  /**
   * Create a new transfer portal monitor
   */
  async createMonitor(
    name: string,
    description: string,
    sportType: string,
    monitorType: string,
    createdBy: number,
    options: TransferPortalMonitorOptions = {}
  ) {
    try {
      const [newMonitor] = await db
        .insert(schema.transferPortalMonitors)
        .values({
          name,
          description,
          active: true,
          sport: options.sport || sportType, // Set sport field with sportType as fallback
          sportType,
          monitorType,
          createdBy,
          divisions: options.divisions || [],
          conferences: options.conferences || [],
          updateFrequency: options.updateFrequency || 360, // Default 6 minutes
          positionGroups: options.positionGroups || [],
        })
        .returning();

      if (newMonitor) {
        this.startMonitorUpdateCycle(newMonitor);
        return newMonitor;
      }
      return null;
    } catch (error) {
      console.error("Failed to create transfer portal monitor:", error);
      return null;
    }
  }

  /**
   * Start the update cycle for a monitor based on its update frequency
   */
  private startMonitorUpdateCycle(monitor: typeof schema.transferPortalMonitors.$inferSelect) {
    // Clear any existing interval for this monitor
    if (this.updateIntervals[monitor.id]) {
      clearInterval(this.updateIntervals[monitor.id]);
    }

    // Set the interval for updates
    this.updateIntervals[monitor.id] = setInterval(
      () => this.runMonitorUpdate(monitor.id),
      monitor.updateFrequency * 1000 // Convert seconds to milliseconds
    );

    // Run immediately on startup
    this.runMonitorUpdate(monitor.id);
  }

  /**
   * Run an update cycle for a specific monitor
   */
  async runMonitorUpdate(monitorId: number) {
    try {
      // Get the monitor
      const [monitor] = await db
        .select()
        .from(schema.transferPortalMonitors)
        .where(eq(schema.transferPortalMonitors.id, monitorId));

      if (!monitor || !monitor.active) {
        // If the monitor is no longer active, clear its interval
        if (this.updateIntervals[monitorId]) {
          clearInterval(this.updateIntervals[monitorId]);
          delete this.updateIntervals[monitorId];
        }
        return;
      }

      // Update the last run timestamp
      await db
        .update(schema.transferPortalMonitors)
        .set({ lastRunAt: new Date() })
        .where(eq(schema.transferPortalMonitors.id, monitorId));

      // Perform the appropriate update based on monitor type
      switch (monitor.monitorType) {
        case "roster-changes":
          await this.updateTeamRosters(monitor);
          break;
        case "player-portal-entries":
          await this.updatePortalEntries(monitor);
          break;
        case "commitment-flips":
          await this.updateCommitmentFlips(monitor);
          break;
        default:
          console.warn(`Unknown monitor type: ${monitor.monitorType}`);
      }
    } catch (error) {
      console.error(`Error running monitor update for ID ${monitorId}:`, error);
    }
  }

  /**
   * Update team rosters for the specified monitor
   */
  private async updateTeamRosters(monitor: typeof schema.transferPortalMonitors.$inferSelect) {
    // Get all NCAA team rosters for this sport and configured divisions/conferences
    const teamRosters = await db
      .select()
      .from(schema.ncaaTeamRosters)
      .where(
        and(
          eq(schema.ncaaTeamRosters.sport, monitor.sportType),
          // Add more filters based on divisions and conferences if needed
        )
      );

    // Process each team roster to check for changes
    for (const roster of teamRosters) {
      // Here we would integrate with an NCAA data source API
      // For now, we'll simulate the analysis

      // Random status for demonstration - in production this would come from real data analysis
      const statusOptions = ["normal", "low", "overstocked"];
      const newStatus = statusOptions[Math.floor(Math.random() * statusOptions.length)];

      // Update the roster status if it's changed
      if (roster.rosterStatus !== newStatus) {
        await db
          .update(schema.ncaaTeamRosters)
          .set({
            rosterStatus: newStatus,
            lastUpdated: new Date(),
          })
          .where(eq(schema.ncaaTeamRosters.id, roster.id));

        // Generate alerts for coaches if status is concerning and notify setting is on
        if ((newStatus === "low" || newStatus === "overstocked") && monitor.notifyCoaches) {
          this.createRosterAlert(roster, newStatus);
        }
      }
    }
  }

  /**
   * Handle new players entering the transfer portal
   */
  private async updatePortalEntries(monitor: typeof schema.transferPortalMonitors.$inferSelect) {
    // In production, this would connect to NCAA transfer portal data
    // For now, we'll simulate periodically adding new players

    // Check if we should simulate a new entry (random chance)
    if (Math.random() > 0.7) {
      // Create a simulated new player entry
      const newPlayer = await this.createSimulatedPortalEntry(monitor.sportType);

      if (newPlayer) {
        // Update the transfer count for the monitor
        await db
          .update(schema.transferPortalMonitors)
          .set({
            transferCount: sql`${schema.transferPortalMonitors.transferCount} + 1`,
          })
          .where(eq(schema.transferPortalMonitors.id, monitor.id));

        // Generate AI-powered best fit schools
        await this.generateBestFitSchools(newPlayer.id);
      }
    }
  }

  /**
   * Handle tracking commitment flips
   */
  private async updateCommitmentFlips(monitor: typeof schema.transferPortalMonitors.$inferSelect) {
    // Get portal entries with commitments
    const committedPlayers = await db
      .select()
      .from(schema.transferPortalEntries)
      .where(
        and(
          eq(schema.transferPortalEntries.sport, monitor.sportType),
          eq(schema.transferPortalEntries.portalStatus, "committed")
        )
      );

    // Simulate monitoring for commitment flips (in production, this would use real data)
    for (const player of committedPlayers) {
      // Random chance of a commitment flip for demo purposes
      if (Math.random() > 0.95) {
        // Update the player commitment
        const schools = ["Florida State", "Michigan", "USC", "Georgia", "Ohio State", "Alabama"];
        const newSchool = schools[Math.floor(Math.random() * schools.length)];

        if (player.committedTo !== newSchool) {
          await db
            .update(schema.transferPortalEntries)
            .set({
              committedTo: newSchool,
              commitDate: new Date(),
            })
            .where(eq(schema.transferPortalEntries.id, player.id));

          // Notify relevant coaches about the flip
          this.createCommitmentFlipAlert(player, newSchool);
        }
      }
    }
  }

  /**
   * Create a simulated player entry into the transfer portal
   * In production, this would be replaced with real data from NCAA API
   */
  private async createSimulatedPortalEntry(sportType: string) {
    try {
      // Get first names and last names for simulation
      const firstNames = ["Michael", "James", "John", "Robert", "David", "William", "Mary", "Patricia", "Jennifer", "Linda", "Elizabeth", "Sarah"];
      const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Miller", "Davis", "Garcia", "Rodriguez", "Wilson", "Martinez", "Anderson"];

      // Generate a random player name
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const playerName = `${firstName} ${lastName}`;

      // Schools for simulation
      const schools = ["Alabama", "Clemson", "Ohio State", "LSU", "Georgia", "Oklahoma", "Notre Dame", "Michigan", "Texas", "Florida", "Auburn", "Oregon"];
      const previousSchool = schools[Math.floor(Math.random() * schools.length)];

      // Positions based on sport
      let positions: string[] = [];
      if (sportType === "football") {
        positions = ["QB", "RB", "WR", "TE", "OL", "DL", "LB", "CB", "S", "K", "P"];
      } else if (sportType === "basketball") {
        positions = ["PG", "SG", "SF", "PF", "C"];
      } else {
        positions = ["Attacker", "Midfielder", "Defender", "Goalkeeper"];
      }
      const position = positions[Math.floor(Math.random() * positions.length)];

      // Create the player entry
      const [playerEntry] = await db
        .insert(schema.transferPortalEntries)
        .values({
          playerName,
          previousSchool,
          sport: sportType,
          position,
          eligibilityRemaining: `${Math.floor(Math.random() * 4) + 1} years`,
          height: `${Math.floor(Math.random() * 12) + 66} inches`, // 5'6" to 6'6"
          weight: `${Math.floor(Math.random() * 100) + 160} lbs`,
          starRating: Math.floor(Math.random() * 5) + 1,
          portalEntryDate: new Date(),
          portalStatus: "active",
          // Add more fields as needed
        })
        .returning();

      return playerEntry;
    } catch (error) {
      console.error("Error creating simulated player entry:", error);
      return null;
    }
  }

  /**
   * Use OpenAI to generate the best fit schools for a player in the portal
   */
  private async generateBestFitSchools(playerId: number) {
    try {
      // Get the player
      const [player] = await db
        .select()
        .from(schema.transferPortalEntries)
        .where(eq(schema.transferPortalEntries.id, playerId));

      if (!player) return;

      // Get roster needs from various schools
      const schoolRosters = await db
        .select()
        .from(schema.ncaaTeamRosters)
        .where(eq(schema.ncaaTeamRosters.sport, player.sport))
        .limit(20);

      // Prepare data for AI analysis
      const playerData = {
        name: player.playerName,
        previousSchool: player.previousSchool,
        position: player.position,
        height: player.height,
        weight: player.weight,
        starRating: player.starRating,
        eligibilityRemaining: player.eligibilityRemaining,
      };

      const schoolData = schoolRosters.map(s => ({
        name: s.school,
        conference: s.conference,
        division: s.division,
        rosterStatus: s.rosterStatus,
        positionNeeds: s.positionNeeds,
      }));

      // Call OpenAI to analyze the best fit
      // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are an expert NCAA recruiting analyst. Based on the player data and school rosters provided, determine the top 5 best fitting schools for this transfer portal player. Focus on position needs, playing time opportunity, scheme fit, and geographic considerations. Return your analysis in JSON format with the following structure:
            {
              "bestFitSchools": ["School1", "School2", "School3", "School4", "School5"],
              "fitReasons": {
                "School1": "Detailed explanation of why this school is a good fit",
                "School2": "Detailed explanation of why this school is a good fit",
                ...
              },
              "transferRating": 85 // A number from 1-100 indicating the impact this player could have on their new team
            }`
          },
          {
            role: "user",
            content: JSON.stringify({
              player: playerData,
              schools: schoolData,
            })
          }
        ],
        response_format: { type: "json_object" }
      });

      const result = JSON.parse(response.choices[0].message.content);

      // Update the player entry with the AI recommendations
      await db
        .update(schema.transferPortalEntries)
        .set({
          bestFitSchools: result.bestFitSchools,
          fitReasons: result.fitReasons,
          transferRating: result.transferRating,
        })
        .where(eq(schema.transferPortalEntries.id, playerId));

      return result;
    } catch (error) {
      console.error("Error generating best fit schools with AI:", error);
      return null;
    }
  }

  /**
   * Create an alert for roster status changes
   */
  private async createRosterAlert(
    roster: typeof schema.ncaaTeamRosters.$inferSelect,
    newStatus: string
  ) {
    console.log(`ALERT: ${roster.school} roster status changed to ${newStatus}`);
    // In a full implementation, this would:
    // 1. Create a database entry in an alerts table
    // 2. Send notifications to relevant coaches
    // 3. Update the dashboard with the alert
  }

  /**
   * Create an alert for commitment flips
   */
  private async createCommitmentFlipAlert(
    player: typeof schema.transferPortalEntries.$inferSelect,
    newSchool: string
  ) {
    console.log(
      `COMMITMENT FLIP ALERT: ${player.playerName} flipped from ${player.committedTo} to ${newSchool}`
    );
    // In a full implementation, this would:
    // 1. Create a database entry in an alerts table
    // 2. Send notifications to relevant coaches
    // 3. Update the dashboard with the alert
  }
}

// Create and export the singleton instance
export const transferPortalService = new TransferPortalService();