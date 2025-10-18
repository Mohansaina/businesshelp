// Review Requests Functions

// Check if user is logged in
document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    if (!token) {
        // If user is not logged in, redirect to login
        window.location.href = 'login.html';
        return;
    }
    
    // Load user businesses
    loadBusinesses();
    
    // Add event listeners for action buttons
    document.querySelectorAll('.btn-small').forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr');
            const customer = row.cells[0].textContent;
            const platform = row.cells[2].textContent;
            showMessage(`Viewing details for ${customer} on ${platform}... In a real application, this would open a modal with review details.`, 'info');
        });
    });
    
    // Add event listeners for AI suggestion actions
    document.querySelectorAll('.suggestion-actions .btn').forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.suggestion-card');
            const customer = card.querySelector('h3').textContent;
            
            if (this.classList.contains('btn-primary')) {
                // Send reply button
                showMessage(`Sending AI-generated reply to ${customer}... In a real application, this would send the message via the connected platform.`, 'success');
            } else if (this.textContent === 'Edit') {
                // Edit button
                showMessage(`Editing reply for ${customer}... In a real application, this would open an editor.`, 'info');
            } else if (this.textContent === 'View Response') {
                // View response button
                showMessage(`Viewing response for ${customer}... In a real application, this would show the sent message.`, 'info');
            }
        });
    });
    
    // Add event listener for send new request button
    const sendRequestBtn = document.querySelector('.user-actions .btn-primary');
    if (sendRequestBtn) {
        sendRequestBtn.addEventListener('click', function() {
            showMessage('Opening new review request form... In a real application, this would open a modal to create a new request.', 'info');
        });
    }
    
    // Add search functionality
    const searchInput = document.querySelector('.search-box input');
    const searchButton = document.querySelector('.search-box .btn');
    
    if (searchButton) {
        searchButton.addEventListener('click', function() {
            const searchTerm = searchInput.value.toLowerCase();
            filterTable(searchTerm);
        });
    }
    
    if (searchInput) {
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                const searchTerm = searchInput.value.toLowerCase();
                filterTable(searchTerm);
            }
        });
    }
    
    // Handle add review form submission
    const addReviewForm = document.getElementById('addReviewForm');
    if (addReviewForm) {
        addReviewForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(addReviewForm);
            const reviewData = {
                businessId: formData.get('businessId'),
                source: formData.get('source'),
                rating: parseInt(formData.get('rating')),
                text: formData.get('reviewText')
            };
            
            // Validation
            if (!reviewData.businessId || !reviewData.source || !reviewData.rating || !reviewData.text) {
                showMessage('Please fill in all fields', 'error');
                return;
            }
            
            // Disable submit button during request
            const submitButton = addReviewForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.textContent = 'Adding Review...';
            
            try {
                // Send review data to backend
                const response = await fetch('/api/reviews', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(reviewData)
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    showMessage('Review added successfully with AI analysis!', 'success');
                    addReviewForm.reset();
                    loadBusinessReviews(reviewData.businessId); // Reload reviews
                } else if (response.status === 401) {
                    // Token expired, redirect to login
                    logout();
                } else {
                    showMessage(data.error || 'Failed to add review', 'error');
                }
            } catch (error) {
                console.error('Error adding review:', error);
                showMessage('An error occurred. Please try again.', 'error');
            } finally {
                // Re-enable submit button
                submitButton.disabled = false;
                submitButton.textContent = originalText;
            }
        });
    }
});

async function loadBusinesses() {
    const token = localStorage.getItem('token');
    
    try {
        // Fetch businesses from backend
        const response = await fetch('/api/businesses', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            populateBusinessDropdown(data.businesses);
        } else if (response.status === 401) {
            // Token expired, redirect to login
            logout();
        } else {
            console.error('Failed to load businesses');
        }
    } catch (error) {
        console.error('Error loading businesses:', error);
    }
}

function populateBusinessDropdown(businesses) {
    const businessSelect = document.getElementById('businessId');
    if (!businessSelect) return;
    
    // Clear existing options
    businessSelect.innerHTML = '';
    
    // Add businesses as options
    businesses.forEach(business => {
        const option = document.createElement('option');
        option.value = business.id;
        option.textContent = business.name;
        businessSelect.appendChild(option);
    });
    
    // If we have businesses, load reviews for the first one
    if (businesses.length > 0) {
        loadBusinessReviews(businesses[0].id);
    }
}

async function loadBusinessReviews(businessId) {
    const token = localStorage.getItem('token');
    
    try {
        // Fetch reviews from backend
        const response = await fetch(`/api/reviews/${businessId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            displayReviews(data.reviews);
        } else if (response.status === 401) {
            // Token expired, redirect to login
            logout();
        } else {
            console.error('Failed to load reviews');
        }
    } catch (error) {
        console.error('Error loading reviews:', error);
    }
}

function displayReviews(reviews) {
    const reviewsContainer = document.querySelector('.recent-reviews');
    if (!reviewsContainer) return;
    
    if (reviews.length === 0) {
        reviewsContainer.innerHTML = '<p>No reviews yet. Add your first review above.</p>';
        return;
    }
    
    let reviewsHTML = '<h3>Recent Reviews</h3>';
    reviews.forEach(review => {
        reviewsHTML += `
            <div class="review-item">
                <div class="review-header">
                    <span class="review-source">${review.source}</span>
                    <span class="review-rating">${'⭐'.repeat(review.rating)}</span>
                </div>
                <p class="review-text">${review.text}</p>
                <div class="review-meta">
                    <span>${new Date(review.created_at).toLocaleDateString()}</span>
                </div>
                ${review.ai_analysis ? `<div class="ai-insight"><strong>AI Analysis:</strong> ${typeof review.ai_analysis === 'string' ? review.ai_analysis : JSON.stringify(review.ai_analysis)}</div>` : ''}
                ${review.ai_reply ? `<div class="suggested-reply"><strong>Suggested Reply:</strong> ${review.ai_reply}</div>` : ''}
            </div>
        `;
    });
    
    reviewsContainer.innerHTML = reviewsHTML;
}

function filterTable(searchTerm) {
    const rows = document.querySelectorAll('.requests-table tbody tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
    
    // Show notification
    if (searchTerm) {
        showNotification(`Found ${document.querySelectorAll('.requests-table tbody tr:not([style*="display: none"])').length} matching requests`, 'info');
    }
}

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
    
    // Add to form or at the top of the content
    const form = document.querySelector('form');
    const content = document.querySelector('.main-content');
    if (form) {
        form.parentNode.insertBefore(messageElement, form);
    } else if (content) {
        content.insertBefore(messageElement, content.firstChild);
    }
    
    // Remove message after 3 seconds
    setTimeout(() => {
        if (messageElement.parentNode) {
            messageElement.remove();
        }
    }, 3000);
}

function showNotification(message, type) {
    // Remove any existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    const style = document.createElement('style');
    style.innerHTML = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 5px;
            color: white;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 1000;
            animation: slideIn 0.3s ease;
        }
        
        .notification-success {
            background: #4caf50;
        }
        
        .notification-info {
            background: #2196f3;
        }
        
        .notification-error {
            background: #f44336;
        }
        
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
        style.remove();
    }, 3000);
}

// Logout function
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}

// Reviews Functions using Firebase

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is authenticated
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in
            loadReviews(user);
        } else {
            // User is signed out, redirect to login
            window.location.href = 'login.html';
        }
    });
    
    // Load reviews from Firebase
    function loadReviews(user) {
        const reviewsList = document.getElementById('reviewsList');
        if (!reviewsList) return;
        
        // Show loading state
        reviewsList.innerHTML = '<p>Loading reviews...</p>';
        
        // Fetch businesses first to get business names
        firebase.firestore().collection('businesses')
            .where('userId', '==', user.uid)
            .get()
            .then((businessSnapshot) => {
                if (businessSnapshot.empty) {
                    reviewsList.innerHTML = '<p>No businesses found. <a href="business.html">Add your first business</a> to start managing reviews.</p>';
                    return;
                }
                
                // Get business IDs
                const businessIds = [];
                const businessMap = {};
                businessSnapshot.forEach((doc) => {
                    businessIds.push(doc.id);
                    businessMap[doc.id] = doc.data().name;
                });
                
                // Fetch reviews for all businesses
                const reviewsQuery = firebase.firestore().collection('reviews')
                    .where('businessId', 'in', businessIds)
                    .orderBy('createdAt', 'desc');
                
                return reviewsQuery.get().then((reviewsSnapshot) => {
                    displayReviews(reviewsSnapshot, businessMap);
                });
            })
            .catch((error) => {
                console.error('Error loading reviews:', error);
                reviewsList.innerHTML = '<p>Error loading reviews. Please try again later.</p>';
            });
    }
    
    // Display reviews in the UI
    function displayReviews(reviewsSnapshot, businessMap) {
        const reviewsList = document.getElementById('reviewsList');
        
        if (reviewsSnapshot.empty) {
            reviewsList.innerHTML = '<p>No reviews found for your businesses.</p>';
            return;
        }
        
        let reviewsHTML = '';
        reviewsSnapshot.forEach((doc) => {
            const review = doc.data();
            const businessName = businessMap[review.businessId] || 'Unknown Business';
            
            reviewsHTML += `
                <div class="review-item">
                    <div class="review-header">
                        <h3>${businessName}</h3>
                        <span class="rating">${'★'.repeat(review.rating)}${'☆'.repeat(5-review.rating)}</span>
                    </div>
                    <div class="review-content">
                        <p><strong>Source:</strong> ${review.source}</p>
                        <p>${review.text}</p>
                        ${review.aiAnalysis ? `<p><strong>AI Analysis:</strong> ${review.aiAnalysis}</p>` : ''}
                        ${review.aiReply ? `<p><strong>Suggested Reply:</strong> ${review.aiReply}</p>` : ''}
                    </div>
                    <div class="review-footer">
                        <span>${review.createdAt ? review.createdAt.toDate().toLocaleDateString() : 'Unknown date'}</span>
                    </div>
                </div>
            `;
        });
        
        reviewsList.innerHTML = reviewsHTML;
    }
    
    // Add a new review
    function addReview() {
        // In a real implementation, this would open a form to add a review
        // For now, we'll just show a message
        alert('In a real implementation, this would open a form to add a new review.');
    }
});
