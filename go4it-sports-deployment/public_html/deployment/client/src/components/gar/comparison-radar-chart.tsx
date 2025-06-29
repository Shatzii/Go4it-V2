import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts';
import { SpeechButton } from '@/components/ui/speech-button';

interface ComparisonRadarChartProps {
  currentData: Array<{
    subject: string;
    A: number;
    fullMark: number;
  }>;
  comparisonData: Array<{
    subject: string;
    A: number;
    fullMark: number;
  }>;
  currentDate: string;
  comparisonDate: string;
}

export function ComparisonRadarChart({
  currentData,
  comparisonData,
  currentDate,
  comparisonDate
}: ComparisonRadarChartProps) {
  // Format data for comparison radar chart
  const formattedData = currentData.map((item, index) => ({
    subject: item.subject,
    Current: item.A,
    Comparison: comparisonData[index].A,
    fullMark: item.fullMark
  }));
  
  // Calculate improvements for speech
  const calculateImprovements = () => {
    const improvements = formattedData.map(item => {
      const improvement = item.Current - item.Comparison;
      return {
        skill: item.subject,
        improvement,
        percent: ((improvement / item.Comparison) * 100).toFixed(1)
      };
    });
    
    // Find the biggest improvement
    const biggestImprovement = improvements.reduce((prev, current) => 
      (current.improvement > prev.improvement) ? current : prev
    );
    
    // Calculate average improvement
    const avgImprovement = improvements.reduce((sum, item) => sum + item.improvement, 0) / improvements.length;
    
    return {
      biggest: biggestImprovement,
      average: avgImprovement.toFixed(1),
      details: improvements
    };
  };
  
  const improvements = calculateImprovements();
  
  // Generate speech text
  const speechText = `Comparing GAR scores between ${comparisonDate} and ${currentDate}. 
    Your biggest improvement was in ${improvements.biggest.skill} with an increase of ${improvements.biggest.improvement.toFixed(1)} points or ${improvements.biggest.percent}%. 
    Your average improvement across all skills is ${improvements.average} points. 
    Current scores versus previous: ${improvements.details.map(d => 
      `${d.skill}: ${d.improvement > 0 ? 'up' : 'down'} ${Math.abs(d.improvement).toFixed(1)} to ${formattedData.find(i => i.subject === d.skill)?.Current.toFixed(1)}`
    ).join(', ')}.`;
  
  return (
    <div className="w-full">
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-sm">{currentDate} (Current)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-sm">{comparisonDate} (Comparison)</span>
          </div>
        </div>
        <SpeechButton
          text={speechText}
          tooltip="Listen to comparison details"
        />
      </div>
      
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={formattedData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis angle={30} domain={[0, 5]} />
            <Radar
              name="Current"
              dataKey="Current"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.6}
            />
            <Radar
              name="Comparison"
              dataKey="Comparison"
              stroke="#22c55e"
              fill="#22c55e"
              fillOpacity={0.4}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="p-3 bg-background/60 rounded-md mt-4">
        <h4 className="text-sm font-medium mb-1">Improvement Analysis</h4>
        <p className="text-sm">
          The biggest improvement is in <span className="font-semibold">{improvements.biggest.skill}</span> with a 
          <span className="text-emerald-500 font-semibold"> {improvements.biggest.improvement > 0 ? '+' : ''}{improvements.biggest.improvement.toFixed(1)}</span> change 
          ({improvements.biggest.improvement > 0 ? '+' : ''}{improvements.biggest.percent}%).
        </p>
        <p className="text-sm mt-1">
          Average improvement across all skills: <span className="font-semibold">{improvements.average} points</span>
        </p>
      </div>
    </div>
  );
}