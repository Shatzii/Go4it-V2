'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Calendar, Trophy, Star, Clock, MapPin, Zap } from 'lucide-react';
import Link from 'next/link';

export default function BasketballPage() {
  const [selectedDivision, setSelectedDivision] = useState('all');

  const divisions = [
    { id: 'u10', name: 'U10', ages: '8-10', teams: 2, players: 24 },
    { id: 'u12', name: 'U12', ages: '11-12', teams: 3, players: 36 },
    { id: 'u14', name: 'U14', ages: '13-14', teams: 2, players: 28 },
    { id: 'u16', name: 'U16', ages: '15-16', teams: 2, players: 32 },
    { id: 'u18', name: 'U18', ages: '17-18', teams: 1, players: 15 },
    { id: 'adult', name: 'Adult', ages: '18+', teams: 1, players: 12 },
  ];

  const upcomingGames = [
    {
      id: 1,
      homeTeam: 'Court Kings',
      awayTeam: 'Slam Dunkers',
      division: 'U16',
      date: '2025-01-27',
      time: '6:00 PM',
      location: 'Gym A',
    },
    {
      id: 2,
      homeTeam: 'Hoop Heroes',
      awayTeam: 'Fast Break',
      division: 'U14',
      date: '2025-01-27',
      time: '7:30 PM',
      location: 'Gym B',
    },
    {
      id: 3,
      homeTeam: 'Shooters',
      awayTeam: 'Rebounds',
      division: 'U12',
      date: '2025-01-28',
      time: '5:00 PM',
      location: 'Gym A',
    },
  ];

  const teams = [
    {
      name: 'Court Kings',
      division: 'U16',
      coach: 'Coach Jackson',
      players: 12,
      wins: 15,
      losses: 4,
    },
    {
      name: 'Slam Dunkers',
      division: 'U14',
      coach: 'Coach Anderson',
      players: 11,
      wins: 10,
      losses: 7,
    },
    {
      name: 'Hoop Heroes',
      division: 'U14',
      coach: 'Coach Wilson',
      players: 13,
      wins: 12,
      losses: 5,
    },
    {
      name: 'Fast Break',
      division: 'U16',
      coach: 'Coach Thompson',
      players: 14,
      wins: 8,
      losses: 9,
    },
    {
      name: 'Shooters',
      division: 'U12',
      coach: 'Coach Martinez',
      players: 12,
      wins: 14,
      losses: 3,
    },
    { name: 'Rebounds', division: 'U12', coach: 'Coach Davis', players: 11, wins: 9, losses: 8 },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-800 to-orange-700 border-b border-orange-600">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center mb-4">
                <Zap className="w-8 h-8 text-white mr-3" />
                <Badge variant="outline" className="text-white border-white">
                  Fundamental Training Program
                </Badge>
              </div>
              <h1 className="text-4xl font-bold mb-4">🏀 Basketball Development Program</h1>
              <p className="text-xl text-orange-100 max-w-2xl">
                Competitive basketball program emphasizing fundamentals, teamwork, and character
                development through disciplined training and game experience.
              </p>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/10 rounded-lg p-6 backdrop-blur">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">147</div>
                  <div className="text-orange-100">Total Players</div>
                </div>
                <div className="flex justify-between mt-4 text-sm">
                  <div className="text-center">
                    <div className="font-bold text-white">11</div>
                    <div className="text-orange-100">Teams</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-white">6</div>
                    <div className="text-orange-100">Divisions</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-white">Winter</div>
                    <div className="text-orange-100">Season</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link href="/team-sports/basketball/register">
            <Card className="bg-orange-600 hover:bg-orange-700 border-orange-500 cursor-pointer transition-all">
              <CardContent className="p-6 text-center">
                <Users className="w-8 h-8 text-white mx-auto mb-2" />
                <div className="text-xl font-bold text-white">Join a Team</div>
                <div className="text-orange-100">Register for upcoming season</div>
              </CardContent>
            </Card>
          </Link>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6 text-center">
              <Calendar className="w-8 h-8 text-orange-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-white">View Schedule</div>
              <div className="text-slate-400">Games and practice times</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6 text-center">
              <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-white">Team Stats</div>
              <div className="text-slate-400">Rankings and performance</div>
            </CardContent>
          </Card>
        </div>

        {/* Age Divisions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Age Divisions</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {divisions.map((division) => (
              <Card
                key={division.id}
                className="bg-slate-800 border-slate-700 hover:border-orange-500 cursor-pointer transition-all"
                onClick={() => setSelectedDivision(division.id)}
              >
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-white mb-1">{division.name}</div>
                  <div className="text-slate-400 text-sm mb-2">Ages {division.ages}</div>
                  <div className="text-xs text-slate-500">
                    {division.teams} teams • {division.players} players
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Upcoming Games */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Upcoming Games</h2>
          <div className="space-y-4">
            {upcomingGames.map((game) => (
              <Card key={game.id} className="bg-slate-800 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <Badge className="bg-orange-600 text-white">{game.division}</Badge>
                      <div className="text-lg font-semibold text-white">
                        {game.homeTeam} vs {game.awayTeam}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-slate-400">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {game.date}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {game.time}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {game.location}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Current Teams */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Current Teams</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map((team, index) => (
              <Card key={index} className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white">{team.name}</CardTitle>
                    <Badge className="bg-orange-600 text-white">{team.division}</Badge>
                  </div>
                  <CardDescription className="text-slate-400">Coach: {team.coach}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-white">{team.players}</div>
                      <div className="text-xs text-slate-400">Players</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-green-400">{team.wins}</div>
                      <div className="text-xs text-slate-400">Wins</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-red-400">{team.losses}</div>
                      <div className="text-xs text-slate-400">Losses</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Program Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Zap className="w-5 h-5 mr-2" />
                Fundamental Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-center">
                  <Star className="w-4 h-4 text-orange-400 mr-2" />
                  Ball handling and dribbling mastery
                </li>
                <li className="flex items-center">
                  <Star className="w-4 h-4 text-orange-400 mr-2" />
                  Shooting form and accuracy training
                </li>
                <li className="flex items-center">
                  <Star className="w-4 h-4 text-orange-400 mr-2" />
                  Defensive positioning and footwork
                </li>
                <li className="flex items-center">
                  <Star className="w-4 h-4 text-orange-400 mr-2" />
                  Passing vision and court awareness
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Trophy className="w-5 h-5 mr-2" />
                Team Strategy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 mr-2" />
                  Pick and roll execution
                </li>
                <li className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 mr-2" />
                  Fast break opportunities
                </li>
                <li className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 mr-2" />
                  Zone and man-to-man defense
                </li>
                <li className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 mr-2" />
                  Game situation management
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
