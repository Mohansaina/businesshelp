// Business Functions using Firebase

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is authenticated
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in
            initializeBusinessPage(user);
        } else {
            // User is signed out, redirect to login
            window.location.href = 'login.html';
        }
    });
    
    function initializeBusinessPage(user) {
        // Check if we're editing an existing business or creating a new one
        const urlParams = new URLSearchParams(window.location.search);
        const businessId = urlParams.get('id');
        
        if (businessId) {
            // Load existing business data
            loadBusinessData(user, businessId);
        }
        
        // Handle form submission
        const businessForm = document.getElementById('businessForm');
        if (businessForm) {
            businessForm.addEventListener('submit', function(e) {
                e.preventDefault();
                saveBusiness(user, businessId);
            });
        }
    }
    
    // Load business data from Firebase
    function loadBusinessData(user, businessId) {
        firebase.firestore().collection('businesses')
            .doc(businessId)
            .get()
            .then((doc) => {
                if (doc.exists && doc.data().userId === user.uid) {
                    const business = doc.data();
                    document.getElementById('businessName').value = business.name || '';
                    document.getElementById('businessPhone').value = business.phone || '';
                    document.getElementById('businessAddress').value = business.address || '';
                    document.getElementById('businessGoogleId').value = business.googleId || '';
                    
                    // Update page title
                    document.querySelector('.page-title').textContent = `Edit Business: ${business.name}`;
                } else {
                    showMessage('Business not found or access denied.', 'error');
                }
            })
            .catch((error) => {
                console.error('Error loading business:', error);
                showMessage('Error loading business data. Please try again.', 'error');
            });
    }
    
    // Save business data to Firebase
    function saveBusiness(user, businessId) {
        const businessData = {
            name: document.getElementById('businessName').value,
            phone: document.getElementById('businessPhone').value,
            address: document.getElementById('businessAddress').value,
            googleId: document.getElementById('businessGoogleId').value,
            userId: user.uid,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        // Show saving state
        const saveBtn = document.querySelector('button[type="submit"]');
        const originalText = saveBtn.textContent;
        saveBtn.textContent = 'Saving...';
        saveBtn.disabled = true;
        
        let savePromise;
        
        if (businessId) {
            // Update existing business
            businessData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
            savePromise = firebase.firestore().collection('businesses').doc(businessId).update(businessData);
        } else {
            // Create new business
            businessData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
            savePromise = firebase.firestore().collection('businesses').add(businessData);
        }
        
        savePromise
            .then(() => {
                showMessage(businessId ? 'Business updated successfully!' : 'Business created successfully!', 'success');
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 2000);
            })
            .catch((error) => {
                console.error('Error saving business:', error);
                showMessage('Error saving business. Please try again.', 'error');
            })
            .finally(() => {
                saveBtn.textContent = originalText;
                saveBtn.disabled = false;
            });
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
});