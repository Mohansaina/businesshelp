// Simplified mock Firebase configuration for demonstration purposes
const firebase = {
  auth: function() {
    return {
      onAuthStateChanged: function(callback) {
        // For demo, we don't need complex state management
        // Just call the callback with null (not authenticated)
        // The auth checks are handled in the specific pages now
        callback(null);
      },
      createUserWithEmailAndPassword: function(email, password) {
        // Simulate successful account creation
        return Promise.resolve({
          user: {
            uid: 'demo-user-id',
            email: email,
            displayName: email.split('@')[0],
            updateProfile: function() { 
              return Promise.resolve(); 
            }
          }
        });
      },
      signInWithEmailAndPassword: function(email, password) {
        // Simulate successful login
        return Promise.resolve({
          user: {
            uid: 'demo-user-id',
            email: email,
            displayName: email.split('@')[0]
          }
        });
      },
      signInWithPopup: function(provider) {
        // Simulate successful social login
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
        // Simulate successful logout
        return Promise.resolve();
      },
      // Getter for current user (simplified for demo)
      get currentUser() {
        // For demo purposes, return null
        // The actual auth state is handled per page
        return null;
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
  // FieldValue with serverTimestamp method
  FieldValue: {
    serverTimestamp: function() {
      return new Date();
    }
  },
  initializeApp: function() { 
    console.log('Mock Firebase initialized for demo'); 
  }
};

// Firebase configuration for your project
// Project: thebusinesshelper (thebusinesshelper-baccf)
// 
// IMPORTANT: Replace these placeholder values with your actual Firebase configuration
// Get your configuration from: 
// https://console.firebase.google.com/project/thebusinesshelper-baccf/settings/general
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
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
