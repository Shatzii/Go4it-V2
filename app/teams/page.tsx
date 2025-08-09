'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Users, 
  Plus, 
  Calendar, 
  Trophy, 
  MapPin, 
  Edit,
  Trash2,
  Filter,
  GraduationCap,
  TrendingUp
} from 'lucide-react';

interface Team {
  id: number;
  name: string;
  sport: string;
  division: string;
  season: string;
  year: number;
  homeVenue: string;
  teamColors: { primary: string; secondary: string };
  rosterCount: number;
  maxRosterSize: number;
  availableSpots: number;
  isActive: boolean;
}

const sports = [
  { value: 'flag_football', label: 'Flag Football', icon: '🏈' },
  { value: 'soccer', label: 'Soccer', icon: '⚽' },
  { value: 'basketball', label: 'Basketball', icon: '🏀' },
  { value: 'track_field', label: 'Track & Field', icon: '🏃‍♂️' }
];

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedSport, setSelectedSport] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTeams();
  }, [selectedSport]);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (selectedSport !== 'all') {
        params.set('sport', selectedSport);
      }
      
      const response = await fetch(`/api/teams?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch teams');
      }
      
      const teamsData = await response.json();
      setTeams(teamsData);
    } catch (err) {
      console.error('Error fetching teams:', err);
      setError('Failed to load teams. Please try again.');
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-slate-800 rounded-lg p-6 h-64"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 p-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-8">
            <h2 className="text-red-400 text-xl font-semibold mb-2">Error Loading Teams</h2>
            <p className="text-red-300 mb-4">{error}</p>
            <button
              onClick={fetchTeams}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const filteredTeams = selectedSport === 'all' 
    ? teams 
    : teams.filter(team => team.sport === selectedSport);

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Team Management</h1>
              <p className="text-blue-200">Manage teams, track performance, and monitor academic progress</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Team
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <span className="text-slate-300 text-sm">Filter by sport:</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedSport('all')}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                selectedSport === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              All Sports
            </button>
            {sports.map((sport) => (
              <button
                key={sport.value}
                onClick={() => setSelectedSport(sport.value)}
                className={`px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                  selectedSport === sport.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                <span>{sport.icon}</span>
                {sport.label}
              </button>
            ))}
          </div>
        </div>

        {/* Teams Grid */}
        {filteredTeams.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-slate-800 rounded-lg p-8 max-w-md mx-auto">
              <Trophy className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-300 mb-2">No Teams Found</h3>
              <p className="text-slate-400 mb-4">
                {selectedSport === 'all' 
                  ? 'No teams have been created yet.' 
                  : `No teams found for ${sports.find(s => s.value === selectedSport)?.label || selectedSport}.`
                }
              </p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Create Your First Team
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeams.map((team) => (
              <Link
                key={team.id}
                href={`/teams/${team.id}`}
                className="group"
              >
                <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-blue-500 transition-all duration-200 group-hover:transform group-hover:scale-105">
                  {/* Team Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-1">{team.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <span>{sports.find(s => s.value === team.sport)?.icon}</span>
                        <span>{sports.find(s => s.value === team.sport)?.label}</span>
                        <span>•</span>
                        <span>{team.division}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-700 rounded-lg transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Team Stats */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-300">
                        <Users className="h-4 w-4 text-blue-400" />
                        <span className="text-sm">Roster</span>
                      </div>
                      <span className="text-white font-medium">
                        {team.rosterCount}/{team.maxRosterSize}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-300">
                        <MapPin className="h-4 w-4 text-green-400" />
                        <span className="text-sm">Home Venue</span>
                      </div>
                      <span className="text-white text-sm">{team.homeVenue}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-300">
                        <Calendar className="h-4 w-4 text-purple-400" />
                        <span className="text-sm">Season</span>
                      </div>
                      <span className="text-white text-sm">{team.season} {team.year}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-slate-300">Roster Capacity</span>
                      <span className="text-slate-300">
                        {Math.round((team.rosterCount / team.maxRosterSize) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min((team.rosterCount / team.maxRosterSize) * 100, 100)}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Performance Indicators */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 text-green-400">
                      <TrendingUp className="h-3 w-3" />
                      <span>Active</span>
                    </div>
                    <div className="flex items-center gap-1 text-blue-400">
                      <GraduationCap className="h-3 w-3" />
                      <span>Academy Ready</span>
                    </div>
                    {team.availableSpots > 0 && (
                      <div className="text-slate-400">
                        {team.availableSpots} spots available
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}