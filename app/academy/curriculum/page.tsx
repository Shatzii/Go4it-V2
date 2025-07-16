'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { BookOpen, Target, MapPin, Clock, CheckCircle } from 'lucide-react'

interface CurriculumData {
  success: boolean
  curriculumStandards: any
  pacingGuides: any
  stateAlignment: any
  lastUpdated: string
}

export default function CurriculumManagementPage() {
  const [curriculumData, setCurriculumData] = useState<CurriculumData | null>(null)
  const [selectedSubject, setSelectedSubject] = useState('English Language Arts')
  const [selectedCourse, setSelectedCourse] = useState('sports-science')

  useEffect(() => {
    const fetchCurriculumData = async () => {
      try {
        const response = await fetch('/api/academy/curriculum')
        const data = await response.json()
        setCurriculumData(data)
      } catch (error) {
        console.error('Error fetching curriculum data:', error)
      }
    }

    fetchCurriculumData()
  }, [])

  if (!curriculumData) {
    return (
      <div className="min-h-screen bg-slate-900 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-white">Loading curriculum management system...</p>
          </div>
        </div>
      </div>
    )
  }

  const subjects = Object.keys(curriculumData.curriculumStandards['K-12'] || {})
  const selectedSubjectData = curriculumData.curriculumStandards['K-12'][selectedSubject] || {}
  const pacingData = curriculumData.pacingGuides[selectedCourse] || {}

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 text-white p-6 rounded-lg">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-green-400" />
            Curriculum Management System
          </h1>
          <p className="text-lg text-slate-300">K-12 standards alignment with state requirements and automated pacing guides</p>
        </div>

        {/* State Alignment Overview */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-400" />
              State Standards Alignment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-slate-700 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-2">Standards System</h4>
                <p className="text-sm text-slate-300">{curriculumData.stateAlignment.name}</p>
              </div>
              <div className="bg-slate-700 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-2">Assessment System</h4>
                <p className="text-sm text-slate-300">{curriculumData.stateAlignment.testing}</p>
              </div>
              <div className="bg-slate-700 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-2">Graduation Credits</h4>
                <p className="text-sm text-slate-300">{curriculumData.stateAlignment.graduationCredits} credits</p>
              </div>
              <div className="bg-slate-700 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-2">Alignment Status</h4>
                <Badge className="bg-green-500 text-white">Fully Compliant</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subject Standards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Subject Areas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {subjects.map((subject) => (
                  <Button
                    key={subject}
                    variant={selectedSubject === subject ? "default" : "outline"}
                    className={`w-full justify-start ${
                      selectedSubject === subject 
                        ? 'bg-blue-600 hover:bg-blue-700' 
                        : 'bg-slate-700 border-slate-600 text-white hover:bg-slate-600'
                    }`}
                    onClick={() => setSelectedSubject(subject)}
                  >
                    {subject}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-green-400" />
                {selectedSubject} Standards
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-white mb-2">Core Standards</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {(selectedSubjectData.standards || []).map((standard: string, index: number) => (
                      <div key={index} className="bg-slate-700 rounded-lg p-3">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-slate-300">{standard}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-2">Sports-Focused Applications</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {(selectedSubjectData.sportsFocus || []).map((focus: string, index: number) => (
                      <div key={index} className="bg-slate-700 rounded-lg p-3">
                        <div className="flex items-start gap-2">
                          <Target className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-slate-300">{focus}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pacing Guides */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-400" />
              Automated Pacing Guides
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="flex gap-2 mb-4">
                <Button
                  variant={selectedCourse === 'sports-science' ? "default" : "outline"}
                  className={selectedCourse === 'sports-science' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-700 border-slate-600 text-white hover:bg-slate-600'}
                  onClick={() => setSelectedCourse('sports-science')}
                >
                  Sports Science
                </Button>
                <Button
                  variant={selectedCourse === 'ncaa-compliance' ? "default" : "outline"}
                  className={selectedCourse === 'ncaa-compliance' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-700 border-slate-600 text-white hover:bg-slate-600'}
                  onClick={() => setSelectedCourse('ncaa-compliance')}
                >
                  NCAA Compliance
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {(pacingData.weeks || []).map((week: any, index: number) => (
                <div key={index} className="bg-slate-700 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className="bg-purple-500 text-white">Week {week.week}</Badge>
                    <Progress value={(week.week / 16) * 100} className="flex-1 h-2" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <h5 className="font-semibold text-white mb-2">Topics</h5>
                      <ul className="text-sm text-slate-300 space-y-1">
                        {week.topics.map((topic: string, topicIndex: number) => (
                          <li key={topicIndex} className="flex items-center gap-2">
                            <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                            {topic}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="font-semibold text-white mb-2">Objectives</h5>
                      <ul className="text-sm text-slate-300 space-y-1">
                        {week.objectives.map((objective: string, objIndex: number) => (
                          <li key={objIndex} className="flex items-center gap-2">
                            <div className="w-1 h-1 bg-green-400 rounded-full"></div>
                            {objective}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="font-semibold text-white mb-2">Assessments</h5>
                      <ul className="text-sm text-slate-300 space-y-1">
                        {week.assessments.map((assessment: string, assIndex: number) => (
                          <li key={assIndex} className="flex items-center gap-2">
                            <div className="w-1 h-1 bg-yellow-400 rounded-full"></div>
                            {assessment}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="font-semibold text-white mb-2">Resources</h5>
                      <ul className="text-sm text-slate-300 space-y-1">
                        {week.resources.map((resource: string, resIndex: number) => (
                          <li key={resIndex} className="flex items-center gap-2">
                            <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                            {resource}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <BookOpen className="w-4 h-4 mr-2" />
            Align New Standard
          </Button>
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            <Clock className="w-4 h-4 mr-2" />
            Update Pacing Guide
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white">
            <Target className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>
    </div>
  )
}