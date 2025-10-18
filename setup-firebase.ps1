# PowerShell script to set up and test Firebase configuration
# This script helps configure your Firebase project for the ReviewAI application

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Firebase Setup for ReviewAI" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js is not installed." -ForegroundColor Red
    Write-Host "  Please install Node.js version 14 or higher from https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm --version
    Write-Host "✓ npm version: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ npm is not installed." -ForegroundColor Red
    Write-Host "  Please install Node.js which includes npm." -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "Step 1: Installing project dependencies..." -ForegroundColor Cyan
try {
    npm install
    Write-Host "✓ Dependencies installed successfully" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to install dependencies: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Step 2: Checking Firebase configuration..." -ForegroundColor Cyan

# Check if firebase-config.js exists
if (Test-Path "public\js\firebase-config.js") {
    Write-Host "✓ Found firebase-config.js" -ForegroundColor Green
    
    # Read the file content
    $firebaseConfigContent = Get-Content "public\js\firebase-config.js" -Raw
    
    # Check if it contains default values
    if ($firebaseConfigContent -match "YOUR_ACTUAL_API_KEY" -or 
        $firebaseConfigContent -match "AIzaSyB0ufR1Rr1bZJw5qJrX1bZJw5qJrX1bZJw5" -or
        $firebaseConfigContent -match "your_api_key_here") {
        
        Write-Host "⚠ Firebase configuration needs to be updated" -ForegroundColor Yellow
        Write-Host "  Please update public\js\firebase-config.js with your actual Firebase configuration" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "To get your Firebase configuration:" -ForegroundColor Cyan
        Write-Host "  1. Go to https://console.firebase.google.com/project/thebusinesshelper-baccf/settings/general" -ForegroundColor White
        Write-Host "  2. Click the gear icon and select 'Project settings'" -ForegroundColor White
        Write-Host "  3. Scroll down to 'Your apps' section" -ForegroundColor White
        Write-Host "  4. If you don't see a web app, click '</>' to add one" -ForegroundColor White
        Write-Host "  5. Copy the configuration and update firebase-config.js" -ForegroundColor White
        Write-Host ""
    } else {
        Write-Host "✓ Firebase configuration appears to be set up" -ForegroundColor Green
    }
} else {
    Write-Host "✗ firebase-config.js not found" -ForegroundColor Red
    Write-Host "  Please create public\js\firebase-config.js with your Firebase configuration" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Step 3: Checking required Firebase services..." -ForegroundColor Cyan

# Check if Firebase CLI is installed
try {
    $firebaseVersion = firebase --version
    Write-Host "✓ Firebase CLI version: $firebaseVersion" -ForegroundColor Green
} catch {
    Write-Host "⚠ Firebase CLI is not installed" -ForegroundColor Yellow
    Write-Host "  To install Firebase CLI, run: npm install -g firebase-tools" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Step 4: Testing server..." -ForegroundColor Cyan

# Try to start the server
Write-Host "Starting development server..." -ForegroundColor Cyan
Write-Host "The application will be available at http://localhost:3000" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

try {
    node server.js
} catch {
    Write-Host "Failed to start server: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Setup Complete" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Update your Firebase configuration in public/js/firebase-config.js" -ForegroundColor White
Write-Host "  2. Enable Authentication and Firestore in Firebase Console" -ForegroundColor White
Write-Host "  3. Test the application at http://localhost:3000" -ForegroundColor White
Write-Host ""