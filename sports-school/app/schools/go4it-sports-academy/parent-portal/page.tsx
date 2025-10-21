'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function SportsParentPortal() {
  const [activeTab, setActiveTab] = useState('overview');

  const studentData = {
    name: 'Jordan Martinez',
    sport: 'Soccer',
    position: 'Midfielder',
    level: 'Varsity',
    season: 'Spring 2025',
    teamNumber: 12,
    coachName: 'Coach Williams',
  };

  const parentData = {
    name: 'Maria Martinez',
    relationship: 'Mother',
    email: 'maria.martinez@email.com',
    phone: '(555) 123-4567',
  };

  const recentPerformance = [
    { date: 'Jan 20', event: 'vs. East High', performance: 'Excellent', goals: 2, assists: 1 },
    { date: 'Jan 15', event: 'vs. West Academy', performance: 'Good', goals: 0, assists: 2 },
    { date: 'Jan 10', event: 'vs. South United', performance: 'Average', goals: 1, assists: 0 },
  ];

  const upcomingEvents = [
    {
      date: 'Jan 26',
      event: 'vs. Central High',
      type: 'Game',
      time: '4:00 PM',
      location: 'Home Field',
    },
    {
      date: 'Jan 28',
      event: 'Parent-Coach Meeting',
      type: 'Meeting',
      time: '7:00 PM',
      location: 'School Office',
    },
    { date: 'Feb 2', event: 'vs. North Academy', type: 'Game', time: '2:00 PM', location: 'Away' },
  ];

  const academicProgress = [
    { subject: 'Math', grade: 'A-', teacher: 'Ms. Johnson', notes: 'Excellent progress' },
    { subject: 'English', grade: 'B+', teacher: 'Mr. Smith', notes: 'Good improvement' },
    { subject: 'Science', grade: 'A', teacher: 'Dr. Brown', notes: 'Outstanding work' },
    { subject: 'History', grade: 'B', teacher: 'Mrs. Davis', notes: 'Steady progress' },
  ];

  const healthMetrics = {
    weight: '145 lbs',
    height: '5\'8"',
    bmi: '22.0',
    lastPhysical: 'Dec 15, 2024',
    injuries: 'None',
    medications: 'None',
  };

  const nutritionPlan = [
    { meal: 'Breakfast', calories: 680, protein: 35, carbs: 75, status: 'completed' },
    { meal: 'Lunch', calories: 750, protein: 45, carbs: 85, status: 'completed' },
    { meal: 'Dinner', calories: 650, protein: 40, carbs: 60, status: 'planned' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link
              href="/schools/go4it-sports-academy"
              className="text-white font-semibold text-lg hover:text-green-300"
            >
              ← Go4it Sports Academy
            </Link>
            <h1 className="text-2xl font-bold text-white">Parent Portal</h1>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <div className="font-semibold text-white">{parentData.name}</div>
                <div className="text-sm text-green-200">
                  {parentData.relationship} of {studentData.name}
                </div>
              </div>
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                {parentData.name.charAt(0)}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Student Overview */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">{studentData.name}</h2>
              <p className="text-green-200">
                #{studentData.teamNumber} • {studentData.position} • {studentData.level}
              </p>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-white">{studentData.season}</div>
              <div className="text-sm text-green-200">Coach: {studentData.coachName}</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 mb-8">
          <div className="border-b border-white/20">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', name: 'Overview', icon: '📊' },
                { id: 'performance', name: 'Performance', icon: '⚽' },
                { id: 'academic', name: 'Academic', icon: '📚' },
                { id: 'health', name: 'Health', icon: '🏥' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-green-400 text-green-300'
                      : 'border-transparent text-white/70 hover:text-white hover:border-white/30'
                  }`}
                >
                  {tab.icon} {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-white mb-6">Upcoming Events</h3>
                  <div className="space-y-4">
                    {upcomingEvents.map((event, index) => (
                      <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className={`px-3 py-1 rounded-full text-sm ${
                              event.type === 'Game'
                                ? 'bg-red-500/30 text-red-200'
                                : event.type === 'Meeting'
                                  ? 'bg-blue-500/30 text-blue-200'
                                  : 'bg-purple-500/30 text-purple-200'
                            }`}
                          >
                            {event.type}
                          </span>
                          <span className="text-green-200 text-sm">{event.time}</span>
                        </div>
                        <h4 className="font-semibold text-white mb-1">{event.event}</h4>
                        <p className="text-green-200 text-sm">
                          {event.date} • {event.location}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white mb-6">Recent Performance</h3>
                  <div className="space-y-4">
                    {recentPerformance.map((game, index) => (
                      <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-white">{game.event}</h4>
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              game.performance === 'Excellent'
                                ? 'bg-green-500/30 text-green-200'
                                : game.performance === 'Good'
                                  ? 'bg-blue-500/30 text-blue-200'
                                  : 'bg-yellow-500/30 text-yellow-200'
                            }`}
                          >
                            {game.performance}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-center">
                          <div>
                            <div className="text-xl font-bold text-green-400">{game.goals}</div>
                            <div className="text-sm text-green-200">Goals</div>
                          </div>
                          <div>
                            <div className="text-xl font-bold text-blue-400">{game.assists}</div>
                            <div className="text-sm text-green-200">Assists</div>
                          </div>
                        </div>
                        <p className="text-green-200 text-sm mt-2">{game.date}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'performance' && (
              <div>
                <h3 className="text-xl font-bold text-white mb-6">Athletic Performance</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                    <h4 className="text-lg font-semibold text-white mb-4">Season Statistics</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-green-200">Games Played</span>
                        <span className="text-white font-semibold">18</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-200">Goals Scored</span>
                        <span className="text-white font-semibold">7</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-200">Assists</span>
                        <span className="text-white font-semibold">12</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-200">Minutes Played</span>
                        <span className="text-white font-semibold">1,440</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                    <h4 className="text-lg font-semibold text-white mb-4">Coach Notes</h4>
                    <div className="space-y-3">
                      <div className="bg-white/5 rounded p-3">
                        <div className="text-sm text-green-200 mb-1">Latest Feedback</div>
                        <p className="text-white text-sm">
                          "Jordan shows excellent leadership skills and has improved significantly
                          in tactical awareness. Keep up the great work!"
                        </p>
                      </div>
                      <div className="bg-white/5 rounded p-3">
                        <div className="text-sm text-green-200 mb-1">Areas for Improvement</div>
                        <p className="text-white text-sm">
                          "Focus on defensive positioning and communication with teammates during
                          set pieces."
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'academic' && (
              <div>
                <h3 className="text-xl font-bold text-white mb-6">Academic Progress</h3>
                <div className="space-y-4">
                  {academicProgress.map((subject, index) => (
                    <div key={index} className="bg-white/5 rounded-lg p-6 border border-white/10">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="text-lg font-semibold text-white">{subject.subject}</h4>
                          <p className="text-green-200 text-sm">{subject.teacher}</p>
                        </div>
                        <span className="text-2xl font-bold text-green-400">{subject.grade}</span>
                      </div>
                      <div className="bg-white/5 rounded p-3">
                        <div className="text-sm text-green-200 mb-1">Teacher Notes</div>
                        <p className="text-white text-sm">{subject.notes}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'health' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-white mb-6">Health Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                      <h4 className="text-lg font-semibold text-white mb-4">Physical Stats</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-green-200">Height</span>
                          <span className="text-white font-semibold">{healthMetrics.height}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-200">Weight</span>
                          <span className="text-white font-semibold">{healthMetrics.weight}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-200">BMI</span>
                          <span className="text-white font-semibold">{healthMetrics.bmi}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-200">Last Physical</span>
                          <span className="text-white font-semibold">
                            {healthMetrics.lastPhysical}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                      <h4 className="text-lg font-semibold text-white mb-4">Medical Info</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-green-200">Current Injuries</span>
                          <span className="text-white font-semibold">{healthMetrics.injuries}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-200">Medications</span>
                          <span className="text-white font-semibold">
                            {healthMetrics.medications}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white mb-6">Nutrition Tracking</h3>
                  <div className="space-y-4">
                    {nutritionPlan.map((meal, index) => (
                      <div
                        key={index}
                        className={`rounded-lg p-4 border ${
                          meal.status === 'completed'
                            ? 'bg-green-500/20 border-green-500/30'
                            : 'bg-white/5 border-white/10'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-lg font-semibold text-white">{meal.meal}</h4>
                          <span
                            className={`px-3 py-1 rounded text-sm ${
                              meal.status === 'completed'
                                ? 'bg-green-500/30 text-green-200'
                                : 'bg-yellow-500/30 text-yellow-200'
                            }`}
                          >
                            {meal.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-xl font-bold text-green-400">{meal.calories}</div>
                            <div className="text-sm text-green-200">Calories</div>
                          </div>
                          <div>
                            <div className="text-xl font-bold text-blue-400">{meal.protein}g</div>
                            <div className="text-sm text-green-200">Protein</div>
                          </div>
                          <div>
                            <div className="text-xl font-bold text-yellow-400">{meal.carbs}g</div>
                            <div className="text-sm text-green-200">Carbs</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-6">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="bg-green-600/20 text-green-200 p-4 rounded-lg hover:bg-green-600/30 transition-colors">
              📧 Message Coach
            </button>
            <button className="bg-blue-600/20 text-blue-200 p-4 rounded-lg hover:bg-blue-600/30 transition-colors">
              📅 Schedule Meeting
            </button>
            <button className="bg-purple-600/20 text-purple-200 p-4 rounded-lg hover:bg-purple-600/30 transition-colors">
              🏥 Update Health Info
            </button>
            <button className="bg-yellow-600/20 text-yellow-200 p-4 rounded-lg hover:bg-yellow-600/30 transition-colors">
              📋 View Full Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
