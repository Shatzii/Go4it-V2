// AI Journalism Engine for Automated Athlete Articles
// Generates high-quality articles, news pieces, and content about discovered athletes

import OpenAI from 'openai';
import { AthleteProfile } from './intelligent-athlete-discovery';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface Article {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
  excerpt: string;
  author: string;
  category: 'news' | 'profile' | 'analysis' | 'recruitment' | 'spotlight';
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  featuredImage?: string;
  athleteId: string;
  publishedAt: Date;
  readingTime: number;
  engagement: {
    likes: number;
    shares: number;
    comments: number;
  };
}

interface ArticleTemplate {
  id: string;
  name: string;
  category: string;
  structure: string[];
  tone: string;
  targetLength: number;
  seoFocus: string[];
}

export class AIJournalismEngine {
  private templates: ArticleTemplate[] = [
    {
      id: 'rising_star_profile',
      name: 'Rising Star Profile',
      category: 'profile',
      structure: [
        'hook',
        'background',
        'stats_highlights',
        'key_achievements',
        'recruitment_status',
        'future_outlook',
        'call_to_action'
      ],
      tone: 'inspirational, professional',
      targetLength: 1200,
      seoFocus: ['rising star', 'high school athlete', 'recruiting']
    },
    {
      id: 'recruitment_update',
      name: 'Recruitment Update',
      category: 'recruitment',
      structure: [
        'breaking_news_hook',
        'commitment_details',
        'recruitment_process',
        'coach_reactions',
        'program_impact',
        'future_implications'
      ],
      tone: 'exciting, informative',
      targetLength: 800,
      seoFocus: ['college commitment', 'recruiting news', 'scholarship']
    },
    {
      id: 'performance_analysis',
      name: 'Performance Analysis',
      category: 'analysis',
      structure: [
        'performance_summary',
        'stat_breakdown',
        'strengths_analysis',
        'improvement_areas',
        'comparisons',
        'projections'
      ],
      tone: 'analytical, objective',
      targetLength: 1000,
      seoFocus: ['performance analysis', 'athlete stats', 'scouting report']
    },
    {
      id: 'spotlight_feature',
      name: 'Spotlight Feature',
      category: 'spotlight',
      structure: [
        'compelling_hook',
        'personal_story',
        'athletic_journey',
        'unique_qualities',
        'community_impact',
        'inspiring_message'
      ],
      tone: 'narrative, emotional',
      targetLength: 1500,
      seoFocus: ['athlete spotlight', 'inspiring story', 'student athlete']
    },
    {
      id: 'recruiting_news',
      name: 'Recruiting News',
      category: 'news',
      structure: [
        'news_lead',
        'key_details',
        'context_background',
        'stakeholder_quotes',
        'industry_reaction',
        'what_next'
      ],
      tone: 'journalistic, factual',
      targetLength: 600,
      seoFocus: ['recruiting news', 'college sports', 'athlete updates']
    }
  ];

  // Generate article about an athlete
  async generateAthleteArticle(
    athlete: AthleteProfile,
    articleType: string = 'rising_star_profile',
    style: WritingStyle = 'professional'
  ): Promise<Article> {
    const template = this.templates.find(t => t.id === articleType) || this.templates[0];

    const prompt = this.buildArticlePrompt(athlete, template, style);

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are a professional sports journalist writing for Go4it Sports. Create compelling, well-researched articles that engage readers and provide valuable insights about high school athletes. Focus on storytelling, accuracy, and SEO optimization.`
        },
        { role: 'user', content: prompt }
      ],
      response_format: { type: 'json_object' },
      max_tokens: 3000,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');

    const article: Article = {
      id: `article_${athlete.id}_${Date.now()}`,
      title: result.title || this.generateFallbackTitle(athlete, articleType),
      subtitle: result.subtitle,
      content: result.content || '',
      excerpt: result.excerpt || result.content?.substring(0, 150) + '...',
      author: 'Go4it Sports Staff',
      category: template.category as any,
      tags: result.tags || this.generateTags(athlete, articleType),
      seoTitle: result.seoTitle || result.title,
      seoDescription: result.seoDescription || result.excerpt,
      athleteId: athlete.id,
      publishedAt: new Date(),
      readingTime: this.calculateReadingTime(result.content || ''),
      engagement: {
        likes: 0,
        shares: 0,
        comments: 0
      }
    };

    return article;
  }

  // Build comprehensive article prompt
  private buildArticlePrompt(
    athlete: AthleteProfile,
    template: ArticleTemplate,
    style: WritingStyle
  ): string {
    return `
Create a compelling ${template.category} article about this high school athlete for Go4it Sports:

ATHLETE PROFILE:
- Name: ${athlete.name}
- Sport: ${athlete.sport}
- Position: ${athlete.position}
- School: ${athlete.school}
- City/State: ${athlete.city || 'N/A'}, ${athlete.state || 'N/A'}
- Graduation Year: ${athlete.graduationYear}
- Height: ${athlete.height || 'N/A'}
- Weight: ${athlete.weight || 'N/A'} lbs

STATISTICS:
${Object.entries(athlete.stats).map(([key, value]) => `- ${key}: ${value}`).join('\n')}

RANKINGS:
${Object.entries(athlete.rankings).map(([key, value]) => `- ${key}: ${value}`).join('\n')}

ACHIEVEMENTS:
${athlete.achievements.map(achievement => `- ${achievement}`).join('\n')}

RECRUITMENT STATUS:
- Status: ${athlete.recruitment.status}
- Offers: ${athlete.recruitment.offers?.join(', ') || 'None'}
- Commitment: ${athlete.recruitment.commitment || 'None'}
- Stage: ${athlete.recruitment.recruitmentStage}

SOCIAL MEDIA:
${Object.entries(athlete.socialMedia).map(([platform, handle]) => `- ${platform}: ${handle}`).join('\n')}

ARTICLE REQUIREMENTS:
- Type: ${template.name}
- Style: ${style}
- Target Length: ${template.targetLength} words
- Tone: ${template.tone}
- Structure: ${template.structure.join(', ')}

SEO FOCUS:
${template.seoFocus.map(focus => `- ${focus}`).join('\n')}

CONTENT GUIDELINES:
1. Start with a compelling hook that grabs attention
2. Include specific stats and achievements with context
3. Provide recruitment background and implications
4. Use quotes from coaches, family, or the athlete when possible
5. Include analysis of potential and future outlook
6. End with a strong call-to-action
7. Optimize for search engines with natural keyword placement
8. Maintain journalistic integrity and accuracy

Return JSON with:
{
  "title": "SEO-optimized article title",
  "subtitle": "Engaging subtitle",
  "content": "Full article content in HTML format",
  "excerpt": "Brief summary for previews",
  "tags": ["array", "of", "relevant", "tags"],
  "seoTitle": "Meta title for SEO",
  "seoDescription": "Meta description for SEO"
}
    `;
  }

  // Generate multiple articles for different platforms
  async generateMultiPlatformArticles(
    athlete: AthleteProfile,
    platforms: ('website' | 'newsletter' | 'social')[] = ['website', 'newsletter', 'social']
  ): Promise<Record<string, Article>> {
    const articles: Record<string, Article> = {};

    for (const platform of platforms) {
      const articleType = this.getArticleTypeForPlatform(platform);
      const article = await this.generateAthleteArticle(athlete, articleType);

      // Adapt content for platform
      article.content = await this.adaptContentForPlatform(article.content, platform);
      article.title = this.adaptTitleForPlatform(article.title, platform);

      articles[platform] = article;
    }

    return articles;
  }

  // Generate news article about recruitment development
  async generateRecruitmentNews(
    athlete: AthleteProfile,
    development: 'commitment' | 'offer' | 'visit' | 'withdrawal',
    details: any
  ): Promise<Article> {
    const prompt = `
Create breaking news about this recruitment development:

ATHLETE: ${athlete.name} (${athlete.position}, ${athlete.school})
DEVELOPMENT: ${development}
DETAILS: ${JSON.stringify(details)}

Write a news-style article that:
1. Leads with the most important information
2. Provides context about the athlete's recruitment
3. Includes reactions and implications
4. Follows journalistic standards
5. Is optimized for social media sharing

Return in JSON format with title, content, and excerpt.
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      max_tokens: 1500,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');

    return {
      id: `news_${athlete.id}_${Date.now()}`,
      title: result.title,
      content: result.content,
      excerpt: result.excerpt,
      author: 'Go4it Sports News',
      category: 'news',
      tags: ['recruiting', 'news', athlete.sport.toLowerCase()],
      seoTitle: result.title,
      seoDescription: result.excerpt,
      athleteId: athlete.id,
      publishedAt: new Date(),
      readingTime: this.calculateReadingTime(result.content),
      engagement: { likes: 0, shares: 0, comments: 0 }
    };
  }

  // Generate spotlight series articles
  async generateSpotlightSeries(
    athletes: AthleteProfile[],
    seriesTitle: string = 'Rising Stars'
  ): Promise<Article[]> {
    const articles: Article[] = [];

    // Generate series introduction
    const introArticle = await this.generateSeriesIntroduction(athletes, seriesTitle);
    articles.push(introArticle);

    // Generate individual spotlights
    for (const athlete of athletes) {
      const spotlight = await this.generateAthleteArticle(athlete, 'spotlight_feature');
      articles.push(spotlight);
    }

    // Generate series conclusion
    const conclusionArticle = await this.generateSeriesConclusion(athletes, seriesTitle);
    articles.push(conclusionArticle);

    return articles;
  }

  // Generate series introduction article
  private async generateSeriesIntroduction(
    athletes: AthleteProfile[],
    seriesTitle: string
  ): Promise<Article> {
    const prompt = `
Create an introduction article for the "${seriesTitle}" series featuring these athletes:

ATHLETES:
${athletes.map(a => `- ${a.name} (${a.position}, ${a.school})`).join('\n')}

Write an engaging introduction that:
1. Sets up the theme of the series
2. Introduces each featured athlete briefly
3. Builds excitement for the content
4. Includes calls-to-action for readers

Return in JSON format.
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      max_tokens: 1000,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');

    return {
      id: `series_intro_${Date.now()}`,
      title: `${seriesTitle}: Meet the Rising Stars`,
      content: result.content,
      excerpt: result.excerpt,
      author: 'Go4it Sports Staff',
      category: 'spotlight',
      tags: ['series', 'rising stars', 'spotlight'],
      seoTitle: `${seriesTitle} - Go4it Sports`,
      seoDescription: result.excerpt,
      athleteId: athletes[0]?.id || '',
      publishedAt: new Date(),
      readingTime: this.calculateReadingTime(result.content),
      engagement: { likes: 0, shares: 0, comments: 0 }
    };
  }

  // Generate series conclusion
  private async generateSeriesConclusion(
    athletes: AthleteProfile[],
    seriesTitle: string
  ): Promise<Article> {
    const prompt = `
Create a conclusion article for the "${seriesTitle}" series that:
1. Summarizes key themes and takeaways
2. Looks forward to future developments
3. Encourages reader engagement
4. Provides final thoughts on these athletes' potential

Return in JSON format.
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      max_tokens: 800,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');

    return {
      id: `series_conclusion_${Date.now()}`,
      title: `${seriesTitle}: Looking Ahead`,
      content: result.content,
      excerpt: result.excerpt,
      author: 'Go4it Sports Staff',
      category: 'analysis',
      tags: ['series', 'conclusion', 'future outlook'],
      seoTitle: `${seriesTitle} Conclusion - Go4it Sports`,
      seoDescription: result.excerpt,
      athleteId: '',
      publishedAt: new Date(),
      readingTime: this.calculateReadingTime(result.content),
      engagement: { likes: 0, shares: 0, comments: 0 }
    };
  }

  // SEO optimization for articles
  async optimizeForSEO(article: Article, keywords: string[]): Promise<Article> {
    const prompt = `
Optimize this article for SEO with these target keywords: ${keywords.join(', ')}

ORIGINAL TITLE: ${article.title}
ORIGINAL CONTENT: ${article.content.substring(0, 1000)}...

Provide SEO optimizations:
1. Better title with keywords
2. Meta description
3. Keyword placement suggestions
4. Internal/external link suggestions
5. Image alt text suggestions

Return in JSON format.
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      max_tokens: 800,
    });

    const optimizations = JSON.parse(response.choices[0].message.content || '{}');

    return {
      ...article,
      title: optimizations.title || article.title,
      seoTitle: optimizations.seoTitle || article.seoTitle,
      seoDescription: optimizations.seoDescription || article.seoDescription,
      content: this.applySEOOptimizations(article.content, optimizations),
    };
  }

  // Adapt content for different platforms
  private async adaptContentForPlatform(content: string, platform: string): Promise<string> {
    switch (platform) {
      case 'newsletter':
        return this.convertToNewsletterFormat(content);
      case 'social':
        return this.convertToSocialFormat(content);
      case 'website':
      default:
        return content;
    }
  }

  // Convert to newsletter format
  private convertToNewsletterFormat(content: string): string {
    // Add newsletter-specific formatting
    return content
      .replace(/<h1>/g, '<h1 style="color: #1e40af; font-size: 28px;">')
      .replace(/<h2>/g, '<h2 style="color: #374151; font-size: 24px;">')
      .replace(/<p>/g, '<p style="line-height: 1.6; margin-bottom: 16px;">');
  }

  // Convert to social media format
  private convertToSocialFormat(content: string): Promise<string> {
    // Extract key points for social sharing
    const prompt = `Convert this article into social media friendly content. Extract the most shareable quotes, stats, and key points. Keep it under 200 characters.`;

    return openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 100,
    }).then(response => response.choices[0].message.content || content.substring(0, 200));
  }

  // Helper methods
  private generateFallbackTitle(athlete: AthleteProfile, articleType: string): string {
    const typeTitles = {
      rising_star_profile: `${athlete.name}: The Next Big Thing in ${athlete.sport}`,
      recruitment_update: `${athlete.name} Makes College Commitment Decision`,
      performance_analysis: `${athlete.name} Performance Breakdown: What Scouts Are Saying`,
      spotlight_feature: `Spotlight on ${athlete.name}: A ${athlete.sport} Sensation`,
      recruiting_news: `Breaking: ${athlete.name} Updates Recruitment Status`
    };

    return typeTitles[articleType as keyof typeof typeTitles] || `${athlete.name} - ${athlete.sport} Update`;
  }

  private generateTags(athlete: AthleteProfile, articleType: string): string[] {
    const baseTags = [athlete.sport.toLowerCase(), 'high school', 'athlete'];

    const typeTags = {
      rising_star_profile: ['rising star', 'talent', 'future'],
      recruitment_update: ['recruiting', 'college', 'commitment'],
      performance_analysis: ['stats', 'analysis', 'scouting'],
      spotlight_feature: ['spotlight', 'inspiring', 'story'],
      recruiting_news: ['news', 'breaking', 'update']
    };

    return [...baseTags, ...(typeTags[articleType as keyof typeof typeTags] || [])];
  }

  private getArticleTypeForPlatform(platform: string): string {
    const platformTypes = {
      website: 'rising_star_profile',
      newsletter: 'spotlight_feature',
      social: 'recruiting_news'
    };

    return platformTypes[platform as keyof typeof platformTypes] || 'rising_star_profile';
  }

  private adaptTitleForPlatform(title: string, platform: string): string {
    switch (platform) {
      case 'social':
        return title.length > 100 ? title.substring(0, 97) + '...' : title;
      case 'newsletter':
        return `📧 ${title}`;
      default:
        return title;
    }
  }

  private calculateReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  }

  private applySEOOptimizations(content: string, optimizations: any): string {
    // Apply keyword optimizations to content
    let optimizedContent = content;

    if (optimizations.keywordPlacements) {
      // Apply suggested keyword placements
      optimizations.keywordPlacements.forEach((placement: any) => {
        // This would implement specific SEO optimizations
      });
    }

    return optimizedContent;
  }

  // Generate article series
  async generateArticleSeries(
    athletes: AthleteProfile[],
    seriesTheme: string,
    numberOfArticles: number = 5
  ): Promise<Article[]> {
    const series: Article[] = [];

    // Generate series overview
    const overview = await this.generateSeriesOverview(athletes, seriesTheme);
    series.push(overview);

    // Generate individual articles
    const selectedAthletes = athletes.slice(0, numberOfArticles - 2); // Reserve 2 for intro/conclusion

    for (const athlete of selectedAthletes) {
      const article = await this.generateAthleteArticle(athlete, 'spotlight_feature');
      series.push(article);
    }

    // Generate conclusion
    const conclusion = await this.generateSeriesConclusion(athletes, seriesTheme);
    series.push(conclusion);

    return series;
  }

  // Generate series overview
  private async generateSeriesOverview(
    athletes: AthleteProfile[],
    theme: string
  ): Promise<Article> {
    const prompt = `
Create an overview article for a series about "${theme}" featuring ${athletes.length} talented athletes.

ATHLETES FEATURED:
${athletes.map(a => `- ${a.name} (${a.sport}, ${a.school})`).join('\n')}

Write an engaging overview that:
1. Introduces the series theme
2. Teases each featured athlete
3. Explains the selection criteria
4. Builds anticipation for individual profiles

Return in JSON format with title, content, and excerpt.
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      max_tokens: 1200,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');

    return {
      id: `series_overview_${Date.now()}`,
      title: `${theme}: A Series on Rising Athletic Talent`,
      content: result.content,
      excerpt: result.excerpt,
      author: 'Go4it Sports Staff',
      category: 'spotlight',
      tags: ['series', 'overview', theme.toLowerCase().replace(/\s+/g, '-')],
      seoTitle: `${theme} Series Overview - Go4it Sports`,
      seoDescription: result.excerpt,
      athleteId: '',
      publishedAt: new Date(),
      readingTime: this.calculateReadingTime(result.content),
      engagement: { likes: 0, shares: 0, comments: 0 }
    };
  }

  // Get article analytics
  async getArticleAnalytics(articleId: string): Promise<any> {
    // This would integrate with analytics services
    return {
      views: Math.floor(Math.random() * 10000),
      uniqueVisitors: Math.floor(Math.random() * 5000),
      averageTimeOnPage: Math.floor(Math.random() * 300) + 60,
      bounceRate: Math.floor(Math.random() * 30) + 20,
      socialShares: Math.floor(Math.random() * 500),
      conversions: Math.floor(Math.random() * 50)
    };
  }

  // Generate content calendar
  async generateContentCalendar(
    athletes: AthleteProfile[],
    timeframe: 'week' | 'month' = 'week'
  ): Promise<any[]> {
    const calendar = [];
    const days = timeframe === 'week' ? 7 : 30;

    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);

      // Select athlete for the day
      const athlete = athletes[i % athletes.length];

      calendar.push({
        date,
        athlete: athlete.name,
        articleType: ['profile', 'analysis', 'news'][i % 3],
        platforms: ['website', 'social', 'newsletter'],
        priority: i < 3 ? 'high' : 'medium'
      });
    }

    return calendar;
  }
}

type WritingStyle = 'professional' | 'casual' | 'inspirational' | 'analytical';

export default AIJournalismEngine;
