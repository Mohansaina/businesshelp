# How to Update Firebase Configuration

To connect your application to your Firebase project (thebusinesshelper-baccf), you need to update the configuration with your actual project settings.

## Step 1: Get Your Firebase Configuration

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your project: "thebusinesshelper-baccf"
3. Click the gear icon (⚙️) next to "Project Overview" and select "Project settings"
4. In the "General" tab, scroll down to the "Your apps" section
5. If you don't have a web app configured, click "</>" to add one:
   - App nickname: "ReviewAI Web"
   - Check "Also set up Firebase Hosting" (optional)
   - Click "Register app"
6. Copy the firebaseConfig object that looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyB0ufR1Rr1bZJw5qJrX1bZJw5qJrX1bZJw5",
  authDomain: "thebusinesshelper-baccf.firebaseapp.com",
  projectId: "thebusinesshelper-baccf",
  storageBucket: "thebusinesshelper-baccf.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdefghijklmnopqrstuvwxyz",
  measurementId: "G-ABC123DEF"
};
```

## Step 2: Update Your Configuration File

1. Open `public/js/firebase-config.js` in your code editor
2. Replace the placeholder values with your actual configuration:
   - Replace `apiKey` with your actual API key
   - Replace `messagingSenderId` with your actual sender ID
   - Replace `appId` with your actual app ID
   - Replace `measurementId` with your actual measurement ID (if present)

## Step 3: Enable Firebase Services

In the Firebase Console, enable the following services:

1. **Authentication**:
   - Click "Authentication" in the left sidebar
   - Click "Get started"
   - Go to "Sign-in method" tab
   - Enable:
     - Email/Password
     - Google
     - GitHub (optional)

2. **Firestore Database**:
   - Click "Firestore Database" in the left sidebar
   - Click "Create database"
   - Select "Start in test mode" (for development)
   - Choose a location near you
   - Click "Enable"

## Step 4: Update Firestore Security Rules

In the Firebase Console:
1. Go to "Firestore Database"
2. Click the "Rules" tab
3. Replace the default rules with:

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

## Step 5: Test Your Configuration

1. Save all changes
2. Start your development server:
   ```bash
   npm start
   ```
3. Open your browser and navigate to `http://localhost:3000`
4. Try signing up with email/password
5. Try logging in with Google

## Troubleshooting

If you encounter issues:

1. **Check the browser console** for error messages
2. **Verify all configuration values** are correctly copied
3. **Ensure all required services** are enabled in Firebase Console
4. **Check that your domain** (localhost for development) is added to authorized domains

## Next Steps

Once your configuration is working:

1. Implement additional features using Firebase
2. Set up Firebase Hosting for production deployment
3. Configure Firebase Analytics to track user behavior
4. Add Firebase Cloud Functions for backend logic