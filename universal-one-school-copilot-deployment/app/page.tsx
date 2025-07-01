import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-8">Universal One School Platform</h1>
      <p className="text-xl mb-8">AI-Powered Educational Platform</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Link href="/schools/primary-school" className="bg-blue-600 hover:bg-blue-700 p-6 rounded-lg transition-colors">
          <h3 className="text-xl font-bold mb-2">SuperHero School</h3>
          <p>Grades K-6 with gamified learning</p>
        </Link>
        
        <Link href="/schools/secondary-school" className="bg-purple-600 hover:bg-purple-700 p-6 rounded-lg transition-colors">
          <h3 className="text-xl font-bold mb-2">Stage Prep School</h3>
          <p>Grades 7-12 theater arts focus</p>
        </Link>
        
        <Link href="/schools/law-school" className="bg-green-600 hover:bg-green-700 p-6 rounded-lg transition-colors">
          <h3 className="text-xl font-bold mb-2">Law School</h3>
          <p>Professional legal education</p>
        </Link>
        
        <Link href="/schools/language-academy" className="bg-orange-600 hover:bg-orange-700 p-6 rounded-lg transition-colors">
          <h3 className="text-xl font-bold mb-2">Language Academy</h3>
          <p>Global multilingual learning</p>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/marketplace" className="bg-indigo-600 hover:bg-indigo-700 p-6 rounded-lg transition-colors">
          <h3 className="text-xl font-bold mb-2">Course Marketplace</h3>
          <p>Browse 847+ educational courses</p>
        </Link>
        
        <Link href="/creator-dashboard" className="bg-pink-600 hover:bg-pink-700 p-6 rounded-lg transition-colors">
          <h3 className="text-xl font-bold mb-2">Creator Hub</h3>
          <p>Create and sell courses</p>
        </Link>
        
        <Link href="/admin/ide" className="bg-cyan-600 hover:bg-cyan-700 p-6 rounded-lg transition-colors">
          <h3 className="text-xl font-bold mb-2">Development IDE</h3>
          <p>Content creation tools</p>
        </Link>
      </div>
      
      {/* Header */}
      <header className="relative z-10 bg-black/20 backdrop-blur-sm mt-12">
        <div className="container mx-auto px-4 py-6">
          <nav className="flex justify-between items-center">
            <div className="text-white font-bold text-2xl">
              The Universal One School
            </div>
            <div className="hidden md:flex space-x-6">
              <Link href="#schools" className="text-white hover:text-blue-300 transition-colors">
                Schools
              </Link>
              <Link href="/marketplace" className="text-white hover:text-blue-300 transition-colors">
                Course Marketplace
              </Link>
              <Link href="/creator-dashboard" className="text-white hover:text-blue-300 transition-colors">
                Creator Hub
              </Link>
              <Link href="#approach" className="text-white hover:text-blue-300 transition-colors">
                Our Approach
              </Link>
              <Link href="/texas-charter-compliance" className="text-white hover:text-blue-300 transition-colors">
                Texas Charter
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Where Every Mind
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Learns Differently
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
            Advanced AI-powered educational platform specializing in inclusive digital learning 
            infrastructure for neurodivergent learners.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/demo" 
              className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              Try AI Instructors Demo
            </Link>
            <Link 
              href="/texas-charter-compliance" 
              className="bg-gradient-to-r from-blue-800 to-red-800 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              Texas Charter School
            </Link>
          </div>
        </div>
      </section>

      {/* Schools Section */}
      <section id="schools" className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-16">
            Choose Your Learning Journey
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* SuperHero School */}
            <div className="school-card card-visible">
              <div className="text-center mb-4">
                <div className="w-20 h-20 mx-auto bg-red-500 rounded-full flex items-center justify-center text-3xl text-white mb-4">
                  🦸
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">SuperHero School</h3>
                <p className="text-white/80 mb-4">K-6 Elementary with superhero themes and ADHD support</p>
                <div className="flex flex-wrap gap-2 justify-center mb-4">
                  <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm">🎮 Gamification</span>
                  <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm">🧠 ADHD Support</span>
                  <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm">🎯 Visual Learning</span>
                </div>
                <Link 
                  href="/schools/primary-school" 
                  className="inline-block bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600 transition-colors"
                >
                  Enter SuperHero School
                </Link>
              </div>
            </div>

            {/* S.T.A.G.E Prep */}
            <div className="school-card card-visible">
              <div className="text-center mb-4">
                <div className="w-20 h-20 mx-auto bg-blue-500 rounded-full flex items-center justify-center text-3xl text-white mb-4">
                  🎓
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">S.T.A.G.E Prep</h3>
                <p className="text-white/80 mb-4">Grades 7-12 with executive function support</p>
                <div className="flex flex-wrap gap-2 justify-center mb-4">
                  <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm">📚 Advanced Prep</span>
                  <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm">🎯 Executive Function</span>
                  <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm">🔬 STEM Focus</span>
                </div>
                <Link 
                  href="/schools/secondary-school" 
                  className="inline-block bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-colors"
                >
                  Enter S.T.A.G.E Prep
                </Link>
              </div>
            </div>

            {/* Law School */}
            <div className="school-card card-visible">
              <div className="text-center mb-4">
                <div className="w-20 h-20 mx-auto bg-yellow-600 rounded-full flex items-center justify-center text-3xl text-white mb-4">
                  ⚖️
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Law School</h3>
                <p className="text-white/80 mb-4">College-level legal education with AI Professor Barrett</p>
                <div className="flex flex-wrap gap-2 justify-center mb-4">
                  <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm">📖 Case Studies</span>
                  <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm">🎯 Simulations</span>
                  <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm">✍️ Legal Writing</span>
                </div>
                <Link 
                  href="/schools/law-school" 
                  className="inline-block bg-yellow-600 text-white px-6 py-2 rounded-full hover:bg-yellow-700 transition-colors"
                >
                  Enter Law School
                </Link>
              </div>
            </div>

            {/* Language School */}
            <div className="school-card card-visible">
              <div className="text-center mb-4">
                <div className="w-20 h-20 mx-auto bg-green-500 rounded-full flex items-center justify-center text-3xl text-white mb-4">
                  🌍
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">LIOTA</h3>
                <p className="text-white/80 mb-4">Language School Of The Americas - multilingual education</p>
                <div className="flex flex-wrap gap-2 justify-center mb-4">
                  <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm">🎉 Celebration</span>
                  <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm">🌍 Cultural Context</span>
                  <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm">🤝 Community</span>
                </div>
                <Link 
                  href="/schools/language-school" 
                  className="inline-block bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition-colors"
                >
                  Enter LIOTA
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Advanced AI Features */}
      <section className="py-16 px-4 bg-gradient-to-r from-purple-900/50 to-blue-900/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">Advanced AI Learning Platform</h3>
            <p className="text-white/80 mb-8 max-w-3xl mx-auto">
              Experience cutting-edge artificial intelligence designed specifically for neurodivergent learners. Our AI adapts to your unique learning style and provides personalized support.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/ai-tutor" className="group">
              <div className="feature-card card-visible">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto bg-purple-500 rounded-full flex items-center justify-center text-2xl text-white mb-4 group-hover:scale-110 transition-transform">
                    🤖
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">AI Personal Tutor</h4>
                  <p className="text-white/70 text-sm mb-4">One-on-one AI tutoring that adapts to your learning style and neurodivergent needs</p>
                  <div className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-xs">
                    Personalized Learning
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/ai-analytics" className="group">
              <div className="feature-card card-visible">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto bg-emerald-500 rounded-full flex items-center justify-center text-2xl text-white mb-4 group-hover:scale-110 transition-transform">
                    📊
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">Learning Analytics</h4>
                  <p className="text-white/70 text-sm mb-4">AI-powered insights into your learning patterns, strengths, and growth opportunities</p>
                  <div className="bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-xs">
                    Progress Tracking
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/virtual-classroom" className="group">
              <div className="feature-card card-visible">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto bg-blue-500 rounded-full flex items-center justify-center text-2xl text-white mb-4 group-hover:scale-110 transition-transform">
                    🏫
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">Virtual Classroom</h4>
                  <p className="text-white/70 text-sm mb-4">Join live AI-enhanced classes with neurodivergent-focused teaching methods</p>
                  <div className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-xs">
                    Live Sessions
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/study-buddy" className="group">
              <div className="feature-card card-visible">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto bg-pink-500 rounded-full flex items-center justify-center text-2xl text-white mb-4 group-hover:scale-110 transition-transform">
                    📚
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">AI Study Buddy</h4>
                  <p className="text-white/70 text-sm mb-4">Personalized study planning with AI-powered focus tracking and break management</p>
                  <div className="bg-pink-500/20 text-pink-300 px-3 py-1 rounded-full text-xs">
                    Study Planning
                  </div>
                </div>
              </div>
            </Link>
          </div>

          <div className="text-center mt-8">
            <p className="text-white/60 text-sm">All AI features include specialized support for ADHD, Dyslexia, and Autism</p>
          </div>
        </div>
      </section>

      {/* Curriculum Management Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-green-900/50 to-emerald-900/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">Texas K-12 Curriculum System</h3>
            <p className="text-white/80 mb-8 max-w-3xl mx-auto">
              Comprehensive curriculum creation, management, and compliance monitoring system for Texas Education Code requirements
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/curriculum-generator" className="group">
              <div className="feature-card card-visible">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto bg-green-500 rounded-full flex items-center justify-center text-2xl text-white mb-4 group-hover:scale-110 transition-transform">
                    🧠
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">Curriculum Generator</h4>
                  <p className="text-white/70 text-sm mb-4">AI-powered curriculum creation with Texas Education Code compliance and neurodivergent accommodations</p>
                  <div className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-xs">
                    AI Creation
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/curriculum-library" className="group">
              <div className="feature-card card-visible">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto bg-blue-500 rounded-full flex items-center justify-center text-2xl text-white mb-4 group-hover:scale-110 transition-transform">
                    📚
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">Curriculum Library</h4>
                  <p className="text-white/70 text-sm mb-4">Comprehensive K-12 curriculum collection with TEC verification, STAAR alignment, and accessibility features</p>
                  <div className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-xs">
                    K-12 Library
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/compliance-center" className="group">
              <div className="feature-card card-visible">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto bg-red-500 rounded-full flex items-center justify-center text-2xl text-white mb-4 group-hover:scale-110 transition-transform">
                    🛡️
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">Compliance Center</h4>
                  <p className="text-white/70 text-sm mb-4">Texas Education Code compliance agent with automated monitoring, violation tracking, and audit management</p>
                  <div className="bg-red-500/20 text-red-300 px-3 py-1 rounded-full text-xs">
                    TEC Compliant
                  </div>
                </div>
              </div>
            </Link>
          </div>

          <div className="text-center mt-8">
            <p className="text-white/60 text-sm">All curricula meet Texas Education Code requirements with specialized neurodivergent support</p>
          </div>
        </div>
      </section>

      {/* Global Campus & Juvenile Justice Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-purple-900/50 to-blue-900/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">Global Operations & Specialized Programs</h3>
            <p className="text-white/80 mb-8 max-w-3xl mx-auto">
              International campus management and comprehensive support for juvenile justice education across three global locations
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/global-campuses" className="group">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto bg-blue-500 rounded-full flex items-center justify-center text-2xl text-white mb-4 group-hover:scale-110 transition-transform">
                    🌍
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">Global Campuses</h4>
                  <p className="text-white/70 text-sm mb-4">Manage Texas, Madrid Mexico, and Vienna Austria campuses with housing coordination and international operations</p>
                  <div className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-xs">
                    3 Locations
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/juvenile-justice" className="group">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto bg-red-500 rounded-full flex items-center justify-center text-2xl text-white mb-4 group-hover:scale-110 transition-transform">
                    🛡️
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">Juvenile Justice Education</h4>
                  <p className="text-white/70 text-sm mb-4">Comprehensive education for detention centers, group homes, probation students with trauma-informed approaches</p>
                  <div className="bg-red-500/20 text-red-300 px-3 py-1 rounded-full text-xs">
                    Trauma-Informed
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/reentry-support" className="group">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto bg-green-500 rounded-full flex items-center justify-center text-2xl text-white mb-4 group-hover:scale-110 transition-transform">
                    🔄
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">Reentry Support</h4>
                  <p className="text-white/70 text-sm mb-4">Transition planning, life skills training, and ongoing support for successful community reintegration</p>
                  <div className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-xs">
                    6 Month Support
                  </div>
                </div>
              </div>
            </Link>
          </div>

          <div className="text-center mt-8">
            <p className="text-white/60 text-sm">Serving diverse populations with specialized educational approaches and global coordination</p>
          </div>
        </div>
      </section>

      {/* Student Management Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-slate-900/50 to-gray-900/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">Student Management & Enrollment</h3>
            <p className="text-white/80 mb-8 max-w-3xl mx-auto">
              Comprehensive tracking and management system for different student types, payment plans, and access levels
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/enrollment-portal" className="group">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto bg-indigo-500 rounded-full flex items-center justify-center text-2xl text-white mb-4 group-hover:scale-110 transition-transform">
                    📝
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">Student Enrollment</h4>
                  <p className="text-white/70 text-sm mb-4">Choose from on-site, online premium, hybrid, or free access options</p>
                  <div className="bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-xs">
                    Multiple Plans Available
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/student-management" className="group">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto bg-slate-500 rounded-full flex items-center justify-center text-2xl text-white mb-4 group-hover:scale-110 transition-transform">
                    👥
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">Student Management</h4>
                  <p className="text-white/70 text-sm mb-4">Track enrollment types, payments, usage analytics, and access permissions</p>
                  <div className="bg-slate-500/20 text-slate-300 px-3 py-1 rounded-full text-xs">
                    Admin Dashboard
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/license-control" className="group">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto bg-red-500 rounded-full flex items-center justify-center text-2xl text-white mb-4 group-hover:scale-110 transition-transform">
                    🔒
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">AI Engine License Control</h4>
                  <p className="text-white/70 text-sm mb-4">Monitor and control self-hosted AI engines after student purchases</p>
                  <div className="bg-red-500/20 text-red-300 px-3 py-1 rounded-full text-xs">
                    Remote Control System
                  </div>
                </div>
              </div>
            </Link>
          </div>

          <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h4 className="text-white font-bold text-lg mb-4">Student Type Categories</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-300 mb-1">On-Site Students</div>
                <div className="text-white/70 text-sm">Full campus access + all features</div>
                <div className="text-green-200 text-xs mt-1">$2,500/semester</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-300 mb-1">Online Premium</div>
                <div className="text-white/70 text-sm">Live teacher interaction + AI tools</div>
                <div className="text-blue-200 text-xs mt-1">$1,800/semester</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-300 mb-1">Hybrid Learning</div>
                <div className="text-white/70 text-sm">Flexible on-site + online combo</div>
                <div className="text-purple-200 text-xs mt-1">$2,000/semester</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-300 mb-1">Free Access</div>
                <div className="text-white/70 text-sm">Limited AI features + content</div>
                <div className="text-yellow-200 text-xs mt-1">$0 - Free</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Texas Charter School Compliance */}
      <section className="py-16 px-4 bg-black/20">
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-bold text-white mb-4">Texas Charter School Compliance Center</h3>
          <p className="text-white/80 mb-8 max-w-3xl mx-auto">
            Fully compliant with Texas Education Agency requirements including STAAR testing, PEIMS reporting, and neurodivergent accommodations.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link 
              href="/texas-enrollment" 
              className="bg-white/10 text-white px-6 py-3 rounded-full border border-white/20 hover:bg-white/20 transition-colors"
            >
              📝 Student Enrollment
            </Link>
            <Link 
              href="/texas-assessments" 
              className="bg-white/10 text-white px-6 py-3 rounded-full border border-white/20 hover:bg-white/20 transition-colors"
            >
              📊 STAAR Testing
            </Link>
            <Link 
              href="/texas-reporting" 
              className="bg-white/10 text-white px-6 py-3 rounded-full border border-white/20 hover:bg-white/20 transition-colors"
            >
              📈 TEA Reporting
            </Link>
            <Link 
              href="/texas-peims" 
              className="bg-white/10 text-white px-6 py-3 rounded-full border border-white/20 hover:bg-white/20 transition-colors"
            >
              🏛️ PEIMS Data
            </Link>
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section id="approach" className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-16">
            Our Neurodivergent-First Approach
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-blue-500 rounded-full flex items-center justify-center text-3xl text-white mb-4">
                🧠
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">AI-Powered Personalization</h3>
              <p className="text-white/80">
                Our AI instructors adapt in real-time to each student's learning style, attention patterns, and processing preferences.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-green-500 rounded-full flex items-center justify-center text-3xl text-white mb-4">
                ♿
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Accessibility First</h3>
              <p className="text-white/80">
                Built from the ground up with WCAG 2.1 AA compliance and specialized accommodations for ADHD, dyslexia, and autism.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-purple-500 rounded-full flex items-center justify-center text-3xl text-white mb-4">
                📊
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Data-Driven Insights</h3>
              <p className="text-white/80">
                Comprehensive analytics help parents and teachers understand learning patterns and celebrate neurodivergent strengths.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/40 py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="text-white text-2xl font-bold mb-4">
            The Universal One School
          </div>
          <p className="text-white/60 mb-6">
            Empowering neurodivergent minds through innovative AI-driven education
          </p>
          <div className="flex justify-center space-x-6">
            <Link href="/demo" className="text-white/60 hover:text-white transition-colors">
              Demo
            </Link>
            <Link href="/texas-charter-compliance" className="text-white/60 hover:text-white transition-colors">
              Charter School
            </Link>
            <Link href="#schools" className="text-white/60 hover:text-white transition-colors">
              Schools
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}