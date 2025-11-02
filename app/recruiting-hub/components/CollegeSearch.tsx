'use client';

import { useState } from 'react';
import { Search, Filter, MapPin, Award, Users, ExternalLink, Heart, GitCompare } from 'lucide-react';
import { College, useCollegeSearch } from '../hooks/useRecruitingData';

export default function CollegeSearch() {
  const { colleges, loading, searchColleges } = useCollegeSearch();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    division: '',
    state: '',
    sport: '',
  });
  const [favorites, setFavorites] = useState<number[]>([]);
  const [compareList, setCompareList] = useState<number[]>([]);

  const handleSearch = () => {
    searchColleges({
      search: searchTerm,
      ...filters,
    });
  };

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
  };

  const toggleCompare = (id: number) => {
    setCompareList(prev => {
      if (prev.includes(id)) {
        return prev.filter(cid => cid !== id);
      }
      if (prev.length >= 3) {
        return prev; // Max 3 colleges for comparison
      }
      return [...prev, id];
    });
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-lg">
        <h2 className="text-2xl font-bold text-white mb-4">Find Your Perfect College</h2>
        
        {/* Search Bar */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by school name, city, or conference..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-4 py-3 bg-white rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
          >
            Search
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
          <select
            value={filters.division}
            onChange={(e) => setFilters({ ...filters, division: e.target.value })}
            className="px-4 py-2 bg-white rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <option value="">All Divisions</option>
            <option value="D1">Division I</option>
            <option value="D2">Division II</option>
            <option value="D3">Division III</option>
            <option value="NAIA">NAIA</option>
            <option value="NJCAA">NJCAA</option>
          </select>

          <input
            type="text"
            placeholder="State (e.g., CA, TX)"
            value={filters.state}
            onChange={(e) => setFilters({ ...filters, state: e.target.value })}
            className="px-4 py-2 bg-white rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />

          <input
            type="text"
            placeholder="Sport (e.g., Football, Basketball)"
            value={filters.sport}
            onChange={(e) => setFilters({ ...filters, sport: e.target.value })}
            className="px-4 py-2 bg-white rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>
      </div>

      {/* Compare Bar */}
      {compareList.length > 0 && (
        <div className="bg-blue-600 p-4 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-3 text-white">
            <GitCompare className="w-5 h-5" />
            <span className="font-medium">{compareList.length} college{compareList.length > 1 ? 's' : ''} selected for comparison</span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setCompareList([])}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
            >
              Clear
            </button>
            <button
              disabled={compareList.length < 2}
              className="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Compare Now
            </button>
          </div>
        </div>
      )}

      {/* Results */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-400">Searching colleges...</p>
        </div>
      ) : colleges.length > 0 ? (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-slate-400">{colleges.length} colleges found</p>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-sm bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors">
                <Filter className="w-4 h-4 inline mr-1" />
                Sort
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {colleges.map((college) => (
              <CollegeCard
                key={college.id}
                college={college}
                isFavorite={favorites.includes(college.id)}
                isInCompare={compareList.includes(college.id)}
                onToggleFavorite={() => toggleFavorite(college.id)}
                onToggleCompare={() => toggleCompare(college.id)}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-slate-800/50 rounded-lg border border-slate-700">
          <Search className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <p className="text-slate-400">Search for colleges to get started</p>
        </div>
      )}
    </div>
  );
}

interface CollegeCardProps {
  college: College;
  isFavorite: boolean;
  isInCompare: boolean;
  onToggleFavorite: () => void;
  onToggleCompare: () => void;
}

function CollegeCard({ college, isFavorite, isInCompare, onToggleFavorite, onToggleCompare }: CollegeCardProps) {
  const programs = Array.isArray(college.programs) ? college.programs : [];

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-blue-500 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white mb-1">{college.schoolName}</h3>
          <div className="flex items-center gap-3 text-sm text-slate-400">
            <span className="px-2 py-1 bg-blue-600/20 text-blue-400 rounded">{college.division}</span>
            {college.city && college.state && (
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {college.city}, {college.state}
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onToggleFavorite}
            className={`p-2 rounded-lg transition-colors ${
              isFavorite ? 'bg-red-600 text-white' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
            }`}
          >
            <Heart className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={onToggleCompare}
            className={`p-2 rounded-lg transition-colors ${
              isInCompare ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
            }`}
          >
            <GitCompare className="w-5 h-5" />
          </button>
        </div>
      </div>

      {college.conference && (
        <div className="mb-3">
          <span className="text-sm text-slate-400">Conference: </span>
          <span className="text-sm text-white font-medium">{college.conference}</span>
        </div>
      )}

      {programs.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-slate-300">Programs</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {programs.slice(0, 5).map((program: any, idx: number) => {
              const programName = typeof program === 'string' ? program : program.name;
              return (
                <span key={idx} className="px-2 py-1 bg-slate-700 text-slate-300 rounded text-xs">
                  {programName}
                </span>
              );
            })}
            {programs.length > 5 && (
              <span className="px-2 py-1 bg-slate-700 text-slate-400 rounded text-xs">
                +{programs.length - 5} more
              </span>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 pt-4 border-t border-slate-700">
        {college.website && (
          <a
            href={college.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors text-sm"
          >
            <ExternalLink className="w-4 h-4" />
            Visit Website
          </a>
        )}
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm">
          <Users className="w-4 h-4" />
          Contact Coach
        </button>
      </div>
    </div>
  );
}
