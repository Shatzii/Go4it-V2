#!/usr/bin/env bash
set -euo pipefail

# Robust Replit build helper
# - Backs up current /app when present
# - If /app-minimal exists, move it into place for a minimal build
# - Always attempts to restore original state on exit

ROOT="$(pwd)"
TIMESTAMP=$(date +%s)
BACKUP_DIR="$ROOT/app.backup.$TIMESTAMP"
APP_DIR="$ROOT/app"
MINIMAL_DIR="$ROOT/app-minimal"

echo "Build helper starting (cwd=$ROOT)"

need_restore=false

if [ -d "$APP_DIR" ]; then
  echo "Backing up existing app to $BACKUP_DIR"
  mv "$APP_DIR" "$BACKUP_DIR"
  need_restore=true
else
  echo "No existing /app directory to back up"
fi

if [ -d "$MINIMAL_DIR" ]; then
  echo "Activating minimal app: moving $MINIMAL_DIR -> $APP_DIR"
  mv "$MINIMAL_DIR" "$APP_DIR"
  moved_minimal=true
else
  echo "No minimal app found at $MINIMAL_DIR. Will build using existing /app (if present)."
  moved_minimal=false
fi

restore() {
  echo "Restoring app structure..."

  # If we moved minimal into place, move it back to app-minimal
  if [ "$moved_minimal" = true ] && [ -d "$APP_DIR" ] && [ ! -d "$MINIMAL_DIR" ]; then
    echo "Moving current /app back to $MINIMAL_DIR"
    mv "$APP_DIR" "$MINIMAL_DIR"
  fi

  # If a backup exists, restore it to /app
  if [ -d "$BACKUP_DIR" ]; then
    echo "Restoring backup $BACKUP_DIR -> $APP_DIR"
    # If /app exists (e.g., leftover), remove it to make way for restore
    if [ -d "$APP_DIR" ]; then
      rm -rf "$APP_DIR"
    fi
    mv "$BACKUP_DIR" "$APP_DIR"
  fi

  echo "Restore complete."
}

trap 'restore' EXIT INT TERM

echo "Running production build"
# Re-use project's production build command
if NODE_OPTIONS='--max-old-space-size=4096' npm run build:production; then
  echo "Production build finished successfully."
  exit 0
else
  echo "Production build failed." >&2
  exit 2
fi
#!/usr/bin/env bash
set -euo pipefail

ROOT="$(pwd)"
TIMESTAMP=$(date +%s)
BACKUP_DIR="$ROOT/app.backup.$TIMESTAMP"

if [ ! -d "$ROOT/app-minimal" ]; then
  echo "Warning: app-minimal not found. Proceeding; script will handle restore if possible." >&2
fi

echo "Backing up current app to $BACKUP_DIR"
if [ -d "$ROOT/app" ]; then
  mv "$ROOT/app" "$BACKUP_DIR"
fi

echo "Activating minimal app for build"
if [ -d "$ROOT/app-minimal" ]; then
  mv "$ROOT/app-minimal" "$ROOT/app"
else
  echo "Note: no app-minimal to move; if a previous run moved it, continuing with existing /app"
fi

restore() {
  echo "Restoring original app structure..."

  # If backup exists, restore it to /app
  if [ -d "$BACKUP_DIR" ]; then
    echo "Restoring backup from $BACKUP_DIR -> $ROOT/app"
    # If current /app exists (the minimal app), move it to app-minimal if app-minimal is missing
    if [ -d "$ROOT/app" ] && [ ! -d "$ROOT/app-minimal" ]; then
      echo "Moving current /app to /app-minimal"
      mv "$ROOT/app" "$ROOT/app-minimal"
    fi

    # Remove any leftover /app (should be the minimal app directory moved), then restore backup
    if [ -d "$ROOT/app" ]; then
      rm -rf "$ROOT/app"
    fi
    mv "$BACKUP_DIR" "$ROOT/app"
  else
    # No backup — if we moved app-minimal into app earlier, try to move it back
    if [ -d "$ROOT/app" ] && [ ! -d "$ROOT/app-minimal" ]; then
      echo "Moving /app back to /app-minimal"
      mv "$ROOT/app" "$ROOT/app-minimal"
    fi
  fi

  echo "Restore complete."
}

trap 'restore' EXIT INT TERM

echo "Running production build (minimal app)"
NODE_OPTIONS='--max-old-space-size=4096' npm run build:production

echo "Build completed successfully."
#!/usr/bin/env bash
set -euo pipefail

ROOT="$(pwd)"
APP_DIR="$ROOT/app"
MINIMAL_DIR="$ROOT/app-minimal"
ARCHIVE_DIR="$ROOT/archive_removed_code/app-backup-for-replit"

if [ ! -d "$MINIMAL_DIR" ]; then
  echo "Minimal app directory not found at $MINIMAL_DIR"
  exit 1
fi

mkdir -p "$ARCHIVE_DIR"

echo "Moving current app to archive: $ARCHIVE_DIR"
mv "$APP_DIR" "$ARCHIVE_DIR/" || { echo "Failed to move app"; exit 1; }

echo "Copying minimal app into place"
cp -R "$MINIMAL_DIR" "$APP_DIR"

restore() {
  echo "Restoring original app..."
  rm -rf "$APP_DIR"
  mv "$ARCHIVE_DIR/app" "$APP_DIR"
  rmdir "$ARCHIVE_DIR" || true
}

trap 'restore' EXIT INT TERM

echo "Running production build (minimal app)"
# Use existing production build command to reuse SKIP_TYPE_CHECK and memory options
NODE_OPTIONS='--max-old-space-size=4096' npm run build:production

echo "Minimal build finished successfully."
