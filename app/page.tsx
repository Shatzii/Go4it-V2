"use client";

import { useState } from "react";
import { LeadForm } from "@/components/marketing/LeadForm";
import { Button } from "@/components/ui/button";
import { 
  Target, 
  Brain, 
  TrendingUp, 
  Award, 
  Zap, 
  Users, 
  CheckCircle2,
  ArrowRight,
  Star,
  Trophy,
  LineChart,
  GraduationCap
} from "lucide-react";

export default function LandingPage() {
  const [showLeadForm, setShowLeadForm] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-20 pb-32">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-lime-400/10 border border-lime-400/20">
              <Zap className="w-4 h-4 text-lime-400" />
              <span className="text-lime-400 text-sm font-medium">AI-Powered Athletic Development</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
              Go Beyond Limits.{" "}
              <span className="bg-gradient-to-r from-lime-400 to-emerald-500 bg-clip-text text-transparent">
                Go4It.
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto">
              The only platform built specifically for neurodivergent student athletes, combining 
              <span className="text-lime-400 font-semibold"> GAR Analytics</span>, 
              <span className="text-emerald-400 font-semibold"> NCAA Pathways</span>, and 
              <span className="text-cyan-400 font-semibold"> Recruitment Automation</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-lime-400 to-emerald-500 text-slate-900 font-semibold text-lg px-8 py-6 hover:from-lime-500 hover:to-emerald-600"
                onClick={() => setShowLeadForm(true)}
                data-testid="button-hero-cta"
              >
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-slate-700 text-white hover:bg-slate-800 text-lg px-8 py-6"
                data-testid="button-watch-demo"
              >
                Watch Demo
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 max-w-4xl mx-auto">
              <div className="text-center">
                <CheckCircle2 className="w-5 h-5 text-lime-400 mx-auto mb-2" />
                <p className="text-sm text-slate-400">Instant GAR scoring (less than 2 min)</p>
              </div>
              <div className="text-center">
                <CheckCircle2 className="w-5 h-5 text-lime-400 mx-auto mb-2" />
                <p className="text-sm text-slate-400">40% higher recruiter responses</p>
              </div>
              <div className="text-center">
                <CheckCircle2 className="w-5 h-5 text-lime-400 mx-auto mb-2" />
                <p className="text-sm text-slate-400">ADHD-friendly Focus Mode</p>
              </div>
              <div className="text-center">
                <CheckCircle2 className="w-5 h-5 text-lime-400 mx-auto mb-2" />
                <p className="text-sm text-slate-400">NCAA eligibility tracking</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gap Year Program Section */}
      <section className="px-4 py-20 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-400/10 border border-emerald-400/20">
                <Trophy className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 text-sm font-medium">Flagship Program</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-white">
                Gap Year NCAA Pathway
              </h2>
              
              <p className="text-lg text-slate-300">
                Train with NFL coaching staff while completing NCAA-approved coursework. 
                Live training sessions, D1-level statistics tracking, and guaranteed recruitment support.
              </p>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-lime-400 mt-1" />
                  <div>
                    <p className="font-semibold text-white">Live NFL-Level Training</p>
                    <p className="text-slate-400 text-sm">Daily sessions with professional coaching staff</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <GraduationCap className="w-5 h-5 text-lime-400 mt-1" />
                  <div>
                    <p className="font-semibold text-white">NCAA-Approved Education</p>
                    <p className="text-slate-400 text-sm">Complete coursework for eligibility</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <LineChart className="w-5 h-5 text-lime-400 mt-1" />
                  <div>
                    <p className="font-semibold text-white">D1 Statistics Platform</p>
                    <p className="text-slate-400 text-sm">Professional-grade performance analytics</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <p className="text-3xl font-bold text-white mb-2">$999.95<span className="text-lg text-slate-400">/month</span></p>
                <Button 
                  size="lg"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold"
                  data-testid="button-gap-year-enroll"
                >
                  Enroll in Gap Year Program
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-emerald-500/20 to-lime-500/20 rounded-2xl p-8 border border-emerald-500/30">
                <div className="space-y-4">
                  <div className="bg-slate-900/80 rounded-lg p-4">
                    <p className="text-slate-400 text-sm mb-1">Success Rate</p>
                    <p className="text-3xl font-bold text-white">94%</p>
                    <p className="text-lime-400 text-sm">Athletes placed in college programs</p>
                  </div>
                  <div className="bg-slate-900/80 rounded-lg p-4">
                    <p className="text-slate-400 text-sm mb-1">Average Improvement</p>
                    <p className="text-3xl font-bold text-white">2.3x</p>
                    <p className="text-emerald-400 text-sm">Performance metrics increase</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GAR Analytics Section */}
      <section className="px-4 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-400/10 border border-cyan-400/20 mb-6">
              <Brain className="w-4 h-4 text-cyan-400" />
              <span className="text-cyan-400 text-sm font-medium">AI Video Analysis</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              GAR Analytics System
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Industry-leading video analysis providing instant performance scores and biomechanical insights
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-cyan-400/50 transition-colors">
              <Target className="w-12 h-12 text-cyan-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Instant Scoring</h3>
              <p className="text-slate-400">
                Upload video, get GAR score in under 2 minutes. AI identifies strengths and improvement areas automatically.
              </p>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-cyan-400/50 transition-colors">
              <Brain className="w-12 h-12 text-cyan-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Biomechanical Analysis</h3>
              <p className="text-slate-400">
                Advanced AI tracks movement patterns, identifies technical flaws, and suggests corrective drills.
              </p>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-cyan-400/50 transition-colors">
              <TrendingUp className="w-12 h-12 text-cyan-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Progress Tracking</h3>
              <p className="text-slate-400">
                Monitor improvement over time with detailed analytics, comparison tools, and performance trends.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-slate-300">
              Built for neurodivergent athletes with ADHD-friendly design
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Award, title: "StarPath Progression", desc: "Gamified skill tree with XP rewards for completed training" },
              { icon: Users, title: "Recruitment Automation", desc: "40% higher response rates, 91% lower outreach costs" },
              { icon: GraduationCap, title: "Academic Tracking", desc: "Monitor NCAA eligibility, grades, and coursework" },
              { icon: Brain, title: "Focus Mode", desc: "Distraction-free interface designed for ADHD brains" },
              { icon: LineChart, title: "Performance Analytics", desc: "Track every metric that matters to recruiters" },
              { icon: Trophy, title: "College Matching", desc: "AI-powered recommendations based on your profile" },
            ].map((feature, idx) => (
              <div key={idx} className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-lime-400/50 transition-colors">
                <feature.icon className="w-10 h-10 text-lime-400 mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="px-4 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Choose Your Path
            </h2>
            <p className="text-xl text-slate-300">
              Flexible plans for every athlete's journey
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Starter */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-white mb-2">Starter</h3>
              <p className="text-slate-400 mb-6">Perfect for getting started</p>
              <p className="text-4xl font-bold text-white mb-6">Free</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-lime-400 mt-0.5" />
                  <span className="text-slate-300">5 GAR video analyses</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-lime-400 mt-0.5" />
                  <span className="text-slate-300">Basic StarPath access</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-lime-400 mt-0.5" />
                  <span className="text-slate-300">Academic tracking</span>
                </li>
              </ul>
              <Button className="w-full" variant="outline" data-testid="button-starter-plan">
                Get Started Free
              </Button>
            </div>

            {/* Pro */}
            <div className="bg-gradient-to-br from-lime-500/10 to-emerald-500/10 border-2 border-lime-400 rounded-xl p-8 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-lime-400 text-slate-900 px-4 py-1 rounded-full text-sm font-semibold">
                Most Popular
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
              <p className="text-slate-400 mb-6">For serious athletes</p>
              <p className="text-4xl font-bold text-white mb-6">$29<span className="text-lg text-slate-400">/mo</span></p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-lime-400 mt-0.5" />
                  <span className="text-slate-300">Unlimited GAR analyses</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-lime-400 mt-0.5" />
                  <span className="text-slate-300">Full StarPath progression</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-lime-400 mt-0.5" />
                  <span className="text-slate-300">Recruitment automation</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-lime-400 mt-0.5" />
                  <span className="text-slate-300">College matching AI</span>
                </li>
              </ul>
              <Button className="w-full bg-lime-400 hover:bg-lime-500 text-slate-900" data-testid="button-pro-plan">
                Start Pro Trial
              </Button>
            </div>

            {/* Elite */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-white mb-2">Elite</h3>
              <p className="text-slate-400 mb-6">Maximum advantage</p>
              <p className="text-4xl font-bold text-white mb-6">$99<span className="text-lg text-slate-400">/mo</span></p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-lime-400 mt-0.5" />
                  <span className="text-slate-300">Everything in Pro</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-lime-400 mt-0.5" />
                  <span className="text-slate-300">1-on-1 coach sessions</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-lime-400 mt-0.5" />
                  <span className="text-slate-300">Custom training plans</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-lime-400 mt-0.5" />
                  <span className="text-slate-300">Priority support</span>
                </li>
              </ul>
              <Button className="w-full" variant="outline" data-testid="button-elite-plan">
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Go4It?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Join thousands of athletes already using Go4It to reach their potential
          </p>
          <Button 
            size="lg"
            className="bg-gradient-to-r from-lime-400 to-emerald-500 text-slate-900 font-semibold text-lg px-8 py-6 hover:from-lime-500 hover:to-emerald-600"
            onClick={() => setShowLeadForm(true)}
            data-testid="button-final-cta"
          >
            Start Your Free Trial
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Lead Form Modal */}
      {showLeadForm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50" onClick={() => setShowLeadForm(false)}>
          <div className="bg-slate-900 rounded-xl p-8 max-w-md w-full border border-slate-800" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-2xl font-bold text-white mb-6">Start Your Free Trial</h3>
            <LeadForm />
            <button
              onClick={() => setShowLeadForm(false)}
              className="mt-4 text-slate-400 hover:text-white text-sm"
              data-testid="button-close-modal"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
