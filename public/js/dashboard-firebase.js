// Dashboard Functions with Firebase Integration

// Simplified version for demo - assume user is authenticated
document.addEventListener('DOMContentLoaded', function() {
    // For demo purposes, we'll assume user is authenticated if they reach the dashboard
    console.log('Dashboard loaded - assuming user is authenticated for demo');
    
    // Show welcome message
    showWelcomeMessage();
    
    // Load user data with demo values
    loadUserData({
        displayName: 'Demo User',
        email: 'demo@example.com'
    });
    
    // Initialize dashboard components
    initializeCharts();
    loadDashboardData('demo-user-id');
    
    // Add event listeners for interactive elements
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', function(e) {
            // Remove active class from all links
            document.querySelectorAll('.nav-menu a').forEach(el => {
                el.classList.remove('active');
            });
            
            // Add active class to clicked link
            this.classList.add('active');
        });
    });
    
    // Add logout event listener
    const logoutBtn = document.querySelector('.user-actions .btn-outline');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            logout();
        });
    }
});

function showWelcomeMessage() {
    // Create welcome message element
    const welcomeElement = document.createElement('div');
    welcomeElement.className = 'message success';
    welcomeElement.textContent = 'Welcome back! You have been successfully logged in.';
    welcomeElement.style.marginBottom = '20px';
    
    // Add to dashboard header
    const dashboardHeader = document.querySelector('.dashboard-header');
    if (dashboardHeader) {
        dashboardHeader.parentNode.insertBefore(welcomeElement, dashboardHeader);
        
        // Remove message after 5 seconds
        setTimeout(() => {
            if (welcomeElement.parentNode) {
                welcomeElement.remove();
            }
        }, 5000);
    }
}

function loadUserData(user) {
    if (user) {
        // Update user display name
        const userNameElement = document.getElementById('userName');
        if (userNameElement) {
            userNameElement.textContent = user.displayName || user.email.split('@')[0];
        }
        
        // Update avatar initials
        const avatarElement = document.getElementById('userAvatar');
        if (avatarElement) {
            const name = user.displayName || user.email.split('@')[0];
            const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
            avatarElement.textContent = initials;
        }
    }
}

function loadDashboardData(uid) {
    // Use demo data
    const demoBusinessData = {
        name: 'Demo Business',
        phone: '(555) 123-4567',
        address: '123 Main St, City, State 12345',
        googleId: 'demo-google-id'
    };
    
    updateBusinessInfo(demoBusinessData);
    
    // Use demo stats
    updateStats({
        totalReviews: 1248,
        averageRating: 4.7,
        customerHappiness: 89,
        sentimentScore: 8.2
    });
    
    // Initialize charts with demo data
    initializeCharts();
}

function updateBusinessInfo(businessData) {
    // Update business information display
    if (businessData) {
        document.getElementById('businessName').textContent = businessData.name || 'Not set';
        document.getElementById('businessPhone').textContent = businessData.phone || 'Not set';
        document.getElementById('businessAddress').textContent = businessData.address || 'Not set';
        document.getElementById('googleId').textContent = businessData.googleId || 'Not set';
    }
}

function updateStats(stats) {
    // Update stats with demo data
    if (stats) {
        document.getElementById('totalReviews').textContent = stats.totalReviews;
        document.getElementById('averageRating').textContent = stats.averageRating;
        document.getElementById('customerHappiness').textContent = `${stats.customerHappiness}%`;
        document.getElementById('sentimentScore').textContent = `${stats.sentimentScore}/10`;
    }
    
    // Add animation to stat cards
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'all 0.5s ease';
            
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100);
        }, index * 100);
    });
}

function initializeCharts(stats) {
    // In a real app, this would initialize charting libraries like Chart.js
    console.log('Initializing dashboard charts...');
    
    // For demo purposes, we'll just animate the sentiment chart
    const chartBars = document.querySelectorAll('.chart-bar');
    chartBars.forEach(bar => {
        const height = bar.style.height;
        bar.style.height = '0';
        setTimeout(() => {
            bar.style.height = height;
            bar.style.transition = 'height 1s ease';
        }, 300);
    });
}

// Simplified logout function for demo
function logout() {
    window.location.href = 'login.html';
}