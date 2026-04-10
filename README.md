# Food Bridge

This project is a working full-stack food donation portal with two roles:

- **Donor portal**: sign up/login with Gmail, upload a food image and video, validate the content, and send donation requests to nearby NGOs.
- **NGO portal**: sign up/login with Gmail, view incoming donation requests, and confirm receipt for distribution.

## Features

- Gmail/password authentication
- SQLite database storage for users and requests
- File upload support for images and videos
- Browser-side validation for photos and video clips
- AI-style food analysis for rating, quality, freshness, quantity, and poison risk
- Nearby NGO matching within 5 km of donor location
- Separate donor and NGO dashboards

## Setup

1. Open a terminal in this folder.
2. Run:

```bash
npm install
npm start
```

3. Open your browser to:

```text
http://localhost:3000
```

## Usage

- Use the **Sign Up** tab to create a donor or NGO account with a Gmail address.
- Donors can upload one image and one short video, confirm the image is real, and submit.
- NGOs can view requests and mark them as received.

## Notes

- Database file is stored at `data/database.sqlite`.
- Uploaded media is saved in `uploads/images` and `uploads/videos`.
- The browser attempts to validate a real person using the Face Detector API when available.
- This is a demo app; production systems should use hardened AI verification and secure database hosting.
