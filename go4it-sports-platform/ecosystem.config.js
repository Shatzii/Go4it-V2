module.exports = {
  apps: [{
    name: 'go4itsports',
    script: 'dist/index.js',
    cwd: '/var/www/go4itsports',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000,
      DOMAIN: 'go4itsports.org',
      SERVER_IP: '167.235.128.41'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 5000,
      DOMAIN: 'go4itsports.org',
      SERVER_IP: '167.235.128.41',
      FORCE_HTTPS: 'true',
      SSL_ENABLED: 'true'
    },
    error_file: '/var/www/go4itsports/logs/err.log',
    out_file: '/var/www/go4itsports/logs/out.log',
    log_file: '/var/www/go4itsports/logs/combined.log',
    time: true,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=1024'
  }]
};