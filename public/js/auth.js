// Authentication Page Functions

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token && (window.location.pathname.includes('login.html') || window.location.pathname.includes('signup.html'))) {
        // If user is already logged in, redirect to dashboard
        window.location.href = 'dashboard.html';
        return;
    }
    
    // Handle signup form submission
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', async function(e) {
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
            
            try {
                // Send signup request to backend
                const response = await fetch('/api/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: userData.name,
                        email: userData.email,
                        password: userData.password
                    })
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    // Save token to localStorage
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    
                    showMessage('Account created successfully! Redirecting...', 'success');
                    setTimeout(() => {
                        window.location.href = 'dashboard.html';
                    }, 1500);
                } else {
                    showMessage(data.error || 'Signup failed', 'error');
                }
            } catch (error) {
                console.error('Signup error:', error);
                showMessage('An error occurred. Please try again.', 'error');
            } finally {
                // Re-enable submit button
                submitButton.disabled = false;
                submitButton.textContent = originalText;
            }
        });
    }
    
    // Handle login form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
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
            
            try {
                // Send login request to backend
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: credentials.email,
                        password: credentials.password
                    })
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    // Save token to localStorage
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    
                    showMessage('Login successful! Redirecting...', 'success');
                    setTimeout(() => {
                        window.location.href = 'dashboard.html';
                    }, 1500);
                } else {
                    showMessage(data.error || 'Login failed', 'error');
                }
            } catch (error) {
                console.error('Login error:', error);
                showMessage('An error occurred. Please try again.', 'error');
            } finally {
                // Re-enable submit button
                submitButton.disabled = false;
                submitButton.textContent = originalText;
            }
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
            // In a real app, this would initiate GitHub OAuth flow
            showMessage('GitHub login would be initiated here. In a real application, this would redirect to GitHub for authentication.', 'info');
            console.log('GitHub login initiated');
        });
    }
    
    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', function() {
            // In a real app, this would initiate Google OAuth flow
            showMessage('Google login would be initiated here. In a real application, this would redirect to Google for authentication.', 'info');
            console.log('Google login initiated');
        });
    }
});

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
    
    // Add to form
    const form = document.querySelector('form');
    if (form) {
        form.parentNode.insertBefore(messageElement, form);
    }
    
    // Remove message after 3 seconds
    setTimeout(() => {
        if (messageElement.parentNode) {
            messageElement.remove();
        }
    }, 3000);
}

// Logout function
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}