'use client'

import React, { useState, useEffect } from 'react'
import { CheckCircle, ExternalLink, Activity, Target, Users, BarChart3, Star, TrendingUp, Award, Calendar, MapPin } from 'lucide-react'

// Go4It Sports Landing Page - Matching deployed site design
export default function Go4ItHomePage() {
  const [platformStatus, setPlatformStatus] = useState('loading')

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await fetch('/api/health')
        if (response.ok) {
          setPlatformStatus('ready')
        } else {
          setPlatformStatus('degraded')
        }
      } catch (error) {
        console.log('Health check failed, using offline mode')
        setPlatformStatus('offline')
      }
    }

    checkHealth()
  }, [])

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Navigation */}
      <nav className="border-b border-slate-700 bg-slate-800/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold text-white">Go4It Sports</div>
            <div className="flex space-x-4">
              <SafeLink 
                href="/auth" 
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Sign In
              </SafeLink>
              <SafeLink 
                href="/auth" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                Get Started
              </SafeLink>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            GET VERIFIED
          </h1>
          <div className="mb-8">
            <h2 className="text-4xl font-bold mb-4">GAR Rating System</h2>
            <p className="text-xl text-slate-300 mb-6">The Ultimate AI-Powered Athlete Evaluation</p>
            <p className="text-lg text-slate-400 max-w-3xl mx-auto">
              Our revolutionary GAR Rating System uses AI to analyze physical metrics, cognitive abilities, 
              and psychological factors for the most comprehensive athlete evaluation available.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <FeatureCard
              icon={<Activity className="w-8 h-8 text-blue-400" />}
              title="AI Motion Analysis"
              description="Our cutting-edge AI technology analyzes your motion mechanics with professional-grade accuracy."
            />
            <FeatureCard
              icon={<Award className="w-8 h-8 text-purple-400" />}
              title="Verified Combines"
              description="Participate in certified athletic combines where your performance metrics are verified by professionals."
            />
          </div>
          
          <SafeLink 
            href="/auth" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors inline-block"
          >
            Get Verified Today
          </SafeLink>
        </div>
      </section>

      {/* Top Verified Athletes */}
      <section className="py-16 px-6 bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">Top Verified Athletes</h2>
            <SafeLink href="/athletes" className="text-blue-400 hover:text-blue-300">
              View All
            </SafeLink>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <AthleteCard
              name="Alonzo Barrett"
              sport="Basketball"
              position="Shooting Guard"
              garScore={92}
              verified={true}
              imageUrl="https://images.unsplash.com/photo-1627245076516-93e232cba261?w=400"
            />
            <AthleteCard
              name="Malik Barrett"
              sport="Track & Field"
              position="Sprinter"
              garScore={87}
              verified={true}
              imageUrl="https://images.unsplash.com/photo-1527334919515-b8dee906a34b?w=400"
            />
            <AthleteCard
              name="Adee Méndez"
              sport="Soccer"
              position="Center Midfielder"
              garScore={94}
              verified={true}
              imageUrl="https://images.unsplash.com/photo-1511067007398-7e4b9499a637?w=400"
            />
            <AthleteCard
              name="Test User"
              sport="Baseball"
              position="Shortstop"
              garScore={88}
              verified={true}
              imageUrl="https://images.unsplash.com/photo-1526235324994-475f0ac51a3d?w=400"
            />
          </div>
        </div>
      </section>

      {/* Upcoming Combine Events */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">Upcoming Combine Events</h2>
            <SafeLink href="/combine-tour" className="text-blue-400 hover:text-blue-300">
              View All Events
            </SafeLink>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <CombineEventCard
              title="Chicago Elite Combine"
              location="Chicago, IL"
              date="Jul 22, 2025"
              status="FILLING FAST"
              description="Join us for a comprehensive evaluation featuring physical testing, skills assessment, and game play. College coaches will be in attendance to evaluate talent."
            />
            <CombineEventCard
              title="Los Angeles Skills Showcase"
              location="Los Angeles, CA"
              date="Jul 29, 2025"
              status="FILLING FAST"
              description="An exclusive opportunity for top high school athletes to showcase their skills in front of college scouts and coaches."
            />
            <CombineEventCard
              title="Dallas All-Stars Combine"
              location="Arlington, TX"
              date="Jul 16, 2025"
              status="FILLING FAST"
              description="The premier combine event in Texas featuring comprehensive testing and evaluation for multiple sports."
            />
          </div>
        </div>
      </section>

      {/* Quick Access Features */}
      <section className="py-16 px-6 bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Platform Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <QuickAccessCard
              href="/ai-teachers"
              icon={<Users className="w-12 h-12 text-blue-400" />}
              title="AI Teachers"
              description="Get personalized coaching and guidance from our AI-powered teaching system"
            />
            <QuickAccessCard
              href="/dashboard"
              icon={<BarChart3 className="w-12 h-12 text-green-400" />}
              title="Performance Analytics"
              description="Track your progress with comprehensive analytics and insights"
            />
            <QuickAccessCard
              href="/parent-dashboard"
              icon={<Target className="w-12 h-12 text-purple-400" />}
              title="Parent Dashboard"
              description="Keep parents informed with dedicated monitoring and progress tracking"
            />
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Elevate Your Athletic Journey?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of athletes who have discovered their potential and connected with coaches through our platform.
          </p>
          <SafeLink 
            href="/auth" 
            className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
          >
            Get Started Today
          </SafeLink>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-slate-800 border-t border-slate-700">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-2xl font-bold mb-4">Go4It Sports</div>
          <p className="text-slate-400 mb-4">
            Empowering athletes through AI-powered performance analysis and verified evaluation.
          </p>
          <div className="flex justify-center space-x-6">
            <SafeLink href="/about" className="text-slate-400 hover:text-white">About</SafeLink>
            <SafeLink href="/contact" className="text-slate-400 hover:text-white">Contact</SafeLink>
            <SafeLink href="/privacy" className="text-slate-400 hover:text-white">Privacy</SafeLink>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Reusable Components
function SafeLink({ href, children, className }: { 
  href: string; 
  children: React.ReactNode; 
  className?: string;
}) {
  return (
    <a 
      href={href} 
      className={className}
      onClick={(e) => {
        e.preventDefault()
        window.location.href = href
      }}
    >
      {children}
    </a>
  )
}

function FeatureCard({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
}) {
  return (
    <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-slate-400">{description}</p>
    </div>
  )
}

function AthleteCard({ 
  name, 
  sport, 
  position, 
  garScore, 
  verified, 
  imageUrl 
}: { 
  name: string; 
  sport: string; 
  position: string; 
  garScore: number; 
  verified: boolean; 
  imageUrl: string;
}) {
  return (
    <div className="bg-slate-800/50 rounded-lg overflow-hidden border border-slate-700 hover:border-slate-600 transition-colors">
      <div className="relative">
        <img 
          src={imageUrl} 
          alt={name} 
          className="w-full h-48 object-cover"
        />
        {verified && (
          <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">
            VERIFIED
          </div>
        )}
        <div className="absolute bottom-2 left-2 bg-blue-600 text-white px-3 py-1 rounded-full text-lg font-bold">
          {garScore}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1">{name}</h3>
        <p className="text-slate-400 text-sm mb-1">{position}</p>
        <p className="text-slate-500 text-xs">SPORT: {sport}</p>
        <p className="text-slate-500 text-xs">GAR: {garScore}/100</p>
      </div>
    </div>
  )
}

function CombineEventCard({ 
  title, 
  location, 
  date, 
  status, 
  description 
}: { 
  title: string; 
  location: string; 
  date: string; 
  status: string; 
  description: string;
}) {
  return (
    <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors">
      <div className="flex justify-between items-start mb-3">
        <span className="bg-orange-500 text-white px-2 py-1 rounded text-xs font-semibold">
          {status}
        </span>
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <div className="flex items-center text-slate-400 text-sm mb-1">
        <MapPin className="w-4 h-4 mr-1" />
        {location}
      </div>
      <div className="flex items-center text-slate-400 text-sm mb-3">
        <Calendar className="w-4 h-4 mr-1" />
        {date}
      </div>
      <p className="text-slate-400 text-sm mb-4">{description}</p>
      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition-colors">
        Register Now
      </button>
    </div>
  )
}

function QuickAccessCard({ 
  href, 
  icon, 
  title, 
  description 
}: { 
  href: string; 
  icon: React.ReactNode; 
  title: string; 
  description: string;
}) {
  return (
    <SafeLink href={href} className="group">
      <div className="bg-slate-800/50 p-8 rounded-lg border border-slate-700 hover:border-slate-600 transition-all group-hover:transform group-hover:scale-105">
        <div className="mb-4">{icon}</div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-slate-400">{description}</p>
      </div>
    </SafeLink>
  )
}