# Development Prompt: Multi-School Platform Integration

## Project Objective
Transform the existing Sentinel AI cybersecurity platform into a comprehensive multi-school oversight system that provides centralized management, security, and analytics across educational institutions.

## Core Transformation Requirements

### 1. Architecture Evolution
**From**: Single-tenant cybersecurity platform  
**To**: Multi-tenant educational institution management system

**New Hierarchy**:
```
School District (Superintendent Level)
├── School A (Principal Level)
│   ├── Main Campus
│   ├── Satellite Campus
│   └── Virtual Learning Center
├── School B (Principal Level)
└── School C (Principal Level)
```

### 2. Database Schema Extension
Add these new entities to `shared/schema.ts`:

```typescript
// School Districts - Top level organizational unit
export const schoolDistricts = pgTable("school_districts", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  superintendent: varchar("superintendent", { length: 255 }),
  address: text("address"),
  phone: varchar("phone", { length: 20 }),
  email: varchar("email", { length: 255 }),
  studentCount: integer("student_count").default(0),
  schoolCount: integer("school_count").default(0),
  staffCount: integer("staff_count").default(0),
  budgetTotal: decimal("budget_total", { precision: 12, scale: 2 }),
  establishedYear: integer("established_year"),
  website: varchar("website", { length: 255 }),
  logoUrl: varchar("logo_url", { length: 500 }),
  timezone: varchar("timezone", { length: 50 }).default("America/New_York"),
  academicCalendarStart: date("academic_calendar_start"),
  academicCalendarEnd: date("academic_calendar_end"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Individual Schools within a district
export const schools = pgTable("schools", {
  id: serial("id").primaryKey(),
  districtId: integer("district_id").references(() => schoolDistricts.id),
  name: varchar("name", { length: 255 }).notNull(),
  type: varchar("type", { length: 50 }).notNull(), // elementary, middle, high, college, special
  principal: varchar("principal", { length: 255 }),
  assistantPrincipal: varchar("assistant_principal", { length: 255 }),
  address: text("address"),
  phone: varchar("phone", { length: 20 }),
  email: varchar("email", { length: 255 }),
  website: varchar("website", { length: 255 }),
  studentCount: integer("student_count").default(0),
  staffCount: integer("staff_count").default(0),
  teacherCount: integer("teacher_count").default(0),
  gradeRange: varchar("grade_range", { length: 20 }), // K-5, 6-8, 9-12, K-12
  accreditation: varchar("accreditation", { length: 100 }),
  schoolCode: varchar("school_code", { length: 20 }).unique(),
  status: varchar("status", { length: 20 }).default("active"),
  yearEstablished: integer("year_established"),
  mascot: varchar("mascot", { length: 100 }),
  schoolColors: varchar("school_colors", { length: 100 }),
  districtRanking: integer("district_ranking"),
  stateRanking: integer("state_ranking"),
  averageClassSize: decimal("average_class_size", { precision: 4, scale: 1 }),
  graduationRate: decimal("graduation_rate", { precision: 5, scale: 2 }),
  attendanceRate: decimal("attendance_rate", { precision: 5, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Physical campuses for each school
export const campuses = pgTable("campuses", {
  id: serial("id").primaryKey(),
  schoolId: integer("school_id").references(() => schools.id),
  name: varchar("name", { length: 255 }).notNull(),
  campusCode: varchar("campus_code", { length: 20 }),
  address: text("address").notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  buildingCount: integer("building_count").default(1),
  classroomCount: integer("classroom_count").default(0),
  labCount: integer("lab_count").default(0),
  libraryCount: integer("library_count").default(0),
  gymCount: integer("gym_count").default(0),
  cafeteriaCount: integer("cafeteria_count").default(0),
  auditoriumCount: integer("auditorium_count").default(0),
  studentCapacity: integer("student_capacity").default(0),
  parkingSpaces: integer("parking_spaces").default(0),
  wifiNetworks: integer("wifi_networks").default(0),
  securityCameras: integer("security_cameras").default(0),
  accessControlPoints: integer("access_control_points").default(0),
  emergencyExits: integer("emergency_exits").default(0),
  isMainCampus: boolean("is_main_campus").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// All users in the school system
export const schoolUsers = pgTable("school_users", {
  id: serial("id").primaryKey(),
  schoolId: integer("school_id").references(() => schools.id),
  campusId: integer("campus_id").references(() => campuses.id).nullable(),
  employeeId: varchar("employee_id", { length: 50 }).unique().nullable(),
  studentId: varchar("student_id", { length: 50 }).unique().nullable(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  middleName: varchar("middle_name", { length: 100 }),
  email: varchar("email", { length: 255 }).unique().notNull(),
  alternateEmail: varchar("alternate_email", { length: 255 }),
  phone: varchar("phone", { length: 20 }),
  emergencyContact: varchar("emergency_contact", { length: 255 }),
  emergencyPhone: varchar("emergency_phone", { length: 20 }),
  role: varchar("role", { length: 50 }).notNull(), // student, teacher, admin, staff, parent, substitute, volunteer
  department: varchar("department", { length: 100 }).nullable(), // for staff/teachers
  grade: varchar("grade", { length: 10 }).nullable(), // for students
  homeroom: varchar("homeroom", { length: 50 }).nullable(),
  graduationYear: integer("graduation_year").nullable(),
  parentEmail: varchar("parent_email", { length: 255 }).nullable(),
  guardianName: varchar("guardian_name", { length: 255 }).nullable(),
  dateOfBirth: date("date_of_birth").nullable(),
  address: text("address"),
  enrollmentDate: date("enrollment_date"),
  lastLogin: timestamp("last_login").nullable(),
  loginCount: integer("login_count").default(0),
  isActive: boolean("is_active").default(true),
  hasSpecialNeeds: boolean("has_special_needs").default(false),
  transportationMethod: varchar("transportation_method", { length: 50 }), // bus, car, walk, bike
  busRoute: varchar("bus_route", { length: 50 }).nullable(),
  allergies: text("allergies"),
  medications: text("medications"),
  medicalConditions: text("medical_conditions"),
  photoUrl: varchar("photo_url", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Technology systems deployed across schools
export const schoolSystems = pgTable("school_systems", {
  id: serial("id").primaryKey(),
  schoolId: integer("school_id").references(() => schools.id),
  campusId: integer("campus_id").references(() => campuses.id).nullable(),
  systemType: varchar("system_type", { length: 50 }).notNull(), // LMS, SIS, network, security, HVAC, fire, access
  category: varchar("category", { length: 50 }).notNull(), // educational, security, infrastructure, communication
  name: varchar("name", { length: 255 }).notNull(),
  vendor: varchar("vendor", { length: 100 }),
  version: varchar("version", { length: 50 }),
  licenseCount: integer("license_count"),
  ipAddress: varchar("ip_address", { length: 45 }),
  macAddress: varchar("mac_address", { length: 17 }),
  location: varchar("location", { length: 255 }),
  installDate: date("install_date"),
  lastUpdate: timestamp("last_update"),
  maintenanceSchedule: varchar("maintenance_schedule", { length: 100 }),
  status: varchar("status", { length: 20 }).default("active"),
  healthScore: integer("health_score").default(100), // 0-100
  lastHealthCheck: timestamp("last_health_check").nullable(),
  alertsEnabled: boolean("alerts_enabled").default(true),
  criticalityLevel: varchar("criticality_level", { length: 20 }).default("medium"), // low, medium, high, critical
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Academic performance tracking
export const academicPerformance = pgTable("academic_performance", {
  id: serial("id").primaryKey(),
  schoolId: integer("school_id").references(() => schools.id),
  studentId: integer("student_id").references(() => schoolUsers.id),
  semester: varchar("semester", { length: 20 }).notNull(),
  academicYear: varchar("academic_year", { length: 10 }).notNull(),
  subject: varchar("subject", { length: 100 }).notNull(),
  teacherId: integer("teacher_id").references(() => schoolUsers.id),
  grade: varchar("grade", { length: 5 }), // A+, A, B+, etc.
  percentage: decimal("percentage", { precision: 5, scale: 2 }),
  attendanceRate: decimal("attendance_rate", { precision: 5, scale: 2 }),
  behaviorScore: integer("behavior_score"), // 1-10
  homeworkCompletion: decimal("homework_completion", { precision: 5, scale: 2 }),
  testScores: text("test_scores"), // JSON array of test scores
  notes: text("notes"),
  parentNotified: boolean("parent_notified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// School events and activities
export const schoolEvents = pgTable("school_events", {
  id: serial("id").primaryKey(),
  schoolId: integer("school_id").references(() => schools.id),
  campusId: integer("campus_id").references(() => campuses.id).nullable(),
  organizerId: integer("organizer_id").references(() => schoolUsers.id),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  eventType: varchar("event_type", { length: 50 }).notNull(), // assembly, sports, field_trip, meeting, conference
  location: varchar("location", { length: 255 }),
  startDateTime: timestamp("start_date_time").notNull(),
  endDateTime: timestamp("end_date_time").notNull(),
  isAllDay: boolean("is_all_day").default(false),
  isRecurring: boolean("is_recurring").default(false),
  recurrencePattern: varchar("recurrence_pattern", { length: 100 }),
  maxAttendees: integer("max_attendees"),
  currentAttendees: integer("current_attendees").default(0),
  requiresPermission: boolean("requires_permission").default(false),
  cost: decimal("cost", { precision: 8, scale: 2 }).default(0),
  status: varchar("status", { length: 20 }).default("scheduled"), // scheduled, active, completed, cancelled
  visibility: varchar("visibility", { length: 20 }).default("public"), // public, staff, students, parents
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
```

### 3. Dashboard Transformation
Create new dashboard components in `client/src/components/`:

**District Overview Dashboard**:
```typescript
// DistrictOverviewDashboard.tsx
interface DistrictMetrics {
  totalSchools: number;
  totalStudents: number;
  totalStaff: number;
  totalBudget: number;
  averageTestScores: number;
  graduationRate: number;
  attendanceRate: number;
  activeSecurityThreats: number;
  systemUptime: number;
  complianceScore: number;
}
```

**Multi-School Monitoring Grid**:
```typescript
// MultiSchoolGrid.tsx
interface SchoolGridItem {
  schoolId: number;
  name: string;
  type: string;
  studentCount: number;
  staffCount: number;
  status: 'healthy' | 'warning' | 'critical';
  securityAlerts: number;
  academicPerformance: number;
  lastUpdate: Date;
}
```

### 4. Navigation Updates
Modify `client/src/App.tsx` to include new routes:

```typescript
const routes = [
  { path: "/", component: DistrictOverview },
  { path: "/district", component: DistrictDashboard },
  { path: "/schools", component: SchoolList },
  { path: "/school/:id", component: SchoolDashboard },
  { path: "/students", component: StudentManagement },
  { path: "/staff", component: StaffManagement },
  { path: "/academics", component: AcademicDashboard },
  { path: "/security", component: SecurityDashboard },
  { path: "/compliance", component: ComplianceDashboard },
  { path: "/reports", component: ReportingHub },
  { path: "/settings", component: SystemSettings },
];
```

### 5. API Endpoints Extension
Add these routes to `server/routes.ts`:

```typescript
// District management
app.get('/api/districts', getDistricts);
app.get('/api/districts/:id', getDistrict);
app.post('/api/districts', createDistrict);

// School management
app.get('/api/schools', getSchools);
app.get('/api/schools/:id', getSchool);
app.get('/api/districts/:districtId/schools', getSchoolsByDistrict);
app.post('/api/schools', createSchool);

// User management
app.get('/api/schools/:schoolId/users', getSchoolUsers);
app.get('/api/users/:userId/profile', getUserProfile);
app.post('/api/users', createUser);
app.put('/api/users/:userId', updateUser);

// Academic performance
app.get('/api/schools/:schoolId/performance', getAcademicPerformance);
app.get('/api/students/:studentId/grades', getStudentGrades);
app.post('/api/grades', recordGrade);

// Events and activities
app.get('/api/schools/:schoolId/events', getSchoolEvents);
app.post('/api/events', createEvent);
app.put('/api/events/:eventId', updateEvent);

// Analytics and reporting
app.get('/api/districts/:districtId/analytics', getDistrictAnalytics);
app.get('/api/schools/:schoolId/analytics', getSchoolAnalytics);
app.get('/api/reports/district/:districtId', generateDistrictReport);
```

### 6. Security Model Updates
Implement role-based access control:

```typescript
// Define user roles and permissions
enum UserRole {
  SUPERINTENDENT = 'superintendent',
  DISTRICT_ADMIN = 'district_admin',
  PRINCIPAL = 'principal',
  ASSISTANT_PRINCIPAL = 'assistant_principal',
  TEACHER = 'teacher',
  STAFF = 'staff',
  STUDENT = 'student',
  PARENT = 'parent',
  SUBSTITUTE = 'substitute',
  VOLUNTEER = 'volunteer',
}

// Permissions matrix
interface Permissions {
  canViewDistrict: boolean;
  canEditSchools: boolean;
  canManageUsers: boolean;
  canViewGrades: boolean;
  canEditGrades: boolean;
  canViewReports: boolean;
  canManageSecurity: boolean;
  canConfigureSystem: boolean;
}
```

## Success Criteria

### Technical Requirements
- Support 100+ schools per district
- Handle 50,000+ users per district
- Real-time updates across all schools
- 99.99% uptime for critical systems
- Mobile-responsive design
- FERPA compliance for student data

### Functional Requirements
- Centralized user management across all schools
- Real-time monitoring of school systems
- Automated reporting and analytics
- Emergency response coordination
- Academic performance tracking
- Resource optimization recommendations

### Performance Requirements
- Page load times under 2 seconds
- Real-time updates within 5 seconds
- Support for 1,000+ concurrent users
- Database queries under 100ms
- API response times under 500ms
- 99.9% data accuracy

## Development Timeline

### Phase 1 (Weeks 1-4): Foundation
- Database schema implementation
- Basic authentication and authorization
- District and school management interfaces
- User management system

### Phase 2 (Weeks 5-8): Core Features
- Multi-school dashboard
- Academic performance tracking
- Event management system
- Basic reporting functionality

### Phase 3 (Weeks 9-12): Advanced Features
- Security monitoring integration
- Compliance tracking
- Advanced analytics
- Mobile optimization

### Phase 4 (Weeks 13-16): Integration & Testing
- Third-party system integrations
- Performance optimization
- Security testing
- User acceptance testing

This transformation will create a comprehensive educational technology platform that provides unprecedented oversight and management capabilities for multi-school environments.