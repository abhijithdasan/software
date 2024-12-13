const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const userRoutes = require('./routes/userRoutes');
const travelRoutes = require('./routes/travelRoutes');

// Load environment variables
dotenv.config();

const app = express();

// Middleware configuration
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(helmet());
app.use(morgan('combined'));

// CORS setup
const corsOptions = {
  origin: process.env.CLIENT_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 600
};
app.use(cors(corsOptions));

// Connect to MongoDB
const connectDB = async () => {
  try {
    const mongooseOptions = {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
      autoIndex: true,
      maxPoolSize: 10,
      retryWrites: true,
      writeConcern: {
        w: 'majority'
      }
    };
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    setTimeout(connectDB, 5000); // Retry after 5 seconds
  }
};
connectDB();

// Routes
app.use('/api/users', userRoutes);
app.use('/api/travels', travelRoutes);

// Test Route
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    dbConnection: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on https://care-sixten.onrender.com/`);
});
