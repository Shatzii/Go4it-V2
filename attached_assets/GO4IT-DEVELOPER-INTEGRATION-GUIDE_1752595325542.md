# Go4it Sports Academy - Developer Integration Guide

## Quick Integration for go4itsports.org

### 1. Extract and Configure (5 minutes)
```bash
# Extract the sports academy package
tar -xzf sports-school.tar.gz
cd sports-school

# Install dependencies
npm install

# Configure for go4itsports.org domain
cp ../sports-school.env .env.local
```

### 2. Update Environment for go4itsports.org
Edit `.env.local`:
```bash
# Domain Configuration
NEXT_PUBLIC_DOMAIN=go4itsports.org
NEXT_PUBLIC_API_URL=https://go4itsports.org/api
ALLOWED_ORIGINS=https://go4itsports.org
CORS_ORIGIN=https://go4itsports.org

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/go4it_academy

# School Branding
SCHOOL_NAME="Go4it Sports Academy"
SCHOOL_DOMAIN=go4itsports.org
```

### 3. Database Setup
```bash
# Create database
createdb go4it_academy

# Initialize schema
npm run db:push
```

### 4. Build and Deploy
```bash
# Build for production
npm run build

# Start server
npm start
```

### 5. Integration Options

#### Option A: Replace Existing Site
- Deploy directly to go4itsports.org
- Integrate existing content into new platform
- Update DNS to point to new server

#### Option B: Subdomain Integration
- Deploy to academy.go4itsports.org
- Keep existing site at main domain
- Cross-link between sites

#### Option C: Path Integration
- Deploy at go4itsports.org/academy
- Configure reverse proxy for path routing
- Maintain existing site structure

### 6. Required API Keys

#### Anthropic AI
```bash
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
```
Get from: https://console.anthropic.com/

#### Stripe Payments
```bash
STRIPE_PUBLISHABLE_KEY=pk_live_your_key
STRIPE_SECRET_KEY=sk_live_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook
```
Get from: https://dashboard.stripe.com/

### 7. Nginx Configuration
```nginx
server {
    listen 443 ssl;
    server_name go4itsports.org;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 8. PM2 Process Management
```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start npm --name "go4it-academy" -- start

# Save configuration
pm2 save
pm2 startup
```

### 9. Customization for go4itsports.org

#### Update Branding
1. Replace logo: `public/logo.png`
2. Update favicon: `public/favicon.ico`
3. Modify theme colors in `tailwind.config.js`
4. Edit landing page content

#### Add Nonprofit Information
1. Update contact information
2. Add 501(c)(3) status
3. Include mission statement
4. Add board of directors

### 10. Launch Checklist
- [ ] Database accessible
- [ ] API keys configured
- [ ] SSL certificate installed
- [ ] Domain DNS configured
- [ ] Payment processing tested
- [ ] AI teachers responding
- [ ] Mobile responsive
- [ ] Backup system ready

### 11. Student Management

#### Sample Student Data
The system includes sample students:
- Tyler Johnson (Grade 10) - Football
- Maya Rodriguez (Grade 11) - Basketball
- Jordan Smith (Grade 12) - Track & Field

#### Add Real Students
```bash
# Access admin dashboard
https://go4itsports.org/admin

# Or use API
POST /api/students
{
  "name": "Student Name",
  "grade": 10,
  "sport": "Football",
  "email": "student@example.com"
}
```

### 12. Parent Portal Setup

#### Parent Dashboard Features
- Real-time progress tracking
- Communication with AI teachers
- Payment management
- Academic reports
- Schedule management

#### Parent Registration
```bash
# Parents register at:
https://go4itsports.org/parent-dashboard

# Or invite via admin:
POST /api/parents/invite
{
  "email": "parent@example.com",
  "student_id": "student-uuid"
}
```

### 13. Content Management

#### Add Sports Programs
Edit `lib/sports-programs.ts`:
```typescript
export const sportsPrograms = [
  {
    name: "Football",
    season: "Fall",
    grades: [9, 10, 11, 12],
    coach: "Coach Name"
  },
  // Add more programs
]
```

#### Update Course Content
AI teachers automatically generate content, but you can customize:
- Subject focus areas
- Sports-specific examples
- Local team references
- Community partnerships

### 14. Analytics and Reporting

#### Built-in Analytics
- Student progress tracking
- Parent engagement metrics
- AI teacher usage
- Payment analytics

#### Custom Reports
```bash
# Generate custom reports
GET /api/reports/student-progress
GET /api/reports/financial-summary
GET /api/reports/engagement-metrics
```

### 15. Backup and Maintenance

#### Database Backup
```bash
# Daily backup script
pg_dump go4it_academy > backup_$(date +%Y%m%d).sql
```

#### System Updates
```bash
# Update dependencies
npm update

# Push database changes
npm run db:push

# Restart application
pm2 restart go4it-academy
```

### 16. Support and Resources

#### Documentation
- API documentation: `/api/docs`
- Component library: `components/`
- Database schema: `shared/schema.ts`

#### Troubleshooting
- Check logs: `pm2 logs go4it-academy`
- Monitor health: `curl https://go4itsports.org/api/health`
- Database status: `pg_isready`

### 17. Security Considerations

#### Security Checklist
- [ ] All default passwords changed
- [ ] SSL certificate valid
- [ ] Firewall configured
- [ ] Database access restricted
- [ ] API keys secured
- [ ] CORS properly configured
- [ ] Regular security updates

#### Data Protection
- FERPA-compliant student data handling
- Encrypted data transmission
- Secure payment processing
- Regular security audits

### 18. Performance Optimization

#### Caching Strategy
- Database query caching
- API response caching
- Static asset caching
- CDN integration

#### Monitoring
- Application performance monitoring
- Database query optimization
- Error tracking and alerting
- Uptime monitoring

---

**Deployment Time**: 2-4 hours
**Technical Skills Required**: Basic server administration, database management
**Ongoing Maintenance**: 2-5 hours/week

This integration transforms go4itsports.org into a comprehensive educational platform while maintaining your nonprofit's mission and athletic focus.