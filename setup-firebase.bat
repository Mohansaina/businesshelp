@echo off
title Firebase Setup for ReviewAI

echo ========================================
echo   Firebase Setup for ReviewAI
echo ========================================
echo.

echo Checking if Node.js is installed...
node --version >nul 2>&1
if %errorlevel% == 0 (
    for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
    echo ✓ Node.js version: %NODE_VERSION%
) else (
    echo ✗ Node.js is not installed.
    echo   Please install Node.js version 14 or higher from https://nodejs.org/
    pause
    exit /b 1
)

echo.
echo Checking if npm is installed...
npm --version >nul 2>&1
if %errorlevel% == 0 (
    for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
    echo ✓ npm version: %NPM_VERSION%
) else (
    echo ✗ npm is not installed.
    echo   Please install Node.js which includes npm.
    pause
    exit /b 1
)

echo.
echo Step 1: Installing project dependencies...
call npm install
if %errorlevel% == 0 (
    echo ✓ Dependencies installed successfully
) else (
    echo ✗ Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo Step 2: Checking Firebase configuration...
if exist "public\js\firebase-config.js" (
    echo ✓ Found firebase-config.js
    
    findstr /C:"YOUR_ACTUAL_API_KEY" "public\js\firebase-config.js" >nul 2>&1
    if %errorlevel% == 0 (
        echo ⚠ Firebase configuration needs to be updated
        echo   Please update public\js\firebase-config.js with your actual Firebase configuration
        echo.
        echo To get your Firebase configuration:
        echo   1. Go to https://console.firebase.google.com/project/thebusinesshelper-baccf/settings/general
        echo   2. Click the gear icon and select 'Project settings'
        echo   3. Scroll down to 'Your apps' section
        echo   4. If you don't see a web app, click '</>' to add one
        echo   5. Copy the configuration and update firebase-config.js
        echo.
    ) else (
        echo ✓ Firebase configuration appears to be set up
    )
) else (
    echo ✗ firebase-config.js not found
    echo   Please create public\js\firebase-config.js with your Firebase configuration
)

echo.
echo Step 3: Checking required Firebase services...
firebase --version >nul 2>&1
if %errorlevel% == 0 (
    for /f "tokens=*" %%i in ('firebase --version') do set FIREBASE_VERSION=%%i
    echo ✓ Firebase CLI version: %FIREBASE_VERSION%
) else (
    echo ⚠ Firebase CLI is not installed
    echo   To install Firebase CLI, run: npm install -g firebase-tools
)

echo.
echo Step 4: Starting development server...
echo The application will be available at http://localhost:3000
echo Press Ctrl+C to stop the server
echo.

node server.js

echo.
echo ========================================
echo   Setup Complete
echo ========================================
echo.
echo Next steps:
echo   1. Update your Firebase configuration in public/js/firebase-config.js
echo   2. Enable Authentication and Firestore in Firebase Console
echo   3. Test the application at http://localhost:3000
echo.
pause