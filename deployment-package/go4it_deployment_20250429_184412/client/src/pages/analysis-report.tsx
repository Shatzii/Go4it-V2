
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function AnalysisReport() {
  const { id } = useParams<{ id: string }>();
  
  const { data: analysis, isLoading } = useQuery({
    queryKey: [`/api/videos/${id}/analysis`],
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Analysis Not Found</h2>
        <p className="text-gray-600">The analysis report you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Video Analysis Report</h1>
      
      <Card className="p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Overall Score</h2>
        <div className="flex items-center gap-4 mb-2">
          <Progress value={analysis.overallScore * 10} className="w-full" />
          <span className="text-lg font-medium">{analysis.overallScore}/10</span>
        </div>
      </Card>

      <Card className="p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Feedback</h2>
        <p className="text-gray-700">{analysis.feedback}</p>
      </Card>

      <Card className="p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Improvement Tips</h2>
        <ul className="list-disc list-inside space-y-2">
          {analysis.improvementTips.map((tip, index) => (
            <li key={index} className="text-gray-700">{tip}</li>
          ))}
        </ul>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Motion Analysis</h2>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(analysis.motionData)
            .filter(([key]) => typeof analysis.motionData[key] === 'number')
            .map(([key, value]) => (
              <div key={key} className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-700 mb-2">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </h3>
                <div className="flex items-center gap-4">
                  <Progress value={Number(value) * 10} className="w-full" />
                  <span className="font-medium">{Number(value).toFixed(1)}/10</span>
                </div>
              </div>
            ))}
        </div>
      </Card>
    </div>
  );
}
