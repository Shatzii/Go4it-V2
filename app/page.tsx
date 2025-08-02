// Go4It Sports Landing Page - StarPath Enhanced 
import { Star, TrendingUp, GraduationCap, Trophy, CheckCircle, Target, Zap, Crown, Award } from 'lucide-react'

export default function Go4ItHomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Hero Section */}
      <section className="py-20 px-4 text-center relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="mb-6 flex justify-center">
            <div className="h-16 w-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              GO4IT
            </div>
          </div>
          <div className="mb-4">
            <span className="text-blue-400 text-lg font-semibold tracking-wider uppercase">Go4It Sports</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
            Get Verified. Get Ranked. <br />
            <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              Get Recruited.
            </span>
          </h1>
          <p className="text-2xl text-slate-300 mb-6 font-medium">
            You've Got Talent. We've Got the System.
          </p>
          <p className="text-lg text-slate-400 mb-12 max-w-4xl mx-auto leading-relaxed">
            This is <strong>Go4It Sports</strong> — the world's first platform built to take you from raw potential to 5-star recruit. 
            We don't guess. We measure. We don't hope. We plan. You bring the work — we'll bring the future.
          </p>
          <div className="flex gap-4 justify-center flex-wrap mb-8">
            <a href="/register" className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-lg font-bold text-lg transition-colors shadow-lg hover:shadow-xl">
              Create Your Free Account
            </a>
            <a href="/camp-registration" className="border-2 border-blue-400 hover:bg-blue-400/10 px-8 py-4 rounded-lg font-semibold text-lg transition-colors">
              Register for Merida Camps
            </a>
          </div>
          <p className="text-slate-500 text-sm font-medium">
            Built for athletes who are ready to be seen. Trained. Tracked. And transformed.
          </p>
        </div>
        
        {/* Hero Background Elements */}
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute top-20 right-10 w-32 h-32 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-40 h-40 bg-purple-500 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Step 1: Start Free */}
      <section className="py-16 px-4 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-4">1</div>
                <h2 className="text-3xl font-bold text-white">START FREE — CLAIM YOUR SPOT</h2>
              </div>
              <p className="text-xl text-slate-300 mb-6">Your journey starts now.</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-slate-300">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  Build your profile
                </li>
                <li className="flex items-center text-slate-300">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  Upload your highlight reels
                </li>
                <li className="flex items-center text-slate-300">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  Access your own training dashboard
                </li>
              </ul>
              <p className="text-blue-400 font-bold text-lg mb-6">No commitment. No fluff. All fire.</p>
              <a href="/register" className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-bold text-lg transition-colors inline-block">
                Create Your Free Account
              </a>
            </div>
            <div className="relative">
              <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 shadow-2xl">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-white">Athlete Dashboard</h3>
                <p className="text-slate-400 mb-4">
                  Your complete performance command center with real-time analytics and progress tracking.
                </p>
                <div className="bg-slate-900 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-slate-400">GAR Score</span>
                    <span className="text-blue-400 font-bold">8.4/10</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div className="bg-blue-400 h-2 rounded-full" style={{width: '84%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Step 2: Get Your GAR */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="w-full max-w-md mx-auto bg-gradient-to-br from-blue-900 to-purple-900 rounded-xl shadow-2xl p-12 text-center">
                <div className="relative">
                  <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-r from-blue-400 to-cyan-300 rounded-full flex items-center justify-center text-slate-900 font-bold text-2xl shadow-lg">
                    ✓
                  </div>
                  <h3 className="text-4xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text mb-4">
                    GET VERIFIED
                  </h3>
                  <p className="text-slate-300 text-lg">
                    Your official athletic rating
                  </p>
                  <div className="absolute -top-4 -right-4 w-16 h-16 bg-blue-500/20 rounded-full blur-xl"></div>
                  <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-purple-500/20 rounded-full blur-xl"></div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold mr-4">2</div>
                <h2 className="text-3xl font-bold text-white">GET YOUR GAR — YOUR VERIFIED SCORE</h2>
              </div>
              <p className="text-xl text-slate-300 mb-6">The <strong>Growth & Ability Rating (GAR)</strong> isn't hype — it's science.</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-slate-300">
                  <Star className="w-5 h-5 text-yellow-400 mr-3" />
                  AI-driven breakdown of your movement and mechanics
                </li>
                <li className="flex items-center text-slate-300">
                  <Target className="w-5 h-5 text-red-400 mr-3" />
                  Full-body analysis across 5 game-changing categories
                </li>
                <li className="flex items-center text-slate-300">
                  <TrendingUp className="w-5 h-5 text-green-400 mr-3" />
                  Real injury-risk prediction and performance trajectory
                </li>
                <li className="flex items-center text-slate-300">
                  <Award className="w-5 h-5 text-purple-400 mr-3" />
                  Compare yourself to college athletes and beyond
                </li>
              </ul>
              <div className="bg-slate-800 p-4 rounded-lg mb-6">
                <p className="text-green-400 font-bold text-lg">$49 one-time — or unlimited with PRO/ELITE</p>
              </div>
              <a href="/gar-analysis" className="bg-green-600 hover:bg-green-700 px-8 py-3 rounded-lg font-bold text-lg transition-colors inline-block mb-4">
                Get My GAR Score
              </a>
              <blockquote className="border-l-4 border-blue-400 pl-4 italic text-slate-300 mt-6">
                "The GAR score didn't just improve my game — it got me in front of real recruiters. This is different."
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Step 3: Enter the StarPath */}
      <section className="py-16 px-4 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-4">3</div>
                <h2 className="text-3xl font-bold text-white">ENTER THE STARPATH</h2>
              </div>
              <p className="text-xl text-slate-300 mb-6">You've been training. Now it's time to level up.</p>
              <p className="text-lg text-slate-400 mb-6">
                <strong>The StarPath System</strong> turns your grind into a growth game:
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-slate-300">
                  <Zap className="w-5 h-5 text-yellow-400 mr-3" />
                  Unlockable XP trees and milestone markers
                </li>
                <li className="flex items-center text-slate-300">
                  <TrendingUp className="w-5 h-5 text-blue-400 mr-3" />
                  Performance tracking that feels like progress
                </li>
                <li className="flex items-center text-slate-300">
                  <Trophy className="w-5 h-5 text-purple-400 mr-3" />
                  Weekly targets, trophies, and rankings
                </li>
              </ul>
              <div className="bg-slate-800 p-4 rounded-lg mb-6">
                <p className="text-purple-400 font-bold text-lg">Starter Plan: $19/month</p>
                <p className="text-slate-400">because average isn't in your vocabulary.</p>
              </div>
              <a href="/starpath" className="bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-lg font-bold text-lg transition-colors inline-block">
                Start My StarPath Journey
              </a>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 p-8 rounded-xl border border-purple-500/30 shadow-2xl">
                <h3 className="text-xl font-semibold mb-6 text-white text-center">StarPath Progress</h3>
                <div className="space-y-4">
                  {[
                    { skill: "Speed Training", progress: 85, xp: "2,340 XP" },
                    { skill: "Technique", progress: 72, xp: "1,890 XP" },
                    { skill: "Game IQ", progress: 63, xp: "1,245 XP" },
                  ].map((item, index) => (
                    <div key={index} className="bg-slate-800/50 p-3 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-white font-medium">{item.skill}</span>
                        <span className="text-xs text-purple-400">{item.xp}</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div className="bg-gradient-to-r from-purple-400 to-blue-400 h-2 rounded-full" style={{width: `${item.progress}%`}}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Step 4: NCAA StarPath Elite */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 p-8 rounded-xl border border-yellow-500/30 shadow-2xl">
                <div className="text-center mb-6">
                  <Crown className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-yellow-400">NCAA STARPATH ELITE</h3>
                  <p className="text-slate-300">For athletes who mean business</p>
                </div>
                <div className="space-y-3">
                  {[
                    "Real-time NCAA eligibility tracking",
                    "GPA and course monitoring", 
                    "AI-powered academic tutoring",
                    "Access to 500+ recruiter contacts"
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-yellow-400 mr-3 flex-shrink-0" />
                      <span className="text-slate-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center text-white font-bold mr-4">4</div>
                <h2 className="text-3xl font-bold text-white">GO NEXT-LEVEL WITH NCAA STARPATH ELITE</h2>
              </div>
              <p className="text-xl text-slate-300 mb-6">
                Want scholarships? Offers? Your name on a recruiter's board?<br />
                This is where you separate from the pack.
              </p>
              <p className="text-lg text-slate-400 mb-8">
                <strong>NCAA StarPath ELITE gives you:</strong>
              </p>
              <div className="bg-slate-800 p-4 rounded-lg mb-6">
                <p className="text-yellow-400 font-bold text-lg">Elite Plan: $99/month</p>
                <p className="text-slate-400">for athletes who mean business.</p>
              </div>
              <a href="/elite-upgrade" className="bg-yellow-600 hover:bg-yellow-700 px-8 py-3 rounded-lg font-bold text-lg transition-colors inline-block">
                Upgrade to NCAA StarPath ELITE
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Why Go4It Wins */}
      <section className="py-16 px-4 bg-slate-900/50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">WHY GO4IT WINS</h2>
          <p className="text-2xl text-slate-300 mb-12 font-medium">Because you don't just want to play. You want to rise.</p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Built for Athletes</h3>
              <p className="text-slate-400">Every feature, every tool, every click is designed for your path.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">AI-Powered Evaluation</h3>
              <p className="text-slate-400">No opinions. Just facts, footage, and verified data.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Recruitment Ready</h3>
              <p className="text-slate-400">From your highlight reel to your GPA — we track it all.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Gamified Growth</h3>
              <p className="text-slate-400">Progress isn't boring when it feels like winning.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Complete Stack */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-8">YOUR COMPLETE STACK</h2>
          <div className="grid md:grid-cols-2 gap-4 mb-12">
            {[
              "GAR Score Analysis (13 sports)",
              "StarPath XP Progression System",
              "24/7 AI Coaching Engine",
              "Academic GPA + NCAA Eligibility Tools",
              "Mental Wellness & Nutrition Hub",
              "National Rankings + Leaderboards",
              "Athlete Dashboard + Mobile Access"
            ].map((feature, index) => (
              <div key={index} className="flex items-center text-slate-300 text-lg">
                <CheckCircle className="w-6 h-6 text-blue-400 mr-3 flex-shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
          <a href="/register" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-12 py-4 rounded-lg font-bold text-xl transition-colors inline-block shadow-lg hover:shadow-xl">
            Start Free. Get Ranked. Go4It.
          </a>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-900/50 to-purple-900/50 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            THIS ISN'T JUST TRAINING —<br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              THIS IS TRANSFORMATION
            </span>
          </h2>
          <div className="text-xl text-slate-300 mb-8 space-y-2">
            <p>You're not just trying out. You're breaking through.</p>
            <p>You're not just chasing stars. You're earning them.</p>
          </div>
          <p className="text-lg text-slate-400 mb-8">
            <strong>Go4It is the first platform built for athletes who want to be verified — and recruited.</strong>
          </p>
          <p className="text-xl text-slate-300 mb-12 font-semibold">
            This isn't a workout app. It's a war map.
          </p>
          <div className="flex gap-6 justify-center flex-wrap">
            <a href="/register" className="bg-blue-600 hover:bg-blue-700 px-10 py-4 rounded-lg font-bold text-xl transition-colors">
              Go4It. Get Verified.
            </a>
            <a href="/camp-registration" className="border-2 border-white hover:bg-white hover:text-slate-900 px-10 py-4 rounded-lg font-bold text-xl transition-colors">
              Become Unstoppable
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}