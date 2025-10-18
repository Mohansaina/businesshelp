# Your Firebase Setup Guide for ReviewAI

Based on your Firebase project information:
- Project name: thebusinesshelper
- Project ID: thebusinesshelper-baccf
- Project number: 130384558673

Let's set up Firebase for your ReviewAI application step by step.

## Step 1: Create a Web App in Your Firebase Project

1. Go to your Firebase project: [thebusinesshelper-baccf](https://console.firebase.google.com/project/thebusinesshelper-baccf/overview)

2. In the Firebase Console, you'll see a message "There are no apps in your project" - this is normal.

3. Click the web icon (</>) to add a web app:
   - App nickname: "ReviewAI Web App"
   - Check "Also set up Firebase Hosting" (optional)
   - Click "Register app"

4. On the next screen, Firebase will show you the configuration code. It will look like this:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSyB0ufR1Rr1bZJw5qJrX1bZJw5qJrX1bZJw5",
     authDomain: "thebusinesshelper-baccf.firebaseapp.com",
     projectId: "thebusinesshelper-baccf",
     storageBucket: "thebusinesshelper-baccf.appspot.com",
     messagingSenderId: "130384558673",
     appId: "1:130384558673:web:abcdefghijklmnopqrstuvwxyz"
   };
   ```

5. Copy this configuration - you'll need it in the next step.

## Step 2: Update Your Application Configuration

1. Open the file `public/js/firebase-config.js` in your code editor.

2. Replace the existing firebaseConfig with your copied configuration:
   ```javascript
   // Firebase configuration - REPLACE THESE VALUES WITH YOUR ACTUAL FIREBASE CONFIG
   const firebaseConfig = {
     apiKey: "YOUR_COPIED_API_KEY",
     authDomain: "thebusinesshelper-baccf.firebaseapp.com",
     projectId: "thebusinesshelper-baccf",
     storageBucket: "thebusinesshelper-baccf.appspot.com",
     messagingSenderId: "130384558673",
     appId: "YOUR_COPIED_APP_ID"
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

## Step 3: Enable Authentication Services

1. In the Firebase Console, click "Authentication" in the left sidebar.

2. Click "Get started"

3. Go to the "Sign-in method" tab

4. Enable the following providers:
   - Email/Password: Click "Edit" (pencil icon) and enable it
   - Google: Click "Edit" and enable it
   - GitHub (optional): Click "Edit" and enable it if you want GitHub login

## Step 4: Set Up Firestore Database

1. In the Firebase Console, click "Firestore Database" in the left sidebar.

2. Click "Create database"

3. Select "Start in test mode" (this is fine for development)

4. Choose a location (pick one closest to you)

5. Click "Enable"

## Step 5: Configure Authorized Domains

1. In the Firebase Console, go to "Authentication" > "Sign-in method"

2. Scroll down to "Authorized domains"

3. Add `localhost` to the list (this is needed for local development)

## Step 6: Test Your Setup

1. Save all your changes

2. Start your development server:
   ```bash
   npm start
   ```

3. Open your browser and go to `http://localhost:3000`

4. Try signing up with email/password

5. Try logging in with Google

## Troubleshooting

If you encounter issues:

1. **Check the browser console** for error messages (F12 in most browsers)

2. **Verify your configuration** - make sure all values in firebase-config.js match exactly what Firebase provided

3. **Check that all services are enabled** in Firebase Console

4. **Make sure localhost is in authorized domains**

## Next Steps

Once everything is working:

1. Update Firestore security rules for production use
2. Set up Firebase Hosting for deployment
3. Configure email notifications
4. Add additional features as needed

## Need Help?

If you're still having issues:

1. Open `firebase-setup-guide.html` in your browser for a visual guide
2. Run `node verify-firebase-setup.js` to check your configuration
3. Open `test-firebase-integration.html` to test your integration