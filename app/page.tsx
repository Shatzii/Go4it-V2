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
      <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-sm neon-border border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="text-2xl font-bold glow-text">Go4it Academy</div>
              <div className="text-sm glow-text-green">StarPath Accelerator™</div>
            </div>
            <div className="hidden lg:flex gap-6 items-center">
              <a href="#programs" className="hover:text-cyan-400 transition">Programs</a>
              <a href="#assessment" className="hover:text-cyan-400 transition">Assessment</a>
              <a href="#vienna" className="hover:text-cyan-400 transition">Vienna</a>
              <a href="#parent-night" className="hover:text-cyan-400 transition">Parent Night</a>
              <a className="hover:text-cyan-400 transition" href="/dashboard">Dashboard</a>
              <a className="btn-blueglow" href="/login">Login</a>
            </div>
            <button className="lg:hidden text-cyan-400">☰</button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 hero-bg">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-sm uppercase tracking-widest mb-4 text-gray-400">Go4it Academy · StarPath Accelerator™</div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Where Living Becomes Learning for <span className="glow-text">Serious Student-Athletes</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                A global academic-athletic accelerator helping 9th–12th graders and gap-year athletes earn up to
                <span className="glow-text-green font-bold"> 28.5 U.S. credits in 12 months</span> through our Living-Is-Learning system, Vienna + Dallas residencies, and online StarPath Accelerator program.
              </p>
              <div className="grid grid-cols-2 gap-3 mb-8 text-sm">
                <div className="card-blueglow p-3 text-center">
                  <div className="glow-text font-bold">12 Credits in 12 Weeks</div>
                  <div className="text-gray-400 text-xs">Vienna Residency</div>
                </div>
                <div className="card-blueglow p-3 text-center">
                  <div className="glow-text-green font-bold">16.5 Credits in 12 Weeks</div>
                  <div className="text-gray-400 text-xs">Dallas Residency</div>
                </div>
                <div className="card-blueglow p-3 text-center">
                  <div className="glow-text font-bold">12 Credits in 12 Weeks</div>
                  <div className="text-gray-400 text-xs">StarPath Accelerator</div>
                </div>
                <div className="card-blueglow p-3 text-center">
                  <div className="glow-text-green font-bold">28.5 Total Credits</div>
                  <div className="text-gray-400 text-xs">Full Program</div>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <a href="#programs" className="btn-blueglow text-center">
                  Apply Now · Start Your Journey
                </a>
                <div className="text-sm text-gray-400 text-center">
                  Parent Q&amp;A Night → Tue/Thu at 7PM CT
                </div>
                <div className="flex gap-4">
                  <a href="#assessment" className="btn-blueglow-outline flex-1 text-center">
                    Start Assessment
                  </a>
            </div>
            
            <div className="bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/30 p-8 rounded-lg">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-3 text-amber-400">College Recruiting Portfolio</h3>
                  <a href="#call" className="btn-blueglow-outline flex-1 text-center">
                    Book a Call
                  </a>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="card-blueglow p-8 text-center">
                <div className="text-4xl mb-4">🎓</div>
                <div className="text-2xl font-bold mb-2 glow-text">NCAA-Recognized Credits</div>
                <p className="text-gray-400">Full transcripts accepted by colleges nationwide</p>
              </div>
              <div className="card-blueglow p-8 text-center">
                <div className="text-4xl mb-4">🌍</div>
                <div className="text-2xl font-bold mb-2 glow-text-green">Vienna + Dallas Residencies</div>
                <p className="text-gray-400">12-week immersive programs in Europe and Texas</p>
              </div>
              <div className="card-blueglow p-8 text-center">
                <div className="text-4xl mb-4">💻</div>
                <div className="text-2xl font-bold mb-2 glow-text">StarPath Online</div>
                <p className="text-gray-400">Train anywhere while earning accredited credits</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section id="programs" className="py-20 px-4 bg-gray-900/50">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">
            <span className="glow-text">Three Pathways</span> to Academic Excellence
          </h2>
          <p className="text-center text-gray-400 mb-12 max-w-3xl mx-auto">
            Choose the program that fits your goals — all recognized by NCAA and colleges worldwide
          </p>
          
          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Vienna Residency */}
            <div className="card-blueglow p-8 hover:scale-105 transition-transform">
              <div className="text-center mb-6">
                <div className="text-5xl mb-4">🏛️</div>
                <h3 className="text-2xl font-bold mb-2 glow-text">Vienna Residency</h3>
                <div className="text-xl font-semibold mb-2 glow-text-green">
                  12 Credits in 12 Weeks
                </div>
                <div className="text-gray-400 text-sm">$28,000 All-Inclusive</div>
              </div>
              
              <ul className="space-y-3 text-gray-300 mb-8">
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400">✓</span>
                  <span>German language immersion</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400">✓</span>
                  <span>European training methodology</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400">✓</span>
                  <span>Cultural experiences as credit</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400">✓</span>
                  <span>Technical development</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400">✓</span>
                  <span>Full HDR™ portfolio</span>
                </li>
              </ul>
              
              <a href="#contact" className="btn-blueglow w-full text-center block">
                Join Vienna Cohort
              </a>
            </div>

            {/* Dallas Residency */}
            <div className="card-blueglow p-8 hover:scale-105 transition-transform border-2 border-cyan-400">
              <div className="text-center mb-6">
                <div className="text-5xl mb-4">🏈</div>
                <h3 className="text-2xl font-bold mb-2 glow-text">Dallas Residency</h3>
                <div className="text-xl font-semibold mb-2 glow-text-green">
                  16.5 Credits in 12 Weeks
                </div>
                <div className="text-gray-400 text-sm">$32,000 All-Inclusive</div>
              </div>
              
              <ul className="space-y-3 text-gray-300 mb-8">
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400">✓</span>
                  <span>Maximum credit acceleration</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400">✓</span>
                  <span>Elite training facilities</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400">✓</span>
                  <span>NCAA preparation focus</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400">✓</span>
                  <span>Performance testing</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400">✓</span>
                  <span>Full HDR™ portfolio</span>
                </li>
              </ul>
              
              <a href="#contact" className="btn-blueglow w-full text-center block">
                Join Dallas Cohort
              </a>
            </div>

            {/* Online Accelerator */}
            <div className="card-blueglow p-8 hover:scale-105 transition-transform">
              <div className="text-center mb-6">
                <div className="text-5xl mb-4">💻</div>
                <h3 className="text-2xl font-bold mb-2 glow-text">StarPath Online</h3>
                <div className="text-xl font-semibold mb-2 glow-text-green">
                  12 Credits in 12 Weeks
                </div>
                <div className="text-gray-400 text-sm">$15,000</div>
              </div>
              
              <ul className="space-y-3 text-gray-300 mb-8">
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400">✓</span>
                  <span>Train at your home facility</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400">✓</span>
                  <span>Living-Is-Learning system</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400">✓</span>
                  <span>Daily documentation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400">✓</span>
                  <span>NCAA-recognized courses</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400">✓</span>
                  <span>Full HDR™ portfolio</span>
                </li>
              </ul>
              
              <a href="#contact" className="btn-blueglow w-full text-center block">
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
              
          </div>
        </div>
      </section>

      {/* Assessment Section */}
      <section id="assessment" className="py-20 px-4 bg-black">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            <span className="glow-text">NCAA Eligibility</span> Assessment
          </h2>
          <p className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto">
            Start with a comprehensive evaluation of your academic standing and NCAA pathway
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
            <div className="card-blueglow p-6 text-center">
              <div className="text-3xl mb-3">📋</div>
              <h4 className="font-bold mb-2 glow-text">Core Course Tracking</h4>
              <p className="text-gray-400 text-sm">16 NCAA core courses validated</p>
            </div>
            <div className="card-blueglow p-6 text-center">
              <div className="text-3xl mb-3">🎯</div>
              <h4 className="font-bold mb-2 glow-text-green">Gap Analysis</h4>
              <p className="text-gray-400 text-sm">Identify credit deficiencies</p>
            </div>
            <div className="card-blueglow p-6 text-center">
              <div className="text-3xl mb-3">📊</div>
              <h4 className="font-bold mb-2 glow-text">Full HDR™ Profile</h4>
              <p className="text-gray-400 text-sm">6-pillar development analysis</p>
            </div>
          </div>
          
          <a href="/assessment" className="btn-blueglow inline-block">
            Start Assessment ($397)
          </a>
        </div>
      </section>

      {/* Parent Night Section */}
      <section id="parent-night" className="py-20 px-4 bg-gray-900/50">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div>
              <div className="text-sm uppercase tracking-widest mb-4 text-cyan-400">Free Q&A Sessions</div>
              <h2 className="text-4xl font-bold mb-6">
                <span className="glow-text">Parent Night</span> · Every Tuesday &amp; Thursday
              </h2>
              <p className="text-xl text-gray-300 mb-6 leading-relaxed">
                Join live video sessions with our academic advisors to learn how StarPath Accelerator can help your student-athlete earn NCAA credits faster.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <span className="text-cyan-400 text-2xl">⏰</span>
                  <div>
                    <div className="font-bold">Tuesday &amp; Thursday at 7:00 PM CT</div>
                    <div className="text-gray-400 text-sm">45-minute live sessions</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-cyan-400 text-2xl">💬</span>
                  <div>
                    <div className="font-bold">Ask Questions Live</div>
                    <div className="text-gray-400 text-sm">Get immediate answers from our team</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-cyan-400 text-2xl">🎓</span>
                  <div>
                    <div className="font-bold">Learn About NCAA Pathways</div>
                    <div className="text-gray-400 text-sm">Understand credit transfer and eligibility</div>
                  </div>
                </div>
              </div>
              
              <a href="#contact" className="btn-blueglow inline-block">
                Reserve Your Spot
              </a>
            </div>
            
            <div className="card-blueglow p-8">
              <h3 className="text-2xl font-bold mb-6 text-center glow-text">What Parents Ask</h3>
              <div className="space-y-4">
                <div>
                  <div className="font-bold mb-2 text-cyan-400">How do credits transfer?</div>
                  <p className="text-gray-400 text-sm">All credits are NCAA-recognized and transfer to colleges nationwide through official transcripts.</p>
                </div>
                <div>
                  <div className="font-bold mb-2 text-cyan-400">What's the time commitment?</div>
                  <p className="text-gray-400 text-sm">12 weeks full-time for residencies, or flexible scheduling for online programs.</p>
                </div>
                <div>
                  <div className="font-bold mb-2 text-cyan-400">Can my child train during the program?</div>
                  <p className="text-gray-400 text-sm">Yes! Training IS the curriculum. We convert athletic development into academic credit.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vienna Section */}
      <section id="vienna" className="py-20 px-4 bg-black">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <div className="text-6xl mb-4">🏛️</div>
            <h2 className="text-4xl font-bold mb-4">
              <span className="glow-text">Vienna Residency</span> · Europe's Elite Program
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              12-week immersive experience combining German language, European training methodology, and full academic acceleration
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <div className="card-blueglow p-8">
              <h3 className="text-2xl font-bold mb-6 glow-text-green">Program Highlights</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="text-cyan-400 text-xl">✓</span>
                  <div>
                    <div className="font-bold">12 NCAA Credits</div>
                    <div className="text-gray-400 text-sm">Full semester equivalent in 12 weeks</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-cyan-400 text-xl">✓</span>
                  <div>
                    <div className="font-bold">German Language Immersion</div>
                    <div className="text-gray-400 text-sm">Daily language instruction and cultural integration</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-cyan-400 text-xl">✓</span>
                  <div>
                    <div className="font-bold">European Training Systems</div>
                    <div className="text-gray-400 text-sm">World-class coaching and technical development</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-cyan-400 text-xl">✓</span>
                  <div>
                    <div className="font-bold">Cultural Experiences as Credit</div>
                    <div className="text-gray-400 text-sm">Museums, history, art become coursework</div>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="card-blueglow p-8">
              <h3 className="text-2xl font-bold mb-6 glow-text-green">Investment</h3>
              <div className="text-4xl font-bold mb-4 glow-text">$28,000</div>
              <div className="text-gray-400 mb-6">All-inclusive 12-week program</div>
              
              <div className="space-y-3 text-sm mb-8">
                <div className="flex justify-between border-b border-gray-700 pb-2">
                  <span className="text-gray-400">12 NCAA Credits</span>
                  <span className="font-bold">Included</span>
                </div>
                <div className="flex justify-between border-b border-gray-700 pb-2">
                  <span className="text-gray-400">Housing &amp; Meals</span>
                  <span className="font-bold">Included</span>
                </div>
                <div className="flex justify-between border-b border-gray-700 pb-2">
                  <span className="text-gray-400">Training Facilities</span>
                  <span className="font-bold">Included</span>
                </div>
                <div className="flex justify-between border-b border-gray-700 pb-2">
                  <span className="text-gray-400">Cultural Excursions</span>
                  <span className="font-bold">Included</span>
                </div>
              </div>
              
              <a href="#contact" className="btn-blueglow w-full text-center block">
                Apply to Vienna Cohort
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact/CTA Section */}
      <section id="contact" className="py-20 px-4 bg-gray-900/50">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to <span className="glow-text">Accelerate</span> Your Future?
          </h2>
          <p className="text-xl text-gray-400 mb-12">
            Join hundreds of student-athletes earning NCAA credits through our Living-Is-Learning system
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <a href="/assessment" className="card-blueglow p-8 hover:scale-105 transition-transform">
              <div className="text-4xl mb-4">📋</div>
              <div className="font-bold text-xl mb-2 glow-text">Start Assessment</div>
              <p className="text-gray-400 text-sm">Evaluate your NCAA readiness</p>
            </a>
            <a href="#parent-night" className="card-blueglow p-8 hover:scale-105 transition-transform">
              <div className="text-4xl mb-4">💬</div>
              <div className="font-bold text-xl mb-2 glow-text-green">Join Parent Night</div>
              <p className="text-gray-400 text-sm">Tue/Thu at 7PM CT</p>
            </a>
            <a href="/login" className="card-blueglow p-8 hover:scale-105 transition-transform">
              <div className="text-4xl mb-4">🚀</div>
              <div className="font-bold text-xl mb-2 glow-text">Apply Now</div>
              <p className="text-gray-400 text-sm">Start your StarPath journey</p>
            </a>
          </div>
          
          <div className="card-blueglow p-8 max-w-2xl mx-auto">
            <div className="text-sm uppercase tracking-widest mb-4 text-cyan-400">Contact Us</div>
            <div className="space-y-3">
              <div>
                <a href="mailto:info@go4itsports.org" className="text-xl font-bold glow-text hover:text-cyan-300">
                  info@go4itsports.org
                </a>
              </div>
              <div className="text-gray-400">
                Questions? We're here to help you navigate your academic-athletic pathway.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-black neon-border border-t">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="font-bold text-xl mb-4 glow-text">Go4it Academy</div>
              <p className="text-gray-400 text-sm">StarPath Accelerator™ · Where Living Becomes Learning</p>
            </div>
            <div>
              <div className="font-bold mb-4">Programs</div>
              <div className="space-y-2 text-gray-400 text-sm">
                <div><a href="#vienna" className="hover:text-cyan-400">Vienna Residency</a></div>
                <div><a href="#programs" className="hover:text-cyan-400">Dallas Residency</a></div>
                <div><a href="#programs" className="hover:text-cyan-400">StarPath Online</a></div>
              </div>
            </div>
            <div>
              <div className="font-bold mb-4">Resources</div>
              <div className="space-y-2 text-gray-400 text-sm">
                <div><a href="#assessment" className="hover:text-cyan-400">NCAA Assessment</a></div>
                <div><a href="#parent-night" className="hover:text-cyan-400">Parent Night</a></div>
                <div><a href="/dashboard" className="hover:text-cyan-400">Student Dashboard</a></div>
              </div>
            </div>
            <div>
              <div className="font-bold mb-4">Connect</div>
              <div className="space-y-2 text-gray-400 text-sm">
                <div><a href="mailto:info@go4itsports.org" className="hover:text-cyan-400">Email Us</a></div>
                <div><a href="/login" className="hover:text-cyan-400">Login</a></div>
              </div>
            </div>
          </div>
          <div className="text-center text-gray-500 text-sm border-t border-gray-800 pt-8">
            © {new Date().getFullYear()} Go4it Sports Academy. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  );
}