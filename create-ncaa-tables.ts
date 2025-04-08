import { connection, db } from "./server/db";
import { 
  ncaaSchools, 
  athleticDepartments, 
  sportPrograms, 
  coachingStaff, 
  recruitingContacts 
} from "./shared/schema";
import { sql } from "drizzle-orm";

async function createNcaaTables() {
  console.log("Creating NCAA database tables...");
  
  try {
    // Create NCAA Schools table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS ncaa_schools (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        abbreviation TEXT,
        nickname TEXT,
        division TEXT NOT NULL,
        conference TEXT,
        city TEXT NOT NULL,
        state TEXT NOT NULL,
        website TEXT,
        logo_url TEXT,
        primary_color TEXT,
        secondary_color TEXT,
        athletic_department_url TEXT,
        recruiting_url TEXT,
        enrollment_count INTEGER,
        is_private BOOLEAN,
        founded INTEGER,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_by INTEGER REFERENCES users(id)
      )
    `);
    console.log("NCAA Schools table created");
    
    // Create Athletic Departments table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS athletic_departments (
        id SERIAL PRIMARY KEY,
        school_id INTEGER NOT NULL REFERENCES ncaa_schools(id),
        name TEXT NOT NULL,
        address TEXT,
        phone TEXT,
        email TEXT,
        main_contact_name TEXT,
        website TEXT,
        social_media JSONB,
        budget NUMERIC(15, 2),
        staff_count INTEGER,
        facilities_info TEXT,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_by INTEGER REFERENCES users(id)
      )
    `);
    console.log("Athletic Departments table created");
    
    // Create Sport Programs table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS sport_programs (
        id SERIAL PRIMARY KEY,
        school_id INTEGER NOT NULL REFERENCES ncaa_schools(id),
        sport TEXT NOT NULL,
        gender TEXT NOT NULL,
        division TEXT,
        conference TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        stadium_name TEXT,
        stadium_capacity INTEGER,
        championship_years TEXT[],
        team_website TEXT,
        team_social_media JSONB,
        roster_size INTEGER,
        scholarship_count INTEGER,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_by INTEGER REFERENCES users(id)
      )
    `);
    console.log("Sport Programs table created");
    
    // Create Coaching Staff table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS coaching_staff (
        id SERIAL PRIMARY KEY,
        sport_program_id INTEGER NOT NULL REFERENCES sport_programs(id),
        name TEXT NOT NULL,
        title TEXT NOT NULL,
        email TEXT,
        phone TEXT,
        bio TEXT,
        photo_url TEXT,
        years_in_position INTEGER,
        career_record TEXT,
        specialization TEXT,
        previous_schools TEXT[],
        playing_experience TEXT,
        education TEXT,
        is_recruiter BOOLEAN DEFAULT FALSE,
        recruiting_regions TEXT[],
        social_media_links JSONB,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_by INTEGER REFERENCES users(id)
      )
    `);
    console.log("Coaching Staff table created");
    
    // Create Recruiting Contacts table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS recruiting_contacts (
        id SERIAL PRIMARY KEY,
        sport_program_id INTEGER NOT NULL REFERENCES sport_programs(id),
        name TEXT NOT NULL,
        title TEXT NOT NULL,
        email TEXT,
        phone TEXT,
        preferred_contact_method TEXT,
        regions TEXT[],
        positions TEXT[],
        notes TEXT,
        best_time_to_contact TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_by INTEGER REFERENCES users(id)
      )
    `);
    console.log("Recruiting Contacts table created");
    
    // Insert sample data for testing
    await insertSampleData();
    
    console.log("NCAA database tables created successfully with sample data");
  } catch (error) {
    console.error("Error creating NCAA database tables:", error);
  } finally {
    // Close the database connection
    await connection.end();
  }
}

async function insertSampleData() {
  console.log("Inserting sample NCAA data...");
  
  // Insert sample NCAA schools
  const [alabama] = await db.insert(ncaaSchools).values({
    name: "University of Alabama",
    abbreviation: "BAMA",
    nickname: "Crimson Tide",
    division: "D1-FBS",
    conference: "SEC",
    city: "Tuscaloosa",
    state: "AL",
    website: "https://www.ua.edu",
    logoUrl: "https://example.com/alabama_logo.png",
    primaryColor: "#9E1B32",
    secondaryColor: "#FFFFFF",
    athleticDepartmentUrl: "https://rolltide.com",
    recruitingUrl: "https://rolltide.com/recruiting",
    enrollmentCount: 38100,
    isPrivate: false,
    founded: 1831
  }).returning();
  
  const [ohio] = await db.insert(ncaaSchools).values({
    name: "Ohio State University",
    abbreviation: "OSU",
    nickname: "Buckeyes",
    division: "D1-FBS",
    conference: "Big Ten",
    city: "Columbus",
    state: "OH",
    website: "https://www.osu.edu",
    logoUrl: "https://example.com/osu_logo.png",
    primaryColor: "#BB0000",
    secondaryColor: "#666666",
    athleticDepartmentUrl: "https://ohiostatebuckeyes.com",
    recruitingUrl: "https://ohiostatebuckeyes.com/recruiting",
    enrollmentCount: 61170,
    isPrivate: false,
    founded: 1870
  }).returning();
  
  const [duke] = await db.insert(ncaaSchools).values({
    name: "Duke University",
    abbreviation: "DUKE",
    nickname: "Blue Devils",
    division: "D1-FBS",
    conference: "ACC",
    city: "Durham",
    state: "NC",
    website: "https://www.duke.edu",
    logoUrl: "https://example.com/duke_logo.png",
    primaryColor: "#012169",
    secondaryColor: "#FFFFFF",
    athleticDepartmentUrl: "https://goduke.com",
    recruitingUrl: "https://goduke.com/recruiting",
    enrollmentCount: 16172,
    isPrivate: true,
    founded: 1838
  }).returning();
  
  // Insert athletic departments
  const [alabamaAD] = await db.insert(athleticDepartments).values({
    school_id: alabama.id,
    name: "Alabama Athletics",
    address: "323 Paul W Bryant Dr, Tuscaloosa, AL 35401",
    phone: "(205) 348-3600",
    email: "rolltide@ua.edu",
    main_contact_name: "Greg Byrne",
    website: "https://rolltide.com",
    social_media: JSON.stringify({
      twitter: "@AlabamaAthletics",
      instagram: "@alabamaathletics",
      facebook: "AlabamaAthletics"
    })
  }).returning();
  
  const [ohioAD] = await db.insert(athleticDepartments).values({
    school_id: ohio.id,
    name: "Ohio State Athletics",
    address: "410 Woody Hayes Dr, Columbus, OH 43210",
    phone: "(614) 292-7454",
    email: "buckeyes@osu.edu",
    main_contact_name: "Gene Smith",
    website: "https://ohiostatebuckeyes.com",
    social_media: JSON.stringify({
      twitter: "@OhioStAthetics",
      instagram: "@ohiostateathletics",
      facebook: "OhioStateAthletics"
    })
  }).returning();
  
  // Insert sport programs
  const [alabamaFootball] = await db.insert(sportPrograms).values({
    schoolId: alabama.id,
    sport: "Football",
    gender: "Men",
    division: "D1-FBS",
    conference: "SEC",
    isActive: true,
    stadiumName: "Bryant-Denny Stadium",
    stadiumCapacity: 101821,
    championshipYears: ["2020", "2017", "2015", "2012", "2011", "2009"],
    teamWebsite: "https://rolltide.com/sports/football",
    teamSocialMedia: JSON.stringify({
      twitter: "@AlabamaFTBL",
      instagram: "@alabamafbl"
    }),
    rosterSize: 120,
    scholarshipCount: 85
  }).returning();
  
  const [ohioFootball] = await db.insert(sportPrograms).values({
    schoolId: ohio.id,
    sport: "Football",
    gender: "Men",
    division: "D1-FBS",
    conference: "Big Ten",
    isActive: true,
    stadiumName: "Ohio Stadium",
    stadiumCapacity: 102780,
    championshipYears: ["2014", "2002", "1968", "1961", "1957", "1954"],
    teamWebsite: "https://ohiostatebuckeyes.com/sports/football",
    teamSocialMedia: JSON.stringify({
      twitter: "@OhioStateFB",
      instagram: "@ohiostatefb"
    }),
    rosterSize: 125,
    scholarshipCount: 85
  }).returning();
  
  const [dukeBasketball] = await db.insert(sportPrograms).values({
    schoolId: duke.id,
    sport: "Basketball",
    gender: "Men",
    division: "D1",
    conference: "ACC",
    isActive: true,
    stadiumName: "Cameron Indoor Stadium",
    stadiumCapacity: 9314,
    championshipYears: ["2015", "2010", "2001", "1992", "1991"],
    teamWebsite: "https://goduke.com/sports/mens-basketball",
    teamSocialMedia: JSON.stringify({
      twitter: "@DukeMBB",
      instagram: "@dukembb"
    }),
    rosterSize: 15,
    scholarshipCount: 13
  }).returning();
  
  // Insert coaching staff
  await db.insert(coachingStaff).values({
    sportProgramId: alabamaFootball.id,
    name: "Kalen DeBoer",
    title: "Head Coach",
    email: "kdeboer@ua.edu",
    phone: "(205) 348-3600",
    bio: "Kalen DeBoer became the head coach of Alabama football in 2024, replacing the legendary Nick Saban.",
    photoUrl: "https://example.com/deboer.jpg",
    yearsInPosition: 1,
    careerRecord: "34-9 (overall)",
    specialization: "Offense",
    previousSchools: ["Washington", "Fresno State", "Indiana"],
    playingExperience: "University of Sioux Falls",
    education: "University of Sioux Falls",
    isRecruiter: true,
    recruitingRegions: ["Southeast", "West Coast", "Midwest"],
    socialMediaLinks: JSON.stringify({
      twitter: "@KalenDeBoer"
    })
  });
  
  await db.insert(coachingStaff).values({
    sportProgramId: ohioFootball.id,
    name: "Ryan Day",
    title: "Head Coach",
    email: "day.417@osu.edu",
    phone: "(614) 292-2531",
    bio: "Ryan Day has been the head coach at Ohio State since 2019, continuing the program's tradition of excellence.",
    photoUrl: "https://example.com/day.jpg",
    yearsInPosition: 5,
    careerRecord: "56-8 (at Ohio State)",
    specialization: "Offense",
    previousSchools: ["Philadelphia Eagles", "San Francisco 49ers", "Boston College"],
    playingExperience: "New Hampshire",
    education: "University of New Hampshire",
    isRecruiter: true,
    recruitingRegions: ["Midwest", "Northeast", "Florida"],
    socialMediaLinks: JSON.stringify({
      twitter: "@ryandaytime"
    })
  });
  
  await db.insert(coachingStaff).values({
    sportProgramId: dukeBasketball.id,
    name: "Jon Scheyer",
    title: "Head Coach",
    email: "jscheyer@duke.edu",
    phone: "(919) 613-7500",
    bio: "Jon Scheyer took over for the legendary Coach K as Duke's head basketball coach in 2022.",
    photoUrl: "https://example.com/scheyer.jpg",
    yearsInPosition: 2,
    careerRecord: "45-17 (at Duke)",
    specialization: "Player Development",
    previousSchools: ["Duke (assistant)"],
    playingExperience: "Duke (2006-2010)",
    education: "Duke University",
    isRecruiter: true,
    recruitingRegions: ["National", "Chicago", "East Coast"],
    socialMediaLinks: JSON.stringify({
      twitter: "@JonScheyer"
    })
  });
  
  // Insert recruiting contacts
  await db.insert(recruitingContacts).values({
    sportProgramId: alabamaFootball.id,
    name: "Robert Gillespie",
    title: "Running Backs Coach / Recruiting Coordinator",
    email: "rgillespie@ua.edu",
    phone: "(205) 348-3600",
    preferredContactMethod: "Email",
    regions: ["Florida", "Georgia", "Alabama"],
    positions: ["RB", "ATH"],
    notes: "Focuses on elite running backs and all-purpose athletes.",
    bestTimeToContact: "Weekday afternoons",
    isActive: true
  });
  
  await db.insert(recruitingContacts).values({
    sportProgramId: ohioFootball.id,
    name: "Mark Pantoni",
    title: "Assistant AD for Player Personnel",
    email: "pantoni.1@osu.edu",
    phone: "(614) 292-2531",
    preferredContactMethod: "Phone",
    regions: ["Ohio", "Pennsylvania", "Michigan"],
    positions: ["QB", "WR", "DB"],
    notes: "Main recruiting contact for Ohio State football.",
    bestTimeToContact: "Monday-Thursday mornings",
    isActive: true
  });
  
  console.log("Sample NCAA data inserted successfully");
}

// Run the function
createNcaaTables();