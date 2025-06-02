/**
 * Ranking Service
 * 
 * Handles athlete ranking calculations for Hot 100 list and other ranking metrics.
 * This service will eventually connect to the AI engine hosted on a private VPS.
 */

import { withRetry, logAIEngineActivity, aiEngineClient } from '../utils';
import { AI_ENGINE_CONFIG } from '../config';

export interface AthleteRanking {
  id: string;
  name: string;
  position: string;
  school: string;
  rank: number;
  previousRank?: number;
  rankChange?: number;
  garScore: number;
  scoreChange?: number;
  highlights?: string[];
  stats: Record<string, number | string>;
  trends?: {
    direction: 'up' | 'down' | 'stable';
    magnitude: number;
    reason: string;
  }[];
}

export interface RankingList {
  id: string;
  name: string;
  description: string;
  sport: string;
  ageGroup?: string;
  region?: string;
  totalAthletes: number;
  athletes: AthleteRanking[];
  lastUpdated: Date;
}

export class RankingService {
  /**
   * Get the Hot 100 ranking list for a specific sport
   * 
   * @param sport The sport (basketball, football, etc.)
   * @param ageGroup Optional age group filter
   * @param region Optional region filter
   * @param limit Optional limit on number of results (default 100)
   */
  async getHot100Rankings(
    sport: string,
    ageGroup?: string,
    region?: string,
    limit: number = 100
  ): Promise<RankingList | null> {
    try {
      logAIEngineActivity('getHot100Rankings', { sport, ageGroup, region, limit });
      
      if (AI_ENGINE_CONFIG.useMockData) {
        // For development, return mock data
        // TODO: Connect to AI Engine when available
        return this.getMockRankingList(sport, 'Hot 100', limit);
      }
      
      // This is the actual implementation that will be used when the AI Engine is available
      return await withRetry(async () => {
        const response = await aiEngineClient.get(
          `${AI_ENGINE_CONFIG.endpoints.rankings}/hot100`,
          {
            params: { sport, ageGroup, region, limit }
          }
        );
        
        return response.data as RankingList;
      });
    } catch (error) {
      logAIEngineActivity('getHot100Rankings', { sport, ageGroup, region }, null, error as Error);
      console.error('Error getting Hot 100 rankings:', error);
      return null;
    }
  }
  
  /**
   * Get rankings for a specific athlete
   * 
   * @param athleteId The ID of the athlete
   */
  async getAthleteRankings(athleteId: string): Promise<AthleteRanking | null> {
    try {
      logAIEngineActivity('getAthleteRankings', { athleteId });
      
      if (AI_ENGINE_CONFIG.useMockData) {
        // For development, return mock data
        // TODO: Connect to AI Engine when available
        return this.getMockAthleteRanking(athleteId);
      }
      
      // This is the actual implementation that will be used when the AI Engine is available
      return await withRetry(async () => {
        const response = await aiEngineClient.get(
          `${AI_ENGINE_CONFIG.endpoints.rankings}/athlete/${athleteId}`
        );
        
        return response.data as AthleteRanking;
      });
    } catch (error) {
      logAIEngineActivity('getAthleteRankings', { athleteId }, null, error as Error);
      console.error('Error getting athlete rankings:', error);
      return null;
    }
  }
  
  /**
   * Update rankings based on new performance data
   * This would typically be called after new videos are analyzed
   * 
   * @param sport The sport to update rankings for
   */
  async updateRankings(sport: string): Promise<boolean> {
    try {
      logAIEngineActivity('updateRankings', { sport });
      
      if (AI_ENGINE_CONFIG.useMockData) {
        // For development, just return success
        // TODO: Connect to AI Engine when available
        return true;
      }
      
      // This is the actual implementation that will be used when the AI Engine is available
      return await withRetry(async () => {
        const response = await aiEngineClient.post(
          `${AI_ENGINE_CONFIG.endpoints.rankings}/update`,
          { sport }
        );
        
        return response.data.success;
      });
    } catch (error) {
      logAIEngineActivity('updateRankings', { sport }, null, error as Error);
      console.error('Error updating rankings:', error);
      return false;
    }
  }
  
  /**
   * For development only - get mock ranking list
   * This will be replaced by the actual AI Engine integration
   */
  private getMockRankingList(sport: string, listName: string, limit: number): RankingList {
    // Generate deterministic but realistic-looking sample data
    const athletes: AthleteRanking[] = [];
    
    const positions = this.getSportPositions(sport);
    const schoolPrefix = sport === 'basketball' ? 'BK' : 
                        sport === 'football' ? 'FB' : 
                        sport === 'baseball' ? 'BB' : 'HS';
    
    for (let i = 0; i < limit; i++) {
      const seedModifier = i + (sport.length % 10);
      const previousRank = i + 1 + ((seedModifier % 7) - 3);
      const rankChange = (i + 1) - previousRank;
      
      const stats: Record<string, number | string> = {};
      if (sport === 'basketball') {
        stats.ppg = Math.round(10 + (seedModifier % 15) + Math.random() * 5);
        stats.rpg = Math.round(2 + (seedModifier % 10) + Math.random() * 3);
        stats.apg = Math.round(1 + (seedModifier % 8) + Math.random() * 2);
      } else if (sport === 'football') {
        stats.yards = Math.round(500 + (seedModifier % 1000) + Math.random() * 500);
        stats.tds = Math.round(3 + (seedModifier % 20) + Math.random() * 10);
        stats.completions = `${Math.round(50 + (seedModifier % 100) + Math.random() * 50)}%`;
      }
      
      athletes.push(this.getMockAthleteRanking(`athlete_${sport}_${i + 1}`, i + 1, positions, schoolPrefix, previousRank));
    }
    
    return {
      id: `ranking_${sport}_${listName.replace(/\s+/g, '_').toLowerCase()}`,
      name: `${listName} - ${sport.charAt(0).toUpperCase() + sport.slice(1)}`,
      description: `Top ${limit} athletes in ${sport}`,
      sport,
      totalAthletes: athletes.length,
      athletes,
      lastUpdated: new Date()
    };
  }
  
  /**
   * For development only - get mock athlete ranking
   * This will be replaced by the actual AI Engine integration
   */
  private getMockAthleteRanking(
    id: string, 
    rank: number = 1, 
    positions?: string[], 
    schoolPrefix: string = 'HS',
    previousRank?: number
  ): AthleteRanking {
    // Generate deterministic but realistic-looking sample data
    const seed = parseInt(id.replace(/\D/g, '') || '1', 10);
    
    const positionList = positions || [
      'PG', 'SG', 'SF', 'PF', 'C'
    ];
    
    const garScore = 7.5 + ((seed % 25) / 10);
    const scoreChange = ((seed % 7) - 3) / 10;
    
    const position = positionList[seed % positionList.length];
    const realPreviousRank = previousRank || (rank + ((seed % 7) - 3));
    const rankChange = rank - realPreviousRank;
    
    const highlights = [
      'Exceptional court vision',
      'Elite shooting form',
      'Defensive intensity',
      'Leadership qualities',
      'Basketball IQ'
    ];
    
    // Stats depend on the position
    const stats: Record<string, number | string> = {
      games: 15 + (seed % 10),
      minutes: (28 + (seed % 8)) + ' mpg'
    };
    
    if (position === 'PG' || position === 'SG') {
      stats.points = (14 + (seed % 12)) + ' ppg';
      stats.assists = (4 + (seed % 8)) + ' apg';
      stats.steals = (1 + (seed % 3)) + ' spg';
    } else if (position === 'SF' || position === 'PF') {
      stats.points = (12 + (seed % 10)) + ' ppg';
      stats.rebounds = (6 + (seed % 6)) + ' rpg';
      stats.blocks = (0.5 + (seed % 2)) + ' bpg';
    } else {
      stats.points = (10 + (seed % 8)) + ' ppg';
      stats.rebounds = (8 + (seed % 6)) + ' rpg';
      stats.blocks = (1.5 + (seed % 3)) + ' bpg';
    }
    
    // Generate a trend based on the rank change
    const trends = [];
    if (rankChange > 0) {
      trends.push({
        direction: 'up' as const,
        magnitude: rankChange,
        reason: 'Strong recent performance'
      });
    } else if (rankChange < 0) {
      trends.push({
        direction: 'down' as const,
        magnitude: Math.abs(rankChange),
        reason: 'Inconsistent recent results'
      });
    } else {
      trends.push({
        direction: 'stable' as const,
        magnitude: 0,
        reason: 'Maintaining performance level'
      });
    }
    
    return {
      id,
      name: `Athlete ${seed}`,
      position,
      school: `${schoolPrefix} High School ${(seed % 100) + 1}`,
      rank,
      previousRank: realPreviousRank,
      rankChange,
      garScore,
      scoreChange,
      highlights: [highlights[seed % highlights.length]],
      stats,
      trends
    };
  }
  
  /**
   * Helper method to get sport-specific positions
   */
  private getSportPositions(sport: string): string[] {
    switch (sport.toLowerCase()) {
      case 'basketball':
        return ['PG', 'SG', 'SF', 'PF', 'C'];
      case 'football':
        return ['QB', 'RB', 'WR', 'TE', 'OL', 'DL', 'LB', 'CB', 'S'];
      case 'baseball':
        return ['P', 'C', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF'];
      case 'soccer':
        return ['GK', 'DEF', 'MID', 'FWD'];
      default:
        return ['Player'];
    }
  }
}