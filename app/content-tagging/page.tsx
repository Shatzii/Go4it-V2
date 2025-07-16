'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Tags, 
  Brain, 
  Upload, 
  Search, 
  Filter, 
  BarChart3, 
  Zap, 
  CheckCircle, 
  AlertCircle,
  Target,
  TrendingUp,
  FileText,
  Video,
  Image as ImageIcon,
  Lightbulb,
  Star,
  Award,
  Clock,
  Play,
  Pause,
  RefreshCw
} from 'lucide-react'

interface ContentTag {
  id: string
  name: string
  category: string
  confidence: number
  relevance: number
  metadata?: any
}

interface FileAnalysis {
  fileId: number
  fileName: string
  fileType: string
  hasAnalysis: boolean
  tagCount: number
  uploadedAt: string
}

interface AnalysisResult {
  fileId: number
  fileName: string
  success: boolean
  tagsCount: number
  skillsCount: number
  analysis: {
    primarySport: string
    performance: any
    suggestions: string[]
    autoCategories: string[]
  }
}

export default function ContentTaggingPage() {
  const [files, setFiles] = useState<FileAnalysis[]>([])
  const [tags, setTags] = useState<ContentTag[]>([])
  const [selectedFiles, setSelectedFiles] = useState<number[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterSport, setFilterSport] = useState('all')
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([])

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'sport', label: 'Sports' },
    { value: 'skill', label: 'Skills' },
    { value: 'performance', label: 'Performance' },
    { value: 'technique', label: 'Technique' },
    { value: 'strategy', label: 'Strategy' },
    { value: 'equipment', label: 'Equipment' },
    { value: 'event', label: 'Events' },
    { value: 'location', label: 'Location' }
  ]

  const sports = [
    { value: 'all', label: 'All Sports' },
    { value: 'football', label: 'Football' },
    { value: 'basketball', label: 'Basketball' },
    { value: 'soccer', label: 'Soccer' },
    { value: 'baseball', label: 'Baseball' },
    { value: 'tennis', label: 'Tennis' },
    { value: 'golf', label: 'Golf' },
    { value: 'track', label: 'Track & Field' },
    { value: 'swimming', label: 'Swimming' }
  ]

  // Load files and analysis status
  useEffect(() => {
    loadFiles()
    loadTags()
  }, [])

  const loadFiles = async () => {
    try {
      const response = await fetch('/api/content/bulk-analyze')
      const data = await response.json()
      if (data.files) {
        setFiles(data.files)
      }
    } catch (error) {
      console.error('Failed to load files:', error)
    }
  }

  const loadTags = async () => {
    try {
      const response = await fetch('/api/content/analyze')
      const data = await response.json()
      if (data.tags) {
        setTags(data.tags)
      }
    } catch (error) {
      console.error('Failed to load tags:', error)
    }
  }

  const handleBulkAnalysis = async () => {
    if (selectedFiles.length === 0) {
      alert('Please select files to analyze')
      return
    }

    setIsAnalyzing(true)
    try {
      const response = await fetch('/api/content/bulk-analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileIds: selectedFiles,
          batchSize: 5
        })
      })

      const data = await response.json()
      if (data.success) {
        setAnalysisResults(data.results)
        await loadFiles() // Refresh file list
        await loadTags() // Refresh tags
        alert(`Analysis complete! Processed ${data.processed} files with ${data.errors} errors.`)
      }
    } catch (error) {
      console.error('Bulk analysis failed:', error)
      alert('Bulk analysis failed. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleFileSelect = (fileId: number) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    )
  }

  const filteredTags = tags.filter(tag => {
    const matchesSearch = tag.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = filterCategory === 'all' || tag.category === filterCategory
    const matchesSport = filterSport === 'all' || 
      tag.name.toLowerCase().includes(filterSport.toLowerCase()) ||
      tag.metadata?.sport?.toLowerCase() === filterSport.toLowerCase()
    
    return matchesSearch && matchesCategory && matchesSport
  })

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'video':
        return <Video className="w-4 h-4" />
      case 'image':
        return <ImageIcon className="w-4 h-4" />
      case 'document':
        return <FileText className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      sport: 'bg-blue-100 text-blue-800',
      skill: 'bg-green-100 text-green-800',
      performance: 'bg-purple-100 text-purple-800',
      technique: 'bg-orange-100 text-orange-800',
      strategy: 'bg-red-100 text-red-800',
      equipment: 'bg-gray-100 text-gray-800',
      event: 'bg-yellow-100 text-yellow-800',
      location: 'bg-pink-100 text-pink-800'
    }
    return colors[category] || 'bg-gray-100 text-gray-800'
  }

  const analysisStats = {
    totalFiles: files.length,
    analyzedFiles: files.filter(f => f.hasAnalysis).length,
    pendingFiles: files.filter(f => !f.hasAnalysis).length,
    totalTags: tags.length,
    avgTagsPerFile: files.length > 0 ? Math.round(tags.length / files.length) : 0
  }

  return (
    <div className="min-h-screen bg-slate-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Brain className="w-8 h-8 text-blue-400" />
            Smart Content Tagging AI
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Automatically analyze and tag your athletic content with AI-powered insights
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-sm text-slate-400">Total Files</p>
                  <p className="text-xl font-bold text-white">{analysisStats.totalFiles}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-sm text-slate-400">Analyzed</p>
                  <p className="text-xl font-bold text-white">{analysisStats.analyzedFiles}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-yellow-400" />
                <div>
                  <p className="text-sm text-slate-400">Pending</p>
                  <p className="text-xl font-bold text-white">{analysisStats.pendingFiles}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Tags className="w-5 h-5 text-purple-400" />
                <div>
                  <p className="text-sm text-slate-400">Total Tags</p>
                  <p className="text-xl font-bold text-white">{analysisStats.totalTags}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-orange-400" />
                <div>
                  <p className="text-sm text-slate-400">Avg Tags</p>
                  <p className="text-xl font-bold text-white">{analysisStats.avgTagsPerFile}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="files" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800 border-slate-700">
            <TabsTrigger value="files" className="data-[state=active]:bg-slate-700">
              File Analysis
            </TabsTrigger>
            <TabsTrigger value="tags" className="data-[state=active]:bg-slate-700">
              Tag Explorer
            </TabsTrigger>
            <TabsTrigger value="insights" className="data-[state=active]:bg-slate-700">
              Insights
            </TabsTrigger>
          </TabsList>

          {/* File Analysis Tab */}
          <TabsContent value="files" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Bulk Content Analysis
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Select files to analyze with AI for automatic tagging and insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 mb-6">
                  <Button
                    onClick={() => setSelectedFiles(files.filter(f => !f.hasAnalysis).map(f => f.fileId))}
                    variant="outline"
                    className="border-slate-600 text-white"
                  >
                    Select Unanalyzed
                  </Button>
                  <Button
                    onClick={() => setSelectedFiles([])}
                    variant="outline"
                    className="border-slate-600 text-white"
                  >
                    Clear Selection
                  </Button>
                  <Button
                    onClick={handleBulkAnalysis}
                    disabled={selectedFiles.length === 0 || isAnalyzing}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isAnalyzing ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        Analyze Selected ({selectedFiles.length})
                      </>
                    )}
                  </Button>
                </div>

                <div className="space-y-3">
                  {files.map(file => (
                    <div
                      key={file.fileId}
                      className={`p-4 rounded-lg border transition-colors cursor-pointer ${
                        selectedFiles.includes(file.fileId)
                          ? 'border-blue-500 bg-blue-900/20'
                          : 'border-slate-600 bg-slate-700/50'
                      }`}
                      onClick={() => handleFileSelect(file.fileId)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            {getFileIcon(file.fileType)}
                            <span className="text-white font-medium">{file.fileName}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {file.hasAnalysis ? (
                              <Badge className="bg-green-100 text-green-800">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Analyzed
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="border-yellow-400 text-yellow-400">
                                <Clock className="w-3 h-3 mr-1" />
                                Pending
                              </Badge>
                            )}
                            {file.tagCount > 0 && (
                              <Badge variant="outline" className="border-slate-500 text-slate-300">
                                {file.tagCount} tags
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="text-sm text-slate-400">
                          {new Date(file.uploadedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Analysis Results */}
                {analysisResults.length > 0 && (
                  <div className="mt-6 space-y-4">
                    <h3 className="text-lg font-semibold text-white">Recent Analysis Results</h3>
                    {analysisResults.map(result => (
                      <Card key={result.fileId} className="bg-slate-700 border-slate-600">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-white">{result.fileName}</h4>
                            {result.success ? (
                              <CheckCircle className="w-5 h-5 text-green-400" />
                            ) : (
                              <AlertCircle className="w-5 h-5 text-red-400" />
                            )}
                          </div>
                          {result.success && (
                            <div className="space-y-2 text-sm">
                              <p className="text-slate-300">
                                <span className="font-medium">Sport:</span> {result.analysis.primarySport}
                              </p>
                              <p className="text-slate-300">
                                <span className="font-medium">Tags:</span> {result.tagsCount} • 
                                <span className="font-medium"> Skills:</span> {result.skillsCount}
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {result.analysis.autoCategories.map(category => (
                                  <Badge key={category} variant="outline" className="text-xs">
                                    {category}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tag Explorer Tab */}
          <TabsContent value="tags" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Tag Explorer
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Search and filter through all your content tags
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <Input
                      placeholder="Search tags..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-48 bg-slate-700 border-slate-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={filterSport} onValueChange={setFilterSport}>
                    <SelectTrigger className="w-48 bg-slate-700 border-slate-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {sports.map(sport => (
                        <SelectItem key={sport.value} value={sport.value}>
                          {sport.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTags.map(tag => (
                    <Card key={tag.id} className="bg-slate-700 border-slate-600">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-white">{tag.name}</h4>
                          <Badge className={getCategoryColor(tag.category)}>
                            {tag.category}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Confidence:</span>
                            <span className="text-white">{Math.round(tag.confidence * 100)}%</span>
                          </div>
                          <Progress value={tag.confidence * 100} className="h-2" />
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Relevance:</span>
                            <span className="text-white">{Math.round(tag.relevance * 100)}%</span>
                          </div>
                          <Progress value={tag.relevance * 100} className="h-2" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {filteredTags.length === 0 && (
                  <div className="text-center py-8">
                    <Tags className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400">No tags found matching your criteria</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Tag Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-white">{analysisStats.totalTags}</h3>
                      <p className="text-slate-400">Total Tags Generated</p>
                    </div>
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-white">{analysisStats.avgTagsPerFile}</h3>
                      <p className="text-slate-400">Average Tags per File</p>
                    </div>
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-white">
                        {Math.round((analysisStats.analyzedFiles / analysisStats.totalFiles) * 100)}%
                      </h3>
                      <p className="text-slate-400">Analysis Coverage</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Lightbulb className="w-5 h-5" />
                    AI Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-blue-900/20 rounded-lg border border-blue-500">
                      <h4 className="font-medium text-blue-400 mb-2">Most Common Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {['Basketball', 'Dribbling', 'Shooting', 'Practice'].map(tag => (
                          <Badge key={tag} variant="outline" className="border-blue-400 text-blue-400">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="p-3 bg-green-900/20 rounded-lg border border-green-500">
                      <h4 className="font-medium text-green-400 mb-2">Performance Trends</h4>
                      <p className="text-sm text-slate-300">
                        Technical skills showing improvement over time
                      </p>
                    </div>
                    
                    <div className="p-3 bg-purple-900/20 rounded-lg border border-purple-500">
                      <h4 className="font-medium text-purple-400 mb-2">Recommendations</h4>
                      <p className="text-sm text-slate-300">
                        Focus on tactical development and game strategy
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}