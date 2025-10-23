Write-Host "`n=== Go4it Sports - Quick Setup ===" -ForegroundColor Cyan

# Check if we're in the right place
if (!(Test-Path "package.json")) {
    Write-Host " package.json not found. Run this from the project root." -ForegroundColor Red
    exit 1
}

Write-Host " Found package.json" -ForegroundColor Green

# Install dependencies
Write-Host "`n Installing dependencies..." -ForegroundColor Yellow
npm install

# Create .env.local if it doesn't exist
if (!(Test-Path ".env.local")) {
    Write-Host "`n  Creating .env.local..." -ForegroundColor Yellow
    @"
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
DATABASE_URL=postgresql://user:password@localhost:5432/go4it
NEXTAUTH_SECRET=your-secret-here-change-this
NEXTAUTH_URL=http://localhost:3000
"@ | Out-File ".env.local" -Encoding UTF8
    Write-Host " .env.local created" -ForegroundColor Green
} else {
    Write-Host "`n .env.local already exists" -ForegroundColor Green
}

Write-Host "`n Setup complete!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. Edit .env.local with your API keys"
Write-Host "2. Run: npm run dev"
Write-Host "3. Visit: http://localhost:3000`n"
