# Firebase Authentication Fix Guide

## Issue Identified

The Firebase authentication is not working because the configuration file (`public/js/firebase-config.js`) contains placeholder values instead of actual Firebase project credentials.

## Solution Options

### Option 1: Quick Demo Fix (For Testing Only)
This option allows you to see the UI flow without actual Firebase authentication.

### Option 2: Proper Firebase Setup (Recommended)
This option requires creating a Firebase project and configuring it properly.

## Option 1: Quick Demo Fix

To quickly demonstrate the authentication flow without Firebase:

1. Replace the `public/js/firebase-config.js` file with a mock implementation:

```javascript
// Mock Firebase configuration for demonstration purposes
const firebase = {
  auth: function() {
    return {
      onAuthStateChanged: function(callback) {
        // Simulate logged out state for demo
        callback(null);
      },
      createUserWithEmailAndPassword: function(email, password) {
        return Promise.resolve({
          user: {
            uid: 'demo-user-id',
            email: email,
            updateProfile: function() { return Promise.resolve(); }
          }
        });
      },
      signInWithEmailAndPassword: function(email, password) {
        return Promise.resolve({
          user: {
            uid: 'demo-user-id',
            email: email,
            displayName: 'Demo User'
          }
        });
      },
      signInWithPopup: function() {
        return Promise.resolve({
          user: {
            uid: 'demo-user-id',
            email: 'demo@example.com',
            displayName: 'Demo User'
          },
          additionalUserInfo: {
            isNewUser: true
          }
        });
      },
      signOut: function() {
        return Promise.resolve();
      }
    };
  },
  firestore: function() {
    return {
      collection: function() {
        return {
          doc: function() {
            return {
              set: function() { return Promise.resolve(); },
              update: function() { return Promise.resolve(); },
              get: function() { 
                return Promise.resolve({
                  exists: true,
                  data: function() { return {}; }
                });
              }
            };
          },
          where: function() {
            return {
              get: function() {
                return Promise.resolve({
                  empty: true,
                  docs: []
                });
              }
            };
          }
        };
      }
    };
  },
  initializeApp: function() { 
    console.log('Mock Firebase initialized'); 
  }
};

// Mock initialization
firebase.initializeApp();

// Initialize Firestore
const db = firebase.firestore();

// Initialize Firebase Authentication
const auth = firebase.auth();
```

## Option 2: Proper Firebase Setup (Recommended)

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a Project"
3. Enter project name (e.g., "AI Review Tool")
4. Accept terms and conditions
5. Click "Create Project"

### Step 2: Register Web App

1. In Firebase Console, click the web icon (</> ) to register a web app
2. Enter app nickname (e.g., "AI Review Tool Web")
3. Check "Also set up Firebase Hosting"
4. Click "Register app"
5. Copy the Firebase configuration object

### Step 3: Update Configuration

Replace the contents of `public/js/firebase-config.js` with your actual configuration:

```javascript
// Your actual Firebase configuration from Firebase Console
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

// Initialize Firestore
const db = firebase.firestore();

// Initialize Firebase Authentication
const auth = firebase.auth();
```

### Step 4: Enable Authentication Methods

1. In Firebase Console, go to "Authentication" > "Sign-in method"
2. Enable:
   - Email/Password
   - Google
   - GitHub (optional)

### Step 5: Set Up Firestore Database

1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Select "Start in test mode" (for development)
4. Choose a location
5. Click "Enable"

### Step 6: Configure Environment Variables

For the Cloud Functions to work properly:

```bash
firebase functions:config:set gmail.email="your-email@gmail.com" gmail.password="your-app-password"
```

## Testing the Fix

After implementing either option:

1. Restart your local server
2. Navigate to `http://localhost:3000`
3. Try signing up or logging in
4. You should be able to navigate through the authentication flow

## Common Issues and Solutions

1. **"Firebase is not defined"**: Ensure the Firebase SDK scripts are loaded in HTML files
2. **CORS errors**: Make sure your domain is in authorized domains
3. **Permission denied**: Check Firestore security rules
4. **Redirect issues**: Verify the redirect URLs in authentication code