#!/bin/bash
echo "🧬 Creating Build Capsule..."
tar -czvf capsules/build_$(date +%s).tar.gz output/
echo "✅ Capsule created."
