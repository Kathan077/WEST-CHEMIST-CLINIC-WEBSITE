const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

// Load Route Handlers
const patientRoutes = require('./routes/patientRoutes');
const verificationRoutes = require('./routes/verificationRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const contentRoutes = require('./routes/contentRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const blogRoutes = require('./routes/blogRoutes');
const aboutRoutes = require('./routes/aboutRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');
const homepageRoutes = require('./routes/homepageRoutes');

// Initialize Express App
const app = express();

// Completely disable HTTP 304 Not Modified caching
app.disable('etag');
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  next();
});

// HTTP Request Logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// CORS Middleware Configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3001',
  'https://west-chemist-clinic-website.vercel.app'
];

if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, or postman)
    if (!origin) return callback(null, true);
    if (
      process.env.NODE_ENV === 'development' ||
      origin.startsWith('http://localhost:') ||
      origin.startsWith('http://127.0.0.1:') ||
      allowedOrigins.indexOf(origin) !== -1 || 
      origin.endsWith('.vercel.app')
    ) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Uploaded Files Statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date(),
    service: 'West Chemist Clinic Backend API'
  });
});

// Root Endpoint (Handles pings/health checks from Render load balancer)
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'West Chemist Clinic Backend API is running'
  });
});

// API Routes mounting
app.use('/api/patients', patientRoutes);
app.use('/api/verifications', verificationRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/contents', contentRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/homepage', homepageRoutes);

// Fallback 404 handler for unmatched routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.originalUrl} not found on this server`
  });
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(`💥 Internal Error: ${err.message}`);
  
  // Custom handling for Multer file upload errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'File upload failed. Document size exceeds the 10MB limit.'
    });
  }

  // General server error
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

module.exports = app;
