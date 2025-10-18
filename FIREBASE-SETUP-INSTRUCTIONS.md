# Firebase Setup Instructions

To fix the signup and Google login issues, you need to properly configure Firebase for your application.

## Step 1: Create a Firebase Project

You've already created your Firebase project named "thebusinesshelper" with Project ID "thebusinesshelper-baccf".

## Step 2: Register Your Web App

1. Go to the [Firebase Console](https://console.firebase.google.com/project/thebusinesshelper-baccf/overview)
2. Click the web icon (</>) to register a web app
3. Enter an app nickname: "ReviewAI Web App"
4. Check "Also set up Firebase Hosting" (optional)
5. Click "Register app"
6. Copy the Firebase configuration object (firebaseConfig)

## Step 3: Update Firebase Configuration

1. Open `public/js/firebase-config.js`
2. Replace the placeholder values with your actual Firebase configuration:
   ```javascript
   // Firebase configuration - REPLACE THESE VALUES WITH YOUR ACTUAL FIREBASE CONFIG
   const firebaseConfig = {
     apiKey: "YOUR_ACTUAL_API_KEY",
     authDomain: "thebusinesshelper-baccf.firebaseapp.com",
     projectId: "thebusinesshelper-baccf",
     storageBucket: "thebusinesshelper-baccf.appspot.com",
     messagingSenderId: "130384558673",
     appId: "YOUR_APP_ID_HERE"
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

## Testing the Fixes

After completing these steps:
1. Restart your local server
2. Try signing up with email/password
3. Try logging in with Google
4. Both should now redirect to the dashboard after successful authentication

## Common Issues and Solutions

1. **Redirect not working**: Make sure you're using `window.location.href` for redirects
2. **Firebase not initialized**: Ensure firebase-config.js is loaded before auth-firebase.js
3. **CORS errors**: Make sure your domain is added to authorized domains in Firebase Console
4. **Permission denied**: Check Firestore rules in the Firebase Console