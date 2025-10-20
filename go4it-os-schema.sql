-- Enable UUIDs for secure, non-sequential IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: Users (Synchronized with Clerk)
-- Clerk is the source of truth for auth, we mirror what we need in our DB
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clerk_user_id VARCHAR(255) NOT NULL UNIQUE, -- The ID from Clerk
    email VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    profile_image_url TEXT,
    role VARCHAR(50) NOT NULL DEFAULT 'staff', -- 'admin', 'staff', 'coach'
    location VARCHAR(100), -- 'Dallas', 'Merida', 'Vienna'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: Goals (The Hierarchy: 5-Year -> Yearly -> Quarterly -> Monthly)
CREATE TABLE goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(20) NOT NULL, -- '5-year', 'yearly', 'quarterly', 'monthly'
    target_value NUMERIC, -- e.g., 50 (for 50 athletes placed)
    current_value NUMERIC DEFAULT 0,
    start_date DATE,
    end_date DATE,
    parent_goal_id UUID REFERENCES goals(id) ON DELETE CASCADE, -- For the hierarchy
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: Projects (e.g., "Vienna Launch", "Q1 European Combines", "GAR AI Integration")
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'completed', 'paused'
    goal_id UUID NOT NULL REFERENCES goals(id), -- Ties every project to a high-level goal
    lead_id UUID NOT NULL REFERENCES users(id), -- Project owner
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: Tasks (The core unit of work)
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'backlog', -- 'backlog', 'todo', 'in_progress', 'review', 'done'
    priority VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
    due_date TIMESTAMP WITH TIME ZONE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    assigned_to UUID REFERENCES users(id), -- Who is doing the task?
    created_by UUID NOT NULL REFERENCES users(id), -- Who created the task?
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: Events (For Calendar - Meetings, Combines, Deadlines)
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    all_day BOOLEAN DEFAULT FALSE,
    type VARCHAR(50) NOT NULL, -- 'meeting', 'combine', 'training', 'deadline'
    location VARCHAR(255), -- Physical location or Google Meet link
    project_id UUID REFERENCES projects(id), -- Link event to a project (optional)
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Junction Table: Event Attendees (Many-to-Many between Users and Events)
CREATE TABLE event_attendees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'invited', -- 'invited', 'accepted', 'declined'
    UNIQUE(event_id, user_id)
);

-- Table: Comments/Discussion (on Tasks)
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content TEXT NOT NULL,
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for Performance
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_events_start_time ON events(start_time);
CREATE INDEX idx_events_type ON events(type);
CREATE INDEX idx_goals_type ON goals(type);
