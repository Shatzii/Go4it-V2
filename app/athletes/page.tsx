'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, Search, Filter, ArrowLeft, Trophy, Star, Calendar, MapPin } from 'lucide-react'
import Link from 'next/link'

interface AthleteProfile {
  id: string
  name: string
  position: string
  sport: string
  classYear: string
  rankings: {
    rivals: number
    espn: number
    sports247: number
    on3: number
    composite: number
  }
  physicals: {
    height: string
    weight: string
    wingspan?: string
    fortyTime?: string
  }
  academics: {
    gpa: number
    sat?: number
    act?: number
    coreGPA?: number
  }
  school: {
    current: string
    state: string
    committed?: string
    offers: string[]
    visits: string[]
  }
  recruiting: {
    status: 'open' | 'committed' | 'signed'
    timeline: string
    topSchools: string[]
    recruitingNotes: string
  }
  highlights: {
    videos: Array<{
      url: string
      title: string
      platform: string
      views: number
    }>
    images: string[]
  }
}

export default function AthletesPage() {
  const [athletes, setAthletes] = useState<AthleteProfile[]>([])
  const [filteredAthletes, setFilteredAthletes] = useState<AthleteProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSport, setSelectedSport] = useState('')
  const [selectedClass, setSelectedClass] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')

  useEffect(() => {
    const fetchAthletes = async () => {
      try {
        const response = await fetch('/api/recruiting/athletes/database')
        if (response.ok) {
          const data = await response.json()
          if (data.success && data.athletes) {
            setAthletes(data.athletes)
            setFilteredAthletes(data.athletes)
          }
        }
      } catch (error) {
        console.error('Failed to fetch athletes:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAthletes()
  }, [])

  useEffect(() => {
    let filtered = athletes

    if (searchTerm) {
      filtered = filtered.filter(athlete =>
        athlete.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        athlete.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        athlete.school.current.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedSport) {
      filtered = filtered.filter(athlete => athlete.sport === selectedSport)
    }

    if (selectedClass) {
      filtered = filtered.filter(athlete => athlete.classYear === selectedClass)
    }

    if (selectedStatus) {
      filtered = filtered.filter(athlete => athlete.recruiting.status === selectedStatus)
    }

    setFilteredAthletes(filtered)
  }, [searchTerm, selectedSport, selectedClass, selectedStatus, athletes])

  const calculateGARScore = (athlete: AthleteProfile) => {
    const rankingScore = Math.max(100 - (athlete.rankings.composite * 2), 60)
    const academicBonus = athlete.academics.gpa > 3.5 ? 5 : 0
    const commitmentBonus = athlete.recruiting.status === 'committed' ? 3 : 0
    
    return Math.min(rankingScore + academicBonus + commitmentBonus, 100)
  }

  const getAthleteImage = (athlete: AthleteProfile) => {
    if (athlete.highlights.images && athlete.highlights.images.length > 0) {
      return athlete.highlights.images[0]
    }
    const sportImages = {
      'Basketball': 'https://images.unsplash.com/photo-1627245076516-93e232cba261?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YmFza2V0YmFsbCUyMHBsYXllcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=600&q=60',
      'Soccer': 'https://images.unsplash.com/photo-1511067007398-7e4b9499a637?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60',
      'American Football': 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60',
      'Track & Field': 'https://images.unsplash.com/photo-1527334919515-b8dee906a34b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8dHJhY2slMjBmaWVsZHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=600&q=60'
    }
    return sportImages[athlete.sport] || sportImages['Basketball']
  }

  const getUniqueValues = (field: string) => {
    return [...new Set(athletes.map(athlete => {
      if (field === 'sport') return athlete.sport
      if (field === 'classYear') return athlete.classYear
      if (field === 'status') return athlete.recruiting.status
      return ''
    }))].filter(Boolean)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading athletes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Navigation */}
      <nav className="bg-slate-900/90 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="text-primary hover:text-primary/80 font-medium flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            <h1 className="text-2xl font-bold text-white">Verified Athletes</h1>
          </div>
        </div>
      </nav>

      {/* Filters */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-slate-900/50 border-b border-slate-700">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search athletes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Sport Filter */}
            <select
              value={selectedSport}
              onChange={(e) => setSelectedSport(e.target.value)}
              className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Sports</option>
              {getUniqueValues('sport').map(sport => (
                <option key={sport} value={sport}>{sport}</option>
              ))}
            </select>

            {/* Class Filter */}
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Classes</option>
              {getUniqueValues('classYear').map(year => (
                <option key={year} value={year}>Class of {year}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              {getUniqueValues('status').map(status => (
                <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
              ))}
            </select>

            {/* Clear Filters */}
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedSport('')
                setSelectedClass('')
                setSelectedStatus('')
              }}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </section>

      {/* Athletes Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">
              {filteredAthletes.length} Athletes Found
            </h2>
            <p className="text-slate-400">
              Showing verified athlete profiles with comprehensive stats and rankings
            </p>
          </div>

          {filteredAthletes.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-slate-400 mb-4">
                <Filter className="w-12 h-12 mx-auto mb-4" />
                <p>No athletes found matching your criteria.</p>
                <p className="text-sm mt-2">Try adjusting your filters or search terms.</p>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAthletes.map((athlete) => (
                <Link
                  key={athlete.id}
                  href={`/athlete/${athlete.id}`}
                  className="group bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl"
                >
                  <div className="relative">
                    <img
                      src={getAthleteImage(athlete)}
                      alt={athlete.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/50 px-2 py-1 rounded-full backdrop-blur-sm">
                      <CheckCircle className="w-3 h-3 text-blue-400" fill="currentColor" />
                      <span className="text-blue-400 text-xs font-semibold">VERIFIED</span>
                    </div>
                    <div className="absolute bottom-3 left-3 bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold">
                      {calculateGARScore(athlete)}
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-white mb-1 group-hover:text-blue-400 transition-colors">
                      {athlete.name}
                    </h3>
                    <p className="text-slate-400 text-sm mb-2">{athlete.position} • {athlete.sport}</p>

                    <div className="space-y-1 mb-3">
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <Calendar className="w-3 h-3" />
                        Class of {athlete.classYear}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <MapPin className="w-3 h-3" />
                        {athlete.school.current}, {athlete.school.state}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <Trophy className="w-3 h-3" />
                        #{athlete.rankings.composite} National
                      </div>
                    </div>

                    {athlete.recruiting.status === 'committed' && athlete.school.committed && (
                      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-2">
                        <div className="flex items-center gap-1">
                          <Trophy className="w-3 h-3 text-green-500" />
                          <span className="text-green-500 text-xs font-semibold">COMMITTED</span>
                        </div>
                        <p className="text-xs text-white mt-1">{athlete.school.committed}</p>
                      </div>
                    )}

                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < Math.floor(calculateGARScore(athlete) / 20)
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-slate-600'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-slate-400">GAR {calculateGARScore(athlete)}/100</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}