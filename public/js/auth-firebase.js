// Authentication Functions using Firebase

document.addEventListener('DOMContentLoaded', function() {
    // Check auth state
    firebase.auth().onAuthStateChanged(function(user) {
        if (user && window.location.pathname.includes('dashboard.html')) {
            // User is signed in and on dashboard
            console.log('User is authenticated:', user.email);
        } else if (!user && (window.location.pathname.includes('dashboard.html') || 
                             window.location.pathname.includes('business.html') ||
                             window.location.pathname.includes('analytics.html') ||
                             window.location.pathname.includes('orders.html') ||
                             window.location.pathname.includes('reviews.html') ||
                             window.location.pathname.includes('settings.html'))) {
            // User is not signed in but trying to access protected pages
            window.location.href = 'login.html';
        }
    });
    
    // Handle signup form submission
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(signupForm);
            const userData = {
                name: formData.get('name'),
                email: formData.get('email'),
                password: formData.get('password'),
                confirmPassword: formData.get('confirmPassword')
            };
            
            // Simple validation
            if (userData.password !== userData.confirmPassword) {
                showMessage('Passwords do not match!', 'error');
                return;
            }
            
            if (userData.password.length < 6) {
                showMessage('Password must be at least 6 characters long!', 'error');
                return;
            }
            
            // Disable submit button during request
            const submitButton = signupForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.textContent = 'Creating account...';
            
            // Create user with Firebase
            firebase.auth().createUserWithEmailAndPassword(userData.email, userData.password)
                .then((userCredential) => {
                    // Update user profile with display name
                    return userCredential.user.updateProfile({
                        displayName: userData.name
                    });
                })
                .then(() => {
                    // Save additional user data to Firestore
                    const user = firebase.auth().currentUser;
                    return firebase.firestore().collection('users').doc(user.uid).set({
                        name: userData.name,
                        email: userData.email,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp()
                    });
                })
                .then(() => {
                    showMessage('Account created successfully! Redirecting...', 'success');
                    
                    // Redirect to dashboard after a short delay
                    setTimeout(() => {
                        window.location.href = 'dashboard.html';
                    }, 2000);
                })
                .catch((error) => {
                    console.error('Signup error:', error);
                    showMessage(error.message || 'Signup failed. Please try again.', 'error');
                })
                .finally(() => {
                    // Re-enable submit button
                    submitButton.disabled = false;
                    submitButton.textContent = originalText;
                });
        });
    }
    
    // Handle login form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(loginForm);
            const credentials = {
                email: formData.get('email'),
                password: formData.get('password')
            };
            
            // Disable submit button during request
            const submitButton = loginForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.textContent = 'Logging in...';
            
            // Sign in with Firebase
            firebase.auth().signInWithEmailAndPassword(credentials.email, credentials.password)
                .then((userCredential) => {
                    showMessage('Login successful! Redirecting...', 'success');
                    
                    // Redirect to dashboard after a short delay
                    setTimeout(() => {
                        window.location.href = 'dashboard.html';
                    }, 2000);
                })
                .catch((error) => {
                    console.error('Login error:', error);
                    showMessage(error.message || 'Login failed. Please check your credentials.', 'error');
                })
                .finally(() => {
                    // Re-enable submit button
                    submitButton.disabled = false;
                    submitButton.textContent = originalText;
                });
        });
    }
    
    // Add focus effects to form inputs
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });
    
    // Add event listeners for social login buttons
    const githubLoginBtn = document.getElementById('githubLogin');
    const googleLoginBtn = document.getElementById('googleLogin');
    
    if (githubLoginBtn) {
        githubLoginBtn.addEventListener('click', function() {
            const provider = new firebase.auth.GithubAuthProvider();
            firebase.auth().signInWithPopup(provider)
                .then((result) => {
                    showMessage('GitHub login successful! Welcome back! Redirecting...', 'success');
                    setTimeout(() => {
                        window.location.href = 'dashboard.html';
                    }, 2000);
                })
                .catch((error) => {
                    console.error('GitHub login error:', error);
                    showMessage(error.message || 'GitHub login failed.', 'error');
                });
        });
    }
    
    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', function() {
            const provider = new firebase.auth.GoogleAuthProvider();
            firebase.auth().signInWithPopup(provider)
                .then((result) => {
                    // Save user data to Firestore if new user
                    const user = result.user;
                    firebase.firestore().collection('users').doc(user.uid).set({
                        name: user.displayName,
                        email: user.email,
                        photoURL: user.photoURL,
                        lastLogin: firebase.firestore.FieldValue.serverTimestamp()
                    }, { merge: true })
                    .then(() => {
                        showMessage('Google login successful! Welcome back! Redirecting...', 'success');
                        setTimeout(() => {
                            window.location.href = 'dashboard.html';
                        }, 2000);
                    });
                })
                .catch((error) => {
                    console.error('Google login error:', error);
                    showMessage(error.message || 'Google login failed.', 'error');
                });
        });
    }
});

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
    const container = document.querySelector('.auth-container');
    
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

// Logout function
function logout() {
    firebase.auth().signOut()
        .then(() => {
            window.location.href = 'login.html';
        })
        .catch((error) => {
            console.error('Logout error:', error);
            // Even if there's an error, redirect to login
            window.location.href = 'login.html';
        });
}