"use client";

import { useState } from "react";
import { StarPathPageShell, StarPathPanel, StarPathBadge, StarPathSection, StarPathGrid, WeeklyLessonModules, AIGuidanceChat } from "@/components/starpath";
import { BookOpen, Brain, Globe, Trophy, CheckCircle, Download, Play } from "lucide-react";

export default function CurriculumPage() {
  const [selectedProgram, setSelectedProgram] = useState("vienna");

  const courses = [
    {
      id: "SCI-401",
      title: "Human Performance Biology",
      ncaa: true,
      credits: 1.0,
      description: "Transform training into science credit",
      topics: ["Physics of force production", "Biomechanics", "Exercise physiology", "Nutrition biochemistry"],
      icon: "🔬"
    },
    {
      id: "MATH-401",
      title: "Performance Analytics",
      ncaa: true,
      credits: 1.0,
      description: "Statistics and data analysis from training",
      topics: ["Statistical analysis", "Performance metrics", "Data visualization", "Optimization models"],
      icon: "📊"
    },
    {
      id: "ELA-401",
      title: "Athletic Literature & Communication",
      ncaa: true,
      credits: 1.0,
      description: "Professional writing and analysis",
      topics: ["Sports psychology texts", "Research papers", "Professional communication", "Portfolio development"],
      icon: "📚"
    },
    {
      id: "SOCSCI-401",
      title: "Leadership & Culture",
      ncaa: true,
      credits: 1.0,
      description: "Cultural immersion and team dynamics",
      topics: ["Cultural anthropology", "Leadership theory", "European history", "Social psychology"],
      icon: "🌍"
    },
    {
      id: "LANG-401",
      title: "German Language (A1-A2)",
      ncaa: true,
      credits: 1.0,
      description: "Conversational German through daily life",
      topics: ["Survival German", "Sports vocabulary", "Cultural integration", "Practical communication"],
      icon: "🇩🇪"
    },
    {
      id: "HDR-401",
      title: "Human Development Record",
      ncaa: true,
      credits: 1.0,
      description: "6 Pillars of holistic development",
      topics: ["Physical development", "Mental resilience", "Emotional intelligence", "Social skills", "Career planning", "Life skills"],
      icon: "⭐"
    }
  ];

  const books = [
    { title: "The Champion's Mind", author: "Jim Afremow", category: "Mental Performance" },
    { title: "Atomic Habits", author: "James Clear", category: "Behavior Change" },
    { title: "The Talent Code", author: "Daniel Coyle", category: "Skill Development" },
    { title: "Mindset", author: "Carol Dweck", category: "Psychology" },
    { title: "7 Habits of Highly Effective Teens", author: "Sean Covey", category: "Leadership" },
    { title: "Peak Performance", author: "Brad Stulberg", category: "Training" },
    { title: "The Culture Code", author: "Daniel Coyle", category: "Team Dynamics" },
    { title: "Deep Work", author: "Cal Newport", category: "Focus" },
    { title: "Grit", author: "Angela Duckworth", category: "Perseverance" },
    { title: "Range", author: "David Epstein", category: "Athlete Development" }
  ];

  const programs = {
    vienna: {
      name: "Vienna Residency",
      credits: 12,
      weeks: 12,
      price: "$28,000",
      features: ["Full European immersion", "Daily German classes", "Professional training", "Cultural excursions", "NCAA transcript"]
    },
    online: {
      name: "Online Accelerator",
      credits: 10,
      weeks: 12,
      price: "$15,000",
      features: ["Live virtual classes", "Self-paced modules", "Weekly coaching", "Digital portfolio", "NCAA transcript"]
    },
    day: {
      name: "Day Program",
      credits: 8,
      weeks: 16,
      price: "$8,000",
      features: ["After-school format", "Weekend intensives", "Local training integration", "Flexible scheduling", "NCAA transcript"]
    }
  };

  return (
    <StarPathPageShell>
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
              <a href="/" className="hover:text-amber-500 transition">Home</a>
              <a href="/curriculum" className="text-amber-500 font-semibold">Curriculum</a>
              <a href="/dashboard" className="hover:text-amber-500 transition">Dashboard</a>
              <a href="/#contact" className="hover:text-amber-500 transition">Contact</a>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-amber-900/10 to-black">
        <div className="container mx-auto text-center">
          <div className="text-amber-500 text-6xl mb-6">★</div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            NCAA-Recognized Curriculum
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Where training becomes transcripts. Every workout, cultural experience, and competition 
            translates to real academic credit recognized by the NCAA.
          </p>
        </div>
      </section>

      {/* Program Selector */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row gap-4 justify-center mb-12">
            {Object.entries(programs).map(([key, program]) => (
              <button
                key={key}
                onClick={() => setSelectedProgram(key)}
                className={`px-8 py-4 rounded-lg font-bold text-lg transition ${
                  selectedProgram === key
                    ? "bg-amber-500 text-black"
                    : "bg-white/10 text-white hover:bg-white/20 border border-amber-500/30"
                }`}
              >
                {program.name}
                <div className="text-sm font-normal mt-1">{program.credits} Credits • {program.price}</div>
              </button>
            ))}
          </div>

          <StarPathPanel>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold text-amber-400 mb-4">{programs[selectedProgram as keyof typeof programs].name}</h3>
                <ul className="space-y-3">
                  {programs[selectedProgram as keyof typeof programs].features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-300">
                      <CheckCircle className="w-5 h-5 text-amber-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="bg-gradient-to-br from-amber-500/20 to-transparent border border-amber-500/30 p-6 rounded-lg">
                  <div className="text-5xl font-bold text-amber-400 mb-2">{programs[selectedProgram as keyof typeof programs].credits}</div>
                  <div className="text-gray-300 mb-4">NCAA Credits</div>
                  <div className="text-3xl font-bold text-white mb-2">{programs[selectedProgram as keyof typeof programs].weeks} Weeks</div>
                  <div className="text-gray-400">Accelerated Timeline</div>
                </div>
              </div>
            </div>
          </StarPathPanel>
        </div>
      </section>

      {/* Core Courses */}
      <section className="py-16 px-4 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto">
          <StarPathSection 
            title="Core Academic Courses" 
            subtitle="NCAA-approved curriculum where experience becomes education"
            centered
          />
          
          <StarPathGrid cols={3} gap="md">
            {courses.map((course) => (
              <StarPathPanel key={course.id}>
                <div className="text-4xl mb-4">{course.icon}</div>
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-xl font-bold text-amber-400">{course.id}</h3>
                  {course.ncaa && <StarPathBadge variant="green">NCAA ✓</StarPathBadge>}
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">{course.title}</h4>
                <p className="text-gray-400 mb-4">{course.description}</p>
                <div className="space-y-2">
                  {course.topics.map((topic, i) => (
                    <div key={i} className="text-sm text-gray-500 flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-amber-500"></div>
                      {topic}
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-amber-500/20">
                  <div className="text-2xl font-bold text-amber-400">{course.credits} Credit</div>
                </div>
              </StarPathPanel>
            ))}
          </StarPathGrid>
        </div>
      </section>

      {/* 20-Book Library */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <StarPathSection 
            title="20-Book Performance Library" 
            subtitle="Required reading integrated into curriculum and daily experiences"
            centered
          />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {books.map((book, i) => (
              <div key={i} className="bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/30 p-6 rounded-lg hover:border-amber-500/60 transition">
                <BookOpen className="w-8 h-8 text-amber-500 mb-3" />
                <h4 className="font-bold text-white mb-1">{book.title}</h4>
                <p className="text-sm text-gray-400 mb-2">{book.author}</p>
                <StarPathBadge variant="warm">{book.category}</StarPathBadge>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HDR 6 Pillars */}
      <section className="py-16 px-4 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto">
          <StarPathSection 
            title="Human Development Record (HDR)" 
            subtitle="6 Pillars of holistic athlete development"
            centered
          />
          
          <StarPathGrid cols={3} gap="lg">
            <StarPathPanel>
              <Brain className="w-12 h-12 text-amber-500 mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Physical Development</h3>
              <p className="text-gray-400">Strength, conditioning, sport-specific skills, injury prevention</p>
            </StarPathPanel>
            
            <StarPathPanel>
              <Brain className="w-12 h-12 text-blue-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Mental Resilience</h3>
              <p className="text-gray-400">Focus, confidence, pressure management, visualization</p>
            </StarPathPanel>
            
            <StarPathPanel>
              <Brain className="w-12 h-12 text-green-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Emotional Intelligence</h3>
              <p className="text-gray-400">Self-awareness, empathy, stress management, relationships</p>
            </StarPathPanel>
            
            <StarPathPanel>
              <Globe className="w-12 h-12 text-purple-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Social Skills</h3>
              <p className="text-gray-400">Communication, teamwork, cultural awareness, leadership</p>
            </StarPathPanel>
            
            <StarPathPanel>
              <Trophy className="w-12 h-12 text-yellow-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Career Planning</h3>
              <p className="text-gray-400">College recruiting, scholarship strategy, life after sports</p>
            </StarPathPanel>
            
            <StarPathPanel>
              <CheckCircle className="w-12 h-12 text-pink-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Life Skills</h3>
              <p className="text-gray-400">Financial literacy, time management, nutrition, independence</p>
            </StarPathPanel>
          </StarPathGrid>
        </div>
      </section>

      {/* AI Engine Preview */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <StarPathSection 
            title="StarPath AI Assistant" 
            subtitle="Self-hosted AI engine for lesson planning and credit tracking"
            centered
          />
          
          <StarPathPanel>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold text-amber-400 mb-4">Teacher Quick Commands</h3>
                <div className="space-y-3">
                  <button className="w-full bg-white/10 hover:bg-white/20 border border-amber-500/30 px-4 py-3 rounded-lg text-left transition">
                    <Play className="w-4 h-4 inline mr-2 text-amber-500" />
                    <span className="text-white font-mono">/week-plan</span> - Generate weekly curriculum
                  </button>
                  <button className="w-full bg-white/10 hover:bg-white/20 border border-amber-500/30 px-4 py-3 rounded-lg text-left transition">
                    <Play className="w-4 h-4 inline mr-2 text-amber-500" />
                    <span className="text-white font-mono">/german-lesson</span> - Create German activity
                  </button>
                  <button className="w-full bg-white/10 hover:bg-white/20 border border-amber-500/30 px-4 py-3 rounded-lg text-left transition">
                    <Play className="w-4 h-4 inline mr-2 text-amber-500" />
                    <span className="text-white font-mono">/credit-map</span> - Map training to credits
                  </button>
                  <button className="w-full bg-white/10 hover:bg-white/20 border border-amber-500/30 px-4 py-3 rounded-lg text-left transition">
                    <Play className="w-4 h-4 inline mr-2 text-amber-500" />
                    <span className="text-white font-mono">/assessment</span> - Create assessments
                  </button>
                </div>
              </div>
              <div className="bg-black border border-amber-500/30 p-6 rounded-lg">
                <div className="text-xs text-gray-500 mb-2">MINIMAL SELF-HOSTED SETUP</div>
                <div className="font-mono text-sm text-gray-300 space-y-2">
                  <div>📦 Hardware: Raspberry Pi 4 (4GB) - $75</div>
                  <div>🧠 Model: Llama 3.2 (3B) - 2GB storage</div>
                  <div>⚡ Response: ~2 seconds</div>
                  <div>🔒 Privacy: 100% local, zero cloud</div>
                  <div>💰 Cost: One-time hardware only</div>
                </div>
                <a href="#setup" className="mt-6 inline-block bg-amber-500 text-black px-6 py-3 rounded-lg font-bold hover:bg-amber-400 transition">
                  View Setup Guide
                </a>
              </div>
            </div>
          </StarPathPanel>
        </div>
      </section>

      {/* Weekly Lesson Modules */}
      <section className="py-16 px-4 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto">
          <WeeklyLessonModules />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-black to-amber-900/10">
        <div className="container mx-auto text-center">
          <div className="text-amber-500 text-6xl mb-6">★</div>
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Start Your Journey?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Next cohort begins January 15, 2025. Limited spots available for Vienna Residency.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <a href="/#programs" className="bg-amber-500 hover:bg-amber-400 text-black px-10 py-4 rounded-lg font-bold text-lg transition shadow-lg shadow-amber-500/50">
              Apply Now
            </a>
            <a href="/dashboard" className="bg-white/10 hover:bg-white/20 border-2 border-amber-500 text-white px-10 py-4 rounded-lg font-bold text-lg transition">
              View Student Dashboard
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-amber-500/30 py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-bold text-amber-400 mb-4">Programs</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/#programs" className="hover:text-white transition">Vienna Residency</a></li>
                <li><a href="/#programs" className="hover:text-white transition">Online Accelerator</a></li>
                <li><a href="/#programs" className="hover:text-white transition">Day Program</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-amber-400 mb-4">Curriculum</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/curriculum" className="hover:text-white transition">Core Courses</a></li>
                <li><a href="/curriculum" className="hover:text-white transition">20-Book Library</a></li>
                <li><a href="/curriculum" className="hover:text-white transition">HDR System</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-amber-400 mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/dashboard" className="hover:text-white transition">Student Dashboard</a></li>
                <li><a href="/#assessment" className="hover:text-white transition">NCAA Assessment</a></li>
                <li><a href="/#parent-night" className="hover:text-white transition">Parent Night</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-amber-400 mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>USA: +1 (603) 833-5184</li>
                <li>EU: +43 660 437 6295</li>
                <li>admissions@go4itsports.com</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-amber-500/20 mt-8 pt-8 text-center text-gray-500">
            <p>&copy; 2025 Go4it Sports Academy™ + StarPath Accelerator™. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* AI Chat Assistant */}
      <AIGuidanceChat />
    </StarPathPageShell>
  );
}
