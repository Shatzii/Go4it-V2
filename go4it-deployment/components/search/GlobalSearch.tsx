'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, Filter, Clock, User, Video, Trophy, Book, Users } from 'lucide-react';

interface SearchResult {
  id: string;
  type: 'video' | 'athlete' | 'team' | 'achievement' | 'course' | 'coach';
  title: string;
  description: string;
  url: string;
  metadata: {
    sport?: string;
    garScore?: number;
    createdAt?: string;
    graduationYear?: number;
    level?: string;
  };
}

interface SearchFilters {
  type: string;
  sport: string;
  dateRange: string;
  garScore: string;
  graduationYear: string;
}

export function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [filters, setFilters] = useState<SearchFilters>({
    type: 'all',
    sport: 'all',
    dateRange: 'all',
    garScore: 'all',
    graduationYear: 'all',
  });
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }

    // Global keyboard shortcut
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    // Close search when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.trim().length > 1) {
      searchContent();
    } else {
      setResults([]);
    }
  }, [query, filters]);

  const searchContent = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, filters }),
      });

      if (response.ok) {
        const data = await response.json();
        setResults(data.results);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSearch = (searchQuery: string) => {
    const updated = [searchQuery, ...recentSearches.filter((s) => s !== searchQuery)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const handleResultClick = (result: SearchResult) => {
    saveSearch(query);
    setIsOpen(false);
    window.location.href = result.url;
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="w-5 h-5 text-red-500" />;
      case 'athlete':
        return <User className="w-5 h-5 text-blue-500" />;
      case 'team':
        return <Users className="w-5 h-5 text-green-500" />;
      case 'achievement':
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 'course':
        return <Book className="w-5 h-5 text-purple-500" />;
      default:
        return <Search className="w-5 h-5 text-gray-500" />;
    }
  };

  const clearFilters = () => {
    setFilters({
      type: 'all',
      sport: 'all',
      dateRange: 'all',
      garScore: 'all',
      graduationYear: 'all',
    });
  };

  const hasActiveFilters = Object.values(filters).some((filter) => filter !== 'all');

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-slate-300 transition-colors"
      >
        <Search className="w-4 h-4" />
        <span className="text-sm">Search...</span>
        <kbd className="ml-2 px-2 py-1 bg-slate-700 text-xs rounded">⌘K</kbd>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20">
      <div
        ref={searchRef}
        className="bg-slate-900 rounded-xl w-full max-w-2xl shadow-2xl border border-slate-700"
      >
        {/* Search Header */}
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <Search className="w-5 h-5 text-slate-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search videos, athletes, teams, courses..."
              className="flex-1 bg-transparent text-white placeholder-slate-400 outline-none"
            />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-lg transition-colors ${
                showFilters || hasActiveFilters
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-400'
              }`}
            >
              <Filter className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="p-4 border-b border-slate-700 bg-slate-800">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-white">Filters</h4>
              <button onClick={clearFilters} className="text-xs text-blue-400 hover:text-blue-300">
                Clear all
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <select
                value={filters.type}
                onChange={(e) => setFilters((prev) => ({ ...prev, type: e.target.value }))}
                className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm"
              >
                <option value="all">All Types</option>
                <option value="video">Videos</option>
                <option value="athlete">Athletes</option>
                <option value="team">Teams</option>
                <option value="achievement">Achievements</option>
                <option value="course">Courses</option>
              </select>

              <select
                value={filters.sport}
                onChange={(e) => setFilters((prev) => ({ ...prev, sport: e.target.value }))}
                className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm"
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
                onChange={(e) => setFilters((prev) => ({ ...prev, garScore: e.target.value }))}
                className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm"
              >
                <option value="all">All GAR Scores</option>
                <option value="90-100">90-100</option>
                <option value="80-89">80-89</option>
                <option value="70-79">70-79</option>
                <option value="60-69">60-69</option>
              </select>

              <select
                value={filters.graduationYear}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, graduationYear: e.target.value }))
                }
                className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm"
              >
                <option value="all">All Years</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
                <option value="2027">2027</option>
              </select>

              <select
                value={filters.dateRange}
                onChange={(e) => setFilters((prev) => ({ ...prev, dateRange: e.target.value }))}
                className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm"
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
            </div>
          </div>
        )}

        {/* Results */}
        <div className="max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-slate-400 mt-2">Searching...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="p-2">
              {results.map((result) => (
                <button
                  key={result.id}
                  onClick={() => handleResultClick(result)}
                  className="w-full p-3 hover:bg-slate-800 rounded-lg transition-colors text-left"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">{getResultIcon(result.type)}</div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-white truncate">{result.title}</h4>
                      <p className="text-sm text-slate-400 truncate">{result.description}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-slate-500 capitalize">{result.type}</span>
                        {result.metadata.sport && (
                          <span className="text-xs text-slate-500">{result.metadata.sport}</span>
                        )}
                        {result.metadata.garScore && (
                          <span className="text-xs text-slate-500">
                            GAR: {result.metadata.garScore}
                          </span>
                        )}
                        {result.metadata.createdAt && (
                          <span className="text-xs text-slate-500">
                            {new Date(result.metadata.createdAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : query.trim().length > 1 ? (
            <div className="p-8 text-center text-slate-400">No results found for "{query}"</div>
          ) : (
            <div className="p-4">
              {recentSearches.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-slate-400 mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Recent searches
                  </h4>
                  <div className="space-y-1">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => setQuery(search)}
                        className="w-full p-2 text-left text-slate-300 hover:bg-slate-800 rounded-lg transition-colors text-sm"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="text-sm text-slate-400">
                <p className="mb-2">Search suggestions:</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Football highlights',
                    'Basketball analysis',
                    'Track events',
                    'Academic courses',
                  ].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => setQuery(suggestion)}
                      className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded-full text-xs transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-700 bg-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-4">
              <span>↑↓ to navigate</span>
              <span>↵ to select</span>
              <span>esc to close</span>
            </div>
            <div className="flex items-center gap-2">
              <span>Powered by</span>
              <span className="text-blue-400">Go4It Search</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
