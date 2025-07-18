'use client'

import { useState } from 'react'
import { Upload, Camera, FileVideo, Smartphone } from 'lucide-react'
import { MobileVideoCapture } from '@/components/mobile/MobileVideoCapture'
import { ErrorBoundary } from '@/components/ErrorBoundary'

function UploadPageComponent() {
  const [showMobileCapture, setShowMobileCapture] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      formData.append('video', file)
      formData.append('sport', 'Football')
      formData.append('source', 'web')

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + Math.random() * 10
        })
      }, 200)

      const response = await fetch('/api/gar/analyze', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth-token')}`
        }
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (response.ok) {
        const data = await response.json()
        setTimeout(() => {
          window.location.href = `/dashboard?analysis=${data.analysisId}`
        }, 1000)
      }
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setIsUploading(false)
    }
  }

  if (showMobileCapture) {
    return <MobileVideoCapture />
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white" id="main-content">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Upload Performance Video</h1>
          <p className="text-slate-400">
            Upload your athletic performance videos for AI-powered analysis and GAR scoring
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* File Upload */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="text-center">
              <Upload className="w-16 h-16 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Upload Video File</h3>
              <p className="text-slate-400 mb-6">
                Select a video file from your device to upload for analysis
              </p>
              
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isUploading}
                />
                <div className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg inline-flex items-center gap-2 transition-colors">
                  <FileVideo className="w-5 h-5" />
                  Choose Video File
                </div>
              </label>
            </div>

            {isUploading && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white">Uploading...</span>
                  <span className="text-sm text-white">{Math.round(uploadProgress)}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Mobile Recording */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="text-center">
              <Smartphone className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Record with Mobile</h3>
              <p className="text-slate-400 mb-6">
                Use your mobile device to record performance videos directly
              </p>
              
              <button
                onClick={() => setShowMobileCapture(true)}
                className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg inline-flex items-center gap-2 transition-colors"
              >
                <Camera className="w-5 h-5" />
                Start Recording
              </button>
            </div>
          </div>
        </div>

        {/* Upload Guidelines */}
        <div className="mt-8 bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h3 className="text-lg font-semibold mb-4">Video Upload Guidelines</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-white mb-2">Technical Requirements</h4>
              <ul className="text-slate-300 space-y-1 text-sm">
                <li>• File formats: MP4, MOV, AVI, WebM</li>
                <li>• Maximum file size: 500MB</li>
                <li>• Resolution: 720p minimum, 1080p preferred</li>
                <li>• Frame rate: 30fps or higher</li>
                <li>• Duration: 30 seconds to 10 minutes</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-white mb-2">Best Practices</h4>
              <ul className="text-slate-300 space-y-1 text-sm">
                <li>• Record in landscape orientation</li>
                <li>• Ensure good lighting conditions</li>
                <li>• Keep camera steady or use tripod</li>
                <li>• Capture full body movement</li>
                <li>• Include multiple angles if possible</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Supported Sports */}
        <div className="mt-8 bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h3 className="text-lg font-semibold mb-4">Supported Sports</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              'Football', 'Basketball', 'Baseball', 'Soccer',
              'Track & Field', 'Swimming', 'Tennis', 'Golf',
              'Wrestling', 'Volleyball', 'Lacrosse', 'Softball'
            ].map((sport) => (
              <div key={sport} className="bg-slate-700 rounded-lg p-3 text-center">
                <span className="text-white font-medium">{sport}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function UploadPage() {
  return (
    <ErrorBoundary>
      <UploadPageComponent />
    </ErrorBoundary>
  );
}