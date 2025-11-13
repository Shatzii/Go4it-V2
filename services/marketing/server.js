const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());

// Simple health check
app.get('/health', (req, res) => res.json({ ok: true }));

// Screenshot endpoint (uses puppeteer) - installs and runs in marketing service only
app.post('/screenshot', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'url required' });

    // lazy import puppeteer so server can boot even without it installed at root
    const puppeteer = require('puppeteer');
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });
    const buffer = await page.screenshot({ fullPage: true });
    await browser.close();

    res.set('Content-Type', 'image/png');
    res.send(buffer);
  } catch (err) {
    console.error('screenshot error', err);
    res.status(500).json({ error: String(err) });
  }
});

// Chart generation placeholder (could use canvas/chart.js here)
app.post('/chart', async (req, res) => {
  try {
    // A simple placeholder response: implement server-side chart generation here
    res.json({ ok: true, message: 'chart generation not implemented in scaffold' });
  } catch (err) {
    console.error('chart error', err);
    res.status(500).json({ error: String(err) });
  }
});

const port = process.env.PORT || 4300;
app.listen(port, () => console.log(`Marketing service listening on ${port}`));
