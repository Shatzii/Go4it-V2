'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Users, Calendar, Trophy, Star, Clock, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function FlagFootballPage() {
  const [selectedDivision, setSelectedDivision] = useState('all');

  const divisions = [
    { id: '6u', name: '6U', ages: '4-6', teams: 2, players: 24 },
    { id: '8u', name: '8U', ages: '7-8', teams: 3, players: 36 },
    { id: '10u', name: '10U', ages: '9-10', teams: 2, players: 28 },
    { id: '12u', name: '12U', ages: '11-12', teams: 3, players: 42 },
    { id: '14u', name: '14U', ages: '13-14', teams: 2, players: 32 },
    { id: '16u', name: '16U', ages: '15-16', teams: 1, players: 14 },
  ];

  const upcomingGames = [
    {
      id: 1,
      homeTeam: 'Lightning Bolts',
      awayTeam: 'Thunder Hawks',
      division: '12U',
      date: '2025-01-25',
      time: '10:00 AM',
      location: 'Field A',
    },
    {
      id: 2,
      homeTeam: 'Storm Eagles',
      awayTeam: 'Fire Dragons',
      division: '10U',
      date: '2025-01-25',
      time: '11:30 AM',
      location: 'Field B',
    },
    {
      id: 3,
      homeTeam: 'Sky Wolves',
      awayTeam: 'Wind Runners',
      division: '14U',
      date: '2025-01-26',
      time: '9:00 AM',
      location: 'Field A',
    },
  ];

  const teams = [
    {
      name: 'Lightning Bolts',
      division: '12U',
      coach: 'Coach Martinez',
      players: 14,
      wins: 8,
      losses: 2,
    },
    {
      name: 'Thunder Hawks',
      division: '12U',
      coach: 'Coach Johnson',
      players: 13,
      wins: 7,
      losses: 3,
    },
    {
      name: 'Storm Eagles',
      division: '10U',
      coach: 'Coach Williams',
      players: 15,
      wins: 9,
      losses: 1,
    },
    {
      name: 'Fire Dragons',
      division: '10U',
      coach: 'Coach Davis',
      players: 13,
      wins: 6,
      losses: 4,
    },
    { name: 'Sky Wolves', division: '14U', coach: 'Coach Brown', players: 16, wins: 8, losses: 2 },
    {
      name: 'Wind Runners',
      division: '14U',
      coach: 'Coach Wilson',
      players: 16,
      wins: 5,
      losses: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-800 to-green-700 border-b border-green-600">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center mb-4">
                <Shield className="w-8 h-8 text-white mr-3" />
                <Badge variant="outline" className="text-white border-white">
                  Official USA Football Affiliate
                </Badge>
              </div>
              <h1 className="text-4xl font-bold mb-4">🏈 Flag Football Program</h1>
              <p className="text-xl text-green-100 max-w-2xl">
                Safe, fun, and competitive flag football following official USA Football guidelines.
                No-contact play focusing on skill development and teamwork.
              </p>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/10 rounded-lg p-6 backdrop-blur">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">176</div>
                  <div className="text-green-100">Total Players</div>
                </div>
                <div className="flex justify-between mt-4 text-sm">
                  <div className="text-center">
                    <div className="font-bold text-white">13</div>
                    <div className="text-green-100">Teams</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-white">6</div>
                    <div className="text-green-100">Divisions</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-white">Fall</div>
                    <div className="text-green-100">Season</div>
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
          <Link href="/team-sports/flag-football/register">
            <Card className="bg-green-600 hover:bg-green-700 border-green-500 cursor-pointer transition-all">
              <CardContent className="p-6 text-center">
                <Users className="w-8 h-8 text-white mx-auto mb-2" />
                <div className="text-xl font-bold text-white">Join a Team</div>
                <div className="text-green-100">Register for upcoming season</div>
              </CardContent>
            </Card>
          </Link>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6 text-center">
              <Calendar className="w-8 h-8 text-blue-400 mx-auto mb-2" />
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
                className="bg-slate-800 border-slate-700 hover:border-green-500 cursor-pointer transition-all"
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
                      <Badge className="bg-green-600 text-white">{game.division}</Badge>
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
                    <Badge className="bg-green-600 text-white">{team.division}</Badge>
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
                <Shield className="w-5 h-5 mr-2" />
                USA Football Certified
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-center">
                  <Star className="w-4 h-4 text-green-400 mr-2" />
                  Official USA Football rules and regulations
                </li>
                <li className="flex items-center">
                  <Star className="w-4 h-4 text-green-400 mr-2" />
                  Certified coaches with safety training
                </li>
                <li className="flex items-center">
                  <Star className="w-4 h-4 text-green-400 mr-2" />
                  No-contact, flag-pulling gameplay
                </li>
                <li className="flex items-center">
                  <Star className="w-4 h-4 text-green-400 mr-2" />
                  Age-appropriate field sizes and rules
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Trophy className="w-5 h-5 mr-2" />
                Skill Development Focus
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-center">
                  <Star className="w-4 h-4 text-blue-400 mr-2" />
                  Fundamental throwing and catching techniques
                </li>
                <li className="flex items-center">
                  <Star className="w-4 h-4 text-blue-400 mr-2" />
                  Route running and defensive positioning
                </li>
                <li className="flex items-center">
                  <Star className="w-4 h-4 text-blue-400 mr-2" />
                  Teamwork and sportsmanship values
                </li>
                <li className="flex items-center">
                  <Star className="w-4 h-4 text-blue-400 mr-2" />
                  Game strategy and football IQ development
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
