# PowerShell script to fix Cursor serialization issues
# Run this script as Administrator if needed

Write-Host "Fixing Cursor serialization issues..." -ForegroundColor Green

# Clear Cursor cache
$cursorCachePath = "$env:APPDATA\Cursor\User\workspaceStorage"
if (Test-Path $cursorCachePath) {
    Write-Host "Clearing Cursor workspace cache..." -ForegroundColor Yellow
    Remove-Item -Path "$cursorCachePath\*" -Recurse -Force -ErrorAction SilentlyContinue
}

# Clear Node.js cache
Write-Host "Clearing Node.js cache..." -ForegroundColor Yellow
npm cache clean --force

# Clear TypeScript cache
Write-Host "Clearing TypeScript cache..." -ForegroundColor Yellow
if (Test-Path "frontend/node_modules/.cache") {
    Remove-Item -Path "frontend/node_modules/.cache" -Recurse -Force -ErrorAction SilentlyContinue
}
if (Test-Path "backend/dist") {
    Remove-Item -Path "backend/dist" -Recurse -Force -ErrorAction SilentlyContinue
}

# Reinstall dependencies
Write-Host "Reinstalling dependencies..." -ForegroundColor Yellow
Set-Location "frontend"
npm install
Set-Location "..\backend"
npm install
Set-Location ".."

Write-Host "Done! Please restart Cursor and try again." -ForegroundColor Green
Write-Host "If the issue persists, try:" -ForegroundColor Cyan
Write-Host "1. Restart your computer" -ForegroundColor Cyan
Write-Host "2. Update Cursor to the latest version" -ForegroundColor Cyan
Write-Host "3. Check Windows Event Viewer for any system errors" -ForegroundColor Cyan
