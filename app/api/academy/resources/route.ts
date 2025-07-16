import { NextRequest, NextResponse } from 'next/server';

// 10. Resource Management System
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const resourceType = searchParams.get('type');
    const category = searchParams.get('category');
    const availability = searchParams.get('availability');

    // Library and digital resource catalog
    const digitalResources = {
      books: [
        {
          id: 'book-001',
          title: 'Exercise Physiology: Theory and Application',
          author: 'Scott K. Powers',
          isbn: '978-1259870453',
          format: 'digital',
          availability: 'available',
          accessUrl: '/library/exercise-physiology-powers.pdf',
          category: 'sports-science',
          tags: ['physiology', 'exercise', 'textbook']
        },
        {
          id: 'book-002',
          title: 'Biomechanics of Sport and Exercise',
          author: 'Peter McGinnis',
          isbn: '978-1492595311',
          format: 'physical',
          availability: 'checked_out',
          dueDate: '2024-02-15',
          category: 'biomechanics',
          tags: ['biomechanics', 'movement', 'analysis']
        }
      ],
      journals: [
        {
          id: 'journal-001',
          title: 'Journal of Sports Sciences',
          publisher: 'Taylor & Francis',
          accessType: 'subscription',
          availability: 'available',
          searchUrl: '/databases/sports-sciences',
          category: 'research'
        },
        {
          id: 'journal-002',
          title: 'Medicine & Science in Sports & Exercise',
          publisher: 'Lippincott Williams & Wilkins',
          accessType: 'subscription',
          availability: 'available',
          searchUrl: '/databases/medicine-sports-exercise',
          category: 'research'
        }
      ],
      videos: [
        {
          id: 'video-001',
          title: 'Biomechanical Analysis Techniques',
          duration: 45,
          format: 'mp4',
          availability: 'available',
          streamUrl: '/videos/biomechanical-analysis.mp4',
          category: 'instructional',
          tags: ['biomechanics', 'analysis', 'technique']
        }
      ]
    };

    // Equipment checkout and inventory tracking
    const equipmentInventory = {
      laboratoryEquipment: [
        {
          id: 'eq-001',
          name: 'Force Plate System',
          model: 'AMTI BP400600',
          category: 'biomechanics',
          status: 'available',
          location: 'Lab 204',
          condition: 'excellent',
          lastCalibrated: '2024-01-15',
          nextMaintenance: '2024-04-15',
          bookingUrl: '/equipment/force-plate/book'
        },
        {
          id: 'eq-002',
          name: 'Motion Capture System',
          model: 'Vicon Vantage V5',
          category: 'movement-analysis',
          status: 'in_use',
          location: 'Lab 205',
          condition: 'good',
          currentUser: 'Dr. Wilson',
          availableAt: '2024-01-29T16:00:00Z',
          bookingUrl: '/equipment/motion-capture/book'
        },
        {
          id: 'eq-003',
          name: 'Metabolic Cart',
          model: 'Cosmed K5',
          category: 'physiology',
          status: 'maintenance',
          location: 'Lab 203',
          condition: 'fair',
          maintenanceUntil: '2024-02-01',
          bookingUrl: '/equipment/metabolic-cart/book'
        }
      ],
      athleticEquipment: [
        {
          id: 'ath-001',
          name: 'Olympic Barbell Set',
          category: 'strength-training',
          quantity: 12,
          available: 10,
          location: 'Weight Room A',
          condition: 'good',
          checkoutDuration: '2 hours'
        },
        {
          id: 'ath-002',
          name: 'Heart Rate Monitors',
          category: 'monitoring',
          quantity: 30,
          available: 25,
          location: 'Equipment Room',
          condition: 'excellent',
          checkoutDuration: '1 week'
        }
      ]
    };

    // Facility scheduling and maintenance
    const facilities = {
      laboratories: [
        {
          id: 'lab-001',
          name: 'Biomechanics Laboratory',
          capacity: 15,
          equipment: ['Force plates', 'Motion capture', 'EMG system'],
          availability: [
            { date: '2024-01-29', timeSlots: ['09:00-10:30', '14:00-15:30'] },
            { date: '2024-01-30', timeSlots: ['10:00-11:30', '15:00-16:30'] }
          ],
          bookingUrl: '/facilities/biomechanics-lab/book'
        },
        {
          id: 'lab-002',
          name: 'Exercise Physiology Laboratory',
          capacity: 20,
          equipment: ['Metabolic carts', 'Treadmills', 'Cycle ergometers'],
          availability: [
            { date: '2024-01-29', timeSlots: ['08:00-09:30', '13:00-14:30'] },
            { date: '2024-01-30', timeSlots: ['09:00-10:30', '14:00-15:30'] }
          ],
          bookingUrl: '/facilities/exercise-physiology-lab/book'
        }
      ],
      athleticFacilities: [
        {
          id: 'facility-001',
          name: 'Main Gymnasium',
          capacity: 200,
          sports: ['Basketball', 'Volleyball', 'Badminton'],
          availability: [
            { date: '2024-01-29', timeSlots: ['16:00-18:00', '19:00-21:00'] },
            { date: '2024-01-30', timeSlots: ['17:00-19:00', '20:00-22:00'] }
          ],
          bookingUrl: '/facilities/main-gym/book'
        }
      ]
    };

    // Budget tracking and financial reporting
    const budgetTracking = {
      departmentBudgets: [
        {
          department: 'Sports Science',
          totalBudget: 75000,
          spent: 34500,
          remaining: 40500,
          categories: [
            { category: 'Equipment', allocated: 35000, spent: 18000 },
            { category: 'Software', allocated: 15000, spent: 8500 },
            { category: 'Supplies', allocated: 25000, spent: 8000 }
          ]
        },
        {
          department: 'Athletic Training',
          totalBudget: 50000,
          spent: 23000,
          remaining: 27000,
          categories: [
            { category: 'Medical Supplies', allocated: 20000, spent: 12000 },
            { category: 'Equipment', allocated: 25000, spent: 9000 },
            { category: 'Training', allocated: 5000, spent: 2000 }
          ]
        }
      ],
      recentPurchases: [
        {
          id: 'purchase-001',
          item: 'Force Plate Calibration Kit',
          cost: 2500,
          department: 'Sports Science',
          purchaseDate: '2024-01-20',
          vendor: 'AMTI',
          status: 'delivered'
        },
        {
          id: 'purchase-002',
          item: 'Heart Rate Monitor Set (20 units)',
          cost: 1800,
          department: 'Athletic Training',
          purchaseDate: '2024-01-18',
          vendor: 'Polar',
          status: 'pending'
        }
      ]
    };

    // Resource checkouts and returns
    const checkoutHistory = [
      {
        id: 'checkout-001',
        userId: 'student-123',
        userName: 'Alex Johnson',
        resourceId: 'book-002',
        resourceName: 'Biomechanics of Sport and Exercise',
        checkedOutAt: '2024-01-15T09:00:00Z',
        dueDate: '2024-02-15T23:59:59Z',
        status: 'active',
        renewals: 0,
        maxRenewals: 2
      },
      {
        id: 'checkout-002',
        userId: 'student-456',
        userName: 'Sarah Chen',
        resourceId: 'ath-002',
        resourceName: 'Heart Rate Monitor',
        checkedOutAt: '2024-01-22T14:30:00Z',
        dueDate: '2024-01-29T14:30:00Z',
        status: 'returned',
        returnedAt: '2024-01-28T10:15:00Z',
        condition: 'good'
      }
    ];

    return NextResponse.json({
      success: true,
      digitalResources,
      equipmentInventory,
      facilities,
      budgetTracking,
      checkoutHistory: checkoutHistory.filter(checkout => 
        availability ? checkout.status === availability : true
      ),
      resourceStats: {
        totalResources: 156,
        availableResources: 142,
        checkedOutResources: 14,
        maintenanceResources: 3,
        utilizationRate: 76.8
      },
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching resource data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resource data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, resourceId, userId, duration, facilityId, timeSlot } = body;

    switch (action) {
      case 'checkoutResource':
        return NextResponse.json({
          success: true,
          message: 'Resource checked out successfully',
          checkoutId: `checkout-${Date.now()}`,
          dueDate: new Date(Date.now() + (duration || 7) * 24 * 60 * 60 * 1000).toISOString(),
          renewalsRemaining: 2
        });

      case 'returnResource':
        return NextResponse.json({
          success: true,
          message: 'Resource returned successfully',
          returnId: `return-${Date.now()}`,
          returnedAt: new Date().toISOString(),
          lateFee: 0,
          condition: 'good'
        });

      case 'bookFacility':
        return NextResponse.json({
          success: true,
          message: 'Facility booked successfully',
          bookingId: `booking-${Date.now()}`,
          facilityId,
          timeSlot,
          bookedAt: new Date().toISOString(),
          confirmationSent: true
        });

      case 'requestMaintenance':
        return NextResponse.json({
          success: true,
          message: 'Maintenance request submitted',
          ticketId: `ticket-${Date.now()}`,
          priority: 'medium',
          estimatedCompletion: '2-3 business days',
          assignedTo: 'Maintenance Team'
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Error processing resource action:', error);
    return NextResponse.json(
      { error: 'Failed to process resource action' },
      { status: 500 }
    );
  }
}