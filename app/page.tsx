import React from 'react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Navigation */}
      <nav className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold text-white">Go4It Sports</div>
            <div className="flex space-x-4">
              <Link href="/auth" className="text-blue-400 hover:text-blue-300">
                Sign In
              </Link>
              <Link href="/dashboard" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-white mb-6">
            Revolutionary ADHD-Focused Sports Analytics Platform
          </h1>
          <p className="text-xl text-slate-400 mb-8 max-w-3xl mx-auto">
            9 out of 15 cutting-edge features complete! Advanced AI coaching, VR training, 
            and neurodivergent-optimized tools for student athletes aged 12-18.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/dashboard" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg px-8 py-3 rounded-md transition-colors">
              View Platform
            </Link>
            <Link href="/teams" className="bg-slate-700 hover:bg-slate-600 text-white font-semibold text-lg px-8 py-3 rounded-md transition-colors">
              Explore Features
            </Link>
          </div>
        </div>
      </div>

      {/* Completed Features */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-12">
          Platform Status: 9/15 Features Complete
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-slate-800 p-6 rounded-lg border border-green-500">
            <div className="text-green-400 text-sm font-medium mb-2">✅ COMPLETE</div>
            <h3 className="text-xl font-semibold text-white mb-2">VR Training Scenarios</h3>
            <p className="text-slate-400 text-sm">Immersive ADHD-optimized training environments</p>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-lg border border-green-500">
            <div className="text-green-400 text-sm font-medium mb-2">✅ COMPLETE</div>
            <h3 className="text-xl font-semibold text-white mb-2">AR Performance Overlay</h3>
            <p className="text-slate-400 text-sm">Real-time technique guidance with visual cues</p>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-lg border border-green-500">
            <div className="text-green-400 text-sm font-medium mb-2">✅ COMPLETE</div>
            <h3 className="text-xl font-semibold text-white mb-2">Professional Scout Network</h3>
            <p className="text-slate-400 text-sm">Direct connections with automated highlights</p>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-lg border border-green-500">
            <div className="text-green-400 text-sm font-medium mb-2">✅ COMPLETE</div>
            <h3 className="text-xl font-semibold text-white mb-2">Voice-Activated Coaching</h3>
            <p className="text-slate-400 text-sm">Natural language hands-free coaching</p>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-lg border border-green-500">
            <div className="text-green-400 text-sm font-medium mb-2">✅ COMPLETE</div>
            <h3 className="text-xl font-semibold text-white mb-2">Injury Prevention System</h3>
            <p className="text-slate-400 text-sm">Biomechanical risk assessment</p>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-lg border border-green-500">
            <div className="text-green-400 text-sm font-medium mb-2">✅ COMPLETE</div>
            <h3 className="text-xl font-semibold text-white mb-2">Advanced Parental Dashboard</h3>
            <p className="text-slate-400 text-sm">Family engagement and ADHD support tools</p>
          </div>
        </div>
      </div>

      {/* Platform Stats */}
      <div className="bg-slate-800 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-400 mb-2">9/15</div>
              <div className="text-slate-300">Features Complete</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-400 mb-2">60%</div>
              <div className="text-slate-300">Platform Ready</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">$2.3B</div>
              <div className="text-slate-300">Target Market</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-400 mb-2">3-5</div>
              <div className="text-slate-300">Years Ahead</div>
            </div>
          </div>
        </div>
      </div>

      {/* ADHD Focus */}
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h2 className="text-4xl font-bold text-white mb-6">
          ADHD-First Design Philosophy
        </h2>
        <p className="text-lg text-slate-300 mb-8">
          Every feature optimized for neurodivergent athletes: attention management, hyperfocus channeling, 
          family integration, and evidence-based ADHD accommodations.
        </p>
        <div className="flex justify-center space-x-4">
          <Link href="/dashboard" className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-lg px-8 py-3 rounded-md transition-colors">
            Explore Platform
          </Link>
          <Link href="/starpath" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg px-8 py-3 rounded-md transition-colors">
            View StarPath
          </Link>
        </div>
      </div>
    </div>
  );
}