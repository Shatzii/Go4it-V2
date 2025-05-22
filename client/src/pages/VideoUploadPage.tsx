import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Upload, Video, FileVideo, Check, Loader2 } from "lucide-react";

const VideoUploadPage: React.FC = () => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    
    // Make sure it's a video file
    if (!file.type.startsWith('video/')) {
      toast({
        title: "Invalid file",
        description: "Please upload a video file (.mp4, .mov, etc.)",
        variant: "destructive"
      });
      return;
    }
    
    // Check file size (max 500MB)
    if (file.size > 500 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Video files must be less than 500MB",
        variant: "destructive"
      });
      return;
    }
    
    simulateUpload(file);
  };
  
  const simulateUpload = (file: File) => {
    setUploading(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          setUploadComplete(true);
          simulateAnalysis();
          return 100;
        }
        return prev + 10;
      });
    }, 500);
    
    toast({
      title: "Upload started",
      description: `Uploading ${file.name}`,
      variant: "default"
    });
  };
  
  const simulateAnalysis = () => {
    setAnalyzing(true);
    
    // Simulate analysis delay
    setTimeout(() => {
      setAnalyzing(false);
      
      toast({
        title: "Analysis complete",
        description: "Your video has been analyzed! GAR Score: 84",
        variant: "success"
      });
      
      // Reset for another upload
      setUploadComplete(false);
    }, 5000);
  };
  
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#0e1628" }}>
      {/* Header */}
      <header className="sticky top-0 z-10 bg-slate-900/90 backdrop-blur-sm border-b border-slate-800 py-3 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Go4It Sports
          </h1>
          <span className="text-slate-400">Video Analysis</span>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col max-w-7xl mx-auto w-full px-4 py-6">
        <div className="bg-slate-900 rounded-xl overflow-hidden w-full max-w-3xl mx-auto">
          <div className="p-6 border-b border-slate-800">
            <h2 className="text-xl font-bold text-white">Upload Video for GAR Analysis</h2>
            <p className="text-slate-400 text-sm mt-1">
              Upload your game footage to receive personalized insights and your Growth and Ability Rating (GAR) score
            </p>
          </div>
          
          <div className="p-6">
            {!uploading && !uploadComplete && !analyzing && (
              <div className="border-2 border-dashed border-slate-700 rounded-lg p-10 text-center">
                <div className="flex justify-center mb-4">
                  <FileVideo className="h-12 w-12 text-slate-500" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">Drag and drop your video file</h3>
                <p className="text-sm text-slate-400 mb-6 max-w-md mx-auto">
                  For best results, upload high-quality footage focused on your performance. Supported formats: MP4, MOV, AVI
                </p>
                <label htmlFor="video-upload" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md inline-flex items-center cursor-pointer transition-colors">
                  <Upload className="h-4 w-4 mr-2" />
                  Select Video
                  <input
                    id="video-upload"
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            )}
            
            {uploading && (
              <div className="p-6 bg-slate-800/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-white">Uploading Video...</h3>
                  <span className="text-sm text-blue-400">{uploadProgress}%</span>
                </div>
                <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-slate-400 mt-2">Do not close this window while uploading</p>
              </div>
            )}
            
            {uploadComplete && analyzing && (
              <div className="p-6 bg-slate-800/30 rounded-lg text-center">
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <Video className="h-12 w-12 text-slate-300" />
                    <div className="absolute -right-2 -bottom-2">
                      <Loader2 className="h-6 w-6 text-blue-400 animate-spin" />
                    </div>
                  </div>
                </div>
                <h3 className="text-lg font-medium text-white mb-2">Analyzing your performance</h3>
                <p className="text-sm text-slate-400 mb-4">
                  Our AI is breaking down your gameplay and calculating your GAR score
                </p>
                <div className="flex justify-center space-x-4 text-xs">
                  <div className="flex items-center text-green-400">
                    <Check className="h-4 w-4 mr-1" />
                    <span>Upload Complete</span>
                  </div>
                  <div className="flex items-center text-blue-400">
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    <span>Analyzing</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="bg-slate-800/50 p-4 border-t border-slate-800">
            <div className="text-sm text-slate-400">
              <strong className="text-white">Tips:</strong> Videos should be 30 seconds to 5 minutes in length for optimal analysis. Ensure the athlete is clearly visible.
            </div>
          </div>
        </div>
        
        {/* Sample GAR Score Card */}
        <div className="w-full max-w-3xl mx-auto mt-8 bg-slate-900 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-slate-800">
            <h2 className="text-xl font-bold text-white">Sample GAR Analysis</h2>
            <p className="text-slate-400 text-sm mt-1">
              Here's an example of the detailed analysis you'll receive
            </p>
          </div>
          
          <div className="p-6">
            <div className="flex flex-col md:flex-row mb-6">
              <div className="md:w-1/3 mb-4 md:mb-0 md:pr-4">
                <div className="bg-slate-800 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-2">Overall GAR Score</h3>
                  <div className="text-5xl font-bold bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">84</div>
                  <p className="text-xs text-slate-400 mt-2">Top 15% among athletes in your age group</p>
                </div>
              </div>
              
              <div className="md:w-2/3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-800 p-3 rounded-lg">
                    <h4 className="text-sm font-medium text-green-400">Physical</h4>
                    <div className="text-2xl font-bold text-white mt-1">82</div>
                    <div className="w-full h-2 bg-slate-700 rounded-full mt-2">
                      <div className="w-[82%] h-full bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                  <div className="bg-slate-800 p-3 rounded-lg">
                    <h4 className="text-sm font-medium text-blue-400">Technical</h4>
                    <div className="text-2xl font-bold text-white mt-1">86</div>
                    <div className="w-full h-2 bg-slate-700 rounded-full mt-2">
                      <div className="w-[86%] h-full bg-blue-500 rounded-full"></div>
                    </div>
                  </div>
                  <div className="bg-slate-800 p-3 rounded-lg">
                    <h4 className="text-sm font-medium text-purple-400">Tactical</h4>
                    <div className="text-2xl font-bold text-white mt-1">80</div>
                    <div className="w-full h-2 bg-slate-700 rounded-full mt-2">
                      <div className="w-[80%] h-full bg-purple-500 rounded-full"></div>
                    </div>
                  </div>
                  <div className="bg-slate-800 p-3 rounded-lg">
                    <h4 className="text-sm font-medium text-yellow-400">Mental</h4>
                    <div className="text-2xl font-bold text-white mt-1">88</div>
                    <div className="w-full h-2 bg-slate-700 rounded-full mt-2">
                      <div className="w-[88%] h-full bg-yellow-500 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-800 p-4 rounded-lg mb-4">
              <h3 className="font-medium text-white mb-3">Strengths</h3>
              <ul className="text-sm text-slate-300 space-y-2">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Excellent shooting form and release point</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Good court awareness and spatial recognition</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Strong defensive positioning relative to ball position</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-slate-800 p-4 rounded-lg">
              <h3 className="font-medium text-white mb-3">Areas for Improvement</h3>
              <ul className="text-sm text-slate-300 space-y-2">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-blue-400 mr-2 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 8V16M12 16L8 12M12 16L16 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Work on lateral movement speed and agility</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-blue-400 mr-2 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 8V16M12 16L8 12M12 16L16 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Improve left-hand dribbling control and confidence</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-blue-400 mr-2 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 8V16M12 16L8 12M12 16L16 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Develop more explosiveness in first step to create separation</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoUploadPage;