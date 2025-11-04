'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface AlumniProfile {
  id: string;
  displayName: string;
  profileImage: string | null;
  bio: string | null;
  sports: string[];
  graduationYear: number | null;
  collegeName: string | null;
  collegeLevel: string | null;
  currentOccupation: string | null;
  availableForMentorship: boolean;
  mentorshipAreas: string[];
  isPro: boolean;
}

interface CoachProfile {
  id: string;
  displayName: string;
  title: string | null;
  profileImage: string | null;
  bio: string | null;
  sports: string[];
  specializations: string[];
  yearsExperience: number | null;
  currentTeam: string | null;
  acceptingClients: boolean;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
}

export default function AlumniDirectory() {
  const [activeTab, setActiveTab] = useState<'alumni' | 'coaches'>('alumni');
  const [alumni, setAlumni] = useState<AlumniProfile[]>([]);
  const [coaches, setCoaches] = useState<CoachProfile[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [sportFilter, setSportFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [mentorshipFilter, setMentorshipFilter] = useState(false);

  const fetchProfiles = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        type: activeTab,
        ...(sportFilter && { sport: sportFilter }),
        ...(searchQuery && { search: searchQuery }),
        ...(mentorshipFilter && { mentorshipOnly: 'true' }),
      });

      const response = await fetch(`/api/alumni/directory?${params}`);
      const data = await response.json();

      if (activeTab === 'alumni') {
        setAlumni(data.profiles || []);
      } else {
        setCoaches(data.profiles || []);
      }
    } catch {
      // Error fetching profiles
    } finally {
      setLoading(false);
    }
  }, [activeTab, sportFilter, searchQuery, mentorshipFilter]);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-slate-700">
        <button
          onClick={() => setActiveTab('alumni')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'alumni'
              ? 'text-white border-b-2 border-blue-500'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Alumni
        </button>
        <button
          onClick={() => setActiveTab('coaches')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'coaches'
              ? 'text-white border-b-2 border-blue-500'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Coaches
        </button>
      </div>

      {/* Filters */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 mb-6">
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Search
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Name, school, team..."
              className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Sport
            </label>
            <select
              value={sportFilter}
              onChange={(e) => setSportFilter(e.target.value)}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Sports</option>
              <option value="soccer">Soccer</option>
              <option value="basketball">Basketball</option>
              <option value="flag-football">Flag Football</option>
              <option value="football">Football</option>
              <option value="baseball">Baseball</option>
              <option value="volleyball">Volleyball</option>
            </select>
          </div>

          <div className="flex items-end">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={mentorshipFilter}
                onChange={(e) => setMentorshipFilter(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-slate-900 border-slate-600 rounded focus:ring-blue-500"
              />
              <span className="text-slate-300">
                {activeTab === 'alumni' ? 'Available for mentorship' : 'Accepting clients'}
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
          <p className="text-slate-400 mt-4">Loading profiles...</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTab === 'alumni'
            ? alumni.map((profile) => (
                <Link
                  key={profile.id}
                  href={`/alumni/profile/${profile.id}`}
                  className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-blue-500 transition-all group"
                >
                  {/* Profile Header */}
                  <div className="flex items-start gap-4 mb-4">
                    {profile.profileImage ? (
                      <img
                        src={profile.profileImage}
                        alt={profile.displayName}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                        {getInitials(profile.displayName)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
                        {profile.displayName}
                      </h3>
                      {profile.graduationYear && (
                        <p className="text-sm text-slate-400">Class of {profile.graduationYear}</p>
                      )}
                    </div>
                  </div>

                  {/* College Info */}
                  {profile.collegeName && (
                    <div className="mb-3">
                      <p className="text-white font-medium">
                        {profile.collegeName}
                        {profile.collegeLevel && (
                          <span className="ml-2 text-xs px-2 py-1 bg-blue-500/20 text-blue-300 rounded">
                            {profile.collegeLevel}
                          </span>
                        )}
                      </p>
                    </div>
                  )}

                  {/* Current Status */}
                  {profile.currentOccupation && (
                    <p className="text-sm text-slate-400 mb-3">
                      {profile.currentOccupation}
                    </p>
                  )}

                  {/* Sports */}
                  {profile.sports.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {profile.sports.slice(0, 3).map((sport) => (
                        <span
                          key={sport}
                          className="text-xs px-2 py-1 bg-slate-700 text-slate-300 rounded"
                        >
                          {sport}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Mentorship Badge */}
                  {profile.availableForMentorship && (
                    <div className="mt-4 pt-4 border-t border-slate-700">
                      <div className="flex items-center gap-2 text-green-400 text-sm">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Available for mentorship</span>
                      </div>
                    </div>
                  )}

                  {/* Pro Badge */}
                  {profile.isPro && (
                    <div className="absolute top-4 right-4">
                      <span className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded font-medium">
                        PRO
                      </span>
                    </div>
                  )}
                </Link>
              ))
            : coaches.map((profile) => (
                <Link
                  key={profile.id}
                  href={`/alumni/coach/${profile.id}`}
                  className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-blue-500 transition-all group relative"
                >
                  {/* Verified Badge */}
                  {profile.isVerified && (
                    <div className="absolute top-4 right-4">
                      <div className="flex items-center gap-1 text-xs px-2 py-1 bg-blue-500/20 text-blue-300 rounded">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Verified</span>
                      </div>
                    </div>
                  )}

                  {/* Profile Header */}
                  <div className="flex items-start gap-4 mb-4">
                    {profile.profileImage ? (
                      <Image
                        src={profile.profileImage}
                        alt={profile.displayName}
                        width={64}
                        height={64}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl">
                        {getInitials(profile.displayName)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
                        {profile.displayName}
                      </h3>
                      {profile.title && (
                        <p className="text-sm text-slate-400">{profile.title}</p>
                      )}
                    </div>
                  </div>

                  {/* Team/Experience */}
                  <div className="mb-3">
                    {profile.currentTeam && (
                      <p className="text-white font-medium mb-1">{profile.currentTeam}</p>
                    )}
                    {profile.yearsExperience && (
                      <p className="text-sm text-slate-400">
                        {profile.yearsExperience}+ years experience
                      </p>
                    )}
                  </div>

                  {/* Rating */}
                  {profile.reviewCount > 0 && (
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(profile.rating / 10)
                                ? 'text-yellow-400'
                                : 'text-slate-600'
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm text-slate-400">
                        ({profile.reviewCount})
                      </span>
                    </div>
                  )}

                  {/* Sports & Specializations */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {profile.sports.slice(0, 2).map((sport) => (
                      <span
                        key={sport}
                        className="text-xs px-2 py-1 bg-slate-700 text-slate-300 rounded"
                      >
                        {sport}
                      </span>
                    ))}
                    {profile.specializations.slice(0, 2).map((spec) => (
                      <span
                        key={spec}
                        className="text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>

                  {/* Availability */}
                  {profile.acceptingClients && (
                    <div className="mt-4 pt-4 border-t border-slate-700">
                      <div className="flex items-center gap-2 text-green-400 text-sm">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Accepting new clients</span>
                      </div>
                    </div>
                  )}
                </Link>
              ))}
        </div>
      )}

      {/* Empty State */}
      {!loading &&
        ((activeTab === 'alumni' && alumni.length === 0) ||
          (activeTab === 'coaches' && coaches.length === 0)) && (
          <div className="text-center py-12">
            <svg
              className="w-16 h-16 text-slate-600 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-white mb-2">
              No {activeTab} found
            </h3>
            <p className="text-slate-400">Try adjusting your filters</p>
          </div>
        )}
    </div>
  );
}
