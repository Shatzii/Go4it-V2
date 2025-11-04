"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
  Target, 
  Brain, 
  TrendingUp, 
  Trophy,
  Zap,
  Users,
  Video,
  LineChart,
  Rocket,
  PlayCircle,
  ChartLine,
  Bot,
  Dumbbell,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Create animated particles
    createParticles();
  }, []);

  const createParticles = () => {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    const particleCount = 50;
    particlesContainer.innerHTML = ''; // Clear existing
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      const size = Math.random() * 4 + 2;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${Math.random() * 100}vw`;
      particle.style.top = `${Math.random() * 100}vh`;
      
      const delay = Math.random() * 15;
      const duration = Math.random() * 10 + 15;
      particle.style.animationDelay = `${delay}s`;
      particle.style.animationDuration = `${duration}s`;
      
      particlesContainer.appendChild(particle);
    }
  };

  return (
    <div className="hud-bg min-h-screen relative overflow-hidden">
      {/* Animated Background Particles */}
      <div className="particles" id="particles"></div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center text-center px-4 pt-20 pb-32">
        <div className="max-w-5xl mx-auto relative z-10">
          <span className="inline-block px-4 py-2 rounded-full text-xs font-black tracking-wider uppercase text-[#36E4FF] bg-[#36E4FF]/10 border border-[#36E4FF]/30 mb-6">
            International Combine 2025
          </span>
          
          <h1 className="text-5xl md:text-8xl font-black text-white leading-tight mb-6">
            UNLEASH YOUR{" "}
            <span className="text-neon">POTENTIAL</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-[#AAB2C3] max-w-3xl mx-auto mb-8">
            Film. Metrics. AI Coach. Ages 12–18 — Soccer • Basketball • Flag Football
          </p>

          {/* Hero Stats */}
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            <div className="text-center">
              <div className="text-5xl font-black text-[#00D4FF] mb-2" style={{ textShadow: '0 0 12px rgba(0,212,255,.45)' }}>
                89%
              </div>
              <div className="text-sm text-[#AAB2C3] uppercase tracking-wider">GAR Score Avg</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-black text-[#00D4FF] mb-2" style={{ textShadow: '0 0 12px rgba(0,212,255,.45)' }}>
                2.4K
              </div>
              <div className="text-sm text-[#AAB2C3] uppercase tracking-wider">Athletes</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-black text-[#00D4FF] mb-2" style={{ textShadow: '0 0 12px rgba(0,212,255,.45)' }}>
                98%
              </div>
              <div className="text-sm text-[#AAB2C3] uppercase tracking-wider">Satisfaction</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/auth/signup">
              <Button 
                size="lg" 
                className="pulse-animation bg-gradient-to-r from-[#00D4FF] to-[#36E4FF] hover:from-[#00D4FF]/90 hover:to-[#36E4FF]/90 text-slate-900 font-black text-lg px-8 py-6 rounded-xl shadow-[0_0_28px_rgba(0,212,255,.25)]"
              >
                <Rocket className="mr-2 w-5 h-5" />
                Register Now
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button 
                size="lg" 
                variant="outline"
                className="border-2 border-[#00D4FF]/30 bg-[#0E1424]/50 text-white hover:bg-[#00D4FF]/10 hover:border-[#00D4FF] text-lg px-8 py-6 rounded-xl backdrop-blur-sm"
              >
                <PlayCircle className="mr-2 w-5 h-5" />
                Watch Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 px-4" id="features">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 rounded-full text-xs font-black tracking-wider uppercase text-[#36E4FF] bg-[#36E4FF]/10 border border-[#36E4FF]/30 mb-4">
              Why Choose GO4IT
            </span>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-4">
              Next-Level{" "}
              <span className="text-neon">Athlete Development</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Feature Card 1 */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#00D4FF]/20 to-transparent rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
              <div className="relative bg-[#0E1424]/80 backdrop-blur-sm border border-[#1A2030] rounded-2xl p-8 hover:border-[#00D4FF]/50 transition-all">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#00D4FF]/20 to-[#36E4FF]/20 flex items-center justify-center mb-6 border border-[#00D4FF]/30">
                  <ChartLine className="w-8 h-8 text-[#00D4FF]" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Advanced Analytics</h3>
                <p className="text-[#AAB2C3] mb-6">Real-time performance tracking with our proprietary GAR scoring system.</p>
                
                {/* Metric Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-white">Data Accuracy</span>
                    <span className="text-[#00D4FF]">95%</span>
                  </div>
                  <div className="h-3 rounded-full bg-[#0e1628] overflow-hidden shadow-[inset_0_0_0_1px_rgba(0,212,255,.2)]">
                    <div 
                      className="h-full bg-gradient-to-r from-[#00D4FF] to-[#36E4FF] rounded-full relative"
                      style={{ width: '95%' }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/50 animate-[shine_2s_infinite]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Card 2 */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#00D4FF]/20 to-transparent rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
              <div className="relative bg-[#0E1424]/80 backdrop-blur-sm border border-[#1A2030] rounded-2xl p-8 hover:border-[#00D4FF]/50 transition-all">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#00D4FF]/20 to-[#36E4FF]/20 flex items-center justify-center mb-6 border border-[#00D4FF]/30">
                  <Bot className="w-8 h-8 text-[#00D4FF]" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">AI Coaching</h3>
                <p className="text-[#AAB2C3] mb-6">Personalized training programs powered by machine learning algorithms.</p>
                
                {/* Metric Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-white">Improvement Rate</span>
                    <span className="text-[#00D4FF]">87%</span>
                  </div>
                  <div className="h-3 rounded-full bg-[#0e1628] overflow-hidden shadow-[inset_0_0_0_1px_rgba(0,212,255,.2)]">
                    <div 
                      className="h-full bg-gradient-to-r from-[#00D4FF] to-[#36E4FF] rounded-full relative"
                      style={{ width: '87%' }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/50 animate-[shine_2s_infinite]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Card 3 */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#00D4FF]/20 to-transparent rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
              <div className="relative bg-[#0E1424]/80 backdrop-blur-sm border border-[#1A2030] rounded-2xl p-8 hover:border-[#00D4FF]/50 transition-all">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#00D4FF]/20 to-[#36E4FF]/20 flex items-center justify-center mb-6 border border-[#00D4FF]/30">
                  <Video className="w-8 h-8 text-[#00D4FF]" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Film Analysis</h3>
                <p className="text-[#AAB2C3] mb-6">Break down every play with our advanced video analysis tools.</p>
                
                {/* Metric Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-white">Processing Speed</span>
                    <span className="text-[#00D4FF]">2.3s</span>
                  </div>
                  <div className="h-3 rounded-full bg-[#0e1628] overflow-hidden shadow-[inset_0_0_0_1px_rgba(0,212,255,.2)]">
                    <div 
                      className="h-full bg-gradient-to-r from-[#00D4FF] to-[#36E4FF] rounded-full relative"
                      style={{ width: '100%' }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/50 animate-[shine_2s_infinite]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-transparent to-[#0B0F1A]" id="programs">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 rounded-full text-xs font-black tracking-wider uppercase text-[#36E4FF] bg-[#36E4FF]/10 border border-[#36E4FF]/30 mb-4">
              Our Programs
            </span>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-4">
              Sport-Specific{" "}
              <span className="text-neon">Training</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Soccer */}
            <div className="bg-[#0E1424]/50 backdrop-blur-sm border border-[#1A2030] rounded-2xl p-8 text-center hover:border-[#00D4FF]/50 transition-all">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#00D4FF]/20 to-[#36E4FF]/20 flex items-center justify-center mx-auto mb-6 border border-[#00D4FF]/30">
                <Target className="w-10 h-10 text-[#00D4FF]" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Soccer</h3>
              <p className="text-[#AAB2C3] mb-6">Technical skills, tactical awareness, and physical conditioning.</p>
              <div className="flex flex-wrap gap-2 justify-center mb-6">
                <span className="px-3 py-1 rounded-full bg-[#00D4FF]/10 border border-[#00D4FF]/30 text-[#36E4FF] text-sm font-bold">Denver</span>
                <span className="px-3 py-1 rounded-full bg-[#00D4FF]/10 border border-[#00D4FF]/30 text-[#36E4FF] text-sm font-bold">Vienna</span>
                <span className="px-3 py-1 rounded-full bg-[#00D4FF]/10 border border-[#00D4FF]/30 text-[#36E4FF] text-sm font-bold">Online</span>
              </div>
              <Link href="/academy">
                <Button variant="outline" className="border-[#00D4FF]/30 text-white hover:bg-[#00D4FF]/10 hover:border-[#00D4FF]">
                  Learn More
                </Button>
              </Link>
            </div>

            {/* Basketball */}
            <div className="bg-[#0E1424]/50 backdrop-blur-sm border border-[#1A2030] rounded-2xl p-8 text-center hover:border-[#00D4FF]/50 transition-all">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#00D4FF]/20 to-[#36E4FF]/20 flex items-center justify-center mx-auto mb-6 border border-[#00D4FF]/30">
                <Trophy className="w-10 h-10 text-[#00D4FF]" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Basketball</h3>
              <p className="text-[#AAB2C3] mb-6">Shooting, ball handling, and basketball IQ development.</p>
              <div className="flex flex-wrap gap-2 justify-center mb-6">
                <span className="px-3 py-1 rounded-full bg-[#00D4FF]/10 border border-[#00D4FF]/30 text-[#36E4FF] text-sm font-bold">Denver</span>
                <span className="px-3 py-1 rounded-full bg-[#00D4FF]/10 border border-[#00D4FF]/30 text-[#36E4FF] text-sm font-bold">Online</span>
              </div>
              <Link href="/academy">
                <Button variant="outline" className="border-[#00D4FF]/30 text-white hover:bg-[#00D4FF]/10 hover:border-[#00D4FF]">
                  Learn More
                </Button>
              </Link>
            </div>

            {/* Flag Football */}
            <div className="bg-[#0E1424]/50 backdrop-blur-sm border border-[#1A2030] rounded-2xl p-8 text-center hover:border-[#00D4FF]/50 transition-all">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#00D4FF]/20 to-[#36E4FF]/20 flex items-center justify-center mx-auto mb-6 border border-[#00D4FF]/30">
                <Trophy className="w-10 h-10 text-[#00D4FF]" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Flag Football</h3>
              <p className="text-[#AAB2C3] mb-6">Speed, agility, and strategic gameplay development.</p>
              <div className="flex flex-wrap gap-2 justify-center mb-6">
                <span className="px-3 py-1 rounded-full bg-[#00D4FF]/10 border border-[#00D4FF]/30 text-[#36E4FF] text-sm font-bold">Denver</span>
                <span className="px-3 py-1 rounded-full bg-[#00D4FF]/10 border border-[#00D4FF]/30 text-[#36E4FF] text-sm font-bold">Vienna</span>
              </div>
              <Link href="/academy">
                <Button variant="outline" className="border-[#00D4FF]/30 text-white hover:bg-[#00D4FF]/10 hover:border-[#00D4FF]">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative py-20 px-4" id="testimonials">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 rounded-full text-xs font-black tracking-wider uppercase text-[#36E4FF] bg-[#36E4FF]/10 border border-[#36E4FF]/30 mb-4">
              Success Stories
            </span>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-4">
              Athlete{" "}
              <span className="text-neon">Testimonials</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Testimonial 1 */}
            <div className="bg-[#0E1424]/80 backdrop-blur-sm border border-[#1A2030] rounded-2xl p-8 hover:border-[#00D4FF]/50 transition-all">
              <p className="text-[#AAB2C3] text-lg mb-6 leading-relaxed">
                &ldquo;The GO4IT Combine completely transformed my approach to training. The data-driven insights helped me identify weaknesses I didn&apos;t even know I had. My GAR score improved by 22 points in just 3 months!&rdquo;
              </p>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#00D4FF] to-[#36E4FF] flex items-center justify-center text-white font-black text-lg">
                  JE
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg">Jayden Ellis</h4>
                  <p className="text-[#AAB2C3] text-sm">WR, Colorado State Commit</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-[#0E1424]/80 backdrop-blur-sm border border-[#1A2030] rounded-2xl p-8 hover:border-[#00D4FF]/50 transition-all">
              <p className="text-[#AAB2C3] text-lg mb-6 leading-relaxed">
                &ldquo;As a soccer player, the film analysis tools were game-changing. Being able to break down every touch and movement helped me refine my technique in ways I never thought possible. Highly recommend!&rdquo;
              </p>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#00D4FF] to-[#36E4FF] flex items-center justify-center text-white font-black text-lg">
                  SM
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg">Sophia Martinez</h4>
                  <p className="text-[#AAB2C3] text-sm">Forward, U17 National Team</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-32 px-4" id="register">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00D4FF]/5 to-transparent"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="inline-block px-4 py-2 rounded-full text-xs font-black tracking-wider uppercase text-[#36E4FF] bg-[#36E4FF]/10 border border-[#36E4FF]/30 mb-6">
            Limited Spots Available
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
            Ready to{" "}
            <span className="text-neon">Elevate Your Game</span>?
          </h2>
          <p className="text-xl text-[#AAB2C3] mb-12">
            Join thousands of athletes who have transformed their performance with GO4IT Combine.
          </p>

          <Link href="/auth/signup">
            <Button 
              size="lg"
              className="pulse-animation bg-gradient-to-r from-[#00D4FF] to-[#36E4FF] hover:from-[#00D4FF]/90 hover:to-[#36E4FF]/90 text-slate-900 font-black text-xl px-12 py-8 rounded-xl shadow-[0_0_38px_rgba(0,212,255,.35)]"
            >
              <Zap className="mr-2 w-6 h-6" />
              Register Now
            </Button>
          </Link>

          <div className="flex flex-wrap gap-3 justify-center mt-12">
            <span className="inline-flex items-center justify-center min-w-[140px] px-4 py-3 rounded-xl bg-transparent border border-[#00D4FF]/35 shadow-[0_0_18px_rgba(0,212,255,.15)_inset] font-black text-white text-sm tracking-wide">
              NEXTUP PROSPECT
            </span>
            <span className="inline-flex items-center justify-center min-w-[140px] px-4 py-3 rounded-xl bg-transparent border border-[#00D4FF]/35 shadow-[0_0_18px_rgba(0,212,255,.15)_inset] font-black text-white text-sm tracking-wide">
              ELITE SPEED
            </span>
            <span className="inline-flex items-center justify-center min-w-[140px] px-4 py-3 rounded-xl bg-transparent border border-[#00D4FF]/35 shadow-[0_0_18px_rgba(0,212,255,.15)_inset] font-black text-white text-sm tracking-wide">
              AI COACHING
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
