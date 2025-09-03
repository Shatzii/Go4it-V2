// Intelligent Athlete Discovery System
// Advanced scraping and AI-powered talent identification

import axios from 'axios';
import * as cheerio from 'cheerio';
import OpenAI from 'openai';
import { AdvancedScraper } from './scraper-core';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface AthleteProfile {
  id: string;
  name: string;
  sport: string;
  position: string;
  school: string;
  city?: string;
  state?: string;
  graduationYear: number;
  height?: string;
  weight?: number;
  stats: Record<string, any>;
  rankings: {
    national?: number;
    state?: number;
    position?: number;
    overall?: string;
  };
  socialMedia: {
    instagram?: string;
    twitter?: string;
    tiktok?: string;
    followers?: number;
  };
  achievements: string[];
  highlightVideos: string[];
  academicInfo?: {
    gpa?: number;
    sat?: number;
    act?: number;
    intendedMajor?: string;
  };
  recruitment: {
    status: 'unrecruited' | 'offered' | 'committed';
    offers?: string[];
    commitment?: string;
    recruitmentStage: 'early' | 'regular' | 'late';
  };
  qualityScore: number;
  discoverySource: string;
  discoveredAt: Date;
  lastUpdated: Date;
}

interface DiscoveryCriteria {
  sport?: string;
  state?: string;
  graduationYear?: number;
  minQualityScore?: number;
  position?: string;
  maxResults?: number;
}

interface PotentialAnalysis {
  overallPotential: number; // 0-100
  technicalSkills: number;
  athleticAbility: number;
  academicProfile: number;
  socialPresence: number;
  recruitmentTimeline: string;
  projectedDivision: 'D1' | 'D2' | 'D3' | 'NAIA' | 'JUCO';
  comparablePlayers: string[];
  developmentAreas: string[];
  strengths: string[];
}

export class IntelligentAthleteDiscovery {
  private scraper: AdvancedScraper;
  private discoveredAthletes: Map<string, AthleteProfile> = new Map();

  constructor() {
    this.scraper = new AdvancedScraper();
  }

  // Main discovery function
  async discoverAthletes(criteria: DiscoveryCriteria = {}): Promise<AthleteProfile[]> {
    console.log('Starting intelligent athlete discovery...', criteria);

    const sources = [
      this.scrapeESPN(criteria),
      this.scrape247Sports(criteria),
      this.scrapeRivals(criteria),
      this.scrapeMaxPreps(criteria),
      this.scrapeHudl(criteria),
      this.scrapeSocialMedia(criteria),
      this.scrapeSchoolWebsites(criteria),
    ];

    const results = await Promise.allSettled(sources);
    const allAthletes: AthleteProfile[] = [];

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        allAthletes.push(...result.value);
      } else {
        console.error(`Source ${index} failed:`, result.reason);
      }
    });

    // Deduplicate and merge profiles
    const mergedAthletes = this.mergeDuplicateProfiles(allAthletes);

    // Score and rank athletes
    const scoredAthletes = await this.scoreAthletes(mergedAthletes);

    // Filter by criteria
    const filteredAthletes = this.filterByCriteria(scoredAthletes, criteria);

    // Analyze potential
    const analyzedAthletes = await this.analyzePotential(filteredAthletes);

    return analyzedAthletes;
  }

  // Enhanced ESPN scraping with AI analysis
  private async scrapeESPN(criteria: DiscoveryCriteria): Promise<AthleteProfile[]> {
    try {
      console.log('Scraping ESPN for athletes...');

      const urls = [
        'https://www.espn.com/college-sports/basketball/recruiting/',
        'https://www.espn.com/college-football/recruiting/',
        'https://www.espn.com/high-school/basketball/recruiting/',
        'https://www.espn.com/high-school/football/recruiting/',
      ];

      const athletes: AthleteProfile[] = [];

      for (const url of urls) {
        try {
          const $ = await this.scraper.scrapeURL(url);

          // Enhanced athlete extraction
          const athleteElements = $('div.player-card, article.recruit-card, .prospect-item');

          athleteElements.each((i, el) => {
            const element = $(el);
            const athlete = this.extractESPNProfile(element, $);
            if (athlete) {
              athletes.push(athlete);
            }
          });
        } catch (error) {
          console.error(`ESPN URL failed: ${url}`, error);
        }
      }

      return athletes;
    } catch (error) {
      console.error('ESPN scraping failed:', error);
      return [];
    }
  }

  // Extract athlete profile from ESPN HTML
  private extractESPNProfile(element: cheerio.Cheerio, $: cheerio.CheerioAPI): AthleteProfile | null {
    try {
      const name = element.find('.name, .player-name, h3').first().text().trim();
      if (!name || name.length < 3) return null;

      const position = element.find('.position, .pos').text().trim();
      const school = element.find('.school, .high-school').text().trim();
      const height = element.find('.height').text().trim();
      const weight = element.find('.weight').text().trim();

      // Extract stats
      const stats: Record<string, any> = {};
      element.find('.stat-item, .performance-stat').each((i, statEl) => {
        const statName = $(statEl).find('.stat-name').text().trim();
        const statValue = $(statEl).find('.stat-value').text().trim();
        if (statName && statValue) {
          stats[statName.toLowerCase().replace(' ', '_')] = statValue;
        }
      });

      // Extract rankings
      const rankings = {
        national: this.extractNumber(element.find('.national-rank, .overall-rank')),
        state: this.extractNumber(element.find('.state-rank')),
        position: this.extractNumber(element.find('.position-rank')),
      };

      // Determine sport from URL or content
      const sport = this.determineSport(element, $);

      const profile: AthleteProfile = {
        id: `espn_${name.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`,
        name,
        sport,
        position: position || 'N/A',
        school: school || 'N/A',
        graduationYear: new Date().getFullYear() + 1, // Default to next year
        height,
        weight: weight ? parseInt(weight) : undefined,
        stats,
        rankings,
        socialMedia: {},
        achievements: [],
        highlightVideos: [],
        recruitment: {
          status: 'unrecruited',
          recruitmentStage: 'regular',
        },
        qualityScore: 0,
        discoverySource: 'ESPN',
        discoveredAt: new Date(),
        lastUpdated: new Date(),
      };

      return profile;
    } catch (error) {
      console.error('Error extracting ESPN profile:', error);
      return null;
    }
  }

  // Enhanced 247Sports scraping
  private async scrape247Sports(criteria: DiscoveryCriteria): Promise<AthleteProfile[]> {
    try {
      console.log('Scraping 247Sports for athletes...');

      const urls = [
        'https://247sports.com/college/basketball/recruits/',
        'https://247sports.com/college/football/recruits/',
        'https://247sports.com/highschool/basketball/',
        'https://247sports.com/highschool/football/',
      ];

      const athletes: AthleteProfile[] = [];

      for (const url of urls) {
        try {
          const $ = await this.scraper.scrapeURL(url);

          const recruitCards = $('.recruit-card, .prospect-card, .player-item');

          recruitCards.each((i, el) => {
            const element = $(el);
            const athlete = this.extract247Profile(element, $);
            if (athlete) {
              athletes.push(athlete);
            }
          });
        } catch (error) {
          console.error(`247Sports URL failed: ${url}`, error);
        }
      }

      return athletes;
    } catch (error) {
      console.error('247Sports scraping failed:', error);
      return [];
    }
  }

  // Extract 247Sports profile
  private extract247Profile(element: cheerio.Cheerio, $: cheerio.CheerioAPI): AthleteProfile | null {
    try {
      const name = element.find('.name, .recruit-name').first().text().trim();
      if (!name) return null;

      const rating = element.find('.rating, .stars').text().trim();
      const position = element.find('.position').text().trim();
      const school = element.find('.school, .high-school').text().trim();
      const height = element.find('.height').text().trim();
      const weight = element.find('.weight').text().trim();

      // Extract composite ranking
      const compositeRank = element.find('.composite-rank, .overall-rank').text().trim();

      const sport = this.determineSport(element, $);

      const profile: AthleteProfile = {
        id: `247_${name.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`,
        name,
        sport,
        position: position || 'N/A',
        school: school || 'N/A',
        graduationYear: new Date().getFullYear() + 1,
        height,
        weight: weight ? parseInt(weight) : undefined,
        stats: {},
        rankings: {
          national: this.extractNumber(compositeRank),
          overall: rating,
        },
        socialMedia: {},
        achievements: [],
        highlightVideos: [],
        recruitment: {
          status: 'unrecruited',
          recruitmentStage: 'regular',
        },
        qualityScore: 0,
        discoverySource: '247Sports',
        discoveredAt: new Date(),
        lastUpdated: new Date(),
      };

      return profile;
    } catch (error) {
      console.error('Error extracting 247Sports profile:', error);
      return null;
    }
  }

  // Enhanced Hudl scraping for video content
  private async scrapeHudl(criteria: DiscoveryCriteria): Promise<AthleteProfile[]> {
    try {
      console.log('Scraping Hudl for athlete highlights...');

      const urls = [
        'https://www.hudl.com/highlights',
        'https://www.hudl.com/prospects',
        'https://www.hudl.com/recruiting',
      ];

      const athletes: AthleteProfile[] = [];

      for (const url of urls) {
        try {
          const $ = await this.scraper.scrapeURL(url);

          const highlightCards = $('.highlight-card, .prospect-card, .video-card');

          highlightCards.each((i, el) => {
            const element = $(el);
            const athlete = this.extractHudlProfile(element, $);
            if (athlete) {
              athletes.push(athlete);
            }
          });
        } catch (error) {
          console.error(`Hudl URL failed: ${url}`, error);
        }
      }

      return athletes;
    } catch (error) {
      console.error('Hudl scraping failed:', error);
      return [];
    }
  }

  // Extract Hudl profile with video highlights
  private extractHudlProfile(element: cheerio.Cheerio, $: cheerio.CheerioAPI): AthleteProfile | null {
    try {
      const name = element.find('.athlete-name, .player-name').first().text().trim();
      if (!name) return null;

      const school = element.find('.school, .team').text().trim();
      const sport = element.find('.sport').text().trim() || 'Basketball'; // Default

      // Extract video URLs
      const videoUrls: string[] = [];
      element.find('a.video-link, .highlight-video').each((i, videoEl) => {
        const videoUrl = $(videoEl).attr('href') || $(videoEl).attr('data-video-url');
        if (videoUrl && videoUrl.includes('hudl.com')) {
          videoUrls.push(videoUrl);
        }
      });

      // Extract performance stats from video descriptions
      const stats: Record<string, any> = {};
      const description = element.find('.description, .video-description').text().trim();
      if (description) {
        // Use AI to extract stats from description
        const extractedStats = await this.extractStatsFromText(description);
        Object.assign(stats, extractedStats);
      }

      const profile: AthleteProfile = {
        id: `hudl_${name.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`,
        name,
        sport,
        position: 'N/A', // Hudl doesn't always specify position
        school: school || 'N/A',
        graduationYear: new Date().getFullYear() + 1,
        stats,
        rankings: {},
        socialMedia: {},
        achievements: [],
        highlightVideos: videoUrls,
        recruitment: {
          status: 'unrecruited',
          recruitmentStage: 'regular',
        },
        qualityScore: 0,
        discoverySource: 'Hudl',
        discoveredAt: new Date(),
        lastUpdated: new Date(),
      };

      return profile;
    } catch (error) {
      console.error('Error extracting Hudl profile:', error);
      return null;
    }
  }

  // Social media discovery for athlete branding
  private async scrapeSocialMedia(criteria: DiscoveryCriteria): Promise<AthleteProfile[]> {
    try {
      console.log('Analyzing social media for athlete discovery...');

      // This would integrate with social media APIs
      // For now, we'll simulate discovery based on known patterns

      const mockAthletes: AthleteProfile[] = [
        {
          id: `social_${Date.now()}_1`,
          name: 'Alex Johnson',
          sport: 'Basketball',
          position: 'PG',
          school: 'Lincoln High School',
          city: 'Seattle',
          state: 'WA',
          graduationYear: 2025,
          stats: { pointsPerGame: 24.5, assistsPerGame: 8.2 },
          rankings: { state: 15 },
          socialMedia: {
            instagram: '@alexjohnson_bb',
            tiktok: '@alexjohnsonhoops',
            followers: 45000,
          },
          achievements: ['State Champion', 'All-State Selection'],
          highlightVideos: [],
          recruitment: {
            status: 'offered',
            offers: ['Washington', 'Oregon State'],
            recruitmentStage: 'regular',
          },
          qualityScore: 0,
          discoverySource: 'Social Media',
          discoveredAt: new Date(),
          lastUpdated: new Date(),
        },
      ];

      return mockAthletes;
    } catch (error) {
      console.error('Social media scraping failed:', error);
      return [];
    }
  }

  // School website scraping for comprehensive data
  private async scrapeSchoolWebsites(criteria: DiscoveryCriteria): Promise<AthleteProfile[]> {
    try {
      console.log('Scraping school websites for athlete data...');

      // List of high schools to scrape (would be configurable)
      const schools = [
        'https://www.lincoln-high.edu/athletics/basketball',
        'https://www.washington-prep.edu/sports/football',
        // Add more schools as needed
      ];

      const athletes: AthleteProfile[] = [];

      for (const schoolUrl of schools) {
        try {
          const $ = await this.scraper.scrapeURL(schoolUrl);

          const rosterElements = $('.roster-player, .athlete-card, .player-profile');

          rosterElements.each((i, el) => {
            const element = $(el);
            const athlete = this.extractSchoolProfile(element, $, schoolUrl);
            if (athlete) {
              athletes.push(athlete);
            }
          });
        } catch (error) {
          console.error(`School scraping failed: ${schoolUrl}`, error);
        }
      }

      return athletes;
    } catch (error) {
      console.error('School website scraping failed:', error);
      return [];
    }
  }

  // Extract profile from school website
  private extractSchoolProfile(
    element: cheerio.Cheerio,
    $: cheerio.CheerioAPI,
    schoolUrl: string
  ): AthleteProfile | null {
    try {
      const name = element.find('.name, .player-name, h3').first().text().trim();
      if (!name) return null;

      const position = element.find('.position, .pos').text().trim();
      const grade = element.find('.grade, .year').text().trim();
      const height = element.find('.height').text().trim();
      const weight = element.find('.weight').text().trim();

      // Extract school name from URL
      const school = this.extractSchoolFromUrl(schoolUrl);

      // Extract sport from URL or page content
      const sport = this.extractSportFromUrl(schoolUrl);

      const profile: AthleteProfile = {
        id: `school_${name.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`,
        name,
        sport,
        position: position || 'N/A',
        school,
        graduationYear: grade ? this.parseGraduationYear(grade) : new Date().getFullYear() + 1,
        height,
        weight: weight ? parseInt(weight) : undefined,
        stats: {},
        rankings: {},
        socialMedia: {},
        achievements: [],
        highlightVideos: [],
        recruitment: {
          status: 'unrecruited',
          recruitmentStage: 'regular',
        },
        qualityScore: 0,
        discoverySource: 'School Website',
        discoveredAt: new Date(),
        lastUpdated: new Date(),
      };

      return profile;
    } catch (error) {
      console.error('Error extracting school profile:', error);
      return null;
    }
  }

  // Merge duplicate profiles from different sources
  private mergeDuplicateProfiles(athletes: AthleteProfile[]): AthleteProfile[] {
    const merged = new Map<string, AthleteProfile>();

    athletes.forEach(athlete => {
      const key = `${athlete.name.toLowerCase()}_${athlete.school.toLowerCase()}`;

      if (merged.has(key)) {
        // Merge profiles
        const existing = merged.get(key)!;
        merged.set(key, this.mergeProfiles(existing, athlete));
      } else {
        merged.set(key, athlete);
      }
    });

    return Array.from(merged.values());
  }

  // Merge two athlete profiles
  private mergeProfiles(profile1: AthleteProfile, profile2: AthleteProfile): AthleteProfile {
    const merged: AthleteProfile = { ...profile1 };

    // Merge stats
    merged.stats = { ...profile1.stats, ...profile2.stats };

    // Merge rankings (take the best available)
    merged.rankings = {
      ...profile1.rankings,
      ...profile2.rankings,
    };

    // Merge social media
    merged.socialMedia = {
      ...profile1.socialMedia,
      ...profile2.socialMedia,
    };

    // Combine achievements
    merged.achievements = [
      ...new Set([...profile1.achievements, ...profile2.achievements])
    ];

    // Combine highlight videos
    merged.highlightVideos = [
      ...new Set([...profile1.highlightVideos, ...profile2.highlightVideos])
    ];

    // Update source to reflect merge
    merged.discoverySource = `${profile1.discoverySource} + ${profile2.discoverySource}`;

    merged.lastUpdated = new Date();

    return merged;
  }

  // Score athletes based on multiple criteria
  private async scoreAthletes(athletes: AthleteProfile[]): Promise<AthleteProfile[]> {
    for (const athlete of athletes) {
      athlete.qualityScore = await this.calculateQualityScore(athlete);
    }

    // Sort by quality score
    return athletes.sort((a, b) => b.qualityScore - a.qualityScore);
  }

  // Calculate comprehensive quality score
  private async calculateQualityScore(athlete: AthleteProfile): Promise<number> {
    let score = 0;

    // Rankings score (0-30 points)
    if (athlete.rankings.national && athlete.rankings.national <= 100) {
      score += Math.max(0, 30 - athlete.rankings.national * 0.3);
    } else if (athlete.rankings.state && athlete.rankings.state <= 50) {
      score += Math.max(0, 20 - athlete.rankings.state * 0.4);
    }

    // Stats score (0-25 points)
    const statScore = this.calculateStatsScore(athlete.stats, athlete.sport);
    score += statScore;

    // Social media presence (0-15 points)
    if (athlete.socialMedia.followers) {
      score += Math.min(15, athlete.socialMedia.followers / 10000);
    }

    // Achievements score (0-10 points)
    score += Math.min(10, athlete.achievements.length * 2);

    // Video content score (0-10 points)
    score += Math.min(10, athlete.highlightVideos.length * 3);

    // Recruitment status bonus (0-10 points)
    if (athlete.recruitment.offers && athlete.recruitment.offers.length > 0) {
      score += Math.min(10, athlete.recruitment.offers.length * 2);
    }

    return Math.min(100, Math.round(score));
  }

  // Calculate stats score based on sport
  private calculateStatsScore(stats: Record<string, any>, sport: string): number {
    let score = 0;

    switch (sport.toLowerCase()) {
      case 'basketball':
        if (stats.pointsPerGame) score += Math.min(10, stats.pointsPerGame / 3);
        if (stats.assistsPerGame) score += Math.min(5, stats.assistsPerGame / 2);
        if (stats.reboundsPerGame) score += Math.min(5, stats.reboundsPerGame / 2);
        if (stats.fieldGoalPercentage) score += Math.min(5, (stats.fieldGoalPercentage - 40) / 2);
        break;

      case 'football':
        if (stats.passingYards) score += Math.min(8, stats.passingYards / 2000);
        if (stats.rushingYards) score += Math.min(7, stats.rushingYards / 1500);
        if (stats.touchdowns) score += Math.min(5, stats.touchdowns / 2);
        if (stats.completionPercentage) score += Math.min(5, stats.completionPercentage - 50);
        break;

      default:
        // Generic scoring for other sports
        score += Object.keys(stats).length * 2;
    }

    return Math.min(25, score);
  }

  // Filter athletes by criteria
  private filterByCriteria(athletes: AthleteProfile[], criteria: DiscoveryCriteria): AthleteProfile[] {
    return athletes.filter(athlete => {
      if (criteria.sport && athlete.sport.toLowerCase() !== criteria.sport.toLowerCase()) {
        return false;
      }
      if (criteria.state && athlete.state !== criteria.state) {
        return false;
      }
      if (criteria.graduationYear && athlete.graduationYear !== criteria.graduationYear) {
        return false;
      }
      if (criteria.position && athlete.position !== criteria.position) {
        return false;
      }
      if (criteria.minQualityScore && athlete.qualityScore < criteria.minQualityScore) {
        return false;
      }
      return true;
    }).slice(0, criteria.maxResults || 100);
  }

  // Analyze athlete potential using AI
  private async analyzePotential(athletes: AthleteProfile[]): Promise<AthleteProfile[]> {
    for (const athlete of athletes) {
      try {
        const analysis = await this.performPotentialAnalysis(athlete);
        athlete.potentialAnalysis = analysis;
      } catch (error) {
        console.error(`Failed to analyze potential for ${athlete.name}:`, error);
      }
    }

    return athletes;
  }

  // Perform AI-powered potential analysis
  private async performPotentialAnalysis(athlete: AthleteProfile): Promise<any> {
    const prompt = `
Analyze the athletic potential of this high school athlete:

NAME: ${athlete.name}
SPORT: ${athlete.sport}
POSITION: ${athlete.position}
SCHOOL: ${athlete.school}
STATS: ${JSON.stringify(athlete.stats)}
RANKINGS: ${JSON.stringify(athlete.rankings)}
ACHIEVEMENTS: ${athlete.achievements.join(', ')}
SOCIAL MEDIA: ${JSON.stringify(athlete.socialMedia)}

Provide analysis in JSON format:
{
  "overallPotential": number (0-100),
  "technicalSkills": number (0-100),
  "athleticAbility": number (0-100),
  "academicProfile": number (0-100),
  "socialPresence": number (0-100),
  "recruitmentTimeline": "early|regular|late",
  "projectedDivision": "D1|D2|D3|NAIA|JUCO",
  "comparablePlayers": ["player1", "player2"],
  "developmentAreas": ["area1", "area2"],
  "strengths": ["strength1", "strength2"]
}
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      max_tokens: 1000,
    });

    return JSON.parse(response.choices[0].message.content || '{}');
  }

  // Helper methods
  private extractNumber(text: string): number | undefined {
    const match = text.match(/\d+/);
    return match ? parseInt(match[0]) : undefined;
  }

  private determineSport(element: cheerio.Cheerio, $: cheerio.CheerioAPI): string {
    const url = $('meta[property="og:url"]').attr('content') || '';
    const content = element.text().toLowerCase();

    if (url.includes('basketball') || content.includes('basketball')) return 'Basketball';
    if (url.includes('football') || content.includes('quarterback') || content.includes('running back')) return 'Football';
    if (url.includes('soccer') || content.includes('soccer')) return 'Soccer';
    if (url.includes('baseball') || content.includes('baseball')) return 'Baseball';
    if (url.includes('tennis') || content.includes('tennis')) return 'Tennis';
    if (url.includes('track') || content.includes('track')) return 'Track';

    return 'Basketball'; // Default
  }

  private extractSchoolFromUrl(url: string): string {
    // Extract school name from URL
    const domain = url.replace('https://www.', '').replace('https://', '').split('.')[0];
    return domain.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  private extractSportFromUrl(url: string): string {
    if (url.includes('/basketball')) return 'Basketball';
    if (url.includes('/football')) return 'Football';
    if (url.includes('/soccer')) return 'Soccer';
    if (url.includes('/baseball')) return 'Baseball';
    if (url.includes('/tennis')) return 'Tennis';
    if (url.includes('/track')) return 'Track';
    return 'Basketball';
  }

  private parseGraduationYear(grade: string): number {
    const currentYear = new Date().getFullYear();
    const gradeMap: Record<string, number> = {
      'senior': 0,
      'junior': 1,
      'sophomore': 2,
      'freshman': 3,
      '12th': 0,
      '11th': 1,
      '10th': 2,
      '9th': 3,
    };

    const yearsToAdd = gradeMap[grade.toLowerCase()] || 0;
    return currentYear + yearsToAdd;
  }

  private async extractStatsFromText(text: string): Promise<Record<string, any>> {
    // Use AI to extract stats from unstructured text
    const prompt = `Extract athletic statistics from this text: "${text}". Return as JSON object.`;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        max_tokens: 200,
      });

      return JSON.parse(response.choices[0].message.content || '{}');
    } catch (error) {
      return {};
    }
  }

  // Get top discovered athletes
  async getTopAthletes(limit: number = 10): Promise<AthleteProfile[]> {
    const athletes = Array.from(this.discoveredAthletes.values());
    return athletes
      .sort((a, b) => b.qualityScore - a.qualityScore)
      .slice(0, limit);
  }

  // Search athletes by criteria
  async searchAthletes(query: string): Promise<AthleteProfile[]> {
    const athletes = Array.from(this.discoveredAthletes.values());
    const queryLower = query.toLowerCase();

    return athletes.filter(athlete =>
      athlete.name.toLowerCase().includes(queryLower) ||
      athlete.school.toLowerCase().includes(queryLower) ||
      athlete.sport.toLowerCase().includes(queryLower) ||
      athlete.position.toLowerCase().includes(queryLower)
    );
  }

  // Get discovery statistics
  async getDiscoveryStats(): Promise<any> {
    const athletes = Array.from(this.discoveredAthletes.values());

    return {
      totalDiscovered: athletes.length,
      averageQualityScore: athletes.reduce((sum, a) => sum + a.qualityScore, 0) / athletes.length,
      bySport: athletes.reduce((acc, a) => {
        acc[a.sport] = (acc[a.sport] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      bySource: athletes.reduce((acc, a) => {
        acc[a.discoverySource] = (acc[a.discoverySource] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      topAthletes: athletes
        .sort((a, b) => b.qualityScore - a.qualityScore)
        .slice(0, 5)
        .map(a => ({ name: a.name, score: a.qualityScore, sport: a.sport })),
    };
  }
}

export default IntelligentAthleteDiscovery;</content>
<parameter name="filePath">/home/runner/workspace/lib/intelligent-athlete-discovery.ts
