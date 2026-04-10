const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const cors = require('cors');
const { randomUUID } = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'food-share-secret';
const ROOT_DIR = __dirname;
const DATA_DIR = path.join(ROOT_DIR, 'data');
const DB_FILE = path.join(DATA_DIR, 'database.sqlite');
const UPLOADS_DIR = path.join(ROOT_DIR, 'uploads');
const IMAGE_DIR = path.join(UPLOADS_DIR, 'images');
const VIDEO_DIR = path.join(UPLOADS_DIR, 'videos');

const ngoList = [
  { id: 1, name: 'Hope NGO', lat: 13.0830, lon: 80.2700 },
  { id: 2, name: 'Care Center', lat: 13.0900, lon: 80.2760 },
  { id: 3, name: 'Safe Hands', lat: 13.0790, lon: 80.2600 }
];

let db;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(ROOT_DIR));
app.use('/uploads', express.static(UPLOADS_DIR));

const storage = multer.diskStorage({
  destination(req, file, cb) {
    if (file.fieldname === 'image') cb(null, IMAGE_DIR);
    else if (file.fieldname === 'video') cb(null, VIDEO_DIR);
    else cb(new Error('Unexpected file field.'));
  },
  filename(req, file, cb) {
    const suffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${file.fieldname}-${suffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  fileFilter(req, file, cb) {
    if (file.fieldname === 'image' && file.mimetype.startsWith('image/')) {
      return cb(null, true);
    }
    if (file.fieldname === 'video' && file.mimetype.startsWith('video/')) {
      return cb(null, true);
    }
    cb(new Error('Only image files may be uploaded as image and only video files as video.'));
  }
});

function runAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve(this);
    });
  });
}

function getAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

function allAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

async function ensureDirectories() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.mkdir(IMAGE_DIR, { recursive: true });
  await fs.mkdir(VIDEO_DIR, { recursive: true });
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

function analyzeFood(confirmReal, imageSize, videoSize) {
  const qualityBase = confirmReal ? 84 : 62;
  const freshnessBase = Math.min(95, 70 + Math.round(imageSize / 200000));
  const rating = Math.min(10, Math.max(4.8, (qualityBase + freshnessBase) / 20));
  const quantity = videoSize > 4_000_000 ? 'Large portion' : 'Medium portion';
  const poison = confirmReal ? 'Low' : 'Medium';
  return {
    rating: `${rating.toFixed(1)} / 10`,
    quality: qualityBase > 78 ? 'Good' : 'Average',
    quantity,
    freshness: freshnessBase > 82 ? 'Fresh' : 'Fair',
    poison
  };
}

function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: '12h' }
  );
}

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Missing authorization header.' });
  }
  const token = authHeader.replace('Bearer ', '').trim();
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
}

function requireRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ message: 'Forbidden.' });
    }
    next();
  };
}

async function initDatabase() {
  await ensureDirectories();
  db = new sqlite3.Database(DB_FILE);
  await runAsync(
    `CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      passwordHash TEXT NOT NULL,
      role TEXT NOT NULL
    )`
  );
  await runAsync(
    `CREATE TABLE IF NOT EXISTS requests (
      id TEXT PRIMARY KEY,
      donorId TEXT NOT NULL,
      donorName TEXT NOT NULL,
      donorEmail TEXT NOT NULL,
      lat REAL NOT NULL,
      lon REAL NOT NULL,
      phone TEXT,
      city TEXT,
      landmark TEXT,
      foodName TEXT,
      quantity TEXT,
      analysisRating TEXT NOT NULL,
      analysisQuality TEXT NOT NULL,
      analysisQuantity TEXT NOT NULL,
      analysisFreshness TEXT NOT NULL,
      analysisPoison TEXT NOT NULL,
      imageUrl TEXT NOT NULL,
      videoUrl TEXT NOT NULL,
      status TEXT NOT NULL,
      createdAt INTEGER NOT NULL
    )`
  );
  
  // Add columns if they don't exist (for database migration)
  try {
    await runAsync('ALTER TABLE requests ADD COLUMN phone TEXT');
  } catch (e) {
    // Column already exists
  }
  try {
    await runAsync('ALTER TABLE requests ADD COLUMN city TEXT');
  } catch (e) {
    // Column already exists
  }
  try {
    await runAsync('ALTER TABLE requests ADD COLUMN landmark TEXT');
  } catch (e) {
    // Column already exists
  }
  try {
    await runAsync('ALTER TABLE requests ADD COLUMN foodName TEXT');
  } catch (e) {
    // Column already exists
  }
  try {
    await runAsync('ALTER TABLE requests ADD COLUMN quantity TEXT');
  } catch (e) {
    // Column already exists
  }
  
  await runAsync(
    `CREATE TABLE IF NOT EXISTS nearby_ngos (
      requestId TEXT NOT NULL,
      ngoName TEXT NOT NULL
    )`
  );
}

app.get('/api/ngo-list', (req, res) => {
  res.json(ngoList);
});

app.post('/api/auth/signup', async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'Name, email, password, and role are required.' });
  }
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail.endsWith('@gmail.com')) {
    return res.status(400).json({ message: 'Please sign up with a Gmail address.' });
  }
  const existingUser = await getAsync('SELECT id FROM users WHERE email = ?', [normalizedEmail]);
  if (existingUser) {
    return res.status(400).json({ message: 'Email already registered.' });
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = {
    id: randomUUID(),
    name: name.trim(),
    email: normalizedEmail,
    passwordHash,
    role: role === 'ngo' ? 'ngo' : 'donor'
  };
  await runAsync(
    'INSERT INTO users (id, name, email, passwordHash, role) VALUES (?, ?, ?, ?, ?)',
    [newUser.id, newUser.name, newUser.email, newUser.passwordHash, newUser.role]
  );
  const token = generateToken(newUser);
  res.json({ token, user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role } });
});

app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'Name, email, password, and role are required.' });
  }
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail.endsWith('@gmail.com')) {
    return res.status(400).json({ message: 'Please sign up with a Gmail address.' });
  }
  const existingUser = await getAsync('SELECT id FROM users WHERE email = ?', [normalizedEmail]);
  if (existingUser) {
    return res.status(400).json({ message: 'Email already registered.' });
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = {
    id: randomUUID(),
    name: name.trim(),
    email: normalizedEmail,
    passwordHash,
    role: role === 'ngo' ? 'ngo' : 'donor'
  };
  await runAsync(
    'INSERT INTO users (id, name, email, passwordHash, role) VALUES (?, ?, ?, ?, ?)',
    [newUser.id, newUser.name, newUser.email, newUser.passwordHash, newUser.role]
  );
  const token = generateToken(newUser);
  res.json({ token, user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role } });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }
  const normalizedEmail = email.trim().toLowerCase();
  const user = await getAsync('SELECT * FROM users WHERE email = ?', [normalizedEmail]);
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }
  const passwordMatch = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatch) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }
  const token = generateToken(user);
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

app.get('/api/auth/user', authenticate, (req, res) => {
  res.json({ user: req.user });
});

app.get('/api/requests', authenticate, async (req, res) => {
  const base = req.user.role === 'donor' ? 'WHERE donorId = ?' : '';
  const params = req.user.role === 'donor' ? [req.user.id] : [];
  const rows = await allAsync(`SELECT * FROM requests ${base} ORDER BY createdAt DESC`, params);
  const requests = await Promise.all(
    rows.map(async (row) => {
      const nearby = await allAsync('SELECT ngoName FROM nearby_ngos WHERE requestId = ?', [row.id]);
      return {
        id: row.id,
        donorId: row.donorId,
        donorName: row.donorName,
        donorEmail: row.donorEmail,
        phone: row.phone,
        city: row.city,
        landmark: row.landmark,
        location: { lat: row.lat, lon: row.lon },
        analysis: {
          rating: row.analysisRating,
          quality: row.analysisQuality,
          quantity: row.analysisQuantity,
          freshness: row.analysisFreshness,
          poison: row.analysisPoison
        },
        imageUrl: row.imageUrl,
        videoUrl: row.videoUrl,
        status: row.status,
        createdAt: row.createdAt,
        nearbyNgos: nearby.map((n) => ({ name: n.ngoName }))
      };
    })
  );
  res.json(requests);
});

app.post('/api/requests', authenticate, requireRole('donor'), upload.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }]), async (req, res) => {
  const { phone, city, landmark, location, confirmReal } = req.body;
  
  // Support both new format (phone, city, landmark) and old format (location)
  let lat = 0, lon = 0;
  if (location) {
    const parsedLocation = location.split(',').map((value) => parseFloat(value.trim()));
    if (parsedLocation.length !== 2 || parsedLocation.some(Number.isNaN)) {
      return res.status(400).json({ message: 'Location must be provided as lat,lon.' });
    }
    lat = parsedLocation[0];
    lon = parsedLocation[1];
  } else {
    // For new format, use default coordinates or provide a way to geocode
    lat = 13.0827;
    lon = 80.2707;
  }

  if (!phone || !city || !landmark) {
    return res.status(400).json({ message: 'Phone, city, and landmark are required.' });
  }

  if (!req.files || !req.files.image || !req.files.video) {
    return res.status(400).json({ message: 'Image and video files are required.' });
  }
  if (confirmReal !== 'true') {
    return res.status(400).json({ message: 'Please confirm the image is a real person with the food.' });
  }
  const imageFile = req.files.image[0];
  const videoFile = req.files.video[0];
  if (imageFile.size < 20_000) {
    return res.status(400).json({ message: 'Uploaded image file appears too small to be valid.' });
  }
  if (videoFile.size < 200_000) {
    return res.status(400).json({ message: 'Uploaded video file appears too small to be valid.' });
  }
  const analysis = analyzeFood(true, imageFile.size, videoFile.size);
  const nearbyNgos = ngoList.filter((ngo) => calculateDistanceKm(lat, lon, ngo.lat, ngo.lon) <= 5);
  const requestId = randomUUID();
  await runAsync(
    'INSERT INTO requests (id, donorId, donorName, donorEmail, lat, lon, phone, city, landmark, analysisRating, analysisQuality, analysisQuantity, analysisFreshness, analysisPoison, imageUrl, videoUrl, status, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [
      requestId,
      req.user.id,
      req.user.name,
      req.user.email,
      lat,
      lon,
      phone,
      city,
      landmark,
      analysis.rating,
      analysis.quality,
      analysis.quantity,
      analysis.freshness,
      analysis.poison,
      `/uploads/images/${path.basename(imageFile.path)}`,
      `/uploads/videos/${path.basename(videoFile.path)}`,
      'pending',
      Date.now()
    ]
  );
  await Promise.all(
    nearbyNgos.map((ngo) => runAsync('INSERT INTO nearby_ngos (requestId, ngoName) VALUES (?, ?)', [requestId, ngo.name]))
  );
  res.json({ message: 'Request submitted successfully.', request: { id: requestId, donorName: req.user.name, phone, city, landmark, location: { lat, lon }, analysis, nearbyNgos, status: 'pending' } });
});

app.post('/api/requests/:id/receive', authenticate, requireRole('ngo'), async (req, res) => {
  const request = await getAsync('SELECT * FROM requests WHERE id = ?', [req.params.id]);
  if (!request) {
    return res.status(404).json({ message: 'Donation request not found.' });
  }
  if (request.status !== 'pending') {
    return res.status(400).json({ message: 'This request has already been received.' });
  }
  await runAsync('UPDATE requests SET status = ? WHERE id = ?', ['received', req.params.id]);
  res.json({ message: 'Request marked as received.' });
});

// New API endpoints for the updated frontend
app.post('/api/donations', authenticate, requireRole('donor'), upload.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }]), async (req, res) => {
  const { name, phone, city, landmark, foodName, quantity, confirmReal } = req.body;

  if (!name || !phone || !city || !landmark || !foodName || !quantity) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  if (!req.files || !req.files.image || !req.files.video) {
    return res.status(400).json({ message: 'Image and video files are required.' });
  }

  if (confirmReal !== 'true') {
    return res.status(400).json({ message: 'Please confirm the image is a real person with the food.' });
  }

  const imageFile = req.files.image[0];
  const videoFile = req.files.video[0];

  if (imageFile.size < 20_000) {
    return res.status(400).json({ message: 'Uploaded image file appears too small to be valid.' });
  }
  if (videoFile.size < 200_000) {
    return res.status(400).json({ message: 'Uploaded video file appears too small to be valid.' });
  }

  const analysis = analyzeFood(true, imageFile.size, videoFile.size);
  const lat = 13.0827; // Default coordinates for Chennai
  const lon = 80.2707;
  const nearbyNgos = ngoList.filter((ngo) => calculateDistanceKm(lat, lon, ngo.lat, ngo.lon) <= 5);

  const requestId = randomUUID();
  await runAsync(
    'INSERT INTO requests (id, donorId, donorName, donorEmail, lat, lon, phone, city, landmark, foodName, quantity, analysisRating, analysisQuality, analysisQuantity, analysisFreshness, analysisPoison, imageUrl, videoUrl, status, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [
      requestId,
      req.user.id,
      name,
      req.user.email,
      lat,
      lon,
      phone,
      city,
      landmark,
      foodName,
      quantity,
      analysis.rating,
      analysis.quality,
      analysis.quantity,
      analysis.freshness,
      analysis.poison,
      `/uploads/images/${path.basename(imageFile.path)}`,
      `/uploads/videos/${path.basename(videoFile.path)}`,
      'pending',
      Date.now()
    ]
  );

  await Promise.all(
    nearbyNgos.map((ngo) => runAsync('INSERT INTO nearby_ngos (requestId, ngoName) VALUES (?, ?)', [requestId, ngo.name]))
  );

  res.json({
    message: 'Donation request submitted successfully!',
    analysis,
    nearbyNGOs: nearbyNgos
  });
});

app.get('/api/donations/my', authenticate, requireRole('donor'), async (req, res) => {
  const rows = await allAsync('SELECT * FROM requests WHERE donorId = ? ORDER BY createdAt DESC', [req.user.id]);
  const requests = rows.map(row => ({
    id: row.id,
    donorName: row.donorName,
    phone: row.phone,
    city: row.city,
    landmark: row.landmark,
    status: row.status,
    createdAt: row.createdAt
  }));
  res.json(requests);
});

app.get('/api/ngo/stats', authenticate, requireRole('ngo'), async (req, res) => {
  // Get stats for the NGO
  const totalDonations = await getAsync('SELECT COUNT(*) as count FROM requests WHERE status IN ("accepted", "completed")', []);
  const activeRequests = await getAsync('SELECT COUNT(*) as count FROM requests WHERE status = "pending"', []);
  const completedToday = await getAsync('SELECT COUNT(*) as count FROM requests WHERE status = "completed" AND createdAt >= ?', [Date.now() - 24 * 60 * 60 * 1000]);
  const peopleHelped = await getAsync('SELECT COUNT(*) as count FROM requests WHERE status = "completed"', []);

  res.json({
    totalDonations: totalDonations.count || 0,
    activeRequests: activeRequests.count || 0,
    completedToday: completedToday.count || 0,
    peopleHelped: peopleHelped.count || 0,
    mealsServed: (peopleHelped.count || 0) * 3, // Assuming 3 meals per person
    wasteReduced: `${(totalDonations.count || 0) * 2.5}kg` // Assuming 2.5kg per donation
  });
});

app.get('/api/ngo/requests', authenticate, requireRole('ngo'), async (req, res) => {
  const filter = req.query.filter || 'all';
  let whereClause = '';
  let params = [];

  switch (filter) {
    case 'pending':
      whereClause = 'WHERE status = ?';
      params = ['pending'];
      break;
    case 'accepted':
      whereClause = 'WHERE status = ?';
      params = ['accepted'];
      break;
    case 'completed':
      whereClause = 'WHERE status = ?';
      params = ['completed'];
      break;
    default:
      whereClause = '';
      params = [];
  }

  const rows = await allAsync(`SELECT * FROM requests ${whereClause} ORDER BY createdAt DESC`, params);
  const requests = await Promise.all(
    rows.map(async (row) => {
      const nearby = await allAsync('SELECT ngoName FROM nearby_ngos WHERE requestId = ?', [row.id]);
      return {
        id: row.id,
        donorName: row.donorName,
        phone: row.phone,
        city: row.city,
        landmark: row.landmark,
        foodName: row.foodName,
        quantity: row.quantity,
        imageUrl: row.imageUrl,
        videoUrl: row.videoUrl,
        status: row.status,
        createdAt: row.createdAt,
        analysis: {
          rating: row.analysisRating,
          quality: row.analysisQuality,
          freshness: row.analysisFreshness
        }
      };
    })
  );
  res.json(requests);
});

app.post('/api/ngo/accept', authenticate, requireRole('ngo'), async (req, res) => {
  const { requestId } = req.body;

  if (!requestId) {
    return res.status(400).json({ message: 'Request ID is required.' });
  }

  const request = await getAsync('SELECT * FROM requests WHERE id = ?', [requestId]);
  if (!request) {
    return res.status(404).json({ message: 'Request not found.' });
  }

  if (request.status !== 'pending') {
    return res.status(400).json({ message: 'Request is not in pending status.' });
  }

  await runAsync('UPDATE requests SET status = ? WHERE id = ?', ['accepted', requestId]);
  res.json({ message: 'Request accepted successfully!' });
});

app.post('/api/ngo/reject', authenticate, requireRole('ngo'), async (req, res) => {
  const { requestId } = req.body;

  if (!requestId) {
    return res.status(400).json({ message: 'Request ID is required.' });
  }

  const request = await getAsync('SELECT * FROM requests WHERE id = ?', [requestId]);
  if (!request) {
    return res.status(404).json({ message: 'Request not found.' });
  }

  if (request.status !== 'pending') {
    return res.status(400).json({ message: 'Request is not in pending status.' });
  }

  await runAsync('UPDATE requests SET status = ? WHERE id = ?', ['rejected', requestId]);
  res.json({ message: 'Request rejected.' });
});

app.post('/api/ngo/complete', authenticate, requireRole('ngo'), async (req, res) => {
  const { requestId } = req.body;

  if (!requestId) {
    return res.status(400).json({ message: 'Request ID is required.' });
  }

  const request = await getAsync('SELECT * FROM requests WHERE id = ?', [requestId]);
  if (!request) {
    return res.status(404).json({ message: 'Request not found.' });
  }

  if (request.status !== 'accepted') {
    return res.status(400).json({ message: 'Request must be accepted before marking as completed.' });
  }

  await runAsync('UPDATE requests SET status = ? WHERE id = ?', ['completed', requestId]);
  res.json({ message: 'Request marked as completed!' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: err.message || 'Internal server error.' });
});

initDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Food Bridge backend is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to initialize the database.', error);
    process.exit(1);
  });
