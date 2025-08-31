// AI-Powered Prospect Analysis and Personalization System
import OpenAI from 'openai';
import { db } from '@/server/db';
import { prospects } from '@/shared/schema';
import { eq } from 'drizzle-orm';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface ProspectAnalysis {
  personalityProfile: string;
  motivationTriggers: string[];
  optimalContactTime: string;
  customizedMessage: string;
  probabilityScore: number;
  recommendedStrategy: string;
}

interface SocialMediaData {
  platform: string;
  followers: number;
  engagement: number;
  recentPosts: string[];
  interests: string[];
  parentalInvolvement: boolean;
}

export class AIProspectAnalyzer {
  // Analyze prospect's social media and create psychological profile
  async analyzeProspect(prospect: any, socialData?: SocialMediaData): Promise<ProspectAnalysis> {
    try {
      const analysisPrompt = `
        Analyze this high school athlete for recruiting outreach:
        
        Name: ${prospect.name}
        Sport: ${prospect.sport}
        Position: ${prospect.position}
        Location: ${prospect.city}, ${prospect.state}
        School: ${prospect.school}
        Rankings: National #${prospect.nationalRanking || 'Unranked'}
        Stats: ${JSON.stringify(prospect.stats || {})}
        Social Media Followers: ${prospect.followers || 'Unknown'}
        
        ${
          socialData
            ? `
        Recent Social Activity:
        - Platform: ${socialData.platform}
        - Engagement Rate: ${socialData.engagement}%
        - Recent Posts: ${socialData.recentPosts.join(', ')}
        - Interests: ${socialData.interests.join(', ')}
        - Parental Involvement: ${socialData.parentalInvolvement ? 'High' : 'Low'}
        `
            : ''
        }
        
        Provide a recruiting strategy analysis in JSON format with these fields:
        - personalityProfile: Brief assessment of athlete's personality type
        - motivationTriggers: Array of 3-4 key motivators for this athlete
        - optimalContactTime: Best time/method to reach them
        - customizedMessage: Personalized opening message (2-3 sentences)
        - probabilityScore: Likelihood of response (0-100)
        - recommendedStrategy: Specific approach strategy
      `;

      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content:
              'You are a sports recruiting expert who analyzes athlete profiles to create personalized outreach strategies. Focus on psychological insights and motivation triggers.',
          },
          { role: 'user', content: analysisPrompt },
        ],
        response_format: { type: 'json_object' },
        max_tokens: 800,
      });

      return JSON.parse(response.choices[0].message.content || '{}');
    } catch (error) {
      console.error('AI Analysis failed:', error);
      return this.getFallbackAnalysis(prospect);
    }
  }

  // Generate hyper-personalized email content
  async generatePersonalizedEmail(prospect: any, analysis: ProspectAnalysis): Promise<string> {
    try {
      const emailPrompt = `
        Create a highly personalized recruiting email for:
        
        Athlete: ${prospect.name}
        Sport: ${prospect.sport} - ${prospect.position}
        School: ${prospect.school}
        Location: ${prospect.state}
        
        Personality Profile: ${analysis.personalityProfile}
        Key Motivators: ${analysis.motivationTriggers.join(', ')}
        
        Requirements:
        - Subject line that grabs attention
        - Opening that shows you know them personally
        - Connect to their specific motivators
        - Include GAR score opportunity naturally
        - Professional but genuine tone
        - Include call-to-action
        - Keep under 150 words
        
        Format as JSON with 'subject' and 'body' fields.
      `;

      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content:
              'You are a master recruiter who writes compelling, personalized emails that athletes actually want to read and respond to.',
          },
          { role: 'user', content: emailPrompt },
        ],
        response_format: { type: 'json_object' },
        max_tokens: 600,
      });

      const emailContent = JSON.parse(response.choices[0].message.content || '{}');
      return emailContent.body || this.getFallbackEmail(prospect);
    } catch (error) {
      console.error('Email generation failed:', error);
      return this.getFallbackEmail(prospect);
    }
  }

  // Analyze best contact timing based on social media patterns
  async optimizeContactTiming(prospect: any): Promise<{
    bestDays: string[];
    bestTimes: string[];
    reasoning: string;
  }> {
    // Analyze patterns based on sport, location, and social activity
    const timeZones = {
      CA: 'PST',
      TX: 'CST',
      FL: 'EST',
      NY: 'EST',
    };

    const sportPatterns = {
      Basketball: { season: 'winter', trainingTimes: ['after school', 'evening'] },
      Football: { season: 'fall', trainingTimes: ['morning', 'afternoon'] },
      Baseball: { season: 'spring', trainingTimes: ['afternoon', 'evening'] },
      Soccer: { season: 'spring/fall', trainingTimes: ['evening'] },
    };

    const pattern = sportPatterns[prospect.sport as keyof typeof sportPatterns];
    const timezone = timeZones[prospect.state as keyof typeof timeZones] || 'EST';

    return {
      bestDays: ['Tuesday', 'Wednesday', 'Thursday'], // Avoid Monday/Friday
      bestTimes: pattern?.trainingTimes || ['evening'],
      reasoning: `${prospect.sport} athletes typically check messages ${pattern?.trainingTimes.join(' or ')} in ${timezone}`,
    };
  }

  // Score prospects for prioritization
  async scoreProspectPriority(prospect: any): Promise<number> {
    let score = 50; // Base score

    // Ranking bonus
    if (prospect.nationalRanking) {
      if (prospect.nationalRanking <= 100) score += 30;
      else if (prospect.nationalRanking <= 500) score += 15;
    }

    // Social media following bonus
    if (prospect.followers) {
      if (prospect.followers > 10000) score += 20;
      else if (prospect.followers > 1000) score += 10;
    }

    // State recruiting hotspots
    const hotspots = ['CA', 'TX', 'FL', 'GA', 'NY'];
    if (hotspots.includes(prospect.state)) score += 10;

    // Recruiting status
    if (prospect.recruitingStatus === 'open') score += 25;
    else if (prospect.recruitingStatus === 'committed') score -= 20;

    return Math.min(100, Math.max(0, score));
  }

  // Batch analyze multiple prospects efficiently
  async batchAnalyzeProspects(prospects: any[]): Promise<Map<string, ProspectAnalysis>> {
    const analyses = new Map();
    const batchSize = 5;

    for (let i = 0; i < prospects.length; i += batchSize) {
      const batch = prospects.slice(i, i + batchSize);

      const batchPromises = batch.map(async (prospect) => {
        const analysis = await this.analyzeProspect(prospect);
        analyses.set(prospect.id, analysis);

        // Add small delay to respect API limits
        await new Promise((resolve) => setTimeout(resolve, 200));

        return analysis;
      });

      await Promise.all(batchPromises);
    }

    return analyses;
  }

  // Fallback analysis when AI fails
  private getFallbackAnalysis(prospect: any): ProspectAnalysis {
    const triggers = {
      Basketball: ['college exposure', 'skill development', 'competition'],
      Football: ['scholarship opportunities', 'strength training', 'film study'],
      Soccer: ['technical skills', 'tactical awareness', 'fitness'],
      Baseball: ['hitting mechanics', 'pitching development', 'recruiting showcases'],
    };

    return {
      personalityProfile: 'Dedicated athlete focused on improvement',
      motivationTriggers: triggers[prospect.sport as keyof typeof triggers] || [
        'improvement',
        'competition',
        'exposure',
      ],
      optimalContactTime: 'Evening (7-9 PM)',
      customizedMessage: `Hi ${prospect.name}, I noticed your strong ${prospect.sport} performance at ${prospect.school}. Have you explored your GAR potential yet?`,
      probabilityScore: 60,
      recommendedStrategy: 'Direct approach focusing on skill development and opportunity',
    };
  }

  private getFallbackEmail(prospect: any): string {
    return `Hi ${prospect.name}!

I've been following ${prospect.sport} talent in ${prospect.state}, and your performance at ${prospect.school} really stands out.

Quick question: Have you calculated your GAR (Growth & Ability Rating) score? Many ${prospect.position}s are using it to get noticed by college coaches.

It's free and takes 2 minutes: go4itsports.com/gar-analysis

Worth checking out!

Best,
Go4It Sports Team`;
  }

  // Generate A/B testing variations
  async generateEmailVariations(prospect: any, count: number = 3): Promise<string[]> {
    const variations = [];
    const approaches = [
      'Direct and professional',
      'Casual and friendly',
      'Achievement-focused',
      'Opportunity-focused',
    ];

    for (let i = 0; i < count; i++) {
      try {
        const prompt = `
          Create a recruiting email for ${prospect.name} (${prospect.sport} at ${prospect.school}).
          Use a ${approaches[i % approaches.length]} approach.
          Keep it under 100 words and include GAR score mention.
          Make it sound authentic and personal.
        `;

        const response = await openai.chat.completions.create({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: "Write authentic recruiting emails that don't sound like templates.",
            },
            { role: 'user', content: prompt },
          ],
          max_tokens: 300,
        });

        variations.push(response.choices[0].message.content || this.getFallbackEmail(prospect));

        // Rate limit delay
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error) {
        variations.push(this.getFallbackEmail(prospect));
      }
    }

    return variations;
  }
}

// Prospect Intelligence Dashboard Data
export class ProspectIntelligence {
  static async getIntelligenceReport(prospectId: string) {
    // This would integrate with social media APIs in production
    return {
      socialMediaActivity: {
        platforms: ['Instagram', 'TikTok', 'Twitter'],
        totalFollowers: 2400,
        engagementRate: 8.2,
        recentPosts: ['Training highlight reel', 'Game day prep', 'Workout session'],
        peakActivityTimes: ['6-7 PM', '9-10 PM'],
      },
      parentalInvolvement: {
        level: 'High',
        activeParents: ['Mother manages Instagram', 'Father shares game highlights'],
        familyValues: ['Education first', 'Character building', 'Team loyalty'],
      },
      competitiveProfile: {
        strengths: ['Work ethic', 'Coachability', 'Leadership'],
        improvements: ['Consistency', 'Confidence'],
        recruitingFit: 'Division I potential with right development',
      },
    };
  }
}
