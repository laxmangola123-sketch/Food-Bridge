# 🍽️ Food Bridge - Two Portal System

## Overview
Food Bridge is a complete donation management system with **two distinct portals** for seamless food sharing between donors and NGOs.

---

## 🎯 Portal 1: Donor Portal
**URL:** `http://localhost:3000/donor-portal.html`  
**For:** People who want to donate surplus food

### Features:
- ✅ **Upload Food Details**
  - Food name/type (e.g., "Biryani", "Rice & Dal")
  - Quantity (e.g., "5kg", "10 portions")
  - Clear photo of the food
  - Video showing the food being prepared/eaten

- ✅ **Location Details**
  - Your name and phone number
  - City and landmark for pickup

- ✅ **AI Analysis**
  - Real-time quality analysis
  - Freshness rating
  - Safety verification
  - Overall food rating

- ✅ **NGO Matching**
  - View nearby NGOs that can pick up your donation
  - See distance to each NGO

### Workflow:
1. **Sign Up** as a Donor (Gmail required)
2. **Fill Form** with food details
3. **Upload Media** (image & video)
4. **Submit** donation request
5. **Track Status** - See which NGO accepted your donation

---

## 🤝 Portal 2: NGO Portal
**URL:** `http://localhost:3000/ngo-portal.html`  
**For:** NGO partners who receive and distribute food donations

### Features:
- ✅ **View All Donations**
  - Real-time feed of new food donations
  - Filter by status (Pending, Accepted, Completed)

- ✅ **Donation Details**
  - **Food Information**
    - Type of food
    - Quantity available
    - Photos and videos
  - **Donor Information**
    - Donor name and phone
    - Pickup location (city, landmark)
  - **AI Analysis**
    - Quality rating
    - Freshness level
    - Safety verification

- ✅ **Actions**
  - Accept donation requests
  - Reject donations
  - Mark as completed

- ✅ **Dashboard Statistics**
  - Active requests count
  - Completed donations today
  - People helped
  - Total donations received
  - Meals served
  - Food waste reduced (in kg)

### Workflow:
1. **Sign Up** as NGO (Gmail required)
2. **View Dashboard** - See statistics
3. **Browse Requests** - Check new donation requests
4. **View Details** - See food info, photos, videos
5. **Accept/Reject** - Decide on donations
6. **Track Impact** - Monitor your contribution

---

## 🔄 How the System Works

### User Flow:

```
┌─────────────────────────────────────────────────────────┐
│              Food Bridge Home Page                       │
│                                                          │
│  [I Want to Donate Food] [I'm an NGO Partner]          │
└─────────────────────────────────────────────────────────┘
          │                            │
          ▼                            ▼
    ┌──────────────┐            ┌──────────────┐
    │ Donor Login  │            │ NGO Login    │
    │ (Verify      │            │ (Verify      │
    │  Role)       │            │  Role)       │
    └──────────────┘            └──────────────┘
          │                            │
          ▼                            ▼
    ┌──────────────────┐      ┌──────────────────┐
    │  Donor Portal    │      │   NGO Portal     │
    │                  │      │                  │
    │ • Upload Food    │      │ • View Requests  │
    │ • Add Details    │      │ • See Photos     │
    │ • Get Analysis   │      │ • Accept/Reject  │
    │ • Submit Request │      │ • Track Impact   │
    └──────────────────┘      └──────────────────┘
          │                            │
          └────────────┬───────────────┘
                       ▼
              ┌─────────────────────┐
              │  Server Backend     │
              │  (Stores all data)  │
              │  (Routes requests)  │
              └─────────────────────┘
```

### Data Flow:

1. **Donor uploads donation** → Server validates and stores
2. **Food details stored** with images and videos
3. **AI analysis runs** on the submission
4. **NGO portal updates** with new request
5. **NGO reviews details** (food name, quantity, photos)
6. **NGO accepts/rejects** donation
7. **Status updated** in Donor's portal

---

## 📊 Key Data Included in Requests

When a **Donor** submits a request, the **NGO Portal** displays:

```json
{
  "id": "unique-request-id",
  "donorName": "John Doe",
  "phone": "+91-9876543210",
  "city": "Chennai",
  "landmark": "Near Main Market",
  "foodName": "Biryani",
  "quantity": "5kg",
  "imageUrl": "/uploads/images/food-image.jpg",
  "videoUrl": "/uploads/videos/food-video.mp4",
  "status": "pending",
  "analysis": {
    "rating": "8.5 / 10",
    "quality": "Good",
    "freshness": "Fresh"
  },
  "createdAt": "2024-04-07T10:30:00Z"
}
```

---

## 🔐 Security Features

- ✅ **JWT Authentication** - Secure token-based access
- ✅ **Role-Based Access Control** - Donors and NGOs see only their portals
- ✅ **Email Verification** - Gmail required for signup
- ✅ **Password Hashing** - bcryptjs for security
- ✅ **CORS Protection** - API protected from unauthorized requests

---

## 📲 Technology Stack

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Backend:** Node.js + Express.js
- **Database:** SQLite3
- **Authentication:** JWT + bcryptjs
- **File Uploads:** Multer (for images & videos)
- **API:** RESTful

---

## 🚀 Getting Started

### 1. Start Server
```bash
cd Food_Bridge
npm start
# Server runs on http://localhost:3000
```

### 2. Access Home Page
```
http://localhost:3000
```

### 3. Sign Up & Choose Role
- Click "I Want to Donate Food" → Donor Portal
- Click "I'm an NGO Partner" → NGO Portal

### 4. Create Account
- Email: (Gmail required)
- Password: (Your choice)
- Name: (Your name)

### 5. Start Using

**As Donor:**
- Fill in food details
- Upload photos & videos
- Submit request
- Track donations

**As NGO:**
- View all donations
- Check food details
- Accept/reject requests
- Track impact

---

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - Sign up new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/user` - Get logged-in user info

### Donor Endpoints
- `POST /api/donations` - Submit food donation
- `GET /api/donations/my` - View my donations

### NGO Endpoints
- `GET /api/ngo/requests` - View all requests (filtered by status)
- `GET /api/ngo/stats` - Get dashboard statistics
- `POST /api/ngo/accept` - Accept a donation request

---

## ❓ Frequently Asked Questions

**Q: Can I switch between Donor and NGO roles?**  
A: Yes! On the login page, you can click the role buttons to switch at any time.

**Q: Where are uploaded files stored?**  
A: Images and videos are stored in `/uploads/images` and `/uploads/videos` folders.

**Q: How is the database organized?**  
A: SQLite database stores all user data, requests, and donation information in `/data/database.sqlite`

**Q: Can one email have multiple roles?**  
A: No. Each email is tied to one role (Donor or NGO). Create separate accounts for different roles.

**Q: What happens to food photos and videos?**  
A: They are stored on the server and displayed in the NGO portal for verification.

---

## 🎉 Summary

Food Bridge provides a complete two-portal system:

| Aspect | Donor Portal | NGO Portal |
|--------|-------------|-----------|
| **Purpose** | Upload surplus food | Receive & distribute food |
| **Main Action** | Submit donations | Accept requests |
| **Key Info** | Food details, location | Photos, videos, analysis |
| **Benefit** | Reduce food waste | Help communities |

**Together, they create a sustainable food sharing ecosystem!** 🍽️

---

*Last Updated: April 7, 2026*
