# 🍽️ FOOD BRIDGE - QUICK REFERENCE

## ⚡ Start in 3 Steps

```bash
# Step 1: Ensure dependencies installed
npm install

# Step 2: Start server
npm start

# Step 3: Open browser
http://localhost:3000
```

---

## 🔗 Portal URLs

| Role | URL |
|------|-----|
| **Home** | http://localhost:3000 |
| **Donor** | http://localhost:3000/donor-portal.html |
| **NGO** | http://localhost:3000/ngo-portal.html |
| **Login** | http://localhost:3000/login.html |

---

## 📊 Donor Flow

```
1. Home → "I Want to Donate" → Sign Up
2. Fill Details:
   🍱 Food Name       [Cooked Biryani]
   ⚖️  Quantity        [10 portions]
   📸 Photos          [Upload]
   🎬 Videos          [Upload]
3. Submit → AI Analysis → Done ✅
```

---

## 📊 NGO Flow

```
1. Home → "I'm an NGO Partner" → Sign Up
2. View Donations:
   🍱 See food name & quantity
   📸 See photos & videos
   ✅ Accept / ❌ Reject
3. Track Impact in Dashboard
```

---

## ✨ What's NEW

| Feature | Status |
|---------|--------|
| 🍱 Food Name Field | ✅ NEW |
| ⚖️  Quantity Field | ✅ NEW |
| 🤖 AI Analysis | ✅ Complete |
| 📊 Dashboard Stats | ✅ Complete |
| ⚡ Real-Time Sync | ✅ Complete |

---

## 🔒 Login Credentials (Test)

### Create Your Own
1. Click sign up
2. Enter email (use @gmail.com)
3. Set password
4. Choose role (Donor/NGO)

### Format
```
Email: yourname@gmail.com
Password: YourPassword123
```

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `donor-portal.html` | Food upload interface |
| `ngo-portal.html` | Requests management |
| `server.js` | Backend API |
| `styles.css` | Complete styling |
| `data/requests.json` | ✨ Stores: foodName, quantity |

---

## 🔧 Verification Tools

```bash
# Check all endpoints
node system-diagnostics.js

# System overview
node system-orchestration.js

# Connection test
node startup-check.js
```

---

## 🆕 Database Fields

```sql
-- Added to requests table:
foodName    TEXT    -- e.g., "Cooked Rice"
quantity    TEXT    -- e.g., "5kg", "10 portions"
```

---

## 🚨 Common Issues

| Issue | Fix |
|-------|-----|
| Port 3000 in use | `taskkill /PID [id] /F` |
| Upload fails | Check `uploads/` dir exists |
| Can't login | Clear cache (Ctrl+F5) |
| Token expired | Login again |

---

## 📱 Responsive Design

✅ Works on:
- Desktop (1920px+)
- Tablet (768px+)
- Mobile (320px+)

---

## 🔐 Security

✅ Protected:
- User passwords (bcryptjs)
- API endpoints (JWT)
- File uploads (type check)
- Database (parameterized queries)

---

## 📞 Full Documentation

- **Deployment Guide:** `DEPLOYMENT-GUIDE.md`
- **System Status:** `SYSTEM-STATUS.md`
- **This Guide:** `QUICK-REFERENCE.md`

---

## ✅ System Status

```
✓ Server:         Running ✅
✓ Database:       Initialized ✅
✓ Portals:        Connected ✅
✓ APIs:           Responsive ✅
✓ Security:       Secured ✅
✓ Features:       Complete ✅

STATUS: PRODUCTION READY 🚀
```

---

## 🎯 Test Scenarios

### Test 1: Donate Food
```
1. Home → "I Want to Donate"
2. Sign up as donor
3. Fill food name: "Biryani"
4. Fill quantity: "10 portions"
5. Upload photos & videos
6. Click Submit
7. ✅ See "Success" message
```

### Test 2: NGO Review
```
1. New tab: Home → "NGO Partner"
2. Sign up as NGO
3. ✅ See donation listed
4. ✅ See food name & quantity
5. ✅ See photos/videos
6. Click Accept/Reject
7. ✅ See confirmation
```

---

## 🚀 Production Ready Features

✅ Two separate portals
✅ Food tracking (name + quantity)
✅ Photo/video uploads
✅ AI analysis
✅ NGO matching
✅ Real-time sync
✅ Dashboard analytics
✅ Role-based access
✅ Secure authentication
✅ Error handling

---

## 💡 Tips

- Use different browsers for donor & NGO simultaneously
- Test with real Gmail accounts (email validated)
- Check browser console for detailed errors
- Monitor server logs for API calls
- File uploads in `/uploads/images` and `/uploads/videos`

---

## 📊 API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/auth/register` | Sign up |
| POST | `/api/auth/login` | Login |
| POST | `/api/donations` | Upload food ✨NEW fields |
| GET | `/api/donations/my` | My donations |
| GET | `/api/ngo/requests` | View all ✨NEW fields |
| POST | `/api/ngo/accept` | Accept/reject |
| GET | `/api/ngo/stats` | Dashboard |

---

## 🎉 Ready to Deploy!

Your system is fully connected with:
- ✅ Food name tracking
- ✅ Quantity tracking
- ✅ Complete sync
- ✅ Full features

**Start at:** http://localhost:3000 🚀

---

*Quick Reference v1.0 | All Systems Operational*
