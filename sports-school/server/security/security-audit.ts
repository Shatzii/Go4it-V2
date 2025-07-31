/**
 * Security Audit System
 * 
 * Comprehensive security scanning and vulnerability detection
 */

import * as fs from 'fs';
import * as path from 'path';
import { validateCredentialSecurity, isSecureEnvironment } from './credential-manager';

interface SecurityIssue {
  file: string;
  line?: number;
  type: 'hardcoded_credential' | 'weak_password' | 'insecure_config' | 'missing_validation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  recommendation: string;
}

interface AuditReport {
  timestamp: Date;
  totalFiles: number;
  issuesFound: number;
  criticalIssues: number;
  highIssues: number;
  mediumIssues: number;
  lowIssues: number;
  issues: SecurityIssue[];
  summary: string;
}

/**
 * Scan codebase for security vulnerabilities
 */
export async function runSecurityAudit(basePath: string = '.'): Promise<AuditReport> {
  console.log('🔍 Running comprehensive security audit...');
  
  const issues: SecurityIssue[] = [];
  const startTime = Date.now();
  
  try {
    // Scan for hardcoded credentials
    const credentialIssues = await scanForHardcodedCredentials(basePath);
    issues.push(...credentialIssues);
    
    // Scan for weak configurations
    const configIssues = await scanForWeakConfigurations(basePath);
    issues.push(...configIssues);
    
    // Scan for missing security validations
    const validationIssues = await scanForMissingValidations(basePath);
    issues.push(...validationIssues);
    
    // Check environment configuration
    const envIssues = validateCredentialSecurity();
    envIssues.forEach(issue => {
      issues.push({
        file: '.env',
        type: 'insecure_config',
        severity: issue.severity,
        description: issue.issue,
        recommendation: getRecommendationForIssue(issue.issue)
      });
    });
    
  } catch (error) {
    console.error('Security audit error:', error);
  }
  
  const duration = Date.now() - startTime;
  
  // Generate report
  const report: AuditReport = {
    timestamp: new Date(),
    totalFiles: await countFiles(basePath),
    issuesFound: issues.length,
    criticalIssues: issues.filter(i => i.severity === 'critical').length,
    highIssues: issues.filter(i => i.severity === 'high').length,
    mediumIssues: issues.filter(i => i.severity === 'medium').length,
    lowIssues: issues.filter(i => i.severity === 'low').length,
    issues,
    summary: generateSummary(issues, duration)
  };
  
  return report;
}

/**
 * Scan for hardcoded credentials in source files
 */
async function scanForHardcodedCredentials(basePath: string): Promise<SecurityIssue[]> {
  const issues: SecurityIssue[] = [];
  const extensions = ['.js', '.ts', '.jsx', '.tsx', '.json'];
  
  const suspiciousPatterns = [
    { pattern: /apiKey\s*[:=]\s*['"`][^'"`\s]{10,}['"`]/, type: 'API Key' },
    { pattern: /password\s*[:=]\s*['"`][^'"`\s]{6,}['"`]/, type: 'Password' },
    { pattern: /secret\s*[:=]\s*['"`][^'"`\s]{10,}['"`]/, type: 'Secret' },
    { pattern: /token\s*[:=]\s*['"`][^'"`\s]{10,}['"`]/, type: 'Token' },
    { pattern: /key\s*[:=]\s*['"`][a-zA-Z0-9+/]{20,}['"`]/, type: 'Encoded Key' },
    { pattern: /sk-[a-zA-Z0-9]{20,}/, type: 'OpenAI Key' },
    { pattern: /xoxb-[a-zA-Z0-9-]{10,}/, type: 'Slack Token' },
    { pattern: /AKIA[0-9A-Z]{16}/, type: 'AWS Access Key' }
  ];
  
  await scanDirectory(basePath, async (filePath) => {
    if (!extensions.some(ext => filePath.endsWith(ext))) return;
    if (filePath.includes('node_modules') || filePath.includes('.git')) return;
    
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');
      
      lines.forEach((line, index) => {
        suspiciousPatterns.forEach(({ pattern, type }) => {
          if (pattern.test(line)) {
            // Skip if it's clearly an environment variable reference
            if (line.includes('process.env.') || line.includes('getEnvVar(')) return;
            // Skip if it's in a comment explaining what to do
            if (line.trim().startsWith('//') || line.trim().startsWith('*')) return;
            
            issues.push({
              file: filePath,
              line: index + 1,
              type: 'hardcoded_credential',
              severity: 'critical',
              description: `Hardcoded ${type} detected`,
              recommendation: `Replace with environment variable: process.env.${type.toUpperCase().replace(' ', '_')}`
            });
          }
        });
      });
    } catch (error) {
      // Skip files that can't be read
    }
  });
  
  return issues;
}

/**
 * Scan for weak security configurations
 */
async function scanForWeakConfigurations(basePath: string): Promise<SecurityIssue[]> {
  const issues: SecurityIssue[] = [];
  
  const weakPatterns = [
    { pattern: /cors\(\)/, severity: 'medium' as const, desc: 'CORS allowing all origins' },
    { pattern: /trust proxy.*true/, severity: 'low' as const, desc: 'Trusting all proxies' },
    { pattern: /helmet\(\)/, severity: 'low' as const, desc: 'Default helmet configuration' },
    { pattern: /maxAge.*0/, severity: 'medium' as const, desc: 'Disabled caching' },
    { pattern: /secure.*false/, severity: 'high' as const, desc: 'Insecure cookie settings' }
  ];
  
  await scanDirectory(basePath, async (filePath) => {
    if (!filePath.endsWith('.js') && !filePath.endsWith('.ts')) return;
    if (filePath.includes('node_modules')) return;
    
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');
      
      lines.forEach((line, index) => {
        weakPatterns.forEach(({ pattern, severity, desc }) => {
          if (pattern.test(line)) {
            issues.push({
              file: filePath,
              line: index + 1,
              type: 'insecure_config',
              severity,
              description: desc,
              recommendation: 'Review and strengthen security configuration'
            });
          }
        });
      });
    } catch (error) {
      // Skip files that can't be read
    }
  });
  
  return issues;
}

/**
 * Scan for missing security validations
 */
async function scanForMissingValidations(basePath: string): Promise<SecurityIssue[]> {
  const issues: SecurityIssue[] = [];
  
  const validationPatterns = [
    { pattern: /req\.body(?!.*validation)/, desc: 'Unvalidated request body' },
    { pattern: /req\.params(?!.*validation)/, desc: 'Unvalidated URL parameters' },
    { pattern: /innerHTML\s*=/, desc: 'Potential XSS vulnerability' },
    { pattern: /eval\s*\(/, desc: 'Code injection vulnerability' },
    { pattern: /document\.write\s*\(/, desc: 'DOM manipulation without sanitization' }
  ];
  
  await scanDirectory(basePath, async (filePath) => {
    if (!filePath.endsWith('.js') && !filePath.endsWith('.ts')) return;
    if (filePath.includes('node_modules')) return;
    
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');
      
      lines.forEach((line, index) => {
        validationPatterns.forEach(({ pattern, desc }) => {
          if (pattern.test(line)) {
            issues.push({
              file: filePath,
              line: index + 1,
              type: 'missing_validation',
              severity: 'medium',
              description: desc,
              recommendation: 'Add proper input validation and sanitization'
            });
          }
        });
      });
    } catch (error) {
      // Skip files that can't be read
    }
  });
  
  return issues;
}

/**
 * Recursively scan directory
 */
async function scanDirectory(dir: string, callback: (filePath: string) => Promise<void>): Promise<void> {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      if (!entry.name.startsWith('.') && entry.name !== 'node_modules') {
        await scanDirectory(fullPath, callback);
      }
    } else {
      await callback(fullPath);
    }
  }
}

/**
 * Count total files scanned
 */
async function countFiles(basePath: string): Promise<number> {
  let count = 0;
  await scanDirectory(basePath, async () => { count++; });
  return count;
}

/**
 * Generate summary text
 */
function generateSummary(issues: SecurityIssue[], duration: number): string {
  const critical = issues.filter(i => i.severity === 'critical').length;
  const high = issues.filter(i => i.severity === 'high').length;
  
  if (critical > 0) {
    return `❌ CRITICAL: ${critical} critical security issues found that require immediate attention`;
  } else if (high > 0) {
    return `⚠️ WARNING: ${high} high-priority security issues found`;
  } else if (issues.length > 0) {
    return `ℹ️ INFO: ${issues.length} minor security improvements recommended`;
  } else {
    return `✅ PASSED: No security issues detected in ${duration}ms`;
  }
}

/**
 * Get recommendation for specific issue
 */
function getRecommendationForIssue(issue: string): string {
  if (issue.includes('JWT_SECRET')) {
    return 'Set a strong JWT_SECRET with at least 32 characters using: openssl rand -hex 32';
  } else if (issue.includes('password')) {
    return 'Use a strong password with mixed case, numbers, and symbols (minimum 12 characters)';
  } else if (issue.includes('development')) {
    return 'Replace development credentials with production-appropriate values';
  }
  
  return 'Review and update according to security best practices';
}

/**
 * Export audit report to file
 */
export async function exportAuditReport(report: AuditReport, outputPath: string = './security-audit-report.json'): Promise<void> {
  const reportData = {
    ...report,
    generatedBy: 'Sports Platform Security Audit System',
    version: '1.0.0'
  };
  
  fs.writeFileSync(outputPath, JSON.stringify(reportData, null, 2));
  console.log(`📄 Security audit report exported to: ${outputPath}`);
}