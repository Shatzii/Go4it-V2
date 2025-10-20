'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Globe,
  Mic,
  Volume2,
  BookOpen,
  MessageCircle,
  Star,
  Trophy,
  Target,
  TrendingUp,
  Users,
  Play,
  Pause,
  RotateCcw,
  Headphones,
  Camera,
  Flag,
  Award,
  Clock,
  Brain,
  Heart,
} from 'lucide-react';

// Global Language Academy Student Data
const languageStudentData = {
  name: 'Sofia Rodriguez',
  level: 'Intermediate B1',
  school: 'Global Language Academy',
  avatar: 'SR',
  primaryLanguage: 'Spanish',
  targetLanguage: 'English',
  weeklyGoal: 10, // hours
  currentProgress: 7.5,
  streakDays: 15,
  skills: [
    { name: 'Speaking', level: 72, target: 80, icon: Mic },
    { name: 'Listening', level: 85, target: 90, icon: Headphones },
    { name: 'Reading', level: 78, target: 85, icon: BookOpen },
    { name: 'Writing', level: 65, target: 75, icon: BookOpen },
    { name: 'Vocabulary', level: 680, target: 800, icon: Brain, isCount: true },
  ],
  recentActivities: [
    {
      type: 'conversation',
      topic: 'Daily Routines',
      duration: '15 min',
      score: 88,
      language: 'English',
    },
    {
      type: 'listening',
      topic: 'News Podcast',
      duration: '20 min',
      score: 92,
      language: 'English',
    },
    {
      type: 'grammar',
      topic: 'Past Perfect Tense',
      duration: '10 min',
      score: 76,
      language: 'English',
    },
  ],
  languages: [
    { name: 'English', flag: '🇺🇸', level: 'B1', progress: 72, isActive: true },
    { name: 'French', flag: '🇫🇷', level: 'A2', progress: 45, isActive: false },
    { name: 'Mandarin', flag: '🇨🇳', level: 'A1', progress: 20, isActive: false },
  ],
  upcomingLessons: [
    {
      time: '2:00 PM',
      type: 'Live Conversation',
      teacher: 'Ms. Johnson',
      topic: 'Travel & Tourism',
    },
    {
      time: '4:30 PM',
      type: 'Grammar Workshop',
      teacher: 'Prof. Williams',
      topic: 'Conditional Sentences',
    },
  ],
};

// Language Dashboard Header
function LanguageDashboardHeader() {
  return (
    <div className="bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-600 p-6 rounded-lg mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16 border-4 border-white/30">
            <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white font-bold text-xl">
              {languageStudentData.avatar}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold text-white">{languageStudentData.name}</h2>
            <p className="text-emerald-200">
              {languageStudentData.level} • {languageStudentData.school}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Badge className="bg-white/20 text-white">
                🇪🇸 {languageStudentData.primaryLanguage}
              </Badge>
              <span className="text-white">→</span>
              <Badge className="bg-white/20 text-white">
                🇺🇸 {languageStudentData.targetLanguage}
              </Badge>
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-3xl font-bold text-white">
            {languageStudentData.currentProgress}h
          </div>
          <div className="text-emerald-200">This Week / {languageStudentData.weeklyGoal}h Goal</div>
          <Progress
            value={(languageStudentData.currentProgress / languageStudentData.weeklyGoal) * 100}
            className="w-32 mt-2"
          />
          <div className="mt-2 text-cyan-300 font-semibold">
            🔥 {languageStudentData.streakDays} Day Streak!
          </div>
        </div>
      </div>
    </div>
  );
}

// Language Skills Progress
function LanguageSkillsProgress() {
  return (
    <Card className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-blue-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-400">
          <Target className="w-5 h-5" />
          Language Skills Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {languageStudentData.skills.map((skill, i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-4 bg-black/30 rounded-lg border border-blue-400/30"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                <skill.icon className="w-6 h-6 text-white" />
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-white">{skill.name}</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">
                      {skill.isCount ? `${skill.level} words` : `${skill.level}%`}
                    </span>
                    <span className="text-xs text-blue-400">
                      Target: {skill.isCount ? `${skill.target} words` : `${skill.target}%`}
                    </span>
                  </div>
                </div>
                <Progress
                  value={skill.isCount ? (skill.level / skill.target) * 100 : skill.level}
                  className="h-2"
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Recent Learning Activities
function RecentActivities() {
  return (
    <Card className="bg-gradient-to-br from-green-500/20 to-teal-500/20 border-green-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-400">
          <Clock className="w-5 h-5" />
          Recent Learning Sessions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {languageStudentData.recentActivities.map((activity, i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-4 bg-black/30 rounded-lg border border-green-400/30"
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  activity.type === 'conversation'
                    ? 'bg-pink-500'
                    : activity.type === 'listening'
                      ? 'bg-blue-500'
                      : 'bg-purple-500'
                }`}
              >
                {activity.type === 'conversation' && (
                  <MessageCircle className="w-6 h-6 text-white" />
                )}
                {activity.type === 'listening' && <Headphones className="w-6 h-6 text-white" />}
                {activity.type === 'grammar' && <BookOpen className="w-6 h-6 text-white" />}
              </div>

              <div className="flex-1">
                <h4 className="font-semibold text-white capitalize">
                  {activity.type}: {activity.topic}
                </h4>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-gray-400">{activity.language}</span>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-500">Score: {activity.score}%</Badge>
                    <span className="text-xs text-gray-400">{activity.duration}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Language Learning Dashboard
function LanguageLearningDashboard() {
  return (
    <Tabs defaultValue="practice" className="w-full">
      <TabsList className="grid w-full grid-cols-3 bg-gray-800">
        <TabsTrigger value="practice">Practice Hub</TabsTrigger>
        <TabsTrigger value="languages">My Languages</TabsTrigger>
        <TabsTrigger value="schedule">Schedule</TabsTrigger>
      </TabsList>

      <TabsContent value="practice">
        <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-400">
              <Play className="w-5 h-5" />
              Interactive Practice
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button className="h-20 bg-pink-600 hover:bg-pink-700 flex-col">
                <Mic className="w-6 h-6 mb-2" />
                <span>Speaking Practice</span>
              </Button>
              <Button className="h-20 bg-blue-600 hover:bg-blue-700 flex-col">
                <Headphones className="w-6 h-6 mb-2" />
                <span>Listening Exercise</span>
              </Button>
              <Button className="h-20 bg-green-600 hover:bg-green-700 flex-col">
                <BookOpen className="w-6 h-6 mb-2" />
                <span>Reading Comprehension</span>
              </Button>
              <Button className="h-20 bg-purple-600 hover:bg-purple-700 flex-col">
                <MessageCircle className="w-6 h-6 mb-2" />
                <span>Live Conversation</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="languages">
        <Card className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-cyan-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-cyan-400">
              <Globe className="w-5 h-5" />
              Language Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {languageStudentData.languages.map((language, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-lg border ${
                    language.isActive
                      ? 'bg-cyan-500/20 border-cyan-400'
                      : 'bg-black/30 border-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{language.flag}</span>
                      <div>
                        <h4 className="font-semibold text-white">{language.name}</h4>
                        <Badge className={language.isActive ? 'bg-cyan-500' : 'bg-gray-500'}>
                          {language.level}
                        </Badge>
                      </div>
                    </div>
                    {language.isActive && <Badge className="bg-green-500">Active</Badge>}
                  </div>
                  <Progress value={language.progress} className="h-2" />
                  <div className="text-xs text-gray-400 mt-1">{language.progress}% Complete</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="schedule">
        <Card className="bg-gradient-to-br from-orange-500/20 to-red-500/20 border-orange-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-400">
              <Clock className="w-5 h-5" />
              Today's Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {languageStudentData.upcomingLessons.map((lesson, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-4 bg-black/30 rounded-lg border border-orange-400/30"
                >
                  <div className="text-center">
                    <div className="text-lg font-bold text-orange-400">{lesson.time}</div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">{lesson.type}</h4>
                    <p className="text-sm text-gray-400">{lesson.teacher}</p>
                    <p className="text-xs text-orange-400">{lesson.topic}</p>
                  </div>
                  <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                    Join
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

export default function LanguageAcademyStudentDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 text-white p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <LanguageDashboardHeader />

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            <LanguageSkillsProgress />
            <LanguageLearningDashboard />
          </div>

          <div className="space-y-6">
            <RecentActivities />

            <Card className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-400">
                  <Trophy className="w-5 h-5" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-2 bg-black/30 rounded">
                    <Trophy className="w-6 h-6 text-yellow-400" />
                    <span className="text-sm">15-Day Streak</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 bg-black/30 rounded">
                    <Star className="w-6 h-6 text-blue-400" />
                    <span className="text-sm">B1 Level Reached</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 bg-black/30 rounded">
                    <Heart className="w-6 h-6 text-pink-400" />
                    <span className="text-sm">Conversation Master</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
