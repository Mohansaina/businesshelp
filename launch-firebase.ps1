# PowerShell script to launch the ReviewAI application with Firebase

Write-Host "Starting ReviewAI Application with Firebase Integration..." -ForegroundColor Green

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "Node.js version: $nodeVersion" -ForegroundColor Cyan
} catch {
    Write-Host "Node.js is not installed. Please install Node.js version 14 or higher." -ForegroundColor Red
    exit 1
}

# Check if Firebase CLI is installed
try {
    $firebaseVersion = firebase --version
    Write-Host "Firebase CLI version: $firebaseVersion" -ForegroundColor Cyan
} catch {
    Write-Host "Firebase CLI is not installed. Installing Firebase CLI..." -ForegroundColor Yellow
    npm install -g firebase-tools
}

# Install project dependencies
Write-Host "Installing project dependencies..." -ForegroundColor Cyan
npm install

# Check if Firebase is properly configured
if (Test-Path "public/js/firebase-config.js") {
    $firebaseConfig = Get-Content "public/js/firebase-config.js" -Raw
    if ($firebaseConfig -match "YOUR_ACTUAL_API_KEY") {
        Write-Host "WARNING: Firebase configuration not complete!" -ForegroundColor Red
        Write-Host "Please update public/js/firebase-config.js with your actual Firebase configuration." -ForegroundColor Yellow
        Write-Host "Refer to FIREBASE-INTEGRATION-GUIDE.md for detailed instructions." -ForegroundColor Yellow
    } else {
        Write-Host "Firebase configuration detected." -ForegroundColor Green
    }
} else {
    Write-Host "Firebase configuration file not found!" -ForegroundColor Red
    exit 1
}

# Start the development server
Write-Host "Starting development server..." -ForegroundColor Cyan
Write-Host "The application will be available at http://localhost:3000" -ForegroundColor Green
node server.js