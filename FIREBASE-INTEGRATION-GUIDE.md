# Firebase Integration Guide

This guide explains how to properly set up Firebase for your ReviewAI application.

## Prerequisites

1. A Google account
2. Access to the Firebase Console

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter a project name (e.g., "ReviewAI")
4. Accept the terms and conditions
5. Click "Create project"

## Step 2: Register Your Web App

1. In the Firebase Console, click the web icon (</>) to register a web app
2. Enter an app nickname (e.g., "ReviewAI Web")
3. Check "Also set up Firebase Hosting" (optional)
4. Click "Register app"
5. Copy the Firebase configuration object (firebaseConfig)

## Step 3: Update Firebase Configuration

1. Open `public/js/firebase-config.js`
2. Replace the placeholder values with your actual Firebase configuration:

```javascript
// Firebase configuration - REPLACE THESE VALUES WITH YOUR ACTUAL FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456",
  measurementId: "G-ABCDEF1234"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firestore
const auth = firebase.auth();
const db = firebase.firestore();

// Export for use in other files
window.firebaseAuth = auth;
window.firebaseDb = db;
```

## Step 4: Enable Authentication Methods

1. In the Firebase Console, go to "Authentication" > "Sign-in method"
2. Enable the following sign-in providers:
   - Email/Password
   - Google
   - GitHub (if you want to use GitHub login)

## Step 5: Configure OAuth Redirect URLs

For Google and GitHub login to work properly:
1. In the Firebase Console, go to "Authentication" > "Sign-in method"
2. Click on "Google" and add your domain to the authorized domains
3. For local development, add `localhost` to the authorized domains

## Step 6: Set Up Firestore Database

1. In the Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Select "Start in test mode" (for development only)
4. Choose a location close to you
5. Click "Enable"

## Step 7: Update Firestore Security Rules

In the Firebase Console, go to "Firestore Database" > "Rules" and update them to:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow users to read/write their own businesses
    match /businesses/{businessId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
    }
    
    // Allow users to read/write their own reviews
    match /reviews/{reviewId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}
```

## Testing the Integration

After completing these steps:

1. Restart your local server
2. Try signing up with email/password
3. Try logging in with Google
4. Both should now work with real Firebase authentication

## Common Issues and Solutions

1. **Firebase not initialized**: Ensure firebase-config.js is loaded before auth-firebase.js
2. **CORS errors**: Make sure your domain is added to authorized domains in Firebase Console
3. **Permission denied**: Check Firestore rules in the Firebase Console
4. **API key errors**: Make sure you're using the correct Firebase configuration values

## Next Steps

1. Implement additional Firebase features like Cloud Functions for backend logic
2. Set up Firebase Analytics to track user behavior
3. Configure Firebase Hosting for production deployment
4. Implement Firebase Storage for file uploads (if needed)