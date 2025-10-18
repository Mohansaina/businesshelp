// Dashboard Functions using Firebase

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is authenticated
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in
            document.getElementById('userName').textContent = user.displayName || user.email;
            loadDashboardData(user);
        } else {
            // User is signed out, redirect to login
            window.location.href = 'login.html';
        }
    });
    
    // Logout button event listener
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            firebase.auth().signOut();
        });
    }
    
    // Load dashboard data from Firebase
    function loadDashboardData(user) {
        // Load user businesses
        loadUserBusinesses(user);
        
        // Load dashboard stats
        loadDashboardStats(user);
    }
    
    // Load user businesses from Firebase
    function loadUserBusinesses(user) {
        const businessesList = document.getElementById('businessesList');
        if (!businessesList) return;
        
        // Show loading state
        businessesList.innerHTML = '<p>Loading businesses...</p>';
        
        // Fetch businesses from Firestore
        firebase.firestore().collection('businesses')
            .where('userId', '==', user.uid)
            .orderBy('createdAt', 'desc')
            .get()
            .then((querySnapshot) => {
                if (querySnapshot.empty) {
                    businessesList.innerHTML = '<p>No businesses found. <a href="business.html">Add your first business</a></p>';
                    return;
                }
                
                let businessesHTML = '';
                querySnapshot.forEach((doc) => {
                    const business = doc.data();
                    businessesHTML += `
                        <div class="business-item">
                            <h3>${business.name}</h3>
                            <p>${business.address || 'No address provided'}</p>
                            <button class="btn btn-small" onclick="viewBusiness('${doc.id}')">View Details</button>
                        </div>
                    `;
                });
                
                businessesList.innerHTML = businessesHTML;
            })
            .catch((error) => {
                console.error('Error loading businesses:', error);
                businessesList.innerHTML = '<p>Error loading businesses. Please try again later.</p>';
            });
    }
    
    // Load dashboard stats from Firebase
    function loadDashboardStats(user) {
        const statsContainer = document.querySelector('.stats-grid');
        if (!statsContainer) return;
        
        // Show loading state
        statsContainer.innerHTML = `
            <div class="stat-card">
                <h3>Loading...</h3>
                <p>Total Reviews</p>
            </div>
            <div class="stat-card">
                <h3>Loading...</h3>
                <p>Average Rating</p>
            </div>
            <div class="stat-card">
                <h3>Loading...</h3>
                <p>Customer Happiness</p>
            </div>
            <div class="stat-card">
                <h3>Loading...</h3>
                <p>Sentiment Score</p>
            </div>
        `;
        
        // In a real implementation, you would calculate these stats from your reviews data
        // For now, we'll simulate with sample data
        setTimeout(() => {
            statsContainer.innerHTML = `
                <div class="stat-card">
                    <h3>24</h3>
                    <p>Total Reviews</p>
                </div>
                <div class="stat-card">
                    <h3>4.2</h3>
                    <p>Average Rating</p>
                </div>
                <div class="stat-card">
                    <h3>78%</h3>
                    <p>Customer Happiness</p>
                </div>
                <div class="stat-card">
                    <h3>6.2</h3>
                    <p>Sentiment Score</p>
                </div>
            `;
        }, 1000);
    }
});

// Function to view business details
function viewBusiness(businessId) {
    // Redirect to business details page
    window.location.href = `business.html?id=${businessId}`;
}

// Function to add a new business
function addBusiness() {
    window.location.href = 'business.html';
}