import React from 'react';
import { UserButton } from '@clerk/nextjs';
import { Star, Trophy, Target, Zap, Award, Lock } from 'lucide-react';

export default function StarPathPage() {
  return (
    <div className="min-h-screen bg-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <a href="/dashboard" className="text-2xl font-bold text-white">Go4It Sports</a>
            <div className="flex items-center space-x-4">
              <a href="/dashboard" className="text-blue-400 hover:text-blue-300">← Dashboard</a>
              <UserButton />
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">StarPath™</h1>
          <p className="text-slate-400">Your Interactive Skill Development Journey</p>
        </div>

        {/* Player Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="card text-center">
            <div className="text-blue-400 mb-2">
              <Star className="h-8 w-8 mx-auto" />
            </div>
            <div className="text-2xl font-bold text-white">Level 12</div>
            <div className="text-sm text-slate-400">Current Level</div>
          </div>
          <div className="card text-center">
            <div className="text-purple-400 mb-2">
              <Zap className="h-8 w-8 mx-auto" />
            </div>
            <div className="text-2xl font-bold text-white">2,450 XP</div>
            <div className="text-sm text-slate-400">Experience Points</div>
          </div>
          <div className="card text-center">
            <div className="text-yellow-400 mb-2">
              <Trophy className="h-8 w-8 mx-auto" />
            </div>
            <div className="text-2xl font-bold text-white">8</div>
            <div className="text-sm text-slate-400">Achievements</div>
          </div>
          <div className="card text-center">
            <div className="text-green-400 mb-2">
              <Target className="h-8 w-8 mx-auto" />
            </div>
            <div className="text-2xl font-bold text-white">73%</div>
            <div className="text-sm text-slate-400">Progress</div>
          </div>
        </div>

        {/* Skill Trees */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Physical Skills */}
          <div className="card">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <div className="bg-red-600 p-2 rounded-lg mr-3">
                <Target className="h-5 w-5" />
              </div>
              Physical Skills
            </h3>
            <div className="space-y-4">
              <SkillNode 
                title="Speed & Agility"
                level={8}
                maxLevel={10}
                unlocked={true}
                xp={1200}
                maxXp={1500}
              />
              <SkillNode 
                title="Strength Training"
                level={6}
                maxLevel={10}
                unlocked={true}
                xp={800}
                maxXp={1200}
              />
              <SkillNode 
                title="Endurance"
                level={5}
                maxLevel={10}
                unlocked={true}
                xp={450}
                maxXp={900}
              />
              <SkillNode 
                title="Recovery & Nutrition"
                level={0}
                maxLevel={10}
                unlocked={false}
                xp={0}
                maxXp={600}
              />
            </div>
          </div>

          {/* Technical Skills */}
          <div className="card">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <div className="bg-blue-600 p-2 rounded-lg mr-3">
                <Star className="h-5 w-5" />
              </div>
              Technical Skills
            </h3>
            <div className="space-y-4">
              <SkillNode 
                title="Ball Handling"
                level={9}
                maxLevel={10}
                unlocked={true}
                xp={1350}
                maxXp={1500}
              />
              <SkillNode 
                title="Shooting Accuracy"
                level={7}
                maxLevel={10}
                unlocked={true}
                xp={980}
                maxXp={1400}
              />
              <SkillNode 
                title="Game Strategy"
                level={4}
                maxLevel={10}
                unlocked={true}
                xp={320}
                maxXp={800}
              />
              <SkillNode 
                title="Advanced Techniques"
                level={0}
                maxLevel={10}
                unlocked={false}
                xp={0}
                maxXp={1000}
              />
            </div>
          </div>
        </div>

        {/* Recent Achievements */}
        <div className="mt-8">
          <h3 className="text-xl font-bold text-white mb-6">Recent Achievements</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <AchievementCard 
              icon={<Trophy className="h-6 w-6" />}
              title="Speed Demon"
              description="Completed 50 speed drills"
              earned={true}
            />
            <AchievementCard 
              icon={<Target className="h-6 w-6" />}
              title="Sharp Shooter"
              description="Hit 90% accuracy in shooting drills"
              earned={true}
            />
            <AchievementCard 
              icon={<Award className="h-6 w-6" />}
              title="Consistency King"
              description="Train for 30 consecutive days"
              earned={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function SkillNode({ 
  title, 
  level, 
  maxLevel, 
  unlocked, 
  xp, 
  maxXp 
}: {
  title: string;
  level: number;
  maxLevel: number;
  unlocked: boolean;
  xp: number;
  maxXp: number;
}) {
  const progress = unlocked ? (xp / maxXp) * 100 : 0;
  
  return (
    <div className={`p-4 rounded-lg border ${unlocked ? 'border-slate-600 bg-slate-800' : 'border-slate-700 bg-slate-800/50'}`}>
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          {!unlocked && <Lock className="h-4 w-4 text-slate-500 mr-2" />}
          <span className={`font-medium ${unlocked ? 'text-white' : 'text-slate-500'}`}>
            {title}
          </span>
        </div>
        <span className={`text-sm ${unlocked ? 'text-blue-400' : 'text-slate-600'}`}>
          {level}/{maxLevel}
        </span>
      </div>
      
      {unlocked && (
        <>
          <div className="w-full bg-slate-700 h-2 rounded-full mb-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="text-xs text-slate-400">
            {xp} / {maxXp} XP
          </div>
        </>
      )}
    </div>
  );
}

function AchievementCard({ 
  icon, 
  title, 
  description, 
  earned 
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  earned: boolean;
}) {
  return (
    <div className={`card ${earned ? 'border-yellow-500/50' : 'border-slate-700'}`}>
      <div className={`${earned ? 'text-yellow-400' : 'text-slate-600'} mb-3`}>
        {icon}
      </div>
      <h4 className={`font-semibold mb-2 ${earned ? 'text-white' : 'text-slate-500'}`}>
        {title}
      </h4>
      <p className={`text-sm ${earned ? 'text-slate-300' : 'text-slate-600'}`}>
        {description}
      </p>
      {earned && (
        <div className="mt-3 text-xs text-yellow-400 font-medium">
          ✓ Earned
        </div>
      )}
    </div>
  );
}