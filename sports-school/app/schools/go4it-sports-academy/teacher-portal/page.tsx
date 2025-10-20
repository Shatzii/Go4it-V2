'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function SportsTeacherPortal() {
  const [activeTab, setActiveTab] = useState('overview');

  const teacherData = {
    name: 'Coach Williams',
    title: 'Head Soccer Coach',
    email: 'coach.williams@go4itsports.edu',
    phone: '(555) 987-6543',
    department: 'Athletics',
  };

  const teamRoster = [
    { id: 1, name: 'Jordan Martinez', number: 12, position: 'Midfielder', grade: '11th', gpa: 3.7 },
    { id: 2, name: 'Alex Thompson', number: 9, position: 'Forward', grade: '12th', gpa: 3.2 },
    { id: 3, name: 'Sam Rodriguez', number: 5, position: 'Defender', grade: '10th', gpa: 3.9 },
    { id: 4, name: 'Taylor Kim', number: 1, position: 'Goalkeeper', grade: '11th', gpa: 3.5 },
    { id: 5, name: 'Morgan Davis', number: 7, position: 'Midfielder', grade: '12th', gpa: 3.1 },
  ];

  const upcomingGames = [
    {
      date: 'Jan 26',
      opponent: 'Central High',
      time: '4:00 PM',
      location: 'Home Field',
      type: 'League',
    },
    { date: 'Feb 2', opponent: 'North Academy', time: '2:00 PM', location: 'Away', type: 'League' },
    {
      date: 'Feb 9',
      opponent: 'East Regional',
      time: '3:30 PM',
      location: 'Home Field',
      type: 'Playoff',
    },
  ];

  const trainingSchedule = [
    { day: 'Monday', time: '3:30-5:30 PM', focus: 'Tactical Training', location: 'Main Field' },
    { day: 'Tuesday', time: '3:30-5:00 PM', focus: 'Fitness & Conditioning', location: 'Gym' },
    {
      day: 'Wednesday',
      time: '3:30-5:30 PM',
      focus: 'Skills & Drills',
      location: 'Practice Field',
    },
    { day: 'Thursday', time: '3:30-5:00 PM', focus: 'Scrimmage', location: 'Main Field' },
    { day: 'Friday', time: '3:00-4:30 PM', focus: 'Game Preparation', location: 'Classroom/Field' },
  ];

  const playerPerformance = [
    {
      player: 'Jordan Martinez',
      games: 18,
      goals: 7,
      assists: 12,
      rating: 8.5,
      notes: 'Excellent leadership',
    },
    { player: 'Alex Thompson', games: 17, goals: 12, assists: 4, rating: 8.2, notes: 'Top scorer' },
    {
      player: 'Sam Rodriguez',
      games: 18,
      goals: 1,
      assists: 3,
      rating: 7.8,
      notes: 'Solid defender',
    },
    {
      player: 'Taylor Kim',
      games: 18,
      goals: 0,
      assists: 0,
      rating: 8.0,
      notes: 'Reliable keeper',
    },
    { player: 'Morgan Davis', games: 15, goals: 3, assists: 8, rating: 7.5, notes: 'Good vision' },
  ];

  const academicTracking = [
    {
      player: 'Jordan Martinez',
      gpa: 3.7,
      attendance: '95%',
      status: 'Eligible',
      notes: 'Strong student',
    },
    {
      player: 'Alex Thompson',
      gpa: 3.2,
      attendance: '92%',
      status: 'Eligible',
      notes: 'Improving grades',
    },
    {
      player: 'Sam Rodriguez',
      gpa: 3.9,
      attendance: '98%',
      status: 'Eligible',
      notes: 'Honor roll',
    },
    {
      player: 'Taylor Kim',
      gpa: 3.5,
      attendance: '94%',
      status: 'Eligible',
      notes: 'Consistent work',
    },
    {
      player: 'Morgan Davis',
      gpa: 3.1,
      attendance: '89%',
      status: 'Watch',
      notes: 'Needs attention',
    },
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
            <h1 className="text-2xl font-bold text-white">Coach Portal</h1>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <div className="font-semibold text-white">{teacherData.name}</div>
                <div className="text-sm text-green-200">{teacherData.title}</div>
              </div>
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                {teacherData.name.charAt(0)}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-center">
              <div className="text-4xl mb-2">👥</div>
              <div className="text-2xl font-bold text-white">{teamRoster.length}</div>
              <div className="text-green-200 text-sm">Team Players</div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-center">
              <div className="text-4xl mb-2">🏆</div>
              <div className="text-2xl font-bold text-white">12-4-2</div>
              <div className="text-green-200 text-sm">Season Record</div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-center">
              <div className="text-4xl mb-2">⚽</div>
              <div className="text-2xl font-bold text-white">42</div>
              <div className="text-green-200 text-sm">Goals Scored</div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-center">
              <div className="text-4xl mb-2">📚</div>
              <div className="text-2xl font-bold text-white">3.48</div>
              <div className="text-green-200 text-sm">Team GPA</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 mb-8">
          <div className="border-b border-white/20">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', name: 'Overview', icon: '📊' },
                { id: 'roster', name: 'Team Roster', icon: '👥' },
                { id: 'performance', name: 'Performance', icon: '⚽' },
                { id: 'academic', name: 'Academic', icon: '📚' },
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
                  <h3 className="text-xl font-bold text-white mb-6">Upcoming Games</h3>
                  <div className="space-y-4">
                    {upcomingGames.map((game, index) => (
                      <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className={`px-3 py-1 rounded-full text-sm ${
                              game.type === 'League'
                                ? 'bg-blue-500/30 text-blue-200'
                                : 'bg-red-500/30 text-red-200'
                            }`}
                          >
                            {game.type}
                          </span>
                          <span className="text-green-200 text-sm">{game.time}</span>
                        </div>
                        <h4 className="font-semibold text-white mb-1">vs. {game.opponent}</h4>
                        <p className="text-green-200 text-sm">
                          {game.date} • {game.location}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white mb-6">Training Schedule</h3>
                  <div className="space-y-3">
                    {trainingSchedule.map((session, index) => (
                      <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-white">{session.day}</h4>
                          <span className="text-green-200 text-sm">{session.time}</span>
                        </div>
                        <p className="text-green-300 text-sm font-medium">{session.focus}</p>
                        <p className="text-green-200 text-sm">{session.location}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'roster' && (
              <div>
                <h3 className="text-xl font-bold text-white mb-6">Team Roster</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/20">
                        <th className="text-left py-3 px-4 text-green-200 font-semibold">#</th>
                        <th className="text-left py-3 px-4 text-green-200 font-semibold">Name</th>
                        <th className="text-left py-3 px-4 text-green-200 font-semibold">
                          Position
                        </th>
                        <th className="text-left py-3 px-4 text-green-200 font-semibold">Grade</th>
                        <th className="text-left py-3 px-4 text-green-200 font-semibold">GPA</th>
                        <th className="text-left py-3 px-4 text-green-200 font-semibold">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {teamRoster.map((player) => (
                        <tr key={player.id} className="border-b border-white/10 hover:bg-white/5">
                          <td className="py-3 px-4 text-white font-bold">{player.number}</td>
                          <td className="py-3 px-4 text-white">{player.name}</td>
                          <td className="py-3 px-4 text-green-200">{player.position}</td>
                          <td className="py-3 px-4 text-green-200">{player.grade}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-1 rounded text-sm ${
                                player.gpa >= 3.5
                                  ? 'bg-green-500/30 text-green-200'
                                  : player.gpa >= 3.0
                                    ? 'bg-yellow-500/30 text-yellow-200'
                                    : 'bg-red-500/30 text-red-200'
                              }`}
                            >
                              {player.gpa}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <button className="bg-blue-600/20 text-blue-200 px-3 py-1 rounded text-sm hover:bg-blue-600/30">
                              View Profile
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'performance' && (
              <div>
                <h3 className="text-xl font-bold text-white mb-6">Player Performance</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/20">
                        <th className="text-left py-3 px-4 text-green-200 font-semibold">Player</th>
                        <th className="text-left py-3 px-4 text-green-200 font-semibold">Games</th>
                        <th className="text-left py-3 px-4 text-green-200 font-semibold">Goals</th>
                        <th className="text-left py-3 px-4 text-green-200 font-semibold">
                          Assists
                        </th>
                        <th className="text-left py-3 px-4 text-green-200 font-semibold">Rating</th>
                        <th className="text-left py-3 px-4 text-green-200 font-semibold">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {playerPerformance.map((player, index) => (
                        <tr key={index} className="border-b border-white/10 hover:bg-white/5">
                          <td className="py-3 px-4 text-white font-semibold">{player.player}</td>
                          <td className="py-3 px-4 text-green-200">{player.games}</td>
                          <td className="py-3 px-4 text-green-200">{player.goals}</td>
                          <td className="py-3 px-4 text-green-200">{player.assists}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-1 rounded text-sm ${
                                player.rating >= 8.0
                                  ? 'bg-green-500/30 text-green-200'
                                  : player.rating >= 7.5
                                    ? 'bg-yellow-500/30 text-yellow-200'
                                    : 'bg-red-500/30 text-red-200'
                              }`}
                            >
                              {player.rating}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-green-200 text-sm">{player.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'academic' && (
              <div>
                <h3 className="text-xl font-bold text-white mb-6">Academic Tracking</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/20">
                        <th className="text-left py-3 px-4 text-green-200 font-semibold">Player</th>
                        <th className="text-left py-3 px-4 text-green-200 font-semibold">GPA</th>
                        <th className="text-left py-3 px-4 text-green-200 font-semibold">
                          Attendance
                        </th>
                        <th className="text-left py-3 px-4 text-green-200 font-semibold">
                          Eligibility
                        </th>
                        <th className="text-left py-3 px-4 text-green-200 font-semibold">Notes</th>
                        <th className="text-left py-3 px-4 text-green-200 font-semibold">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {academicTracking.map((student, index) => (
                        <tr key={index} className="border-b border-white/10 hover:bg-white/5">
                          <td className="py-3 px-4 text-white font-semibold">{student.player}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-1 rounded text-sm ${
                                student.gpa >= 3.5
                                  ? 'bg-green-500/30 text-green-200'
                                  : student.gpa >= 3.0
                                    ? 'bg-yellow-500/30 text-yellow-200'
                                    : 'bg-red-500/30 text-red-200'
                              }`}
                            >
                              {student.gpa}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-green-200">{student.attendance}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-1 rounded text-sm ${
                                student.status === 'Eligible'
                                  ? 'bg-green-500/30 text-green-200'
                                  : student.status === 'Watch'
                                    ? 'bg-yellow-500/30 text-yellow-200'
                                    : 'bg-red-500/30 text-red-200'
                              }`}
                            >
                              {student.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-green-200 text-sm">{student.notes}</td>
                          <td className="py-3 px-4">
                            <button className="bg-purple-600/20 text-purple-200 px-3 py-1 rounded text-sm hover:bg-purple-600/30">
                              Contact Parent
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
              📋 Create Practice Plan
            </button>
            <button className="bg-blue-600/20 text-blue-200 p-4 rounded-lg hover:bg-blue-600/30 transition-colors">
              📊 Game Statistics
            </button>
            <button className="bg-purple-600/20 text-purple-200 p-4 rounded-lg hover:bg-purple-600/30 transition-colors">
              📧 Send Team Email
            </button>
            <button className="bg-yellow-600/20 text-yellow-200 p-4 rounded-lg hover:bg-yellow-600/30 transition-colors">
              📅 Schedule Meeting
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
