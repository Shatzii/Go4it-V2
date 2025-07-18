import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const registrationData = await request.json()
    
    // Validate required fields
    const requiredFields = [
      'firstName', 'lastName', 'dateOfBirth', 'preferredDivision',
      'parentFirstName', 'parentLastName', 'parentPhone', 'parentEmail'
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
    const registrationId = `TR-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    
    // Calculate age from date of birth
    const birthDate = new Date(registrationData.dateOfBirth)
    const today = new Date()
    const age = today.getFullYear() - birthDate.getFullYear()
    
    // Determine cost based on division
    const divisionCosts: { [key: string]: number } = {
      '6u': 150,
      '8u': 175,
      '10u': 200,
      '12u': 225,
      '14u': 250,
      '16u': 275
    }
    
    const cost = divisionCosts[registrationData.preferredDivision] || 200

    // Create registration record
    const registration = {
      id: registrationId,
      ...registrationData,
      age,
      cost,
      status: 'pending-review',
      registrationDate: new Date().toISOString(),
      teamAssignment: null, // Will be assigned later by admin
      paymentStatus: 'pending'
    }

    // In production, you would:
    // 1. Save to database
    // 2. Send confirmation email
    // 3. Notify coaches for team placement
    // 4. Process payment
    
    console.log('New team registration:', registration)

    // Send confirmation email (simulated)
    await sendRegistrationConfirmation(registration)
    
    // Notify coaches for team placement (simulated)
    await notifyCoachesForPlacement(registration)

    return NextResponse.json({
      success: true,
      registrationId,
      message: `Registration successful for ${registrationData.firstName} ${registrationData.lastName}`,
      details: {
        division: registrationData.preferredDivision.toUpperCase(),
        cost,
        nextSteps: [
          'Team placement review (1-2 business days)',
          'Email confirmation with team assignment',
          'Payment instructions will be sent',
          'Practice schedule and team information'
        ]
      }
    })

  } catch (error) {
    console.error('Team registration error:', error)
    return NextResponse.json({
      success: false,
      error: 'Registration failed. Please try again.',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

async function sendRegistrationConfirmation(registration: any) {
  // Simulate sending confirmation email
  const emailContent = {
    to: registration.parentEmail,
    subject: `Team Registration Confirmation - ${registration.id}`,
    content: `
      Dear ${registration.parentFirstName},
      
      Thank you for registering ${registration.firstName} for our team sports program!
      
      Registration Details:
      - Player: ${registration.firstName} ${registration.lastName}
      - Division: ${registration.preferredDivision.toUpperCase()}
      - Age: ${registration.age} years old
      - Registration Cost: $${registration.cost}
      
      Next Steps:
      1. Team placement review (1-2 business days)
      2. You'll receive team assignment and coach contact info
      3. Payment instructions will follow
      4. Practice schedules will be sent once teams are finalized
      
      Questions? Contact us at teams@go4itsports.com
      
      Welcome to Go4It Sports!
    `
  }
  
  console.log('Registration confirmation email sent:', emailContent)
  return true
}

async function notifyCoachesForPlacement(registration: any) {
  // Simulate notifying coaches about new player for team placement
  const coachNotification = {
    to: 'coaches@go4itsports.com',
    subject: `New Player Registration - Team Placement Needed`,
    content: `
      New player registration requires team placement:
      
      Player: ${registration.firstName} ${registration.lastName}
      Age: ${registration.age}
      Division: ${registration.preferredDivision.toUpperCase()}
      Position Preference: ${registration.position || 'None specified'}
      Experience: ${registration.experience || 'Not specified'}
      
      Please review and assign to appropriate team.
      Registration ID: ${registration.id}
    `
  }
  
  console.log('Coach notification sent:', coachNotification)
  return true
}