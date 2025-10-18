// Analytics Functions

document.addEventListener('DOMContentLoaded', function() {
    // Initialize charts
    initializeCharts();
    
    // Add event listeners for date range selector
    const dateRangeSelect = document.getElementById('dateRange');
    if (dateRangeSelect) {
        dateRangeSelect.addEventListener('change', function() {
            const selectedRange = this.value;
            updateAnalyticsData(selectedRange);
        });
    }
    
    // Add event listeners for chart period buttons
    const periodButtons = document.querySelectorAll('.chart-actions .btn');
    periodButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            periodButtons.forEach(btn => btn.classList.remove('btn-primary'));
            periodButtons.forEach(btn => btn.classList.add('btn-outline'));
            
            // Add active class to clicked button
            this.classList.remove('btn-outline');
            this.classList.add('btn-primary');
            
            // Update chart data
            const period = this.textContent.toLowerCase();
            updateChartData(period);
        });
    });
});

function initializeCharts() {
    // Animate bar chart bars
    const bars = document.querySelectorAll('.chart-bar');
    bars.forEach((bar, index) => {
        const height = bar.style.height;
        bar.style.height = '0';
        setTimeout(() => {
            bar.style.height = height;
            bar.style.transition = 'height 1s ease';
        }, 300 + (index * 200));
    });
    
    console.log('Analytics charts initialized');
}

function updateAnalyticsData(dateRange) {
    // In a real app, this would fetch new data based on the selected date range
    console.log(`Updating analytics data for: ${dateRange}`);
    
    // Show loading state
    showLoadingState();
    
    // Simulate API call delay
    setTimeout(() => {
        // Update stats with new data
        updateStats();
        
        // Update charts
        updateCharts();
        
        // Hide loading state
        hideLoadingState();
        
        showNotification(`Analytics updated for ${dateRange}`, 'success');
    }, 800);
}

function updateStats() {
    // In a real app, this would update the stats with new data
    console.log('Updating statistics');
    
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

function updateCharts() {
    // In a real app, this would update the charts with new data
    console.log('Updating charts');
    
    // Re-animate bar chart
    initializeCharts();
}

function updateChartData(period) {
    // In a real app, this would update the chart data based on the selected period
    console.log(`Updating chart data for: ${period}`);
    
    showNotification(`Chart updated for ${period} view`, 'info');
}

function showLoadingState() {
    // Create and show loading indicator
    const loading = document.createElement('div');
    loading.id = 'analytics-loading';
    loading.innerHTML = `
        <div class="loading-content">
            <div class="spinner"></div>
            <span>Updating analytics...</span>
        </div>
    `;
    
    // Add styles for loading indicator
    const style = document.createElement('style');
    style.innerHTML = `
        #analytics-loading {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2000;
        }
        
        .loading-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 15px;
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }
        
        .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #f3f3f3;
            border-top: 4px solid #4361ee;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(loading);
}

function hideLoadingState() {
    const loading = document.getElementById('analytics-loading');
    const style = document.querySelector('style');
    if (loading) {
        loading.remove();
    }
    if (style) {
        style.remove();
    }
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