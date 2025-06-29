import React from 'react';
import Link from 'next/link';
import { Star, Trophy, BookOpen, Video, Users, Target } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold text-white">Go4It Sports</div>
            <div className="flex space-x-4">
              <Link href="/auth" className="text-blue-400 hover:text-blue-300">
                Sign In
              </Link>
              <Link href="/auth" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
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
            Advanced Sports Analytics for Student Athletes
          </h1>
          <p className="text-xl text-slate-400 mb-8 max-w-3xl mx-auto">
            Comprehensive platform featuring AI-powered coaching, skill development tracking, 
            and NCAA compliance monitoring designed specifically for neurodivergent athletes.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/auth" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg px-8 py-3 rounded-md transition-colors">
              Get Started
            </Link>
            <Link href="/auth" className="bg-slate-700 hover:bg-slate-600 text-white font-semibold text-lg px-8 py-3 rounded-md transition-colors">
              Learn More
            </Link>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-12">
          Platform Features
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Star className="h-8 w-8" />}
            title="StarPath™ Skill Development"
            description="Interactive skill progression system with XP tracking and achievement unlocks"
            bgColor="bg-purple-600"
          />
          
          <FeatureCard 
            icon={<Video className="h-8 w-8" />}
            title="Video Analysis & GAR Scoring"
            description="AI-powered video analysis with Game Analysis Rating for performance insights"
            bgColor="bg-blue-600"
          />
          
          <FeatureCard 
            icon={<BookOpen className="h-8 w-8" />}
            title="Academic Progress Tracking"
            description="NCAA eligibility monitoring with course requirements and GPA tracking"
            bgColor="bg-green-600"
          />
          
          <FeatureCard 
            icon={<Users className="h-8 w-8" />}
            title="Recruitment Monitoring"
            description="Real-time tracking with 711 active scouts monitoring opportunities"
            bgColor="bg-orange-600"
          />
          
          <FeatureCard 
            icon={<Trophy className="h-8 w-8" />}
            title="Performance Analytics"
            description="Comprehensive statistics and progress visualization tools"
            bgColor="bg-red-600"
          />
          
          <FeatureCard 
            icon={<Target className="h-8 w-8" />}
            title="AI Coaching Insights"
            description="Personalized recommendations powered by advanced AI analysis"
            bgColor="bg-indigo-600"
          />
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-slate-800 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-400 mb-2">711</div>
              <div className="text-slate-300">Active Athlete Scouts</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-400 mb-2">395</div>
              <div className="text-slate-300">Transfer Portal Monitors</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">24/7</div>
              <div className="text-slate-300">Real-Time Monitoring</div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h2 className="text-4xl font-bold text-white mb-6">
          Ready to Elevate Your Game?
        </h2>
        <p className="text-lg text-slate-300 mb-8">
          Join student athletes using Go4It Sports to reach their potential with comprehensive analytics and AI-powered insights.
        </p>
        <Link href="/dashboard">
          <button className="btn-primary text-lg px-8 py-4">
            Start Your Journey
          </button>
        </Link>
      </div>
    </div>
  );
}

function FeatureCard({ 
  icon, 
  title, 
  description, 
  bgColor 
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  bgColor: string;
}) {
  return (
    <div className="card hover:border-blue-400/50 transition-all duration-200">
      <div className={`${bgColor} p-3 rounded-lg inline-flex mb-4`}>
        <div className="text-white">
          {icon}
        </div>
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-slate-400 text-sm">{description}</p>
    </div>
  );
}