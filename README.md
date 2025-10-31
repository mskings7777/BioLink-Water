# 🌊 BioLink-Water — AI-Powered Smart Water Monitoring System

Monitor water quality in India using IoT sensors, AI analytics, and real-time data visualization.

## 🚀 Tech Stack

**Frontend:**
- React.js + Vite
- Chart.js for data visualization
- Leaflet for maps
- Tailwind CSS for styling

**Backend:**
- Express.js + Node.js
- MongoDB (user authentication & data)
- Firebase Realtime DB (Arduino sensor data)

**IoT:**
- Arduino sensors → Firebase
- Real-time pH, TDS, Temperature monitoring

## 📦 Installation

```bash
# Install all dependencies
npm run install-all

# Or install separately
npm run install-backend
npm run install-frontend
```

## 🏃 Running the Project

```bash
# Run both frontend and backend
npm run dev

# Backend only (Port 5000)
npm run server

# Frontend only (Port 5173)
npm run client
```

## 🌐 Environment Setup

Create `.env` file in root:
```
MONGODB_URI=your-mongodb-uri
DB_NAME=biolink_water
JWT_SECRET=your-secret-key
PORT=5000
FIREBASE_DB_URL=your-firebase-db-url
```

## 📊 Features

- ✅ User Authentication (MongoDB)
- ✅ Real-time Dashboard (Firebase)
- ✅ Water Vitality Index Calculator
- ✅ India Water Atlas with Interactive Map
- ✅ AI-Driven Analytics & Insights
- ✅ Admin Panel
- ✅ Mobile-Responsive Design

## 🎯 Pages

1. **Home** - Hero + Features
2. **Dashboard** - Live sensor data
3. **Water Atlas** - India rivers map
4. **Analytics** - Trends & AI insights
5. **About** - Team & impact
6. **Contact** - Partnership form
7. **Admin** - Node management

## 👥 Team

BioLink Team - AI, IoT, Web Development

## 📄 License

MIT
