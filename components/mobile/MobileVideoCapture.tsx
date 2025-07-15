'use client'

import { useState, useRef, useEffect } from 'react'
import { Video, Camera, Upload, X, Play, Pause, RotateCcw, Check } from 'lucide-react'

interface VideoUploadProps {
  onUpload: (file: File) => Promise<void>
  sport?: string
  onClose?: () => void
}

export function MobileVideoCapture({ onUpload, sport, onClose }: VideoUploadProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [recordingTime, setRecordingTime] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment')
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const recordedVideoRef = useRef<HTMLVideoElement>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    startCamera()
    return () => {
      stopCamera()
    }
  }, [facingMode])

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: true
      })
      
      setStream(mediaStream)
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (error) {
      console.error('Error accessing camera:', error)
      alert('Unable to access camera. Please check permissions.')
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
    }
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
  }

  const startRecording = () => {
    if (!stream) return

    const recorder = new MediaRecorder(stream)
    chunksRef.current = []
    
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data)
      }
    }
    
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' })
      const url = URL.createObjectURL(blob)
      setRecordedVideo(url)
    }
    
    recorder.start()
    setMediaRecorder(recorder)
    setIsRecording(true)
    setRecordingTime(0)
    
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1)
    }, 1000)
  }

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop()
    }
    setIsRecording(false)
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
  }

  const retakeVideo = () => {
    setRecordedVideo(null)
    setRecordingTime(0)
    if (recordedVideoRef.current) {
      recordedVideoRef.current.src = ''
    }
  }

  const handleUpload = async () => {
    if (!recordedVideo) return

    setIsUploading(true)
    try {
      const response = await fetch(recordedVideo)
      const blob = await response.blob()
      const file = new File([blob], `performance-${Date.now()}.webm`, { type: 'video/webm' })
      
      await onUpload(file)
      
      if (onClose) {
        onClose()
      }
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Upload failed. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      onUpload(file)
    }
  }

  const toggleCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user')
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="bg-slate-900 p-4 flex items-center justify-between">
        <h2 className="text-white font-semibold">Record Performance</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleCamera}
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-white transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Video Display */}
      <div className="flex-1 relative bg-black">
        {recordedVideo ? (
          <video
            ref={recordedVideoRef}
            src={recordedVideo}
            controls
            className="w-full h-full object-cover"
          />
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        )}

        {/* Recording Indicator */}
        {isRecording && (
          <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="text-sm font-mono">{formatTime(recordingTime)}</span>
          </div>
        )}

        {/* Sport Indicator */}
        {sport && (
          <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full">
            <span className="text-sm font-medium">{sport}</span>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-slate-900 p-6">
        {recordedVideo ? (
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={retakeVideo}
              className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
              Retake
            </button>
            <button
              onClick={handleUpload}
              disabled={isUploading}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg transition-colors"
            >
              {isUploading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  Upload Video
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-4">
            <label className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg transition-colors cursor-pointer">
              <Upload className="w-5 h-5" />
              Choose File
              <input
                type="file"
                accept="video/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`flex items-center gap-2 px-8 py-3 rounded-lg font-medium transition-colors ${
                isRecording 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isRecording ? (
                <>
                  <Pause className="w-5 h-5" />
                  Stop
                </>
              ) : (
                <>
                  <Video className="w-5 h-5" />
                  Record
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}