// Test Firebase Configuration
// This file is used to verify that Firebase is properly configured

// Check if Firebase is loaded
if (typeof firebase === 'undefined') {
    console.error('Firebase SDK not loaded');
    document.getElementById('status').innerHTML = '<p style="color: red;">Firebase SDK not loaded</p>';
} else {
    console.log('Firebase SDK loaded successfully');
    
    // Check if firebaseConfig exists and has been updated
    if (typeof firebaseConfig !== 'undefined' && 
        firebaseConfig.apiKey !== 'YOUR_ACTUAL_API_KEY' &&
        firebaseConfig.apiKey !== 'your_api_key_here') {
        
        try {
            // Initialize Firebase
            firebase.initializeApp(firebaseConfig);
            
            // Initialize Firebase Authentication and Firestore
            const auth = firebase.auth();
            const db = firebase.firestore();
            
            console.log('Firebase initialized successfully');
            document.getElementById('status').innerHTML = '<p style="color: green;">Firebase initialized successfully!</p>';
            document.getElementById('result').innerHTML = '<p>Firebase Auth and Firestore are ready to use.</p>';
            
            // Test Firestore connection
            db.collection('test').limit(1).get()
                .then(() => {
                    console.log('Firestore connection successful');
                })
                .catch((error) => {
                    console.warn('Firestore connection test failed (may be due to security rules):', error);
                });
                
        } catch (error) {
            console.error('Firebase initialization error:', error);
            document.getElementById('status').innerHTML = '<p style="color: red;">Firebase initialization failed:</p>';
            document.getElementById('result').innerHTML = '<p>' + error.message + '</p>';
        }
    } else {
        console.warn('Firebase configuration not updated. Please update firebaseConfig in firebase-config.js');
        document.getElementById('status').innerHTML = '<p style="color: orange;">Firebase configuration not updated</p>';
        document.getElementById('result').innerHTML = '<p>Please update the firebaseConfig object in public/js/firebase-config.js with your actual Firebase configuration.</p>';
    }
}