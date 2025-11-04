'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Star, Trophy, TrendingUp, Award } from 'lucide-react';

interface UserProfile {
  id: string;
  name: string;
  sport: string;
  position: string;
  graduationYear: number;
  profileImage: string | null;
  garScore: number;
  achievements: string[];
  collegeCommit?: string;
  stats: {
    videos: number;
    garImprovement: number;
    recruitersContacted: number;
  };
}

export default function UserProfileShowcase() {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProfiles = async () => {
      try {
        const response = await fetch('/api/users/featured');
        const data = await response.json();
        setProfiles(data.profiles || []);
      } catch {
        // Use sample data on error
        setProfiles(getSampleProfiles());
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProfiles();
  }, []);

  const getSampleProfiles = (): UserProfile[] => [
    {
      id: '1',
      name: 'Marcus Johnson',
      sport: 'Football',
      position: 'Wide Receiver',
      graduationYear: 2026,
      profileImage: null,
      garScore: 92,
      achievements: ['State Champion', 'All-Conference'],
      collegeCommit: 'University of Colorado',
      stats: {
        videos: 24,
        garImprovement: 18,
        recruitersContacted: 47,
      },
    },
    {
      id: '2',
      name: 'Sofia Rodriguez',
      sport: 'Soccer',
      position: 'Forward',
      graduationYear: 2025,
      profileImage: null,
      garScore: 88,
      achievements: ['Regional MVP', 'U17 National Team'],
      stats: {
        videos: 31,
        garImprovement: 22,
        recruitersContacted: 52,
      },
    },
    {
      id: '3',
      name: 'Jayden Chen',
      sport: 'Basketball',
      position: 'Point Guard',
      graduationYear: 2026,
      profileImage: null,
      garScore: 90,
      achievements: ['District Champion', '1st Team All-State'],
      collegeCommit: 'Stanford University',
      stats: {
        videos: 28,
        garImprovement: 25,
        recruitersContacted: 38,
      },
    },
    {
      id: '4',
      name: 'Emma Thompson',
      sport: 'Flag Football',
      position: 'Quarterback',
      graduationYear: 2025,
      profileImage: null,
      garScore: 91,
      achievements: ['League MVP', 'State Runner-Up'],
      stats: {
        videos: 19,
        garImprovement: 20,
        recruitersContacted: 29,
      },
    },
  ];

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const getGARColor = (score: number) => {
    if (score >= 90) return 'from-emerald-400 to-lime-400';
    if (score >= 80) return 'from-blue-400 to-cyan-400';
    if (score >= 70) return 'from-yellow-400 to-orange-400';
    return 'from-slate-400 to-slate-500';
  };

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 animate-pulse"
          >
            <div className="w-20 h-20 bg-slate-700 rounded-full mx-auto mb-4"></div>
            <div className="h-4 bg-slate-700 rounded mb-2"></div>
            <div className="h-3 bg-slate-700 rounded w-2/3 mx-auto"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {profiles.map((profile) => (
        <div
          key={profile.id}
          className="group bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-lime-400/50 transition-all duration-300 hover:transform hover:-translate-y-2"
        >
          {/* Profile Image */}
          <div className="relative mb-4">
            {profile.profileImage ? (
              <Image
                src={profile.profileImage}
                alt={profile.name}
                width={80}
                height={80}
                className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-slate-700 group-hover:border-lime-400 transition-colors"
              />
            ) : (
              <div
                className={`w-20 h-20 rounded-full mx-auto bg-gradient-to-br ${getGARColor(
                  profile.garScore
                )} flex items-center justify-center text-slate-900 font-bold text-xl border-2 border-slate-700 group-hover:border-lime-400 transition-colors`}
              >
                {getInitials(profile.name)}
              </div>
            )}
            
            {/* GAR Badge */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
              <div
                className={`px-3 py-1 bg-gradient-to-r ${getGARColor(
                  profile.garScore
                )} text-slate-900 rounded-full text-xs font-bold shadow-lg`}
              >
                GAR {profile.garScore}
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="text-center mt-6">
            <h3 className="text-lg font-bold text-white mb-1">{profile.name}</h3>
            <p className="text-sm text-slate-400 mb-1">
              {profile.position} • {profile.sport}
            </p>
            <p className="text-xs text-slate-500 mb-3">Class of {profile.graduationYear}</p>

            {/* College Commit Badge */}
            {profile.collegeCommit && (
              <div className="mb-3">
                <div className="inline-flex items-center gap-1 px-2 py-1 bg-lime-400/10 border border-lime-400/30 rounded-full">
                  <Trophy className="w-3 h-3 text-lime-400" />
                  <span className="text-xs text-lime-400 font-medium">
                    {profile.collegeCommit}
                  </span>
                </div>
              </div>
            )}

            {/* Achievements */}
            {profile.achievements.length > 0 && (
              <div className="mb-4">
                <div className="flex flex-wrap gap-1 justify-center">
                  {profile.achievements.slice(0, 2).map((achievement, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2 py-0.5 bg-slate-800 text-slate-300 rounded"
                    >
                      {achievement}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-800">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Star className="w-3 h-3 text-cyan-400" />
                  <p className="text-sm font-bold text-white">{profile.stats.videos}</p>
                </div>
                <p className="text-xs text-slate-500">Videos</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <TrendingUp className="w-3 h-3 text-emerald-400" />
                  <p className="text-sm font-bold text-white">+{profile.stats.garImprovement}</p>
                </div>
                <p className="text-xs text-slate-500">Growth</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Award className="w-3 h-3 text-purple-400" />
                  <p className="text-sm font-bold text-white">{profile.stats.recruitersContacted}</p>
                </div>
                <p className="text-xs text-slate-500">Contacts</p>
              </div>
            </div>
          </div>

          {/* Hover Effect Overlay */}
          <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="w-full py-2 bg-lime-400/10 hover:bg-lime-400/20 border border-lime-400/30 rounded-lg text-lime-400 text-sm font-medium transition-colors">
              View Profile
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
