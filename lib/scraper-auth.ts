// Authentication and API Integration for Sports Data Sources
import axios from 'axios';

interface APIConfig {
  name: string;
  baseURL: string;
  apiKey?: string;
  authMethod: 'api_key' | 'oauth' | 'basic' | 'none';
  headers?: Record<string, string>;
  rateLimit: {
    requestsPerMinute: number;
    daily: number;
  };
}

export const sportsDataAPIs: APIConfig[] = [
  {
    name: 'ESPN API',
    baseURL: 'https://site.api.espn.com/apis/site/v2',
    authMethod: 'none',
    headers: {
      'Accept': 'application/json',
      'User-Agent': 'Go4It-Sports-Platform/1.0'
    },
    rateLimit: {
      requestsPerMinute: 30,
      daily: 1000
    }
  },
  {
    name: 'SportsData.io',
    baseURL: 'https://api.sportsdata.io',
    authMethod: 'api_key',
    headers: {
      'Accept': 'application/json'
    },
    rateLimit: {
      requestsPerMinute: 200,
      daily: 10000
    }
  },
  {
    name: 'The Sports DB',
    baseURL: 'https://www.thesportsdb.com/api/v1/json',
    authMethod: 'none',
    headers: {
      'Accept': 'application/json'
    },
    rateLimit: {
      requestsPerMinute: 60,
      daily: 1000
    }
  },
  {
    name: 'BalldontLie NBA API',
    baseURL: 'https://www.balldontlie.io/api/v1',
    authMethod: 'none',
    headers: {
      'Accept': 'application/json'
    },
    rateLimit: {
      requestsPerMinute: 60,
      daily: 1000
    }
  }
];

export class SportsAPIManager {
  private apiConfigs: Map<string, APIConfig>;
  private requestCounts: Map<string, { minute: number; daily: number; lastReset: number }>;

  constructor() {
    this.apiConfigs = new Map();
    this.requestCounts = new Map();
    
    sportsDataAPIs.forEach(config => {
      this.apiConfigs.set(config.name, config);
      this.requestCounts.set(config.name, {
        minute: 0,
        daily: 0,
        lastReset: Date.now()
      });
    });
  }

  private resetRateLimitCounters(apiName: string): void {
    const now = Date.now();
    const counts = this.requestCounts.get(apiName);
    if (!counts) return;

    // Reset minute counter every 60 seconds
    if (now - counts.lastReset > 60000) {
      counts.minute = 0;
      counts.lastReset = now;
    }

    // Reset daily counter every 24 hours
    if (now - counts.lastReset > 86400000) {
      counts.daily = 0;
    }
  }

  private canMakeRequest(apiName: string): boolean {
    const config = this.apiConfigs.get(apiName);
    const counts = this.requestCounts.get(apiName);
    
    if (!config || !counts) return false;

    this.resetRateLimitCounters(apiName);
    
    return counts.minute < config.rateLimit.requestsPerMinute && 
           counts.daily < config.rateLimit.daily;
  }

  private incrementRequestCount(apiName: string): void {
    const counts = this.requestCounts.get(apiName);
    if (counts) {
      counts.minute++;
      counts.daily++;
    }
  }

  async fetchESPNData(sport: string = 'basketball', division: string = 'mens-college-basketball'): Promise<any> {
    const apiName = 'ESPN API';
    
    if (!this.canMakeRequest(apiName)) {
      throw new Error(`Rate limit exceeded for ${apiName}`);
    }

    const config = this.apiConfigs.get(apiName)!;
    
    try {
      const response = await axios.get(`${config.baseURL}/sports/${division}/athletes`, {
        headers: config.headers,
        timeout: 10000,
        params: {
          limit: 50
        }
      });

      this.incrementRequestCount(apiName);
      
      return {
        success: true,
        data: response.data,
        source: apiName,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error(`ESPN API error:`, error.message);
      return {
        success: false,
        error: error.message,
        source: apiName
      };
    }
  }

  async fetchSportsDataIO(apiKey: string, sport: string = 'NBA', endpoint: string = 'Players'): Promise<any> {
    const apiName = 'SportsData.io';
    
    if (!this.canMakeRequest(apiName)) {
      throw new Error(`Rate limit exceeded for ${apiName}`);
    }

    const config = this.apiConfigs.get(apiName)!;
    
    try {
      const response = await axios.get(`${config.baseURL}/v3/${sport}/scores/json/${endpoint}`, {
        headers: {
          ...config.headers,
          'Ocp-Apim-Subscription-Key': apiKey
        },
        timeout: 10000
      });

      this.incrementRequestCount(apiName);
      
      return {
        success: true,
        data: response.data,
        source: apiName,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error(`SportsData.io API error:`, error.message);
      return {
        success: false,
        error: error.message,
        source: apiName
      };
    }
  }

  async fetchTheSportsDB(query: string, type: string = 'searchplayers'): Promise<any> {
    const apiName = 'The Sports DB';
    
    if (!this.canMakeRequest(apiName)) {
      throw new Error(`Rate limit exceeded for ${apiName}`);
    }

    const config = this.apiConfigs.get(apiName)!;
    
    try {
      const response = await axios.get(`${config.baseURL}/1/${type}.php`, {
        headers: config.headers,
        timeout: 10000,
        params: {
          p: query
        }
      });

      this.incrementRequestCount(apiName);
      
      return {
        success: true,
        data: response.data,
        source: apiName,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error(`The Sports DB API error:`, error.message);
      return {
        success: false,
        error: error.message,
        source: apiName
      };
    }
  }

  async fetchNBAData(endpoint: string = 'players'): Promise<any> {
    const apiName = 'BalldontLie NBA API';
    
    if (!this.canMakeRequest(apiName)) {
      throw new Error(`Rate limit exceeded for ${apiName}`);
    }

    const config = this.apiConfigs.get(apiName)!;
    
    try {
      const response = await axios.get(`${config.baseURL}/${endpoint}`, {
        headers: config.headers,
        timeout: 10000,
        params: {
          per_page: 50
        }
      });

      this.incrementRequestCount(apiName);
      
      return {
        success: true,
        data: response.data,
        source: apiName,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error(`NBA API error:`, error.message);
      return {
        success: false,
        error: error.message,
        source: apiName
      };
    }
  }

  async fetchMultipleAPIs(sport: string, apiKeys?: Record<string, string>): Promise<any[]> {
    const results: any[] = [];
    
    // ESPN (Free)
    try {
      const espnResult = await this.fetchESPNData(sport);
      if (espnResult.success) {
        results.push(espnResult);
      }
    } catch (error) {
      console.error('ESPN fetch failed:', error.message);
    }

    // The Sports DB (Free)
    try {
      const sportsDBResult = await this.fetchTheSportsDB(sport);
      if (sportsDBResult.success) {
        results.push(sportsDBResult);
      }
    } catch (error) {
      console.error('The Sports DB fetch failed:', error.message);
    }

    // NBA API (Free, for basketball)
    if (sport.toLowerCase().includes('basketball')) {
      try {
        const nbaResult = await this.fetchNBAData('players');
        if (nbaResult.success) {
          results.push(nbaResult);
        }
      } catch (error) {
        console.error('NBA API fetch failed:', error.message);
      }
    }

    // SportsData.io (Requires API key)
    if (apiKeys?.sportsDataIO) {
      try {
        const sportsDataResult = await this.fetchSportsDataIO(apiKeys.sportsDataIO, sport);
        if (sportsDataResult.success) {
          results.push(sportsDataResult);
        }
      } catch (error) {
        console.error('SportsData.io fetch failed:', error.message);
      }
    }

    return results;
  }

  getAPIStatus(): Record<string, any> {
    const status: Record<string, any> = {};
    
    this.apiConfigs.forEach((config, name) => {
      const counts = this.requestCounts.get(name);
      status[name] = {
        available: this.canMakeRequest(name),
        requestsThisMinute: counts?.minute || 0,
        requestsToday: counts?.daily || 0,
        limits: config.rateLimit,
        requiresAuth: config.authMethod !== 'none'
      };
    });

    return status;
  }
}

export default SportsAPIManager;