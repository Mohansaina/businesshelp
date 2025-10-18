// Settings Functions using Firebase

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is authenticated
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in
            loadUserSettings(user);
            
            // Handle profile update form
            const profileForm = document.getElementById('profileForm');
            if (profileForm) {
                profileForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    updateProfile(user);
                });
            }
        } else {
            // User is signed out, redirect to login
            window.location.href = 'login.html';
        }
    });
    
    // Load user settings from Firebase
    function loadUserSettings(user) {
        // Update user info in the UI
        document.getElementById('userName').textContent = user.displayName || user.email;
        document.getElementById('userEmail').textContent = user.email;
        
        // Load additional user data from Firestore
        firebase.firestore().collection('users').doc(user.uid).get()
            .then((doc) => {
                if (doc.exists) {
                    const userData = doc.data();
                    if (userData.name && document.getElementById('profileName')) {
                        document.getElementById('profileName').value = userData.name;
                    }
                }
            })
            .catch((error) => {
                console.error('Error loading user settings:', error);
            });
    }
    
    // Update user profile
    function updateProfile(user) {
        const name = document.getElementById('profileName').value;
        
        // Show saving state
        const saveBtn = document.querySelector('button[type="submit"]');
        const originalText = saveBtn.textContent;
        saveBtn.textContent = 'Saving...';
        saveBtn.disabled = true;
        
        // Update profile in Firebase Authentication
        const updateProfilePromise = user.updateProfile({
            displayName: name
        });
        
        // Update profile in Firestore
        const updateUserPromise = firebase.firestore().collection('users').doc(user.uid).update({
            name: name,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        // Wait for both updates to complete
        Promise.all([updateProfilePromise, updateUserPromise])
            .then(() => {
                showMessage('Profile updated successfully!', 'success');
            })
            .catch((error) => {
                console.error('Error updating profile:', error);
                showMessage('Error updating profile. Please try again.', 'error');
            })
            .finally(() => {
                saveBtn.textContent = originalText;
                saveBtn.disabled = false;
            });
    }
    
    // Change password
    function changePassword() {
        const user = firebase.auth().currentUser;
        if (!user) return;
        
        const newPassword = prompt('Enter your new password:');
        if (newPassword && newPassword.length >= 6) {
            user.updatePassword(newPassword)
                .then(() => {
                    showMessage('Password updated successfully!', 'success');
                })
                .catch((error) => {
                    console.error('Error updating password:', error);
                    showMessage('Error updating password. Please try again.', 'error');
                });
        } else {
            showMessage('Password must be at least 6 characters long.', 'error');
        }
    }
    
    // Delete account
    function deleteAccount() {
        if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            const user = firebase.auth().currentUser;
            if (!user) return;
            
            // Delete user data from Firestore first
            firebase.firestore().collection('users').doc(user.uid).delete()
                .then(() => {
                    // Delete user from Firebase Authentication
                    return user.delete();
                })
                .then(() => {
                    // Redirect to signup page
                    window.location.href = 'signup.html';
                })
                .catch((error) => {
                    console.error('Error deleting account:', error);
                    showMessage('Error deleting account. Please try again.', 'error');
                });
        }
    }
    
    // Display message to user
    function showMessage(message, type) {
        // Remove any existing messages
        const existingMessage = document.querySelector('.message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create message element
        const messageElement = document.createElement('div');
        messageElement.className = `message ${type}`;
        messageElement.textContent = message;
        
        // Add to form or at the top of the container
        const form = document.querySelector('form');
        const container = document.querySelector('.container');
        
        if (form) {
            form.parentNode.insertBefore(messageElement, form);
        } else if (container) {
            container.prepend(messageElement);
        }
        
        // Remove message after 5 seconds
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.remove();
            }
        }, 5000);
    }
    
    // Make functions available globally
    window.changePassword = changePassword;
    window.deleteAccount = deleteAccount;
});