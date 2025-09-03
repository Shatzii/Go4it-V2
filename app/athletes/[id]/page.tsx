// Athlete Profile Page
// Detailed view of individual athletes with stats, achievements, and generated content

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Trophy,
  MapPin,
  Calendar,
  Star,
  TrendingUp,
  Users,
  Target,
  Award,
  Share2,
  Bookmark,
  ExternalLink,
  Instagram,
  Twitter,
  Youtube,
  Facebook,
  Eye,
  ThumbsUp,
  MessageCircle,
  BarChart3,
  Activity,
  Zap
} from 'lucide-react';

// Mock athlete data - in production, this would come from your database
const athleteData = {
  id: 'cooper-flagg',
  name: 'Cooper Flagg',
  sport: 'Basketball',
  position: 'SF',
  school: 'Montverde Academy',
  location: 'Montverde, FL',
  graduationYear: 2025,
  height: "6'9\"",
  weight: '205 lbs',
  ranking: {
    national: 1,
    state: 1,
    position: 1
  },
  qualityScore: 98,
  stats: {
    pointsPerGame: 22.5,
    reboundsPerGame: 9.2,
    assistsPerGame: 3.1,
    stealsPerGame: 1.8,
    blocksPerGame: 2.3,
    fieldGoalPercentage: 0.485,
    threePointPercentage: 0.375,
    freeThrowPercentage: 0.825
  },
  achievements: [
    'State Champion (2024)',
    'All-American First Team',
    'Florida Mr. Basketball',
    'MaxPreps National Player of the Year',
    'USA Basketball U18 National Team'
  ],
  offers: [
    { school: 'Duke University', status: 'committed', date: '2025-01-15' },
    { school: 'University of Kentucky', status: 'offered', date: '2024-11-20' },
    { school: 'University of North Carolina', status: 'offered', date: '2024-10-15' },
    { school: 'University of Florida', status: 'offered', date: '2024-09-30' }
  ],
  socialMedia: {
    instagram: '@cooperflagg',
    twitter: '@CooperFlagg',
    youtube: '@CooperFlaggHighlights',
    tiktok: '@cooperflagg'
  },
  image: '/api/placeholder/400/400',
  coverImage: '/api/placeholder/1200/400',
  bio: 'Cooper Flagg is a 6\'9" small forward from Montverde Academy in Florida. Known for his elite scoring ability, defensive versatility, and basketball IQ, Flagg has drawn comparisons to NBA stars like Kevin Durant and LeBron James. He led Montverde Academy to a state championship while averaging 22.5 points and 9.2 rebounds per game.',
  strengths: [
    'Elite scoring ability from multiple spots',
    'Defensive versatility and instincts',
    'High basketball IQ and court vision',
    'Strong work ethic and leadership',
    'Excellent footwork and fundamentals'
  ],
  areasForImprovement: [
    'Three-point shooting consistency',
    'Lower body strength development',
    'Experience against elite competition'
  ],
  generatedArticles: [
    {
      id: '1',
      title: 'Cooper Flagg: The Complete Package',
      type: 'Profile',
      excerpt: 'An in-depth look at the No. 1 overall recruit and what makes him special...',
      publishedAt: '2025-01-15',
      readingTime: 8,
      engagement: { likes: 1247, shares: 89, comments: 34 }
    },
    {
      id: '2',
      title: 'Why Cooper Flagg Chose Duke',
      type: 'Analysis',
      excerpt: 'Breaking down the factors that led to Flagg\'s commitment decision...',
      publishedAt: '2025-01-15',
      readingTime: 5,
      engagement: { likes: 892, shares: 67, comments: 28 }
    },
    {
      id: '3',
      title: 'Cooper Flagg\'s Journey to the Top',
      type: 'Feature',
      excerpt: 'The story of how a young talent became the nation\'s No. 1 recruit...',
      publishedAt: '2025-01-10',
      readingTime: 12,
      engagement: { likes: 756, shares: 45, comments: 22 }
    }
  ],
  highlights: [
    {
      id: '1',
      title: 'State Championship Game Highlights',
      description: 'Cooper\'s 28-point performance in the state title game',
      thumbnail: '/api/placeholder/300/200',
      duration: '3:45',
      views: 15420,
      platform: 'YouTube'
    },
    {
      id: '2',
      title: 'AAU Tournament MVP Performance',
      description: 'Elite scoring display in national AAU tournament',
      thumbnail: '/api/placeholder/300/200',
      duration: '4:12',
      views: 12890,
      platform: 'Instagram'
    },
    {
      id: '3',
      title: 'Skills Showcase',
      description: 'Full skills workout and shooting demonstration',
      thumbnail: '/api/placeholder/300/200',
      duration: '5:30',
      views: 9876,
      platform: 'TikTok'
    }
  ]
};

interface AthleteProfilePageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: AthleteProfilePageProps): Promise<Metadata> {
  return {
    title: `${athleteData.name} - Go4it Sports Profile`,
    description: `Complete profile of ${athleteData.name}, ${athleteData.position} at ${athleteData.school}. Rankings, stats, achievements, and recruitment news.`,
    keywords: `${athleteData.name}, ${athleteData.sport}, ${athleteData.school}, recruiting, ${athleteData.graduationYear} class`,
  };
}

export default function AthleteProfilePage({ params }: AthleteProfilePageProps) {
  // In production, fetch athlete data based on params.id
  if (params.id !== 'cooper-flagg') {
    notFound();
  }

  const athlete = athleteData;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cover Image */}
      <div className="relative h-64 md:h-80 bg-gradient-to-r from-blue-600 to-purple-600">
        <Image
          src={athlete.coverImage}
          alt={`${athlete.name} cover`}
          fill
          className="object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Profile Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="md:flex">
            {/* Profile Image */}
            <div className="md:w-1/3 p-6 flex justify-center">
              <div className="relative">
                <Image
                  src={athlete.image}
                  alt={athlete.name}
                  width={200}
                  height={200}
                  className="rounded-full border-4 border-white shadow-lg"
                />
                <div className="absolute -bottom-2 -right-2">
                  <Badge className="bg-yellow-500 text-white px-3 py-1">
                    #{athlete.ranking.national}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="md:w-2/3 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{athlete.name}</h1>
                  <p className="text-xl text-gray-600">
                    {athlete.position} • {athlete.school}
                  </p>
                  <p className="text-gray-500 flex items-center mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    {athlete.location} • Class of {athlete.graduationYear}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="px-3 py-1">
                    ⭐ {athlete.qualityScore}
                  </Badge>
                  <Badge className="bg-green-500 text-white px-3 py-1">
                    Committed
                  </Badge>
                </div>
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{athlete.height}</div>
                  <div className="text-sm text-gray-600">Height</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{athlete.weight}</div>
                  <div className="text-sm text-gray-600">Weight</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{athlete.stats.pointsPerGame}</div>
                  <div className="text-sm text-gray-600">PPG</div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{athlete.stats.reboundsPerGame}</div>
                  <div className="text-sm text-gray-600">RPG</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <Button>
                  <Eye className="w-4 h-4 mr-2" />
                  View Full Profile
                </Button>
                <Button variant="outline">
                  <Bookmark className="w-4 h-4 mr-2" />
                  Save Athlete
                </Button>
                <Button variant="outline">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Profile
                </Button>
                <Button variant="outline">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Visit School
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
            <TabsTrigger value="recruiting">Recruiting</TabsTrigger>
            <TabsTrigger value="articles">Articles</TabsTrigger>
            <TabsTrigger value="highlights">Highlights</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Bio and Strengths */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>About {athlete.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">{athlete.bio}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Zap className="w-5 h-5 mr-2" />
                      Strengths
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {athlete.strengths.map((strength, index) => (
                        <li key={index} className="flex items-start">
                          <Star className="w-4 h-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {athlete.areasForImprovement.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Target className="w-5 h-5 mr-2" />
                        Areas for Development
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {athlete.areasForImprovement.map((area, index) => (
                          <li key={index} className="flex items-start">
                            <TrendingUp className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{area}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Achievements */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Trophy className="w-5 h-5 mr-2" />
                      Achievements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {athlete.achievements.map((achievement, index) => (
                        <div key={index} className="flex items-start">
                          <Award className="w-4 h-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{achievement}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Social Media */}
                <Card>
                  <CardHeader>
                    <CardTitle>Social Media</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {athlete.socialMedia.instagram && (
                        <a
                          href={`https://instagram.com/${athlete.socialMedia.instagram.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-gray-700 hover:text-pink-600 transition-colors"
                        >
                          <Instagram className="w-4 h-4 mr-2" />
                          {athlete.socialMedia.instagram}
                        </a>
                      )}
                      {athlete.socialMedia.twitter && (
                        <a
                          href={`https://twitter.com/${athlete.socialMedia.twitter.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-gray-700 hover:text-blue-500 transition-colors"
                        >
                          <Twitter className="w-4 h-4 mr-2" />
                          {athlete.socialMedia.twitter}
                        </a>
                      )}
                      {athlete.socialMedia.youtube && (
                        <a
                          href={`https://youtube.com/${athlete.socialMedia.youtube}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-gray-700 hover:text-red-600 transition-colors"
                        >
                          <Youtube className="w-4 h-4 mr-2" />
                          {athlete.socialMedia.youtube}
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Quality Score Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart3 className="w-5 h-5 mr-2" />
                      Quality Score: {athlete.qualityScore}/100
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Skills & Athleticism</span>
                          <span>95/100</span>
                        </div>
                        <Progress value={95} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Academic Performance</span>
                          <span>88/100</span>
                        </div>
                        <Progress value={88} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Competition Level</span>
                          <span>92/100</span>
                        </div>
                        <Progress value={92} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Character & Work Ethic</span>
                          <span>96/100</span>
                        </div>
                        <Progress value={96} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Statistics Tab */}
          <TabsContent value="stats" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(athlete.stats).map(([key, value]) => (
                <Card key={key}>
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {typeof value === 'number' && value < 1 ? `${(value * 100).toFixed(1)}%` : value}
                    </div>
                    <div className="text-sm text-gray-600 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Season Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">28</div>
                      <div className="text-sm text-gray-600">Games Played</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">630</div>
                      <div className="text-sm text-gray-600">Total Points</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">258</div>
                      <div className="text-sm text-gray-600">Total Rebounds</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recruiting Tab */}
          <TabsContent value="recruiting" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>College Offers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {athlete.offers.map((offer, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <Trophy className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <div className="font-semibold">{offer.school}</div>
                          <div className="text-sm text-gray-500">
                            Offered: {new Date(offer.date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <Badge variant={offer.status === 'committed' ? 'default' : 'secondary'}>
                        {offer.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recruiting Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <div className="font-semibold">Committed to Duke University</div>
                      <div className="text-sm text-gray-600">January 15, 2025</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <div className="font-semibold">Official Visit to Duke</div>
                      <div className="text-sm text-gray-600">January 10, 2025</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                    <div>
                      <div className="font-semibold">First Offer from Kentucky</div>
                      <div className="text-sm text-gray-600">November 20, 2024</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Articles Tab */}
          <TabsContent value="articles" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {athlete.generatedArticles.map((article) => (
                <Card key={article.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <Badge variant="outline">{article.type}</Badge>
                      <span className="text-sm text-gray-500">{article.readingTime} min read</span>
                    </div>
                    <h3 className="font-bold text-lg mb-2">{article.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{article.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <ThumbsUp className="w-4 h-4 mr-1" />
                          {article.engagement.likes}
                        </span>
                        <span className="flex items-center">
                          <Share2 className="w-4 h-4 mr-1" />
                          {article.engagement.shares}
                        </span>
                      </div>
                      <Button size="sm">Read Article</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Highlights Tab */}
          <TabsContent value="highlights" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {athlete.highlights.map((highlight) => (
                <Card key={highlight.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <Image
                      src={highlight.thumbnail}
                      alt={highlight.title}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <div className="bg-white/90 rounded-full p-3">
                        <Activity className="w-6 h-6 text-gray-800" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2">
                      <Badge variant="secondary" className="text-xs">
                        {highlight.duration}
                      </Badge>
                    </div>
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-black/70 text-white text-xs">
                        {highlight.platform}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">{highlight.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{highlight.description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {highlight.views.toLocaleString()}
                      </span>
                      <Button size="sm" variant="outline">
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Watch
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
