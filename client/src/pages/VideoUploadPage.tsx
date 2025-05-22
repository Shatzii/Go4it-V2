import React, { useState } from "react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { VideoUploader } from "@/components/video/VideoUploader";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { 
  Video, 
  AlertCircle, 
  CheckCircle2, 
  BarChart3,
  ArrowLeft, 
  Loader2,
  PlayCircle
} from "lucide-react";

export default function VideoUploadPage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<{
    overallScore: number;
    physical: number;
    technical: number;
    tactical: number;
    mental: number;
    strengths: string[];
    improvements: string[];
    insights: string;
  } | null>(null);

  const handleVideoSelected = (file: File) => {
    setSelectedFile(file);
  };

  const handleUploadComplete = (videoUrl: string) => {
    setSelectedVideoUrl(videoUrl);
    // Start analysis automatically after upload
    startAnalysis();
  };

  const startAnalysis = () => {
    if (!selectedFile) {
      toast({
        title: "No video selected",
        description: "Please upload a video to analyze",
        variant: "destructive",
      });
      return;
    }

    setAnalyzing(true);

    // Simulate analysis process
    setTimeout(() => {
      // Mock analysis data
      const mockResults = {
        overallScore: Math.floor(Math.random() * 21) + 70, // 70-90
        physical: Math.floor(Math.random() * 21) + 70,
        technical: Math.floor(Math.random() * 21) + 65,
        tactical: Math.floor(Math.random() * 21) + 60,
        mental: Math.floor(Math.random() * 21) + 75,
        strengths: [
          "Excellent shooting form",
          "Good court awareness",
          "Strong defensive positioning",
          "Effective communication with teammates"
        ],
        improvements: [
          "Work on lateral movement speed",
          "Improve left-hand dribbling control",
          "Increase shooting consistency from mid-range",
          "Develop more explosive first step"
        ],
        insights: "Your shooting mechanics are solid, but there's room for improvement in your off-hand ball handling. Your defensive positioning is above average for your age group. The video shows good teamwork and communication skills. Focus on developing more explosiveness in your first step to create separation from defenders."
      };

      setAnalysisResults(mockResults);
      setAnalyzing(false);
      setAnalysisComplete(true);

      toast({
        title: "Analysis complete",
        description: "Your video has been analyzed successfully",
      });
    }, 5000);
  };

  const handleSaveAndContinue = () => {
    toast({
      title: "Analysis saved",
      description: "Your video analysis has been saved to your profile",
    });
    navigate("/dashboard");
  };

  return (
    <MobileLayout title="Video Analysis">
      <div className="space-y-6 pb-20">
        {/* Back button */}
        <Button
          variant="ghost"
          size="sm"
          className="mb-4"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        {!analysisComplete ? (
          <>
            {/* Upload section */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Upload Your Game Footage</h2>
              <p className="text-sm text-gray-400">
                Upload your video to receive detailed analysis and GAR scoring
              </p>
              
              <VideoUploader
                onVideoSelected={handleVideoSelected}
                onUploadComplete={handleUploadComplete}
                sportTypes={["Basketball", "Football", "Soccer", "Baseball", "Volleyball", "Track", "Other"]}
              />
            </div>

            {/* Analysis progress */}
            {analyzing && (
              <div className="mt-8 space-y-4">
                <div className="flex items-center justify-center gap-3">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                  <h3 className="text-lg font-medium">Analyzing Your Video</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Detecting actions and movements</span>
                      <CheckCircle2 size={16} className="text-green-500" />
                    </div>
                    <div className="h-1 w-full bg-green-500 rounded-full" />
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Analyzing athletic performance</span>
                      <Loader2 size={16} className="animate-spin text-blue-500" />
                    </div>
                    <div className="h-1 w-full bg-gray-700 rounded-full">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: "65%" }} />
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Generating GAR score</span>
                      <AlertCircle size={16} className="text-gray-500" />
                    </div>
                    <div className="h-1 w-full bg-gray-700 rounded-full" />
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Creating personalized insights</span>
                      <AlertCircle size={16} className="text-gray-500" />
                    </div>
                    <div className="h-1 w-full bg-gray-700 rounded-full" />
                  </div>
                </div>
                
                <p className="text-sm text-center text-gray-400 mt-4">
                  This usually takes 2-3 minutes to complete
                </p>
              </div>
            )}
          </>
        ) : (
          /* Analysis results */
          <div className="space-y-6">
            {selectedVideoUrl && (
              <div className="relative rounded-lg overflow-hidden bg-gray-900 border border-gray-800">
                <video 
                  src={selectedVideoUrl} 
                  controls 
                  className="w-full h-56 object-cover"
                  poster="https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500"
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <PlayCircle size={48} className="text-white/80" />
                </div>
              </div>
            )}
            
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">GAR Analysis Results</h3>
                <div className="flex items-center">
                  <BarChart3 size={18} className="text-blue-400 mr-2" />
                  <span className="text-xl font-bold">
                    {analysisResults?.overallScore}
                  </span>
                </div>
              </div>
              
              {/* Score breakdown */}
              <div className="space-y-3 mb-6">
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Physical</span>
                    <span className="font-medium">{analysisResults?.physical}</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500"
                      style={{ width: `${analysisResults?.physical}%` }}
                    />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Technical</span>
                    <span className="font-medium">{analysisResults?.technical}</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500"
                      style={{ width: `${analysisResults?.technical}%` }}
                    />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Tactical</span>
                    <span className="font-medium">{analysisResults?.tactical}</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-yellow-500"
                      style={{ width: `${analysisResults?.tactical}%` }}
                    />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Mental</span>
                    <span className="font-medium">{analysisResults?.mental}</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-purple-500"
                      style={{ width: `${analysisResults?.mental}%` }}
                    />
                  </div>
                </div>
              </div>
              
              {/* Insights */}
              <div className="border-t border-gray-800 pt-4 space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Performance Insights</h4>
                  <p className="text-sm text-gray-400">
                    {analysisResults?.insights}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2 text-green-400">Strengths</h4>
                    <ul className="space-y-1">
                      {analysisResults?.strengths.map((strength, index) => (
                        <li key={index} className="text-xs text-gray-300 flex items-start">
                          <CheckCircle2 size={12} className="text-green-500 mr-1 mt-0.5" />
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2 text-blue-400">Areas to Improve</h4>
                    <ul className="space-y-1">
                      {analysisResults?.improvements.map((improvement, index) => (
                        <li key={index} className="text-xs text-gray-300 flex items-start">
                          <AlertCircle size={12} className="text-blue-500 mr-1 mt-0.5" />
                          <span>{improvement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  setAnalysisComplete(false);
                  setSelectedFile(null);
                  setSelectedVideoUrl(null);
                  setAnalysisResults(null);
                }}
              >
                Upload Another
              </Button>
              <Button 
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500"
                onClick={handleSaveAndContinue}
              >
                Save & Continue
              </Button>
            </div>
            
            <div className="border-t border-gray-800 pt-4">
              <Button 
                variant="ghost" 
                className="w-full flex items-center justify-center gap-2"
                onClick={() => navigate("/videos/compare")}
              >
                <Video size={16} />
                <span>Compare With Previous Videos</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </MobileLayout>
  );
}