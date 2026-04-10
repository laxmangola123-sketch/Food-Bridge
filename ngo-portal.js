// NGO Portal JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    const authToken = localStorage.getItem('authToken');
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

    if (!authToken) {
        window.location.href = 'login.html';
        return;
    }

    // Update NGO name
    const ngoNameElement = document.getElementById('ngo-name');
    ngoNameElement.textContent = userInfo.name || 'NGO Partner';

    // Logout functionality
    const logoutButton = document.getElementById('logout-button');
    logoutButton.addEventListener('click', function() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userInfo');
        window.location.href = 'index.html';
    });

    // Filter buttons
    const filterButtons = document.querySelectorAll('.filter-button');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');

            const filter = this.dataset.filter;
            loadNGORequests(filter);
        });
    });

    // Load initial data
    loadDashboardStats();
    loadNGORequests('all');
});

async function loadDashboardStats() {
    const authToken = localStorage.getItem('authToken');

    try {
        const response = await fetch('/api/ngo/stats', {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        const stats = await response.json();

        if (response.ok) {
            document.getElementById('active-requests').textContent = stats.activeRequests || 0;
            document.getElementById('completed-today').textContent = stats.completedToday || 0;
            document.getElementById('people-helped').textContent = stats.peopleHelped || 0;
            document.getElementById('total-donations').textContent = stats.totalDonations || 0;
            document.getElementById('meals-served').textContent = stats.mealsServed || 0;
            document.getElementById('waste-reduced').textContent = `${stats.wasteReduced || 0}kg`;
        }
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

async function loadNGORequests(filter = 'all') {
    const authToken = localStorage.getItem('authToken');

    try {
        const response = await fetch(`/api/ngo/requests?filter=${filter}`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        const requests = await response.json();

        if (response.ok) {
            const requestList = document.getElementById('ngo-request-list');

            if (requests.length === 0) {
                requestList.innerHTML = '<p>No donation requests available.</p>';
            } else {
                requestList.innerHTML = requests.map(request => `
                    <div class="request-card">
                        <div class="request-header">
                            <h4>${request.donorName}'s Donation</h4>
                            <span class="status-badge status-${request.status}">${request.status}</span>
                        </div>

                        <div class="request-content">
                            <div class="request-details">
                                <p><i class="fas fa-map-marker-alt"></i> <strong>Location:</strong> ${request.city}, ${request.landmark}</p>
                                <p><i class="fas fa-phone"></i> <strong>Phone:</strong> ${request.phone}</p>
                                <p><i class="fas fa-clock"></i> <strong>Date:</strong> ${new Date(request.createdAt).toLocaleDateString()}</p>
                            </div>

                            <div class="food-info">
                                ${request.foodName ? `<p><i class="fas fa-utensils"></i> <strong>Food:</strong> ${request.foodName}</p>` : ''}
                                ${request.quantity ? `<p><i class="fas fa-weight"></i> <strong>Quantity:</strong> ${request.quantity}</p>` : ''}
                            </div>

                            <div class="request-media">
                                ${request.imageUrl ? `<img src="${request.imageUrl}" alt="Food donation" class="request-image">` : ''}
                                ${request.videoUrl ? `<video controls class="request-video"><source src="${request.videoUrl}" type="video/mp4"></video>` : ''}
                            </div>

                            ${request.analysis ? `
                                <div class="analysis-summary">
                                    <h5>AI Analysis:</h5>
                                    <div class="analysis-metrics">
                                        <span>Rating: ${request.analysis.rating}</span>
                                        <span>Quality: ${request.analysis.quality}</span>
                                        <span>Freshness: ${request.analysis.freshness}</span>
                                    </div>
                                </div>
                            ` : ''}
                        </div>

                        <div class="request-actions">
                            ${request.status === 'pending' ? `
                                <button class="action-button accept-button" onclick="respondToRequest('${request.id}', 'accepted')">
                                    <i class="fas fa-check"></i> Accept Request
                                </button>
                                <button class="action-button reject-button" onclick="respondToRequest('${request.id}', 'rejected')">
                                    <i class="fas fa-times"></i> Reject Request
                                </button>
                            ` : request.status === 'accepted' ? `
                                <button class="action-button complete-button" onclick="markAsCompleted('${request.id}')">
                                    <i class="fas fa-check-circle"></i> Mark as Completed
                                </button>
                            ` : ''}
                        </div>
                    </div>
                `).join('');
            }
        }
    } catch (error) {
        console.error('Error loading requests:', error);
    }
}

async function respondToRequest(requestId, response) {
    const authToken = localStorage.getItem('authToken');

    try {
        const endpoint = response === 'accepted' ? '/api/ngo/accept' : '/api/ngo/reject';

        const res = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ requestId })
        });

        const data = await res.json();

        if (res.ok) {
            showMessage(`Request ${response} successfully!`, 'success');
            loadNGORequests('all');
            loadDashboardStats();
        } else {
            showMessage(data.message || 'Failed to respond to request', 'error');
        }
    } catch (error) {
        console.error('Response error:', error);
        showMessage('Network error. Please try again.', 'error');
    }
}

async function markAsCompleted(requestId) {
    const authToken = localStorage.getItem('authToken');

    try {
        const response = await fetch('/api/ngo/complete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ requestId })
        });

        const data = await response.json();

        if (response.ok) {
            showMessage('Request marked as completed!', 'success');
            loadNGORequests('all');
            loadDashboardStats();
        } else {
            showMessage(data.message || 'Failed to complete request', 'error');
        }
    } catch (error) {
        console.error('Complete error:', error);
        showMessage('Network error. Please try again.', 'error');
    }
}

function showMessage(message, type) {
    // Create a temporary message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        max-width: 400px;
    `;

    if (type === 'success') {
        messageDiv.style.backgroundColor = '#10b981';
    } else {
        messageDiv.style.backgroundColor = '#ef4444';
    }

    document.body.appendChild(messageDiv);

    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

// ===== NOTIFICATIONS & LOCATION TRACKING =====

// Initialize notifications and location tracking
function initializeNotificationsAndTracking() {
    // Load initial notifications
    loadNotifications();
    
    // Load initial locations
    loadActiveLocations();
    
    // Set up real-time updates
    setInterval(loadNotifications, 5000); // Refresh notifications every 5 seconds
    setInterval(loadActiveLocations, 10000); // Refresh locations every 10 seconds
    
    // Set up refresh button listener
    const refreshBtn = document.getElementById('refresh-locations');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', loadActiveLocations);
    }
}

// Load and display notifications
function loadNotifications() {
    const notificationsList = document.getElementById('notifications-list');
    
    // Simulated notifications data - In production, fetch from server
    const notifications = [
        {
            id: 1,
            title: 'New Food Upload',
            message: 'Fresh vegetables uploaded at Downtown Market',
            time: 'Just now',
            type: 'upload',
            unread: true
        },
        {
            id: 2,
            title: 'Donation Ready',
            message: 'Cooked meals available at Community Kitchen',
            time: '5 mins ago',
            type: 'ready',
            unread: true
        },
        {
            id: 3,
            title: 'Location Nearby',
            message: 'Donor matched: 0.3 km away from your center',
            time: '12 mins ago',
            type: 'nearby',
            unread: false
        },
        {
            id: 4,
            title: 'Pickup Completed',
            message: 'Delivery team collected 50 meals',
            time: '1 hour ago',
            type: 'completed',
            unread: false
        }
    ];
    
    if (notifications.length === 0) {
        notificationsList.innerHTML = `
            <div class="no-notifications">
                <i class="fas fa-inbox"></i>
                <p>No new notifications yet</p>
            </div>
        `;
        return;
    }
    
    notificationsList.innerHTML = notifications.map(notification => `
        <div class="notification-item ${notification.unread ? 'unread' : ''}">
            <div class="notification-icon">
                ${getNotificationIcon(notification.type)}
            </div>
            <div class="notification-content">
                <p class="notification-title">${notification.title}</p>
                <p class="notification-message">${notification.message}</p>
            </div>
            <div class="notification-time">${notification.time}</div>
        </div>
    `).join('');
}

// Get icon based on notification type
function getNotificationIcon(type) {
    const icons = {
        'upload': '<i class="fas fa-upload"></i>',
        'ready': '<i class="fas fa-check-circle"></i>',
        'nearby': '<i class="fas fa-map-location-dot"></i>',
        'completed': '<i class="fas fa-truck"></i>',
        'default': '<i class="fas fa-bell"></i>'
    };
    return icons[type] || icons['default'];
}

// Load and display active locations
function loadActiveLocations() {
    const activeLocationsList = document.getElementById('active-locations');
    const liveDonorsCount = document.getElementById('live-donors-count');
    const activeRoutesCount = document.getElementById('active-routes-count');
    const avgDistance = document.getElementById('avg-distance');
    
    // Simulated locations data - In production, fetch from server with real geolocation
    const locations = [
        {
            id: 1,
            name: 'Donor: Rajesh Kumar',
            address: '123 Downtown Street, Mumbai',
            type: 'donor',
            distance: '0.3 km',
            time: 'Just now'
        },
        {
            id: 2,
            name: 'Donor: Priya Sharma',
            address: '456 Market Lane, Mumbai',
            type: 'donor',
            distance: '0.8 km',
            time: '2 mins ago'
        },
        {
            id: 3,
            name: 'Your NGO Center',
            address: '789 Community Avenue, Mumbai',
            type: 'ngo',
            distance: 'Current',
            time: 'Pinned'
        },
        {
            id: 4,
            name: 'Donor: Amit Patel',
            address: '321 Business Park, Mumbai',
            type: 'donor',
            distance: '1.5 km',
            time: '5 mins ago'
        }
    ];
    
    activeLocationsList.innerHTML = locations.map(location => `
        <div class="location-item">
            <div class="location-icon ${location.type}">
                ${location.type === 'donor' ? '<i class="fas fa-person"></i>' : '<i class="fas fa-building"></i>'}
            </div>
            <div class="location-info">
                <h5>${location.name}</h5>
                <p class="location-address">${location.address}</p>
                <p class="location-time">
                    ${location.type === 'donor' ? '<i class="fas fa-clock"></i>' : '<i class="fas fa-map-pin"></i>'}
                    ${location.time}
                </p>
            </div>
            <div class="location-distance">
                <span class="distance">${location.distance}</span>
            </div>
        </div>
    `).join('');
    
    // Update statistics
    const donorCount = locations.filter(l => l.type === 'donor').length;
    liveDonorsCount.textContent = donorCount;
    activeRoutesCount.textContent = Math.ceil(donorCount / 2);
    
    // Calculate average distance
    const distances = locations
        .filter(l => l.type === 'donor')
        .map(l => parseFloat(l.distance))
        .filter(d => !isNaN(d));
    
    if (distances.length > 0) {
        const avg = (distances.reduce((a, b) => a + b, 0) / distances.length).toFixed(1);
        avgDistance.textContent = avg + ' km';
    }
}

// Start location tracking on page load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize after the main load functions
    setTimeout(() => {
        initializeNotificationsAndTracking();
    }, 1000);
});