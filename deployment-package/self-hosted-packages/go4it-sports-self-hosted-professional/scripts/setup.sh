#!/bin/bash

echo "Setting up Go4It Sports Go4It Sports Professional..."

# Check requirements
command -v docker >/dev/null 2>&1 || { echo "Docker is required but not installed. Please install Docker first."; exit 1; }
command -v docker-compose >/dev/null 2>&1 || { echo "Docker Compose is required but not installed. Please install Docker Compose first."; exit 1; }

# Create necessary directories
mkdir -p uploads
mkdir -p logs
mkdir -p backups

# Copy environment template
if [ ! -f config/app.env ]; then
    cp config/environment.template config/app.env
    echo "Environment file created at config/app.env"
    echo "Please edit this file with your configuration before starting the application."
fi

# Generate SSL certificate (self-signed)
if [ ! -f nginx/ssl/server.crt ]; then
    mkdir -p nginx/ssl
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout nginx/ssl/server.key \
        -out nginx/ssl/server.crt \
        -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"
    echo "Self-signed SSL certificate generated."
fi

# Build and start services
docker-compose build
docker-compose up -d

echo ""
echo "Go4It Sports Go4It Sports Professional is starting up..."
echo "Please wait a few minutes for all services to initialize."
echo ""
echo "Access your application at:"
echo "  HTTP:  http://localhost"
echo "  HTTPS: https://localhost"
echo ""
echo "Admin login:"
echo "  Username: admin"
echo "  Password: MyTime$$"
echo ""
echo "To view logs: docker-compose logs -f"
echo "To stop: docker-compose down"
