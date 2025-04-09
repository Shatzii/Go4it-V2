import { useState } from 'react';
import { ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis, ZAxis } from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { SpeechButton } from '@/components/ui/speech-button';

// Mock performance data
const mockPerformanceData = [
  // Game situations vs Performance
  { x: 1, y: 4.2, z: 50, game: 'vs City High', situation: 'Close Game', category: 'game_situations', label: 'Close Game (4.2)' },
  { x: 2, y: 3.1, z: 40, game: 'vs West', situation: 'Tied', category: 'game_situations', label: 'Tied (3.1)' },
  { x: 3, y: 4.5, z: 60, game: 'vs North', situation: 'Leading', category: 'game_situations', label: 'Leading (4.5)' },
  { x: 4, y: 3.7, z: 45, game: 'vs South', situation: 'Behind', category: 'game_situations', label: 'Behind (3.7)' },
  { x: 5, y: 4.8, z: 70, game: 'vs East', situation: 'Overtime', category: 'game_situations', label: 'Overtime (4.8)' },
  
  // Time periods vs Performance
  { x: 1, y: 3.5, z: 40, game: 'vs City High', period: '1st Quarter', category: 'time_periods', label: '1st Quarter (3.5)' },
  { x: 2, y: 3.9, z: 50, game: 'vs West', period: '2nd Quarter', category: 'time_periods', label: '2nd Quarter (3.9)' },
  { x: 3, y: 3.6, z: 45, game: 'vs North', period: '3rd Quarter', category: 'time_periods', label: '3rd Quarter (3.6)' },
  { x: 4, y: 4.3, z: 65, game: 'vs South', period: '4th Quarter', category: 'time_periods', label: '4th Quarter (4.3)' },
  { x: 5, y: 4.7, z: 75, game: 'vs East', period: 'Final Minutes', category: 'time_periods', label: 'Final Minutes (4.7)' },
  
  // Opponents vs Performance
  { x: 1, y: 4.1, z: 60, opponent: 'Top Teams', category: 'opponents', label: 'Top Teams (4.1)' },
  { x: 2, y: 4.6, z: 70, opponent: 'Division Rivals', category: 'opponents', label: 'Division Rivals (4.6)' },
  { x: 3, y: 3.9, z: 50, opponent: 'Lower Ranked', category: 'opponents', label: 'Lower Ranked (3.9)' },
  { x: 4, y: 4.2, z: 65, opponent: 'Physical Teams', category: 'opponents', label: 'Physical Teams (4.2)' },
  { x: 5, y: 3.8, z: 45, opponent: 'Fast Teams', category: 'opponents', label: 'Fast Teams (3.8)' },
  
  // Skills vs Consistency
  { x: 1, y: 4.4, z: 80, skill: 'Shooting', metric: 'Consistency', category: 'skills', label: 'Shooting (4.4)' },
  { x: 2, y: 3.7, z: 60, skill: 'Passing', metric: 'Consistency', category: 'skills', label: 'Passing (3.7)' },
  { x: 3, y: 4.1, z: 75, skill: 'Defense', metric: 'Consistency', category: 'skills', label: 'Defense (4.1)' },
  { x: 4, y: 3.9, z: 65, skill: 'Ball Handling', metric: 'Consistency', category: 'skills', label: 'Ball Handling (3.9)' },
  { x: 5, y: 4.5, z: 85, skill: 'Rebounding', metric: 'Consistency', category: 'skills', label: 'Rebounding (4.5)' },
];

// Category displays
const categoryLabels = {
  game_situations: {
    title: 'Game Situations',
    xLabel: 'Situation Type',
    yLabel: 'Performance Rating',
    description: 'How you perform in different game scenarios',
    speech: 'This heatmap shows your performance across different game situations. You perform best in overtime situations with a rating of 4.8 out of 5, and when leading with 4.5. Your performance is somewhat lower when games are tied at 3.1.'
  },
  time_periods: {
    title: 'Time Periods',
    xLabel: 'Game Period',
    yLabel: 'Performance Rating',
    description: 'Your performance across different periods of the game',
    speech: 'This heatmap shows your performance across different time periods in games. You perform best in the final minutes with a rating of 4.7 out of 5, followed by fourth quarter at 4.3. Your performance is lowest in the first quarter at 3.5.'
  },
  opponents: {
    title: 'Opponent Types',
    xLabel: 'Opponent Category',
    yLabel: 'Performance Rating',
    description: 'How you perform against different types of opponents',
    speech: 'This heatmap shows your performance against different types of opponents. You perform best against division rivals with a rating of 4.6 out of 5, and against physical teams at 4.2. Your performance drops slightly against fast teams to 3.8.'
  },
  skills: {
    title: 'Skills Consistency',
    xLabel: 'Skill Type',
    yLabel: 'Consistency Rating',
    description: 'Consistency levels across different skills',
    speech: 'This heatmap shows consistency ratings across your different skills. Your rebounding shows the highest consistency at 4.5 out of 5, followed by shooting at 4.4. Passing skills show the lowest consistency at 3.7.'
  },
};

export function PerformanceHeatmap() {
  const [category, setCategory] = useState<string>('game_situations');
  
  // Filter data by selected category
  const filteredData = mockPerformanceData.filter(item => item.category === category);
  
  // Get current category info
  const categoryInfo = categoryLabels[category as keyof typeof categoryLabels];
  
  // Determine color based on y value (performance rating)
  const getColor = (rating: number) => {
    if (rating >= 4.5) return '#10b981'; // emerald-500
    if (rating >= 4.0) return '#22c55e'; // green-500
    if (rating >= 3.5) return '#3b82f6'; // blue-500
    if (rating >= 3.0) return '#6366f1'; // indigo-500
    return '#8b5cf6'; // violet-500
  };
  
  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Card className="py-2 px-4 border shadow-md bg-background z-50">
          <div className="font-medium">{data.label}</div>
          {data.game && <div className="text-xs text-muted-foreground">Game: {data.game}</div>}
          {data.opponent && <div className="text-xs text-muted-foreground">Category: {data.opponent}</div>}
          {data.skill && <div className="text-xs text-muted-foreground">Skill: {data.skill}</div>}
        </Card>
      );
    }
    return null;
  };
  
  return (
    <div className="space-y-4 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold flex items-center">
            {categoryInfo.title}
            <SpeechButton 
              text={categoryInfo.speech}
              tooltip={`Listen to ${categoryInfo.title} analysis`}
              className="ml-2"
            />
          </h3>
          <p className="text-sm text-muted-foreground">{categoryInfo.description}</p>
        </div>
        
        <div className="w-full sm:w-[180px]">
          <Label htmlFor="category-select" className="mb-1 block">View Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger id="category-select">
              <SelectValue placeholder="Select a view" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="game_situations">Game Situations</SelectItem>
              <SelectItem value="time_periods">Time Periods</SelectItem>
              <SelectItem value="opponents">Opponent Types</SelectItem>
              <SelectItem value="skills">Skills Consistency</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart
            margin={{ top: 20, right: 20, bottom: 40, left: 20 }}
          >
            <XAxis 
              type="number" 
              dataKey="x" 
              name={categoryInfo.xLabel} 
              domain={[0, 6]}
              tick={false}
              tickLine={false}
              axisLine={false}
              label={{ value: categoryInfo.xLabel, position: 'bottom', offset: 10 }}
            />
            <YAxis 
              type="number" 
              dataKey="y" 
              name={categoryInfo.yLabel}
              domain={[0, 5]}
              label={{ value: categoryInfo.yLabel, angle: -90, position: 'left', offset: -5 }}
            />
            <ZAxis 
              type="number" 
              dataKey="z" 
              range={[60, 400]} 
              name="Size" 
            />
            <Tooltip content={<CustomTooltip />} />
            <Scatter 
              name="Performance" 
              data={filteredData} 
              fill="#8884d8"
              shape={(props) => {
                const { cx, cy, r } = props;
                // @ts-ignore - Getting y value from payload
                const rating = props.payload.y;
                const color = getColor(rating);
                
                return (
                  <circle 
                    cx={cx} 
                    cy={cy} 
                    r={r} 
                    fill={color}
                    fillOpacity={0.8}
                    stroke={color}
                    strokeWidth={1}
                  />
                );
              }}
            />
            
            {/* Create labels for each point */}
            {filteredData.map((entry, index) => (
              <g key={index}>
                <text
                  x={entry.x * 60 + 20} // Adjust based on your chart dimensions
                  y={450 - entry.y * 80} // Adjust based on your chart dimensions
                  textAnchor="middle"
                  fill="#64748b" // slate-500
                  fontSize={12}
                >
                  {entry.situation || entry.period || entry.opponent || entry.skill}
                </text>
              </g>
            ))}
            
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      
      <div className="bg-background/60 p-3 rounded-md">
        <h4 className="text-sm font-medium mb-2">Performance Insights</h4>
        <ul className="text-sm space-y-1">
          {category === 'game_situations' && (
            <>
              <li>• Strongest in overtime situations (4.8/5) and when leading (4.5/5)</li>
              <li>• Area for improvement: Tied game scenarios (3.1/5)</li>
            </>
          )}
          {category === 'time_periods' && (
            <>
              <li>• Performs best in final minutes (4.7/5) and 4th quarter (4.3/5)</li>
              <li>• Could improve early game performance (1st quarter: 3.5/5)</li>
            </>
          )}
          {category === 'opponents' && (
            <>
              <li>• Excels against division rivals (4.6/5)</li>
              <li>• Consider focused practice against fast teams (3.8/5)</li>
            </>
          )}
          {category === 'skills' && (
            <>
              <li>• Most consistent in rebounding (4.5/5) and shooting (4.4/5)</li>
              <li>• Focus on improving passing consistency (3.7/5)</li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}