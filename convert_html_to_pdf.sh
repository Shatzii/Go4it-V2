#!/usr/bin/env bash
set -euo pipefail

# Convert provided HTML flyers to PDF using wkhtmltopdf
# Usage: ./convert_html_to_pdf.sh

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
OUT_DIR="$ROOT_DIR/pdfs"
mkdir -p "$OUT_DIR"

FILES=(
  "spring2026flyer.html"
  "Starpathflyer.html"
  "weeklyOS.html"
  "viennaresidency.html"
  "DallasResidency.html"
)

if ! command -v wkhtmltopdf >/dev/null 2>&1; then
  echo "Error: wkhtmltopdf not found in PATH. Install it and re-run this script."
  exit 1
fi

for f in "${FILES[@]}"; do
  SRC="$ROOT_DIR/$f"
  if [ ! -f "$SRC" ]; then
    echo "Warning: source file not found: $SRC — skipping"
    continue
  fi
  OUT="$OUT_DIR/${f%.*}.pdf"
  echo "Converting $f → ${OUT##*/}"
  wkhtmltopdf --enable-local-file-access "$SRC" "$OUT"
done

echo "All done. PDFs saved to: $OUT_DIR"

# Copy converted PDFs to public folder so they're served by the website (Next.js `public/`)
PUBLIC_DIR="$ROOT_DIR/public/pdfs"
mkdir -p "$PUBLIC_DIR"
echo "Copying PDFs to $PUBLIC_DIR"
cp -a "$OUT_DIR"/*.pdf "$PUBLIC_DIR" || true

# Update zip to include the public PDFs as well
ZIP_NAME="$ROOT_DIR/go4it-pdfs.zip"
echo "Updating zip: $ZIP_NAME"
cd "$ROOT_DIR"
zip -r -9 "$ZIP_NAME" pdfs public/pdfs >/dev/null 2>&1 || true
echo "Zip updated: $ZIP_NAME"

echo "Public PDFs available at: /pdfs/ (when site is deployed)"