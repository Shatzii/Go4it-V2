export default function MarketingStarPath() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            StarPath Development System
          </h1>
          <p className="text-xl text-slate-300 mb-8">
            Gamified progression tracking for neurodivergent student athletes
          </p>

          {/* Progress Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-slate-800/50 border border-slate-700 backdrop-blur-sm rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">2,850</div>
              <div className="text-sm text-slate-300">Total XP</div>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 backdrop-blur-sm rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">8</div>
              <div className="text-sm text-slate-300">Skills Mastered</div>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 backdrop-blur-sm rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">Tier 3</div>
              <div className="text-sm text-slate-300">Current Level</div>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 backdrop-blur-sm rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">12</div>
              <div className="text-sm text-slate-300">Achievements</div>
            </div>
          </div>
        </div>

        {/* Skill Tree Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {/* Ball Control Mastery - Unlocked & In Progress */}
          <div className="relative bg-slate-800/70 border-2 border-blue-600 rounded-xl p-6 hover:scale-105 transition-all duration-300 backdrop-blur-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-blue-500 text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Ball Control Mastery</h3>
                  <span className="inline-block mt-1 px-2 py-1 text-xs bg-blue-500 text-white rounded">
                    TECHNICAL
                  </span>
                </div>
              </div>
              <svg
                className="w-6 h-6 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
            </div>

            <p className="text-slate-300 mb-4">
              Master fundamental ball handling and control techniques
            </p>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Level 3/5</span>
                <span className="text-slate-400">750/1000 XP</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-blue-400 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="text-sm font-medium text-slate-300">Rewards:</div>
              <div className="flex flex-wrap gap-1">
                <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded">
                  First Touch Badge
                </span>
                <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded">
                  +10 Technical Rating
                </span>
              </div>
            </div>

            <a
              href="/starpath/training/ball-control"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M19 10a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Continue Training
            </a>

            {/* Level dots */}
            <div className="absolute top-2 right-2 flex gap-1">
              <div className="w-2 h-2 rounded-full bg-blue-400"></div>
              <div className="w-2 h-2 rounded-full bg-blue-400"></div>
              <div className="w-2 h-2 rounded-full bg-blue-400"></div>
              <div className="w-2 h-2 rounded-full bg-slate-600"></div>
              <div className="w-2 h-2 rounded-full bg-slate-600"></div>
            </div>
          </div>

          {/* Agility & Speed - Unlocked & In Progress */}
          <div className="relative bg-slate-800/70 border-2 border-green-600 rounded-xl p-6 hover:scale-105 transition-all duration-300 backdrop-blur-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-green-500 text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Agility & Speed</h3>
                  <span className="inline-block mt-1 px-2 py-1 text-xs bg-green-500 text-white rounded">
                    PHYSICAL
                  </span>
                </div>
              </div>
              <svg
                className="w-6 h-6 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
            </div>

            <p className="text-slate-300 mb-4">
              Develop explosive movement and directional changes
            </p>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Level 2/5</span>
                <span className="text-slate-400">450/600 XP</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-green-400 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="text-sm font-medium text-slate-300">Rewards:</div>
              <div className="flex flex-wrap gap-1">
                <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded">
                  Speed Demon Badge
                </span>
                <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded">
                  +8 Athleticism Rating
                </span>
              </div>
            </div>

            <a
              href="/starpath/training/agility-speed"
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M19 10a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Continue Training
            </a>

            {/* Level dots */}
            <div className="absolute top-2 right-2 flex gap-1">
              <div className="w-2 h-2 rounded-full bg-green-400"></div>
              <div className="w-2 h-2 rounded-full bg-green-400"></div>
              <div className="w-2 h-2 rounded-full bg-slate-600"></div>
              <div className="w-2 h-2 rounded-full bg-slate-600"></div>
              <div className="w-2 h-2 rounded-full bg-slate-600"></div>
            </div>
          </div>

          {/* Tactical Awareness - Mastered */}
          <div className="relative bg-slate-800/70 border-2 border-yellow-600 rounded-xl p-6 hover:scale-105 transition-all duration-300 backdrop-blur-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-purple-500 text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Tactical Awareness</h3>
                  <span className="inline-block mt-1 px-2 py-1 text-xs bg-purple-500 text-white rounded">
                    MENTAL
                  </span>
                </div>
              </div>
              <svg
                className="w-6 h-6 text-yellow-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 3l14 9-14 9V3z"
                />
              </svg>
            </div>

            <p className="text-slate-300 mb-4">Understand game situations and decision making</p>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Level 4/5</span>
                <span className="text-slate-400">920/1200 XP</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-purple-400 h-2 rounded-full" style={{ width: '77%' }}></div>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="text-sm font-medium text-slate-300">Rewards:</div>
              <div className="flex flex-wrap gap-1">
                <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded">
                  Field Vision Badge
                </span>
                <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded">
                  +12 IQ Rating
                </span>
              </div>
            </div>

            <a
              href="/starpath/training/tactical-awareness"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M19 10a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Continue Training
            </a>

            {/* Level dots */}
            <div className="absolute top-2 right-2 flex gap-1">
              <div className="w-2 h-2 rounded-full bg-purple-400"></div>
              <div className="w-2 h-2 rounded-full bg-purple-400"></div>
              <div className="w-2 h-2 rounded-full bg-purple-400"></div>
              <div className="w-2 h-2 rounded-full bg-purple-400"></div>
              <div className="w-2 h-2 rounded-full bg-slate-600"></div>
            </div>
          </div>

          {/* Clinical Finishing - Beginner */}
          <div className="relative bg-slate-800/70 border-2 border-slate-600 rounded-xl p-6 hover:scale-105 transition-all duration-300 backdrop-blur-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-orange-500 text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Clinical Finishing</h3>
                  <span className="inline-block mt-1 px-2 py-1 text-xs bg-orange-500 text-white rounded">
                    TECHNICAL
                  </span>
                </div>
              </div>
              <svg
                className="w-6 h-6 text-orange-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
            </div>

            <p className="text-slate-300 mb-4">Master shooting accuracy and composure</p>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Level 1/5</span>
                <span className="text-slate-400">150/400 XP</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-orange-400 h-2 rounded-full" style={{ width: '37%' }}></div>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="text-sm font-medium text-slate-300">Rewards:</div>
              <div className="flex flex-wrap gap-1">
                <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded">
                  Goal Scorer Badge
                </span>
                <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded">
                  +15 Finishing Rating
                </span>
              </div>
            </div>

            <a
              href="/starpath/training/clinical-finishing"
              className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M19 10a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Continue Training
            </a>

            {/* Level dots */}
            <div className="absolute top-2 right-2 flex gap-1">
              <div className="w-2 h-2 rounded-full bg-orange-400"></div>
              <div className="w-2 h-2 rounded-full bg-slate-600"></div>
              <div className="w-2 h-2 rounded-full bg-slate-600"></div>
              <div className="w-2 h-2 rounded-full bg-slate-600"></div>
              <div className="w-2 h-2 rounded-full bg-slate-600"></div>
            </div>
          </div>

          {/* Team Leadership - Locked */}
          <div className="relative bg-slate-900/50 border-2 border-slate-700 rounded-xl p-6 opacity-75">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-slate-600 text-slate-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-400">Team Leadership</h3>
                  <span className="inline-block mt-1 px-2 py-1 text-xs bg-slate-600 text-slate-400 rounded">
                    MENTAL
                  </span>
                </div>
              </div>
              <svg
                className="w-6 h-6 text-slate-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>

            <p className="text-slate-500 mb-4">Develop communication and leadership skills</p>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Level 0/5</span>
                <span className="text-slate-500">0/500 XP</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-slate-600 h-2 rounded-full" style={{ width: '0%' }}></div>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="text-sm font-medium text-slate-500">Rewards:</div>
              <div className="flex flex-wrap gap-1">
                <span className="text-xs bg-slate-700 text-slate-500 px-2 py-1 rounded">
                  Captain Badge
                </span>
                <span className="text-xs bg-slate-700 text-slate-500 px-2 py-1 rounded">
                  +20 Leadership Rating
                </span>
              </div>
            </div>

            <button className="w-full bg-slate-700 text-slate-400 py-2 px-4 rounded-lg flex items-center justify-center gap-2 cursor-not-allowed">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              Locked
            </button>

            {/* Level dots */}
            <div className="absolute top-2 right-2 flex gap-1">
              <div className="w-2 h-2 rounded-full bg-slate-600"></div>
              <div className="w-2 h-2 rounded-full bg-slate-600"></div>
              <div className="w-2 h-2 rounded-full bg-slate-600"></div>
              <div className="w-2 h-2 rounded-full bg-slate-600"></div>
              <div className="w-2 h-2 rounded-full bg-slate-600"></div>
            </div>
          </div>

          {/* Advanced Tactics - Locked */}
          <div className="relative bg-slate-900/50 border-2 border-slate-700 rounded-xl p-6 opacity-75">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-slate-600 text-slate-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-400">Advanced Tactics</h3>
                  <span className="inline-block mt-1 px-2 py-1 text-xs bg-slate-600 text-slate-400 rounded">
                    TACTICAL
                  </span>
                </div>
              </div>
              <svg
                className="w-6 h-6 text-slate-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>

            <p className="text-slate-500 mb-4">Master complex tactical concepts and formations</p>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Level 0/5</span>
                <span className="text-slate-500">0/800 XP</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-slate-600 h-2 rounded-full" style={{ width: '0%' }}></div>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="text-sm font-medium text-slate-500">Rewards:</div>
              <div className="flex flex-wrap gap-1">
                <span className="text-xs bg-slate-700 text-slate-500 px-2 py-1 rounded">
                  Tactician Badge
                </span>
                <span className="text-xs bg-slate-700 text-slate-500 px-2 py-1 rounded">
                  +25 Game IQ Rating
                </span>
              </div>
            </div>

            <button className="w-full bg-slate-700 text-slate-400 py-2 px-4 rounded-lg flex items-center justify-center gap-2 cursor-not-allowed">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              Locked
            </button>

            {/* Level dots */}
            <div className="absolute top-2 right-2 flex gap-1">
              <div className="w-2 h-2 rounded-full bg-slate-600"></div>
              <div className="w-2 h-2 rounded-full bg-slate-600"></div>
              <div className="w-2 h-2 rounded-full bg-slate-600"></div>
              <div className="w-2 h-2 rounded-full bg-slate-600"></div>
              <div className="w-2 h-2 rounded-full bg-slate-600"></div>
            </div>
          </div>
        </div>

        {/* Achievement Showcase */}
        <div className="bg-slate-800/50 border border-slate-700 backdrop-blur-sm rounded-xl p-6 mt-12">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <svg
              className="w-6 h-6 text-yellow-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
              />
            </svg>
            Recent Achievements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4 p-4 bg-slate-700/50 rounded-lg">
              <div className="p-3 bg-yellow-500 rounded-full">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3l14 9-14 9V3z"
                  />
                </svg>
              </div>
              <div>
                <div className="text-white font-medium">First Touch Master</div>
                <div className="text-sm text-slate-400">Unlocked 2 days ago</div>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-slate-700/50 rounded-lg">
              <div className="p-3 bg-blue-500 rounded-full">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
                  />
                </svg>
              </div>
              <div>
                <div className="text-white font-medium">Consistency Streak</div>
                <div className="text-sm text-slate-400">14 days training</div>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-slate-700/50 rounded-lg">
              <div className="p-3 bg-purple-500 rounded-full">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              </div>
              <div>
                <div className="text-white font-medium">Rising Star</div>
                <div className="text-sm text-slate-400">Tier 3 achieved</div>
              </div>
            </div>
          </div>
        </div>

        {/* Next Goals */}
        <div className="bg-slate-800/50 border border-slate-700 backdrop-blur-sm rounded-xl p-6 mt-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <svg
              className="w-6 h-6 text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
              />
            </svg>
            Upcoming Goals
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-white">Complete Finishing Level 2</span>
              </div>
              <span className="text-sm text-slate-400">250 XP remaining</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <span className="text-white">Unlock Team Leadership</span>
              </div>
              <span className="text-sm text-slate-400">Complete Tactical Awareness first</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                <span className="text-white">Reach Tier 4</span>
              </div>
              <span className="text-sm text-slate-400">1,150 XP remaining</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
