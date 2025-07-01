#!/bin/bash
echo "🎙️ Listening for Voice Command..."
whisper mic --model large --command \
  "if input == 'Rebuild Pharaoh Control Panel': bash scripts/launch_build.sh"
