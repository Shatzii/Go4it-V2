// Go4It Sports Landing Page - Direct implementation for Replit preview
import { Star, TrendingUp, GraduationCap, Trophy, CheckCircle } from 'lucide-react'

export default function Go4ItHomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Hero Section */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Unlock Your Athletic Potential
          </h1>
          <p className="text-xl text-slate-300 mb-8 leading-relaxed">
            The world's first AI-powered sports platform designed specifically for neurodivergent student athletes. 
            Combine cutting-edge performance analysis with comprehensive academic and recruitment tools.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href="/camp-registration" className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-semibold transition-colors">
              Register for Merida Camps
            </a>
            <button className="border border-slate-600 hover:border-slate-500 px-8 py-3 rounded-lg font-semibold transition-colors">
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-20 px-4 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-white mb-4">Revolutionary Features</h2>
          <p className="text-center text-slate-400 mb-12 text-lg">AI-powered tools designed for neurodivergent athletes</p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 hover:border-blue-500 transition-colors">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">GAR Analysis</h3>
              <p className="text-slate-400 mb-4">
                Professional-grade AI video analysis with Growth and Ability Rating system. 
                Get insights used by college scouts and professional coaches.
              </p>
              <div className="text-blue-400 font-semibold">Starting at $49/analysis</div>
            </div>
            
            <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 hover:border-purple-500 transition-colors">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">AI Coach</h3>
              <p className="text-slate-400 mb-4">
                24/7 personalized coaching across 13+ sports with ADHD-friendly training adaptations. 
                Your personal coach that understands how you learn best.
              </p>
              <div className="text-purple-400 font-semibold">Included in all plans</div>
            </div>
            
            <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 hover:border-green-500 transition-colors">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">College Path</h3>
              <p className="text-slate-400 mb-4">
                NCAA compliance tracking, 500+ college database, and direct coach contacts. 
                Your pathway to college athletics made simple.
              </p>
              <div className="text-green-400 font-semibold">Complete recruiting suite</div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-white mb-4">Elite Athletes Trust Go4It</h2>
          <p className="text-center text-slate-400 mb-12 text-lg">Top prospects using our platform to reach their potential</p>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center space-x-1">
                  <CheckCircle className="w-4 h-4 text-blue-400" />
                  <span className="text-blue-400 text-sm">Verified</span>
                </div>
              </div>
              <h3 className="text-white font-semibold mb-1">Cooper Flagg</h3>
              <p className="text-slate-400 text-sm mb-2">Basketball • Class of 2026</p>
              <div className="flex justify-between items-center">
                <span className="text-blue-400 font-bold">GAR: 98/100</span>
                <span className="text-green-400 text-sm">#1 National</span>
              </div>
            </div>
            
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center space-x-1">
                  <CheckCircle className="w-4 h-4 text-blue-400" />
                  <span className="text-blue-400 text-sm">Verified</span>
                </div>
              </div>
              <h3 className="text-white font-semibold mb-1">Ace Bailey</h3>
              <p className="text-slate-400 text-sm mb-2">Basketball • Class of 2026</p>
              <div className="flex justify-between items-center">
                <span className="text-blue-400 font-bold">GAR: 96/100</span>
                <span className="text-green-400 text-sm">#2 National</span>
              </div>
            </div>
            
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center space-x-1">
                  <CheckCircle className="w-4 h-4 text-blue-400" />
                  <span className="text-blue-400 text-sm">Verified</span>
                </div>
              </div>
              <h3 className="text-white font-semibold mb-1">Dylan Harper</h3>
              <p className="text-slate-400 text-sm mb-2">Basketball • Class of 2026</p>
              <div className="flex justify-between items-center">
                <span className="text-blue-400 font-bold">GAR: 95/100</span>
                <span className="text-green-400 text-sm">#3 National</span>
              </div>
            </div>
            
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center space-x-1">
                  <CheckCircle className="w-4 h-4 text-blue-400" />
                  <span className="text-blue-400 text-sm">Verified</span>
                </div>
              </div>
              <h3 className="text-white font-semibold mb-1">VJ Edgecombe</h3>
              <p className="text-slate-400 text-sm mb-2">Basketball • Class of 2026</p>
              <div className="flex justify-between items-center">
                <span className="text-blue-400 font-bold">GAR: 93/100</span>
                <span className="text-green-400 text-sm">#8 National</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-900/50 to-purple-900/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Transform Your Game?</h2>
          <p className="text-xl text-slate-300 mb-8">
            Join thousands of athletes using AI to unlock their potential. Start your journey today.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href="/camp-registration" className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-lg font-semibold text-lg transition-colors">
              Register for Merida Camps
            </a>
            <button className="border border-slate-500 hover:border-slate-400 px-8 py-4 rounded-lg font-semibold text-lg transition-colors">
              Schedule Demo
            </button>
          </div>
          <p className="text-slate-400 mt-4">Free trial • No credit card required • Cancel anytime</p>
        </div>
      </section>
    </div>
  )
}