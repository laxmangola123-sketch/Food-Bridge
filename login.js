// Login page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Get selected role from localStorage or default to donor
    const selectedRole = localStorage.getItem('selectedRole') || 'donor';
    updateRoleDisplay(selectedRole);

    // Tab switching
    const loginTab = document.getElementById('login-tab');
    const signupTab = document.getElementById('signup-tab');
    const nameGroup = document.getElementById('name-group');
    const submitButton = document.getElementById('auth-submit');

    loginTab.addEventListener('click', function() {
        loginTab.classList.add('active');
        signupTab.classList.remove('active');
        nameGroup.classList.add('hidden');
        submitButton.textContent = 'Login';
    });

    signupTab.addEventListener('click', function() {
        signupTab.classList.add('active');
        loginTab.classList.remove('active');
        nameGroup.classList.remove('hidden');
        submitButton.textContent = 'Sign Up';
    });

    // Form submission
    const authForm = document.getElementById('auth-form');
    authForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const isSignup = signupTab.classList.contains('active');
        const email = document.getElementById('auth-email').value;
        const password = document.getElementById('auth-password').value;
        const name = document.getElementById('auth-name').value;
        const currentRole = localStorage.getItem('selectedRole') || 'donor';

        try {
            const endpoint = isSignup ? '/api/auth/register' : '/api/auth/login';
            const body = isSignup
                ? { email, password, name, role: currentRole }
                : { email, password, role: currentRole };

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            const data = await response.json();

            if (response.ok) {
                // Store auth token and user info
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('userInfo', JSON.stringify(data.user));

                // Show success message
                showMessage('Login successful! Redirecting...', 'success');

                // Redirect to appropriate portal
                setTimeout(() => {
                    const role = data.user.role || currentRole;
                    if (role === 'donor') {
                        window.location.href = 'donor-portal.html';
                    } else {
                        window.location.href = 'ngo-portal.html';
                    }
                }, 1500);
            } else {
                showMessage(data.message || 'Authentication failed', 'error');
            }
        } catch (error) {
            console.error('Auth error:', error);
            showMessage('Network error. Please try again.', 'error');
        }
    });
});

function updateRoleDisplay(role) {
    const roleIndicator = document.getElementById('current-role');
    const donorButton = document.querySelector('.role-button.donor-role');
    const ngoButton = document.querySelector('.role-button.ngo-role');

    // Update indicator
    if (role === 'donor') {
        roleIndicator.textContent = '🍱 Donor';
        roleIndicator.style.color = '#f59e0b';
        donorButton.classList.add('active');
        ngoButton.classList.remove('active');
    } else {
        roleIndicator.textContent = '🤝 NGO Partner';
        roleIndicator.style.color = '#10b981';
        ngoButton.classList.add('active');
        donorButton.classList.remove('active');
    }

    localStorage.setItem('selectedRole', role);
}

function setRole(role) {
    updateRoleDisplay(role);
}

function goBack() {
    window.location.href = 'index.html';
}

function showMessage(message, type) {
    const messageBox = document.getElementById('message-box');
    messageBox.textContent = message;
    messageBox.className = `message ${type}`;
    messageBox.classList.remove('hidden');

    setTimeout(() => {
        messageBox.classList.add('hidden');
    }, 5000);
}