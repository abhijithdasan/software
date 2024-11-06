const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const userRoutes = require('./routes/userRoutes');
const travelRoutes = require('./routes/travelRoutes');

// Load environment variables before using them
dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(morgan('combined'));
app.use(express.json());

// CORS configuration
const corsOptions = {
  origin: process.env.CLIENT_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 600
};

app.use(cors(corsOptions));

// Debug middleware
app.use((req, res, next) => {
  console.log('Incoming request:', {
    method: req.method,
    path: req.path,
    body: req.body,
    headers: req.headers
  });
  next();
});

// MongoDB Connection
const connectDB = async () => {
  try {
    const mongooseOptions = {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4, // Force IPv4
    };

    await mongoose.connect(process.env.MONGODB_URI, mongooseOptions);
    console.log('Connected to MongoDB Atlas');

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected. Attempting to reconnect...');
      setTimeout(connectDB, 5000);
    });

  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    // Log specific error details for debugging
    if (error.name === 'MongooseServerSelectionError') {
      console.error('Connection URI:', process.env.MONGODB_URI?.replace(/:([^:@]{8})[^:@]*@/, ':****@'));
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        reason: error.reason?.type,
        servers: Array.from(error.reason?.servers?.entries() || [])
          .map(([host]) => host)
      });
    }
    // Retry connection after delay
    setTimeout(connectDB, 5000);
  }
};

connectDB();

// Routes
app.use('/api/users', userRoutes);
app.use('/api/travels', travelRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start the server
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Graceful Shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await mongoose.connection.close();
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
