'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  // Removed state to make component SSR-friendly

  const schools = [
    {
      id: 'primary',
      name: 'SuperHero Elementary',
      description:
        'K-6 students discover their learning superpowers through engaging, gamified education that transforms every lesson into an adventure.',
      grades: 'Kindergarten - 6th Grade',
      students: '1,500+',
      theme: 'Adventure & Discovery',
      icon: Star,
      color: 'from-yellow-400 to-orange-500',
      bgColor: 'bg-gradient-to-br from-yellow-50 to-orange-50',
      features: [
        'Gamified Learning',
        'Character Development',
        'Creative Problem Solving',
        'Social Skills',
      ],
      link: '/schools/primary',
    },
    {
      id: 'secondary',
      name: 'S.T.A.G.E Prep Academy',
      description:
        'Academic excellence program preparing students for college and career success through rigorous coursework and leadership development.',
      grades: '7th - 12th Grade',
      students: '2,000+',
      theme: 'Academic Excellence',
      icon: GraduationCap,
      color: 'from-blue-500 to-purple-600',
      bgColor: 'bg-gradient-to-br from-blue-50 to-purple-50',
      features: [
        'Advanced Placement',
        'College Preparation',
        'Leadership Development',
        'Critical Thinking',
      ],
      link: '/schools/secondary',
    },
    {
      id: 'law',
      name: 'Future Legal Professionals',
      description:
        'Specialized program for aspiring lawyers, judges, and legal professionals with comprehensive law education and practical experience.',
      grades: 'Law School',
      students: '800+',
      theme: 'Justice & Law',
      icon: Shield,
      color: 'from-gray-700 to-blue-800',
      bgColor: 'bg-gradient-to-br from-gray-50 to-blue-50',
      features: ['Constitutional Law', 'Legal Research', 'Mock Trials', 'Professional Ethics'],
      link: '/schools/law',
    },
    {
      id: 'language',
      name: 'Global Language Academy',
      description:
        'Immersive multilingual education connecting students to world cultures through authentic language experiences and cultural exchange.',
      grades: 'All Ages',
      students: '1,500+',
      theme: 'Cultural Connection',
      icon: Globe,
      color: 'from-green-400 to-teal-500',
      bgColor: 'bg-gradient-to-br from-green-50 to-teal-50',
      features: ['12+ Languages', 'Cultural Immersion', 'Exchange Programs', 'Global Citizenship'],
      link: '/schools/language',
    },
    {
      id: 'sports',
      name: 'Go4it Sports Academy',
      description:
        'Athletic excellence combined with academic achievement and character building through comprehensive sports science and training.',
      grades: 'K-12',
      students: '1,150+',
      theme: 'Athletic Excellence',
      icon: Trophy,
      color: 'from-red-500 to-pink-600',
      bgColor: 'bg-gradient-to-br from-red-50 to-pink-50',
      features: [
        'Olympic Training',
        'Sports Science',
        'Nutrition Education',
        'Mental Conditioning',
      ],
      link: '/schools/go4it-sports-academy',
    },
  ];

  const aiTeachers = [
    { name: 'Professor Newton', subject: 'Mathematics', icon: Brain, color: 'text-blue-600' },
    { name: 'Dr. Curie', subject: 'Science', icon: Zap, color: 'text-green-600' },
    { name: 'Ms. Shakespeare', subject: 'English', icon: Heart, color: 'text-purple-600' },
    {
      name: 'Professor Timeline',
      subject: 'Social Studies',
      icon: BookOpen,
      color: 'text-orange-600',
    },
    { name: 'Maestro Picasso', subject: 'Arts', icon: Sparkles, color: 'text-pink-600' },
    { name: 'Dr. Inclusive', subject: 'Special Education', icon: Heart, color: 'text-indigo-600' },
  ];

  // Removed loading state to prevent hydration mismatch

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="relative container mx-auto px-4 py-20">
          <div className="text-center mb-20">
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-lg">
                <GraduationCap className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-800 via-purple-700 to-blue-900 bg-clip-text text-transparent mb-6">
              Universal One School
            </h1>
            <p className="text-2xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
              Where Every Student Discovers Their Unique Path to Excellence
            </p>
            <div className="flex flex-wrap justify-center gap-6 mb-12">
              <div className="flex items-center bg-white rounded-full px-6 py-3 shadow-lg border border-gray-200">
                <Users className="w-6 h-6 text-blue-600 mr-3" />
                <span className="text-lg font-semibold text-gray-800">6,950+ Students</span>
              </div>
              <div className="flex items-center bg-white rounded-full px-6 py-3 shadow-lg border border-gray-200">
                <BookOpen className="w-6 h-6 text-purple-600 mr-3" />
                <span className="text-lg font-semibold text-gray-800">5 Specialized Schools</span>
              </div>
              <div className="flex items-center bg-white rounded-full px-6 py-3 shadow-lg border border-gray-200">
                <Brain className="w-6 h-6 text-indigo-600 mr-3" />
                <span className="text-lg font-semibold text-gray-800">AI-Powered Learning</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Schools Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-4">Our Schools</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Five specialized academies designed to nurture every student's unique talents and
            aspirations
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {schools.map((school, index) => {
            const IconComponent = school.icon;
            return (
              <Card
                key={school.id}
                className={`group hover:scale-105 transition-all duration-300 border-0 shadow-xl overflow-hidden ${school.bgColor} ${
                  index === 4 ? 'lg:col-span-2 lg:max-w-4xl lg:mx-auto' : ''
                }`}
              >
                <div className={`h-2 bg-gradient-to-r ${school.color}`}></div>
                <CardHeader className="relative pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-4 rounded-full bg-gradient-to-r ${school.color} shadow-lg`}>
                      <IconComponent className="w-10 h-10 text-white" />
                    </div>
                    <Badge variant="outline" className="text-sm font-medium">
                      {school.grades}
                    </Badge>
                  </div>
                  <CardTitle className="text-3xl mb-3 text-gray-900">{school.name}</CardTitle>
                  <p className="text-gray-700 leading-relaxed text-lg">{school.description}</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between bg-white/70 rounded-lg p-4">
                    <span className="text-gray-600 font-medium">Current Students</span>
                    <span className="font-bold text-2xl text-gray-900">{school.students}</span>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-bold text-gray-900 text-lg">Key Features:</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {school.features.map((feature, idx) => (
                        <div
                          key={idx}
                          className="flex items-center text-gray-700 bg-white/70 rounded-lg p-3"
                        >
                          <Sparkles className="w-4 h-4 mr-2 text-purple-500" />
                          <span className="font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link href={school.link}>
                    <Button
                      className={`w-full bg-gradient-to-r ${school.color} hover:scale-105 transition-all duration-300 text-white font-semibold py-3 text-lg shadow-lg`}
                    >
                      Explore {school.name}
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* AI Teachers Section */}
      <div className="bg-white/50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">AI-Powered Teaching</h2>
            <p className="text-xl text-gray-600">
              Meet our six specialized AI teachers, each with unique personalities and teaching
              approaches
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aiTeachers.map((teacher, index) => {
              const IconComponent = teacher.icon;
              return (
                <Card
                  key={index}
                  className="bg-white hover:shadow-lg transition-shadow duration-300"
                >
                  <CardHeader>
                    <div className="flex items-center mb-3">
                      <IconComponent className={`w-8 h-8 mr-3 ${teacher.color}`} />
                      <div>
                        <CardTitle className="text-xl">{teacher.name}</CardTitle>
                        <p className={`font-medium ${teacher.color}`}>{teacher.subject}</p>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Begin Your Journey?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of students already discovering their potential at Universal One School
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/enrollment">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-3"
              >
                Apply Now
              </Button>
            </Link>
            <Link href="/tour">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600 font-semibold px-8 py-3"
              >
                Take a Tour
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
