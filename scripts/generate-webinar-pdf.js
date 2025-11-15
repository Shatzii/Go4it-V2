#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const candidates = [
  path.resolve(process.cwd(), 'Webinar.html'),
  path.resolve(process.cwd(), 'node_modules/@clerk/shared/dist/runtime/Webinar.html')
];
const src = candidates.find(p => fs.existsSync(p));
const out = path.resolve(process.cwd(), 'webinar.pdf');

function tryWkhtmltopdf() {
  try {
    const res = spawnSync('wkhtmltopdf', [src, out], { stdio: 'inherit' });
    if (res.status === 0) {
      console.log('Saved PDF to', out);
      return true;
    }
    console.error('wkhtmltopdf returned non-zero status', res.status);
    return false;
  } catch (err) {
    console.error('wkhtmltopdf execution failed:', err && err.message ? err.message : err);
    return false;
  }
}

function tryChromeHeadless() {
  // Try known chrome/chromium binary names
  const bins = ['google-chrome', 'chrome', 'chromium', 'chromium-browser'];
  for (const bin of bins) {
    try {
      const res = spawnSync(bin, [`--headless`, `--disable-gpu`, `--no-sandbox`, `--print-to-pdf=${out}`, `file://${src}`], { stdio: 'inherit' });
      if (res.status === 0) {
        console.log('Saved PDF to', out, 'via', bin);
        return true;
      }
    } catch (err) {
      // ignore and try next
    }
  }
  return false;
}

(function main() {
  if (!src) {
    console.error('Could not find Webinar.html. Looked for:');
    candidates.forEach(c => console.error(' -', c));
    process.exit(1);
  }

  console.log('Source HTML:', src);

  console.log('Trying wkhtmltopdf...');
  if (tryWkhtmltopdf()) process.exit(0);

  console.log('wkhtmltopdf not available or failed — trying headless Chrome/Chromium...');
  if (tryChromeHeadless()) process.exit(0);

  console.error('\nNo suitable system PDF generator succeeded. Options:');
  console.error('  - Install wkhtmltopdf on your system and run: wkhtmltopdf Webinar.html webinar.pdf');
  console.error('  - Install a Chrome/Chromium that supports --headless --print-to-pdf and run:');
  console.error('      chrome --headless --print-to-pdf=webinar.pdf file:///<path>/Webinar.html');
  console.error('\nThis script intentionally avoids installing Puppeteer in this environment. Run the command locally on a machine with wkhtmltopdf or Chrome installed.');
  process.exit(2);
})();
// Puppeteer removed: script now prefers system-installed wkhtmltopdf or headless Chrome/Chromium.
