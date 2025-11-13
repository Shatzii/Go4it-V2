// Enhanced Scraper Core - Production Ready Web Scraping System
import axios, { AxiosRequestConfig } from 'axios';
import * as cheerio from 'cheerio';
// Using setTimeout with promisify for rate limiting
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface ScrapingConfig {
  userAgents: string[];
  proxies?: string[];
  rateLimit: {
    requestsPerMinute: number;
    delayBetweenRequests: number;
  };
  retryConfig: {
    maxRetries: number;
    retryDelay: number;
  };
  headers: Record<string, string>;
  timeout: number;
}

interface ScrapingResult<T> {
  success: boolean;
  data: T[];
  source: string;
  timestamp: string;
  errors?: string[];
  metadata?: {
    totalFound: number;
    actuallyScraped: number;
    confidence: number;
  };
}

export class AdvancedScraper {
  private config: ScrapingConfig;
  private requestCount: number = 0;
  private lastRequestTime: number = 0;

  constructor(config?: Partial<ScrapingConfig>) {
    this.config = {
      userAgents: [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:120.0) Gecko/20100101 Firefox/120.0',
      ],
      rateLimit: {
        requestsPerMinute: 30,
        delayBetweenRequests: 2000,
      },
      retryConfig: {
        maxRetries: 3,
        retryDelay: 5000,
      },
      headers: {
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        Connection: 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Cache-Control': 'max-age=0',
      },
      timeout: 15000,
      ...config,
    };
  }

  private async rateLimitRequest(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;

    if (timeSinceLastRequest < this.config.rateLimit.delayBetweenRequests) {
      const delay = this.config.rateLimit.delayBetweenRequests - timeSinceLastRequest;
      await sleep(delay);
    }

    this.lastRequestTime = Date.now();
    this.requestCount++;
  }

  private getRandomUserAgent(): string {
    return this.config.userAgents[Math.floor(Math.random() * this.config.userAgents.length)];
  }

  private async makeRequest(url: string, options?: AxiosRequestConfig): Promise<string> {
    await this.rateLimitRequest();

    const requestConfig: AxiosRequestConfig = {
      url,
      method: 'GET',
      timeout: this.config.timeout,
      headers: {
        ...this.config.headers,
        'User-Agent': this.getRandomUserAgent(),
        ...options?.headers,
      },
      validateStatus: (status) => status < 500, // Don't throw on 4xx errors
      ...options,
    };

    for (let attempt = 0; attempt <= this.config.retryConfig.maxRetries; attempt++) {
      try {
        const response = await axios(requestConfig);

        if (response.status === 200) {
          return response.data;
        } else if (response.status === 403) {
          throw new Error(
            `Access forbidden (403) - Site may require authentication or have anti-bot measures`,
          );
        } else if (response.status === 429) {
          throw new Error(`Rate limited (429) - Too many requests`);
        } else if (response.status >= 400) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      } catch (error) {
        if (attempt === this.config.retryConfig.maxRetries) {
          throw error;
        }

        console.log(
          `Request attempt ${attempt + 1} failed, retrying in ${this.config.retryConfig.retryDelay}ms...`,
        );
        await sleep(this.config.retryConfig.retryDelay * (attempt + 1));
      }
    }

    throw new Error('Max retries exceeded');
  }

  async scrapeURL(url: string): Promise<cheerio.CheerioAPI> {
    const html = await this.makeRequest(url);
    return cheerio.load(html);
  }

  // Enhanced ESPN Scraper
  async scrapeESPN(
    sport: string = 'basketball',
    classYear: string = '2025',
  ): Promise<ScrapingResult<any>> {
    try {
      console.log(`Scraping ESPN for ${sport} recruits...`);

      // Try multiple ESPN URLs for better coverage
      const espnUrls = [
        'https://www.espn.com/college-sports/basketball/recruiting/school/_/id/150',
        'https://www.espn.com/mens-college-basketball/recruiting/',
        'https://www.espn.com/college-football/recruiting/',
        'https://www.espn.com/high-school/basketball/recruiting/',
      ];

      const scrapedData: any[] = [];
      const totalErrors: string[] = [];

      for (const url of espnUrls) {
        try {
          const $ = await this.scrapeURL(url);

          // Look for athlete/recruit information
          const athleteElements = $('div, article, section').filter((i, el) => {
            const text = $(el).text().toLowerCase();
            return (
              text.includes('recruit') ||
              text.includes('player') ||
              text.includes('athlete') ||
              text.includes('commit') ||
              text.includes('basketball') ||
              text.includes('football')
            );
          });

          // Extract names and basic info
          athleteElements.each((i, el) => {
            const element = $(el);
            const text = element.text();

            // Look for patterns that suggest athlete names and info
            const nameMatches = text.match(/[A-Z][a-z]+ [A-Z][a-z]+/g);
            const heightMatches = text.match(/\d+'[0-9]+"|\d+'\d+"/g);
            const classMatches = text.match(/20\d{2}|Class of \d{4}/g);

            if (nameMatches && nameMatches.length > 0) {
              nameMatches.slice(0, 3).forEach((name, idx) => {
                if (name.length > 5 && name.length < 30) {
                  scrapedData.push({
                    name: name.trim(),
                    source: 'ESPN',
                    url: url,
                    height: heightMatches?.[idx] || 'N/A',
                    classYear: classMatches?.[0]?.replace('Class of ', '') || classYear,
                    sport: sport,
                    scrapedAt: new Date().toISOString(),
                    confidence: 75,
                  });
                }
              });
            }
          });
        } catch (urlError) {
          totalErrors.push(`ESPN URL ${url}: ${urlError.message}`);
        }
      }

      return {
        success: scrapedData.length > 0,
        data: scrapedData,
        source: 'ESPN',
        timestamp: new Date().toISOString(),
        errors: totalErrors.length > 0 ? totalErrors : undefined,
        metadata: {
          totalFound: scrapedData.length,
          actuallyScraped: scrapedData.length,
          confidence: 75,
        },
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        source: 'ESPN',
        timestamp: new Date().toISOString(),
        errors: [error.message],
      };
    }
  }

  // Enhanced MaxPreps Scraper
  async scrapeMaxPreps(sport: string = 'basketball', state?: string): Promise<ScrapingResult<any>> {
    try {
      console.log(`Scraping MaxPreps for ${sport} athletes...`);

      const maxPrepsUrls = [
        'https://www.maxpreps.com/search/default.aspx',
        'https://www.maxpreps.com/high-school/basketball/',
        'https://www.maxpreps.com/high-school/football/',
        'https://www.maxpreps.com/athlete-of-the-week/',
      ];

      const scrapedData: any[] = [];
      const totalErrors: string[] = [];

      for (const url of maxPrepsUrls) {
        try {
          const $ = await this.scrapeURL(url);

          // MaxPreps specific selectors
          const athleteCards = $('.player-card, .athlete-card, .roster-player, .player-name');
          const gameStats = $('.stats-row, .player-stats');
          const schoolInfo = $('.school-name, .team-name');

          // Extract athlete information
          athleteCards.each((i, el) => {
            const element = $(el);
            const nameText = element.find('.name, .player-name, h3, h4').first().text().trim();
            const positionText = element.find('.position, .pos').text().trim();
            const schoolText = element.find('.school, .team').text().trim();

            if (nameText && nameText.length > 3) {
              scrapedData.push({
                name: nameText,
                position: positionText || 'N/A',
                school: schoolText || 'N/A',
                source: 'MaxPreps',
                url: url,
                sport: sport,
                state: state || 'N/A',
                scrapedAt: new Date().toISOString(),
                confidence: 80,
              });
            }
          });
        } catch (urlError) {
          totalErrors.push(`MaxPreps URL ${url}: ${urlError.message}`);
        }
      }

      return {
        success: scrapedData.length > 0,
        data: scrapedData,
        source: 'MaxPreps',
        timestamp: new Date().toISOString(),
        errors: totalErrors.length > 0 ? totalErrors : undefined,
        metadata: {
          totalFound: scrapedData.length,
          actuallyScraped: scrapedData.length,
          confidence: 80,
        },
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        source: 'MaxPreps',
        timestamp: new Date().toISOString(),
        errors: [error.message],
      };
    }
  }

  // Enhanced Rivals Scraper
  async scrapeRivals(sport: string = 'basketball'): Promise<ScrapingResult<any>> {
    try {
      console.log(`Scraping Rivals for ${sport} recruits...`);

      const rivalsUrls = [
        'https://n.rivals.com/content/prospects/2025',
        'https://basketballrecruiting.rivals.com/',
        'https://footballrecruiting.rivals.com/',
      ];

      const scrapedData: any[] = [];
      const totalErrors: string[] = [];

      for (const url of rivalsUrls) {
        try {
          const $ = await this.scrapeURL(url);

          // Rivals specific selectors
          const recruitCards = $('.prospect-card, .recruit-item, .player-card');
          const rankings = $('.ranking, .stars, .rating');

          recruitCards.each((i, el) => {
            const element = $(el);
            const nameElement = element.find('.name, .prospect-name, h3').first();
            const name = nameElement.text().trim();
            const ranking = element.find('.ranking, .rank').text().trim();
            const stars = element.find('.stars').length;

            if (name && name.length > 3) {
              scrapedData.push({
                name: name,
                ranking: ranking || 'NR',
                stars: stars || 0,
                source: 'Rivals',
                url: url,
                sport: sport,
                scrapedAt: new Date().toISOString(),
                confidence: 85,
              });
            }
          });
        } catch (urlError) {
          totalErrors.push(`Rivals URL ${url}: ${urlError.message}`);
        }
      }

      return {
        success: scrapedData.length > 0,
        data: scrapedData,
        source: 'Rivals',
        timestamp: new Date().toISOString(),
        errors: totalErrors.length > 0 ? totalErrors : undefined,
        metadata: {
          totalFound: scrapedData.length,
          actuallyScraped: scrapedData.length,
          confidence: 85,
        },
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        source: 'Rivals',
        timestamp: new Date().toISOString(),
        errors: [error.message],
      };
    }
  }

  // European Sports Scraper
  async scrapeEuropeanSports(
    sport: string = 'basketball',
    country?: string,
  ): Promise<ScrapingResult<any>> {
    try {
      console.log(`Scraping European ${sport} data...`);

      const europeanUrls = [
        'https://www.euroleague.net/main/',
        'https://www.fiba.basketball/eurobasket',
        'https://www.eurobasket.com/',
        'https://www.basketballengland.co.uk/',
        'https://www.basketballfrance.com/',
      ];

      const scrapedData: any[] = [];
      const totalErrors: string[] = [];

      for (const url of europeanUrls) {
        try {
          const $ = await this.scrapeURL(url);

          // European specific selectors
          const playerElements = $('.player, .athlete, .roster-item');
          const teamElements = $('.team, .club');

          playerElements.each((i, el) => {
            const element = $(el);
            const name = element.find('.name, .player-name').text().trim();
            const team = element.find('.team, .club').text().trim();
            const nationality = element.find('.nationality, .country').text().trim();

            if (name && name.length > 3) {
              scrapedData.push({
                name: name,
                team: team || 'N/A',
                nationality: nationality || country || 'EUR',
                source: 'European Basketball',
                url: url,
                sport: sport,
                region: 'Europe',
                scrapedAt: new Date().toISOString(),
                confidence: 70,
              });
            }
          });
        } catch (urlError) {
          totalErrors.push(`European URL ${url}: ${urlError.message}`);
        }
      }

      return {
        success: scrapedData.length > 0,
        data: scrapedData,
        source: 'European Sports',
        timestamp: new Date().toISOString(),
        errors: totalErrors.length > 0 ? totalErrors : undefined,
        metadata: {
          totalFound: scrapedData.length,
          actuallyScraped: scrapedData.length,
          confidence: 70,
        },
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        source: 'European Sports',
        timestamp: new Date().toISOString(),
        errors: [error.message],
      };
    }
  }

  // Social Media Scraper (Public data only)
  async scrapeSocialMedia(platform: string, hashtags: string[]): Promise<ScrapingResult<any>> {
    try {
      console.log(`Scraping social media for athletic content...`);

      // This would implement public social media scraping
      // Note: This requires proper API access for production use

      const scrapedData: any[] = [];

      // Placeholder implementation for social media data
      // In production, this would use official APIs

      return {
        success: true,
        data: scrapedData,
        source: platform,
        timestamp: new Date().toISOString(),
        metadata: {
          totalFound: 0,
          actuallyScraped: 0,
          confidence: 60,
        },
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        source: platform,
        timestamp: new Date().toISOString(),
        errors: [error.message],
      };
    }
  }

  async scrapeMultipleSources(config: {
    sources: string[];
    sport: string;
    maxResults?: number;
    filters?: any;
  }): Promise<ScrapingResult<any>> {
    const allResults: any[] = [];
    const allErrors: string[] = [];

    for (const source of config.sources) {
      try {
        let result: ScrapingResult<any>;

        switch (source.toLowerCase()) {
          case 'espn':
            result = await this.scrapeESPN(config.sport);
            break;
          case 'maxpreps':
            result = await this.scrapeMaxPreps(config.sport);
            break;
          case 'rivals':
            result = await this.scrapeRivals(config.sport);
            break;
          case 'european':
            result = await this.scrapeEuropeanSports(config.sport);
            break;
          default:
            continue;
        }

        if (result.success) {
          allResults.push(...result.data);
        }

        if (result.errors) {
          allErrors.push(...result.errors);
        }
      } catch (error) {
        allErrors.push(`${source}: ${error.message}`);
      }
    }

    return {
      success: allResults.length > 0,
      data: allResults.slice(0, config.maxResults || 100),
      source: 'Multiple Sources',
      timestamp: new Date().toISOString(),
      errors: allErrors.length > 0 ? allErrors : undefined,
      metadata: {
        totalFound: allResults.length,
        actuallyScraped: Math.min(allResults.length, config.maxResults || 100),
        confidence: 75,
      },
    };
  }
}

export default AdvancedScraper;
