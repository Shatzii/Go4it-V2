'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  GraduationCap,
  Users,
  BookOpen,
  Award,
  TrendingUp,
  Star,
  Zap,
  Brain,
  Heart,
  Shield,
  Target,
  Play,
  ChevronRight,
  Globe,
  Clock,
  UserCheck,
} from 'lucide-react';
import Link from 'next/link';

export default function EnhancedHomepage() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    coursesCompleted: 0,
    activeSchools: 0,
    satisfactionRate: 0,
  });

  const schools = [
    {
      id: 'primary',
      name: 'Primary School',
      description: 'K-6 superhero-themed learning with personalized AI support',
      href: '/schools/primary',
      color: 'blue',
      icon: Shield,
      features: ['Superhero Theme', 'K-6 Curriculum', 'AI Tutoring', 'Progress Tracking'],
      stats: '2,500+ Students',
    },
    {
      id: 'secondary',
      name: 'S.T.A.G.E Prep Global Academy',
      description: '7-12 global academy with 5 specialized career programs',
      href: '/schools/secondary',
      color: 'purple',
      icon: Target,
      features: ['Sports Science', 'Technology', 'Agriculture', 'Gaming', 'Entrepreneurship'],
      stats: '1,800+ Students',
    },
    {
      id: 'law',
      name: 'Law School',
      description: 'Legal education with case-based learning and Mason Barrett',
      href: '/schools/law',
      color: 'green',
      icon: Award,
      features: ['Case Studies', 'Mock Trials', 'Legal Research', 'Bar Prep'],
      stats: '650+ Students',
    },
    {
      id: 'language',
      name: 'Language School',
      description: 'Multilingual learning with cultural immersion',
      href: '/schools/language',
      color: 'orange',
      icon: Globe,
      features: ['50+ Languages', 'Cultural Immersion', 'Native Speakers', 'Certification'],
      stats: '3,200+ Students',
    },
    {
      id: 'sports',
      name: 'Sports Academy',
      description: 'Athletic education with performance optimization',
      href: '/schools/sports',
      color: 'red',
      icon: TrendingUp,
      features: [
        'Performance Analytics',
        'Nutrition Science',
        'Mental Training',
        'Injury Prevention',
      ],
      stats: '1,100+ Students',
    },
  ];

  const aiTeachers = [
    {
      name: 'Professor Newton',
      subject: 'Mathematics',
      specialty: 'Dyscalculia Support',
      icon: Brain,
      description: 'Advanced math concepts with personalized learning paths',
    },
    {
      name: 'Dr. Curie',
      subject: 'Science',
      specialty: 'Hands-on Experiments',
      icon: Zap,
      description: 'Interactive science experiments and real-world applications',
    },
    {
      name: 'Ms. Shakespeare',
      subject: 'English Language Arts',
      specialty: 'Dyslexia Support',
      icon: BookOpen,
      description: 'Literature and writing with multi-sensory approaches',
    },
    {
      name: 'Dr. Inclusive',
      subject: 'Special Education',
      specialty: 'Neurodivergent Support',
      icon: Heart,
      description: 'Comprehensive support for diverse learning needs',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Parent of 3rd Grader',
      content:
        'My daughter has ADHD and struggled in traditional schools. The AI support and superhero theme have transformed her learning experience.',
      rating: 5,
      school: 'Primary School',
    },
    {
      name: 'Marcus Chen',
      role: 'S.T.A.G.E Prep Student',
      content:
        'The Technology program prepared me for real-world programming. I already have internship offers!',
      rating: 5,
      school: 'S.T.A.G.E Prep',
    },
    {
      name: 'Elena Rodriguez',
      role: 'Language School Graduate',
      content:
        'I became fluent in 3 languages through the cultural immersion program. The AI tutoring is incredible.',
      rating: 5,
      school: 'Language School',
    },
  ];

  useEffect(() => {
    // Animate counters
    const animateCounter = (target: number, setter: (value: number) => void) => {
      let current = 0;
      const increment = target / 50;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          setter(target);
          clearInterval(timer);
        } else {
          setter(Math.floor(current));
        }
      }, 30);
    };

    animateCounter(9250, (value) => setStats((prev) => ({ ...prev, totalStudents: value })));
    animateCounter(15430, (value) => setStats((prev) => ({ ...prev, coursesCompleted: value })));
    animateCounter(5, (value) => setStats((prev) => ({ ...prev, activeSchools: value })));
    animateCounter(98, (value) => setStats((prev) => ({ ...prev, satisfactionRate: value })));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative container mx-auto px-4 py-24">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex justify-center items-center space-x-2 mb-6">
                <Badge className="bg-white/20 text-white border-white/30">
                  <Zap className="w-4 h-4 mr-1" />
                  AI-Powered Learning
                </Badge>
                <Badge className="bg-white/20 text-white border-white/30">
                  <Heart className="w-4 h-4 mr-1" />
                  Neurodivergent Support
                </Badge>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                Universal One School
              </h1>

              <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
                Where every student discovers their unique learning superpowers through AI-powered
                education across 5 specialized schools
              </p>

              <div className="flex flex-wrap justify-center gap-4 mb-12">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                  <Play className="w-5 h-5 mr-2" />
                  Watch Demo
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                >
                  <UserCheck className="w-5 h-5 mr-2" />
                  Get Started Free
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                {stats.totalStudents.toLocaleString()}+
              </div>
              <div className="text-gray-600">Active Students</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">
                {stats.coursesCompleted.toLocaleString()}+
              </div>
              <div className="text-gray-600">Courses Completed</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">
                {stats.activeSchools}
              </div>
              <div className="text-gray-600">Specialized Schools</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold text-orange-600 mb-2">
                {stats.satisfactionRate}%
              </div>
              <div className="text-gray-600">Satisfaction Rate</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Schools Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4" variant="secondary">
              <GraduationCap className="w-4 h-4 mr-2" />5 Specialized Schools
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Choose Your Learning Path
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Each school is designed with unique themes, specialized curricula, and AI-powered
              support tailored to different learning styles and career paths.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {schools.map((school, index) => (
              <motion.div
                key={school.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
                  <CardHeader>
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-${school.color}-500 to-${school.color}-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                    >
                      <school.icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl mb-2">{school.name}</CardTitle>
                    <CardDescription className="text-gray-600">
                      {school.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {school.features.map((feature) => (
                          <Badge key={feature} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{school.stats}</span>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                          <span>4.9</span>
                        </div>
                      </div>

                      <Link href={school.href}>
                        <Button className="w-full group-hover:bg-blue-600 transition-colors">
                          Explore School
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Teachers Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4" variant="secondary">
              <Brain className="w-4 h-4 mr-2" />
              AI-Powered Education
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Meet Your AI Teachers
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our specialized AI teachers provide personalized instruction, adaptive learning, and
              comprehensive support for neurodivergent students.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {aiTeachers.map((teacher, index) => (
              <motion.div
                key={teacher.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
                      <teacher.icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-lg">{teacher.name}</CardTitle>
                    <CardDescription className="text-blue-600 font-medium">
                      {teacher.subject}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Badge className="mb-3" variant="outline">
                      {teacher.specialty}
                    </Badge>
                    <p className="text-sm text-gray-600">{teacher.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4" variant="secondary">
              <Users className="w-4 h-4 mr-2" />
              Student Success Stories
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Transforming Lives Through Learning
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-700 mb-4 italic">"{testimonial.content}"</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-gray-900">{testimonial.name}</div>
                        <div className="text-sm text-gray-500">{testimonial.role}</div>
                      </div>
                      <Badge variant="outline">{testimonial.school}</Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Discover Your Superpowers?
            </h2>
            <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
              Join thousands of students who are already experiencing personalized, AI-powered
              education designed for every learning style.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                <GraduationCap className="w-5 h-5 mr-2" />
                Start Learning Today
              </Button>
              <Link href="/dashboards">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                >
                  <Target className="w-5 h-5 mr-2" />
                  Access Dashboard
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
