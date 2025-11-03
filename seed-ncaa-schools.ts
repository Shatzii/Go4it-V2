import { db } from './ai-engine/lib/db';
import { ncaaSchools } from './ai-engine/lib/schema';

const ncaaSchoolsData = [
  // Big Ten Conference
  {
    schoolName: 'University of Michigan',
    division: 'D1',
    conference: 'Big Ten',
    state: 'MI',
    city: 'Ann Arbor',
    website: 'https://mgoblue.com',
    coachingStaff: JSON.stringify({
      football: { head: 'Sherrone Moore', recruiting: 'Kirk Campbell' },
      basketball: { head: 'Juwan Howard', recruiting: 'Phil Martelli' }
    }),
    programs: JSON.stringify(['Football', 'Basketball', 'Hockey', 'Baseball', 'Soccer', 'Lacrosse']),
    isActive: true
  },
  {
    schoolName: 'Ohio State University',
    division: 'D1',
    conference: 'Big Ten',
    state: 'OH',
    city: 'Columbus',
    website: 'https://ohiostatebuckeyes.com',
    coachingStaff: JSON.stringify({
      football: { head: 'Ryan Day', recruiting: 'Brian Hartline' },
      basketball: { head: 'Jake Diebler', recruiting: 'Tony Skinn' }
    }),
    programs: JSON.stringify(['Football', 'Basketball', 'Wrestling', 'Baseball', 'Soccer', 'Volleyball']),
    isActive: true
  },
  {
    schoolName: 'Penn State University',
    division: 'D1',
    conference: 'Big Ten',
    state: 'PA',
    city: 'University Park',
    website: 'https://gopsusports.com',
    coachingStaff: JSON.stringify({
      football: { head: 'James Franklin', recruiting: 'Ja\'Juan Seider' },
      basketball: { head: 'Mike Rhoades', recruiting: 'Keith Urgo' }
    }),
    programs: JSON.stringify(['Football', 'Basketball', 'Wrestling', 'Volleyball', 'Soccer', 'Hockey']),
    isActive: true
  },

  // SEC Conference
  {
    schoolName: 'University of Alabama',
    division: 'D1',
    conference: 'SEC',
    state: 'AL',
    city: 'Tuscaloosa',
    website: 'https://rolltide.com',
    coachingStaff: JSON.stringify({
      football: { head: 'Kalen DeBoer', recruiting: 'Courtney Morgan' },
      basketball: { head: 'Nate Oats', recruiting: 'Bryan Hodgson' }
    }),
    programs: JSON.stringify(['Football', 'Basketball', 'Baseball', 'Gymnastics', 'Soccer', 'Softball']),
    isActive: true
  },
  {
    schoolName: 'University of Georgia',
    division: 'D1',
    conference: 'SEC',
    state: 'GA',
    city: 'Athens',
    website: 'https://georgiadogs.com',
    coachingStaff: JSON.stringify({
      football: { head: 'Kirby Smart', recruiting: 'Todd Hartley' },
      basketball: { head: 'Mike White', recruiting: 'Eric Reveno' }
    }),
    programs: JSON.stringify(['Football', 'Basketball', 'Baseball', 'Gymnastics', 'Swimming', 'Soccer']),
    isActive: true
  },
  {
    schoolName: 'Louisiana State University',
    division: 'D1',
    conference: 'SEC',
    state: 'LA',
    city: 'Baton Rouge',
    website: 'https://lsusports.net',
    coachingStaff: JSON.stringify({
      football: { head: 'Brian Kelly', recruiting: 'Cortez Hankton' },
      basketball: { head: 'Matt McMahon', recruiting: 'Tasmin Mitchell' }
    }),
    programs: JSON.stringify(['Football', 'Basketball', 'Baseball', 'Track & Field', 'Gymnastics', 'Soccer']),
    isActive: true
  },

  // ACC Conference
  {
    schoolName: 'Clemson University',
    division: 'D1',
    conference: 'ACC',
    state: 'SC',
    city: 'Clemson',
    website: 'https://clemsontigers.com',
    coachingStaff: JSON.stringify({
      football: { head: 'Dabo Swinney', recruiting: 'Brandon Streeter' },
      basketball: { head: 'Brad Brownell', recruiting: 'Steve Smith' }
    }),
    programs: JSON.stringify(['Football', 'Basketball', 'Baseball', 'Soccer', 'Track & Field', 'Volleyball']),
    isActive: true
  },
  {
    schoolName: 'Florida State University',
    division: 'D1',
    conference: 'ACC',
    state: 'FL',
    city: 'Tallahassee',
    website: 'https://seminoles.com',
    coachingStaff: JSON.stringify({
      football: { head: 'Mike Norvell', recruiting: 'Ron Dugans' },
      basketball: { head: 'Leonard Hamilton', recruiting: 'Stan Jones' }
    }),
    programs: JSON.stringify(['Football', 'Basketball', 'Baseball', 'Track & Field', 'Soccer', 'Softball']),
    isActive: true
  },

  // Big 12 Conference
  {
    schoolName: 'University of Texas',
    division: 'D1',
    conference: 'SEC',
    state: 'TX',
    city: 'Austin',
    website: 'https://texassports.com',
    coachingStaff: JSON.stringify({
      football: { head: 'Steve Sarkisian', recruiting: 'Kyle Flood' },
      basketball: { head: 'Rodney Terry', recruiting: 'K.T. Turner' }
    }),
    programs: JSON.stringify(['Football', 'Basketball', 'Baseball', 'Swimming', 'Track & Field', 'Volleyball']),
    isActive: true
  },
  {
    schoolName: 'University of Oklahoma',
    division: 'D1',
    conference: 'SEC',
    state: 'OK',
    city: 'Norman',
    website: 'https://soonersports.com',
    coachingStaff: JSON.stringify({
      football: { head: 'Brent Venables', recruiting: 'L\'Damian Washington' },
      basketball: { head: 'Porter Moser', recruiting: 'Carlin Hartman' }
    }),
    programs: JSON.stringify(['Football', 'Basketball', 'Baseball', 'Gymnastics', 'Softball', 'Wrestling']),
    isActive: true
  },

  // Pac-12 / Big Ten
  {
    schoolName: 'University of Southern California',
    division: 'D1',
    conference: 'Big Ten',
    state: 'CA',
    city: 'Los Angeles',
    website: 'https://usctrojans.com',
    coachingStaff: JSON.stringify({
      football: { head: 'Lincoln Riley', recruiting: 'Dennis Simmons' },
      basketball: { head: 'Eric Musselman', recruiting: 'Eric Coleman' }
    }),
    programs: JSON.stringify(['Football', 'Basketball', 'Baseball', 'Track & Field', 'Swimming', 'Water Polo']),
    isActive: true
  },
  {
    schoolName: 'UCLA',
    division: 'D1',
    conference: 'Big Ten',
    state: 'CA',
    city: 'Los Angeles',
    website: 'https://uclabruins.com',
    coachingStaff: JSON.stringify({
      football: { head: 'DeShaun Foster', recruiting: 'Eric Bieniemy Jr.' },
      basketball: { head: 'Mick Cronin', recruiting: 'Darren Savino' }
    }),
    programs: JSON.stringify(['Football', 'Basketball', 'Baseball', 'Gymnastics', 'Soccer', 'Water Polo']),
    isActive: true
  },

  // Division II Schools
  {
    schoolName: 'Grand Valley State University',
    division: 'D2',
    conference: 'GLIAC',
    state: 'MI',
    city: 'Allendale',
    website: 'https://gvsulakers.com',
    coachingStaff: JSON.stringify({
      football: { head: 'Curt Anes', recruiting: 'Evan Jankauskas' },
      basketball: { head: 'Ric Wesley', recruiting: 'Jake Freiburger' }
    }),
    programs: JSON.stringify(['Football', 'Basketball', 'Baseball', 'Soccer', 'Track & Field', 'Volleyball']),
    isActive: true
  },
  {
    schoolName: 'Valdosta State University',
    division: 'D2',
    conference: 'Gulf South',
    state: 'GA',
    city: 'Valdosta',
    website: 'https://vstatesports.com',
    coachingStaff: JSON.stringify({
      football: { head: 'Tremaine Jackson', recruiting: 'Brian Browder' },
      basketball: { head: 'Mike Helfer', recruiting: 'Ronnie Cooner' }
    }),
    programs: JSON.stringify(['Football', 'Basketball', 'Baseball', 'Tennis', 'Soccer', 'Softball']),
    isActive: true
  },

  // Division III Schools
  {
    schoolName: 'University of Wisconsin-Whitewater',
    division: 'D3',
    conference: 'WIAC',
    state: 'WI',
    city: 'Whitewater',
    website: 'https://uwwsports.com',
    coachingStaff: JSON.stringify({
      football: { head: 'Jace Rindahl', recruiting: 'Ben Russell' },
      basketball: { head: 'Pat Miller', recruiting: 'Drew Diener' }
    }),
    programs: JSON.stringify(['Football', 'Basketball', 'Baseball', 'Soccer', 'Track & Field', 'Wrestling']),
    isActive: true
  },
  {
    schoolName: 'Mount Union University',
    division: 'D3',
    conference: 'OAC',
    state: 'OH',
    city: 'Alliance',
    website: 'https://mountunionpurpleraidersports.com',
    coachingStaff: JSON.stringify({
      football: { head: 'Vince Kehres', recruiting: 'Andy McFarland' },
      basketball: { head: 'Ryan Oiler', recruiting: 'Jeff Grover' }
    }),
    programs: JSON.stringify(['Football', 'Basketball', 'Baseball', 'Soccer', 'Track & Field', 'Swimming']),
    isActive: true
  },

  // NAIA Schools
  {
    schoolName: 'Northwestern College (Iowa)',
    division: 'NAIA',
    conference: 'GPAC',
    state: 'IA',
    city: 'Orange City',
    website: 'https://nwcraiders.com',
    coachingStaff: JSON.stringify({
      football: { head: 'Matt McCarty', recruiting: 'Hunter Milks' },
      basketball: { head: 'Kris Korver', recruiting: 'Tyler Rowe' }
    }),
    programs: JSON.stringify(['Football', 'Basketball', 'Baseball', 'Soccer', 'Track & Field', 'Wrestling']),
    isActive: true
  },
  {
    schoolName: 'Morningside University',
    division: 'NAIA',
    conference: 'GPAC',
    state: 'IA',
    city: 'Sioux City',
    website: 'https://msideathletics.com',
    coachingStaff: JSON.stringify({
      football: { head: 'Steve Ryan', recruiting: 'Casey Toft' },
      basketball: { head: 'Jim Flanery', recruiting: 'Tyler Lange' }
    }),
    programs: JSON.stringify(['Football', 'Basketball', 'Baseball', 'Soccer', 'Track & Field', 'Volleyball']),
    isActive: true
  },

  // NJCAA Schools
  {
    schoolName: 'Iowa Central Community College',
    division: 'NJCAA',
    conference: 'ICCAC',
    state: 'IA',
    city: 'Fort Dodge',
    website: 'https://iowacentralathletics.com',
    coachingStaff: JSON.stringify({
      football: { head: 'Aaron Alllen', recruiting: 'Jesse Montalvo' },
      basketball: { head: 'Derrick Dietzen', recruiting: 'Randy Janssen' }
    }),
    programs: JSON.stringify(['Football', 'Basketball', 'Baseball', 'Soccer', 'Volleyball', 'Wrestling']),
    isActive: true
  },
  {
    schoolName: 'Butler Community College',
    division: 'NJCAA',
    conference: 'KJCCC',
    state: 'KS',
    city: 'El Dorado',
    website: 'https://butlergrizzlies.com',
    coachingStaff: JSON.stringify({
      football: { head: 'Justin Hoover', recruiting: 'Jordan Wimbley' },
      basketball: { head: 'Bryan Zollinger', recruiting: 'Stephen Phyall' }
    }),
    programs: JSON.stringify(['Football', 'Basketball', 'Baseball', 'Soccer', 'Volleyball', 'Cheerleading']),
    isActive: true
  },
];

async function seedNcaaSchools() {
  try {
    console.log('Starting NCAA schools database seeding...');
    
    // Insert all schools
    for (const school of ncaaSchoolsData) {
      await db.insert(ncaaSchools).values(school).onConflictDoNothing();
      console.log(`✓ Inserted: ${school.schoolName}`);
    }
    
    console.log(`\n✅ Successfully seeded ${ncaaSchoolsData.length} NCAA schools!`);
    console.log('\nBreakdown by division:');
    console.log(`- D1: ${ncaaSchoolsData.filter(s => s.division === 'D1').length} schools`);
    console.log(`- D2: ${ncaaSchoolsData.filter(s => s.division === 'D2').length} schools`);
    console.log(`- D3: ${ncaaSchoolsData.filter(s => s.division === 'D3').length} schools`);
    console.log(`- NAIA: ${ncaaSchoolsData.filter(s => s.division === 'NAIA').length} schools`);
    console.log(`- NJCAA: ${ncaaSchoolsData.filter(s => s.division === 'NJCAA').length} schools`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding NCAA schools:', error);
    process.exit(1);
  }
}

seedNcaaSchools();
