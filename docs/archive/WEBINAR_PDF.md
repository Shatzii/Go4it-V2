Generate webinar.pdf
===================

Run `npm run generate:webinar-pdf` from the repository root to produce `webinar.pdf`.

This script deliberately avoids installing Puppeteer in the container. Instead it prefers system PDF tools:

- `wkhtmltopdf` — recommended when available.
- Headless Chrome/Chromium using `--headless --print-to-pdf`.

If neither is available on your machine, install one of them and re-run the command. Example commands:

```bash
# wkhtmltopdf (Linux/macOS)
wkhtmltopdf Webinar.html webinar.pdf

# Headless Chrome/Chromium (if chrome is on your PATH)
chrome --headless --disable-gpu --print-to-pdf=webinar.pdf file://$PWD/Webinar.html
```

If you prefer Puppeteer and want me to add it, say so — but note Chromium download often fails in low-resource containers.
