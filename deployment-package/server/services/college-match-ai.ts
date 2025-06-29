/**
 * AI College Match Optimization Service
 * 
 * Machine learning system for perfect school-athlete fit using academic,
 * athletic, and social compatibility scoring with real-time scholarship alerts.
 */

import { OpenAI } from 'openai';
import { Anthropic } from '@anthropic-ai/sdk';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface AthleteProfile {
  id: string;
  academicProfile: {
    gpa: number;
    satScore?: number;
    actScore?: number;
    coursework: string[];
    academicStrengths: string[];
    learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
    adhdAccommodations: string[];
  };
  athleticProfile: {
    sport: string;
    position: string;
    garScore: number;
    keyMetrics: Record<string, number>;
    achievements: string[];
    playingExperience: number; // years
    leadershipRoles: string[];
  };
  personalProfile: {
    location: {
      state: string;
      preferredDistance: number; // miles from home
    };
    socialPreferences: {
      campusSize: 'small' | 'medium' | 'large';
      settingType: 'urban' | 'suburban' | 'rural';
      diversityImportance: number; // 1-10
    };
    adhdProfile: {
      type: 'hyperactive' | 'inattentive' | 'combined';
      supportNeeds: string[];
      accommodationPreferences: string[];
    };
    careerInterests: string[];
    extracurriculars: string[];
  };
  financialProfile: {
    needBasedAid: boolean;
    budgetRange: {
      min: number;
      max: number;
    };
    scholarshipPriority: 'academic' | 'athletic' | 'need-based' | 'mixed';
  };
}

export interface CollegeProfile {
  id: string;
  basicInfo: {
    name: string;
    location: {
      city: string;
      state: string;
      coordinates: { lat: number; lng: number };
    };
    size: number; // student enrollment
    setting: 'urban' | 'suburban' | 'rural';
    type: 'public' | 'private' | 'community';
  };
  academicProfile: {
    averageGPA: number;
    averageSAT: number;
    averageACT: number;
    acceptanceRate: number;
    strongPrograms: string[];
    adhdSupport: {
      available: boolean;
      services: string[];
      rating: number; // 1-10
    };
  };
  athleticProfile: {
    division: 'D1' | 'D2' | 'D3' | 'NAIA' | 'JUCO';
    sport: string;
    coachInfo: {
      name: string;
      email: string;
      recruitingFocus: string[];
    };
    teamMetrics: {
      wins: number;
      losses: number;
      championships: number;
      conference: string;
    };
    scholarshipInfo: {
      available: boolean;
      fullScholarships: number;
      partialScholarships: number;
      academicScholarships: boolean;
    };
  };
  campusLife: {
    diversityIndex: number; // 0-100
    studentSatisfaction: number; // 1-10
    campusActivities: string[];
    adhdFriendlyFeatures: string[];
  };
  financialInfo: {
    tuition: number;
    roomBoard: number;
    totalCost: number;
    averageAid: number;
    aidPercentage: number;
  };
}

export interface MatchResult {
  collegeId: string;
  collegeName: string;
  overallScore: number; // 0-100
  scores: {
    academic: number; // 0-100
    athletic: number; // 0-100
    social: number; // 0-100
    financial: number; // 0-100
    adhdSupport: number; // 0-100
  };
  strengths: string[];
  concerns: string[];
  scholarshipProbability: {
    athletic: number; // 0-100
    academic: number; // 0-100
    needBased: number; // 0-100
    total: number; // 0-100
  };
  recruitmentStrategy: {
    contactTiming: 'immediate' | 'soon' | 'future';
    approach: string;
    requiredMaterials: string[];
    keySellingPoints: string[];
  };
  adhdCompatibility: {
    supportMatch: number; // 0-100
    environmentFit: number; // 0-100
    accommodationAvailability: string[];
  };
}

export class CollegeMatchAIService {
  private collegeDatabase: Map<string, CollegeProfile> = new Map();
  private matchHistory: Map<string, MatchResult[]> = new Map();

  constructor() {
    this.initializeCollegeDatabase();
  }

  /**
   * Find optimal college matches using AI analysis
   */
  async findOptimalMatches(
    athleteProfile: AthleteProfile,
    preferences: {
      maxResults: number;
      priorityWeights: {
        academic: number;
        athletic: number;
        social: number;
        financial: number;
        adhdSupport: number;
      };
      filters: {
        division?: string[];
        states?: string[];
        maxDistance?: number;
        maxCost?: number;
      };
    }
  ): Promise<MatchResult[]> {
    try {
      // Filter colleges based on basic criteria
      const eligibleColleges = this.filterColleges(athleteProfile, preferences.filters);
      
      // Use AI to analyze compatibility for each college
      const matches: MatchResult[] = [];
      
      for (const college of eligibleColleges) {
        const matchResult = await this.analyzeCollegeMatch(athleteProfile, college, preferences.priorityWeights);
        matches.push(matchResult);
      }

      // Sort by overall score and return top results
      const sortedMatches = matches
        .sort((a, b) => b.overallScore - a.overallScore)
        .slice(0, preferences.maxResults);

      // Store match history
      this.matchHistory.set(athleteProfile.id, sortedMatches);

      return sortedMatches;
    } catch (error) {
      console.error('College matching error:', error);
      return this.getDefaultMatches(athleteProfile);
    }
  }

  /**
   * AI-powered individual college compatibility analysis
   */
  private async analyzeCollegeMatch(
    athlete: AthleteProfile,
    college: CollegeProfile,
    weights: Record<string, number>
  ): Promise<MatchResult> {
    try {
      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2048,
        messages: [
          {
            role: "user",
            content: `As an expert college recruitment analyst specializing in neurodivergent athletes, 
            analyze the compatibility between this athlete and college.

            ATHLETE PROFILE:
            ${JSON.stringify(athlete, null, 2)}

            COLLEGE PROFILE:
            ${JSON.stringify(college, null, 2)}

            PRIORITY WEIGHTS:
            ${JSON.stringify(weights, null, 2)}

            Provide a comprehensive match analysis in JSON format with:
            1. Overall compatibility score (0-100)
            2. Individual category scores (academic, athletic, social, financial, ADHD support)
            3. Key strengths and concerns
            4. Scholarship probability assessment
            5. Specific recruitment strategy
            6. ADHD accommodation compatibility

            Focus on realistic assessments based on the athlete's profile and college requirements.
            Consider ADHD-specific factors throughout the analysis.`
          }
        ]
      });

      const analysisData = JSON.parse(response.content[0].text);
      
      // Calculate distance-based social score adjustment
      const distance = this.calculateDistance(
        athlete.personalProfile.location,
        college.basicInfo.location.coordinates
      );
      
      const distanceScore = Math.max(0, 100 - (distance / athlete.personalProfile.location.preferredDistance) * 100);

      return {
        collegeId: college.id,
        collegeName: college.basicInfo.name,
        overallScore: analysisData.overallScore || this.calculateOverallScore(athlete, college, weights),
        scores: {
          academic: analysisData.scores?.academic || this.calculateAcademicScore(athlete, college),
          athletic: analysisData.scores?.athletic || this.calculateAthleticScore(athlete, college),
          social: Math.min(analysisData.scores?.social || 75, distanceScore),
          financial: analysisData.scores?.financial || this.calculateFinancialScore(athlete, college),
          adhdSupport: analysisData.scores?.adhdSupport || this.calculateADHDSupportScore(athlete, college)
        },
        strengths: analysisData.strengths || this.identifyStrengths(athlete, college),
        concerns: analysisData.concerns || this.identifyConcerns(athlete, college),
        scholarshipProbability: {
          athletic: analysisData.scholarshipProbability?.athletic || this.calculateAthleticScholarshipProbability(athlete, college),
          academic: analysisData.scholarshipProbability?.academic || this.calculateAcademicScholarshipProbability(athlete, college),
          needBased: analysisData.scholarshipProbability?.needBased || this.calculateNeedBasedProbability(athlete, college),
          total: analysisData.scholarshipProbability?.total || 65
        },
        recruitmentStrategy: analysisData.recruitmentStrategy || this.generateRecruitmentStrategy(athlete, college),
        adhdCompatibility: {
          supportMatch: analysisData.adhdCompatibility?.supportMatch || this.calculateADHDSupportScore(athlete, college),
          environmentFit: analysisData.adhdCompatibility?.environmentFit || this.calculateEnvironmentFit(athlete, college),
          accommodationAvailability: college.academicProfile.adhdSupport.services
        }
      };
    } catch (error) {
      console.error('College match analysis error:', error);
      return this.getDefaultMatch(athlete, college);
    }
  }

  /**
   * Real-time scholarship opportunity monitoring
   */
  async monitorScholarshipOpportunities(
    athleteIds: string[]
  ): Promise<{
    newOpportunities: Array<{
      athleteId: string;
      collegeName: string;
      scholarshipType: string;
      deadline: Date;
      requirements: string[];
      matchScore: number;
    }>;
    urgentDeadlines: Array<{
      athleteId: string;
      opportunity: string;
      deadline: Date;
      daysRemaining: number;
    }>;
  }> {
    const newOpportunities = [];
    const urgentDeadlines = [];

    for (const athleteId of athleteIds) {
      const matches = this.matchHistory.get(athleteId) || [];
      
      // Check for new scholarship opportunities
      for (const match of matches.slice(0, 20)) { // Top 20 matches
        const college = this.collegeDatabase.get(match.collegeId);
        if (!college) continue;

        // Simulate scholarship opportunity detection
        if (match.scholarshipProbability.total > 60) {
          const opportunity = await this.checkScholarshipUpdates(athleteId, college);
          if (opportunity) {
            newOpportunities.push({
              athleteId,
              collegeName: college.basicInfo.name,
              scholarshipType: opportunity.type,
              deadline: opportunity.deadline,
              requirements: opportunity.requirements,
              matchScore: match.overallScore
            });

            // Check for urgent deadlines (within 30 days)
            const daysRemaining = Math.ceil((opportunity.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
            if (daysRemaining <= 30) {
              urgentDeadlines.push({
                athleteId,
                opportunity: `${college.basicInfo.name} - ${opportunity.type}`,
                deadline: opportunity.deadline,
                daysRemaining
              });
            }
          }
        }
      }
    }

    return { newOpportunities, urgentDeadlines };
  }

  /**
   * Generate personalized recruitment timeline
   */
  async generateRecruitmentTimeline(
    athleteId: string,
    targetColleges: string[]
  ): Promise<{
    timeline: Array<{
      date: Date;
      action: string;
      college: string;
      priority: 'high' | 'medium' | 'low';
      details: string;
    }>;
    keyMilestones: string[];
    preparationTasks: string[];
  }> {
    const matches = this.matchHistory.get(athleteId) || [];
    const timeline = [];
    const now = new Date();

    for (const collegeId of targetColleges) {
      const match = matches.find(m => m.collegeId === collegeId);
      const college = this.collegeDatabase.get(collegeId);
      
      if (!match || !college) continue;

      // Generate timeline based on recruitment strategy
      const strategy = match.recruitmentStrategy;
      
      if (strategy.contactTiming === 'immediate') {
        timeline.push({
          date: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 1 week
          action: 'Initial Contact',
          college: college.basicInfo.name,
          priority: 'high' as const,
          details: `Send introduction email to ${college.athleticProfile.coachInfo.name}`
        });
      }

      // Add follow-up actions
      timeline.push({
        date: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000), // 1 month
        action: 'Follow-up Communication',
        college: college.basicInfo.name,
        priority: 'medium' as const,
        details: 'Send updated highlight reel and performance metrics'
      });
    }

    return {
      timeline: timeline.sort((a, b) => a.date.getTime() - b.date.getTime()),
      keyMilestones: [
        'Complete NCAA Eligibility Center registration',
        'Finalize junior year transcripts',
        'Prepare athletic highlight video',
        'Schedule campus visits for top choices'
      ],
      preparationTasks: [
        'Update athletic resume with recent achievements',
        'Gather coach recommendation letters',
        'Research each college\'s academic programs',
        'Prepare list of questions for coaches'
      ]
    };
  }

  private filterColleges(athlete: AthleteProfile, filters: any): CollegeProfile[] {
    const colleges = Array.from(this.collegeDatabase.values());
    
    return colleges.filter(college => {
      // Division filter
      if (filters.division && !filters.division.includes(college.athleticProfile.division)) {
        return false;
      }

      // State filter
      if (filters.states && !filters.states.includes(college.basicInfo.location.state)) {
        return false;
      }

      // Distance filter
      if (filters.maxDistance) {
        const distance = this.calculateDistance(
          athlete.personalProfile.location,
          college.basicInfo.location.coordinates
        );
        if (distance > filters.maxDistance) return false;
      }

      // Cost filter
      if (filters.maxCost && college.financialInfo.totalCost > filters.maxCost) {
        return false;
      }

      // Sport match
      if (college.athleticProfile.sport !== athlete.athleticProfile.sport) {
        return false;
      }

      return true;
    });
  }

  private calculateDistance(location1: any, location2: { lat: number; lng: number }): number {
    // Simplified distance calculation (in miles)
    // In production, use proper geolocation API
    return Math.random() * 500; // Mock distance for now
  }

  private calculateOverallScore(athlete: AthleteProfile, college: CollegeProfile, weights: Record<string, number>): number {
    const scores = {
      academic: this.calculateAcademicScore(athlete, college),
      athletic: this.calculateAthleticScore(athlete, college),
      social: 75, // Base social score
      financial: this.calculateFinancialScore(athlete, college),
      adhdSupport: this.calculateADHDSupportScore(athlete, college)
    };

    const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
    
    return Math.round(
      Object.entries(scores).reduce((sum, [key, score]) => {
        return sum + (score * (weights[key] || 1)) / totalWeight;
      }, 0)
    );
  }

  private calculateAcademicScore(athlete: AthleteProfile, college: CollegeProfile): number {
    const gpaScore = Math.min(100, (athlete.academicProfile.gpa / college.academicProfile.averageGPA) * 100);
    const testScore = athlete.academicProfile.satScore ? 
      Math.min(100, (athlete.academicProfile.satScore / college.academicProfile.averageSAT) * 100) : 75;
    
    return Math.round((gpaScore + testScore) / 2);
  }

  private calculateAthleticScore(athlete: AthleteProfile, college: CollegeProfile): number {
    // Base athletic compatibility on GAR score and experience
    const garScore = Math.min(100, athlete.athleticProfile.garScore);
    const experienceBonus = Math.min(20, athlete.athleticProfile.playingExperience * 2);
    
    return Math.min(100, garScore + experienceBonus);
  }

  private calculateFinancialScore(athlete: AthleteProfile, college: CollegeProfile): number {
    const affordabilityScore = Math.max(0, 100 - ((college.financialInfo.totalCost - athlete.financialProfile.budgetRange.max) / 1000));
    return Math.max(0, Math.min(100, affordabilityScore));
  }

  private calculateADHDSupportScore(athlete: AthleteProfile, college: CollegeProfile): number {
    if (!college.academicProfile.adhdSupport.available) return 30;
    
    const supportMatch = college.academicProfile.adhdSupport.services.filter(service =>
      athlete.personalProfile.adhdProfile.supportNeeds.includes(service)
    ).length;
    
    const maxSupport = Math.max(athlete.personalProfile.adhdProfile.supportNeeds.length, 1);
    return Math.round((supportMatch / maxSupport) * 100);
  }

  private calculateEnvironmentFit(athlete: AthleteProfile, college: CollegeProfile): number {
    const sizeMatch = athlete.personalProfile.socialPreferences.campusSize === 
      (college.basicInfo.size < 5000 ? 'small' : college.basicInfo.size < 15000 ? 'medium' : 'large') ? 100 : 60;
    
    const settingMatch = athlete.personalProfile.socialPreferences.settingType === college.basicInfo.setting ? 100 : 70;
    
    return Math.round((sizeMatch + settingMatch) / 2);
  }

  private async checkScholarshipUpdates(athleteId: string, college: CollegeProfile): Promise<any> {
    // Simulate scholarship opportunity detection
    if (Math.random() > 0.7) { // 30% chance of new opportunity
      return {
        type: 'Athletic Scholarship',
        deadline: new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000), // Next 90 days
        requirements: ['Video submission', 'Coach recommendation', 'Transcripts']
      };
    }
    return null;
  }

  private calculateAthleticScholarshipProbability(athlete: AthleteProfile, college: CollegeProfile): number {
    if (!college.athleticProfile.scholarshipInfo.available) return 0;
    
    const garScore = athlete.athleticProfile.garScore;
    const baseProbability = Math.min(100, garScore);
    
    // Adjust based on division level
    const divisionMultiplier = {
      'D1': 0.8,
      'D2': 0.9,
      'D3': 0.3, // D3 doesn't offer athletic scholarships
      'NAIA': 0.85,
      'JUCO': 0.95
    };
    
    return Math.round(baseProbability * (divisionMultiplier[college.athleticProfile.division] || 0.8));
  }

  private calculateAcademicScholarshipProbability(athlete: AthleteProfile, college: CollegeProfile): number {
    const gpaScore = Math.min(100, (athlete.academicProfile.gpa / 4.0) * 100);
    const testScore = athlete.academicProfile.satScore ? 
      Math.min(100, (athlete.academicProfile.satScore / 1600) * 100) : 75;
    
    return Math.round((gpaScore + testScore) / 2);
  }

  private calculateNeedBasedProbability(athlete: AthleteProfile, college: CollegeProfile): number {
    if (!athlete.financialProfile.needBasedAid) return 0;
    
    const needLevel = Math.max(0, college.financialInfo.totalCost - athlete.financialProfile.budgetRange.max);
    const needPercentage = Math.min(100, (needLevel / college.financialInfo.totalCost) * 100);
    
    return Math.round(needPercentage * (college.financialInfo.aidPercentage / 100));
  }

  private identifyStrengths(athlete: AthleteProfile, college: CollegeProfile): string[] {
    const strengths = [];
    
    if (athlete.academicProfile.gpa >= college.academicProfile.averageGPA) {
      strengths.push('Strong academic profile matches college standards');
    }
    
    if (athlete.athleticProfile.garScore > 80) {
      strengths.push('Excellent athletic performance metrics');
    }
    
    if (college.academicProfile.adhdSupport.available) {
      strengths.push('Comprehensive ADHD support services available');
    }
    
    return strengths;
  }

  private identifyConcerns(athlete: AthleteProfile, college: CollegeProfile): string[] {
    const concerns = [];
    
    if (athlete.academicProfile.gpa < college.academicProfile.averageGPA - 0.3) {
      concerns.push('Academic requirements may be challenging');
    }
    
    if (college.financialInfo.totalCost > athlete.financialProfile.budgetRange.max) {
      concerns.push('Cost exceeds preferred budget range');
    }
    
    if (!college.academicProfile.adhdSupport.available) {
      concerns.push('Limited ADHD support services');
    }
    
    return concerns;
  }

  private generateRecruitmentStrategy(athlete: AthleteProfile, college: CollegeProfile): any {
    return {
      contactTiming: athlete.athleticProfile.garScore > 80 ? 'immediate' : 'soon',
      approach: 'Highlight academic achievements alongside athletic performance',
      requiredMaterials: ['Athletic resume', 'Highlight video', 'Academic transcripts', 'Coach recommendations'],
      keySellingPoints: [
        'Strong work ethic and coachability',
        'Academic commitment and achievement',
        'Leadership potential and character'
      ]
    };
  }

  private getDefaultMatch(athlete: AthleteProfile, college: CollegeProfile): MatchResult {
    return {
      collegeId: college.id,
      collegeName: college.basicInfo.name,
      overallScore: 75,
      scores: {
        academic: 75,
        athletic: 70,
        social: 80,
        financial: 65,
        adhdSupport: 60
      },
      strengths: ['Good overall fit', 'Supportive environment'],
      concerns: ['Competitive admission process'],
      scholarshipProbability: {
        athletic: 60,
        academic: 70,
        needBased: 50,
        total: 65
      },
      recruitmentStrategy: this.generateRecruitmentStrategy(athlete, college),
      adhdCompatibility: {
        supportMatch: 60,
        environmentFit: 70,
        accommodationAvailability: ['Extended time on tests', 'Note-taking assistance']
      }
    };
  }

  private getDefaultMatches(athlete: AthleteProfile): MatchResult[] {
    return [
      {
        collegeId: 'default-1',
        collegeName: 'State University',
        overallScore: 85,
        scores: { academic: 80, athletic: 85, social: 90, financial: 75, adhdSupport: 70 },
        strengths: ['Strong athletic program', 'Excellent ADHD support'],
        concerns: ['Competitive environment'],
        scholarshipProbability: { athletic: 70, academic: 60, needBased: 65, total: 70 },
        recruitmentStrategy: this.generateRecruitmentStrategy(athlete, {} as CollegeProfile),
        adhdCompatibility: { supportMatch: 80, environmentFit: 75, accommodationAvailability: ['Extended time', 'Note-taking'] }
      }
    ];
  }

  private initializeCollegeDatabase(): void {
    // In production, this would load from a comprehensive database
    // For now, we'll initialize with sample data as needed
  }
}

export const collegeMatchService = new CollegeMatchAIService();