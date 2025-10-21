# Quick Start Script for Django Backend
# Run this as Administrator

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Philosophy App - Django Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Add firewall rule
Write-Host "Configuring Windows Firewall..." -ForegroundColor Yellow
try {
    New-NetFirewallRule -DisplayName "Django API" -Direction Inbound -LocalPort 8081 -Protocol TCP -Action Allow -ErrorAction Stop
    Write-Host "✓ Firewall rule added successfully" -ForegroundColor Green
} catch {
    if ($_.Exception.Message -like "*already exists*") {
        Write-Host "✓ Firewall rule already exists" -ForegroundColor Green
    } else {
        Write-Host "✗ Failed to add firewall rule: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host ""

# Get local IP
Write-Host "Getting network information..." -ForegroundColor Yellow
$localIP = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.IPAddress -like "192.168.*" -or $_.IPAddress -like "10.*"}).IPAddress
Write-Host "✓ Your local IP: $localIP" -ForegroundColor Green

# Get public IP
try {
    $publicIP = (Invoke-WebRequest -Uri "https://api.ipify.org" -UseBasicParsing).Content
    Write-Host "✓ Your public IP: $publicIP" -ForegroundColor Green
} catch {
    Write-Host "✗ Could not fetch public IP" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Port Forwarding Configuration" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Configure your router to forward:" -ForegroundColor Yellow
Write-Host "  External Port: 8081" -ForegroundColor White
Write-Host "  Internal IP: $localIP" -ForegroundColor White
Write-Host "  Internal Port: 8081" -ForegroundColor White
Write-Host "  Protocol: TCP" -ForegroundColor White
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Starting Django..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Change to project directory
$projectPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location "$projectPath\backend"

Write-Host "Checking PostgreSQL connection..." -ForegroundColor Yellow
# Test database connection
python -c "import psycopg2; psycopg2.connect('dbname=CourseServiceDB user=postgres password=root host=localhost port=5432')" 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ PostgreSQL connected" -ForegroundColor Green
} else {
    Write-Host "✗ PostgreSQL connection failed - Make sure PostgreSQL is running" -ForegroundColor Red
}

Write-Host ""
Write-Host "Starting Django on port 8081..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Access URLs:" -ForegroundColor Cyan
Write-Host "  Local: http://localhost:8081/api/courses/" -ForegroundColor White
Write-Host "  Public: http://django.myappstore.live:8081/api/courses/" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

# Start Django
python manage.py runserver 0.0.0.0:8081
