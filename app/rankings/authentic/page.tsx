'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Trophy,
  TrendingUp,
  Users,
  Target,
  Award,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
  RefreshCw,
  Database,
  Shield,
  Info,
} from 'lucide-react';

interface AuthenticAthlete {
  id: string;
  name: string;
  sport: string;
  position?: string;
  school?: string;
  state?: string;
  classYear?: string;
  garScore?: number;
  garBreakdown?: {
    technique: number;
    athleticism: number;
    gameIQ: number;
    consistency: number;
    potential: number;
  };
  source: string;
  confidence: number;
  verificationStatus?: 'verified' | 'pending' | 'unverified';
  lastUpdated: string;
}

interface RankingMetadata {
  totalRanked: number;
  averageGARScore: number;
  sportBreakdown: Record<string, number>;
  verificationBreakdown: Record<string, number>;
  dataSource: string;
  rankingAlgorithm: string;
  lastUpdated: string;
}

export default function AuthenticRankingsPage() {
  const [athletes, setAthletes] = useState<AuthenticAthlete[]>([]);
  const [metadata, setMetadata] = useState<RankingMetadata | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSport, setSelectedSport] = useState('all');
  const [minConfidence, setMinConfidence] = useState(0.7);

  const loadAuthenticRankings = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/rankings/improved-gar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sport: selectedSport,
          minConfidence,
          maxResults: 100,
          includeUnverified: false,
          calculateAdvancedMetrics: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success) {
        setAthletes(data.athletes || []);
        setMetadata(data.metadata);
      } else {
        throw new Error(data.message || 'Failed to load authentic rankings');
      }
    } catch (err: any) {
      console.error('Authentic rankings error:', err);
      setError(err.message || 'Failed to load authentic athlete rankings');
      setAthletes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAuthenticRankings();
  }, [selectedSport, minConfidence]);

  const getVerificationIcon = (status?: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-600 bg-green-100';
    if (confidence >= 0.8) return 'text-blue-600 bg-blue-100';
    if (confidence >= 0.7) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-8 w-8 text-blue-400" />
            <h1 className="text-4xl font-bold">Authentic Athlete Rankings</h1>
            <Badge variant="outline" className="ml-2">
              GAR v2.0
            </Badge>
          </div>
          <p className="text-slate-400 text-lg max-w-3xl">
            Advanced GAR scoring system using only verified, authentic athlete data from legitimate
            sources. No synthetic data - all profiles sourced from MaxPreps, HUDL, Athletic.net, and
            official athletics databases.
          </p>
        </div>

        {/* Controls */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-sm">Sport Filter</CardTitle>
            </CardHeader>
            <CardContent>
              <select
                value={selectedSport}
                onChange={(e) => setSelectedSport(e.target.value)}
                className="w-full p-2 rounded bg-slate-700 border border-slate-600 text-white"
              >
                <option value="all">All Sports</option>
                <option value="basketball">Basketball</option>
                <option value="football">Football</option>
                <option value="track">Track & Field</option>
                <option value="soccer">Soccer</option>
              </select>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-sm">Data Confidence</CardTitle>
            </CardHeader>
            <CardContent>
              <select
                value={minConfidence}
                onChange={(e) => setMinConfidence(parseFloat(e.target.value))}
                className="w-full p-2 rounded bg-slate-700 border border-slate-600 text-white"
              >
                <option value={0.9}>90%+ Verified</option>
                <option value={0.8}>80%+ High</option>
                <option value={0.7}>70%+ Medium</option>
                <option value={0.6}>60%+ Basic</option>
              </select>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-sm">Total Athletes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">{metadata?.totalRanked || 0}</div>
              <p className="text-xs text-slate-400">Authentic profiles</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-sm">Average GAR</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">
                {metadata?.averageGARScore?.toFixed(1) || '0.0'}
              </div>
              <p className="text-xs text-slate-400">Score range: 0-100</p>
            </CardContent>
          </Card>
        </div>

        {/* Data Source Information */}
        {metadata && (
          <Card className="bg-slate-800/50 border-slate-700 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Data Authenticity Report
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Data Source</h4>
                  <p className="text-sm text-slate-400">{metadata.dataSource}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Algorithm: {metadata.rankingAlgorithm}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Sport Distribution</h4>
                  {Object.entries(metadata.sportBreakdown || {}).map(([sport, count]) => (
                    <div key={sport} className="flex justify-between text-sm">
                      <span className="capitalize">{sport}</span>
                      <span className="text-blue-400">{count}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Verification Status</h4>
                  {Object.entries(metadata.verificationBreakdown || {}).map(([status, count]) => (
                    <div key={status} className="flex justify-between text-sm items-center">
                      <span className="flex items-center gap-1 capitalize">
                        {getVerificationIcon(status)}
                        {status}
                      </span>
                      <span className="text-blue-400">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-700">
                <Button
                  onClick={loadAuthenticRankings}
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  {loading ? 'Refreshing...' : 'Refresh Rankings'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {error && (
          <Card className="bg-red-900/20 border-red-700 mb-8">
            <CardHeader>
              <CardTitle className="text-red-400">Data Authenticity Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-300">{error}</p>
              <p className="text-sm text-red-400 mt-2">
                Authentic rankings require verified athlete data. Please check data source
                connectivity.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {loading && (
          <Card className="bg-slate-800 border-slate-700 mb-8">
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-400" />
                <p className="text-lg">Loading authentic athlete data...</p>
                <p className="text-sm text-slate-400">Scraping verified sources</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Athletes Ranking List */}
        <div className="space-y-4">
          {athletes.map((athlete, index) => (
            <Card
              key={athlete.id}
              className="bg-slate-800 border-slate-700 hover:border-blue-500 transition-colors"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg">
                      #{index + 1}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{athlete.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <span>{athlete.sport}</span>
                        {athlete.position && <span>• {athlete.position}</span>}
                        {athlete.school && <span>• {athlete.school}</span>}
                        {athlete.state && <span>• {athlete.state}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-blue-400">
                      {athlete.garScore || 'N/A'}
                    </div>
                    <p className="text-xs text-slate-400">GAR Score</p>
                  </div>
                </div>

                {/* GAR Breakdown */}
                {athlete.garBreakdown && (
                  <div className="grid grid-cols-5 gap-4 mb-4">
                    {Object.entries(athlete.garBreakdown).map(([category, score]) => (
                      <div key={category} className="text-center">
                        <div className="text-sm font-medium capitalize mb-1">{category}</div>
                        <Progress value={score} className="h-2 mb-1" />
                        <div className="text-xs text-slate-400">{score}/100</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Metadata */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      {getVerificationIcon(athlete.verificationStatus)}
                      <span className="capitalize">
                        {athlete.verificationStatus || 'unverified'}
                      </span>
                    </div>
                    <Badge className={`${getConfidenceColor(athlete.confidence)} text-xs`}>
                      {(athlete.confidence * 100).toFixed(1)}% confidence
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {athlete.source}
                    </Badge>
                  </div>
                  <div className="text-slate-400">
                    Updated: {new Date(athlete.lastUpdated).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {!loading && athletes.length === 0 && !error && (
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="text-center py-12">
              <Users className="h-12 w-12 mx-auto mb-4 text-slate-400" />
              <h3 className="text-lg font-semibold mb-2">No Authentic Athlete Data</h3>
              <p className="text-slate-400 mb-4">
                No verified athlete profiles meet the current criteria. Try lowering the confidence
                threshold or checking different sports.
              </p>
              <Button onClick={loadAuthenticRankings} className="flex items-center gap-2 mx-auto">
                <RefreshCw className="h-4 w-4" />
                Refresh Data Sources
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
