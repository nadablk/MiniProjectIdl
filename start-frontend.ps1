# Quick Start Script for React Frontend
# Run this as Administrator

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Philosophy App - React Frontend" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Add firewall rule
Write-Host "Configuring Windows Firewall..." -ForegroundColor Yellow
try {
    New-NetFirewallRule -DisplayName "React Frontend" -Direction Inbound -LocalPort 5173 -Protocol TCP -Action Allow -ErrorAction Stop
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
Write-Host "  External Port: 80 or 5173" -ForegroundColor White
Write-Host "  Internal IP: $localIP" -ForegroundColor White
Write-Host "  Internal Port: 5173" -ForegroundColor White
Write-Host "  Protocol: TCP" -ForegroundColor White
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Starting React..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Change to project directory
$projectPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location "$projectPath\Front-end"

Write-Host "Starting React development server..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Access URLs:" -ForegroundColor Cyan
Write-Host "  Local: http://localhost:5173" -ForegroundColor White
Write-Host "  Network: http://${localIP}:5173" -ForegroundColor White
Write-Host "  Public: http://app.myappstore.live:5173" -ForegroundColor White
Write-Host ""
Write-Host "API Endpoints:" -ForegroundColor Cyan
Write-Host "  Spring Boot: http://springboot.myappstore.live:8081/api" -ForegroundColor White
Write-Host "  Django: http://django.myappstore.live:8081/api" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

# Start React with host exposed
npm run dev -- --host 0.0.0.0 --port 5173
