#!/usr/bin/env node
/**
 * Security Scan Script
 * 
 * Executable script to run security scans and generate reports
 */

const fs = require('fs');
const path = require('path');

// Security patterns to detect
const SECURITY_PATTERNS = [
  {
    name: 'Hardcoded API Keys',
    pattern: /(?:api[_-]?key|apikey|key)\s*[:=]\s*['"`][a-zA-Z0-9_\-+/]{10,}['"`]/gi,
    severity: 'CRITICAL',
    recommendation: 'Replace with process.env.API_KEY'
  },
  {
    name: 'Hardcoded Passwords',
    pattern: /(?:password|pwd|pass)\s*[:=]\s*['"`][^'"`\s]{6,}['"`]/gi,
    severity: 'CRITICAL', 
    recommendation: 'Replace with environment variable'
  },
  {
    name: 'Hardcoded Secrets',
    pattern: /(?:secret|token)\s*[:=]\s*['"`][a-zA-Z0-9_\-+/]{10,}['"`]/gi,
    severity: 'HIGH',
    recommendation: 'Move to secure environment variables'
  },
  {
    name: 'OpenAI Keys',
    pattern: /sk-[a-zA-Z0-9]{20,}/g,
    severity: 'CRITICAL',
    recommendation: 'Remove from code and use OPENAI_API_KEY env var'
  },
  {
    name: 'Database URLs with Credentials',
    pattern: /(?:postgresql|postgres|mysql):\/\/[^:]+:[^@]+@/gi,
    severity: 'HIGH',
    recommendation: 'Use DATABASE_URL environment variable'
  },
  {
    name: 'JWT Secrets',
    pattern: /jwt[_-]?secret\s*[:=]\s*['"`][^'"`\s]{10,}['"`]/gi,
    severity: 'CRITICAL',
    recommendation: 'Use JWT_SECRET environment variable'
  },
  {
    name: 'AWS Keys',
    pattern: /AKIA[0-9A-Z]{16}/g,
    severity: 'CRITICAL',
    recommendation: 'Remove AWS keys and use IAM roles or env vars'
  },
  {
    name: 'Private Keys',
    pattern: /-----BEGIN\s+(?:RSA\s+)?PRIVATE\s+KEY-----/g,
    severity: 'CRITICAL',
    recommendation: 'Remove private keys from code'
  }
];

// Files to exclude from scanning
const EXCLUDE_PATTERNS = [
  'node_modules',
  '.git',
  'build',
  'dist',
  '.next',
  'coverage',
  '.env.example'
];

/**
 * Main security scan function
 */
async function runSecurityScan() {
  console.log('🔒 Starting Security Scan for Sports Platform...\n');
  
  const results = {
    scannedFiles: 0,
    totalIssues: 0,
    criticalIssues: 0,
    highIssues: 0,
    issues: []
  };
  
  const startDir = process.cwd();
  await scanDirectory(startDir, results);
  
  // Generate report
  generateReport(results);
}

/**
 * Recursively scan directory for security issues
 */
async function scanDirectory(dir, results) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.relative(process.cwd(), fullPath);
    
    // Skip excluded directories
    if (EXCLUDE_PATTERNS.some(pattern => relativePath.includes(pattern))) {
      continue;
    }
    
    if (entry.isDirectory()) {
      await scanDirectory(fullPath, results);
    } else if (shouldScanFile(entry.name)) {
      await scanFile(fullPath, relativePath, results);
    }
  }
}

/**
 * Check if file should be scanned
 */
function shouldScanFile(filename) {
  const extensions = ['.js', '.ts', '.jsx', '.tsx', '.json', '.env', '.yaml', '.yml'];
  return extensions.some(ext => filename.endsWith(ext));
}

/**
 * Scan individual file for security issues
 */
async function scanFile(filePath, relativePath, results) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    results.scannedFiles++;
    
    lines.forEach((line, lineNumber) => {
      SECURITY_PATTERNS.forEach(pattern => {
        const matches = line.match(pattern.pattern);
        if (matches) {
          // Skip if it's an environment variable reference
          if (line.includes('process.env.') || line.includes('getEnvVar(')) {
            return;
          }
          
          // Skip comments that are just examples
          if (line.trim().startsWith('//') || line.trim().startsWith('*')) {
            return;
          }
          
          const issue = {
            file: relativePath,
            line: lineNumber + 1,
            pattern: pattern.name,
            severity: pattern.severity,
            match: matches[0],
            recommendation: pattern.recommendation
          };
          
          results.issues.push(issue);
          results.totalIssues++;
          
          if (pattern.severity === 'CRITICAL') {
            results.criticalIssues++;
          } else if (pattern.severity === 'HIGH') {
            results.highIssues++;
          }
        }
      });
    });
    
  } catch (error) {
    // Skip files that can't be read
  }
}

/**
 * Generate and display security report
 */
function generateReport(results) {
  console.log('📊 SECURITY SCAN RESULTS');
  console.log('═'.repeat(60));
  console.log(`Files Scanned: ${results.scannedFiles}`);
  console.log(`Total Issues: ${results.totalIssues}`);
  console.log(`Critical Issues: ${results.criticalIssues}`);
  console.log(`High Priority Issues: ${results.highIssues}`);
  console.log('');
  
  if (results.totalIssues === 0) {
    console.log('✅ No security issues detected!');
    return;
  }
  
  // Group issues by severity
  const criticalIssues = results.issues.filter(i => i.severity === 'CRITICAL');
  const highIssues = results.issues.filter(i => i.severity === 'HIGH');
  
  if (criticalIssues.length > 0) {
    console.log('🚨 CRITICAL ISSUES (Immediate Action Required):');
    console.log('─'.repeat(60));
    criticalIssues.forEach(issue => {
      console.log(`❌ ${issue.file}:${issue.line}`);
      console.log(`   Issue: ${issue.pattern}`);
      console.log(`   Found: ${issue.match.substring(0, 50)}${issue.match.length > 50 ? '...' : ''}`);
      console.log(`   Fix: ${issue.recommendation}`);
      console.log('');
    });
  }
  
  if (highIssues.length > 0) {
    console.log('⚠️  HIGH PRIORITY ISSUES:');
    console.log('─'.repeat(60));
    highIssues.forEach(issue => {
      console.log(`⚠️  ${issue.file}:${issue.line}`);
      console.log(`   Issue: ${issue.pattern}`);
      console.log(`   Fix: ${issue.recommendation}`);
      console.log('');
    });
  }
  
  // Save detailed report
  const reportPath = path.join(process.cwd(), 'security-scan-report.json');
  fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    summary: {
      scannedFiles: results.scannedFiles,
      totalIssues: results.totalIssues,
      criticalIssues: results.criticalIssues,
      highIssues: results.highIssues
    },
    issues: results.issues
  }, null, 2));
  
  console.log(`📄 Detailed report saved to: ${reportPath}`);
  
  // Exit with error if critical issues found
  if (results.criticalIssues > 0) {
    console.log('\n❌ SCAN FAILED: Critical security issues must be resolved before deployment');
    process.exit(1);
  } else if (results.highIssues > 0) {
    console.log('\n⚠️  SCAN WARNING: High priority issues should be resolved');
    process.exit(0);
  } else {
    console.log('\n✅ SCAN PASSED: No critical security issues detected');
    process.exit(0);
  }
}

// Run the scan
runSecurityScan().catch(error => {
  console.error('❌ Security scan failed:', error);
  process.exit(1);
});