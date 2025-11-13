#!/usr/bin/env bash
set -euo pipefail

# Lightweight Replit run script (root-level)
export NODE_OPTIONS='--max-old-space-size=2048'

echo "[replit] Installing production dependencies..."
npm ci --omit=dev

echo "[replit] Attempting production build..."
if npm run build:production; then
  echo "[replit] Build succeeded"
else
  echo "[replit] Build failed or was killed; attempting to start anyway"
fi

echo "[replit] Starting application..."
npm run start:production
