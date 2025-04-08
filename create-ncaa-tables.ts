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
    logo_url: "https://example.com/alabama_logo.png",
    primary_color: "#9E1B32",
    secondary_color: "#FFFFFF",
    athletic_department_url: "https://rolltide.com",
    recruiting_url: "https://rolltide.com/recruiting",
    enrollment_count: 38100,
    is_private: false,
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
    logo_url: "https://example.com/osu_logo.png",
    primary_color: "#BB0000",
    secondary_color: "#666666",
    athletic_department_url: "https://ohiostatebuckeyes.com",
    recruiting_url: "https://ohiostatebuckeyes.com/recruiting",
    enrollment_count: 61170,
    is_private: false,
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
    logo_url: "https://example.com/duke_logo.png",
    primary_color: "#012169",
    secondary_color: "#FFFFFF",
    athletic_department_url: "https://goduke.com",
    recruiting_url: "https://goduke.com/recruiting",
    enrollment_count: 16172,
    is_private: true,
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
    }),
    budget: 200000000,
    staff_count: 250,
    facilities_info: "Multiple state-of-the-art facilities including Bryant-Denny Stadium"
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
    }),
    budget: 220000000,
    staff_count: 280,
    facilities_info: "Multiple top-tier facilities including Ohio Stadium and the Woody Hayes Athletic Center"
  }).returning();
  
  // Insert sport programs
  const [alabamaFootball] = await db.insert(sportPrograms).values({
    school_id: alabama.id,
    sport: "Football",
    gender: "Men",
    division: "D1-FBS",
    conference: "SEC",
    is_active: true,
    stadium_name: "Bryant-Denny Stadium",
    stadium_capacity: 101821,
    championship_years: ["2020", "2017", "2015", "2012", "2011", "2009"],
    team_website: "https://rolltide.com/sports/football",
    team_social_media: JSON.stringify({
      twitter: "@AlabamaFTBL",
      instagram: "@alabamafbl"
    }),
    roster_size: 120,
    scholarship_count: 85
  }).returning();
  
  const [ohioFootball] = await db.insert(sportPrograms).values({
    school_id: ohio.id,
    sport: "Football",
    gender: "Men",
    division: "D1-FBS",
    conference: "Big Ten",
    is_active: true,
    stadium_name: "Ohio Stadium",
    stadium_capacity: 102780,
    championship_years: ["2014", "2002", "1968", "1961", "1957", "1954"],
    team_website: "https://ohiostatebuckeyes.com/sports/football",
    team_social_media: JSON.stringify({
      twitter: "@OhioStateFB",
      instagram: "@ohiostatefb"
    }),
    roster_size: 125,
    scholarship_count: 85
  }).returning();
  
  const [dukeBasketball] = await db.insert(sportPrograms).values({
    school_id: duke.id,
    sport: "Basketball",
    gender: "Men",
    division: "D1",
    conference: "ACC",
    is_active: true,
    stadium_name: "Cameron Indoor Stadium",
    stadium_capacity: 9314,
    championship_years: ["2015", "2010", "2001", "1992", "1991"],
    team_website: "https://goduke.com/sports/mens-basketball",
    team_social_media: JSON.stringify({
      twitter: "@DukeMBB",
      instagram: "@dukembb"
    }),
    roster_size: 15,
    scholarship_count: 13
  }).returning();
  
  // Insert coaching staff
  await db.insert(coachingStaff).values({
    sport_program_id: alabamaFootball.id,
    name: "Kalen DeBoer",
    title: "Head Coach",
    email: "kdeboer@ua.edu",
    phone: "(205) 348-3600",
    bio: "Kalen DeBoer became the head coach of Alabama football in 2024, replacing the legendary Nick Saban.",
    photo_url: "https://example.com/deboer.jpg",
    years_in_position: 1,
    career_record: "34-9 (overall)",
    specialization: "Offense",
    previous_schools: ["Washington", "Fresno State", "Indiana"],
    playing_experience: "University of Sioux Falls",
    education: "University of Sioux Falls",
    is_recruiter: true,
    recruiting_regions: ["Southeast", "West Coast", "Midwest"],
    social_media_links: JSON.stringify({
      twitter: "@KalenDeBoer"
    })
  });
  
  await db.insert(coachingStaff).values({
    sport_program_id: ohioFootball.id,
    name: "Ryan Day",
    title: "Head Coach",
    email: "day.417@osu.edu",
    phone: "(614) 292-2531",
    bio: "Ryan Day has been the head coach at Ohio State since 2019, continuing the program's tradition of excellence.",
    photo_url: "https://example.com/day.jpg",
    years_in_position: 5,
    career_record: "56-8 (at Ohio State)",
    specialization: "Offense",
    previous_schools: ["Philadelphia Eagles", "San Francisco 49ers", "Boston College"],
    playing_experience: "New Hampshire",
    education: "University of New Hampshire",
    is_recruiter: true,
    recruiting_regions: ["Midwest", "Northeast", "Florida"],
    social_media_links: JSON.stringify({
      twitter: "@ryandaytime"
    })
  });
  
  await db.insert(coachingStaff).values({
    sport_program_id: dukeBasketball.id,
    name: "Jon Scheyer",
    title: "Head Coach",
    email: "jscheyer@duke.edu",
    phone: "(919) 613-7500",
    bio: "Jon Scheyer took over for the legendary Coach K as Duke's head basketball coach in 2022.",
    photo_url: "https://example.com/scheyer.jpg",
    years_in_position: 2,
    career_record: "45-17 (at Duke)",
    specialization: "Player Development",
    previous_schools: ["Duke (assistant)"],
    playing_experience: "Duke (2006-2010)",
    education: "Duke University",
    is_recruiter: true,
    recruiting_regions: ["National", "Chicago", "East Coast"],
    social_media_links: JSON.stringify({
      twitter: "@JonScheyer"
    })
  });
  
  // Insert recruiting contacts
  await db.insert(recruitingContacts).values({
    sport_program_id: alabamaFootball.id,
    name: "Robert Gillespie",
    title: "Running Backs Coach / Recruiting Coordinator",
    email: "rgillespie@ua.edu",
    phone: "(205) 348-3600",
    preferred_contact_method: "Email",
    regions: ["Florida", "Georgia", "Alabama"],
    positions: ["RB", "ATH"],
    notes: "Focuses on elite running backs and all-purpose athletes.",
    best_time_to_contact: "Weekday afternoons",
    is_active: true
  });
  
  await db.insert(recruitingContacts).values({
    sport_program_id: ohioFootball.id,
    name: "Mark Pantoni",
    title: "Assistant AD for Player Personnel",
    email: "pantoni.1@osu.edu",
    phone: "(614) 292-2531",
    preferred_contact_method: "Phone",
    regions: ["Ohio", "Pennsylvania", "Michigan"],
    positions: ["QB", "WR", "DB"],
    notes: "Main recruiting contact for Ohio State football.",
    best_time_to_contact: "Monday-Thursday mornings",
    is_active: true
  });
  
  console.log("Sample NCAA data inserted successfully");
}

// Run the function
createNcaaTables();