#!/usr/bin/env node
/**
 * Security Check CLI Tool
 *
 * Command-line tool for running comprehensive security audits
 */

import { runSecurityAudit, exportAuditReport } from '../security/security-audit';
import { initializeSecurityChecks } from '../security/credential-manager';
import { generateDevEnvironment } from '../startup/security-init';

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  console.log('🛡️ Sports Platform Security Tools\n');

  switch (command) {
    case 'audit':
      await runFullAudit();
      break;

    case 'check':
      await runQuickCheck();
      break;

    case 'generate-dev-env':
      generateDevEnvironment();
      break;

    case 'help':
    default:
      showHelp();
      break;
  }
}

async function runFullAudit() {
  console.log('🔍 Running comprehensive security audit...\n');

  try {
    const report = await runSecurityAudit('./');

    // Display results
    console.log('📊 AUDIT RESULTS');
    console.log('═'.repeat(50));
    console.log(`Files Scanned: ${report.totalFiles}`);
    console.log(`Issues Found: ${report.issuesFound}`);
    console.log(`Critical: ${report.criticalIssues}`);
    console.log(`High: ${report.highIssues}`);
    console.log(`Medium: ${report.mediumIssues}`);
    console.log(`Low: ${report.lowIssues}`);
    console.log('');
    console.log(report.summary);
    console.log('');

    // Show top issues
    if (report.issues.length > 0) {
      console.log('🚨 TOP SECURITY ISSUES:');
      console.log('─'.repeat(50));

      const criticalIssues = report.issues.filter((i) => i.severity === 'critical').slice(0, 5);
      const highIssues = report.issues.filter((i) => i.severity === 'high').slice(0, 3);

      [...criticalIssues, ...highIssues].forEach((issue) => {
        const icon = issue.severity === 'critical' ? '❌' : '⚠️';
        console.log(`${icon} ${issue.file}:${issue.line || '?'}`);
        console.log(`   ${issue.description}`);
        console.log(`   → ${issue.recommendation}`);
        console.log('');
      });
    }

    // Export detailed report
    await exportAuditReport(report);
    console.log('✅ Detailed report saved to security-audit-report.json');

    // Exit with error code if critical issues found
    if (report.criticalIssues > 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Audit failed:', error);
    process.exit(1);
  }
}

async function runQuickCheck() {
  console.log('⚡ Running quick security check...\n');

  try {
    initializeSecurityChecks();
    console.log('✅ Quick security check completed');
  } catch (error) {
    console.error('❌ Security check failed:', error);
    process.exit(1);
  }
}

function showHelp() {
  console.log('Available commands:');
  console.log('');
  console.log('  audit              Run comprehensive security audit');
  console.log('  check              Run quick security validation');
  console.log('  generate-dev-env   Generate development environment template');
  console.log('  help               Show this help message');
  console.log('');
  console.log('Examples:');
  console.log('  npm run security:audit');
  console.log('  npm run security:check');
  console.log('  npm run security:generate-dev-env');
}

// Run main function
main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
