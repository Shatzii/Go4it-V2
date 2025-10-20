// News and Journalism Page for Go4it Sports
// Features discovered athletes, generated articles, and recruitment news

import { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Trophy,
  TrendingUp,
  Users,
  Calendar,
  MapPin,
  Target,
  Star,
  Share2,
  Bookmark,
  Clock,
  Eye,
  ThumbsUp,
  MessageCircle
} from 'lucide-react';

// Mock data - in production, this would come from your database
const featuredAthletes = [
  {
    id: '1',
    name: 'Cooper Flagg',
    sport: 'Basketball',
    position: 'SF',
    school: 'Montverde Academy',
    location: 'Montverde, FL',
    graduationYear: 2025,
    stats: { pointsPerGame: 22.5, reboundsPerGame: 9.2 },
    ranking: { national: 1, state: 1 },
    qualityScore: 98,
    achievements: ['State Champion', 'All-American'],
    image: '/api/placeholder/300/300',
    featuredArticle: {
      title: 'Cooper Flagg: The Next Face of College Basketball',
      excerpt: 'At just 6\'9" with elite scoring ability, Flagg is drawing comparisons to NBA stars...',
      publishedAt: '2025-01-15',
      readingTime: 8,
      engagement: { likes: 1247, shares: 89, comments: 34 }
    }
  },
  {
    id: '2',
    name: 'Ace Bailey',
    sport: 'Basketball',
    position: 'SF',
    school: 'McEachern High School',
    location: 'Atlanta, GA',
    graduationYear: 2025,
    stats: { pointsPerGame: 24.1, reboundsPerGame: 8.7 },
    ranking: { national: 2, state: 1 },
    qualityScore: 96,
    achievements: ['Georgia Mr. Basketball', 'State Champion'],
    image: '/api/placeholder/300/300',
    featuredArticle: {
      title: 'Ace Bailey: Atlanta\'s Basketball Phenom',
      excerpt: 'Bailey\'s combination of size, skill, and basketball IQ makes him a can\'t-miss prospect...',
      publishedAt: '2025-01-12',
      readingTime: 6,
      engagement: { likes: 892, shares: 67, comments: 28 }
    }
  },
  {
    id: '3',
    name: 'Dylan Harper',
    sport: 'Basketball',
    position: 'SG',
    school: 'Don Bosco Prep',
    location: 'Franklin Lakes, NJ',
    graduationYear: 2025,
    stats: { pointsPerGame: 23.8, assistsPerGame: 6.9 },
    ranking: { national: 3, state: 1 },
    qualityScore: 94,
    achievements: ['Parade All-American', 'State Champion'],
    image: '/api/placeholder/300/300',
    featuredArticle: {
      title: 'Dylan Harper: The Complete Guard',
      excerpt: 'Harper\'s elite playmaking and scoring ability has him on the radar of every major program...',
      publishedAt: '2025-01-10',
      readingTime: 7,
      engagement: { likes: 756, shares: 45, comments: 22 }
    }
  }
];

const recentArticles = [
  {
    id: '1',
    title: 'Breaking: Cooper Flagg Commits to Duke University',
    category: 'Recruitment',
    excerpt: 'The No. 1 overall recruit in the Class of 2025 has made his college choice...',
    author: 'Go4it Sports Staff',
    publishedAt: '2025-01-15T10:30:00Z',
    readingTime: 3,
    image: '/api/placeholder/400/250',
    tags: ['recruiting', 'basketball', 'commitment'],
    engagement: { likes: 234, shares: 45, comments: 12 }
  },
  {
    id: '2',
    title: 'Top 10 Rising Stars to Watch in 2025',
    category: 'Analysis',
    excerpt: 'Our annual roundup of the most promising high school athletes...',
    author: 'Go4it Sports Staff',
    publishedAt: '2025-01-12T14:15:00Z',
    readingTime: 12,
    image: '/api/placeholder/400/250',
    tags: ['rising stars', 'analysis', '2025 class'],
    engagement: { likes: 567, shares: 123, comments: 45 }
  },
  {
    id: '3',
    title: 'How Social Media is Changing High School Recruiting',
    category: 'News',
    excerpt: 'The impact of TikTok and Instagram on college recruitment strategies...',
    author: 'Sarah Johnson',
    publishedAt: '2025-01-10T09:00:00Z',
    readingTime: 8,
    image: '/api/placeholder/400/250',
    tags: ['social media', 'recruiting', 'trends'],
    engagement: { likes: 345, shares: 78, comments: 23 }
  }
];

const recruitmentNews = [
  {
    id: '1',
    title: 'Florida State Lands Top QB Prospect',
    summary: 'Bryce Underwood commits to Florida State, ending a competitive recruitment battle.',
    timestamp: '2025-01-14T16:45:00Z',
    sport: 'Football',
    priority: 'high'
  },
  {
    id: '2',
    title: 'Michigan Basketball Adds Another 5-Star',
    summary: 'The Wolverines continue their recruiting momentum with a major addition.',
    timestamp: '2025-01-13T11:20:00Z',
    sport: 'Basketball',
    priority: 'high'
  },
  {
    id: '3',
    title: 'USC Football Extends Offer to Elite WR',
    summary: 'The Trojans enter the race for one of the top wide receiver prospects.',
    timestamp: '2025-01-12T13:30:00Z',
    sport: 'Football',
    priority: 'medium'
  }
];

export const metadata: Metadata = {
  title: 'News & Journalism - Go4it Sports',
  description: 'Latest news, athlete spotlights, and recruitment updates from the world of high school sports.',
  keywords: 'high school sports news, athlete recruiting, college sports journalism, rising stars',
};

export default function NewsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Sports News & Journalism</h1>
              <p className="text-gray-600 mt-1">Discover rising stars, breaking news, and in-depth analysis</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="px-3 py-1">
                <Trophy className="w-4 h-4 mr-1" />
                150+ Athletes Featured
              </Badge>
              <Badge variant="secondary" className="px-3 py-1">
                <TrendingUp className="w-4 h-4 mr-1" />
                Updated Daily
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="featured" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="featured">Featured Athletes</TabsTrigger>
            <TabsTrigger value="articles">Latest Articles</TabsTrigger>
            <TabsTrigger value="recruiting">Recruiting News</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
          </TabsList>

          {/* Featured Athletes Tab */}
          <TabsContent value="featured" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Rising Stars Spotlight</h2>
              <p className="text-gray-600">Meet the most promising high school athletes in the nation</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredAthletes.map((athlete) => (
                <Card key={athlete.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <Image
                      src={athlete.image}
                      alt={athlete.name}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-yellow-500 text-white">
                        #{athlete.ranking.national}
                      </Badge>
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <Badge variant="secondary" className="bg-black/70 text-white">
                        ⭐ {athlete.qualityScore}
                      </Badge>
                    </div>
                  </div>

                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">{athlete.name}</CardTitle>
                        <p className="text-sm text-gray-600">
                          {athlete.position} • {athlete.school}
                        </p>
                        <p className="text-sm text-gray-500 flex items-center mt-1">
                          <MapPin className="w-4 h-4 mr-1" />
                          {athlete.location}
                        </p>
                      </div>
                      <Badge variant="outline">{athlete.sport}</Badge>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-4">
                      {/* Key Stats */}
                      <div className="grid grid-cols-2 gap-4">
                        {Object.entries(athlete.stats).slice(0, 2).map(([key, value]) => (
                          <div key={key} className="text-center p-2 bg-gray-50 rounded">
                            <div className="text-lg font-bold text-blue-600">{value}</div>
                            <div className="text-xs text-gray-600 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Achievements */}
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Achievements</h4>
                        <div className="flex flex-wrap gap-1">
                          {athlete.achievements.map((achievement, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {achievement}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Featured Article */}
                      <div className="border-t pt-4">
                        <h4 className="font-semibold text-sm mb-2">Featured Article</h4>
                        <p className="text-sm text-gray-600 mb-2">{athlete.featuredArticle.title}</p>
                        <p className="text-xs text-gray-500 mb-3">{athlete.featuredArticle.excerpt}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{athlete.featuredArticle.publishedAt}</span>
                          <span>{athlete.featuredArticle.readingTime} min read</span>
                        </div>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                          <span className="flex items-center">
                            <ThumbsUp className="w-3 h-3 mr-1" />
                            {athlete.featuredArticle.engagement.likes}
                          </span>
                          <span className="flex items-center">
                            <Share2 className="w-3 h-3 mr-1" />
                            {athlete.featuredArticle.engagement.shares}
                          </span>
                          <span className="flex items-center">
                            <MessageCircle className="w-3 h-3 mr-1" />
                            {athlete.featuredArticle.engagement.comments}
                          </span>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button size="sm" className="flex-1">
                          <Eye className="w-4 h-4 mr-1" />
                          View Profile
                        </Button>
                        <Button size="sm" variant="outline">
                          <Bookmark className="w-4 h-4 mr-1" />
                          Save
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Latest Articles Tab */}
          <TabsContent value="articles" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Latest Articles</h2>
              <p className="text-gray-600">In-depth analysis, breaking news, and athlete profiles</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentArticles.map((article) => (
                <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <Image
                      src={article.image}
                      alt={article.title}
                      width={400}
                      height={250}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-blue-500 text-white">
                        {article.category}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg mb-2 line-clamp-2">{article.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{article.excerpt}</p>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span>{article.author}</span>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {article.readingTime} min
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {article.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 text-sm text-gray-500">
                        <span className="flex items-center">
                          <ThumbsUp className="w-4 h-4 mr-1" />
                          {article.engagement.likes}
                        </span>
                        <span className="flex items-center">
                          <Share2 className="w-4 h-4 mr-1" />
                          {article.engagement.shares}
                        </span>
                      </div>
                      <Button size="sm">Read More</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Recruiting News Tab */}
          <TabsContent value="recruiting" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Recruiting News</h2>
              <p className="text-gray-600">Breaking commitments, offers, and recruitment updates</p>
            </div>

            <div className="space-y-4">
              {recruitmentNews.map((news) => (
                <Card key={news.id} className={`border-l-4 ${
                  news.priority === 'high' ? 'border-l-red-500' : 'border-l-yellow-500'
                }`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant={news.priority === 'high' ? 'destructive' : 'secondary'}>
                            {news.priority.toUpperCase()}
                          </Badge>
                          <Badge variant="outline">{news.sport}</Badge>
                        </div>
                        <h3 className="font-bold text-lg mb-2">{news.title}</h3>
                        <p className="text-gray-600 mb-3">{news.summary}</p>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(news.timestamp).toLocaleDateString()} at{' '}
                          {new Date(news.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <Share2 className="w-4 h-4 mr-1" />
                        Share
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analysis Tab */}
          <TabsContent value="analysis" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Expert Analysis</h2>
              <p className="text-gray-600">Data-driven insights and recruitment predictions</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Class of 2025 Rankings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Basketball</span>
                      <Badge>Complete</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Football</span>
                      <Badge variant="secondary">Updated Daily</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Other Sports</span>
                      <Badge variant="outline">Coming Soon</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="w-5 h-5 mr-2" />
                    Recruitment Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Early Commitments</span>
                      <span className="font-bold text-green-600">+15%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Social Media Influence</span>
                      <span className="font-bold text-blue-600">+25%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Transfer Portal</span>
                      <span className="font-bold text-orange-600">+8%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Featured Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-semibold">The Impact of NIL on High School Recruiting</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      How name, image, and likeness deals are changing the landscape of college sports recruitment.
                    </p>
                    <div className="flex items-center mt-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      10 min read • Published Jan 8, 2025
                    </div>
                  </div>

                  <div className="border-l-4 border-green-500 pl-4">
                    <h4 className="font-semibold">2025 Recruiting Class Predictions</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Our data-driven predictions for which programs will dominate the 2025 recruiting cycle.
                    </p>
                    <div className="flex items-center mt-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      15 min read • Published Jan 5, 2025
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}</content>
<parameter name="filePath">/home/runner/workspace/app/news/page.tsx
