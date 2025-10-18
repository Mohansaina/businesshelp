#!/usr/bin/env node

// Firebase Setup Verification Script
// This script verifies that your Firebase integration is properly configured

const fs = require('fs');
const path = require('path');

console.log('🔍 Firebase Setup Verification');
console.log('==============================\n');

// Check 1: Firebase configuration file exists
console.log('1. Checking Firebase configuration file...');
const firebaseConfigPath = path.join(__dirname, 'public', 'js', 'firebase-config.js');

if (fs.existsSync(firebaseConfigPath)) {
    console.log('   ✅ firebase-config.js found');
    
    // Read the file content
    const firebaseConfigContent = fs.readFileSync(firebaseConfigPath, 'utf8');
    
    // Check if it contains default placeholder values
    if (firebaseConfigContent.includes('YOUR_ACTUAL_API_KEY') || 
        firebaseConfigContent.includes('YOUR_SENDER_ID_HERE') ||
        firebaseConfigContent.includes('YOUR_APP_ID_HERE')) {
        console.log('   ⚠️  Configuration file contains placeholder values');
        console.log('      Please update public/js/firebase-config.js with your actual Firebase configuration');
        console.log('      Get your configuration from: https://console.firebase.google.com/project/thebusinesshelper-baccf/settings/general');
    } else {
        console.log('   ✅ Configuration file appears to have real values');
    }
} else {
    console.log('   ❌ firebase-config.js not found');
    console.log('      Please create public/js/firebase-config.js with your Firebase configuration');
}

console.log();

// Check 2: Required Firebase SDK files in HTML
console.log('2. Checking for Firebase SDK in HTML files...');

const htmlFiles = [
    'public/index.html',
    'public/login.html',
    'public/signup.html',
    'public/dashboard.html'
];

htmlFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        if (content.includes('firebasejs')) {
            console.log(`   ✅ ${file} includes Firebase SDK`);
        } else {
            console.log(`   ⚠️  ${file} may be missing Firebase SDK`);
        }
    } else {
        console.log(`   ❌ ${file} not found`);
    }
});

console.log();

// Check 3: Node.js dependencies
console.log('3. Checking Node.js dependencies...');

const packageJsonPath = path.join(__dirname, 'package.json');
if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    const requiredDeps = ['firebase', 'firebase-admin', 'firebase-functions'];
    const missingDeps = [];
    
    requiredDeps.forEach(dep => {
        if (!packageJson.dependencies || !packageJson.dependencies[dep]) {
            missingDeps.push(dep);
        }
    });
    
    if (missingDeps.length === 0) {
        console.log('   ✅ All required Firebase dependencies found');
    } else {
        console.log('   ⚠️  Missing dependencies:', missingDeps.join(', '));
        console.log('      Run: npm install firebase firebase-admin firebase-functions');
    }
} else {
    console.log('   ❌ package.json not found');
}

console.log();

// Check 4: Firebase functions
console.log('4. Checking Firebase functions...');

const functionsIndexPath = path.join(__dirname, 'functions', 'index.js');
if (fs.existsSync(functionsIndexPath)) {
    console.log('   ✅ Firebase functions found');
} else {
    console.log('   ⚠️  Firebase functions not found');
    console.log('      Create functions/index.js for Cloud Functions');
}

console.log();

// Check 5: Environment variables
console.log('5. Checking environment configuration...');

const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    if (envContent.includes('OPENAI_API_KEY') || envContent.includes('EMAIL_USER')) {
        console.log('   ✅ Environment configuration found');
    } else {
        console.log('   ⚠️  Environment file exists but may be missing required variables');
    }
} else {
    console.log('   ⚠️  .env file not found');
    console.log('      Create .env file with your configuration variables');
}

console.log();

// Summary
console.log('📋 Summary');
console.log('==========');

console.log('\nNext steps:');
console.log('1. Update public/js/firebase-config.js with your actual Firebase configuration');
console.log('2. Enable Authentication and Firestore in Firebase Console');
console.log('3. Test your application at http://localhost:3000');
console.log('4. Run this script again to verify your changes');

console.log('\nFor detailed instructions, see:');
console.log('- FIREBASE-INTEGRATION-GUIDE.md');
console.log('- firebase-setup-guide.html');
console.log('- https://console.firebase.google.com/project/thebusinesshelper-baccf/overview');

console.log('\n💡 Tip: Run "npm start" to start your development server');