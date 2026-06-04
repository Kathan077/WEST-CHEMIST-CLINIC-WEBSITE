// Load environment variables first
require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/db');

// Handle uncaught exceptions globally
process.on('uncaughtException', (err) => {
  console.error(`🔴 UNCAUGHT EXCEPTION: ${err.message}`);
  console.error(err.stack);
  console.log('Shutting down server due to uncaught exception...');
  process.exit(1);
});

// Establish database connection
connectDB();

// Define Server Port
const PORT = process.env.PORT || 5000;

// Start Server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server successfully launched in [${process.env.NODE_ENV || 'development'}] mode on port: ${PORT}`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
});

// Handle unhandled promise rejections globally
process.on('unhandledRejection', (err) => {
  console.error(`🔴 UNHANDLED REJECTION: ${err.message}`);
  console.error(err.stack);
  console.log('Shutting down server gracefully due to unhandled promise rejection...');
  server.close(() => {
    process.exit(1);
  });
});

// Nodemon reload trigger comment

