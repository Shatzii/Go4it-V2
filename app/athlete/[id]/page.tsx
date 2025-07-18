'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { CheckCircle, MapPin, Calendar, Trophy, TrendingUp, Star, Award, ExternalLink, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

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
  stats: {
    season: string
    [key: string]: any
  }
  contact: {
    email?: string
    phone?: string
    social: {
      twitter?: string
      instagram?: string
      hudl?: string
      tiktok?: string
    }
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
  recruiting: {
    status: 'open' | 'committed' | 'signed'
    timeline: string
    topSchools: string[]
    recruitingNotes: string
  }
  sources: Array<{
    platform: string
    url: string
    lastUpdated: string
    confidence: number
  }>
}

export default function AthleteProfilePage() {
  const params = useParams()
  const [athlete, setAthlete] = useState<AthleteProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchAthlete = async () => {
      try {
        const response = await fetch('/api/recruiting/athletes/database')
        if (response.ok) {
          const data = await response.json()
          if (data.success && data.athletes) {
            const foundAthlete = data.athletes.find((a: AthleteProfile) => a.id === params.id)
            if (foundAthlete) {
              setAthlete(foundAthlete)
            } else {
              setError('Athlete not found')
            }
          }
        }
      } catch (err) {
        setError('Failed to load athlete profile')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchAthlete()
    }
  }, [params.id])

  const calculateGARScore = (athlete: AthleteProfile) => {
    if (!athlete) return 75
    
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading athlete profile...</p>
        </div>
      </div>
    )
  }

  if (error || !athlete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Athlete Not Found</h1>
          <p className="text-slate-300 mb-6">{error || 'The athlete profile you requested could not be found.'}</p>
          <Link
            href="/"
            className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg transition-colors inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  const garScore = calculateGARScore(athlete)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Navigation */}
      <nav className="bg-slate-900/90 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/"
            className="text-primary hover:text-primary/80 font-medium flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Athlete Image */}
            <div className="relative">
              <div className="aspect-square bg-slate-800 rounded-2xl overflow-hidden border border-slate-700">
                <img
                  src={getAthleteImage(athlete)}
                  alt={athlete.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 flex items-center gap-1 bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">
                  <CheckCircle className="w-4 h-4 text-blue-400" fill="currentColor" />
                  <span className="text-blue-400 text-sm font-semibold">VERIFIED</span>
                </div>
                <div className="absolute bottom-4 left-4 bg-primary text-primary-foreground w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold">
                  {garScore}
                </div>
              </div>
            </div>

            {/* Athlete Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">{athlete.name}</h1>
                <p className="text-xl text-slate-300 mb-4">{athlete.position} • {athlete.sport}</p>
                
                <div className="flex items-center gap-4 text-sm text-slate-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Class of {athlete.classYear}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {athlete.school.current}, {athlete.school.state}
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                  <div className="text-2xl font-bold text-white">#{athlete.rankings.composite}</div>
                  <div className="text-sm text-slate-400">National Ranking</div>
                </div>
                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                  <div className="text-2xl font-bold text-white">{athlete.academics.gpa}</div>
                  <div className="text-sm text-slate-400">GPA</div>
                </div>
              </div>

              {/* Commitment Status */}
              {athlete.recruiting.status === 'committed' && athlete.school.committed && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy className="w-5 h-5 text-green-500" />
                    <span className="text-green-500 font-semibold">COMMITTED</span>
                  </div>
                  <p className="text-white">{athlete.school.committed}</p>
                  <p className="text-sm text-slate-400">{athlete.recruiting.timeline}</p>
                </div>
              )}

              {/* Contact Info */}
              <div className="flex gap-3">
                {athlete.contact.social.twitter && (
                  <a
                    href={`https://twitter.com/${athlete.contact.social.twitter.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-slate-800 hover:bg-slate-700 p-3 rounded-xl border border-slate-700 transition-colors"
                  >
                    <ExternalLink className="w-5 h-5 text-slate-400" />
                  </a>
                )}
                {athlete.contact.social.instagram && (
                  <a
                    href={`https://instagram.com/${athlete.contact.social.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-slate-800 hover:bg-slate-700 p-3 rounded-xl border border-slate-700 transition-colors"
                  >
                    <ExternalLink className="w-5 h-5 text-slate-400" />
                  </a>
                )}
                {athlete.highlights.videos.length > 0 && (
                  <a
                    href={athlete.highlights.videos[0].url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-primary hover:bg-primary/90 text-white px-4 py-3 rounded-xl font-medium transition-colors"
                  >
                    Watch Highlights
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Stats */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Rankings */}
            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                Rankings
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Composite</span>
                  <span className="text-white font-semibold">#{athlete.rankings.composite}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">ESPN</span>
                  <span className="text-white font-semibold">#{athlete.rankings.espn}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">247Sports</span>
                  <span className="text-white font-semibold">#{athlete.rankings.sports247}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Rivals</span>
                  <span className="text-white font-semibold">#{athlete.rankings.rivals}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">On3</span>
                  <span className="text-white font-semibold">#{athlete.rankings.on3}</span>
                </div>
              </div>
            </div>

            {/* Physical Stats */}
            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                Physical Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Height</span>
                  <span className="text-white font-semibold">{athlete.physicals.height}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Weight</span>
                  <span className="text-white font-semibold">{athlete.physicals.weight}</span>
                </div>
                {athlete.physicals.wingspan && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Wingspan</span>
                    <span className="text-white font-semibold">{athlete.physicals.wingspan}</span>
                  </div>
                )}
                {athlete.physicals.fortyTime && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">40-Yard Dash</span>
                    <span className="text-white font-semibold">{athlete.physicals.fortyTime}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Academic Stats */}
            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-green-500" />
                Academic Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">GPA</span>
                  <span className="text-white font-semibold">{athlete.academics.gpa}</span>
                </div>
                {athlete.academics.coreGPA && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Core GPA</span>
                    <span className="text-white font-semibold">{athlete.academics.coreGPA}</span>
                  </div>
                )}
                {athlete.academics.sat && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">SAT</span>
                    <span className="text-white font-semibold">{athlete.academics.sat}</span>
                  </div>
                )}
                {athlete.academics.act && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">ACT</span>
                    <span className="text-white font-semibold">{athlete.academics.act}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recruiting Info */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* College Offers */}
            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-4">College Offers</h3>
              <div className="grid grid-cols-2 gap-2">
                {athlete.school.offers.map((offer, index) => (
                  <div key={index} className="bg-slate-700/50 px-3 py-2 rounded-lg text-sm text-white">
                    {offer}
                  </div>
                ))}
              </div>
            </div>

            {/* Official Visits */}
            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-4">Official Visits</h3>
              <div className="space-y-2">
                {athlete.school.visits.map((visit, index) => (
                  <div key={index} className="bg-slate-700/50 px-3 py-2 rounded-lg text-sm text-white">
                    {visit}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recruiting Notes */}
          <div className="mt-8 bg-slate-800/50 p-6 rounded-xl border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4">Scouting Report</h3>
            <p className="text-slate-300 leading-relaxed">{athlete.recruiting.recruitingNotes}</p>
          </div>
        </div>
      </section>
    </div>
  )
}