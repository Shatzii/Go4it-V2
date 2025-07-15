'use client'

import { useState, useRef, useEffect } from 'react'
import { Camera, Video, Square, Upload, RotateCw, Flash, FlashOff, Check, X } from 'lucide-react'

export function MobileVideoCapture() {
  const [isRecording, setIsRecording] = useState(false)
  const [hasRecording, setHasRecording] = useState(false)
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment')
  const [flashEnabled, setFlashEnabled] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [isPreview, setIsPreview] = useState(false)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const streamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    startCamera()
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [facingMode])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
        audio: true
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      
      streamRef.current = stream
    } catch (error) {
      console.error('Error accessing camera:', error)
    }
  }

  const startRecording = async () => {
    if (!streamRef.current) return

    // Start countdown
    setCountdown(3)
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev === 1) {
          clearInterval(countdownInterval)
          beginRecording()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const beginRecording = () => {
    if (!streamRef.current) return

    const mediaRecorder = new MediaRecorder(streamRef.current, {
      mimeType: 'video/webm;codecs=vp8,opus'
    })

    mediaRecorderRef.current = mediaRecorder
    chunksRef.current = []

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data)
      }
    }

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' })
      setRecordedBlob(blob)
      setHasRecording(true)
      setIsPreview(true)
      
      // Stop the live stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
        streamRef.current = null
      }
    }

    mediaRecorder.start()
    setIsRecording(true)
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const toggleCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user')
  }

  const toggleFlash = () => {
    setFlashEnabled(prev => !prev)
    // Note: Flash control would require more complex implementation
  }

  const retakeVideo = () => {
    setHasRecording(false)
    setRecordedBlob(null)
    setIsPreview(false)
    setUploadProgress(0)
    startCamera()
  }

  const uploadVideo = async () => {
    if (!recordedBlob) return

    setIsUploading(true)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      formData.append('video', recordedBlob, 'mobile-recording.webm')
      formData.append('sport', 'Football') // Could be selected by user
      formData.append('source', 'mobile')

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

      const response = await fetch('/api/videos/upload', {
        method: 'POST',
        body: formData
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (response.ok) {
        const data = await response.json()
        setTimeout(() => {
          window.location.href = `/video-analysis/${data.videoId}`
        }, 1000)
      }
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setIsUploading(false)
    }
  }

  if (isPreview && recordedBlob) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col">
        {/* Preview Header */}
        <div className="p-4 bg-black/50 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-white font-semibold">Preview Recording</h2>
            <button
              onClick={retakeVideo}
              className="text-white hover:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Video Preview */}
        <div className="flex-1 flex items-center justify-center bg-black">
          <video
            controls
            autoPlay
            className="max-h-full max-w-full"
            src={URL.createObjectURL(recordedBlob)}
          />
        </div>

        {/* Upload Progress */}
        {isUploading && (
          <div className="p-4 bg-black/50 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white text-sm">Uploading...</span>
              <span className="text-white text-sm">{Math.round(uploadProgress)}%</span>
            </div>
            <div className="w-full bg-gray-600 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="p-4 bg-black/50 backdrop-blur-sm">
          <div className="flex gap-4">
            <button
              onClick={retakeVideo}
              disabled={isUploading}
              className="flex-1 bg-gray-600 hover:bg-gray-700 disabled:opacity-50 text-white py-3 px-6 rounded-lg font-medium transition-colors"
            >
              Retake
            </button>
            <button
              onClick={uploadVideo}
              disabled={isUploading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Upload & Analyze
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="p-4 bg-black/50 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-white font-semibold">Record Performance</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleFlash}
              className="p-2 bg-white/20 rounded-full"
            >
              {flashEnabled ? (
                <Flash className="w-5 h-5 text-white" />
              ) : (
                <FlashOff className="w-5 h-5 text-white" />
              )}
            </button>
            <button
              onClick={toggleCamera}
              className="p-2 bg-white/20 rounded-full"
            >
              <RotateCw className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Camera View */}
      <div className="flex-1 relative">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
        
        {/* Recording Indicator */}
        {isRecording && (
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-full">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">REC</span>
          </div>
        )}

        {/* Countdown */}
        {countdown > 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-8xl font-bold text-white animate-pulse">
              {countdown}
            </div>
          </div>
        )}

        {/* Recording Guidelines */}
        <div className="absolute bottom-20 left-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-4">
          <h3 className="text-white font-medium mb-2">Recording Tips</h3>
          <ul className="text-white/80 text-sm space-y-1">
            <li>• Record in landscape orientation</li>
            <li>• Keep camera steady</li>
            <li>• Ensure good lighting</li>
            <li>• Capture full movement</li>
          </ul>
        </div>
      </div>

      {/* Controls */}
      <div className="p-6 bg-black/50 backdrop-blur-sm">
        <div className="flex items-center justify-center">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={countdown > 0}
            className={`w-20 h-20 rounded-full border-4 border-white flex items-center justify-center transition-all ${
              isRecording 
                ? 'bg-red-500 border-red-500' 
                : 'bg-transparent hover:bg-white/20'
            } ${countdown > 0 ? 'opacity-50' : ''}`}
          >
            {isRecording ? (
              <Square className="w-8 h-8 text-white" />
            ) : (
              <Video className="w-8 h-8 text-white" />
            )}
          </button>
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-white/80 text-sm">
            {isRecording ? 'Tap to stop recording' : 'Tap to start recording'}
          </p>
        </div>
      </div>
    </div>
  )
}