'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NextSeo } from 'next-seo';
import { motion } from 'framer-motion';
import ErrorBoundary from '@/components/ErrorBoundary';
import { 
  Trophy, 
  Target, 
  Users, 
  Calendar, 
  Activity, 
  Award,
  Timer,
  MapPin,
  Star,
  TrendingUp,
  Heart,
  Zap,
  Medal,
  PlayCircle,
  MessageCircle,
  Brain,
  Globe,
  GraduationCap,
  Phone,
  Mail,
  Instagram,
  Send,
  CheckCircle2,
  ArrowRight,
  BarChart3,
  Sparkles,
  Clock
} from 'lucide-react';

// Safe string render helper
const safeRender = (value: any): string => {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return value.toString();
  if (value === null || value === undefined) return '';
  if (typeof value === 'boolean') return value.toString();
  return '';
};

// Custom Countdown Component
function CustomCountdown({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();
      
      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        };
      }
      
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    setTimeLeft(calculateTimeLeft());

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!mounted) {
    return (
      <div className="grid grid-cols-4 gap-4 text-center">
        <div><div className="text-3xl md:text-5xl font-bold text-white">--</div><div className="text-sm text-gray-400">Days</div></div>
        <div><div className="text-3xl md:text-5xl font-bold text-white">--</div><div className="text-sm text-gray-400">Hours</div></div>
        <div><div className="text-3xl md:text-5xl font-bold text-white">--</div><div className="text-sm text-gray-400">Minutes</div></div>
        <div><div className="text-3xl md:text-5xl font-bold text-white">--</div><div className="text-sm text-gray-400">Seconds</div></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-4 text-center">
      <div>
        <div className="text-3xl md:text-5xl font-bold text-white">{timeLeft.days}</div>
        <div className="text-sm text-gray-400">Days</div>
      </div>
      <div>
        <div className="text-3xl md:text-5xl font-bold text-white">{timeLeft.hours}</div>
        <div className="text-sm text-gray-400">Hours</div>
      </div>
      <div>
        <div className="text-3xl md:text-5xl font-bold text-white">{timeLeft.minutes}</div>
        <div className="text-sm text-gray-400">Minutes</div>
      </div>
      <div>
        <div className="text-3xl md:text-5xl font-bold text-white">{timeLeft.seconds}</div>
        <div className="text-sm text-gray-400">Seconds</div>
      </div>
    </div>
  );
}

export default function Go4itSportsAcademy() {
  const [selectedSport, setSelectedSport] = useState('basketball');
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [showChat, setShowChat] = useState(false);

  // Quiz questions data with null checks
  const quizQuestions = [
    {
      id: 'grade',
      prompt: 'What grade are you in?',
      options: ['6th-8th Grade', '9th-10th Grade', '11th-12th Grade', 'Post-Grad']
    },
    {
      id: 'commitment',
      prompt: 'Are you ready to move to campus?',
      options: ['Yes, full commitment', 'Hybrid/part-time', 'Online only', 'Not sure yet']
    },
    {
      id: 'goals',
      prompt: 'Where do you dream of playing?',
      options: ['NCAA Division I', 'Professional overseas', 'Olympic level', 'Just improve my game']
    }
  ].filter(q => q && q.id && q.prompt && Array.isArray(q.options));

  // Athletes data
  const athletes = [
    {
      id: 1,
      name: 'Jayden Knox',
      sport: 'Football',
      location: 'Dallas, TX',
      quote: 'Go4It gave me the exposure and discipline to land a D1 offer.',
      college: 'Arizona State',
      photo: '🏈'
    },
    {
      id: 2,
      name: 'Lina Gomez',
      sport: 'Soccer',
      location: 'Monterrey, MX',
      quote: 'The Vienna Showcase changed my life.',
      college: 'UCLA',
      photo: '⚽'
    },
    {
      id: 3,
      name: 'Marcus Chen',
      sport: 'Basketball',
      location: 'Vienna, AT',
      quote: 'World-class training with coaches who believe in your potential.',
      college: 'Stanford',
      photo: '🏀'
    }
  ];

  // Vienna Showcase target date
  const viennaShowcaseDate = new Date('2025-07-20T00:00:00');

  // Chat widget effect
  useEffect(() => {
    const timer = setTimeout(() => setShowChat(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleQuizAnswer = (answer) => {
    if (!answer || !quizQuestions[quizStep] || !quizQuestions[quizStep].id) return;
    
    const newAnswers = { ...quizAnswers, [quizQuestions[quizStep].id]: answer };
    setQuizAnswers(newAnswers);
    
    if (quizStep < quizQuestions.length - 1) {
      setQuizStep(quizStep + 1);
    } else {
      // Quiz complete - determine path
      const grade = newAnswers.grade;
      const commitment = newAnswers.commitment;
      
      let recommendedPath = 'Hybrid Access';
      if (grade === 'Post-Grad') {
        recommendedPath = 'Post-Grad English + Sports Year';
      } else if (commitment === 'Yes, full commitment') {
        recommendedPath = 'Full-Time Academy';
      }
      
      setQuizAnswers({ ...newAnswers, recommendedPath });
      setQuizStep(quizStep + 1);
    }
  };

  const resetQuiz = () => {
    setQuizStep(0);
    setQuizAnswers({});
  };

  return (
    <ErrorBoundary>
      <NextSeo
        title="Go4It Sports Academy – Train Global, Learn Local, Dominate Everywhere"
        description="Hybrid K‑12 sports academy + post‑grad certification. Vienna. Mexico. Dallas. Enroll now!"
        openGraph={{ 
          site_name: 'Go4It Sports Academy', 
          type: 'website',
          url: 'https://schools.shatzii.com/schools/go4it-sports-academy',
          title: 'Go4It Sports Academy – Train Global, Learn Local, Dominate Everywhere',
          description: 'Elite athletic education with Division I recruitment, residential programs, and academic excellence.',
          images: [
            {
              url: '/go4it-hero-image.jpg',
              width: 1200,
              height: 630,
              alt: 'Go4It Sports Academy'
            }
          ]
        }}
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        
        {/* Hero Section with Video Background */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Background Video Placeholder */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-slate-900/90 to-black/90 z-10"></div>
          <div className="absolute inset-0 bg-[url('/sports-hero-bg.jpg')] bg-cover bg-center opacity-20"></div>
          
          <motion.div
            className="relative z-20 text-center px-4 max-w-6xl mx-auto"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <div className="mb-8">
              <img src="/go4it-logo.png" alt="Go4It Logo" className="w-24 h-24 mx-auto mb-6" />
              <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white drop-shadow-2xl">
                Train Global. Learn Local. Dominate Everywhere.
              </h1>
              <p className="text-xl md:text-2xl text-white mb-8 max-w-4xl mx-auto font-medium drop-shadow-lg">
                Hybrid K–12 School + Post-Grad Certification for Student-Athletes Who Want It All.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                <PlayCircle className="mr-2 h-5 w-5" />
                Join the Waitlist
              </Button>
              <Button size="lg" variant="outline" className="border-green-400 text-green-400 hover:bg-green-400 hover:text-black">
                <Trophy className="mr-2 h-5 w-5" />
                Explore Programs
              </Button>
            </div>

            {/* Stats Bar */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700">
              <p className="text-lg text-gray-300 mb-4">
                📊 847 Verified Athletes • $2.4M Scholarships Earned • 156 College Commits • 73 Titles Won
              </p>
            </div>
          </motion.div>
        </section>

        {/* Chat Widget */}
        {showChat && (
          <motion.div
            className="fixed bottom-6 right-6 z-50"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-blue-600 text-white p-4 rounded-lg shadow-lg max-w-xs">
              <div className="flex items-center gap-2 mb-2">
                <MessageCircle className="h-5 w-5" />
                <span className="font-semibold">Need help choosing your track?</span>
              </div>
              <p className="text-sm mb-3">Message a Go4It Coach right now.</p>
              <Button size="sm" className="w-full bg-white text-blue-600 hover:bg-gray-100">
                Start Chat
              </Button>
            </div>
          </motion.div>
        )}

        {/* Athlete Spotlights */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">💪 Athletes Who Went 4 It</h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {athletes.map((athlete) => (
                <motion.div
                  key={athlete.id}
                  className="bg-slate-800/50 rounded-lg p-6 border border-slate-700"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-6xl mb-4 text-center">{athlete.photo}</div>
                  <h3 className="text-xl font-bold text-white mb-2 drop-shadow-md">{athlete.name}</h3>
                  <p className="text-yellow-400 mb-2 font-semibold">{athlete.sport} | {athlete.location}</p>
                  <blockquote className="text-gray-200 italic mb-4 font-medium">"{athlete.quote}"</blockquote>
                  <div className="flex items-center text-green-400">
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    <span>Now at {athlete.college}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Countdown to Vienna */}
        <section className="py-16 px-4 bg-slate-800/30">
          <div className="container mx-auto text-center">
            <div className="mb-8">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">🔥 Countdown to the Vienna Academy Showcase</h2>
              <p className="text-xl text-white mb-2 font-semibold">Train. Compete. Get Seen.</p>
              <p className="text-lg text-gray-200 font-medium">Your global shot drops July 20–26, 2025.</p>
            </div>
            
            <div className="bg-gradient-to-r from-red-600/20 to-orange-600/20 rounded-lg p-8 border border-red-400/30">
              <CustomCountdown targetDate={viennaShowcaseDate} />
            </div>
          </div>
        </section>

        {/* Choose Your Path - Program Tracks */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">📚 Choose Your Path – Program Tracks</h2>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Full-Time Academy */}
              <Card className="bg-slate-800/50 border-slate-700 hover:border-blue-400/50 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <GraduationCap className="h-6 w-6 text-blue-400" />
                    <CardTitle className="text-xl text-blue-400">🏠 Full-Time Academy</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    <li className="text-gray-200 flex items-start font-medium">
                      <Star className="h-4 w-4 mr-2 text-blue-400 mt-1 flex-shrink-0" />
                      Live on campus in Austria, Mexico, or Texas
                    </li>
                    <li className="text-gray-200 flex items-start font-medium">
                      <Star className="h-4 w-4 mr-2 text-blue-400 mt-1 flex-shrink-0" />
                      Daily training, academic support, global teammates
                    </li>
                    <li className="text-gray-200 flex items-start font-medium">
                      <Star className="h-4 w-4 mr-2 text-blue-400 mt-1 flex-shrink-0" />
                      NCAA + NIL prep built in
                    </li>
                  </ul>
                  <p className="text-sm text-gray-300 mb-4 font-medium">Perfect for: Student-athletes who want the full grind.</p>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Learn More
                  </Button>
                </CardContent>
              </Card>

              {/* Hybrid Access */}
              <Card className="bg-slate-800/50 border-slate-700 hover:border-green-400/50 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="h-6 w-6 text-green-400" />
                    <CardTitle className="text-xl text-green-400">🌐 Hybrid Access</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    <li className="text-gray-300 flex items-start">
                      <Star className="h-4 w-4 mr-2 text-green-400 mt-1 flex-shrink-0" />
                      Online classes powered by AI
                    </li>
                    <li className="text-gray-300 flex items-start">
                      <Star className="h-4 w-4 mr-2 text-green-400 mt-1 flex-shrink-0" />
                      Train in person monthly or seasonally
                    </li>
                    <li className="text-gray-300 flex items-start">
                      <Star className="h-4 w-4 mr-2 text-green-400 mt-1 flex-shrink-0" />
                      Flexible for families not ready to relocate yet
                    </li>
                  </ul>
                  <p className="text-sm text-gray-400 mb-4">Perfect for: Development year or athletes easing into recruiting.</p>
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    Learn More
                  </Button>
                </CardContent>
              </Card>

              {/* Post-Grad Program */}
              <Card className="bg-slate-800/50 border-slate-700 hover:border-orange-400/50 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="h-6 w-6 text-orange-400" />
                    <CardTitle className="text-xl text-orange-400">🎓 Post-Grad English + Sports Year</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    <li className="text-gray-300 flex items-start">
                      <Star className="h-4 w-4 mr-2 text-orange-400 mt-1 flex-shrink-0" />
                      Earn a TEFL-style certificate + coach license
                    </li>
                    <li className="text-gray-300 flex items-start">
                      <Star className="h-4 w-4 mr-2 text-orange-400 mt-1 flex-shrink-0" />
                      Keep training while we place you with a club abroad
                    </li>
                    <li className="text-gray-300 flex items-start">
                      <Star className="h-4 w-4 mr-2 text-orange-400 mt-1 flex-shrink-0" />
                      Travel. Teach. Train. Get paid.
                    </li>
                  </ul>
                  <p className="text-sm text-gray-400 mb-4">Perfect for: Graduates taking a productive gap year with global goals.</p>
                  <Button className="w-full bg-orange-600 hover:bg-orange-700">
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* GAR Score Section */}
        <section className="py-16 px-4 bg-slate-800/30">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">📈 What's Your GAR Score?</h2>
              <p className="text-xl text-white max-w-3xl mx-auto font-medium">
                We test what matters: Speed. Power. Reaction. IQ. Focus. Coachability.
                Your GAR Score (0–100) and star rating are trusted by college coaches and recruiters worldwide.
              </p>
            </div>

            <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg p-8 border border-purple-400/30 text-center">
              <div className="flex items-center justify-center gap-4 mb-6">
                <BarChart3 className="h-12 w-12 text-purple-400" />
                <div>
                  <div className="text-4xl font-bold text-white">GAR Score</div>
                  <div className="text-lg text-purple-400">Global Athletic Rating</div>
                </div>
              </div>
              <p className="text-gray-300 mb-6">
                🚀 Included in every Go4It program. Backed by data.
              </p>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Target className="mr-2 h-4 w-4" />
                Test My GAR Score
              </Button>
            </div>
          </div>
        </section>

        {/* Global Locations */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">🌍 Your Stage is Global.</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="bg-slate-800/50 border-slate-700 hover:border-red-400/50 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-xl text-red-400 flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    🇦🇹 Vienna, Austria
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">
                    High-performance training. Cultural immersion. Academic excellence.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700 hover:border-green-400/50 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-xl text-green-400 flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    🇲🇽 Mareda, Mexico
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">
                    Beachside energy. Dual-language growth. Latin American pro exposure.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700 hover:border-blue-400/50 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-xl text-blue-400 flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    🇺🇸 Dallas, Texas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">
                    Friday Night Lights. NIL-ready systems. NCAA campus visits.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* AI-Powered Education */}
        <section className="py-16 px-4 bg-slate-800/30">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">🤖 Built with AI. Backed by Mentors.</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                We don't just hand you textbooks. You get growth.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <motion.div
                className="bg-slate-800/50 rounded-lg p-6 border border-slate-700"
                whileHover={{ scale: 1.02 }}
              >
                <Brain className="h-12 w-12 text-cyan-400 mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">AI-powered learning tools</h3>
                <p className="text-gray-300">Match your style (visual, verbal, kinetic)</p>
              </motion.div>

              <motion.div
                className="bg-slate-800/50 rounded-lg p-6 border border-slate-700"
                whileHover={{ scale: 1.02 }}
              >
                <Zap className="h-12 w-12 text-yellow-400 mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Real-time tutoring</h3>
                <p className="text-gray-300">Get help when you need it most</p>
              </motion.div>

              <motion.div
                className="bg-slate-800/50 rounded-lg p-6 border border-slate-700"
                whileHover={{ scale: 1.02 }}
              >
                <TrendingUp className="h-12 w-12 text-green-400 mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">College prep</h3>
                <p className="text-gray-300">GPA, SAT, NCAA eligibility support</p>
              </motion.div>
            </div>

            <div className="text-center mt-8">
              <motion.div
                className="inline-block"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="h-8 w-8 text-yellow-400" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Social Feed Strip */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">📲 #Go4ItInAction</h2>
              <p className="text-xl text-gray-300">
                Watch real athletes train, travel, compete, and shine.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6 text-center">
                  <Instagram className="h-12 w-12 text-pink-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">🔥 Latest TikToks</h3>
                  <p className="text-gray-300">Behind-the-scenes training content</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6 text-center">
                  <PlayCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">📸 Verified Reels</h3>
                  <p className="text-gray-300">Game highlights and achievements</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6 text-center">
                  <Send className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">📣 IG Takeovers</h3>
                  <p className="text-gray-300">Live athlete experiences</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Path Quiz Interactive */}
        <section className="py-16 px-4 bg-slate-800/30">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">🧭 Not Sure Where to Start?</h2>
              <p className="text-xl text-gray-300 mb-8">
                Take 3 questions to find your best fit. We'll match you to the program that fits your goals, schedule, and game.
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              {quizStep < quizQuestions.length && quizQuestions[quizStep] ? (
                <motion.div
                  key={quizStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-slate-800/50 rounded-lg p-8 border border-slate-700"
                >
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm text-gray-400">Question {quizStep + 1} of {quizQuestions.length}</span>
                      <div className="flex gap-1">
                        {quizQuestions.map((_, index) => (
                          <div
                            key={index}
                            className={`w-3 h-3 rounded-full ${
                              index <= quizStep ? 'bg-yellow-400' : 'bg-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <h3 className="text-2xl font-semibold text-white mb-6">
                      {quizQuestions[quizStep]?.prompt || ''}
                    </h3>
                  </div>
                  
                  <div className="grid gap-3">
                    {(quizQuestions[quizStep].options || []).map((option, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="p-4 h-auto text-left justify-start border-slate-600 text-white hover:border-yellow-400 hover:bg-yellow-400/10"
                        onClick={() => handleQuizAnswer(option)}
                      >
                        <span className="w-6 h-6 rounded-full border border-gray-400 mr-3 flex-shrink-0"></span>
                        {option || ''}
                      </Button>
                    ))}
                  </div>
                </motion.div>
              ) : quizAnswers.recommendedPath ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-lg p-8 border border-green-400/30 text-center"
                >
                  <CheckCircle2 className="h-16 w-16 text-green-400 mx-auto mb-6" />
                  <h3 className="text-3xl font-bold text-white mb-4">
                    Your Path → {quizAnswers.recommendedPath || ''}
                  </h3>
                  <p className="text-gray-300 mb-6">
                    🎯 Perfect match based on your goals and preferences!
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button className="bg-green-600 hover:bg-green-700">
                      <ArrowRight className="mr-2 h-4 w-4" />
                      Apply to {quizAnswers.recommendedPath || ''}
                    </Button>
                    <Button variant="outline" onClick={resetQuiz} className="border-gray-400 text-gray-300">
                      Take Quiz Again
                    </Button>
                  </div>
                </motion.div>
              ) : null}
            </div>
          </div>
        </section>

        {/* Final CTA / Urgency Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="bg-gradient-to-r from-red-600/20 to-orange-600/20 rounded-lg p-12 border border-red-400/30 text-center">
              <h2 className="text-4xl font-bold text-white mb-4">⚡️ Fall 2025 Enrollment Is Live</h2>
              <p className="text-xl text-gray-300 mb-2">
                Vienna Showcase spots and full-year scholarships are going fast.
              </p>
              <p className="text-2xl font-bold text-orange-400 mb-8">
                This is your shot.
              </p>
              
              <div className="flex items-center justify-center gap-8 mb-8">
                <div className="flex items-center text-green-400">
                  <CheckCircle2 className="h-5 w-5 mr-2" />
                  <span>Housing</span>
                </div>
                <div className="flex items-center text-green-400">
                  <CheckCircle2 className="h-5 w-5 mr-2" />
                  <span>Training</span>
                </div>
                <div className="flex items-center text-green-400">
                  <CheckCircle2 className="h-5 w-5 mr-2" />
                  <span>Exposure</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                  <Trophy className="mr-2 h-5 w-5" />
                  Apply Now
                </Button>
                <Button size="lg" variant="outline" className="border-green-400 text-green-400 hover:bg-green-400 hover:text-black">
                  <Phone className="mr-2 h-5 w-5" />
                  Book a Discovery Call
                </Button>
                <Button size="lg" variant="outline" className="border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-black">
                  <Send className="mr-2 h-5 w-5" />
                  DM "Academy" @Go4ItSports
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-4 bg-slate-900/50">
          <div className="container mx-auto text-center">
            <div className="text-gray-400 mb-4">
              © 2025 Go4It Sports<br />
              #GetVerified #Go4ItAcademy #FuturePro #TrainGlobal #GARScore
            </div>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>academy@go4itsports.org</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Based in Vienna | Dallas | Mareda</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                <span>Powered by Shatzii + Go4It International</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
}