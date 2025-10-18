// Test Firebase Connection
// This script tests if Firebase is properly configured and connected

console.log('Testing Firebase configuration...');

// Check if Firebase is loaded
if (typeof firebase === 'undefined') {
    console.error('❌ Firebase SDK not loaded');
    document.getElementById('status').innerHTML = '<p style="color: red;">Firebase SDK not loaded</p>';
} else {
    console.log('✅ Firebase SDK loaded successfully');
    
    // Check if firebaseConfig exists
    if (typeof firebaseConfig === 'undefined') {
        console.error('❌ firebaseConfig not found');
        document.getElementById('status').innerHTML = '<p style="color: red;">firebaseConfig not found in firebase-config.js</p>';
    } else {
        console.log('✅ firebaseConfig found');
        
        // Check if config has been updated from default
        if (firebaseConfig.apiKey === 'AIzaSyB0ufR1Rr1bZJw5qJrX1bZJw5qJrX1bZJw5' ||
            firebaseConfig.apiKey === 'YOUR_API_KEY' ||
            firebaseConfig.apiKey === 'your_api_key_here') {
            console.warn('⚠️ Firebase configuration appears to be using default values. Please update with your actual Firebase configuration.');
            document.getElementById('status').innerHTML = '<p style="color: orange;">Firebase configuration found but may be using default values. Please update firebase-config.js with your actual Firebase configuration.</p>';
        } else {
            try {
                // Initialize Firebase
                firebase.initializeApp(firebaseConfig);
                console.log('✅ Firebase initialized successfully');
                
                // Initialize Firebase Authentication and Firestore
                const auth = firebase.auth();
                const db = firebase.firestore();
                
                console.log('✅ Firebase Authentication and Firestore initialized');
                document.getElementById('status').innerHTML = '<p style="color: green;">Firebase initialized successfully!</p>';
                document.getElementById('result').innerHTML = '<p>Firebase Auth and Firestore are ready to use.</p>';
                
                // Test Firestore connection
                db.collection('test').limit(1).get()
                    .then(() => {
                        console.log('✅ Firestore connection test successful');
                    })
                    .catch((error) => {
                        // This might fail due to security rules, which is expected
                        if (error.code === 'permission-denied') {
                            console.log('⚠️ Firestore connection test returned permission denied (this is expected if security rules are configured)');
                        } else {
                            console.warn('⚠️ Firestore connection test failed:', error.message);
                        }
                    });
                
            } catch (error) {
                console.error('❌ Firebase initialization error:', error);
                document.getElementById('status').innerHTML = '<p style="color: red;">Firebase initialization failed: ' + error.message + '</p>';
            }
        }
    }
}