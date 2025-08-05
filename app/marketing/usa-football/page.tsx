'use client';

import { CheckCircle, Shield, Star, Trophy, MapPin, Calendar, Users, Globe, Target, Award } from 'lucide-react';

export default function USAFootballMarketingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Hero Section */}
      <section className="hero-bg py-20 px-4 text-center relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="mb-6 flex justify-center">
            <div className="h-16 w-20 neon-border rounded-lg flex items-center justify-center text-white font-bold text-xl neon-glow">
              GO4IT
            </div>
          </div>
          
          <div className="mb-4">
            <span className="neon-text text-lg font-semibold tracking-wider uppercase">Official USA Football Partnership</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="glow-text">Your Pathway to America</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-4xl mx-auto leading-relaxed font-medium">
            Official USA Football credentials + 6-month Go4It platform access. 
            Your first step toward American football opportunities.
          </p>
          
          <div className="flex gap-4 justify-center flex-wrap mb-8">
            <a href="/camp-registration" className="glow-button text-lg">
              Join Mexico Tour - Get USA Football Membership
            </a>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="bg-slate-800/50 backdrop-blur neon-border rounded-lg p-6">
              <Shield className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">$100K Insurance</h3>
              <p className="text-slate-300">Comprehensive medical coverage and protection</p>
            </div>
            
            <div className="bg-slate-800/50 backdrop-blur neon-border rounded-lg p-6">
              <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Official Credentials</h3>
              <p className="text-slate-300">USA Football verified athlete status</p>
            </div>
            
            <div className="bg-slate-800/50 backdrop-blur neon-border rounded-lg p-6">
              <Target className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">College Pipeline</h3>
              <p className="text-slate-300">Direct access to U.S. recruiting networks</p>
            </div>
          </div>
        </div>
      </section>

      {/* USA Football Benefits Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold neon-text mb-4">Mexico Tour + USA Football Partnership</h2>
            <p className="text-xl text-slate-400">Official credentials that open doors to American football</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Standard Edition Package */}
            <div className="hero-bg neon-border rounded-xl p-8 relative overflow-hidden">
              <div className="absolute top-6 right-6">
                <div className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold">STANDARD EDITION</div>
              </div>
              
              <div className="mb-8">
                <h3 className="text-3xl font-bold text-white mb-4">English With Sports Camp</h3>
                <div className="flex items-center text-slate-300 mb-2">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>Mérida, Mexico • August 4-15, 2025</span>
                </div>
                <div className="text-4xl font-bold text-blue-400 mb-2">$275USD</div>
                <div className="text-lg text-slate-300">+ $35 USA Football Membership (normally $119)</div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur rounded-lg p-6 mb-6">
                <h4 className="text-xl font-bold text-blue-400 mb-4 flex items-center">
                  <Star className="w-5 h-5 mr-2" />
                  USA Football Standard Edition Includes:
                </h4>
                <div className="space-y-3">
                  {[
                    '6-month Go4It Sports platform access',
                    'Digital USA Football Athlete ID Card',
                    '$100,000 accident medical coverage',
                    'USA Football age verification',
                    'Access to sanctioned tournaments',
                    'National Team Development eligibility'
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-blue-400 mr-3 flex-shrink-0" />
                      <span className="text-slate-300">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <a href="/camp-registration" className="w-full glow-button text-center py-3 inline-block">
                Register for Standard Edition
              </a>
            </div>

            {/* Pathway to America Package */}
            <div className="hero-bg neon-border rounded-xl p-8 relative overflow-hidden border-purple-500">
              <div className="absolute top-6 right-6">
                <div className="bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-bold">PATHWAY TO AMERICA</div>
              </div>
              
              <div className="mb-8">
                <h3 className="text-3xl font-bold text-white mb-4">Elite Team Camps & Clinics</h3>
                <div className="flex items-center text-slate-300 mb-2">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>Mérida, Mexico • August 6-16, 2025</span>
                </div>
                <div className="text-4xl font-bold text-purple-400 mb-2">$725 / $225USD</div>
                <div className="text-lg text-slate-300">+ $75 Combined USA Football Package (normally $294)</div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur rounded-lg p-6 mb-6">
                <h4 className="text-xl font-bold text-purple-400 mb-4 flex items-center">
                  <Award className="w-5 h-5 mr-2" />
                  Pathway to America Package Includes:
                </h4>
                <div className="space-y-3">
                  {[
                    '6-month Go4It Sports platform access',
                    'USA Football Coach & Athlete Certification',
                    '$100,000 comprehensive insurance coverage',
                    'Tournament eligibility nationwide',
                    'College recruiting pipeline access',
                    'S.T.A.g.E. Dallas program qualification',
                    'Direct NFL network connections'
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-purple-400 mr-3 flex-shrink-0" />
                      <span className="text-slate-300">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <a href="/camp-registration" className="w-full bg-purple-600 hover:bg-purple-700 text-white text-center py-3 rounded-lg font-bold transition-colors inline-block">
                Register for Elite Package
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Expert Staff Section */}
      <section className="py-16 px-4 bg-slate-800/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold neon-text mb-4">Learn from Champions</h2>
            <p className="text-xl text-slate-400">NFL veterans and USA Football certified coaches</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-slate-800/50 backdrop-blur neon-border rounded-lg p-8">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mr-4">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Derrick Martin</h3>
                  <p className="text-blue-400 font-semibold">2x Super Bowl Champion</p>
                </div>
              </div>
              <p className="text-slate-300 mb-4">
                Former NFL safety with championship experience. Now bringing elite American football training to Mexico through our partnership programs.
              </p>
              <div className="text-sm text-slate-400">
                Baltimore Ravens • Indianapolis Colts • 10+ years NFL experience
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur neon-border rounded-lg p-8">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-purple-600 rounded-full flex items-center justify-center mr-4">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Talib Wise</h3>
                  <p className="text-purple-400 font-semibold">NFL Alumnus & International Coach</p>
                </div>
              </div>
              <p className="text-slate-300 mb-4">
                Former Chicago Bears player and Head Coach of Spanish National Team for 3 years. Led Spain to its first international victory.
              </p>
              <div className="text-sm text-slate-400">
                Chicago Bears • Spanish National Team • International Development Expert
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur neon-border rounded-xl p-12">
            <h2 className="text-4xl font-bold text-white mb-6">
              Why USA Football Membership Matters
            </h2>
            <div className="grid md:grid-cols-2 gap-8 text-left">
              <div>
                <h3 className="text-xl font-bold text-blue-400 mb-4">Official Recognition</h3>
                <p className="text-slate-300 mb-6">
                  USA Football is the official development partner of the NFL. Your membership provides verified credentials recognized by American colleges and professional scouts.
                </p>
                
                <h3 className="text-xl font-bold text-purple-400 mb-4">Insurance Protection</h3>
                <p className="text-slate-300">
                  $100,000 medical coverage, emergency room benefits, and comprehensive accident protection - essential peace of mind for international athletes.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-green-400 mb-4">Pathway Opportunities</h3>
                <p className="text-slate-300 mb-6">
                  Access to National Team Development Programs, sanctioned tournaments, and potential qualification for exclusive training programs in Dallas, Texas.
                </p>
                
                <h3 className="text-xl font-bold text-yellow-400 mb-4">6-Month Platform Access</h3>
                <p className="text-slate-300">
                  Full Go4It Sports platform including GAR analysis, StarPath progression, AI coaching, and college recruitment tools - your digital advantage.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-6">
            <span className="glow-text">Ready to Start Your American Football Journey?</span>
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Join our Mexico tour and get official USA Football credentials plus 6 months of Go4It platform access. 
            Your pathway to American football starts here.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href="/camp-registration" className="glow-button text-lg px-8 py-4">
              Register Now - Limited Spots Available
            </a>
            <a href="/contact" className="bg-slate-600 hover:bg-slate-500 text-white px-8 py-4 rounded-lg font-bold transition-colors">
              Contact for Group Rates
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}