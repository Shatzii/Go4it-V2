# StarPath Platform

**Go4it Sports Academy** · Powered by StarPath Accelerator™

A complete web platform for managing StarPath programs including Online Accelerator, Vienna Residency, NCAA Tracking, and student assessments.

---

## 🏗️ Architecture

This is a **monorepo** containing:

```
starpath-platform/
├── packages/
│   ├── backend/          # Express.js REST API
│   ├── frontend/         # Next.js 16 web app (Turbopack)
│   └── shared/           # Shared constants (programs, pricing, etc.)
├── package.json          # Root scripts (concurrently runs both)
├── .replit              # Replit deployment config
└── replit.nix           # Nix environment (Node 18)
```

---

## 🚀 Quick Start

### Local Development

1. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

2. **Start development servers:**
   ```bash
   npm run dev
   ```
   This runs both backend (port 3001) and frontend (port 3000) concurrently.

3. **Access the platform:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001/api/health

---

## 📦 Packages

### Backend (`packages/backend`)

**Stack:** Express.js + CORS + dotenv

**Endpoints:**
- `GET /api/health` - Health check
- `GET /api/programs` - All programs
- `GET /api/programs/:programId` - Specific program
- `POST /api/assessment/start` - Start assessment
- `POST /api/assessment/complete` - Complete assessment
- `POST /api/applications` - Submit application
- `GET /api/students/:id/profile` - Student profile (mock)
- `GET /api/gar/ranges` - GAR score ranges
- `GET /api/hdr/pillars` - HDR pillars
- `GET /api/ncaa/requirements` - NCAA requirements
- `GET /api/contact` - Contact info

**Run standalone:**
```bash
cd packages/backend
npm run dev     # Development with nodemon
npm start       # Production
```

**Environment:**
```env
PORT=3001
NODE_ENV=development
```

---

### Frontend (`packages/frontend`)

**Stack:** Next.js 16 + TypeScript + Tailwind CSS

**Pages:**
- `/` - Landing page with programs overview
- `/assessment` - StarPath Assessment ($397)
- `/programs` - All programs listing
- `/programs/online-accelerator` - (stub, needs implementation)
- `/programs/vienna-residency` - (stub, needs implementation)

**Run standalone:**
```bash
cd packages/frontend
npm run dev     # Development
npm run build   # Production build
npm start       # Production server
```

**Environment:**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

**Dark Theme:**
- Background: `#05070b`
- Panel: `#0B0F14`
- Cyan accent: `#00D4FF`
- Green accent: `#27E36A`

---

### Shared (`packages/shared`)

**File:** `programs.js`

**Exports:**
- `PROGRAMS` - All 4 programs (Assessment, Online Accelerator, Vienna Residency, NCAA Tracking)
- `GAR_RANGES` - Athletic rating score ranges
- `HDR_PILLARS` - Human Development Record pillars
- `NCAA_REQUIREMENTS` - Division 1/2/3 requirements
- `CONTACT_INFO` - Phone/email contacts
- `LOCATIONS` - Denver, Vienna, Dallas, Mérida

Both backend and frontend import from this single source of truth.

---

## 🎯 Programs & Pricing

| Program | Price | Credits | Duration | Delivery |
|---------|-------|---------|----------|----------|
| **StarPath Assessment™** | $397 | - | - | Online |
| **Online Accelerator** | $15,000/semester | 10 | 12 weeks | Online |
| **Vienna Residency** | $28,000/semester | 12 | 12 weeks | In-person |
| **NCAA Tracking** | $1,200-$3,600/year | - | Ongoing | Support |

---

## 🔧 Development

### Scripts

**Root level:**
```bash
npm run dev              # Run both backend + frontend
npm run backend:dev      # Backend only
npm run frontend:dev     # Frontend only
npm run build            # Build frontend for production
npm start                # Start backend in production
npm run install:all      # Install all package dependencies
```

**Backend only:**
```bash
cd packages/backend
npm run dev              # Nodemon auto-reload
npm start                # Production mode
```

**Frontend only:**
```bash
cd packages/frontend
npm run dev              # Next.js dev server (Turbopack)
npm run build            # Production build
npm start                # Production server
```

---

## 🌐 Deployment

### Replit

1. **Import to Replit:**
   - Upload `starpath-platform/` directory
   - Replit will auto-detect `.replit` config

2. **Auto-setup:**
   - Replit runs `npm install --include=dev` on build
   - Starts with `npm run dev`

3. **Environment variables:**
   - Backend will auto-configure PORT from Replit
   - Frontend connects to backend via relative URLs

### Manual Deployment

1. **Backend:**
   ```bash
   cd packages/backend
   npm install --production
   PORT=3001 npm start
   ```

2. **Frontend:**
   ```bash
   cd packages/frontend
   npm install
   npm run build
   npm start
   ```

3. **Reverse Proxy:**
   - Configure Nginx/Apache to route:
     - `/` → Frontend (port 3000)
     - `/api/*` → Backend (port 3001)

---

## 📝 API Examples

### Get All Programs
```bash
curl http://localhost:3001/api/programs
```

### Start Assessment
```bash
curl -X POST http://localhost:3001/api/assessment/start \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "sport": "soccer",
    "academicYear": "junior"
  }'
```

### Submit Application
```bash
curl -X POST http://localhost:3001/api/applications \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "programInterest": "vienna_residency",
    "sport": "soccer",
    "academicYear": "junior"
  }'
```

---

## 🎨 Design System

**Colors:**
```css
--bg-primary: #05070b;      /* Main background */
--bg-secondary: #0B0F14;    /* Panels/cards */
--accent-cyan: #00D4FF;     /* Primary accent */
--accent-green: #27E36A;    /* Secondary accent */
--text-primary: #ffffff;    /* Main text */
--text-secondary: #d1d5db;  /* Gray-300 */
--text-muted: #9ca3af;      /* Gray-400 */
```

**Typography:**
- Font: System UI stack (sans-serif)
- Headings: Bold, gradient text (cyan to green)
- Body: Regular, light colors on dark background

**Components:**
- Buttons: Solid cyan/green backgrounds with hover transitions
- Cards: Dark panels with border-gray-800, hover border-accent
- Links: Cyan color, green hover

---

## 🔐 Environment Variables

### Backend (`.env`)
```env
PORT=3001
NODE_ENV=development
```

### Frontend (`.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## 📚 Next Steps

### To Complete:

1. **Program Detail Pages:**
   - `/programs/online-accelerator`
   - `/programs/vienna-residency`
   - `/programs/ncaa-tracking`

2. **Database Integration:**
   - Replace mock endpoints with real database
   - Add Drizzle ORM or Prisma
   - Store assessments, applications, student profiles

3. **Authentication:**
   - Add Clerk or Auth.js for student/parent login
   - Protect student dashboard routes

4. **Student Dashboard:**
   - HDR tracking interface
   - Progress visualization
   - Document uploads

5. **Admin Panel:**
   - Review applications
   - Manage students
   - Generate reports

6. **Payment Integration:**
   - Stripe for assessment ($397)
   - Payment plans for programs

---

## 📞 Contact

**USA:**
- Phone: +1-303-970-4655
- Timezone: MST

**Europe:**
- Phone: +43-650-564-4236
- Timezone: CET

**General:**
- Email: info@go4itsports.org
- Website: go4itsports.org

---

## 📄 License

UNLICENSED - Proprietary to Go4it Sports Academy

---

**Built with:** Node.js 18 · Express.js · Next.js 16 · TypeScript · Tailwind CSS

**Train Here. Learn Everywhere. Graduate Globally Competitive.**
