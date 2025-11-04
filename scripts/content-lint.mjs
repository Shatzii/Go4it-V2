#!/usr/bin/env node
// Simple content linter to block banned claims and enforce compliance footer presence in templates
import fs from 'node:fs';
import path from 'node:path';

const banned = [/guaranteed\s*scholarship/i, /placement\s*guaranteed/i, /recruitment\s*(?:guaranteed|promised)/i];
const mustInclude = ['Verification ≠ recruitment.'];

const roots = [
  'automation/listmonk',
  'automation/sms_templates',
  'docs',
];

let violations = 0;

function scanFile(file) {
  const text = fs.readFileSync(file, 'utf8');
  for (const re of banned) {
    if (re.test(text)) {
      console.error(`BANNED claim in ${file}: ${re}`);
      violations++;
    }
  }
  if (/listmonk|email/i.test(file)) {
    for (const m of mustInclude) {
      if (!text.includes(m)) {
        console.error(`Missing compliance safety line in ${file}: ${m}`);
        violations++;
      }
    }
  }
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p);
    else if (entry.isFile() && /\.(md|mdx|html|txt|mjml)$/i.test(entry.name)) scanFile(p);
  }
}

for (const r of roots) {
  if (fs.existsSync(r)) walk(r);
}

if (violations > 0) {
  console.error(`\nContent linter failed with ${violations} violation(s).`);
  process.exit(1);
}
console.log('Content linter passed.');
