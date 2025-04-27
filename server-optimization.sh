#!/bin/bash
# Go4It Sports Server Optimization for 4 vCPU/16GB RAM Hetzner Server

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Optimizing server for 4 vCPU / 16GB RAM / 160GB SSD ===${NC}"

# Step 1: System kernel parameter optimization
echo -e "${YELLOW}Optimizing kernel parameters...${NC}"
cat > /etc/sysctl.d/99-go4it-performance.conf << EOF
# Network optimizations
net.core.somaxconn = 4096
net.core.netdev_max_backlog = 5000
net.ipv4.tcp_max_syn_backlog = 4096
net.ipv4.ip_local_port_range = 1024 65535
net.ipv4.tcp_fin_timeout = 15
net.ipv4.tcp_keepalive_time = 300
net.ipv4.tcp_tw_reuse = 1
net.ipv4.tcp_slow_start_after_idle = 0

# File system optimizations
fs.file-max = 100000
fs.inotify.max_user_watches = 524288

# VM optimizations for application server
vm.swappiness = 10
vm.dirty_ratio = 30
vm.dirty_background_ratio = 5
EOF

# Apply sysctl settings
sysctl -p /etc/sysctl.d/99-go4it-performance.conf

# Step 2: Optimize file limits
echo -e "${YELLOW}Optimizing file limits...${NC}"
cat > /etc/security/limits.d/go4it.conf << EOF
* soft nofile 65535
* hard nofile 65535
root soft nofile 65535
root hard nofile 65535
EOF

# Step 3: PostgreSQL Optimization (optimized for 16GB RAM)
echo -e "${YELLOW}Optimizing PostgreSQL for 16GB RAM...${NC}"
cat > /etc/postgresql/14/main/conf.d/go4it-optimizations.conf << EOF
# Memory settings
shared_buffers = 4GB                  # 25% of RAM
effective_cache_size = 12GB           # 75% of RAM
work_mem = 32MB                       # Per-operation memory
maintenance_work_mem = 512MB          # For maintenance operations
huge_pages = try                      # Use huge pages if available

# Write-Ahead Log settings
wal_buffers = 16MB                    # Improved WAL performance
checkpoint_completion_target = 0.9    # Spread out checkpoint I/O
min_wal_size = 1GB                    # Min WAL size
max_wal_size = 4GB                    # Max WAL size

# Query Planner settings
random_page_cost = 1.1                # For SSD storage
effective_io_concurrency = 200        # Concurrent IO operations

# Parallel query settings (for 4 vCPU)
max_worker_processes = 4              # Equal to CPU cores
max_parallel_workers_per_gather = 2   # 50% of cores
max_parallel_workers = 4              # Equal to cores
max_parallel_maintenance_workers = 2  # 50% of cores

# General settings
default_statistics_target = 100       # Improved statistics

# Connection settings
max_connections = 200                 # Max concurrent connections
EOF

# Step 4: Nginx optimization
echo -e "${YELLOW}Optimizing Nginx for 4 vCPU / 16GB RAM...${NC}"
cat > /etc/nginx/conf.d/go4it-optimizations.conf << EOF
# Worker processes & connections
worker_processes 4;             # Equal to CPU cores
worker_rlimit_nofile 65535;     # File descriptor limit

events {
    use epoll;                  # Linux-specific event processing
    worker_connections 16384;   # Max connections per worker
    multi_accept on;            # Accept multiple connections per event
}

http {
    # File cache settings
    open_file_cache max=10000 inactive=30s;
    open_file_cache_valid 60s;
    open_file_cache_min_uses 2;
    open_file_cache_errors on;
    
    # Buffers and timeouts
    client_body_buffer_size 16k;
    client_header_buffer_size 1k;
    client_max_body_size 100m;
    large_client_header_buffers 2 1k;
    client_body_timeout 10;
    client_header_timeout 10;
    keepalive_timeout 30;
    keepalive_requests 100000;
    reset_timedout_connection on;
    send_timeout 10;
    sendfile on;
    tcp_nodelay on;
    tcp_nopush on;
    
    # Gzip compression settings
    gzip on;
    gzip_comp_level 5;
    gzip_min_length 256;
    gzip_proxied any;
    gzip_vary on;
    gzip_types
        application/atom+xml
        application/javascript
        application/json
        application/ld+json
        application/manifest+json
        application/rss+xml
        application/vnd.geo+json
        application/vnd.ms-fontobject
        application/x-font-ttf
        application/x-web-app-manifest+json
        application/xhtml+xml
        application/xml
        font/opentype
        image/bmp
        image/svg+xml
        image/x-icon
        text/cache-manifest
        text/css
        text/plain
        text/vcard
        text/vnd.rim.location.xloc
        text/vtt
        text/x-component
        text/x-cross-domain-policy;
        
    # Fastcgi cache settings
    fastcgi_cache_path /var/cache/nginx/fastcgi_cache 
        levels=1:2 
        keys_zone=go4it_cache:100m 
        inactive=60m 
        max_size=1g;
    fastcgi_cache_key "$scheme$request_method$host$request_uri";
    
    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
}
EOF

# Step 5: NodeJS optimization (PM2)
echo -e "${YELLOW}Optimizing Node.js application with PM2...${NC}"
cd /var/www/go4it

# Create optimized PM2 config
cat > ecosystem.config.js << EOF
module.exports = {
  apps : [{
    name: 'go4it-sports',
    script: 'production-server.js',
    instances: 4,                 // Use 1 instance per CPU core
    exec_mode: 'cluster',         // Run in cluster mode
    watch: false,                 // Don't watch for file changes in production
    max_memory_restart: '1G',     // Restart if memory usage exceeds 1GB
    env: {
      NODE_ENV: 'production'
    },
    node_args: '--max-old-space-size=4096' // 4GB memory limit per Node process
  }]
};
EOF

# Use the PM2 configuration file to start the application
pm2 start ecosystem.config.js
pm2 save

# Step 6: Install and configure Redis for caching
echo -e "${YELLOW}Installing and configuring Redis for caching...${NC}"
apt install -y redis-server

# Optimize Redis configuration
cat > /etc/redis/redis.conf << EOF
bind 127.0.0.1
port 6379
tcp-backlog 511
timeout 0
tcp-keepalive 300
daemonize yes
supervised auto
loglevel notice
databases 16
save 900 1
save 300 10
save 60 10000
stop-writes-on-bgsave-error yes
rdbcompression yes
rdbchecksum yes
dbfilename dump.rdb
dir /var/lib/redis
replica-serve-stale-data yes
replica-read-only yes
repl-diskless-sync no
repl-diskless-sync-delay 5
repl-disable-tcp-nodelay no
replica-priority 100
lazyfree-lazy-eviction no
lazyfree-lazy-expire no
lazyfree-lazy-server-del no
replica-lazy-flush no
appendonly no
appendfilename "appendonly.aof"
appendfsync everysec
no-appendfsync-on-rewrite no
auto-aof-rewrite-percentage 100
auto-aof-rewrite-min-size 64mb
aof-load-truncated yes
aof-use-rdb-preamble yes
maxmemory 4gb
maxmemory-policy allkeys-lru
EOF

# Restart Redis
systemctl restart redis-server

# Step 7: Database Index Optimization
echo -e "${YELLOW}Creating database indexes for optimal performance...${NC}"
sudo -u postgres psql -c "CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_username ON users(username);" go4it
sudo -u postgres psql -c "CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_videos_user_id ON videos(user_id);" go4it
sudo -u postgres psql -c "CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_sessions_session_id ON sessions(sid);" go4it
sudo -u postgres psql -c "VACUUM ANALYZE;" go4it

# Step 8: Set up automated database maintenance
echo -e "${YELLOW}Setting up automated database maintenance...${NC}"
cat > /var/scripts/db-maintain.sh << EOF
#!/bin/bash
# Daily database maintenance
LOG_FILE="/var/log/go4it-db-maintenance.log"
echo "=== Database maintenance started at \$(date) ===" >> \$LOG_FILE

# Vacuum analyze all tables
sudo -u postgres psql -c "VACUUM ANALYZE;" go4it >> \$LOG_FILE 2>&1

# Reindex database
sudo -u postgres psql -c "REINDEX DATABASE go4it;" go4it >> \$LOG_FILE 2>&1

echo "=== Database maintenance completed at \$(date) ===" >> \$LOG_FILE
EOF

chmod +x /var/scripts/db-maintain.sh
(crontab -l 2>/dev/null; echo "0 1 * * * /var/scripts/db-maintain.sh") | crontab -

# Step 9: Set up log rotation
echo -e "${YELLOW}Setting up log rotation...${NC}"
cat > /etc/logrotate.d/go4it << EOF
/var/log/go4it-*.log {
    daily
    rotate 14
    compress
    delaycompress
    missingok
    notifempty
    create 0640 www-data adm
    sharedscripts
    postrotate
        service nginx reload > /dev/null 2>&1 || true
    endscript
}
EOF

echo -e "${GREEN}Server optimization completed!${NC}"
echo "PostgreSQL, Nginx, Node.js, and Redis have been optimized for 4 vCPU / 16GB RAM / 160GB SSD"
echo "You may need to restart services for all changes to take effect:"
echo "systemctl restart postgresql nginx redis-server"
echo "pm2 restart all"