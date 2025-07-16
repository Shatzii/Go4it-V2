import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Library Management System
    const libraryData = {
      success: true,
      catalog: [
        {
          id: 'BK001',
          title: 'Sports Psychology: The Mental Game',
          author: 'Dr. Michael Johnson',
          isbn: '978-1-234-56789-0',
          category: 'Sports Science',
          status: 'Available',
          location: 'Sports Section - SS-101',
          checkoutHistory: 24,
          rating: 4.8,
          description: 'Comprehensive guide to mental performance in athletics'
        },
        {
          id: 'BK002',
          title: 'Biomechanics of Athletic Movement',
          author: 'Dr. Sarah Martinez',
          isbn: '978-1-234-56789-1',
          category: 'Sports Science',
          status: 'Checked Out',
          dueDate: '2024-12-15',
          borrower: 'Marcus Johnson',
          location: 'Sports Section - SS-102',
          checkoutHistory: 18,
          rating: 4.7
        },
        {
          id: 'BK003',
          title: 'Nutrition for Peak Performance',
          author: 'Dr. Emily Chen',
          isbn: '978-1-234-56789-2',
          category: 'Health & Nutrition',
          status: 'Available',
          location: 'Health Section - HE-201',
          checkoutHistory: 32,
          rating: 4.9
        },
        {
          id: 'BK004',
          title: 'NCAA Compliance Manual 2024',
          author: 'NCAA Publications',
          isbn: '978-1-234-56789-3',
          category: 'Athletics Administration',
          status: 'Reference Only',
          location: 'Reference - REF-001',
          checkoutHistory: 0,
          rating: 4.2
        }
      ],
      digitalResources: [
        {
          id: 'DR001',
          title: 'Sports Science Research Database',
          type: 'Database',
          provider: 'Academic Sports Journal',
          accessLevel: 'Full Access',
          description: 'Peer-reviewed articles on sports science and performance',
          usage: 'High'
        },
        {
          id: 'DR002',
          title: 'Athletic Performance Video Library',
          type: 'Video Collection',
          provider: 'Go4It Media',
          accessLevel: 'Student Access',
          description: 'Technique videos and training resources',
          usage: 'Very High'
        },
        {
          id: 'DR003',
          title: 'NCAA Eligibility Center Online',
          type: 'Portal',
          provider: 'NCAA',
          accessLevel: 'Restricted',
          description: 'Official NCAA eligibility tracking and requirements',
          usage: 'Medium'
        }
      ],
      studySpaces: [
        {
          id: 'SS001',
          name: 'Quiet Study Room A',
          capacity: 4,
          equipment: ['Whiteboard', 'Projector', 'WiFi'],
          availability: 'Available',
          reservedBy: null,
          nextReservation: '14:00 - Isabella Rodriguez'
        },
        {
          id: 'SS002',
          name: 'Group Study Room B',
          capacity: 8,
          equipment: ['Large table', 'TV screen', 'WiFi'],
          availability: 'Reserved',
          reservedBy: 'Basketball Team Study Group',
          nextReservation: '16:00 - Track Team'
        },
        {
          id: 'SS003',
          name: 'Computer Lab',
          capacity: 20,
          equipment: ['20 computers', 'Printer', 'Scanner'],
          availability: 'Available',
          reservedBy: null,
          nextReservation: '15:00 - English Class'
        }
      ],
      services: [
        {
          name: 'Research Assistance',
          description: 'Librarian help with research projects',
          availability: 'Mon-Fri 8:00-17:00',
          contact: 'Ms. Johnson - ext. 1234'
        },
        {
          name: 'Interlibrary Loan',
          description: 'Request books from other libraries',
          availability: '24/7 online',
          contact: 'library@go4it.edu'
        },
        {
          name: 'Citation Help',
          description: 'APA, MLA, Chicago style assistance',
          availability: 'Mon-Fri 9:00-16:00',
          contact: 'Mr. Davis - ext. 1235'
        },
        {
          name: 'Digital Archive Access',
          description: 'Historical sports records and statistics',
          availability: '24/7 online',
          contact: 'archives@go4it.edu'
        }
      ],
      statistics: {
        totalBooks: 15847,
        digitalResources: 234,
        activeUsers: 623,
        monthlyCheckouts: 1543,
        studyRoomBookings: 287,
        popularCategories: [
          'Sports Science',
          'Athletic Training',
          'Sports Psychology',
          'Nutrition',
          'NCAA Compliance'
        ]
      },
      hours: {
        monday: '7:00 - 21:00',
        tuesday: '7:00 - 21:00',
        wednesday: '7:00 - 21:00',
        thursday: '7:00 - 21:00',
        friday: '7:00 - 19:00',
        saturday: '9:00 - 17:00',
        sunday: '12:00 - 18:00'
      },
      lastUpdated: new Date().toISOString()
    }

    return NextResponse.json(libraryData)
  } catch (error) {
    console.error('Error fetching library data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}