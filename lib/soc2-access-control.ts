import crypto from 'crypto';

// SOC2-compliant Role-Based Access Control (RBAC) system

export enum UserRole {
  PUBLIC = 'public',           // Unauthenticated users
  STUDENT = 'student',         // Basic authenticated users
  PREMIUM_STUDENT = 'premium_student', // Paid students
  COACH = 'coach',            // Verified coaches
  ADMIN = 'admin',            // Platform administrators
  SUPER_ADMIN = 'super_admin'  // System administrators
}

export enum Permission {
  // Authentication
  AUTH_LOGIN = 'auth:login',
  AUTH_REGISTER = 'auth:register',
  AUTH_LOGOUT = 'auth:logout',
  AUTH_RESET_PASSWORD = 'auth:reset_password',

  // Profile management
  PROFILE_READ = 'profile:read',
  PROFILE_UPDATE = 'profile:update',
  PROFILE_DELETE = 'profile:delete',

  // Academy access
  ACADEMY_READ = 'academy:read',
  ACADEMY_ENROLL = 'academy:enroll',
  ACADEMY_PROGRESS_UPDATE = 'academy:progress:update',

  // AI Coach
  AI_COACH_USE = 'ai_coach:use',
  AI_COACH_PREMIUM = 'ai_coach:premium',

  // Admin functions
  ADMIN_USERS_READ = 'admin:users:read',
  ADMIN_USERS_UPDATE = 'admin:users:update',
  ADMIN_USERS_DELETE = 'admin:users:delete',
  ADMIN_CONTENT_MANAGE = 'admin:content:manage',
  ADMIN_ANALYTICS_READ = 'admin:analytics:read',
  ADMIN_SYSTEM_CONFIG = 'admin:system:config',

  // Data access
  DATA_EXPORT = 'data:export',
  DATA_BACKUP = 'data:backup',
  DATA_AUDIT_READ = 'data:audit:read',

  // Security
  SECURITY_LOGS_READ = 'security:logs:read',
  SECURITY_INCIDENT_REPORT = 'security:incident:report',
  SECURITY_CONFIG_UPDATE = 'security:config:update'
}

export interface RolePermissions {
  [UserRole.PUBLIC]: Permission[];
  [UserRole.STUDENT]: Permission[];
  [UserRole.PREMIUM_STUDENT]: Permission[];
  [UserRole.COACH]: Permission[];
  [UserRole.ADMIN]: Permission[];
  [UserRole.SUPER_ADMIN]: Permission[];
}

// SOC2-compliant permission matrix
export const ROLE_PERMISSIONS: RolePermissions = {
  [UserRole.PUBLIC]: [
    Permission.AUTH_LOGIN,
    Permission.AUTH_REGISTER,
    Permission.AUTH_RESET_PASSWORD,
    Permission.ACADEMY_READ,
  ],

  [UserRole.STUDENT]: [
    Permission.AUTH_LOGOUT,
    Permission.PROFILE_READ,
    Permission.PROFILE_UPDATE,
    Permission.ACADEMY_READ,
    Permission.ACADEMY_ENROLL,
    Permission.ACADEMY_PROGRESS_UPDATE,
    Permission.AI_COACH_USE,
  ],

  [UserRole.PREMIUM_STUDENT]: [
    Permission.AUTH_LOGOUT,
    Permission.PROFILE_READ,
    Permission.PROFILE_UPDATE,
    Permission.ACADEMY_READ,
    Permission.ACADEMY_ENROLL,
    Permission.ACADEMY_PROGRESS_UPDATE,
    Permission.AI_COACH_USE,
    Permission.AI_COACH_PREMIUM,
    Permission.DATA_EXPORT,
  ],

  [UserRole.COACH]: [
    Permission.AUTH_LOGOUT,
    Permission.PROFILE_READ,
    Permission.PROFILE_UPDATE,
    Permission.ACADEMY_READ,
    Permission.ACADEMY_ENROLL,
    Permission.ACADEMY_PROGRESS_UPDATE,
    Permission.AI_COACH_USE,
    Permission.AI_COACH_PREMIUM,
    Permission.ADMIN_USERS_READ,
    Permission.ADMIN_ANALYTICS_READ,
  ],

  [UserRole.ADMIN]: [
    Permission.AUTH_LOGOUT,
    Permission.PROFILE_READ,
    Permission.PROFILE_UPDATE,
    Permission.ACADEMY_READ,
    Permission.ACADEMY_ENROLL,
    Permission.ACADEMY_PROGRESS_UPDATE,
    Permission.AI_COACH_USE,
    Permission.AI_COACH_PREMIUM,
    Permission.ADMIN_USERS_READ,
    Permission.ADMIN_USERS_UPDATE,
    Permission.ADMIN_CONTENT_MANAGE,
    Permission.ADMIN_ANALYTICS_READ,
    Permission.DATA_EXPORT,
    Permission.SECURITY_LOGS_READ,
  ],

  [UserRole.SUPER_ADMIN]: [
    // All permissions
    ...Object.values(Permission),
  ],
};

export class SOC2AccessControl {
  /**
   * Check if user has specific permission
   */
  static hasPermission(userRole: UserRole, permission: Permission): boolean {
    const rolePermissions = ROLE_PERMISSIONS[userRole];
    return rolePermissions.includes(permission);
  }

  /**
   * Check if user has any of the specified permissions
   */
  static hasAnyPermission(userRole: UserRole, permissions: Permission[]): boolean {
    return permissions.some(permission => this.hasPermission(userRole, permission));
  }

  /**
   * Check if user has all of the specified permissions
   */
  static hasAllPermissions(userRole: UserRole, permissions: Permission[]): boolean {
    return permissions.every(permission => this.hasPermission(userRole, permission));
  }

  /**
   * Get all permissions for a role
   */
  static getRolePermissions(userRole: UserRole): Permission[] {
    return [...ROLE_PERMISSIONS[userRole]];
  }

  /**
   * Check if role can access resource with action
   */
  static canAccess(userRole: UserRole, resource: string, action: string): boolean {
    const permission = `${resource}:${action}` as Permission;
    return this.hasPermission(userRole, permission);
  }

  /**
   * Validate role hierarchy (higher roles include lower role permissions)
   */
  static validateRoleHierarchy(): boolean {
    const roleOrder = [
      UserRole.PUBLIC,
      UserRole.STUDENT,
      UserRole.PREMIUM_STUDENT,
      UserRole.COACH,
      UserRole.ADMIN,
      UserRole.SUPER_ADMIN
    ];

    for (let i = 0; i < roleOrder.length - 1; i++) {
      const currentRole = roleOrder[i];
      const nextRole = roleOrder[i + 1];

      const currentPermissions = ROLE_PERMISSIONS[currentRole];
      const nextPermissions = ROLE_PERMISSIONS[nextRole];

      // Higher roles should include all lower role permissions
      const hasAllLowerPermissions = currentPermissions.every(perm =>
        nextPermissions.includes(perm)
      );

      if (!hasAllLowerPermissions) {
        console.error(`Role hierarchy violation: ${nextRole} missing permissions from ${currentRole}`);
        return false;
      }
    }

    return true;
  }

  /**
   * Get role level for comparison
   */
  static getRoleLevel(userRole: UserRole): number {
    const levels = {
      [UserRole.PUBLIC]: 0,
      [UserRole.STUDENT]: 1,
      [UserRole.PREMIUM_STUDENT]: 2,
      [UserRole.COACH]: 3,
      [UserRole.ADMIN]: 4,
      [UserRole.SUPER_ADMIN]: 5,
    };
    return levels[userRole];
  }

  /**
   * Check if user role meets minimum required role
   */
  static meetsMinimumRole(userRole: UserRole, minimumRole: UserRole): boolean {
    return this.getRoleLevel(userRole) >= this.getRoleLevel(minimumRole);
  }
}

// SOC2 Session Management
export class SOC2SessionManager {
  private static readonly SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours
  private static readonly ABSOLUTE_TIMEOUT = 7 * 24 * 60 * 60 * 1000; // 7 days

  /**
   * Validate session security
   */
  static validateSession(session: any): { valid: boolean; reason?: string } {
    if (!session) {
      return { valid: false, reason: 'No session' };
    }

    if (!session.userId) {
      return { valid: false, reason: 'No user ID in session' };
    }

    if (!session.createdAt) {
      return { valid: false, reason: 'No session creation time' };
    }

    const now = Date.now();
    const sessionAge = now - new Date(session.createdAt).getTime();

    if (sessionAge > this.ABSOLUTE_TIMEOUT) {
      return { valid: false, reason: 'Session expired (absolute timeout)' };
    }

    if (session.lastActivity) {
      const inactiveTime = now - new Date(session.lastActivity).getTime();
      if (inactiveTime > this.SESSION_TIMEOUT) {
        return { valid: false, reason: 'Session expired (inactive timeout)' };
      }
    }

    // Check for suspicious activity
    if (session.ipAddress && session.lastIpAddress && session.ipAddress !== session.lastIpAddress) {
      // Log potential session hijacking attempt
      console.warn(`IP address change detected for user ${session.userId}: ${session.lastIpAddress} -> ${session.ipAddress}`);
    }

    return { valid: true };
  }

  /**
   * Create secure session
   */
  static createSession(userId: string, ipAddress: string, userAgent: string): any {
    return {
      userId,
      sessionId: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      ipAddress,
      userAgent,
      isActive: true,
    };
  }

  /**
   * Update session activity
   */
  static updateActivity(session: any, ipAddress?: string): any {
    return {
      ...session,
      lastActivity: new Date().toISOString(),
      lastIpAddress: session.ipAddress,
      ipAddress: ipAddress || session.ipAddress,
    };
  }
}

// SOC2 Audit Trail
export class SOC2AuditTrail {
  /**
   * Log access control decision
   */
  static logAccessDecision(
    userId: string | null,
    resource: string,
    action: string,
    allowed: boolean,
    ipAddress: string,
    userAgent?: string
  ): void {
    const event = {
      eventType: 'ACCESS_CONTROL',
      userId,
      resource,
      action,
      allowed,
      ipAddress,
      userAgent,
      timestamp: new Date().toISOString(),
    };

    // In production, this would be sent to a SIEM system
    console.log('ACCESS_CONTROL:', JSON.stringify(event));
  }

  /**
   * Log privilege escalation attempt
   */
  static logPrivilegeEscalation(
    userId: string,
    attemptedRole: UserRole,
    currentRole: UserRole,
    ipAddress: string
  ): void {
    const event = {
      eventType: 'PRIVILEGE_ESCALATION_ATTEMPT',
      userId,
      attemptedRole,
      currentRole,
      ipAddress,
      timestamp: new Date().toISOString(),
      severity: 'HIGH',
    };

    console.error('PRIVILEGE_ESCALATION:', JSON.stringify(event));
  }

  /**
   * Log security configuration change
   */
  static logSecurityConfigChange(
    userId: string,
    configKey: string,
    oldValue: any,
    newValue: any,
    ipAddress: string
  ): void {
    const event = {
      eventType: 'SECURITY_CONFIG_CHANGE',
      userId,
      configKey,
      oldValue,
      newValue,
      ipAddress,
      timestamp: new Date().toISOString(),
    };

    console.log('SECURITY_CONFIG_CHANGE:', JSON.stringify(event));
  }
}