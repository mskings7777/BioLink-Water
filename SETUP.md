# 🚀 BioLink-Water Setup Guide

## Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account (already configured)
- Firebase account (for Arduino sensor data)

## Installation Steps

### 1. Install Backend Dependencies

```bash
npm install
```

### 2. Install Frontend Dependencies

```bash
cd frontend
npm install
cd ..
```

Or use the shortcut:

```bash
npm run install-all
```

### 3. Configure Environment Variables

The `.env` file is already created with MongoDB credentials. Update the Firebase URL:

```env
MONGODB_URI=mongodb+srv://mskings7777_db_user:sTA7g6H8TyrLwE5A@cluster0.5xhc8gz.mongodb.net/?appName=Cluster0
DB_NAME=biolink_water
JWT_SECRET=biolink-water-jwt-secret-key-2025
PORT=5000
FIREBASE_DB_URL=https://your-firebase-project.firebaseio.com
```

**Important:** Replace `your-firebase-project` with your actual Firebase project ID.

### 4. Set Up Firebase (for Arduino Data)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing one
3. Enable Realtime Database
4. Get your database URL (format: `https://PROJECT-ID-default-rtdb.firebaseio.com`)
5. Update `FIREBASE_DB_URL` in `.env`

Your Arduino sensors should send data to Firebase in this format:

```json
{
  "data": {
    "pH": 7.2,
    "TDS": 280,
    "temp": 24,
    "timestamp": "2025-10-28T10:30:00.000Z"
  }
}
```

### 5. Run the Application

**Development mode (both frontend and backend):**

```bash
npm run dev
```

**Backend only:**

```bash
npm run server
```

**Frontend only:**

```bash
npm run client
```

### 6. Access the Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **API Health Check:** http://localhost:5000/api/health

## Project Structure

```
BioLink/
├── backend/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── middleware/
│   │   └── auth.js               # JWT authentication
│   ├── routes/
│   │   ├── auth.js               # Login/Signup endpoints
│   │   ├── sensor.js             # Sensor data endpoints
│   │   └── user.js               # User management
│   └── server.js                 # Express server
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Auth state management
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Dashboard.jsx     # Live sensor data
│   │   │   ├── WaterAtlas.jsx    # India rivers map
│   │   │   ├── Analytics.jsx     # AI insights
│   │   │   ├── About.jsx
│   │   │   ├── Contact.jsx
│   │   │   └── AdminPanel.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
├── .env                          # Environment variables
├── .gitignore
├── package.json
└── README.md
```

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user (protected)

### Sensor Data

- `GET /api/sensor/current` - Get current sensor readings
- `GET /api/sensor/history?hours=24` - Get historical data (protected)
- `GET /api/sensor/analytics` - Get AI insights (protected)

### User Management

- `GET /api/user/profile` - Get user profile (protected)
- `GET /api/user/all` - Get all users (admin only)

## Features

✅ **Authentication:** MongoDB-based signup/login with JWT  
✅ **Real-time Dashboard:** Live pH, TDS, Temperature from Firebase  
✅ **Water Vitality Index:** Auto-calculated quality score  
✅ **Water Atlas:** Interactive India rivers map  
✅ **AI Analytics:** Trend analysis and insights  
✅ **Admin Panel:** User management and data export  
✅ **Responsive Design:** Mobile-first Tailwind CSS  

## Creating Admin User

By default, new users have `role: 'user'`. To create an admin:

1. Sign up normally through the app
2. Connect to MongoDB and update the user:

```javascript
db.users.updateOne(
  { email: "admin@biolink.com" },
  { $set: { role: "admin" } }
)
```

## Troubleshooting

### MongoDB Connection Issues

- Check your IP is whitelisted in MongoDB Atlas
- Verify the connection string in `.env`

### Firebase Data Not Loading

- Ensure Firebase Realtime Database is enabled
- Check Firebase database URL format
- Verify Arduino is sending data to correct path: `/data`

### CORS Errors

- Backend CORS is configured for `http://localhost:5173`
- If using different port, update in `backend/server.js`

## Production Deployment

### Backend (Render/Railway/Heroku)

1. Set environment variables
2. Deploy backend
3. Update frontend API URLs

### Frontend (Vercel/Netlify)

1. Build: `npm run build`
2. Deploy `frontend/dist` folder
3. Update API base URL in `AuthContext.jsx`

## Support

For issues or questions, contact the BioLink team or open an issue on GitHub.
