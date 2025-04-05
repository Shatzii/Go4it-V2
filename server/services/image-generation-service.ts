import { OpenAI } from 'openai';
import * as fs from 'fs';
import * as path from 'path';
import { openAIService } from './openai-service';
import axios from 'axios';

/**
 * Service for generating images related to blog posts
 */
export class ImageGenerationService {
  private openai: OpenAI | null = null;
  private uploadDir: string;

  constructor() {
    this.uploadDir = path.join(process.cwd(), 'uploads', 'blog-images');
    this.ensureUploadDirExists();
  }

  /**
   * Ensure the upload directory exists
   */
  private ensureUploadDirExists() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
      console.log(`Created directory: ${this.uploadDir}`);
    }
  }

  /**
   * Get the OpenAI client
   */
  private async getOpenAIClient(): Promise<OpenAI> {
    if (!this.openai) {
      try {
        this.openai = await openAIService.getClient();
      } catch (error) {
        console.error('Error getting OpenAI client:', error);
        throw new Error('Failed to initialize OpenAI client');
      }
    }
    return this.openai;
  }

  /**
   * Generate an image based on a blog post title and content
   * @param blogTitle The title of the blog post
   * @param blogCategory The category of the blog post
   * @param blogTags Tags associated with the blog post
   * @returns Path to the saved image
   */
  async generateBlogImage(blogTitle: string, blogCategory: string, blogTags: string[]): Promise<string> {
    try {
      // Create a prompt for the image generation
      const prompt = this.createImagePrompt(blogTitle, blogCategory, blogTags);
      
      // Generate the image using DALL-E
      const openai = await this.getOpenAIClient();
      
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
        response_format: "url",
      });

      const imageUrl = response.data[0]?.url;
      
      if (!imageUrl) {
        throw new Error('No image URL returned from OpenAI');
      }

      // Download and save the image
      const imagePath = await this.downloadAndSaveImage(imageUrl, this.createImageFilename(blogTitle));
      
      console.log(`Generated image for blog post: "${blogTitle}"`);
      return imagePath;
    } catch (error) {
      console.error('Error generating blog image:', error);
      return this.getDefaultImage(blogCategory);
    }
  }

  /**
   * Create a prompt for image generation based on blog details
   */
  private createImagePrompt(title: string, category: string, tags: string[]): string {
    const sportKeywords = tags.filter(tag => 
      ['basketball', 'football', 'soccer', 'baseball', 'volleyball', 'swimming', 'tennis', 'track'].includes(tag.toLowerCase())
    );

    let sportType = sportKeywords.length > 0 ? sportKeywords[0] : 'sports';
    
    // Common prompt elements depending on category
    const promptElements: Record<string, string> = {
      training: `High-quality sports training scene for ${sportType}. Action shot of athletes practicing with coaches, modern equipment, in a professional training environment. Clean, inspirational scene showing skill development.`,
      recruiting: `Professional image of college recruiters watching high school ${sportType} athletes. Stadium or gym setting with scouts taking notes, athletes performing, showing the recruiting process.`,
      nutrition: `Healthy meal preparation for athletes. Colorful fruits, vegetables, proteins arranged for ${sportType} athletes. Sports nutrition themed, energy-rich foods.`,
      'mental-training': `Athlete in focused concentration before a ${sportType} game. Mental preparation visualization, possibly with a coach, showing calm determination.`,
      technology: `Modern sports technology being used in ${sportType}. Athletes with performance tracking devices, analytics screens, high-tech training equipment.`,
      nextup: `Young ${sportType} prospect in action, dynamic pose showing athletic talent. High school or youth athlete with great potential, in-game action shot.`,
      analysis: `Coach analyzing ${sportType} performance with data. Screens showing statistics, possibly reviewing video footage with athletes.`,
      combine: `${sportType} combine testing scene. Athletes performing measurements and skill tests with scouts observing. Professional evaluation setting.`,
      tips: `Instructional scene for ${sportType} technique. Close-up of proper form or skill execution, clearly demonstrating expert technique.`,
      ncaa: `College ${sportType} scene with NCAA elements. University stadium or arena with school colors, official NCAA branding subtly visible.`
    };

    // Start with a base prompt
    let basePrompt = `Create a photorealistic image for a sports blog article titled "${title}". `;
    
    // Add category-specific elements
    if (category && category in promptElements) {
      basePrompt += promptElements[category as keyof typeof promptElements];
    } else {
      basePrompt += `Dynamic sports scene related to ${sportType}. Show athletes in action, realistic lighting, professional composition.`;
    }
    
    // Include some tags as keywords
    if (tags && tags.length > 0) {
      const keyTags = tags.slice(0, 3).join(', ');
      basePrompt += ` Keywords: ${keyTags}.`;
    }
    
    // Important stylistic guidelines
    basePrompt += ' Create a professional sports photography style image suitable for a news publication. No text, watermarks, or borders in the image.';
    
    return basePrompt;
  }

  /**
   * Create a filename for the image based on the blog title
   */
  private createImageFilename(title: string): string {
    // Convert title to slug for filename
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    const timestamp = Date.now();
    return `${slug}-${timestamp}.png`;
  }

  /**
   * Download and save an image from a URL
   * @param url The URL of the image
   * @param filename The filename to save the image as
   * @returns The path to the saved image
   */
  private async downloadAndSaveImage(url: string, filename: string): Promise<string> {
    try {
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      const imagePath = path.join(this.uploadDir, filename);
      
      fs.writeFileSync(imagePath, response.data);
      
      // Return the path relative to uploads for storage in DB
      return `/blog-images/${filename}`;
    } catch (error) {
      console.error('Error downloading image:', error);
      throw new Error('Failed to download and save image');
    }
  }

  /**
   * Get a default image for a blog category if generation fails
   * @param category The blog category
   * @returns Path to a default image
   */
  private getDefaultImage(category: string): string {
    // Map of default images for categories
    const defaultImages: Record<string, string> = {
      training: '/blog-images/default-training.jpg',
      recruiting: '/blog-images/default-recruiting.jpg',
      nutrition: '/blog-images/default-nutrition.jpg',
      'mental-training': '/blog-images/default-mental-training.jpg',
      technology: '/blog-images/default-technology.jpg',
      nextup: '/blog-images/default-nextup.jpg',
      analysis: '/blog-images/default-analysis.jpg',
      combine: '/blog-images/default-combine.jpg',
      tips: '/blog-images/default-tips.jpg',
      ncaa: '/blog-images/default-ncaa.jpg',
    };
    
    return category in defaultImages 
      ? defaultImages[category as keyof typeof defaultImages] 
      : '/blog-images/default-sports.jpg';
  }
}

// Singleton instance
export const imageGenerationService = new ImageGenerationService();