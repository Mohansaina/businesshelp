// Admin Dashboard with Firebase Integration

// Check if user is logged in and is admin
document.addEventListener('DOMContentLoaded', function() {
    // Listen for auth state changes
    firebase.auth().onAuthStateChanged(function(user) {
        if (!user) {
            // If user is not logged in, redirect to login
            window.location.href = 'login.html';
            return;
        }
        
        // Check if user is admin (in a real app, this would be checked against user claims or a role field)
        // For demo purposes, we'll assume the user is admin if they're on this page
        
        // Load user data
        loadUserData(user);
        
        // Load initial data
        loadUsersData();
        loadAdminOrdersData();
        loadAnalyticsData();
        
        // Add event listeners
        setupEventListeners();
    });
});

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

async function loadUsersData() {
    try {
        // Fetch all users from Firestore
        const usersSnapshot = await firebase.firestore().collection('users')
            .orderBy('createdAt', 'desc')
            .get();
        
        const usersTableBody = document.getElementById('usersTableBody');
        
        if (usersSnapshot.empty) {
            usersTableBody.innerHTML = '<tr><td colspan="7" class="no-orders">No users found</td></tr>';
            return;
        }
        
        // Clear the table body
        usersTableBody.innerHTML = '';
        
        // Add users to the table
        for (const doc of usersSnapshot.docs) {
            const user = doc.data();
            
            // Get order count for this user
            const ordersSnapshot = await firebase.firestore().collection('orders')
                .where('userId', '==', doc.id)
                .get();
            
            const row = document.createElement('tr');
            
            // Format dates
            const createdAt = user.createdAt ? new Date(user.createdAt.toDate()).toLocaleDateString() : 'N/A';
            const lastLogin = user.lastLogin ? new Date(user.lastLogin.toDate()).toLocaleDateString() : 'N/A';
            
            row.innerHTML = `
                <td>${doc.id.substring(0, 8)}...</td>
                <td>${user.name || 'N/A'}</td>
                <td>${user.email || 'N/A'}</td>
                <td>${createdAt}</td>
                <td>${lastLogin}</td>
                <td>${ordersSnapshot.size}</td>
                <td>
                    <button class="btn btn-small btn-outline view-user" data-id="${doc.id}">View</button>
                    <button class="btn btn-small btn-primary edit-user" data-id="${doc.id}">Edit</button>
                </td>
            `;
            
            usersTableBody.appendChild(row);
        }
        
        // Add event listeners to action buttons
        document.querySelectorAll('.view-user').forEach(button => {
            button.addEventListener('click', function() {
                const userId = this.getAttribute('data-id');
                viewUser(userId);
            });
        });
        
        document.querySelectorAll('.edit-user').forEach(button => {
            button.addEventListener('click', function() {
                const userId = this.getAttribute('data-id');
                editUser(userId);
            });
        });
    } catch (error) {
        console.error('Error loading users:', error);
        document.getElementById('usersTableBody').innerHTML = '<tr><td colspan="7" class="no-orders">Error loading users</td></tr>';
    }
}

async function loadAdminOrdersData() {
    try {
        // Fetch all orders from Firestore
        const ordersSnapshot = await firebase.firestore().collection('orders')
            .orderBy('createdAt', 'desc')
            .get();
        
        const ordersTableBody = document.getElementById('adminOrdersTableBody');
        
        if (ordersSnapshot.empty) {
            ordersTableBody.innerHTML = '<tr><td colspan="8" class="no-orders">No orders found</td></tr>';
            return;
        }
        
        // Clear the table body
        ordersTableBody.innerHTML = '';
        
        // Add orders to the table
        for (const doc of ordersSnapshot.docs) {
            const order = doc.data();
            
            // Get user name
            let userName = 'Unknown';
            try {
                const userDoc = await firebase.firestore().collection('users').doc(order.userId).get();
                if (userDoc.exists) {
                    userName = userDoc.data().name || userDoc.data().email;
                }
            } catch (e) {
                console.error('Error fetching user:', e);
            }
            
            const row = document.createElement('tr');
            
            // Format date
            const date = order.createdAt ? new Date(order.createdAt.toDate()).toLocaleDateString() : 'N/A';
            
            row.innerHTML = `
                <td>${doc.id.substring(0, 8)}...</td>
                <td>${userName}</td>
                <td>${date}</td>
                <td>${order.customerName || 'N/A'}</td>
                <td>${order.serviceType || 'N/A'}</td>
                <td><span class="status ${order.status || 'pending'}">${order.status || 'Pending'}</span></td>
                <td>$${order.amount ? order.amount.toFixed(2) : '0.00'}</td>
                <td>
                    <button class="btn btn-small btn-outline view-order" data-id="${doc.id}">View</button>
                    <button class="btn btn-small btn-primary edit-order" data-id="${doc.id}">Edit</button>
                </td>
            `;
            
            ordersTableBody.appendChild(row);
        }
        
        // Add event listeners to action buttons
        document.querySelectorAll('.view-order').forEach(button => {
            button.addEventListener('click', function() {
                const orderId = this.getAttribute('data-id');
                viewOrder(orderId);
            });
        });
        
        document.querySelectorAll('.edit-order').forEach(button => {
            button.addEventListener('click', function() {
                const orderId = this.getAttribute('data-id');
                editOrder(orderId);
            });
        });
    } catch (error) {
        console.error('Error loading orders:', error);
        document.getElementById('adminOrdersTableBody').innerHTML = '<tr><td colspan="8" class="no-orders">Error loading orders</td></tr>';
    }
}

async function loadAnalyticsData() {
    try {
        // Get total users
        const usersSnapshot = await firebase.firestore().collection('users').get();
        const totalUsers = usersSnapshot.size;
        
        // Get total orders and revenue
        const ordersSnapshot = await firebase.firestore().collection('orders').get();
        let totalOrders = 0;
        let totalRevenue = 0;
        
        ordersSnapshot.forEach(doc => {
            const order = doc.data();
            totalOrders++;
            totalRevenue += order.amount || 0;
        });
        
        // Calculate average order value
        const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
        
        // Update UI
        document.getElementById('totalUsers').textContent = totalUsers;
        document.getElementById('totalOrders').textContent = totalOrders;
        document.getElementById('totalRevenue').textContent = `$${totalRevenue.toFixed(2)}`;
        document.getElementById('avgOrderValue').textContent = `$${avgOrderValue.toFixed(2)}`;
    } catch (error) {
        console.error('Error loading analytics:', error);
    }
}

function setupEventListeners() {
    // Tab switching
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', function() {
            const tab = this.getAttribute('data-tab');
            
            // Remove active class from all tabs
            document.querySelectorAll('.tab-button').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Hide all tab contents
            document.querySelectorAll('.admin-tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Show corresponding tab content
            document.getElementById(`${tab}-tab`).classList.add('active');
        });
    });
    
    // Refresh button
    const refreshBtn = document.getElementById('refreshData');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            const activeTab = document.querySelector('.tab-button.active').getAttribute('data-tab');
            
            if (activeTab === 'users') {
                loadUsersData();
            } else if (activeTab === 'orders') {
                loadAdminOrdersData();
            } else if (activeTab === 'analytics') {
                loadAnalyticsData();
            }
        });
    }
}

function viewUser(userId) {
    // In a real implementation, this would show user details
    alert('View user: ' + userId);
}

function editUser(userId) {
    // In a real implementation, this would open an edit form
    alert('Edit user: ' + userId);
}

function viewOrder(orderId) {
    // In a real implementation, this would show order details
    alert('View order: ' + orderId);
}

function editOrder(orderId) {
    // In a real implementation, this would open an edit form
    alert('Edit order: ' + orderId);
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