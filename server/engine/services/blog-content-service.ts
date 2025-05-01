/**
 * Blog Content AI Service
 * 
 * Handles AI-powered blog content generation for Go4It Sports.
 * This service will eventually connect to the AI engine hosted on a private VPS.
 */

import { withRetry, logAIEngineActivity, aiEngineClient } from '../utils';
import { AI_ENGINE_CONFIG, EXTERNAL_MODEL_CONFIG } from '../config';

export interface BlogContentRequest {
  title: string;
  category: string;
  trendingTopics?: string[];
}

export interface GeneratedBlogContent {
  title: string;
  content: string;
  summary: string;
  category: string;
  tags: string[];
}

export class BlogContentService {
  /**
   * Generate a blog post using AI
   * 
   * @param request The blog content request parameters
   */
  async generateBlogPost(request: BlogContentRequest): Promise<GeneratedBlogContent | null> {
    try {
      logAIEngineActivity('generateBlogPost', { title: request.title, category: request.category });
      
      if (AI_ENGINE_CONFIG.useMockData) {
        // For development, return mock data
        // TODO: Connect to AI Engine when available
        return this.getMockBlogContent(request);
      }
      
      // This is the actual implementation that will be used when the AI Engine is available
      return await withRetry(async () => {
        const response = await aiEngineClient.post(
          `${AI_ENGINE_CONFIG.endpoints.blogContent}/generate`,
          {
            request,
            modelVersion: AI_ENGINE_CONFIG.models.blogContent
          }
        );
        
        return response.data as GeneratedBlogContent;
      });
    } catch (error) {
      logAIEngineActivity('generateBlogPost', 
        { title: request.title, category: request.category }, 
        null, 
        error as Error
      );
      console.error('Error generating blog post:', error);
      return null;
    }
  }
  
  /**
   * For development only - get mock blog content
   * This will be replaced by the actual AI Engine integration
   */
  private getMockBlogContent(request: BlogContentRequest): GeneratedBlogContent {
    // Create a deterministic but varied response based on the title and category
    const titleHash = this.simpleHash(request.title);
    const categoryHash = this.simpleHash(request.category);
    const combinedHash = titleHash + categoryHash;
    
    // Get mock title variations
    const titleVariations = [
      `The Ultimate Guide to ${request.title}`,
      `How ${request.title} is Changing Youth Sports`,
      `${request.title}: What Every Athlete Needs to Know`,
      `5 Key Insights About ${request.title}`,
      `${request.title}: Trends and Opportunities`
    ];
    
    // Select a title variation based on hash
    const titleIndex = combinedHash % titleVariations.length;
    const mockTitle = titleVariations[titleIndex];
    
    // Generate mock tags
    const allPossibleTags = [
      'athlete development', 'coaching', 'training', 'youth sports',
      'high school', 'college recruiting', 'sports performance', 
      'mental training', 'nutrition', 'strength and conditioning',
      'soccer', 'basketball', 'football', 'baseball', 'volleyball',
      'sports technology', 'analytics', 'combines', 'showcase events',
      'transfer portal', 'NCAA', 'parents guide', 'sports medicine',
      'injury prevention', 'recovery', 'neurodivergent athletes', 'ADHD',
      'sports psychology', 'social media', 'video analysis', 'highlight reels'
    ];
    
    // Select 3-5 tags based on hash
    const tagCount = 3 + (combinedHash % 3); // 3 to 5 tags
    const mockTags: string[] = [];
    
    // Always include the category as a tag
    mockTags.push(request.category);
    
    // Add related tags based on the hash
    for (let i = 0; i < tagCount; i++) {
      const tagIndex = (combinedHash + i * 7) % allPossibleTags.length;
      const tag = allPossibleTags[tagIndex];
      
      // Avoid duplicates
      if (!mockTags.includes(tag)) {
        mockTags.push(tag);
      }
    }
    
    // Create a mock summary based on the title
    const mockSummary = `This comprehensive guide explores ${request.title.toLowerCase()}, offering valuable insights for athletes, coaches, and parents. Learn the latest strategies, techniques, and trends that can help young athletes excel in today's competitive sports landscape.`;
    
    // Generate mock content sections
    const sections = [
      this.getMockSection("Introduction", request.title, 1),
      this.getMockSection("Understanding the Basics", request.title, 2),
      this.getMockSection("Key Strategies", request.title, 3),
      this.getMockSection("Real-World Applications", request.title, 4),
      this.getMockSection("Expert Tips and Advice", request.title, 5),
      this.getMockSection("Conclusion", request.title, 6)
    ];
    
    // Combine sections into full content
    const mockContent = sections.join("\n\n");
    
    return {
      title: mockTitle,
      content: mockContent,
      summary: mockSummary,
      category: request.category,
      tags: mockTags
    };
  }
  
  /**
   * Generate a mock content section with paragraphs
   */
  private getMockSection(heading: string, topic: string, sectionIndex: number): string {
    const paragraphCount = 2 + (sectionIndex % 2); // 2-3 paragraphs per section
    const paragraphs: string[] = [];
    
    for (let i = 0; i < paragraphCount; i++) {
      // Generate paragraph based on section and paragraph index
      const paragraph = this.getMockParagraph(topic, sectionIndex, i);
      paragraphs.push(paragraph);
    }
    
    return `## ${heading}\n\n${paragraphs.join("\n\n")}`;
  }
  
  /**
   * Generate a mock paragraph with realistic text
   */
  private getMockParagraph(topic: string, sectionIndex: number, paragraphIndex: number): string {
    // Library of sentence templates that can be customized with the topic
    const sentenceTemplates = [
      `${topic} has become increasingly important in youth sports development.`,
      `Coaches are finding new ways to incorporate ${topic.toLowerCase()} into their training regimens.`,
      `Athletes who master ${topic.toLowerCase()} often see significant improvements in performance.`,
      `Parents should understand how ${topic.toLowerCase()} affects their child's athletic development.`,
      `There are several approaches to implementing ${topic.toLowerCase()} effectively.`,
      `Research shows that ${topic.toLowerCase()} can lead to better outcomes in competition.`,
      `Developing a structured approach to ${topic.toLowerCase()} is crucial for long-term success.`,
      `Many athletes struggle with aspects of ${topic.toLowerCase()} without proper guidance.`,
      `The best programs integrate ${topic.toLowerCase()} with other development strategies.`,
      `Experts recommend starting ${topic.toLowerCase()} training at an appropriate age for the sport.`,
      `Technology now offers new ways to enhance ${topic.toLowerCase()} for young athletes.`,
      `Understanding the science behind ${topic.toLowerCase()} gives athletes a competitive edge.`,
      `Regular assessment of ${topic.toLowerCase()} skills helps track progress effectively.`,
      `College recruiters increasingly look for athletes who excel in ${topic.toLowerCase()}.`,
      `Mental aspects of ${topic.toLowerCase()} are often overlooked but equally important.`
    ];
    
    // Select 4-6 sentences based on section and paragraph
    const sentenceCount = 4 + ((sectionIndex + paragraphIndex) % 3); // 4-6 sentences
    const selectedSentences: string[] = [];
    
    for (let i = 0; i < sentenceCount; i++) {
      const sentenceIndex = (sectionIndex * 5 + paragraphIndex * 3 + i) % sentenceTemplates.length;
      selectedSentences.push(sentenceTemplates[sentenceIndex]);
    }
    
    return selectedSentences.join(" ");
  }
  
  /**
   * Simple hash function for string to number
   * Used to create deterministic but varied mock content
   */
  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }
}