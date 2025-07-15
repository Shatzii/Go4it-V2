'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, X } from 'lucide-react'

interface SearchResult {
  id: string
  type: 'video' | 'athlete' | 'team' | 'course' | 'achievement'
  title: string
  description: string
  url: string
  metadata?: any
}

export function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [filters, setFilters] = useState({
    type: 'all',
    sport: 'all',
    garScore: 'all',
    graduationYear: 'all'
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setIsOpen(true)
      }
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const searchData = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery, filters })
      })

      if (response.ok) {
        const data = await response.json()
        setResults(data.results || [])
      }
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const debounce = setTimeout(() => {
      searchData(query)
    }, 300)

    return () => clearTimeout(debounce)
  }, [query, filters])

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors"
      >
        <Search className="w-4 h-4" />
        <span>Search</span>
        <kbd className="bg-slate-700 px-2 py-1 rounded text-xs">⌘K</kbd>
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20">
      <div className="bg-slate-900 rounded-xl w-full max-w-2xl mx-4 shadow-2xl border border-slate-700">
        <div className="p-4 border-b border-slate-700">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search videos, athletes, teams, courses..."
              className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-3 top-3 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-4 border-b border-slate-700">
          <div className="flex gap-2 flex-wrap">
            <select
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
              className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm"
            >
              <option value="all">All Types</option>
              <option value="video">Videos</option>
              <option value="athlete">Athletes</option>
              <option value="team">Teams</option>
              <option value="course">Courses</option>
              <option value="achievement">Achievements</option>
            </select>

            <select
              value={filters.sport}
              onChange={(e) => setFilters(prev => ({ ...prev, sport: e.target.value }))}
              className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm"
            >
              <option value="all">All Sports</option>
              <option value="football">Football</option>
              <option value="basketball">Basketball</option>
              <option value="baseball">Baseball</option>
              <option value="soccer">Soccer</option>
              <option value="track">Track & Field</option>
            </select>

            <select
              value={filters.garScore}
              onChange={(e) => setFilters(prev => ({ ...prev, garScore: e.target.value }))}
              className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm"
            >
              <option value="all">All GAR Scores</option>
              <option value="90-100">90-100</option>
              <option value="80-89">80-89</option>
              <option value="70-79">70-79</option>
              <option value="60-69">60-69</option>
            </select>
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center text-slate-400">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4">Searching...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="p-4 space-y-3">
              {results.map((result) => (
                <a
                  key={result.id}
                  href={result.url}
                  onClick={() => setIsOpen(false)}
                  className="block p-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <h3 className="text-white font-medium">{result.title}</h3>
                      <p className="text-slate-400 text-sm mt-1">{result.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
                          {result.type}
                        </span>
                        {result.metadata?.sport && (
                          <span className="px-2 py-1 bg-green-600 text-white text-xs rounded-full">
                            {result.metadata.sport}
                          </span>
                        )}
                        {result.metadata?.garScore && (
                          <span className="px-2 py-1 bg-purple-600 text-white text-xs rounded-full">
                            GAR: {result.metadata.garScore}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          ) : query ? (
            <div className="p-8 text-center text-slate-400">
              <p>No results found for "{query}"</p>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400">
              <p>Start typing to search...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}