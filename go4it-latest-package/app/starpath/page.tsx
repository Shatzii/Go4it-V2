'use client';
import React, { useState, useEffect } from 'react';
import { UserButton } from '@clerk/nextjs';
import { Star, Trophy, Target, Zap, Award, Lock, Play } from 'lucide-react';

interface SkillNode {
  id: number;
  name: string;
  description: string;
  sport_type: string;
  position: string;
  parent_category: string;
  xp_to_unlock: number;
  max_level: number;
}

interface UserSkill {
  id: number;
  skillNodeId: number;
  unlocked: boolean;
  level: number;
  xp: number;
  lastTrainedAt: Date;
}

interface SkillStats {
  totalSkills: number;
  unlockedSkills: number;
  masteredSkills: number;
  totalXp: number;
  skillsByCategory: Array<{
    category: string;
    totalCount: number;
    unlockedCount: number;
    masteredCount: number;
    averageLevel: number;
  }>;
}

export default function StarPathPage() {
  const [skillNodes, setSkillNodes] = useState<SkillNode[]>([]);
  const [userSkills, setUserSkills] = useState<UserSkill[]>([]);
  const [stats, setStats] = useState<SkillStats | null>(null);
  const [selectedSport, setSelectedSport] = useState('football');
  const [loading, setLoading] = useState(true);
  const [training, setTraining] = useState<number | null>(null);

  useEffect(() => {
    loadSkillData();
  }, [selectedSport]);

  const loadSkillData = async () => {
    try {
      setLoading(true);
      
      // Connect to your existing Express backend
      const baseUrl = window.location.origin;
      
      // Load skill nodes for the sport
      const nodesResponse = await fetch(`${baseUrl}/api/skill-tree/nodes?sport=${selectedSport}`);
      const nodesData = await nodesResponse.json();
      setSkillNodes(nodesData.nodes || []);
      
      // Load user's skills
      const userResponse = await fetch(`${baseUrl}/api/skill-tree/user`);
      const userData = await userResponse.json();
      setUserSkills(userData || []);
      
      // Load stats
      const statsResponse = await fetch(`${baseUrl}/api/skill-tree/stats?sport=${selectedSport}`);
      const statsData = await statsResponse.json();
      setStats(statsData);
      
    } catch (error) {
      console.error('Error loading skill data:', error);
    } finally {
      setLoading(false);
    }
  };

  const unlockSkill = async (skillId: number) => {
    try {
      const baseUrl = window.location.origin;
      const response = await fetch(`${baseUrl}/api/skill-tree/unlock/${skillId}`, {
        method: 'POST',
        credentials: 'include',
      });
      
      if (response.ok) {
        await loadSkillData(); // Reload data
      }
    } catch (error) {
      console.error('Error unlocking skill:', error);
    }
  };

  const trainSkill = async (skillId: number) => {
    try {
      setTraining(skillId);
      const baseUrl = window.location.origin;
      const response = await fetch(`${baseUrl}/api/skill-tree/train`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ skillId }),
      });
      
      if (response.ok) {
        await loadSkillData(); // Reload data
      }
    } catch (error) {
      console.error('Error training skill:', error);
    } finally {
      setTraining(null);
    }
  };

  const getUserSkill = (skillNodeId: number) => {
    return userSkills.find(s => s.skillNodeId === skillNodeId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">Loading StarPath...</div>
      </div>
    );
  }
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

        {/* Sport Selection */}
        <div className="mb-6">
          <select 
            value={selectedSport} 
            onChange={(e) => setSelectedSport(e.target.value)}
            className="bg-slate-800 text-white px-4 py-2 rounded border border-slate-600"
          >
            <option value="football">Football</option>
            <option value="basketball">Basketball</option>
            <option value="soccer">Soccer</option>
            <option value="baseball">Baseball</option>
          </select>
        </div>

        {/* Player Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="card text-center">
            <div className="text-blue-400 mb-2">
              <Star className="h-8 w-8 mx-auto" />
            </div>
            <div className="text-2xl font-bold text-white">
              {stats ? Math.max(1, Math.floor(stats.totalXp / 100)) : 1}
            </div>
            <div className="text-sm text-slate-400">Current Level</div>
          </div>
          <div className="card text-center">
            <div className="text-purple-400 mb-2">
              <Zap className="h-8 w-8 mx-auto" />
            </div>
            <div className="text-2xl font-bold text-white">{stats?.totalXp || 0} XP</div>
            <div className="text-sm text-slate-400">Experience Points</div>
          </div>
          <div className="card text-center">
            <div className="text-yellow-400 mb-2">
              <Trophy className="h-8 w-8 mx-auto" />
            </div>
            <div className="text-2xl font-bold text-white">{stats?.masteredSkills || 0}</div>
            <div className="text-sm text-slate-400">Mastered Skills</div>
          </div>
          <div className="card text-center">
            <div className="text-green-400 mb-2">
              <Target className="h-8 w-8 mx-auto" />
            </div>
            <div className="text-2xl font-bold text-white">
              {stats ? Math.round((stats.unlockedSkills / stats.totalSkills) * 100) : 0}%
            </div>
            <div className="text-sm text-slate-400">Progress</div>
          </div>
        </div>

        {/* Skill Trees by Category */}
        <div className="grid lg:grid-cols-2 gap-8">
          {stats?.skillsByCategory.map((category) => (
            <div key={category.category} className="card">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <div className="bg-blue-600 p-2 rounded-lg mr-3">
                  <Target className="h-5 w-5" />
                </div>
                {category.category}
                <span className="ml-auto text-sm text-slate-400">
                  {category.unlockedCount}/{category.totalCount}
                </span>
              </h3>
              <div className="space-y-4">
                {skillNodes
                  .filter(node => (node.parent_category || 'Uncategorized') === category.category)
                  .map(node => {
                    const userSkill = getUserSkill(node.id);
                    return (
                      <SkillNodeComponent 
                        key={node.id}
                        node={node}
                        userSkill={userSkill}
                        onUnlock={unlockSkill}
                        onTrain={trainSkill}
                        isTraining={training === node.id}
                      />
                    );
                  })}
              </div>
            </div>
          ))}
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

function SkillNodeComponent({ 
  node,
  userSkill,
  onUnlock,
  onTrain,
  isTraining
}: {
  node: SkillNode;
  userSkill?: UserSkill;
  onUnlock: (skillId: number) => void;
  onTrain: (skillId: number) => void;
  isTraining: boolean;
}) {
  const unlocked = userSkill?.unlocked || false;
  const level = userSkill?.level || 0;
  const xp = userSkill?.xp || 0;
  const maxLevel = node.max_level || 10;
  
  // Calculate XP needed for next level (100 * current level)
  const xpForNextLevel = level * 100;
  const progress = level > 0 ? (xp / xpForNextLevel) * 100 : 0;
  
  return (
    <div className={`p-4 rounded-lg border ${unlocked ? 'border-slate-600 bg-slate-800' : 'border-slate-700 bg-slate-800/50'}`}>
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          {!unlocked && <Lock className="h-4 w-4 text-slate-500 mr-2" />}
          <span className={`font-medium ${unlocked ? 'text-white' : 'text-slate-500'}`}>
            {node.name}
          </span>
        </div>
        <span className={`text-sm ${unlocked ? 'text-blue-400' : 'text-slate-600'}`}>
          {level}/{maxLevel}
        </span>
      </div>
      
      {node.description && (
        <p className="text-xs text-slate-400 mb-2">{node.description}</p>
      )}
      
      {unlocked && level > 0 && (
        <>
          <div className="w-full bg-slate-700 h-2 rounded-full mb-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="text-xs text-slate-400 mb-2">
            {xp} / {xpForNextLevel} XP to level {level + 1}
          </div>
        </>
      )}
      
      <div className="flex gap-2">
        {!unlocked && (
          <button 
            onClick={() => onUnlock(node.id)}
            className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition-colors"
          >
            Unlock {node.xp_to_unlock ? `(${node.xp_to_unlock} XP)` : ''}
          </button>
        )}
        
        {unlocked && level < maxLevel && (
          <button 
            onClick={() => onTrain(node.id)}
            disabled={isTraining}
            className="text-xs bg-green-600 hover:bg-green-700 disabled:bg-slate-600 text-white px-3 py-1 rounded transition-colors flex items-center gap-1"
          >
            {isTraining ? 'Training...' : (
              <>
                <Play className="h-3 w-3" />
                Train
              </>
            )}
          </button>
        )}
        
        {level >= maxLevel && (
          <span className="text-xs bg-yellow-600 text-white px-3 py-1 rounded">
            Mastered
          </span>
        )}
      </div>
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