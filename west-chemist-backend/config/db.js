const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // Modern Mongoose options (Mongoose 6+ has these enabled by default, but good to ensure stability)
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Seed default administrator if DB is empty
    // const { seedDefaultAdmin } = require('../controllers/adminController');
    // await seedDefaultAdmin();

    // Seed default services and page content if DB is empty
    // const seedServicesAndPages = require('./seedData');
    // await seedServicesAndPages();
  } catch (error) {
    console.error(`❌ Database connection error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
