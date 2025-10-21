'use client';

import React from 'react';
import { Star, Trophy, TrendingUp } from 'lucide-react';

interface PlayerCardProps {
  player: {
    id: string;
    name: string;
    position: string;
    sport: string;
    garScore?: number;
    isVerified?: boolean;
    stats?: {
      speed: number;
      agility: number;
      strength: number;
      technique: number;
      gameIQ: number;
    };
    profileImage?: string;
    year?: string;
  };
}

export default function PlayerCard({ player }: PlayerCardProps) {
  const { name, position, sport, garScore, isVerified, stats, profileImage, year } = player;

  const getGARColor = (score?: number) => {
    if (!score) return 'text-slate-400';
    if (score >= 8) return 'neon-text';
    if (score >= 6) return 'text-blue-400';
    if (score >= 4) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getGARGlow = (score?: number) => {
    if (!score || score < 8) return '';
    return 'neon-glow';
  };

  return (
    <div className="hero-bg neon-border rounded-xl p-6 card-hover relative overflow-hidden">
      {/* Verification Badge */}
      {isVerified && (
        <div className="absolute top-4 right-4 w-8 h-8 neon-border rounded-full flex items-center justify-center neon-glow bg-gradient-to-r from-blue-400 to-cyan-300">
          <span className="text-slate-900 font-bold text-sm">✓</span>
        </div>
      )}

      {/* Player Info */}
      <div className="flex items-start gap-4 mb-4">
        <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden">
          {profileImage ? (
            <img src={profileImage} alt={name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
              {name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </div>
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white mb-1">{name}</h3>
          <p className="text-slate-400 text-sm">
            {position} • {sport}
          </p>
          {year && <p className="text-slate-500 text-xs">Class of {year}</p>}
        </div>
      </div>

      {/* GAR Score */}
      {garScore && (
        <div className="mb-4 text-center">
          <div className={`text-3xl font-bold ${getGARColor(garScore)} ${getGARGlow(garScore)}`}>
            {garScore.toFixed(1)}
          </div>
          <p className="text-slate-400 text-sm">GAR Score</p>
        </div>
      )}

      {/* Stats */}
      {stats && (
        <div className="space-y-2">
          <div className="text-sm text-slate-300 font-medium mb-2">Performance Metrics</div>
          {Object.entries(stats).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center">
              <span className="text-slate-400 text-sm capitalize">{key}</span>
              <div className="flex items-center gap-2">
                <div className="w-16 bg-slate-700 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full ${value >= 8 ? 'bg-gradient-to-r from-blue-400 to-cyan-300 neon-glow' : value >= 6 ? 'bg-blue-400' : value >= 4 ? 'bg-yellow-400' : 'bg-red-400'}`}
                    style={{ width: `${(value / 10) * 100}%` }}
                  ></div>
                </div>
                <span className={`text-sm font-medium ${getGARColor(value)}`}>
                  {value.toFixed(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Star Rating */}
      <div className="flex justify-center mt-4 gap-1">
        {[1, 2, 3, 4, 5].map((star) => {
          const isActive = garScore && garScore >= star * 2;
          return (
            <Star
              key={star}
              className={`w-4 h-4 ${
                isActive
                  ? garScore && garScore >= 8
                    ? 'text-cyan-400 neon-glow'
                    : 'text-blue-400'
                  : 'text-slate-600'
              } ${isActive ? 'fill-current' : ''}`}
            />
          );
        })}
      </div>

      {/* Background Effect */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-purple-500 rounded-full blur-2xl"></div>
      </div>
    </div>
  );
}
