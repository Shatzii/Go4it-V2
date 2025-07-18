'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, ArrowRight, Trophy, Star } from 'lucide-react'
import Link from 'next/link'

// Simple Star Rating Component
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <Star 
          key={i} 
          className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'}`}
        />
      ))}
    </div>
  )
}

// Athlete Card Component
function AthleteCard({ name, sport, position, garScore, verified, imageUrl, athlete }: any) {
  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden hover:border-blue-500 transition-all duration-300">
      <div className="relative">
        <img 
          src={imageUrl} 
          alt={name} 
          className="w-full h-48 object-cover"
        />
        {verified && (
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/50 px-2 py-1 rounded backdrop-blur-sm">
            <CheckCircle className="w-4 h-4 text-blue-400" fill="currentColor" />
            <span className="text-blue-400 text-xs font-semibold">VERIFIED</span>
          </div>
        )}
        <div className="absolute bottom-2 left-2 bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold">
          {garScore}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg text-white mb-1">{name}</h3>
        <p className="text-slate-400 text-sm mb-1">{position}</p>
        
        <div className="text-xs text-slate-400 space-y-1 mb-2">
          <div>SPORT • {sport}</div>
          <div>POSITION • {position}</div>
          {athlete && (
            <>
              <div>CLASS • {athlete.classYear}</div>
              <div>SCHOOL • {athlete.school.current}</div>
              <div>RANKING • #{athlete.rankings.composite}</div>
            </>
          )}
          <div>GAR • {garScore}/100</div>
        </div>
        
        <div className="flex items-center gap-2 mb-2">
          <StarRating rating={Math.floor(garScore / 20)} />
          <span className="text-xs text-slate-400">({garScore}/100)</span>
        </div>
        
        <div className="mt-3 flex gap-2">
          <Link 
            href={athlete ? `/athlete/${athlete.id}` : `/profile/${encodeURIComponent(name.toLowerCase().replace(' ', '-'))}`}
            className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-blue-500 transition-colors"
          >
            View Profile
          </Link>
          {athlete && athlete.highlights.videos.length > 0 ? (
            <a
              href={athlete.highlights.videos[0].url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 border border-blue-500 px-3 py-1 rounded text-xs font-medium hover:bg-blue-500 hover:text-white transition-all duration-300"
            >
              Highlights
            </a>
          ) : (
            <button className="text-blue-500 border border-blue-500 px-3 py-1 rounded text-xs font-medium hover:bg-blue-500 hover:text-white transition-all duration-300">
              Highlights
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  const [athletes, setAthletes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAthletes = async () => {
      try {
        const response = await fetch('/api/recruiting/athletes/database')
        if (response.ok) {
          const data = await response.json()
          if (data.success && data.athletes) {
            setAthletes(data.athletes.slice(0, 4))
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

  const calculateGARScore = (athlete: any) => {
    const rankingScore = Math.max(100 - (athlete.rankings.composite * 2), 60)
    const academicBonus = athlete.academics.gpa > 3.5 ? 5 : 0
    const commitmentBonus = athlete.recruiting.status === 'committed' ? 3 : 0
    return Math.min(rankingScore + academicBonus + commitmentBonus, 100)
  }

  const getAthleteImage = (athlete: any) => {
    if (athlete.highlights.images && athlete.highlights.images.length > 0) {
      return athlete.highlights.images[0]
    }
    return 'https://images.unsplash.com/photo-1627245076516-93e232cba261?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YmFza2V0YmFsbCUyMHBsYXllcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=600&q=60'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Hero Section */}
      <section className="py-20 px-4 text-center">
        <h1 className="text-5xl font-bold mb-6">Go4It Sports Platform</h1>
        <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
          Elite athletic development platform with AI-powered performance analysis and verified athlete recruitment
        </p>
        <Link 
          href="/auth"
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors inline-flex items-center gap-2"
        >
          Get Started Today
          <ArrowRight className="w-5 h-5" />
        </Link>
      </section>

      {/* Top Verified Athletes */}
      <section className="py-20 px-4 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-white">Top Verified Athletes</h2>
            <Link 
              href="/athletes" 
              className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-2"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden animate-pulse">
                  <div className="w-full h-48 bg-slate-700"></div>
                  <div className="p-4">
                    <div className="h-4 bg-slate-700 rounded mb-2"></div>
                    <div className="h-3 bg-slate-700 rounded mb-3 w-3/4"></div>
                    <div className="h-3 bg-slate-700 rounded mb-2 w-1/2"></div>
                  </div>
                </div>
              ))
            ) : athletes.length > 0 ? (
              athletes.map((athlete: any) => (
                <AthleteCard
                  key={athlete.id}
                  name={athlete.name}
                  sport={athlete.sport}
                  position={athlete.position}
                  garScore={calculateGARScore(athlete)}
                  verified={true}
                  imageUrl={getAthleteImage(athlete)}
                  athlete={athlete}
                />
              ))
            ) : (
              <>
                <AthleteCard
                  name="Cooper Flagg"
                  sport="Basketball"
                  position="Small Forward"
                  garScore={98}
                  verified={true}
                  imageUrl="https://images.unsplash.com/photo-1627245076516-93e232cba261?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YmFza2V0YmFsbCUyMHBsYXllcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=600&q=60"
                />
                <AthleteCard
                  name="Ace Bailey"
                  sport="Basketball"
                  position="Shooting Guard"
                  garScore={96}
                  verified={true}
                  imageUrl="https://images.unsplash.com/photo-1627245076516-93e232cba261?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YmFza2V0YmFsbCUyMHBsYXllcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=600&q=60"
                />
                <AthleteCard
                  name="Dylan Harper"
                  sport="Basketball"
                  position="Point Guard"
                  garScore={95}
                  verified={true}
                  imageUrl="https://images.unsplash.com/photo-1627245076516-93e232cba261?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YmFza2V0YmFsbCUyMHBsYXllcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=600&q=60"
                />
                <AthleteCard
                  name="VJ Edgecombe"
                  sport="Basketball"
                  position="Shooting Guard"
                  garScore={93}
                  verified={true}
                  imageUrl="https://images.unsplash.com/photo-1627245076516-93e232cba261?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YmFza2V0YmFsbCUyMHBsYXllcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=600&q=60"
                />
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Platform Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-800 p-6 rounded-xl">
              <Trophy className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Elite Rankings</h3>
              <p className="text-slate-400">Real-time athlete rankings and performance tracking</p>
            </div>
            <div className="bg-slate-800 p-6 rounded-xl">
              <Star className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">GAR Analysis</h3>
              <p className="text-slate-400">Growth and Ability Rating system for comprehensive evaluation</p>
            </div>
            <div className="bg-slate-800 p-6 rounded-xl">
              <CheckCircle className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Verified Profiles</h3>
              <p className="text-slate-400">Authentic athlete profiles with verified statistics</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}