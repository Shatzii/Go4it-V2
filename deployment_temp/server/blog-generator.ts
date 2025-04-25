import { OpenAI } from 'openai';
import { db } from './db';
import { blogPosts, insertBlogPostSchema, users } from '@shared/schema';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { generateSlug } from './utils';
import cron from 'node-cron';
import axios from 'axios';
import { openAIService } from './services/openai-service';
import { imageSearchService } from './services/image-search-service';

// Function to get OpenAI client
async function getOpenAIClient(): Promise<OpenAI> {
  try {
    return await openAIService.getClient();
  } catch (error) {
    console.error("Error getting OpenAI client:", error);
    // Fallback to environment variable
    return new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || '',
    });
  }
}

// Social media and sports news API configuration
// These will be set from the apiKeys table or environment variables
const TWITTER_BEARER_TOKEN = process.env.TWITTER_API_KEY || '';
const REDDIT_CLIENT_ID = process.env.REDDIT_CLIENT_ID || '';
const REDDIT_CLIENT_SECRET = process.env.REDDIT_CLIENT_SECRET || '';

// List of sports news sources to track
const NEWS_SOURCES = [
  { name: 'ESPN', url: 'https://www.espn.com/' },
  { name: 'Sports Illustrated', url: 'https://www.si.com/' },
  { name: '247Sports', url: 'https://247sports.com/' },
  { name: 'Rivals', url: 'https://rivals.com/' },
  { name: 'Transfer Portal', url: 'https://www.transferportalcfb.com/' },
  { name: 'Soccer News', url: 'https://www.goal.com/' },
  { name: 'MLS', url: 'https://www.mlssoccer.com/' },
  { name: 'Soccer America', url: 'https://www.socceramerica.com/' }
];

// Blog topics and categories
const BLOG_CATEGORIES = [
  'training',
  'recruiting',
  'nutrition',
  'mental-training',
  'technology',
  'nextup',
  'analysis',
  'combine',
  'tips',
  'ncaa'
];

// Blog topic ideas for AI to write about
const BLOG_TOPICS = [
  // General athletic development
  'Latest training techniques for high school athletes',
  'How college recruiters are using AI to find talent',
  'Nutrition plans for young athletes in development',
  'Mental preparation strategies for big games',
  'Using technology to improve athletic performance',
  'Rising stars in high school sports to watch',
  'Technical analysis of sport-specific skills',
  'How to prepare for sports combines',
  'Tips for balancing academics and athletics',
  'Navigating NCAA eligibility requirements',
  'Injury prevention strategies for young athletes',
  'The psychology of athletic development',
  'How to create a highlight reel that gets noticed',
  'The role of parents in youth sports development',
  'Sport-specific training programs for off-season',
  'Recovery techniques for high-intensity training',
  'Recruiting timelines for different sports',
  'Social media strategies for athlete visibility',
  'Strength training for different sports and positions',
  'The impact of specialization vs. multi-sport participation',
  
  // Soccer specific topics
  'Soccer skills development for youth players',
  'College soccer recruiting: What coaches look for',
  'MLS academies and pathways to professional soccer',
  'International soccer opportunities for American youth players',
  'Soccer position-specific training for midfielders',
  'Goalkeeper training and development programs',
  'Soccer speed and agility drills for forwards',
  'Defensive tactics and training for youth soccer',
  'Soccer IQ: Developing game intelligence in young players',
  
  // Recruiting and transfer portal
  'Understanding the transfer portal: Benefits and challenges',
  'How college coaches evaluate recruits from social media',
  'NIL opportunities for high school athletes',
  'Standing out in the recruiting process: Beyond stats',
  'Comparing scholarship offers across different programs',
  'Recruiting red flags: What to watch out for',
  'Maximizing exposure at showcases and combines',
  'Building relationships with college coaches',
  'Navigating the recruiting journey as a parent',
  
  // Additional sports topics from major outlets
  "ESPN top prospects to watch this season",
  "Sports Illustrated youth athlete development model",
  "247Sports recruiting rankings: What they mean for athletes",
  "Rivals analysis of underrated recruits",
  "Transfer portal trends reshaping college sports"
];

// Popular sports to track
const SPORTS_TO_TRACK = [
  'basketball',
  'football',
  'soccer',
  'baseball',
  'volleyball',
  'track',
  'swimming',
  'tennis',
  'golf',
  'wrestling',
  'gymnastics',
  'lacrosse',
  // Additional soccer-specific terms
  'mls',
  'premier league',
  'fifa',
  'uefa',
  'champions league',
  'world cup',
  'concacaf',
  'midfielder',
  'striker',
  'goalkeeper',
  'forward',
  'defender',
  // Transfer portal related
  'transfer portal',
  'recruit',
  'commitment',
  'signing day',
  'prospect',
  'five-star',
  'four-star',
  'rankings'
];

// Payload for the OpenAI content generation
interface BlogContentRequest {
  title: string;
  category: string;
  trendingTopics?: string[];
}

// Response structure from AI generation
interface GeneratedBlogContent {
  title: string;
  content: string;
  summary: string;
  category: string;
  tags: string[];
}

// Social media trending topic
interface TrendingTopic {
  topic: string;
  volume: number;
  source: string;
}

/**
 * Fetch trending topics from Twitter/X
 */
async function fetchTwitterTrends(): Promise<TrendingTopic[]> {
  try {
    if (!TWITTER_BEARER_TOKEN) {
      console.log('Twitter API token not configured, skipping Twitter trends');
      return [];
    }

    // Fetch trending sports topics from Twitter API
    const response = await axios.get('https://api.twitter.com/2/trends/place?id=1', {
      headers: {
        'Authorization': `Bearer ${TWITTER_BEARER_TOKEN}`
      }
    });

    const trends: TrendingTopic[] = [];
    const sportKeywords = SPORTS_TO_TRACK.map(sport => sport.toLowerCase());

    // Filter trends for sports-related content and format them
    if (response.data && response.data[0] && response.data[0].trends) {
      response.data[0].trends.forEach((trend: any) => {
        const trendName = trend.name.toLowerCase();
        
        // Check if trend contains any sports keywords
        const isSportsRelated = sportKeywords.some(keyword => 
          trendName.includes(keyword)
        );
        
        if (isSportsRelated) {
          trends.push({
            topic: trend.name,
            volume: trend.tweet_volume || 0,
            source: 'twitter'
          });
        }
      });
    }

    return trends.slice(0, 5); // Return top 5 sports-related trends
  } catch (error) {
    console.error('Error fetching Twitter trends:', error);
    return [];
  }
}

/**
 * Fetch trending topics from Reddit
 */
async function fetchRedditTrends(): Promise<TrendingTopic[]> {
  try {
    if (!REDDIT_CLIENT_ID || !REDDIT_CLIENT_SECRET) {
      console.log('Reddit API credentials not configured, skipping Reddit trends');
      return [];
    }

    // Get Reddit access token (OAuth)
    const tokenResponse = await axios.post(
      'https://www.reddit.com/api/v1/access_token',
      `grant_type=client_credentials`,
      {
        auth: {
          username: REDDIT_CLIENT_ID,
          password: REDDIT_CLIENT_SECRET
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    const accessToken = tokenResponse.data.access_token;

    // Get trending posts from sports subreddits
    const sportsSubreddits = [
      'sports', 'basketball', 'football', 'soccer', 
      'baseball', 'volleyball', 'trackandfield', 'swimming',
      // Additional soccer subreddits
      'MLS', 'ussoccer', 'MLSNextPro', 'NWSL', 'collegesoccer',
      // Recruiting and college sports
      'CFB', 'CollegeBasketball', 'recruiting', 'NCAAW',
      // Transfer portal related
      'CollegeFootballRisk', 'CFBTransfers'
    ];
    
    const trendingTopics: TrendingTopic[] = [];

    // Query each sports subreddit
    for (const subreddit of sportsSubreddits) {
      const response = await axios.get(
        `https://oauth.reddit.com/r/${subreddit}/hot?limit=5`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'User-Agent': 'NextUpAI/1.0.0'
          }
        }
      );

      if (response.data && response.data.data && response.data.data.children) {
        response.data.data.children.forEach((post: any) => {
          trendingTopics.push({
            topic: post.data.title,
            volume: post.data.score || 0,
            source: `reddit/${subreddit}`
          });
        });
      }
    }

    // Sort by engagement (score) and get top trends
    return trendingTopics
      .sort((a, b) => b.volume - a.volume)
      .slice(0, 10);
  } catch (error) {
    console.error('Error fetching Reddit trends:', error);
    return [];
  }
}

/**
 * Fetch trending headlines from sports news sites
 */
async function fetchSportsNews(): Promise<TrendingTopic[]> {
  try {
    console.log('Fetching headlines from sports news sites...');
    
    // In a production environment, we'd implement proper web scraping with cheerio
    // or use official APIs from these news sources. For now, we'll provide some
    // curated headlines covering the requested sources.
    
    // These would normally come from web scraping the NEWS_SOURCES
    const currentHeadlines: TrendingTopic[] = [
      // ESPN headlines
      { topic: "Top 5-Star Recruits Announce College Decisions", volume: 950, source: "ESPN" },
      { topic: "Transfer Portal Activity Heats Up After Spring Games", volume: 850, source: "ESPN" },
      
      // Sports Illustrated
      { topic: "Rising Soccer Stars Making Waves in MLS Youth Academies", volume: 780, source: "Sports Illustrated" },
      { topic: "How NIL is Changing the Game for High School Athletes", volume: 920, source: "Sports Illustrated" },
      
      // 247Sports
      { topic: "Breaking Down the Latest Football Recruiting Rankings", volume: 830, source: "247Sports" },
      { topic: "Basketball Recruiting: Summer Circuit Preview", volume: 760, source: "247Sports" },
      
      // Rivals
      { topic: "Under-the-Radar Prospects Gaining Attention", volume: 710, source: "Rivals" },
      { topic: "Top Performers from Regional Combines", volume: 680, source: "Rivals" },
      
      // Transfer Portal
      { topic: "Impact Transfers to Watch This Season", volume: 890, source: "Transfer Portal" },
      { topic: "Portal Deadline Approaches: Who's Still Available", volume: 800, source: "Transfer Portal" },
      
      // Soccer coverage
      { topic: "Youth Soccer Development Pathways Expanding in US", volume: 730, source: "Soccer America" },
      { topic: "MLS Next Pro Creating New Opportunities for Young Players", volume: 770, source: "MLS" },
      { topic: "International Soccer Academies Recruiting American Talent", volume: 820, source: "Goal.com" }
    ];
    
    return currentHeadlines;
  } catch (error) {
    console.error('Error fetching sports news headlines:', error);
    return [];
  }
}

/**
 * Get trending sports topics from social media and news sites
 */
async function getTrendingSportsTopics(): Promise<string[]> {
  try {
    console.log('Fetching trending topics from social media and news sites...');
    
    // Parallel fetch from multiple sources
    const [twitterTrends, redditTrends, sportsNews] = await Promise.all([
      fetchTwitterTrends(),
      fetchRedditTrends(),
      fetchSportsNews()
    ]);

    // Combine all trends
    const allTrends = [...twitterTrends, ...redditTrends, ...sportsNews];
    
    // Sort by engagement and take top 20
    const topTrends = allTrends
      .sort((a, b) => b.volume - a.volume)
      .slice(0, 20);
    
    console.log(`Found ${topTrends.length} trending sports topics`);
    
    // Extract just the topic text
    return topTrends.map(trend => trend.topic);
  } catch (error) {
    console.error('Error getting trending sports topics:', error);
    return [];
  }
}

/**
 * Generate a blog post using OpenAI
 */
export async function generateBlogPost(): Promise<GeneratedBlogContent | null> {
  try {
    // Get trending topics from social media
    const trendingTopics = await getTrendingSportsTopics();
    
    // Random topic and category selection
    const randomTopic = BLOG_TOPICS[Math.floor(Math.random() * BLOG_TOPICS.length)];
    const randomCategory = BLOG_CATEGORIES[Math.floor(Math.random() * BLOG_CATEGORIES.length)];

    console.log(`Generating blog post about: ${randomTopic} (${randomCategory})`);

    const blogRequest: BlogContentRequest = {
      title: randomTopic,
      category: randomCategory,
      trendingTopics: trendingTopics.length > 0 ? trendingTopics : undefined
    };

    // Define the base prompt
    let userPrompt = `Write a blog post about "${blogRequest.title}" for the category "${blogRequest.category}".`;
    
    // Add trending topics if available
    if (blogRequest.trendingTopics && blogRequest.trendingTopics.length > 0) {
      userPrompt += `\n\nIncorporate some of these current trending topics if relevant:
      ${blogRequest.trendingTopics.slice(0, 5).map(topic => `- ${topic}`).join('\n')}`;
    }
    
    // Complete the prompt with formatting instructions
    userPrompt += `\n\nFormat your response as a JSON object with the following structure:
                    {
                      "title": "An engaging title for the blog post",
                      "content": "Full blog post content with proper formatting (at least 500 words)",
                      "summary": "A brief summary (about 50 words)",
                      "tags": ["tag1", "tag2", "tag3"]
                    }
                    Make the content informative, engaging, and professional.`;
    
    // Get the OpenAI client from our service
    const openai = await getOpenAIClient();
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are an expert sports journalist specializing in youth and collegiate athletics. 
                    Write high-quality, informative content for young athletes, coaches, and parents.
                    Focus on providing actionable advice, insights, and analysis.
                    Stay current with the latest trends and developments in sports.
                    Your articles should feel relevant and timely.`
        },
        {
          role: "user",
          content: userPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const responseContent = completion.choices[0]?.message?.content || '';
    
    try {
      // Extract the JSON object from the response
      const jsonMatch = responseContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const jsonContent = JSON.parse(jsonMatch[0]);
        return {
          title: jsonContent.title,
          content: jsonContent.content,
          summary: jsonContent.summary,
          category: blogRequest.category,
          tags: jsonContent.tags
        };
      }
    } catch (error) {
      console.error('Error parsing AI response:', error);
      console.log('Raw response:', responseContent);
    }

    return null;
  } catch (error) {
    console.error('Error generating blog post:', error);
    return null;
  }
}

/**
 * Create a new blog post in the database
 */
export async function createAIBlogPost(authorId: number): Promise<boolean> {
  try {
    // Check if OpenAI API key is available
    try {
      await openAIService.hasValidApiKey();
    } catch (error) {
      console.error('OpenAI API key not available:', error);
      return false;
    }

    // Generate blog content
    const blogContent = await generateBlogPost();
    if (!blogContent) {
      console.error('Failed to generate blog content');
      return false;
    }

    // Generate a slug from the title
    const slug = generateSlug(blogContent.title);
    
    // Find a relevant image for the blog post from the web
    let coverImage;
    try {
      console.log(`Finding image for blog post: "${blogContent.title}"`);
      // Create a search term using the title and tags
      const searchTerms = `${blogContent.category} ${blogContent.tags.slice(0, 3).join(' ')}`;
      coverImage = await imageSearchService.getSportsImage(searchTerms);
      console.log(`Found image URL: ${coverImage}`);
    } catch (error) {
      console.error('Error finding blog image:', error);
      coverImage = null;
    }

    // Create blog post in database
    const blogData = {
      title: blogContent.title,
      content: blogContent.content,
      summary: blogContent.summary,
      slug: slug,
      category: blogContent.category,
      authorId: authorId,
      publishDate: new Date(),
      featured: Math.random() > 0.8, // 20% chance of being featured
      tags: blogContent.tags,
      coverImage: coverImage
    };

    // Validate blog data
    const validatedData = insertBlogPostSchema.parse(blogData);
    
    // Insert into database
    await db.insert(blogPosts).values(validatedData);
    
    console.log(`Created new AI blog post: "${blogContent.title}"`);
    return true;
  } catch (error) {
    console.error('Error creating AI blog post:', error);
    return false;
  }
}

/**
 * Schedule daily blog post generation
 * This will create one blog post per day at 8:00 AM
 */
export function scheduleDailyBlogPosts(adminUserId: number) {
  // Schedule to run at 8:00 AM every day
  // cron format: minute hour day month weekday
  cron.schedule('0 8 * * *', async () => {
    try {
      console.log('Running scheduled blog post generation...');
      await createAIBlogPost(adminUserId);
    } catch (error) {
      console.error('Error in scheduled blog post generation:', error);
    }
  });
  
  console.log('Daily blog post generation scheduled successfully');
}

/**
 * Initialize blog generation - creates one post immediately and schedules daily posts
 */
export async function initializeBlogGeneration() {
  try {
    // Find admin user to use as author
    const adminUsersResult = await db.select()
      .from(users)
      .where(eq(users.role, 'admin'))
      .limit(1);
    
    if (!adminUsersResult || adminUsersResult.length === 0) {
      console.error('No admin user found to use as blog author');
      return;
    }
    
    const adminUserId = adminUsersResult[0].id;
    
    // Create first blog post immediately
    await createAIBlogPost(adminUserId);
    
    // Schedule daily posts
    scheduleDailyBlogPosts(adminUserId);
  } catch (error) {
    console.error('Error initializing blog generation:', error);
  }
}