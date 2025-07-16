'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Smartphone, 
  Camera, 
  Upload, 
  Share2, 
  FileText, 
  Video, 
  Image as ImageIcon,
  Zap,
  CheckCircle,
  AlertTriangle,
  Info,
  ExternalLink,
  Download,
  Cloud
} from 'lucide-react'
import Link from 'next/link'

export default function UploadGuidePage() {
  const uploadMethods = [
    {
      title: "Direct Camera Recording",
      icon: Camera,
      description: "Record videos directly in your browser",
      steps: [
        "Open Go4It Sports in your mobile browser",
        "Navigate to Upload → Camera Recording",
        "Allow camera and microphone access",
        "Hold phone horizontally for best quality",
        "Tap record and capture your highlight",
        "Add sport and description",
        "Upload immediately or save for later"
      ],
      pros: ["Immediate upload", "No storage used", "Built-in compression"],
      cons: ["Requires stable internet", "Limited to 5 minutes"],
      url: "/upload-mobile"
    },
    {
      title: "File Upload from Gallery",
      icon: Upload,
      description: "Upload existing videos and photos",
      steps: [
        "Go to Upload → File Upload",
        "Tap 'Choose Files' or drag/drop",
        "Select videos/photos from your gallery",
        "Add metadata (sport, description)",
        "Upload single files or batches",
        "Monitor upload progress",
        "Files are processed automatically"
      ],
      pros: ["Upload multiple files", "Works with any file type", "Offline preparation"],
      cons: ["Uses device storage", "May need compression"],
      url: "/upload-mobile"
    },
    {
      title: "Share from Other Apps",
      icon: Share2,
      description: "Share directly from camera roll, social media, or editing apps",
      steps: [
        "Open your video in any app (Camera, TikTok, Instagram, etc.)",
        "Tap the share button",
        "Look for 'Go4It Sports' in the share menu",
        "If not visible, tap 'More' and enable it",
        "Share will auto-open Go4It upload page",
        "Complete the upload process"
      ],
      pros: ["Most convenient", "Works from any app", "Quick sharing"],
      cons: ["Requires PWA installation", "Limited metadata options"],
      url: "/upload-mobile"
    },
    {
      title: "Email Upload",
      icon: FileText,
      description: "Send files via email when other methods aren't available",
      steps: [
        "Compose email to: uploads@go4itsports.com",
        "Subject: Upload - [Your Name] - [Sport]",
        "Attach video/photo files",
        "Include description in email body",
        "Send email",
        "Files will be added to your profile within 24 hours"
      ],
      pros: ["Works anywhere", "No app required", "Handles large files"],
      cons: ["Manual processing", "Slower", "Less metadata"],
      url: "mailto:uploads@go4itsports.com"
    }
  ]

  const fileTypes = [
    {
      category: "Videos",
      icon: Video,
      formats: ["MP4", "MOV", "AVI", "MKV", "WebM"],
      maxSize: "500MB",
      recommendations: [
        "1080p resolution preferred",
        "30fps or 60fps",
        "H.264 codec for best compatibility",
        "Horizontal orientation for highlights"
      ]
    },
    {
      category: "Images",
      icon: ImageIcon,
      formats: ["JPG", "PNG", "HEIC", "WebP"],
      maxSize: "50MB",
      recommendations: [
        "High resolution (at least 1920x1080)",
        "Good lighting and focus",
        "Action shots preferred",
        "Multiple angles if possible"
      ]
    },
    {
      category: "Documents",
      icon: FileText,
      formats: ["PDF", "DOC", "DOCX", "TXT"],
      maxSize: "25MB",
      recommendations: [
        "Stats sheets and game reports",
        "Training logs and progress notes",
        "Coach evaluations",
        "Tournament brackets and results"
      ]
    }
  ]

  const mobileOptimizations = [
    {
      title: "Install as PWA",
      description: "Add Go4It Sports to your home screen for app-like experience",
      steps: [
        "Open Go4It Sports in your browser",
        "Tap browser menu (3 dots)",
        "Select 'Add to Home Screen'",
        "Confirm installation",
        "Use like a native app"
      ],
      benefits: ["Faster loading", "Offline access", "Push notifications", "Share menu integration"]
    },
    {
      title: "Optimize for Mobile",
      description: "Best practices for mobile uploads",
      tips: [
        "Use WiFi when possible for large files",
        "Clear browser cache if uploads fail",
        "Close other apps to free memory",
        "Keep phone plugged in for long uploads",
        "Use airplane mode + WiFi for stable connection"
      ]
    },
    {
      title: "Offline Preparation",
      description: "Prepare uploads when you have no internet",
      process: [
        "Record/edit videos offline",
        "Organize files by sport/date",
        "Write descriptions in notes app",
        "Connect to WiFi when ready",
        "Batch upload all prepared content"
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-slate-900 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Mobile Upload Guide
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Complete guide to uploading your athletic content from any mobile device
          </p>
          <div className="mt-6">
            <Link href="/upload-mobile">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Upload className="w-4 h-4 mr-2" />
                Start Uploading Now
              </Button>
            </Link>
          </div>
        </div>

        {/* Upload Methods */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Upload Methods
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {uploadMethods.map((method, index) => {
              const Icon = method.icon
              return (
                <Card key={index} className="bg-slate-800 border-slate-700 hover:border-slate-600 transition-colors">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-3">
                      <Icon className="w-6 h-6 text-blue-400" />
                      {method.title}
                    </CardTitle>
                    <CardDescription className="text-slate-300">
                      {method.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Steps */}
                    <div>
                      <h4 className="font-medium text-white mb-2">Steps:</h4>
                      <ol className="text-sm text-slate-300 space-y-1">
                        {method.steps.map((step, stepIndex) => (
                          <li key={stepIndex} className="flex items-start gap-2">
                            <span className="text-blue-400 font-medium">{stepIndex + 1}.</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* Pros and Cons */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <h5 className="text-green-400 font-medium mb-1">Pros:</h5>
                        <ul className="text-xs text-slate-300 space-y-1">
                          {method.pros.map((pro, proIndex) => (
                            <li key={proIndex} className="flex items-center gap-1">
                              <CheckCircle className="w-3 h-3 text-green-400 flex-shrink-0" />
                              {pro}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="text-yellow-400 font-medium mb-1">Cons:</h5>
                        <ul className="text-xs text-slate-300 space-y-1">
                          {method.cons.map((con, conIndex) => (
                            <li key={conIndex} className="flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3 text-yellow-400 flex-shrink-0" />
                              {con}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Link href={method.url}>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                        {method.url.startsWith('mailto:') ? (
                          <>
                            <FileText className="w-4 h-4 mr-2" />
                            Send Email
                          </>
                        ) : (
                          <>
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Try This Method
                          </>
                        )}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* File Types */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Supported File Types
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {fileTypes.map((type, index) => {
              const Icon = type.icon
              return (
                <Card key={index} className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-3">
                      <Icon className="w-6 h-6 text-blue-400" />
                      {type.category}
                    </CardTitle>
                    <div className="flex flex-wrap gap-2">
                      {type.formats.map((format, formatIndex) => (
                        <Badge key={formatIndex} variant="outline" className="border-slate-600 text-slate-300">
                          {format}
                        </Badge>
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-3">
                      <span className="text-sm text-slate-400">Max Size: </span>
                      <span className="text-white font-medium">{type.maxSize}</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-white mb-2">Recommendations:</h4>
                      <ul className="text-sm text-slate-300 space-y-1">
                        {type.recommendations.map((rec, recIndex) => (
                          <li key={recIndex} className="flex items-start gap-2">
                            <Info className="w-3 h-3 text-blue-400 flex-shrink-0 mt-0.5" />
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Mobile Optimizations */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Mobile Optimization Tips
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mobileOptimizations.map((opt, index) => (
              <Card key={index} className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-3">
                    <Smartphone className="w-6 h-6 text-blue-400" />
                    {opt.title}
                  </CardTitle>
                  <CardDescription className="text-slate-300">
                    {opt.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {opt.steps && (
                    <div className="mb-4">
                      <h4 className="font-medium text-white mb-2">Steps:</h4>
                      <ol className="text-sm text-slate-300 space-y-1">
                        {opt.steps.map((step, stepIndex) => (
                          <li key={stepIndex} className="flex items-start gap-2">
                            <span className="text-blue-400 font-medium">{stepIndex + 1}.</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                  
                  {opt.benefits && (
                    <div className="mb-4">
                      <h4 className="font-medium text-white mb-2">Benefits:</h4>
                      <ul className="text-sm text-slate-300 space-y-1">
                        {opt.benefits.map((benefit, benefitIndex) => (
                          <li key={benefitIndex} className="flex items-center gap-2">
                            <CheckCircle className="w-3 h-3 text-green-400 flex-shrink-0" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {opt.tips && (
                    <div className="mb-4">
                      <h4 className="font-medium text-white mb-2">Tips:</h4>
                      <ul className="text-sm text-slate-300 space-y-1">
                        {opt.tips.map((tip, tipIndex) => (
                          <li key={tipIndex} className="flex items-start gap-2">
                            <Zap className="w-3 h-3 text-yellow-400 flex-shrink-0 mt-0.5" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {opt.process && (
                    <div>
                      <h4 className="font-medium text-white mb-2">Process:</h4>
                      <ol className="text-sm text-slate-300 space-y-1">
                        {opt.process.map((step, stepIndex) => (
                          <li key={stepIndex} className="flex items-start gap-2">
                            <span className="text-blue-400 font-medium">{stepIndex + 1}.</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Troubleshooting */}
        <Card className="bg-slate-800 border-slate-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-yellow-400" />
              Troubleshooting Common Issues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-white mb-3">Upload Failures</h4>
                <ul className="text-sm text-slate-300 space-y-2">
                  <li>• Check internet connection stability</li>
                  <li>• Ensure file size is under limits</li>
                  <li>• Try uploading one file at a time</li>
                  <li>• Clear browser cache and cookies</li>
                  <li>• Switch to WiFi from cellular data</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-white mb-3">Camera Access Issues</h4>
                <ul className="text-sm text-slate-300 space-y-2">
                  <li>• Allow camera permissions in browser</li>
                  <li>• Close other apps using camera</li>
                  <li>• Try refreshing the page</li>
                  <li>• Check if browser supports camera API</li>
                  <li>• Try a different browser if needed</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-white mb-3">Slow Upload Speeds</h4>
                <ul className="text-sm text-slate-300 space-y-2">
                  <li>• Use WiFi instead of cellular</li>
                  <li>• Upload during off-peak hours</li>
                  <li>• Compress videos before upload</li>
                  <li>• Upload smaller batches</li>
                  <li>• Check network signal strength</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-white mb-3">File Processing</h4>
                <ul className="text-sm text-slate-300 space-y-2">
                  <li>• Processing can take 5-30 minutes</li>
                  <li>• You'll receive email notifications</li>
                  <li>• Check upload history in dashboard</li>
                  <li>• Contact support if stuck over 1 hour</li>
                  <li>• Re-upload if processing fails</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Start */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-0">
          <CardHeader>
            <CardTitle className="text-white text-center">
              Ready to Upload?
            </CardTitle>
            <CardDescription className="text-blue-100 text-center">
              Choose your preferred method and start showcasing your athletic talent
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/upload-mobile">
                <Button className="bg-white text-blue-600 hover:bg-blue-50">
                  <Camera className="w-4 h-4 mr-2" />
                  Record Video
                </Button>
              </Link>
              <Link href="/upload-mobile">
                <Button className="bg-white text-blue-600 hover:bg-blue-50">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Files
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button className="bg-white text-blue-600 hover:bg-blue-50">
                  <Cloud className="w-4 h-4 mr-2" />
                  View Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}