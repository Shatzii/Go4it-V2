/**
 * Mock data for combine tour events
 * Used for development and testing purposes
 */

import { CombineTourEvent } from '@shared/schema';
import { addDays, format, subDays } from 'date-fns';

const currentDate = new Date();
const tomorrow = addDays(currentDate, 1);
const inOneWeek = addDays(currentDate, 7);
const inTwoWeeks = addDays(currentDate, 14);
const inOneMonth = addDays(currentDate, 30);
const inTwoMonths = addDays(currentDate, 60);
const lastWeek = subDays(currentDate, 7);
const lastMonth = subDays(currentDate, 30);
const twoMonthsAgo = subDays(currentDate, 60);

export const mockCombineEvents: Partial<CombineTourEvent>[] = [
  {
    id: 1,
    name: "Chicago Elite Combine",
    description: "Join us for a comprehensive evaluation featuring physical testing, skills assessment, and game play. College coaches will be in attendance to evaluate talent across all age groups.",
    location: "United Center Training Facility",
    address: "1901 W Madison St",
    city: "Chicago",
    state: "IL",
    zipCode: "60612",
    startDate: inOneWeek.toISOString(),
    endDate: addDays(inOneWeek, 2).toISOString(),
    registrationDeadline: inOneWeek.toISOString(),
    maximumAttendees: 100,
    currentAttendees: 75,
    price: "149.99",
    slug: "chicago-elite-combine-2025",
    status: "published",
    featuredImage: "https://images.unsplash.com/photo-1504450758481-7338eba7524a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=800&q=80"
  },
  {
    id: 2,
    name: "Los Angeles Skills Showcase",
    description: "An exclusive opportunity for top high school athletes to showcase their skills in front of college scouts and coaches from major programs across the country.",
    location: "UCLA Athletics Complex",
    address: "555 Westwood Plaza",
    city: "Los Angeles",
    state: "CA",
    zipCode: "90095",
    startDate: inTwoWeeks.toISOString(),
    endDate: addDays(inTwoWeeks, 1).toISOString(),
    registrationDeadline: inTwoWeeks.toISOString(),
    maximumAttendees: 80,
    currentAttendees: 75,
    price: "199.99",
    slug: "la-skills-showcase-2025",
    status: "published",
    featuredImage: "https://images.unsplash.com/photo-1577471488278-16eec37ffcc2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=800&q=80"
  },
  {
    id: 3,
    name: "Atlanta Speed & Agility Camp",
    description: "Focus on improving your speed, agility, and explosiveness with expert coaching from current and former professional athletes.",
    location: "Mercedes-Benz Stadium",
    address: "1 AMB Drive NW",
    city: "Atlanta",
    state: "GA",
    zipCode: "30313",
    startDate: inOneMonth.toISOString(),
    endDate: addDays(inOneMonth, 2).toISOString(),
    registrationDeadline: inOneMonth.toISOString(),
    maximumAttendees: 120,
    currentAttendees: 85,
    price: "179.99",
    slug: "atlanta-speed-agility-2025",
    status: "published",
    featuredImage: "https://images.unsplash.com/photo-1519689373023-dd07c7988603?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=800&q=80"
  },
  {
    id: 4,
    name: "New York Power Combine",
    description: "Test your strength, power, and explosiveness at our premier NYC combine. Includes bench press, squat, vertical jump, broad jump and more specialized assessments.",
    location: "Columbia University Athletic Complex",
    address: "3030 Broadway",
    city: "New York",
    state: "NY",
    zipCode: "10027",
    startDate: inTwoMonths.toISOString(),
    endDate: addDays(inTwoMonths, 1).toISOString(),
    registrationDeadline: inTwoMonths.toISOString(),
    maximumAttendees: 90,
    currentAttendees: 40,
    price: "169.99",
    slug: "nyc-power-combine-2025",
    status: "published",
    featuredImage: "https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=800&q=80"
  },
  {
    id: 5,
    name: "Dallas All-Stars Combine",
    description: "The premier combine event in Texas featuring comprehensive testing and evaluation for football, basketball, baseball, and track athletes.",
    location: "AT&T Stadium",
    address: "1 AT&T Way",
    city: "Arlington",
    state: "TX",
    zipCode: "76011",
    startDate: tomorrow.toISOString(),
    endDate: addDays(tomorrow, 3).toISOString(),
    registrationDeadline: tomorrow.toISOString(),
    maximumAttendees: 150,
    currentAttendees: 145,
    price: "159.99",
    slug: "dallas-all-stars-2025",
    status: "published",
    featuredImage: "https://images.unsplash.com/photo-1564246614931-1be8ad768e63?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=800&q=80"
  },
  {
    id: 6,
    name: "Orlando Skills Challenge",
    description: "Put your basketball skills to the test with our NBA-style skills challenge featuring dribbling, shooting, and passing drills with feedback from expert coaches.",
    location: "Amway Center",
    address: "400 W Church St",
    city: "Orlando",
    state: "FL",
    zipCode: "32801",
    startDate: inOneWeek.toISOString(),
    endDate: addDays(inOneWeek, 1).toISOString(),
    registrationDeadline: inOneWeek.toISOString(),
    maximumAttendees: 70,
    currentAttendees: 70,
    price: "149.99",
    slug: "orlando-skills-challenge-2025",
    status: "published",
    featuredImage: "https://images.unsplash.com/photo-1518706015357-d55d2514c825?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=800&q=80"
  },
  {
    id: 7,
    name: "Seattle Elite Showcase",
    description: "The premier showcase for Pacific Northwest athletes featuring comprehensive evaluations and exposure to college scouts and coaches.",
    location: "Lumen Field Event Center",
    address: "800 Occidental Ave S",
    city: "Seattle",
    state: "WA",
    zipCode: "98134",
    startDate: inOneMonth.toISOString(),
    endDate: addDays(inOneMonth, 2).toISOString(),
    registrationDeadline: inOneMonth.toISOString(),
    maximumAttendees: 85,
    currentAttendees: 55,
    price: "189.99",
    slug: "seattle-elite-showcase-2025",
    status: "published",
    featuredImage: "https://images.unsplash.com/photo-1508802654646-fb6b7f78027d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=800&q=80"
  },
  {
    id: 8,
    name: "Houston Speed Combine",
    description: "Texas's premier speed testing combine featuring electronic timing for the 40-yard dash, shuttle run, 3-cone drill and more.",
    location: "NRG Stadium",
    address: "NRG Pkwy",
    city: "Houston",
    state: "TX",
    zipCode: "77054",
    startDate: lastWeek.toISOString(),
    endDate: addDays(lastWeek, 1).toISOString(),
    registrationDeadline: subDays(lastWeek, 5).toISOString(),
    maximumAttendees: 100,
    currentAttendees: 100,
    price: "129.99",
    slug: "houston-speed-combine-2025",
    status: "published",
    featuredImage: "https://images.unsplash.com/photo-1551958219-acbc608c6377?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=800&q=80"
  },
  {
    id: 9,
    name: "Denver High Altitude Challenge",
    description: "Test your endurance and athletic abilities in the thin air of the Mile High City with our specialized high-altitude training and testing program.",
    location: "Empower Field at Mile High",
    address: "1701 Bryant St",
    city: "Denver",
    state: "CO",
    zipCode: "80204",
    startDate: lastMonth.toISOString(),
    endDate: addDays(lastMonth, 2).toISOString(),
    registrationDeadline: subDays(lastMonth, 10).toISOString(),
    maximumAttendees: 90,
    currentAttendees: 85,
    price: "159.99",
    slug: "denver-altitude-challenge-2025",
    status: "published",
    featuredImage: "https://images.unsplash.com/photo-1511174944925-a99f10911d45?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=800&q=80"
  },
  {
    id: 10,
    name: "Philadelphia Football Combine",
    description: "Comprehensive football skills assessment with position-specific drills and evaluations from former NFL players and college coaches.",
    location: "Lincoln Financial Field",
    address: "1 Lincoln Financial Field Way",
    city: "Philadelphia",
    state: "PA",
    zipCode: "19148",
    startDate: twoMonthsAgo.toISOString(),
    endDate: addDays(twoMonthsAgo, 1).toISOString(),
    registrationDeadline: subDays(twoMonthsAgo, 7).toISOString(),
    maximumAttendees: 120,
    currentAttendees: 110,
    price: "139.99",
    slug: "philly-football-combine-2025",
    status: "published",
    featuredImage: "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=800&q=80"
  },
  {
    id: 11,
    name: "Miami Beach Basketball Showcase",
    description: "Showcase your basketball skills in Miami's premier event featuring 3v3 and 5v5 competition, skills challenges, and evaluations from D1 college coaches.",
    location: "Watsco Center",
    address: "1245 Dauer Dr",
    city: "Coral Gables",
    state: "FL",
    zipCode: "33146",
    startDate: inTwoMonths.toISOString(),
    endDate: addDays(inTwoMonths, 2).toISOString(),
    registrationDeadline: subDays(inTwoMonths, 14).toISOString(),
    maximumAttendees: 140,
    currentAttendees: 60,
    price: "169.99",
    slug: "miami-basketball-showcase-2025",
    status: "published",
    featuredImage: "https://images.unsplash.com/photo-1519861531473-9200262188bf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=800&q=80"
  },
  {
    id: 12,
    name: "Boston Elite Baseball Combine",
    description: "Test your throwing velocity, exit velocity, fielding skills, and running speed with feedback and evaluation from college scouts and coaches.",
    location: "Fenway Park",
    address: "4 Jersey St",
    city: "Boston",
    state: "MA",
    zipCode: "02215",
    startDate: inOneMonth.toISOString(),
    endDate: addDays(inOneMonth, 1).toISOString(),
    registrationDeadline: subDays(inOneMonth, 10).toISOString(),
    maximumAttendees: 80,
    currentAttendees: 65,
    price: "179.99",
    slug: "boston-baseball-combine-2025",
    status: "published",
    featuredImage: "https://images.unsplash.com/photo-1570971251452-940df5a4820b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=800&q=80"
  }
];

/**
 * Get events filtered by status
 */
export function getEventsByStatus(status: 'upcoming' | 'past' | 'filling_fast' | 'sold_out' | 'all', limit: number = 100): Partial<CombineTourEvent>[] {
  const currentDate = new Date();
  let filteredEvents: Partial<CombineTourEvent>[] = [];
  
  switch (status) {
    case 'upcoming':
      filteredEvents = mockCombineEvents.filter(event => 
        new Date(event.startDate!) > currentDate
      );
      break;
    case 'past':
      filteredEvents = mockCombineEvents.filter(event => 
        new Date(event.endDate!) < currentDate
      );
      break;
    case 'filling_fast':
      filteredEvents = mockCombineEvents.filter(event => {
        if (!event.maximumAttendees || !event.currentAttendees) return false;
        const fillRatio = event.currentAttendees / event.maximumAttendees;
        return new Date(event.startDate!) > currentDate && fillRatio >= 0.8 && fillRatio < 1;
      });
      break;
    case 'sold_out':
      filteredEvents = mockCombineEvents.filter(event => {
        if (!event.maximumAttendees || !event.currentAttendees) return false;
        return new Date(event.startDate!) > currentDate && 
               event.currentAttendees >= event.maximumAttendees;
      });
      break;
    case 'all':
    default:
      filteredEvents = mockCombineEvents;
      break;
  }
  
  return filteredEvents.slice(0, limit);
}