#!/bin/bash

# ==============================================
# GO4IT SPORTS COACH PORTAL API FIX
# Version: 1.0.0
# - Adds missing API routes for the Coach Portal
# - Resolves the black screen issue
# ==============================================

echo "===== GO4IT SPORTS COACH PORTAL API FIX ====="
echo "Started: $(date)"
echo "Running as: $(whoami)"

# Base directory
APP_DIR="/var/www/go4itsports"
SERVER_DIR="$APP_DIR/server"
ROUTES_FILE="$SERVER_DIR/routes.ts"
ROUTES_BACKUP="$SERVER_DIR/routes.ts.backup-$(date +%Y%m%d%H%M%S)"

cd "$APP_DIR" || { echo "Cannot find app directory"; exit 1; }

# Create a backup of the current routes file
echo "Creating backup of routes file..."
cp "$ROUTES_FILE" "$ROUTES_BACKUP"

# Check if the coach routes already exist
if grep -q "/api/coach/athletes" "$ROUTES_FILE"; then
  echo "Coach routes already exist in $ROUTES_FILE"
else
  echo "Adding coach routes to $ROUTES_FILE..."
  
  # Find the last route endpoint in the file to insert after
  LAST_ROUTE=$(grep -n "app.get" "$ROUTES_FILE" | tail -1 | cut -d':' -f1)
  if [ -z "$LAST_ROUTE" ]; then
    LAST_ROUTE=$(grep -n "app.post" "$ROUTES_FILE" | tail -1 | cut -d':' -f1)
  fi
  
  if [ -z "$LAST_ROUTE" ]; then
    echo "Cannot find a suitable place to insert coach routes"
    exit 1
  fi
  
  # Insert the coach routes after the last route
  sed -i "${LAST_ROUTE}a\\
  // Coach Portal API Routes\\
  app.get('/api/coach/athletes', (req, res) => {\\
    // Return athletes list\\
    const athletes = [\\
      {\\
        id: 1,\\
        name: 'Marcus Johnson',\\
        avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg',\\
        sport: 'Basketball',\\
        position: 'Point Guard',\\
        class: 'Senior',\\
        gpa: 3.8,\\
        testScores: { sat: 1320 },\\
        starRating: 4,\\
        school: 'Washington High School',\\
        location: 'Seattle, WA',\\
        height: '6\\'2\"',\\
        weight: '185 lbs',\\
        highlights: 12,\\
        status: 'interested',\\
        lastContact: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),\\
        email: 'marcus.johnson@example.com',\\
        phone: '(206) 555-1234',\\
        notes: 'Exceptional court vision and leadership. Team captain for 2 years.',\\
        keyStats: [\\
          { name: 'PPG', value: '18.5' },\\
          { name: 'APG', value: '7.2' },\\
          { name: 'SPG', value: '2.1' },\\
          { name: '3PT%', value: '42%' }\\
        ]\\
      },\\
      {\\
        id: 2,\\
        name: 'Sophia Rodriguez',\\
        avatarUrl: 'https://randomuser.me/api/portraits/women/28.jpg',\\
        sport: 'Soccer',\\
        position: 'Striker',\\
        class: 'Junior',\\
        gpa: 3.9,\\
        testScores: { act: 30 },\\
        starRating: 5,\\
        school: 'Eastside Prep',\\
        location: 'Portland, OR',\\
        height: '5\\'8\"',\\
        weight: '145 lbs',\\
        highlights: 18,\\
        status: 'contacted',\\
        lastContact: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),\\
        email: 'sophia.r@example.com',\\
        phone: '(503) 555-6789',\\
        notes: 'Top goal scorer in the state. Incredible speed and finishing ability.',\\
        keyStats: [\\
          { name: 'Goals', value: '32' },\\
          { name: 'Assists', value: '14' },\\
          { name: 'Shots on Goal', value: '78%' },\\
          { name: 'Minutes', value: '1620' }\\
        ]\\
      },\\
      {\\
        id: 3,\\
        name: 'Tyler Williams',\\
        avatarUrl: 'https://randomuser.me/api/portraits/men/45.jpg',\\
        sport: 'Football',\\
        position: 'Quarterback',\\
        class: 'Junior',\\
        gpa: 3.5,\\
        testScores: { sat: 1280 },\\
        starRating: 4,\\
        school: 'Central High',\\
        location: 'Dallas, TX',\\
        height: '6\\'3\"',\\
        weight: '210 lbs',\\
        highlights: 14,\\
        status: 'committed',\\
        lastContact: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),\\
        email: 't.williams@example.com',\\
        phone: '(214) 555-4321',\\
        notes: 'Strong arm and good mobility. Needs work on progression reads.',\\
        keyStats: [\\
          { name: 'Pass Yards', value: '2850' },\\
          { name: 'TD/INT', value: '32/8' },\\
          { name: 'Comp %', value: '65%' },\\
          { name: 'Rush Yards', value: '420' }\\
        ]\\
      }\\
    ];\\
    res.json(athletes);\\
  });\\
\\
  app.get('/api/coach/recruiting-class', (req, res) => {\\
    const recruitingClass = {\\
      year: new Date().getFullYear() + 1,\\
      positions: [\\
        { name: 'Point Guard', targeted: 2, committed: 1, signed: 0, limit: 2 },\\
        { name: 'Shooting Guard', targeted: 1, committed: 0, signed: 1, limit: 1 },\\
        { name: 'Small Forward', targeted: 2, committed: 1, signed: 0, limit: 2 },\\
        { name: 'Power Forward', targeted: 1, committed: 0, signed: 0, limit: 1 },\\
        { name: 'Center', targeted: 1, committed: 0, signed: 1, limit: 1 }\\
      ],\\
      athletes: [\\
        { \\
          id: 101, \\
          name: 'DeAndre Smith', \\
          position: 'Point Guard', \\
          status: 'committed', \\
          starRating: 4, \\
          date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000) \\
        },\\
        { \\
          id: 102, \\
          name: 'James Wilson', \\
          position: 'Shooting Guard', \\
          status: 'signed', \\
          starRating: 4, \\
          date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) \\
        }\\
      ]\\
    };\\
    res.json(recruitingClass);\\
  });\\
\\
  app.get('/api/coach/events', (req, res) => {\\
    const events = [\\
      {\\
        id: 1,\\
        title: 'Campus Visit - Marcus Johnson',\\
        type: 'visit',\\
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),\\
        location: 'Main Campus',\\
        athletes: [\\
          { id: 1, name: 'Marcus Johnson', avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg' }\\
        ],\\
        notes: 'Full campus tour, meeting with academic advisors, and team practice observation.',\\
        status: 'scheduled'\\
      },\\
      {\\
        id: 2,\\
        title: 'Evaluation Camp',\\
        type: 'camp',\\
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),\\
        location: 'University Sports Complex',\\
        athletes: [\\
          { id: 1, name: 'Marcus Johnson', avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg' },\\
          { id: 2, name: 'Sophia Rodriguez', avatarUrl: 'https://randomuser.me/api/portraits/women/28.jpg' }\\
        ],\\
        notes: 'Annual evaluation camp for top prospects. Full day event.',\\
        status: 'scheduled'\\
      }\\
    ];\\
    res.json(events);\\
  });\\
\\
  app.get('/api/coach/messages', (req, res) => {\\
    const messages = [\\
      {\\
        id: 1,\\
        sender: {\\
          id: 1,\\
          name: 'Marcus Johnson',\\
          avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg',\\
          role: 'athlete'\\
        },\\
        recipient: {\\
          id: 999,\\
          name: 'Coach Williams'\\
        },\\
        content: 'Thank you for the information about the campus visit. I\\'m really looking forward to seeing the facilities and meeting the team!',\\
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),\\
        isRead: true\\
      },\\
      {\\
        id: 2,\\
        sender: {\\
          id: 2,\\
          name: 'Sophia Rodriguez',\\
          avatarUrl: 'https://randomuser.me/api/portraits/women/28.jpg',\\
          role: 'athlete'\\
        },\\
        recipient: {\\
          id: 999,\\
          name: 'Coach Williams'\\
        },\\
        content: 'I enjoyed our call yesterday. I have a few more questions about the academic support programs for student-athletes. Could we schedule another call soon?',\\
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),\\
        isRead: false\\
      }\\
    ];\\
    res.json(messages);\\
  });\\
\\
  app.get('/api/coach/tasks', (req, res) => {\\
    const tasks = [\\
      {\\
        id: 1,\\
        title: 'Review Marcus Johnson\\'s highlight tape',\\
        description: 'New footage from championship game. Evaluate court vision and defensive positioning.',\\
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),\\
        priority: 'high',\\
        status: 'pending',\\
        relatedTo: {\\
          type: 'athlete',\\
          id: 1,\\
          name: 'Marcus Johnson'\\
        }\\
      },\\
      {\\
        id: 2,\\
        title: 'Call Sophia\\'s parents about academic scholarships',\\
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),\\
        priority: 'medium',\\
        status: 'in_progress',\\
        relatedTo: {\\
          type: 'athlete',\\
          id: 2,\\
          name: 'Sophia Rodriguez'\\
        }\\
      }\\
    ];\\
    res.json(tasks);\\
  });\\
  " "$ROUTES_FILE"
  
  echo "Coach routes added successfully to $ROUTES_FILE"
fi

# Fix for athlete_star_path table missing error
echo "Creating missing table definitions to fix athlete_star_path errors..."

DB_FIX_FILE="create-athlete-star-path.sql"
cat > "$DB_FIX_FILE" << EOF
-- Create missing star path tables
CREATE TABLE IF NOT EXISTS athlete_star_path (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    level INTEGER NOT NULL DEFAULT 1,
    xp INTEGER NOT NULL DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    goals JSONB DEFAULT '{}',
    unlocked_areas JSONB DEFAULT '[]'
);

CREATE TABLE IF NOT EXISTS athlete_badges (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    badge_id INTEGER NOT NULL,
    earned_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    badge_type VARCHAR(50) NOT NULL,
    badge_name VARCHAR(100) NOT NULL,
    badge_description TEXT,
    badge_image_url TEXT
);

CREATE TABLE IF NOT EXISTS athlete_progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    sport VARCHAR(50) NOT NULL,
    skill_area VARCHAR(50) NOT NULL,
    skill_name VARCHAR(100) NOT NULL,
    current_level INTEGER NOT NULL DEFAULT 1,
    max_level INTEGER NOT NULL DEFAULT 10,
    progress_percentage INTEGER NOT NULL DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS xp_transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    amount INTEGER NOT NULL,
    transaction_type VARCHAR(50) NOT NULL,
    source VARCHAR(100),
    description TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
EOF

echo "Running database fix script..."
PGPASSWORD=Shatzii\$\$ psql -h localhost -U go4it -d go4it_sports -f "$DB_FIX_FILE"

echo "Restarting application..."
pm2 restart go4it-api go4it-sports

echo "✅ Coach Portal API Fix completed: $(date)"
echo "   You should now be able to access the Coach Portal without getting a black screen."
echo "   Check the application logs if there are any issues: pm2 logs"