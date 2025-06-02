import React from 'react';
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs';
import { Video, BookOpen, Target, Trophy, Users, Star } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6">
        <div className="text-2xl font-bold text-white">
          Go4It Sports
        </div>
        <div className="space-x-4">
          <SignInButton mode="modal">
            <button className="btn-secondary">
              Sign In
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="btn-primary">
              Get Started
            </button>
          </SignUpButton>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
          Your Sports Journey
          <span className="block text-blue-400">Starts Here</span>
        </h1>
        <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
          Advanced analytics platform designed for neurodivergent student athletes. 
          Track performance, analyze videos, and navigate your path to college sports.
        </p>
        <SignUpButton mode="modal">
          <button className="btn-primary text-lg px-8 py-4">
            Start Your Journey
          </button>
        </SignUpButton>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Video className="h-8 w-8" />}
            title="Video Analysis"
            description="Upload game footage and get detailed GAR scoring with AI-powered insights"
          />
          <FeatureCard 
            icon={<Star className="h-8 w-8" />}
            title="StarPath™"
            description="Interactive skill development tracking to level up your athletic abilities"
          />
          <FeatureCard 
            icon={<BookOpen className="h-8 w-8" />}
            title="Academic Tracking"
            description="Stay on track for NCAA eligibility with comprehensive academic monitoring"
          />
          <FeatureCard 
            icon={<Trophy className="h-8 w-8" />}
            title="Performance Analytics"
            description="Advanced metrics and visualizations to understand your athletic progress"
          />
          <FeatureCard 
            icon={<Target className="h-8 w-8" />}
            title="Recruitment Tools"
            description="Connect with college coaches and showcase your athletic achievements"
          />
          <FeatureCard 
            icon={<Users className="h-8 w-8" />}
            title="Coach Portal"
            description="Dedicated dashboard for coaches to track and support their athletes"
          />
        </div>
      </section>

      {/* Call to Action */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="text-4xl font-bold text-white mb-6">
          Ready to Elevate Your Game?
        </h2>
        <p className="text-lg text-slate-300 mb-8">
          Join thousands of student athletes already using Go4It Sports to reach their potential.
        </p>
        <SignUpButton mode="modal">
          <button className="btn-primary text-lg px-8 py-4">
            Create Your Profile
          </button>
        </SignUpButton>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="card hover:border-blue-400/50 transition-colors">
      <div className="text-blue-400 mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-white mb-3">
        {title}
      </h3>
      <p className="text-slate-300">
        {description}
      </p>
    </div>
  );
}