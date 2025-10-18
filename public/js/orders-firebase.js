// Orders Management Functions with Firebase Integration

document.addEventListener('DOMContentLoaded', function() {
    // Check authentication state
    firebase.auth().onAuthStateChanged(function(user) {
        if (!user) {
            // If user is not logged in, redirect to login
            window.location.href = 'login.html';
            return;
        }
        
        // Load orders data
        loadOrdersData(user.uid);
        
        // Add event listeners
        const orderForm = document.getElementById('orderForm');
        if (orderForm) {
            orderForm.addEventListener('submit', function(e) {
                e.preventDefault();
                createOrder(user.uid);
            });
        }
        
        const closeModalBtn = document.querySelector('.modal .close');
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', closeOrderModal);
        }
        
        // Close modal when clicking outside
        const modal = document.getElementById('orderModal');
        if (modal) {
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    closeOrderModal();
                }
            });
        }
    });
});

async function loadOrdersData(userId) {
    try {
        // In a real implementation, this would fetch from Firestore
        // For demo, we'll simulate data
        const orders = [
            {
                id: '1',
                customerName: 'John Smith',
                serviceType: 'Review Request',
                amount: 29.99,
                status: 'completed',
                createdAt: new Date()
            },
            {
                id: '2',
                customerName: 'Sarah Johnson',
                serviceType: 'Review Analysis',
                amount: 49.99,
                status: 'pending',
                createdAt: new Date()
            },
            {
                id: '3',
                customerName: 'Mike Davis',
                serviceType: 'Reputation Management',
                amount: 99.99,
                status: 'processing',
                createdAt: new Date()
            }
        ];
        
        displayOrders(orders);
    } catch (error) {
        console.error('Error loading orders:', error);
        showMessage('Error loading orders: ' + error.message, 'error');
    }
}

function displayOrders(orders) {
    const ordersList = document.getElementById('ordersList');
    if (!ordersList) return;
    
    if (orders.length === 0) {
        ordersList.innerHTML = '<p>No orders found.</p>';
        return;
    }
    
    ordersList.innerHTML = orders.map(order => `
        <div class="order-item">
            <div class="order-header">
                <h3>${order.customerName}</h3>
                <span class="status ${order.status}">${order.status}</span>
            </div>
            <div class="order-details">
                <p><strong>Service:</strong> ${order.serviceType}</p>
                <p><strong>Amount:</strong> $${order.amount.toFixed(2)}</p>
                <p><strong>Date:</strong> ${order.createdAt.toLocaleDateString()}</p>
            </div>
            <div class="order-actions">
                <button class="btn btn-outline" onclick="viewOrder('${order.id}')">View</button>
                <button class="btn btn-primary" onclick="editOrder('${order.id}')">Edit</button>
            </div>
        </div>
    `).join('');
}

async function createOrder(userId) {
    try {
        const form = document.getElementById('orderForm');
        const formData = new FormData(form);
        
        const orderData = {
            userId: userId,
            customerName: formData.get('customerName'),
            serviceType: formData.get('serviceType'),
            amount: parseFloat(formData.get('orderAmount')),
            notes: formData.get('orderNotes'),
            status: 'pending',
            createdAt: firebase.FieldValue.serverTimestamp()  // Fixed: Use firebase.FieldValue instead of firebase.firestore.FieldValue
        };
        
        // Close modal and reset form
        closeOrderModal();
        
        // Show success message
        showMessage('Order created successfully!', 'success');
        
        // Reload orders
        loadOrdersData(userId);
    } catch (error) {
        console.error('Error creating order:', error);
        showMessage('Error creating order: ' + error.message, 'error');
    }
}

function viewOrder(orderId) {
    // In a real implementation, this would show order details
    alert('View order: ' + orderId);
}

function editOrder(orderId) {
    // In a real implementation, this would open an edit form
    alert('Edit order: ' + orderId);
}

function showMessage(message, type) {
    // Create or update message element
    let messageElement = document.querySelector('.message');
    if (!messageElement) {
        messageElement = document.createElement('div');
        messageElement.className = 'message';
        document.body.appendChild(messageElement);
    }
    
    messageElement.textContent = message;
    messageElement.className = `message ${type}`;
    
    // Remove message after 3 seconds
    setTimeout(() => {
        messageElement.remove();
    }, 3000);
}

// Modal functions
function openOrderModal() {
    const modal = document.getElementById('orderModal');
    if (modal) {
        modal.style.display = 'block';
    }
}

function closeOrderModal() {
    const modal = document.getElementById('orderModal');
    if (modal) {
        modal.style.display = 'none';
        // Reset form
        const form = document.getElementById('orderForm');
        if (form) {
            form.reset();
        }
    }
}

// Logout function
function logout() {
    firebase.auth().signOut().then(() => {
        // Sign-out successful
        window.location.href = 'login.html';
    }).catch((error) => {
        // An error happened
        console.error('Logout error:', error);
    });
}