'use client';

import { useState } from 'react';
import { MobileVideoRecorder, MobileVideoUpload, MobileProgressIndicator } from '@/components/mobile/MobileOptimizations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Upload, ArrowLeft } from 'lucide-react';

export default function MobileVideoUploadPage() {
  const [uploadMethod, setUploadMethod] = useState<'camera' | 'file' | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = ['Choose Method', 'Record/Select', 'Analysis', 'Results'];

  const handleVideoRecorded = async (videoBlob: Blob) => {
    setCurrentStep(2);
    // Handle video upload and analysis
    console.log('Video recorded:', videoBlob);
    
    // Simulate analysis process
    setTimeout(() => {
      setCurrentStep(3);
    }, 3000);
  };

  const handleVideoUploaded = async (file: File) => {
    setCurrentStep(2);
    // Handle video upload and analysis
    console.log('Video uploaded:', file);
    
    // Simulate analysis process
    setTimeout(() => {
      setCurrentStep(3);
    }, 3000);
  };

  const handleBack = () => {
    if (uploadMethod) {
      setUploadMethod(null);
      setCurrentStep(0);
    } else {
      window.history.back();
    }
  };

  if (uploadMethod === 'camera') {
    return (
      <MobileVideoRecorder 
        onVideoRecorded={handleVideoRecorded}
        onCancel={handleBack}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 pb-safe">
      <MobileProgressIndicator steps={steps} currentStep={currentStep} />
      
      {/* Header */}
      <div className="flex items-center p-4 bg-slate-900/95 backdrop-blur border-b border-slate-700">
        <Button variant="ghost" size="sm" onClick={handleBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="ml-3 text-lg font-semibold text-white">Video Analysis</h1>
      </div>

      <div className="p-4 space-y-6">
        {currentStep === 0 && (
          <>
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-white">Choose Upload Method</CardTitle>
                <p className="text-slate-400 text-sm">
                  Record a new video or upload from your device
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={() => {
                    setUploadMethod('camera');
                    setCurrentStep(1);
                  }}
                  className="w-full h-16 bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-3"
                >
                  <Camera className="w-6 h-6" />
                  <div>
                    <div className="font-semibold">Record New Video</div>
                    <div className="text-sm opacity-80">Use your camera</div>
                  </div>
                </Button>
                
                <Button
                  onClick={() => {
                    setUploadMethod('file');
                    setCurrentStep(1);
                  }}
                  variant="outline"
                  className="w-full h-16 border-slate-600 text-slate-300 hover:bg-slate-700 flex items-center justify-center gap-3"
                >
                  <Upload className="w-6 h-6" />
                  <div>
                    <div className="font-semibold">Upload from Device</div>
                    <div className="text-sm opacity-80">Choose existing video</div>
                  </div>
                </Button>
              </CardContent>
            </Card>

            {/* Tips for mobile video */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <h3 className="font-semibold text-white mb-2">📱 Mobile Video Tips</h3>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li>• Hold phone horizontally (landscape)</li>
                  <li>• Ensure good lighting</li>
                  <li>• Show full body movement</li>
                  <li>• Keep camera steady</li>
                  <li>• Video should be 10-30 seconds</li>
                </ul>
              </CardContent>
            </Card>
          </>
        )}

        {currentStep === 1 && uploadMethod === 'file' && (
          <MobileVideoUpload onVideoUploaded={handleVideoUploaded} />
        )}

        {currentStep === 2 && (
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-white mb-2">Analyzing Video</h3>
              <p className="text-slate-400">
                Our AI is analyzing your performance across 5 key metrics...
              </p>
            </CardContent>
          </Card>
        )}

        {currentStep === 3 && (
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-4">🎉</div>
              <h3 className="text-xl font-semibold text-white mb-2">Analysis Complete!</h3>
              <p className="text-slate-400 mb-6">
                Your GAR score and detailed breakdown are ready
              </p>
              <Button 
                onClick={() => window.location.href = '/dashboard'}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                View Results
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}