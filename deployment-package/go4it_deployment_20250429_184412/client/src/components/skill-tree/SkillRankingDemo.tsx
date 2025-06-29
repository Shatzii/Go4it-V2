import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import SkillRankingVisualizer from './SkillRankingVisualizer';

interface SkillDemoProps {
  name: string;
  description: string;
  initialLevel: number;
  initialXp: number;
}

const skillDemos: SkillDemoProps[] = [
  {
    name: 'Shooting Form',
    description: 'Proper technique for basketball shots',
    initialLevel: 1,
    initialXp: 50,
  },
  {
    name: 'Ball Handling',
    description: 'Control and manipulation of the basketball',
    initialLevel: 2,
    initialXp: 120,
  },
  {
    name: 'Defensive Stance',
    description: 'Proper positioning to guard opponents',
    initialLevel: 3,
    initialXp: 220,
  },
  {
    name: 'Court Vision',
    description: 'Ability to see and understand plays developing',
    initialLevel: 4,
    initialXp: 350,
  },
  {
    name: 'Leadership',
    description: 'Ability to direct and inspire teammates',
    initialLevel: 5,
    initialXp: 500,
  },
];

const SkillRankingDemo: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('all');
  const [showStars, setShowStars] = useState(true);
  const [showGradient, setShowGradient] = useState(true);
  const [showPercentage, setShowPercentage] = useState(false);
  const [size, setSize] = useState<'sm' | 'md' | 'lg'>('md');
  
  // Local state for custom skill
  const [customLevel, setCustomLevel] = useState<number>(2);
  const [customXp, setCustomXp] = useState<number>(150);

  // Handler for size changes
  const handleSizeChange = (value: string) => {
    setSize(value as 'sm' | 'md' | 'lg');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-primary">Skill Ranking Visualization</h2>
      
      <Tabs defaultValue="all" onValueChange={(value) => setSelectedTab(value)}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="all">All Skills</TabsTrigger>
          <TabsTrigger value="custom">Custom Skill</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {skillDemos.map((skill) => (
              <Card key={skill.name} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle>{skill.name}</CardTitle>
                  <CardDescription>{skill.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <SkillRankingVisualizer
                    level={skill.initialLevel}
                    xp={skill.initialXp}
                    showStars={showStars}
                    showGradient={showGradient}
                    showPercentage={showPercentage}
                    size={size}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="custom">
          <Card>
            <CardHeader>
              <CardTitle>Custom Skill Visualization</CardTitle>
              <CardDescription>Adjust the sliders to see how the visualization changes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <Label>Skill Level: {customLevel}</Label>
                    <span className="text-sm text-muted-foreground">Max: 5</span>
                  </div>
                  <Slider
                    defaultValue={[customLevel]}
                    max={5}
                    step={1}
                    onValueChange={(value) => setCustomLevel(value[0])}
                  />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <Label>XP Points: {customXp}</Label>
                    <span className="text-sm text-muted-foreground">Max: 500</span>
                  </div>
                  <Slider
                    defaultValue={[customXp]}
                    max={500}
                    step={10}
                    onValueChange={(value) => setCustomXp(value[0])}
                  />
                </div>
              </div>
              
              <div className="bg-card border rounded-md p-6">
                <SkillRankingVisualizer
                  level={customLevel}
                  xp={customXp}
                  showStars={showStars}
                  showGradient={showGradient}
                  showPercentage={showPercentage}
                  size={size}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Visualization Settings</CardTitle>
              <CardDescription>Customize how the skill rankings are displayed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="show-stars">Show Stars</Label>
                <Switch
                  id="show-stars"
                  checked={showStars}
                  onCheckedChange={setShowStars}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="show-gradient">Show Color Gradient</Label>
                <Switch
                  id="show-gradient"
                  checked={showGradient}
                  onCheckedChange={setShowGradient}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="show-percentage">Show Percentage</Label>
                <Switch
                  id="show-percentage"
                  checked={showPercentage}
                  onCheckedChange={setShowPercentage}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Visualization Size</Label>
                <div className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="size-sm"
                      name="size"
                      value="sm"
                      checked={size === 'sm'}
                      onChange={(e) => handleSizeChange(e.target.value)}
                    />
                    <Label htmlFor="size-sm">Small</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="size-md"
                      name="size"
                      value="md"
                      checked={size === 'md'}
                      onChange={(e) => handleSizeChange(e.target.value)}
                    />
                    <Label htmlFor="size-md">Medium</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="size-lg"
                      name="size"
                      value="lg"
                      checked={size === 'lg'}
                      onChange={(e) => handleSizeChange(e.target.value)}
                    />
                    <Label htmlFor="size-lg">Large</Label>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <div className="bg-card border rounded-md p-4 w-full">
                <h3 className="font-semibold mb-2">Preview</h3>
                <SkillRankingVisualizer
                  level={3}
                  xp={250}
                  showStars={showStars}
                  showGradient={showGradient}
                  showPercentage={showPercentage}
                  size={size}
                />
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SkillRankingDemo;