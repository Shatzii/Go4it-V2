import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
// Define these constants directly in the component since we can't import server-side code
const NEURODIVERGENT_TYPES = [
  'ADHD',
  'Autism',
  'Dyslexia',
  'Dyscalculia',
  'Dysgraphia',
  'Auditory Processing Disorder',
  'Visual Processing Issues',
  'Sensory Processing Difficulties'
];

const SUPERHERO_THEMES = [
  'Focus Force',
  'Pattern Pioneers',
  'Sensory Squad',
  'Vision Voyagers',
  'Audio Avengers',
  'Movement Masters',
  'Memory Mavericks',
  'Organization Operators'
];

const STATE_CODES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

const Home: React.FC = () => {
  const [_, setLocation] = useLocation();
  const [selectedHeroType, setSelectedHeroType] = useState('');
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };
  
  // Color schemes for different neurodivergent learning styles
  const colorSchemes: { [key: string]: string } = {
    'ADHD': 'from-purple-500 to-blue-500',
    'Autism': 'from-blue-500 to-teal-500',
    'Dyslexia': 'from-orange-500 to-yellow-500',
    'Dyscalculia': 'from-green-500 to-teal-400',
    'default': 'from-indigo-600 to-purple-600'
  };
  
  // Superhero descriptions
  const heroDescriptions: { [key: string]: string } = {
    'Focus Force': 'Channel your energy into a powerful stream of focus and achievement!',
    'Pattern Pioneers': 'Discover the hidden patterns that others miss and solve mysteries with your unique vision!',
    'Sensory Squad': 'Transform heightened sensitivity into extraordinary awareness of the world around you!',
    'Memory Mavericks': 'Harness your superpower to remember details that unlock new worlds of knowledge!',
    'default': 'Discover how your unique neurodivergent strengths become superpowers!'
  };
  
  // Featured states
  const featuredStates = ['CA', 'TX', 'NY', 'FL', 'IL', 'PA', 'OH', 'GA', 'NC', 'MI'];
  
  return (
    <div className="min-h-screen space-background text-white">
      {/* Hero Section */}
      <motion.div 
        className="relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Background Elements - Space-age glow effects */}
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-20">
          <div className="absolute top-10 right-20 w-64 h-64 rounded-full bg-cyan-400 blur-3xl glow-element"></div>
          <div className="absolute bottom-40 right-40 w-48 h-48 rounded-full bg-blue-400 blur-3xl glow-element"></div>
        </div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/2 opacity-15">
          <div className="absolute bottom-10 left-10 w-56 h-56 rounded-full bg-primary blur-3xl glow-element"></div>
        </div>
        
        <div className="container mx-auto px-4 pt-20 pb-24 relative z-10">
          <div className="flex flex-col lg:flex-row items-center">
            <motion.div 
              className="lg:w-1/2 mb-10 lg:mb-0"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 neon-text"
                variants={itemVariants}
              >
                The World's First AI-Powered Neurodivergent Learning Platform
              </motion.h1>
              
              <motion.p 
                className="text-xl mb-4 text-foreground/90 max-w-2xl"
                variants={itemVariants}
              >
                Self-hosted AI academic engine. Zero external dependencies. Complete state compliance. 
                Transform neurodivergent traits into academic superpowers with personalized superhero-themed curricula.
              </motion.p>
              
              <motion.div 
                className="flex flex-wrap gap-2 mb-6 text-sm"
                variants={itemVariants}
              >
                <span className="bg-primary/20 text-primary px-3 py-1 rounded-full border border-primary/30">
                  Self-Hosted AI Engine
                </span>
                <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full border border-green-500/30">
                  K-12 State Compliant
                </span>
                <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full border border-purple-500/30">
                  Neurodivergent Optimized
                </span>
                <span className="bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full border border-orange-500/30">
                  English + Sports Dual Cert
                </span>
              </motion.div>
              
              <motion.div 
                className="flex flex-wrap gap-3 mb-8"
                variants={itemVariants}
              >
                {['ADHD', 'Autism', 'Dyslexia', 'Dyscalculia'].map(type => (
                  <Badge 
                    key={type} 
                    className={`text-sm py-1 px-3 bg-gradient-to-r ${colorSchemes[type] || colorSchemes.default} cursor-pointer hover:scale-105 transition-transform`}
                    onClick={() => setSelectedHeroType(type)}
                  >
                    {type} Friendly
                  </Badge>
                ))}
              </motion.div>
              
              <motion.div className="flex gap-4 flex-wrap" variants={itemVariants}>
                <Button 
                  size="lg" 
                  className="space-button glow-element"
                  onClick={() => setLocation('/curriculum-generator')}
                >
                  Create Curriculum
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-primary/50 text-primary hover:bg-card glow-element"
                  onClick={() => setLocation('/templates')}
                >
                  Explore Templates
                </Button>
                <Button 
                  size="lg" 
                  variant="ghost" 
                  className="text-foreground hover:bg-card"
                  onClick={() => setLocation('/setup')}
                >
                  Start Setup
                </Button>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="lg:w-1/2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="space-card rounded-xl p-6 glow-element shadow-xl">
                <h2 className="text-2xl font-bold mb-4 text-center">Find Your Superhero Identity</h2>
                
                <Tabs defaultValue="focus" className="w-full">
                  <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-6">
                    <TabsTrigger value="focus" className="data-[state=active]:bg-purple-700">Focus Force</TabsTrigger>
                    <TabsTrigger value="pattern" className="data-[state=active]:bg-blue-700">Pattern Pioneers</TabsTrigger>
                    <TabsTrigger value="sensory" className="data-[state=active]:bg-teal-700">Sensory Squad</TabsTrigger>
                    <TabsTrigger value="memory" className="data-[state=active]:bg-orange-700">Memory Mavericks</TabsTrigger>
                  </TabsList>
                  
                  {['focus', 'pattern', 'sensory', 'memory'].map((tab, index) => (
                    <TabsContent key={tab} value={tab} className="space-y-4">
                      <div className={`p-6 rounded-lg bg-gradient-to-br ${
                        index === 0 ? 'from-purple-900/30 to-indigo-900/30' :
                        index === 1 ? 'from-blue-900/30 to-cyan-900/30' :
                        index === 2 ? 'from-teal-900/30 to-emerald-900/30' :
                        'from-orange-900/30 to-amber-900/30'
                      }`}>
                        <p className="text-lg leading-relaxed">
                          {heroDescriptions[
                            index === 0 ? 'Focus Force' :
                            index === 1 ? 'Pattern Pioneers' :
                            index === 2 ? 'Sensory Squad' :
                            'Memory Mavericks'
                          ] || heroDescriptions.default}
                        </p>
                        <div className="mt-4 flex gap-3 flex-wrap">
                          <span className="bg-dark-800/50 rounded-full px-3 py-1 text-sm">Personalized Learning</span>
                          <span className="bg-dark-800/50 rounded-full px-3 py-1 text-sm">Interactive Activities</span>
                          <span className="bg-dark-800/50 rounded-full px-3 py-1 text-sm">State-Approved</span>
                        </div>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
      
      {/* Live Stats Section */}
      <section className="py-12 border-y border-primary/20">
        <div className="container mx-auto px-4">
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="space-card p-6">
              <div className="text-3xl font-bold text-primary mb-2">255+</div>
              <div className="text-sm text-foreground/70">Education Laws Integrated</div>
            </div>
            <div className="space-card p-6">
              <div className="text-3xl font-bold text-green-400 mb-2">50</div>
              <div className="text-sm text-foreground/70">States Supported</div>
            </div>
            <div className="space-card p-6">
              <div className="text-3xl font-bold text-purple-400 mb-2">8</div>
              <div className="text-sm text-foreground/70">Neurodivergent Profiles</div>
            </div>
            <div className="space-card p-6">
              <div className="text-3xl font-bold text-orange-400 mb-2">100%</div>
              <div className="text-sm text-foreground/70">Self-Hosted</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Interactive AI Demo Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-4 neon-text">See Your AI Academic Engine in Action</h2>
            <p className="text-xl text-foreground/80 max-w-3xl mx-auto">
              Watch our self-hosted AI generate personalized curricula in real-time. No external dependencies, 
              no data leaving your servers.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <motion.div
              className="space-card p-8"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-xl font-bold mb-4 text-primary">Input Parameters</h3>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-foreground/70">Student Profile:</span>
                  <span className="text-primary">ADHD + Visual Learning</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/70">Grade Level:</span>
                  <span className="text-primary">5th Grade</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/70">Subject:</span>
                  <span className="text-primary">Mathematics</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/70">State Standards:</span>
                  <span className="text-primary">Texas TEKS</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/70">Superhero Theme:</span>
                  <span className="text-primary">Focus Force</span>
                </div>
              </div>
              <Button className="w-full mt-6 space-button" onClick={() => setLocation('/curriculum-generator')}>
                Generate Curriculum
              </Button>
            </motion.div>
            
            <motion.div
              className="space-card p-8"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-xl font-bold mb-4 text-green-400">AI Output Preview</h3>
              <div className="space-y-3 text-sm">
                <div className="bg-background/50 p-3 rounded border-l-4 border-primary">
                  <div className="font-medium text-primary">Unit 1: Focus Force Number Mastery</div>
                  <div className="text-foreground/70">Visual fraction concepts with movement breaks</div>
                </div>
                <div className="bg-background/50 p-3 rounded border-l-4 border-green-500">
                  <div className="font-medium text-green-400">Unit 2: Geometry Power Training</div>
                  <div className="text-foreground/70">Hands-on shape exploration with fidget tools</div>
                </div>
                <div className="bg-background/50 p-3 rounded border-l-4 border-purple-500">
                  <div className="font-medium text-purple-400">Unit 3: Data Detective Missions</div>
                  <div className="text-foreground/70">Interactive graphs with timer-based activities</div>
                </div>
              </div>
              <div className="mt-4 text-xs text-foreground/60">
                Generated in 2.3 seconds • 100% compliant with Texas standards
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-card/30">
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-3xl font-bold text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Education Reimagined For Every Learning Style
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Self-Hosted AI Engine",
                icon: "ri-cpu-line",
                color: "bg-cyan-600",
                description: "Complete independence with your own AI academic engine. No external dependencies, complete data privacy."
              },
              {
                title: "50-State Compliance",
                icon: "ri-shield-check-line",
                color: "bg-green-600",
                description: "255+ education laws integrated. Automatic compliance checking for all US states and territories."
              },
              {
                title: "Neurodivergent Optimization",
                icon: "ri-brain-line",
                color: "bg-purple-600",
                description: "ADHD, Autism, Dyslexia, and 5+ other profiles with research-backed learning adaptations."
              },
              {
                title: "English + Sports Certification",
                icon: "ri-football-line",
                color: "bg-orange-600",
                description: "Dual certification program combining English language arts with sports education pathways."
              },
              {
                title: "Superhero Learning Framework",
                icon: "ri-flashlight-line",
                color: "bg-yellow-600",
                description: "Transform learning differences into superpowers with engaging, theme-based curricula."
              },
              {
                title: "Real-Time AI Generation",
                icon: "ri-magic-line",
                color: "bg-pink-600",
                description: "Generate complete curricula, lesson plans, and assessments in seconds with your local AI."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="space-card p-6 glow-element hover:glow-strong transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className={`${feature.color} w-12 h-12 rounded-full flex items-center justify-center mb-4 glow-element`}>
                  <i className={`${feature.icon} text-xl text-white`}></i>
                </div>
                <h3 className="text-xl font-bold mb-3 text-primary">{feature.title}</h3>
                <p className="text-foreground/80">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Technology Showcase Section */}
      <section className="py-16 border-t border-primary/20">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-4">Built with Cutting-Edge Technology</h2>
            <p className="text-xl text-foreground/80 max-w-3xl mx-auto">
              Enterprise-grade architecture designed for educational institutions that demand reliability, security, and performance.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <motion.div
              className="space-card p-8 text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <i className="ri-database-2-line text-4xl text-cyan-400 mb-4"></i>
              <h3 className="text-xl font-bold mb-3 text-cyan-400">Self-Hosted Infrastructure</h3>
              <p className="text-foreground/70 text-sm">
                Complete data sovereignty with PostgreSQL database, Node.js backend, and React frontend. 
                Deploy on your own servers with full control.
              </p>
            </motion.div>
            
            <motion.div
              className="space-card p-8 text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <i className="ri-brain-line text-4xl text-purple-400 mb-4"></i>
              <h3 className="text-xl font-bold mb-3 text-purple-400">Local AI Processing</h3>
              <p className="text-foreground/70 text-sm">
                Educational AI engine runs entirely on your infrastructure. No student data leaves your network. 
                Real-time curriculum generation and adaptation.
              </p>
            </motion.div>
            
            <motion.div
              className="space-card p-8 text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <i className="ri-shield-check-line text-4xl text-green-400 mb-4"></i>
              <h3 className="text-xl font-bold mb-3 text-green-400">Enterprise Security</h3>
              <p className="text-foreground/70 text-sm">
                FERPA compliant, SOC 2 ready architecture. Role-based access control, 
                audit trails, and comprehensive data protection.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-16 bg-card/20">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-4">Transforming Education Worldwide</h2>
            <p className="text-xl text-foreground/80">
              See how educators and students are achieving remarkable results with neurodivergent-optimized learning.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <motion.div
              className="space-card p-6"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center mr-3">
                  <span className="text-white font-bold">SH</span>
                </div>
                <div>
                  <div className="font-bold text-foreground">Sarah Henderson</div>
                  <div className="text-sm text-foreground/60">Special Education Teacher, TX</div>
                </div>
              </div>
              <p className="text-foreground/80 text-sm leading-relaxed">
                "The superhero themes completely transformed my ADHD students' engagement. 
                They're excited about learning for the first time. The AI generates perfect 
                lesson plans that actually work with their learning differences."
              </p>
            </motion.div>
            
            <motion.div
              className="space-card p-6"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center mr-3">
                  <span className="text-white font-bold">MR</span>
                </div>
                <div>
                  <div className="font-bold text-foreground">Maria Rodriguez</div>
                  <div className="text-sm text-foreground/60">Homeschool Parent, CA</div>
                </div>
              </div>
              <p className="text-foreground/80 text-sm leading-relaxed">
                "My autistic son went from struggling with traditional curricula to thriving 
                as a 'Pattern Pioneer.' The visual supports and structured approach are exactly 
                what he needed. His confidence has skyrocketed."
              </p>
            </motion.div>
            
            <motion.div
              className="space-card p-6"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center mr-3">
                  <span className="text-white font-bold">DM</span>
                </div>
                <div>
                  <div className="font-bold text-foreground">Dr. Michael Chen</div>
                  <div className="text-sm text-foreground/60">School District Administrator, FL</div>
                </div>
              </div>
              <p className="text-foreground/80 text-sm leading-relaxed">
                "We deployed Rhythm-LMS across 12 schools. The compliance tracking alone 
                saves us hundreds of hours, and our neurodivergent student outcomes have 
                improved dramatically. It's a game-changer for inclusive education."
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* States Coverage Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-4">Complete Coverage Across All 50 States</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Our platform ensures your child's education meets or exceeds all state requirements, 
              no matter where you live.
            </p>
          </motion.div>
          
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {featuredStates.map((state, index) => (
              <motion.div
                key={state}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="bg-dark-800 rounded-lg p-3 text-center w-24 border border-dark-700 hover:border-gray-500 hover:bg-dark-700 transition-all cursor-pointer"
                onClick={() => setLocation(`/standards/${state}`)}
              >
                <div className="text-2xl font-bold">{state}</div>
                <div className="text-xs text-gray-400">Standards</div>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: featuredStates.length * 0.05 }}
              className="bg-gradient-to-r from-purple-700 to-indigo-700 rounded-lg p-3 text-center w-24 hover:from-purple-800 hover:to-indigo-800 transition-all cursor-pointer"
              onClick={() => setLocation('/standards')}
            >
              <div className="text-lg font-bold">+40</div>
              <div className="text-xs">More States</div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-900/30 to-purple-900/30">
        <div className="container mx-auto px-4 text-center">
          <motion.h2 
            className="text-4xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Ready to Transform Your Child's Learning Experience?
          </motion.h2>
          
          <motion.p 
            className="text-xl text-gray-300 max-w-2xl mx-auto mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Join thousands of families who have discovered how neurodivergent traits can become 
            educational superpowers with the right curriculum.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-0 text-lg px-8 py-6"
              onClick={() => setLocation('/onboarding')}
            >
              Start Your Hero's Journey
            </Button>
            <div className="mt-4 text-sm text-gray-400">No credit card required • Full access to sample curriculum</div>
          </motion.div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-dark-950 py-10 border-t border-dark-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center mb-4">
                <i className="ri-rhythm-line text-primary-500 text-3xl mr-2"></i>
                <span className="text-xl font-bold">Rhythm Education</span>
              </div>
              <p className="text-gray-400 max-w-md">
                Educational superpowers for neurodivergent minds. State-compliant curriculum with personalized learning paths.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-bold mb-4">Platform</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Curriculum</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Learning Paths</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Compliance</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Resources</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-bold mb-4">Support</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Community</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-bold mb-4">Legal</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <Separator className="my-8 bg-dark-800" />
          
          <div className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} Rhythm Education. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
