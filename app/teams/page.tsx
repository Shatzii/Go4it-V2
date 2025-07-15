'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Calendar, 
  Trophy, 
  MapPin, 
  Edit,
  Trash2,
  Filter
} from 'lucide-react';

interface Team {
  id: string;
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

  useEffect(() => {
    // Mock data for demonstration
    const mockTeams: Team[] = [
      {
        id: '1',
        name: 'Thunder Eagles',
        sport: 'flag_football',
        division: 'JV',
        season: 'Fall',
        year: 2024,
        homeVenue: 'Memorial Stadium',
        teamColors: { primary: '#1e40af', secondary: '#fbbf24' },
        rosterCount: 18,
        maxRosterSize: 22,
        availableSpots: 4,
        isActive: true
      },
      {
        id: '2',
        name: 'Lightning Bolts',
        sport: 'soccer',
        division: 'Varsity',
        season: 'Spring',
        year: 2024,
        homeVenue: 'Athletic Complex',
        teamColors: { primary: '#dc2626', secondary: '#000000' },
        rosterCount: 24,
        maxRosterSize: 26,
        availableSpots: 2,
        isActive: true
      },
      {
        id: '3',
        name: 'Storm Runners',
        sport: 'track_field',
        division: 'Varsity',
        season: 'Spring',
        year: 2024,
        homeVenue: 'Track & Field Complex',
        teamColors: { primary: '#16a34a', secondary: '#ffffff' },
        rosterCount: 32,
        maxRosterSize: 40,
        availableSpots: 8,
        isActive: true
      }
    ];
    
    setTimeout(() => {
      setTeams(mockTeams);
      setLoading(false);
    }, 500);
  }, []);

  const filteredTeams = selectedSport === 'all' 
    ? teams 
    : teams.filter(team => team.sport === selectedSport);

  const getSportIcon = (sport: string) => {
    const sportData = sports.find(s => s.value === sport);
    return sportData ? sportData.icon : '🏆';
  };

  const getSportLabel = (sport: string) => {
    const sportData = sports.find(s => s.value === sport);
    return sportData ? sportData.label : sport;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-white">Loading teams...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Team Management</h1>
              <p className="text-slate-400">Manage your athletic teams and rosters</p>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
              <Plus className="h-4 w-4" />
              <span>Create Team</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <span className="text-slate-400">Filter by sport:</span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setSelectedSport('all')}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                selectedSport === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              All Sports
            </button>
            {sports.map(sport => (
              <button
                key={sport.value}
                onClick={() => setSelectedSport(sport.value)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedSport === sport.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {sport.icon} {sport.label}
              </button>
            ))}
          </div>
        </div>

        {/* Teams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.map((team) => (
            <div key={team.id} className="bg-slate-800 rounded-lg overflow-hidden hover:bg-slate-750 transition-colors">
              {/* Team Header */}
              <div 
                className="h-16 flex items-center justify-between px-6"
                style={{ backgroundColor: team.teamColors.primary }}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getSportIcon(team.sport)}</span>
                  <div>
                    <h3 className="text-white font-semibold">{team.name}</h3>
                    <p className="text-white/80 text-sm">{team.division}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="text-white/80 hover:text-white p-1">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="text-white/80 hover:text-white p-1">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Team Content */}
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm">Sport</span>
                    <span className="text-white text-sm">{getSportLabel(team.sport)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm">Season</span>
                    <span className="text-white text-sm">{team.season} {team.year}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm">Venue</span>
                    <span className="text-white text-sm flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {team.homeVenue}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm">Roster</span>
                    <span className="text-white text-sm flex items-center">
                      <Users className="h-3 w-3 mr-1" />
                      {team.rosterCount}/{team.maxRosterSize}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-slate-400">Roster Capacity</span>
                    <span className="text-slate-400">{Math.round((team.rosterCount / team.maxRosterSize) * 100)}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(team.rosterCount / team.maxRosterSize) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Available Spots */}
                {team.availableSpots > 0 && (
                  <div className="mt-4 p-3 bg-green-900/20 rounded-lg border border-green-800">
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 bg-green-400 rounded-full"></div>
                      <span className="text-green-400 text-sm">
                        {team.availableSpots} spots available
                      </span>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="mt-6 flex space-x-3">
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-sm transition-colors">
                    Manage Roster
                  </button>
                  <button className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 px-4 rounded text-sm transition-colors">
                    View Stats
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredTeams.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="h-16 w-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No teams found</h3>
            <p className="text-slate-400 mb-6">
              {selectedSport === 'all' 
                ? "Create your first team to get started"
                : `No teams found for ${getSportLabel(selectedSport)}`
              }
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 mx-auto transition-colors">
              <Plus className="h-4 w-4" />
              <span>Create Team</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}