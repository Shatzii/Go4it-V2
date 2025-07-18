'use client'

import React, { useState, useEffect } from 'react'
import { 
  Trophy, Users, Star, TrendingUp, Target, Calendar, 
  CheckCircle, Clock, AlertCircle, DollarSign, GraduationCap,
  MapPin, Phone, Mail, ArrowRight, Plus, Filter, BarChart3
} from 'lucide-react'
import Link from 'next/link'

interface IntegratedDashboardData {
  athlete: any
  scholarships: any
  collegeMatches: any[]
  contacts: any
  ncaaEligibility: any
  rankings: any
  timeline: any
  recommendations: any
}

export default function RecruitingHub() {
  const [dashboardData, setDashboardData] = useState<IntegratedDashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState('overview')

  useEffect(() => {
    fetchIntegratedData()
  }, [])

  const fetchIntegratedData = async () => {
    try {
      const response = await fetch('/api/recruiting/integrated-dashboard')
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setDashboardData(data.data)
        }
      }
    } catch (error) {
      console.error('Failed to fetch integrated data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-xl">Loading your recruitment dashboard...</div>
        </div>
      </div>
    )
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <div className="text-xl mb-2">Unable to load dashboard</div>
          <button 
            onClick={fetchIntegratedData}
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  const { athlete, scholarships, collegeMatches, contacts, ncaaEligibility, rankings, timeline, recommendations } = dashboardData

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4">Recruiting Command Center</h1>
          <p className="text-xl text-slate-300 mb-6">
            Your complete recruitment ecosystem - scholarships, colleges, contacts, and rankings in one place
          </p>
          <div className="flex justify-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span className="text-white font-semibold">Rank #{rankings.nationalRank}</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-500" />
              <span className="text-white font-semibold">${scholarships.totalValue.toLocaleString()} Available</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              <span className="text-white font-semibold">{contacts.totalContacts} Coach Contacts</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-slate-800/50 rounded-xl p-2 flex gap-2">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'scholarships', label: 'Scholarships', icon: DollarSign },
              { id: 'colleges', label: 'College Matches', icon: GraduationCap },
              { id: 'contacts', label: 'Coach Contacts', icon: Users },
              { id: 'eligibility', label: 'NCAA Status', icon: CheckCircle }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                  activeSection === tab.id 
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Section */}
        {activeSection === 'overview' && (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                <div className="flex items-center gap-3 mb-3">
                  <Trophy className="w-8 h-8 text-yellow-500" />
                  <div>
                    <div className="text-2xl font-bold text-white">#{rankings.nationalRank}</div>
                    <div className="text-sm text-slate-400">National Ranking</div>
                  </div>
                </div>
                <div className="text-green-400 text-sm">{rankings.improvementTrend}</div>
              </div>

              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                <div className="flex items-center gap-3 mb-3">
                  <DollarSign className="w-8 h-8 text-green-500" />
                  <div>
                    <div className="text-2xl font-bold text-white">{scholarships.applied}</div>
                    <div className="text-sm text-slate-400">Applications Submitted</div>
                  </div>
                </div>
                <div className="text-blue-400 text-sm">${scholarships.totalValue.toLocaleString()} available</div>
              </div>

              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                <div className="flex items-center gap-3 mb-3">
                  <Users className="w-8 h-8 text-blue-500" />
                  <div>
                    <div className="text-2xl font-bold text-white">{contacts.responseRate}%</div>
                    <div className="text-sm text-slate-400">Coach Response Rate</div>
                  </div>
                </div>
                <div className="text-purple-400 text-sm">{contacts.totalContacts} total contacts</div>
              </div>

              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                  <div>
                    <div className="text-2xl font-bold text-white">{ncaaEligibility.status}</div>
                    <div className="text-sm text-slate-400">NCAA Eligibility</div>
                  </div>
                </div>
                <div className="text-green-400 text-sm">On track for certification</div>
              </div>
            </div>

            {/* AI Recommendations */}
            <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-xl p-6 border border-blue-500/30">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Star className="w-6 h-6 text-yellow-500" />
                AI Recruitment Recommendations
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-blue-400 mb-3">Immediate Actions</h3>
                  <div className="space-y-2">
                    {recommendations.immediate.map((rec: string, index: number) => (
                      <div key={index} className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-300">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-green-400 mb-3">Strategic Moves</h3>
                  <div className="space-y-2">
                    {recommendations.strategic.map((rec: string, index: number) => (
                      <div key={index} className="flex items-start gap-2">
                        <Target className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-300">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Top College Matches */}
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Top College Matches</h2>
                <Link 
                  href="/college-explorer"
                  className="text-blue-400 hover:text-blue-300 flex items-center gap-2 text-sm"
                >
                  View All <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                {collegeMatches.slice(0, 3).map((college, index) => (
                  <div key={college.id} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/50">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-white">{college.name}</h3>
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue-400">{college.matchScore}%</div>
                        <div className="text-xs text-slate-400">Match</div>
                      </div>
                    </div>
                    <p className="text-sm text-slate-400 mb-3">{college.location} • {college.division}</p>
                    <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                      <div>Academic: {college.fit.academic}%</div>
                      <div>Athletic: {college.fit.athletic}%</div>
                      <div>Geographic: {college.fit.geographic}%</div>
                      <div>Financial: {college.fit.financial}%</div>
                    </div>
                    <div className="flex gap-2">
                      {college.hasScholarship && (
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">
                          Scholarship Available
                        </span>
                      )}
                      {college.contactMade && (
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded">
                          Contact Made
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Quick Action Links */}
        <div className="mt-12 grid md:grid-cols-5 gap-4">
          <Link 
            href="/scholarship-tracker"
            className="bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 rounded-xl p-4 text-center transition-colors group"
          >
            <DollarSign className="w-8 h-8 text-green-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <div className="font-semibold text-green-400">Scholarships</div>
            <div className="text-xs text-slate-400">Track & Apply</div>
          </Link>

          <Link 
            href="/college-explorer"
            className="bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-xl p-4 text-center transition-colors group"
          >
            <GraduationCap className="w-8 h-8 text-blue-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <div className="font-semibold text-blue-400">Colleges</div>
            <div className="text-xs text-slate-400">Explore & Match</div>
          </Link>

          <Link 
            href="/athletic-contacts"
            className="bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-xl p-4 text-center transition-colors group"
          >
            <Users className="w-8 h-8 text-purple-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <div className="font-semibold text-purple-400">Contacts</div>
            <div className="text-xs text-slate-400">Coach Database</div>
          </Link>

          <Link 
            href="/rankings/class-2026"
            className="bg-yellow-600/20 hover:bg-yellow-600/30 border border-yellow-500/30 rounded-xl p-4 text-center transition-colors group"
          >
            <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <div className="font-semibold text-yellow-400">Rankings</div>
            <div className="text-xs text-slate-400">Top 100 Lists</div>
          </Link>

          <Link 
            href="/ncaa-eligibility"
            className="bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 rounded-xl p-4 text-center transition-colors group"
          >
            <CheckCircle className="w-8 h-8 text-red-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <div className="font-semibold text-red-400">NCAA</div>
            <div className="text-xs text-slate-400">Eligibility Check</div>
          </Link>
        </div>
      </div>
    </div>
  )
}