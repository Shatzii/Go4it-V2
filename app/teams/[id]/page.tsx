'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Users, 
  Trophy, 
  TrendingUp, 
  GraduationCap,
  Calendar,
  MapPin,
  Award,
  Target,
  BookOpen,
  CheckCircle,
  AlertCircle,
  Star
} from 'lucide-react';

interface TeamMember {
  id: number;
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  position: string;
  jerseyNumber: number;
  status: string;
  eligibilityStatus: string;
  gpa: number;
  garScore: number;
  isVerified: boolean;
  performance: {
    latestGarScore: number;
    lastAnalysis: string;
    strengths: string[];
    improvements: string[];
  };
  academics: {
    courses: any[];
    averageGrade: number;
    ncaaEligible: boolean;
  };
}

interface Team {
  id: number;
  name: string;
  sport: string;
  division: string;
  season: string;
  year: number;
  homeVenue: string;
  teamColors: { primary: string; secondary: string };
  maxRosterSize: number;
  isActive: boolean;
}

interface TeamStats {
  totalPlayers: number;
  averageGpa: number;
  eligiblePlayers: number;
  scholarshipPlayers: number;
}

interface TeamData {
  team: Team;
  roster: TeamMember[];
  stats: TeamStats;
}

export default function TeamPage() {
  const params = useParams();
  const teamId = params?.id as string;
  
  const [teamData, setTeamData] = useState<TeamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'academics'>('overview');

  useEffect(() => {
    if (teamId) {
      fetchTeamData();
    }
  }, [teamId]);

  const fetchTeamData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/teams/${teamId}/roster`);
      if (!response.ok) {
        throw new Error('Failed to fetch team data');
      }
      
      const data = await response.json();
      setTeamData(data);
    } catch (err) {
      console.error('Error fetching team data:', err);
      setError('Failed to load team information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-700 rounded w-64 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-slate-800 rounded-lg p-6 h-96"></div>
              <div className="bg-slate-800 rounded-lg p-6 h-96"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !teamData) {
    return (
      <div className="min-h-screen bg-slate-900 p-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-8">
            <h2 className="text-red-400 text-xl font-semibold mb-2">Error Loading Team</h2>
            <p className="text-red-300 mb-4">{error}</p>
            <button
              onClick={fetchTeamData}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { team, roster, stats } = teamData;

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Link
              href="/teams"
              className="p-2 text-blue-200 hover:text-white hover:bg-blue-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{team.name}</h1>
              <div className="flex items-center gap-4 text-blue-200">
                <span className="flex items-center gap-2">
                  <Trophy className="h-4 w-4" />
                  {team.sport.replace('_', ' ')} • {team.division}
                </span>
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {team.season} {team.year}
                </span>
                <span className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {team.homeVenue}
                </span>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-4">
            {[
              { id: 'overview', label: 'Overview', icon: Users },
              { id: 'performance', label: 'Performance', icon: TrendingUp },
              { id: 'academics', label: 'Academics', icon: GraduationCap },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-blue-200 hover:text-white hover:bg-blue-800'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Team Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-2">
              <Users className="h-5 w-5 text-blue-400" />
              <span className="text-slate-300 font-medium">Total Players</span>
            </div>
            <div className="text-2xl font-bold text-white">{stats.totalPlayers}</div>
          </div>

          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-2">
              <GraduationCap className="h-5 w-5 text-green-400" />
              <span className="text-slate-300 font-medium">Average GPA</span>
            </div>
            <div className="text-2xl font-bold text-white">{stats.averageGpa.toFixed(2)}</div>
          </div>

          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span className="text-slate-300 font-medium">Eligible Players</span>
            </div>
            <div className="text-2xl font-bold text-white">{stats.eligiblePlayers}</div>
          </div>

          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-2">
              <Award className="h-5 w-5 text-yellow-400" />
              <span className="text-slate-300 font-medium">Scholarships</span>
            </div>
            <div className="text-2xl font-bold text-white">{stats.scholarshipPlayers}</div>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h3 className="text-xl font-semibold text-white mb-4">Team Roster</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left py-3 px-4 text-slate-300 font-medium">Player</th>
                      <th className="text-left py-3 px-4 text-slate-300 font-medium">Position</th>
                      <th className="text-left py-3 px-4 text-slate-300 font-medium">#</th>
                      <th className="text-left py-3 px-4 text-slate-300 font-medium">GPA</th>
                      <th className="text-left py-3 px-4 text-slate-300 font-medium">GAR</th>
                      <th className="text-left py-3 px-4 text-slate-300 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roster.map((member) => (
                      <tr key={member.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                              {member.firstName?.[0]}{member.lastName?.[0]}
                            </div>
                            <div>
                              <div className="text-white font-medium">{member.firstName} {member.lastName}</div>
                              <div className="text-slate-400 text-sm">{member.email}</div>
                            </div>
                            {member.isVerified && (
                              <Star className="h-4 w-4 text-yellow-400" />
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-300">{member.position || 'N/A'}</td>
                        <td className="py-3 px-4 text-slate-300">{member.jerseyNumber || '-'}</td>
                        <td className="py-3 px-4">
                          <span className={`${
                            member.gpa >= 3.5 ? 'text-green-400' : 
                            member.gpa >= 3.0 ? 'text-yellow-400' : 'text-red-400'
                          }`}>
                            {member.gpa?.toFixed(2) || 'N/A'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`${
                            (member.performance?.latestGarScore || member.garScore) >= 80 ? 'text-green-400' : 
                            (member.performance?.latestGarScore || member.garScore) >= 60 ? 'text-yellow-400' : 'text-red-400'
                          }`}>
                            {member.performance?.latestGarScore || member.garScore || 'N/A'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            member.eligibilityStatus === 'eligible' 
                              ? 'bg-green-900/30 text-green-400' 
                              : 'bg-red-900/30 text-red-400'
                          }`}>
                            {member.eligibilityStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-400" />
                Team Performance Metrics
              </h3>
              <div className="space-y-4">
                {roster.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {member.firstName?.[0]}{member.lastName?.[0]}
                      </div>
                      <div>
                        <div className="text-white font-medium">{member.firstName} {member.lastName}</div>
                        <div className="text-slate-400 text-sm">{member.position}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-semibold ${
                        (member.performance?.latestGarScore || member.garScore) >= 80 ? 'text-green-400' : 
                        (member.performance?.latestGarScore || member.garScore) >= 60 ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {member.performance?.latestGarScore || member.garScore || 'N/A'}
                      </div>
                      <div className="text-slate-400 text-sm">GAR Score</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-400" />
                Performance Insights
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
                  <h4 className="text-green-400 font-medium mb-2">Team Strengths</h4>
                  <ul className="text-green-300 text-sm space-y-1">
                    <li>• Strong overall GAR performance</li>
                    <li>• Good roster depth in key positions</li>
                    <li>• High team chemistry indicators</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
                  <h4 className="text-yellow-400 font-medium mb-2">Areas for Improvement</h4>
                  <ul className="text-yellow-300 text-sm space-y-1">
                    <li>• Focus on consistency across all positions</li>
                    <li>• Individual skill development needed</li>
                    <li>• Enhanced team coordination</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'academics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-purple-400" />
                Academic Performance
              </h3>
              <div className="space-y-4">
                {roster.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {member.firstName?.[0]}{member.lastName?.[0]}
                      </div>
                      <div>
                        <div className="text-white font-medium">{member.firstName} {member.lastName}</div>
                        <div className="text-slate-400 text-sm">
                          {member.academics?.ncaaEligible ? (
                            <span className="text-green-400">NCAA Eligible</span>
                          ) : (
                            <span className="text-red-400">Needs Review</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-semibold ${
                        member.gpa >= 3.5 ? 'text-green-400' : 
                        member.gpa >= 3.0 ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {member.gpa?.toFixed(2) || 'N/A'}
                      </div>
                      <div className="text-slate-400 text-sm">GPA</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                Academic Overview
              </h3>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-300">Team GPA Average</span>
                    <span className="text-white font-semibold">{stats.averageGpa.toFixed(2)}</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min((stats.averageGpa / 4.0) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">NCAA Eligible Players</span>
                    <span className="text-green-400 font-semibold">
                      {roster.filter(m => m.academics?.ncaaEligible).length}/{roster.length}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Players Above 3.5 GPA</span>
                    <span className="text-green-400 font-semibold">
                      {roster.filter(m => m.gpa >= 3.5).length}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Academic Support Needed</span>
                    <span className="text-yellow-400 font-semibold">
                      {roster.filter(m => m.gpa < 3.0).length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}