# 🍽️ Food Bridge - Quick Reference

## 🚀 Start Here

### 1. **Server Running?**
```
Terminal: node server.js
Status: http://localhost:3000 ✅
```

### 2. **Open Home Page**
```
Browser: http://localhost:3000
```

### 3. **Choose Your Role**

| Role | Button | Go To |
|------|--------|-------|
| **Donor** 🍱 | I Want to Donate Food | Donor Portal |
| **NGO** 🤝 | I'm an NGO Partner | NGO Portal |

---

## 👤 Donor Portal Workflow

```
1. HOME PAGE
   ↓
2. SIGN UP / LOGIN
   Email: anything@gmail.com
   Password: your choice
   Name: Your name
   ↓
3. DONOR PORTAL
   ├─ Fill Your Details
   │  ├─ Name, Phone
   │  ├─ City, Landmark
   │  └─ Pick location
   │
   ├─ Enter Food Info
   │  ├─ What food? (e.g., "Biryani")
   │  ├─ How much? (e.g., "5kg")
   │  └─ Mark "This is real food"
   │
   ├─ Upload Media
   │  ├─ Photo (clear image, min 20KB)
   │  └─ Video (short video, min 200KB)
   │
   └─ Submit
      └─ AI Analysis ✨
         ├─ Quality Check
         ├─ Freshness Rating
         └─ Safety Score

4. SUCCESS ✅
   └─ Nearby NGOs notified
      └─ Track status in real-time
```

### Form Fields:
- **Donor Name** - Your name
- **Phone** - Contact number
- **City** - Which city
- **Landmark** - Easy location description
- **Food Name** - Type of food (required)
- **Quantity** - Amount of food (required)
- **Food Image** - Clear photo (required)
- **Food Video** - Short video (required)
- **Confirm Real** - I confirm this is real food (required)

### What's Displayed to NGO:
- ✅ Food name
- ✅ Quantity
- ✅ Photos
- ✅ Videos
- ✅ Your location
- ✅ Your phone
- ✅ AI analysis

---

## 🤝 NGO Portal Workflow

```
1. HOME PAGE
   ↓
2. SIGN UP / LOGIN
   Email: anything@gmail.com
   Password: your choice
   Name: Your NGO name
   ↓
3. NGO PORTAL
   
   a) VIEW DASHBOARD
      ├─ Active Requests (count)
      ├─ Completed Today (count)
      ├─ People Helped (count)
      ├─ Total Donations (count)
      ├─ Meals Served (count)
      └─ Food Waste Reduced (kg)
   
   b) BROWSE DONATIONS
      Filter by:
      ├─ All Requests
      ├─ Pending (waiting for response)
      ├─ Accepted (you accepted)
      └─ Completed (all done)
   
   c) FOR EACH DONATION - SEE:
      ├─ Donor Info
      │  ├─ Name
      │  ├─ Phone
      │  ├─ City
      │  └─ Landmark
      │
      ├─ Food Details ⭐ NEW
      │  ├─ Food Name
      │  ├─ Quantity
      │  ├─ Photos
      │  └─ Videos
      │
      ├─ AI Analysis
      │  ├─ Rating (e.g., 8.5/10)
      │  ├─ Quality (Good/Average)
      │  └─ Freshness (Fresh/Fair)
      │
      └─ Actions
         ├─ [ACCEPT] Accept this donation
         └─ [REJECT] Reject this donation

4. TRACK IMPACT
   └─ See all your statistics update
```

### Actions Available:
- **Accept** - You'll pick up this food
- **Complete** - You received and distributed it
- **Reject** - You can't take this donation

---

## 📊 Data Exchanged

### When Donor Uploads Food:
```json
{
  "donorName": "John",
  "phone": "9876543210",
  "city": "Chennai",
  "landmark": "Near Main St",
  "foodName": "Biryani",           ← KEY DATA
  "quantity": "5 kg",              ← KEY DATA
  "imageUrl": "uploaded-photo",
  "videoUrl": "uploaded-video",
  "analysis": {
    "rating": "8.5 / 10",
    "quality": "Good",
    "freshness": "Fresh"
  }
}
```

### What NGO Sees:
- ✅ **Food Name** - Exact type of food → Quick decision
- ✅ **Quantity** - How much → Planning pickup
- ✅ **Photos** - Visual verification
- ✅ **Videos** - Actual food being prepared
- ✅ **Analysis** - AI verified quality
- ✅ **Location** - Where to pickup
- ✅ **Phone** - Emergency contact

---

## 🎯 Key Differences This Time

### What's NEW in Food Details:

| Before | Now |
|--------|-----|
| ❌ No food type info | ✅ Food Name field |
| ❌ No quantity info | ✅ Quantity field |
| ✅ Photos available | ✅ Still available |
| ✅ Videos available | ✅ Still available |
| ✅ AI analysis | ✅ Still available |

**Result:** NGO knows EXACTLY what food to expect!

---

## 🔑 Test Credentials

### Create Your Own:
**Donor Account:**
- Email: `donor1@gmail.com`
- Password: `test123`
- Name: `Test Donor`

**NGO Account:**
- Email: `ngo1@gmail.com`
- Password: `test123`
- Name: `Test NGO`

### Then:
1. Login as Donor → Upload food
2. Login as NGO (different tab) → See donation
3. NGO accepts → Status updates in both portals

---

## ⚠️ Important Requirements

### For Donor Uploads:
- [ ] Email (Gmail preferred)
- [ ] Food Name (e.g., "Rice", "Chicken Biryani")
- [ ] Quantity (e.g., "5kg", "10 portions")
- [ ] Photo (clear image, at least 20 KB)
- [ ] Video (at least 200 KB)
- [ ] Location details (city & landmark)

### For NGO Access:
- [ ] Email (Gmail preferred)
- [ ] NGO name/organization
- [ ] Check all donation filters
- [ ] Review food details before accepting

---

## 🐛 Quick Fixes

| Problem | Solution |
|---------|----------|
| Can't upload | Check: image ≥ 20KB, video ≥ 200KB |
| Can't login | Check: role selected correctly |
| Not seeing donations | Refresh page, or select "All Requests" |
| Server down | Run `node server.js` in terminal |
| Can't see photos | Check browser console for errors |

---

## 📱 Browser URLs

```
Home: http://localhost:3000
Donor Portal: http://localhost:3000/donor-portal.html
NGO Portal: http://localhost:3000/ngo-portal.html
Login: http://localhost:3000/login.html
```

---

## ✅ Everything Connected

```
🏠 HOME PAGE
   ├─ Donor Option → Login (with role) → Donor Portal
   └─ NGO Option → Login (with role) → NGO Portal

💾 DATABASE
   └─ Stores: User accounts, donations, food details, media

📲 API ENDPOINTS
   └─ All data synced in real-time

🎯 RESULT
   └─ Complete two-portal food donation system!
```

---

## 🎉 You're All Set!

**Your Food Bridge system is:**
- ✅ Running on `http://localhost:3000`
- ✅ Ready for donors to upload food
- ✅ Ready for NGOs to receive requests
- ✅ Showing food name & quantity
- ✅ Storing photos & videos
- ✅ Analyzing quality automatically
- ✅ Completely operational!

🍽️ **Start sharing food and reduce waste!** 🤝

---

**Questions? Check:**
1. `PORTAL_GUIDE.md` - Detailed feature guide
2. `SYSTEM_SETUP.md` - Complete technical documentation
3. Terminal logs - Error messages and debugging

*Ready to go!* 🚀
