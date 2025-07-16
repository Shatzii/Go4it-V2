'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Play, FileText, MessageSquare, Shield, CheckCircle, Clock, Users } from 'lucide-react'

interface LMSData {
  success: boolean
  courseContent: any
  assignments: any[]
  discussions: any[]
  integrityChecks: any
  studentProgress: any
  lastUpdated: string
}

export default function LMSPage() {
  const [lmsData, setLmsData] = useState<LMSData | null>(null)
  const [selectedModule, setSelectedModule] = useState(0)
  const [activeTab, setActiveTab] = useState('content')

  useEffect(() => {
    const fetchLMSData = async () => {
      try {
        const response = await fetch('/api/academy/lms')
        const data = await response.json()
        setLmsData(data)
      } catch (error) {
        console.error('Error fetching LMS data:', error)
      }
    }

    fetchLMSData()
  }, [])

  if (!lmsData) {
    return (
      <div className="min-h-screen bg-slate-900 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-white">Loading Learning Management System...</p>
          </div>
        </div>
      </div>
    )
  }

  const modules = lmsData.courseContent.modules || []
  const currentModule = modules[selectedModule] || {}
  const lessons = currentModule.lessons || []

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 text-white p-6 rounded-lg">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Play className="w-8 h-8 text-purple-400" />
            Learning Management System
          </h1>
          <p className="text-lg text-slate-300">Interactive content delivery, discussion forums, and plagiarism detection</p>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Lessons Completed</p>
                  <p className="text-2xl font-bold text-white">{lmsData.studentProgress.completedLessons}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Total Lessons</p>
                  <p className="text-2xl font-bold text-white">{lmsData.studentProgress.totalLessons}</p>
                </div>
                <Play className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Time Spent</p>
                  <p className="text-2xl font-bold text-white">{Math.round(lmsData.studentProgress.timeSpent / 60)}h</p>
                </div>
                <Clock className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Average Score</p>
                  <p className="text-2xl font-bold text-white">{lmsData.studentProgress.averageScore}%</p>
                </div>
                <Badge className="bg-green-500 text-white">Excellent</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === 'content' ? "default" : "outline"}
            className={activeTab === 'content' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-700 border-slate-600 text-white hover:bg-slate-600'}
            onClick={() => setActiveTab('content')}
          >
            <Play className="w-4 h-4 mr-2" />
            Course Content
          </Button>
          <Button
            variant={activeTab === 'assignments' ? "default" : "outline"}
            className={activeTab === 'assignments' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-700 border-slate-600 text-white hover:bg-slate-600'}
            onClick={() => setActiveTab('assignments')}
          >
            <FileText className="w-4 h-4 mr-2" />
            Assignments
          </Button>
          <Button
            variant={activeTab === 'discussions' ? "default" : "outline"}
            className={activeTab === 'discussions' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-700 border-slate-600 text-white hover:bg-slate-600'}
            onClick={() => setActiveTab('discussions')}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Discussions
          </Button>
          <Button
            variant={activeTab === 'integrity' ? "default" : "outline"}
            className={activeTab === 'integrity' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-700 border-slate-600 text-white hover:bg-slate-600'}
            onClick={() => setActiveTab('integrity')}
          >
            <Shield className="w-4 h-4 mr-2" />
            Academic Integrity
          </Button>
        </div>

        {/* Course Content Tab */}
        {activeTab === 'content' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Course Modules</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {modules.map((module: any, index: number) => (
                    <Button
                      key={index}
                      variant={selectedModule === index ? "default" : "outline"}
                      className={`w-full justify-start ${
                        selectedModule === index 
                          ? 'bg-blue-600 hover:bg-blue-700' 
                          : 'bg-slate-700 border-slate-600 text-white hover:bg-slate-600'
                      }`}
                      onClick={() => setSelectedModule(index)}
                    >
                      <div className="text-left">
                        <div className="font-medium">Module {index + 1}</div>
                        <div className="text-xs text-slate-400">{module.title}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-3 bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Play className="w-5 h-5 text-purple-400" />
                  {currentModule.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {lessons.map((lesson: any, index: number) => (
                    <div key={index} className="bg-slate-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {lesson.contentType === 'video' && <Play className="w-4 h-4 text-blue-400" />}
                          {lesson.contentType === 'document' && <FileText className="w-4 h-4 text-green-400" />}
                          {lesson.contentType === 'interactive' && <Users className="w-4 h-4 text-purple-400" />}
                          <h4 className="font-semibold text-white">{lesson.title}</h4>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-slate-300 border-slate-500">
                            {lesson.duration} min
                          </Badge>
                          {lesson.completed && (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-slate-300 mb-3">{lesson.content}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400">
                          Type: {lesson.contentType} | 
                          {lesson.downloadable && ' Downloadable |'}
                          {lesson.transcript && ' Transcript Available'}
                        </span>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          {lesson.completed ? 'Review' : 'Start'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Assignments Tab */}
        {activeTab === 'assignments' && (
          <div className="space-y-4">
            {lmsData.assignments.map((assignment: any, index: number) => (
              <Card key={index} className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-green-400" />
                    {assignment.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <p className="text-slate-300 mb-4">{assignment.description}</p>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-400">Due Date</span>
                          <span className="text-sm text-white">{new Date(assignment.dueDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-400">Points</span>
                          <span className="text-sm text-white">{assignment.pointsTotal}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-400">Submission Type</span>
                          <span className="text-sm text-white">{assignment.submissionType}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">Submission Status</h4>
                      {assignment.submissions.map((submission: any, subIndex: number) => (
                        <div key={subIndex} className="bg-slate-700 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <Badge className="bg-green-500 text-white">{submission.status}</Badge>
                            <span className="text-sm text-slate-400">
                              {new Date(submission.submittedAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-slate-300 mb-2">{submission.content}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-400">
                              Grade: {submission.grade || 'Pending'}
                            </span>
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                              View Details
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Discussions Tab */}
        {activeTab === 'discussions' && (
          <div className="space-y-4">
            {lmsData.discussions.map((discussion: any, index: number) => (
              <Card key={index} className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-blue-400" />
                    {discussion.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300 mb-4">{discussion.description}</p>
                  <div className="space-y-3">
                    {discussion.posts.map((post: any, postIndex: number) => (
                      <div key={postIndex} className="bg-slate-700 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-white">{post.author}</span>
                          <span className="text-xs text-slate-400">
                            {new Date(post.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-slate-300 mb-3">{post.content}</p>
                        <div className="ml-4 space-y-2">
                          {post.replies.map((reply: any, replyIndex: number) => (
                            <div key={replyIndex} className="bg-slate-600 rounded-lg p-3">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium text-white">{reply.author}</span>
                                <span className="text-xs text-slate-400">
                                  {new Date(reply.timestamp).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-sm text-slate-300">{reply.content}</p>
                            </div>
                          ))}
                        </div>
                        <Button size="sm" className="mt-2 bg-blue-600 hover:bg-blue-700">
                          Reply
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Academic Integrity Tab */}
        {activeTab === 'integrity' && (
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-red-400" />
                Academic Integrity & Plagiarism Detection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-white mb-3">System Status</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-400">Detection Enabled</span>
                      <Badge className="bg-green-500 text-white">
                        {lmsData.integrityChecks.enabled ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-400">Last Scan</span>
                      <span className="text-sm text-white">
                        {new Date(lmsData.integrityChecks.lastScan).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-400">Total Submissions</span>
                      <span className="text-sm text-white">{lmsData.integrityChecks.results.totalSubmissions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-400">Flagged Submissions</span>
                      <span className="text-sm text-yellow-400">{lmsData.integrityChecks.results.flaggedSubmissions}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-3">Detection Tools</h4>
                  <div className="space-y-2">
                    {lmsData.integrityChecks.tools.map((tool: string, index: number) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-sm text-slate-300">{tool}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Play className="w-4 h-4 mr-2" />
            Continue Learning
          </Button>
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            <FileText className="w-4 h-4 mr-2" />
            Submit Assignment
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white">
            <MessageSquare className="w-4 h-4 mr-2" />
            Join Discussion
          </Button>
        </div>
      </div>
    </div>
  )
}