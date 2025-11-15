const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

(async () => {
  try {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    const filePath = 'file://' + path.resolve('node_modules/@clerk/shared/dist/runtime/Webinar.html');
    console.log('Loading', filePath);
    await page.goto(filePath, { waitUntil: 'networkidle0' });
    const out = path.resolve('webinar.pdf');
    await page.pdf({
      path: out,
      format: 'A4',
      printBackground: true,
      margin: { top: '12mm', bottom: '12mm', left: '10mm', right: '10mm' },
    });
    await browser.close();
    console.log('Saved PDF to', out);
  } catch (err) {
    console.error('Failed to generate PDF:', err);
    process.exit(1);
  }
})();
