#!/bin/bash
echo "🌍 Initializing Quantum Build System..."
sudo apt update && sudo apt install -y docker.io wasmer kubectl terraform python3.11-venv nodejs wget jq
pip install openai python-dotenv
npm install -g pm2
echo "✅ Environment ready."
