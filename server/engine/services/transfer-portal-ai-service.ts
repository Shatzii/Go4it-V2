/**
 * Transfer Portal AI Service
 * 
 * Handles AI-powered analysis for the transfer portal, including best fit schools,
 * player evaluations, and recruitment recommendations.
 * This service will eventually connect to the AI engine hosted on a private VPS.
 */

import { withRetry, logAIEngineActivity, aiEngineClient } from '../utils';
import { AI_ENGINE_CONFIG, EXTERNAL_MODEL_CONFIG } from '../config';

export interface PlayerData {
  id: number;
  name: string;
  previousSchool?: string;
  position?: string;
  height?: string;
  weight?: string;
  starRating?: number;
  eligibilityRemaining?: string;
  hometown?: string;
  highSchool?: string;
  sport?: string;
}

export interface SchoolData {
  name: string;
  conference?: string;
  division?: string;
  rosterStatus?: string;
  positionNeeds?: string[];
}

export interface BestFitResult {
  bestFitSchools: string[];
  fitReasons: Record<string, string>;
  transferRating: number;
}

export class TransferPortalAIService {
  /**
   * Generate the best fit schools for a player in the transfer portal
   * 
   * @param player The player data
   * @param schools The school roster data
   */
  async generateBestFitSchools(player: PlayerData, schools: SchoolData[]): Promise<BestFitResult | null> {
    try {
      logAIEngineActivity('generateBestFitSchools', { playerId: player.id });
      
      if (AI_ENGINE_CONFIG.useMockData) {
        // For development, return mock data
        // TODO: Connect to AI Engine when available
        return this.getMockBestFitResult(player, schools);
      }
      
      // This is the actual implementation that will be used when the AI Engine is available
      return await withRetry(async () => {
        const response = await aiEngineClient.post(
          `${AI_ENGINE_CONFIG.endpoints.transferPortal}/best-fit`,
          {
            player,
            schools,
            modelVersion: AI_ENGINE_CONFIG.models.transferPortal
          }
        );
        
        return response.data as BestFitResult;
      });
    } catch (error) {
      logAIEngineActivity('generateBestFitSchools', { playerId: player.id }, null, error as Error);
      console.error('Error generating best fit schools:', error);
      return null;
    }
  }
  
  /**
   * Analyze a player's potential impact at a specific school
   * 
   * @param player The player data
   * @param school The school data
   */
  async analyzePlayerSchoolFit(player: PlayerData, school: SchoolData): Promise<{
    fitScore: number;
    impactRating: number;
    playingTimeProjection: string;
    analysisDetails: string;
  } | null> {
    try {
      logAIEngineActivity('analyzePlayerSchoolFit', { playerId: player.id, school: school.name });
      
      if (AI_ENGINE_CONFIG.useMockData) {
        // For development, return mock data
        // TODO: Connect to AI Engine when available
        return this.getMockPlayerSchoolFit(player, school);
      }
      
      // This is the actual implementation that will be used when the AI Engine is available
      return await withRetry(async () => {
        const response = await aiEngineClient.post(
          `${AI_ENGINE_CONFIG.endpoints.transferPortal}/analyze-fit`,
          {
            player,
            school,
            modelVersion: AI_ENGINE_CONFIG.models.transferPortal
          }
        );
        
        return response.data;
      });
    } catch (error) {
      logAIEngineActivity('analyzePlayerSchoolFit', { playerId: player.id, school: school.name }, null, error as Error);
      console.error('Error analyzing player-school fit:', error);
      return null;
    }
  }
  
  /**
   * For development only - get mock best fit result
   * This will be replaced by the actual AI Engine integration
   */
  private getMockBestFitResult(player: PlayerData, schools: SchoolData[]): BestFitResult {
    // Seed for deterministic mock data
    const seed = player.id || 1;
    
    // Select a subset of schools as the best fit
    const schoolCount = Math.min(5, schools.length);
    const selectedSchools: string[] = [];
    const fitReasons: Record<string, string> = {};
    
    // Score factors for mock data
    const positionNeedFactor = 0.4;
    const conferencePrestigeFactor = 0.3;
    const geographicFactor = 0.2;
    const rosterStatusFactor = 0.1;
    
    // Scored schools
    const scoredSchools = schools.map(school => {
      // Position need score: Higher if school needs this position
      let positionNeedScore = 0.5; // Default middle score
      if (school.positionNeeds && player.position) {
        positionNeedScore = school.positionNeeds.includes(player.position) ? 1.0 : 0.2;
      }
      
      // Conference prestige score (mock data, would be based on real rankings)
      const conferences = {
        'SEC': 1.0,
        'Big Ten': 0.95,
        'ACC': 0.9,
        'Big 12': 0.85,
        'Pac-12': 0.8
      };
      const conferencePrestigeScore = (school.conference && conferences[school.conference as keyof typeof conferences]) || 0.5;
      
      // Geographic score - simulated based on player hometown and school name
      // In real implementation this would use actual geographic distance
      const geographicScore = ((seed + school.name.length) % 100) / 100;
      
      // Roster status score - better fit if roster is "low" (needs players)
      const rosterStatusScore = school.rosterStatus === 'low' ? 1.0 : 
                                school.rosterStatus === 'normal' ? 0.7 : 0.3;
      
      // Calculate weighted total score
      const totalScore = (positionNeedScore * positionNeedFactor) +
                         (conferencePrestigeScore * conferencePrestigeFactor) +
                         (geographicScore * geographicFactor) +
                         (rosterStatusScore * rosterStatusFactor);
      
      return {
        school: school.name,
        score: totalScore,
        positionNeed: positionNeedScore,
        conferencePrestige: conferencePrestigeScore,
        geographic: geographicScore,
        rosterStatus: rosterStatusScore
      };
    });
    
    // Sort by score and take top schools
    const topSchools = scoredSchools
      .sort((a, b) => b.score - a.score)
      .slice(0, schoolCount);
    
    // Generate best fit schools and reasons
    topSchools.forEach(school => {
      selectedSchools.push(school.school);
      
      // Generate a fit reason based on the dominant factor
      const scores = [
        { name: 'position needs', score: school.positionNeed },
        { name: 'conference prestige', score: school.conferencePrestige },
        { name: 'geographic fit', score: school.geographic },
        { name: 'roster status', score: school.rosterStatus }
      ];
      
      const topFactor = scores.sort((a, b) => b.score - a.score)[0];
      
      switch (topFactor.name) {
        case 'position needs':
          fitReasons[school.school] = `${school.school} has a critical need at ${player.position}, offering immediate playing time and development opportunities.`;
          break;
        case 'conference prestige':
          fitReasons[school.school] = `${school.school}'s conference offers high-level competition and visibility that aligns with ${player.name}'s talent level and career aspirations.`;
          break;
        case 'geographic fit':
          fitReasons[school.school] = `${school.school} provides an ideal geographic location, offering ${player.name} the chance to play closer to home or in a preferred region.`;
          break;
        case 'roster status':
          fitReasons[school.school] = `${school.school}'s current roster situation creates a perfect opportunity for ${player.name} to make an immediate impact.`;
          break;
      }
    });
    
    // Calculate a transfer rating (1-100) based on player star rating and top school fit
    const transferRating = Math.min(100, Math.max(50, 
      70 + ((player.starRating || 3) * 5) + 
      (topSchools.length > 0 ? (topSchools[0].score * 10) : 0)
    ));
    
    return {
      bestFitSchools: selectedSchools,
      fitReasons,
      transferRating: Math.round(transferRating)
    };
  }
  
  /**
   * For development only - get mock player-school fit analysis
   * This will be replaced by the actual AI Engine integration
   */
  private getMockPlayerSchoolFit(player: PlayerData, school: SchoolData) {
    // Seed for deterministic mock data
    const seed = player.id || 1;
    const schoolSeed = school.name.length;
    const combinedSeed = seed + schoolSeed;
    
    // Calculate fit score (0-100)
    const positionFitBase = school.positionNeeds?.includes(player.position || '') ? 90 : 60;
    const positionFit = Math.min(100, Math.max(50, positionFitBase + ((combinedSeed % 20) - 10)));
    
    // Calculate impact rating (0-100)
    const impactBase = (player.starRating || 3) * 15;
    const impact = Math.min(100, Math.max(40, impactBase + ((seed % 30) - 10)));
    
    // Generate playing time projection
    const playingTimeOptions = [
      "Immediate starter",
      "Key rotation player",
      "Situational contributor",
      "Developmental prospect",
      "Special teams contributor",
      "Depth player with upside"
    ];
    const playingTimeIndex = (combinedSeed % playingTimeOptions.length);
    const playingTime = playingTimeOptions[playingTimeIndex];
    
    // Generate detailed analysis
    const analysisTemplates = [
      `${player.name} would fit well in ${school.name}'s system due to their specific needs at ${player.position}. Their physical attributes (${player.height}, ${player.weight}) are ideal for the scheme they run.`,
      `With ${player.eligibilityRemaining} of eligibility remaining, ${player.name} offers ${school.name} good long-term value while addressing immediate roster gaps.`,
      `Coming from ${player.previousSchool}, ${player.name} brings valuable experience that complements ${school.name}'s existing talent at the ${player.position} position.`,
      `${player.name}'s skill set would fill a critical void in ${school.name}'s roster, though competition for playing time will be significant.`,
      `The transition from ${player.previousSchool}'s system to ${school.name}'s approach should be relatively smooth for ${player.name} based on schematic similarities.`
    ];
    const analysisIndex = (combinedSeed % analysisTemplates.length);
    const analysis = analysisTemplates[analysisIndex];
    
    return {
      fitScore: Math.round(positionFit),
      impactRating: Math.round(impact),
      playingTimeProjection: playingTime,
      analysisDetails: analysis
    };
  }
}