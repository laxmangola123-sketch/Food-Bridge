// Donor Portal JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    const authToken = localStorage.getItem('authToken');
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

    if (!authToken) {
        window.location.href = 'login.html';
        return;
    }

    // Update user name
    const userNameElement = document.getElementById('user-name');
    userNameElement.textContent = userInfo.name || 'Donor';

    // Logout functionality
    const logoutButton = document.getElementById('logout-button');
    logoutButton.addEventListener('click', function() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userInfo');
        window.location.href = 'index.html';
    });

    // File preview functionality
    const imageInput = document.getElementById('food-image');
    const videoInput = document.getElementById('food-video');
    const imagePreview = document.getElementById('image-preview');
    const videoPreview = document.getElementById('video-preview');

    imageInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                imagePreview.innerHTML = `
                    <div class="preview-item">
                        <img src="${e.target.result}" alt="Food preview" style="max-width: 200px; max-height: 200px; border-radius: 8px;">
                        <p>${file.name}</p>
                    </div>
                `;
            };
            reader.readAsDataURL(file);
        }
    });

    videoInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            videoPreview.innerHTML = `
                <div class="preview-item">
                    <video controls style="max-width: 200px; max-height: 200px; border-radius: 8px;">
                        <source src="${URL.createObjectURL(file)}" type="${file.type}">
                    </video>
                    <p>${file.name}</p>
                </div>
            `;
        }
    });

    // Form submission
    const donorForm = document.getElementById('donor-form');
    donorForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', document.getElementById('donor-name').value);
        formData.append('phone', document.getElementById('donor-phone').value);
        formData.append('city', document.getElementById('donor-city').value);
        formData.append('landmark', document.getElementById('donor-landmark').value);
        formData.append('foodName', document.getElementById('food-name').value);
        formData.append('quantity', document.getElementById('food-quantity').value);
        formData.append('image', imageInput.files[0]);
        formData.append('video', videoInput.files[0]);
        formData.append('confirmReal', document.getElementById('confirm-real').checked);

        try {
            const response = await fetch('/api/donations', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                },
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                showMessage('Donation request submitted successfully!', 'success');
                document.getElementById('analysis-result').classList.remove('hidden');

                // Update analysis results
                document.getElementById('rating-value').textContent = data.analysis.rating || 'N/A';
                document.getElementById('quality-value').textContent = data.analysis.quality || 'N/A';
                document.getElementById('quantity-value').textContent = data.analysis.quantity || 'N/A';
                document.getElementById('freshness-value').textContent = data.analysis.freshness || 'N/A';
                document.getElementById('poison-value').textContent = data.analysis.safety || 'N/A';

                // Show nearby NGOs
                if (data.nearbyNGOs && data.nearbyNGOs.length > 0) {
                    const ngoList = document.getElementById('nearby-ngos');
                    ngoList.innerHTML = '<h4>Nearby NGOs:</h4>' +
                        data.nearbyNGOs.map(ngo => `<p>${ngo.name} - ${ngo.distance}km away</p>`).join('');
                }

                // Reset form
                donorForm.reset();
                imagePreview.innerHTML = '';
                videoPreview.innerHTML = '';

                // Reload requests
                loadDonorRequests();
            } else {
                showMessage(data.message || 'Failed to submit donation', 'error');
            }
        } catch (error) {
            console.error('Donation error:', error);
            showMessage('Network error. Please try again.', 'error');
        }
    });

    // Load donor requests
    loadDonorRequests();
});

async function loadDonorRequests() {
    const authToken = localStorage.getItem('authToken');

    try {
        const response = await fetch('/api/donations/my', {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        const requests = await response.json();

        if (response.ok) {
            const requestList = document.getElementById('donor-request-list');
            if (requests.length === 0) {
                requestList.innerHTML = '<p>No donation requests yet.</p>';
            } else {
                requestList.innerHTML = requests.map(request => `
                    <div class="request-card">
                        <h4>${request.foodType || 'Food Donation'}</h4>
                        <p><strong>Location:</strong> ${request.city}, ${request.landmark}</p>
                        <p><strong>Status:</strong> <span class="status-${request.status}">${request.status}</span></p>
                        <p><strong>Date:</strong> ${new Date(request.createdAt).toLocaleDateString()}</p>
                        ${request.ngoResponse ? `<p><strong>NGO Response:</strong> ${request.ngoResponse}</p>` : ''}
                    </div>
                `).join('');
            }
        }
    } catch (error) {
        console.error('Error loading requests:', error);
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