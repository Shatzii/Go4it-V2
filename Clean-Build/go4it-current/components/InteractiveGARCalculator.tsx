'use client';

import { useState } from 'react';
import { Calculator, Star, TrendingUp } from 'lucide-react';

export default function InteractiveGARCalculator() {
  const [stats, setStats] = useState({
    speed: 5,
    strength: 5,
    agility: 5,
    endurance: 5,
    mental: 5,
  });

  const calculateGAR = () => {
    const weighted =
      stats.speed * 0.25 +
      stats.strength * 0.2 +
      stats.agility * 0.2 +
      stats.endurance * 0.15 +
      stats.mental * 0.2;
    return (weighted + Math.random() * 0.5).toFixed(1);
  };

  const garScore = parseFloat(calculateGAR());

  return (
    <div className="hero-bg neon-border p-6 rounded-xl hover-lift">
      <div className="flex items-center gap-2 mb-4">
        <Calculator className="w-5 h-5 neon-text" />
        <h3 className="text-lg font-bold text-white">Quick GAR Preview</h3>
      </div>

      <div className="space-y-4 mb-6">
        {Object.entries(stats).map(([key, value]) => (
          <div key={key}>
            <div className="flex justify-between mb-1">
              <label className="text-sm text-slate-300 capitalize">{key}</label>
              <span className="text-xs neon-text">{value}/10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={value}
              onChange={(e) => setStats({ ...stats, [key]: parseInt(e.target.value) })}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
        ))}
      </div>

      <div className="text-center p-4 bg-slate-900/50 rounded-lg neon-border">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Star className="w-5 h-5 text-yellow-400" />
          <span className="text-sm text-slate-400">Estimated GAR Score</span>
        </div>
        <div
          className={`text-3xl font-bold ${garScore >= 8 ? 'neon-text neon-glow' : 'text-blue-400'}`}
        >
          {garScore}
        </div>
        <p className="text-xs text-slate-500 mt-2">
          Get your official GAR analysis with video upload
        </p>
      </div>

      <button className="w-full mt-4 glow-button text-center">
        <TrendingUp className="w-4 h-4 inline mr-2" />
        Get Official GAR Analysis
      </button>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: linear-gradient(45deg, #3b82f6, #8b5cf6);
          cursor: pointer;
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
        }
        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: linear-gradient(45deg, #3b82f6, #8b5cf6);
          cursor: pointer;
          border: none;
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
        }
      `}</style>
    </div>
  );
}
