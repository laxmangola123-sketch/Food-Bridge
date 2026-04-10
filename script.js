const authForm = document.getElementById('auth-form');
const authName = document.getElementById('auth-name');
const authEmail = document.getElementById('auth-email');
const authPassword = document.getElementById('auth-password');
const authSubmit = document.getElementById('auth-submit');
const modeLogin = document.getElementById('mode-login');
const modeSignup = document.getElementById('mode-signup');
const roleDonor = document.getElementById('role-donor');
const roleNgo = document.getElementById('role-ngo');
const loginCard = document.getElementById('login-card');
const donorPortal = document.getElementById('donor-portal');
const ngoPortal = document.getElementById('ngo-portal');
const logoutButton = document.getElementById('logout-button');
const messageBox = document.getElementById('message-box');
const donorForm = document.getElementById('donor-form');
const donorName = document.getElementById('donor-name');
const donorPhone = document.getElementById('donor-phone');
const donorCity = document.getElementById('donor-city');
const donorLandmark = document.getElementById('donor-landmark');
const foodImage = document.getElementById('food-image');
const foodVideo = document.getElementById('food-video');
const confirmReal = document.getElementById('confirm-real');
const imageCheck = document.getElementById('image-check');
const videoCheck = document.getElementById('video-check');
const analysisResult = document.getElementById('analysis-result');
const ratingValue = document.getElementById('rating-value');
const qualityValue = document.getElementById('quality-value');
const quantityValue = document.getElementById('quantity-value');
const freshnessValue = document.getElementById('freshness-value');
const poisonValue = document.getElementById('poison-value');
const nearbyNgos = document.getElementById('nearby-ngos');
const donorRequestList = document.getElementById('donor-request-list');
const ngoRequestList = document.getElementById('ngo-request-list');
const ngoWelcome = document.getElementById('ngo-welcome');
const nameGroup = document.getElementById('name-group');
const showcaseDonor = document.getElementById('showcase-donor');
const showcaseNgo = document.getElementById('showcase-ngo');
const roleShowcase = document.getElementById('role-showcase');

let authMode = 'login';
let role = 'donor';
let token = localStorage.getItem('foodAppToken');
let user = null;
let ngoLocations = [];

function showMessage(text, type = 'success') {
  messageBox.textContent = text;
  messageBox.className = `message ${type}`;
  messageBox.classList.remove('hidden');
  setTimeout(() => messageBox.classList.add('hidden'), 5000);
}

function setAuthMode(mode) {
  authMode = mode;
  modeLogin.classList.toggle('active', mode === 'login');
  modeSignup.classList.toggle('active', mode === 'signup');
  nameGroup.classList.toggle('hidden', mode === 'login');
  authSubmit.textContent = mode === 'login' ? 'Sign In' : 'Create Account';
}

function setRole(newRole) {
  role = newRole;
  roleDonor.classList.toggle('active', newRole === 'donor');
  roleNgo.classList.toggle('active', newRole === 'ngo');
}

function parseCoordinates(value) {
  const parts = value.split(',').map((part) => parseFloat(part.trim()));
  if (parts.length !== 2 || parts.some(Number.isNaN)) {
    return null;
  }
  return { lat: parts[0], lon: parts[1] };
}

function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return 6371 * c;
}

async function apiFetch(url, options = {}) {
  const headers = options.headers || {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  const response = await fetch(url, { ...options, headers });
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(body?.message || 'Server error');
  }
  return body;
}

async function loadNgos() {
  try {
    const data = await apiFetch('/api/ngo-list');
    ngoLocations = data;
  } catch {
    ngoLocations = [];
  }
}

function renderLoggedOut() {
  loginCard.classList.remove('hidden');
  donorPortal.classList.add('hidden');
  ngoPortal.classList.add('hidden');
  logoutButton.classList.add('hidden');
  roleShowcase.classList.remove('hidden');
}

function renderLoggedIn() {
  loginCard.classList.add('hidden');
  logoutButton.classList.remove('hidden');
  roleShowcase.classList.add('hidden');
  if (user.role === 'donor') {
    donorPortal.classList.remove('hidden');
    ngoPortal.classList.add('hidden');
    donorName.value = user.name;
    loadDonorRequests();
  } else {
    donorPortal.classList.add('hidden');
    ngoPortal.classList.remove('hidden');
    ngoWelcome.innerHTML = `<p>Welcome, <strong>${user.name}</strong> (${user.email}).</p>`;
    loadNgoRequests();
  }
}

function logout() {
  token = null;
  user = null;
  localStorage.removeItem('foodAppToken');
  renderLoggedOut();
  showMessage('Logged out successfully.', 'success');
}

async function checkSession() {
  if (!token) {
    renderLoggedOut();
    return;
  }
  try {
    const data = await apiFetch('/api/auth/user');
    user = data.user;
    renderLoggedIn();
  } catch (error) {
    token = null;
    localStorage.removeItem('foodAppToken');
    renderLoggedOut();
  }
}

async function loadDonorRequests() {
  try {
    const data = await apiFetch('/api/requests');
    donorRequestList.innerHTML = data.length
      ? data.map((request) => renderRequestCard(request, 'donor')).join('')
      : '<p>No requests submitted yet.</p>';
  } catch (error) {
    donorRequestList.innerHTML = '<p>Unable to load your requests.</p>';
  }
}

async function loadNgoRequests() {
  try {
    const data = await apiFetch('/api/requests');
    ngoRequestList.innerHTML = data.length
      ? data.map((request) => renderRequestCard(request, 'ngo')).join('')
      : '<p>No donation requests available yet.</p>';
  } catch (error) {
    ngoRequestList.innerHTML = '<p>Unable to load requests.</p>';
  }
}

function renderRequestCard(request, mode) {
  const nearby = request.nearbyNgos?.map((ngo) => ngo.name).join(', ') || 'No nearby NGOs';
  const statusLabel = request.status === 'pending' ? 'Pending' : 'Received';
  const locationDisplay = request.city && request.landmark 
    ? `${request.city}, ${request.landmark}`
    : `${request.location?.lat?.toFixed(4) || 'N/A'}, ${request.location?.lon?.toFixed(4) || 'N/A'}`;
  const phoneDisplay = request.phone ? `<p><strong>Phone:</strong> ${request.phone}</p>` : '';
  const action =
    mode === 'ngo'
      ? `<button ${request.status !== 'pending' ? 'disabled' : ''} data-id="${request.id}">Mark Received</button>`
      : '';

  return `
    <div class="request-card">
      <h3>${request.donorName} donated food</h3>
      <p><strong>Status:</strong> ${statusLabel}</p>
      ${phoneDisplay}
      <p><strong>Location:</strong> ${locationDisplay}</p>
      <p><strong>Rating:</strong> ${request.analysis.rating}</p>
      <p><strong>Quality:</strong> ${request.analysis.quality}</p>
      <p><strong>Freshness:</strong> ${request.analysis.freshness}</p>
      <p><strong>Nearby NGOs:</strong> ${nearby}</p>
      ${action}
    </div>
  `;
}

async function handleAuthSubmit(event) {
  event.preventDefault();
  const payload = {
    email: authEmail.value.trim(),
    password: authPassword.value.trim()
  };

  if (!payload.email || !payload.password) {
    showMessage('Email and password are required.', 'error');
    return;
  }

  if (!payload.email.toLowerCase().endsWith('@gmail.com')) {
    showMessage('Please use a Gmail address ending with @gmail.com.', 'error');
    return;
  }

  let endpoint = '/api/auth/login';
  if (authMode === 'signup') {
    if (!authName.value.trim()) {
      showMessage('Please enter your full name to sign up.', 'error');
      return;
    }
    endpoint = '/api/auth/signup';
    payload.name = authName.value.trim();
    payload.role = role;
  }

  try {
    const data = await apiFetch(endpoint, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    token = data.token;
    localStorage.setItem('foodAppToken', token);
    user = data.user;
    showMessage(`Welcome, ${user.name}!`, 'success');
    renderLoggedIn();
  } catch (error) {
    showMessage(error.message, 'error');
  }
}

async function handleDonorSubmit(event) {
  event.preventDefault();
  if (!user) {
    showMessage('Please log in first.', 'error');
    return;
  }

  const phone = donorPhone.value.trim();
  const city = donorCity.value.trim();
  const landmark = donorLandmark.value.trim();
  const imageFile = foodImage.files[0];
  const videoFile = foodVideo.files[0];
  
  if (!phone || !city || !landmark || !imageFile || !videoFile) {
    showMessage('All donor fields are required, including phone, city, landmark, image and video.', 'error');
    return;
  }

  if (!confirmReal.checked) {
    showMessage('Please confirm the photo is a real image of a person and food.', 'error');
    return;
  }

  const formData = new FormData();
  formData.append('phone', phone);
  formData.append('city', city);
  formData.append('landmark', landmark);
  formData.append('confirmReal', 'true');
  formData.append('image', imageFile);
  formData.append('video', videoFile);

  try {
    const data = await apiFetch('/api/requests', { method: 'POST', body: formData });
    displayAnalysis(data.request.analysis, data.request.nearbyNgos || []);
    await loadDonorRequests();
    showMessage('Request analyzed and sent to nearby NGOs.', 'success');
  } catch (error) {
    showMessage(error.message, 'error');
  }
}

function displayAnalysis(analysis, nearby) {
  ratingValue.textContent = `AI Rating: ${analysis.rating}`;
  qualityValue.textContent = `Quality: ${analysis.quality}`;
  quantityValue.textContent = `Quantity: ${analysis.quantity}`;
  freshnessValue.textContent = `Freshness: ${analysis.freshness}`;
  poisonValue.textContent = `Poison detection: ${analysis.poison}`;
  nearbyNgos.innerHTML = nearby.length
    ? `<p><strong>Nearby NGOs:</strong> ${nearby.map((ngo) => ngo.name).join(', ')}</p>`
    : '<p><strong>No NGOs were found within 5 km.</strong></p>';
  analysisResult.classList.remove('hidden');
}

async function validateImageFile(file) {
  if (!file) {
    imageCheck.textContent = 'Choose an image that includes a person with food.';
    return false;
  }
  if (!file.type.startsWith('image/')) {
    imageCheck.textContent = 'Please upload a valid image file.';
    return false;
  }

  if ('FaceDetector' in window) {
    try {
      const bitmap = await createImageBitmap(file);
      const detector = new FaceDetector();
      const faces = await detector.detect(bitmap);
      bitmap.close();
      imageCheck.textContent = faces.length
        ? `Face detector found ${faces.length} face(s) in the photo.`
        : 'No face was detected. Please upload a photo with a person.';
      return faces.length > 0;
    } catch {
      imageCheck.textContent = 'Unable to run face detection. Please ensure the image includes a person.';
      return true;
    }
  }

  imageCheck.textContent = 'Face detection not available in this browser. Please ensure the photo includes a real person.';
  return true;
}

function validateVideoFile(file) {
  return new Promise((resolve) => {
    if (!file) {
      videoCheck.textContent = 'Choose a short video of the meal preparation / eating.';
      return resolve(false);
    }
    if (!file.type.startsWith('video/')) {
      videoCheck.textContent = 'Please upload a valid video file.';
      return resolve(false);
    }

    const video = document.createElement('video');
    video.preload = 'metadata';
    video.src = URL.createObjectURL(file);
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(video.src);
      if (video.duration < 3) {
        videoCheck.textContent = 'Video is too short; upload a clip at least 3 seconds long.';
        resolve(false);
      } else {
        videoCheck.textContent = `Video length: ${video.duration.toFixed(1)} seconds.`;
        resolve(true);
      }
    };
    video.onerror = () => {
      videoCheck.textContent = 'Unable to read video metadata. Please upload a different file.';
      resolve(false);
    };
  });
}

async function handleFileValidation() {
  const imageValid = await validateImageFile(foodImage.files[0]);
  const videoValid = await validateVideoFile(foodVideo.files[0]);
  return imageValid && videoValid;
}

async function handleRequestAction(event) {
  if (event.target.tagName !== 'BUTTON') return;
  const id = event.target.dataset.id;
  if (!id) return;

  try {
    await apiFetch(`/api/requests/${id}/receive`, { method: 'POST' });
    showMessage('Request marked as received.', 'success');
    await loadNgoRequests();
  } catch (error) {
    showMessage(error.message, 'error');
  }
}

modeLogin.addEventListener('click', () => setAuthMode('login'));
modeSignup.addEventListener('click', () => setAuthMode('signup'));
roleDonor.addEventListener('click', () => setRole('donor'));
roleNgo.addEventListener('click', () => setRole('ngo'));
authForm.addEventListener('submit', handleAuthSubmit);
donorForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const valid = await handleFileValidation();
  if (valid) {
    await handleDonorSubmit(event);
  }
});
logoutButton.addEventListener('click', logout);
ngoRequestList.addEventListener('click', handleRequestAction);

// Role showcase card event listeners
showcaseDonor.addEventListener('click', () => {
  setRole('donor');
  setAuthMode('signup');
  loginCard.scrollIntoView({ behavior: 'smooth' });
});

showcaseNgo.addEventListener('click', () => {
  setRole('ngo');
  setAuthMode('signup');
  loginCard.scrollIntoView({ behavior: 'smooth' });
});

window.addEventListener('DOMContentLoaded', async () => {
  setAuthMode('login');
  setRole('donor');
  await loadNgos();
  await checkSession();
});
