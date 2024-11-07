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

// Enhanced request size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Basic middleware
app.use(helmet());
app.use(morgan('combined'));

// CORS configuration with error handling
const corsOptions = {
  origin: process.env.CLIENT_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 600
};

app.use(cors(corsOptions));

// Enhanced debug middleware
app.use((req, res, next) => {
  console.log('📝 Request Details:', {
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path,
    body: req.body,
    query: req.query,
    headers: {
      'content-type': req.headers['content-type'],
      'content-length': req.headers['content-length'],
      authorization: req.headers.authorization ? '[[PRESENT]]' : '[[NONE]]'
    }
  });

  // Track response
  const oldSend = res.send;
  res.send = function(data) {
    console.log('📤 Response:', {
      statusCode: res.statusCode,
      body: typeof data === 'string' ? data.substring(0, 100) : '[Object]',
      timestamp: new Date().toISOString()
    });
    return oldSend.apply(res, arguments);
  };

  next();
});

// MongoDB Connection with enhanced error handling
const connectDB = async () => {
  try {
    const mongooseOptions = {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
      autoIndex: true, // Build indexes
      maxPoolSize: 10, // Maintain up to 10 socket connections
      retryWrites: true,
      writeConcern: {
        w: 'majority'
      }
    };

    await mongoose.connect(process.env.MONGODB_URI, mongooseOptions);
    console.log('✅ Connected to MongoDB Atlas');

    // Log database details (sanitized)
    const connection = mongoose.connection;
    console.log('📊 Database Info:', {
      name: connection.name,
      host: connection.host,
      port: connection.port,
      models: Object.keys(connection.models)
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    // Monitor for slow queries
    mongoose.set('debug', (collectionName, method, query, doc) => {
      console.log(`🔍 MongoDB Debug - ${collectionName}.${method}`, {
        query,
        doc: doc?.toString().substring(0, 100)
      });
    });

    mongoose.connection.on('disconnected', () => {
      console.log('🔌 MongoDB disconnected. Attempting to reconnect...');
      setTimeout(connectDB, 5000);
    });

  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error);
    
    if (error.name === 'MongooseServerSelectionError') {
      const sanitizedUri = process.env.MONGODB_URI?.replace(
        /:([^:@]{8})[^:@]*@/, 
        ':****@'
      );
      console.error('🔑 Connection Details:', {
        uri: sanitizedUri,
        error: {
          name: error.name,
          message: error.message,
          reason: error.reason?.type,
          servers: Array.from(error.reason?.servers?.entries() || [])
            .map(([host]) => host)
        }
      });
    }
    setTimeout(connectDB, 5000);
  }
};

connectDB();

// Routes with error catching
app.use('/api/users', async (req, res, next) => {
  try {
    await userRoutes(req, res, next);
  } catch (error) {
    next(error);
  }
});

app.use('/api/travels', async (req, res, next) => {
  try {
    await travelRoutes(req, res, next);
  } catch (error) {
    next(error);
  }
});

// Health check route
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    dbConnection: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// Enhanced error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error:', {
    name: err.name,
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method
  });

  // Handle specific errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      details: Object.values(err.errors).map(e => e.message)
    });
  }

  if (err.name === 'MongoServerError' && err.code === 11000) {
    return res.status(409).json({
      error: 'Duplicate Entry',
      details: err.keyValue
    });
  }

  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start server
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// Graceful Shutdown
process.on('SIGINT', async () => {
  console.log('⏳ Shutting down gracefully...');
  await mongoose.connection.close();
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

module.exports = app;