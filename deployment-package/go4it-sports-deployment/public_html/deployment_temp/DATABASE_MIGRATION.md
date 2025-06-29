# Go4It Sports Platform Database Migration Guide

This guide provides instructions for migrating the Go4It Sports database from development to production.

## Database Overview

The Go4It Sports platform uses PostgreSQL with the Drizzle ORM. The database contains the following key components:

- User accounts and profiles
- Athlete performance data
- Content management system
- XP and progression system
- Star Path progression
- Skill trees and attributes
- Video metadata
- Blog posts and articles
- Academic performance records
- Messaging system data

## Pre-Migration Preparation

### 1. Backup Development Database

Always create a backup before migration:

```bash
# Connect to PostgreSQL
pg_dump -U your_user_name -h your_host your_database_name > go4it_dev_backup_$(date +%Y%m%d).sql
```

### 2. Verify Database Schema

Ensure the development schema is complete:

```bash
# Run the schema verification script
node create-schema.ts
```

### 3. Prepare Production Database Server

On the production server (5.161.99.81):

```bash
# Install PostgreSQL if needed
sudo apt-get update
sudo apt-get install -y postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres psql -c "CREATE DATABASE go4it_sports;"
sudo -u postgres psql -c "CREATE USER go4it_admin WITH ENCRYPTED PASSWORD 'your_secure_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE go4it_sports TO go4it_admin;"
```

## Migration Options

### Option 1: Full Data Migration (Recommended for Production Launch)

This approach migrates all data from development to production:

1. Create a complete database dump:

```bash
pg_dump -U your_dev_user -h your_dev_host your_dev_database > go4it_full_dump.sql
```

2. Transfer the dump file to the production server:

```bash
scp go4it_full_dump.sql user@5.161.99.81:/tmp/
```

3. Import the dump to the production database:

```bash
psql -U go4it_admin -h localhost go4it_sports < /tmp/go4it_full_dump.sql
```

4. Update environment variables in the .env file to point to the new database.

### Option 2: Schema-Only Migration with Fresh Data

This approach migrates only the database structure, not the data:

1. Create a schema-only dump:

```bash
pg_dump -U your_dev_user -h your_dev_host --schema-only your_dev_database > go4it_schema.sql
```

2. Transfer and import the schema:

```bash
scp go4it_schema.sql user@5.161.99.81:/tmp/
psql -U go4it_admin -h localhost go4it_sports < /tmp/go4it_schema.sql
```

3. Run the initialization scripts to create essential data:

```bash
node create_test_password.ts  # Creates admin user
node seed-skill-tree.ts       # Seeds skill tree data
node seed-content-blocks.ts   # Seeds content blocks
```

### Option 3: Incremental Migration (For Future Updates)

For future updates, use Drizzle's migration capabilities:

1. Generate migration files:

```bash
npm run generate
```

2. Apply migrations to production:

```bash
npm run migrate
```

## Database Configuration for Production

Update the .env file on the production server with the correct database connection information:

```
DATABASE_URL=postgresql://go4it_admin:your_secure_password@localhost:5432/go4it_sports
PGHOST=localhost
PGUSER=go4it_admin
PGPASSWORD=your_secure_password
PGDATABASE=go4it_sports
PGPORT=5432
```

## Post-Migration Verification

After migrating the database, verify its integrity:

1. Check table structure:

```sql
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
```

2. Verify critical data:

```sql
-- Check user accounts
SELECT COUNT(*) FROM users;

-- Check content blocks
SELECT COUNT(*) FROM content_blocks;

-- Check skill tree data
SELECT COUNT(*) FROM skill_tree_nodes;
```

3. Test application functionality with the new database.

## Database Maintenance

### Regular Backups

Set up a cron job for regular backups:

```bash
# Add to crontab
crontab -e

# Add this line for daily backups at 2 AM
0 2 * * * pg_dump -U go4it_admin -h localhost go4it_sports > /path/to/backups/go4it_backup_$(date +\%Y\%m\%d).sql
```

### Performance Optimization

The production database is configured with these optimizations:

1. Connection pooling (20 connections)
2. 30-second connection timeout
3. Indexes on frequently queried columns
4. Query caching for common operations

To adjust these settings, modify server/db.ts.

### Monitoring Database Performance

Monitor the database using PostgreSQL tools:

```sql
-- Check active connections
SELECT * FROM pg_stat_activity;

-- Check table sizes
SELECT 
  table_name, 
  pg_size_pretty(pg_total_relation_size(quote_ident(table_name))) as size
FROM 
  information_schema.tables
WHERE 
  table_schema = 'public'
ORDER BY 
  pg_total_relation_size(quote_ident(table_name)) DESC;

-- Check index usage
SELECT 
  indexrelname, 
  idx_scan, 
  idx_tup_read, 
  idx_tup_fetch
FROM 
  pg_stat_user_indexes
ORDER BY 
  idx_scan DESC;
```

## Troubleshooting

### Common Issues

1. **Connection Errors**:
   - Verify PostgreSQL is running: `sudo systemctl status postgresql`
   - Check firewall settings: `sudo ufw status`
   - Verify connection details in .env file

2. **Permission Issues**:
   - Ensure user has proper permissions: `GRANT ALL PRIVILEGES ON DATABASE go4it_sports TO go4it_admin;`
   - Check pg_hba.conf for authentication settings

3. **Space Limitations**:
   - Monitor disk space: `df -h`
   - Clean unnecessary data or logs

4. **Slow Queries**:
   - Analyze with `EXPLAIN ANALYZE`
   - Check for missing indexes
   - Use the query cache service

### Recovery Process

If the migration fails:

1. Drop the partially migrated database:
```sql
DROP DATABASE go4it_sports;
```

2. Recreate the database:
```sql
CREATE DATABASE go4it_sports;
```

3. Restore from backup:
```bash
psql -U go4it_admin -h localhost go4it_sports < go4it_dev_backup.sql
```

## Additional Resources

- PostgreSQL Documentation: https://www.postgresql.org/docs/
- Drizzle ORM Documentation: https://orm.drizzle.team/docs/overview
- Database Monitoring Tools: pgAdmin, pg_stat_statements