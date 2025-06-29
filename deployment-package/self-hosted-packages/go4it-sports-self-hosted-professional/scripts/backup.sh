#!/bin/bash

BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="go4it_backup_$TIMESTAMP.tar.gz"

echo "Creating backup..."

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup database
docker-compose exec -T postgres pg_dump -U go4it go4it_sports > $BACKUP_DIR/database_$TIMESTAMP.sql

# Backup uploads
tar -czf $BACKUP_DIR/uploads_$TIMESTAMP.tar.gz uploads/

# Create complete backup
tar -czf $BACKUP_DIR/$BACKUP_FILE \
    $BACKUP_DIR/database_$TIMESTAMP.sql \
    $BACKUP_DIR/uploads_$TIMESTAMP.tar.gz \
    config/app.env

echo "Backup created: $BACKUP_DIR/$BACKUP_FILE"

# Cleanup temporary files
rm $BACKUP_DIR/database_$TIMESTAMP.sql
rm $BACKUP_DIR/uploads_$TIMESTAMP.tar.gz
