#!/bin/bash
# Build script with memory optimization
export NODE_OPTIONS="--max_old_space_size=4096"
npm run build
