import { combineTourEvents } from './shared/schema';
import { db } from './server/db';
import { sql } from 'drizzle-orm';

// Main execution function
async function createTables() {
  console.log("Creating combine tour tables if they don't exist...");
  
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS combine_tour_events (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        location TEXT NOT NULL,
        address TEXT NOT NULL,
        city TEXT NOT NULL,
        state TEXT NOT NULL,
        zip_code TEXT NOT NULL,
        start_date TIMESTAMP NOT NULL,
        end_date TIMESTAMP NOT NULL,
        registration_deadline TIMESTAMP,
        maximum_attendees INTEGER,
        current_attendees INTEGER DEFAULT 0,
        price NUMERIC NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        status TEXT DEFAULT 'draft',
        featured_image TEXT,
        active_network_id TEXT,
        registration_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create sample data by directly inserting via SQL
    console.log("Creating sample combine tour events...");
  
    // Insert sample events directly using SQL to avoid type errors
    await db.execute(`
      INSERT INTO combine_tour_events (
        name, description, location, address, city, state, zip_code, 
        start_date, end_date, registration_deadline, maximum_attendees, 
        current_attendees, price, slug, status, featured_image, registration_url
      ) VALUES 
      (
        'Spring Football Combine - Los Angeles',
        'Showcase your skills in front of top college scouts at our Spring Football Combine in Los Angeles.',
        'Los Angeles Memorial Coliseum',
        '3911 S Figueroa St',
        'Los Angeles',
        'CA',
        '90037',
        '2025-05-15T09:00:00',
        '2025-05-15T17:00:00',
        '2025-05-01T23:59:59',
        150,
        87,
        99.99,
        'spring-football-combine-los-angeles-2025',
        'published',
        '/images/combines/la-spring-football.jpg',
        'https://go4it-sports.com/combines/spring-football-la-2025'
      ),
      (
        'Elite Basketball Showcase - Chicago',
        'Join the best high school basketball players in the Midwest for our Elite Basketball Showcase.',
        'United Center',
        '1901 W Madison St',
        'Chicago',
        'IL',
        '60612',
        '2025-06-08T10:00:00',
        '2025-06-08T16:00:00',
        '2025-05-25T23:59:59',
        100,
        42,
        129.99,
        'elite-basketball-showcase-chicago-2025',
        'published',
        '/images/combines/chicago-bball-showcase.jpg',
        'https://go4it-sports.com/combines/elite-bball-chicago-2025'
      ),
      (
        'Summer Soccer Combine - Orlando',
        'Showcase your soccer skills in front of college coaches and professional scouts at our Summer Soccer Combine.',
        'ESPN Wide World of Sports Complex',
        '700 Victory Way',
        'Orlando',
        'FL',
        '32830',
        '2025-07-12T08:00:00',
        '2025-07-13T17:00:00',
        '2025-06-30T23:59:59',
        200,
        65,
        149.99,
        'summer-soccer-combine-orlando-2025',
        'published',
        '/images/combines/orlando-soccer-combine.jpg',
        'https://go4it-sports.com/combines/soccer-orlando-2025'
      ),
      (
        'Track & Field Combine - New York',
        'Test your speed, agility, and endurance at our New York Track & Field Combine.',
        'Icahn Stadium',
        '10 Central Park North',
        'New York',
        'NY',
        '10035',
        '2025-08-05T08:00:00',
        '2025-08-05T17:00:00',
        '2025-07-22T23:59:59',
        175,
        30,
        89.99,
        'track-field-combine-new-york-2025',
        'published',
        '/images/combines/nyc-track-combine.jpg',
        'https://go4it-sports.com/combines/track-field-ny-2025'
      ),
      (
        'Baseball Winter Showcase - Miami',
        'Pitchers, catchers, and position players - show off your skills at our Winter Baseball Showcase.',
        'LoanDepot Park',
        '501 Marlins Way',
        'Miami',
        'FL',
        '33125',
        '2025-12-12T09:00:00',
        '2025-12-13T16:00:00',
        '2025-11-28T23:59:59',
        125,
        0,
        119.99,
        'baseball-winter-showcase-miami-2025',
        'published',
        '/images/combines/miami-baseball-showcase.jpg',
        'https://go4it-sports.com/combines/baseball-miami-2025'
      )
      ON CONFLICT (slug) DO NOTHING
    `);
    
    // Check how many were created
    const eventsCount = await db.select({ count: sql<number>`count(*)` }).from(combineTourEvents);
    console.log(`Total combine tour events in database: ${eventsCount[0].count}`);
    
    console.log("Combine tour tables creation completed");
  } catch (error) {
    console.error("Error creating combine tour tables:", error);
    throw error;
  }
}

// Execute immediately
createTables()
  .then(() => {
    console.log("Tables created successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Failed to create tables:", error);
    process.exit(1);
  });

export default createTables;