import React from 'react';
import { BrainCircuit, Medal, UserSearch, LineChart } from 'lucide-react';

interface WhatMakesUsDifferentProps {
  showTitle?: boolean;
}

export function WhatMakesUsDifferent({ showTitle = true }: WhatMakesUsDifferentProps) {
  return (
    <section className="py-16 border-t border-b border-gray-800">
      {showTitle && (
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
              What Makes Us
            </span> Different
          </h2>
        </div>
      )}

      <div className="container mx-auto px-4">
        {/* GAR Rating System Block */}
        <div className="section mb-10 flex flex-col md:flex-row items-center md:text-left text-center md:justify-start gap-8 max-w-4xl mx-auto">
          <div className="section-icon flex-shrink-0 w-24 h-24 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-400/20 rounded-full backdrop-blur-sm"></div>
            <BrainCircuit className="w-full h-full p-5 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
          </div>
          <div className="section-content">
            <h3 className="section-title text-2xl font-bold text-white mb-2">Score Smarter.</h3>
            <p className="section-text text-gray-300">
              Get a 0–100 GAR Score backed by real data — physical, mental, and emotional.
              See your star rating (1–5) light up as you grow.
            </p>
          </div>
        </div>

        {/* GAR Analysis Block */}
        <div className="section mb-10 flex flex-col md:flex-row-reverse items-center md:text-right text-center md:justify-end gap-8 max-w-4xl mx-auto">
          <div className="section-icon flex-shrink-0 w-24 h-24 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-400/20 rounded-full backdrop-blur-sm"></div>
            <Medal className="w-full h-full p-5 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
          </div>
          <div className="section-content">
            <h3 className="section-title text-2xl font-bold text-white mb-2">Your Full Breakdown.</h3>
            <p className="section-text text-gray-300">
              From combine results to coachability and learning style — your GAR Analysis gives you
              the blueprint to train smarter and level up faster.
            </p>
          </div>
        </div>

        {/* GAR Position-Specific Rating Block */}
        <div className="section mb-10 flex flex-col md:flex-row items-center md:text-left text-center md:justify-start gap-8 max-w-4xl mx-auto">
          <div className="section-icon flex-shrink-0 w-24 h-24 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-400/20 rounded-full backdrop-blur-sm"></div>
            <UserSearch className="w-full h-full p-5 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
          </div>
          <div className="section-content">
            <h3 className="section-title text-2xl font-bold text-white mb-2">Play Where You Belong.</h3>
            <p className="section-text text-gray-300">
              Our AI maps your unique traits to your perfect sport and position. Whether you're
              a striker or a safety, we'll show you your best fit.
            </p>
          </div>
        </div>

        {/* Performance Growth Block (Additional) */}
        <div className="section flex flex-col md:flex-row-reverse items-center md:text-right text-center md:justify-end gap-8 max-w-4xl mx-auto">
          <div className="section-icon flex-shrink-0 w-24 h-24 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-400/20 rounded-full backdrop-blur-sm"></div>
            <LineChart className="w-full h-full p-5 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
          </div>
          <div className="section-content">
            <h3 className="section-title text-2xl font-bold text-white mb-2">Track Your Growth.</h3>
            <p className="section-text text-gray-300">
              See your progress visually with performance analytics and custom dashboards.
              Set goals, track achievements, and celebrate every milestone.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}