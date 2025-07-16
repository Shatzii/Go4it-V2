import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Comprehensive Student Information System
    const sisData = {
      success: true,
      students: [
        {
          id: 'ST001',
          firstName: 'Marcus',
          lastName: 'Johnson',
          email: 'marcus.johnson@go4it.edu',
          grade: '11th',
          gpa: 3.8,
          sport: 'Basketball',
          position: 'Point Guard',
          graduationYear: 2026,
          address: '123 Main St, Atlanta, GA 30309',
          phone: '(555) 123-4567',
          emergencyContact: 'Sarah Johnson - (555) 123-4568',
          medicalNotes: 'Mild asthma - inhaler available',
          parentPortalActive: true,
          transcriptStatus: 'Current',
          credits: {
            earned: 18,
            required: 24,
            onTrack: true
          }
        },
        {
          id: 'ST002',
          firstName: 'Isabella',
          lastName: 'Rodriguez',
          email: 'isabella.rodriguez@go4it.edu',
          grade: '10th',
          gpa: 3.95,
          sport: 'Soccer',
          position: 'Midfielder',
          graduationYear: 2027,
          address: '456 Oak Ave, Miami, FL 33101',
          phone: '(555) 234-5678',
          emergencyContact: 'Carlos Rodriguez - (555) 234-5679',
          medicalNotes: 'No medical restrictions',
          parentPortalActive: true,
          transcriptStatus: 'Current',
          credits: {
            earned: 12,
            required: 24,
            onTrack: true
          }
        },
        {
          id: 'ST003',
          firstName: 'David',
          lastName: 'Chen',
          email: 'david.chen@go4it.edu',
          grade: '12th',
          gpa: 3.7,
          sport: 'Swimming',
          position: 'Freestyle',
          graduationYear: 2025,
          address: '789 Pine Dr, San Francisco, CA 94105',
          phone: '(555) 345-6789',
          emergencyContact: 'Linda Chen - (555) 345-6790',
          medicalNotes: 'Previous shoulder injury - cleared for competition',
          parentPortalActive: true,
          transcriptStatus: 'Current',
          credits: {
            earned: 22,
            required: 24,
            onTrack: true
          }
        }
      ],
      teachers: [
        {
          id: 'T001',
          firstName: 'Dr. Sarah',
          lastName: 'Martinez',
          email: 'sarah.martinez@go4it.edu',
          subject: 'Sports Science',
          department: 'Athletic Performance',
          yearsExperience: 12,
          certifications: ['PhD Sports Science', 'NASM Certified'],
          courses: ['Advanced Biomechanics', 'Exercise Physiology'],
          officeHours: 'Mon-Fri 2:00-4:00 PM',
          phone: '(555) 987-6543'
        },
        {
          id: 'T002',
          firstName: 'Coach Mike',
          lastName: 'Thompson',
          email: 'mike.thompson@go4it.edu',
          subject: 'Physical Education',
          department: 'Athletic Development',
          yearsExperience: 15,
          certifications: ['M.Ed Physical Education', 'CSCS'],
          courses: ['Strength Training', 'Sports Psychology'],
          officeHours: 'Mon-Wed 3:00-5:00 PM',
          phone: '(555) 876-5432'
        }
      ],
      enrollmentStats: {
        totalStudents: 847,
        gradeDistribution: {
          '9th': 245,
          '10th': 231,
          '11th': 198,
          '12th': 173
        },
        sportDistribution: {
          'Basketball': 156,
          'Soccer': 143,
          'Swimming': 98,
          'Tennis': 89,
          'Track & Field': 124,
          'Volleyball': 87,
          'Baseball': 92,
          'Golf': 58
        },
        academicStats: {
          averageGPA: 3.6,
          honorRoll: 324,
          collegeCommitments: 156,
          scholarshipRecipients: 198
        }
      },
      lastUpdated: new Date().toISOString()
    }

    return NextResponse.json(sisData)
  } catch (error) {
    console.error('Error fetching SIS data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}