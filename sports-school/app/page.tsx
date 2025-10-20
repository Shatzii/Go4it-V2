import {
  GraduationCap,
  Users,
  BookOpen,
  Brain,
  Star,
  ArrowRight,
  Globe,
  Trophy,
  Shield,
  Sparkles,
  Heart,
  Zap,
} from 'lucide-react';
import Link from 'next/link';

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-6">
              Universal One School
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto">
              Where Every Student Discovers Their Unique Path to Success
            </p>
            <div className="flex justify-center gap-4 mb-12">
              <Link href="/schools/primary">
                <button className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                  Explore Schools
                </button>
              </Link>
              <Link href="/about">
                <button className="px-8 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold">
                  Take a Tour
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Schools Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Five Specialized Schools, One Mission
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Each school is designed to nurture specific talents and interests, providing
            personalized education paths for every student's unique potential.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Primary School */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100">
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">SuperHero Elementary</h3>
              </div>
              <p className="text-gray-600 mb-4">
                K-6 students discover their learning superpowers through engaging, gamified
                education.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-orange-600">1,500+ Students</span>
                <Link href="/schools/primary">
                  <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg hover:opacity-90 transition-opacity">
                    Explore <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Secondary School */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">S.T.A.G.E Prep Academy</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Academic excellence program preparing students for college and career success.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-purple-600">2,000+ Students</span>
                <Link href="/schools/secondary">
                  <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity">
                    Explore <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Law School */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100">
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-blue-600 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Future Legal Professionals</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Pre-law and law school preparation with focus on legal reasoning and advocacy.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-blue-600">800+ Students</span>
                <Link href="/schools/law">
                  <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-600 to-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity">
                    Explore <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Language School */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100">
            <div className="bg-gradient-to-br from-green-50 to-teal-50 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Global Language Academy</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Multilingual education with cultural immersion and global citizenship focus.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-teal-600">1,200+ Students</span>
                <Link href="/schools/language">
                  <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg hover:opacity-90 transition-opacity">
                    Explore <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Sports Academy */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100">
            <div className="bg-gradient-to-br from-red-50 to-pink-50 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Go4it Sports Academy</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Athletic excellence combined with academic achievement for well-rounded development.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-pink-600">1,450+ Students</span>
                <Link href="/schools/sports">
                  <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg hover:opacity-90 transition-opacity">
                    Explore <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Begin Your Educational Journey?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join over 6,950 students who are already discovering their potential at Universal One
            School.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/enrollment">
              <button className="px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold">
                Start Enrollment
              </button>
            </Link>
            <Link href="/parent-dashboard">
              <button className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold">
                Parent Dashboard
              </button>
            </Link>
            <Link href="/payments">
              <button className="px-8 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold">
                Make Payment
              </button>
            </Link>
            <Link href="/student-onboarding">
              <button className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold">
                Student Onboarding
              </button>
            </Link>
            <Link href="/virtual-tour">
              <button className="px-8 py-3 border-2 border-white text-white rounded-lg hover:bg-white hover:text-blue-600 transition-colors font-semibold">
                Virtual Tour
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
