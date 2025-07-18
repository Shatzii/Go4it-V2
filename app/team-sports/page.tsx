'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, Trophy, Calendar, BookOpen, Star, Shield } from 'lucide-react'
import Link from 'next/link'

export default function TeamSportsPage() {
  const [selectedSport, setSelectedSport] = useState<string | null>(null)

  const sports = [
    {
      id: 'flag-football',
      name: 'Flag Football',
      description: 'Official USA Football affiliate program with age-appropriate divisions',
      icon: '🏈',
      color: 'bg-green-500',
      divisions: ['6U', '8U', '10U', '12U', '14U', '16U'],
      features: ['USA Football Certified', 'No-Contact Safety', 'Official Rules', 'Coach Certification'],
      activeTeams: 12,
      totalPlayers: 186,
      nextSeason: 'Fall 2025'
    },
    {
      id: 'soccer',
      name: 'Soccer',
      description: 'Youth soccer development with professional coaching and skill building',
      icon: '⚽',
      color: 'bg-blue-500',
      divisions: ['U8', 'U10', 'U12', 'U14', 'U16', 'U18'],
      features: ['FIFA Guidelines', 'Skill Development', 'Position Training', 'Tournament Play'],
      activeTeams: 8,
      totalPlayers: 142,
      nextSeason: 'Spring 2025'
    },
    {
      id: 'basketball',
      name: 'Basketball',
      description: 'Competitive basketball program focusing on fundamentals and teamwork',
      icon: '🏀',
      color: 'bg-orange-500',
      divisions: ['U10', 'U12', 'U14', 'U16', 'U18', 'Adult'],
      features: ['Fundamental Training', 'Team Strategy', 'League Play', 'Skills Camps'],
      activeTeams: 10,
      totalPlayers: 158,
      nextSeason: 'Winter 2025'
    }
  ]

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 border-b border-slate-600">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-green-400 mr-3" />
              <Badge variant="outline" className="text-green-400 border-green-400">
                Official USA Football Affiliate
              </Badge>
            </div>
            <h1 className="text-4xl font-bold mb-4">Team Sports Programs</h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Join our competitive team sports programs featuring Flag Football, Soccer, and Basketball. 
              Professional coaching, skill development, and team building for all ages.
            </p>
          </div>
        </div>
      </div>

      {/* Program Stats */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">486</div>
              <div className="text-slate-400">Total Players</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6 text-center">
              <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">30</div>
              <div className="text-slate-400">Active Teams</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6 text-center">
              <Calendar className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">3</div>
              <div className="text-slate-400">Sports Programs</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6 text-center">
              <Star className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">98%</div>
              <div className="text-slate-400">Player Satisfaction</div>
            </CardContent>
          </Card>
        </div>

        {/* Sports Programs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {sports.map((sport) => (
            <Card 
              key={sport.id} 
              className="bg-slate-800 border-slate-700 hover:border-slate-600 transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedSport(sport.id)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-3xl">{sport.icon}</div>
                    <div>
                      <CardTitle className="text-white">{sport.name}</CardTitle>
                      <CardDescription className="text-slate-400">
                        {sport.activeTeams} teams • {sport.totalPlayers} players
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className={`${sport.color} text-white`}>
                    {sport.nextSeason}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 mb-4">{sport.description}</p>
                
                <div className="mb-4">
                  <h4 className="font-semibold text-white mb-2">Age Divisions</h4>
                  <div className="flex flex-wrap gap-2">
                    {sport.divisions.map((division) => (
                      <Badge key={division} variant="outline" className="text-slate-300 border-slate-600">
                        {division}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-white mb-2">Program Features</h4>
                  <ul className="space-y-1">
                    {sport.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-slate-300 text-sm">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-2"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3">
                  <Link href={`/team-sports/${sport.id}/register`}>
                    <Button className={`w-full ${sport.color} hover:opacity-90 text-white`}>
                      Join {sport.name} Team
                    </Button>
                  </Link>
                  <Link href={`/team-sports/${sport.id}`}>
                    <Button variant="outline" className="w-full border-slate-600 text-slate-300 hover:bg-slate-700">
                      View Teams & Schedule
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Registration Process */}
        <div className="mt-16">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-center">
                <BookOpen className="w-6 h-6 inline mr-2" />
                How to Join a Team
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <h3 className="font-semibold text-white mb-2">Choose Sport</h3>
                  <p className="text-slate-400 text-sm">Select your preferred sport and age division</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <h3 className="font-semibold text-white mb-2">Register</h3>
                  <p className="text-slate-400 text-sm">Complete registration with parent/guardian consent</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <h3 className="font-semibold text-white mb-2">Team Assignment</h3>
                  <p className="text-slate-400 text-sm">Get placed on a team based on age and skill level</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">4</span>
                  </div>
                  <h3 className="font-semibold text-white mb-2">Start Playing</h3>
                  <p className="text-slate-400 text-sm">Attend practices and games with your new team</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}