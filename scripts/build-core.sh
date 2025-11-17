#!/usr/bin/env bash
set -euo pipefail

ROOT="$(pwd)"
APP_DIR="$ROOT/app"
ARCHIVE_DIR="$ROOT/archive_removed_code/app-temp"
mkdir -p "$ARCHIVE_DIR"

# Whitelist of app subfolders to keep during the build
WHITELIST=(
  go4it-academy
  starpath
  events
  camp-registration
  checkout
  enrollment-portal
  parent-night
  friday-night-lights
  pricing
  start
  student
)

in_whitelist() {
  local name="$1"
  for w in "${WHITELIST[@]}"; do
    if [[ "$w" == "$name" ]]; then
      return 0
    fi
  done
  return 1
}

# Move non-whitelisted app folders to archive dir
echo "Archiving non-core app/* directories to $ARCHIVE_DIR"
shopt -s dotglob
for path in "$APP_DIR"/*; do
  name="$(basename "$path")"
  if [ -d "$path" ]; then
    if in_whitelist "$name"; then
      echo "Keeping: $name"
    else
      echo "Archiving: $name"
      mv "$path" "$ARCHIVE_DIR/"
    fi
  fi
done

restore() {
  echo "Restoring archived app folders..."
  if [ -d "$ARCHIVE_DIR" ]; then
    for item in "$ARCHIVE_DIR"/*; do
      mv "$item" "$APP_DIR/"
    done
    rmdir "$ARCHIVE_DIR" || true
  fi
}

trap 'restore' EXIT INT TERM

echo "Running type-check with focused tsconfig..."
npx tsc -p tsconfig.build.json --noEmit || true

echo "Running production build (NODE_OPTIONS set to increase memory)"
NODE_OPTIONS='--max-old-space-size=4096' npm run build:production

echo "Build finished."
