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

// High-Performance Middleware: Gzip/Brotli compression
const compression = require('compression');
app.use(compression());

// Smart Cache-Control Middleware (Fast loading for public GET APIs, no-store for private/admin APIs)
app.use((req, res, next) => {
  if (req.method === 'GET') {
    const isPublicGet = 
      req.path.startsWith('/api/services') ||
      req.path.startsWith('/api/blogs') ||
      req.path.startsWith('/api/homepage') ||
      req.path.startsWith('/api/categories') ||
      req.path.startsWith('/api/about') ||
      req.path.startsWith('/uploads') ||
      req.path === '/' ||
      req.path === '/health';

    if (isPublicGet) {
      res.set('Cache-Control', 'public, max-age=60, s-maxage=300, stale-while-revalidate=600');
      return next();
    }
  }

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
  'https://west-chemist-clinic-website.vercel.app',
  'https://west-chemist-clinic-website-hekp.vercel.app'
];

if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL.replace(/\/$/, ''));
}
if (process.env.ADMIN_URL) {
  allowedOrigins.push(process.env.ADMIN_URL.replace(/\/$/, ''));
}

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, or postman)
    if (!origin) return callback(null, true);
    
    // Trim trailing slash from origin for consistent matching
    const sanitizedOrigin = origin.replace(/\/$/, '');
    
    if (
      process.env.NODE_ENV === 'development' ||
      sanitizedOrigin.startsWith('http://localhost:') ||
      sanitizedOrigin.startsWith('http://127.0.0.1:') ||
      allowedOrigins.indexOf(sanitizedOrigin) !== -1 || 
      sanitizedOrigin.endsWith('.vercel.app')
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
