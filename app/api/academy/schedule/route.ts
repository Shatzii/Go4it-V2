import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const schedule = {
      studentId: user.id,
      academicYear: '2024-2025',
      semester: 'Spring',
      schedule: [
        // Monday
        {
          day: 'Monday',
          classes: [
            {
              id: 'class-1',
              time: '9:00 AM - 10:30 AM',
              course: 'Sports Science & Performance',
              courseId: 'sports-science',
              instructor: 'Dr. Martinez',
              location: 'Sports Science Lab',
              type: 'Lecture',
              credits: 3
            },
            {
              id: 'class-2',
              time: '11:00 AM - 12:30 PM',
              course: 'Athletic Development & Training',
              courseId: 'athletic-development',
              instructor: 'Coach Thompson',
              location: 'Training Facility',
              type: 'Practical',
              credits: 4
            },
            {
              id: 'class-3',
              time: '2:00 PM - 3:30 PM',
              course: 'Mental Performance & Psychology',
              courseId: 'mental-performance',
              instructor: 'Dr. Mind',
              location: 'Psychology Lab',
              type: 'Seminar',
              credits: 3
            }
          ]
        },
        // Tuesday
        {
          day: 'Tuesday',
          classes: [
            {
              id: 'class-4',
              time: '10:00 AM - 11:30 AM',
              course: 'NCAA Compliance & Eligibility',
              courseId: 'ncaa-compliance',
              instructor: 'Prof. NCAA',
              location: 'Compliance Center',
              type: 'Lecture',
              credits: 2
            },
            {
              id: 'class-5',
              time: '1:00 PM - 2:30 PM',
              course: 'Sports Nutrition & Recovery',
              courseId: 'nutrition-recovery',
              instructor: 'Dr. Nutrition',
              location: 'Nutrition Lab',
              type: 'Lab',
              credits: 2
            },
            {
              id: 'class-6',
              time: '3:00 PM - 5:00 PM',
              course: 'Team Practice',
              courseId: 'team-practice',
              instructor: 'Head Coach',
              location: 'Main Field',
              type: 'Practice',
              credits: 1
            }
          ]
        },
        // Wednesday
        {
          day: 'Wednesday',
          classes: [
            {
              id: 'class-7',
              time: '9:00 AM - 10:30 AM',
              course: 'Academic Support for Athletes',
              courseId: 'academic-support',
              instructor: 'Ms. Academic',
              location: 'Study Hall',
              type: 'Tutorial',
              credits: 1
            },
            {
              id: 'class-8',
              time: '11:00 AM - 12:30 PM',
              course: 'Sports Science & Performance',
              courseId: 'sports-science',
              instructor: 'Dr. Martinez',
              location: 'Sports Science Lab',
              type: 'Lab',
              credits: 3
            },
            {
              id: 'class-9',
              time: '2:00 PM - 4:00 PM',
              course: 'Individual Training',
              courseId: 'individual-training',
              instructor: 'Personal Coach',
              location: 'Training Facility',
              type: 'Individual',
              credits: 2
            }
          ]
        },
        // Thursday
        {
          day: 'Thursday',
          classes: [
            {
              id: 'class-10',
              time: '10:00 AM - 11:30 AM',
              course: 'Mental Performance & Psychology',
              courseId: 'mental-performance',
              instructor: 'Dr. Mind',
              location: 'Psychology Lab',
              type: 'Practical',
              credits: 3
            },
            {
              id: 'class-11',
              time: '1:00 PM - 2:30 PM',
              course: 'Athletic Development & Training',
              courseId: 'athletic-development',
              instructor: 'Coach Thompson',
              location: 'Training Facility',
              type: 'Practical',
              credits: 4
            },
            {
              id: 'class-12',
              time: '3:00 PM - 5:00 PM',
              course: 'Team Practice',
              courseId: 'team-practice',
              instructor: 'Head Coach',
              location: 'Main Field',
              type: 'Practice',
              credits: 1
            }
          ]
        },
        // Friday
        {
          day: 'Friday',
          classes: [
            {
              id: 'class-13',
              time: '9:00 AM - 10:30 AM',
              course: 'Sports Nutrition & Recovery',
              courseId: 'nutrition-recovery',
              instructor: 'Dr. Nutrition',
              location: 'Nutrition Lab',
              type: 'Seminar',
              credits: 2
            },
            {
              id: 'class-14',
              time: '11:00 AM - 12:30 PM',
              course: 'NCAA Compliance & Eligibility',
              courseId: 'ncaa-compliance',
              instructor: 'Prof. NCAA',
              location: 'Compliance Center',
              type: 'Workshop',
              credits: 2
            },
            {
              id: 'class-15',
              time: '2:00 PM - 3:30 PM',
              course: 'Study Time',
              courseId: 'study-time',
              instructor: 'Academic Advisor',
              location: 'Library',
              type: 'Study',
              credits: 0
            }
          ]
        }
      ],
      totalCredits: 21,
      totalClasses: 15,
      upcomingClasses: [
        {
          id: 'upcoming-1',
          time: '9:00 AM',
          course: 'Sports Science & Performance',
          instructor: 'Dr. Martinez',
          location: 'Sports Science Lab',
          date: new Date().toISOString().split('T')[0]
        }
      ]
    };

    return NextResponse.json({
      success: true,
      schedule
    });

  } catch (error) {
    console.error('Error fetching schedule:', error);
    return NextResponse.json(
      { error: 'Failed to fetch schedule' },
      { status: 500 }
    );
  }
}