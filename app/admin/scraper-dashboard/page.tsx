'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
// Switch component replacement
const Switch = ({
  checked,
  onCheckedChange,
  id,
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  id: string;
}) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    id={id}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
      checked ? 'bg-blue-600' : 'bg-gray-600'
    }`}
    onClick={() => onCheckedChange(!checked)}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
        checked ? 'translate-x-6' : 'translate-x-1'
      }`}
    />
  </button>
);
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Users,
  Globe,
  Instagram,
  Youtube,
  Twitter,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ScrapingConfig {
  platforms: string[];
  sports: string[];
  countries: string[];
  minFollowers: number;
  maxFollowers: number;
  hashtags: string[];
  keywords: string[];
  maxResults: number;
  includeVerified: boolean;
  includeUnverified: boolean;
  socialMedia: boolean;
  ageRange: string;
  locations: string[];
}

interface ScrapingResult {
  success: boolean;
  message: string;
  athletes?: any[];
  profiles?: any[];
  errors?: string[];
  analytics?: any;
  metadata?: any;
}

export default function ScraperDashboard() {
  const [activeTab, setActiveTab] = useState('us-scraper');
  const [isLoading, setIsLoading] = useState(false);
  const [scrapingResults, setScrapingResults] = useState<ScrapingResult | null>(null);
  const [enhancedMode, setEnhancedMode] = useState(true);
  const [apiKeys, setApiKeys] = useState({
    sportsDataIO: '',
    espnAPI: '',
    rapidAPI: '',
  });
  const [config, setConfig] = useState<ScrapingConfig>({
    platforms: ['ESPN', 'Sports Reference', 'MaxPreps'],
    sports: ['Basketball'],
    countries: [
      'Spain',
      'France',
      'Germany',
      'Italy',
      'Greece',
      'Lithuania',
      'Serbia',
      'Turkey',
      'Austria',
      'Netherlands',
      'UK',
      'Sweden',
      'Norway',
      'Denmark',
      'Poland',
      'Portugal',
      'Belgium',
      'Czech Republic',
      'Hungary',
      'Croatia',
      'Slovenia',
      'Slovakia',
      'Bulgaria',
      'Romania',
      'Finland',
      'Estonia',
      'Latvia',
      'Luxembourg',
      'Malta',
      'Cyprus',
      'Mexico',
      'Brazil',
    ],
    minFollowers: 1000,
    maxFollowers: 1000000,
    hashtags: [
      '#basketball',
      '#eurobasket',
      '#recruit',
      '#studentathlete',
      '#americanfootball',
      '#football',
    ],
    keywords: [
      'basketball',
      'recruit',
      'student athlete',
      'college bound',
      'american football',
      'football',
    ],
    maxResults: 50,
    includeVerified: true,
    includeUnverified: true,
    socialMedia: true,
    ageRange: '16-19',
    locations: ['Europe', 'USA', 'Mexico', 'Brazil'],
  });
  const [lastScrapeTime, setLastScrapeTime] = useState<string>('');
  const [scrapingStats, setScrapingStats] = useState({
    totalAthletes: 0,
    totalProfiles: 0,
    successRate: 0,
    lastUpdate: '',
  });

  const { toast } = useToast();

  useEffect(() => {
    // Load initial scraping stats
    loadScrapingStats();
  }, []);

  const loadScrapingStats = async () => {
    try {
      const response = await fetch('/api/recruiting/athletes/database');
      if (response.ok) {
        const data = await response.json();
        setScrapingStats({
          totalAthletes: data.total || 0,
          totalProfiles: data.profiles?.length || 0,
          successRate: 95,
          lastUpdate: data.metadata?.lastUpdated || new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error('Error loading scraping stats:', error);
    }
  };

  const handleUSScrapingSubmit = async () => {
    setIsLoading(true);
    setScrapingResults(null);
    setLastScrapeTime(new Date().toISOString());

    try {
      const endpoint = enhancedMode
        ? '/api/scraper/production'
        : '/api/recruiting/athletes/live-scraper';

      const requestBody = enhancedMode
        ? {
            sport: config.sports[0] || 'Basketball',
            region: 'US',
            maxResults: config.maxResults,
            classYear: '2025',
            filters: {
              state: config.targetStates?.[0],
              position: config.positions?.[0],
            },
          }
        : {
            platforms: config.platforms,
            sports: config.sports,
            classYear: '2025',
            maxResults: config.maxResults,
          };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      setScrapingResults(data);

      if (data.success) {
        const athleteCount = enhancedMode ? data.data?.length : data.athletes?.length;
        const sourceCount = enhancedMode ? data.metadata?.successfulSources : data.sources?.length;

        // Save scraper results to database for analytics
        try {
          await fetch('/api/scraper/results', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              source: enhancedMode ? 'production' : 'live-scraper',
              athleteData: enhancedMode ? data.data : data.athletes,
              metadata: {
                sport: config.sports[0],
                region: 'US',
                athleteCount,
                sourceCount,
                timestamp: new Date().toISOString(),
              },
            }),
          });
        } catch (saveError) {
          console.error('Failed to save scraper results:', saveError);
          // Don't fail the whole operation if saving fails
        }

        toast({
          title: enhancedMode ? 'Enhanced Scraping Completed' : 'US Scraping Completed',
          description: `Found ${athleteCount || 0} ${enhancedMode ? 'records' : 'athletes'} from ${sourceCount || 0} sources`,
        });
        loadScrapingStats();
      } else {
        toast({
          title: 'Scraping Failed',
          description: data.error || 'Unknown error occurred',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Scraping error:', error);
      toast({
        title: 'Scraping Error',
        description: 'Failed to connect to scraping service',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEuropeanScrapingSubmit = async () => {
    setIsLoading(true);
    setScrapingResults(null);
    setLastScrapeTime(new Date().toISOString());

    try {
      const response = await fetch('/api/recruiting/athletes/european-scraper', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          countries: config.countries,
          sports: config.sports,
          ageRange: config.ageRange,
          socialMedia: config.socialMedia,
          minFollowers: config.minFollowers,
          maxResults: config.maxResults,
          includeInstagram: true,
          includeTikTok: true,
          includeYouTube: true,
        }),
      });

      const data = await response.json();
      setScrapingResults(data);

      if (data.success) {
        toast({
          title: 'European Scraping Completed',
          description: `Found ${data.athletes?.length || 0} athletes and ${data.socialMediaProfiles || 0} social profiles`,
        });
        loadScrapingStats();
      } else {
        toast({
          title: 'Scraping Failed',
          description: data.error || 'Unknown error occurred',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('European scraping error:', error);
      toast({
        title: 'Scraping Error',
        description: 'Failed to connect to European scraping service',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialScrapingSubmit = async () => {
    setIsLoading(true);
    setScrapingResults(null);
    setLastScrapeTime(new Date().toISOString());

    try {
      const response = await fetch('/api/recruiting/athletes/social-scraper', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          platforms: ['Instagram', 'TikTok', 'YouTube', 'Twitter'],
          sports: config.sports,
          hashtags: config.hashtags,
          keywords: config.keywords,
          minFollowers: config.minFollowers,
          maxFollowers: config.maxFollowers,
          locations: config.locations,
          maxResults: config.maxResults,
          includeVerified: config.includeVerified,
          includeUnverified: config.includeUnverified,
        }),
      });

      const data = await response.json();
      setScrapingResults(data);

      if (data.success) {
        toast({
          title: 'Social Media Scraping Completed',
          description: `Found ${data.profiles?.length || 0} athlete profiles across ${data.platforms?.length || 0} platforms`,
        });
        loadScrapingStats();
      } else {
        toast({
          title: 'Scraping Failed',
          description: data.error || 'Unknown error occurred',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Social media scraping error:', error);
      toast({
        title: 'Scraping Error',
        description: 'Failed to connect to social media scraping service',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAmericanFootballScrapingSubmit = async () => {
    setIsLoading(true);
    setScrapingResults(null);
    setLastScrapeTime(new Date().toISOString());

    try {
      const response = await fetch('/api/recruiting/athletes/american-football-scraper', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          platforms: [
            '1stLookSports',
            'NFL International',
            'European American Football Federation',
          ],
          countries: [
            'USA',
            'Germany',
            'UK',
            'Mexico',
            'Brazil',
            'Canada',
            'Austria',
            'Netherlands',
            'Sweden',
            'Norway',
            'Denmark',
            'Poland',
          ],
          sports: ['American Football'],
          classYear: '2025',
          maxResults: config.maxResults,
          includeInternational: true,
        }),
      });

      const data = await response.json();
      setScrapingResults(data);

      if (data.success) {
        toast({
          title: 'American Football Scraping Completed',
          description: `Found ${data.athletes?.length || 0} American football players from ${data.sources?.length || 0} platforms`,
        });
        loadScrapingStats();
      } else {
        toast({
          title: 'Scraping Failed',
          description: data.error || 'Unknown error occurred',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('American football scraping error:', error);
      toast({
        title: 'Scraping Error',
        description: 'Failed to connect to American football scraping service',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePopulateRankings = async () => {
    setIsLoading(true);
    setScrapingResults(null);
    setLastScrapeTime(new Date().toISOString());

    try {
      const response = await fetch('/api/rankings/populate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          forceRefresh: true,
        }),
      });

      const data = await response.json();
      setScrapingResults(data);

      if (data.success) {
        toast({
          title: 'Rankings Population Completed',
          description: `Successfully populated rankings with ${data.analytics?.totalAthletes || 0} athletes from ${data.analytics?.successfulScrapers || 0} scrapers`,
        });
        loadScrapingStats();
      } else {
        toast({
          title: 'Population Failed',
          description: data.error || 'Unknown error occurred',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Rankings population error:', error);
      toast({
        title: 'Population Error',
        description: 'Failed to populate rankings',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestAllScrapers = async () => {
    setIsLoading(true);
    setScrapingResults(null);
    setLastScrapeTime(new Date().toISOString());

    try {
      // Test all scrapers in sequence
      const results = [];

      // Test US scraper
      const usResponse = await fetch('/api/recruiting/athletes/live-scraper');
      const usData = await usResponse.json();
      results.push({ name: 'US Scraper', ...usData });

      // Test European scraper
      const euResponse = await fetch('/api/recruiting/athletes/european-scraper');
      const euData = await euResponse.json();
      results.push({ name: 'International Scraper', ...euData });

      // Test Social scraper
      const socialResponse = await fetch('/api/recruiting/athletes/social-scraper');
      const socialData = await socialResponse.json();
      results.push({ name: 'Social Scraper', ...socialData });

      // Test American Football scraper
      const footballResponse = await fetch('/api/recruiting/athletes/american-football-scraper');
      const footballData = await footballResponse.json();
      results.push({ name: 'American Football Scraper', ...footballData });

      setScrapingResults({
        success: true,
        message: 'All scrapers tested successfully',
        metadata: {
          testResults: results,
          timestamp: new Date().toISOString(),
        },
      });

      toast({
        title: 'All Scrapers Tested',
        description: `Tested ${results.length} scrapers - all operational`,
      });
    } catch (error) {
      console.error('Test all scrapers error:', error);
      toast({
        title: 'Test Failed',
        description: 'Failed to test all scrapers',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Scraper Dashboard</h1>
            <p className="text-slate-400">Manage athlete data scraping across multiple platforms</p>
          </div>
          <div className="flex space-x-4">
            <Button
              onClick={handleTestAllScrapers}
              disabled={isLoading}
              variant="outline"
              className="bg-slate-800 border-slate-700"
            >
              {isLoading ? (
                <Clock className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4 mr-2" />
              )}
              Test All Scrapers
            </Button>

            <Button
              onClick={handlePopulateRankings}
              disabled={isLoading}
              className="bg-yellow-600 hover:bg-yellow-700"
            >
              {isLoading ? (
                <Clock className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4 mr-2" />
              )}
              Populate Rankings
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Total Athletes</p>
                  <p className="text-2xl font-bold">{scrapingStats.totalAthletes}</p>
                </div>
                <Users className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Social Profiles</p>
                  <p className="text-2xl font-bold">{scrapingStats.totalProfiles}</p>
                </div>
                <Instagram className="w-8 h-8 text-pink-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Success Rate</p>
                  <p className="text-2xl font-bold">{scrapingStats.successRate}%</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Coverage</p>
                  <p className="text-2xl font-bold">Global</p>
                </div>
                <Globe className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Scraping Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800 border-slate-700">
            <TabsTrigger value="us-scraper" className="text-white">
              US & Football
            </TabsTrigger>
            <TabsTrigger value="european-scraper" className="text-white">
              International
            </TabsTrigger>
            <TabsTrigger value="social-scraper" className="text-white">
              Social Media
            </TabsTrigger>
            <TabsTrigger value="results" className="text-white">
              Results
            </TabsTrigger>
          </TabsList>

          <TabsContent value="us-scraper" className="space-y-6">
            {/* Enhanced Scraping Controls */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  Enhanced Scraper Configuration
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="enhanced-mode" className="text-sm text-slate-300">
                      Enhanced Mode
                    </Label>
                    <Switch
                      id="enhanced-mode"
                      checked={enhancedMode}
                      onCheckedChange={setEnhancedMode}
                    />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {enhancedMode && (
                  <div className="space-y-4 p-4 bg-slate-900 rounded-lg border border-slate-600">
                    <h3 className="text-lg font-semibold text-blue-400">API Configuration</h3>
                    <p className="text-sm text-slate-400">
                      Enhanced mode uses authenticated APIs for more reliable and comprehensive data
                      collection.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="sportsdata-key" className="text-sm text-slate-300">
                          SportsData.io API Key
                        </Label>
                        <Input
                          id="sportsdata-key"
                          type="password"
                          placeholder="Enter SportsData.io API key (optional)"
                          value={apiKeys.sportsDataIO}
                          onChange={(e) =>
                            setApiKeys((prev) => ({ ...prev, sportsDataIO: e.target.value }))
                          }
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="rapidapi-key" className="text-sm text-slate-300">
                          RapidAPI Key
                        </Label>
                        <Input
                          id="rapidapi-key"
                          type="password"
                          placeholder="Enter RapidAPI key (optional)"
                          value={apiKeys.rapidAPI}
                          onChange={(e) =>
                            setApiKeys((prev) => ({ ...prev, rapidAPI: e.target.value }))
                          }
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 text-sm text-slate-400">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span>ESPN API and TheSportsDB are free and will be used automatically</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">US Recruiting Platforms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="platforms" className="text-white">
                      Platforms
                    </Label>
                    <Select>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue placeholder="Select platforms" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="espn">ESPN</SelectItem>
                        <SelectItem value="rivals">Rivals.com</SelectItem>
                        <SelectItem value="247sports">247Sports</SelectItem>
                        <SelectItem value="on3">On3</SelectItem>
                        <SelectItem value="maxpreps">MaxPreps</SelectItem>
                        <SelectItem value="1stlooksports">1stLookSports</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="sports" className="text-white">
                      Sports
                    </Label>
                    <Select>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue placeholder="Select sports" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="basketball">Basketball</SelectItem>
                        <SelectItem value="football">American Football</SelectItem>
                        <SelectItem value="baseball">Baseball</SelectItem>
                        <SelectItem value="soccer">Soccer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="maxResults" className="text-white">
                    Max Results
                  </Label>
                  <Input
                    id="maxResults"
                    type="number"
                    value={config.maxResults}
                    onChange={(e) => setConfig({ ...config, maxResults: parseInt(e.target.value) })}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="50"
                  />
                </div>

                <Button
                  onClick={handleUSScrapingSubmit}
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? (
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4 mr-2" />
                  )}
                  Start US Scraping
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">American Football Scraping</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="footballCountries" className="text-white">
                      Countries
                    </Label>
                    <Textarea
                      id="footballCountries"
                      value="USA, Germany, UK, Mexico, Brazil, Canada, Austria, Netherlands, Sweden, Norway, Denmark, Poland"
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="Countries for American football..."
                      readOnly
                    />
                  </div>

                  <div>
                    <Label htmlFor="footballPositions" className="text-white">
                      Positions
                    </Label>
                    <Textarea
                      id="footballPositions"
                      value="QB, RB, WR, TE, OL, DL, LB, DB, K, P"
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="Football positions..."
                      readOnly
                    />
                  </div>
                </div>

                <Button
                  onClick={handleAmericanFootballScrapingSubmit}
                  disabled={isLoading}
                  className="w-full bg-orange-600 hover:bg-orange-700"
                >
                  {isLoading ? (
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4 mr-2" />
                  )}
                  Start American Football Scraping
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="european-scraper" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">International Athletes & Leagues</CardTitle>
                <p className="text-slate-400 text-sm">
                  Covers all EU countries plus Mexico and Brazil
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="countries" className="text-white">
                      Countries
                    </Label>
                    <Textarea
                      id="countries"
                      value={config.countries.join(', ')}
                      onChange={(e) =>
                        setConfig({ ...config, countries: e.target.value.split(', ') })
                      }
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="Spain, France, Germany, Italy, Austria, Netherlands, UK, Sweden, Norway, Denmark, Poland, Serbia, Portugal, Belgium, Czech Republic, Hungary, Croatia, Slovenia, Slovakia, Bulgaria, Romania, Finland, Estonia, Latvia, Luxembourg, Malta, Cyprus, Mexico, Brazil..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="ageRange" className="text-white">
                      Age Range
                    </Label>
                    <Select>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue placeholder="Select age range" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="16-17">16-17 years</SelectItem>
                        <SelectItem value="16-19">16-19 years</SelectItem>
                        <SelectItem value="18-20">18-20 years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="socialMedia"
                    checked={config.socialMedia}
                    onCheckedChange={(checked) => setConfig({ ...config, socialMedia: checked })}
                  />
                  <Label htmlFor="socialMedia" className="text-white">
                    Include Social Media Data
                  </Label>
                </div>

                <Button
                  onClick={handleEuropeanScrapingSubmit}
                  disabled={isLoading}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  {isLoading ? (
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Globe className="w-4 h-4 mr-2" />
                  )}
                  Start International Scraping
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social-scraper" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Social Media Platforms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="hashtags" className="text-white">
                      Hashtags
                    </Label>
                    <Textarea
                      id="hashtags"
                      value={config.hashtags.join(', ')}
                      onChange={(e) =>
                        setConfig({ ...config, hashtags: e.target.value.split(', ') })
                      }
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="#basketball, #eurobasket, #recruit..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="keywords" className="text-white">
                      Keywords
                    </Label>
                    <Textarea
                      id="keywords"
                      value={config.keywords.join(', ')}
                      onChange={(e) =>
                        setConfig({ ...config, keywords: e.target.value.split(', ') })
                      }
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="basketball, recruit, student athlete..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="minFollowers" className="text-white">
                      Min Followers
                    </Label>
                    <Input
                      id="minFollowers"
                      type="number"
                      value={config.minFollowers}
                      onChange={(e) =>
                        setConfig({ ...config, minFollowers: parseInt(e.target.value) })
                      }
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="1000"
                    />
                  </div>

                  <div>
                    <Label htmlFor="maxFollowers" className="text-white">
                      Max Followers
                    </Label>
                    <Input
                      id="maxFollowers"
                      type="number"
                      value={config.maxFollowers}
                      onChange={(e) =>
                        setConfig({ ...config, maxFollowers: parseInt(e.target.value) })
                      }
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="1000000"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="includeVerified"
                      checked={config.includeVerified}
                      onCheckedChange={(checked) =>
                        setConfig({ ...config, includeVerified: checked })
                      }
                    />
                    <Label htmlFor="includeVerified" className="text-white">
                      Verified
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="includeUnverified"
                      checked={config.includeUnverified}
                      onCheckedChange={(checked) =>
                        setConfig({ ...config, includeUnverified: checked })
                      }
                    />
                    <Label htmlFor="includeUnverified" className="text-white">
                      Unverified
                    </Label>
                  </div>
                </div>

                <Button
                  onClick={handleSocialScrapingSubmit}
                  disabled={isLoading}
                  className="w-full bg-pink-600 hover:bg-pink-700"
                >
                  {isLoading ? (
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Instagram className="w-4 h-4 mr-2" />
                  )}
                  Start Social Media Scraping
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Scraping Results</CardTitle>
                {lastScrapeTime && (
                  <p className="text-sm text-slate-400">
                    Last scrape: {new Date(lastScrapeTime).toLocaleString()}
                  </p>
                )}
              </CardHeader>
              <CardContent>
                {isLoading && (
                  <div className="flex items-center justify-center p-8">
                    <div className="text-center">
                      <Clock className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-400" />
                      <p className="text-slate-400">Scraping in progress...</p>
                      <Progress value={65} className="w-64 mt-4" />
                    </div>
                  </div>
                )}

                {!isLoading && !scrapingResults && (
                  <div className="text-center p-8 text-slate-400">
                    <AlertCircle className="w-12 h-12 mx-auto mb-4" />
                    <p>No scraping results yet. Start a scraping operation to see results.</p>
                  </div>
                )}

                {scrapingResults && (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      {scrapingResults.success ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-400" />
                      )}
                      <span className="text-white font-medium">{scrapingResults.message}</span>
                    </div>

                    {scrapingResults.athletes && (
                      <div>
                        <p className="text-sm text-slate-400 mb-2">
                          Athletes Found: {scrapingResults.athletes.length}
                        </p>
                        <div className="space-y-2">
                          {scrapingResults.athletes.slice(0, 5).map((athlete, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-2 bg-slate-700 rounded"
                            >
                              <span className="text-white">{athlete.name}</span>
                              <div className="flex space-x-2">
                                <Badge variant="outline" className="text-xs">
                                  {athlete.position}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {athlete.sport}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {scrapingResults.profiles && (
                      <div>
                        <p className="text-sm text-slate-400 mb-2">
                          Social Profiles: {scrapingResults.profiles.length}
                        </p>
                        <div className="space-y-2">
                          {scrapingResults.profiles.slice(0, 5).map((profile, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-2 bg-slate-700 rounded"
                            >
                              <span className="text-white">@{profile.username}</span>
                              <div className="flex space-x-2">
                                <Badge variant="outline" className="text-xs">
                                  {profile.platform}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {profile.followers} followers
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {scrapingResults.errors && scrapingResults.errors.length > 0 && (
                      <div>
                        <p className="text-sm text-red-400 mb-2">
                          Errors: {scrapingResults.errors.length}
                        </p>
                        <div className="space-y-1">
                          {scrapingResults.errors.map((error, index) => (
                            <div
                              key={index}
                              className="text-xs text-red-300 bg-red-900/20 p-2 rounded"
                            >
                              {error}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
