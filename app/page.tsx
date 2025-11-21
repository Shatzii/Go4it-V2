"use client";

import Link from "next/link";
import { useState, Suspense } from "react";
import dynamic from "next/dynamic";

const ChatWidget = dynamic(() => import("./components/ChatWidget"), {
  ssr: false,
  loading: () => null
});

export default function SimpleLandingPage() {
  const [activeFeature, setActiveFeature] = useState("gap-year");
  
  return (
    <div className="min-h-screen bg-black text-white" suppressHydrationWarning>
      {/* Header */}
      <header className="bg-black border-b border-amber-500/30">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Go4it Sports Academy" className="h-12 w-12" />
              <div>
                <div className="text-2xl font-bold text-white">Go4it Sports Academy™</div>
                <div className="text-sm text-amber-500">+ StarPath Accelerator™</div>
              </div>
            </div>
            <div className="hidden md:flex gap-6 items-center">
              <a href="#programs" className="hover:text-amber-500 transition">Programs</a>
              <a href="#curriculum" className="hover:text-amber-500 transition">Curriculum</a>
              <a href="#assessment" className="hover:text-amber-500 transition">Assessment</a>
              <a href="#contact" className="hover:text-amber-500 transition">Contact</a>
              <a href="#parent-night" className="bg-amber-500 text-black px-4 py-2 rounded-lg font-semibold hover:bg-amber-400 transition">Parent Night</a>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-24 px-4 bg-gradient-to-b from-amber-900/10 to-black">
        <div className="absolute inset-0 bg-[url('/athlete-hero.jpg')] bg-cover bg-center opacity-20"></div>
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-6xl md:text-7xl font-bold mb-4 leading-tight">
            <span className="text-white">Go4it Sports Academy™</span>
            <br />
            <span className="text-amber-500">+ StarPath Accelerator™</span>
          </h1>
          <p className="text-2xl md:text-3xl text-amber-400 mb-6 italic font-light">
            The Future of Scholar-Athlete Education
          </p>
          <div className="text-3xl font-bold mb-8 text-white">
            12 Weeks → 12 Credits → One Global Advantage
          </div>
          <p className="text-xl text-gray-300 mb-10 max-w-4xl mx-auto leading-relaxed">
            The world's first experiential learning system where training, life, culture, and performance become full academic credit.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <a href="#programs" className="bg-amber-500 hover:bg-amber-400 text-black px-10 py-4 rounded-lg font-bold text-lg transition shadow-lg shadow-amber-500/50">
              Apply Now
            </a>
            <a href="#parent-night" className="bg-white/10 hover:bg-white/20 border-2 border-amber-500 px-10 py-4 rounded-lg font-bold text-lg transition">
              Parent Night (Tue/Thu)
            </a>
            <a href="#assessment" className="border-2 border-white hover:bg-white hover:text-black px-10 py-4 rounded-lg font-bold text-lg transition">
              Start Assessment
            </a>
          </div>
        </div>
      </section>

      {/* StarPath Transformation Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto text-center">
          <div className="text-amber-500 text-6xl mb-6">★</div>
          <h2 className="text-5xl font-bold mb-6 text-white">
            Where Living Becomes Learning™
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 max-w-6xl mx-auto">
            <div className="bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/30 p-8 rounded-lg">
              <div className="text-4xl mb-4">🎓</div>
              <h3 className="text-xl font-bold mb-3 text-amber-400">NCAA-Recognized Pathways</h3>
              <p className="text-gray-300">Full academic credits recognized by NCAA and transferred globally</p>
            </div>
            
            <div className="bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/30 p-8 rounded-lg">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-xl font-bold mb-3 text-amber-400">Elite European Development</h3>
              <p className="text-gray-300">World-class training methodology and athletic performance systems</p>
            </div>
            
            <div className="bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/30 p-8 rounded-lg">
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="text-xl font-bold mb-3 text-amber-400">Cultural Immersion</h3>
              <p className="text-gray-300">German language fluency + European cultural competency</p>
            </div>
            
            <div className="bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/30 p-8 rounded-lg">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold mb-3 text-amber-400">Human Performance Tracking</h3>
              <p className="text-gray-300">Complete HDR™ portfolio documenting all 6 development pillars</p>
            </div>
            
            <div className="bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/30 p-8 rounded-lg">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-3 text-amber-400">College Recruiting Portfolio</h3>
              <p className="text-gray-300">Documented evidence for NCAA coaches and admissions</p>
            </div>
            
            <div className="bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/30 p-8 rounded-lg">
              <div className="text-4xl mb-4">👑</div>
              <h3 className="text-xl font-bold mb-3 text-amber-400">Global Leadership</h3>
              <p className="text-gray-300">Scholar-athlete identity forged through lived experience</p>
            </div>
          </div>
          
          <div className="mt-16">
            <p className="text-2xl md:text-3xl text-amber-400 font-bold italic">
              This isn't an online school. This is a new category of education.
            </p>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section id="programs" className="py-20 px-4 bg-black">
        <div className="container mx-auto">
          <div className="text-amber-500 text-6xl mb-6 text-center">★</div>
          <h2 className="text-5xl font-bold text-center mb-4 text-white">StarPath Programs</h2>
          <p className="text-center text-xl text-gray-400 mb-16 max-w-3xl mx-auto">
            Choose your pathway to academic acceleration and global readiness
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Vienna Residency */}
            <div className="bg-gradient-to-b from-amber-500/20 to-black border-2 border-amber-500 p-8 rounded-2xl shadow-2xl shadow-amber-500/30 hover:scale-105 transition-transform">
              <div className="text-center mb-6">
                <div className="text-5xl mb-4">🏛️</div>
                <h3 className="text-3xl font-bold mb-2 text-amber-400">StarPath Vienna Residency</h3>
                <div className="text-white text-xl font-semibold mb-4">
                  12 Credits • 12 Weeks • $28,000
                </div>
              </div>
              
              <p className="text-gray-300 mb-6 text-center italic">The flagship European immersion</p>
              
              <ul className="space-y-3 text-gray-300 mb-8">
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">✓</span>
                  <span>German language + EU culture immersion</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">✓</span>
                  <span>Elite European training methodology</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">✓</span>
                  <span>Academic accelerator block</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">✓</span>
                  <span>Technical mechanics development</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">✓</span>
                  <span>Cultural experiences as curriculum</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">✓</span>
                  <span>Full Human Development Record™ portfolio</span>
                </li>
              </ul>
              
              <a href="#contact" className="block w-full bg-amber-500 hover:bg-amber-400 text-black text-center px-6 py-4 rounded-lg font-bold text-lg transition">
                Join Vienna Cohort
              </a>
            </div>

            {/* Online Accelerator */}
            <div className="bg-gradient-to-b from-white/10 to-black border-2 border-white p-8 rounded-2xl hover:scale-105 transition-transform">
              <div className="text-center mb-6">
                <div className="text-5xl mb-4">💻</div>
                <h3 className="text-3xl font-bold mb-2 text-white">StarPath Online Accelerator</h3>
                <div className="text-amber-400 text-xl font-semibold mb-4">
                  10 Credits • 12 Weeks • $15,000
                </div>
              </div>
              
              <p className="text-gray-300 mb-6 text-center italic">Academic semester through experiential learning</p>
              
              <ul className="space-y-3 text-gray-300 mb-8">
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">✓</span>
                  <span>Daily documentation & reflection</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">✓</span>
                  <span>Integrated training → academic conversion</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">✓</span>
                  <span>Book-based high-performance curriculum</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">✓</span>
                  <span>NCAA-recognized coursework</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">✓</span>
                  <span>Full HDR™ portfolio</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">✓</span>
                  <span>Train locally while earning credits</span>
                </li>
              </ul>
              
              <a href="#contact" className="block w-full bg-white hover:bg-gray-200 text-black text-center px-6 py-4 rounded-lg font-bold text-lg transition">
                Enroll Online
              </a>
            </div>

            {/* Day Program */}
            <div className="bg-gradient-to-b from-amber-500/10 to-black border-2 border-amber-500/50 p-8 rounded-2xl hover:scale-105 transition-transform">
              <div className="text-center mb-6">
                <div className="text-5xl mb-4">🌆</div>
                <h3 className="text-3xl font-bold mb-2 text-amber-400">StarPath Day Program</h3>
                <div className="text-white text-xl font-semibold mb-4">
                  Vienna Local Athletes
                </div>
              </div>
              
              <p className="text-gray-300 mb-6 text-center italic">On-site Vienna academic + athletic development</p>
              
              <ul className="space-y-3 text-gray-300 mb-8">
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">✓</span>
                  <span>12 credit on-site academic accelerator</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">✓</span>
                  <span>Daily training & mechanics</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">✓</span>
                  <span>Cultural immersion & language</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">✓</span>
                  <span>Experiential learning portfolio</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">✓</span>
                  <span>No housing cost (commuter program)</span>
                </li>
              </ul>
              
              <a href="#contact" className="block w-full bg-amber-500/20 hover:bg-amber-500/30 border-2 border-amber-500 text-white text-center px-6 py-4 rounded-lg font-bold text-lg transition">
                Join Day Program
              </a>
            </div>
          </div>
        </div>
      </section>
      {/* NCAA Assessment Section */}
      <section id="assessment" className="py-20 px-4 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto">
          <div className="text-amber-500 text-6xl mb-6 text-center">★</div>
          <h2 className="text-5xl font-bold text-center mb-6 text-white">NCAA Eligibility + Pathway Mapping</h2>
          <p className="text-xl text-center text-gray-400 mb-12 max-w-3xl mx-auto">
            Available to ALL families worldwide. Start with a comprehensive assessment.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-6xl mx-auto mb-12">
            <div className="bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/30 p-6 rounded-lg text-center">
              <div className="text-3xl mb-3">📋</div>
              <h4 className="font-bold text-white mb-2">NCAA Core Course Tracking</h4>
            </div>
            <div className="bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/30 p-6 rounded-lg text-center">
              <div className="text-3xl mb-3">🔍</div>
              <h4 className="font-bold text-white mb-2">Gap Analysis</h4>
            </div>
            <div className="bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/30 p-6 rounded-lg text-center">
              <div className="text-3xl mb-3">🎯</div>
              <h4 className="font-bold text-white mb-2">Athletic Path Recommendation</h4>
            </div>
            <div className="bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/30 p-6 rounded-lg text-center">
              <div className="text-3xl mb-3">✅</div>
              <h4 className="font-bold text-white mb-2">Academic Readiness Analysis</h4>
            </div>
            <div className="bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/30 p-6 rounded-lg text-center">
              <div className="text-3xl mb-3">📊</div>
              <h4 className="font-bold text-white mb-2">Full StarPath HDR™ Profile</h4>
            </div>
          </div>
          
          <div className="text-center">
            <a href="#contact" className="inline-block bg-amber-500 hover:bg-amber-400 text-black px-12 py-4 rounded-lg font-bold text-xl transition shadow-lg shadow-amber-500/50">
              Start Your StarPath Assessment ($397)
            </a>
          </div>
        </div>
      </section>

      {/* Curriculum Section */}
      <section id="curriculum" className="py-20 px-4 bg-black">
        <div className="container mx-auto">
          <div className="text-amber-500 text-6xl mb-6 text-center">★</div>
          <h2 className="text-5xl font-bold text-center mb-6 text-white">The StarPath Academic Accelerator Curriculum</h2>
          <p className="text-xl text-center text-gray-400 mb-16 max-w-4xl mx-auto">
            Living-Is-Learning™ experiential education where training, life, and culture become NCAA-recognized coursework
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
            <div className="bg-gradient-to-br from-amber-500/20 to-transparent border border-amber-500/40 p-8 rounded-xl">
              <h3 className="text-2xl font-bold mb-6 text-amber-400 text-center">Core Academics</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">→</span>
                  <span>ELA & Sports Literature</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">→</span>
                  <span>Writing & Communication</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">→</span>
                  <span>Global Studies</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">→</span>
                  <span>Analytics & Performance Science</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">→</span>
                  <span>World Language (German/English)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">→</span>
                  <span>Health & Recovery Science</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-white/10 to-transparent border border-white/30 p-8 rounded-xl">
              <h3 className="text-2xl font-bold mb-6 text-white text-center">Experiential Learning</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">→</span>
                  <span>Training documentation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">→</span>
                  <span>Biomechanics analysis</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">→</span>
                  <span>Nutrition + cultural food logs</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">→</span>
                  <span>Mental & emotional tracking</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">→</span>
                  <span>Cultural immersion tasks</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">→</span>
                  <span>Leadership + service</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">→</span>
                  <span>Technical skill timelines</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-amber-500/20 to-transparent border border-amber-500/40 p-8 rounded-xl">
              <h3 className="text-2xl font-bold mb-6 text-amber-400 text-center">HDR™ 6 Pillars</h3>
              <p className="text-gray-400 text-sm mb-4 text-center italic">Documented daily</p>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">1.</span>
                  <span>Mental & Emotional Development</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">2.</span>
                  <span>Physical Performance</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">3.</span>
                  <span>Nutrition & Recovery</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">4.</span>
                  <span>Technical Mechanics</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">5.</span>
                  <span>Cultural Immersion</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">6.</span>
                  <span>Global Scholar-Athlete Capstone</span>
                </li>
              </ul>
            </div>
          </div>
          
          {/* High-Performance Library */}
          <div className="bg-gradient-to-b from-amber-500/10 to-transparent border border-amber-500/30 rounded-2xl p-12 max-w-5xl mx-auto">
            <h3 className="text-3xl font-bold text-center mb-4 text-amber-400">The 20-Book High-Performance Library</h3>
            <p className="text-center text-gray-300 mb-8 text-lg">
              Curated reading series for grades 9-12: performance science, leadership, and global culture
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-gray-400 text-sm">
              <div>📚 Foundation Books</div>
              <div>🌍 Global Culture</div>
              <div>🏆 Performance Science</div>
              <div>👑 Leadership</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why StarPath Works */}
      <section className="py-20 px-4 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto">
          <div className="text-amber-500 text-6xl mb-6 text-center">★</div>
          <h2 className="text-5xl font-bold text-center mb-16 text-white">Why StarPath Works</h2>
          
          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="text-6xl font-bold text-amber-500 mb-4">12</div>
              <h3 className="text-2xl font-bold mb-4 text-white">Credits in 12 Weeks</h3>
              <p className="text-gray-300 text-lg">
                Fastest path to graduation + NCAA readiness. Accelerate your timeline without sacrificing quality.
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-6xl font-bold text-amber-500 mb-4">🎓</div>
              <h3 className="text-2xl font-bold mb-4 text-white">College & Global Ready</h3>
              <p className="text-gray-300 text-lg">
                Academic rigor equal to elite private schools + global competencies that set you apart.
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-6xl font-bold text-amber-500 mb-4">📊</div>
              <h3 className="text-2xl font-bold mb-4 text-white">Portfolio That Changes Futures</h3>
              <p className="text-gray-300 text-lg">
                Athletic, academic & cultural development documented daily. Evidence colleges can't ignore.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Next Cohort Section */}
      <section id="parent-night" className="py-20 px-4 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto text-center">
          <div className="text-amber-500 text-6xl mb-6">★</div>
          <h2 className="text-5xl font-bold mb-4 text-white">Next Cohort Begins: January 15</h2>
          <p className="text-2xl text-amber-400 mb-12">Limited spaces for Vienna Residency + Online Accelerator</p>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
            <div className="bg-gradient-to-br from-amber-500/20 to-transparent border border-amber-500/40 p-8 rounded-xl">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-3 text-amber-400">Priority Acceptance</h3>
              <p className="text-gray-300">For Parent Night attendees</p>
            </div>
            <div className="bg-gradient-to-br from-amber-500/20 to-transparent border border-amber-500/40 p-8 rounded-xl">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-bold mb-3 text-amber-400">Scholarships Available</h3>
              <p className="text-gray-300">Merit & need-based financial aid</p>
            </div>
            <div className="bg-gradient-to-br from-amber-500/20 to-transparent border border-amber-500/40 p-8 rounded-xl">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold mb-3 text-amber-400">Immediate Credit Acceleration</h3>
              <p className="text-gray-300">Start earning credits on enrollment</p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            <a href="#contact" className="bg-amber-500 hover:bg-amber-400 text-black px-12 py-4 rounded-lg font-bold text-xl transition shadow-lg shadow-amber-500/50">
              Apply Now
            </a>
            <a href="#contact" className="bg-white/10 hover:bg-white/20 border-2 border-white px-12 py-4 rounded-lg font-bold text-xl text-white transition">
              Attend Parent Night (Tue/Thu)
            </a>
            <a href="#assessment" className="border-2 border-amber-500 hover:bg-amber-500/20 px-12 py-4 rounded-lg font-bold text-xl text-white transition">
              Start Assessment
            </a>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 bg-black">
        <div className="container mx-auto">
          <div className="text-amber-500 text-6xl mb-6 text-center">★</div>
          <h2 className="text-5xl font-bold text-center mb-12 text-white">Get Started Today</h2>
          
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-amber-500/10 to-transparent border-2 border-amber-500/50 rounded-2xl p-12">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-bold mb-4 text-amber-400">📧 StarPath Admissions</h3>
                <a href="mailto:pathways@starpathleague.org" className="text-white hover:text-amber-400 transition text-lg">
                  pathways@starpathleague.org
                </a>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4 text-amber-400">📧 Academy Office</h3>
                <a href="mailto:invest@go4itsports.org" className="text-white hover:text-amber-400 transition text-lg">
                  invest@go4itsports.org
                </a>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 mb-10">
              <div>
                <h3 className="text-xl font-bold mb-4 text-amber-400">📞 USA Headquarters</h3>
                <a href="tel:+13039704655" className="text-white hover:text-amber-400 transition text-2xl font-semibold">
                  +1-303-970-4655
                </a>
                <p className="text-gray-400 mt-2">Mountain Standard Time (MST)</p>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4 text-amber-400">📞 Austria/Europe</h3>
                <a href="tel:+436505644236" className="text-white hover:text-amber-400 transition text-2xl font-semibold">
                  +43 650 564 4236
                </a>
                <p className="text-gray-400 mt-2">Central European Time (CET)</p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <a href="mailto:pathways@starpathleague.org" className="bg-amber-500 hover:bg-amber-400 text-black text-center px-10 py-4 rounded-lg font-bold text-lg transition">
                Speak With Admissions
              </a>
              <a href="/pdfs/starpath-academy" className="border-2 border-amber-500 hover:bg-amber-500/20 text-white text-center px-10 py-4 rounded-lg font-bold text-lg transition">
                Download Program Overview (PDF)
              </a>
            </div>
          </div>
          
          <div className="mt-12 text-center text-gray-400">
            <p className="text-lg">
              <span className="text-amber-400 font-semibold">Global Locations:</span> Denver, Colorado (HQ) • Vienna, Austria (Residency) • Dallas, Texas • Mérida, Mexico
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-amber-500/30 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-amber-400 mb-4">Programs</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#programs" className="hover:text-amber-400 transition">Vienna Residency</a></li>
                <li><a href="#programs" className="hover:text-amber-400 transition">Online Accelerator</a></li>
                <li><a href="#programs" className="hover:text-amber-400 transition">Day Program</a></li>
                <li><a href="#assessment" className="hover:text-amber-400 transition">StarPath Assessment</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-amber-400 mb-4">Academics</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#curriculum" className="hover:text-amber-400 transition">Curriculum</a></li>
                <li><a href="#curriculum" className="hover:text-amber-400 transition">20-Book Library</a></li>
                <li><a href="#curriculum" className="hover:text-amber-400 transition">HDR™ System</a></li>
                <li><a href="#assessment" className="hover:text-amber-400 transition">NCAA Tracking</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-amber-400 mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#parent-night" className="hover:text-amber-400 transition">Parent Night</a></li>
                <li><a href="/pdfs" className="hover:text-amber-400 transition">Download PDFs</a></li>
                <li><a href="#contact" className="hover:text-amber-400 transition">Apply Now</a></li>
                <li><a href="#contact" className="hover:text-amber-400 transition">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-amber-400 mb-4">Connect</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Denver, Colorado</li>
                <li>Vienna, Austria</li>
                <li>Dallas, Texas</li>
                <li>Mérida, Mexico</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-amber-500/30 pt-8 text-center">
            <p className="text-gray-400 mb-2">© 2025 Go4it Sports Academy™ • StarPath Accelerator™</p>
            <p className="text-2xl font-bold text-amber-500 italic">Train Here. Learn Everywhere. Graduate Globally Competitive.™</p>
            <p className="text-sm text-gray-500 mt-4">
              NCAA-recognized • Globally accredited • Living-Is-Learning™ experiential education
            </p>
          </div>
        </div>
      </footer>

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  );
}