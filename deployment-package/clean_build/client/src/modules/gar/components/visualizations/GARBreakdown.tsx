import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  Tooltip, 
  Legend 
} from 'recharts';

interface Attribute {
  name: string;
  value: number;
  category: 'physical' | 'mental' | 'technical';
}

interface GARBreakdownProps {
  attributes: Attribute[];
  sportType?: string;
  className?: string;
}

/**
 * GARBreakdown component
 * 
 * Displays a detailed breakdown of an athlete's GAR scores using a radar chart
 * This is a modular component that can be dropped into the CMS
 */
export const GARBreakdown: React.FC<GARBreakdownProps> = ({
  attributes,
  sportType,
  className = ''
}) => {
  // Format data for the radar chart
  const radarData = attributes.map(attr => ({
    attribute: attr.name,
    value: attr.value,
    fullMark: 100,
    category: attr.category
  }));

  const categoryColors = {
    physical: "#4f46e5", // Indigo
    mental: "#059669",   // Emerald
    technical: "#d97706" // Amber
  };

  return (
    <Card className={`w-full shadow-md ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-bold">
          {sportType ? `${sportType} Skill Breakdown` : 'GAR Breakdown'}
        </CardTitle>
        <CardDescription>
          Detailed analysis of your performance attributes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="attribute" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              
              <Radar
                name="Physical"
                dataKey="value"
                stroke={categoryColors.physical}
                fill={categoryColors.physical}
                fillOpacity={0.3}
                dot={true}
                activeDot={{ r: 8 }}
              />
              
              <Tooltip formatter={(value) => [`${value}/100`, 'Score']} />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Legend for attribute categories */}
        <div className="flex flex-wrap gap-4 mt-4 justify-center">
          {Object.entries(categoryColors).map(([category, color]) => (
            <div key={category} className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-2" 
                style={{ backgroundColor: color }}
              />
              <span className="text-sm capitalize">{category}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};