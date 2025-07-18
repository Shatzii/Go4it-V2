import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const registrationData = await request.json()
    
    // Validate required fields
    const requiredFields = [
      'firstName', 'lastName', 'email', 'phone', 'dateOfBirth',
      'sport', 'position', 'height', 'weight', 'classYear', 'currentSchool',
      'selectedEvent', 'eventPackage'
    ]
    
    for (const field of requiredFields) {
      if (!registrationData[field]) {
        return NextResponse.json({
          success: false,
          error: `Missing required field: ${field}`
        }, { status: 400 })
      }
    }

    // Generate registration ID
    const registrationId = `REG-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    
    // Calculate total cost
    const packages = {
      basic: 299,
      premium: 599,
      elite: 999
    }
    
    const additionalServices = {
      'nutrition': 149,
      'mental-performance': 199,
      'injury-screening': 129,
      'highlight-reel': 299,
      'social-media': 179
    }
    
    const packagePrice = packages[registrationData.eventPackage as keyof typeof packages] || 599
    const servicesPrice = (registrationData.additionalServices || [])
      .reduce((sum: number, serviceId: string) => sum + (additionalServices[serviceId as keyof typeof additionalServices] || 0), 0)
    
    const totalCost = packagePrice + servicesPrice

    // Create registration record
    const registration = {
      id: registrationId,
      ...registrationData,
      totalCost,
      status: 'pending-payment',
      registrationDate: new Date().toISOString(),
      paymentStatus: 'pending',
      confirmationSent: false
    }

    // In a real application, you would:
    // 1. Save to database
    // 2. Send confirmation email
    // 3. Process payment
    // 4. Send event details
    
    // For now, we'll simulate successful registration
    console.log('New combine registration:', registration)

    // Send confirmation email (simulated)
    await sendConfirmationEmail(registration)
    
    // Create calendar event for the athlete
    await createCalendarEvent(registration)

    return NextResponse.json({
      success: true,
      registrationId,
      message: `Registration confirmed for ${registrationData.firstName} ${registrationData.lastName}`,
      details: {
        event: getEventDetails(registrationData.selectedEvent),
        package: registrationData.eventPackage,
        totalCost,
        paymentInstructions: 'Payment instructions will be sent via email within 24 hours',
        nextSteps: [
          'Check email for confirmation and event details',
          'Complete payment to secure your spot',
          'Upload any required pre-event materials',
          'Attend mandatory virtual briefing session'
        ]
      }
    })

  } catch (error) {
    console.error('Combine registration error:', error)
    return NextResponse.json({
      success: false,
      error: 'Registration failed. Please try again.',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

async function sendConfirmationEmail(registration: any) {
  // Simulate sending confirmation email
  const emailContent = {
    to: registration.email,
    subject: `Combine Registration Confirmation - ${registration.id}`,
    content: `
      Dear ${registration.firstName},
      
      Your registration for the ${getEventDetails(registration.selectedEvent).name} has been confirmed!
      
      Registration Details:
      - Event: ${getEventDetails(registration.selectedEvent).name}
      - Location: ${getEventDetails(registration.selectedEvent).location}
      - Dates: ${getEventDetails(registration.selectedEvent).dates}
      - Package: ${registration.eventPackage.toUpperCase()}
      - Total Cost: $${registration.totalCost}
      
      What's Next:
      1. Payment instructions will follow within 24 hours
      2. Pre-event preparation materials will be sent 2 weeks before
      3. Virtual briefing session details coming soon
      
      Questions? Contact us at support@go4itsports.com
      
      Welcome to the Go4It Sports family!
    `
  }
  
  console.log('Email sent:', emailContent)
  return true
}

async function createCalendarEvent(registration: any) {
  const event = getEventDetails(registration.selectedEvent)
  
  const calendarEvent = {
    title: `${event.name} - ${registration.firstName} ${registration.lastName}`,
    start: event.startDate,
    end: event.endDate,
    location: event.location,
    description: `
      Combine Registration: ${registration.id}
      Package: ${registration.eventPackage.toUpperCase()}
      Sport: ${registration.sport}
      Position: ${registration.position}
    `,
    attendee: registration.email
  }
  
  console.log('Calendar event created:', calendarEvent)
  return true
}

function getEventDetails(eventId: string) {
  const events: { [key: string]: any } = {
    'vienna-2025': {
      name: 'Vienna Elite Combine 2025',
      location: 'Vienna, Austria',
      dates: 'July 22-24, 2025',
      startDate: '2025-07-22T09:00:00Z',
      endDate: '2025-07-24T18:00:00Z',
      description: 'First official GAR Score testing event featuring comprehensive athletic evaluation',
      highlight: 'Friday Night Lights @ 7PM'
    },
    'chicago-2025': {
      name: 'Chicago Elite Combine',
      location: 'Chicago, IL',
      dates: 'August 15-17, 2025',
      startDate: '2025-08-15T09:00:00Z',
      endDate: '2025-08-17T18:00:00Z',
      description: 'Midwest premier combine with college coach attendance',
      highlight: 'College Scout Day'
    },
    'los-angeles-2025': {
      name: 'Los Angeles Skills Showcase',
      location: 'Los Angeles, CA',
      dates: 'September 5-7, 2025',
      startDate: '2025-09-05T09:00:00Z',
      endDate: '2025-09-07T18:00:00Z',
      description: 'West Coast elite showcase featuring top high school athletes',
      highlight: 'Media Coverage'
    }
  }
  
  return events[eventId] || events['vienna-2025']
}