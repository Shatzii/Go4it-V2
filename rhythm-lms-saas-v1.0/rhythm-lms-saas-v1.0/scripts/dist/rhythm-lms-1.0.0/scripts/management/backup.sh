#!/bin/bash
# Rhythm-LMS Backup Script

BACKUP_DIR="/opt/rhythm-lms/backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="rhythm-lms-backup-${DATE}"

mkdir -p "$BACKUP_DIR"

echo "Creating backup: $BACKUP_FILE"

# Database backup
pg_dump -h localhost -U rhythm_user rhythm_lms > "$BACKUP_DIR/${BACKUP_FILE}.sql"

# Application data backup
tar -czf "$BACKUP_DIR/${BACKUP_FILE}-data.tar.gz" \
    /opt/rhythm-lms/uploads \
    /opt/rhythm-lms/.env \
    /opt/rhythm-lms/config

echo "Backup completed: $BACKUP_DIR/$BACKUP_FILE"

# Cleanup old backups (keep 30 days)
find "$BACKUP_DIR" -name "rhythm-lms-backup-*" -mtime +30 -delete
