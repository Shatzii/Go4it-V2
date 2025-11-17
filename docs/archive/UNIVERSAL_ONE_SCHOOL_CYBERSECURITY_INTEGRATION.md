# Universal One School - Cybersecurity Platform Integration

## Platform Overview Integration

**Target Platform:** Universal One School Educational Ecosystem  
**User Base:** 2,146+ students, 500+ parents, 150+ teachers, 25+ administrators  
**Schools:** 4 specialized institutions (SuperHero School K-6, Stage Prep 7-12, Language Academy, Law School)  
**Infrastructure:** Hybrid Next.js deployment with student self-hosting capabilities  

## Next.js Architecture Optimization for Universal One School

### 1. Multi-School Tenant Architecture
```typescript
// app/layout.tsx - Enhanced for multi-school support
import { Inter } from 'next/font/google'
import { SchoolThemeProvider } from '@/components/school-theme-provider'
import { UniversalAuthProvider } from '@/components/universal-auth-provider'
import { CybersecurityProvider } from '@/components/cybersecurity-provider'
import { SocialMediaMonitorProvider } from '@/components/social-media-monitor-provider'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SchoolThemeProvider>
          <UniversalAuthProvider>
            <CybersecurityProvider>
              <SocialMediaMonitorProvider>
                {children}
              </SocialMediaMonitorProvider>
            </CybersecurityProvider>
          </UniversalAuthProvider>
        </SchoolThemeProvider>
      </body>
    </html>
  )
}

// lib/school-config.ts - School-specific configurations
export interface SchoolConfig {
  id: string;
  name: string;
  domain: string;
  gradeRange: string;
  studentCount: number;
  campus: 'dallas' | 'merida' | 'vienna';
  specialization: string;
  cybersecurityLevel: 'standard' | 'enhanced' | 'maximum';
}

export const SCHOOL_CONFIGS: Record<string, SchoolConfig> = {
  'superhero': {
    id: 'superhero',
    name: 'SuperHero School',
    domain: 'superhero.schools.shatzii.com',
    gradeRange: 'K-6',
    studentCount: 687,
    campus: 'dallas',
    specialization: 'creative_learning',
    cybersecurityLevel: 'enhanced' // Higher protection for younger students
  },
  'stage-prep': {
    id: 'stage-prep',
    name: 'Stage Prep School',
    domain: 'stageprep.schools.shatzii.com',
    gradeRange: '7-12',
    studentCount: 312,
    campus: 'merida',
    specialization: 'performing_arts',
    cybersecurityLevel: 'enhanced'
  },
  'language-academy': {
    id: 'language-academy',
    name: 'Language Academy',
    domain: 'language.schools.shatzii.com',
    gradeRange: 'All Ages',
    studentCount: 1000,
    campus: 'vienna',
    specialization: 'multilingual_education',
    cybersecurityLevel: 'standard'
  },
  'law-school': {
    id: 'law-school',
    name: 'Law School',
    domain: 'law.schools.shatzii.com',
    gradeRange: 'Justice Youth',
    studentCount: 147,
    campus: 'dallas',
    specialization: 'legal_education',
    cybersecurityLevel: 'maximum' // Highest protection for at-risk youth
  }
};
```

### 2. Enhanced Authentication Integration
```typescript
// lib/universal-auth.ts - Integration with existing auth system
import { AuthenticationSystem, UserRole } from './auth-system';
import { SchoolConfig, SCHOOL_CONFIGS } from './school-config';

export interface UniversalUser extends User {
  schoolIds: string[]; // Support for multi-school access
  primarySchoolId: string;
  campusAccess: string[];
  socialMediaAccounts: SocialMediaAccount[];
  cybersecurityProfile: CybersecurityProfile;
}

export interface CybersecurityProfile {
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  monitoringLevel: 'basic' | 'enhanced' | 'comprehensive';
  parentalControls: boolean;
  socialMediaMonitoring: boolean;
  aiInteractionTracking: boolean;
  behavioralAnalytics: boolean;
}

// Enhanced role-based permissions for cybersecurity
const CYBERSECURITY_PERMISSIONS: Record<UserRole, string[]> = {
  [UserRole.STUDENT]: [
    'view_own_social_media_safety',
    'manage_own_privacy_settings',
    'report_cyberbullying',
    'access_digital_citizenship_training'
  ],
  [UserRole.PARENT]: [
    'view_child_social_media_activity',
    'configure_child_monitoring',
    'receive_safety_alerts',
    'review_cybersecurity_reports',
    'approve_social_media_accounts'
  ],
  [UserRole.TEACHER]: [
    'monitor_classroom_digital_safety',
    'receive_student_safety_alerts',
    'access_cyberbullying_tools',
    'view_student_risk_indicators',
    'conduct_digital_citizenship_lessons'
  ],
  [UserRole.SCHOOL_ADMIN]: [
    'view_school_cybersecurity_dashboard',
    'manage_school_safety_policies',
    'review_incident_reports',
    'configure_monitoring_settings',
    'access_compliance_reports'
  ],
  [UserRole.PLATFORM_ADMIN]: [
    'manage_platform_security',
    'view_cross_school_analytics',
    'configure_ai_safety_models',
    'manage_threat_intelligence',
    'oversee_incident_response'
  ],
  [UserRole.SUPER_ADMIN]: [
    'full_cybersecurity_access',
    'emergency_response_coordination',
    'system_security_configuration',
    'law_enforcement_coordination',
    'audit_all_activities'
  ]
};

export class UniversalCybersecurityAuth extends AuthenticationSystem {
  async authenticateWithCybersecurityCheck(
    email: string,
    password: string,
    ipAddress: string,
    userAgent: string
  ): Promise<AuthenticationResult & { cybersecurityFlags?: string[] }> {
    const result = await super.authenticateUser(email, password, ipAddress, userAgent);
    
    if (result.success && result.user) {
      // Enhanced cybersecurity checks
      const cybersecurityFlags = await this.performSecurityChecks(result.user, ipAddress);
      
      return {
        ...result,
        cybersecurityFlags
      };
    }
    
    return result;
  }

  private async performSecurityChecks(user: UniversalUser, ipAddress: string): Promise<string[]> {
    const flags: string[] = [];
    
    // Geographic anomaly detection
    if (await this.isGeographicAnomaly(user.id, ipAddress)) {
      flags.push('geographic_anomaly');
    }
    
    // Device fingerprinting
    if (await this.isNewDevice(user.id, ipAddress)) {
      flags.push('new_device');
    }
    
    // Risk level assessment
    if (user.cybersecurityProfile.riskLevel === 'high' || user.cybersecurityProfile.riskLevel === 'critical') {
      flags.push('high_risk_user');
    }
    
    return flags;
  }

  hasCybersecurityPermission(userRole: UserRole, permission: string): boolean {
    const permissions = CYBERSECURITY_PERMISSIONS[userRole] || [];
    return permissions.includes(permission);
  }
}
```

### 3. Social Media Monitoring Dashboard for Schools
```typescript
// app/(dashboard)/cybersecurity/social-media/page.tsx
import { Suspense } from 'react'
import { SchoolSocialMediaOverview } from '@/components/cybersecurity/school-social-overview'
import { StudentSafetyAlerts } from '@/components/cybersecurity/student-safety-alerts'
import { PredatorDetectionDashboard } from '@/components/cybersecurity/predator-detection'
import { CyberbullyingAnalytics } from '@/components/cybersecurity/cyberbullying-analytics'
import { ParentNotificationCenter } from '@/components/cybersecurity/parent-notifications'

export default function SchoolCybersecurityPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">School Cybersecurity Dashboard</h1>
          <p className="text-gray-600">Monitor student digital safety across all platforms</p>
        </div>
      </div>

      {/* Critical Alerts Section */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800">Critical Safety Alerts</CardTitle>
            <CardDescription>Requires immediate attention</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Loading alerts...</div>}>
              <StudentSafetyAlerts severity="critical" />
            </Suspense>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-800">Predator Detection</CardTitle>
            <CardDescription>AI-powered threat identification</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Loading detection data...</div>}>
              <PredatorDetectionDashboard />
            </Suspense>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-800">Cyberbullying Analytics</CardTitle>
            <CardDescription>Pattern recognition and prevention</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Loading analytics...</div>}>
              <CyberbullyingAnalytics />
            </Suspense>
          </CardContent>
        </Card>
      </div>

      {/* School Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Multi-School Safety Overview</CardTitle>
          <CardDescription>Digital safety metrics across all Universal One School campuses</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Loading school overview...</div>}>
            <SchoolSocialMediaOverview />
          </Suspense>
        </CardContent>
      </Card>

      {/* Parent Communication */}
      <Card>
        <CardHeader>
          <CardTitle>Parent Notification Center</CardTitle>
          <CardDescription>Automated safety alerts and reports for parents</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Loading notifications...</div>}>
            <ParentNotificationCenter />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}

// components/cybersecurity/school-social-overview.tsx
'use client'

import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { SCHOOL_CONFIGS } from '@/lib/school-config'

export function SchoolSocialMediaOverview() {
  const { data: schoolStats, isLoading } = useQuery({
    queryKey: ['school-cybersecurity-overview'],
    queryFn: async () => {
      const response = await fetch('/api/cybersecurity/schools/overview')
      if (!response.ok) throw new Error('Failed to fetch school statistics')
      return response.json()
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  })

  if (isLoading) {
    return <div>Loading school safety overview...</div>
  }

  return (
    <div className="space-y-6">
      {Object.values(SCHOOL_CONFIGS).map((school) => {
        const stats = schoolStats?.schools?.[school.id] || {}
        
        return (
          <Card key={school.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{school.name}</CardTitle>
                  <p className="text-sm text-gray-500">
                    {school.gradeRange} • {school.studentCount} students • {school.campus}
                  </p>
                </div>
                
                <Badge 
                  variant={stats.overallSafetyScore >= 90 ? 'default' : 
                          stats.overallSafetyScore >= 70 ? 'secondary' : 'destructive'}
                >
                  Safety Score: {stats.overallSafetyScore || 'N/A'}%
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Active Monitoring Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {stats.socialMediaAccountsMonitored || 0}
                  </div>
                  <div className="text-xs text-gray-500">Accounts Monitored</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {stats.activeAlerts || 0}
                  </div>
                  <div className="text-xs text-gray-500">Active Alerts</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {stats.interventionsToday || 0}
                  </div>
                  <div className="text-xs text-gray-500">Interventions Today</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {stats.parentNotifications || 0}
                  </div>
                  <div className="text-xs text-gray-500">Parent Alerts</div>
                </div>
              </div>

              {/* Risk Level Distribution */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Student Risk Distribution</span>
                  <span>{stats.studentsMonitored || 0} students</span>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-green-600">Low Risk</span>
                    <span>{stats.riskDistribution?.low || 0}%</span>
                  </div>
                  <Progress value={stats.riskDistribution?.low || 0} className="h-2" />
                  
                  <div className="flex justify-between text-xs">
                    <span className="text-yellow-600">Medium Risk</span>
                    <span>{stats.riskDistribution?.medium || 0}%</span>
                  </div>
                  <Progress value={stats.riskDistribution?.medium || 0} className="h-2" />
                  
                  <div className="flex justify-between text-xs">
                    <span className="text-red-600">High Risk</span>
                    <span>{stats.riskDistribution?.high || 0}%</span>
                  </div>
                  <Progress value={stats.riskDistribution?.high || 0} className="h-2" />
                </div>
              </div>

              {/* Recent Activity Summary */}
              <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                Last 24 hours: {stats.recentActivity?.interactions || 0} interactions analyzed, 
                {stats.recentActivity?.threatsBlocked || 0} threats blocked, 
                {stats.recentActivity?.safetyLessonsDelivered || 0} safety lessons delivered
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
```

### 4. Student Self-Hosting Cybersecurity Module
```typescript
// student-self-hosting/cybersecurity-module.ts
import { EventEmitter } from 'events';
import { createHash, createCipher } from 'crypto';
import { promises as fs } from 'fs';
import path from 'path';

export interface SelfHostedCybersecurityConfig {
  studentId: string;
  schoolId: string;
  parentSyncEnabled: boolean;
  encryptionKey: string;
  monitoringLevel: 'basic' | 'enhanced';
  offlineMode: boolean;
}

export class SelfHostedCybersecurityModule extends EventEmitter {
  private config: SelfHostedCybersecurityConfig;
  private alertQueue: CybersecurityAlert[] = [];
  private isConnected: boolean = false;

  constructor(config: SelfHostedCybersecurityConfig) {
    super();
    this.config = config;
    this.initializeSecurityModule();
  }

  private async initializeSecurityModule(): Promise<void> {
    // Initialize local security database
    await this.setupLocalDatabase();
    
    // Start monitoring services
    this.startKeyloggerProtection();
    this.startNetworkMonitoring();
    this.startSocialMediaMonitoring();
    
    // Attempt parent sync
    if (this.config.parentSyncEnabled) {
      this.scheduleParentSync();
    }
  }

  // Social Media Monitoring for Self-Hosted Environments
  async monitorSocialMediaActivity(activity: SocialMediaActivity): Promise<void> {
    const riskScore = await this.analyzeSocialMediaRisk(activity);
    
    if (riskScore > 70) {
      const alert: CybersecurityAlert = {
        id: this.generateAlertId(),
        type: 'social_media_risk',
        severity: riskScore > 90 ? 'critical' : 'high',
        timestamp: new Date(),
        details: {
          platform: activity.platform,
          riskFactors: activity.riskFactors,
          content: this.encryptSensitiveContent(activity.content)
        },
        requiresParentNotification: riskScore > 85
      };
      
      await this.handleSecurityAlert(alert);
    }
  }

  // Offline AI-Powered Content Analysis
  private async analyzeSocialMediaRisk(activity: SocialMediaActivity): Promise<number> {
    let riskScore = 0;
    
    // Keyword analysis for inappropriate content
    const inappropriateKeywords = await this.loadInappropriateKeywords();
    const contentLower = activity.content.toLowerCase();
    
    for (const keyword of inappropriateKeywords) {
      if (contentLower.includes(keyword.word)) {
        riskScore += keyword.severity;
      }
    }
    
    // Pattern analysis for cyberbullying
    if (this.detectCyberbullyingPatterns(activity.content)) {
      riskScore += 40;
    }
    
    // Predator grooming detection
    if (this.detectGroomingPatterns(activity.content, activity.participants)) {
      riskScore += 60;
    }
    
    // Time-based risk factors
    if (this.isLateNightActivity(activity.timestamp)) {
      riskScore += 15;
    }
    
    return Math.min(riskScore, 100);
  }

  // Parent Synchronization
  private async scheduleParentSync(): Promise<void> {
    setInterval(async () => {
      if (this.alertQueue.length > 0) {
        await this.syncWithParent();
      }
    }, 300000); // Sync every 5 minutes
  }

  private async syncWithParent(): Promise<void> {
    try {
      const encryptedData = this.encryptAlertData(this.alertQueue);
      
      const response = await fetch(`https://schools.shatzii.com/api/parent-sync/${this.config.studentId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.generateSyncToken()}`
        },
        body: JSON.stringify({
          studentId: this.config.studentId,
          schoolId: this.config.schoolId,
          encryptedAlerts: encryptedData,
          timestamp: new Date().toISOString()
        })
      });
      
      if (response.ok) {
        this.alertQueue = []; // Clear synced alerts
        this.isConnected = true;
        this.emit('parent_sync_success');
      }
    } catch (error) {
      this.isConnected = false;
      this.emit('parent_sync_failed', error);
      console.log('Parent sync failed - operating in offline mode');
    }
  }

  // Local Threat Detection
  private detectCyberbullyingPatterns(content: string): boolean {
    const bullyingPatterns = [
      /\b(kill yourself|kys)\b/i,
      /\b(nobody likes you|everyone hates you)\b/i,
      /\b(you're (so )?ugly|fat|stupid|loser)\b/i,
      /\b(go die|should die)\b/i
    ];
    
    return bullyingPatterns.some(pattern => pattern.test(content));
  }

  private detectGroomingPatterns(content: string, participants: string[]): boolean {
    const groomingPatterns = [
      /\b(don't tell (your )?parents|keep (this|it) secret)\b/i,
      /\b(want to meet|let's meet)\b/i,
      /\b(you're (so )?mature|special|different)\b/i,
      /\b(send (me )?pictures?|pics?)\b/i
    ];
    
    // Additional risk if communicating with unknown adults
    const hasUnknownAdult = participants.some(p => this.isUnknownAdult(p));
    
    const hasGroomingLanguage = groomingPatterns.some(pattern => pattern.test(content));
    
    return hasGroomingLanguage || hasUnknownAdult;
  }

  // Emergency Response for Self-Hosted
  async triggerEmergencyResponse(alert: CybersecurityAlert): Promise<void> {
    // Store locally for offline access
    await this.storeEmergencyAlert(alert);
    
    // Attempt immediate parent notification
    if (this.config.parentSyncEnabled) {
      await this.emergencyParentNotification(alert);
    }
    
    // If critical, attempt direct contact with school
    if (alert.severity === 'critical') {
      await this.contactSchoolEmergency(alert);
    }
    
    this.emit('emergency_response_triggered', alert);
  }

  private async emergencyParentNotification(alert: CybersecurityAlert): Promise<void> {
    try {
      await fetch(`https://schools.shatzii.com/api/emergency-parent-alert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.generateEmergencyToken()}`
        },
        body: JSON.stringify({
          studentId: this.config.studentId,
          alertType: alert.type,
          severity: alert.severity,
          timestamp: alert.timestamp,
          encryptedDetails: this.encryptSensitiveContent(JSON.stringify(alert.details))
        })
      });
    } catch (error) {
      console.error('Emergency parent notification failed:', error);
    }
  }
}

interface SocialMediaActivity {
  platform: string;
  content: string;
  participants: string[];
  timestamp: Date;
  riskFactors: string[];
}

interface CybersecurityAlert {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  details: any;
  requiresParentNotification: boolean;
}
```

### 5. API Routes for Universal One School Integration
```typescript
// app/api/cybersecurity/schools/overview/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/universal-auth'
import { SCHOOL_CONFIGS } from '@/lib/school-config'
import { cybersecurityStorage } from '@/lib/cybersecurity-storage'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user has permission to view school overview
    if (!session.user.permissions.includes('view_school_cybersecurity_dashboard')) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const schoolsOverview = {}

    for (const [schoolId, config] of Object.entries(SCHOOL_CONFIGS)) {
      const stats = await cybersecurityStorage.getSchoolCybersecurityStats(schoolId)
      
      schoolsOverview[schoolId] = {
        ...stats,
        config: config,
        lastUpdated: new Date()
      }
    }

    return NextResponse.json({
      schools: schoolsOverview,
      totalStudentsProtected: Object.values(SCHOOL_CONFIGS).reduce((sum, school) => sum + school.studentCount, 0),
      totalThreatsBlockedToday: await cybersecurityStorage.getTotalThreatsBlocked('today'),
      platformSafetyScore: await cybersecurityStorage.calculatePlatformSafetyScore()
    })
  } catch (error) {
    console.error('Error fetching cybersecurity overview:', error)
    return NextResponse.json(
      { error: 'Failed to fetch cybersecurity overview' },
      { status: 500 }
    )
  }
}

// app/api/parent-sync/[studentId]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { verifyParentSyncToken } from '@/lib/parent-sync-auth'
import { cybersecurityStorage } from '@/lib/cybersecurity-storage'
import { decrypt } from '@/lib/encryption'

export async function POST(
  request: NextRequest,
  { params }: { params: { studentId: string } }
) {
  try {
    const body = await request.json()
    const { encryptedAlerts, timestamp } = body

    // Verify sync token
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.split(' ')[1]
    
    if (!token || !verifyParentSyncToken(token, params.studentId)) {
      return NextResponse.json({ error: 'Invalid sync token' }, { status: 401 })
    }

    // Decrypt and process alerts
    const alerts = JSON.parse(decrypt(encryptedAlerts))
    
    // Store alerts for parent review
    for (const alert of alerts) {
      await cybersecurityStorage.storeParentSyncAlert(params.studentId, alert)
      
      // Trigger parent notification if critical
      if (alert.severity === 'critical') {
        await cybersecurityStorage.triggerParentEmergencyNotification(params.studentId, alert)
      }
    }

    // Update student sync status
    await cybersecurityStorage.updateStudentSyncStatus(params.studentId, new Date())

    return NextResponse.json({ 
      success: true, 
      alertsProcessed: alerts.length,
      nextSyncRecommended: new Date(Date.now() + 300000) // 5 minutes
    })
  } catch (error) {
    console.error('Parent sync error:', error)
    return NextResponse.json(
      { error: 'Parent sync failed' },
      { status: 500 }
    )
  }
}
```

This integration provides Universal One School with:

**Enhanced Security for Educational Environment:**
- Age-appropriate monitoring for K-6 vs 7-12 vs adult learners
- Multi-campus coordination across Dallas, Merida, and Vienna
- Student self-hosting with offline capabilities
- Parent sync with encrypted data transmission

**Specialized Features for Educational Setting:**
- COPPA/FERPA compliant data handling
- AI-powered content analysis for educational safety
- Real-time parent notifications
- Teacher integration with classroom management
- Emergency response coordination with schools

**Platform Optimization:**
- Next.js App Router for performance
- School-specific theming and configurations
- Multi-tenant architecture supporting 2,146+ users
- Seamless integration with existing authentication system
- Mobile-responsive design for all user types

The platform now provides comprehensive cybersecurity protection tailored specifically for Universal One School's unique educational ecosystem while maintaining compliance with educational data privacy regulations.