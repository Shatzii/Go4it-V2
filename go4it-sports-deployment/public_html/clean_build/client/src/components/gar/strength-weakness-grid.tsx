import { useState } from 'react';
import { SpeechButton } from '@/components/ui/speech-button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';

interface SkillItem {
  name: string;
  category: string;
  rating: number;
  improvement: number;
  description: string;
  focused: boolean;
}

// Mock data for the strength/weakness grid
const mockSkillsData: SkillItem[] = [
  // Strengths (rating >= 4.0)
  { 
    name: 'Rebounding', 
    category: 'Physical', 
    rating: 4.5, 
    improvement: 0.3,
    description: 'Excellent box-out technique and vertical leap; consistently secures rebounds in traffic',
    focused: true
  },
  { 
    name: 'Shooting', 
    category: 'Technique', 
    rating: 4.4, 
    improvement: 0.5,
    description: 'Strong mid-range shooting with improving three-point percentage; reliable free throw shooter',
    focused: true
  },
  { 
    name: 'Court Vision', 
    category: 'Mental', 
    rating: 4.3, 
    improvement: 0.2,
    description: 'Exceptional ability to see plays develop; identifies open teammates quickly',
    focused: false
  },
  { 
    name: 'Leadership', 
    category: 'Mental', 
    rating: 4.2, 
    improvement: 0.4,
    description: 'Vocal on court; holds teammates accountable; leads by example in practice and games',
    focused: false
  },
  { 
    name: 'Defensive Positioning', 
    category: 'Technical', 
    rating: 4.1, 
    improvement: 0.3,
    description: 'Excellent understanding of defensive rotations; rarely caught out of position',
    focused: true
  },
  
  // Average (3.5 <= rating < 4.0)
  { 
    name: 'Ball Handling', 
    category: 'Technique', 
    rating: 3.9, 
    improvement: 0.3,
    description: 'Solid ball control; can drive with either hand; still developing advanced dribble moves',
    focused: false
  },
  { 
    name: 'Speed', 
    category: 'Physical', 
    rating: 3.8, 
    improvement: 0.1,
    description: 'Good straight-line speed but needs improvement on lateral quickness',
    focused: false
  },
  { 
    name: 'Passing', 
    category: 'Technique', 
    rating: 3.7, 
    improvement: 0.2,
    description: 'Makes reliable fundamental passes; working on more creative passing options',
    focused: true
  },
  { 
    name: 'Post Moves', 
    category: 'Technique', 
    rating: 3.6, 
    improvement: 0.4,
    description: 'Developing hook shot and drop step; needs to add counter moves',
    focused: true
  },
  { 
    name: 'Conditioning', 
    category: 'Physical', 
    rating: 3.5, 
    improvement: 0.2,
    description: 'Good stamina for first three quarters; needs to maintain energy in fourth quarter',
    focused: false
  },
  
  // Weaknesses (rating < 3.5)
  { 
    name: 'Free Throw Drawing', 
    category: 'Technique', 
    rating: 3.4, 
    improvement: 0.3,
    description: "Needs to create more contact when driving; doesn't get to the line enough",
    focused: true
  },
  { 
    name: 'Perimeter Defense', 
    category: 'Technique', 
    rating: 3.3, 
    improvement: 0.4,
    description: 'Sometimes struggles against quicker guards; needs to improve lateral footwork',
    focused: true
  },
  { 
    name: 'Strength', 
    category: 'Physical', 
    rating: 3.2, 
    improvement: 0.5,
    description: 'Working on upper body strength; sometimes pushed off spots by stronger players',
    focused: true
  },
  { 
    name: 'Off-Ball Movement', 
    category: 'Technical', 
    rating: 3.0, 
    improvement: 0.2,
    description: 'Tends to stand still when not involved in the play; needs more cutting and screening',
    focused: false
  },
  { 
    name: 'Consistency', 
    category: 'Mental', 
    rating: 2.8, 
    improvement: 0.4,
    description: 'Performance varies significantly between games; needs more consistent approach',
    focused: true
  },
];

export function StrengthWeaknessGrid() {
  const [filter, setFilter] = useState<string>('all');
  
  // Filter skills based on selected category
  const filteredSkills = filter === 'all' 
    ? mockSkillsData 
    : mockSkillsData.filter(skill => skill.category.toLowerCase() === filter.toLowerCase());
  
  // Separate into strengths, average, and weaknesses
  const strengths = filteredSkills.filter(skill => skill.rating >= 4.0);
  const average = filteredSkills.filter(skill => skill.rating >= 3.5 && skill.rating < 4.0);
  const weaknesses = filteredSkills.filter(skill => skill.rating < 3.5);
  
  // Generate speech text for strengths and weaknesses
  const strengthsSpeech = `Your top strengths are ${strengths.slice(0, 3).map(s => s.name).join(', ')} with ratings of ${strengths.slice(0, 3).map(s => s.rating.toFixed(1)).join(', ')} out of 5.`;
  const weaknessesSpeech = `Areas to improve include ${weaknesses.slice(0, 3).map(s => s.name).join(', ')} with ratings of ${weaknesses.slice(0, 3).map(s => s.rating.toFixed(1)).join(', ')} out of 5.`;
  const focusSpeech = `Currently focusing on improving ${mockSkillsData.filter(s => s.focused).slice(0, 3).map(s => s.name).join(', ')}.`;
  
  const speechText = `${strengthsSpeech} ${weaknessesSpeech} ${focusSpeech}`;
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold flex items-center">
            Strength & Weakness Analysis
            <SpeechButton 
              text={speechText}
              tooltip="Listen to strengths and weaknesses"
              className="ml-2"
            />
          </h3>
          <p className="text-sm text-muted-foreground">
            Detailed breakdown of skills by performance rating
          </p>
        </div>
        
        <div className="flex flex-wrap gap-1">
          <Badge 
            variant={filter === 'all' ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => setFilter('all')}
          >
            All
          </Badge>
          <Badge 
            variant={filter === 'physical' ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => setFilter('physical')}
          >
            Physical
          </Badge>
          <Badge 
            variant={filter === 'technique' ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => setFilter('technique')}
          >
            Technique
          </Badge>
          <Badge 
            variant={filter === 'mental' ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => setFilter('mental')}
          >
            Mental
          </Badge>
          <Badge 
            variant={filter === 'technical' ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => setFilter('technical')}
          >
            Technical
          </Badge>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Strengths Column */}
        <div>
          <h4 className="text-sm font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 p-2 rounded-t-md border border-emerald-200 dark:border-emerald-900/50 flex items-center">
            <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
            Strengths (4.0+)
          </h4>
          <div className="border-x border-b rounded-b-md overflow-hidden">
            <div className="max-h-[280px] overflow-y-auto">
              {strengths.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No strengths found in this category
                </div>
              ) : (
                strengths.map((skill, index) => (
                  <SkillCard key={index} skill={skill} type="strength" />
                ))
              )}
            </div>
          </div>
        </div>
        
        {/* Average Column */}
        <div>
          <h4 className="text-sm font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 p-2 rounded-t-md border border-blue-200 dark:border-blue-900/50 flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            Average (3.5-3.9)
          </h4>
          <div className="border-x border-b rounded-b-md overflow-hidden">
            <div className="max-h-[280px] overflow-y-auto">
              {average.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No average skills found in this category
                </div>
              ) : (
                average.map((skill, index) => (
                  <SkillCard key={index} skill={skill} type="average" />
                ))
              )}
            </div>
          </div>
        </div>
        
        {/* Weaknesses Column */}
        <div>
          <h4 className="text-sm font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 p-2 rounded-t-md border border-amber-200 dark:border-amber-900/50 flex items-center">
            <span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
            Areas to Improve (&lt;3.5)
          </h4>
          <div className="border-x border-b rounded-b-md overflow-hidden">
            <div className="max-h-[280px] overflow-y-auto">
              {weaknesses.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No weaknesses found in this category
                </div>
              ) : (
                weaknesses.map((skill, index) => (
                  <SkillCard key={index} skill={skill} type="weakness" />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4 bg-background/60 rounded-md">
        <h4 className="text-sm font-medium mb-2">Development Insights</h4>
        <p className="text-sm mb-2">
          <span className="font-medium">Biggest Strength:</span> {strengths[0]?.name} ({strengths[0]?.rating.toFixed(1)}/5)
        </p>
        <p className="text-sm mb-2">
          <span className="font-medium">Most Improved:</span> {[...mockSkillsData].sort((a, b) => b.improvement - a.improvement)[0]?.name} (+{[...mockSkillsData].sort((a, b) => b.improvement - a.improvement)[0]?.improvement.toFixed(1)} points)
        </p>
        <p className="text-sm">
          <span className="font-medium">Priority Focus Area:</span> {weaknesses.filter(w => w.focused)[0]?.name} ({weaknesses.filter(w => w.focused)[0]?.rating.toFixed(1)}/5)
        </p>
      </div>
    </div>
  );
}

interface SkillCardProps {
  skill: SkillItem;
  type: 'strength' | 'average' | 'weakness';
}

function SkillCard({ skill, type }: SkillCardProps) {
  const [expanded, setExpanded] = useState(false);
  
  const getColorClass = () => {
    switch (type) {
      case 'strength': return 'bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30';
      case 'average': return 'bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30';
      case 'weakness': return 'bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/30';
      default: return '';
    }
  };
  
  const getBadgeColor = () => {
    switch (skill.category.toLowerCase()) {
      case 'physical': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'technique': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'mental': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'technical': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default: return '';
    }
  };
  
  return (
    <div 
      className={`p-3 border-b last:border-b-0 cursor-pointer transition-colors ${getColorClass()}`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium">{skill.name}</span>
            <span className={`text-xs px-2 py-0.5 rounded ${getBadgeColor()}`}>
              {skill.category}
            </span>
          </div>
          {expanded && (
            <p className="text-sm mt-2 text-muted-foreground">
              {skill.description}
            </p>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <div className="text-right">
            <div className="font-bold">
              {skill.rating.toFixed(1)}
              <span className="text-xs text-emerald-600 ml-1">+{skill.improvement.toFixed(1)}</span>
            </div>
            {skill.focused && (
              <span className="text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded">Focus</span>
            )}
          </div>
          <ChevronRight className={`h-4 w-4 transition-transform ${expanded ? 'rotate-90' : ''}`} />
        </div>
      </div>
    </div>
  );
}