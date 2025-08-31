// Viral Content Generation System
import OpenAI from 'openai';
import { createCanvas, loadImage } from 'canvas';
import sharp from 'sharp';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface ViralContentTemplate {
  id: string;
  name: string;
  description: string;
  platform: string;
  engagement_rate: number;
  template: string;
  hashtags: string[];
  hooks: string[];
}

export class ViralContentGenerator {
  private templates: ViralContentTemplate[] = [
    {
      id: 'transformation',
      name: 'Before/After Transformation',
      description: 'Shows dramatic improvement using platform',
      platform: 'instagram',
      engagement_rate: 12.8,
      template:
        "This {sport} player's GAR score went from {before} to {after} in just {timeframe}! 🔥\n\n{specific_improvement}\n\nReady to unlock YOUR potential? 👆",
      hashtags: ['#Transformation', '#AthleteGrowth', '#GAR', '#SportsImprovement'],
      hooks: ['This changed everything 👇', 'Plot twist:', 'What happens next will blow your mind'],
    },
    {
      id: 'secret_revealed',
      name: 'Industry Secret Revealed',
      description: 'Shares insider knowledge about recruiting',
      platform: 'tiktok',
      engagement_rate: 15.3,
      template:
        "College coaches DON'T want you to know this recruiting secret...\n\n{secret_info}\n\n(Save this post before it gets taken down 🤫)",
      hashtags: ['#RecruitingSecret', '#CollegeCoaches', '#SportsRecruitment', '#AthleteHacks'],
      hooks: [
        'Coaches hate this trick',
        "This is why you're not getting recruited",
        "The secret they don't tell you",
      ],
    },
    {
      id: 'day_in_life',
      name: 'Day in Life of Recruited Athlete',
      description: 'Shows lifestyle of successful platform user',
      platform: 'instagram',
      engagement_rate: 11.7,
      template:
        'POV: You used Go4It Sports and now live like this 👇\n\n6 AM: Wake up to scholarship offers\n8 AM: Train with D1 mindset\n2 PM: Study at Go4It Academy\n6 PM: Review GAR improvements\n\nThis could be your life. Start free: Link in bio',
      hashtags: ['#DayInTheLife', '#ScholarshipLife', '#D1Athlete', '#Success'],
      hooks: ['This is what success looks like', 'POV: You made it', 'Living the dream because'],
    },
    {
      id: 'mistake_warning',
      name: 'Common Recruiting Mistakes',
      description: 'Warns about recruitment pitfalls',
      platform: 'twitter',
      engagement_rate: 9.4,
      template:
        "5 recruiting mistakes that cost athletes scholarships:\n\n1. {mistake_1}\n2. {mistake_2}\n3. {mistake_3}\n4. {mistake_4}\n5. {mistake_5}\n\nDon't let this be you. Get your GAR score FREE 👇",
      hashtags: ['#RecruitingMistakes', '#CollegeRecruitment', '#AthleteAdvice'],
      hooks: [
        "Don't make these mistakes",
        'This will ruin your chances',
        'Coaches immediately reject athletes who',
      ],
    },
  ];

  async generateViralContent(
    sport: string,
    platform: string,
    contentType: string = 'transformation',
    customData?: any,
  ): Promise<{ content: string; hashtags: string[]; hooks: string[] }> {
    try {
      const template = this.templates.find((t) => t.id === contentType) || this.templates[0];

      const prompt = `
        Create viral ${platform} content for Go4It Sports using this template structure:
        ${template.template}
        
        Sport: ${sport}
        Platform: ${platform}
        Target: High school athletes and parents
        
        Context about Go4It Sports:
        - GAR Analysis: AI system that rates athlete potential (0-100 score)
        - StarPath: Gamified skill development system
        - Academy: K-12 education with sports focus
        - Recruitment: Automated college recruitment assistance
        - AI Coach: Personal AI coaching system
        
        Requirements:
        - Use proven viral hooks and psychology
        - Include specific, believable examples
        - Create urgency and FOMO
        - Sound authentic, not salesy
        - Include call-to-action
        - ${platform === 'tiktok' ? 'Under 150 characters' : platform === 'twitter' ? 'Under 280 characters' : 'Engaging caption'}
        
        Fill in template variables with realistic data:
        - Use actual athlete improvements (GAR: 67→89, etc.)
        - Include specific achievements
        - Reference real scenarios
        
        Return JSON: {
          "content": "final post content",
          "hashtags": ["array of hashtags"],
          "hooks": ["array of hook variations"],
          "engagement_prediction": number
        }
      `;

      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content:
              'You are a viral content expert who creates engaging social media content that athletes and parents actually want to share. Focus on authentic storytelling and proven viral patterns.',
          },
          { role: 'user', content: prompt },
        ],
        response_format: { type: 'json_object' },
        max_tokens: 800,
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');

      return {
        content: result.content || template.template,
        hashtags: result.hashtags || template.hashtags,
        hooks: result.hooks || template.hooks,
      };
    } catch (error) {
      console.error('Viral content generation failed:', error);
      return this.getFallbackContent(sport, platform, contentType);
    }
  }

  async createViralImageTemplate(
    text: string,
    sport: string,
    templateType: string = 'before-after',
  ): Promise<Buffer> {
    const width = 1080;
    const height = 1080;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    if (templateType === 'before-after') {
      // Before/After template
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.fillRect(50, 150, width - 100, height - 300);

      // "BEFORE" section
      ctx.fillStyle = '#ff4757';
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('BEFORE', width * 0.25, 250);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 72px Arial';
      ctx.fillText('67', width * 0.25, 350);

      ctx.font = '32px Arial';
      ctx.fillText('GAR Score', width * 0.25, 400);

      // VS divider
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 48px Arial';
      ctx.fillText('VS', width * 0.5, 350);

      // "AFTER" section
      ctx.fillStyle = '#2ed573';
      ctx.font = 'bold 48px Arial';
      ctx.fillText('AFTER', width * 0.75, 250);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 72px Arial';
      ctx.fillText('89', width * 0.75, 350);

      ctx.font = '32px Arial';
      ctx.fillText('GAR Score', width * 0.75, 400);

      // Bottom text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 36px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('in just 6 weeks using Go4It Sports', width / 2, 500);
    }

    if (templateType === 'secret-revealed') {
      // Secret revealed template with eye-catching design
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.fillRect(80, 200, width - 160, height - 400);

      ctx.fillStyle = '#ffa502';
      ctx.font = 'bold 56px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('🤫 SECRET', width / 2, 280);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 48px Arial';
      ctx.fillText('College Coaches', width / 2, 350);
      ctx.fillText("Don't Want You", width / 2, 410);
      ctx.fillText('To Know This...', width / 2, 470);

      ctx.font = '32px Arial';
      ctx.fillText('GAR Analysis reveals your TRUE potential', width / 2, 550);
    }

    // Add Go4It Sports branding
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Go4It Sports', 50, height - 100);

    // Add sport icon/emoji based on sport
    const sportEmojis = {
      Basketball: '🏀',
      Football: '🏈',
      Soccer: '⚽',
      Baseball: '⚾',
      Track: '🏃‍♂️',
    };

    ctx.font = '64px Arial';
    ctx.textAlign = 'right';
    ctx.fillText(sportEmojis[sport as keyof typeof sportEmojis] || '⭐', width - 50, 100);

    return canvas.toBuffer('image/png');
  }

  async generateInstagramCarousel(
    topic: string,
    sport: string,
    slideCount: number = 5,
  ): Promise<Buffer[]> {
    const slides = [];
    const slideTopics = await this.generateCarouselSlides(topic, sport, slideCount);

    for (let i = 0; i < slideCount; i++) {
      const slide = await this.createCarouselSlide(
        slideTopics[i] || `Slide ${i + 1}`,
        sport,
        i + 1,
        slideCount,
      );
      slides.push(slide);
    }

    return slides;
  }

  private async generateCarouselSlides(
    topic: string,
    sport: string,
    count: number,
  ): Promise<string[]> {
    try {
      const prompt = `
        Create ${count} Instagram carousel slide topics for "${topic}" in ${sport}.
        
        Make each slide educational, engaging, and actionable.
        Focus on recruiting tips, skill development, and athlete success strategies.
        
        Format as JSON array of strings: ["Slide 1 topic", "Slide 2 topic", ...]
      `;

      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'Create educational carousel slide topics that provide value to athletes.',
          },
          { role: 'user', content: prompt },
        ],
        response_format: { type: 'json_object' },
        max_tokens: 300,
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      return (
        result.slides ||
        Array(count)
          .fill('')
          .map((_, i) => `Tip ${i + 1}`)
      );
    } catch (error) {
      return Array(count)
        .fill('')
        .map((_, i) => `Tip ${i + 1}`);
    }
  }

  private async createCarouselSlide(
    content: string,
    sport: string,
    slideNumber: number,
    totalSlides: number,
  ): Promise<Buffer> {
    const width = 1080;
    const height = 1080;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Background
    const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'];
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, colors[slideNumber % colors.length]);
    gradient.addColorStop(1, colors[(slideNumber + 1) % colors.length]);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Slide number indicator
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.font = '24px Arial';
    ctx.textAlign = 'right';
    ctx.fillText(`${slideNumber}/${totalSlides}`, width - 40, 40);

    // Main content
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 56px Arial';
    ctx.textAlign = 'center';

    // Word wrap for content
    const words = content.split(' ');
    let line = '';
    let y = height / 2 - 100;
    const lineHeight = 70;
    const maxWidth = width - 120;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;

      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, width / 2, y);
        line = words[n] + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, width / 2, y);

    // Footer branding
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = 'bold 28px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Go4It Sports', width / 2, height - 60);

    return canvas.toBuffer('image/png');
  }

  async generateTikTokScript(
    hook: string,
    sport: string,
    duration: number = 30,
  ): Promise<{
    script: string;
    visualCues: string[];
    hashtags: string[];
    sounds: string[];
  }> {
    try {
      const prompt = `
        Create a viral ${duration}-second TikTok script for Go4It Sports.
        
        Hook: "${hook}"
        Sport: ${sport}
        Platform features: GAR Analysis, StarPath, AI Coach, Academy
        
        Requirements:
        - Start with an attention-grabbing hook (first 3 seconds)
        - Include visual transitions and engaging elements
        - End with strong call-to-action
        - Optimize for ${duration} seconds
        - Include trending elements
        
        Return JSON with:
        {
          "script": "Full script with timing cues",
          "visualCues": ["Array of visual suggestions"],
          "hashtags": ["Trending hashtags"],
          "sounds": ["Suggested trending sounds/music"]
        }
      `;

      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content:
              'Create viral TikTok scripts that capitalize on trends and engagement patterns.',
          },
          { role: 'user', content: prompt },
        ],
        response_format: { type: 'json_object' },
        max_tokens: 600,
      });

      return JSON.parse(response.choices[0].message.content || '{}');
    } catch (error) {
      return {
        script: `${hook} Here's what changed my ${sport} game forever...`,
        visualCues: ['Quick transition', 'Show before/after', 'Call to action'],
        hashtags: ['#' + sport, '#AthleteLife', '#Recruiting'],
        sounds: ['Trending upbeat music', 'Motivational audio'],
      };
    }
  }

  getViralTemplates(): ViralContentTemplate[] {
    return this.templates;
  }

  private getFallbackContent(sport: string, platform: string, type: string) {
    const fallbacks = {
      transformation: {
        content: `This ${sport} player's GAR score went from 67 to 89 in just 6 weeks! 🔥\n\nImproved shooting accuracy by 23%\nIncreased vertical jump 4 inches\nLanded 3 D1 scholarship offers\n\nReady to unlock YOUR potential? Link in bio 👆`,
        hashtags: ['#Transformation', '#' + sport, '#GAR', '#AthleteGrowth'],
        hooks: ['This changed everything', 'Plot twist', 'What happens next will blow your mind'],
      },
      secret_revealed: {
        content: `College coaches DON'T want you to know this ${sport} recruiting secret...\n\nYour GAR score matters more than your stats. Here's why: Coaches use AI now to evaluate potential, not just current performance.\n\n(Save this post before it gets taken down 🤫)`,
        hashtags: ['#RecruitingSecret', '#CollegeCoaches', '#' + sport],
        hooks: [
          'Coaches hate this trick',
          "This is why you're not getting recruited",
          "The secret they don't tell you",
        ],
      },
    };

    return fallbacks[type as keyof typeof fallbacks] || fallbacks.transformation;
  }
}
