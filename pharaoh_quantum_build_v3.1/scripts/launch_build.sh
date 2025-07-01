#!/bin/bash
echo "🧱 Starting Pharaoh Quantum Build..."
python3 ai/ai_orchestrator.py &
BUILD_PID=$!

while ps -p $BUILD_PID > /dev/null; do
    echo "⏳ Build running..."
    sleep 10
done
