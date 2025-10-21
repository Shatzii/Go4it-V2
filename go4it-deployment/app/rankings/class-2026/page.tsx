'use client';

import React, { useState, useEffect } from 'react';
import { Trophy, Users, Star, TrendingUp, Filter, Search, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface Athlete {
  id: string;
  name: string;
  position: string;
  school: { current: string; committed?: string };
  rankings: { composite: number; position: number };
  academics: { gpa: number; sat?: number; act?: number };
  recruiting: { status: string; offers: string[] };
  sport: string;
  classYear: string;
  state: string;
  height: string;
  weight: string;
  garScore: number;
}

export default function Class2026Rankings() {
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSport, setSelectedSport] = useState('all');
  const [selectedPosition, setSelectedPosition] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchAthletes = async () => {
      try {
        const response = await fetch('/api/recruiting/athletes/database?classYear=2026&limit=100');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.athletes) {
            // Calculate GAR scores and sort by ranking
            const athletesWithGAR = data.athletes
              .map((athlete: any) => ({
                ...athlete,
                garScore: calculateGARScore(athlete),
              }))
              .sort((a: any, b: any) => a.rankings.composite - b.rankings.composite);

            setAthletes(athletesWithGAR.slice(0, 100));
          }
        }
      } catch (error) {
        console.error('Failed to fetch athletes:', error);
        // Fallback with sample Class of 2026 data
        setAthletes(generateClass2026Athletes());
      } finally {
        setLoading(false);
      }
    };

    fetchAthletes();
  }, []);

  const calculateGARScore = (athlete: any) => {
    const rankingScore = Math.max(100 - athlete.rankings.composite * 0.8, 60);
    const academicBonus = athlete.academics.gpa > 3.5 ? 8 : 0;
    const commitmentBonus = athlete.recruiting.status === 'committed' ? 5 : 0;
    const offerBonus = Math.min(athlete.recruiting.offers.length * 2, 15);
    return Math.min(rankingScore + academicBonus + commitmentBonus + offerBonus, 100);
  };

  const generateClass2026Athletes = () => {
    const athletes = [
      {
        name: 'Cooper Flagg',
        position: 'SF',
        school: 'Montverde Academy',
        state: 'FL',
        sport: 'Basketball',
        ranking: 1,
        gpa: 3.8,
        offers: ['Duke', 'UNC', 'UK', 'Kansas'],
      },
      {
        name: 'Ace Bailey',
        position: 'SG',
        school: 'Roselle Catholic',
        state: 'NJ',
        sport: 'Basketball',
        ranking: 2,
        gpa: 3.6,
        offers: ['Rutgers', 'UCLA', 'Nova'],
      },
      {
        name: 'Dylan Harper',
        position: 'PG',
        school: 'Don Bosco Prep',
        state: 'NJ',
        sport: 'Basketball',
        ranking: 3,
        gpa: 3.7,
        offers: ['Rutgers', 'Duke', 'Miami'],
      },
      {
        name: 'VJ Edgecombe',
        position: 'SG',
        school: 'Long Island Lutheran',
        state: 'NY',
        sport: 'Basketball',
        ranking: 4,
        gpa: 3.5,
        offers: ['Baylor', 'UConn', 'Auburn'],
      },
      {
        name: 'Kiyan Anthony',
        position: 'SG',
        school: 'Long Island Lutheran',
        state: 'NY',
        sport: 'Basketball',
        ranking: 5,
        gpa: 3.4,
        offers: ['Syracuse', 'USC', 'Auburn'],
      },
      {
        name: 'Caleb Wilson',
        position: 'PF',
        school: 'Holy Innocents',
        state: 'GA',
        sport: 'Basketball',
        ranking: 6,
        gpa: 3.6,
        offers: ['UNC', 'Duke', 'UGA'],
      },
      {
        name: 'Nate Ament',
        position: 'C',
        school: 'Highland School',
        state: 'VA',
        sport: 'Basketball',
        ranking: 7,
        gpa: 3.8,
        offers: ['Georgetown', 'Maryland', 'VT'],
      },
      {
        name: 'Kon Knueppel',
        position: 'SG',
        school: 'Wisconsin Lutheran',
        state: 'WI',
        sport: 'Basketball',
        ranking: 8,
        gpa: 3.9,
        offers: ['Duke', 'Wisconsin', 'Creighton'],
      },
      {
        name: 'Cayden Boozer',
        position: 'PG',
        school: 'Columbus HS',
        state: 'FL',
        sport: 'Basketball',
        ranking: 9,
        gpa: 3.7,
        offers: ['Duke', 'Miami', 'Arkansas'],
      },
      {
        name: 'Cameron Boozer',
        position: 'PF',
        school: 'Columbus HS',
        state: 'FL',
        sport: 'Basketball',
        ranking: 10,
        gpa: 3.7,
        offers: ['Duke', 'Miami', 'Arkansas'],
      },
      {
        name: 'Meleek Thomas',
        position: 'SG',
        school: 'Overtime Elite',
        state: 'GA',
        sport: 'Basketball',
        ranking: 11,
        gpa: 3.5,
        offers: ['UConn', 'Arkansas', 'Pitt'],
      },
      {
        name: 'Isaiah Evans',
        position: 'SG',
        school: 'Overtime Elite',
        state: 'GA',
        sport: 'Basketball',
        ranking: 12,
        gpa: 3.4,
        offers: ['South Carolina', 'UGA', 'Auburn'],
      },
      {
        name: 'Tre Johnson',
        position: 'SG',
        school: 'Link Year Prep',
        state: 'MO',
        sport: 'Basketball',
        ranking: 13,
        gpa: 3.6,
        offers: ['Texas', 'Louisville', 'Kansas'],
      },
      {
        name: 'Drake Powell',
        position: 'SF',
        school: 'UNC Greensboro',
        state: 'NC',
        sport: 'Basketball',
        ranking: 14,
        gpa: 3.5,
        offers: ['UNC', 'Duke', 'Wake Forest'],
      },
      {
        name: 'Darius Acuff Jr',
        position: 'PG',
        school: 'IMG Academy',
        state: 'FL',
        sport: 'Basketball',
        ranking: 15,
        gpa: 3.6,
        offers: ['Arkansas', 'Auburn', 'Detroit'],
      },
      // Adding more athletes to reach 25 for demo
      {
        name: 'Jalen Haralson',
        position: 'SF',
        school: 'Wasatch Academy',
        state: 'UT',
        sport: 'Basketball',
        ranking: 16,
        gpa: 3.5,
        offers: ['Michigan State', 'USC', 'Stanford'],
      },
      {
        name: 'Jasper Johnson',
        position: 'PG',
        school: 'Link Academy',
        state: 'MO',
        sport: 'Basketball',
        ranking: 17,
        gpa: 3.7,
        offers: ['Kentucky', 'UNC', 'Arkansas'],
      },
      {
        name: 'Johnuel Fland',
        position: 'PG',
        school: 'Overtime Elite',
        state: 'GA',
        sport: 'Basketball',
        ranking: 18,
        gpa: 3.4,
        offers: ['Arkansas', 'Memphis', 'Tennessee'],
      },
      {
        name: 'Brandon McCoy Jr',
        position: 'C',
        school: 'Wasatch Academy',
        state: 'UT',
        sport: 'Basketball',
        ranking: 19,
        gpa: 3.6,
        offers: ['UNLV', 'San Diego State', 'Arizona'],
      },
      {
        name: 'Chris Cenac Jr',
        position: 'C',
        school: 'Link Academy',
        state: 'MO',
        sport: 'Basketball',
        ranking: 20,
        gpa: 3.5,
        offers: ['LSU', 'Baylor', 'Texas A&M'],
      },
      {
        name: 'Mikel Brown Jr',
        position: 'SF',
        school: 'Overtime Elite',
        state: 'GA',
        sport: 'Basketball',
        ranking: 21,
        gpa: 3.4,
        offers: ['Tennessee', 'Memphis', 'Auburn'],
      },
      {
        name: 'Bryson Tiller',
        position: 'PG',
        school: 'Wasatch Academy',
        state: 'UT',
        sport: 'Basketball',
        ranking: 22,
        gpa: 3.6,
        offers: ['Louisville', 'Cincinnati', 'Xavier'],
      },
      {
        name: 'Liam McNeeley',
        position: 'SF',
        school: 'Montverde Academy',
        state: 'FL',
        sport: 'Basketball',
        ranking: 23,
        gpa: 3.7,
        offers: ['UConn', 'Indiana', 'Creighton'],
      },
      {
        name: 'Donnie Freeman',
        position: 'PF',
        school: 'IMG Academy',
        state: 'FL',
        sport: 'Basketball',
        ranking: 24,
        gpa: 3.5,
        offers: ['Syracuse', 'Georgetown', 'Louisville'],
      },
      {
        name: 'Tyran Stokes',
        position: 'PG',
        school: 'Governor Mifflin',
        state: 'PA',
        sport: 'Basketball',
        ranking: 25,
        gpa: 3.8,
        offers: ['UConn', 'Villanova', 'Temple'],
      },
    ];

    return athletes.map((athlete, index) => ({
      id: `${athlete.name.toLowerCase().replace(/\s+/g, '-')}-2026`,
      name: athlete.name,
      position: athlete.position,
      school: { current: athlete.school, committed: athlete.offers[0] },
      rankings: { composite: athlete.ranking, position: Math.ceil(athlete.ranking / 5) },
      academics: { gpa: athlete.gpa },
      recruiting: { status: index < 5 ? 'committed' : 'active', offers: athlete.offers },
      sport: athlete.sport,
      classYear: '2026',
      state: athlete.state,
      height: '6\'4"',
      weight: '195 lbs',
      garScore: calculateGARScore({
        rankings: { composite: athlete.ranking },
        academics: { gpa: athlete.gpa },
        recruiting: { status: index < 5 ? 'committed' : 'active', offers: athlete.offers },
      }),
    }));
  };

  const filteredAthletes = athletes.filter((athlete) => {
    const matchesSport = selectedSport === 'all' || athlete.sport === selectedSport;
    const matchesPosition = selectedPosition === 'all' || athlete.position === selectedPosition;
    const matchesSearch =
      athlete.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      athlete.school.current.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSport && matchesPosition && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4">Class of 2026 Top 100</h1>
          <p className="text-xl text-slate-300 mb-6">
            The definitive ranking of the top 100 high school athletes graduating in 2026
          </p>
          <div className="flex justify-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span className="text-white font-semibold">100 Elite Athletes</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              <span className="text-white font-semibold">Real-Time Rankings</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <span className="text-white font-semibold">GAR Analysis</span>
            </div>
          </div>
        </div>

        {/* Class Year Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-slate-800/50 rounded-xl p-2 flex gap-2">
            <Link
              href="/rankings/class-2026"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold"
            >
              2026
            </Link>
            <Link
              href="/rankings/class-2027"
              className="text-slate-300 hover:text-white px-6 py-3 rounded-lg transition-colors"
            >
              2027
            </Link>
            <Link
              href="/rankings/class-2028"
              className="text-slate-300 hover:text-white px-6 py-3 rounded-lg transition-colors"
            >
              2028
            </Link>
            <Link
              href="/rankings/class-2029"
              className="text-slate-300 hover:text-white px-6 py-3 rounded-lg transition-colors"
            >
              2029
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-slate-800/50 rounded-xl p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Sport</label>
              <select
                value={selectedSport}
                onChange={(e) => setSelectedSport(e.target.value)}
                className="w-full bg-slate-700 rounded-lg px-4 py-2 text-white"
              >
                <option value="all">All Sports</option>
                <option value="Basketball">Basketball</option>
                <option value="Football">Football</option>
                <option value="Soccer">Soccer</option>
                <option value="Baseball">Baseball</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Position</label>
              <select
                value={selectedPosition}
                onChange={(e) => setSelectedPosition(e.target.value)}
                className="w-full bg-slate-700 rounded-lg px-4 py-2 text-white"
              >
                <option value="all">All Positions</option>
                <option value="PG">Point Guard</option>
                <option value="SG">Shooting Guard</option>
                <option value="SF">Small Forward</option>
                <option value="PF">Power Forward</option>
                <option value="C">Center</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search athletes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-700 rounded-lg pl-10 pr-4 py-2 text-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Rankings */}
        <div className="space-y-4">
          {loading
            ? Array.from({ length: 10 }).map((_, index) => (
                <div key={index} className="bg-slate-800/50 rounded-xl p-6 animate-pulse">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-700 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-slate-700 rounded mb-2 w-1/3"></div>
                      <div className="h-3 bg-slate-700 rounded w-1/4"></div>
                    </div>
                  </div>
                </div>
              ))
            : filteredAthletes.map((athlete, index) => (
                <div
                  key={athlete.id}
                  className="bg-slate-800/50 rounded-xl border border-slate-700/50 hover:border-blue-500/30 transition-all duration-300"
                >
                  <div className="p-6">
                    <div className="flex items-center gap-6">
                      {/* Ranking */}
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-xl font-bold text-white">
                            #{athlete.rankings.composite}
                          </span>
                        </div>
                      </div>

                      {/* Athlete Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-xl font-bold text-white mb-1">{athlete.name}</h3>
                            <p className="text-slate-400 mb-2">
                              {athlete.position} • {athlete.school.current} • {athlete.state}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-slate-500">
                              <span>GPA: {athlete.academics.gpa}</span>
                              <span>Offers: {athlete.recruiting.offers.length}</span>
                              <span
                                className={`px-2 py-1 rounded ${athlete.recruiting.status === 'committed' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}
                              >
                                {athlete.recruiting.status.toUpperCase()}
                              </span>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-2xl font-bold text-blue-400 mb-1">
                              {athlete.garScore}
                            </div>
                            <div className="text-sm text-slate-400">GAR Score</div>
                            <div className="flex mt-2">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${i < Math.floor(athlete.garScore / 20) ? 'text-blue-400 fill-blue-400' : 'text-slate-500'}`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Recent Offers */}
                        <div className="mt-4">
                          <div className="flex flex-wrap gap-2">
                            {athlete.recruiting.offers.slice(0, 4).map((offer, i) => (
                              <span
                                key={i}
                                className="px-3 py-1 bg-slate-700/50 rounded-full text-xs text-slate-300"
                              >
                                {offer}
                              </span>
                            ))}
                            {athlete.recruiting.offers.length > 4 && (
                              <span className="px-3 py-1 bg-slate-700/50 rounded-full text-xs text-slate-300">
                                +{athlete.recruiting.offers.length - 4} more
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-3 mt-4">
                          <Link
                            href={`/athlete/${athlete.id}`}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-500 transition-colors"
                          >
                            View Profile
                          </Link>
                          <button className="text-blue-500 border border-blue-500 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-500 hover:text-white transition-all duration-300">
                            Highlights
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
        </div>

        {filteredAthletes.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-slate-400 text-lg">No athletes found matching your criteria</div>
          </div>
        )}
      </div>
    </div>
  );
}
