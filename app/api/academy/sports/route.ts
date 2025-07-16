import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Sports Team Management System
    const sportsData = {
      success: true,
      teams: [
        {
          id: 'basketball-varsity',
          sport: 'Basketball',
          level: 'Varsity',
          gender: 'Boys',
          season: 'Winter 2024-25',
          headCoach: 'Coach Johnson',
          assistantCoaches: ['Coach Williams', 'Coach Davis'],
          roster: [
            {
              id: 'P001',
              name: 'Marcus Johnson',
              jerseyNumber: 23,
              position: 'Point Guard',
              grade: '11th',
              height: '6\'1"',
              weight: '175 lbs',
              gpa: 3.8,
              eligibilityStatus: 'Eligible',
              stats: {
                gamesPlayed: 12,
                averagePoints: 18.5,
                averageAssists: 7.2,
                averageRebounds: 4.1
              }
            },
            {
              id: 'P002',
              name: 'Tyler Washington',
              jerseyNumber: 15,
              position: 'Center',
              grade: '12th',
              height: '6\'8"',
              weight: '220 lbs',
              gpa: 3.6,
              eligibilityStatus: 'Eligible',
              stats: {
                gamesPlayed: 12,
                averagePoints: 14.8,
                averageAssists: 2.1,
                averageRebounds: 9.3
              }
            }
          ],
          schedule: [
            {
              id: 'G001',
              date: '2024-12-20',
              time: '19:00',
              opponent: 'Atlanta Elite Academy',
              location: 'Home',
              result: 'W 78-65',
              nextGame: true
            },
            {
              id: 'G002',
              date: '2024-12-27',
              time: '18:00',
              opponent: 'Miami Sports Institute',
              location: 'Away',
              result: 'Scheduled',
              nextGame: false
            }
          ],
          record: {
            wins: 8,
            losses: 4,
            conferenceWins: 3,
            conferenceLosses: 1,
            ranking: 'State #12, Region #4'
          }
        },
        {
          id: 'soccer-girls',
          sport: 'Soccer',
          level: 'Varsity',
          gender: 'Girls',
          season: 'Spring 2025',
          headCoach: 'Coach Rodriguez',
          assistantCoaches: ['Coach Martinez'],
          roster: [
            {
              id: 'P003',
              name: 'Isabella Rodriguez',
              jerseyNumber: 10,
              position: 'Midfielder',
              grade: '10th',
              height: '5\'6"',
              weight: '125 lbs',
              gpa: 3.95,
              eligibilityStatus: 'Eligible',
              stats: {
                gamesPlayed: 10,
                goals: 12,
                assists: 8,
                yellowCards: 1
              }
            }
          ],
          schedule: [
            {
              id: 'G003',
              date: '2025-03-15',
              time: '16:00',
              opponent: 'Orlando Athletic Academy',
              location: 'Home',
              result: 'Scheduled',
              nextGame: false
            }
          ],
          record: {
            wins: 0,
            losses: 0,
            conferenceWins: 0,
            conferenceLosses: 0,
            ranking: 'Preseason'
          }
        }
      ],
      facilities: [
        {
          name: 'Main Gymnasium',
          capacity: 500,
          sports: ['Basketball', 'Volleyball'],
          features: ['Retractable seating', 'Professional lighting', 'Sound system'],
          schedule: 'Mon-Fri 6:00-22:00'
        },
        {
          name: 'Soccer Field',
          capacity: 300,
          sports: ['Soccer', 'Track & Field'],
          features: ['Natural grass', 'Irrigation system', 'Scoreboard'],
          schedule: 'Mon-Sun 6:00-20:00'
        },
        {
          name: 'Aquatic Center',
          capacity: 100,
          sports: ['Swimming', 'Water Polo'],
          features: ['50m pool', 'Diving boards', 'Timing system'],
          schedule: 'Mon-Fri 5:30-21:00'
        }
      ],
      achievements: [
        {
          year: 2024,
          sport: 'Basketball',
          achievement: 'State Championship',
          level: 'Varsity Boys'
        },
        {
          year: 2023,
          sport: 'Soccer',
          achievement: 'Regional Champions',
          level: 'Varsity Girls'
        },
        {
          year: 2023,
          sport: 'Swimming',
          achievement: 'Conference Champions',
          level: 'Varsity Co-ed'
        }
      ],
      recruiting: {
        activeRecruits: 45,
        collegeCommitments: 18,
        scholarshipsEarned: 12,
          totalValue: 2400000,
        divisionBreakdown: {
          'Division I': 8,
          'Division II': 6,
          'Division III': 4
        }
      },
      medicalServices: {
        athleticTrainer: 'Dr. Thompson',
        availability: 'Mon-Fri 7:00-19:00',
        services: [
          'Injury assessment',
          'Rehabilitation',
          'Preventive care',
          'Emergency response'
        ],
        equipment: [
          'Ultrasound therapy',
          'Electrical stimulation',
          'Ice baths',
          'Rehabilitation equipment'
        ]
      },
      statistics: {
        totalAthletes: 347,
        activeSports: 12,
        scholarshipRate: 0.34,
        collegeCommitmentRate: 0.45,
        injuryRate: 0.08,
        academicEligibility: 0.96
      },
      lastUpdated: new Date().toISOString()
    }

    return NextResponse.json(sportsData)
  } catch (error) {
    console.error('Error fetching sports data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}