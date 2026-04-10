# 🍽️ Food Bridge - Complete Two Portal System Setup

## ✅ System Status: FULLY OPERATIONAL

**Server Status:** Running on `http://localhost:3000`  
**Database:** SQLite configured and ready  
**Both Portals:** Active and connected

---

## 📋 Quick Start Guide

### Step 1: Access Home Page
```
http://localhost:3000
```
You'll see two clear options:
- 🍱 **"I Want to Donate Food"** → Donor Portal
- 🤝 **"I'm an NGO Partner"** → NGO Portal

### Step 2: Create Your Account
- Click on your role button
- Sign Up with an email (Gmail recommended)
- Create a password

### Step 3: Start Using Your Portal

**IF YOU'RE A DONOR:**
1. Fill in your details (name, phone, city, landmark)
2. Enter food information:
   - What type of food? (e.g., "Cooked Biryani")
   - How much? (e.g., "5kg")
3. Upload a clear photo of the food
4. Upload a short video
5. Submit the request
6. AI analysis runs automatically
7. Nearby NGOs see your donation

**IF YOU'RE AN NGO:**
1. View your dashboard with statistics
2. Browse all incoming food donations
3. See for each donation:
   - Food type and quantity
   - Photos and videos
   - Donor location
   - AI quality verification
4. Accept or reject donations
5. Track your impact metrics

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────┐
│              CLIENT LAYER                           │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Home Page                                         │
│  ├── Donor Path                                    │
│  │   ├── Login Page                                │
│  │   └── Donor Portal (Upload Food)               │
│  │                                                  │
│  └── NGO Path                                      │
│      ├── Login Page                                │
│      └── NGO Portal (View & Accept)               │
│                                                      │
└─────────────────────────────────────────────────────┘
          │
          │ HTTPS/REST API
          │
┌─────────────────────────────────────────────────────┐
│           SERVER LAYER (Node.js/Express)           │
├─────────────────────────────────────────────────────┤
│                                                      │
│ Authentication Routes:                             │
│ ├── POST /api/auth/register (Donor or NGO)        │
│ ├── POST /api/auth/login (Verify role)            │
│ └── GET /api/auth/user (Current user)             │
│                                                      │
│ Donor Routes:                                      │
│ ├── POST /api/donations (Submit food)             │
│ └── GET /api/donations/my (View my uploads)       │
│                                                      │
│ NGO Routes:                                        │
│ ├── GET /api/ngo/requests (View all donations)    │
│ ├── GET /api/ngo/stats (Dashboard metrics)        │
│ └── POST /api/ngo/accept (Accept donation)        │
│                                                      │
│ File Upload Routes:                                │
│ ├── /uploads/images/* (Food photos)               │
│ └── /uploads/videos/* (Food videos)               │
│                                                      │
└─────────────────────────────────────────────────────┘
          │
          │ SQL Queries
          │
┌─────────────────────────────────────────────────────┐
│           DATABASE LAYER (SQLite)                  │
├─────────────────────────────────────────────────────┤
│                                                      │
│ Tables:                                            │
│ ├── users (id, name, email, role, password)       │
│ ├── requests (id, donorId, foodName, quantity,    │
│ │            imageUrl, videoUrl, status, ...)     │
│ └── nearby_ngos (requestId, ngoName)              │
│                                                      │
│ File Storage:                                      │
│ ├── /uploads/images/ (Photo files)                │
│ └── /uploads/videos/ (Video files)                │
│                                                      │
└─────────────────────────────────────────────────────┘
```

---

## 📊 Portal Comparison

| Feature | Donor Portal | NGO Portal |
|---------|-------------|-----------|
| **Purpose** | Share extra food | Receive donations |
| **Entry Point** | Home > Donate Food | Home > NGO Partner |
| **Authentication** | Email/Password | Email/Password |
| **Main Actions** | Upload → Submit | View → Accept/Reject |
| **Key Data Entered** | Food name, quantity, location, photos, videos | Reviews the above data |
| **AI Verification** | Yes - before submission | Yes - displayed for review |
| **Can See** | Their own donations | All donations in area |
| **Dashboard** | Donation history | Statistics & metrics |

---

## 🔑 Key Features Implemented

### ✅ Donor Portal Features
- [x] Role-based access control
- [x] Food name input field (what type of food)
- [x] Quantity input field (how much food)
- [x] Location details (city, landmark)
- [x] Photo upload with preview
- [x] Video upload with preview
- [x] AI quality analysis
- [x] Nearby NGO suggestions
- [x] Donation tracking

### ✅ NGO Portal Features
- [x] Role-based access control
- [x] Display all food donations
- [x] Show food name and quantity
- [x] Display food photos
- [x] Display food videos
- [x] AI analysis review (rating, quality, freshness)
- [x] Filter by status (pending, accepted, completed)
- [x] Accept/reject donations
- [x] Dashboard with statistics
- [x] Impact metrics (meals served, waste reduced)

### ✅ Backend Features
- [x] JWT authentication
- [x] Role-based access control
- [x] Database schema for food donations
- [x] File upload handling (images & videos)
- [x] AI food analysis
- [x] NGO matching based on location
- [x] Request filtering
- [x] Status management

---

## 📁 Project File Structure

```
Food_Bridge/
│
├── index.html                 ← Home page with role selection
├── login.html                 ← Login/Signup page with role buttons
├── login.js                   ← Authentication logic
│
├── donor-portal.html          ← Donor upload interface
├── donor-portal.js            ← Donor logic & API calls
│
├── ngo-portal.html            ← NGO viewing interface
├── ngo-portal.js              ← NGO logic & request management
│
├── server.js                  ← Node.js backend (ALL API endpoints)
├── package.json               ← Dependencies config
│
├── styles.css                 ← Complete styling (both portals)
│
├── data/
│   └── database.sqlite        ← SQLite database (auto-created)
│
├── uploads/
│   ├── images/                ← Uploaded food photos
│   └── videos/                ← Uploaded food videos
│
└── [NEW] PORTAL_GUIDE.md      ← Complete documentation
```

---

## 🔌 API Endpoints Summary

### Authentication (Role Selection)
```
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@gmail.com",
  "password": "secure_password",
  "role": "donor" OR "ngo"
}

POST /api/auth/login
{
  "email": "john@gmail.com",
  "password": "secure_password",
  "role": "donor" OR "ngo"
}
```

### Donor API
```
POST /api/donations
- Upload food with name, quantity, photos, videos
- Returns: AI analysis results

GET /api/donations/my
- Get all donations by current donor
```

### NGO API
```
GET /api/ngo/requests?filter=pending|accepted|completed
- Get all donation requests (filtered by status)
- Returns: Complete food details with photos/videos

GET /api/ngo/stats
- Get dashboard statistics

POST /api/ngo/accept
{
  "requestId": "...",
  "action": "accepted" or "rejected"
}
```

---

## 🧪 Testing the System

### Test Donor Portal:
1. Go to `http://localhost:3000`
2. Click "I Want to Donate Food"
3. Sign up with: 
   - Email: `donor@gmail.com`
   - Password: `test123`
   - Name: `John Donor`
4. Fill form and upload food
5. Submit and see AI analysis

### Test NGO Portal:
1. Go to `http://localhost:3000`
2. Click "I'm an NGO Partner"
3. Sign up with:
   - Email: `ngo@gmail.com`
   - Password: `test123`
   - Name: `Hope NGO`
4. View donations from donors
5. See food name, quantity, photos, analysis
6. Accept or reject donations

---

## 💾 Database Schema

### Users Table
```
id (UUID)
name (TEXT)
email (UNIQUE TEXT)
passwordHash (TEXT)
role (TEXT) - "donor" or "ngo"
```

### Requests Table
```
id (UUID)
donorId (TEXT)
donorName (TEXT)
phone (TEXT)
city (TEXT)
landmark (TEXT)
foodName (TEXT)              ← NEW!
quantity (TEXT)              ← NEW!
imageUrl (TEXT)
videoUrl (TEXT)
analysisRating (TEXT)
analysisQuality (TEXT)
analysisQuantity (TEXT)
analysisFreshness (TEXT)
analysisPoison (TEXT)
status (TEXT) - pending/accepted/completed
createdAt (INTEGER)
```

---

## 🚀 How to Deploy

### Current Setup (Local Testing):
```bash
cd Food_Bridge
node server.js
# Access: http://localhost:3000
```

### Production Setup:
1. Change port from 3000 to 80 (or use reverse proxy)
2. Replace SQLite with PostgreSQL/MySQL
3. Move uploads to cloud storage (AWS S3, etc.)
4. Add SSL/HTTPS certificate
5. Set up environment variables for secrets

---

## 🎯 What's Different from Single Portal

### Before (Single Portal):
- ❌ No clear role distinction
- ❌ Can't separate donor and NGO workflows
- ❌ One interface trying to do two jobs

### After (Two Portal System):
- ✅ Clear "Donor" portal for uploading
- ✅ Clear "NGO" portal for receiving
- ✅ Separate user interfaces optimized for each role
- ✅ Role-based access control
- ✅ Dedicated databases and workflows
- ✅ Simple, intuitive role selection
- ✅ No confusion about which portal to use

---

## 📞 Support & Troubleshooting

**Server not starting?**
- Check if port 3000 is available
- Verify Node.js is installed (`node --version`)
- Check for errors in terminal

**Can't upload files?**
- Ensure `uploads/images` and `uploads/videos` exist
- Check file sizes (min 20KB for images, 200KB for videos)
- Verify both image and video are uploaded

**NGO can't see donations?**
- Make sure you signed up as "ngo" role
- Refresh the page
- Check server logs for errors

**Database issues?**
- Delete `/data/database.sqlite` to reset
- Server will recreate it automatically

---

## 🎉 Summary

Your Food Bridge application now has:

✅ **Two Complete Portals** - One for donors, one for NGOs  
✅ **Clear Role System** - Users select their role at entry  
✅ **Food Details** - Name and quantity displayed  
✅ **Media Support** - Photos and videos for verification  
✅ **AI Analysis** - Automatic quality checking  
✅ **Status Tracking** - Monitor donations in real-time  
✅ **Impact Metrics** - See the difference being made  

**The system is ready to connect food donors with NGO partners!** 🍽️🤝

---

*System Setup Complete - April 7, 2026*
