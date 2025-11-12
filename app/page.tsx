"use client";

import Link from "next/link";
import { useState } from "react";
import ChatWidget from "./components/ChatWidget";

export default function SimpleLandingPage() {
  const [activeFeature, setActiveFeature] = useState("gap-year");
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Simple Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="Go4it" className="h-10 w-10" />
              <span className="text-2xl font-bold">Go4it Academy</span>
            </div>
            <div className="flex gap-6">
              <a href="#features" className="hover:text-blue-400">Features</a>
              <a href="#gap-year" className="hover:text-blue-400">Gap Year</a>
              <a href="#testimonials" className="hover:text-blue-400">Testimonials</a>
              <a href="#contact" className="hover:text-blue-400">Contact</a>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-blue-900/20 to-gray-900">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">
            Your All-in-One Platform to Play at the Next Level
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Go4it Sports Academy: Online School + AI Coaching + NCAA Tracker + Get Verified Combines. 
            Everything elite student-athletes need in one place.
          </p>
          <div className="flex gap-4 justify-center">
            <button className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-semibold">
              Get Started
            </button>
            <button className="border border-blue-600 hover:bg-blue-600/20 px-8 py-3 rounded-lg font-semibold">
              View Demo
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Core Features</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3 text-blue-400">GAR™ Analytics</h3>
              <p className="text-gray-300">
                AI-powered video analysis for athletic performance. Get professional-grade 
                biomechanical analysis and scoring.
              </p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3 text-blue-400">StarPath System</h3>
              <p className="text-gray-300">
                Gamified skill progression tracking. Monitor your development path 
                from high school to college athletics.
              </p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3 text-blue-400">NCAA Recruitment</h3>
              <p className="text-gray-300">
                Advanced recruitment automation with AI-powered prospect analysis 
                and multi-channel outreach.
              </p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3 text-blue-400">Academic Tracking</h3>
              <p className="text-gray-300">
                Complete K-12 educational system with NCAA eligibility monitoring 
                and course management.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gap Year Program Section */}
      <section id="gap-year" className="py-20 px-4 bg-gray-800">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">Gap Year NCAA Pathway</h2>
          <p className="text-center text-xl text-blue-400 mb-12">
            $999.95/month • Live Training • D1 Statistics
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-900 p-6 rounded-lg">
              <h3 className="text-2xl font-bold mb-4 text-green-400">Foundation Phase</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Daily training sessions</li>
                <li>• Video analysis setup</li>
                <li>• Baseline performance metrics</li>
                <li>• NCAA eligibility planning</li>
              </ul>
            </div>
            
            <div className="bg-gray-900 p-6 rounded-lg">
              <h3 className="text-2xl font-bold mb-4 text-yellow-400">Development Phase</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Advanced skill training</li>
                <li>• College scout preparation</li>
                <li>• Recruitment profile building</li>
                <li>• Competition readiness</li>
              </ul>
            </div>
            
            <div className="bg-gray-900 p-6 rounded-lg">
              <h3 className="text-2xl font-bold mb-4 text-red-400">Elite Phase</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• D1-level performance training</li>
                <li>• Direct college connections</li>
                <li>• Scholarship negotiations</li>
                <li>• NFL pathway preparation</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-2xl font-bold mb-4">Success Metrics</p>
            <div className="flex justify-center gap-12">
              <div>
                <p className="text-4xl font-bold text-blue-400">40%</p>
                <p className="text-gray-400">Higher Response Rate</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-blue-400">91%</p>
                <p className="text-gray-400">Cost Reduction</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-blue-400">1000+</p>
                <p className="text-gray-400">Daily Prospects</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Success Stories</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-gray-800 p-6 rounded-lg">
              <p className="text-gray-300 mb-4">
                "The GAR system transformed my son's game. College scouts now have 
                verified data they can trust."
              </p>
              <p className="font-bold">- Sarah M., Parent</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <p className="text-gray-300 mb-4">
                "From high school to D1 scholarship - Go4it's pathway system made 
                it possible."
              </p>
              <p className="font-bold">- Marcus T., Athlete</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 bg-gray-800">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">Get Started Today</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join elite athletes using Go4it to reach the next level
          </p>
          <div className="flex flex-col items-center gap-4">
            <div className="text-gray-300">
              <p>USA: <a href="tel:+13039704655" className="hover:text-blue-400">+1-303-970-4655</a> | EU: <a href="tel:+436505644236" className="hover:text-blue-400">+43 650 564 4236</a></p>
              <p><a href="mailto:info@go4itsports.org" className="hover:text-blue-400">info@go4itsports.org</a></p>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 px-12 py-4 rounded-lg font-semibold text-lg">
              Start Your Journey
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-8">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>© 2025 Go4it Sports Academy • Denver • Vienna • Dallas • Mérida</p>
          <p className="mt-2">Train Here. Place Anywhere.™</p>
        </div>
      </footer>

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  );
}