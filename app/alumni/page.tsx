import { Suspense } from 'react';
import AlumniDirectory from '@/components/alumni/AlumniDirectory';
import FeaturedStories from '@/components/alumni/FeaturedStories';
import UpcomingEvents from '@/components/alumni/UpcomingEvents';
import NetworkStats from '@/components/alumni/NetworkStats';

export const metadata = {
  title: 'Alumni & Coaches Network | Go4It Sports',
  description: 'Connect with successful alumni and experienced coaches. Get mentorship, share your journey, and grow your athletic career.',
};

export default function AlumniNetworkPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
              Alumni & Coaches Network
            </h1>
            
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8">
              Connect with those who&apos;ve walked the path before you. Get guidance from experienced coaches 
              and successful alumni who are ready to help you achieve your goals.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="#directory"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all flex items-center gap-2"
              >
                <span>Explore Directory</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </a>
              <a
                href="/alumni/create-profile"
                className="px-6 py-3 border border-slate-600 hover:bg-slate-800 text-white font-medium rounded-lg transition-colors"
              >
                Join as Alumni/Coach
              </a>
            </div>
          </div>

          {/* Network Stats */}
          <Suspense fallback={<div className="text-center text-slate-400">Loading stats...</div>}>
            <NetworkStats />
          </Suspense>
        </div>
      </section>

      {/* Featured Success Stories */}
      <section className="py-12 px-4 bg-slate-900/50">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white">Success Stories</h2>
            <a href="/alumni/stories" className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-2">
              <span>View All</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
          
          <Suspense fallback={<div className="text-center text-slate-400">Loading stories...</div>}>
            <FeaturedStories />
          </Suspense>
        </div>
      </section>

      {/* Alumni & Coaches Directory */}
      <section id="directory" className="py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              Find Your Mentor
            </h2>
            <p className="text-slate-400">
              Browse our network of accomplished alumni and experienced coaches ready to guide you.
            </p>
          </div>
          
          <Suspense fallback={<div className="text-center text-slate-400">Loading directory...</div>}>
            <AlumniDirectory />
          </Suspense>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-12 px-4 bg-slate-900/50">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Networking Events</h2>
              <p className="text-slate-400">
                Join alumni meetups, coaching clinics, and professional development sessions
              </p>
            </div>
            <a href="/alumni/events" className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-2">
              <span>All Events</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
          
          <Suspense fallback={<div className="text-center text-slate-400">Loading events...</div>}>
            <UpcomingEvents />
          </Suspense>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Why Join Our Network?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Expert Mentorship</h3>
              <p className="text-slate-400">
                Get 1-on-1 guidance from alumni who&apos;ve successfully navigated college recruiting 
                and professional sports careers.
              </p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Professional Coaching</h3>
              <p className="text-slate-400">
                Connect with certified coaches offering specialized training, technique refinement, 
                and performance optimization.
              </p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Community Events</h3>
              <p className="text-slate-400">
                Attend networking events, workshops, and clinics to build relationships and 
                expand your athletic network.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
