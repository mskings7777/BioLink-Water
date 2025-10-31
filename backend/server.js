const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const connectDB = require('./config/database');
const authRoutes = require('./routes/auth');
const sensorRoutes = require('./routes/sensor');
const userRoutes = require('./routes/user');

const app = express();

app.use(cors({
  origin: 'http://localhost:5174',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(cookieParser());

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/sensor', sensorRoutes);
app.use('/api/user', userRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'BioLink-Water API is running', timestamp: new Date() });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🌊 BioLink-Water Server running on port ${PORT}`);
});
