#!/usr/bin/env bash
set -euo pipefail

WKHTMLTOPDF=${WKHTMLTOPDF:-wkhtmltopdf}
FLAGS=(
  --enable-local-file-access
  --print-media-type
  --background
  --no-pdf-compression
  --dpi 300
  --zoom 1
  --margin-top 10mm
  --margin-bottom 10mm
  --margin-left 10mm
  --margin-right 10mm
  --no-stop-slow-scripts
)

FILES=(
  "starpath_academy_overview_nd.html"
  "starpath_complete_syllabus_colorado_branded.html"
  "starpath_delivery_silver_steady_online.html"
  "Go4it_Vienna_Spring2026_Syllabi.html"
  "Go4it_Vienna_Spring2026_Syllabi (1).html"
  "ISL_Vienna_Global_Residency.html"
  "Go4it_About_Us_School_Admin_v3.html"
  "Go4it_Vienna_Residency_StarPath_Spring2026.html"
  "living_is_learning_starpath.html"
  "AcademyHandbook.html"
)

cd "$(dirname "$0")"

for f in "${FILES[@]}"; do
  if [ -f "$f" ]; then
    out="${f%.html}_StarPath.pdf"
    echo "Converting $f -> $out"
    # Try with QT_QPA_PLATFORM=offscreen if default fails in headless env
    if ! $WKHTMLTOPDF "${FLAGS[@]}" "$f" "$out"; then
      echo "First pass failed, retrying with QT_QPA_PLATFORM=offscreen"
      QT_QPA_PLATFORM=offscreen $WKHTMLTOPDF "${FLAGS[@]}" "$f" "$out"
    fi
  else
    echo "Skipping missing file: $f"
  fi
done

echo "✅ All requested StarPath HTML files processed."
