#!/bin/bash
export NODE_ENV=production
export PORT=5000
export HOSTNAME=0.0.0.0

if [ -d ".next/standalone" ]; then
  cd .next/standalone
  npm install --production --silent
  node server.js
else
  npm run start
fi
