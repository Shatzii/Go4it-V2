/**
 * Position Analytics Service
 * 
 * Advanced analytics system that analyzes historical data across generations
 * to identify ideal characteristics and body mechanics for specific sport positions.
 * 
 * This service correlates physical attributes, neurodivergent profiles, 
 * biomechanics, and other factors to identify patterns of success.
 */

import { db } from '../db';
import { IStorage } from '../storage';
import { athleteProfiles, videos, videoAnalysis, 
         athleteBodyMetrics, sportPositions, biomechanicsData,
         neurodivergentProfiles } from '../../shared/schema';
import { eq, and, or, gte, lte, inArray, sql } from 'drizzle-orm';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const GPT_MODEL = "gpt-4o";

export class PositionAnalyticsService {
  private storage: IStorage;

  constructor(storage: IStorage) {
    this.storage = storage;
  }

  /**
   * Get ideal biomechanics for a specific position
   * Analyzes successful athletes across generations
   */
  async getIdealBiomechanics(sportType: string, position: string) {
    try {
      // 1. Get top-rated athletes for this position from all eras
      const topAthletes = await db.select()
        .from(athleteProfiles)
        .where(
          and(
            eq(athleteProfiles.primarySport, sportType),
            eq(athleteProfiles.primaryPosition, position),
            gte(athleteProfiles.overallRating, 85) // Only consider highly-rated athletes
          )
        )
        .limit(100);
      
      if (!topAthletes || topAthletes.length === 0) {
        return { 
          success: false, 
          message: "Insufficient data for position analysis" 
        };
      }

      // 2. Get biomechanics data for these athletes
      const athleteIds = topAthletes.map(athlete => athlete.userId);
      const biomechanics = await db.select()
        .from(biomechanicsData)
        .where(inArray(biomechanicsData.athleteId, athleteIds));

      // 3. Group and analyze biomechanics data by era
      const eraGroups = this.groupAthletesByEra(topAthletes, biomechanics);
      
      // 4. Find common patterns across eras
      const commonPatterns = this.identifyCommonBiomechanics(eraGroups);
      
      // 5. Generate detailed analysis with AI
      const analysis = await this.generateBiomechanicsAnalysis(
        sportType, 
        position, 
        commonPatterns
      );
      
      return {
        success: true,
        position,
        sportType,
        idealBiomechanics: commonPatterns,
        analysis,
        sampleSize: topAthletes.length,
        eras: Object.keys(eraGroups)
      };
    } catch (error) {
      console.error("Error analyzing ideal biomechanics:", error);
      return { 
        success: false, 
        message: "Error analyzing biomechanics data" 
      };
    }
  }

  /**
   * Group athletes and their biomechanics data by era
   */
  private groupAthletesByEra(athletes: any[], biomechanicsData: any[]) {
    const eraGroups: Record<string, any[]> = {
      'pre1980': [],
      '1980s': [],
      '1990s': [],
      '2000s': [],
      '2010s': [],
      'current': []
    };
    
    // Map biomechanics data by athlete ID for quick lookup
    const biomechanicsByAthlete = biomechanicsData.reduce((acc, data) => {
      if (!acc[data.athleteId]) {
        acc[data.athleteId] = [];
      }
      acc[data.athleteId].push(data);
      return acc;
    }, {} as Record<number, any[]>);
    
    // Group athletes by era based on active years
    athletes.forEach(athlete => {
      const era = this.determineEra(athlete.activeYearsStart, athlete.activeYearsEnd);
      const athleteBiomechanics = biomechanicsByAthlete[athlete.userId] || [];
      
      if (era && athleteBiomechanics.length > 0) {
        eraGroups[era].push({
          athlete,
          biomechanics: athleteBiomechanics
        });
      }
    });
    
    return eraGroups;
  }
  
  /**
   * Determine the era based on active years
   */
  private determineEra(startYear: number | null, endYear: number | null): string | null {
    const currentYear = new Date().getFullYear();
    
    // Default to current year if no end year (active athlete)
    const effectiveEndYear = endYear || currentYear;
    
    // Use middle of career to determine era
    const midCareerYear = startYear && effectiveEndYear 
      ? Math.floor((startYear + effectiveEndYear) / 2)
      : effectiveEndYear;
    
    if (midCareerYear < 1980) return 'pre1980';
    if (midCareerYear < 1990) return '1980s';
    if (midCareerYear < 2000) return '1990s';
    if (midCareerYear < 2010) return '2000s';
    if (midCareerYear < 2020) return '2010s';
    return 'current';
  }
  
  /**
   * Identify common biomechanics patterns across eras
   */
  private identifyCommonBiomechanics(eraGroups: Record<string, any[]>) {
    // Initialize storage for common patterns
    const commonPatterns: Record<string, any> = {
      bodyMechanics: {},
      physicalAttributes: {},
      movementPatterns: {},
      technicalExecutions: {},
      cognitivePatterns: {}
    };
    
    // Analyze each era for common patterns
    Object.entries(eraGroups).forEach(([era, eraData]) => {
      if (eraData.length < 3) return; // Skip eras with insufficient data
      
      // Extract and aggregate biomechanics data
      const bodyMechanics = this.aggregateBiomechanicsCategory(eraData, 'bodyMechanics');
      const physicalAttributes = this.aggregateBiomechanicsCategory(eraData, 'physicalAttributes');
      const movementPatterns = this.aggregateBiomechanicsCategory(eraData, 'movementPatterns');
      const technicalExecutions = this.aggregateBiomechanicsCategory(eraData, 'technicalExecutions');
      const cognitivePatterns = this.aggregateBiomechanicsCategory(eraData, 'cognitivePatterns');
      
      // Store era-specific data
      commonPatterns.bodyMechanics[era] = bodyMechanics;
      commonPatterns.physicalAttributes[era] = physicalAttributes;
      commonPatterns.movementPatterns[era] = movementPatterns;
      commonPatterns.technicalExecutions[era] = technicalExecutions;
      commonPatterns.cognitivePatterns[era] = cognitivePatterns;
    });
    
    // Find patterns that persist across eras
    commonPatterns.persistentTraits = this.identifyPersistentTraits(commonPatterns);
    
    return commonPatterns;
  }
  
  /**
   * Aggregate biomechanics data for a specific category
   */
  private aggregateBiomechanicsCategory(eraData: any[], category: string) {
    // Implementation would aggregate numerical and categorical data
    // This is a simplified version
    const aggregatedData: Record<string, any> = {};
    
    eraData.forEach(item => {
      const biomechanics = item.biomechanics || [];
      
      biomechanics.forEach((data: any) => {
        if (data.category === category) {
          Object.entries(data.metrics || {}).forEach(([key, value]) => {
            if (!aggregatedData[key]) {
              aggregatedData[key] = {
                values: [],
                sum: 0,
                count: 0
              };
            }
            
            if (typeof value === 'number') {
              aggregatedData[key].values.push(value);
              aggregatedData[key].sum += value;
              aggregatedData[key].count += 1;
            }
          });
        }
      });
    });
    
    // Calculate averages and standard deviations
    Object.keys(aggregatedData).forEach(key => {
      const item = aggregatedData[key];
      
      if (item.count > 0) {
        item.average = item.sum / item.count;
        
        // Standard deviation calculation
        const sumSquaredDiff = item.values.reduce((acc: number, val: number) => {
          return acc + Math.pow(val - item.average, 2);
        }, 0);
        
        item.standardDeviation = Math.sqrt(sumSquaredDiff / item.count);
        item.consistency = 1 - (item.standardDeviation / item.average);
      }
    });
    
    return aggregatedData;
  }
  
  /**
   * Identify traits that persist across multiple eras
   */
  private identifyPersistentTraits(patterns: Record<string, any>) {
    const persistentTraits: Record<string, any> = {};
    const eras = ['pre1980', '1980s', '1990s', '2000s', '2010s', 'current'];
    const categories = ['bodyMechanics', 'physicalAttributes', 'movementPatterns', 
                        'technicalExecutions', 'cognitivePatterns'];
    
    // For each category, find metrics that appear consistently across eras
    categories.forEach(category => {
      persistentTraits[category] = {};
      
      // Get all unique metrics across all eras
      const allMetrics = new Set<string>();
      eras.forEach(era => {
        if (patterns[category]?.[era]) {
          Object.keys(patterns[category][era]).forEach(metric => {
            allMetrics.add(metric);
          });
        }
      });
      
      // Check which metrics appear consistently across eras
      allMetrics.forEach(metric => {
        const eraValues: number[] = [];
        const eraConsistencies: number[] = [];
        
        eras.forEach(era => {
          if (patterns[category]?.[era]?.[metric]) {
            const metricData = patterns[category][era][metric];
            if (metricData.average !== undefined) {
              eraValues.push(metricData.average);
              if (metricData.consistency !== undefined) {
                eraConsistencies.push(metricData.consistency);
              }
            }
          }
        });
        
        // If metric appears in enough eras and has consistent values
        if (eraValues.length >= 3) {
          // Check if values are consistent across eras
          const overallAvg = eraValues.reduce((a, b) => a + b, 0) / eraValues.length;
          const overallVariation = Math.sqrt(
            eraValues.reduce((acc, val) => acc + Math.pow(val - overallAvg, 2), 0) / eraValues.length
          ) / overallAvg;
          
          // If variation is low enough, consider it a persistent trait
          if (overallVariation < 0.25) {
            persistentTraits[category][metric] = {
              averageValue: overallAvg,
              crossEraConsistency: 1 - overallVariation,
              eraValues: eraValues,
              importance: this.calculateTraitImportance(overallVariation, eraValues.length, eraConsistencies)
            };
          }
        }
      });
    });
    
    return persistentTraits;
  }
  
  /**
   * Calculate importance score for a trait
   */
  private calculateTraitImportance(
    variation: number, 
    eraCount: number, 
    consistencies: number[]
  ) {
    // Traits that are very consistent across eras and within eras are most important
    const crossEraFactor = 1 - variation;
    const eraCoverageFactor = eraCount / 6; // 6 possible eras
    
    let withinEraConsistency = 0;
    if (consistencies.length > 0) {
      withinEraConsistency = consistencies.reduce((a, b) => a + b, 0) / consistencies.length;
    }
    
    // Calculate overall importance (higher is more important)
    return (crossEraFactor * 0.5) + (eraCoverageFactor * 0.3) + (withinEraConsistency * 0.2);
  }
  
  /**
   * Generate AI analysis of biomechanics patterns
   */
  private async generateBiomechanicsAnalysis(
    sportType: string, 
    position: string, 
    patterns: Record<string, any>
  ) {
    try {
      // Create prompt for GPT-4 analysis
      const prompt = `
You are an expert sports biomechanics analyst with deep knowledge of ${sportType}, particularly the ${position} position.

Below is data showing biomechanical patterns of elite ${position}s in ${sportType} across different eras. These patterns show which physical attributes and movement techniques have remained consistent across generations of top athletes.

${JSON.stringify(patterns.persistentTraits, null, 2)}

Based on this data, please provide:

1. A comprehensive analysis of the ideal biomechanics for a ${position} in ${sportType}
2. The 5 most critical physical attributes for success at this position
3. The 3-5 most essential movement patterns that define elite performance
4. How these biomechanics might differ for athletes with ADHD or other neurodivergent profiles
5. How coaches can train these specific biomechanical patterns

Format your response as structured JSON with these sections.
`;

      // Call GPT-4 for analysis
      const response = await openai.chat.completions.create({
        model: GPT_MODEL,
        messages: [
          { role: "system", content: "You are an expert sports biomechanics analyst with deep knowledge of body mechanics and athletic performance. Provide detailed, accurate analysis based on data." },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" }
      });

      // Parse and return the AI-generated analysis
      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error("Error generating biomechanics analysis:", error);
      return {
        error: "Failed to generate biomechanics analysis",
        message: "The AI analysis service is temporarily unavailable"
      };
    }
  }

  /**
   * Analyze neurodivergent characteristics correlation with position success
   */
  async analyzeNeurodivergentCorrelations(sportType: string, position: string) {
    try {
      // Get all athletes for this position
      const athletes = await db.select()
        .from(athleteProfiles)
        .where(
          and(
            eq(athleteProfiles.primarySport, sportType),
            eq(athleteProfiles.primaryPosition, position)
          )
        );
      
      if (!athletes || athletes.length < 10) {
        return { 
          success: false, 
          message: "Insufficient data for neurodivergent analysis" 
        };
      }

      // Get their neurodivergent profiles
      const athleteIds = athletes.map(athlete => athlete.userId);
      const profiles = await db.select()
        .from(neurodivergentProfiles)
        .where(inArray(neurodivergentProfiles.userId, athleteIds));
      
      // Join the data
      const athletesWithProfiles = athletes.map(athlete => {
        const profile = profiles.find(p => p.userId === athlete.userId);
        return {
          ...athlete,
          neurodivergentProfile: profile || null
        };
      }).filter(a => a.neurodivergentProfile !== null);
      
      if (athletesWithProfiles.length < 5) {
        return { 
          success: false, 
          message: "Insufficient neurodivergent profile data" 
        };
      }
      
      // Group by ADHD type and calculate success metrics
      const adhdTypeAnalysis = this.analyzeByAdhdType(athletesWithProfiles);
      
      // Group by birth month to check for relative age effect
      const birthMonthAnalysis = this.analyzeByBirthMonth(athletesWithProfiles);
      
      // Generate correlation analysis with AI
      const analysis = await this.generateNeurodivergentAnalysis(
        sportType,
        position,
        adhdTypeAnalysis,
        birthMonthAnalysis,
        athletesWithProfiles
      );
      
      return {
        success: true,
        position,
        sportType,
        adhdTypeCorrelations: adhdTypeAnalysis,
        birthMonthCorrelations: birthMonthAnalysis,
        analysis,
        sampleSize: athletesWithProfiles.length
      };
    } catch (error) {
      console.error("Error analyzing neurodivergent correlations:", error);
      return { 
        success: false, 
        message: "Error analyzing neurodivergent correlations" 
      };
    }
  }

  /**
   * Analyze athletes grouped by ADHD type
   */
  private analyzeByAdhdType(athletesWithProfiles: any[]) {
    const adhdTypeGroups: Record<string, any[]> = {
      'predominantly_inattentive': [],
      'predominantly_hyperactive': [],
      'combined_type': [],
      'none': []
    };
    
    // Group athletes by ADHD type
    athletesWithProfiles.forEach(athlete => {
      const profile = athlete.neurodivergentProfile;
      if (!profile) return;
      
      // Determine ADHD type
      let adhdType = 'none';
      
      if (profile.hasAdhd) {
        if (profile.adhdType === 'inattentive') {
          adhdType = 'predominantly_inattentive';
        } else if (profile.adhdType === 'hyperactive') {
          adhdType = 'predominantly_hyperactive';
        } else if (profile.adhdType === 'combined') {
          adhdType = 'combined_type';
        }
      }
      
      // Add to the appropriate group
      adhdTypeGroups[adhdType].push(athlete);
    });
    
    // Calculate success metrics for each group
    return Object.entries(adhdTypeGroups).map(([type, athletes]) => {
      if (athletes.length === 0) {
        return {
          adhdType: type,
          count: 0,
          averageRating: null,
          successRate: null
        };
      }
      
      const avgRating = athletes.reduce((sum, a) => sum + (a.overallRating || 0), 0) / athletes.length;
      const highlySuccessful = athletes.filter(a => a.overallRating >= 85).length;
      const successRate = (highlySuccessful / athletes.length) * 100;
      
      return {
        adhdType: type,
        count: athletes.length,
        averageRating: avgRating,
        successRate,
        percentageOfTotal: (athletes.length / athletesWithProfiles.length) * 100
      };
    });
  }
  
  /**
   * Analyze athletes grouped by birth month (relative age effect)
   */
  private analyzeByBirthMonth(athletesWithProfiles: any[]) {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const monthGroups: Record<string, any[]> = {};
    months.forEach(month => {
      monthGroups[month] = [];
    });
    
    // Group athletes by birth month
    athletesWithProfiles.forEach(athlete => {
      const profile = athlete.neurodivergentProfile;
      if (!profile || !profile.birthDate) return;
      
      const birthDate = new Date(profile.birthDate);
      const month = months[birthDate.getMonth()];
      
      monthGroups[month].push(athlete);
    });
    
    // Calculate success metrics for each month
    return months.map(month => {
      const athletes = monthGroups[month];
      
      if (athletes.length === 0) {
        return {
          month,
          count: 0,
          averageRating: null,
          successRate: null,
          percentageOfTotal: 0
        };
      }
      
      const avgRating = athletes.reduce((sum, a) => sum + (a.overallRating || 0), 0) / athletes.length;
      const highlySuccessful = athletes.filter(a => a.overallRating >= 85).length;
      const successRate = (highlySuccessful / athletes.length) * 100;
      
      return {
        month,
        count: athletes.length,
        averageRating: avgRating,
        successRate,
        percentageOfTotal: (athletes.length / athletesWithProfiles.length) * 100
      };
    });
  }
  
  /**
   * Generate AI analysis of neurodivergent correlations
   */
  private async generateNeurodivergentAnalysis(
    sportType: string,
    position: string,
    adhdTypeAnalysis: any[],
    birthMonthAnalysis: any[],
    athletes: any[]
  ) {
    try {
      // Create prompt for GPT-4 analysis
      const prompt = `
You are an expert sports psychologist with specialization in neurodiversity in athletics.

Below is data showing correlations between ADHD types, birth months, and success rates for ${position}s in ${sportType}.

ADHD Type Analysis:
${JSON.stringify(adhdTypeAnalysis, null, 2)}

Birth Month Analysis:
${JSON.stringify(birthMonthAnalysis, null, 2)}

Based on this data, please provide:

1. An analysis of how different ADHD types correlate with success at the ${position} position in ${sportType}
2. Whether there appears to be a relative age effect (birth month correlation) for this position
3. What specific cognitive advantages might exist for athletes with certain neurodivergent profiles in this position
4. How coaches can adapt training methods for athletes with different neurodivergent profiles
5. What personality traits tend to be most beneficial for this position based on the data

Format your response as structured JSON with these sections.
`;

      // Call GPT-4 for analysis
      const response = await openai.chat.completions.create({
        model: GPT_MODEL,
        messages: [
          { role: "system", content: "You are an expert sports psychologist specializing in neurodiversity in athletics. Provide detailed, accurate analysis based on data." },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" }
      });

      // Parse and return the AI-generated analysis
      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error("Error generating neurodivergent analysis:", error);
      return {
        error: "Failed to generate neurodivergent analysis",
        message: "The AI analysis service is temporarily unavailable"
      };
    }
  }

  /**
   * Get sport-position recommendations based on athlete attributes
   */
  async getPositionRecommendations(athleteId: number) {
    try {
      // Get athlete profile and metrics
      const athlete = await db.query.athleteProfiles.findFirst({
        where: eq(athleteProfiles.userId, athleteId)
      });
      
      if (!athlete) {
        return { 
          success: false, 
          message: "Athlete profile not found" 
        };
      }
      
      // Get athlete body metrics
      const bodyMetrics = await db.query.athleteBodyMetrics.findFirst({
        where: eq(athleteBodyMetrics.userId, athleteId)
      });
      
      // Get neurodivergent profile if available
      const neurodivergentProfile = await db.query.neurodivergentProfiles.findFirst({
        where: eq(neurodivergentProfiles.userId, athleteId)
      });
      
      // Get all sport positions
      const positions = await db.select().from(sportPositions);
      
      // Calculate position match scores
      const positionMatches = await this.calculatePositionMatches(
        athlete,
        bodyMetrics,
        neurodivergentProfile,
        positions
      );
      
      // Get top 5 matches
      const topMatches = positionMatches
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 5);
      
      // Generate detailed analysis for top matches
      const analysisPromises = topMatches.map(match => 
        this.generatePositionMatchAnalysis(match, athlete, bodyMetrics, neurodivergentProfile)
      );
      
      const analyses = await Promise.all(analysisPromises);
      
      // Add analyses to matches
      const matchesWithAnalysis = topMatches.map((match, index) => ({
        ...match,
        analysis: analyses[index]
      }));
      
      return {
        success: true,
        athleteId,
        athleteName: athlete.fullName,
        recommendations: matchesWithAnalysis,
        totalPositionsAnalyzed: positions.length
      };
    } catch (error) {
      console.error("Error generating position recommendations:", error);
      return { 
        success: false, 
        message: "Error generating position recommendations" 
      };
    }
  }

  /**
   * Calculate position match scores based on athlete attributes
   */
  private async calculatePositionMatches(
    athlete: any,
    bodyMetrics: any | null,
    neurodivergentProfile: any | null,
    positions: any[]
  ) {
    const matches = [];
    
    for (const position of positions) {
      // Get ideal biomechanics for this position
      const idealBiomechanics = await this.getIdealBiomechanics(
        position.sportType,
        position.positionName
      );
      
      // Get neurodivergent correlations for this position
      const neurodivergentCorrelations = await this.analyzeNeurodivergentCorrelations(
        position.sportType,
        position.positionName
      );
      
      // Calculate physical attributes match score (0-100)
      const physicalMatchScore = this.calculatePhysicalMatchScore(
        bodyMetrics,
        idealBiomechanics
      );
      
      // Calculate neurodivergent match score (0-100)
      const neurodivergentMatchScore = this.calculateNeurodivergentMatchScore(
        neurodivergentProfile,
        neurodivergentCorrelations
      );
      
      // Calculate skill set match score (0-100)
      const skillMatchScore = this.calculateSkillMatchScore(
        athlete,
        position
      );
      
      // Calculate overall match score with weighted components
      const overallMatchScore = (
        (physicalMatchScore * 0.4) + 
        (neurodivergentMatchScore * 0.3) + 
        (skillMatchScore * 0.3)
      );
      
      matches.push({
        sportType: position.sportType,
        positionName: position.positionName,
        matchScore: overallMatchScore,
        physicalMatchScore,
        neurodivergentMatchScore,
        skillMatchScore,
        positionDetails: position
      });
    }
    
    return matches;
  }
  
  /**
   * Calculate physical attribute match score
   */
  private calculatePhysicalMatchScore(bodyMetrics: any | null, idealBiomechanics: any) {
    if (!bodyMetrics || !idealBiomechanics?.success) {
      return 50; // Default neutral score with insufficient data
    }
    
    // Extract ideal physical attributes from biomechanics analysis
    const idealAttributes = idealBiomechanics.idealBiomechanics?.persistentTraits?.physicalAttributes || {};
    
    // If no ideal attributes found, return neutral score
    if (Object.keys(idealAttributes).length === 0) {
      return 50;
    }
    
    // Calculate match percentage for each attribute
    let totalScore = 0;
    let totalWeight = 0;
    
    Object.entries(idealAttributes).forEach(([attribute, data]: [string, any]) => {
      const importance = data.importance || 1;
      const idealValue = data.averageValue;
      
      // If athlete has this attribute
      if (bodyMetrics[attribute] !== undefined && idealValue !== undefined) {
        const athleteValue = bodyMetrics[attribute];
        
        // Calculate how close athlete is to ideal (0-100%)
        const percentDifference = Math.abs((athleteValue - idealValue) / idealValue);
        const attributeMatchPercent = Math.max(0, 100 - (percentDifference * 100));
        
        totalScore += attributeMatchPercent * importance;
        totalWeight += importance;
      }
    });
    
    // Return weighted average score
    return totalWeight > 0 ? totalScore / totalWeight : 50;
  }
  
  /**
   * Calculate neurodivergent profile match score
   */
  private calculateNeurodivergentMatchScore(profile: any | null, correlations: any) {
    if (!profile || !correlations?.success) {
      return 50; // Default neutral score with insufficient data
    }
    
    // Extract ADHD type correlations
    const adhdCorrelations = correlations.adhdTypeCorrelations || [];
    
    // Determine athlete's ADHD type
    let athleteAdhdType = 'none';
    if (profile.hasAdhd) {
      if (profile.adhdType === 'inattentive') {
        athleteAdhdType = 'predominantly_inattentive';
      } else if (profile.adhdType === 'hyperactive') {
        athleteAdhdType = 'predominantly_hyperactive';
      } else if (profile.adhdType === 'combined') {
        athleteAdhdType = 'combined_type';
      }
    }
    
    // Find correlation for this ADHD type
    const athleteTypeCorrelation = adhdCorrelations.find(c => c.adhdType === athleteAdhdType);
    
    if (!athleteTypeCorrelation || athleteTypeCorrelation.successRate === null) {
      return 50;
    }
    
    // Use success rate as match score (0-100)
    return athleteTypeCorrelation.successRate;
  }
  
  /**
   * Calculate skill match score
   */
  private calculateSkillMatchScore(athlete: any, position: any) {
    // This is a simplified implementation
    // A real implementation would compare athlete skills to position requirements
    
    // For now, return a score based on athlete's current sport match
    if (athlete.primarySport === position.sportType) {
      // If athlete already plays this sport
      if (athlete.primaryPosition === position.positionName) {
        // If athlete already plays this position
        return 90; // High match but leave room for improvement
      } else {
        // Different position in same sport
        return 75;
      }
    } else if (athlete.secondarySports?.includes(position.sportType)) {
      // Athlete has experience with this sport as secondary
      return 65;
    } else {
      // Different sport entirely
      return 50; // Neutral starting point
    }
  }
  
  /**
   * Generate detailed analysis for a position match
   */
  private async generatePositionMatchAnalysis(
    match: any,
    athlete: any,
    bodyMetrics: any | null,
    neurodivergentProfile: any | null
  ) {
    try {
      // Create prompt for GPT-4 analysis
      const prompt = `
You are an expert sports scientist specializing in athlete development and position matching.

Below is data for an athlete and their match score for the ${match.positionName} position in ${match.sportType}:

Athlete Profile:
${JSON.stringify(athlete, null, 2)}

Body Metrics:
${JSON.stringify(bodyMetrics, null, 2)}

Neurodivergent Profile:
${JSON.stringify(neurodivergentProfile, null, 2)}

Position Match:
${JSON.stringify(match, null, 2)}

Based on this data, please provide:

1. A detailed explanation of why this position is a good match for this athlete
2. The key physical attributes the athlete possesses that make them suitable for this position
3. How their cognitive/neurodivergent profile might benefit them in this position
4. What specific skills they should focus on developing to excel in this position
5. What training adaptations would be most beneficial based on their profile

Format your response as structured JSON with these sections.
`;

      // Call GPT-4 for analysis
      const response = await openai.chat.completions.create({
        model: GPT_MODEL,
        messages: [
          { role: "system", content: "You are an expert sports scientist specializing in athlete development and position matching. Provide detailed, actionable insights based on athlete data." },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" }
      });

      // Parse and return the AI-generated analysis
      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error("Error generating position match analysis:", error);
      return {
        error: "Failed to generate detailed position analysis",
        message: "The AI analysis service is temporarily unavailable"
      };
    }
  }
}